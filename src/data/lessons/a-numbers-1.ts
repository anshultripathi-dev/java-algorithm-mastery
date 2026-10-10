import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

export const euclidGcd: Lesson = lesson({
  id: 'a-euclid-gcd',
  module: 'm5',
  title: "Euclid's Algorithm (GCD)",
  summary: 'Find the greatest common divisor of two numbers in a handful of steps by repeatedly taking remainders.',
  level: 'beginner',
  track: 'archive',
  minutes: 40,
  essential: true,
  prerequisites: ['m1-loops', 'm1-methods', 'm2-math-gcd-lcm-primes-mod', 'm2-recursion'],
  sources: ["Euclid's-Algorithm"],
  objectives: [
    'Explain what a GCD is and compute small ones by listing divisors.',
    'Explain WHY gcd(a, b) = gcd(b, a mod b) — not just that it works.',
    'Write Euclid\'s algorithm in Java both as a loop and recursively, and trace it by hand.',
    'State its running time, O(log min(a, b)), and why it is so much faster than trying every divisor.',
  ],
  intuition: [
    p('The **greatest common divisor** (GCD) of two numbers is the largest number that divides both of them with no remainder. gcd(12, 18) = 6 because 6 divides 12 and 18, and nothing bigger does.'),
    p('Picture a floor that is 50 tiles long and 12 tiles wide. You want the **largest square tile** that covers the whole floor with no cutting. Euclid\'s trick: cut off as many 12×12 squares as you can. Four fit (4 × 12 = 48), leaving a thin strip 12 long and **2** wide. Any tile that works for the big floor must also work for the leftover strip, so now solve the strip: cut 2×2 squares from 12×2 — six fit and nothing is left over. The tile is 2×2, so gcd(50, 12) = 2.'),
    pre(`
 50 = 4 × 12 + 2      → gcd(50, 12) = gcd(12, 2)
 12 = 6 × 2  + 0      → gcd(12,  2) = gcd( 2, 0) = 2
`, 'Each line replaces the pair (a, b) with the smaller pair (b, a mod b).'),
    why('Let d be any number that divides both a and b. Write a = q·b + r. Then r = a − q·b, which is also divisible by d. So d divides b and r too. The same argument works backwards: anything dividing b and r also divides a = q·b + r. Hence **a,b and b,r have exactly the same common divisors**, so they have the same greatest one. That single idea is the entire algorithm; the program is just that idea repeated until the remainder is 0.'),
  ],
  syntax: [
    p('You need three Java ideas, all from earlier lessons:'),
    ul('`%` is the remainder operator: `50 % 12` is `2`.', 'A `while (b != 0)` loop repeats until the condition becomes false.', 'A method can call itself (recursion) as long as it has a **base case** that stops it.'),
  ],
  tiny: [
    p('The smallest useful version just does what the pen-and-paper table does:'),
    code(`
int a = 50, b = 12;
while (b != 0) {
    int r = a % b;   // remainder of this step
    a = b;           // the old divisor becomes the new dividend
    b = r;           // the remainder becomes the new divisor
}
System.out.println(a); // 2
`),
  ],
  guided: [
    p('The lecture slides write the work as a **Q | A | B | R** table (quotient, dividend, divisor, remainder). Each new row takes A from the previous B and B from the previous R. For gcd(33, 12):'),
    table(['Q', 'A', 'B', 'R'], [['2', '33', '12', '9'], ['1', '12', '9', '3'], ['3', '9', '3', '0'], ['—', '3', '0', '—']], 'The answer is the A on the last row, where B has become 0: gcd(33, 12) = 3.'),
    p('The program `EuclidGcd` prints exactly this table so you can compare it with your hand calculation. `NaiveGcd` shows the slow alternative — try every candidate from `min(a, b)` downwards — so you can feel the difference.'),
    prog('euclid-gcd/NaiveGcd.java', 'Simple (educational) solution'),
    prog('euclid-gcd/EuclidGcd.java', "Euclid's algorithm with the lecture's Q|A|B|R table"),
    prog('euclid-gcd/EuclidRecursive.java', 'Recursive form — each printed line is one level of the call stack'),
  ],
  dryRun: { algo: 'euclid-gcd', input: { a: '83', b: '19' }, caption: 'Slide example 2: gcd(83, 19) — the numbers shrink until the remainder reaches 0.' },
  programs: [
    {
      file: 'euclid-gcd/NaiveGcd.java',
      title: 'Naive GCD (try every divisor)',
      role: 'simple',
      description: 'Counts down from min(a, b) and returns the first number that divides both. Easy to believe, but slow for big inputs.',
      walkthrough: [
        { at: 'Math.min(a, b)', text: 'A common divisor can never be larger than the smaller number, so we start there.' },
        { at: 'for (int d = smaller', text: 'Counting DOWN means the first hit is automatically the greatest.' },
        { at: 'a % d == 0 && b % d == 0', text: 'd is a common divisor only if it divides both with remainder 0.' },
        { at: 'return 1;', text: 'Reached only for inputs the lesson excludes (0 or negatives). Every positive pair shares divisor 1, so the loop always returns earlier.' },
      ],
    },
    {
      file: 'euclid-gcd/EuclidGcd.java',
      title: "Euclid's algorithm (iterative)",
      role: 'optimized',
      description: 'Replaces (a, b) by (b, a mod b) until b is 0. Uses long and Math.abs so large and negative inputs behave.',
      walkthrough: [
        { at: 'a = Math.abs(a);', text: 'gcd ignores signs: gcd(-12, 18) = gcd(12, 18) = 6.' },
        { at: 'while (b != 0)', text: 'Stop when the divisor reaches 0; at that moment a holds the answer.' },
        { at: 'long remainder = a % b;', text: 'Compute the remainder BEFORE overwriting a — the order of the next three lines matters.' },
        { at: 'a = b;', text: 'Slide the window: old divisor becomes the new dividend.' },
        { at: 'b = remainder;', text: 'The remainder becomes the new divisor (it is strictly smaller than b, so progress is guaranteed).' },
        { at: 'long q = x / y;', text: 'The table printing loop repeats the algorithm just to display Q, A, B, R. The real work is the gcd method above.' },
      ],
    },
    {
      file: 'euclid-gcd/EuclidRecursive.java',
      title: "Euclid's algorithm (recursive)",
      role: 'demo',
      description: 'The same rule written as a self-calling method, with a print so you can watch the call stack unwind.',
      walkthrough: [
        { at: 'if (b == 0)', text: 'Base case — without it the method would recurse forever (and then divide by zero).' },
        { at: 'return gcd(b, a % b);', text: 'The recursive step is the rule gcd(a, b) = gcd(b, a mod b), copied literally.' },
      ],
    },
  ],
  complexity: [
    h('Time'),
    p('**Naive:** the loop may run `min(a, b)` times → O(min(a, b)). For gcd(1 000 000 007, 1 000 000 000) that is up to a billion iterations.'),
    p('**Euclid:** look at two consecutive steps. Claim: a mod b < a/2 always.'),
    ul('If b ≤ a/2, then a mod b < b ≤ a/2.', 'If b > a/2, then a mod b = a − b < a/2.'),
    p('So every step the value in the "A" position is more than halved after two steps. A number can only be halved about log₂(n) times before it hits 0, so the loop runs at most about 2·log₂(min(a, b)) times.'),
    math('time = O(log min(a, b))      space = O(1) iterative, O(log min(a, b)) recursive (call stack)'),
    table(['Input', 'Naive iterations (worst)', 'Euclid steps'], [['gcd(50, 12)', '12', '2'], ['gcd(83, 19)', '19', '5'], ['gcd(1 000 000 007, 1 000 000 000)', '≈ 1 000 000 000', '≈ 6'], ['gcd(Fibonacci F₄₀, F₃₉)', '≈ 63 000 000', '38 (the worst case)']], 'The worst case for Euclid is two consecutive Fibonacci numbers (Lamé\'s theorem), and even that is only logarithmic.'),
    h('Naive vs optimized'),
    p('Both are correct. Euclid wins by a factor of up to **millions** on large inputs because every step throws away a big chunk of the problem instead of one candidate.'),
  ],
  mistakes: [
    {
      title: 'Overwriting a before using it',
      wrong: 'while (b != 0) {\n    a = b;\n    b = a % b;   // a was already replaced!\n}',
      why: 'After `a = b`, the expression `a % b` is `b % b` which is always 0, so the loop stops with the wrong answer.',
      fix: 'while (b != 0) {\n    int r = a % b;\n    a = b;\n    b = r;\n}',
    },
    {
      title: 'Forgetting the base case',
      wrong: 'static int gcd(int a, int b) {\n    return gcd(b, a % b);\n}',
      why: 'When b becomes 0, `a % 0` throws ArithmeticException ("/ by zero"). Recursion needs a stopping rule.',
      fix: 'static int gcd(int a, int b) {\n    if (b == 0) return a;\n    return gcd(b, a % b);\n}',
    },
    {
      title: 'LCM computed as a * b / gcd',
      wrong: 'int lcm = a * b / gcd(a, b);   // a * b can overflow int',
      why: 'For a = b = 100 000 the product 10 000 000 000 does not fit in an int, so the result is garbage.',
      fix: 'long lcm = (long) a / gcd(a, b) * b;   // divide first, then multiply',
    },
  ],
  practice: [
    {
      id: 'euclid-ex1',
      level: 'beginner',
      title: 'Reduce a fraction',
      statement: 'Read a numerator and a denominator (both positive). Print the fraction in lowest terms as `numerator/denominator`.',
      constraints: ['1 ≤ numerator, denominator ≤ 10⁹'],
      examples: [{ input: '12 18', output: '2/3', explain: 'gcd(12, 18) = 6; 12/6 = 2 and 18/6 = 3.' }],
      hints: ['What number can you divide BOTH parts by without leaving a remainder?', 'Use Euclid\'s algorithm for that number, then divide.'],
      solutionFile: 'euclid-gcd/Ex1.java',
      solutionExplain: 'Reduce by the gcd: dividing numerator and denominator by their greatest common divisor leaves no common factor, so the fraction is in lowest terms.',
      tests: [
        { stdin: '12 18\n', stdout: '2/3' },
        { stdin: '7 5\n', stdout: '7/5' },
        { stdin: '100 25\n', stdout: '4/1' },
      ],
    },
    {
      id: 'euclid-ex2',
      level: 'intermediate',
      title: 'LCM of a list',
      statement: 'Read n and then n positive integers. Print their least common multiple. The answer fits in a `long`.',
      constraints: ['1 ≤ n ≤ 20', '1 ≤ each number ≤ 10⁶', 'answer ≤ 9·10¹⁸'],
      examples: [{ input: '3\n4 6 8', output: '24' }],
      hints: ['lcm(a, b) = a / gcd(a, b) * b.', 'Fold the list: lcm = lcm(lcm, next).', 'Use long and divide before multiplying.'],
      solutionFile: 'euclid-gcd/Ex2.java',
      solutionExplain: 'The LCM of a list is built one number at a time with lcm(x, y) = x / gcd(x, y) · y. Dividing first keeps intermediate values as small as possible.',
      tests: [
        { stdin: '3\n4 6 8\n', stdout: '24' },
        { stdin: '2\n7 13\n', stdout: '91' },
        { stdin: '4\n1 2 3 4\n', stdout: '12' },
      ],
    },
    {
      id: 'euclid-ex3',
      level: 'challenge',
      title: 'Modular inverse',
      statement: 'Given a and m, print the number x in [0, m−1] such that (a · x) mod m = 1, or -1 if no such x exists.',
      constraints: ['1 ≤ a, m ≤ 10⁹', 'm ≥ 2'],
      examples: [{ input: '3 11', output: '4', explain: '3 × 4 = 12 and 12 mod 11 = 1.' }, { input: '6 9', output: '-1', explain: 'gcd(6, 9) = 3 ≠ 1 so no inverse exists.' }],
      hints: ['An inverse exists exactly when gcd(a, m) = 1.', 'Extended Euclid finds x and y with a·x + m·y = gcd(a, m). Then x is the inverse.', 'The x it returns can be negative — shift it into [0, m−1] with ((x % m) + m) % m.'],
      solutionFile: 'euclid-gcd/Ex3.java',
      solutionExplain: 'Extended Euclid carries two extra numbers back up the recursion so that a·x + b·y = gcd(a, b) holds at every level. When the gcd is 1, a·x ≡ 1 (mod m), so x is the inverse.',
      tests: [
        { stdin: '3 11\n', stdout: '4' },
        { stdin: '10 17\n', stdout: '12' },
        { stdin: '6 9\n', stdout: '-1' },
      ],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'What is gcd(48, 18)?', options: ['3', '6', '9', '12'], answer: 1, explain: '48 = 2·18 + 12, 18 = 1·12 + 6, 12 = 2·6 + 0 → gcd = 6.' },
    { type: 'output', q: 'What does this program print?', code: 'int a = 84, b = 36;\nwhile (b != 0) {\n    int t = a % b;\n    a = b;\n    b = t;\n}\nSystem.out.println(a);', answer: '12', explain: '84 mod 36 = 12 → (36, 12); 36 mod 12 = 0 → (12, 0). a = 12.' },
    { type: 'bug', q: 'Which line makes this gcd method return the wrong answer?', code: 'static int gcd(int a, int b) {\n    while (b != 0) {\n        a = b;\n        b = a % b;\n    }\n    return a;\n}', answerLine: 4, explain: 'Line 4 runs after a was overwritten, so `a % b` is `b % b` = 0. Save the remainder first.' },
    { type: 'fill', q: 'Complete the recursive base case and recursive call.', template: 'static int gcd(int a, int b) {\n    if (b == ___) return ___;\n    return gcd(___, a % b);\n}', blanks: [['0'], ['a'], ['b']], explain: 'gcd(a, 0) = a, otherwise gcd(a, b) = gcd(b, a mod b).' },
    { type: 'mcq', q: 'What is the running time of Euclid\'s algorithm for gcd(a, b)?', kind: 'complexity', options: ['O(min(a, b))', 'O(log min(a, b))', 'O(a + b)', 'O(1)'], answer: 1, explain: 'The remainder is more than halved every two steps, so only about 2·log₂(min) steps are needed.' },
    { type: 'trace', q: 'Trace Euclid\'s algorithm for (a, b) = (50, 12).', code: 'while (b != 0) {\n    int r = a % b;\n    a = b;\n    b = r;\n}', items: [{ prompt: 'a after iteration 1', answer: '12' }, { prompt: 'b after iteration 1', answer: '2' }, { prompt: 'b after iteration 2', answer: '0' }, { prompt: 'final a', answer: '2' }], explain: '(50, 12) → (12, 2) → (2, 0). The answer is the last a.' },
  ],
  interview: [
    'Prove that gcd(a, b) = gcd(b, a mod b).',
    'What is the worst-case input for Euclid\'s algorithm and why?',
    'How do you compute the GCD of an array of n numbers? What is the total cost?',
    'How is the LCM related to the GCD, and how do you avoid overflow when computing it?',
    'What does the extended Euclidean algorithm compute and where is it used?',
  ],
  videos: ['a-euclid-gcd', 'a-euclid-gcd#2'],
  revision: [
    'gcd(a, b) = gcd(b, a mod b);  gcd(a, 0) = a.',
    'Loop: r = a % b; a = b; b = r; stop when b == 0, answer is a.',
    'Time O(log min(a, b)); naive is O(min(a, b)).',
    'lcm(a, b) = a / gcd(a, b) * b  (divide first to avoid overflow).',
    'Worst case: consecutive Fibonacci numbers.',
  ],
  sourceNotes: {
    discrepancies: [
      'The slide pseudocode states the prerequisite "a > b". It is not needed: if a < b the first step swaps them (gcd(12, 50) → gcd(50, 12)).',
    ],
  },
});
