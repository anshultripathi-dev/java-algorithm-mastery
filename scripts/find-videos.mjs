// Dev-time tool: look up candidate YouTube videos for every lesson key in scripts/video-queries.mjs.
// It reads YouTube's own search results page (video id, title, channel, duration are taken verbatim
// from YouTube — nothing is invented), scores candidates, and writes a JSON file for review.
//
//   node scripts/find-videos.mjs <out.json>
//
// The chosen entries are then written into src/data/video-resources/videos.ts (see scripts/write-videos.mjs).
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { VIDEO_QUERIES } from './video-queries.mjs';

const OUT = process.argv[2] ?? 'video-candidates.json';
// raw search results are cached next to the output so an interrupted / throttled run can simply be re-run
const CACHE = OUT.replace(/\.json$/, '') + '.cache.json';
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};

const PREFERRED = [
  'telusko', 'bro code', 'programming with mosh', 'freecodecamp', 'neso academy', "jenny's lectures", 'abdul bari', 'take u forward',
  'cs dojo', 'apna college', 'kunal kushwaha', 'william fiset', 'neetcode', 'reducible', 'back to back swe', 'mycodeschool',
  'tushar roy', 'gate smashers', 'coding with john', 'geeksforgeeks', 'mit opencourseware', 'cs50', 'hackerrank', 'tech with tim',
  'kevin powell', 'caleb curry', 'derek banas', 'codewithharry', 'code with harry', 'easy engineering classes', 'knowledge gate',
  'numberphile', '3blue1brown', 'brian yu', 'harvard', 'stanford', 'jacob sorber', 'coding simplified', 'java brains', 'in28minutes',
  'cs dojo', 'cs50', 'computerphile', 'tutorials point', 'tutorialspoint', 'sdsubham', 'codingNinjas'.toLowerCase(), 'coding ninjas',
  'programiz', 'alex lee', 'nick white', 'errichto', 'algorithms live', 'algoexpert', 'greg hogg', 'abdul bari', 'mathologer', 'nesoacademy',
  'kunal', 'striver', 'wrath of math', 'professor leonard', 'khan academy', 'numberphile', 'ravindrababu ravula', 'durga software',
];
const STOP = new Set(['java', 'algorithm', 'explained', 'tutorial', 'in', 'for', 'the', 'and', 'of', 'a', 'to', 'how', 'with', 'vs', 'is', 'an', 'code', 'example', 'examples', 'problem']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function seconds(len) {
  if (!len || len === '?') return 0;
  const p = len.split(':').map(Number);
  return p.reduce((a, b) => a * 60 + b, 0);
}

async function search(q) {
  const res = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(q) + '&hl=en', {
    headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36', 'accept-language': 'en-US,en;q=0.9' },
  });
  const html = await res.text();
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!m) return [];
  const data = JSON.parse(m[1]);
  const out = [];
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (o.videoRenderer) {
      const v = o.videoRenderer;
      out.push({
        id: v.videoId,
        duration: v.lengthText?.simpleText ?? '',
        channel: v.ownerText?.runs?.[0]?.text ?? '',
        title: v.title?.runs?.map((r) => r.text).join('') ?? '',
      });
    }
    for (const k in o) walk(o[k]);
  };
  walk(data);
  return out;
}

function score(c, q, rank) {
  const tokens = q.toLowerCase().split(/[^a-z0-9+#']+/).filter((t) => t.length > 1 && !STOP.has(t));
  const title = c.title.toLowerCase();
  const hit = tokens.filter((t) => title.includes(t.replace(/'s$/, ''))).length;
  let s = (tokens.length ? hit / tokens.length : 0) * 5;
  const ch = c.channel.toLowerCase();
  if (PREFERRED.some((p) => ch.includes(p))) s += 2;
  const sec = seconds(c.duration);
  if (sec === 0) s -= 5;
  else if (sec < 150) s -= 3;
  else if (sec <= 40 * 60) s += 1.5;
  else if (sec <= 90 * 60) s += 0.3;
  else s -= 1.5;
  if (/shorts?\b/i.test(c.title)) s -= 5;
  s += Math.max(0, 1.2 - rank * 0.25);
  return s;
}

const results = {};
const used = new Set();
for (const [lessonId, pairs] of Object.entries(VIDEO_QUERIES)) {
  for (let i = 0; i < pairs.length; i++) {
    const key = i === 0 ? lessonId : `${lessonId}#${i + 1}`;
    const [q, covers] = pairs[i];
    let cands = cache[q] ?? [];
    const fromCache = cands.length > 0;
    for (let attempt = 0; attempt < 5 && cands.length === 0; attempt++) {
      try {
        cands = await search(q);
      } catch (e) {
        cands = [];
      }
      if (cands.length === 0) await sleep(4000 * (attempt + 1)); // throttled: back off
      else {
        cache[q] = cands;
        writeFileSync(CACHE, JSON.stringify(cache));
      }
    }
    const scored = cands.slice(0, 10).map((c, rank) => ({ ...c, score: +score(c, q, rank).toFixed(2) })).sort((a, b) => b.score - a.score);
    const pick = scored.find((c) => !used.has(c.id)) ?? scored[0];
    if (pick) used.add(pick.id);
    results[key] = { query: q, covers, pick: pick ?? null, alternatives: scored.slice(0, 5) };
    console.log(`${key.padEnd(34)} ${pick ? `${pick.id} | ${pick.duration.padEnd(7)} | ${pick.channel.slice(0, 22).padEnd(22)} | ${pick.title.slice(0, 70)}` : 'NO RESULT'}`);
    if (!fromCache) await sleep(1200);
  }
}
writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(`\nwrote ${OUT}`);
