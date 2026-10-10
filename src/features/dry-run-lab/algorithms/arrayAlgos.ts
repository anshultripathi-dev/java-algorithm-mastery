import type { LabAlgorithm, TraceStep, Mark } from '../types';
import { arr, err, ints } from './helpers';

export const leaders: LabAlgorithm = {
  id: 'leaders',
  title: 'Leaders in an array',
  lesson: 'a-leaders',
  summary: 'Scan from the right keeping the running maximum.',
  inputs: [{ key: 'arr', label: 'array', default: '16,17,4,3,5,2', type: 'text' }],
  pseudocode: ['max = -infinity', 'for (i = n-1; i >= 0; i--)', '    if (a[i] > max) {', '        leader: a[i]', '        max = a[i]', '    }'],
  run({ arr: s }) {
    const a = ints(s, 20);
    if (!a) return err('Enter up to 20 integers separated by commas.');
    let max = -Infinity;
    const marks: Record<number, Mark> = {};
    const found: number[] = [];
    const steps: TraceStep[] = [{ note: 'Scan from the right. Nothing is to the right of the last element, so it is always a leader.', line: 0, vars: { max: '−∞', leaders: '' }, arrays: [arr('array', a)] }];
    for (let i = a.length - 1; i >= 0; i--) {
      const lead = a[i] > max;
      if (lead) {
        found.push(a[i]);
        marks[i] = 'found';
        max = a[i];
      } else marks[i] = 'dim';
      steps.push({ note: lead ? `${a[i]} > max: leader! max becomes ${a[i]}.` : `${a[i]} ≤ max (${max}): not a leader.`, line: lead ? 3 : 2, vars: { i, max, leaders: [...found].reverse().join(' ') }, arrays: [arr('array', a, { ...marks, [i]: lead ? 'found' : 'bad' }, { [i]: 'i' })] });
    }
    return { steps, result: `leaders (left→right): ${[...found].reverse().join(' ')}` };
  },
};

export const majority: LabAlgorithm = {
  id: 'majority',
  title: 'Boyer–Moore majority vote',
  lesson: 'a-majority-element',
  summary: 'Pair off different elements; the survivor is a candidate; then verify.',
  inputs: [{ key: 'arr', label: 'array', default: '4,7,4,4,7,4,4,9,4,3', type: 'text' }],
  pseudocode: ['candidate = none; count = 0', 'for x in a:', '    if count == 0: candidate = x; count = 1', '    else if x == candidate: count++', '    else count--', 'verify: occurrences(candidate) > n/2 ?'],
  run({ arr: s }) {
    const a = ints(s, 20);
    if (!a) return err('Enter up to 20 integers separated by commas.');
    let cand: number | null = null;
    let c = 0;
    const steps: TraceStep[] = [{ note: 'Start with no candidate.', line: 0, vars: { candidate: '—', count: 0 }, arrays: [arr('array', a)] }];
    a.forEach((x, i) => {
      let note;
      let line;
      if (c === 0) {
        cand = x;
        c = 1;
        note = `count was 0: ${x} becomes the candidate.`;
        line = 2;
      } else if (x === cand) {
        c++;
        note = `${x} equals the candidate: count++.`;
        line = 3;
      } else {
        c--;
        note = `${x} differs from ${cand}: they cancel, count--.`;
        line = 4;
      }
      steps.push({ note, line, vars: { candidate: cand ?? '—', count: c }, arrays: [arr('array', a, { [i]: 'cur' })] });
    });
    const occ = a.filter((x) => x === cand).length;
    const ok = occ > a.length / 2;
    steps.push({ note: `Verify: ${cand} occurs ${occ} times; n/2 = ${a.length / 2}. ${ok ? 'Majority confirmed.' : 'Not a majority!'}`, line: 5, vars: { candidate: cand ?? '—', occurrences: occ, majority: ok }, arrays: [arr('array', a, Object.fromEntries(a.map((x, i) => [i, x === cand ? 'found' : 'dim'] as const)))] });
    return { steps, result: ok ? `majority element = ${cand}` : 'no majority element' };
  },
};

export const maxProduct: LabAlgorithm = {
  id: 'max-product',
  title: 'Maximum product subarray',
  lesson: 'a-max-product-subarray',
  summary: 'Keep the maximum and minimum product of a subarray ending at i.',
  inputs: [{ key: 'arr', label: 'array', default: '-5,-4,-1,-2', type: 'text' }],
  pseudocode: ['mx = mn = best = a[0]', 'for i = 1..n-1:', '    if a[i] < 0: swap(mx, mn)', '    mx = max(a[i], mx * a[i])', '    mn = min(a[i], mn * a[i])', '    best = max(best, mx)'],
  run({ arr: s }) {
    const a = ints(s, 15);
    if (!a) return err('Enter up to 15 integers separated by commas.');
    let mx = a[0], mn = a[0], best = a[0];
    const steps: TraceStep[] = [{ note: `Start: max = min = best = a[0] = ${a[0]}.`, line: 0, vars: { max: mx, min: mn, best }, arrays: [arr('array', a, { 0: 'cur' })] }];
    for (let i = 1; i < a.length; i++) {
      const x = a[i];
      let note = `a[${i}] = ${x}. `;
      if (x < 0) {
        [mx, mn] = [mn, mx];
        note += 'Negative: swap max and min. ';
      }
      mx = Math.max(x, mx * x);
      mn = Math.min(x, mn * x);
      best = Math.max(best, mx);
      note += `max = ${mx}, min = ${mn}, best = ${best}.`;
      steps.push({ note, line: 3, vars: { max: mx, min: mn, best }, arrays: [arr('array', a, { [i]: 'cur' })] });
    }
    return { steps, result: `maximum product = ${best}` };
  },
};

export const equilibrium: LabAlgorithm = {
  id: 'equilibrium',
  title: 'Equilibrium index',
  lesson: 'a-equilibrium-sum',
  summary: 'right = total − left − a[i]; update left after the test.',
  inputs: [{ key: 'arr', label: 'array', default: '1,3,5,2,2', type: 'text' }],
  pseudocode: ['total = sum(a); left = 0', 'for i in 0..n-1:', '    right = total - left - a[i]', '    if left == right: equilibrium at i', '    left += a[i]'],
  run({ arr: s }) {
    const a = ints(s, 20);
    if (!a) return err('Enter up to 20 integers separated by commas.');
    const total = a.reduce((x, y) => x + y, 0);
    let left = 0;
    let best: number | null = null;
    const steps: TraceStep[] = [{ note: `total = ${total}.`, line: 0, vars: { total, left: 0 }, arrays: [arr('array', a)] }];
    for (let i = 0; i < a.length; i++) {
      const right = total - left - a[i];
      const eq = left === right;
      if (eq) best = best === null ? left : Math.max(best, left);
      steps.push({ note: eq ? `left (${left}) == right (${right}): equilibrium index ${i}, side sum ${left}.` : `left = ${left}, right = ${right}: not equal.`, line: eq ? 3 : 2, vars: { i, left, right, 'a[i]': a[i] }, arrays: [arr('array', a, { [i]: eq ? 'found' : 'cur' })] });
      left += a[i];
    }
    return { steps, result: best === null ? 'no equilibrium index' : `maximum equilibrium sum = ${best}` };
  },
};

export const hourglass: LabAlgorithm = {
  id: 'hourglass',
  title: 'Hourglass sums',
  lesson: 'a-hourglass',
  summary: 'Evaluate every (R−2)(C−2) hourglass and keep the best.',
  inputs: [
    { key: 'rows', label: 'rows', default: '4', type: 'number' },
    { key: 'cols', label: 'cols', default: '4', type: 'number' },
    { key: 'data', label: 'values (row by row)', default: '1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7', type: 'text' },
  ],
  pseudocode: ['best = -infinity', 'for i in 0..R-3:', '  for j in 0..C-3:', '    s = a[i][j..j+2] + a[i+1][j+1] + a[i+2][j..j+2]', '    best = max(best, s)'],
  run({ rows, cols, data }) {
    const R = Math.trunc(+rows), C = Math.trunc(+cols);
    const v = ints(data, 64);
    if (!v || !Number.isFinite(R) || !Number.isFinite(C) || R < 3 || C < 3 || R > 8 || C > 8 || v.length !== R * C) return err(`Need 3 ≤ rows, cols ≤ 8 and exactly rows × cols = ${R * C} values.`);
    const m = Array.from({ length: R }, (_, r) => v.slice(r * C, r * C + C));
    let best = -Infinity;
    const steps: TraceStep[] = [];
    for (let i = 0; i + 2 < R; i++)
      for (let j = 0; j + 2 < C; j++) {
        const cells: [number, number][] = [[i, j], [i, j + 1], [i, j + 2], [i + 1, j + 1], [i + 2, j], [i + 2, j + 1], [i + 2, j + 2]];
        const s = cells.reduce((t, [r, c]) => t + m[r][c], 0);
        best = Math.max(best, s);
        const marks: Record<string, Mark> = {};
        cells.forEach(([r, c]) => (marks[`${r},${c}`] = 'cur'));
        steps.push({ note: `Hourglass with top-left corner (${i}, ${j}): ${cells.map(([r, c]) => m[r][c]).join(' + ')} = ${s}. Best so far ${best}.`, line: 3, vars: { i, j, sum: s, best }, grid: { cells: m.map((r) => r.map(String)), marks } });
      }
    return { steps, result: `maximum hourglass sum = ${best}` };
  },
};

export const doors: LabAlgorithm = {
  id: 'doors',
  title: 'Toggle the doors',
  lesson: 'a-toggle-doors',
  summary: 'Monkey k toggles every k-th door; perfect squares stay open.',
  inputs: [{ key: 'n', label: 'doors n (≤ 40)', default: '20', type: 'number' }],
  pseudocode: ['for monkey = 1..n:', '    for door = monkey; door <= n; door += monkey:', '        open[door] = !open[door]'],
  run({ n }) {
    const N = Math.trunc(+n);
    if (!Number.isFinite(N) || N < 1 || N > 40) return err('Enter n between 1 and 40.');
    const open = Array(N + 1).fill(false);
    const view = (marks: Record<number, Mark>) => [arr('doors (O = open, c = closed)', open.slice(1).map((o) => (o ? 'O' : 'c')), marks, {})];
    const steps: TraceStep[] = [{ note: 'All doors start closed.', line: 0, vars: { monkey: 0, open: 0 }, arrays: [{ ...view({})[0], indexStart: 1 }] }];
    for (let m = 1; m <= N; m++) {
      const marks: Record<number, Mark> = {};
      for (let d = m; d <= N; d += m) {
        open[d] = !open[d];
        marks[d - 1] = 'swap';
      }
      steps.push({ note: `Monkey ${m} toggles doors ${m}, ${2 * m}, ${3 * m}, … ≤ ${N}.`, line: 2, vars: { monkey: m, open: open.filter(Boolean).length }, arrays: [{ ...view(marks)[0], indexStart: 1 }] });
    }
    const list = open.map((o, i) => (o ? i : 0)).filter(Boolean);
    return { steps, result: `${list.length} open doors: ${list.join(' ')}` };
  },
};

export const alice: LabAlgorithm = {
  id: 'alice',
  title: "Alice's apple tree",
  lesson: 'a-alice-apple-tree',
  summary: 'Add rings of 12r² apples until the target is reached.',
  inputs: [{ key: 'needed', label: 'neededApples', default: '13', type: 'number' }],
  pseudocode: ['r = 0; apples = 0', 'while (apples < needed) {', '    r++', '    apples += 12 * r * r', '}', 'return 8 * r'],
  run({ needed }) {
    const N = Math.trunc(+needed);
    if (!Number.isFinite(N) || N < 1 || N > 1e9) return err('Enter a value between 1 and 10^9 for this animation.');
    let r = 0, apples = 0;
    const steps: TraceStep[] = [{ note: `Need at least ${N} apples.`, line: 0, vars: { r: 0, apples: 0, perimeter: 0 } }];
    while (apples < N && steps.length < 300) {
      r++;
      apples += 12 * r * r;
      steps.push({ note: `Ring ${r} adds 12·${r}² = ${12 * r * r} apples. Total ${apples}.`, line: 3, vars: { r, apples, perimeter: 8 * r } });
    }
    return { steps, result: `r = ${r}, perimeter = ${8 * r}` };
  },
};
