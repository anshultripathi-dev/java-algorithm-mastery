import { useEffect, useRef, useState } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { actions, useProgress, useSettings } from '@/lib/store';
import { PageHeader } from '@/components/ui';
import { runnerStatus, type RunnerStatus } from '@/features/code-playground/runner';
import { LESSONS } from '@/data/lessons';
import { completion } from '@/lib/progress';
import { DownloadsCard } from '@/components/Downloads';

export function SettingsPage() {
  const s = useSettings();
  const p = useProgress();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [status, setStatus] = useState<RunnerStatus | null | undefined>(undefined);
  useEffect(() => {
    runnerStatus().then(setStatus);
  }, []);
  const c = completion(LESSONS, p);
  const quizzes = Object.values(p.lessons).filter((l) => l.quiz);
  const avg = quizzes.length ? Math.round((quizzes.reduce((a, l) => a + l.quiz!.best, 0) / quizzes.length) * 100) : 0;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings & progress" />
      <section className="card mb-5 space-y-4 p-5">
        <h2 className="font-semibold">Appearance & study target</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Theme</span>
            <select className="input" value={s.theme} onChange={(e) => actions.updateSettings({ theme: e.target.value as any })}>
              <option value="system">Match system</option><option value="light">Light</option><option value="dark">Dark</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Code font size</span>
            <select className="input" value={s.codeFontSize} onChange={(e) => actions.updateSettings({ codeFontSize: +e.target.value })}>
              {[12, 13, 14, 16, 18].map((n) => <option key={n} value={n}>{n}px</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Study plan length</span>
            <select className="input" value={s.planDays} onChange={(e) => actions.updateSettings({ planDays: +e.target.value as any })}>
              {[7, 14, 21, 30].map((d) => <option key={d} value={d}>{d} days</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Study path</span>
            <select className="input" value={s.path} onChange={(e) => actions.updateSettings({ path: e.target.value as any })}>
              <option value="quick">Minimum viable path</option><option value="complete">Complete path</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium uppercase text-slate-500">Daily study target (minutes)</span>
            <input type="number" min={15} max={600} step={15} className="input" value={s.dailyMinutes} onChange={(e) => actions.updateSettings({ dailyMinutes: Math.max(15, +e.target.value || 60) })} />
          </label>
        </div>
      </section>

      <section className="card mb-5 p-5">
        <h2 className="mb-3 font-semibold">Your progress</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div><dt className="text-xs uppercase text-slate-500">Lessons done</dt><dd className="text-xl font-bold">{c.done}/{c.total}</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Quizzes taken</dt><dd className="text-xl font-bold">{quizzes.length}</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Avg best quiz</dt><dd className="text-xl font-bold">{avg}%</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Exercises solved</dt><dd className="text-xl font-bold">{Object.values(p.exercises).filter((e) => e.solved).length}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-slate-500">Progress is stored only in this browser (localStorage). Export it to back it up or move to another computer.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => {
            const blob = new Blob([actions.exportJSON()], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `java-mastery-progress-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(a.href);
          }}><Download className="h-4 w-4" /> Export progress</button>
          <button className="btn-ghost" onClick={() => file.current?.click()}><Upload className="h-4 w-4" /> Import progress</button>
          <input ref={file} type="file" accept="application/json" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setMsg(actions.importJSON(await f.text()).message);
            e.target.value = '';
          }} />
        </div>
        {msg && <p className="mt-2 text-sm" role="status">{msg}</p>}
      </section>

      <div className="mb-5">
        <DownloadsCard />
      </div>

      <section className="card mb-5 p-5">
        <h2 className="mb-2 font-semibold">Local Java runner</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {status === undefined ? 'Checking…' : status === null ? 'Not available: this page is not served by the local runner (static hosting). Use npm run dev or npm start to enable running code.' : status.available ? `Ready. ${status.javac}; ${status.java}. Programs are compiled with --release ${status.release} (Java 17 language level).` : 'The server is running but no JDK was found. Install a JDK 17+ and restart.'}
        </p>
      </section>

      <section className="card border-rose-300 p-5 dark:border-rose-900">
        <h2 className="mb-2 font-semibold text-rose-700 dark:text-rose-400">Reset progress</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Deletes completed lessons, quiz scores, bookmarks, solved problems, flashcard history and revision schedules. Export first if you may want them back.</p>
        {!confirm ? (
          <button className="btn-ghost mt-3" onClick={() => setConfirm(true)}><Trash2 className="h-4 w-4" /> Reset all progress…</button>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">This cannot be undone. Are you sure?</span>
            <button className="btn bg-rose-600 text-white hover:bg-rose-700" onClick={() => { actions.resetProgress(); setConfirm(false); setMsg('All progress was reset.'); }}>Yes, delete everything</button>
            <button className="btn-ghost" onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        )}
      </section>
    </div>
  );
}
