import type { LabAlgorithm, TraceStep } from '../types';

const bits = (v: number, w: number) => {
  const s = (v & ((1 << w) - 1)).toString(2);
  return '0'.repeat(w - s.length) + s;
};

export const booth: LabAlgorithm = {
  id: 'booth',
  title: "Booth's multiplication",
  lesson: 'a-booth',
  summary: 'Signed multiplication with registers AC, Q and Q₋₁.',
  inputs: [
    { key: 'm', label: 'multiplicand M', default: '7', type: 'number' },
    { key: 'q', label: 'multiplier Q', default: '3', type: 'number' },
    { key: 'bits', label: 'register width (2–8)', default: '4', type: 'number' },
  ],
  pseudocode: ['AC = 0; Q-1 = 0', 'repeat n times:', '  if (Q0,Q-1) == 10: AC = AC - M', '  if (Q0,Q-1) == 01: AC = AC + M', '  arithmetic shift right (AC, Q, Q-1)', 'product = AC:Q'],
  run({ m, q, bits: w }) {
    let width = Math.trunc(+w);
    const M0 = Math.trunc(+m);
    const Q0 = Math.trunc(+q);
    if (![width, M0, Q0].every(Number.isFinite) || width < 2 || width > 8) return { steps: [], result: '', error: 'Width must be 2–8 and M, Q whole numbers.' };
    const lo = -(1 << (width - 1));
    const hi = (1 << (width - 1)) - 1;
    if (M0 < lo || M0 > hi || Q0 < lo || Q0 > hi) return { steps: [], result: '', error: `With ${width} bits both numbers must be in [${lo}, ${hi}].` };
    if (M0 === lo) width++; // most negative number cannot be negated in n bits
    const mask = (1 << width) - 1;
    const M = M0 & mask;
    const negM = -M0 & mask;
    let AC = 0;
    let Q = Q0 & mask;
    let qm1 = 0;
    const steps: TraceStep[] = [{ note: `M = ${bits(M, width)} (${M0}), −M = ${bits(negM, width)}, Q = ${bits(Q, width)} (${Q0}). AC = 0, Q₋₁ = 0.`, line: 0, vars: { cycle: 0, 'Q0 Q-1': '— —', AC: bits(AC, width), Q: bits(Q, width), 'Q-1': qm1 } }];
    for (let c = 1; c <= width; c++) {
      const q0 = Q & 1;
      const pair = `${q0}${qm1}`;
      let op = 'only shift';
      if (q0 === 1 && qm1 === 0) {
        AC = (AC + negM) & mask;
        op = 'AC = AC − M';
      } else if (q0 === 0 && qm1 === 1) {
        AC = (AC + M) & mask;
        op = 'AC = AC + M';
      }
      const afterOp = AC;
      qm1 = Q & 1;
      Q = ((Q >> 1) | ((AC & 1) << (width - 1))) & mask;
      AC = (AC >> 1) | (AC & (1 << (width - 1)));
      steps.push({
        note: `Cycle ${c}: Q₀Q₋₁ = ${pair} → ${op}${op === 'only shift' ? '' : ` (AC becomes ${bits(afterOp, width)})`}, then arithmetic shift right.`,
        line: op === 'AC = AC − M' ? 2 : op === 'AC = AC + M' ? 3 : 4,
        vars: { cycle: c, 'Q0 Q-1': pair, AC: bits(AC, width), Q: bits(Q, width), 'Q-1': qm1 },
      });
    }
    let raw = AC * (1 << width) + Q;
    if (raw >= 1 << (2 * width - 1)) raw -= 1 << (2 * width);
    steps.push({ note: `Product = AC:Q = ${bits(AC, width)} ${bits(Q, width)} = ${raw}.`, line: 5, vars: { cycle: width, 'Q0 Q-1': '', AC: bits(AC, width), Q: bits(Q, width), 'Q-1': qm1 } });
    return { steps, result: `${M0} × ${Q0} = ${raw}` };
  },
};
