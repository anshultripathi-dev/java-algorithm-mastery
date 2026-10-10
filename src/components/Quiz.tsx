import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import type { QuizQuestion } from '@/lib/types';
import { Inline } from './Rich';
import { CodeView } from './Rich';

const norm = (s: string) => s.trim().replace(/\s+/g, ' ');
const normCode = (s: string) => s.replace(/\s+/g, '');

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Evaluate an answer; returns correct flag (null = not answerable yet). */
function grade(q: QuizQuestion, a: any): boolean | null {
  switch (q.type) {
    case 'mcq':
      return a === undefined ? null : a === q.answer;
    case 'bug':
      return a === undefined ? null : a === q.answerLine;
    case 'output': {
      if (!a || !norm(a)) return null;
      const accepted = [q.answer, ...(q.accept ?? [])].map(norm);
      return accepted.includes(norm(a));
    }
    case 'fill': {
      const arr: string[] = a ?? [];
      if (arr.length < q.blanks.length || arr.some((x) => !x?.trim())) return null;
      return q.blanks.every((opts, i) => opts.map(normCode).includes(normCode(arr[i])));
    }
    case 'match': {
      const arr: string[] = a ?? [];
      if (arr.length < q.pairs.length || arr.some((x) => !x)) return null;
      return q.pairs.every((p, i) => arr[i] === p[1]);
    }
    case 'trace': {
      const arr: string[] = a ?? [];
      if (arr.length < q.items.length || arr.some((x) => !x?.trim())) return null;
      return q.items.every((it, i) => norm(arr[i]) === norm(it.answer));
    }
  }
}

function QuestionBody({ q, answer, setAnswer, locked, seed }: { q: QuizQuestion; answer: any; setAnswer: (v: any) => void; locked: boolean; seed: number }) {
  switch (q.type) {
    case 'mcq':
      return (
        <div className="mt-3 space-y-2">
          {q.code && <CodeView code={q.code} />}
          {q.options.map((o, i) => (
            <label key={i} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${answer === i ? 'border-brand-500 bg-brand-50 dark:bg-indigo-950/40' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'} ${locked ? 'pointer-events-none' : ''}`}>
              <input type="radio" className="mt-1" checked={answer === i} onChange={() => setAnswer(i)} disabled={locked} />
              <span className="font-mono text-[13px]">
                <Inline text={o} />
              </span>
            </label>
          ))}
        </div>
      );
    case 'output':
      return (
        <div className="mt-3">
          <CodeView code={q.code} />
          <input className="input font-mono" placeholder="Type the exact output…" value={answer ?? ''} onChange={(e) => setAnswer(e.target.value)} disabled={locked} aria-label="Your answer" />
        </div>
      );
    case 'bug': {
      const lines = q.code.split('\n');
      return (
        <div className="mt-3">
          <div className="text-xs text-slate-500">Click the line that contains the bug.</div>
          <div className="my-2 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            {lines.map((l, i) => (
              <button key={i} type="button" disabled={locked} onClick={() => setAnswer(i + 1)} className={`flex w-full items-center gap-3 px-3 py-0.5 text-left font-mono text-[13px] leading-6 ${answer === i + 1 ? 'bg-brand-100 dark:bg-indigo-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <span className="w-5 text-right text-slate-400">{i + 1}</span>
                <span className="whitespace-pre">{l || ' '}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
    case 'fill': {
      const parts = q.template.split('___');
      const arr: string[] = answer ?? [];
      return (
        <pre className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[13px] leading-7 dark:border-slate-800 dark:bg-slate-900/70">
          {parts.map((p, i) => (
            <span key={i}>
              {p}
              {i < parts.length - 1 && (
                <input
                  className="mx-1 w-24 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-center font-mono text-[13px] dark:border-slate-600 dark:bg-slate-800"
                  aria-label={`blank ${i + 1}`}
                  value={arr[i] ?? ''}
                  disabled={locked}
                  onChange={(e) => {
                    const n = [...arr];
                    n[i] = e.target.value;
                    setAnswer(n);
                  }}
                />
              )}
            </span>
          ))}
        </pre>
      );
    }
    case 'match': {
      const arr: string[] = answer ?? [];
      const rights = shuffle(q.pairs.map((p) => p[1]), seed);
      return (
        <div className="mt-3 space-y-2">
          {q.pairs.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-1/2 rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm dark:bg-slate-800">{p[0]}</span>
              <select
                className="input w-1/2 font-mono"
                value={arr[i] ?? ''}
                disabled={locked}
                onChange={(e) => {
                  const n = [...arr];
                  n[i] = e.target.value;
                  setAnswer(n);
                }}
                aria-label={`match for ${p[0]}`}
              >
                <option value="">— choose —</option>
                {rights.map((r, j) => (
                  <option key={j} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }
    case 'trace': {
      const arr: string[] = answer ?? [];
      return (
        <div className="mt-3">
          <CodeView code={q.code} />
          <div className="grid gap-2 sm:grid-cols-2">
            {q.items.map((it, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1/2">{it.prompt}</span>
                <input
                  className="input w-1/2 font-mono"
                  value={arr[i] ?? ''}
                  disabled={locked}
                  onChange={(e) => {
                    const n = [...arr];
                    n[i] = e.target.value;
                    setAnswer(n);
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      );
    }
  }
}

function correctText(q: QuizQuestion): string {
  switch (q.type) {
    case 'mcq':
      return q.options[q.answer];
    case 'output':
      return q.answer;
    case 'bug':
      return `line ${q.answerLine}`;
    case 'fill':
      return q.blanks.map((b) => b[0]).join(', ');
    case 'match':
      return q.pairs.map((p) => `${p[0]} → ${p[1]}`).join('; ');
    case 'trace':
      return q.items.map((i) => `${i.prompt}: ${i.answer}`).join('; ');
  }
}

export interface QuizResult {
  correct: number;
  total: number;
  perQuestion: boolean[];
}

/** Runs a list of questions one at a time with immediate feedback and a final score. */
export function QuizRunner({ questions, onFinish, title, labels }: { questions: QuizQuestion[]; onFinish?: (r: QuizResult) => void; title?: string; labels?: string[] }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);

  const results = useMemo(() => questions.map((q, i) => (checked[i] ? grade(q, answers[i]) === true : false)), [questions, answers, checked]);

  if (!questions.length) return <div className="text-sm text-slate-500">No questions available.</div>;

  if (done) {
    const correct = results.filter(Boolean).length;
    return (
      <div className="card p-5">
        <div className="text-lg font-semibold">
          {title ?? 'Quiz'} complete: {correct} / {questions.length} ({Math.round((correct / questions.length) * 100)}%)
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {questions.map((q, i) => (
            <li key={i} className="flex gap-2">
              {results[i] ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />}
              <span>
                <Inline text={q.q} />
              </span>
            </li>
          ))}
        </ul>
        <button
          className="btn-ghost mt-4"
          onClick={() => {
            setIdx(0);
            setAnswers({});
            setChecked({});
            setDone(false);
            setRun((r) => r + 1);
          }}
        >
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
      </div>
    );
  }

  const q = questions[idx];
  const isChecked = !!checked[idx];
  const ok = isChecked ? grade(q, answers[idx]) === true : null;
  const ready = grade(q, answers[idx]) !== null;
  const last = idx === questions.length - 1;

  return (
    <div className="card p-5" key={run}>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>
          Question {idx + 1} of {questions.length}
          {labels?.[idx] ? ` · ${labels[idx]}` : ''}
        </span>
        <span className="chip bg-slate-100 dark:bg-slate-800">{{ mcq: 'multiple choice', output: 'predict the output', bug: 'find the bug', fill: 'fill in the code', match: 'matching', trace: 'trace it' }[q.type]}</span>
      </div>
      <div className="font-medium leading-7">
        <Inline text={q.q} />
      </div>
      <QuestionBody q={q} answer={answers[idx]} setAnswer={(v) => setAnswers((a) => ({ ...a, [idx]: v }))} locked={isChecked} seed={idx + 7} />
      {isChecked && (
        <div className={`mt-4 rounded-lg border p-3 text-sm leading-6 ${ok ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40' : 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40'}`} role="status">
          <div className="mb-1 flex items-center gap-2 font-semibold">
            {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
            {ok ? 'Correct' : 'Not quite'}
          </div>
          {!ok && (
            <div className="mb-1">
              Answer: <code className="rounded bg-white/70 px-1 font-mono dark:bg-black/30">{correctText(q)}</code>
            </div>
          )}
          <Inline text={q.explain} />
        </div>
      )}
      <div className="mt-4 flex gap-2">
        {!isChecked ? (
          <button className="btn-primary" disabled={!ready} onClick={() => setChecked((c) => ({ ...c, [idx]: true }))}>
            Check answer
          </button>
        ) : last ? (
          <button
            className="btn-primary"
            onClick={() => {
              setDone(true);
              const per = questions.map((qq, i) => grade(qq, answers[i]) === true);
              onFinish?.({ correct: per.filter(Boolean).length, total: questions.length, perQuestion: per });
            }}
          >
            See score
          </button>
        ) : (
          <button className="btn-primary" onClick={() => setIdx(idx + 1)}>
            Next <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
