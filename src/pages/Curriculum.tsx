import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Target } from 'lucide-react';
import { LESSONS, LESSON_BY_ID } from '@/data/lessons';
import { MODULES, TRACK_LABEL } from '@/data/curriculum/modules';
import { useProgress } from '@/lib/store';
import { lessonStatus, completion } from '@/lib/progress';
import { LevelChip, PageHeader, ProgressBar, StatusIcon, TrackChip } from '@/components/ui';
import type { Level, Track } from '@/lib/types';

export function Curriculum() {
  const p = useProgress();
  const [q, setQ] = useState('');
  const [level, setLevel] = useState<'all' | Level>('all');
  const [track, setTrack] = useState<'all' | Track>('all');
  const [status, setStatus] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');
  const [essentialOnly, setEssentialOnly] = useState(false);

  const filtered = useMemo(
    () =>
      LESSONS.filter(
        (l) =>
          (level === 'all' || l.level === level) &&
          (track === 'all' || l.track === track) &&
          (status === 'all' || lessonStatus(p, l.id) === status) &&
          (!essentialOnly || l.essential) &&
          (!q || `${l.title} ${l.summary} ${l.sources.join(' ')}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, level, track, status, essentialOnly, p],
  );

  return (
    <div>
      <PageHeader title="Curriculum" subtitle="Follow the modules in order, or jump to any lesson — prerequisites are shown on every lesson." />
      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input className="input lg:col-span-2" placeholder="Filter lessons…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter lessons" />
        <select className="input" value={level} onChange={(e) => setLevel(e.target.value as any)} aria-label="Level">
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select className="input" value={track} onChange={(e) => setTrack(e.target.value as any)} aria-label="Knowledge track">
          <option value="all">All knowledge tracks</option>
          {Object.entries(TRACK_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)} aria-label="Status">
          <option value="all">Any status</option>
          <option value="not-started">Not started</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
        <label className="flex items-center gap-2 text-sm lg:col-span-5">
          <input type="checkbox" checked={essentialOnly} onChange={(e) => setEssentialOnly(e.target.checked)} />
          <Target className="h-4 w-4 text-brand-600" /> Show only the minimum viable path (essential lessons)
        </label>
      </div>

      <div className="space-y-8">
        {MODULES.map((m) => {
          const all = LESSONS.filter((l) => l.module === m.id);
          const ls = filtered.filter((l) => l.module === m.id);
          if (!ls.length) return null;
          const c = completion(all, p);
          return (
            <section key={m.id}>
              <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{m.title}</h2>
                  <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-400">{m.description}</p>
                </div>
                <div className="w-48 text-xs text-slate-500">
                  {c.done}/{c.total} completed
                  <ProgressBar value={c.pct} className="mt-1" />
                </div>
              </div>
              <ol className="space-y-2">
                {ls.map((l) => (
                  <li key={l.id}>
                    <Link to={`/lesson/${l.id}`} className="card flex items-start gap-3 p-3 hover:border-brand-400">
                      <StatusIcon status={lessonStatus(p, l.id)} className="mt-1 h-5 w-5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{l.title}</span>
                          <LevelChip level={l.level} />
                          <TrackChip track={l.track} />
                          {l.essential && <span className="chip bg-brand-100 text-brand-700 dark:bg-indigo-900/50 dark:text-indigo-200">essential</span>}
                        </div>
                        <div className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{l.summary}</div>
                        {l.prerequisites.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-slate-500">
                            needs: {l.prerequisites.map((id) => (
                              <span key={id} className={`chip ${p.lessons[id]?.completedAt ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800'}`}>{LESSON_BY_ID[id]?.title ?? id}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" /> {l.minutes}m <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
        {filtered.length === 0 && <div className="card p-8 text-center text-slate-500">No lessons match these filters.</div>}
      </div>
    </div>
  );
}
