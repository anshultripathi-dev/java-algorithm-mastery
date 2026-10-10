import { describe, expect, it } from 'vitest';
import { LESSONS, LESSON_BY_ID } from '../src/data/lessons';
import { MODULES } from '../src/data/curriculum/modules';
import { LAB_BY_ID } from '../src/features/dry-run-lab/registry';
import { hasJavaSource, getJavaSource } from '../src/lib/java-sources';
import { resolveAnchor } from '../src/lib/highlight';
import { EXTRA_PROBLEMS } from '../src/data/problems';
import { allFlashcards } from '../src/data/revision/flashcards';
import { CHEATSHEETS } from '../src/data/revision/cheatsheets';
import { ARCHIVE_DECKS } from '../src/data/curriculum/archive-decks';
import { VIDEOS } from '../src/data/video-resources/videos';

const moduleIds = new Set(MODULES.map((m) => m.id));

describe('curriculum structure', () => {
  it('has unique lesson ids and valid modules', () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of LESSONS) expect(moduleIds.has(l.module), `${l.id}: module ${l.module}`).toBe(true);
  });

  it('every module has lessons', () => {
    for (const m of MODULES) expect(LESSONS.filter((l) => l.module === m.id).length, m.id).toBeGreaterThan(0);
  });

  it('lessons are listed in module order', () => {
    const order = MODULES.map((m) => m.id);
    let last = -1;
    for (const l of LESSONS) {
      const i = order.indexOf(l.module);
      expect(i, `${l.id} out of module order`).toBeGreaterThanOrEqual(last);
      last = i;
    }
  });

  it('every prerequisite exists and the prerequisite graph is acyclic', () => {
    for (const l of LESSONS) for (const p of l.prerequisites) expect(LESSON_BY_ID[p], `${l.id} needs unknown ${p}`).toBeDefined();
    const state = new Map<string, number>();
    const visit = (id: string, path: string[]) => {
      if (state.get(id) === 2) return;
      expect(state.get(id), `cycle: ${[...path, id].join(' → ')}`).not.toBe(1);
      state.set(id, 1);
      for (const p of LESSON_BY_ID[id].prerequisites) visit(p, [...path, id]);
      state.set(id, 2);
    };
    LESSONS.forEach((l) => visit(l.id, []));
  });

  it('every lesson is listed after all of its prerequisites', () => {
    const pos = new Map(LESSONS.map((l, i) => [l.id, i]));
    for (const l of LESSONS) for (const p of l.prerequisites) expect(pos.get(p)!, `${p} must precede ${l.id}`).toBeLessThan(pos.get(l.id)!);
  });

  it('no lesson requires a lesson from a LATER module', () => {
    const order = MODULES.map((m) => m.id);
    for (const l of LESSONS)
      for (const p of l.prerequisites)
        expect(order.indexOf(LESSON_BY_ID[p].module), `${l.id} → ${p}`).toBeLessThanOrEqual(order.indexOf(l.module));
  });
});

describe('every lesson follows the lesson format', () => {
  for (const l of LESSONS) {
    it(`${l.id}`, () => {
      expect(l.objectives.length, 'objectives').toBeGreaterThanOrEqual(2);
      expect(l.intuition.length, 'intuition').toBeGreaterThan(0);
      expect(l.syntax?.length, 'syntax section').toBeGreaterThan(0);
      expect(l.dryRun, 'dry run').toBeDefined();
      expect(l.tiny.length, 'tiny example').toBeGreaterThan(0);
      expect(l.guided.length, 'guided example').toBeGreaterThan(0);
      expect(l.programs.length, 'programs').toBeGreaterThan(0);
      expect(l.complexity.length, 'complexity').toBeGreaterThan(0);
      expect(l.mistakes.length, 'mistakes').toBeGreaterThanOrEqual(2);
      expect(l.practice.length, 'practice').toBeGreaterThanOrEqual(l.module === 'm0' ? 1 : 2);
      expect(l.quiz.length, 'quiz').toBeGreaterThanOrEqual(3);
      expect(l.videos.length, 'videos').toBeGreaterThanOrEqual(1);
      expect(l.revision.length, 'revision').toBeGreaterThanOrEqual(2);
      expect(l.minutes).toBeGreaterThan(0);
    });
  }
});

describe('code references resolve to real, verified Java files', () => {
  it('program files exist and walkthrough anchors resolve', () => {
    const problems: string[] = [];
    for (const l of LESSONS)
      for (const p of l.programs) {
        if (!hasJavaSource(p.file)) {
          problems.push(`${l.id}: missing ${p.file}`);
          continue;
        }
        const src = getJavaSource(p.file);
        for (const w of p.walkthrough) if (!resolveAnchor(src, w.at)) problems.push(`${l.id} ${p.file}: anchor ${JSON.stringify(w.at)}`);
      }
    expect(problems).toEqual([]);
  });

  it('inline program blocks exist', () => {
    const blocks = (l: (typeof LESSONS)[number]) => [...l.intuition, ...(l.syntax ?? []), ...l.tiny, ...l.guided, ...l.complexity];
    for (const l of LESSONS) for (const b of blocks(l)) if (b.t === 'program') expect(hasJavaSource(b.file), `${l.id}: ${b.file}`).toBe(true);
  });

  it('every programme file used by a block is also listed in programs[] (so it is verified & walked through)', () => {
    for (const l of LESSONS) {
      const listed = new Set(l.programs.map((p) => p.file));
      for (const b of [...l.intuition, ...(l.syntax ?? []), ...l.tiny, ...l.guided, ...l.complexity])
        if (b.t === 'program') expect(listed.has(b.file), `${l.id}: ${b.file} is shown but not in programs[]`).toBe(true);
    }
  });

  it('dry-run references exist in the lab registry and run', () => {
    for (const l of LESSONS)
      if (l.dryRun) {
        const a = LAB_BY_ID[l.dryRun.algo];
        expect(a, `${l.id}: ${l.dryRun.algo}`).toBeDefined();
        expect(a.run(l.dryRun.input).steps.length).toBeGreaterThan(0);
      }
  });
});

describe('exercises', () => {
  const all = [...LESSONS.flatMap((l) => l.practice.map((e) => ({ owner: l.id, e }))), ...EXTRA_PROBLEMS.map((p) => ({ owner: 'extra', e: p as any }))];
  it('ids are globally unique', () => {
    const ids = all.map((x) => x.e.id);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dup).toEqual([]);
  });
  it('have a solution file, tests, hints and a statement', () => {
    for (const { owner, e } of all) {
      expect(hasJavaSource(e.solutionFile), `${owner}/${e.id}: ${e.solutionFile}`).toBe(true);
      expect(e.tests.length, `${e.id} tests`).toBeGreaterThan(0);
      expect(e.hints.length, `${e.id} hints`).toBeGreaterThan(0);
      expect(e.statement.length).toBeGreaterThan(10);
    }
  });
  it('cover all three levels across the curriculum', () => {
    const levels = new Set(all.map((x) => x.e.level));
    expect(levels.has('beginner') && levels.has('intermediate') && levels.has('challenge')).toBe(true);
  });
});

describe('quizzes are well-formed', () => {
  it('answers and structure are valid', () => {
    for (const l of LESSONS)
      l.quiz.forEach((q, i) => {
        const where = `${l.id} quiz[${i}]`;
        expect(q.q.length, where).toBeGreaterThan(5);
        expect(q.explain.length, `${where} explanation`).toBeGreaterThan(3);
        switch (q.type) {
          case 'mcq':
            expect(q.options.length, where).toBeGreaterThanOrEqual(2);
            expect(q.answer, where).toBeGreaterThanOrEqual(0);
            expect(q.answer, where).toBeLessThan(q.options.length);
            expect(new Set(q.options).size, `${where}: duplicate options`).toBe(q.options.length);
            break;
          case 'bug':
            expect(q.answerLine, where).toBeGreaterThanOrEqual(1);
            expect(q.answerLine, where).toBeLessThanOrEqual(q.code.split('\n').length);
            break;
          case 'fill':
            expect(q.template.split('___').length - 1, `${where}: blanks vs ___ count`).toBe(q.blanks.length);
            q.blanks.forEach((b) => expect(b.length).toBeGreaterThan(0));
            break;
          case 'match':
            expect(q.pairs.length, where).toBeGreaterThanOrEqual(2);
            break;
          case 'trace':
            expect(q.items.length, where).toBeGreaterThan(0);
            break;
          case 'output':
            expect(q.answer.trim().length, where).toBeGreaterThan(0);
            break;
        }
      });
  });
});

describe('revision content', () => {
  it('flashcards have unique ids and non-empty sides', () => {
    const cards = allFlashcards();
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
    for (const c of cards) {
      expect(c.front.trim().length).toBeGreaterThan(0);
      expect(c.back.trim().length).toBeGreaterThan(0);
    }
    expect(cards.length).toBeGreaterThan(150);
  });
  it('cheat sheets exist', () => {
    expect(CHEATSHEETS.length).toBeGreaterThan(0);
  });
});

describe('archive coverage', () => {
  const bases = new Set(ARCHIVE_DECKS.map((d) => d.base));
  it('all 38 slide decks are inventoried', () => {
    expect(ARCHIVE_DECKS.length).toBe(38);
    expect(bases.size).toBe(38);
  });
  it('every lesson source names a real deck', () => {
    for (const l of LESSONS) for (const s of l.sources) expect(bases.has(s), `${l.id}: unknown source ${s}`).toBe(true);
  });
  it('every deck item is taught by an existing lesson that cites the deck', () => {
    for (const d of ARCHIVE_DECKS)
      for (const it of d.items) {
        const l = LESSON_BY_ID[it.lesson];
        expect(l, `${d.base}: lesson ${it.lesson}`).toBeDefined();
        expect(l.sources.includes(d.base), `${it.lesson} should list source ${d.base}`).toBe(true);
      }
  });
  it('every deck is covered by at least one lesson', () => {
    for (const d of ARCHIVE_DECKS) expect(LESSONS.some((l) => l.sources.includes(d.base)), d.base).toBe(true);
  });
});

describe('video library', () => {
  const keys = LESSONS.flatMap((l) => l.videos);
  it('every lesson video key has a metadata entry', () => {
    for (const k of keys) expect(VIDEOS[k], `no video entry for ${k}`).toBeDefined();
  });
  it('verified entries carry a well-formed id, a title, a channel and a duration; search entries carry a query', () => {
    for (const [k, v] of Object.entries(VIDEOS)) {
      expect(v.key).toBe(k);
      if (v.kind === 'video') {
        expect(v.videoId, k).toMatch(/^[A-Za-z0-9_-]{11}$/);
        expect(v.title.length, k).toBeGreaterThan(3);
        expect(v.channel, k).toBeTruthy();
        expect(v.duration, k).toMatch(/^\d+:\d{2}(:\d{2})?$/);
      } else {
        expect(v.query, k).toBeTruthy();
      }
    }
  });
  it('the two resources of a lesson are different videos', () => {
    for (const l of LESSONS) {
      const ids = l.videos.map((k) => VIDEOS[k]?.videoId).filter(Boolean);
      expect(new Set(ids).size, l.id).toBe(ids.length);
    }
  });
  it('no entry is orphaned (every key belongs to a lesson)', () => {
    const set = new Set(keys);
    for (const k of Object.keys(VIDEOS)) expect(set.has(k), `orphan video key ${k}`).toBe(true);
  });
});
