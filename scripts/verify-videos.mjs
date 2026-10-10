// Re-validates every `kind: "video"` entry in src/data/video-resources/video-metadata.json against YouTube's
// public oEmbed endpoint (no API key): the video must still exist and its title / channel must match what we stored.
//
//   npm run verify:videos
//
// Exit code 1 if any video is gone or its metadata changed. Videos whose owners disabled embedding answer 401 on
// oEmbed even though they play fine; those are reported as "unverifiable" rather than "broken".
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const file = join(import.meta.dirname, '..', 'src', 'data', 'video-resources', 'video-metadata.json');
const data = JSON.parse(readFileSync(file, 'utf8'));
const entries = Object.entries(data).filter(([, v]) => v.kind === 'video');
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = 0, changed = 0, gone = 0, unverifiable = 0;
const seen = new Map();
for (const [key, v] of entries) {
  if (seen.has(v.videoId)) {
    seen.get(v.videoId).push(key);
    continue;
  }
  seen.set(v.videoId, [key]);
}
for (const [id, keys] of seen) {
  const v = data[keys[0]];
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}&format=json`;
  try {
    const res = await fetch(url);
    if (res.status === 404) {
      console.log(`✗ GONE        ${id}  ${keys.join(', ')}  (${v.title})`);
      gone++;
    } else if (res.status === 401 || res.status === 403) {
      console.log(`? unverifiable ${id}  ${keys.join(', ')}  (embedding disabled; open it manually)`);
      unverifiable++;
    } else if (!res.ok) {
      console.log(`? HTTP ${res.status}   ${id}  ${keys.join(', ')}`);
      unverifiable++;
    } else {
      const j = await res.json();
      const titleSame = norm(j.title) === norm(v.title) || norm(j.title).includes(norm(v.title).slice(0, 25));
      const chanSame = !v.channel || norm(j.author_name) === norm(v.channel);
      if (titleSame && chanSame) ok++;
      else {
        changed++;
        console.log(`≠ CHANGED     ${id}  ${keys.join(', ')}\n    stored: ${v.title} — ${v.channel}\n    now:    ${j.title} — ${j.author_name}`);
      }
    }
  } catch (e) {
    console.log(`? network     ${id}: ${e.message}`);
    unverifiable++;
  }
  await sleep(250);
}
console.log(`\n${seen.size} distinct videos: ${ok} verified, ${changed} changed, ${gone} gone, ${unverifiable} unverifiable.`);
process.exit(gone || changed ? 1 : 0);
