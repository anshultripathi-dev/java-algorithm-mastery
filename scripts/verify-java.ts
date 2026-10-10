// Compiles (javac --release 17) and runs every Java program referenced by the curriculum,
// comparing output with sidecar .out files and every exercise's test cases.
// Usage: npm run test:java [-- filter]
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runJava, javaStatus } from './java-runner.mjs';
import { LESSONS } from '../src/data/lessons/index';
import { EXTRA_PROBLEMS } from '../src/data/problems/index';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const javaDir = path.join(root, 'java');
const filter = process.argv[2];

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}
const norm = (s: string) => s.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

type Job = { label: string; file: string; stdin: string; expected?: string };
const jobs: Job[] = [];
const all = await walk(javaDir);
const javaFiles = all.filter((f) => f.endsWith('.java')).map((f) => path.relative(javaDir, f).split(path.sep).join('/')).sort();
const read = async (rel: string) => readFile(path.join(javaDir, rel), 'utf8');

const referenced = new Set<string>();
for (const l of LESSONS) {
  for (const prog of l.programs) referenced.add(prog.file);
  for (const ex of l.practice) referenced.add(ex.solutionFile);
}
for (const pr of EXTRA_PROBLEMS) referenced.add(pr.solutionFile);

// 1) every java file: compile + run with sidecar .in/.out when present
for (const rel of javaFiles) {
  if (filter && !rel.includes(filter)) continue;
  const inP = path.join(javaDir, rel.replace(/\.java$/, '.in'));
  const outP = path.join(javaDir, rel.replace(/\.java$/, '.out'));
  const stdin = all.includes(inP) ? await readFile(inP, 'utf8') : '';
  const expected = all.includes(outP) ? await readFile(outP, 'utf8') : undefined;
  jobs.push({ label: `${rel} (program)`, file: rel, stdin, expected });
}
// 2) exercise tests
for (const l of LESSONS) {
  for (const ex of l.practice) {
    ex.tests.forEach((t, i) => {
      if (filter && !ex.solutionFile.includes(filter)) return;
      jobs.push({ label: `${ex.solutionFile} (${ex.id} test ${i + 1})`, file: ex.solutionFile, stdin: t.stdin, expected: t.stdout });
    });
  }
}
for (const pr of EXTRA_PROBLEMS) {
  pr.tests.forEach((t, i) => {
    if (filter && !pr.solutionFile.includes(filter)) return;
    jobs.push({ label: `${pr.solutionFile} (${pr.id} test ${i + 1})`, file: pr.solutionFile, stdin: t.stdin, expected: t.stdout });
  });
}

const st = await javaStatus();
if (!st.available) {
  console.error('No JDK available — cannot verify Java programs.');
  process.exit(2);
}
console.log(`Using ${st.javac}, compiling with --release ${st.release}. ${jobs.length} runs over ${javaFiles.length} files.`);

let failed = 0;
let passed = 0;
const missing = [...referenced].filter((f) => !javaFiles.includes(f));
for (const m of missing) {
  failed++;
  console.log(`✗ MISSING FILE referenced by curriculum: java/${m}`);
}

const cache = new Map<string, string>();
let idx = 0;
async function worker() {
  while (idx < jobs.length) {
    const job = jobs[idx++];
    let code = cache.get(job.file);
    if (code === undefined) {
      code = await read(job.file);
      cache.set(job.file, code);
    }
    const r = await runJava({ code, stdin: job.stdin, timeoutMs: 15000 });
    if (!r.ok) {
      failed++;
      console.log(`✗ ${job.label}: ${r.stage} error\n${r.stderr.split('\n').slice(0, 8).join('\n')}`);
    } else if (job.expected !== undefined && norm(r.stdout) !== norm(job.expected)) {
      failed++;
      console.log(`✗ ${job.label}: output mismatch\n--- expected\n${norm(job.expected)}\n--- actual\n${norm(r.stdout)}\n---`);
    } else passed++;
  }
}
await Promise.all(Array.from({ length: 4 }, worker));

const unreferenced = javaFiles.filter((f) => !referenced.has(f));
console.log(`\n${passed} runs passed, ${failed} failed.`);
if (unreferenced.length) console.log(`(${unreferenced.length} java files are not referenced by any lesson: ${unreferenced.slice(0, 8).join(', ')}${unreferenced.length > 8 ? ', …' : ''})`);
process.exit(failed ? 1 : 0);
