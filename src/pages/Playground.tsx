import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Loader2, Play, RotateCcw, Terminal, XCircle } from 'lucide-react';
import { getJavaIO, getJavaSource, listJavaSources } from '@/lib/java-sources';
import { LESSONS } from '@/data/lessons';
import { CodeEditor } from '@/components/CodeEditor';
import { CopyButton, IoBox } from '@/components/Rich';
import { PageHeader } from '@/components/ui';
import { LOCAL_RUN_HELP, norm, runJavaCode, runnerStatus, type RunResponse, type RunnerStatus } from '@/features/code-playground/runner';
import { useSettings } from '@/lib/store';

const HELLO = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
`;

export function RunnerBanner({ status }: { status: RunnerStatus | null | undefined }) {
  if (status === undefined) return null;
  if (status?.available) return <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Local runner ready — your code is compiled with <code>javac --release {status.release}</code> on this computer ({status.javac}). Nothing is sent to the internet.</div>;
  return (
    <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/40">
      <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 text-amber-600" /> Code execution is not available right now</div>
      <p className="mt-1">
        {status === null ? 'This page is not being served by the local runner (for example it was opened from static hosting). ' : 'No JDK was found on this computer. '}
        Run the app with <code className="kbd">npm run dev</code> (or <code className="kbd">npm start</code>) on a machine with a JDK 17+ to run code here. You can always copy the code and run it in a terminal:
      </p>
      <pre className="mt-2 overflow-x-auto rounded bg-white/70 p-2 font-mono text-xs dark:bg-black/30">{LOCAL_RUN_HELP}</pre>
    </div>
  );
}

export function Playground() {
  const [sp, setSp] = useSearchParams();
  const file = sp.get('file') ?? '';
  const settings = useSettings();
  const [status, setStatus] = useState<RunnerStatus | null | undefined>(undefined);
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [res, setRes] = useState<RunResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const original = useRef('');

  const options = useMemo(() => {
    const byFile = new Map<string, string>();
    for (const l of LESSONS) for (const p of l.programs) byFile.set(p.file, `${l.title} — ${p.title}`);
    return listJavaSources().filter((f) => byFile.has(f)).map((f) => ({ file: f, label: byFile.get(f)! }));
  }, []);

  useEffect(() => {
    runnerStatus().then(setStatus);
  }, []);
  useEffect(() => {
    let src = HELLO;
    let inp = '';
    if (file) {
      try {
        src = getJavaSource(file);
        inp = getJavaIO(file).in ?? '';
      } catch {
        /* unknown file → hello */
      }
    }
    original.current = src;
    setCode(src);
    setStdin(inp);
    setRes(null);
  }, [file]);

  const io = file ? getJavaIO(file) : {};
  const expectedOk = res?.ok && io.out !== undefined && norm(stdin) === norm(io.in ?? '') ? norm(res.stdout) === norm(io.out) : null;

  async function run() {
    setBusy(true);
    setRes(await runJavaCode(code, stdin));
    setBusy(false);
  }

  return (
    <div>
      <PageHeader title="Code playground" subtitle="Edit any program from the lessons, give it input, and run it with a real Java compiler on your own machine." />
      <RunnerBanner status={status} />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select className="input max-w-md" value={file} onChange={(e) => setSp(e.target.value ? { file: e.target.value } : {})} aria-label="Choose a lesson program">
          <option value="">Blank program (Hello, Java!)</option>
          {options.map((o) => <option key={o.file} value={o.file}>{o.label}</option>)}
        </select>
        <button className="btn-primary" disabled={busy || !status?.available} onClick={run}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run
        </button>
        <button className="btn-ghost" onClick={() => { setCode(original.current); setRes(null); }}><RotateCcw className="h-4 w-4" /> Reset code</button>
        <CopyButton text={code} label="Copy code" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <CodeEditor value={code} onChange={setCode} fontSize={settings.codeFontSize} minRows={18} />
        </div>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Program input (stdin)</span>
            <textarea className="input h-24 font-mono" value={stdin} onChange={(e) => setStdin(e.target.value)} spellCheck={false} placeholder="Type the input your program reads with Scanner…" />
          </label>
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-slate-500"><Terminal className="h-3.5 w-3.5" /> Output {res && <span className="font-normal normal-case">({res.ms} ms)</span>}</div>
            <pre className="min-h-24 overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-3 font-mono text-[13px] leading-5 text-slate-100 dark:border-slate-800" aria-live="polite">{res ? res.stdout || (res.ok ? '(no output)' : '') : 'Press Run to compile and execute.'}</pre>
          </div>
          {res && !res.ok && (
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-rose-600"><XCircle className="h-3.5 w-3.5" /> {res.stage === 'compile' ? 'Compile error' : res.stage === 'run' ? 'Runtime error' : 'Setup problem'}</div>
              <pre className="overflow-auto rounded-lg border border-rose-300 bg-rose-50 p-3 font-mono text-[13px] leading-5 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">{res.stderr}</pre>
            </div>
          )}
          {expectedOk !== null && (
            <div className={`rounded-lg px-3 py-2 text-sm ${expectedOk ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'}`}>
              {expectedOk ? 'Output matches the lesson’s expected output for the sample input.' : 'Output differs from the lesson’s expected output for the sample input.'}
            </div>
          )}
          {io.out !== undefined && (
            <details>
              <summary className="text-sm font-medium">Expected output for the sample input</summary>
              <div className="mt-2"><IoBox title="Expected" text={io.out} /></div>
            </details>
          )}
          <div className="text-xs text-slate-500">
            How it runs: the code is saved as <code>ClassName.java</code> in a temp folder, compiled with <code>javac --release 17</code> and started with <code>java</code>; limits: 8 s, 64 KB output. See <Link className="underline" to="/settings">Settings</Link> for runner details.
          </div>
        </div>
      </div>
    </div>
  );
}
