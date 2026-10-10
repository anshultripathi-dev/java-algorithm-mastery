import type { LabAlgorithm } from '../types';

export const euclidGcd: LabAlgorithm = {
  id: 'euclid-gcd',
  title: "Euclid's GCD",
  lesson: 'a-euclid-gcd',
  summary: 'Replace (a, b) by (b, a mod b) until b is 0.',
  inputs: [
    { key: 'a', label: 'a', default: '83', type: 'number' },
    { key: 'b', label: 'b', default: '19', type: 'number' },
  ],
  pseudocode: ['while (b != 0) {', '    r = a % b;', '    a = b;', '    b = r;', '}', 'return a;'],
  run({ a, b }) {
    let x = Math.abs(Math.trunc(+a));
    let y = Math.abs(Math.trunc(+b));
    if (!Number.isFinite(x) || !Number.isFinite(y) || x > 1e15 || y > 1e15) return { steps: [], result: '', error: 'Enter whole numbers up to 10^15.' };
    const steps = [{ note: `Start with a = ${x}, b = ${y}.`, line: 0, vars: { a: x, b: y, r: '—' } }] as ReturnType<LabAlgorithm['run']>['steps'];
    let guard = 0;
    while (y !== 0 && guard++ < 200) {
      const r = x % y;
      steps.push({ note: `${x} mod ${y} = ${r}  (quotient ${Math.floor(x / y)})`, line: 1, vars: { a: x, b: y, r } });
      steps.push({ note: `Slide: a becomes ${y}, b becomes ${r}.`, line: 3, vars: { a: y, b: r, r } });
      x = y;
      y = r;
    }
    steps.push({ note: `b is 0, so the answer is a = ${x}.`, line: 5, vars: { a: x, b: y, r: 0 } });
    return { steps, result: `gcd = ${x}` };
  },
};
