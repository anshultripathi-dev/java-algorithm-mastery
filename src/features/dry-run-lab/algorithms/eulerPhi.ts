import type { LabAlgorithm, TraceStep } from '../types';

export const eulerPhi: LabAlgorithm = {
  id: 'euler-phi',
  title: "Euler's φ (totient)",
  lesson: 'a-euler-phi',
  summary: 'Strip each prime factor p of n and multiply the result by (1 − 1/p).',
  inputs: [{ key: 'n', label: 'n', default: '60', type: 'number' }],
  pseudocode: ['result = n;', 'for (p = 2; p * p <= n; p++) {', '    if (n % p == 0) {', '        while (n % p == 0) n /= p;', '        result -= result / p;', '    }', '}', 'if (n > 1) result -= result / n;', 'return result;'],
  run({ n }) {
    let m = Math.trunc(+n);
    if (!Number.isFinite(m) || m < 1 || m > 1e12) return { steps: [], result: '', error: 'Enter a whole number between 1 and 10^12.' };
    const orig = m;
    let result = m;
    const steps: TraceStep[] = [{ note: `result starts as n = ${m}.`, line: 0, vars: { p: '—', n: m, result } }];
    let p = 2;
    for (; p * p <= m && steps.length < 380; p++) {
      if (m % p === 0) {
        while (m % p === 0) m /= p;
        const before = result;
        result -= result / p;
        steps.push({ note: `${p} divides n: strip every ${p} (n becomes ${m}); result = ${before} − ${before}/${p} = ${result}.`, line: 4, vars: { p, n: m, result } });
      } else if (p <= 12 || p % 50 === 0) {
        steps.push({ note: `${p} does not divide ${m} — skip.`, line: 2, vars: { p, n: m, result } });
      }
    }
    steps.push({ note: `Loop ends: p·p = ${p * p} > n = ${m}.`, line: 1, vars: { p, n: m, result } });
    if (m > 1) {
      const before = result;
      result -= result / m;
      steps.push({ note: `Leftover prime ${m}: result = ${before} − ${before}/${m} = ${result}.`, line: 7, vars: { p, n: m, result } });
    }
    steps.push({ note: `φ(${orig}) = ${result}.`, line: 8, vars: { p, n: m, result } });
    return { steps, result: `φ(${orig}) = ${result}` };
  },
};
