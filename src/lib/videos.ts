import type { VideoResource } from './types';
import { VIDEOS } from '@/data/video-resources/videos';

export function videoUrl(v: VideoResource): string {
  if (v.kind === 'video' && v.videoId) return `https://www.youtube.com/watch?v=${v.videoId}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(v.query ?? v.title)}`;
}

/** Resolve a video key; if nothing is registered, fall back to an honest, labelled search link. */
export function getVideo(key: string, fallbackTopic: string): VideoResource {
  const v = VIDEOS[key];
  if (v) return v;
  return { key, kind: 'search', title: `Search: ${fallbackTopic}`, covers: fallbackTopic, query: `${fallbackTopic} java explained` };
}
