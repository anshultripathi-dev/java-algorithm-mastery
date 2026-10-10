export interface RunnerStatus {
  available: boolean;
  javac: string | null;
  java: string | null;
  release: string;
}
export interface RunResponse {
  ok: boolean;
  stage: 'setup' | 'compile' | 'run';
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  ms: number;
}

/** Asks the local server whether a JDK is available. Returns null when there is no runner at all (static hosting). */
export async function runnerStatus(): Promise<RunnerStatus | null> {
  try {
    const r = await fetch('/api/java/status', { cache: 'no-store' });
    if (!r.ok || !(r.headers.get('content-type') ?? '').includes('json')) return null;
    return (await r.json()) as RunnerStatus;
  } catch {
    return null;
  }
}

export async function runJavaCode(code: string, stdin: string, timeoutMs = 8000): Promise<RunResponse> {
  try {
    const r = await fetch('/api/java/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, stdin, timeoutMs }),
    });
    return (await r.json()) as RunResponse;
  } catch (e) {
    return { ok: false, stage: 'setup', stdout: '', stderr: 'Could not reach the local Java runner: ' + String(e), exitCode: null, timedOut: false, ms: 0 };
  }
}

export const norm = (s: string) =>
  s
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');

export const LOCAL_RUN_HELP = `# 1. Save your code as Main.java (the file name must match the public class)
# 2. Compile
javac Main.java
# 3. Run (type input, then press Ctrl-D on macOS to end it)
java Main
# or feed an input file
java Main < input.txt`;
