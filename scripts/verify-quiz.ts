// Runs every "predict the output" quiz snippet through javac/java and compares with the stored answer.
// Snippets that are statements are wrapped in a main method; snippets that already contain a main are run as-is.
// Questions whose answer is not program output (e.g. "compile error") or whose code is a class fragment with
// no entry point are listed as "not auto-verifiable" so they can be checked by eye.
//
//   npx tsx scripts/verify-quiz.ts
import { runJava } from './java-runner.mjs';
import { LESSONS } from '../src/data/lessons';

const norm = (s: string) => s.replace(/\r/g, '').split('\n').map((l) => l.trim()).filter(Boolean).join('\n');

interface Item {
  lesson: string;
  index: number;
  q: string;
  code: string;
  answer: string;
  accept: string[];
}
const items: Item[] = [];
LESSONS.forEach((l) =>
  l.quiz.forEach((q, i) => {
    if (q.type === 'output') items.push({ lesson: l.id, index: i + 1, q: q.q, code: q.code, answer: q.answer, accept: q.accept ?? [] });
  }),
);

const stripComments = (c: string) => c.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n').trim();

function wrap(code: string): string | null {
  const body = stripComments(code);
  if (!body) return 'COMMENT_ONLY';
  // members only (methods written without an enclosing class): put them in a class
  if (/^(public\s+)?static\s/.test(body)) return `import java.util.*;\npublic class Q {\n${code}\n}`;
  if (/static\s+void\s+main\s*\(/.test(code)) return code.startsWith('import') ? code : `import java.util.*;\n${code}`;
  // top-level declarations without main cannot be run
  if (/^\s*(public\s+)?(abstract\s+|final\s+)?(class|interface|enum|record)\b/m.test(code) && !/^\s*(\/\/.*)?\n?\s*[a-zA-Z<>\[\]]+\s+\w+\s*=/.test(code)) {
    // class declarations followed by statements: split at the first line that is not inside a declaration
    const lines = code.split('\n');
    let depth = 0;
    let split = -1;
    for (let i = 0; i < lines.length; i++) {
      for (const ch of lines[i]) depth += ch === '{' ? 1 : ch === '}' ? -1 : 0;
      if (depth === 0 && /\}\s*$/.test(lines[i]) && i < lines.length - 1) split = i + 1;
    }
    if (split > 0) {
      const decl = lines.slice(0, split).join('\n');
      const stmts = lines.slice(split).join('\n');
      return `import java.util.*;\n${decl}\npublic class Q {\n  public static void main(String[] args) throws Exception {\n${stmts}\n  }\n}`;
    }
    return null;
  }
  return `import java.util.*;\npublic class Q {\n  public static void main(String[] args) throws Exception {\n${code}\n  }\n}`;
}

let ok = 0;
const bad: string[] = [];
const skipped: string[] = [];
const queue = [...items];
async function worker() {
  for (;;) {
    const it = queue.shift();
    if (!it) return;
    const src = wrap(it.code);
    const tag = `${it.lesson} Q${it.index}`;
    if (!src) {
      skipped.push(`${tag}: class fragment without main`);
      continue;
    }
    if (src === 'COMMENT_ONLY') {
      skipped.push(`${tag}: hand-derivation question (code is only comments); answer: ${it.answer}`);
      continue;
    }
    const r = await runJava({ code: src, timeoutMs: 6000 });
    if (!r.ok && /cannot find symbol|Main method not found|illegal start/.test(r.stderr + r.stdout)) {
      skipped.push(`${tag}: needs context that the snippet does not contain (${r.stderr.split('\n')[0].slice(0, 70)}); answer: ${it.answer}`);
      continue;
    }
    if (!r.ok && /args\[/.test(it.code) && /ArrayIndexOutOfBounds/.test(r.stderr)) {
      skipped.push(`${tag}: needs command-line arguments given in the question text; answer: ${it.answer}`);
      continue;
    }
    if (r.ok && !/println|print\(|printf/.test(it.code)) {
      skipped.push(`${tag}: snippet prints nothing (hand-derivation); answer: ${it.answer}`);
      continue;
    }
    if (!r.ok) {
      const expectsError = /error|exception|compile|does not|won't|cannot|runs? forever/i.test(it.answer);
      if (expectsError) skipped.push(`${tag}: answer is "${it.answer.slice(0, 40)}" (${r.stage} failure is plausible)`);
      else bad.push(`${tag}: ${r.stage} failed — ${r.stderr.split('\n')[0]}\n    code: ${it.code.replace(/\n/g, ' ⏎ ').slice(0, 150)}`);
      continue;
    }
    const got = norm(r.stdout);
    const accepted = [it.answer, ...it.accept].map(norm);
    if (accepted.includes(got)) ok++;
    else bad.push(`${tag}: expected ${JSON.stringify(it.answer)} but program printed ${JSON.stringify(got)}\n    code: ${it.code.replace(/\n/g, ' ⏎ ').slice(0, 150)}`);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
console.log(`${items.length} output questions: ${ok} verified by running, ${bad.length} mismatched, ${skipped.length} not auto-verifiable`);
for (const b of bad) console.log('✗ ' + b);
for (const s of skipped) console.log('· ' + s);
process.exit(bad.length ? 1 : 0);
