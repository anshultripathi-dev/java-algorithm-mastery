import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LAB_ALGORITHMS, LAB_BY_ID } from '@/features/dry-run-lab/registry';
import { GROWTH, LOOP_SNIPPETS, RECURSION_DEMOS, fmtBig, type CallNode } from '@/features/dry-run-lab/complexity';
import { Stepper } from '@/components/DryRun';
import { CodeView } from '@/components/Rich';
import { PageHeader } from '@/components/ui';
import { LESSON_BY_ID } from '@/data/lessons';
import { MODULES } from '@/data/curriculum/modules';

const GROUPED = MODULES.map((m) => ({ m, algos: LAB_ALGORITHMS.filter((a) => LESSON_BY_ID[a.lesson]?.module === m.id) })).filter((g) => g.algos.length);

function DryRunTab() {
  const [sp, setSp] = useSearchParams();
  const id = sp.get('algo') ?? LAB_ALGORITHMS[0].id;
  const algo = LAB_BY_ID[id] ?? LAB_ALGORITHMS[0];
  const [vals, setVals] = useState<Record<string, Record<string, string>>>({});
  const input = { ...Object.fromEntries(algo.inputs.map((i) => [i.key, i.default])), ...(vals[algo.id] ?? {}) };
  return (
    <div>
      <div className="mb-4 grid gap-3 md:grid-cols-[18rem_1fr]">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Algorithm</span>
          <select className="input" value={algo.id} onChange={(e) => setSp({ algo: e.target.value })}>
            {GROUPED.map(({ m, algos }) => (
              <optgroup key={m.id} label={m.title}>
                {algos.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap items-end gap-3">
          {algo.inputs.map((inp) => (
            <label key={inp.key} className="text-xs text-slate-500">
              {inp.label}
              <input className="input mt-0.5 w-40 font-mono" value={input[inp.key]} onChange={(e) => setVals((v) => ({ ...v, [algo.id]: { ...(v[algo.id] ?? {}), [inp.key]: e.target.value } }))} />
            </label>
          ))}
          <button className="btn-ghost btn-sm" onClick={() => setVals((v) => ({ ...v, [algo.id]: {} }))}>Reset inputs</button>
        </div>
      </div>
      <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{algo.summary} · <Link className="text-brand-700 underline dark:text-indigo-300" to={`/lesson/${algo.lesson}`}>open the lesson</Link></p>
      <Stepper algo={algo} input={input} />
    </div>
  );
}

function ComplexityTab() {
  const [snippetId, setSnippetId] = useState(LOOP_SNIPPETS[0].id);
  const sn = LOOP_SNIPPETS.find((s) => s.id === snippetId)!;
  const [n, setN] = useState(100);
  const nn = Math.min(Math.max(2, Math.floor(n)), sn.maxN);
  const counts = useMemo(() => [10, 100, 1000, 10000].filter((v) => v <= sn.maxN).map((v) => [v, sn.count(v)] as const), [sn]);
  const measured = useMemo(() => sn.count(nn), [sn, nn]);
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-2 text-lg font-semibold">Count the iterations of real loops</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Loop pattern</span>
              <select className="input" value={snippetId} onChange={(e) => setSnippetId(e.target.value)}>
                {LOOP_SNIPPETS.map((s) => <option key={s.id} value={s.id}>{s.title} — {s.bigO}</option>)}
              </select>
            </label>
            <CodeView code={sn.java} />
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium uppercase text-slate-500">n = {nn.toLocaleString()} (max {sn.maxN.toLocaleString()} for this pattern)</span>
              <input type="range" min={2} max={Math.min(sn.maxN, 5000)} value={Math.min(nn, 5000)} onChange={(e) => setN(+e.target.value)} className="w-full" />
              <input type="number" className="input mt-1 w-40" value={n} onChange={(e) => setN(+e.target.value)} />
            </label>
          </div>
          <div className="card p-4">
            <div className="text-xs font-medium uppercase text-slate-500">Measured: the loop body runs</div>
            <div className="mt-1 text-3xl font-bold tabular-nums">{measured.toLocaleString('en-US')}</div>
            <div className="text-sm text-slate-500">times for n = {nn.toLocaleString()}</div>
            <div className="mt-4 rounded-lg bg-brand-50 p-3 text-sm dark:bg-indigo-950/40"><strong>{sn.bigO}</strong> — {sn.why}</div>
            <table className="mt-4 w-full text-sm">
              <thead><tr className="text-left text-xs uppercase text-slate-500"><th className="py-1">n</th><th>iterations</th><th>iterations ÷ n</th></tr></thead>
              <tbody>
                {counts.map(([v, c]) => (
                  <tr key={v} className="border-t border-slate-200 font-mono dark:border-slate-800"><td className="py-1">{v.toLocaleString()}</td><td>{c.toLocaleString()}</td><td>{(c / v).toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-slate-500">Watch how “iterations ÷ n” behaves as n grows ×10: constant → O(n); growing ×10 → O(n²); growing slowly → O(log n) factor.</p>
          </div>
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-lg font-semibold">How the common classes grow</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase dark:bg-slate-800"><tr><th className="px-3 py-2">class</th><th className="px-3 py-2">n = 10</th><th className="px-3 py-2">n = 100</th><th className="px-3 py-2">n = 1,000</th><th className="px-3 py-2">n = 10⁶</th><th className="px-3 py-2">typical example</th></tr></thead>
            <tbody>
              {GROWTH.map((g) => (
                <tr key={g.id} className="border-t border-slate-200 font-mono dark:border-slate-800">
                  <td className="px-3 py-2 font-semibold">{g.label}</td>
                  {[10, 100, 1000, 1e6].map((v) => <td key={v} className="px-3 py-2">{g.id === '2n' && v > 1000 ? '—' : g.id === 'nfact' && v > 100 ? '—' : g.id === '2n' && v > 100 ? '≈ 10^301' : g.id === 'nfact' && v > 20 ? '≈ 10^157' : fmtBig(g.f(v))}</td>)}
                  <td className="px-3 py-2 font-sans text-xs">{g.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GrowthChart />
      </section>
    </div>
  );
}

function GrowthChart() {
  const ns = Array.from({ length: 24 }, (_, i) => i + 1);
  const W = 560, H = 260, P = 34;
  const top = 1000;
  const x = (n: number) => P + ((n - 1) / 23) * (W - 2 * P);
  const y = (v: number) => H - P - (Math.log10(Math.max(1, Math.min(v, top))) / Math.log10(top)) * (H - 2 * P);
  const cols = ['#64748b', '#0ea5e9', '#14b8a6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#a855f7', '#6366f1'];
  return (
    <figure className="mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" role="img" aria-label="Growth of operation counts for n from 1 to 24, log scale">
        {[1, 10, 100, 1000].map((v) => (
          <g key={v}>
            <line x1={P} x2={W - P} y1={y(v)} y2={y(v)} className="stroke-slate-200 dark:stroke-slate-800" />
            <text x={4} y={y(v) + 4} fontSize="10" className="fill-slate-500">{v}</text>
          </g>
        ))}
        {GROWTH.map((g, gi) => (
          <polyline key={g.id} fill="none" stroke={cols[gi]} strokeWidth="2" points={ns.map((n) => `${x(n)},${y(g.f(n))}`).join(' ')} />
        ))}
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="10" className="fill-slate-500">n (1 … 24) — operations on a log scale, capped at 1000</text>
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-3 text-xs">
        {GROWTH.map((g, gi) => (
          <span key={g.id} className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded" style={{ background: cols[gi] }} />{g.label}</span>
        ))}
      </figcaption>
    </figure>
  );
}

function Tree({ node, depth = 0 }: { node: CallNode; depth?: number }) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[13px]" style={{ paddingLeft: depth * 18 }}>
        <span className="text-slate-400">{depth ? '└─' : ''}</span>
        <span>{node.label}</span>
        <span className="rounded bg-emerald-100 px-1.5 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">→ {node.result}</span>
      </div>
      {node.children.map((c, i) => <Tree key={i} node={c} depth={depth + 1} />)}
    </div>
  );
}

function RecursionTab() {
  const [id, setId] = useState(RECURSION_DEMOS[1].id);
  const demo = RECURSION_DEMOS.find((d) => d.id === id)!;
  const [n, setN] = useState<Record<string, number>>({});
  const val = Math.min(demo.max, Math.max(1, n[id] ?? demo.default));
  const t = useMemo(() => demo.tree(val), [demo, val]);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <select className="input" value={id} onChange={(e) => setId(e.target.value)}>
          {RECURSION_DEMOS.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
        <CodeView code={demo.java} />
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">{demo.param} = {val} (max {demo.max})</span>
          <input type="number" min={1} max={demo.max} className="input w-40" value={val} onChange={(e) => setN((o) => ({ ...o, [id]: +e.target.value }))} />
        </label>
        <div className="card mt-4 grid grid-cols-2 gap-3 p-4 text-center">
          <div><div className="text-2xl font-bold">{t.calls}</div><div className="text-xs text-slate-500">total calls (time)</div></div>
          <div><div className="text-2xl font-bold">{t.depth}</div><div className="text-xs text-slate-500">max depth (stack space)</div></div>
        </div>
        <p className="mt-2 text-xs text-slate-500">Space is the DEPTH of the tree, not the number of calls — which is why recursive Fibonacci uses O(n) space but O(2ⁿ) time.</p>
      </div>
      <div className="card overflow-auto p-4"><Tree node={t.root} /></div>
    </div>
  );
}

export function Lab() {
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('tab') ?? 'dry';
  const tabs = [['dry', 'Dry-run lab'], ['complexity', 'Complexity lab'], ['recursion', 'Recursion trees']] as const;
  return (
    <div>
      <PageHeader title="Dry-run & complexity lab" subtitle="Step through the real algorithms with your own inputs, count loop iterations, and see recursion trees." />
      <div className="mb-5 flex gap-1 border-b border-slate-200 dark:border-slate-800" role="tablist">
        {tabs.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setSp({ tab: k })} className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${tab === k ? 'border-brand-600 text-brand-700 dark:text-indigo-300' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>{label}</button>
        ))}
      </div>
      {tab === 'dry' && <DryRunTab />}
      {tab === 'complexity' && <ComplexityTab />}
      {tab === 'recursion' && <RecursionTab />}
    </div>
  );
}
