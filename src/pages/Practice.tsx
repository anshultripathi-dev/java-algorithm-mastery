import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2, Play, Eye } from 'lucide-react';
import { LESSONS } from '@/data/lessons';
import { EXTRA_PROBLEMS } from '@/data/problems';
import { MODULES } from '@/data/curriculum/modules';
import type { Exercise } from '@/lib/types';
import { actions, useProgress, useSettings } from '@/lib/store';
import { CodeEditor } from '@/components/CodeEditor';
import { ExerciseBody, HintsAndSolution } from '@/components/ExerciseCard';
import { PageHeader } from '@/components/ui';
import { RunnerBanner } from './Playground';
import { norm, runJavaCode, runnerStatus, type RunnerStatus } from '@/features/code-playground/runner';

interface Item {
  ex: Exercise;
  topic: string;
  lessonId?: string;
  module: string;
}

const STARTER = `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // read the input described in the problem, then print the answer
    }
}
`;

function Workspace({ item, status }: { item: Item; status: RunnerStatus | null | undefined }) {
  const progress = useProgress();
  const settings = useSettings();
  const ep = progress.exercises[item.ex.id];
  const [code, setCode] = useState(ep?.lastCode ?? item.ex.starter ?? STARTER);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<{ ok: boolean; got: string; stage?: string; err?: string }[] | null>(null);
  useEffect(() => {
    setCode(progress.exercises[item.ex.id]?.lastCode ?? item.ex.starter ?? STARTER);
    setResults(null);
  }, [item.ex.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function runTests() {
    setBusy(true);
    const out: { ok: boolean; got: string; stage?: string; err?: string }[] = [];
    for (const t of item.ex.tests) {
      const r = await runJavaCode(code, t.stdin);
      if (!r.ok) {
        out.push({ ok: false, got: r.stdout, stage: r.stage, err: r.stderr });
        if (r.stage === 'compile' || r.stage === 'setup') break;
      } else out.push({ ok: norm(r.stdout) === norm(t.stdout), got: r.stdout });
    }
    setResults(out);
    setBusy(false);
    actions.recordAttempt(item.ex.id, out.length === item.ex.tests.length && out.every((o) => o.ok), code);
  }

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="text-xl font-bold">{item.ex.title}</h2>
        <div className="mb-3 text-xs text-slate-500">{item.topic} · {item.ex.level}</div>
        <ExerciseBody ex={item.ex} />
        <HintsAndSolution ex={item.ex} />
      </div>
      <RunnerBanner status={status} />
      <CodeEditor value={code} onChange={(v) => { setCode(v); actions.saveDraft(item.ex.id, v); }} fontSize={settings.codeFontSize} minRows={16} />
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-primary" disabled={busy || !status?.available} onClick={runTests}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run {item.ex.tests.length} tests
        </button>
        <button className="btn-ghost" onClick={() => setCode(item.ex.starter ?? STARTER)}>Reset to starter</button>
        {!status?.available && !ep?.solved && (
          <button className="btn-ghost" onClick={() => actions.patchExercise(item.ex.id, { solved: true })} title="Use this only if you ran it yourself in a terminal">
            <CheckCircle2 className="h-4 w-4" /> I solved it locally (self-reported)
          </button>
        )}
        <span className="text-xs text-slate-500">attempts: {ep?.attempts ?? 0}{ep?.solved ? ' · solved' : ''}</span>
      </div>
      {results && (
        <div className="card p-4">
          <div className="mb-2 font-semibold">
            {results.length === item.ex.tests.length && results.every((r) => r.ok) ? '✅ All tests passed' : `❌ ${results.filter((r) => r.ok).length} of ${item.ex.tests.length} tests passed`}
          </div>
          <ul className="space-y-2 text-sm">
            {results.map((r, i) => (
              <li key={i} className="rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                <div className="flex items-center gap-2 font-medium">{r.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-rose-500" />} Test {i + 1}</div>
                {!r.ok && (
                  <div className="mt-1 grid gap-2 sm:grid-cols-2">
                    <div>
                      <div className="text-xs text-slate-500">Input</div>
                      <pre className="rounded bg-slate-100 p-2 font-mono text-xs dark:bg-slate-900">{item.ex.tests[i].stdin}</pre>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Expected</div>
                      <pre className="rounded bg-slate-100 p-2 font-mono text-xs dark:bg-slate-900">{item.ex.tests[i].stdout}</pre>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-xs text-slate-500">{r.err ? `${r.stage} error` : 'Your output'}</div>
                      <pre className="overflow-auto rounded bg-rose-50 p-2 font-mono text-xs text-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{r.err || r.got || '(empty)'}</pre>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Practice() {
  const [sp, setSp] = useSearchParams();
  const progress = useProgress();
  const [status, setStatus] = useState<RunnerStatus | null | undefined>(undefined);
  useEffect(() => {
    runnerStatus().then(setStatus);
  }, []);
  const items: Item[] = useMemo(() => {
    const list: Item[] = [];
    for (const l of LESSONS) for (const ex of l.practice) list.push({ ex, topic: l.title, lessonId: l.id, module: l.module });
    for (const pr of EXTRA_PROBLEMS) list.push({ ex: pr, topic: pr.topic, lessonId: pr.lesson, module: 'm5' });
    return list;
  }, []);
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('all');
  const [mod, setMod] = useState('all');
  const [stat, setStat] = useState('all');
  const filtered = items.filter(
    (it) =>
      (level === 'all' || it.ex.level === level) &&
      (mod === 'all' || it.module === mod) &&
      (stat === 'all' || (stat === 'solved') === !!progress.exercises[it.ex.id]?.solved) &&
      (!q || `${it.ex.title} ${it.topic}`.toLowerCase().includes(q.toLowerCase())),
  );
  const sel = items.find((i) => i.ex.id === sp.get('problem'));
  const solved = items.filter((i) => progress.exercises[i.ex.id]?.solved).length;

  return (
    <div>
      <PageHeader title="Practice arena" subtitle={`${items.length} problems from every lesson, easiest first. ${solved} solved. Hints are progressive; solutions stay hidden until you ask.`} />
      <div className="grid gap-5 lg:grid-cols-[22rem_1fr]">
        <aside>
          <div className="card mb-3 grid gap-2 p-3">
            <input className="input" placeholder="Search problems…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search problems" />
            <div className="grid grid-cols-3 gap-2">
              <select className="input" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Difficulty">
                <option value="all">Any level</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="challenge">Challenge</option>
              </select>
              <select className="input" value={mod} onChange={(e) => setMod(e.target.value)} aria-label="Module">
                <option value="all">All modules</option>
                {MODULES.map((m) => <option key={m.id} value={m.id}>{m.id.toUpperCase()}</option>)}
              </select>
              <select className="input" value={stat} onChange={(e) => setStat(e.target.value)} aria-label="Status">
                <option value="all">Any</option><option value="solved">Solved</option><option value="unsolved">Unsolved</option>
              </select>
            </div>
          </div>
          <ul className="max-h-[70vh] space-y-1.5 overflow-y-auto pr-1">
            {filtered.map((it) => {
              const e = progress.exercises[it.ex.id];
              return (
                <li key={it.ex.id}>
                  <button onClick={() => setSp({ problem: it.ex.id })} className={`flex w-full items-start gap-2 rounded-lg border p-2.5 text-left text-sm ${sel?.ex.id === it.ex.id ? 'border-brand-500 bg-brand-50 dark:bg-indigo-950/40' : 'border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900'}`}>
                    {e?.solved ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : e?.attempts ? <Eye className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />}
                    <span>
                      <span className="block font-medium">{it.ex.title}</span>
                      <span className="block text-xs text-slate-500">{it.topic} · {it.ex.level}</span>
                    </span>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && <li className="p-4 text-center text-sm text-slate-500">No problems match.</li>}
          </ul>
        </aside>
        <section>
          {sel ? (
            <>
              {sel.lessonId && <div className="mb-2 text-sm"><Link className="text-brand-700 underline dark:text-indigo-300" to={`/lesson/${sel.lessonId}`}>← Review the lesson</Link></div>}
              <Workspace item={sel} status={status} />
            </>
          ) : (
            <div className="card p-8 text-center text-slate-500">Choose a problem on the left to start. Tests run on your own computer with a real Java compiler.</div>
          )}
        </section>
      </div>
    </div>
  );
}
