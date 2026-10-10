import { useSyncExternalStore } from 'react';

// ───────────────────────── persisted state ─────────────────────────
export interface LessonProgress {
  completedAt?: number;
  lastVisited?: number;
  visits: number;
  bookmarked?: boolean;
  quiz?: { best: number; last: number; attempts: number; at: number; total: number };
  prereqCheckedAt?: number;
}
export interface ExerciseProgress {
  attempts: number;
  solved: boolean;
  solvedAt?: number;
  hintsUsed: number;
  solutionViewed: boolean;
  lastCode?: string;
}
export interface RevisionItem {
  due: number; // ms timestamp
  interval: number; // days
  reps: number;
}
export interface FlashcardStat {
  box: number; // Leitner box 0..4
  due: number;
  seen: number;
  right: number;
}
export interface AssessmentResult {
  at: number;
  score: number;
  total: number;
  byLesson: Record<string, { correct: number; total: number }>;
}
export interface ProgressState {
  version: 1;
  lessons: Record<string, LessonProgress>;
  exercises: Record<string, ExerciseProgress>;
  revision: Record<string, RevisionItem>;
  flashcards: Record<string, FlashcardStat>;
  activity: Record<string, number>; // YYYY-MM-DD → number of actions
  assessments: AssessmentResult[];
  video: Record<string, { watched: boolean }>;
}
export interface Settings {
  theme: 'light' | 'dark' | 'system';
  planDays: 7 | 14 | 21 | 30;
  dailyMinutes: number;
  path: 'quick' | 'complete';
  startDate: string; // YYYY-MM-DD
  codeFontSize: number;
}

const PROGRESS_KEY = 'jfam:progress';
const SETTINGS_KEY = 'jfam:settings';

export const today = () => new Date().toISOString().slice(0, 10);

const defaultProgress = (): ProgressState => ({
  version: 1,
  lessons: {},
  exercises: {},
  revision: {},
  flashcards: {},
  activity: {},
  assessments: [],
  video: {},
});
const defaultSettings = (): Settings => ({
  theme: 'system',
  planDays: 14,
  dailyMinutes: 120,
  path: 'complete',
  startDate: today(),
  codeFontSize: 14,
});

function load<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback();
    return { ...fallback(), ...JSON.parse(raw) };
  } catch {
    return fallback();
  }
}

// ───────────────────────── tiny external store ─────────────────────────
let progress: ProgressState = load(PROGRESS_KEY, defaultProgress);
let settings: Settings = load(SETTINGS_KEY, defaultSettings);
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* storage may be full or blocked — the app still works for the session */
  }
}
function setProgress(next: ProgressState) {
  progress = next;
  persist();
  emit();
}
function bump(p: ProgressState, n = 1): ProgressState {
  const d = today();
  return { ...p, activity: { ...p.activity, [d]: (p.activity[d] ?? 0) + n } };
}

export function applyTheme(theme: Settings['theme']) {
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}

// ───────────────────────── actions ─────────────────────────
const DAY = 86_400_000;
const INTERVALS = [1, 3, 7, 14, 30, 60];

export const actions = {
  visitLesson(id: string) {
    const l = progress.lessons[id] ?? { visits: 0 };
    setProgress(bump({ ...progress, lessons: { ...progress.lessons, [id]: { ...l, visits: l.visits + 1, lastVisited: Date.now() } } }));
  },
  setComplete(id: string, done: boolean) {
    const l = progress.lessons[id] ?? { visits: 0 };
    const lessons = { ...progress.lessons, [id]: { ...l, completedAt: done ? Date.now() : undefined } };
    const revision = { ...progress.revision };
    if (done && !revision[id]) revision[id] = { due: Date.now() + DAY, interval: 1, reps: 0 };
    if (!done) delete revision[id];
    setProgress(bump({ ...progress, lessons, revision }));
  },
  toggleBookmark(id: string) {
    const l = progress.lessons[id] ?? { visits: 0 };
    setProgress({ ...progress, lessons: { ...progress.lessons, [id]: { ...l, bookmarked: !l.bookmarked } } });
  },
  recordQuiz(id: string, correct: number, total: number) {
    const l = progress.lessons[id] ?? { visits: 0 };
    const q = l.quiz;
    const pct = total ? correct / total : 0;
    const quiz = { best: Math.max(q?.best ?? 0, pct), last: pct, attempts: (q?.attempts ?? 0) + 1, at: Date.now(), total };
    // spaced repetition: a good score pushes the next review further out, a weak one brings it back to tomorrow
    const prev = progress.revision[id];
    let revision = progress.revision;
    if (prev || l.completedAt) {
      const reps = pct >= 0.8 ? (prev?.reps ?? 0) + 1 : 0;
      const interval = INTERVALS[Math.min(reps, INTERVALS.length - 1)];
      revision = { ...progress.revision, [id]: { reps, interval, due: Date.now() + interval * DAY } };
    }
    setProgress(bump({ ...progress, revision, lessons: { ...progress.lessons, [id]: { ...l, quiz } } }, 2));
  },
  markReviewed(id: string, good: boolean) {
    const prev = progress.revision[id] ?? { reps: 0, interval: 1, due: Date.now() };
    const reps = good ? prev.reps + 1 : 0;
    const interval = INTERVALS[Math.min(reps, INTERVALS.length - 1)];
    setProgress(bump({ ...progress, revision: { ...progress.revision, [id]: { reps, interval, due: Date.now() + interval * DAY } } }));
  },
  recordPrereqCheck(id: string) {
    const l = progress.lessons[id] ?? { visits: 0 };
    setProgress({ ...progress, lessons: { ...progress.lessons, [id]: { ...l, prereqCheckedAt: Date.now() } } });
  },
  patchExercise(id: string, patch: Partial<ExerciseProgress>) {
    const e = progress.exercises[id] ?? { attempts: 0, solved: false, hintsUsed: 0, solutionViewed: false };
    const next = { ...e, ...patch };
    if (patch.solved && !e.solved) next.solvedAt = Date.now();
    setProgress(bump({ ...progress, exercises: { ...progress.exercises, [id]: next } }));
  },
  recordAttempt(id: string, solved: boolean, code?: string) {
    const e = progress.exercises[id] ?? { attempts: 0, solved: false, hintsUsed: 0, solutionViewed: false };
    const next: ExerciseProgress = { ...e, attempts: e.attempts + 1, solved: e.solved || solved, lastCode: code ?? e.lastCode };
    if (solved && !e.solved) next.solvedAt = Date.now();
    setProgress(bump({ ...progress, exercises: { ...progress.exercises, [id]: next } }));
  },
  saveDraft(id: string, code: string) {
    const e = progress.exercises[id] ?? { attempts: 0, solved: false, hintsUsed: 0, solutionViewed: false };
    progress = { ...progress, exercises: { ...progress.exercises, [id]: { ...e, lastCode: code } } };
    persist(); // quiet save: no re-render storm while typing
  },
  recordFlashcard(id: string, right: boolean) {
    const f = progress.flashcards[id] ?? { box: 0, due: 0, seen: 0, right: 0 };
    const box = right ? Math.min(f.box + 1, 4) : 0;
    const days = [0, 1, 3, 7, 21][box];
    setProgress(bump({ ...progress, flashcards: { ...progress.flashcards, [id]: { box, due: Date.now() + days * DAY, seen: f.seen + 1, right: f.right + (right ? 1 : 0) } } }));
  },
  recordAssessment(r: AssessmentResult) {
    setProgress(bump({ ...progress, assessments: [...progress.assessments, r] }, 5));
  },
  setVideoWatched(key: string, watched: boolean) {
    setProgress({ ...progress, video: { ...progress.video, [key]: { watched } } });
  },
  updateSettings(patch: Partial<Settings>) {
    settings = { ...settings, ...patch };
    persist();
    if (patch.theme) applyTheme(settings.theme);
    emit();
  },
  resetProgress() {
    setProgress(defaultProgress());
  },
  exportJSON(): string {
    return JSON.stringify({ app: 'java-foundations-to-algorithm-mastery', exportedAt: new Date().toISOString(), progress, settings }, null, 2);
  },
  importJSON(text: string): { ok: boolean; message: string } {
    try {
      const data = JSON.parse(text);
      if (data?.app !== 'java-foundations-to-algorithm-mastery' || !data.progress || data.progress.version !== 1) {
        return { ok: false, message: 'This file is not a progress export from this app.' };
      }
      progress = { ...defaultProgress(), ...data.progress };
      if (data.settings) settings = { ...defaultSettings(), ...data.settings };
      persist();
      applyTheme(settings.theme);
      emit();
      return { ok: true, message: 'Progress imported.' };
    } catch (e) {
      return { ok: false, message: 'Could not read the file: ' + String(e) };
    }
  },
};

// ───────────────────────── hooks ─────────────────────────
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, () => progress);
}
export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, () => settings);
}
export const getProgress = () => progress;
export const getSettings = () => settings;
