import type { LabAlgorithm, TraceStep, Mark, TraceGrid } from '../types';
import { arr, err, ints, bin } from './helpers';

const num = (s: string | undefined) => (s === undefined || s.trim() === '' ? NaN : Math.trunc(+s));

// ───────────────────────── Module 1 ─────────────────────────

export const loopTrace: LabAlgorithm = {
  id: 'loop-trace',
  title: 'Loop with continue',
  lesson: 'm1-loops',
  summary: 'Trace a for loop that skips even numbers with continue and accumulates a sum.',
  inputs: [{ key: 'n', label: 'n (1–15)', default: '8', type: 'number' }],
  pseudocode: ['sum = 0', 'for i = 1 .. n:', '    if i % 2 == 0: continue', '    sum = sum + i', 'print sum'],
  run({ n }) {
    const N = num(n);
    if (!(N >= 1 && N <= 15)) return err('n must be 1–15.');
    const steps: TraceStep[] = [{ note: 'sum starts at 0.', line: 0, vars: { n: N, sum: 0 } }];
    let sum = 0;
    for (let i = 1; i <= N; i++) {
      steps.push({ note: `i = ${i}: loop condition i <= ${N} is true.`, line: 1, vars: { i, sum } });
      if (i % 2 === 0) {
        steps.push({ note: `${i} % 2 == 0 → continue: skip the addition and jump to the update i++.`, line: 2, vars: { i, sum, 'i % 2': 0 } });
        continue;
      }
      sum += i;
      steps.push({ note: `${i} is odd → sum = sum + ${i} = ${sum}.`, line: 3, vars: { i, sum, 'i % 2': 1 } });
    }
    steps.push({ note: `i = ${N + 1}: the condition i <= ${N} is false, the loop ends.`, line: 1, vars: { i: N + 1, sum } });
    return { steps, result: `sum = ${sum}` };
  },
};

export const gradeLadder: LabAlgorithm = {
  id: 'grade-ladder',
  title: 'if – else-if ladder',
  lesson: 'm1-if-else-switch',
  summary: 'Conditions are tested top to bottom; the first true branch runs and the rest are skipped.',
  inputs: [{ key: 'score', label: 'score (0–100)', default: '72', type: 'number' }],
  pseudocode: ['if score >= 90: grade = "A"', 'else if score >= 80: grade = "B"', 'else if score >= 70: grade = "C"', 'else if score >= 60: grade = "D"', 'else: grade = "F"'],
  run({ score }) {
    const s = num(score);
    if (!(s >= 0 && s <= 100)) return err('Score must be 0–100.');
    const tests: [number, string][] = [[90, 'A'], [80, 'B'], [70, 'C'], [60, 'D']];
    const steps: TraceStep[] = [];
    for (let k = 0; k < tests.length; k++) {
      const ok = s >= tests[k][0];
      steps.push({ note: `Test score >= ${tests[k][0]}: ${s} >= ${tests[k][0]} is ${ok}.${ok ? ` Run this branch: grade = "${tests[k][1]}". All remaining branches are skipped.` : ' Move to the next condition.'}`, line: k, vars: { score: s, [`score >= ${tests[k][0]}`]: ok } });
      if (ok) return { steps, result: `grade = ${tests[k][1]}` };
    }
    steps.push({ note: 'No condition was true, so the final else branch runs: grade = "F".', line: 4, vars: { score: s } });
    return { steps, result: 'grade = F' };
  },
};

export const byteOverflow: LabAlgorithm = {
  id: 'byte-overflow',
  title: 'byte overflow wrap-around',
  lesson: 'm1-conversion-casting-overflow',
  summary: 'A byte holds −128…127; adding past the end wraps silently to the other side.',
  inputs: [
    { key: 'start', label: 'start (−128…127)', default: '120', type: 'number' },
    { key: 'add', label: 'add each step (1–40)', default: '5', type: 'number' },
  ],
  pseudocode: ['byte b = start', 'repeat 8 times:', '    b = (byte)(b + add)   // wraps modulo 256'],
  run({ start, add }) {
    const S = num(start), A = num(add);
    if (!(S >= -128 && S <= 127)) return err('start must be −128…127.');
    if (!(A >= 1 && A <= 40)) return err('add must be 1–40.');
    const wrap = (v: number) => ((((v + 128) % 256) + 256) % 256) - 128;
    let b = S;
    const steps: TraceStep[] = [{ note: `b starts at ${b} (binary ${bin(b & 0xff, 8)}).`, line: 0, vars: { b, bits: bin(b & 0xff, 8) } }];
    for (let k = 1; k <= 8; k++) {
      const raw = b + A;
      const next = wrap(raw);
      steps.push({ note: raw === next ? `${b} + ${A} = ${raw}: fits in a byte.` : `${b} + ${A} = ${raw} does not fit; (byte) keeps only the low 8 bits → ${next}. No error or warning is produced.`, line: 2, vars: { step: k, 'b + add': raw, b: next, bits: bin(next & 0xff, 8) } });
      b = next;
    }
    return { steps, result: `b = ${b}` };
  },
};

// ───────────────────────── Module 2 ─────────────────────────

export const arrayScan: LabAlgorithm = {
  id: 'array-scan',
  title: 'Find the maximum (one scan)',
  lesson: 'm2-arrays-1d',
  summary: 'Keep the largest value seen so far and update it as the index moves right.',
  inputs: [{ key: 'arr', label: 'array', default: '7,3,9,4,9,2', type: 'text' }],
  pseudocode: ['max = a[0]; maxIndex = 0', 'for i = 1 .. n-1:', '    if a[i] > max:', '        max = a[i]; maxIndex = i', 'print max, maxIndex'],
  run({ arr: s }) {
    const a = ints(s, 14);
    if (!a) return err('Enter up to 14 integers separated by commas.');
    let max = a[0], mi = 0;
    const steps: TraceStep[] = [{ note: `Start by assuming the first element ${max} is the maximum.`, line: 0, vars: { i: 0, max, maxIndex: 0 }, arrays: [arr('a', a, { 0: 'found' }, { 0: 'i' })] }];
    for (let i = 1; i < a.length; i++) {
      const bigger = a[i] > max;
      if (bigger) {
        max = a[i];
        mi = i;
      }
      steps.push({ note: bigger ? `a[${i}] = ${a[i]} is larger than the previous maximum → max = ${max}.` : `a[${i}] = ${a[i]} is not larger than ${max} (ties do not replace it).`, line: bigger ? 3 : 2, vars: { i, max, maxIndex: mi }, arrays: [arr('a', a, { [mi]: 'found', [i]: bigger ? 'found' : 'cur' }, { [i]: 'i' })] });
    }
    return { steps, result: `max = ${max} at index ${mi}` };
  },
};

export const matrixRows: LabAlgorithm = {
  id: 'matrix-rows',
  title: 'Row sums and the main diagonal',
  lesson: 'm2-arrays-2d',
  summary: 'Nested loops visit every cell: the outer loop picks the row, the inner loop walks its columns.',
  inputs: [{ key: 'n', label: 'size n (2–5)', default: '4', type: 'number' }],
  pseudocode: ['for r = 0 .. n-1:', '    rowSum = 0', '    for c = 0 .. n-1:', '        rowSum += m[r][c]', '        if r == c: diag += m[r][c]'],
  run({ n }) {
    const N = num(n);
    if (!(N >= 2 && N <= 5)) return err('n must be 2–5.');
    const m = Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, c) => r * N + c + 1));
    const steps: TraceStep[] = [];
    let diag = 0;
    const grid = (marks: Record<string, Mark>): TraceGrid => ({ cells: m.map((row) => row.map(String)), marks });
    const done: Record<string, Mark> = {};
    for (let r = 0; r < N; r++) {
      let rowSum = 0;
      for (let c = 0; c < N; c++) {
        rowSum += m[r][c];
        if (r === c) diag += m[r][c];
        steps.push({ note: `m[${r}][${c}] = ${m[r][c]} → rowSum = ${rowSum}${r === c ? `; it is on the diagonal, so diag = ${diag}` : ''}.`, line: r === c ? 4 : 3, vars: { r, c, rowSum, diag }, grid: grid({ ...done, [`${r},${c}`]: 'cur' }) });
        done[`${r},${c}`] = r === c ? 'found' : 'done';
      }
    }
    return { steps, result: `diagonal sum = ${diag}` };
  },
};

export const reverseChars: LabAlgorithm = {
  id: 'reverse-chars',
  title: 'Reverse a string with two pointers',
  lesson: 'm2-strings',
  summary: 'Swap the characters at the two ends and move both pointers inwards.',
  inputs: [{ key: 's', label: 'word (≤ 12 chars)', default: 'racecar1', type: 'text' }],
  pseudocode: ['i = 0; j = n - 1', 'while i < j:', '    swap(c[i], c[j])', '    i++; j--'],
  run({ s }) {
    if (!s || s.length > 12 || /\s/.test(s)) return err('Enter a single word of 1–12 characters.');
    const c = s.split('');
    let i = 0, j = c.length - 1;
    const steps: TraceStep[] = [{ note: 'Pointers start at both ends.', line: 0, vars: { i, j }, arrays: [arr('chars', [...c], {}, { [i]: 'i', [j]: 'j' })] }];
    while (i < j) {
      [c[i], c[j]] = [c[j], c[i]];
      steps.push({ note: `Swap c[${i}] and c[${j}].`, line: 2, vars: { i, j }, arrays: [arr('chars', [...c], { [i]: 'swap', [j]: 'swap' }, { [i]: 'i', [j]: 'j' })] });
      i++;
      j--;
    }
    steps.push({ note: 'The pointers met or crossed: finished.', line: 1, vars: { i, j }, arrays: [arr('chars', [...c], Object.fromEntries(c.map((_, k) => [k, 'done'] as [number, Mark])))] });
    return { steps, result: c.join('') };
  },
};

export const factorialStack: LabAlgorithm = {
  id: 'factorial-stack',
  title: 'Recursion call stack: factorial(n)',
  lesson: 'm2-recursion',
  summary: 'Calls pile up on the stack until the base case, then each one returns and multiplies.',
  inputs: [{ key: 'n', label: 'n (1–8)', default: '4', type: 'number' }],
  pseudocode: ['fact(n):', '    if n <= 1: return 1        // base case', '    return n * fact(n - 1)     // recursive case'],
  run({ n }) {
    const N = num(n);
    if (!(N >= 1 && N <= 8)) return err('n must be 1–8.');
    const steps: TraceStep[] = [];
    const stack: string[] = [];
    const show = (extra: Record<number, Mark> = {}) => [arr('call stack (bottom → top)', [...stack], extra)];
    const rec = (k: number): number => {
      stack.push(`fact(${k})`);
      steps.push({ note: `Call fact(${k}); stack depth is ${stack.length}.`, line: 0, vars: { n: k, depth: stack.length }, arrays: show({ [stack.length - 1]: 'cur' }) });
      let r: number;
      if (k <= 1) {
        r = 1;
        steps.push({ note: 'Base case reached: return 1 without recursing.', line: 1, vars: { n: k, return: 1 }, arrays: show({ [stack.length - 1]: 'found' }) });
      } else {
        const sub = rec(k - 1);
        r = k * sub;
        steps.push({ note: `fact(${k - 1}) returned ${sub}, so fact(${k}) returns ${k} × ${sub} = ${r}.`, line: 2, vars: { n: k, return: r }, arrays: show({ [stack.length - 1]: 'found' }) });
      }
      stack.pop();
      return r;
    };
    const r = rec(N);
    return { steps, result: `${N}! = ${r}` };
  },
};

// ───────────────────────── Module 3 ─────────────────────────

export const stackQueue: LabAlgorithm = {
  id: 'stack-queue',
  title: 'Stack (LIFO) vs queue (FIFO)',
  lesson: 'm3-collections-queues-deques',
  summary: 'The same operations applied to a stack and to a queue: letters add, "-" removes.',
  inputs: [{ key: 'ops', label: 'operations (letters add, - removes)', default: 'a b c - - d -', type: 'text' }],
  pseudocode: ['for each token:', '    letter: stack.push(x); queue.offer(x)', '    "-":    stack.pop();  queue.poll()'],
  run({ ops }) {
    const toks = ops.split(/[\s,]+/).filter(Boolean);
    if (!toks.length || toks.length > 16 || toks.some((t) => t !== '-' && !/^[A-Za-z0-9]$/.test(t))) return err('Use up to 16 single characters; "-" removes.');
    const stack: string[] = [];
    const queue: string[] = [];
    const steps: TraceStep[] = [];
    const removed: string[] = [];
    for (const t of toks) {
      if (t === '-') {
        const s = stack.pop();
        const q = queue.shift();
        steps.push({ note: s === undefined ? 'Both are empty: pop/poll return nothing.' : `pop() removes the NEWEST item ${s}; poll() removes the OLDEST item ${q}.`, line: 2, vars: { token: '-', 'stack.pop': s ?? '∅', 'queue.poll': q ?? '∅' }, arrays: [arr('stack (top = last)', [...stack]), arr('queue (front = first)', [...queue])] });
        if (s !== undefined) removed.push(`${s}/${q}`);
      } else {
        stack.push(t);
        queue.push(t);
        steps.push({ note: `Add ${t} to both.`, line: 1, vars: { token: t }, arrays: [arr('stack (top = last)', [...stack], { [stack.length - 1]: 'cur' }), arr('queue (front = first)', [...queue], { [queue.length - 1]: 'cur' })] });
      }
    }
    return { steps, result: `removed (stack/queue): ${removed.join(', ') || 'nothing'}` };
  },
};

// ───────────────────────── Module 4 ─────────────────────────

export const listReverse: LabAlgorithm = {
  id: 'list-reverse',
  title: 'Reverse a singly linked list',
  lesson: 'm4-ds-overview',
  summary: 'Walk the list with prev / cur / next and flip each link as you go.',
  inputs: [{ key: 'arr', label: 'values (≤ 8)', default: '1,2,3,4,5', type: 'text' }],
  pseudocode: ['prev = null; cur = head', 'while cur != null:', '    next = cur.next       // remember the rest', '    cur.next = prev       // flip the link', '    prev = cur; cur = next', 'head = prev'],
  run({ arr: s }) {
    const a = ints(s, 8);
    if (!a) return err('Enter up to 8 integers.');
    const n = a.length;
    // next[i] = index of the node that node i points to (n = null)
    const nxt = a.map((_, i) => i + 1);
    const steps: TraceStep[] = [];
    let prev = -1, cur = 0;
    const links = () => a.map((v, i) => `${v}→${nxt[i] >= n || nxt[i] < 0 ? '∅' : a[nxt[i]]}`);
    const ptr = (p: number, c: number, nx?: number) => {
      const o: Record<number, string> = {};
      if (p >= 0) o[p] = 'prev';
      if (c >= 0 && c < n) o[c] = o[c] ? `${o[c]}/cur` : 'cur';
      if (nx !== undefined && nx >= 0 && nx < n) o[nx] = o[nx] ? `${o[nx]}/next` : 'next';
      return o;
    };
    steps.push({ note: 'prev is null, cur is the head.', line: 0, vars: { prev: 'null', cur: a[0] }, arrays: [arr('links', links(), {}, ptr(prev, cur))] });
    const flipped: Record<number, Mark> = {};
    while (cur >= 0 && cur < n) {
      const next = cur + 1 < n && nxt[cur] === cur + 1 ? cur + 1 : -1;
      steps.push({ note: `Save next = ${next >= 0 ? a[next] : 'null'} before changing cur.next.`, line: 2, vars: { prev: prev >= 0 ? a[prev] : 'null', cur: a[cur], next: next >= 0 ? a[next] : 'null' }, arrays: [arr('links', links(), flipped, ptr(prev, cur, next))] });
      nxt[cur] = prev;
      flipped[cur] = 'done';
      steps.push({ note: `Flip: ${a[cur]} now points to ${prev >= 0 ? a[prev] : 'null'}.`, line: 3, vars: { prev: prev >= 0 ? a[prev] : 'null', cur: a[cur] }, arrays: [arr('links', links(), flipped, ptr(prev, cur, next))] });
      prev = cur;
      cur = next;
    }
    steps.push({ note: `cur is null: the new head is ${a[prev]}.`, line: 5, vars: { head: a[prev] }, arrays: [arr('links', links(), flipped, { [prev]: 'head' })] });
    return { steps, result: `${[...a].reverse().join(' → ')}` };
  },
};

export const bfs: LabAlgorithm = {
  id: 'bfs',
  title: 'Breadth-first search',
  lesson: 'm4-trees-graphs-heaps',
  summary: 'A queue visits vertices in order of distance from the start.',
  inputs: [
    { key: 'edges', label: 'undirected edges', default: '0-1,0-2,1-3,2-3,3-4', type: 'text', hint: 'a-b pairs, vertices 0–7' },
    { key: 'start', label: 'start vertex', default: '0', type: 'number' },
  ],
  pseudocode: ['queue = [start]; dist[start] = 0', 'while queue not empty:', '    v = queue.poll()', '    for each neighbour w of v:', '        if w not seen: dist[w] = dist[v] + 1; queue.add(w)'],
  run({ edges, start }) {
    const pairs = edges.split(/[\s,]+/).filter(Boolean).map((e) => e.split('-').map(Number));
    if (!pairs.length || pairs.length > 16 || pairs.some((p) => p.length !== 2 || p.some((x) => !Number.isInteger(x) || x < 0 || x > 7))) return err('Use up to 16 edges like 0-1,1-2 with vertices 0–7.');
    const S = num(start);
    const V = Math.max(...pairs.flat(), S) + 1;
    if (!(S >= 0 && S < V)) return err('Start must be a vertex.');
    const adj: number[][] = Array.from({ length: V }, () => []);
    for (const [u, v] of pairs) {
      adj[u].push(v);
      adj[v].push(u);
    }
    adj.forEach((l) => l.sort((x, y) => x - y));
    const dist: (number | string)[] = Array(V).fill('·');
    const q: number[] = [S];
    dist[S] = 0;
    const order: number[] = [];
    const steps: TraceStep[] = [{ note: `Enqueue the start vertex ${S} with distance 0.`, line: 0, vars: { queue: `[${q.join(', ')}]` }, arrays: [arr('dist by vertex', [...dist], { [S]: 'cur' })] }];
    while (q.length) {
      const v = q.shift()!;
      order.push(v);
      const added: number[] = [];
      for (const w of adj[v]) {
        if (dist[w] === '·') {
          dist[w] = (dist[v] as number) + 1;
          q.push(w);
          added.push(w);
        }
      }
      steps.push({ note: `Poll ${v}. ${added.length ? `Newly discovered: ${added.join(', ')} at distance ${(dist[v] as number) + 1}.` : 'No new neighbours.'}`, line: 2, vars: { v, queue: `[${q.join(', ')}]`, visited: order.join(' ') }, arrays: [arr('dist by vertex', [...dist], { [v]: 'cur', ...Object.fromEntries(added.map((w) => [w, 'found'] as [number, Mark])) })] });
    }
    return { steps, result: `visit order: ${order.join(' ')}` };
  },
};

export const binarySearch: LabAlgorithm = {
  id: 'binary-search',
  title: 'Binary search',
  lesson: 'm4-searching',
  summary: 'Compare with the middle element and discard half of the range every step.',
  inputs: [
    { key: 'arr', label: 'sorted array', default: '2,5,8,12,16,23,38,56,72,91', type: 'text' },
    { key: 'target', label: 'target', default: '23', type: 'number' },
  ],
  pseudocode: ['lo = 0; hi = n - 1', 'while lo <= hi:', '    mid = lo + (hi - lo) / 2', '    if a[mid] == target: return mid', '    if a[mid] < target: lo = mid + 1', '    else: hi = mid - 1', 'return -1'],
  run({ arr: s, target }) {
    const a = ints(s, 16);
    const t = num(target);
    if (!a || !Number.isFinite(t)) return err('Enter up to 16 sorted integers and a target.');
    for (let i = 1; i < a.length; i++) if (a[i] < a[i - 1]) return err('The array must be sorted ascending.');
    let lo = 0, hi = a.length - 1;
    const steps: TraceStep[] = [];
    const view = (mid?: number): ReturnType<typeof arr> => {
      const marks: Record<number, Mark> = {};
      a.forEach((_, i) => {
        if (i < lo || i > hi) marks[i] = 'dim';
      });
      if (mid !== undefined) marks[mid] = 'cur';
      const ptr: Record<number, string> = { [lo]: 'lo', [hi]: lo === hi ? 'lo/hi' : 'hi' };
      if (mid !== undefined) ptr[mid] = ptr[mid] ? `${ptr[mid]}/mid` : 'mid';
      return arr('a', a, marks, ptr);
    };
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (a[mid] === t) {
        steps.push({ note: `mid = ${mid}, a[${mid}] = ${a[mid]} equals the target ${t}: found.`, line: 3, vars: { lo, hi, mid, 'a[mid]': a[mid] }, arrays: [{ ...view(mid), marks: { ...view(mid).marks, [mid]: 'found' } }] });
        return { steps, result: `found at index ${mid} after ${steps.length} probe(s)` };
      }
      const goRight = a[mid] < t;
      steps.push({ note: `mid = ${mid}, a[${mid}] = ${a[mid]} is ${goRight ? 'less' : 'greater'} than ${t}: discard the ${goRight ? 'left' : 'right'} half.`, line: goRight ? 4 : 5, vars: { lo, hi, mid, 'a[mid]': a[mid] }, arrays: [view(mid)] });
      if (goRight) lo = mid + 1;
      else hi = mid - 1;
    }
    steps.push({ note: 'lo > hi: the range is empty, the target is not in the array.', line: 6, vars: { lo, hi }, arrays: [view()] });
    return { steps, result: `not found after ${steps.length - 1} probe(s)` };
  },
};

export const insertionSort: LabAlgorithm = {
  id: 'insertion-sort',
  title: 'Insertion sort',
  lesson: 'm4-sorting-elementary',
  summary: 'Grow a sorted prefix: shift larger elements right and drop the key into the gap.',
  inputs: [{ key: 'arr', label: 'array', default: '5,2,4,6,1,3', type: 'text' }],
  pseudocode: ['for i = 1 .. n-1:', '    key = a[i]; j = i - 1', '    while j >= 0 and a[j] > key:', '        a[j+1] = a[j]; j--', '    a[j+1] = key'],
  run({ arr: s }) {
    const a = ints(s, 12);
    if (!a) return err('Enter up to 12 integers separated by commas.');
    const steps: TraceStep[] = [{ note: 'The first element is a sorted prefix of length 1.', line: 0, vars: { i: 0 }, arrays: [arr('a', [...a], { 0: 'done' })] }];
    let comps = 0, shifts = 0;
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0) {
        comps++;
        if (a[j] > key) {
          a[j + 1] = a[j];
          shifts++;
          j--;
        } else break;
      }
      a[j + 1] = key;
      const marks: Record<number, Mark> = {};
      for (let k = 0; k <= i; k++) marks[k] = 'done';
      marks[j + 1] = 'found';
      steps.push({ note: `Insert key ${key} at index ${j + 1}; the prefix a[0..${i}] is sorted.`, line: 4, vars: { i, key, 'comparisons so far': comps, 'shifts so far': shifts }, arrays: [arr('a', [...a], marks)] });
    }
    return { steps, result: `[${a.join(', ')}] — ${comps} comparisons, ${shifts} shifts` };
  },
};

export const bubbleSort: LabAlgorithm = {
  id: 'bubble-sort',
  title: 'Bubble sort (early exit)',
  lesson: 'm4-sorting-elementary',
  summary: 'Swap adjacent out-of-order pairs; each pass sinks the largest element to the end.',
  inputs: [{ key: 'arr', label: 'array', default: '5,1,4,2,8', type: 'text' }],
  pseudocode: ['for pass = 0 .. n-2:', '    swapped = false', '    for j = 0 .. n-2-pass:', '        if a[j] > a[j+1]: swap; swapped = true', '    if not swapped: break'],
  run({ arr: s }) {
    const a = ints(s, 10);
    if (!a) return err('Enter up to 10 integers separated by commas.');
    const n = a.length;
    const steps: TraceStep[] = [{ note: 'Unsorted array.', line: 0, vars: { pass: 0 }, arrays: [arr('a', [...a])] }];
    let swapsTotal = 0;
    for (let pass = 0; pass < n - 1; pass++) {
      let swapped = false;
      for (let j = 0; j < n - 1 - pass; j++) {
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swapped = true;
          swapsTotal++;
          steps.push({ note: `Pass ${pass + 1}: swap a[${j}] and a[${j + 1}].`, line: 3, vars: { pass: pass + 1, j, swaps: swapsTotal }, arrays: [arr('a', [...a], { [j]: 'swap', [j + 1]: 'swap' })] });
        }
      }
      const marks: Record<number, Mark> = {};
      for (let k = n - 1 - pass; k < n; k++) marks[k] = 'done';
      steps.push({ note: swapped ? `End of pass ${pass + 1}: the largest remaining element is in place.` : `Pass ${pass + 1} made no swaps: the array is sorted, stop early.`, line: 4, vars: { pass: pass + 1, swapped }, arrays: [arr('a', [...a], marks)] });
      if (!swapped) break;
    }
    return { steps, result: `[${a.join(', ')}] — ${swapsTotal} swaps` };
  },
};

export const mergeSort: LabAlgorithm = {
  id: 'merge-sort',
  title: 'Merge sort',
  lesson: 'm4-merge-sort',
  summary: 'Split in halves, sort each recursively, then merge the two sorted halves.',
  inputs: [{ key: 'arr', label: 'array', default: '38,27,43,3,9,82,10', type: 'text' }],
  pseudocode: ['mergeSort(lo, hi):', '    if hi - lo < 2: return', '    mid = (lo + hi) / 2', '    mergeSort(lo, mid); mergeSort(mid, hi)', '    merge a[lo..mid) and a[mid..hi)'],
  run({ arr: s }) {
    const a = ints(s, 12);
    if (!a) return err('Enter up to 12 integers separated by commas.');
    const steps: TraceStep[] = [{ note: 'Unsorted array.', line: 0, vars: { comparisons: 0 }, arrays: [arr('a', [...a])] }];
    let comps = 0;
    const rec = (lo: number, hi: number, depth: number) => {
      if (hi - lo < 2) return;
      const mid = (lo + hi) >>> 1;
      rec(lo, mid, depth + 1);
      rec(mid, hi, depth + 1);
      const left = a.slice(lo, mid), right = a.slice(mid, hi);
      let i = 0, j = 0, k = lo;
      while (i < left.length && j < right.length) {
        comps++;
        a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
      }
      while (i < left.length) a[k++] = left[i++];
      while (j < right.length) a[k++] = right[j++];
      const marks: Record<number, Mark> = {};
      for (let x = lo; x < hi; x++) marks[x] = 'found';
      steps.push({ note: `Merge [${left.join(', ')}] and [${right.join(', ')}] → [${a.slice(lo, hi).join(', ')}] (positions ${lo}–${hi - 1}).`, line: 4, vars: { lo, mid, hi, depth, comparisons: comps }, arrays: [arr('a', [...a], marks)] });
    };
    rec(0, a.length, 0);
    return { steps, result: `[${a.join(', ')}] — ${comps} comparisons` };
  },
};

export const fibMemo: LabAlgorithm = {
  id: 'fib-memo',
  title: 'Memoised Fibonacci',
  lesson: 'm4-iteration-vs-recursion',
  summary: 'Each fib(k) is computed once; later requests are cache hits.',
  inputs: [{ key: 'n', label: 'n (2–12)', default: '7', type: 'number' }],
  pseudocode: ['fib(n):', '    if n <= 1: return n', '    if memo has n: return memo[n]     // cache hit', '    memo[n] = fib(n-1) + fib(n-2)', '    return memo[n]'],
  run({ n }) {
    const N = num(n);
    if (!(N >= 2 && N <= 12)) return err('n must be 2–12.');
    const memo: (number | string)[] = Array(N + 1).fill('·');
    let calls = 0, hits = 0;
    const steps: TraceStep[] = [];
    const rec = (k: number): number => {
      calls++;
      if (k <= 1) {
        steps.push({ note: `fib(${k}) is a base case → ${k}.`, line: 1, vars: { call: calls, k, 'cache hits': hits }, arrays: [arr('memo[0..n]', [...memo], { [k]: 'cur' })] });
        return k;
      }
      if (memo[k] !== '·') {
        hits++;
        steps.push({ note: `fib(${k}) is already in the cache: reuse ${memo[k]} (no recursion).`, line: 2, vars: { call: calls, k, 'cache hits': hits }, arrays: [arr('memo[0..n]', [...memo], { [k]: 'found' })] });
        return memo[k] as number;
      }
      const v = rec(k - 1) + rec(k - 2);
      memo[k] = v;
      steps.push({ note: `fib(${k}) = fib(${k - 1}) + fib(${k - 2}) = ${v}; store it.`, line: 3, vars: { call: calls, k, 'cache hits': hits }, arrays: [arr('memo[0..n]', [...memo], { [k]: 'done' })] });
      return v;
    };
    const r = rec(N);
    return { steps, result: `fib(${N}) = ${r} using ${calls} calls (naive recursion needs far more)` };
  },
};

export const coinDp: LabAlgorithm = {
  id: 'coin-dp',
  title: 'Fewest coins (dynamic programming)',
  lesson: 'm4-paradigms',
  summary: 'best[x] = 1 + min(best[x − c]) over all coins c — shows where greedy fails.',
  inputs: [
    { key: 'coins', label: 'coins', default: '4,3,1', type: 'text' },
    { key: 'amount', label: 'amount (1–20)', default: '6', type: 'number' },
  ],
  pseudocode: ['best[0] = 0', 'for x = 1 .. amount:', '    best[x] = INF', '    for each coin c <= x:', '        best[x] = min(best[x], best[x-c] + 1)'],
  run({ coins, amount }) {
    const c = ints(coins, 5);
    const A = num(amount);
    if (!c || c.some((x) => x < 1) || !(A >= 1 && A <= 20)) return err('Enter up to 5 positive coins and an amount of 1–20.');
    const INF = 1e9;
    const best: number[] = [0];
    const steps: TraceStep[] = [{ note: 'best[0] = 0: no coins are needed for amount 0.', line: 0, vars: { x: 0 }, arrays: [arr('best[x]', ['0'], { 0: 'done' })] }];
    for (let x = 1; x <= A; x++) {
      let b = INF, used = 0;
      for (const coin of c) if (coin <= x && best[x - coin] + 1 < b) { b = best[x - coin] + 1; used = coin; }
      best[x] = b;
      const shown = best.map((v) => (v >= INF ? '∞' : v));
      steps.push({ note: b >= INF ? `Amount ${x} cannot be formed.` : `Amount ${x}: use coin ${used} on top of best[${x - used}] = ${best[x - used]} → ${b} coin(s).`, line: 4, vars: { x, 'best[x]': b >= INF ? '∞' : b }, arrays: [arr('best[x]', shown, { [x]: 'found' })] });
    }
    // greedy for comparison
    const sorted = [...c].sort((p, q) => q - p);
    let rem = A, greedy = 0;
    for (const coin of sorted) {
      greedy += Math.floor(rem / coin);
      rem %= coin;
    }
    return { steps, result: `${best[A] >= INF ? 'impossible' : best[A] + ' coin(s)'} (greedy would use ${rem === 0 ? greedy : 'no valid answer'})` };
  },
};

export const nestedCount: LabAlgorithm = {
  id: 'nested-count',
  title: 'Counting nested-loop iterations',
  lesson: 'm4-complexity-loops',
  summary: 'The inner statement runs once per shaded cell: a triangle, n(n+1)/2 cells, O(n²).',
  inputs: [
    { key: 'n', label: 'n (1–9)', default: '6', type: 'number' },
    { key: 'mode', label: 'inner bound: 1 = j ≤ i, 2 = j ≤ n, 3 = j doubles', default: '1', type: 'number' },
  ],
  pseudocode: ['count = 0', 'for i = 1 .. n:', '    for j = 1 .. i:      // mode 1 (triangle)', '        count++', 'print count'],
  run({ n, mode }) {
    const N = num(n), M = num(mode);
    if (!(N >= 1 && N <= 9) || ![1, 2, 3].includes(M)) return err('n must be 1–9 and mode 1, 2 or 3.');
    const cells = Array.from({ length: N }, () => Array(N).fill('·'));
    const marks: Record<string, Mark> = {};
    const steps: TraceStep[] = [];
    let count = 0;
    for (let i = 1; i <= N; i++) {
      const js: number[] = [];
      if (M === 1) for (let j = 1; j <= i; j++) js.push(j);
      else if (M === 2) for (let j = 1; j <= N; j++) js.push(j);
      else for (let j = 1; j <= N; j *= 2) js.push(j);
      for (const j of js) {
        count++;
        cells[i - 1][j - 1] = String(count);
        marks[`${i - 1},${j - 1}`] = 'done';
      }
      steps.push({ note: `Row i = ${i}: the inner loop ran ${js.length} time(s). Total so far: ${count}.`, line: 3, vars: { i, 'inner runs': js.length, count }, grid: { cells: cells.map((r) => [...r]), marks: { ...marks }, caption: 'rows = i, columns = j; numbers show the running count' } });
    }
    const label = M === 1 ? 'n(n+1)/2 → O(n²)' : M === 2 ? 'n² → O(n²)' : 'n·(⌊log₂ n⌋+1) → O(n log n)';
    return { steps, result: `count = ${count}  (${label})` };
  },
};
