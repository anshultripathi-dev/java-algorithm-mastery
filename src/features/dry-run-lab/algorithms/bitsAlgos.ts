import type { LabAlgorithm, TraceStep } from '../types';
import { arr, bin, err, ints } from './helpers';

export const binaryPalindrome: LabAlgorithm = {
  id: 'binary-palindrome',
  title: 'Binary palindrome (bit reversal)',
  lesson: 'a-binary-palindrome',
  summary: 'Peel bits off x and push them onto reversed; palindrome if reversed == x.',
  inputs: [{ key: 'n', label: 'n', default: '51', type: 'number' }],
  pseudocode: ['reversed = 0; rest = x;', 'while (rest > 0) {', '    reversed <<= 1;', '    reversed |= (rest & 1);', '    rest >>= 1;', '}', 'return reversed == x;'],
  run({ n }) {
    const x = Math.trunc(+n);
    if (!Number.isFinite(x) || x < 0 || x > 2 ** 30) return err('Enter a whole number between 0 and 2^30.');
    let rest = x;
    let rev = 0;
    const steps: TraceStep[] = [{ note: `x = ${x} = ${bin(x)} in binary.`, line: 0, vars: { x, rest, reversed: rev, 'rest bin': bin(rest), 'reversed bin': bin(rev) } }];
    while (rest > 0) {
      const bit = rest & 1;
      rev = rev * 2 + bit;
      rest = Math.floor(rest / 2);
      steps.push({ note: `Lowest bit of rest was ${bit}: shift reversed left and OR it in; then shift rest right.`, line: 3, vars: { x, rest, reversed: rev, 'rest bin': bin(rest), 'reversed bin': bin(rev) } });
    }
    const ok = rev === x;
    steps.push({ note: ok ? `reversed (${rev}) equals x (${x}): a binary palindrome.` : `reversed (${rev}) ≠ x (${x}): not a binary palindrome.`, line: 6, vars: { x, reversed: rev, palindrome: ok } });
    return { steps, result: ok ? `${x} (${bin(x)}) is a binary palindrome` : `${x} (${bin(x)}) is not a binary palindrome` };
  },
};

export const nibbleSwap: LabAlgorithm = {
  id: 'nibble-swap',
  title: 'Swap nibbles',
  lesson: 'a-nibble-swap',
  summary: 'Mask each nibble, shift it across, OR them together.',
  inputs: [{ key: 'n', label: 'byte value 0–255', default: '172', type: 'number' }],
  pseudocode: ['b = value & 0xFF;', 'upper = (b & 0xF0) >>> 4;', 'lower = (b & 0x0F) << 4;', 'return upper | lower;'],
  run({ n }) {
    const v = Math.trunc(+n);
    if (!Number.isFinite(v) || v < 0 || v > 255) return err('Enter a whole number between 0 and 255.');
    const upper = (v & 0xf0) >>> 4;
    const lower = (v & 0x0f) << 4;
    const r = upper | lower;
    const steps: TraceStep[] = [
      { note: `b = ${v} = ${bin(v, 8)}`, line: 0, vars: { b: v, bits: bin(v, 8) } },
      { note: `b & 0xF0 keeps the high nibble ${bin(v & 0xf0, 8)}; >>> 4 moves it to ${bin(upper, 8)}.`, line: 1, vars: { b: v, upper, 'upper bits': bin(upper, 8) } },
      { note: `b & 0x0F keeps the low nibble ${bin(v & 0x0f, 8)}; << 4 moves it to ${bin(lower, 8)}.`, line: 2, vars: { upper, lower, 'lower bits': bin(lower, 8) } },
      { note: `upper | lower = ${bin(r, 8)} = ${r}.`, line: 3, vars: { result: r, bits: bin(r, 8) } },
    ];
    return { steps, result: `${bin(v, 8)} → ${bin(r, 8)} (${v} → ${r})` };
  },
};

export const longestOnes: LabAlgorithm = {
  id: 'longest-ones',
  title: 'Longest run of 1s / flip one bit',
  lesson: 'a-longest-ones',
  summary: 'Scan the bits from the least significant end tracking the current and previous runs.',
  inputs: [{ key: 'n', label: 'n (non-negative, < 2^20)', default: '478', type: 'number' }],
  pseudocode: ['for each bit (low to high):', '    if bit == 1: current++', '    else: previous = current; current = 0', '    best = max(best, previous + current + 1)'],
  run({ n }) {
    const x = Math.trunc(+n);
    if (!Number.isFinite(x) || x < 0 || x >= 2 ** 20) return err('Enter a whole number between 0 and 2^20 − 1.');
    const width = Math.max(1, x.toString(2).length) + 1;
    const bits: number[] = [];
    for (let i = 0; i < width; i++) bits.push((x >> i) & 1);
    let cur = 0, prev = 0, best = 1, plain = 0, run = 0;
    const view = (idx: number) => [arr('bits (index 0 = least significant)', bits, { [idx]: 'cur' })];
    const steps: TraceStep[] = [{ note: `${x} in binary is ${bin(x)}. We scan from the lowest bit (index 0) upwards, including one leading 0.`, vars: { current: 0, previous: 0, best: 1 }, arrays: view(-1) }];
    for (let i = 0; i < width; i++) {
      if (bits[i] === 1) {
        cur++;
        run++;
        plain = Math.max(plain, run);
      } else {
        const nextIsZero = (i + 1 < width ? bits[i + 1] : 0) === 0;
        prev = nextIsZero ? 0 : cur;
        cur = 0;
        run = 0;
      }
      best = Math.max(best, prev + cur + 1);
      steps.push({ note: bits[i] === 1 ? `bit ${i} is 1: the current run grows to ${cur}.` : `bit ${i} is 0: previous = ${prev}, current resets to 0.`, vars: { current: cur, previous: prev, best, 'longest plain run': plain }, arrays: view(i) });
    }
    return { steps, result: `longest run of 1s = ${plain}; after flipping one bit = ${best}` };
  },
};

export const josephus: LabAlgorithm = {
  id: 'josephus',
  title: 'Josephus problem',
  lesson: 'a-josephus',
  summary: 'Every k-th person leaves the circle; the last one is the survivor.',
  inputs: [
    { key: 'n', label: 'people n (≤ 20)', default: '7', type: 'number' },
    { key: 'k', label: 'k', default: '3', type: 'number' },
  ],
  pseudocode: ['circle = [1..n]; index = 0', 'while (circle.size() > 1) {', '    index = (index + k - 1) % size', '    remove circle[index]', '}', 'survivor = circle[0]'],
  run({ n, k }) {
    const N = Math.trunc(+n), K = Math.trunc(+k);
    if (!Number.isFinite(N) || !Number.isFinite(K) || N < 1 || N > 20 || K < 1 || K > 50) return err('n must be 1–20 and k 1–50.');
    const circle = Array.from({ length: N }, (_, i) => i + 1);
    let idx = 0;
    const out: number[] = [];
    const steps: TraceStep[] = [{ note: `${N} people stand in a circle; counting starts at person 1.`, line: 0, vars: { index: 0, size: N }, arrays: [arr('circle', [...circle], { 0: 'cur' })] }];
    while (circle.length > 1) {
      idx = (idx + K - 1) % circle.length;
      const gone = circle.splice(idx, 1)[0];
      out.push(gone);
      const after = idx % circle.length;
      steps.push({ note: `Count ${K}: person ${gone} leaves. Counting restarts at ${circle[after]}.`, line: 3, vars: { eliminated: gone, index: after, size: circle.length }, arrays: [arr('circle', [...circle], { [after]: 'cur' }), arr('eliminated so far', [...out], {})] });
    }
    steps.push({ note: `Only ${circle[0]} is left: the survivor.`, line: 5, vars: { survivor: circle[0] }, arrays: [arr('circle', [...circle], { 0: 'found' })] });
    return { steps, result: `survivor = ${circle[0]} (order out: ${out.join(' ')})` };
  },
};

export const blockSwap: LabAlgorithm = {
  id: 'block-swap',
  title: 'Block swap rotation',
  lesson: 'a-block-swap',
  summary: 'Swap the shorter block with part of the longer one until the blocks are equal.',
  inputs: [
    { key: 'arr', label: 'array', default: '1,2,3,4,5,6,7', type: 'text' },
    { key: 'd', label: 'rotate left by d', default: '2', type: 'number' },
  ],
  pseudocode: ['i = d; j = n - d', 'while (i != j) {', '    if (i < j) { swap(d-i, d+j-i, i); j -= i; }', '    else       { swap(d-i, d, j);     i -= j; }', '}', 'swap(d - i, d, i)'],
  run({ arr: a, d }) {
    const A = ints(a, 16);
    let D = Math.trunc(+d);
    if (!A || !Number.isFinite(D) || D < 0) return err('Enter up to 16 integers and a non-negative d.');
    const n = A.length;
    D %= n;
    const w = [...A];
    const steps: TraceStep[] = [{ note: `Rotate left by ${D}. Block A = first ${D} elements, block B = the other ${n - D}.`, line: 0, vars: { i: D, j: n - D, d: D }, arrays: [arr('array', [...w], Object.fromEntries(w.map((_, k) => [k, k < D ? 'cur' : 'dim'] as const)))] }];
    if (D !== 0) {
      let i = D, j = n - D;
      const swap = (fi: number, si: number, len: number) => {
        const marks: Record<number, 'swap'> = {};
        for (let t = 0; t < len; t++) {
          [w[fi + t], w[si + t]] = [w[si + t], w[fi + t]];
          marks[fi + t] = 'swap';
          marks[si + t] = 'swap';
        }
        return marks;
      };
      while (i !== j && steps.length < 100) {
        let marks;
        let note;
        if (i < j) {
          marks = swap(D - i, D + j - i, i);
          j -= i;
          note = `A (size ${i}) is shorter: swap it with the last ${i} elements of B; B shrinks to ${j}.`;
        } else {
          marks = swap(D - i, D, j);
          i -= j;
          note = `A is longer: swap the last ${j} elements of A with B; A shrinks to ${i}.`;
        }
        steps.push({ note, line: i < j ? 2 : 3, vars: { i, j }, arrays: [arr('array', [...w], marks)] });
      }
      const marks = swap(D - i, D, i);
      steps.push({ note: `Blocks are equal (size ${i}): one final swap.`, line: 5, vars: { i, j }, arrays: [arr('array', [...w], marks)] });
    }
    return { steps, result: `[${w.join(', ')}]` };
  },
};
