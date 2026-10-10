// Authoring helper: run java files (using Name.in as stdin), print the output for HUMAN review,
// and with --write store it as Name.out. Usage: node scripts/bless.mjs <folder-or-file...> [--write]
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { runJava } from './java-runner.mjs';

const args = process.argv.slice(2);
const write = args.includes('--write');
const targets = args.filter((a) => !a.startsWith('--'));

async function files(t) {
  const s = await stat(t);
  if (!s.isDirectory()) return [t];
  const out = [];
  for (const e of await readdir(t, { withFileTypes: true })) {
    const p = path.join(t, e.name);
    if (e.isDirectory()) out.push(...(await files(p)));
    else if (p.endsWith('.java')) out.push(p);
  }
  return out.sort();
}
for (const t of targets) {
  for (const f of await files(t)) {
    const code = await readFile(f, 'utf8');
    const inP = f.replace(/\.java$/, '.in');
    const stdin = await readFile(inP, 'utf8').catch(() => '');
    const r = await runJava({ code, stdin, timeoutMs: 20000 });
    console.log(`\n━━ ${f}${stdin ? `   [stdin: ${JSON.stringify(stdin.slice(0, 60))}]` : ''}`);
    if (!r.ok) {
      console.log(`✗ ${r.stage}:\n${r.stderr}`);
      continue;
    }
    console.log(r.stdout.replace(/\n$/, ''));
    if (write) await writeFile(f.replace(/\.java$/, '.out'), r.stdout);
  }
}
