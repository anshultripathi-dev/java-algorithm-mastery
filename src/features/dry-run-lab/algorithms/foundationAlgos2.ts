import type { LabAlgorithm, TraceStep, Mark, TraceGrid } from '../types';
import { arr, err, ints, bin } from './helpers';

const num = (s: string | undefined) => (s === undefined || s.trim() === '' ? NaN : Math.trunc(+s));
const IDENT = /^[A-Za-z_][A-Za-z0-9_]{0,15}$/;
const toI32 = (n: number) => n | 0;

// ───────────────────────── Module 0 ─────────────────────────

export const jvmPipeline: LabAlgorithm = {
  id: 'jvm-pipeline',
  title: 'From source file to output',
  lesson: 'm0-how-java-works',
  summary: 'Follow a Java program through the compiler, the class loader and the JVM.',
  inputs: [
    { key: 'cls', label: 'class name', default: 'Hello', type: 'text' },
    { key: 'msg', label: 'message to print', default: 'Hi', type: 'text' },
  ],
  pseudocode: ['write Name.java', 'javac Name.java        → Name.class (bytecode)', 'java Name              → start a JVM', 'class loader + bytecode verifier', 'find public static void main(String[] args)', 'execute: interpret hot code → JIT-compile it', 'JVM exits with status 0'],
  run({ cls, msg }) {
    if (!IDENT.test(cls ?? '')) return err('Class name must be a Java identifier (letters, digits, _), up to 16 characters.');
    if (msg === undefined || msg.length > 24 || /["\\]/.test(msg)) return err('Message: up to 24 characters, without quotes or backslashes.');
    const files = [`${cls}.java`];
    const steps: TraceStep[] = [
      { note: `You write the source file ${cls}.java: plain text a human can read.`, line: 0, vars: { file: `${cls}.java`, kind: 'source code' }, arrays: [arr('files in the folder', [...files])] },
    ];
    files.push(`${cls}.class`);
    steps.push({ note: `javac ${cls}.java: the COMPILER checks syntax and types and translates the file into bytecode. If it finds an error it stops here and no .class file is created.`, line: 1, vars: { command: `javac ${cls}.java`, created: `${cls}.class` }, arrays: [arr('files in the folder', [...files], { 1: 'found' })] });
    steps.push({ note: `java ${cls}: the operating system starts a Java Virtual Machine (JVM). Note: you give the class name, not the file name.`, line: 2, vars: { command: `java ${cls}`, 'process started': 'JVM' } });
    steps.push({ note: `The class loader reads ${cls}.class; the bytecode verifier checks it cannot corrupt memory or break the type rules.`, line: 3, vars: { loaded: cls, verified: true } });
    steps.push({ note: `The JVM looks for the entry point public static void main(String[] args) in ${cls} and calls it.`, line: 4, vars: { entry: `${cls}.main(String[])` } });
    steps.push({ note: `The bytecode runs (interpreted first; hot loops are compiled to machine code by the JIT). System.out.println prints "${msg}".`, line: 5, vars: { output: msg } });
    steps.push({ note: 'main returns, the JVM exits and the operating system receives status 0 (success).', line: 6, vars: { 'exit status': 0 } });
    return { steps, result: `console shows: ${msg}` };
  },
};

export const stackHeap: LabAlgorithm = {
  id: 'stack-heap',
  title: 'Stack and heap memory',
  lesson: 'm0-java-landscape',
  summary: 'Local variables live on the stack; arrays and objects live on the heap and are reached through references.',
  inputs: [
    { key: 'x', label: 'first element', default: '7', type: 'number' },
    { key: 'y', label: 'second element', default: '8', type: 'number' },
  ],
  pseudocode: ['int n = 5;', 'int[] a = {x, y};', 'int[] b = a;          // copies the reference', 'b[0] = 99;', 'a = new int[]{1};', 'b = null;'],
  run({ x, y }) {
    const X = num(x), Y = num(y);
    if (!Number.isFinite(X) || !Number.isFinite(Y) || Math.abs(X) > 999 || Math.abs(Y) > 999) return err('Enter two integers between −999 and 999.');
    const stack: [string, string][] = [];
    const heap: [string, number[]][] = [];
    const steps: TraceStep[] = [];
    const set = (k: string, v: string) => {
      const e = stack.find((s) => s[0] === k);
      if (e) e[1] = v;
      else stack.push([k, v]);
    };
    const snap = (note: string, line: number, hl: { s?: number[]; h?: number[] } = {}) => {
      const sm: Record<number, Mark> = {};
      hl.s?.forEach((i) => (sm[i] = 'cur'));
      const hm: Record<number, Mark> = {};
      hl.h?.forEach((i) => (hm[i] = 'found'));
      steps.push({
        note,
        line,
        vars: { 'stack slots': stack.length, 'heap objects': heap.filter((h) => h[1].length).length },
        arrays: [arr('STACK (main)', stack.map(([k, v]) => `${k} = ${v}`), sm), arr('HEAP', heap.map(([id, v]) => `${id} int[] {${v.join(', ')}}`), hm)],
      });
    };
    set('n', '5');
    snap('A primitive: the value 5 sits directly in the stack slot n.', 0, { s: [0] });
    heap.push(['#1', [X, Y]]);
    set('a', '→ #1');
    snap(`new int[]{${X}, ${Y}} is built on the HEAP as object #1; the stack variable a only holds a reference to it.`, 1, { s: [1], h: [0] });
    set('b', '→ #1');
    snap('b = a copies the REFERENCE, not the array: a and b now point to the same object #1.', 2, { s: [2], h: [0] });
    heap[0][1][0] = 99;
    snap(`b[0] = 99 changes the shared object, so a[0] is also 99 (a[0] = ${heap[0][1][0]}).`, 3, { h: [0] });
    heap.push(['#2', [1]]);
    set('a', '→ #2');
    snap('a = new int[]{1} creates a second object and re-points a. b still points to #1.', 4, { s: [1], h: [1] });
    set('b', 'null');
    heap[0] = ['#1', []];
    snap('b = null: nothing refers to #1 any more, so the garbage collector may reclaim it (shown empty).', 5, { s: [2], h: [0] });
    return { steps, result: 'a and b shared one array until a was re-pointed; objects without references are garbage-collected' };
  },
};

export const setupCheck: LabAlgorithm = {
  id: 'setup-check',
  title: 'Checking your Java installation',
  lesson: 'm0-install-mac',
  summary: 'The five terminal commands that prove the JDK is installed and working, with what each output means.',
  inputs: [{ key: 'jdk', label: 'JDK major version installed (8–30)', default: '21', type: 'number' }],
  pseudocode: ['java -version', 'javac -version', 'javac Hello.java', 'ls', 'java Hello'],
  run({ jdk }) {
    const v = num(jdk);
    if (!(v >= 8 && v <= 30)) return err('Enter a JDK major version between 8 and 30.');
    const ok = v >= 17;
    const steps: TraceStep[] = [
      { note: `java -version prints the runtime version: ${v}. This proves a JRE/JDK is on the PATH.`, line: 0, vars: { command: 'java -version', 'prints': `openjdk version "${v}…"` } },
      { note: ok ? `javac -version prints javac ${v}…: the COMPILER exists, so this is a JDK and not just a JRE.` : `javac -version prints javac ${v}…, but this course targets Java 17+: install a newer JDK.`, line: 1, vars: { command: 'javac -version', prints: `javac ${v}…`, 'meets Java 17+': ok } },
      { note: 'javac Hello.java prints nothing when it succeeds (silence is good news).', line: 2, vars: { command: 'javac Hello.java', prints: '(nothing)' } },
      { note: 'ls now shows a new file Hello.class next to Hello.java: the bytecode.', line: 3, vars: { command: 'ls' }, arrays: [arr('folder', ['Hello.java', 'Hello.class'], { 1: 'found' })] },
      { note: 'java Hello (no .class!) runs the program: you see its output.', line: 4, vars: { command: 'java Hello', prints: 'Hi' } },
    ];
    return { steps, result: ok ? `Ready: JDK ${v} works for this course` : `JDK ${v} is older than 17: upgrade before continuing` };
  },
};

export const printBuffer: LabAlgorithm = {
  id: 'print-buffer',
  title: 'print vs println',
  lesson: 'm0-first-program',
  summary: 'print leaves the cursor on the same line; println ends the line.',
  inputs: [{ key: 'words', label: 'four words (comma separated)', default: 'A,B,C,D', type: 'text' }],
  pseudocode: ['System.out.print(w1);', 'System.out.print(w2);', 'System.out.println(w3);', 'System.out.println(w4);'],
  run({ words }) {
    const w = (words ?? '').split(',').map((s) => s.trim());
    if (w.length !== 4 || w.some((s) => !s || s.length > 10)) return err('Enter exactly four short words separated by commas.');
    const lines: string[] = [''];
    const steps: TraceStep[] = [];
    const show = (hl: number) => [arr('console (one cell per line)', lines.map((l) => (l === '' ? '␣' : l)), { [hl]: 'cur' })];
    const kinds = ['print', 'print', 'println', 'println'];
    for (let i = 0; i < 4; i++) {
      lines[lines.length - 1] += w[i];
      const ends = kinds[i] === 'println';
      if (ends) lines.push('');
      steps.push({ note: ends ? `println("${w[i]}") writes ${w[i]} and then moves the cursor to a NEW line.` : `print("${w[i]}") writes ${w[i]} and leaves the cursor right after it, on the same line.`, line: i, vars: { call: `${kinds[i]}("${w[i]}")`, 'cursor line': lines.length }, arrays: show(Math.min(lines.length - 1, lines.length - 1)) });
    }
    return { steps, result: lines.filter((l, i) => !(i === lines.length - 1 && l === '')).join(' ⏎ ') };
  },
};

export const errorKinds: LabAlgorithm = {
  id: 'error-kinds',
  title: 'Compile-time, runtime and logic errors',
  lesson: 'm0-errors',
  summary: 'The three kinds of error show up at different moments — or not at all.',
  inputs: [{ key: 'kind', label: 'scenario: 1 compile-time, 2 runtime, 3 logic', default: '1', type: 'number' }],
  pseudocode: ['COMPILE  javac checks syntax and types', 'RUN      the JVM executes the bytecode', 'RESULT   is the output what you wanted?'],
  run({ kind }) {
    const k = num(kind);
    if (![1, 2, 3].includes(k)) return err('Choose 1, 2 or 3.');
    if (k === 1) {
      return {
        steps: [
          { note: 'The program contains   int x = "five";   — a String where an int is required.', line: 0, vars: { stage: 'source', statement: 'int x = "five";' } },
          { note: 'javac reports: incompatible types: String cannot be converted to int. No .class file is produced.', line: 0, vars: { stage: 'COMPILE', outcome: 'error' } },
          { note: 'The program never runs: a compile-time error is found BEFORE execution, with a line number.', line: 1, vars: { stage: 'RUN', outcome: 'not reached' } },
        ],
        result: 'compile-time error (fix the code, then compile again)',
      };
    }
    if (k === 2) {
      return {
        steps: [
          { note: 'The program contains   int[] a = new int[3]; a[3] = 1;   — syntactically fine.', line: 0, vars: { stage: 'source' } },
          { note: 'javac accepts it: the compiler cannot know the index is out of range.', line: 0, vars: { stage: 'COMPILE', outcome: 'ok' } },
          { note: 'At run time the JVM checks the index: valid indices are 0, 1, 2, so a[3] throws ArrayIndexOutOfBoundsException and the program stops.', line: 1, vars: { stage: 'RUN', index: 3, 'array length': 3, outcome: 'exception' } },
        ],
        result: 'runtime error: ArrayIndexOutOfBoundsException (program crashes while running)',
      };
    }
    const a = 10, b = 20;
    return {
      steps: [
        { note: 'The program computes the average of a and b with   double avg = a + b / 2;', line: 0, vars: { a, b, stage: 'source' } },
        { note: 'It compiles and runs without any error message.', line: 1, vars: { stage: 'COMPILE+RUN', outcome: 'ok' } },
        { note: `Precedence: b / 2 happens first = ${b / 2}, then a + ${b / 2} = ${a + b / 2}. The correct average is ${(a + b) / 2}.`, line: 2, vars: { 'b / 2': b / 2, 'a + b / 2': a + b / 2, expected: (a + b) / 2 } },
      ],
      result: `logic error: prints ${a + b / 2} instead of ${(a + b) / 2} — only testing finds it (fix: (a + b) / 2.0)`,
    };
  },
};

// ───────────────────────── Module 1 ─────────────────────────

export const swapTemp: LabAlgorithm = {
  id: 'swap-temp',
  title: 'Swapping two variables',
  lesson: 'm1-variables-types',
  summary: 'Assignment overwrites: you need a temporary variable to swap safely.',
  inputs: [
    { key: 'a', label: 'a', default: '3', type: 'number' },
    { key: 'b', label: 'b', default: '8', type: 'number' },
  ],
  pseudocode: ['int temp = a;   // keep a safe', 'a = b;', 'b = temp;'],
  run({ a, b }) {
    let A = num(a), B = num(b);
    if (!Number.isFinite(A) || !Number.isFinite(B) || Math.abs(A) > 1e6 || Math.abs(B) > 1e6) return err('Enter two integers.');
    const steps: TraceStep[] = [{ note: `Start: a = ${A}, b = ${B}.`, line: 0, vars: { a: A, b: B, temp: '—' } }];
    const temp = A;
    steps.push({ note: `temp = a stores ${temp} so it is not lost.`, line: 0, vars: { a: A, b: B, temp } });
    A = B;
    steps.push({ note: `a = b overwrites a with ${B}. Without temp the old a would be gone.`, line: 1, vars: { a: A, b: B, temp } });
    B = temp;
    steps.push({ note: `b = temp gives b the saved ${temp}. Done.`, line: 2, vars: { a: A, b: B, temp } });
    steps.push({ note: `Mistake to avoid:   a = b; b = a;   would leave BOTH variables equal to ${A} because the first line destroyed the original a.`, line: 1, vars: { a: A, b: B } });
    return { steps, result: `a = ${A}, b = ${B}` };
  },
};

// ---- integer expression evaluator (Java int semantics) ----
type Tok = { t: 'n'; v: number } | { t: 'op'; v: string } | { t: '(' } | { t: ')' };
function tokenize(s: string): Tok[] | string {
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') {
      i++;
    } else if (/[0-9]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9]/.test(s[j])) j++;
      if (j - i > 9) return 'Numbers may have at most 9 digits.';
      out.push({ t: 'n', v: +s.slice(i, j) });
      i = j;
    } else if ('+-*/%'.includes(c)) {
      const prev = out[out.length - 1];
      const unary = c === '-' && (!prev || prev.t === 'op' || prev.t === '(');
      if (unary) {
        let j = i + 1;
        while (j < s.length && s[j] === ' ') j++;
        let k = j;
        while (k < s.length && /[0-9]/.test(s[k])) k++;
        if (k === j) return 'A unary minus must be followed by a number.';
        out.push({ t: 'n', v: -+s.slice(j, k) });
        i = k;
      } else {
        out.push({ t: 'op', v: c });
        i++;
      }
    } else if (c === '(') {
      out.push({ t: '(' });
      i++;
    } else if (c === ')') {
      out.push({ t: ')' });
      i++;
    } else return `Unexpected character "${c}". Use integers, + - * / % and parentheses.`;
  }
  return out;
}
const render = (t: Tok[]) => t.map((x) => (x.t === 'n' ? String(x.v) : x.t === 'op' ? x.v : x.t)).join(' ');

export const exprEval: LabAlgorithm = {
  id: 'expr-eval',
  title: 'Evaluating an int expression',
  lesson: 'm1-operators-arithmetic',
  summary: 'Parentheses first, then * / % left to right, then + − left to right — with integer division.',
  inputs: [{ key: 'expr', label: 'expression', default: '7 + 3 * 2 - 8 / 3 % 2', type: 'text', hint: 'integers, + - * / % ( )' }],
  pseudocode: ['1. innermost ( ) first', '2. * / %  left to right', '3. + -    left to right', 'int division truncates; % keeps the dividend\'s sign'],
  run({ expr }) {
    if (!expr || expr.length > 60) return err('Enter an expression of up to 60 characters.');
    const toks = tokenize(expr);
    if (typeof toks === 'string') return err(toks);
    if (toks.filter((t) => t.t === 'op').length > 12) return err('At most 12 operators.');
    let cur = toks.slice();
    const steps: TraceStep[] = [{ note: 'Start with the expression as written.', line: 0, vars: { expression: render(cur) } }];
    let guard = 0;
    while (cur.length > 1 && guard++ < 40) {
      // innermost parentheses
      let lo = -1, hi = -1;
      for (let i = 0; i < cur.length; i++) {
        if (cur[i].t === '(') lo = i;
        if (cur[i].t === ')') {
          hi = i;
          break;
        }
      }
      if (hi >= 0 && lo < 0) return err('Unbalanced parentheses.');
      if (lo >= 0 && hi < 0) return err('Unbalanced parentheses.');
      const from = lo >= 0 ? lo + 1 : 0;
      const to = lo >= 0 ? hi : cur.length;
      // inside [from, to): pick first * / % else first + -
      let idx = -1;
      for (let i = from + 1; i < to; i += 1) if (cur[i].t === 'op' && '*/%'.includes((cur[i] as any).v)) { idx = i; break; }
      if (idx < 0) for (let i = from + 1; i < to; i += 1) if (cur[i].t === 'op') { idx = i; break; }
      if (idx < 0) {
        // only a single number inside parentheses: drop them
        if (lo >= 0 && hi - lo === 2 && cur[lo + 1].t === 'n') {
          cur = [...cur.slice(0, lo), cur[lo + 1], ...cur.slice(hi + 1)];
          steps.push({ note: 'A number alone in parentheses: the parentheses simply disappear.', line: 0, vars: { expression: render(cur) } });
          continue;
        }
        return err('The expression is not well formed.');
      }
      const L = cur[idx - 1], R = cur[idx + 1], op = cur[idx] as { t: 'op'; v: string };
      if (!L || !R || L.t !== 'n' || R.t !== 'n') return err('The expression is not well formed.');
      let v: number;
      let why = '';
      switch (op.v) {
        case '+': v = toI32(L.v + R.v); break;
        case '-': v = toI32(L.v - R.v); break;
        case '*': v = Math.imul(L.v, R.v); break;
        case '/':
          if (R.v === 0) {
            steps.push({ note: `${L.v} / 0 → ArithmeticException: / by zero. Integer division by zero crashes the program.`, line: 1, vars: { expression: render(cur) } });
            return { steps, result: 'ArithmeticException: / by zero' };
          }
          v = Math.trunc(L.v / R.v);
          why = Number.isInteger(L.v / R.v) ? '' : ` (integer division drops the fraction: ${L.v / R.v} → ${v})`;
          break;
        default:
          if (R.v === 0) {
            steps.push({ note: `${L.v} % 0 → ArithmeticException: / by zero.`, line: 1, vars: { expression: render(cur) } });
            return { steps, result: 'ArithmeticException: / by zero' };
          }
          v = L.v % R.v;
          why = ` (the remainder has the sign of the left operand)`;
      }
      cur = [...cur.slice(0, idx - 1), { t: 'n', v }, ...cur.slice(idx + 2)];
      steps.push({ note: `Apply ${L.v} ${op.v} ${R.v} = ${v}${why}.`, line: '*/%'.includes(op.v) ? 1 : 2, vars: { operator: op.v, result: v, expression: render(cur) } });
    }
    const last = cur[0];
    if (cur.length !== 1 || last.t !== 'n') return err('The expression is not well formed.');
    return { steps, result: `${last.v}` };
  },
};

export const logicEval: LabAlgorithm = {
  id: 'logic-eval',
  title: 'Short-circuit evaluation',
  lesson: 'm1-operators-logical-ternary',
  summary: '&& and || stop as soon as the answer is known — which can prevent a crash.',
  inputs: [
    { key: 'x', label: 'x', default: '0', type: 'number' },
    { key: 'y', label: 'y', default: '10', type: 'number' },
    { key: 'z', label: 'z', default: '5', type: 'number' },
  ],
  pseudocode: ['boolean r = x != 0 && y / x > 2 || z == 5;', 'String s = r ? "yes" : "no";'],
  run({ x, y, z }) {
    const X = num(x), Y = num(y), Z = num(z);
    if (![X, Y, Z].every((n) => Number.isFinite(n) && Math.abs(n) <= 1e6)) return err('Enter three integers.');
    const steps: TraceStep[] = [{ note: 'Precedence: && binds tighter than ||, so the expression is (x != 0 && y / x > 2) || (z == 5).', line: 0, vars: { x: X, y: Y, z: Z } }];
    const a = X !== 0;
    steps.push({ note: `x != 0 → ${X} != 0 is ${a}.`, line: 0, vars: { 'x != 0': a } });
    let left: boolean;
    if (!a) {
      left = false;
      steps.push({ note: 'The left operand of && is false, so the whole && is false. y / x is NOT evaluated — there is no division by zero.', line: 0, vars: { 'x != 0 && …': false, 'y / x evaluated': false } });
    } else {
      const q = Math.trunc(Y / X);
      left = q > 2;
      steps.push({ note: `x != 0 is true, so the right side runs: y / x = ${q}, ${q} > 2 is ${left}.`, line: 0, vars: { 'y / x': q, 'y / x > 2': left } });
    }
    let r: boolean;
    if (left) {
      r = true;
      steps.push({ note: 'The left operand of || is true, so z == 5 is skipped.', line: 0, vars: { 'x != 0 && y / x > 2': true, 'z == 5 evaluated': false } });
    } else {
      r = Z === 5;
      steps.push({ note: `The left operand of || is false, so z == 5 decides: ${Z} == 5 is ${r}.`, line: 0, vars: { 'z == 5': r } });
    }
    steps.push({ note: `Ternary: r ? "yes" : "no" picks "${r ? 'yes' : 'no'}".`, line: 1, vars: { r, s: r ? 'yes' : 'no' } });
    return { steps, result: `r = ${r}, s = ${r ? 'yes' : 'no'}` };
  },
};

export const bitOps: LabAlgorithm = {
  id: 'bit-ops',
  title: 'Bitwise operators in binary',
  lesson: 'm1-operators-bitwise',
  summary: 'Combine two bytes bit by bit and see each result in 8-bit binary.',
  inputs: [
    { key: 'a', label: 'a (0–255)', default: '12', type: 'number' },
    { key: 'b', label: 'b (0–255)', default: '10', type: 'number' },
    { key: 'k', label: 'shift k (0–7)', default: '2', type: 'number' },
  ],
  pseudocode: ['a & b    // 1 only where both are 1', 'a | b    // 1 where either is 1', 'a ^ b    // 1 where they differ', '~a       // flip every bit', 'a << k   // multiply by 2^k', 'a >> k   // divide by 2^k'],
  run({ a, b, k }) {
    const A = num(a), B = num(b), K = num(k);
    if (!(A >= 0 && A <= 255 && B >= 0 && B <= 255 && K >= 0 && K <= 7)) return err('a and b must be 0–255 and k 0–7.');
    const ops: [string, number, string][] = [
      ['a & b', A & B, 'AND: 1 only where both bits are 1'],
      ['a | b', A | B, 'OR: 1 where at least one bit is 1'],
      ['a ^ b', A ^ B, 'XOR: 1 where the bits differ'],
      ['~a', ~A, 'NOT: every bit flips (a Java int has 32 bits, so the value is negative; the low 8 bits are shown)'],
      [`a << ${K}`, A << K, `shift left ${K}: the same as a * ${1 << K}; bits move toward the high end`],
      [`a >> ${K}`, A >> K, `shift right ${K}: the same as a / ${1 << K} (integer division)`],
    ];
    const rows: string[][] = [[`a = ${A}`, ...bin(A, 8).split('')], [`b = ${B}`, ...bin(B, 8).split('')]];
    const steps: TraceStep[] = [{ note: `a = ${A} is ${bin(A, 8)} and b = ${B} is ${bin(B, 8)} in 8 bits.`, line: 0, vars: { a: A, b: B }, grid: { cells: rows.map((r) => [...r]), caption: 'rows: operands and results (8 bits)' } }];
    const marks: Record<string, Mark> = {};
    ops.forEach(([name, val, why], i) => {
      rows.push([`${name} = ${val}`, ...bin(val & 0xff, 8).split('')]);
      for (let c = 1; c <= 8; c++) marks[`${rows.length - 1},${c}`] = rows[rows.length - 1][c] === '1' ? 'found' : 'dim';
      steps.push({ note: `${name} = ${val}. ${why}.`, line: i, vars: { [name]: val, 'low 8 bits': bin(val & 0xff, 8) }, grid: { cells: rows.map((r) => [...r]), marks: { ...marks }, caption: 'rows: operands and results (8 bits)' } });
    });
    return { steps, result: ops.map(([n, v]) => `${n} = ${v}`).join(', ') };
  },
};

function roundHalfUp(x: number, d: number): string {
  // Java's Formatter rounds the shortest decimal representation HALF_UP
  const neg = x < 0;
  const s = Math.abs(x).toString();
  if (/e/i.test(s)) return x.toFixed(d);
  const [ip, fp = ''] = s.split('.');
  const digits = (ip + fp.padEnd(d + 1, '0')).split('').map(Number);
  const keep = ip.length + d;
  const round = digits[keep] >= 5 ? 1 : 0;
  let carry = round;
  const out = digits.slice(0, keep);
  for (let i = out.length - 1; i >= 0 && carry; i--) {
    out[i] += carry;
    carry = out[i] > 9 ? 1 : 0;
    if (out[i] > 9) out[i] -= 10;
  }
  if (carry) out.unshift(1);
  const ilen = out.length - d;
  const r = out.slice(0, ilen).join('') + (d ? '.' + out.slice(ilen).join('') : '');
  return (neg && +r !== 0 ? '-' : '') + r;
}

export const printfFmt: LabAlgorithm = {
  id: 'printf-fmt',
  title: 'How printf formats one line',
  lesson: 'm1-output-printing',
  summary: 'Each % specifier consumes one argument and pads it to a width.',
  inputs: [
    { key: 'name', label: 'name (≤ 10 chars)', default: 'Pen', type: 'text' },
    { key: 'price', label: 'price', default: '2.5', type: 'number' },
    { key: 'qty', label: 'quantity (0–9999)', default: '7', type: 'number' },
  ],
  pseudocode: ['System.out.printf("%-8s|%8.2f|%04d%n", name, price, qty);', '%-8s   left-justify in 8 columns', '%8.2f   2 decimals, right-justify in 8', '%04d    integer, zero-padded to 4'],
  run({ name, price, qty }) {
    const P = +price, Q = num(qty);
    if (!name || name.length > 10 || /\s/.test(name) || !Number.isFinite(P) || Math.abs(P) > 99999 || !(Q >= 0 && Q <= 9999)) return err('Name: one word up to 10 characters; price a number; quantity 0–9999.');
    const a = name.padEnd(8, ' ');
    const f = roundHalfUp(P, 2).padStart(8, ' ');
    const d = String(Q).padStart(4, '0');
    const show = (s: string) => s.split('').map((c) => (c === ' ' ? '·' : c));
    const steps: TraceStep[] = [
      { note: '%-8s takes the first argument (a String) and left-justifies it in a field of width 8; "-" means pad on the right. Longer text is never cut.', line: 1, vars: { argument: `"${name}"`, width: 8, output: `"${a}"` }, arrays: [arr('field (· = space)', show(a))] },
      { note: `The literal | is copied as it is.`, line: 0, vars: { output: `${a}|` }, arrays: [arr('so far', show(`${a}|`))] },
      { note: `%8.2f takes the double ${P}: rounds to 2 decimals (HALF_UP) giving ${roundHalfUp(P, 2)}, then right-justifies in width 8.`, line: 2, vars: { argument: P, output: `"${f}"` }, arrays: [arr('field (· = space)', show(f))] },
      { note: `After another |, %04d takes the int ${Q}: the 0 flag pads with zeros to width 4 → ${d}.`, line: 3, vars: { argument: Q, output: `"${d}"` }, arrays: [arr('field', show(d))] },
      { note: '%n is a platform-independent line break.', line: 0, vars: { line: `${a}|${f}|${d}` }, arrays: [arr('final line (· = space)', show(`${a}|${f}|${d}`))] },
    ];
    return { steps, result: `${a}|${f}|${d}`.replace(/ /g, '·') + '   (· = space)' };
  },
};

export const scannerTokens: LabAlgorithm = {
  id: 'scanner-tokens',
  title: 'What Scanner really consumes',
  lesson: 'm1-input-scanner',
  summary: 'nextInt() stops before the line break, so a following nextLine() returns the rest of that same line — usually an empty string.',
  inputs: [
    { key: 'text', label: 'input (use | for Enter)', default: '12 7|Alice Smith|', type: 'text' },
    { key: 'calls', label: 'calls', default: 'nextInt,nextInt,nextLine,nextLine', type: 'text', hint: 'nextInt, nextDouble, next, nextLine' },
  ],
  pseudocode: ['nextInt()/next()/nextDouble(): skip whitespace, then read one token', 'nextLine(): read up to the end of the current line and consume the line break'],
  run({ text, calls }) {
    if (!text || text.length > 40) return err('Input: up to 40 characters.');
    const src = text.replace(/\|/g, '\n');
    const cs = (calls ?? '').split(/[\s,]+/).filter(Boolean);
    const ok = new Set(['nextInt', 'nextDouble', 'next', 'nextLine']);
    if (!cs.length || cs.length > 8 || cs.some((c) => !ok.has(c))) return err('Calls: up to 8 of nextInt, nextDouble, next, nextLine.');
    let pos = 0;
    const cells = () => src.split('').map((c) => (c === '\n' ? '↵' : c === ' ' ? '␣' : c));
    const steps: TraceStep[] = [{ note: 'The characters of the input; the cursor starts before the first one.', line: 0, vars: { cursor: 0 }, arrays: [arr('input stream', cells(), {}, { 0: '▲' })] }];
    const out: string[] = [];
    for (const c of cs) {
      const start = pos;
      let value = '';
      if (c === 'nextLine') {
        if (pos >= src.length) {
          steps.push({ note: 'nextLine() with nothing left throws NoSuchElementException.', line: 1, vars: { call: 'nextLine()' } });
          return { steps, result: 'NoSuchElementException' };
        }
        let j = src.indexOf('\n', pos);
        if (j < 0) j = src.length;
        value = src.slice(pos, j);
        pos = Math.min(src.length, j + 1);
      } else {
        while (pos < src.length && /\s/.test(src[pos])) pos++;
        if (pos >= src.length) {
          steps.push({ note: `${c}() found no token: NoSuchElementException.`, line: 0, vars: { call: `${c}()` } });
          return { steps, result: 'NoSuchElementException' };
        }
        let j = pos;
        while (j < src.length && !/\s/.test(src[j])) j++;
        value = src.slice(pos, j);
        if (c === 'nextInt' && !/^[+-]?\d+$/.test(value)) {
          steps.push({ note: `nextInt() found the token "${value}", which is not an int: InputMismatchException.`, line: 0, vars: { call: 'nextInt()', token: value } });
          return { steps, result: 'InputMismatchException' };
        }
        if (c === 'nextDouble' && !/^[+-]?(\d+\.?\d*|\.\d+)$/.test(value)) {
          steps.push({ note: `nextDouble() found "${value}", not a number: InputMismatchException.`, line: 0, vars: { call: 'nextDouble()', token: value } });
          return { steps, result: 'InputMismatchException' };
        }
        pos = j;
      }
      out.push(`${c}() → "${value.replace(/\n/g, '↵')}"`);
      const marks: Record<number, Mark> = {};
      for (let i = start; i < pos; i++) marks[i] = 'found';
      steps.push({
        note: c === 'nextLine' ? `nextLine() returns "${value}" ${value === '' ? '(empty: it only finished the previous line)' : ''} and moves past the line break.` : `${c}() skips whitespace and reads the token "${value}"; the cursor stops right after it, BEFORE the line break.`,
        line: c === 'nextLine' ? 1 : 0,
        vars: { call: `${c}()`, returned: value === '' ? '""' : `"${value}"`, cursor: pos },
        arrays: [arr('input stream', cells(), marks, { [Math.min(pos, src.length - 1)]: '▲' })],
      });
    }
    return { steps, result: out.join('   ') };
  },
};

export const callStackTrace: LabAlgorithm = {
  id: 'call-stack-trace',
  title: 'Method calls and parameters',
  lesson: 'm1-methods',
  summary: 'Each call gets its own copies of the parameters; the return value flows back to the caller.',
  inputs: [
    { key: 'a', label: 'a', default: '4', type: 'number' },
    { key: 'b', label: 'b', default: '9', type: 'number' },
    { key: 'c', label: 'c', default: '6', type: 'number' },
  ],
  pseudocode: ['static int max(int x, int y) { return x > y ? x : y; }', 'static int max3(int a, int b, int c) { return max(max(a, b), c); }', 'int m = max3(a, b, c);'],
  run({ a, b, c }) {
    const A = num(a), B = num(b), C = num(c);
    if (![A, B, C].every((n) => Number.isFinite(n) && Math.abs(n) <= 1e6)) return err('Enter three integers.');
    const stack: string[] = [];
    const steps: TraceStep[] = [];
    const push = (f: string, note: string, vars: Record<string, string | number | boolean>, line: number) => {
      stack.push(f);
      steps.push({ note, line, vars, arrays: [arr('call stack (bottom → top)', [...stack], { [stack.length - 1]: 'cur' })] });
    };
    const pop = (note: string, vars: Record<string, string | number | boolean>, line: number) => {
      steps.push({ note, line, vars, arrays: [arr('call stack (bottom → top)', [...stack], { [stack.length - 1]: 'found' })] });
      stack.pop();
    };
    push(`max3(a=${A}, b=${B}, c=${C})`, `main calls max3(${A}, ${B}, ${C}): the argument VALUES are copied into the parameters a, b, c.`, { a: A, b: B, c: C }, 2);
    push(`max(x=${A}, y=${B})`, `max3 first evaluates the inner call max(a, b) = max(${A}, ${B}).`, { x: A, y: B }, 1);
    const m1 = A > B ? A : B;
    pop(`x > y is ${A > B}, so max returns ${m1}. The frame disappears.`, { x: A, y: B, return: m1 }, 0);
    push(`max(x=${m1}, y=${C})`, `Now the outer call max(${m1}, ${C}).`, { x: m1, y: C }, 1);
    const m2 = m1 > C ? m1 : C;
    pop(`x > y is ${m1 > C}, so max returns ${m2}.`, { x: m1, y: C, return: m2 }, 0);
    pop(`max3 returns ${m2} to main.`, { a: A, b: B, c: C, return: m2 }, 1);
    return { steps, result: `max3(${A}, ${B}, ${C}) = ${m2}` };
  },
};

export const traceTable: LabAlgorithm = {
  id: 'trace-table',
  title: 'A trace table finds the bug',
  lesson: 'm1-debugging-tracing',
  summary: 'Write down every variable after every step; the first wrong value points at the bug.',
  inputs: [{ key: 'arr', label: 'array', default: '2,7,4,9,6', type: 'text' }],
  pseudocode: ['// BUGGY: should count the even numbers', 'int count = 0;', 'for (int i = 1; i < a.length; i++)   // starts at 1!', '    if (a[i] % 2 == 0) count++;', 'return count;'],
  run({ arr: s }) {
    const a = ints(s, 10);
    if (!a) return err('Enter up to 10 integers separated by commas.');
    const expected = a.filter((v) => v % 2 === 0).length;
    let count = 0;
    const steps: TraceStep[] = [{ note: 'Before the loop count = 0. The loop will start at i = 1, not 0.', line: 1, vars: { count: 0, 'expected count': 0 }, arrays: [arr('a', [...a])] }];
    for (let i = 1; i < a.length; i++) {
      const even = a[i] % 2 === 0;
      if (even) {
        count++;
      }
      steps.push({ note: `i = ${i}: a[${i}] = ${a[i]} is ${even ? 'even → count++' : 'odd → unchanged'}.`, line: 3, vars: { i, 'a[i]': a[i], even, count, 'a[0] ignored': true }, arrays: [arr('a', [...a], { 0: 'bad', [i]: 'cur' })] });
    }
    const bug = a[0] % 2 === 0;
    steps.push({ note: bug ? `The loop never looked at a[0] = ${a[0]}, which is even. Trace table says count = ${count} but the correct answer is ${expected}: the bug is the loop start.` : `a[0] = ${a[0]} is odd, so skipping it happened not to matter for THIS input — a good example of why one passing test proves little.`, line: 2, vars: { count, expected }, arrays: [arr('a', [...a], { 0: bug ? 'bad' : 'dim' })] });
    return { steps, result: `buggy count = ${count}, correct = ${expected}${bug ? ' → off-by-one at the loop start' : ' (same by luck)'}` };
  },
};

// ───────────────────────── Module 2 ─────────────────────────

export const toBinary: LabAlgorithm = {
  id: 'to-binary',
  title: 'Decimal to binary (and two\'s complement)',
  lesson: 'm2-number-systems-binary',
  summary: 'Divide by 2 repeatedly; the remainders, read from last to first, are the bits.',
  inputs: [{ key: 'n', label: 'n (−128…255)', default: '45', type: 'number' }],
  pseudocode: ['while n > 0:', '    remainder = n % 2', '    n = n / 2', 'read the remainders bottom-up', 'negative: invert all 8 bits, add 1'],
  run({ n }) {
    const N = num(n);
    if (!(N >= -128 && N <= 255)) return err('n must be between −128 and 255.');
    const mag = Math.abs(N);
    const steps: TraceStep[] = [];
    const rems: number[] = [];
    let q = mag;
    if (q === 0) steps.push({ note: '0 has no remainders to collect: its binary form is 0.', line: 0, vars: { n: 0 } });
    while (q > 0) {
      const r = q % 2;
      rems.push(r);
      steps.push({ note: `${q} ÷ 2 = ${Math.floor(q / 2)} remainder ${r}.`, line: 1, vars: { n: q, quotient: Math.floor(q / 2), remainder: r }, arrays: [arr('remainders so far (first → last)', [...rems])] });
      q = Math.floor(q / 2);
    }
    const bits = rems.length ? [...rems].reverse().join('') : '0';
    steps.push({ note: `Read the remainders from the LAST to the FIRST: ${bits} (${mag} in binary).`, line: 3, vars: { binary: bits, '8-bit': bin(mag, 8) }, arrays: [arr('bits (high → low)', bin(mag, 8).split(''))] });
    if (N < 0) {
      const inv = bin(mag, 8).split('').map((c) => (c === '1' ? '0' : '1')).join('');
      steps.push({ note: `${N} is negative: invert every bit of ${bin(mag, 8)} → ${inv}.`, line: 4, vars: { inverted: inv }, arrays: [arr('inverted', inv.split(''), Object.fromEntries(inv.split('').map((_, i) => [i, 'swap'] as [number, Mark])))] });
      const tc = bin((parseInt(inv, 2) + 1) & 0xff, 8);
      steps.push({ note: `Add 1: ${inv} + 1 = ${tc}. That is ${N} in 8-bit two's complement.`, line: 4, vars: { 'two\'s complement': tc }, arrays: [arr('result', tc.split(''), Object.fromEntries(tc.split('').map((_, i) => [i, 'found'] as [number, Mark])))] });
      return { steps, result: `${N} = ${tc} (8-bit two's complement)` };
    }
    return { steps, result: `${N} = ${bin(N, 8)} (8 bits)` };
  },
};

export const primeTrial: LabAlgorithm = {
  id: 'prime-trial',
  title: 'Trial division up to √n',
  lesson: 'm2-math-gcd-lcm-primes-mod',
  summary: 'To test primality only divisors up to √n need to be tried.',
  inputs: [{ key: 'n', label: 'n (2–100000)', default: '91', type: 'number' }],
  pseudocode: ['for d = 2; d * d <= n; d++:', '    if n % d == 0: composite (d divides n)', 'otherwise n is prime'],
  run({ n }) {
    const N = num(n);
    if (!(N >= 2 && N <= 100000)) return err('n must be between 2 and 100000.');
    const steps: TraceStep[] = [];
    let found = 0;
    let tests = 0;
    for (let d = 2; d * d <= N; d++) {
      tests++;
      const div = N % d === 0;
      steps.push({ note: `d = ${d}: ${d}² = ${d * d} ≤ ${N}, so test it: ${N} % ${d} = ${N % d}${div ? ` → ${d} divides ${N}.` : '.'}`, line: 1, vars: { d, 'd * d': d * d, 'n % d': N % d } });
      if (div) {
        found = d;
        break;
      }
    }
    if (!found) {
      steps.push({ note: `The next d would satisfy d² > ${N}: no divisor up to √${N} ≈ ${Math.sqrt(N).toFixed(1)} exists, so ${N} is prime.`, line: 2, vars: { tests, 'naive tests': N - 2 } });
      return { steps, result: `${N} is prime (${tests} tests instead of ${N - 2})` };
    }
    const f: number[] = [];
    let m = N;
    for (let d = 2; d * d <= m; d++) while (m % d === 0) { f.push(d); m /= d; }
    if (m > 1) f.push(m);
    steps.push({ note: `${N} = ${f.join(' × ')}.`, line: 1, vars: { 'smallest divisor': found, factorisation: f.join(' × ') } });
    return { steps, result: `${N} is composite: ${f.join(' × ')} (found after ${tests} test${tests > 1 ? 's' : ''})` };
  },
};

export const passByValue: LabAlgorithm = {
  id: 'pass-by-value',
  title: 'Pass-by-value with an int and an array',
  lesson: 'm2-references-memory',
  summary: 'Java always copies the argument; for an array the copied value is the reference.',
  inputs: [
    { key: 'n', label: 'int argument', default: '5', type: 'number' },
    { key: 'first', label: 'first array element', default: '1', type: 'number' },
  ],
  pseudocode: ['static void f(int x, int[] p) {', '    x = 99;            // changes the copy', '    p[0] = 99;         // changes the shared object', '    p = new int[]{-1}; // re-points the local copy only', '}', 'f(n, a);'],
  run({ n, first }) {
    const N = num(n), F = num(first);
    if (!Number.isFinite(N) || !Number.isFinite(F) || Math.abs(N) > 1e6 || Math.abs(F) > 1e6) return err('Enter two integers.');
    const obj = [F, 2];
    const steps: TraceStep[] = [];
    const view = (extra: string[], hl: number[] = []) => arr('variables', extra, Object.fromEntries(hl.map((i) => [i, 'cur'] as [number, Mark])));
    steps.push({ note: `main has n = ${N} and a → #1 {${obj.join(', ')}}.`, line: 5, vars: { n: N, a: '→ #1' }, arrays: [view(['main: n = ' + N, 'main: a → #1'])] });
    steps.push({ note: `Call f(n, a): x gets a COPY of ${N}; p gets a COPY of the reference, so p also points to #1.`, line: 5, vars: { x: N, p: '→ #1' }, arrays: [view(['main: n = ' + N, 'main: a → #1', 'f: x = ' + N, 'f: p → #1'], [2, 3])] });
    steps.push({ note: 'x = 99 changes only the copy inside f; main\'s n is untouched.', line: 1, vars: { x: 99, 'main n': N }, arrays: [view(['main: n = ' + N, 'main: a → #1', 'f: x = 99', 'f: p → #1'], [2])] });
    obj[0] = 99;
    steps.push({ note: `p[0] = 99 follows the reference to the one shared object #1, so main's a now reads {${obj.join(', ')}}.`, line: 2, vars: { 'object #1': `{${obj.join(', ')}}` }, arrays: [view(['main: n = ' + N, 'main: a → #1 {' + obj.join(', ') + '}', 'f: x = 99', 'f: p → #1'], [1, 3])] });
    steps.push({ note: 'p = new int[]{-1} makes the LOCAL reference point to a new object #2. main\'s a is not affected.', line: 3, vars: { p: '→ #2', 'main a': '→ #1' }, arrays: [view(['main: n = ' + N, 'main: a → #1 {' + obj.join(', ') + '}', 'f: x = 99', 'f: p → #2 {-1}'], [3])] });
    steps.push({ note: `f returns and its variables vanish. main still has n = ${N} and a = {${obj.join(', ')}}.`, line: 4, vars: { n: N, a: `{${obj.join(', ')}}` }, arrays: [view(['main: n = ' + N, 'main: a → #1 {' + obj.join(', ') + '}'], [0, 1])] });
    return { steps, result: `n stays ${N}; a[0] became 99 (the object was shared)` };
  },
};

export const boundsCheck: LabAlgorithm = {
  id: 'bounds-check',
  title: 'Off-by-one at the array boundary',
  lesson: 'm2-boundaries-validation',
  summary: 'i <= a.length reads one cell too far and the JVM stops the program.',
  inputs: [
    { key: 'arr', label: 'array', default: '3,1,4,1,5', type: 'text' },
    { key: 'mode', label: 'loop condition: 1 = i < length, 2 = i <= length (bug)', default: '2', type: 'number' },
  ],
  pseudocode: ['int sum = 0;', 'for (int i = 0; i < a.length; i++)     // correct', 'for (int i = 0; i <= a.length; i++)    // BUG', '    sum += a[i];'],
  run({ arr: s, mode }) {
    const a = ints(s, 10);
    const m = num(mode);
    if (!a || ![1, 2].includes(m)) return err('Enter up to 10 integers and a mode of 1 or 2.');
    let sum = 0;
    const steps: TraceStep[] = [{ note: `The array has length ${a.length}: valid indices are 0 … ${a.length - 1}.`, line: 0, vars: { length: a.length, sum: 0 }, arrays: [arr('a', [...a])] }];
    const last = m === 1 ? a.length - 1 : a.length;
    for (let i = 0; i <= last; i++) {
      if (i >= a.length) {
        steps.push({ note: `i = ${i}: the condition i <= ${a.length} is still true, so a[${i}] is evaluated — but there is no such cell. ArrayIndexOutOfBoundsException: Index ${i} out of bounds for length ${a.length}.`, line: 3, vars: { i, length: a.length, sum }, arrays: [arr('a', [...a], { })] });
        return { steps, result: `crashed with ArrayIndexOutOfBoundsException (index ${i}, length ${a.length}) after summing ${sum}` };
      }
      sum += a[i];
      steps.push({ note: `i = ${i}: sum += a[${i}] (${a[i]}) → ${sum}.`, line: 3, vars: { i, 'a[i]': a[i], sum }, arrays: [arr('a', [...a], { [i]: 'cur' })] });
    }
    steps.push({ note: `The condition i < ${a.length} became false at i = ${a.length}; the loop ended cleanly.`, line: 1, vars: { i: a.length, sum } });
    return { steps, result: `sum = ${sum}` };
  },
};
