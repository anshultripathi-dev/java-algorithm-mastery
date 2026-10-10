import type { LabAlgorithm, TraceStep, Mark } from '../types';
import { arr, err, ints } from './helpers';

export const selectionSort: LabAlgorithm = {
  id: 'selection-sort',
  title: 'Selection sort',
  lesson: 'a-selection-sort',
  summary: 'Select the minimum of the unsorted part and swap it into place.',
  inputs: [{ key: 'arr', label: 'array', default: '64,25,12,22,11', type: 'text' }],
  pseudocode: ['for i in 0..n-2:', '    minIndex = i', '    for j in i+1..n-1:', '        if a[j] < a[minIndex]: minIndex = j', '    swap(a[i], a[minIndex])'],
  run({ arr: s }) {
    const a = ints(s, 12);
    if (!a) return err('Enter up to 12 integers separated by commas.');
    const n = a.length;
    const steps: TraceStep[] = [{ note: 'Unsorted array.', line: 0, vars: { i: '—' }, arrays: [arr('array', [...a])] }];
    let swaps = 0, comparisons = 0;
    for (let i = 0; i < n - 1; i++) {
      let m = i;
      for (let j = i + 1; j < n; j++) {
        comparisons++;
        if (a[j] < a[m]) m = j;
      }
      const marks: Record<number, Mark> = {};
      for (let k = 0; k < i; k++) marks[k] = 'done';
      marks[i] = 'cur';
      marks[m] = 'found';
      steps.push({ note: `Pass ${i + 1}: the minimum of a[${i}..${n - 1}] is ${a[m]} at index ${m}.`, line: 3, vars: { i, minIndex: m, comparisons }, arrays: [arr('array', [...a], marks)] });
      if (m !== i) {
        [a[i], a[m]] = [a[m], a[i]];
        swaps++;
      }
      const after: Record<number, Mark> = {};
      for (let k = 0; k <= i; k++) after[k] = 'done';
      steps.push({ note: m !== i ? `Swap a[${i}] and a[${m}]. The first ${i + 1} elements are final.` : `Already in place. The first ${i + 1} elements are final.`, line: 4, vars: { i, swaps }, arrays: [arr('array', [...a], after)] });
    }
    return { steps, result: `[${a.join(', ')}] — ${comparisons} comparisons, ${swaps} swaps` };
  },
};

export const quickSort: LabAlgorithm = {
  id: 'quick-sort',
  title: 'Quick sort (Lomuto)',
  lesson: 'a-quick-sort',
  summary: 'Partition around the last element, then sort both sides.',
  inputs: [{ key: 'arr', label: 'array', default: '8,3,1,7,0,10,2', type: 'text' }],
  pseudocode: ['quickSort(low, high):', '  if low < high:', '    pivot = a[high]; i = low - 1', '    for j in low..high-1:', '      if a[j] <= pivot: i++; swap(a[i], a[j])', '    swap(a[i+1], a[high])  → p = i+1', '    quickSort(low, p-1); quickSort(p+1, high)'],
  run({ arr: s }) {
    const a = ints(s, 12);
    if (!a) return err('Enter up to 12 integers separated by commas.');
    const steps: TraceStep[] = [{ note: 'Unsorted array.', line: 0, vars: { low: 0, high: a.length - 1 }, arrays: [arr('array', [...a])] }];
    const fixed = new Set<number>();
    const view = (extra: Record<number, Mark> = {}) => {
      const marks: Record<number, Mark> = {};
      fixed.forEach((k) => (marks[k] = 'done'));
      return [arr('array', [...a], { ...marks, ...extra })];
    };
    const qs = (lo: number, hi: number) => {
      if (lo > hi) return;
      if (lo === hi) {
        fixed.add(lo);
        return;
      }
      const pivot = a[hi];
      let i = lo - 1;
      for (let j = lo; j < hi; j++) {
        if (a[j] <= pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
        }
      }
      [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
      const p = i + 1;
      fixed.add(p);
      steps.push({ note: `Pivot ${pivot} (last of a[${lo}..${hi}]): ${p - lo} element(s) ≤ pivot go left. The pivot lands at index ${p} — its final position.`, line: 5, vars: { low: lo, high: hi, pivot, p }, arrays: view({ [p]: 'found' }) });
      qs(lo, p - 1);
      qs(p + 1, hi);
    };
    qs(0, a.length - 1);
    return { steps, result: `[${a.join(', ')}]` };
  },
};
