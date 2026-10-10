// Local Java compile-and-run helper used by the code playground (dev server / `npm start`).
// It shells out to the JDK installed on THIS machine; nothing is sent to any external service.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const JAVA_RELEASE = '17';
const MAX_OUTPUT = 64 * 1024;

function exec(cmd, args, { cwd, stdin = '', timeoutMs = 10000 } = {}) {
  return new Promise((resolve) => {
    const started = Date.now();
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let truncated = false;
    let child;
    try {
      child = spawn(cmd, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      resolve({ code: -1, stdout: '', stderr: String(e), timedOut: false, truncated: false, ms: 0, spawnFailed: true });
      return;
    }
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);
    const take = (which) => (buf) => {
      const s = buf.toString('utf8');
      if (which === 'out') {
        if (stdout.length < MAX_OUTPUT) stdout += s;
        else truncated = true;
      } else if (stderr.length < MAX_OUTPUT) stderr += s;
    };
    child.stdout.on('data', take('out'));
    child.stderr.on('data', take('err'));
    child.on('error', (e) => {
      clearTimeout(timer);
      resolve({ code: -1, stdout, stderr: stderr + String(e), timedOut, truncated, ms: Date.now() - started, spawnFailed: true });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut, truncated, ms: Date.now() - started });
    });
    child.stdin.on('error', () => {});
    child.stdin.end(stdin);
  });
}

let cachedStatus;
/** Reports whether javac/java are usable on this machine. */
export async function javaStatus(force = false) {
  if (cachedStatus && !force) return cachedStatus;
  const j = await exec('javac', ['-version'], { timeoutMs: 8000 });
  const r = await exec('java', ['-version'], { timeoutMs: 8000 });
  const available = !j.spawnFailed && !r.spawnFailed && j.code === 0 && r.code === 0;
  cachedStatus = {
    available,
    javac: (j.stdout + j.stderr).trim().split('\n')[0] || null,
    java: (r.stdout + r.stderr).trim().split('\n')[0] || null,
    release: JAVA_RELEASE,
  };
  return cachedStatus;
}

export function detectMainClass(code) {
  const pub = code.match(/public\s+(?:final\s+|abstract\s+)*class\s+([A-Za-z_]\w*)/);
  if (pub) return pub[1];
  // class that declares main
  const re = /class\s+([A-Za-z_]\w*)[^{]*\{/g;
  let m;
  while ((m = re.exec(code))) {
    const body = code.slice(m.index);
    if (/static\s+void\s+main\s*\(/.test(body)) return m[1];
  }
  const any = code.match(/class\s+([A-Za-z_]\w*)/);
  return any ? any[1] : 'Main';
}

/**
 * Compile (javac --release 17) and run a single-file Java program.
 * Returns { ok, stage, stdout, stderr, exitCode, timedOut, ms }.
 */
export async function runJava({ code, stdin = '', timeoutMs = 8000, args = [] }) {
  const status = await javaStatus();
  if (!status.available) {
    return { ok: false, stage: 'setup', stdout: '', stderr: 'No JDK found on this machine (javac/java not on PATH). Install a JDK 17+ and restart.', exitCode: -1, timedOut: false, ms: 0 };
  }
  if (typeof code !== 'string' || code.length > 200_000) {
    return { ok: false, stage: 'setup', stdout: '', stderr: 'Code missing or too large.', exitCode: -1, timedOut: false, ms: 0 };
  }
  const cls = detectMainClass(code);
  const dir = await mkdtemp(path.join(tmpdir(), 'jfam-'));
  try {
    await writeFile(path.join(dir, `${cls}.java`), code, 'utf8');
    const c = await exec('javac', ['--release', JAVA_RELEASE, '-encoding', 'UTF-8', '-Xlint:-options', `${cls}.java`], { cwd: dir, timeoutMs: 30000 });
    if (c.code !== 0) {
      const msg = (c.stderr || c.stdout).replaceAll(dir + path.sep, '');
      return { ok: false, stage: 'compile', stdout: '', stderr: msg, exitCode: c.code, timedOut: c.timedOut, ms: c.ms };
    }
    const r = await exec('java', ['-Xmx256m', '-Xss16m', '-cp', dir, cls, ...args], { cwd: dir, stdin, timeoutMs });
    let stderr = r.stderr.replaceAll(dir + path.sep, '');
    if (r.timedOut) stderr += `\n[Stopped: exceeded ${timeoutMs / 1000}s time limit — check for an infinite loop or very slow algorithm.]`;
    if (r.truncated) stderr += '\n[Output truncated at 64 KB.]';
    return { ok: r.code === 0 && !r.timedOut, stage: 'run', stdout: r.stdout, stderr, exitCode: r.code, timedOut: r.timedOut, ms: c.ms + r.ms, mainClass: cls };
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/** Express/Connect-style handler shared by the Vite dev server and scripts/server.mjs */
export function javaApiMiddleware() {
  const allowedHost = /^(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/;
  return async (req, res, next) => {
    const url = (req.url || '').split('?')[0];
    if (url !== '/api/java/status' && url !== '/api/java/run') return next();
    const host = req.headers.host || '';
    const origin = req.headers.origin;
    if (!allowedHost.test(host) || (origin && !allowedHost.test(new URL(origin).host))) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (url === '/api/java/status') {
        res.end(JSON.stringify(await javaStatus()));
        return;
      }
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'POST only' }));
        return;
      }
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 400_000) throw new Error('Request too large');
      }
      const { code, stdin, timeoutMs } = JSON.parse(body || '{}');
      const t = Math.min(Math.max(Number(timeoutMs) || 8000, 1000), 20000);
      res.end(JSON.stringify(await runJava({ code, stdin: typeof stdin === 'string' ? stdin : '', timeoutMs: t })));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ ok: false, stage: 'setup', stdout: '', stderr: String(e), exitCode: -1, timedOut: false, ms: 0 }));
    }
  };
}
