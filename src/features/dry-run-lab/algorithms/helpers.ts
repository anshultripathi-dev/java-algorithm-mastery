import type { Mark, TraceArray, TraceResult } from '../types';

export function ints(s: string | undefined, max = 40): number[] | null {
  if (s === undefined) return null;
  const parts = s.split(/[\s,]+/).filter(Boolean);
  if (!parts.length || parts.length > max) return null;
  const out = parts.map(Number);
  return out.every((n) => Number.isFinite(n) && Number.isInteger(n)) ? out : null;
}
export const err = (message: string): TraceResult => ({ steps: [], result: '', error: message });
export const arr = (name: string, values: (string | number)[], marks: Record<number, Mark> = {}, pointers: Record<number, string> = {}): TraceArray => ({ name, values, marks, pointers });
export const bin = (n: number, w = 0) => {
  const s = (n >>> 0).toString(2);
  return s.length >= w ? s : '0'.repeat(w - s.length) + s;
};
