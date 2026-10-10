import { useState } from 'react';
import { Eye, EyeOff, Lightbulb, CheckCircle2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Exercise } from '@/lib/types';
import { actions, useProgress } from '@/lib/store';
import { getJavaSource } from '@/lib/java-sources';
import { Inline, CodeView, IoBox } from './Rich';

const LV = { beginner: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', challenge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' };

export function ExerciseBody({ ex }: { ex: Exercise }) {
  return (
    <div className="lesson-prose">
      <p>
        <Inline text={ex.statement} />
      </p>
      {ex.constraints && (
        <ul className="my-2 list-disc pl-6 text-sm text-slate-600 dark:text-slate-400">
          {ex.constraints.map((c, i) => (
            <li key={i}>
              <Inline text={c} />
            </li>
          ))}
        </ul>
      )}
      {ex.examples?.map((e, i) => (
        <div key={i} className="my-2 grid gap-2 sm:grid-cols-2">
          <IoBox title={`Example ${i + 1} input`} text={e.input} />
          <IoBox title="Output" text={e.output} />
          {e.explain && <p className="text-xs text-slate-500 sm:col-span-2">{e.explain}</p>}
        </div>
      ))}
    </div>
  );
}

export function HintsAndSolution({ ex }: { ex: Exercise }) {
  const progress = useProgress();
  const ep = progress.exercises[ex.id];
  const [shown, setShown] = useState(Math.min(ep?.hintsUsed ?? 0, ex.hints.length));
  const [reveal, setReveal] = useState(false);
  let sol = '';
  try {
    sol = getJavaSource(ex.solutionFile);
  } catch {
    sol = '// solution file missing';
  }
  return (
    <div className="mt-3 space-y-2">
      {ex.hints.slice(0, shown).map((h, i) => (
        <div key={i} className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/40">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Hint {i + 1}:</strong> <Inline text={h} />
          </span>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {shown < ex.hints.length && (
          <button
            className="btn-ghost btn-sm"
            onClick={() => {
              setShown(shown + 1);
              actions.patchExercise(ex.id, { hintsUsed: Math.max(shown + 1, ep?.hintsUsed ?? 0) });
            }}
          >
            <Lightbulb className="h-3.5 w-3.5" /> Show hint {shown + 1} of {ex.hints.length}
          </button>
        )}
        <button
          className="btn-ghost btn-sm"
          onClick={() => {
            setReveal(!reveal);
            if (!reveal) actions.patchExercise(ex.id, { solutionViewed: true });
          }}
        >
          {reveal ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {reveal ? 'Hide solution' : 'Reveal solution'}
        </button>
      </div>
      {reveal && (
        <div>
          <div className="lesson-prose rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-900">
            <strong>Why it works:</strong> <Inline text={ex.solutionExplain} />
          </div>
          <CodeView code={sol} title={ex.solutionFile.split('/').pop()} />
        </div>
      )}
    </div>
  );
}

export function ExerciseCard({ ex, lessonId }: { ex: Exercise; lessonId: string }) {
  const progress = useProgress();
  const ep = progress.exercises[ex.id];
  return (
    <div className="card p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={`chip ${LV[ex.level]}`}>{ex.level}</span>
        <h4 className="font-semibold">{ex.title}</h4>
        {ep?.solved && (
          <span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> solved
          </span>
        )}
        <Link className="btn-ghost btn-sm ml-auto" to={`/practice?problem=${ex.id}`}>
          <ExternalLink className="h-3.5 w-3.5" /> Solve in the arena
        </Link>
      </div>
      <ExerciseBody ex={ex} />
      <HintsAndSolution ex={ex} />
      <span className="sr-only">{lessonId}</span>
    </div>
  );
}
