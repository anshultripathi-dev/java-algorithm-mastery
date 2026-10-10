import { LESSONS } from '@/data/lessons';
import { VIDEOS } from '@/data/video-resources/videos';
import { stripInline } from '@/lib/inline';

export interface SearchHit {
  kind: 'lesson' | 'exercise' | 'video';
  title: string;
  subtitle: string;
  to: string;
}

export function search(q: string, limit = 12): SearchHit[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const score = (hay: string) => {
    const h = hay.toLowerCase();
    return terms.every((t) => h.includes(t)) ? terms.reduce((s, t) => s + (h.startsWith(t) ? 3 : 1), 0) : 0;
  };
  const hits: (SearchHit & { s: number })[] = [];
  for (const l of LESSONS) {
    const s = score(`${l.title} ${l.summary} ${l.id} ${l.sources.join(' ')}`) * 3;
    if (s) hits.push({ kind: 'lesson', title: l.title, subtitle: stripInline(l.summary), to: `/lesson/${l.id}`, s });
    for (const e of l.practice) {
      const es = score(`${e.title} ${e.statement}`);
      if (es) hits.push({ kind: 'exercise', title: e.title, subtitle: `Practice · ${l.title}`, to: `/practice?problem=${e.id}`, s: es });
    }
  }
  for (const v of Object.values(VIDEOS)) {
    const s = score(`${v.title} ${v.channel ?? ''} ${v.covers}`);
    if (s) hits.push({ kind: 'video', title: v.title, subtitle: `${v.channel ?? ''} · ${v.covers}`, to: '/videos', s });
  }
  return hits.sort((a, b) => b.s - a.s).slice(0, limit);
}
