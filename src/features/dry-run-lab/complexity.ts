// Complexity lab: every snippet is executed for real (as a JavaScript mirror of the Java loop)
// so the iteration counts shown on screen are measured, not looked up.
export interface LoopSnippet {
  id: string;
  title: string;
  java: string;
  /** counts how many times the innermost statement runs for input n */
  count(n: number): number;
  bigO: string;
  why: string;
  maxN: number;
}

export const LOOP_SNIPPETS: LoopSnippet[] = [
  {
    id: 'linear',
    title: 'Single loop',
    java: 'for (int i = 1; i < n; i++) {\n    work();\n}',
    count: (n) => { let c = 0; for (let i = 1; i < n; i++) c++; return c; },
    bigO: 'O(n)', why: 'The body runs once for each value of i from 1 to n−1.', maxN: 1_000_000,
  },
  {
    id: 'sqrt',
    title: 'Loop until i·i > n',
    java: 'for (int i = 1; i * i <= n; i++) {\n    work();\n}',
    count: (n) => { let c = 0; for (let i = 1; i * i <= n; i++) c++; return c; },
    bigO: 'O(√n)', why: 'i·i ≤ n  ⟺  i ≤ √n, so about √n iterations.', maxN: 100_000_000,
  },
  {
    id: 'doubling',
    title: 'Doubling counter',
    java: 'for (int i = 1; i <= n; i = i * 2) {\n    work();\n}',
    count: (n) => { let c = 0; for (let i = 1; i <= n; i *= 2) c++; return c; },
    bigO: 'O(log n)', why: 'i takes the values 1, 2, 4, 8, … — only log₂ n of them are ≤ n.', maxN: 1e15,
  },
  {
    id: 'halving',
    title: 'Halving n',
    java: 'while (n > 1) {\n    n = n / 2;\n}',
    count: (n) => { let c = 0; while (n > 1) { n = Math.floor(n / 2); c++; } return c; },
    bigO: 'O(log n)', why: 'Each pass halves n, so after log₂ n passes it reaches 1.', maxN: 1e15,
  },
  {
    id: 'nested',
    title: 'Two nested loops',
    java: 'for (int i = 1; i < n; i++)\n    for (int j = 1; j < n; j++)\n        work();',
    count: (n) => { let c = 0; for (let i = 1; i < n; i++) for (let j = 1; j < n; j++) c++; return c; },
    bigO: 'O(n²)', why: 'The inner loop runs n−1 times for each of the n−1 outer iterations.', maxN: 3000,
  },
  {
    id: 'break',
    title: 'Inner loop with break',
    java: 'for (int i = 1; i < n; i++)\n    for (int j = 1; j < n; j++) {\n        work();\n        break;\n    }',
    count: (n) => { let c = 0; for (let i = 1; i < n; i++) for (let j = 1; j < n; j++) { c++; break; } return c; },
    bigO: 'O(n)', why: 'The inner loop is cut off after one pass, so the total is just n−1.', maxN: 1_000_000,
  },
  {
    id: 'harmonic',
    title: 'Inner step grows with i',
    java: 'for (int i = 1; i < n; i++)\n    for (int j = 1; j < n; j = j + i)\n        work();',
    count: (n) => { let c = 0; for (let i = 1; i < n; i++) for (let j = 1; j < n; j += i) c++; return c; },
    bigO: 'O(n log n)', why: 'The inner loop runs about n/i times: n·(1 + 1/2 + 1/3 + …) = n·ln n (harmonic series).', maxN: 20000,
  },
  {
    id: 'n-log-n',
    title: 'Linear × doubling',
    java: 'for (int i = 1; i < n; i++)\n    for (int j = 1; j < n; j = j * 2)\n        work();',
    count: (n) => { let c = 0; for (let i = 1; i < n; i++) for (let j = 1; j < n; j *= 2) c++; return c; },
    bigO: 'O(n log n)', why: 'n outer iterations × log₂ n inner iterations. (The slide’s derivation to log² n is wrong — the outer loop is linear.)', maxN: 200_000,
  },
  {
    id: 'triangle',
    title: 'Triangle × constant',
    java: 'for (int i = 1; i <= n; i++)\n    for (int j = 1; j <= i; j++)\n        for (int k = 1; k <= 20; k++)\n            work();',
    count: (n) => { let c = 0; for (let i = 1; i <= n; i++) for (let j = 1; j <= i; j++) c += 20; return c; },
    bigO: 'O(n²)', why: '20·(1 + 2 + … + n) = 10·n·(n+1); constants are dropped.', maxN: 5000,
  },
  {
    id: 'quartic',
    title: 'i² inner × n/2',
    java: 'for (int i = 1; i <= n; i++)\n    for (int j = 1; j <= i * i; j++)\n        for (int k = 1; k <= n / 2; k++)\n            work();',
    count: (n) => { let c = 0; for (let i = 1; i <= n; i++) c += i * i * Math.floor(n / 2); return c; },
    bigO: 'O(n⁴)', why: 'Σ i² ≈ n³/3, times n/2 → n⁴/6. (The slide’s answer is O(n⁴); its text derivation says n³, which is wrong.)', maxN: 100000,
  },
  {
    id: 'log-squared',
    title: 'n/2 × log × log',
    java: 'for (int i = n / 2; i >= 1; i--)\n    for (int j = 1; j <= n; j = j * 2)\n        for (int k = 1; k <= n; k = k * 2)\n            work();',
    count: (n) => { let c = 0; const lg = Math.floor(Math.log2(n)) + 1; for (let i = Math.floor(n / 2); i >= 1; i--) c += lg * lg; return c; },
    bigO: 'O(n log² n)', why: 'n/2 outer × (log n) × (log n).', maxN: 1_000_000,
  },
  {
    id: 'sum-limit',
    title: 'Adding 1, 2, 3 … until s > n',
    java: 'int i = 1, s = 1;\nwhile (s <= n) {\n    i++;\n    s = s + i;\n}',
    count: (n) => { let i = 1, s = 1, c = 0; while (s <= n) { i++; s += i; c++; } return c; },
    bigO: 'O(√n)', why: 's = 1 + 2 + … + i ≈ i²/2 exceeds n when i ≈ √(2n).', maxN: 1e12,
  },
  {
    id: 'digits',
    title: 'Sum of digits',
    java: 'while (n > 0) {\n    ans += n % 10;\n    n /= 10;\n}',
    count: (n) => { let c = 0; while (n > 0) { n = Math.floor(n / 10); c++; } return c; },
    bigO: 'O(log n)', why: 'One iteration per decimal digit: ⌊log₁₀ n⌋ + 1.', maxN: 1e15,
  },
];

export interface GrowthClass {
  id: string;
  label: string;
  f(n: number): number;
  example: string;
}
export const GROWTH: GrowthClass[] = [
  { id: 'const', label: 'O(1)', f: () => 1, example: 'Odd or even; array index access' },
  { id: 'log', label: 'O(log n)', f: (n) => Math.log2(n), example: 'Binary search' },
  { id: 'sqrt', label: 'O(√n)', f: (n) => Math.sqrt(n), example: 'Trial division primality test' },
  { id: 'n', label: 'O(n)', f: (n) => n, example: 'Find the maximum' },
  { id: 'nlogn', label: 'O(n log n)', f: (n) => n * Math.log2(n), example: 'Merge sort' },
  { id: 'n2', label: 'O(n²)', f: (n) => n * n, example: 'Bubble / selection sort' },
  { id: 'n3', label: 'O(n³)', f: (n) => n ** 3, example: 'Naive matrix multiplication' },
  { id: '2n', label: 'O(2ⁿ)', f: (n) => 2 ** n, example: 'All subsets' },
  { id: 'nfact', label: 'O(n!)', f: (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }, example: 'All permutations' },
];

export function fmtBig(x: number): string {
  if (!isFinite(x)) return '∞';
  if (x < 1e6) return Math.round(x).toLocaleString('en-US');
  return x.toExponential(2).replace('e+', ' × 10^');
}

// ───────────── recursion call trees ─────────────
export interface CallNode {
  label: string;
  result?: string;
  children: CallNode[];
}
export interface RecursionDemo {
  id: string;
  title: string;
  java: string;
  param: string;
  default: number;
  max: number;
  tree(n: number): { root: CallNode; calls: number; depth: number };
}
export const RECURSION_DEMOS: RecursionDemo[] = [
  {
    id: 'factorial',
    title: 'factorial(n)',
    java: 'static long fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}',
    param: 'n',
    default: 5,
    max: 8,
    tree(n) {
      let calls = 0;
      let depth = 0;
      const go = (k: number, d: number): CallNode => {
        calls++;
        depth = Math.max(depth, d);
        const node: CallNode = { label: `fact(${k})`, children: [] };
        if (k <= 1) {
          node.result = '1';
          return node;
        }
        const c = go(k - 1, d + 1);
        node.children.push(c);
        node.result = String(k * Number(c.result));
        return node;
      };
      return { root: go(n, 1), calls, depth };
    },
  },
  {
    id: 'fibonacci',
    title: 'fib(n) — the slide\'s space/time example',
    java: 'static int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}',
    param: 'n',
    default: 5,
    max: 7,
    tree(n) {
      let calls = 0;
      let depth = 0;
      const go = (k: number, d: number): CallNode => {
        calls++;
        depth = Math.max(depth, d);
        const node: CallNode = { label: `fib(${k})`, children: [] };
        if (k <= 1) {
          node.result = String(k);
          return node;
        }
        const a = go(k - 1, d + 1);
        const b = go(k - 2, d + 1);
        node.children.push(a, b);
        node.result = String(Number(a.result) + Number(b.result));
        return node;
      };
      return { root: go(n, 1), calls, depth };
    },
  },
  {
    id: 'josephus',
    title: 'josephus(n, k = 2) — the slide\'s recursion',
    java: 'static int josephus(int n, int k) {\n    if (n == 1) return 1;\n    return (josephus(n - 1, k) + k - 1) % n + 1;\n}',
    param: 'n',
    default: 7,
    max: 14,
    tree(n) {
      const k = 2;
      let calls = 0;
      let depth = 0;
      const go = (m: number, d: number): CallNode => {
        calls++;
        depth = Math.max(depth, d);
        const node: CallNode = { label: `josephus(${m}, ${k})`, children: [] };
        if (m === 1) {
          node.result = '1';
          return node;
        }
        const c = go(m - 1, d + 1);
        node.children.push(c);
        node.result = String(((Number(c.result) + k - 1) % m) + 1);
        return node;
      };
      return { root: go(n, 1), calls, depth };
    },
  },
  {
    id: 'gcd',
    title: 'gcd(a, b) with b = a − 1…',
    java: 'static int gcd(int a, int b) {\n    if (b == 0) return a;\n    return gcd(b, a % b);\n}',
    param: 'n (computes gcd(n, 13))',
    default: 91,
    max: 5000,
    tree(n) {
      let calls = 0;
      let depth = 0;
      const go = (a: number, b: number, d: number): CallNode => {
        calls++;
        depth = Math.max(depth, d);
        const node: CallNode = { label: `gcd(${a}, ${b})`, children: [] };
        if (b === 0) {
          node.result = String(a);
          return node;
        }
        const c = go(b, a % b, d + 1);
        node.children.push(c);
        node.result = c.result;
        return node;
      };
      return { root: go(n, 13, 1), calls, depth };
    },
  },
];
