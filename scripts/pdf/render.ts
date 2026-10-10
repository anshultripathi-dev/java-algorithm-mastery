/**
 * Renders canonical lesson data (the SAME objects the website uses) into a PdfBuilder.
 */
import type { Block, Exercise, Lesson, Program, QuizQuestion, VideoResource } from '../../src/lib/types';
import { getJavaSource, getJavaIO, hasJavaSource } from '../../src/lib/java-sources';
import { resolveAnchor } from '../../src/lib/highlight';
import { stripInline } from '../../src/lib/inline';
const plain = stripInline;
import { LAB_BY_ID } from '../../src/features/dry-run-lab/registry';
import { getVideo, videoUrl } from '../../src/lib/videos';
import { TRACK_LABEL, MODULE_BY_ID } from '../../src/data/curriculum/modules';
import type { TraceStep } from '../../src/features/dry-run-lab/types';
import { PdfBuilder, C, type MarkColor } from './builder';

export const lessonDest = (id: string) => `lesson-${id}`;
export const LETTERS = 'ABCDEFGH';
const ROLE_LABEL: Record<Program['role'], string> = {
  tiny: 'tiny example',
  simple: 'simple solution',
  optimized: 'optimised solution',
  demo: 'demonstration',
  'archive-original': 'from the slides',
};

export interface RenderCtx {
  /** lesson number label like "3.4" */
  label: (l: Lesson) => string;
  title: (id: string) => string;
}

// ───────────────────────── blocks ─────────────────────────
export function renderBlocks(b: PdfBuilder, blocks: Block[] | undefined) {
  for (const blk of blocks ?? []) {
    switch (blk.t) {
      case 'p':
        b.paragraph(blk.text);
        break;
      case 'h':
        b.heading(4, stripInline(blk.text), { toc: false });
        break;
      case 'list':
        b.bullets(blk.items, { ordered: blk.ordered });
        break;
      case 'callout':
        b.callout(blk.kind, blk.title, blk.text);
        break;
      case 'code':
        b.code(blk.code, { caption: blk.caption });
        break;
      case 'program':
        renderProgram(b, blk.file, undefined, blk.caption);
        break;
      case 'pre':
        b.pre(blk.text, blk.caption);
        break;
      case 'table':
        b.table(blk.headers, blk.rows, { caption: blk.caption });
        break;
      case 'math':
        b.math(blk.text);
        break;
    }
  }
}

// ───────────────────────── programs ─────────────────────────
export function renderProgram(b: PdfBuilder, file: string, prog?: Program, caption?: string, opts: { sampleIO?: boolean; notes?: boolean } = {}) {
  if (!hasJavaSource(file)) {
    b.callout('warning', 'Missing file', `java/${file} was not found.`);
    return;
  }
  const src = getJavaSource(file);
  const base = file.split('/').pop()!;
  const markers = (prog?.walkthrough ?? [])
    .map((w, i) => ({ n: i + 1, line: resolveAnchor(src, w.at) }))
    .filter((m): m is { n: number; line: [number, number] } => !!m.line);
  const titleParts = [`**${base}**`];
  if (prog) titleParts.push(`${prog.title} (${ROLE_LABEL[prog.role]})`);
  else if (caption) titleParts.push(caption);
  b.code(src.replace(/\s+$/, ''), { lineNumbers: true, markers, title: undefined, caption: titleParts.join(' — ') });
  if (prog?.description) b.paragraph(prog.description, { size: 9, color: C.muted, italic: true, after: 4 });
  const io = getJavaIO(file);
  if (opts.sampleIO !== false && (io.in !== undefined || io.out !== undefined)) {
    if (io.in !== undefined && io.in.trim()) b.code(io.in.replace(/\s+$/, ''), { caption: 'Sample input', plain: true, fontSize: 7.5 });
    if (io.out !== undefined) b.code(io.out.replace(/\s+$/, ''), { caption: 'Output when you run it', plain: true, fontSize: 7.5 });
  }
  if (opts.notes !== false && prog && prog.walkthrough.length) {
    b.heading(4, 'Line-by-line walkthrough', { toc: false });
    const rows = prog.walkthrough.map((w, i) => {
      const r = resolveAnchor(src, w.at);
      const where = r ? (r[0] === r[1] ? `line ${r[0]}` : `lines ${r[0]}–${r[1]}`) : '';
      return [String(i + 1), where, w.text];
    });
    b.table(['#', 'Where', 'What happens'], rows, { widths: [24, 62, b.width - 86], size: 8.5 });
  }
}

// ───────────────────────── dry run ─────────────────────────
function pickSteps(steps: TraceStep[], max = 14): { s: TraceStep; i: number }[] {
  if (steps.length <= max) return steps.map((s, i) => ({ s, i }));
  const idx = new Set<number>();
  for (let k = 0; k < max; k++) idx.add(Math.round((k * (steps.length - 1)) / (max - 1)));
  return [...idx].sort((a, b) => a - b).map((i) => ({ s: steps[i], i }));
}

export function renderDryRun(b: PdfBuilder, lesson: Lesson) {
  const ref = lesson.dryRun;
  if (!ref) return;
  const algo = LAB_BY_ID[ref.algo];
  if (!algo) return;
  const res = algo.run(ref.input);
  b.heading(3, 'Dry run: watch it execute', { toc: false });
  b.paragraph(ref.caption);
  const inp = Object.entries(ref.input).map(([k, v]) => `${k} = \`${v}\``).join(', ');
  b.paragraph(`**Algorithm:** ${algo.title}. **Input:** ${inp}.`, { size: 9, color: C.muted });
  if (algo.pseudocode.length) b.code(algo.pseudocode.join('\n'), { plain: true, caption: 'Pseudocode', fontSize: 7.5 });
  if (res.error) {
    b.callout('warning', 'Could not run', res.error);
    return;
  }
  const chosen = pickSteps(res.steps);
  if (chosen.length < res.steps.length) b.paragraph(`The full trace has ${res.steps.length} steps; ${chosen.length} evenly spaced ones are shown. Run the rest in the website's Dry-run lab.`, { size: 8.5, color: C.muted, italic: true });
  for (const { s, i } of chosen) {
    b.ensure(44 + (s.arrays?.length ?? 0) * 40 + (s.grid ? s.grid.cells.length * 15 + 8 : 0));
    b.paragraph(`**Step ${i + 1} of ${res.steps.length}.** ${s.note}`, { size: 9.5, after: 2 });
    const vars = Object.entries(s.vars).map(([k, v]) => `${k} = ${String(v)}`).join('   ·   ');
    if (vars) b.paragraph(vars, { size: 8.5, color: C.brand, after: 2 });
    for (const a of s.arrays ?? []) b.arrayRow(a.name, a.values, (a.marks ?? {}) as Record<number, MarkColor>, a.pointers ?? {}, a.indexStart ?? 0);
    if (s.grid) b.grid(s.grid.cells, (s.grid.marks ?? {}) as Record<string, MarkColor>);
    b.space(3);
  }
  b.callout('example', 'Result', stripInline(res.result));
}

// ───────────────────────── exercises & quizzes ─────────────────────────
export function renderExercise(b: PdfBuilder, e: Exercise, n: number) {
  const lvl = { beginner: 'Beginner', intermediate: 'Intermediate', challenge: 'Challenge' }[e.level];
  b.ensure(70);
  b.paragraph(`**Exercise ${n} · ${e.title}** — *${lvl}*`, { size: 10.5, color: C.brand, after: 3 });
  b.paragraph(e.statement, { size: 9.5 });
  if (e.constraints?.length) b.bullets(e.constraints.map((c) => `\`${c}\``).length ? e.constraints : [], { size: 9 });
  if (e.examples?.length) {
    b.table(['Example input', 'Expected output'], e.examples.map((x) => [x.input.replace(/\n/g, ' ⏎ '), x.output.replace(/\n/g, ' ⏎ ')]), { size: 8.5, mono: [true, true], widths: [b.width * 0.5, b.width * 0.5] });
  }
  if (e.hints.length) {
    b.paragraph(e.hints.map((h, i) => `**Hint ${i + 1}:** ${h}`).join('  '), { size: 8.5, color: C.muted, after: 4 });
  }
  if (e.starter) b.code(e.starter, { caption: 'Starter code', fontSize: 7.5 });
}

const OPT = 'ABCDEFGH';

export function renderQuestion(b: PdfBuilder, q: QuizQuestion, n: number) {
  b.ensure(60);
  b.paragraph(`**Q${n}.** ${q.q}`, { size: 9.5, after: 3 });
  switch (q.type) {
    case 'mcq':
      if (q.code) b.code(q.code, { fontSize: 7.5 });
      b.bullets(q.options.map((o, i) => `**${OPT[i]}.** ${o}`).map((s) => s), { size: 9 });
      break;
    case 'output':
      b.code(q.code, { fontSize: 7.5 });
      b.paragraph('Your answer: ____________________', { size: 9, color: C.muted });
      break;
    case 'bug':
      b.code(q.code, { fontSize: 7.5, lineNumbers: true });
      b.paragraph('Which line contains the bug? ______', { size: 9, color: C.muted });
      break;
    case 'fill':
      b.code(q.template.replace(/___/g, '______'), { fontSize: 7.5 });
      break;
    case 'match': {
      const rights = [...q.pairs.map((p) => p[1])].sort();
      b.table(['Item', 'Your match'], q.pairs.map((p) => [p[0], '______']), { size: 8.5, widths: [b.width * 0.65, b.width * 0.35] });
      b.paragraph(`Choose from: ${[...new Set(rights)].map((r) => `\`${r}\``).join(', ')}`, { size: 8.5, color: C.muted });
      break;
    }
    case 'trace':
      b.code(q.code, { fontSize: 7.5, lineNumbers: true });
      b.bullets(q.items.map((it) => `${it.prompt}: ______`), { size: 9 });
      break;
  }
}

export function answerOf(q: QuizQuestion): string {
  switch (q.type) {
    case 'mcq':
      return `${OPT[q.answer]}. ${q.options[q.answer]}`;
    case 'output':
      return q.answer;
    case 'bug':
      return `line ${q.answerLine}`;
    case 'fill':
      return q.blanks.map((b) => b[0]).join(' | ');
    case 'match':
      return q.pairs.map((p) => `${p[0]} → ${p[1]}`).join('; ');
    case 'trace':
      return q.items.map((i) => `${i.prompt} = ${i.answer}`).join('; ');
  }
}

// ───────────────────────── video ─────────────────────────
export function videoLine(key: string, topic: string): { text: string; v: VideoResource } {
  const v = getVideo(key, topic);
  const url = videoUrl(v);
  if (v.kind === 'video') {
    const meta = [v.channel, v.duration].filter(Boolean).join(' · ');
    return { v, text: `**Video:** [${v.title.replace(/[\[\]]/g, '')}](${url}) — ${meta}. *${v.covers}*` };
  }
  return { v, text: `**Search link (not a verified video):** [${v.title.replace(/[\[\]]/g, '')}](${url}) — ${v.covers}.` };
}

// ───────────────────────── lesson ─────────────────────────
export function renderLesson(b: PdfBuilder, l: Lesson, ctx: RenderCtx) {
  b.heading(2, `${ctx.label(l)}  ${plain(l.title)}`, { id: lessonDest(l.id), newPage: true });
  const track = TRACK_LABEL[l.track];
  const lvl = l.level[0].toUpperCase() + l.level.slice(1);
  b.paragraph(`${MODULE_BY_ID[l.module].title} · ${lvl} · ${track} · about ${l.minutes} min · ${l.essential ? '★ on the minimum-viable path' : 'complete path'}`, { size: 8.5, color: C.muted, after: 4 });
  b.paragraph(l.summary, { size: 10.5, italic: true, color: C.ink, after: 6 });

  b.box('You will be able to', l.objectives);
  if (l.prerequisites.length) {
    b.paragraph(`**Before this lesson:** ${l.prerequisites.map((p) => `[${ctx.title(p)}](#${lessonDest(p)})`).join(' · ')}`, { size: 9 });
  }

  b.heading(3, 'The idea', { toc: false });
  renderBlocks(b, l.intuition);
  if (l.syntax?.length) {
    b.heading(3, 'Syntax', { toc: false });
    renderBlocks(b, l.syntax);
  }
  if (l.tiny.length) {
    b.heading(3, 'A tiny example', { toc: false });
    renderBlocks(b, l.tiny);
  }
  if (l.guided.length) {
    b.heading(3, 'Guided example', { toc: false });
    // the guided example's programs are shown with their notes later; here just render blocks
    for (const blk of l.guided) {
      if (blk.t === 'program') {
        const prog = l.programs.find((p) => p.file === blk.file);
        renderProgram(b, blk.file, prog, blk.caption);
      } else renderBlocks(b, [blk]);
    }
  }
  renderDryRun(b, l);

  const shown = new Set(l.guided.filter((x) => x.t === 'program').map((x) => (x as { file: string }).file));
  const rest = l.programs.filter((p) => !shown.has(p.file));
  if (rest.length) {
    b.heading(3, 'Complete code', { toc: false });
    for (const p of rest) renderProgram(b, p.file, p);
  }
  if (l.complexity.length) {
    b.heading(3, 'Complexity', { toc: false });
    renderBlocks(b, l.complexity);
  }
  if (l.mistakes.length) {
    b.heading(3, 'Common mistakes', { toc: false });
    for (const m of l.mistakes) {
      b.ensure(70);
      b.paragraph(`**${m.title}**`, { size: 10, color: C.bad, after: 2 });
      b.code(m.wrong, { fontSize: 7.5, plain: true, caption: 'Problem' });
      b.paragraph(`**Why:** ${m.why}`, { size: 9, after: 2 });
      b.paragraph(`**Fix:** ${m.fix}`, { size: 9, color: C.good, after: 6 });
    }
  }
  if (l.practice.length) {
    b.heading(3, 'Practice', { toc: false });
    b.paragraph(`Try each exercise yourself first. Reference solutions are in the *Solutions* chapter at the end of ${MODULE_BY_ID[l.module].title.split(' ')[0] === 'Programming' ? 'this part' : 'this part'} (so you are not tempted to peek).`, { size: 8.5, color: C.muted, italic: true });
    l.practice.forEach((e, i) => renderExercise(b, e, i + 1));
  }
  if (l.quiz.length) {
    b.heading(3, 'Quick check', { toc: false });
    b.paragraph('Answers are in the answer key at the end of this part.', { size: 8.5, color: C.muted, italic: true });
    l.quiz.forEach((q, i) => renderQuestion(b, q, i + 1));
  }
  if (l.interview?.length) {
    b.heading(3, 'Interview / exam questions', { toc: false });
    b.bullets(l.interview, { size: 9.5 });
  }
  b.heading(3, 'Watch & read', { toc: false });
  for (const key of l.videos) b.paragraph(videoLine(key, l.title).text, { size: 9 });
  b.box('Revision card (30–60 seconds)', l.revision, { color: C.good, bg: '#f0fdf4' });
  if (l.sourceNotes?.discrepancies?.length) {
    b.callout('source', 'Where the slides were wrong or unclear', l.sourceNotes.discrepancies.map((d) => `• ${d}`).join(' '));
  }
  if (l.sourceNotes?.assumptions?.length) {
    b.callout('note', 'Assumptions made', l.sourceNotes.assumptions.map((d) => `• ${d}`).join(' '));
  }
}

// ───────────────────────── solutions & answer key ─────────────────────────
export function renderSolutions(b: PdfBuilder, lessons: Lesson[], ctx: RenderCtx) {
  for (const l of lessons) {
    if (!l.practice.length) continue;
    b.ensure(60);
    b.paragraph(`**${ctx.label(l)} ${plain(l.title)}**`, { size: 11, color: C.brand, after: 3 });
    l.practice.forEach((e, i) => {
      b.ensure(80);
      b.paragraph(`**Exercise ${i + 1} · ${e.title}**`, { size: 9.5, after: 2 });
      if (hasJavaSource(e.solutionFile)) b.code(getJavaSource(e.solutionFile).replace(/\s+$/, ''), { lineNumbers: true, fontSize: 7.5, caption: e.solutionFile.split('/').pop() });
      b.paragraph(`**Why it works:** ${e.solutionExplain}`, { size: 9 });
      if (e.tests.length) b.paragraph(`Verified against ${e.tests.length} test case${e.tests.length > 1 ? 's' : ''}: ${e.tests.slice(0, 3).map((t) => `\`${t.stdin.replace(/\n/g, '⏎').trim() || '(no input)'}\` → \`${t.stdout.replace(/\n/g, '⏎').trim()}\``).join(';  ')}`, { size: 8, color: C.muted, after: 6 });
    });
  }
}

export function renderAnswerKey(b: PdfBuilder, lessons: Lesson[], ctx: RenderCtx) {
  for (const l of lessons) {
    if (!l.quiz.length) continue;
    b.ensure(40);
    b.paragraph(`**${ctx.label(l)} ${plain(l.title)}**`, { size: 10, color: C.brand, after: 2 });
    const rows = l.quiz.map((q, i) => [`Q${i + 1}`, answerOf(q), q.explain]);
    b.table(['', 'Answer', 'Why'], rows, { size: 8, widths: [26, b.width * 0.32, b.width * 0.68 - 26] });
  }
}
