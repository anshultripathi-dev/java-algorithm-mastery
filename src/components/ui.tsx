import type { ReactNode } from 'react';
import { CheckCircle2, Circle, CircleDot } from 'lucide-react';
import type { LessonStatus } from '@/lib/progress';
import type { Level, Track } from '@/lib/types';
import { TRACK_LABEL } from '@/data/curriculum/modules';

export function LevelChip({ level }: { level: Level }) {
  const cls = level === 'beginner' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : level === 'intermediate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
  return <span className={`chip ${cls}`}>{level}</span>;
}

export function TrackChip({ track }: { track: Track }) {
  const cls = {
    syntax: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
    core: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    archive: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    enrichment: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  }[track];
  return <span className={`chip ${cls}`}>{TRACK_LABEL[track]}</span>;
}

export function StatusIcon({ status, className = 'h-4 w-4' }: { status: LessonStatus; className?: string }) {
  if (status === 'completed') return <CheckCircle2 aria-label="Completed" className={`${className} text-emerald-500`} />;
  if (status === 'in-progress') return <CircleDot aria-label="In progress" className={`${className} text-amber-500`} />;
  return <Circle aria-label="Not started" className={`${className} text-slate-300 dark:text-slate-600`} />;
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${className}`} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 96, label }: { value: number; size?: number; label?: string }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={8} className="fill-none stroke-slate-200 dark:stroke-slate-800" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={8} strokeLinecap="round" className="fill-none stroke-brand-600 transition-all" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold leading-none">{Math.round(value)}%</div>
        {label && <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">{label}</div>}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-slate-600 dark:text-slate-400">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">{children}</div>;
}
