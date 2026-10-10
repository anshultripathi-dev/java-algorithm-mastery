import { beforeEach, describe, expect, it, vi } from 'vitest';

// The store reads localStorage at import time: provide an in-memory one before importing it.
const mem = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => void mem.set(k, v),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => mem.clear(),
});

vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
vi.stubGlobal('document', { documentElement: { classList: { toggle() {} } } });

const { actions, getProgress } = await import('../src/lib/store');
const { mastery, completion, weakLessons, dueRevisions, recommendedNext, streak, unmetPrerequisites, exerciseTotals, overallMastery } = await import('../src/lib/progress');
const { buildPlan } = await import('../src/lib/plan');
const { LESSONS, LESSON_BY_ID } = await import('../src/data/lessons');

const DAY = 86_400_000;
const L = LESSONS.find((l) => l.id === 'm4-searching')!;

beforeEach(() => {
  actions.resetProgress();
});

describe('mastery comes from actual performance', () => {
  it('is 0 when nothing has been attempted, even if marked complete', () => {
    actions.setComplete(L.id, true);
    expect(mastery(L, getProgress())).toBe(0);
  });
  it('weights quiz 50%, exercises 35%, completion 15%', () => {
    actions.setComplete(L.id, true);
    actions.recordQuiz(L.id, L.quiz.length, L.quiz.length); // 100%
    expect(mastery(L, getProgress())).toBe(65); // 50 + 0 + 15
    for (const e of L.practice) actions.recordAttempt(e.id, true);
    expect(mastery(L, getProgress())).toBe(100);
  });
  it('keeps the best quiz score but the weak list uses the latest', () => {
    actions.recordQuiz(L.id, 4, 4);
    actions.recordQuiz(L.id, 1, 4);
    const p = getProgress();
    expect(p.lessons[L.id].quiz!.best).toBe(1);
    expect(p.lessons[L.id].quiz!.last).toBe(0.25);
    expect(weakLessons(LESSONS, p).map((l) => l.id)).toContain(L.id);
  });
  it('an exercise with 2+ failed attempts makes a lesson weak; solving it clears the flag', () => {
    const e = L.practice[0];
    actions.recordAttempt(e.id, false);
    actions.recordAttempt(e.id, false);
    expect(weakLessons(LESSONS, getProgress()).map((l) => l.id)).toContain(L.id);
    actions.recordAttempt(e.id, true);
    expect(weakLessons(LESSONS, getProgress()).map((l) => l.id)).not.toContain(L.id);
  });
  it('overall mastery only averages lessons you have actually been assessed on', () => {
    expect(overallMastery(LESSONS, getProgress())).toBe(0);
    actions.recordQuiz(L.id, L.quiz.length, L.quiz.length);
    expect(overallMastery(LESSONS, getProgress())).toBeGreaterThan(0);
  });
});

describe('completion, recommendations and prerequisites', () => {
  it('counts completed lessons', () => {
    actions.setComplete('m0-how-java-works', true);
    expect(completion(LESSONS, getProgress())).toMatchObject({ done: 1, total: LESSONS.length });
    actions.setComplete('m0-how-java-works', false);
    expect(completion(LESSONS, getProgress()).done).toBe(0);
  });
  it('recommends the first lesson with all prerequisites met, on both paths', () => {
    const p0 = getProgress();
    expect(recommendedNext(LESSONS, p0, 'complete')!.id).toBe(LESSONS[0].id);
    const quick = recommendedNext(LESSONS, p0, 'quick')!;
    expect(quick.essential).toBe(true);
    expect(quick.prerequisites).toEqual([]);
  });
  it('lists unmet prerequisites and shrinks the list as they are completed', () => {
    const target = LESSON_BY_ID['m4-merge-sort'];
    const before = unmetPrerequisites(target, LESSON_BY_ID, getProgress()).map((l) => l.id);
    expect(before.length).toBe(target.prerequisites.length);
    actions.setComplete(target.prerequisites[0], true);
    expect(unmetPrerequisites(target, LESSON_BY_ID, getProgress()).length).toBe(before.length - 1);
  });
  it('never recommends a lesson whose prerequisites are incomplete while an earlier ready one exists', () => {
    const next = recommendedNext(LESSONS, getProgress(), 'complete')!;
    expect(unmetPrerequisites(next, LESSON_BY_ID, getProgress())).toEqual([]);
  });
});

describe('spaced revision', () => {
  it('completing a lesson schedules a review for tomorrow', () => {
    actions.setComplete(L.id, true);
    const r = getProgress().revision[L.id];
    expect(r.interval).toBe(1);
    expect(dueRevisions(LESSONS, getProgress(), Date.now() + 2 * DAY).map((l) => l.id)).toContain(L.id);
    expect(dueRevisions(LESSONS, getProgress(), Date.now()).map((l) => l.id)).not.toContain(L.id);
  });
  it('good reviews lengthen the interval (1,3,7,14,30,60); a miss resets it', () => {
    actions.setComplete(L.id, true);
    const seen: number[] = [];
    for (let i = 0; i < 6; i++) {
      actions.markReviewed(L.id, true);
      seen.push(getProgress().revision[L.id].interval);
    }
    expect(seen).toEqual([3, 7, 14, 30, 60, 60]);
    actions.markReviewed(L.id, false);
    expect(getProgress().revision[L.id].interval).toBe(1);
  });
  it('a weak quiz score pulls the review back to tomorrow', () => {
    actions.setComplete(L.id, true);
    actions.recordQuiz(L.id, 4, 4);
    actions.recordQuiz(L.id, 4, 4);
    expect(getProgress().revision[L.id].interval).toBeGreaterThan(1);
    actions.recordQuiz(L.id, 1, 4);
    expect(getProgress().revision[L.id].interval).toBe(1);
  });
});

describe('flashcards (Leitner boxes)', () => {
  it('moves up on correct answers and back to box 0 on a miss', () => {
    actions.recordFlashcard('c-1', true);
    actions.recordFlashcard('c-1', true);
    expect(getProgress().flashcards['c-1'].box).toBe(2);
    actions.recordFlashcard('c-1', false);
    expect(getProgress().flashcards['c-1']).toMatchObject({ box: 0, seen: 3, right: 2 });
  });
});

describe('streak and activity', () => {
  it('counts consecutive active days ending today or yesterday', () => {
    const p = getProgress();
    const d = (n: number) => new Date(Date.UTC(2026, 9, 10) - n * DAY).toISOString().slice(0, 10);
    const state = { ...p, activity: { [d(0)]: 3, [d(1)]: 1, [d(2)]: 2, [d(4)]: 5 } };
    expect(streak(state, new Date(Date.UTC(2026, 9, 10, 12)))).toBe(3);
    const yesterdayOnly = { ...p, activity: { [d(1)]: 1, [d(2)]: 1 } };
    expect(streak(yesterdayOnly, new Date(Date.UTC(2026, 9, 10, 12)))).toBe(2);
    expect(streak({ ...p, activity: { [d(3)]: 1 } }, new Date(Date.UTC(2026, 9, 10, 12)))).toBe(0);
  });
});

describe('export / import', () => {
  it('round-trips progress and rejects foreign files', () => {
    actions.recordQuiz(L.id, 3, 4);
    actions.recordAttempt(L.practice[0].id, true);
    const json = actions.exportJSON();
    actions.resetProgress();
    expect(getProgress().lessons[L.id]).toBeUndefined();
    const res = actions.importJSON(json);
    expect(res.message).toBe('Progress imported.');
    expect(res.ok).toBe(true);
    expect(getProgress().lessons[L.id].quiz!.best).toBe(0.75);
    expect(exerciseTotals(LESSONS, getProgress()).solved).toBe(1);
    expect(actions.importJSON('{"hello":1}').ok).toBe(false);
    expect(actions.importJSON('not json').ok).toBe(false);
  });
  it('persists to localStorage', () => {
    actions.recordQuiz(L.id, 2, 4);
    expect(JSON.parse(mem.get('jfam:progress')!).lessons[L.id].quiz.best).toBe(0.5);
  });
});

describe('study plan', () => {
  for (const days of [7, 14, 21, 30] as const) {
    for (const path of ['quick', 'complete'] as const) {
      it(`${days}-day ${path} plan: every lesson once, prerequisites never later, final assessment last`, () => {
        const plan = buildPlan(LESSONS, path, days);
        expect(plan.length).toBe(days);
        expect(plan[plan.length - 1].tasks.some((t) => t.kind === 'assess')).toBe(true);
        const pool = path === 'quick' ? LESSONS.filter((l) => l.essential) : LESSONS;
        const dayOf = new Map<string, number>();
        for (const d of plan) for (const t of d.tasks) if (t.kind === 'learn' && t.lessonId) {
          expect(dayOf.has(t.lessonId), `${t.lessonId} scheduled twice`).toBe(false);
          dayOf.set(t.lessonId, d.day);
        }
        expect([...dayOf.keys()].sort()).toEqual(pool.map((l) => l.id).sort());
        for (const l of pool) for (const pre of l.prerequisites) if (dayOf.has(pre)) expect(dayOf.get(pre)!, `${pre} before ${l.id}`).toBeLessThanOrEqual(dayOf.get(l.id)!);
      });
    }
  }
  it('the minimum-viable path is shorter than the complete path', () => {
    const q = buildPlan(LESSONS, 'quick', 14).reduce((s, d) => s + d.minutes, 0);
    const c = buildPlan(LESSONS, 'complete', 14).reduce((s, d) => s + d.minutes, 0);
    expect(q).toBeLessThan(c);
  });
  it('is spread out: no day carries more than twice the average', () => {
    const plan = buildPlan(LESSONS, 'complete', 14).slice(0, -1);
    const avg = plan.reduce((s, d) => s + d.minutes, 0) / plan.length;
    for (const d of plan) expect(d.minutes).toBeLessThan(avg * 2);
  });
});
