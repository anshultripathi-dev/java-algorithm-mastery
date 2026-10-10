import { ExternalLink, PlayCircle, Search } from 'lucide-react';
import { getVideo, videoUrl } from '@/lib/videos';
import { actions, useProgress } from '@/lib/store';

export function VideoCard({ videoKey, topic }: { videoKey: string; topic: string }) {
  const v = getVideo(videoKey, topic);
  const progress = useProgress();
  const watched = progress.video[videoKey]?.watched;
  const verified = v.kind === 'video';
  return (
    <div className="card flex items-start gap-3 p-3">
      <div className={`mt-0.5 rounded-lg p-2 ${verified ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{verified ? <PlayCircle className="h-5 w-5" /> : <Search className="h-5 w-5" />}</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`chip ${verified ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'}`}>{verified ? 'verified video' : 'search link (not a verified video)'}</span>
          {v.duration && <span className="chip bg-slate-100 dark:bg-slate-800">{v.duration}</span>}
        </div>
        <div className="mt-1 text-sm font-semibold leading-snug">{v.title}</div>
        <div className="text-xs text-slate-500">
          {v.channel ? `${v.channel} · ` : ''}
          {v.covers}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <a className="btn-primary btn-sm" href={videoUrl(v)} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" /> Watch tutorial
          </a>
          <label className="flex items-center gap-1.5 text-xs text-slate-500">
            <input type="checkbox" checked={!!watched} onChange={(e) => actions.setVideoWatched(videoKey, e.target.checked)} /> watched
          </label>
        </div>
      </div>
    </div>
  );
}
