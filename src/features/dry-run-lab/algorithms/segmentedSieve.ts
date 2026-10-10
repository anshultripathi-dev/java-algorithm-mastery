import type { LabAlgorithm, TraceStep, Mark } from '../types';

export const segmentedSieve: LabAlgorithm = {
  id: 'segmented-sieve',
  title: 'Segmented sieve [L, R]',
  lesson: 'a-segmented-sieve',
  summary: 'Use primes ≤ √R to cross out multiples inside the window only.',
  inputs: [
    { key: 'low', label: 'L', default: '10', type: 'number' },
    { key: 'high', label: 'R (window ≤ 80 wide)', default: '30', type: 'number' },
  ],
  pseudocode: ['base = primes up to sqrt(R)', 'window[i] stands for L + i', 'for each base prime p:', '    start = max(p*p, ceil(L/p)*p)', '    cross out start, start+p, ... <= R', 'survivors (>= 2) are prime'],
  run({ low, high }) {
    const L = Math.trunc(+low);
    const R = Math.trunc(+high);
    if (!Number.isFinite(L) || !Number.isFinite(R) || L < 0 || R < L || R - L > 79 || R > 1e9) return { steps: [], result: '', error: 'Need 0 ≤ L ≤ R, R − L ≤ 79 and R ≤ 10^9.' };
    const root = Math.floor(Math.sqrt(R));
    const base: number[] = [];
    for (let i = 2; i <= root; i++) if (base.every((p) => i % p !== 0)) base.push(i);
    const size = R - L + 1;
    const comp = Array(size).fill(false);
    const nums = Array.from({ length: size }, (_, i) => L + i);
    const arr = (marks: Record<number, Mark>) => [{ name: `window [${L}, ${R}]`, values: nums.map((v, i) => (comp[i] ? '✗' : v)), marks, indexStart: 0 }];
    const steps: TraceStep[] = [{ note: `√${R} ≈ ${root}, so the base primes are ${base.join(', ') || '(none)'}.`, line: 0, vars: { 'base primes': base.join(' ') || '—' }, arrays: arr({}) }];
    for (const p of base) {
      const start = Math.max(p * p, Math.ceil(L / p) * p);
      const marks: Record<number, Mark> = {};
      for (let m = start; m <= R; m += p) {
        comp[m - L] = true;
        marks[m - L] = 'bad';
      }
      steps.push({ note: `p = ${p}: first multiple ≥ ${L} is ${Math.ceil(L / p) * p}; starting at max(${p * p}, that) = ${start}.`, line: 4, vars: { p, start }, arrays: arr(marks) });
    }
    const primes = nums.filter((v, i) => !comp[i] && v >= 2);
    const marks: Record<number, Mark> = {};
    nums.forEach((v, i) => {
      if (!comp[i] && v >= 2) marks[i] = 'found';
    });
    steps.push({ note: 'Cells never crossed out (and ≥ 2) are prime.', line: 5, vars: { count: primes.length }, arrays: arr(marks) });
    return { steps, result: `${primes.length} primes: ${primes.join(' ')}` };
  },
};
