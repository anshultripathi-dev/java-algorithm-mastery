/**
 * Builds the study-guide PDFs from the same canonical content as the website:
 *   generated/java-study-guide.pdf                  (master guide)
 *   generated/supplementary-guides/*.pdf            (cheat sheets, workbook, solutions, flashcards, …)
 *
 *   npm run pdf            # everything
 *   npm run pdf -- master  # only the master guide
 */
import { mkdirSync, statSync, copyFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LESSONS, LESSON_BY_ID } from '../src/data/lessons';
import { MODULES, TRACK_LABEL } from '../src/data/curriculum/modules';
import { ARCHIVE_DECKS } from '../src/data/curriculum/archive-decks';
import { CHEATSHEETS } from '../src/data/revision/cheatsheets';
import { allFlashcards } from '../src/data/revision/flashcards';
import { buildPlan } from '../src/lib/plan';
import { VIDEOS } from '../src/data/video-resources/videos';
import { LAB_ALGORITHMS } from '../src/features/dry-run-lab/registry';
import { listJavaSources } from '../src/lib/java-sources';
import type { Lesson } from '../src/lib/types';
import { stripInline as plain } from '../src/lib/inline';
import { PdfBuilder, C } from './pdf/builder';
import { renderLesson, renderSolutions, renderAnswerKey, renderExercise, renderQuestion, videoLine, lessonDest, type RenderCtx } from './pdf/render';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'generated');
const SUP = join(OUT, 'supplementary-guides');
mkdirSync(SUP, { recursive: true });

const TITLE = 'Java Foundations to Algorithm Mastery';
const SUBTITLE = 'Complete Beginner-to-Advanced Study Guide';
const FULL_TITLE = `${TITLE} — ${SUBTITLE}`;
const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// lesson labels "2.4" = module 2, 4th lesson
const labelOf = new Map<string, string>();
MODULES.forEach((m) => {
  LESSONS.filter((l) => l.module === m.id).forEach((l, i) => labelOf.set(l.id, `${m.id.slice(1)}.${i + 1}`));
});
const ctx: RenderCtx = { label: (l) => labelOf.get(l.id) ?? '', title: (id) => plain(LESSON_BY_ID[id]?.title ?? id) };

const stats = () => ({
  lessons: LESSONS.length,
  exercises: LESSONS.reduce((s, l) => s + l.practice.length, 0),
  quiz: LESSONS.reduce((s, l) => s + l.quiz.length, 0),
  programs: listJavaSources().length,
  labs: LAB_ALGORITHMS.length,
  videos: LESSONS.flatMap((l) => l.videos).filter((k) => VIDEOS[k]?.kind === 'video').length,
  videoSlots: LESSONS.flatMap((l) => l.videos).length,
});

function cover(b: PdfBuilder, title: string, subtitle: string, lines: string[]) {
  b.addPage({ noHeader: true });
  const d = b.doc;
  d.rect(0, 0, b.pageW, 330).fill(C.brand);
  d.rect(0, 330, b.pageW, 6).fill('#a5b4fc');
  d.font('bold').fontSize(11).fillColor('#c7d2fe').text('STUDY GUIDE', 54, 96, { lineBreak: false, characterSpacing: 3 });
  const tLines = b.measure(title, 36, b.width, 1.15, { bold: true }).lines;
  let y = 124;
  for (const l of tLines) {
    let x = 54;
    for (const a of l) {
      d.font(a.font).fontSize(36).fillColor('#ffffff').text(a.text, x, y, { lineBreak: false });
      x += a.w;
    }
    y += 42;
  }
  const sub = b.measure(subtitle, 17, b.width, 1.3).lines;
  y += 6;
  for (const l of sub) {
    let x = 54;
    for (const a of l) {
      d.font('sans').fontSize(17).fillColor('#e0e7ff').text(a.text, x, y, { lineBreak: false });
      x += a.w;
    }
    y += 24;
  }
  b.y = 372;
  for (const l of lines) b.paragraph(l, { size: 11.5, color: C.ink, after: 8 });
  d.font('sans').fontSize(9).fillColor(C.muted).text(`Generated ${today} from the same lesson data that powers the website.`, 54, b.pageH - 80, { lineBreak: false });
  d.font('sans').fontSize(9).fillColor(C.muted).text('Every Java program in this guide was compiled with --release 17 and run against its expected output.', 54, b.pageH - 66, { lineBreak: false });
}

function honestyNote(b: PdfBuilder) {
  b.callout(
    'note',
    'An honest promise',
    'This guide gives you a complete, verified map and enough practice to learn the material quickly — but nobody can promise mastery in a fixed number of days. How fast you progress depends on how much you code yourself. Use the quizzes and exercises to find out what you actually know, and revisit weak topics.',
  );
}

// ───────────────────────── study plans ─────────────────────────
function planTable(b: PdfBuilder, path: 'quick' | 'complete', days: number) {
  const plan = buildPlan(LESSONS, path, days);
  b.table(
    ['Day', 'What to do', 'Minutes'],
    plan.map((d) => [
      String(d.day),
      d.tasks
        .map((t) => {
          const l = t.lessonId ? LESSON_BY_ID[t.lessonId] : undefined;
          if (!l) return t.title;
          const prefix = { learn: 'Learn', practice: 'Practise', revise: 'Revise', assess: 'Assess', review: 'Review' }[t.kind];
          return `${prefix}: ${labelOf.get(l.id)} ${plain(l.title)}`;
        })
        .join('<br>')
        .split('<br>')
        .join(' · '),
      String(d.minutes),
    ]),
    { size: 8, widths: [30, b.width - 30 - 52, 52] },
  );
}

function studyPlans(b: PdfBuilder, which: number[] = [14]) {
  b.paragraph('Plans pack lessons in curriculum order (so prerequisites always come first), revise yesterday\'s and the previous days\' material, and finish with a weak-topic review and a mixed assessment. The website rebuilds the plan from your actual results.');
  const quick = LESSONS.filter((l) => l.essential);
  b.paragraph(`**Minimum-viable path:** ${quick.length} lessons (about ${Math.round(quick.reduce((s, l) => s + l.minutes, 0) / 60)} hours of reading plus practice) covering every essential syntax and core idea. **Complete path:** all ${LESSONS.length} lessons (about ${Math.round(LESSONS.reduce((s, l) => s + l.minutes, 0) / 60)} hours of reading).`);
  for (const d of which) {
    b.heading(3, `${d}-day plan — minimum-viable path`, { toc: false });
    planTable(b, 'quick', d);
    b.heading(3, `${d}-day plan — complete path`, { toc: false });
    planTable(b, 'complete', d);
  }
  honestyNote(b);
}

// ───────────────────────── appendices ─────────────────────────
function cheatSheets(b: PdfBuilder) {
  for (const cs of CHEATSHEETS) {
    b.heading(3, cs.title, { toc: false });
    for (const sec of cs.sections) {
      b.table([sec.heading, 'Meaning'], sec.rows.map((r) => [r[0], r[1]]), { size: 8.5, widths: [b.width * 0.46, b.width * 0.54], mono: [true, false] });
    }
  }
}

function flashcardsSection(b: PdfBuilder, all: boolean) {
  const cards = allFlashcards().filter((c) => all || c.id.startsWith('c-'));
  const byLesson = new Map<string, typeof cards>();
  const generic = cards.filter((c) => !c.lesson);
  if (generic.length) {
    b.heading(3, 'Core facts to remember', { toc: false });
    b.table(['Question', 'Answer'], generic.map((c) => [c.front, c.back]), { size: 8.5, widths: [b.width * 0.42, b.width * 0.58] });
  }
  for (const c of cards.filter((c) => c.lesson)) {
    if (!byLesson.has(c.lesson!)) byLesson.set(c.lesson!, []);
    byLesson.get(c.lesson!)!.push(c);
  }
  for (const [lid, cs] of byLesson) {
    const l = LESSON_BY_ID[lid];
    if (!l) continue;
    b.heading(3, `${labelOf.get(lid)} ${plain(l.title)}`, { toc: false });
    b.table(['Prompt', 'Answer'], cs.map((c) => [c.front.replace(/^.*?: recall this key fact \(#\d+\) from memory$/, 'Recall this key fact from memory'), c.back]), { size: 8, widths: [b.width * 0.4, b.width * 0.6] });
  }
}

function videoTable(b: PdfBuilder, lessons: Lesson[]) {
  const rows: string[][] = [];
  for (const l of lessons) {
    for (const key of l.videos) {
      const { v } = videoLine(key, l.title);
      const kind = v.kind === 'video' ? 'verified video' : 'search link';
      const url = v.kind === 'video' ? `https://www.youtube.com/watch?v=${v.videoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(v.query ?? v.title)}`;
      rows.push([`${labelOf.get(l.id)} ${plain(l.title)}`, `[${v.title.replace(/[\[\]]/g, '')}](${url})`, v.channel ?? '—', v.duration ?? '—', kind]);
    }
  }
  b.table(['Lesson', 'Resource', 'Channel', 'Length', 'Type'], rows, { size: 7.5, widths: [b.width * 0.24, b.width * 0.34, b.width * 0.16, b.width * 0.08, b.width * 0.18] });
}

function coverageChecklist(b: PdfBuilder) {
  const rows = ARCHIVE_DECKS.map((d) => {
    const ls = LESSONS.filter((l) => l.sources.includes(d.base));
    return ['☐', d.title, `${d.slides}`, ls.map((l) => `[${labelOf.get(l.id)}](#${lessonDest(l.id)})`).join(', ')];
  });
  b.table(['', 'Slide deck', 'Slides', 'Taught in lesson(s)'], rows, { size: 8.5, widths: [20, b.width * 0.46, 40, b.width - 20 - 40 - b.width * 0.46] });
}

function corrections(b: PdfBuilder) {
  let any = false;
  for (const l of LESSONS) {
    const d = l.sourceNotes?.discrepancies ?? [];
    if (!d.length) continue;
    any = true;
    b.paragraph(`**${labelOf.get(l.id)} ${plain(l.title)}**`, { size: 10, color: C.brand, after: 2 });
    b.bullets(d, { size: 9 });
  }
  if (!any) b.paragraph('No discrepancies were recorded.');
}

function lessonChecklist(b: PdfBuilder) {
  for (const m of MODULES) {
    b.heading(3, `${m.id.slice(1)} · ${m.title}`, { toc: false });
    const rows = LESSONS.filter((l) => l.module === m.id).map((l) => ['☐', `${labelOf.get(l.id)}  ${plain(l.title)}`, l.essential ? '★' : '', `${l.minutes}`, '☐ quiz ≥ 80%   ☐ exercises done']);
    b.table(['', 'Lesson', 'Core', 'Min', 'Mastery check'], rows, { size: 8.5, widths: [20, b.width - 20 - 34 - 34 - 140, 34, 34, 140] });
  }
}

// ───────────────────────── master guide ─────────────────────────
function buildMaster() {
  const file = join(OUT, 'java-study-guide.pdf');
  const b = new PdfBuilder(
    {
      title: FULL_TITLE,
      subtitle: TITLE,
      author: 'Java Foundations to Algorithm Mastery',
      subject: 'Beginner-to-advanced Java study guide covering syntax, OOP, data structures, complexity and the full course algorithm archive',
      keywords: ['Java', 'algorithms', 'data structures', 'complexity', 'study guide'],
      headerLeft: TITLE,
    },
    file,
  );
  const s = stats();
  cover(b, TITLE, SUBTITLE, [
    `**${s.lessons} lessons** in six modules — from installing Java to Manacher's algorithm and the Knight's tour — each following the same format: objective, intuition, syntax, worked example, dry run, complete code with walkthrough, complexity, common mistakes, practice, quiz, video and a revision card.`,
    `**${s.programs} Java programs** (${s.exercises} exercises, ${s.quiz} quiz questions, ${s.labs} step-by-step dry-run traces), all compiled for Java 17+ and run against their expected output.`,
    `**Built from your course archive:** all ${ARCHIVE_DECKS.length} slide decks are covered; where a slide disagreed with a verified result, the correction is explained.`,
  ]);

  // front matter
  const fm = 3; // How to use + Study plans + Corrections summary placeholder are counted via EXPECTED below
  void fm;
  const tocPages = b.reserveToc(EXPECTED_LEVELS);

  b.setSection('How to use this guide');
  b.heading(1, 'How to use this guide', { toc: true });
  b.paragraph('This is a self-contained path from "I have never written Java" to "I can design, analyse and implement every algorithm in my course archive". It is organised in six parts that you can read in order, or enter at the level you need.');
  b.table(
    ['Part', 'Module', 'Lessons', 'Reading time', 'Essential'],
    MODULES.map((m) => {
      const ls = LESSONS.filter((l) => l.module === m.id);
      return [m.id.slice(1), `${m.title} — ${m.tagline}`, String(ls.length), `${Math.round(ls.reduce((s, l) => s + l.minutes, 0) / 60 * 10) / 10} h`, `${ls.filter((l) => l.essential).length}/${ls.length}`];
    }),
    { size: 9, widths: [32, b.width - 32 - 56 - 74 - 58, 56, 74, 58] },
  );
  b.heading(3, 'The four kinds of knowledge', { toc: false });
  b.bullets(
    (Object.keys(TRACK_LABEL) as (keyof typeof TRACK_LABEL)[]).map((k) => `**${TRACK_LABEL[k]}**`),
    {},
  );
  b.paragraph('Every lesson header names its kind, so you can decide what to skip when time is short: **Essential Java syntax** and **Core programming & data structures** are the base; **Archive algorithm knowledge** is what your course slides test; **Optional enrichment** goes beyond the slides.');
  b.heading(3, 'How each lesson is laid out', { toc: false });
  b.bullets([
    '**You will be able to…** — measurable objectives, then the prerequisites (clickable).',
    '**The idea / Syntax / Tiny example / Guided example** — intuition first, then notation, then a worked case.',
    '**Dry run** — a step-by-step execution trace of the algorithm with variable values.',
    '**Complete code** — every program is real, runnable Java; numbered badges in the margin point to the **line-by-line walkthrough** table.',
    '**Complexity, Common mistakes, Practice, Quick check** — exercises have hidden solutions (at the end of each part); the quiz answer key is there too.',
    '**Watch & read** — links to a video or a clearly-labelled YouTube search; **Revision card** — 30-second recap.',
  ]);
  b.heading(3, 'Running the code', { toc: false });
  b.code(
    `javac Hello.java      # compile (needs a JDK, version 17 or newer)\njava Hello            # run\n\n# or, since Java 11, compile and run one file in one step:\njava Hello.java`,
    { plain: true, caption: 'Terminal (macOS)' },
  );
  b.paragraph('Sample input for programs that use `Scanner` is shown next to the code; pipe it in with `java Name < input.txt`.');
  honestyNote(b);

  b.heading(2, 'Study plans', { newPage: true });
  studyPlans(b, [14]);

  // parts
  for (const m of MODULES) {
    const ls = LESSONS.filter((l) => l.module === m.id);
    b.setSection(`Part ${m.id.slice(1)} · ${m.title}`);
    b.heading(1, `Part ${m.id.slice(1)} · ${m.title}`);
    b.paragraph(m.description, { size: 11 });
    b.table(
      ['', 'Lesson', 'Level', 'Min', 'Core'],
      ls.map((l) => [labelOf.get(l.id) ?? '', `[${plain(l.title)}](#${lessonDest(l.id)})`, l.level, String(l.minutes), l.essential ? '★' : '']),
      { size: 9, widths: [34, b.width - 34 - 80 - 36 - 36, 80, 36, 36] },
    );
    for (const l of ls) {
      b.setSection(`${labelOf.get(l.id)} ${plain(l.title)}`);
      renderLesson(b, l, ctx);
    }
    b.setSection(`Part ${m.id.slice(1)} · Solutions`);
    b.heading(2, `Part ${m.id.slice(1)} — Solutions to the exercises`, { newPage: true });
    b.paragraph('Try the exercises before reading these. Each solution is the exact file that was compiled and tested.', { size: 9, color: C.muted, italic: true });
    renderSolutions(b, ls, ctx);
    b.setSection(`Part ${m.id.slice(1)} · Answer key`);
    b.heading(2, `Part ${m.id.slice(1)} — Quiz answer key`, { newPage: true });
    renderAnswerKey(b, ls, ctx);
  }

  // appendices
  b.setSection('Appendices');
  b.heading(1, 'Appendices');
  b.paragraph('Reference material for quick lookup and revision.');
  b.setSection('Appendix A · Cheat sheets');
  b.heading(2, 'Appendix A — Cheat sheets', { newPage: true });
  cheatSheets(b);
  b.setSection('Appendix B · Core facts');
  b.heading(2, 'Appendix B — Core facts to remember', { newPage: true });
  flashcardsSection(b, false);
  b.setSection('Appendix C · Video library');
  b.heading(2, 'Appendix C — Video and reading library', { newPage: true });
  b.paragraph('Entries marked **verified video** were retrieved from YouTube (title, channel and length are YouTube\'s own). Entries marked **search link** open a targeted YouTube search — they are not endorsements of a specific video.', { size: 9 });
  videoTable(b, LESSONS);
  b.setSection('Appendix D · Archive coverage');
  b.heading(2, 'Appendix D — Archive coverage checklist', { newPage: true });
  b.paragraph('Tick a deck when you can solve its problems without looking.', { size: 9 });
  coverageChecklist(b);
  b.setSection('Appendix E · Slide corrections');
  b.heading(2, 'Appendix E — Where the slides were corrected', { newPage: true });
  b.paragraph('Each algorithm was re-derived and checked by running code (and, for small inputs, a brute-force comparison). Differences from the slides:', { size: 9 });
  corrections(b);

  if (b.toc.length !== EXPECTED_TOC) {
    console.error(`! TOC has ${b.toc.length} entries but ${EXPECTED_TOC} were reserved: update EXPECTED_TOC in scripts/build-pdf.ts`);
  }
  b.fillToc(tocPages);
  b.decorate();
  return { file, b, done: b.end() };
}

/** TOC entry levels in document order (kept in sync with buildMaster; asserted at the end of the build). */
const EXPECTED_LEVELS: number[] = [
  1, 2, // how to use, study plans
  ...MODULES.flatMap((m) => [1, ...LESSONS.filter((l) => l.module === m.id).map(() => 2), 2, 2]),
  1, 2, 2, 2, 2, 2, // appendices
];
const EXPECTED_TOC = EXPECTED_LEVELS.length;

// ───────────────────────── supplementary guides ─────────────────────────
function supplementary(name: string, title: string, subtitle: string, intro: string[], body: (b: PdfBuilder) => void) {
  const file = join(SUP, name);
  const b = new PdfBuilder(
    { title: `${TITLE} — ${title}`, subtitle: `${TITLE} · ${title}`, author: 'Java Foundations to Algorithm Mastery', subject: subtitle, keywords: ['Java', 'study guide', title], headerLeft: `${TITLE} · ${title}` },
    file,
  );
  cover(b, title, subtitle, intro);
  body(b);
  b.decorate();
  return { file, b, done: b.end() };
}

function buildSupplementary() {
  const out: { file: string; b: PdfBuilder; done: Promise<void> }[] = [];
  out.push(
    supplementary('01-cheat-sheets.pdf', 'Cheat Sheets', 'Quick-reference sheets for Java syntax, collections, complexity and the archive algorithms', ['Print these or keep them beside your editor. Every entry is verified against the lessons.'], (b) => {
      b.setSection('Cheat sheets');
      b.heading(1, 'Cheat sheets');
      cheatSheets(b);
    }),
  );
  out.push(
    supplementary('02-practice-workbook.pdf', 'Practice Workbook', `${stats().exercises} exercises grouped by module — no solutions`, ['Solutions are in the separate Solutions Manual so you are not tempted to peek.'], (b) => {
      for (const m of MODULES) {
        b.setSection(`Part ${m.id.slice(1)} · ${m.title}`);
        b.heading(1, `Part ${m.id.slice(1)} · ${m.title}`);
        for (const l of LESSONS.filter((x) => x.module === m.id)) {
          b.heading(2, `${labelOf.get(l.id)} ${plain(l.title)}`, { toc: true });
          l.practice.forEach((e, i) => renderExercise(b, e, i + 1));
        }
      }
    }),
  );
  out.push(
    supplementary('03-solutions-manual.pdf', 'Solutions Manual', 'Reference solutions and quiz answers for every lesson', ['Each solution is the exact Java file that was compiled and tested, with an explanation.'], (b) => {
      for (const m of MODULES) {
        const ls = LESSONS.filter((l) => l.module === m.id);
        b.setSection(`Part ${m.id.slice(1)} · ${m.title}`);
        b.heading(1, `Part ${m.id.slice(1)} · ${m.title}`);
        b.heading(2, 'Exercise solutions', { toc: true });
        renderSolutions(b, ls, ctx);
        b.heading(2, 'Quiz answer key', { toc: true });
        renderAnswerKey(b, ls, ctx);
      }
    }),
  );
  out.push(
    supplementary('04-revision-flashcards.pdf', 'Revision Flashcards', 'Every revision card and quiz fact as a prompt and an answer', ['Cover the right-hand column, answer aloud, then check. Repeat the ones you miss after a day and again after a week.'], (b) => {
      b.setSection('Flashcards');
      b.heading(1, 'Revision flashcards');
      flashcardsSection(b, true);
    }),
  );
  out.push(
    supplementary('05-archive-algorithms-handbook.pdf', 'Archive Algorithms Handbook', 'Every algorithm and problem from the course slides, with dry runs', ['This is Part 5 of the master guide on its own, ready to print for exam revision.'], (b) => {
      const ls = LESSONS.filter((l) => l.module === 'm5');
      b.setSection('Archive algorithms');
      b.heading(1, 'Archive algorithms');
      for (const l of ls) renderLesson(b, l, ctx);
      b.heading(2, 'Solutions to the exercises', { newPage: true });
      renderSolutions(b, ls, ctx);
      b.heading(2, 'Quiz answer key', { newPage: true });
      renderAnswerKey(b, ls, ctx);
    }),
  );
  out.push(
    supplementary('06-study-plans-and-checklist.pdf', 'Study Plans and Progress Checklist', '7-, 14-, 21- and 30-day plans on the minimum-viable and complete paths', ['Pick the plan that matches your time, tick lessons as you go, and use the mastery check column honestly.'], (b) => {
      b.setSection('Study plans');
      b.heading(1, 'Study plans');
      studyPlans(b, [7, 14, 21, 30]);
      b.heading(1, 'Progress checklist');
      lessonChecklist(b);
    }),
  );
  out.push(
    supplementary('07-video-library.pdf', 'Video and Reading Library', 'Where to watch each lesson — verified videos and clearly labelled search links', ['Video IDs, titles, channels and lengths come from YouTube itself; nothing is invented. Search links are labelled as such.'], (b) => {
      b.setSection('Video library');
      b.heading(1, 'Video library');
      videoTable(b, LESSONS);
    }),
  );
  return out;
}

// ───────────────────────── run ─────────────────────────
const which = process.argv[2];
const t0 = Date.now();
const built: { file: string; b: PdfBuilder; done: Promise<void> }[] = [];
if (!which || which === 'master') built.push(buildMaster());
if (!which || which === 'supplementary') built.push(...buildSupplementary());
await Promise.all(built.map((x) => x.done));

// publish the PDFs next to the website (public/downloads) with a manifest the Downloads card reads
const pub = join(ROOT, 'public', 'downloads');
mkdirSync(pub, { recursive: true });
const describe: Record<string, string> = {
  'java-study-guide.pdf': 'Master guide: every lesson, dry run, walkthrough, solutions, answer keys and appendices',
  '01-cheat-sheets.pdf': 'Syntax, collections, complexity and algorithm cheat sheets',
  '02-practice-workbook.pdf': 'All exercises, grouped by module — without solutions',
  '03-solutions-manual.pdf': 'Reference solutions and quiz answers',
  '04-revision-flashcards.pdf': 'Every revision card as prompt and answer',
  '05-archive-algorithms-handbook.pdf': 'Part 5 on its own: all archive algorithms with dry runs',
  '06-study-plans-and-checklist.pdf': '7/14/21/30-day plans and a progress checklist',
  '07-video-library.pdf': 'Video and reading links for every lesson',
};
const manifest: { file: string; title: string; description: string; pages: number; bytes: number; master: boolean }[] = [];
for (const { file, b } of built) {
  const name = file.split('/').pop()!;
  copyFileSync(file, join(pub, name));
  const bytes = statSync(file).size;
  console.log(`${file.replace(ROOT + '/', '')}: ${(bytes / 1024).toFixed(0)} KB, ${b.pageIndex + 1} pages`);
  if (b.missingGlyphs.size) console.log(`  ! glyphs without a font: ${[...b.missingGlyphs].join(' ')}`);
  const title = name === 'java-study-guide.pdf' ? FULL_TITLE : name.replace(/^\d+-/, '').replace(/\.pdf$/, '').replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
  manifest.push({ file: `downloads/${name}`, title, description: describe[name] ?? '', pages: b.pageIndex + 1, bytes, master: name === 'java-study-guide.pdf' });
}
if (!which) writeFileSync(join(pub, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), files: manifest }, null, 2));
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
