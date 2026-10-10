/**
 * Coverage audit. Regenerates content/archive-topic-inventory.md, content/curriculum-map.md and
 * content/coverage-matrix.md from the canonical lesson data, prints a summary and exits non-zero if
 * anything required by the learning goals is missing.
 *
 *   npm run audit
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { LESSONS, LESSON_BY_ID } from '../src/data/lessons';
import { MODULES, TRACK_LABEL } from '../src/data/curriculum/modules';
import { ARCHIVE_DECKS } from '../src/data/curriculum/archive-decks';
import { VIDEOS } from '../src/data/video-resources/videos';
import { LAB_ALGORITHMS } from '../src/features/dry-run-lab/registry';
import { hasJavaSource, getJavaIO } from '../src/lib/java-sources';
import type { Lesson } from '../src/lib/types';

const root = join(import.meta.dirname, '..');
const outDir = join(root, 'content');
mkdirSync(outDir, { recursive: true });

const failures: string[] = [];
const check = (cond: boolean, msg: string) => {
  if (!cond) failures.push(msg);
};

const mark = (b: boolean) => (b ? '✓' : '–');
const videoState = (key: string) => (VIDEOS[key]?.kind === 'video' ? 'video' : 'search');

// ───────────────────────── inventory ─────────────────────────
{
  const out: string[] = [];
  out.push('# Archive topic inventory', '');
  out.push(`The course archive contains **${ARCHIVE_DECKS.length} slide decks** (${ARCHIVE_DECKS.reduce((s, d) => s + d.slides, 0)} slides). Each is listed with the lessons that teach it.`, '');
  out.push('Decks whose slides are mostly images (very low word count) were read with local OCR and every algorithm was re-derived and cross-checked by running code, not copied from the slide.', '');
  out.push('| # | Deck | Slides | Words | Images | Topics → lesson |', '|---|---|---:|---:|---:|---|');
  ARCHIVE_DECKS.forEach((d, i) => {
    const topics = d.items.map((it) => `${it.topic} → \`${it.lesson}\``).join('<br>');
    out.push(`| ${i + 1} | ${d.title} | ${d.slides} | ${d.words} | ${d.media} | ${topics} |`);
    check(d.items.length > 0, `deck ${d.base} has no items`);
  });
  out.push('', '## Slide discrepancies found and corrected', '');
  let n = 0;
  for (const l of LESSONS) {
    for (const note of l.sourceNotes?.discrepancies ?? []) {
      out.push(`- **${l.title}** (\`${l.id}\`): ${note}`);
      n++;
    }
  }
  if (!n) out.push('_none recorded_');
  out.push('', '## Assumptions made where slides were silent', '');
  n = 0;
  for (const l of LESSONS) {
    for (const note of l.sourceNotes?.assumptions ?? []) {
      out.push(`- **${l.title}** (\`${l.id}\`): ${note}`);
      n++;
    }
  }
  if (!n) out.push('_none recorded_');
  writeFileSync(join(outDir, 'archive-topic-inventory.md'), out.join('\n') + '\n');
}

// ───────────────────────── curriculum map ─────────────────────────
{
  const out: string[] = ['# Curriculum map', '', 'Modules in learning order. *Essential* lessons form the minimum-viable path.', ''];
  const totalMin = LESSONS.reduce((s, l) => s + l.minutes, 0);
  const essMin = LESSONS.filter((l) => l.essential).reduce((s, l) => s + l.minutes, 0);
  out.push(`- **${LESSONS.length} lessons**, about **${(totalMin / 60).toFixed(1)} hours** of reading (${(essMin / 60).toFixed(1)} h on the minimum-viable path of ${LESSONS.filter((l) => l.essential).length} lessons), plus practice time.`, '');
  for (const m of MODULES) {
    const ls = LESSONS.filter((l) => l.module === m.id);
    out.push(`## ${m.id.toUpperCase()} · ${m.title}`, '', m.description, '');
    out.push('| Lesson | Level | Track | Min | Essential | Needs | Exercises | Quiz |', '|---|---|---|---:|:-:|---|---:|---:|');
    for (const l of ls) {
      out.push(`| \`${l.id}\` ${l.title} | ${l.level} | ${TRACK_LABEL[l.track]} | ${l.minutes} | ${mark(l.essential)} | ${l.prerequisites.map((p) => `\`${p}\``).join(', ') || '—'} | ${l.practice.length} | ${l.quiz.length} |`);
    }
    out.push('');
  }
  writeFileSync(join(outDir, 'curriculum-map.md'), out.join('\n') + '\n');
}

// ───────────────────────── coverage matrix ─────────────────────────
{
  const out: string[] = [];
  out.push('# Coverage matrix', '');
  out.push('Each lesson is checked against the lesson format. A = objective · B = prerequisites · C = intuition · D = syntax · E = tiny example · F = guided example · G = dry run · H = complete code · I = walkthrough · J = complexity · K = common mistakes · L = practice · M = hidden solutions · N = video · O = revision card.', '');
  out.push('| Lesson | A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | Java files | Runs | Quiz | Video |', '|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---:|---:|---:|---|');
  let totalRuns = 0;
  const javaFiles = new Set<string>();
  for (const l of LESSONS) {
    const files = new Set<string>([...l.programs.map((p) => p.file), ...l.practice.map((e) => e.solutionFile)]);
    let runs = 0;
    for (const f of files) {
      javaFiles.add(f);
      check(hasJavaSource(f), `${l.id}: missing java/${f}`);
      runs += getJavaIO(f).in !== undefined || getJavaIO(f).out !== undefined ? 1 : 0;
    }
    l.practice.forEach((e) => (runs += e.tests.length));
    totalRuns += runs;
    const hasSyntax = !!l.syntax?.length;
    const hasDry = !!l.dryRun;
    const cols = [
      l.objectives.length > 0,
      true, // B: prerequisites are always shown (an empty list means "none")
      l.intuition.length > 0,
      hasSyntax,
      l.tiny.length > 0,
      l.guided.length > 0,
      hasDry,
      l.programs.length > 0,
      l.programs.every((p) => p.walkthrough.length > 0),
      l.complexity.length > 0,
      l.mistakes.length > 0,
      l.practice.length > 0,
      l.practice.every((e) => !!e.solutionExplain && hasJavaSource(e.solutionFile)),
      l.videos.length > 0,
      l.revision.length > 0,
    ];
    out.push(`| \`${l.id}\` | ${cols.map(mark).join(' | ')} | ${files.size} | ${runs} | ${l.quiz.length} | ${l.videos.map(videoState).join(', ')} |`);
    check(cols[0] && cols[2] && cols[3] && cols[4] && cols[6] && cols[5] && cols[7] && cols[8] && cols[9] && cols[10] && cols[11] && cols[12] && cols[13] && cols[14], `${l.id}: incomplete lesson format`);
    check(l.practice.length >= 1, `${l.id}: needs practice`);
  }
  out.push('', `Totals: ${LESSONS.length} lessons, ${javaFiles.size} distinct Java files, ${LESSONS.reduce((s, l) => s + l.practice.length, 0)} exercises, ${LESSONS.reduce((s, l) => s + l.quiz.length, 0)} quiz questions, ${LAB_ALGORITHMS.length} dry-run lab algorithms.`, '');
  out.push('Every lesson has a Syntax section (D) and a step-by-step dry run (G); both are enforced by `npm run audit` and by the tests.', '');

  // deck → lesson matrix
  out.push('## Archive deck coverage', '', '| Deck | Lessons that cite it | Taught as |', '|---|---|---|');
  for (const d of ARCHIVE_DECKS) {
    const citing = LESSONS.filter((l) => l.sources.includes(d.base));
    out.push(`| ${d.title} | ${citing.map((l) => `\`${l.id}\``).join(', ')} | ${d.items.map((i) => i.kind).join(', ')} |`);
    check(citing.length > 0, `deck ${d.base} not cited by any lesson`);
    for (const it of d.items) check(!!LESSON_BY_ID[it.lesson], `deck ${d.base}: item lesson ${it.lesson} missing`);
  }

  // lab coverage
  out.push('', '## Dry-run lab algorithms', '', '| Algorithm | Lesson(s) using it |', '|---|---|');
  for (const a of LAB_ALGORITHMS) {
    const ls = LESSONS.filter((l: Lesson) => l.dryRun?.algo === a.id).map((l) => `\`${l.id}\``);
    out.push(`| ${a.id} | ${ls.join(', ') || '— (lab only)'} |`);
  }

  // videos
  const keys = LESSONS.flatMap((l) => l.videos);
  const verified = keys.filter((k) => VIDEOS[k]?.kind === 'video').length;
  out.push('', '## Video resources', '', `${keys.length} video slots; **${verified} verified videos** (id, title, channel and duration retrieved from YouTube), ${keys.length - verified} labelled search links.`, '');
  out.push(`Totals check: ${totalRuns} automated Java runs are defined across lessons (examples + exercise tests).`, '');
  writeFileSync(join(outDir, 'coverage-matrix.md'), out.join('\n') + '\n');
}

// ───────────────────────── report ─────────────────────────
const keys = LESSONS.flatMap((l) => l.videos);
const verified = keys.filter((k) => VIDEOS[k]?.kind === 'video').length;
console.log(`Lessons: ${LESSONS.length}   decks: ${ARCHIVE_DECKS.length}   exercises: ${LESSONS.reduce((s, l) => s + l.practice.length, 0)}   quiz questions: ${LESSONS.reduce((s, l) => s + l.quiz.length, 0)}`);
console.log(`Videos: ${verified}/${keys.length} verified, ${keys.length - verified} search links`);
if (failures.length) {
  console.error(`\n${failures.length} audit failure(s):`);
  failures.forEach((f) => console.error(' - ' + f));
  process.exit(1);
}
console.log('Audit passed: content/*.md regenerated.');
