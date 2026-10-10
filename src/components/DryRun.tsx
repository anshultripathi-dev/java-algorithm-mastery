import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, Play, Pause } from 'lucide-react';
import { LAB_BY_ID } from '@/features/dry-run-lab/registry';
import type { LabAlgorithm, Mark, TraceStep } from '@/features/dry-run-lab/types';

const MARK_CLS: Record<Mark, string> = {
  cur: 'border-brand-500 bg-brand-100 dark:bg-indigo-900/50',
  done: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
  found: 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200',
  dim: 'border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900',
  swap: 'border-amber-500 bg-amber-100 dark:bg-amber-900/40',
  bad: 'border-rose-300 bg-rose-100 text-rose-700 line-through dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
};

function ArrayView({ a }: { a: NonNullable<TraceStep['arrays']>[number] }) {
  const start = a.indexStart ?? 0;
  return (
    <div className="mb-3">
      <div className="mb-1 text-xs font-medium text-slate-500">{a.name}</div>
      <div className="flex flex-wrap gap-1">
        {a.values.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-1.5 font-mono text-sm ${a.marks?.[i] ? MARK_CLS[a.marks[i]] : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>{String(v)}</div>
            <div className="text-[10px] text-slate-400">{start + i}</div>
            <div className="h-4 text-[10px] font-semibold text-brand-600">{a.pointers?.[i] ?? ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridView({ g }: { g: NonNullable<TraceStep['grid']> }) {
  return (
    <div className="mb-3">
      {g.caption && <div className="mb-1 text-xs font-medium text-slate-500">{g.caption}</div>}
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${g.cells[0]?.length ?? 1}, minmax(2.25rem, auto))` }}>
        {g.cells.map((row, r) =>
          row.map((c, col) => {
            const m = g.marks?.[`${r},${col}`];
            return (
              <div key={`${r}-${col}`} className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-1 font-mono text-sm ${m ? MARK_CLS[m] : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                {c}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

/** Interactive step-through of a lab algorithm. */
export function Stepper({ algo, input, compact = false }: { algo: LabAlgorithm; input: Record<string, string>; compact?: boolean }) {
  const res = useMemo(() => algo.run(input), [algo, input]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    setI(0);
    setPlaying(false);
  }, [res]);
  useEffect(() => {
    if (!playing) return;
    if (i >= res.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((x) => x + 1), 900);
    return () => clearTimeout(t);
  }, [playing, i, res.steps.length]);

  if (res.error) return <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">{res.error}</div>;
  const step = res.steps[Math.min(i, res.steps.length - 1)];
  const last = i >= res.steps.length - 1;

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
        <button className="btn-ghost btn-sm" onClick={() => setI(0)} aria-label="First step" disabled={i === 0}><SkipBack className="h-3.5 w-3.5" /></button>
        <button className="btn-ghost btn-sm" onClick={() => setI((x) => Math.max(0, x - 1))} aria-label="Previous step" disabled={i === 0}><ChevronLeft className="h-3.5 w-3.5" /></button>
        <button className="btn-primary btn-sm" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{playing ? 'Pause' : 'Play'}</button>
        <button className="btn-ghost btn-sm" onClick={() => setI((x) => Math.min(res.steps.length - 1, x + 1))} aria-label="Next step" disabled={last}><ChevronRight className="h-3.5 w-3.5" /></button>
        <button className="btn-ghost btn-sm" onClick={() => setI(res.steps.length - 1)} aria-label="Last step" disabled={last}><SkipForward className="h-3.5 w-3.5" /></button>
        <span className="ml-auto text-xs text-slate-500">
          step {i + 1} / {res.steps.length}
        </span>
      </div>
      <div className={`grid gap-0 ${compact ? '' : 'md:grid-cols-[minmax(0,13rem)_1fr]'}`}>
        <pre className="border-b border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-6 md:border-b-0 md:border-r dark:border-slate-800 dark:bg-slate-900/60">
          {algo.pseudocode.map((l, n) => (
            <div key={n} className={`whitespace-pre rounded px-1 ${step.line === n ? 'bg-brand-100 font-semibold text-brand-700 dark:bg-indigo-900/50 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>
              {l}
            </div>
          ))}
        </pre>
        <div className="p-4">
          <p className="mb-3 text-sm leading-6" aria-live="polite">{step.note}</p>
          {step.arrays?.map((a, k) => <ArrayView key={k} a={a} />)}
          {step.grid && <GridView g={step.grid} />}
          <div className="flex flex-wrap gap-2">
            {Object.entries(step.vars).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-200 px-2.5 py-1 dark:border-slate-700">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{k}</div>
                <div className="font-mono text-sm font-semibold">{String(v)}</div>
              </div>
            ))}
          </div>
          {last && <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">Result: {res.result}</div>}
        </div>
      </div>
    </div>
  );
}

/** A lesson's canonical dry run with editable inputs. */
export function LessonDryRun({ algoId, input, caption }: { algoId: string; input: Record<string, string>; caption: string }) {
  const algo = LAB_BY_ID[algoId];
  const [vals, setVals] = useState(input);
  if (!algo) return null;
  return (
    <div className="my-4">
      <div className="mb-2 flex flex-wrap items-end gap-3">
        {algo.inputs.map((inp) => (
          <label key={inp.key} className="text-xs text-slate-500">
            {inp.label}
            <input className="input mt-0.5 w-32 font-mono" value={vals[inp.key] ?? inp.default} onChange={(e) => setVals((v) => ({ ...v, [inp.key]: e.target.value }))} />
          </label>
        ))}
        <button className="btn-ghost btn-sm" onClick={() => setVals(input)}>Reset to lesson example</button>
      </div>
      <Stepper algo={algo} input={vals} />
      <p className="mt-2 text-xs text-slate-500">{caption}</p>
    </div>
  );
}

/** Static table version of a trace (used for printing and for PDF parity). */
export function traceTable(algo: LabAlgorithm, input: Record<string, string>) {
  const r = algo.run(input);
  const cols: string[] = [];
  r.steps.forEach((s) => Object.keys(s.vars).forEach((k) => !cols.includes(k) && cols.push(k)));
  return { cols, rows: r.steps.map((s, n) => [String(n + 1), ...cols.map((c) => String(s.vars[c] ?? '')), s.note]), result: r.result, error: r.error };
}
