// Parse-checks every inline `code(...)` snippet in the lessons with javac.
// Snippets are fragments (they use variables defined elsewhere), so only SYNTAX errors are reported:
// javac stops after the parse phase when it finds one, so any message other than "cannot find symbol" /
// type errors means the fragment is not well-formed Java. Pseudocode blocks are listed for manual review.
//
//   npx tsx scripts/verify-snippets.ts
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { LESSONS } from '../src/data/lessons';
import type { Block } from '../src/lib/types';

const PARSE = /(' expected|<identifier> expected|\bexpected$|illegal start|not a statement|class, interface|unclosed|reached end of file|invalid method declaration|orphaned|without 'if'|illegal character|not expected outside)/;

function javac(dir: string, file: string): Promise<string> {
  return new Promise((resolve) => {
    const p = spawn('javac', ['--release', '17', '-proc:none', '-Xmaxerrs', '5', '-encoding', 'UTF-8', file], { cwd: dir });
    let out = '';
    p.stderr.on('data', (d) => (out += d));
    p.stdout.on('data', (d) => (out += d));
    p.on('close', () => resolve(out));
  });
}

interface Item {
  lesson: string;
  where: string;
  code: string;
}
const items: Item[] = [];
const grab = (lesson: string, where: string, blocks?: Block[]) => {
  for (const b of blocks ?? []) if (b.t === 'code') items.push({ lesson, where, code: b.code });
};
for (const l of LESSONS) {
  grab(l.id, 'intuition', l.intuition);
  grab(l.id, 'syntax', l.syntax);
  grab(l.id, 'tiny', l.tiny);
  grab(l.id, 'guided', l.guided);
  grab(l.id, 'complexity', l.complexity);
}

const HEADER = 'import java.util.*;\nimport java.io.*;\nimport java.math.*;\n';

/** Terminal sessions, console output and pseudo-code are shown in code blocks too; they are not Java. */
function notJava(it: Item): boolean {
  const first = it.code.split('\n').find((l) => l.trim() && !l.trim().startsWith('//')) ?? '';
  return /^(javac |java |brew |cd |nano |src\/|Hello\.java:|Exception in thread|\$ |\.\.\.)/.test(first.trim()) || /(returnType name\(|^greedy:|sort\(items by key\))/.test(it.code);
}

/** Split a fragment into class-level members (method declarations) and statements, by brace depth. */
function splitFragment(code: string): { members: string; statements: string; imports: string } {
  const lines = code.split('\n');
  const members: string[] = [], statements: string[] = [], imports: string[] = [];
  let depth = 0;
  let inMember = false;
  const sig = /^\s*((public|private|protected|static|final|abstract|synchronized)\s+)*[\w<>\[\], .?]+\s+\w+\s*\([^;]*\)\s*(throws [\w., ]+)?\s*\{/;
  for (const line of lines) {
    if (depth === 0 && /^\s*import\s/.test(line)) {
      imports.push(line);
      continue;
    }
    if (depth === 0 && /^\s*package\s/.test(line)) continue;
    if (depth === 0 && !inMember && (sig.test(line) || /^\s*static\s/.test(line) || /^\s*((public|private|protected|static|final|abstract)\s+)*(class|interface|enum|record)\s/.test(line)) && !/^\s*(if|for|while|switch|catch|else|try|do)\b/.test(line) && !/^\s*return\b/.test(line)) inMember = true;
    (inMember ? members : statements).push(line);
    for (const ch of line.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/.*$/g, '')) depth += ch === '{' ? 1 : ch === '}' ? -1 : 0;
    if (inMember && depth === 0) inMember = false;
  }
  return { members: members.join('\n'), statements: statements.join('\n'), imports: imports.join('\n') };
}

const wrappers: ((c: string) => string)[] = [
  (c) => {
    const f = splitFragment(c);
    return `${HEADER}${f.imports}\nclass Q {\n${f.members}\nvoid m() throws Exception {\n${f.statements}\n}\n}`;
  },
  (c) => `${HEADER}class Q {\n${c}\n}`, // members / declarations
  (c) => `${HEADER}class Q { void m() throws Exception {\n${c}\n} }`, // statements
  (c) => `${HEADER}${c}`, // whole compilation unit
];

const bad: string[] = [];
let ok = 0;
let skipped = 0;
const queue = [...items];
async function worker() {
  const dir = await mkdtemp(path.join(tmpdir(), 'jfam-snip-'));
  for (;;) {
    const it = queue.shift();
    if (!it) break;
    if (notJava(it)) {
      skipped++;
      continue;
    }
    let best = '';
    let good = false;
    for (const w of wrappers) {
      // a public class in the snippet must not clash with the file name: rename via a neutral file name
      const src = w(it.code);
      const cls = (src.match(/public\s+(?:final\s+|abstract\s+)*(?:class|interface|enum|record)\s+([A-Za-z_]\w*)/) ?? [])[1];
      const file = `${cls ?? 'Q'}.java`;
      await writeFile(path.join(dir, file), src, 'utf8');
      const out = await javac(dir, file);
      const parseErrs = out.split('\n').filter((l) => /error:/.test(l) && PARSE.test(l));
      if (!parseErrs.length) {
        good = true;
        break;
      }
      if (!best) best = parseErrs[0].replace(/^.*error: /, '');
    }
    if (good) ok++;
    else bad.push(`${it.lesson} [${it.where}]: ${best}\n    ${it.code.split('\n').slice(0, 3).join(' ⏎ ').slice(0, 140)}`);
  }
  await rm(dir, { recursive: true, force: true });
}
await Promise.all(Array.from({ length: 4 }, worker));
console.log(`${items.length} inline snippets: ${ok} parse as Java, ${skipped} are terminal sessions / pseudo-code, ${bad.length} do not parse`);
for (const b of bad) console.log('✗ ' + b);
