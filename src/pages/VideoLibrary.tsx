import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS } from '@/data/lessons';
import { MODULES } from '@/data/curriculum/modules';
import { VideoCard } from '@/components/VideoCard';
import { PageHeader } from '@/components/ui';
import { getVideo } from '@/lib/videos';

export function VideoLibrary() {
  const [q, setQ] = useState('');
  const [mod, setMod] = useState('all');
  const [kind, setKind] = useState<'all' | 'video' | 'search'>('all');
  const rows = useMemo(
    () =>
      LESSONS.map((l) => ({
        l,
        vids: l.videos.map((k) => ({ k, v: getVideo(k, l.title) })),
      }))
        .map((r) => ({ ...r, vids: r.vids.filter(({ v }) => (kind === 'all' || v.kind === kind) && (!q || `${v.title} ${v.channel ?? ''} ${v.covers} ${r.l.title}`.toLowerCase().includes(q.toLowerCase()))) }))
        .filter((r) => (mod === 'all' || r.l.module === mod) && r.vids.length > 0),
    [q, mod, kind],
  );
  const all = LESSONS.flatMap((l) => l.videos.map((k) => getVideo(k, l.title)));
  const verified = new Set(all.filter((v) => v.kind === 'video').map((v) => v.videoId)).size;
  return (
    <div>
      <PageHeader title="Video library" subtitle={`${verified} distinct verified YouTube videos plus targeted search links where no specific video could be verified. Search links are labelled clearly.`} />
      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-3">
        <input className="input" placeholder="Search videos, channels, topics…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search videos" />
        <select className="input" value={mod} onChange={(e) => setMod(e.target.value)} aria-label="Module">
          <option value="all">All modules</option>
          {MODULES.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <select className="input" value={kind} onChange={(e) => setKind(e.target.value as any)} aria-label="Type">
          <option value="all">Verified videos and search links</option>
          <option value="video">Verified videos only</option>
          <option value="search">Search links only</option>
        </select>
      </div>
      <div className="space-y-8">
        {MODULES.map((m) => {
          const rs = rows.filter((r) => r.l.module === m.id);
          if (!rs.length) return null;
          return (
            <section key={m.id}>
              <h2 className="mb-3 text-lg font-bold">{m.title}</h2>
              <div className="space-y-5">
                {rs.map(({ l, vids }) => (
                  <div key={l.id}>
                    <Link to={`/lesson/${l.id}`} className="mb-2 block text-sm font-semibold text-brand-700 hover:underline dark:text-indigo-300">{l.title}</Link>
                    <div className="grid gap-3 md:grid-cols-2">
                      {vids.map(({ k }) => <VideoCard key={k} videoKey={k} topic={l.title} />)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        {rows.length === 0 && <div className="card p-8 text-center text-slate-500">No videos match.</div>}
      </div>
    </div>
  );
}
