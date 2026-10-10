import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, ChevronDown, ChevronRight, FlaskConical, GraduationCap, LayoutDashboard, Menu, Moon, Play, Repeat, Search, Settings, Sun, Swords, Video, X, Library } from 'lucide-react';
import { LESSONS } from '@/data/lessons';
import { MODULES } from '@/data/curriculum/modules';
import { actions, useProgress, useSettings } from '@/lib/store';
import { lessonStatus } from '@/lib/progress';
import { StatusIcon } from '@/components/ui';
import { search } from './search';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/plan', label: 'Study plan', icon: CalendarDays },
  { to: '/curriculum', label: 'Curriculum', icon: BookOpen },
  { to: '/practice', label: 'Practice arena', icon: Swords },
  { to: '/playground', label: 'Code playground', icon: Play },
  { to: '/lab', label: 'Dry-run & complexity lab', icon: FlaskConical },
  { to: '/revision', label: 'Revision center', icon: Repeat },
  { to: '/videos', label: 'Video library', icon: Video },
  { to: '/settings', label: 'Settings & progress', icon: Settings },
];

function SearchPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const hits = useMemo(() => search(q), [q]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 p-4 pt-[12vh]" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search">
      <div className="card w-full max-w-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-3 dark:border-slate-800">
          <Search className="h-4 w-4 text-slate-400" />
          <input autoFocus className="w-full bg-transparent py-3 text-sm outline-none" placeholder="Search lessons, practice problems, videos…" value={q} onChange={(e) => setQ(e.target.value)} />
          <span className="kbd">esc</span>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto">
          {q && hits.length === 0 && <li className="p-4 text-sm text-slate-500">No matches.</li>}
          {hits.map((h, i) => (
            <li key={i}>
              <button
                className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => {
                  nav(h.to);
                  onClose();
                }}
              >
                <span className="chip mt-0.5 bg-slate-200 dark:bg-slate-700">{h.kind}</span>
                <span>
                  <span className="block text-sm font-medium">{h.title}</span>
                  <span className="block text-xs text-slate-500">{h.subtitle}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const progress = useProgress();
  const loc = useLocation();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const activeLesson = loc.pathname.startsWith('/lesson/') ? loc.pathname.split('/')[2] : null;
  const activeModule = LESSONS.find((l) => l.id === activeLesson)?.module;
  return (
    <nav aria-label="Main" className="flex h-full flex-col gap-1 overflow-y-auto p-3">
      <div className="mb-3 flex items-center gap-2 px-2 py-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold">Java Foundations</div>
          <div className="text-[11px] text-slate-500">to Algorithm Mastery</div>
        </div>
      </div>
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-indigo-950/60 dark:text-indigo-200' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
          <n.icon className="h-4 w-4" />
          {n.label}
        </NavLink>
      ))}
      <div className="mt-4 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Modules</div>
      {MODULES.map((m) => {
        const ls = LESSONS.filter((l) => l.module === m.id);
        const isOpen = open[m.id] ?? m.id === activeModule;
        const done = ls.filter((l) => progress.lessons[l.id]?.completedAt).length;
        return (
          <div key={m.id}>
            <button className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen((o) => ({ ...o, [m.id]: !isOpen }))} aria-expanded={isOpen}>
              {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
              <span className="flex-1 truncate">{m.title}</span>
              <span className="text-[11px] text-slate-500">
                {done}/{ls.length}
              </span>
            </button>
            {isOpen && (
              <ul className="ml-4 border-l border-slate-200 pl-2 dark:border-slate-800">
                {ls.map((l) => (
                  <li key={l.id}>
                    <NavLink to={`/lesson/${l.id}`} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-2 rounded-md px-2 py-1 text-[13px] ${isActive ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-indigo-950/60 dark:text-indigo-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                      <StatusIcon status={lessonStatus(progress, l.id)} className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{l.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
      <div className="mt-auto flex items-center gap-2 px-2 pt-4 text-[11px] text-slate-500">
        <Library className="h-3.5 w-3.5" /> Target: Java 17 (LTS)
      </div>
    </nav>
  );
}

export function Layout() {
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const settings = useSettings();
  const loc = useLocation();
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  const dark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
      <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
        <Sidebar onNavigate={() => {}} />
      </aside>
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-950/50" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-slate-900">
            <button className="absolute right-2 top-2 rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setDrawer(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-slate-200 bg-white/85 px-3 py-2 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-950/85">
          <button className="btn-ghost btn-sm lg:hidden" onClick={() => setDrawer(true)} aria-label="Open menu">
            <Menu className="h-4 w-4" />
          </button>
          <button className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-sm text-slate-500 hover:bg-slate-100 sm:max-w-md dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800" onClick={() => setPalette(true)}>
            <Search className="h-4 w-4" />
            <span className="flex-1">Search…</span>
            <span className="kbd hidden sm:inline">⌘K</span>
          </button>
          <div className="ml-auto" />
          <button className="btn-ghost btn-sm" aria-label="Toggle theme" onClick={() => actions.updateSettings({ theme: dark ? 'light' : 'dark' })}>
            {dark || settings.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>
        <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
      {palette && <SearchPalette onClose={() => setPalette(false)} />}
    </div>
  );
}
