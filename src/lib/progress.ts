// Pure functions that derive dashboard data from lessons + saved progress. Unit-tested in tests/.
import type { Lesson } from './types';
import type { ProgressState } from './store';

export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

export function lessonStatus(p: ProgressState, id: string): LessonStatus {
  const l = p.lessons[id];
  if (l?.completedAt) return 'completed';
  if (l && (l.visits > 0 || l.quiz)) return 'in-progress';
  return 'not-started';
}

export function completion(lessons: Lesson[], p: ProgressState) {
  const done = lessons.filter((l) => p.lessons[l.id]?.completedAt).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

/**
 * Mastery 0..100 from ACTUAL performance:
 *  50% best quiz score, 35% fraction of practice exercises solved, 15% lesson completed.
 *  A lesson with no quiz attempt and no solved exercise has mastery 0 regardless of "completed".
 */
export function mastery(lesson: Lesson, p: ProgressState): number {
  const lp = p.lessons[lesson.id];
  const quiz = lp?.quiz ? lp.quiz.best : 0;
  const ex = lesson.practice.length ? lesson.practice.filter((e) => p.exercises[e.id]?.solved).length / lesson.practice.length : 0;
  const done = lp?.completedAt ? 1 : 0;
  if (!lp?.quiz && ex === 0) return 0;
  const hasQuiz = lesson.quiz.length > 0;
  const hasEx = lesson.practice.length > 0;
  const wq = hasQuiz ? 0.5 : 0;
  const we = hasEx ? 0.35 : 0;
  const wd = 0.15;
  const total = wq + we + wd;
  return Math.round(((wq * quiz + we * ex + wd * done) / total) * 100);
}

export function overallMastery(lessons: Lesson[], p: ProgressState): number {
  const touched = lessons.filter((l) => p.lessons[l.id]?.quiz || l.practice.some((e) => p.exercises[e.id]?.solved));
  if (!touched.length) return 0;
  return Math.round(touched.reduce((s, l) => s + mastery(l, p), 0) / touched.length);
}

/** Lessons where actual results suggest more work: low quiz score, or several unsolved exercise attempts. */
export function weakLessons(lessons: Lesson[], p: ProgressState): Lesson[] {
  return lessons
    .filter((l) => {
      const q = p.lessons[l.id]?.quiz;
      if (q && q.last < 0.7) return true;
      return l.practice.some((e) => {
        const ep = p.exercises[e.id];
        return ep && !ep.solved && ep.attempts >= 2;
      });
    })
    .sort((a, b) => mastery(a, p) - mastery(b, p));
}

export function dueRevisions(lessons: Lesson[], p: ProgressState, now = Date.now()): Lesson[] {
  return lessons.filter((l) => p.revision[l.id] && p.revision[l.id].due <= now).sort((a, b) => p.revision[a.id].due - p.revision[b.id].due);
}

/** First lesson (in curriculum order) that is not completed and whose prerequisites are all completed. */
export function recommendedNext(lessons: Lesson[], p: ProgressState, path: 'quick' | 'complete'): Lesson | undefined {
  const pool = path === 'quick' ? lessons.filter((l) => l.essential) : lessons;
  const doneIds = new Set(lessons.filter((l) => p.lessons[l.id]?.completedAt).map((l) => l.id));
  return (
    pool.find((l) => !doneIds.has(l.id) && l.prerequisites.every((r) => doneIds.has(r) || !lessons.some((x) => x.id === r))) ??
    pool.find((l) => !doneIds.has(l.id))
  );
}

export function continueLesson(lessons: Lesson[], p: ProgressState): Lesson | undefined {
  const visited = lessons.filter((l) => p.lessons[l.id]?.lastVisited && !p.lessons[l.id]?.completedAt);
  visited.sort((a, b) => (p.lessons[b.id].lastVisited ?? 0) - (p.lessons[a.id].lastVisited ?? 0));
  return visited[0];
}

export function unmetPrerequisites(lesson: Lesson, all: Record<string, Lesson>, p: ProgressState): Lesson[] {
  return lesson.prerequisites.map((id) => all[id]).filter((l): l is Lesson => !!l && !p.lessons[l.id]?.completedAt);
}

/** Consecutive days (ending today or yesterday) with at least one recorded action. */
export function streak(p: ProgressState, now = new Date()): number {
  const day = (d: Date) => d.toISOString().slice(0, 10);
  let d = new Date(now);
  if (!p.activity[day(d)]) d = new Date(d.getTime() - 86_400_000);
  let n = 0;
  while (p.activity[day(d)]) {
    n++;
    d = new Date(d.getTime() - 86_400_000);
  }
  return n;
}

export function exerciseTotals(lessons: Lesson[], p: ProgressState) {
  let total = 0;
  let solved = 0;
  for (const l of lessons)
    for (const e of l.practice) {
      total++;
      if (p.exercises[e.id]?.solved) solved++;
    }
  return { total, solved };
}
