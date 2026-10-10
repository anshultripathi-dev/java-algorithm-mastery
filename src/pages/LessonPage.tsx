import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, CheckCircle2, ChevronLeft, ChevronRight, Clock, Target, ArrowRight, ShieldAlert, Undo2 } from 'lucide-react';
import { LESSONS, LESSON_BY_ID } from '@/data/lessons';
import { MODULE_BY_ID } from '@/data/curriculum/modules';
import { actions, useProgress } from '@/lib/store';
import { lessonStatus, mastery, unmetPrerequisites } from '@/lib/progress';
import { Blocks, Inline, ProgramViewer, CodeView } from '@/components/Rich';
import { LevelChip, TrackChip, ProgressBar } from '@/components/ui';
import { QuizRunner } from '@/components/Quiz';
import { LessonDryRun } from '@/components/DryRun';
import { VideoCard } from '@/components/VideoCard';
import { ExerciseCard } from '@/components/ExerciseCard';
import type { Lesson, QuizQuestion } from '@/lib/types';

function Section({ id, title, children, hint }: { id: string; title: string; children: React.ReactNode; hint?: string }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-slate-200 py-6 dark:border-slate-800">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {hint && <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-400">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PrereqCheck({ lesson }: { lesson: Lesson }) {
  const progress = useProgress();
  const unmet = unmetPrerequisites(lesson, LESSON_BY_ID, progress);
  const [running, setRunning] = useState(false);
  const questions = useMemo(() => {
    const pool: QuizQuestion[] = [];
    for (const u of unmet) pool.push(...u.quiz.slice(0, 2));
    return pool.slice(0, 4);
  }, [unmet.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const checked = !!progress.lessons[lesson.id]?.prereqCheckedAt;
  if (!lesson.prerequisites.length) return <p className="text-sm text-slate-500">No prerequisites — you can start here.</p>;
  return (
    <div className="space-y-3">
      <ul className="flex flex-wrap gap-2">
        {lesson.prerequisites.map((id) => {
          const p = LESSON_BY_ID[id];
          const done = progress.lessons[id]?.completedAt;
          return (
            <li key={id}>
              {p ? (
                <Link to={`/lesson/${id}`} className={`chip border ${done ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'}`}>
                  {done ? <CheckCircle2 className="h-3 w-3" /> : null}
                  {p.title}
                </Link>
              ) : (
                <span className="chip bg-slate-200 dark:bg-slate-800">{id}</span>
              )}
            </li>
          );
        })}
      </ul>
      {unmet.length > 0 && !checked && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
          <div className="flex items-start gap-2 text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <strong>Prerequisite check.</strong> {unmet.length} prerequisite lesson{unmet.length > 1 ? 's' : ''} not completed yet. Answer a few questions to see if you already know them — or follow the links above first.
              {questions.length > 0 && !running && (
                <div className="mt-2">
                  <button className="btn-primary btn-sm" onClick={() => setRunning(true)}>
                    Take the {questions.length}-question check
                  </button>
                </div>
              )}
            </div>
          </div>
          {running && (
            <div className="mt-3">
              <QuizRunner
                questions={questions}
                title="Prerequisite check"
                onFinish={(r) => {
                  if (r.correct / r.total >= 0.75) actions.recordPrereqCheck(lesson.id);
                }}
              />
            </div>
          )}
        </div>
      )}
      {checked && unmet.length > 0 && <p className="text-sm text-emerald-700 dark:text-emerald-400">You passed the prerequisite check for this lesson.</p>}
    </div>
  );
}

export function LessonPage() {
  const { id } = useParams();
  const lesson = id ? LESSON_BY_ID[id] : undefined;
  const progress = useProgress();
  useEffect(() => {
    if (lesson) actions.visitLesson(lesson.id);
  }, [lesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!lesson) return <div className="card p-6">Lesson not found. <Link className="text-brand-600 underline" to="/curriculum">Back to the curriculum</Link></div>;

  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];
  const lp = progress.lessons[lesson.id];
  const status = lessonStatus(progress, lesson.id);
  const m = mastery(lesson, progress);
  const mod = MODULE_BY_ID[lesson.module];
  const toc = [
    ['objectives', 'Objectives'],
    ['prereq', 'Prerequisites'],
    ['intuition', 'Intuition'],
    ...(lesson.syntax ? [['syntax', 'Syntax & rules']] : []),
    ['tiny', 'Tiny example'],
    ['guided', 'Guided example'],
    ...(lesson.dryRun ? [['dryrun', 'Dry run']] : []),
    ['code', 'Complete code'],
    ['complexity', 'Complexity'],
    ['mistakes', 'Common mistakes'],
    ['practice', 'Practice'],
    ['quiz', 'Quiz'],
    ['videos', 'Videos'],
    ['revision', 'Revision card'],
  ];

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-8">
      <article className="min-w-0">
        <nav className="mb-2 flex flex-wrap items-center gap-1 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link to="/curriculum" className="hover:underline">Curriculum</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{mod.title}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{lesson.title}</span>
        </nav>
        <header>
          <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            <Inline text={lesson.summary} />
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <LevelChip level={lesson.level} />
            <TrackChip track={lesson.track} />
            <span className="chip bg-slate-100 dark:bg-slate-800"><Clock className="h-3 w-3" /> ~{lesson.minutes} min</span>
            {lesson.essential && <span className="chip bg-brand-100 text-brand-700 dark:bg-indigo-900/50 dark:text-indigo-200"><Target className="h-3 w-3" /> minimum viable path</span>}
            {lesson.sources.length > 0 && <span className="chip bg-slate-100 dark:bg-slate-800">from slides: {lesson.sources.join(', ')}</span>}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button className={lp?.completedAt ? 'btn-ghost' : 'btn-primary'} onClick={() => actions.setComplete(lesson.id, !lp?.completedAt)}>
              {lp?.completedAt ? <Undo2 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {lp?.completedAt ? 'Mark as not completed' : 'Mark as completed'}
            </button>
            <button className="btn-ghost" onClick={() => actions.toggleBookmark(lesson.id)} aria-pressed={!!lp?.bookmarked}>
              {lp?.bookmarked ? <BookmarkCheck className="h-4 w-4 text-brand-600" /> : <Bookmark className="h-4 w-4" />}
              {lp?.bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <div className="ml-auto flex w-44 items-center gap-2 text-xs text-slate-500">
              <span>Mastery</span>
              <ProgressBar value={m} className="flex-1" />
              <span className="tabular-nums">{m}%</span>
            </div>
          </div>
          <span className="sr-only">status {status}</span>
        </header>

        <Section id="objectives" title="What you will be able to do">
          <ul className="space-y-2">
            {lesson.objectives.map((o, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-500" />
                <span><Inline text={o} /></span>
              </li>
            ))}
          </ul>
        </Section>
        <Section id="prereq" title="Prerequisites" hint="B · know these first">
          <PrereqCheck lesson={lesson} />
        </Section>
        <Section id="intuition" title="Intuition" hint="C · the idea in plain words">
          <Blocks blocks={lesson.intuition} />
        </Section>
        {lesson.syntax && (
          <Section id="syntax" title="Syntax and rules" hint="D · the Java you need">
            <Blocks blocks={lesson.syntax} />
          </Section>
        )}
        <Section id="tiny" title="Tiny example" hint="E · the smallest working piece">
          <Blocks blocks={lesson.tiny} />
        </Section>
        <Section id="guided" title="Guided example" hint="F · a realistic problem, step by step">
          <Blocks blocks={lesson.guided} />
        </Section>
        {lesson.dryRun && (
          <Section id="dryrun" title="Dry run" hint="G · trace it step by step — try your own input">
            <LessonDryRun algoId={lesson.dryRun.algo} input={lesson.dryRun.input} caption={lesson.dryRun.caption} />
          </Section>
        )}
        <Section id="code" title="Complete code and walkthrough" hint="H · I · runnable programs, explained">
          {lesson.programs.map((p) => (
            <ProgramViewer key={p.file} program={p} />
          ))}
        </Section>
        <Section id="complexity" title="Complexity" hint="J · time and space">
          <Blocks blocks={lesson.complexity} />
        </Section>
        <Section id="mistakes" title="Common mistakes" hint="K · wrong code and the fix">
          <div className="space-y-4">
            {lesson.mistakes.map((m2, i) => (
              <div key={i} className="card p-4">
                <h4 className="font-semibold">{m2.title}</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold uppercase text-rose-600">Wrong</div>
                    <CodeView code={m2.wrong} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase text-emerald-600">Fix</div>
                    <CodeView code={m2.fix} />
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400"><Inline text={m2.why} /></p>
              </div>
            ))}
          </div>
        </Section>
        <Section id="practice" title="Practice" hint="L · M · beginner → challenge; solutions are hidden until you ask">
          <div className="space-y-4">
            {lesson.practice.map((e) => (
              <ExerciseCard key={e.id} ex={e} lessonId={lesson.id} />
            ))}
          </div>
        </Section>
        <Section id="quiz" title="Quick quiz" hint="check what stuck">
          <QuizRunner questions={lesson.quiz} title={lesson.title} onFinish={(r) => actions.recordQuiz(lesson.id, r.correct, r.total)} />
          {lp?.quiz && <p className="mt-2 text-xs text-slate-500">Best score: {Math.round(lp.quiz.best * 100)}% · attempts: {lp.quiz.attempts}</p>}
          {lesson.interview && (
            <div className="mt-6">
              <h3 className="mb-2 font-semibold">Interview / exam-style questions</h3>
              <ul className="list-disc space-y-1.5 pl-6 text-sm">
                {lesson.interview.map((q, i) => (
                  <li key={i}><Inline text={q} /></li>
                ))}
              </ul>
            </div>
          )}
        </Section>
        <Section id="videos" title="Video tutorials" hint="N">
          <div className="grid gap-3 md:grid-cols-2">
            {lesson.videos.map((k) => (
              <VideoCard key={k} videoKey={k} topic={lesson.title} />
            ))}
          </div>
        </Section>
        <Section id="revision" title="Revision card" hint="O · 30–60 seconds">
          <div className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 p-5 dark:border-indigo-800 dark:bg-indigo-950/30">
            <ul className="space-y-2">
              {lesson.revision.map((r, i) => (
                <li key={i} className="flex gap-2 leading-7">
                  <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span><Inline text={r} /></span>
                </li>
              ))}
            </ul>
          </div>
          {lesson.sourceNotes && (lesson.sourceNotes.discrepancies?.length || lesson.sourceNotes.assumptions?.length) && (
            <div className="mt-6 space-y-3">
              {lesson.sourceNotes.discrepancies && lesson.sourceNotes.discrepancies.length > 0 && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/40">
                  <div className="mb-1 font-semibold">Differences from the lecture slides (checked and corrected)</div>
                  <ul className="list-disc space-y-1 pl-5">
                    {lesson.sourceNotes.discrepancies.map((d, i) => (
                      <li key={i}><Inline text={d} /></li>
                    ))}
                  </ul>
                </div>
              )}
              {lesson.sourceNotes.assumptions && lesson.sourceNotes.assumptions.length > 0 && (
                <div className="rounded-xl border border-slate-300 bg-slate-100 p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-1 font-semibold">Assumptions</div>
                  <ul className="list-disc space-y-1 pl-5">
                    {lesson.sourceNotes.assumptions.map((d, i) => (
                      <li key={i}><Inline text={d} /></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Section>

        <footer className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          {prev ? (
            <Link to={`/lesson/${prev.id}`} className="btn-ghost max-w-[45%] truncate">
              <ChevronLeft className="h-4 w-4 shrink-0" /> <span className="truncate">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/lesson/${next.id}`} className="btn-primary max-w-[45%] truncate">
              <span className="truncate">{next.title}</span> <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          ) : <span />}
        </footer>
      </article>
      <aside className="sticky top-20 hidden h-fit xl:block">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">On this page</div>
        <ul className="mt-2 space-y-1 border-l border-slate-200 text-sm dark:border-slate-800">
          {toc.map(([anchor, label]) => (
            <li key={anchor}>
              <a href={`#/lesson/${lesson.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }); }} className="-ml-px block border-l-2 border-transparent py-0.5 pl-3 text-slate-600 hover:border-brand-500 hover:text-brand-700 dark:text-slate-400">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
