// Turns the reviewed candidate list produced by scripts/find-videos.mjs into
// src/data/video-resources/video-metadata.json (the single source of video metadata).
//
//   node scripts/write-videos.mjs <video-candidates.json>
//
// Every entry's id, title, channel and duration are YouTube's own values from the search results.
// OVERRIDES records the places where a human reviewer preferred a different candidate than the scorer did.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const input = process.argv[2];
if (!input) throw new Error('usage: node scripts/write-videos.mjs <video-candidates.json>');
const data = JSON.parse(readFileSync(input, 'utf8'));

/** key → preferred video id (must be among that key's candidates) */
const OVERRIDES = {
  'm1-loops': '6djggrlkHY8',
  'm1-debugging-tracing': 'V5iQ1FyRtBo',
  'm2-arrays-2d': 'Qf3Nczxm2AY',
  'm2-arrays-2d#2': '18Zt5I4S45o',
  'm3-collections-queues-deques': 'PvDoT79oHTs',
  'm3-collections-queues-deques#2': '7z_HXFZqXqc',
  'm4-iteration-vs-recursion': 'zhk3kuicg00',
  'a-euclid-gcd#2': 'ijrmAEDkDv4',
  'a-binary-palindrome': 'ndcGd731XSg',
  'a-move-hyphen': 'sw70FjapQxQ',
  'a-natural-sort': 'AQ94fiDuGb0',
};

const LANG = [
  [/python/i, 'Python'],
  [/c\+\+|\bcpp\b/i, 'C++'],
  [/\bin c\b|programs? in c\b|\bc programm|\bc_\d+|\bc language\b/i, 'C'],
  [/javascript/i, 'JavaScript'],
  [/\bhindi\b/i, 'Hindi narration'],
  [/\btelugu\b/i, 'Telugu narration'],
  [/\btamil\b/i, 'Tamil narration'],
];

const out = {};
const used = new Map();
for (const [key, rec] of Object.entries(data)) {
  const wanted = OVERRIDES[key];
  const pick = wanted ? Object.values(data).flatMap((r) => r.alternatives).find((c) => c.id === wanted) : rec.pick;
  if (!pick) throw new Error(`no candidate for ${key}${wanted ? ` (override ${wanted} not found among any candidates)` : ''}`);
  if (used.has(pick.id)) console.warn(`! ${pick.id} used by both ${used.get(pick.id)} and ${key}`);
  used.set(pick.id, key);
  const notes = LANG.filter(([re]) => re.test(pick.title) || re.test(pick.channel)).map(([, n]) => n);
  const covers = rec.covers + (notes.length ? ` (${notes.join(', ')} — the idea transfers to Java)` : '');
  out[key] = {
    key,
    kind: 'video',
    title: pick.title,
    channel: pick.channel,
    videoId: pick.id,
    duration: pick.duration,
    covers,
    verifiedOn: new Date().toISOString().slice(0, 10),
  };
}
const file = join(import.meta.dirname, '..', 'src', 'data', 'video-resources', 'video-metadata.json');
writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${Object.keys(out).length} entries to ${file}`);
