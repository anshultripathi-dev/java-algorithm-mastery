import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS } from '@/data/lessons';
import { actions, useProgress, useSettings } from '@/lib/store';
import { buildPlan } from '@/lib/plan';
import { PageHeader } from '@/components/ui';
import { CheckCircle2 } from 'lucide-react';

export function Plan() {
  const s = useSettings();
  const p = useProgress();
  const plan = useMemo(() => buildPlan(LESSONS, s.path, s.planDays), [s.path, s.planDays]);
  const todayIdx = Math.floor((Date.now() - new Date(s.startDate + 'T00:00:00').getTime()) / 86_400_000);
  const pool = s.path === 'quick' ? LESSONS.filter((l) => l.essential) : LESSONS;
  const totalMin = pool.reduce((a, l) => a + l.minutes, 0);
  return (
    <div>
      <PageHeader title="Study plan" subtitle="A focused schedule that puts prerequisites first, then reusable patterns and the archive algorithms." />
      <div className="card mb-6 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Plan length</span>
          <select className="input" value={s.planDays} onChange={(e) => actions.updateSettings({ planDays: +e.target.value as any })}>
            {[7, 14, 21, 30].map((d) => <option key={d} value={d}>{d} days</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Path</span>
          <select className="input" value={s.path} onChange={(e) => actions.updateSettings({ path: e.target.value as any })}>
            <option value="quick">Minimum viable path (essential lessons)</option>
            <option value="complete">Complete path (every lesson)</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Start date</span>
          <input type="date" className="input" value={s.startDate} onChange={(e) => actions.updateSettings({ startDate: e.target.value })} />
        </label>
        <div className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Workload</span>
          {pool.length} lessons · ≈ {(totalMin / 60).toFixed(1)} h reading + practice
        </div>
      </div>
      <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/40">
        <strong>Be realistic.</strong> This is a focused revision schedule, not a promise that every topic is mastered in {s.planDays} days. Quiz and practice results decide what is really solid — weak topics are added back in the last day, and you can stretch the plan to 21 or 30 days at any time.
      </div>
      <ol className="space-y-3">
        {plan.map((d) => (
          <li key={d.day} className={`card p-4 ${d.day - 1 === todayIdx ? 'border-brand-500 ring-2 ring-brand-500/20' : ''}`}>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="font-semibold">Day {d.day}{d.day - 1 === todayIdx && <span className="chip ml-2 bg-brand-100 text-brand-700 dark:bg-indigo-900/50 dark:text-indigo-200">today</span>}</h3>
              <span className="text-xs text-slate-500">≈ {d.minutes} min</span>
            </div>
            <ul className="space-y-1">
              {d.tasks.map((t, i) => {
                const done = t.lessonId && t.kind === 'learn' && p.lessons[t.lessonId]?.completedAt;
                return (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="chip w-20 shrink-0 justify-center bg-slate-100 dark:bg-slate-800">{t.kind}</span>
                    {t.lessonId ? <Link className="hover:underline" to={`/lesson/${t.lessonId}`}>{t.title}</Link> : t.kind === 'assess' ? <Link className="hover:underline" to="/revision?tab=assessment">{t.title}</Link> : <span>{t.title}</span>}
                    {done && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    <span className="ml-auto text-xs text-slate-500">{t.minutes} min</span>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
