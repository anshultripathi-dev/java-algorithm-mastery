import type { LabAlgorithm, TraceStep, Mark } from '../types';
import { arr, err } from './helpers';

export const strobogrammatic: LabAlgorithm = {
  id: 'strobogrammatic',
  title: 'Strobogrammatic check',
  lesson: 'a-strobogrammatic',
  summary: 'Two pointers: rotate(left) must equal right.',
  inputs: [{ key: 's', label: 'number', default: '906', type: 'text' }],
  pseudocode: ['left = 0; right = n - 1', 'while (left <= right) {', '    if rotate(s[left]) != s[right]: return false', '    left++; right--', '}', 'return true'],
  run({ s }) {
    if (!/^\d{1,16}$/.test(s)) return err('Enter 1–16 digits.');
    const rot: Record<string, string> = { '0': '0', '1': '1', '8': '8', '6': '9', '9': '6' };
    const chars = s.split('');
    const steps: TraceStep[] = [{ note: 'Rotation map: 0→0, 1→1, 8→8, 6→9, 9→6.', line: 0, vars: { left: 0, right: chars.length - 1 }, arrays: [arr('digits', chars)] }];
    let l = 0, r = chars.length - 1;
    while (l <= r) {
      const want = rot[chars[l]];
      const ok = want !== undefined && want === chars[r];
      steps.push({ note: want === undefined ? `${chars[l]} has no valid rotation → false.` : `rotate(${chars[l]}) = ${want}; s[${r}] = ${chars[r]} → ${ok ? 'match' : 'mismatch → false'}.`, line: 2, vars: { left: l, right: r, rotated: want ?? '✗' }, arrays: [arr('digits', chars, { [l]: ok ? 'found' : 'bad', [r]: ok ? 'found' : 'bad' }, { [l]: 'L', [r]: 'R' })] });
      if (!ok) return { steps, result: `${s} is NOT strobogrammatic` };
      l++;
      r--;
    }
    return { steps, result: `${s} IS strobogrammatic` };
  },
};

export const lexPalindrome: LabAlgorithm = {
  id: 'lex-palindrome',
  title: 'Lexicographically first palindrome',
  lesson: 'a-lex-palindrome',
  summary: 'Count letters; half of each in alphabetical order; odd letter in the middle; mirror.',
  inputs: [{ key: 's', label: 'word', default: 'malayalam', type: 'text' }],
  pseudocode: ['count letters', 'odd = letters with odd count', 'if odd > 1: no palindromic string', 'front = (count/2 copies of each letter, a..z)', 'return front + oddLetter + reverse(front)'],
  run({ s }) {
    if (!/^[A-Za-z]{1,24}$/.test(s)) return err('Enter 1–24 letters.');
    const w = s.toLowerCase();
    const f: Record<string, number> = {};
    for (const c of w) f[c] = (f[c] ?? 0) + 1;
    const keys = Object.keys(f).sort();
    const steps: TraceStep[] = [{ note: `Letter counts: ${keys.map((k) => `${k}:${f[k]}`).join('  ')}`, line: 0, vars: Object.fromEntries(keys.map((k) => [k, f[k]])) }];
    const odds = keys.filter((k) => f[k] % 2 === 1);
    steps.push({ note: odds.length ? `Letters with an odd count: ${odds.join(', ')}.` : 'No letter has an odd count.', line: 1, vars: { 'odd letters': odds.join(' ') || '—' } });
    if (odds.length > 1) {
      steps.push({ note: 'More than one odd letter: a palindrome is impossible.', line: 2, vars: {} });
      return { steps, result: 'no palindromic string' };
    }
    const front = keys.map((k) => k.repeat(Math.floor(f[k] / 2))).join('');
    steps.push({ note: `Front half (sorted): "${front}".`, line: 3, vars: { front } });
    const res = front + (odds[0] ?? '') + [...front].reverse().join('');
    steps.push({ note: `Result = front + "${odds[0] ?? ''}" + mirror(front).`, line: 4, vars: { result: res } });
    return { steps, result: res };
  },
};

export const manacher: LabAlgorithm = {
  id: 'manacher',
  title: "Manacher's algorithm",
  lesson: 'a-manacher',
  summary: 'Radius array over the #-padded string using the mirror trick.',
  inputs: [{ key: 's', label: 'string (≤ 12)', default: 'abaxabaxabb', type: 'text' }],
  pseudocode: ['t = "#a#b#..#"', 'for each i:', '    if i < right: radius[i] = min(right - i, radius[2*center - i])', '    expand while t[i-r-1] == t[i+r+1]', '    if i + radius[i] > right: center = i; right = i + radius[i]'],
  run({ s }) {
    if (!/^[A-Za-z0-9]{1,12}$/.test(s)) return err('Enter 1–12 letters or digits.');
    const t = '#' + s.split('').join('#') + '#';
    const n = t.length;
    const rad = Array(n).fill(0);
    let c = 0, R = 0;
    const steps: TraceStep[] = [{ note: `Padded string t = "${t}" (length ${n}).`, line: 0, vars: { center: 0, right: 0 }, arrays: [arr('t', t.split(''), {}), arr('radius', [...rad], {})] }];
    for (let i = 0; i < n; i++) {
      let note = '';
      if (i < R) {
        const mirror = 2 * c - i;
        rad[i] = Math.min(R - i, rad[mirror]);
        note = `i = ${i} is inside the palindrome (center ${c}, right ${R}); mirror = ${mirror} → start with radius ${rad[i]}. `;
      } else note = `i = ${i} is outside any known palindrome: start at 0. `;
      const start = rad[i];
      while (i - rad[i] - 1 >= 0 && i + rad[i] + 1 < n && t[i - rad[i] - 1] === t[i + rad[i] + 1]) rad[i]++;
      note += rad[i] > start ? `Extended to ${rad[i]}.` : 'No extension possible.';
      if (i + rad[i] > R) {
        c = i;
        R = i + rad[i];
        note += ` New center ${c}, right edge ${R}.`;
      }
      steps.push({ note, line: 3, vars: { i, 'radius[i]': rad[i], center: c, right: R }, arrays: [arr('t', t.split(''), { [i]: 'cur' }), arr('radius', [...rad], { [i]: 'found' })] });
    }
    let best = 0;
    rad.forEach((r, i) => {
      if (r > rad[best]) best = i;
    });
    const startIdx = (best - rad[best]) / 2;
    return { steps, result: `longest palindromic substring: "${s.substr(startIdx, rad[best])}" (length ${rad[best]})` };
  },
};
