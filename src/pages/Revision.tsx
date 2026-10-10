import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LESSONS, LESSON_BY_ID } from '@/data/lessons';
import { CHEATSHEETS } from '@/data/revision/cheatsheets';
import { allFlashcards } from '@/data/revision/flashcards';
import { actions, useProgress } from '@/lib/store';
import { dueRevisions, weakLessons } from '@/lib/progress';
import { QuizRunner } from '@/components/Quiz';
import { CodeView, Inline } from '@/components/Rich';
import { PageHeader, Empty } from '@/components/ui';
import type { QuizQuestion } from '@/lib/types';
import { ArrowRight, Bookmark, RotateCw } from 'lucide-react';

function pick<T>(arr: T[], n: number, seed = Date.now()): T[] {
  const a = [...arr];
  let s = seed % 2147483647 || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 48271) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function Flashcards() {
  const progress = useProgress();
  const cards = useMemo(() => allFlashcards(), []);
  const [order, setOrder] = useState(() => 0);
  const due = useMemo(() => cards.filter((c) => !progress.flashcards[c.id] || progress.flashcards[c.id].due <= Date.now()), [cards, progress.flashcards, order]);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const card = due[i % Math.max(1, due.length)];
  if (!card) return <Empty>No cards are due right now. Come back tomorrow, or study the lessons you have not seen yet.</Empty>;
  const lesson = card.lesson ? LESSON_BY_ID[card.lesson] : undefined;
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-2 flex justify-between text-xs text-slate-500">
        <span>{due.length} due · {cards.length} total</span>
        {lesson && <Link className="underline" to={`/lesson/${lesson.id}`}>{lesson.title}</Link>}
      </div>
      <button onClick={() => setFlip(!flip)} className="card flex min-h-56 w-full items-center justify-center whitespace-pre-wrap p-8 text-center text-lg leading-8" aria-label="Flip card">
        {flip ? <span className="text-brand-700 dark:text-indigo-300"><Inline text={card.back} /></span> : <span><Inline text={card.front} /></span>}
      </button>
      <p className="mt-2 text-center text-xs text-slate-500">Click the card to {flip ? 'see the question' : 'reveal the answer'}.</p>
      <div className="mt-3 flex justify-center gap-2">
        <button className="btn-ghost" disabled={!flip} onClick={() => { actions.recordFlashcard(card.id, false); setFlip(false); setOrder((o) => o + 1); }}>Missed it</button>
        <button className="btn-primary" disabled={!flip} onClick={() => { actions.recordFlashcard(card.id, true); setFlip(false); setOrder((o) => o + 1); }}>Got it</button>
        <button className="btn-ghost" onClick={() => { setFlip(false); setI(i + 1); }}><ArrowRight className="h-4 w-4" /> Skip</button>
      </div>
    </div>
  );
}

function Quizzes() {
  const [sp, setSp] = useSearchParams();
  const lessonId = sp.get('lesson') ?? '';
  const [mixedN, setMixedN] = useState(10);
  const [seed, setSeed] = useState(1);
  const progress = useProgress();
  const lesson = LESSON_BY_ID[lessonId];
  const mixed = useMemo(() => {
    const pool: { q: QuizQuestion; label: string }[] = [];
    LESSONS.forEach((l) => l.quiz.forEach((q) => pool.push({ q, label: l.title })));
    return pick(pool, mixedN, seed * 7919);
  }, [mixedN, seed]);
  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-end gap-3 p-4">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Quiz on a lesson</span>
          <select className="input w-72" value={lessonId} onChange={(e) => setSp({ tab: 'quizzes', lesson: e.target.value })}>
            <option value="">— mixed-topic practice —</option>
            {LESSONS.map((l) => <option key={l.id} value={l.id}>{l.title}{progress.lessons[l.id]?.quiz ? ` (best ${Math.round(progress.lessons[l.id].quiz!.best * 100)}%)` : ''}</option>)}
          </select>
        </label>
        {!lesson && (
          <>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Questions</span>
              <select className="input w-24" value={mixedN} onChange={(e) => setMixedN(+e.target.value)}>{[5, 10, 15, 20].map((n) => <option key={n}>{n}</option>)}</select>
            </label>
            <button className="btn-ghost" onClick={() => setSeed((s) => s + 1)}><RotateCw className="h-4 w-4" /> New set</button>
          </>
        )}
      </div>
      {lesson ? (
        <QuizRunner key={lesson.id} questions={lesson.quiz} title={lesson.title} onFinish={(r) => actions.recordQuiz(lesson.id, r.correct, r.total)} />
      ) : (
        <QuizRunner key={`${mixedN}-${seed}`} questions={mixed.map((m) => m.q)} labels={mixed.map((m) => m.label)} title="Mixed practice" />
      )}
    </div>
  );
}

function CheatSheets() {
  return (
    <div className="space-y-8">
      {CHEATSHEETS.map((s) => (
        <section key={s.id}>
          <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
          {s.sections.map((sec) => (
            <div key={sec.heading} className="mb-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">{sec.heading}</div>
              <table className="w-full text-left text-sm">
                <tbody>
                  {sec.rows.map((r, i) => (
                    <tr key={i} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="w-1/2 px-3 py-1.5 align-top font-mono text-[13px]">{r[0]}</td>
                      <td className="px-3 py-1.5 align-top text-slate-600 dark:text-slate-400">{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function Mistakes() {
  const [q, setQ] = useState('');
  const all = LESSONS.flatMap((l) => l.mistakes.map((m) => ({ l, m })));
  const shown = all.filter(({ m, l }) => !q || `${m.title} ${l.title} ${m.why}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <input className="input mb-4 max-w-md" placeholder="Filter mistakes…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="space-y-3">
        {shown.map(({ l, m }, i) => (
          <div key={i} className="card p-4">
            <div className="flex flex-wrap items-baseline gap-2"><h4 className="font-semibold">{m.title}</h4><Link className="text-xs text-brand-700 underline dark:text-indigo-300" to={`/lesson/${l.id}`}>{l.title}</Link></div>
            <div className="grid gap-3 md:grid-cols-2">
              <CodeView code={m.wrong} title="wrong" />
              <CodeView code={m.fix} title="fix" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400"><Inline text={m.why} /></p>
          </div>
        ))}
        {shown.length === 0 && <Empty>No mistakes match.</Empty>}
      </div>
    </div>
  );
}

function Bookmarks() {
  const progress = useProgress();
  const marked = LESSONS.filter((l) => progress.lessons[l.id]?.bookmarked);
  if (!marked.length) return <Empty>No bookmarks yet. Use the Bookmark button on any lesson.</Empty>;
  return (
    <ul className="space-y-2">
      {marked.map((l) => (
        <li key={l.id} className="card flex items-center gap-3 p-3">
          <Bookmark className="h-4 w-4 text-brand-600" />
          <Link className="font-medium hover:underline" to={`/lesson/${l.id}`}>{l.title}</Link>
          <button className="btn-ghost btn-sm ml-auto" onClick={() => actions.toggleBookmark(l.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}

function WeakTopics() {
  const progress = useProgress();
  const due = dueRevisions(LESSONS, progress);
  const weak = weakLessons(LESSONS, progress);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section>
        <h3 className="mb-2 font-semibold">Due for spaced review</h3>
        {due.length === 0 ? <Empty>Nothing due. Complete lessons to schedule reviews (1, 3, 7, 14, 30 days).</Empty> : (
          <ul className="space-y-2">
            {due.map((l) => (
              <li key={l.id} className="card flex items-center gap-2 p-3 text-sm">
                <Link className="font-medium hover:underline" to={`/revision?tab=quizzes&lesson=${l.id}`}>{l.title}</Link>
                <button className="btn-ghost btn-sm ml-auto" onClick={() => actions.markReviewed(l.id, true)}>I remember it</button>
                <button className="btn-ghost btn-sm" onClick={() => actions.markReviewed(l.id, false)}>Forgot</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3 className="mb-2 font-semibold">Weak topics</h3>
        {weak.length === 0 ? <Empty>No weak topics detected yet (quiz score below 70% or repeated unsolved practice).</Empty> : (
          <ul className="space-y-2">
            {weak.map((l) => (
              <li key={l.id} className="card flex items-center gap-2 p-3 text-sm">
                <Link className="font-medium hover:underline" to={`/lesson/${l.id}`}>{l.title}</Link>
                <Link className="btn-primary btn-sm ml-auto" to={`/revision?tab=quizzes&lesson=${l.id}`}>Re-quiz</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Assessment() {
  const progress = useProgress();
  const [started, setStarted] = useState(false);
  const [seed, setSeed] = useState(1);
  const qs = useMemo(() => {
    const pool: { q: QuizQuestion; id: string; title: string }[] = [];
    LESSONS.filter((l) => l.module === 'm5' || l.track === 'archive').forEach((l) => l.quiz.forEach((q) => pool.push({ q, id: l.id, title: l.title })));
    return pick(pool, 20, seed * 104729);
  }, [seed]);
  const last = progress.assessments[progress.assessments.length - 1];
  return (
    <div>
      <p className="mb-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">A 20-question mixed assessment drawn from the archive-algorithm lessons. Your score and per-topic results are saved and feed the weak-topic list.</p>
      {last && <div className="mb-3 text-sm">Last attempt: <strong>{last.score}/{last.total}</strong> on {new Date(last.at).toLocaleDateString()} · {progress.assessments.length} attempt(s)</div>}
      {!started ? (
        <button className="btn-primary" onClick={() => { setSeed((s) => s + 1); setStarted(true); }}>Start assessment</button>
      ) : (
        <QuizRunner
          key={seed}
          questions={qs.map((x) => x.q)}
          labels={qs.map((x) => x.title)}
          title="Final mixed assessment"
          onFinish={(r) => {
            const byLesson: Record<string, { correct: number; total: number }> = {};
            qs.forEach((x, i) => {
              byLesson[x.id] ??= { correct: 0, total: 0 };
              byLesson[x.id].total++;
              if (r.perQuestion[i]) byLesson[x.id].correct++;
            });
            actions.recordAssessment({ at: Date.now(), score: r.correct, total: r.total, byLesson });
          }}
        />
      )}
    </div>
  );
}

export function Revision() {
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('tab') ?? (sp.get('lesson') ? 'quizzes' : 'flashcards');
  const tabs = [['flashcards', 'Flashcards'], ['quizzes', 'Quizzes'], ['weak', 'Weak & due'], ['sheets', 'Cheat sheets'], ['mistakes', 'Common mistakes'], ['bookmarks', 'Bookmarks'], ['assessment', 'Final assessment']];
  return (
    <div>
      <PageHeader title="Revision center" subtitle="Flashcards, quizzes, formula and syntax sheets, common mistakes and spaced review — all in one place." />
      <div className="mb-5 flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-800" role="tablist">
        {tabs.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setSp({ tab: k })} className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${tab === k ? 'border-brand-600 text-brand-700 dark:text-indigo-300' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>{label}</button>
        ))}
      </div>
      {tab === 'flashcards' && <Flashcards />}
      {tab === 'quizzes' && <Quizzes />}
      {tab === 'weak' && <WeakTopics />}
      {tab === 'sheets' && <CheatSheets />}
      {tab === 'mistakes' && <Mistakes />}
      {tab === 'bookmarks' && <Bookmarks />}
      {tab === 'assessment' && <Assessment />}
    </div>
  );
}
