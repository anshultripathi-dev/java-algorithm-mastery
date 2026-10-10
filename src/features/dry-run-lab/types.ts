export type Mark = 'cur' | 'done' | 'found' | 'dim' | 'swap' | 'bad';

export interface TraceArray {
  name: string;
  values: (string | number)[];
  /** index → highlight kind */
  marks?: Record<number, Mark>;
  /** optional labels shown under the cells (e.g. "L", "R", "mid") */
  pointers?: Record<number, string>;
  /** offset added to the printed indices (default 0) */
  indexStart?: number;
}
export interface TraceGrid {
  cells: string[][];
  /** "r,c" → highlight kind */
  marks?: Record<string, Mark>;
  caption?: string;
}
export interface TraceStep {
  note: string;
  /** index into LabAlgorithm.pseudocode of the line being executed */
  line?: number;
  /** variable name → value (insertion order is the column order) */
  vars: Record<string, string | number | boolean>;
  arrays?: TraceArray[];
  grid?: TraceGrid;
}
export interface LabInput {
  key: string;
  label: string;
  default: string;
  hint?: string;
  type?: 'number' | 'text';
}
export interface TraceResult {
  steps: TraceStep[];
  result: string;
  error?: string;
}
export interface LabAlgorithm {
  id: string;
  title: string;
  /** lesson this algorithm belongs to */
  lesson: string;
  summary: string;
  inputs: LabInput[];
  /** short pseudocode / Java-like lines displayed beside the stepper */
  pseudocode: string[];
  run(input: Record<string, string>): TraceResult;
}

export const MAX_STEPS = 400;
