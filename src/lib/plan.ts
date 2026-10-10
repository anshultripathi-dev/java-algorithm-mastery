import type { Lesson } from './types';

export interface PlanTask {
  kind: 'learn' | 'practice' | 'revise' | 'assess' | 'review';
  lessonId?: string;
  title: string;
  minutes: number;
}
export interface PlanDay {
  day: number;
  tasks: PlanTask[];
  minutes: number;
}

/**
 * Build a focused study schedule.
 *  - `quick`  = lessons marked essential (minimum viable path)
 *  - `complete` = every lesson
 * Lessons are kept in curriculum (prerequisite) order and packed into `days` buckets of roughly equal time.
 * Day N also revises what was learned on day N−1 (and N−3), and the final day is the mixed assessment
 * plus weak-topic review. It is a FOCUSED REVISION SCHEDULE, not a promise that everything is mastered.
 */
export function buildPlan(lessons: Lesson[], path: 'quick' | 'complete', days: number): PlanDay[] {
  const pool = path === 'quick' ? lessons.filter((l) => l.essential) : lessons;
  const learnDays = Math.max(1, days - 1);
  const lessonMinutes = (l: Lesson) => l.minutes + Math.min(30, l.practice.length * 8); // reading + practice
  const total = pool.reduce((s, l) => s + lessonMinutes(l), 0);
  const target = total / learnDays;

  const buckets: Lesson[][] = Array.from({ length: learnDays }, () => []);
  let acc = 0;
  let b = 0;
  for (const l of pool) {
    const m = lessonMinutes(l);
    if (b < learnDays - 1 && acc + m / 2 > target * (b + 1)) b++;
    buckets[b].push(l);
    acc += m;
  }

  const plan: PlanDay[] = buckets.map((ls, i) => {
    const tasks: PlanTask[] = [];
    if (i >= 1 && buckets[i - 1].length) {
      tasks.push({ kind: 'revise', title: `Revise yesterday: ${buckets[i - 1].map((x) => x.title).slice(0, 3).join(', ')}${buckets[i - 1].length > 3 ? '…' : ''}`, minutes: 10 });
    }
    if (i >= 3 && buckets[i - 3].length) {
      tasks.push({ kind: 'revise', title: `Spaced review (3 days ago): ${buckets[i - 3].map((x) => x.title).slice(0, 2).join(', ')}`, minutes: 8 });
    }
    for (const l of ls) {
      tasks.push({ kind: 'learn', lessonId: l.id, title: l.title, minutes: l.minutes });
      if (l.practice.length) tasks.push({ kind: 'practice', lessonId: l.id, title: `Practice: ${l.title}`, minutes: Math.min(30, l.practice.length * 8) });
    }
    return { day: i + 1, tasks, minutes: tasks.reduce((s, t) => s + t.minutes, 0) };
  });
  const last: PlanTask[] = [
    { kind: 'review', title: 'Weak-topic review (from your quiz and practice results)', minutes: 30 },
    { kind: 'assess', title: 'Final mixed assessment (archive topics)', minutes: 45 },
  ];
  plan.push({ day: plan.length + 1, tasks: last, minutes: 75 });
  return plan;
}
