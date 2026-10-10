import type { VideoResource } from '@/lib/types';
import data from './video-metadata.json';

/**
 * Central video metadata — correct a link in video-metadata.json (one place) and the website, the video
 * library and every PDF update. `kind: 'video'` entries were retrieved from YouTube (id, title, channel and
 * duration are YouTube's own values); `kind: 'search'` entries are targeted search links, NOT verified videos
 * (the app shows a search link whenever a key has no entry here).
 *
 * `npm run verify:videos` re-checks every `video` entry against YouTube's oEmbed endpoint.
 * `scripts/find-videos.mjs` + `scripts/write-videos.mjs` document how the entries were found and chosen.
 */
export const VIDEOS: Record<string, VideoResource> = data as Record<string, VideoResource>;
