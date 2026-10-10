import type { LabAlgorithm, TraceStep, Mark } from '../types';

export const sieve: LabAlgorithm = {
  id: 'sieve',
  title: 'Sieve of Eratosthenes',
  lesson: 'a-simple-sieve',
  summary: 'Each surviving number is prime; cross out its multiples starting at p·p.',
  inputs: [{ key: 'n', label: 'limit n (≤ 100)', default: '30', type: 'number' }],
  pseudocode: ['isPrime[2..n] = true', 'for (p = 2; p * p <= n; p++)', '    if (isPrime[p])', '        for (m = p * p; m <= n; m += p)', '            isPrime[m] = false', 'primes = all i with isPrime[i]'],
  run({ n }) {
    const N = Math.trunc(+n);
    if (!Number.isFinite(N) || N < 2 || N > 100) return { steps: [], result: '', error: 'Enter a whole number between 2 and 100 (so the table stays readable).' };
    const prime = Array(N + 1).fill(true);
    prime[0] = prime[1] = false;
    const nums = Array.from({ length: N - 1 }, (_, i) => i + 2);
    const arr = (marks: Record<number, Mark>) => [{ name: 'numbers (✗ = crossed out)', values: nums.map((v) => (prime[v] ? v : '✗')), marks, indexStart: 2 }];
    const steps: TraceStep[] = [{ note: 'Write down 2..n. Nothing is crossed out yet.', line: 0, vars: { p: '—' }, arrays: arr({}) }];
    for (let p = 2; p * p <= N; p++) {
      if (!prime[p]) {
        steps.push({ note: `${p} is already crossed out, so it is not prime — skip it.`, line: 2, vars: { p }, arrays: arr({ [p - 2]: 'dim' }) });
        continue;
      }
      const hit: Record<number, Mark> = { [p - 2]: 'found' };
      for (let m = p * p; m <= N; m += p) {
        prime[m] = false;
        hit[m - 2] = 'bad';
      }
      steps.push({ note: `${p} is prime. Cross out ${p}·${p} = ${p * p}, then every ${p}th number after it.`, line: 4, vars: { p, 'start p·p': p * p }, arrays: arr(hit) });
    }
    const primes = nums.filter((v) => prime[v]);
    const marks: Record<number, Mark> = {};
    primes.forEach((v) => (marks[v - 2] = 'found'));
    steps.push({ note: `p·p exceeds ${N}, so we stop. Survivors are the primes.`, line: 5, vars: { count: primes.length }, arrays: arr(marks) });
    return { steps, result: `${primes.length} primes: ${primes.join(' ')}` };
  },
};
