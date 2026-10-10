import { useMemo } from 'react';
import { DownloadsCard } from '@/components/Downloads';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, GraduationCap, PlayCircle, Repeat, Target, TrendingDown, ListChecks } from 'lucide-react';
import { LESSONS } from '@/data/lessons';
import { MODULES } from '@/data/curriculum/modules';
import { useProgress, useSettings } from '@/lib/store';
import { completion, continueLesson, dueRevisions, exerciseTotals, overallMastery, recommendedNext, streak, weakLessons } from '@/lib/progress';
import { buildPlan } from '@/lib/plan';
import { PageHeader, ProgressBar, ProgressRing, Stat, Empty } from '@/components/ui';

export function Dashboard() {
  const p = useProgress();
  const s = useSettings();
  const c = completion(LESSONS, p);
  const cont = continueLesson(LESSONS, p);
  const next = recommendedNext(LESSONS, p, s.path);
  const due = dueRevisions(LESSONS, p);
  const weak = weakLessons(LESSONS, p).slice(0, 5);
  const ex = exerciseTotals(LESSONS, p);
  const plan = useMemo(() => buildPlan(LESSONS, s.path, s.planDays), [s.path, s.planDays]);
  const dayIdx = Math.min(plan.length - 1, Math.max(0, Math.floor((Date.now() - new Date(s.startDate + 'T00:00:00').getTime()) / 86_400_000)));
  const today = plan[dayIdx];
  const modules = MODULES.map((m) => {
    const ls = LESSONS.filter((l) => l.module === m.id);
    return { m, ...completion(ls, p), count: ls.length };
  });
  const nextUnsolved = LESSONS.flatMap((l) => l.practice.map((e) => ({ l, e }))).filter(({ e }) => !p.exercises[e.id]?.solved && p.lessons[LESSONS.find((x) => x.practice.includes(e))!.id]?.completedAt).slice(0, 3);

  return (
    <div>
      <PageHeader title="Welcome back" subtitle="Learn Java from zero, then solve every algorithm from your course archive on your own." />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center lg:col-span-2">
          <ProgressRing value={c.pct} size={112} label="complete" />
          <div className="flex-1">
            <div className="text-sm text-slate-500">{c.done} of {c.total} lessons completed</div>
            {cont ? (
              <>
                <div className="mt-1 text-lg font-semibold">Pick up where you left off</div>
                <div className="text-slate-600 dark:text-slate-400">{cont.title}</div>
                <Link className="btn-primary mt-3" to={`/lesson/${cont.id}`}><PlayCircle className="h-4 w-4" /> Continue learning</Link>
              </>
            ) : next ? (
              <>
                <div className="mt-1 text-lg font-semibold">Start with: {next.title}</div>
                <div className="text-slate-600 dark:text-slate-400">{next.summary}</div>
                <Link className="btn-primary mt-3" to={`/lesson/${next.id}`}><PlayCircle className="h-4 w-4" /> Start learning</Link>
              </>
            ) : (
              <div className="mt-1 text-lg font-semibold">You have completed every lesson. Keep revising!</div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Streak" value={<span className="flex items-center gap-1"><Flame className="h-5 w-5 text-orange-500" />{streak(p)} d</span>} hint="consecutive active days" />
          <Stat label="Mastery" value={`${overallMastery(LESSONS, p)}%`} hint="from quizzes + practice" />
          <Stat label="Practice solved" value={`${ex.solved}/${ex.total}`} />
          <Stat label="Modules" value={`${MODULES.length}`} hint={`${LESSONS.length} lessons`} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-1">
          <h2 className="flex items-center gap-2 font-semibold"><Target className="h-4 w-4 text-brand-600" /> Recommended next</h2>
          {next ? (
            <div className="mt-3">
              <Link to={`/lesson/${next.id}`} className="block rounded-lg border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                <div className="font-medium">{next.title}</div>
                <div className="mt-1 text-xs text-slate-500">~{next.minutes} min · {next.level}</div>
              </Link>
              <p className="mt-2 text-xs text-slate-500">Chosen as the first {s.path === 'quick' ? 'essential ' : ''}lesson whose prerequisites you have completed.</p>
            </div>
          ) : <Empty>Everything is complete.</Empty>}
        </section>

        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><Repeat className="h-4 w-4 text-brand-600" /> Revision due</h2>
          {due.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Nothing due. Completed lessons are scheduled for review after 1, 3, 7, 14 and 30 days.</p>
          ) : (
            <ul className="mt-3 space-y-1.5 text-sm">
              {due.slice(0, 5).map((l) => (
                <li key={l.id}><Link className="text-brand-700 hover:underline dark:text-indigo-300" to={`/revision?lesson=${l.id}`}>{l.title}</Link></li>
              ))}
              {due.length > 5 && <li className="text-xs text-slate-500">+ {due.length - 5} more</li>}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><TrendingDown className="h-4 w-4 text-rose-500" /> Weak topics</h2>
          {weak.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">None yet. Take lesson quizzes and attempt practice problems — topics where you score below 70% show up here.</p>
          ) : (
            <ul className="mt-3 space-y-1.5 text-sm">
              {weak.map((l) => (
                <li key={l.id}><Link className="text-brand-700 hover:underline dark:text-indigo-300" to={`/lesson/${l.id}`}>{l.title}</Link></li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-semibold"><ListChecks className="h-4 w-4 text-brand-600" /> Today in your {s.planDays}-day plan (day {today.day} of {plan.length})</h2>
          <Link to="/plan" className="text-sm text-brand-700 hover:underline dark:text-indigo-300">Open full plan <ArrowRight className="inline h-3.5 w-3.5" /></Link>
        </div>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {today.tasks.slice(0, 8).map((t, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
              {t.lessonId ? <Link className="truncate hover:underline" to={`/lesson/${t.lessonId}`}>{t.title}</Link> : <span className="truncate">{t.title}</span>}
              <span className="chip shrink-0 bg-slate-100 dark:bg-slate-800">{t.kind} · {t.minutes}m</span>
            </li>
          ))}
        </ul>
        {nextUnsolved.length > 0 && (
          <div className="mt-4 text-sm">
            <div className="mb-1 font-medium">Upcoming practice from lessons you completed</div>
            <ul className="space-y-1">
              {nextUnsolved.map(({ e }) => (
                <li key={e.id}><Link className="text-brand-700 hover:underline dark:text-indigo-300" to={`/practice?problem=${e.id}`}>{e.title}</Link> <span className="text-xs text-slate-500">({e.level})</span></li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="mt-6">
        <DownloadsCard compact />
      </div>

      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><GraduationCap className="h-4 w-4 text-brand-600" /> Module progress</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {modules.map(({ m, done, total, pct, count }) => (
            <Link key={m.id} to="/curriculum" className="card block p-4 hover:border-brand-400">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-slate-500">{done}/{count} lessons</div>
              </div>
              <div className="mt-1 text-xs text-slate-500">{m.tagline}</div>
              <ProgressBar value={pct} className="mt-3" />
              <span className="sr-only">{total}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
