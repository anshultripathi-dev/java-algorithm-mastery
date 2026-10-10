import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

// ───────────────────────────── Grid paths ("Maneuvering") ─────────────────────────────
export const gridPaths: Lesson = lesson({
  id: 'a-maneuvering',
  module: 'm5',
  title: 'Maneuvering (Counting Grid Paths)',
  summary: 'Count the right/down paths across a grid — recursion, then dynamic programming, then a combinatorics formula.',
  level: 'intermediate',
  track: 'archive',
  minutes: 45,
  essential: true,
  prerequisites: ['m2-recursion', 'm2-arrays-2d', 'a-combination'],
  sources: ['Maneuvering'],
  objectives: [
    'Set up the recurrence paths(m, n) = paths(m−1, n) + paths(m, n−1).',
    'Show why plain recursion is exponential (it recomputes the same cells).',
    'Fill a table bottom-up (dynamic programming) in O(m·n).',
    'Obtain the closed form C(m+n−2, m−1) and handle obstacles.',
  ],
  intuition: [
    p('You stand in the top-left cell of an m × n grid and want to reach the bottom-right cell moving only **right** or **down**. How many different paths exist? For a 2 × 2 grid there are 2; for 3 × 3 there are 6.'),
    p('Think about the **last** move. You entered the destination from the cell above or from the cell to the left. So `paths(m, n) = paths(m−1, n) + paths(m, n−1)`. A single row or column has exactly one path.'),
    pre(`
 3×3 grid: paths into each cell
   1  1  1
   1  2  3
   1  3  6     → 6 paths to the bottom-right
`),
    why('The recursive code asks for the same sub-grids again and again: paths(2, 2) is needed by both paths(2, 3) and paths(3, 2). The number of calls roughly doubles with every step → exponential. **Dynamic programming** just stores each answer in a table the first time it is computed. The closed form comes from counting arrangements: every path is a sequence of (m−1) downs and (n−1) rights, so choose which of the m+n−2 moves are downs: C(m+n−2, m−1).'),
  ],
  syntax: [
    code(`
long[][] dp = new long[m][n];                        // dp[i][j] = number of paths to cell (i, j)
for (int i = 0; i < m; i++) dp[i][0] = 1;
for (int j = 0; j < n; j++) dp[0][j] = 1;
for (int i = 1; i < m; i++)
    for (int j = 1; j < n; j++) dp[i][j] = dp[i - 1][j] + dp[i][j - 1];

static long paths(int r, int c) {                    // plain recursion (exponential): same recurrence
    if (r == 0 || c == 0) return 1;
    return paths(r - 1, c) + paths(r, c - 1);
}
`),
  ],
  tiny: [code(`
static int paths(int m, int n) {
    if (m == 1 || n == 1) return 1;
    return paths(m - 1, n) + paths(m, n - 1);
}
`)],
  guided: [
    p('The lecture trace for `numberOfPaths(3, 3)` is exactly the call tree; the recursive program below also counts the calls (11 for a 3 × 3 grid) so you can see the growth.'),
    note('The commented line `// + numberOfPaths(m-1, n-1)` on the slide adds the diagonal move; the numbers that result are the **Delannoy numbers**.'),
    prog('maneuvering/PathsRecursive.java', 'Recursion (lecture version) with a call counter'),
    prog('maneuvering/PathsDP.java', 'Dynamic programming table'),
    prog('maneuvering/PathsFormula.java', 'Closed form C(m+n−2, m−1)'),
  ],
  dryRun: { algo: 'paths', input: { m: '4', n: '5' }, caption: 'Each cell holds the number of paths that reach it.' },
  programs: [
    {
      file: 'maneuvering/PathsRecursive.java',
      title: 'Recursive path counting',
      role: 'archive-original',
      description: 'Direct translation of the recurrence. Exponential time.',
      walkthrough: [
        { at: 'static long calls = 0;', text: 'A counter to expose the amount of repeated work.' },
        { at: 'if (m == 1 || n == 1)', text: 'Base case: one row or one column — a single straight path.' },
        { at: 'return numberOfPaths(m - 1, n) + numberOfPaths(m, n - 1);', text: 'Arrive from above, or from the left. Add the two counts.' },
      ],
    },
    {
      file: 'maneuvering/PathsDP.java',
      title: 'Bottom-up table',
      role: 'optimized',
      description: 'dp[i][j] = dp[i−1][j] + dp[i][j−1]. O(m·n) time and space (O(n) with a single row).',
      walkthrough: [
        { at: 'if (i == 0 || j == 0)', text: 'First row and first column: exactly one way to reach each.' },
        { at: 'dp[i][j] = dp[i - 1][j] + dp[i][j - 1];', text: 'The same recurrence, but both terms are already computed.' },
        { at: 'return dp[m - 1][n - 1];', text: 'The bottom-right cell is the answer.' },
      ],
    },
    {
      file: 'maneuvering/PathsFormula.java',
      title: 'Closed form',
      role: 'optimized',
      description: 'C(m+n−2, m−1) with the multiply-then-divide loop from the Combination lesson. O(min(m, n)) time, O(1) space.',
      walkthrough: [
        { at: 'int total = m + n - 2;', text: 'Total number of moves in any path.' },
        { at: 'int k = Math.min(m - 1, n - 1);', text: 'C(total, k) = C(total, total − k): use the smaller side.' },
        { at: 'result = result * (total - k + i) / i;', text: 'Exact at every step (see the Combination lesson).' },
      ],
    },
  ],
  complexity: [
    p('**Recursion:** T(m, n) = T(m−1, n) + T(m, n−1) + 1 → about C(m+n−2, m−1) leaf calls — **exponential** (for 18 × 18 it is over 2 billion calls).'),
    p('**DP:** every cell once → **O(m·n)** time, O(m·n) space (reducible to O(n)).'),
    p('**Formula:** O(min(m, n)).'),
    table(['grid', 'paths', 'recursive calls'], [['3 × 3', '6', '11'], ['10 × 10', '48 620', '97 239'], ['18 × 18', '2 333 606 220', '≈ 4.7 billion']]),
  ],
  mistakes: [
    { title: 'int overflow of the count', wrong: 'int paths = ...;   // 18 x 18 grid', why: '2 333 606 220 > 2 147 483 647 — the result wraps to a negative number.', fix: 'long (or BigInteger / modulus when the problem asks for it)' },
    { title: 'Confusing grid size with number of moves', wrong: 'C(m + n, m)', why: 'An m × n grid of CELLS needs m−1 downs and n−1 rights: C(m+n−2, m−1).', fix: 'total moves = m + n − 2' },
    { title: 'Blocked cells treated as 1', wrong: 'dp[i][j] = (i == 0 || j == 0) ? 1 : ...   // with obstacles', why: 'In the first row, a blocked cell cuts off every cell to its right; setting them all to 1 overcounts.', fix: 'dp[i][j] = blocked ? 0 : (from above + from left), with dp[0][0] = 1' },
  ],
  practice: [
    {
      id: 'path-ex1',
      level: 'beginner',
      title: 'Paths in a rectangle',
      statement: 'Read m and n and print the number of right/down paths from the top-left to the bottom-right of an m × n grid.',
      constraints: ['1 ≤ m, n ≤ 18'],
      examples: [{ input: '3 7', output: '28' }],
      hints: ['dp table with first row and column set to 1.'],
      solutionFile: 'maneuvering/Ex1.java',
      solutionExplain: 'Bottom-up DP with long values.',
      tests: [{ stdin: '3 7\n', stdout: '28' }, { stdin: '1 5\n', stdout: '1' }, { stdin: '18 18\n', stdout: '2333606220' }],
    },
    {
      id: 'path-ex2',
      level: 'intermediate',
      title: 'Paths with obstacles',
      statement: 'Read R, C and a grid of 0 (free) and 1 (blocked). Print the number of right/down paths from (0,0) to (R−1,C−1) that avoid blocked cells (0 if the start or end is blocked).',
      constraints: ['1 ≤ R, C ≤ 100', 'the answer fits in a long'],
      examples: [{ input: '3 3\n0 0 0\n0 1 0\n0 0 0', output: '2' }],
      hints: ['A blocked cell contributes 0.', 'dp[0][0] = 1 only if the start is free.'],
      solutionFile: 'maneuvering/Ex2.java',
      solutionExplain: 'Same recurrence; blocked cells are forced to 0 so no path goes through them.',
      tests: [{ stdin: '3 3\n0 0 0\n0 1 0\n0 0 0\n', stdout: '2' }, { stdin: '2 2\n0 1\n1 0\n', stdout: '0' }, { stdin: '1 1\n0\n', stdout: '1' }],
    },
    {
      id: 'path-ex3',
      level: 'challenge',
      title: 'Huge grid modulo a prime',
      statement: 'Read m and n (≤ 100 000). Print the number of paths modulo 1 000 000 007.',
      examples: [{ input: '3 7', output: '28' }],
      hints: ['A DP table of 10¹⁰ cells is impossible — use C(m+n−2, m−1).', 'Precompute factorials mod p and use a modular inverse (Fermat: a^(p−2)).'],
      solutionFile: 'maneuvering/Ex3.java',
      solutionExplain: 'nCr mod p = n! · inverse(r!) · inverse((n−r)!) mod p, with the inverse by fast exponentiation.',
      tests: [{ stdin: '3 7\n', stdout: '28' }, { stdin: '1 1\n', stdout: '1' }, { stdin: '100000 100000\n', stdout: '691090292' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Number of right/down paths in a 4 × 4 grid of cells?', options: ['12', '20', '24', '70'], answer: 1, explain: 'C(6, 3) = 20.' },
    { type: 'output', q: 'How many paths does this return?', code: 'int[][] dp = new int[3][3];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        dp[i][j] = (i == 0 || j == 0) ? 1 : dp[i-1][j] + dp[i][j-1];\nSystem.out.println(dp[2][2]);', answer: '6', explain: 'Rows: 1 1 1 / 1 2 3 / 1 3 6.' },
    { type: 'mcq', q: 'Why is the recursive solution slow?', options: ['Java recursion is slow', 'It recomputes the same sub-grids many times', 'The base case is wrong', 'Arrays are slow'], answer: 1, explain: 'Overlapping sub-problems → exponential calls.' },
    { type: 'mcq', q: 'Time complexity of the DP table solution?', kind: 'complexity', options: ['O(m + n)', 'O(m·n)', 'O(2^(m+n))', 'O(log n)'], answer: 1, explain: 'Each cell is filled once.' },
  ],
  interview: ['Explain overlapping sub-problems using this example.', 'Reduce the DP space to O(n).', 'Count paths with obstacles; with diagonal moves.', 'Why is the answer a binomial coefficient?'],
  videos: ['a-maneuvering', 'a-maneuvering#2'],
  revision: ['paths(m, n) = paths(m−1, n) + paths(m, n−1); first row/col = 1.', 'Recursion is exponential; DP is O(m·n).', 'Closed form: C(m+n−2, m−1).', 'Obstacle ⇒ 0; use long / modulus.'],
  sourceNotes: {
    discrepancies: ['The slide says the problem is "Maneuvering a Cave"; the deck contains only the grid-path recurrence (a classic problem). Its trace of numberOfPaths(3, 3) is correct and ends at 6.', 'The slide mentions "already calculated" for numberOfPaths(2, 2) — the plain recursive code does NOT cache; the second call is recomputed (that is the inefficiency this lesson addresses).'],
  },
});

// ───────────────────────────── Sorted unique permutations ─────────────────────────────
export const permutations: Lesson = lesson({
  id: 'a-sorted-permutations',
  module: 'm5',
  title: 'Sorted Distinct Permutations',
  summary: 'Print every distinct permutation of a string with duplicates, in alphabetical order.',
  level: 'intermediate',
  track: 'archive',
  minutes: 50,
  essential: false,
  prerequisites: ['m2-recursion', 'm2-strings', 'a-combination'],
  sources: ['Sorted-Unique-Permutation'],
  objectives: [
    'Count distinct permutations of a multiset: n! / (c₁!·c₂!·…).',
    'Generate them in sorted order with the next-permutation algorithm.',
    'Generate them in sorted order with count-based backtracking.',
    'Recognise that the slide\'s swap-based generator does not produce sorted output.',
  ],
  intuition: [
    p('The string `AAB` has 3! = 6 arrangements, but only 3 are different: `AAB`, `ABA`, `BAA`. In general the number of **distinct** permutations is `n! / (c₁! · c₂! · …)` where cᵢ is how often each letter occurs (the slide: "geeks" has 5!/2! = 60).'),
    p('We want them **sorted** (dictionary order). Two reliable ways:'),
    ol('**Next permutation.** Start from the sorted string and repeatedly turn the current arrangement into the next larger one: find the rightmost position that can still grow, swap in the smallest larger letter to its right, and reverse the tail.', '**Counting backtracking.** Keep how many copies of each letter are left. At every position try the letters in alphabetical order (each distinct letter once, if copies remain) and recurse. Duplicates are never generated and the order is automatically sorted.'),
    pre(`
ABC → ACB → BAC → BCA → CAB → CBA          (next-permutation order)
`),
    why('Next-permutation works because the suffix to the right of the pivot is in descending order — the largest arrangement of those letters. To get the next larger permutation you must raise the pivot by the smallest possible amount and then make the suffix as small as possible (ascending, i.e. reversed).'),
  ],
  syntax: [
    code(`
char[] c = s.toCharArray();
Arrays.sort(c);                                      // start from the smallest arrangement
String again = new String(c);                        // char[] back to String
boolean[] used = new boolean[c.length];              // backtracking: which letters are taken
static void swap(char[] c, int i, int j) { char t = c[i]; c[i] = c[j]; c[j] = t; }
Set<Character> seen = new HashSet<>();               // skip repeated letters at one position
if (!seen.add(c[i])) continue;                       // add() returns false when already present
`),
  ],
  tiny: [code(`
int i = a.length - 2;
while (i >= 0 && a[i] >= a[i + 1]) i--;   // pivot: first place from the right that is smaller than its successor
`)],
  guided: [
    prog('permutations/NextPermutation.java', 'Next permutation until none is left'),
    prog('permutations/PermutationsBacktrack.java', 'Backtracking over letter counts'),
    prog('permutations/SwapBasedPermutations.java', 'The lecture program: distinct but NOT sorted'),
    warn('Run `SwapBasedPermutations` with input `BAC`: it prints `ABC ACB BAC BCA CBA CAB` — the last two are out of order (CAB must precede CBA). The swap-and-restore technique generates every permutation exactly once, but not in dictionary order, even if the input was sorted first.', 'The slide code does not sort its output'),
  ],
  dryRun: { algo: 'permutations', input: { s: 'AAB' }, caption: 'Successive next-permutation steps.' },
  programs: [
    {
      file: 'permutations/NextPermutation.java',
      title: 'Next lexicographic permutation',
      role: 'optimized',
      description: 'The classic 4-step algorithm; O(n) per permutation, O(1) space.',
      walkthrough: [
        { at: 'while (i >= 0 && a[i] >= a[i + 1])', text: '1. Find the pivot: the rightmost i with a[i] < a[i+1]. Everything right of it is non-increasing.' },
        { at: 'while (a[j] <= a[i])', text: '2. Find the smallest letter in the suffix that is larger than the pivot (the suffix is descending, so scan from the right).' },
        { at: 'a[i] = a[j];', text: '3. Swap pivot and that letter.' },
        { at: 'for (int l = i + 1, r = a.length - 1; l < r; l++, r--)', text: '4. The suffix is still descending: reverse it to ascending to make it the smallest tail.' },
        { at: 'Arrays.sort(a);', text: 'Starting from the sorted string guarantees we enumerate ALL arrangements, in order.' },
      ],
    },
    {
      file: 'permutations/PermutationsBacktrack.java',
      title: 'Counting backtracking',
      role: 'optimized',
      description: 'Recursion over a counts array: sorted order and no duplicates by construction.',
      walkthrough: [
        { at: 'if (counts[c] == 0)', text: 'Skip letters with no copies left.' },
        { at: 'counts[c]--;', text: 'Choose: use one copy of letter c.' },
        { at: 'build(counts, current, pos + 1);', text: 'Explore the remaining positions.' },
        { at: 'counts[c]++;', text: 'Un-choose: put the letter back so another branch can use it.' },
      ],
    },
    {
      file: 'permutations/SwapBasedPermutations.java',
      title: 'Lecture program (swap-based)',
      role: 'archive-original',
      description: 'HashSet per level avoids duplicate letters; swapping makes the order non-lexicographic.',
      walkthrough: [
        { at: 'Set<Character> used = new HashSet<>();', text: 'Letters already tried at this position — prevents duplicate permutations.' },
        { at: 'swap(chars, index, i);', text: 'Bring chars[i] to the current position.' },
        { at: '24', text: 'Swap back to restore the array — but the restored order is not the same as the sorted order for the next branch, which is why output is not sorted.' },
      ],
    },
  ],
  complexity: [
    p('There are up to n! permutations, each taking O(n) to print, so any algorithm is **Ω(n · n!/(Πcᵢ!))** — factorial in the worst case. Next-permutation uses O(1) extra space; backtracking uses O(n) for the recursion stack and the counts.'),
    p('For n = 10 distinct letters: 3 628 800 permutations — fine. For n = 13 it is 6.2 × 10⁹ — too many to print.'),
  ],
  mistakes: [
    { title: 'Assuming swap-based recursion is sorted', wrong: 'Arrays.sort(chars); permute(chars, 0);   // slide', why: 'After swap/restore operations the remaining letters are no longer in sorted order. For "ABC" it prints CBA before CAB.', fix: 'Use next-permutation or count-based backtracking, or sort the final list.' },
    { title: 'Duplicates from repeated letters', wrong: 'for (int i = index; i < n; i++) { swap; recurse; swap; }   // no used-set', why: '"AAB" produces 6 outputs with repeats.', fix: 'Skip a letter if it was already tried at this position (set/counts).' },
    { title: 'Not resetting the counts', wrong: 'counts[c]--; build(...);   // missing counts[c]++', why: 'Later branches see too few letters and never complete.', fix: 'Always undo the choice after the recursive call.' },
  ],
  practice: [
    {
      id: 'perm-ex1',
      level: 'beginner',
      title: 'How many distinct permutations?',
      statement: 'Read a word (≤ 20 letters). Print the number of distinct permutations.',
      examples: [{ input: 'AAB', output: '3' }],
      hints: ['n! divided by the factorial of every letter count.', 'long is enough for n ≤ 20.'],
      solutionFile: 'permutations/Ex1.java',
      solutionExplain: 'Multinomial coefficient from letter counts.',
      tests: [{ stdin: 'AAB\n', stdout: '3' }, { stdin: 'ABCD\n', stdout: '24' }, { stdin: 'AAAA\n', stdout: '1' }, { stdin: 'geeks\n', stdout: '60' }],
    },
    {
      id: 'perm-ex2',
      level: 'intermediate',
      title: 'Print them sorted',
      statement: 'Read a word (≤ 8 letters). Print every distinct permutation, one per line, in alphabetical order.',
      examples: [{ input: 'ABA', output: 'AAB\nABA\nBAA' }],
      hints: ['Counts array over the 256 characters.', 'Try letters in increasing order.'],
      solutionFile: 'permutations/Ex2.java',
      solutionExplain: 'Count-based backtracking enumerates in sorted order without duplicates.',
      tests: [{ stdin: 'ABA\n', stdout: 'AAB\nABA\nBAA' }, { stdin: 'BAC\n', stdout: 'ABC\nACB\nBAC\nBCA\nCAB\nCBA' }, { stdin: 'X\n', stdout: 'X' }],
    },
    {
      id: 'perm-ex3',
      level: 'challenge',
      title: 'The k-th permutation',
      statement: 'Read a word (≤ 15 letters) and k. Print the k-th distinct permutation in sorted order (1-based) WITHOUT generating the others, or `NONE` if k is too large.',
      examples: [{ input: 'DBCA 10', output: 'BCDA' }],
      hints: ['At each position, for each letter, count how many permutations start with it: arrangements of the remaining multiset.', 'If k ≤ that count, take the letter; otherwise subtract and continue.'],
      solutionFile: 'permutations/Ex3.java',
      solutionExplain: 'Ranking via multinomial counts: O(n · σ) instead of enumerating up to n! permutations.',
      tests: [{ stdin: 'DBCA 10\n', stdout: 'BCDA' }, { stdin: 'AAB 3\n', stdout: 'BAA' }, { stdin: 'AB 3\n', stdout: 'NONE' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'How many distinct permutations does "AABB" have?', options: ['4', '6', '12', '24'], answer: 1, explain: '4!/(2!·2!) = 6.' },
    { type: 'output', q: 'What follows "ACB" in lexicographic order of "ABC"?', code: '// permutations of A, B, C', answer: 'BAC', explain: 'Pivot is A (A < C); smallest larger letter to its right is B; swap → BCA, reverse the tail "CA" → "AC" → BAC.' },
    { type: 'mcq', q: 'Which statement about the slide\'s swap-based generator is true?', options: ['It prints duplicates', 'It prints every distinct permutation once, but not in sorted order', 'It prints sorted output', 'It never terminates'], answer: 1, explain: 'The HashSet prevents duplicates; swapping disturbs the order.' },
    { type: 'mcq', q: 'Time to print all permutations of 8 distinct letters is…', kind: 'complexity', options: ['O(8)', 'O(8²)', 'O(8·8!)', 'O(2⁸)'], answer: 2, explain: '8! permutations × O(8) to build/print each.' },
  ],
  interview: ['Generate all distinct permutations with duplicates.', 'Explain next-permutation in 4 steps.', 'Find the k-th permutation without enumerating.', 'Why is the lecture\'s "sort first" insufficient?'],
  videos: ['a-sorted-permutations', 'a-sorted-permutations#2'],
  revision: ['Distinct permutations = n! / Π(cᵢ!).', 'Next permutation: pivot, swap with next larger on the right, reverse suffix.', 'Count-based backtracking: letters in alphabetical order, choose/explore/un-choose.', 'Swap-based generation is NOT lexicographic.'],
  sourceNotes: {
    discrepancies: ['The slide claims its program prints distinct permutations "in sorted order". Running it on "BAC" prints ABC ACB BAC BCA CBA CAB, which is not sorted. The slide\'s own "Steps" (sort, count permutations, then find the next greater string repeatedly) describe the NEXT-PERMUTATION method, which IS sorted — this is what `NextPermutation.java` implements.', 'The slide\'s example output for "DBCA" lists the 24 sorted permutations (correct).'],
  },
});

// ───────────────────────────── N-Queens ─────────────────────────────
export const nQueens: Lesson = lesson({
  id: 'a-n-queens',
  module: 'm5',
  title: 'N-Queens (Backtracking)',
  summary: 'Place N queens on an N × N board so that none attack each other — the textbook backtracking problem.',
  level: 'advanced',
  track: 'archive',
  minutes: 60,
  essential: true,
  prerequisites: ['m2-recursion', 'm2-arrays-2d', 'm4-paradigms'],
  sources: ['N-Queens'],
  objectives: [
    'Explain what a queen attacks and why at most one queen fits in each row, column and diagonal.',
    'Describe backtracking as "choose, explore, un-choose" and trace it on the 4-queens board.',
    'Write isSafe and the recursive row-by-row solver, then speed up the safety test with three boolean arrays.',
    'Count solutions for N up to 10 and state the complexity honestly.',
  ],
  intuition: [
    p('A chess **queen** attacks along its row, its column and both diagonals. N-Queens asks for N queens on an N × N board with **no two attacking each other**. For N = 4 there are exactly 2 solutions; for N = 8 there are 92.'),
    p('Because two queens in the same row attack each other, a solution has **exactly one queen per row**. So we place queens row by row: for row 0 try column 0; if that is safe go to row 1 and try its columns; if some row has **no** safe column, we made a bad choice earlier — **backtrack**: undo the previous queen and try its next column.'),
    pre(`
N = 4 (row by row)
row 0:  Q . . .        row 1: cols 0,1 attacked → Q at col 2:  . . Q .
row 2:  every column attacked → dead end → BACKTRACK to row 1 → try col 3 ...
...eventually:   . Q . .
                 . . . Q
                 Q . . .
                 . . Q .
`),
    why('Backtracking explores a tree of partial placements but **prunes** every branch as soon as it breaks a rule, instead of building all N^N full boards and checking them. The key to correctness is **un-choosing**: after the recursive call returns without success, the queen must be removed so the board is exactly as before and the next column can be tried. The key to speed is the early rejection.'),
  ],
  syntax: [
    code(`
int[] col = new int[n];                              // col[row] = column of the queen in that row
boolean[] cols  = new boolean[n];                    // column used?
boolean[] diag1 = new boolean[2 * n - 1];            // "/" diagonals:  row + col
boolean[] diag2 = new boolean[2 * n - 1];            // "\" diagonals:  row - col + n - 1
if (cols[c] || diag1[r + c] || diag2[r - c + n - 1]) continue;     // attacked: prune
cols[c] = diag1[r + c] = diag2[r - c + n - 1] = true;              // place
solve(r + 1);
cols[c] = diag1[r + c] = diag2[r - c + n - 1] = false;             // remove (backtrack)
`),
  ],
  tiny: [code(`
// safe if no earlier row has a queen in the same column or on a diagonal
for (int r = 0; r < row; r++) {
    if (queenCol[r] == col || Math.abs(queenCol[r] - col) == row - r) return false;
}
return true;
`, 'Two queens on the same diagonal satisfy |Δrow| = |Δcol|.')],
  guided: [
    prog('n-queens/NQueensFirst.java', 'First solution (board printed as 0/1 like the slide)'),
    prog('n-queens/NQueensCount.java', 'Count all solutions with O(1) conflict tests'),
    p('The slide fills the board column by column and prints `0 0 1 0 / 1 0 0 0 / 0 0 0 1 / 0 1 0 0`. Filling row by row finds the mirror-image solution `0 1 0 0 / 0 0 0 1 / 1 0 0 0 / 0 0 1 0`; both are valid because the 4-queens solutions are mirror images of each other.'),
  ],
  dryRun: { algo: 'nqueens', input: { n: '4' }, caption: 'Placing, rejecting and backtracking row by row for N = 4.' },
  programs: [
    {
      file: 'n-queens/NQueensFirst.java',
      title: 'First solution by backtracking',
      role: 'simple',
      description: 'Row-by-row search with a board scan for the safety test. Stops at the first solution.',
      walkthrough: [
        { at: 'static boolean isSafe(int row, int col)', text: 'Only rows ABOVE `row` can already hold queens, so only those need checking.' },
        { at: 'for (int r = row - 1, c = col - 1;', text: 'Walk up-left along the diagonal.' },
        { at: 'for (int r = row - 1, c = col + 1;', text: 'Walk up-right along the other diagonal.' },
        { at: 'if (row == n)', text: 'Base case: every row has a queen — success.' },
        { at: 'board[row][col] = 1;', text: 'CHOOSE: place a queen.' },
        { at: 'if (solve(row + 1))', text: 'EXPLORE: try to place the rest; propagate success upwards.' },
        { at: 'board[row][col] = 0;', text: 'UN-CHOOSE (backtrack): remove the queen and try the next column.' },
      ],
    },
    {
      file: 'n-queens/NQueensCount.java',
      title: 'Counting all solutions',
      role: 'optimized',
      description: 'Three boolean arrays make every safety test O(1). 92 solutions for N = 8.',
      walkthrough: [
        { at: 'static boolean[] diagDown;', text: 'Cells on the same "\\" diagonal share row − col; shifted by n−1 to be a valid index.' },
        { at: 'int d2 = row + col;', text: 'Cells on the same "/" diagonal share row + col.' },
        { at: 'column[col] = diagDown[d1] = diagUp[d2] = true;', text: 'Mark the three lines as occupied.' },
        { at: 'column[col] = diagDown[d1] = diagUp[d2] = false;', text: 'Free them again on the way back.' },
        { at: 'solutions++;', text: 'Do not stop at the first solution — keep exploring to count all of them.' },
      ],
    },
  ],
  complexity: [
    p('There are N^N ways to put one queen in each row; pruning shrinks that dramatically but the worst case is still exponential. The number of nodes visited grows roughly like N! (fewer in practice): N = 8 takes about 15 000 recursive calls; N = 12 about 10 million; N = 15 several billion.'),
    p('Time: **O(N!)** upper bound (honest worst case). Space: O(N) for the recursion and the three arrays (the slide\'s N×N board is O(N²)).'),
    table(['N', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], [['solutions', '1', '0', '0', '2', '10', '4', '40', '92', '352', '724']]),
  ],
  mistakes: [
    { title: 'Forgetting to un-place the queen', wrong: 'board[row][col] = 1;\nsolve(row + 1);   // no reset', why: 'Dead-end branches leave queens on the board, which then block valid placements, so correct solutions are missed.', fix: 'if (!solve(row + 1)) board[row][col] = 0;' },
    { title: 'Checking the wrong diagonal index', wrong: 'diagDown[row - col]   // negative index for col > row', why: 'row − col ranges from −(n−1) to n−1: negative indices crash.', fix: 'diagDown[row - col + n - 1]' },
    { title: 'Stopping at the first solution when counting', wrong: 'if (place(row + 1)) return true;   // in a counting program', why: 'The function returns as soon as one solution is found; the count is 1.', fix: 'Count in the base case and return nothing (void).' },
  ],
  practice: [
    {
      id: 'queen-ex1',
      level: 'beginner',
      title: 'Validate a placement',
      statement: 'Read n and then n integers: the column (1-based) of the queen in each row. Print VALID if no two queens attack each other, else INVALID.',
      examples: [{ input: '4\n2 4 1 3', output: 'VALID' }],
      hints: ['Same column, or |Δrow| == |Δcol|, means attack.'],
      solutionFile: 'n-queens/Ex1.java',
      solutionExplain: 'Check every pair of rows: equal columns or equal row and column distance mean attack.',
      tests: [{ stdin: '4\n2 4 1 3\n', stdout: 'VALID' }, { stdin: '4\n1 2 3 4\n', stdout: 'INVALID' }, { stdin: '1\n1\n', stdout: 'VALID' }],
    },
    {
      id: 'queen-ex2',
      level: 'intermediate',
      title: 'Count solutions',
      statement: 'Read N (1 ≤ N ≤ 10) and print the number of distinct ways to place N non-attacking queens.',
      examples: [{ input: '6', output: '4' }],
      hints: ['Row by row; three boolean arrays for column and diagonals.'],
      solutionFile: 'n-queens/Ex2.java',
      solutionExplain: 'Exhaustive backtracking with O(1) conflict checks.',
      tests: [{ stdin: '6\n', stdout: '4' }, { stdin: '8\n', stdout: '92' }, { stdin: '3\n', stdout: '0' }, { stdin: '1\n', stdout: '1' }],
    },
    {
      id: 'queen-ex3',
      level: 'challenge',
      title: 'Lexicographically first solution',
      statement: 'Read N (1 ≤ N ≤ 12). Print the solution that is smallest when read as the column of the queen in row 1, row 2, … (columns 1-based, separated by spaces), or NONE.',
      examples: [{ input: '8', output: '1 5 8 6 3 7 2 4' }],
      hints: ['Trying columns in increasing order and stopping at the first success gives the lexicographically first.'],
      solutionFile: 'n-queens/Ex3.java',
      solutionExplain: 'Depth-first search trying columns left to right returns the lexicographically smallest solution first.',
      tests: [{ stdin: '8\n', stdout: '1 5 8 6 3 7 2 4' }, { stdin: '4\n', stdout: '2 4 1 3' }, { stdin: '3\n', stdout: 'NONE' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'How many solutions does the 4-queens problem have?', options: ['1', '2', '4', '24'], answer: 1, explain: 'Two mirror-image solutions.' },
    { type: 'mcq', q: 'Two queens at (1, 2) and (3, 4) attack each other because…', options: ['same row', 'same column', 'same diagonal', 'they do not'], answer: 2, explain: '|Δrow| = |Δcol| = 2.' },
    { type: 'fill', q: 'Complete the backtracking step.', template: 'board[row][col] = 1;\nif (solve(row + 1)) return true;\nboard[row][col] = ___;', blanks: [['0']], explain: 'Remove the queen again (un-choose).' },
    { type: 'mcq', q: 'What does "backtracking" mean here?', options: ['Sorting the board', 'Undoing the last choice and trying the next option', 'Starting the whole search again', 'Reading the board backwards'], answer: 1, explain: 'Return to the previous decision and change it.' },
    { type: 'mcq', q: 'Which strategy fits "find all arrangements that satisfy constraints"?', kind: 'choose-algorithm', options: ['Greedy', 'Binary search', 'Backtracking', 'Sorting'], answer: 2, explain: 'Systematic search with pruning.' },
  ],
  interview: ['Why can you place exactly one queen per row?', 'How do you check diagonals in O(1)?', 'What is the complexity? Can you do better with bitmasks?', 'How many solutions are there for N = 8 and how many are distinct up to symmetry (12)?'],
  videos: ['a-n-queens', 'a-n-queens#2'],
  revision: ['One queen per row; try columns left→right.', 'choose → explore → un-choose.', 'Conflict: same column, or row − col equal, or row + col equal.', 'Counts: 1,0,0,2,10,4,40,92,352,724 for N = 1…10. O(N!) worst case.'],
  sourceNotes: {
    discrepancies: ['The slide fills the board column by column (`col`), so its printed solution is the transpose/mirror of the one a row-by-row search prints. Both are valid.', 'The slide says "queen can move any number of steps in any direction … can\'t change direction" and then lists only rows and columns; diagonals are an essential part of the attack rule.'],
  },
});

// ───────────────────────────── Maze solving ─────────────────────────────
export const maze: Lesson = lesson({
  id: 'a-maze-solving',
  module: 'm5',
  title: 'Maze Solving (Rat in a Maze)',
  summary: 'Find a path from the entry to the exit of a grid maze by depth-first backtracking, then the shortest path with BFS.',
  level: 'advanced',
  track: 'archive',
  minutes: 55,
  essential: true,
  prerequisites: ['m2-recursion', 'm2-arrays-2d', 'a-n-queens'],
  sources: ['Maze-Solving'],
  objectives: [
    'Model a maze as a 2-D array and neighbours as direction offsets.',
    'Write a recursive depth-first search that marks the solution path and backtracks from dead ends.',
    'Explain why a `visited` array is required when moves may go back.',
    'Use a queue (BFS) to find the shortest route.',
  ],
  intuition: [
    p('A maze is a grid of **walls** and **open cells** with one entry and one exit. The slide encodes it as: `0` road, `1` wall, `2` entry, `3` exit, `4` a cell on the path that the algorithm found. A rat enters at the entry and tries to reach the exit.'),
    p('**Depth-first search with backtracking** is how you would explore a maze with chalk: walk forward, mark where you have been, and if you reach a dead end, walk back and try the next turn.'),
    pre(`
 2 0 0 1 0          2 4 4 1 0     (4 = the path found)
 1 1 0 1 0    →     1 1 4 1 0
 0 0 0 0 0          4 4 4 0 0
 0 1 1 1 1          4 1 1 1 1
 0 0 0 0 3          4 4 4 4 3
`),
    why('A cell is on a path to the exit if it is the exit, or if at least one of its neighbours leads to the exit. The recursion asks exactly that: `dfs(cell)` returns true if the exit is reachable from here without revisiting cells. The `visited` array turns an endless walk in circles into a finite search; marking the successful route only on the way **back** (when `dfs` returns true) means dead-end explorations leave no trace in the final path.'),
    p('Depth-first search finds *a* path, not necessarily the shortest one. **Breadth-first search** (BFS) explores the maze in rings of increasing distance using a queue, so the first time it reaches the exit it has found a shortest route.'),
  ],
  syntax: [
    code(`
int[] dr = {1, 0, -1, 0};   // down, right, up, left
int[] dc = {0, 1, 0, -1};
for (int d = 0; d < 4; d++) {
    int nr = r + dr[d], nc = c + dc[d];
}
`, 'Direction arrays replace four copies of nearly identical code.'),
  ],
  tiny: [code(`
static boolean isSafe(int[][] maze, int x, int y) {
    return x >= 0 && x < N && y >= 0 && y < N && maze[x][y] == 1;
}
`)],
  guided: [
    prog('maze/RatMazeDownRight.java', 'The lecture program: moves only DOWN and RIGHT in a 4×4 maze (1 = open)'),
    prog('maze/MazeSolver.java', 'General solver using the 0/1/2/3/4 model: 4 directions, visited array'),
    note('The slide shows the 4×4 maze with 1 = path in the code but describes the model 0 = road, 1 = wall in the text. The two programs above keep each convention explicit; mixing them is the most common bug when adapting this code.'),
  ],
  dryRun: { algo: 'maze', input: { grid: '1000,1101,0100,1111' }, caption: 'The rat explores down first, then right, marking and un-marking cells.' },
  programs: [
    {
      file: 'maze/RatMazeDownRight.java',
      title: 'Rat in a maze (down/right only)',
      role: 'archive-original',
      description: 'The lecture\'s recursive backtracker. `sol` marks the path; dead ends are unmarked.',
      walkthrough: [
        { at: 'return x >= 0 && x < N && y >= 0 && y < N && maze[x][y] == 1;', text: 'Safe = inside the grid AND an open cell. Bounds are checked first so the array access cannot fail.' },
        { at: 'if (x == N - 1 && y == N - 1)', text: 'Reached the bottom-right exit: mark it and succeed.' },
        { at: 'sol[x][y] = 1;', text: 'Tentatively mark this cell as part of the path.' },
        { at: 'if (solve(maze, x + 1, y, sol)) return true;', text: 'Try moving down first…' },
        { at: 'if (solve(maze, x, y + 1, sol)) return true;', text: '…then right.' },
        { at: 'sol[x][y] = 0;', text: 'Both failed: this cell is a dead end. Un-mark it and return false so the caller tries its next option.' },
      ],
    },
    {
      file: 'maze/MazeSolver.java',
      title: 'General maze solver (4 directions)',
      role: 'optimized',
      description: 'Depth-first search with a visited array; reads the maze from standard input; marks the route with 4.',
      walkthrough: [
        { at: 'static final int[] DR = {1, 0, -1, 0};', text: 'Four neighbours as offset arrays.' },
        { at: 'visited[r][c] = true;', text: 'Never enter a cell twice — otherwise moving up/left would loop forever.' },
        { at: 'if (g[r][c] == 3)', text: 'Exit cell: the base case.' },
        { at: 'if (dfs(r + DR[d], c + DC[d]))', text: 'Explore each neighbour; the first one that succeeds finishes the search.' },
        { at: 'if (g[r][c] == 0) g[r][c] = 4;', text: 'Mark the route only on the way back, and keep the entry (2) and exit (3) labels untouched.' },
      ],
    },
  ],
  complexity: [
    p('**DFS with a visited array:** each cell is entered at most once and examines 4 neighbours → **O(R·C) time**, O(R·C) space for `visited` plus the recursion stack (up to R·C deep).'),
    p('**Without a visited array** (down/right only) each cell is on a monotone path, so the search is still finite but can be exponential: O(2^(R+C)) in the worst case.'),
    p('**BFS:** O(R·C) time and space and it returns the shortest path length.'),
    warn('Recursion depth can reach R·C. For big mazes (1000 × 1000) use an explicit stack/queue to avoid StackOverflowError.'),
  ],
  mistakes: [
    { title: 'No visited array when moving in 4 directions', wrong: 'solve(x + 1, y) || solve(x, y + 1) || solve(x - 1, y) || solve(x, y - 1)', why: 'The rat steps right, then left, then right again … infinite recursion → StackOverflowError.', fix: 'Mark cells as visited before exploring neighbours.' },
    { title: 'Checking maze[x][y] before the bounds', wrong: 'maze[x][y] == 1 && x >= 0 && x < N', why: 'ArrayIndexOutOfBounds for x = −1 or x = N: the operands of && are evaluated left to right.', fix: 'Test the bounds first.' },
    { title: 'Marking the path on the way in', wrong: 'g[r][c] = 4; // before exploring neighbours', why: 'Dead-end cells stay marked as "path". Mark when dfs returns true, or un-mark on failure.', fix: 'mark after the successful recursive call (or reset on failure)' },
  ],
  practice: [
    {
      id: 'maze-ex1',
      level: 'beginner',
      title: 'How many cells can the rat reach?',
      statement: 'Read R, C and an R × C maze (0 road, 1 wall, 2 entry, 3 exit). Print the number of non-wall cells reachable from the entry by moving up, down, left or right (the entry itself counts).',
      examples: [{ input: '3 3\n2 0 1\n1 0 1\n1 0 3', output: '5' }],
      hints: ['Flood fill with recursion or a stack.', 'Mark cells visited.'],
      solutionFile: 'maze/Ex1.java',
      solutionExplain: 'A flood fill counts every cell entered by the DFS exactly once.',
      tests: [{ stdin: '3 3\n2 0 1\n1 0 1\n1 0 3\n', stdout: '5' }, { stdin: '1 3\n2 1 3\n', stdout: '1' }, { stdin: '2 2\n2 0\n0 3\n', stdout: '4' }],
    },
    {
      id: 'maze-ex2',
      level: 'intermediate',
      title: 'Is there a way out?',
      statement: 'Same input. Print YES if the exit can be reached from the entry, else NO.',
      examples: [{ input: '3 3\n2 1 3\n0 1 0\n0 0 0', output: 'YES' }],
      hints: ['DFS returning boolean.'],
      solutionFile: 'maze/Ex2.java',
      solutionExplain: 'Depth-first search with a visited array; true when the exit cell is reached.',
      tests: [{ stdin: '3 3\n2 1 3\n0 1 0\n0 0 0\n', stdout: 'YES' }, { stdin: '1 3\n2 1 3\n', stdout: 'NO' }, { stdin: '1 2\n2 3\n', stdout: 'YES' }],
    },
    {
      id: 'maze-ex3',
      level: 'challenge',
      title: 'Shortest path',
      statement: 'Same input. Print the minimum number of moves from the entry to the exit, or -1.',
      constraints: ['1 ≤ R, C ≤ 500'],
      examples: [{ input: '3 3\n2 0 0\n1 1 0\n3 0 0', output: '6' }],
      hints: ['Breadth-first search with a queue and a distance array.'],
      solutionFile: 'maze/Ex3.java',
      solutionExplain: 'BFS visits cells in order of distance; the first time the exit is dequeued its distance is minimal.',
      tests: [{ stdin: '3 3\n2 0 0\n1 1 0\n3 0 0\n', stdout: '6' }, { stdin: '1 3\n2 1 3\n', stdout: '-1' }, { stdin: '1 2\n2 3\n', stdout: '1' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Why does a 4-direction maze solver need a visited array?', options: ['To save memory', 'To avoid walking in circles forever', 'To count steps', 'To find the shortest path'], answer: 1, explain: 'Without it the search can bounce between two cells indefinitely.' },
    { type: 'mcq', q: 'Which algorithm guarantees the SHORTEST path in an unweighted maze?', kind: 'choose-algorithm', options: ['DFS', 'BFS', 'Binary search', 'Quick sort'], answer: 1, explain: 'BFS explores in rings of increasing distance.' },
    { type: 'mcq', q: 'What does `sol[x][y] = 0;` after both recursive calls do?', options: ['Mark success', 'Un-mark a dead-end cell (backtrack)', 'Reset the maze', 'Nothing'], answer: 1, explain: 'The cell is not on any path to the exit.' },
    { type: 'mcq', q: 'DFS on an R × C maze with a visited array runs in…', kind: 'complexity', options: ['O(R + C)', 'O(R·C)', 'O(2^(R·C))', 'O(R²·C²)'], answer: 1, explain: 'Each cell is expanded once.' },
  ],
  interview: ['DFS vs BFS for maze solving — when would you choose each?', 'How do you print the actual shortest path with BFS?', 'How would you avoid recursion depth problems?'],
  videos: ['a-maze-solving', 'a-maze-solving#2'],
  revision: ['Maze = grid; neighbours via dr/dc arrays; bounds before wall test.', 'DFS: visited, recurse, mark route when success returns true, backtrack on failure.', 'BFS (queue) = shortest path.', 'O(R·C).'],
  sourceNotes: {
    discrepancies: ['The slide models the maze as 0 road / 1 wall / 2 entry / 3 exit / 4 path, but its Java program uses 1 for an open cell and only moves down/right. The lesson provides one program for each convention and states which is which.', 'The slide\'s printed solution `1 0 0 0 / 1 1 0 0 / 0 1 0 0 / 0 1 1 1` matches `RatMazeDownRight`.', 'The 5×5 matrix at the end of the slide has no stated solution; it needs up/left moves, which is why a visited-array solver is provided.'],
  },
});

// ───────────────────────────── Hamiltonian cycle ─────────────────────────────
export const hamiltonian: Lesson = lesson({
  id: 'a-hamiltonian-cycle',
  module: 'm5',
  title: 'Hamiltonian Cycle',
  summary: 'Does a graph contain a cycle that visits every vertex exactly once? Backtracking over an adjacency matrix.',
  level: 'advanced',
  track: 'archive',
  minutes: 55,
  essential: false,
  prerequisites: ['m4-trees-graphs-heaps', 'a-n-queens', 'm2-arrays-2d'],
  sources: ['Hamiltonian-Cycle'],
  objectives: [
    'Define a graph, adjacency matrix and Hamiltonian cycle.',
    'Write the backtracking search with a path array and an `isSafe` test.',
    'Explain why the start vertex can be fixed and why the problem is exponential.',
    'Run it on both slide graphs and predict the outcome.',
  ],
  intuition: [
    p('A **graph** is a set of vertices connected by edges. A **Hamiltonian cycle** is a closed walk that visits **every vertex exactly once** and returns to the start. (Compare an Eulerian cycle, which uses every *edge* once — a much easier problem.)'),
    pre(`
 (0)--(1)--(2)           cycle: 0 → 1 → 2 → 4 → 3 → 0
  |  / | \\  |
  | /  |  \\ |
 (3)---+--(4)            edges 0-1 1-2 2-4 4-3 3-0 are all present
`),
    p('The graph is stored as an **adjacency matrix**: `graph[i][j] == 1` if there is an edge between i and j. The search builds a `path` array: place vertex 0 first (any cycle can be rotated to start there), then at each position try every unused vertex that is adjacent to the previous one. When all V vertices are placed, the last must also be adjacent to the first.'),
    why('There is no known fast algorithm for this problem — it is NP-complete. Backtracking works because most partial paths fail quickly (no edge, or a vertex reused); the `path[pos] = -1` reset is the un-choose step that lets the loop try the next candidate. The cost is bounded by (V−1)! complete orderings.'),
  ],
  syntax: [
    code(`
int[][] graph = {{0,1,0,1,0}, {1,0,1,1,1}, {0,1,0,0,1}, {1,1,0,0,1}, {0,1,1,1,0}};   // adjacency matrix
int[] path = new int[n];  Arrays.fill(path, -1);     // path[pos] = vertex placed there
path[0] = 0;                                         // fix the start: a cycle can start anywhere
boolean ok = graph[path[pos - 1]][v] == 1;           // an edge from the previous vertex?
boolean fresh = true;                                // v not already on the path
for (int i = 0; i < pos; i++) if (path[i] == v) fresh = false;
// the cycle closes only if the LAST vertex is adjacent to path[0]
`),
  ],
  tiny: [code(`
// is there an edge from the previous vertex, and is the candidate unused?
if (graph[path[pos - 1]][v] == 0) return false;
for (int i = 0; i < pos; i++) if (path[i] == v) return false;
return true;
`)],
  guided: [
    p('The two slide graphs (5 vertices) are `graph1` — which has the cycle 0 1 2 4 3 0 — and `graph2`, where vertices 3 and 4 both have only one neighbour besides vertex 1, which makes a cycle impossible.'),
    prog('hamiltonian/HamiltonianCycle.java', 'Reads V and the matrix from input; prints a cycle or "Solution does not exist"'),
  ],
  dryRun: { algo: 'hamiltonian', input: { matrix: '01010,10111,01001,11001,01110' }, caption: 'Extending and abandoning partial paths.' },
  programs: [
    {
      file: 'hamiltonian/HamiltonianCycle.java',
      title: 'Hamiltonian cycle by backtracking',
      role: 'optimized',
      description: 'Complete version of the (fragmented) slide program, reading its graph from standard input.',
      walkthrough: [
        { at: 'static boolean isSafe(int candidate, int pos)', text: 'Can `candidate` be the vertex at position `pos` of the path?' },
        { at: 'if (graph[path[pos - 1]][candidate] == 0)', text: 'There must be an edge from the previously placed vertex.' },
        { at: 'if (path[i] == candidate)', text: 'And the vertex must not already be on the path.' },
        { at: 'if (pos == v)', text: 'All vertices placed: the cycle must close — the last vertex needs an edge back to vertex 0.' },
        { at: 'path[pos] = candidate;', text: 'CHOOSE.' },
        { at: 'path[pos] = -1;', text: 'UN-CHOOSE: free the slot for the next candidate.' },
        { at: 'path[0] = 0;', text: 'Fix the start. A cycle has no natural start, so every cycle appears as one that begins at vertex 0.' },
      ],
    },
  ],
  complexity: [
    p('Worst case the search examines every permutation of the remaining V−1 vertices: **O(V!)** time. Space: O(V) for `path` and the recursion stack (O(V²) for the matrix).'),
    p('Smarter algorithms exist (Held–Karp dynamic programming: O(2^V · V²)), but nothing polynomial is known.'),
  ],
  mistakes: [
    { title: 'Skipping the closing edge', wrong: 'if (pos == v) return true;', why: 'A path through all vertices is a Hamiltonian PATH. A cycle also needs an edge from the last vertex back to the start.', fix: 'return graph[path[pos - 1]][path[0]] == 1;' },
    { title: 'Not resetting path[pos]', wrong: 'path[pos] = v; if (extend(pos + 1)) return true;   // no reset', why: 'A stale value remains in the array; isSafe will think that vertex is already used.', fix: 'path[pos] = -1;' },
    { title: 'Expecting the slide output for the second graph', wrong: '// slide shows "0 1 2 4 3 0" after graph2', why: 'That is the answer for graph1. graph2 has no Hamiltonian cycle: the program prints "Solution does not exist".', fix: 'Run both and compare.' },
  ],
  practice: [
    {
      id: 'ham-ex1',
      level: 'beginner',
      title: 'Verify a cycle',
      statement: 'Read V, the V × V adjacency matrix, and then V+1 vertex numbers. Print YES if they form a Hamiltonian cycle (start = end, every vertex once, consecutive vertices adjacent).',
      examples: [{ input: '4\n0 1 0 1\n1 0 1 0\n0 1 0 1\n1 0 1 0\n0 1 2 3 0', output: 'YES' }],
      hints: ['Check first = last, no repeats among the first V, and an edge between consecutive vertices.'],
      solutionFile: 'hamiltonian/Ex1.java',
      solutionExplain: 'Linear scan with a seen array.',
      tests: [{ stdin: '4\n0 1 0 1\n1 0 1 0\n0 1 0 1\n1 0 1 0\n0 1 2 3 0\n', stdout: 'YES' }, { stdin: '4\n0 1 0 1\n1 0 1 0\n0 1 0 1\n1 0 1 0\n0 2 1 3 0\n', stdout: 'NO' }, { stdin: '3\n0 1 1\n1 0 1\n1 1 0\n0 1 2 0\n', stdout: 'YES' }],
    },
    {
      id: 'ham-ex2',
      level: 'intermediate',
      title: 'Find a cycle',
      statement: 'Read V and the matrix. Print `YES` followed by the first Hamiltonian cycle found starting at 0 (trying vertices in increasing order) — e.g. `YES 0 1 2 4 3 0` — or `NO`.',
      constraints: ['3 ≤ V ≤ 10'],
      examples: [{ input: '5\n0 1 0 1 0\n1 0 1 1 1\n0 1 0 0 1\n1 1 0 0 0\n0 1 1 0 0', output: 'NO' }],
      hints: ['Backtracking with path[] and the closing check.'],
      solutionFile: 'hamiltonian/Ex2.java',
      solutionExplain: 'Depth-first backtracking, candidates in increasing order, close the cycle at the end.',
      tests: [{ stdin: '5\n0 1 0 1 0\n1 0 1 1 1\n0 1 0 0 1\n1 1 0 0 0\n0 1 1 0 0\n', stdout: 'NO' }, { stdin: '5\n0 1 0 1 0\n1 0 1 1 1\n0 1 0 0 1\n1 1 0 0 1\n0 1 1 1 0\n', stdout: 'YES 0 1 2 4 3 0' }, { stdin: '3\n0 1 1\n1 0 1\n1 1 0\n', stdout: 'YES 0 1 2 0' }],
    },
    {
      id: 'ham-ex3',
      level: 'challenge',
      title: 'Count Hamiltonian cycles',
      statement: 'Read V (≤ 10) and the matrix. Count the Hamiltonian cycles that start and end at vertex 0, counting a cycle and its reverse as two different cycles.',
      examples: [{ input: '4\n0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0', output: '6' }],
      hints: ['Same search but do not stop at the first success.', 'K₄ has 3! = 6 orderings of the other vertices.'],
      solutionFile: 'hamiltonian/Ex3.java',
      solutionExplain: 'Count every complete path that closes back to vertex 0.',
      tests: [{ stdin: '4\n0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0\n', stdout: '6' }, { stdin: '3\n0 1 1\n1 0 1\n1 1 0\n', stdout: '2' }, { stdin: '4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0\n', stdout: '0' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'A Hamiltonian cycle visits…', options: ['every edge once', 'every vertex exactly once and returns to the start', 'every vertex at least once', 'the shortest route'], answer: 1, explain: 'Edges once = Eulerian; vertices once = Hamiltonian.' },
    { type: 'mcq', q: 'Why can the search always start at vertex 0?', options: ['Vertex 0 has most edges', 'A cycle can be rotated to start anywhere', 'Because arrays start at 0', 'It cannot'], answer: 1, explain: 'Any cycle through all vertices contains vertex 0.' },
    { type: 'mcq', q: 'Time complexity of the backtracking search?', kind: 'complexity', options: ['O(V)', 'O(V²)', 'O(V!)', 'O(log V)'], answer: 2, explain: 'Up to (V−1)! orderings.' },
    { type: 'mcq', q: 'A vertex with only one neighbour makes a Hamiltonian cycle…', options: ['easier', 'impossible', 'unchanged', 'a path'], answer: 1, explain: 'A cycle needs two edges at every vertex.' },
  ],
  interview: ['Hamiltonian vs Eulerian cycle?', 'Is Hamiltonian cycle NP-complete? What does that imply?', 'Bitmask DP for Hamiltonian cycle: complexity?', 'How does this relate to the travelling salesman problem?'],
  videos: ['a-hamiltonian-cycle', 'a-hamiltonian-cycle#2'],
  revision: ['Hamiltonian cycle: every vertex once, back to start.', 'path[0] = 0; place vertices with edge from previous & unused; close with edge to path[0].', 'choose / explore / reset to −1.', 'O(V!) — NP-complete.'],
  sourceNotes: {
    discrepancies: ['The slide listing of the Java class is scrambled over two slides (the `hamCycle` method header is missing and part of `main` is duplicated), so it does not compile as printed. The lesson program is the complete, working version.', 'The slide\'s final output line "0 1 2 4 3 0" is printed after `graph2`, but that graph has NO Hamiltonian cycle; the output belongs to `graph1`.'],
  },
});

// ───────────────────────────── Warnsdorff / Knight's tour ─────────────────────────────
export const knightsTour: Lesson = lesson({
  id: 'a-knights-tour',
  module: 'm5',
  title: "Knight's Tour & Warnsdorff's Rule",
  summary: 'Move a knight so that it visits every square once — plain backtracking explodes, a one-line heuristic solves 8×8 instantly.',
  level: 'advanced',
  track: 'archive',
  minutes: 55,
  essential: false,
  prerequisites: ['a-n-queens', 'a-maze-solving', 'm2-arrays-2d'],
  sources: ['downloadCourseMaterialFacultyPdf'],
  objectives: [
    'List the eight knight moves and check them against the board edges.',
    'Describe Warnsdorff\'s rule: always move to the square with the fewest onward moves.',
    'Implement the heuristic with a `degree` function and a deterministic tie-break.',
    'Compare it with exhaustive backtracking and verify a tour.',
  ],
  intuition: [
    p('A **knight** moves in an "L": two squares in one direction and one square sideways — up to eight possible moves. A **knight\'s tour** visits every square of the board exactly once. It is a Hamiltonian path on the "knight graph".'),
    p('Exhaustive backtracking (try a move, undo if stuck) works for 5 × 5 but explodes for 8 × 8. **Warnsdorff\'s rule** (1823) is a heuristic: from the current square move to the unvisited square that has the **fewest onward moves**. The idea: squares with few exits are the most likely to be stranded later, so visit them first.'),
    pre(`
 knight at (x, y) can jump to
   (x±1, y±2)  and  (x±2, y±1)
 degree(square) = number of unvisited squares the knight could jump to from it
`),
    why('Squares with few remaining exits (corners start with only 2) are dangerous: if you leave them for last you may never be able to enter them. Always visiting the *most constrained* square first is a classic "fail-first" principle from constraint solving. It is only a **heuristic** — it usually works for standard boards, but there is no proof it never fails; that is why the slide\'s program restarts with a random tie-break until it succeeds.'),
  ],
  syntax: [
    code(`
final int[] DX = { 1,  2,  2,  1, -1, -2, -2, -1};   // the eight knight moves
final int[] DY = { 2,  1, -1, -2, -2, -1,  1,  2};
int nx = x + DX[k], ny = y + DY[k];
boolean inside = nx >= 0 && ny >= 0 && nx < N && ny < N;
boolean free = inside && board[nx][ny] == -1;         // -1 = not visited yet
// Warnsdorff: among free moves choose the one with the fewest onward free moves
`),
  ],
  tiny: [code(`
int[] dx = {1, 1, 2, 2, -1, -1, -2, -2};
int[] dy = {2, -2, 1, -1, 2, -2, 1, -1};
`)],
  guided: [
    prog('knights-tour/WarnsdorffTour.java', 'Warnsdorff\'s rule with a deterministic tie-break (8×8 from the corner)'),
    prog('knights-tour/KnightBacktracking.java', 'Plain backtracking: fine for 5×5, hopeless for 8×8'),
    note('The slide\'s program searches for a **closed** tour (the last square is a knight move from the first) with a random starting move index, repeating `while (!findClosedTour())`. That randomness is what makes it eventually succeed; the lesson program is deterministic and finds an open tour.'),
  ],
  dryRun: { algo: 'knights-tour', input: { n: '5', x: '0', y: '0' }, caption: 'Warnsdorff on a 5×5 board: each step shows the chosen square.' },
  programs: [
    {
      file: 'knights-tour/WarnsdorffTour.java',
      title: "Warnsdorff's heuristic",
      role: 'optimized',
      description: 'Greedy choice by minimum degree. O(N²·8·8) ≈ O(N²) steps.',
      walkthrough: [
        { at: 'static final int[] DX', text: 'The eight knight moves; the order also decides which move wins a tie.' },
        { at: 'static int degree(int x, int y)', text: 'Counts unvisited squares reachable from (x, y) — the number of "exits".' },
        { at: 'if (d < bestDegree)', text: 'Strictly smaller degree wins, so ties go to the first move in the list (deterministic).' },
        { at: 'board[y][x] = step;', text: 'Number the square with its move number.' },
        { at: 'if (bestMove == -1)', text: 'No unvisited neighbour: the heuristic got stuck before covering the board.' },
      ],
    },
    {
      file: 'knights-tour/KnightBacktracking.java',
      title: 'Backtracking knight\'s tour',
      role: 'simple',
      description: 'Tries moves in a fixed order and undoes them when stuck; counts the recursive calls.',
      walkthrough: [
        { at: 'board[y][x] = step;', text: 'Choose: put the move number on the square.' },
        { at: 'if (step == n * n)', text: 'Every square visited: success.' },
        { at: 'board[y][x] = 0;', text: 'Un-choose and return false.' },
      ],
    },
  ],
  complexity: [
    p('**Warnsdorff:** N² steps; each step looks at ≤ 8 neighbours and computes a degree (≤ 8 more) → **O(N²)** with a constant of about 64. Space O(N²) for the board.'),
    p('**Backtracking:** worst case O(8^(N²)); the 5 × 5 board from corner (0,0) already needs thousands of calls, 8 × 8 is infeasible.'),
  ],
  mistakes: [
    { title: 'Counting the current square in the degree', wrong: 'degree includes squares already visited', why: 'The rule counts only UNVISITED onward squares, as the slide states: "we do not count moves that revisit any square already visited".', fix: 'use isEmpty(x, y) in the degree loop' },
    { title: 'Using the heuristic as a proof', wrong: '// "Warnsdorff always finds a tour"', why: 'It is a heuristic: it can get stuck on some boards/starts (there are known failures for large boards). Detect the failure and retry with another tie-break.', fix: 'check the return value and handle failure' },
    { title: 'x and y swapped when printing', wrong: 'a[x * N + y] in one place and a[y * N + x] in another', why: 'Mixed row/column indexing produces a board that looks random and fails verification.', fix: 'Use one convention: board[y][x] (row = y).' },
  ],
  practice: [
    {
      id: 'kt-ex1',
      level: 'beginner',
      title: 'Verify a tour',
      statement: 'Read n and an n × n board of move numbers 1..n². Print YES if every number appears once and consecutive numbers are a knight\'s move apart, else NO.',
      examples: [{ input: '5\n1 6 15 10 21\n14 9 20 5 16\n19 2 7 22 11\n8 13 24 17 4\n25 18 3 12 23', output: 'YES' }],
      hints: ['Store the position of each number.', 'A knight move has |dx|, |dy| = (1, 2) or (2, 1).'],
      solutionFile: 'knights-tour/Ex1.java',
      solutionExplain: 'Positions per number, then check each consecutive pair.',
      tests: [{ stdin: '5\n1 6 15 10 21\n14 9 20 5 16\n19 2 7 22 11\n8 13 24 17 4\n25 18 3 12 23\n', stdout: 'YES' }, { stdin: '3\n1 2 3\n4 5 6\n7 8 9\n', stdout: 'NO' }, { stdin: '1\n1\n', stdout: 'YES' }],
    },
    {
      id: 'kt-ex2',
      level: 'intermediate',
      title: 'Degree of a square',
      statement: 'Read n, x, y (0-based) and print how many squares an unrestricted knight on (x, y) can move to on an n × n board.',
      examples: [{ input: '8 0 0', output: '2' }],
      hints: ['Test all eight moves against the board limits.'],
      solutionFile: 'knights-tour/Ex2.java',
      solutionExplain: 'Count the legal moves; corners have 2, the centre 8.',
      tests: [{ stdin: '8 0 0\n', stdout: '2' }, { stdin: '8 3 3\n', stdout: '8' }, { stdin: '5 2 2\n', stdout: '8' }, { stdin: '3 1 1\n', stdout: '0' }],
    },
    {
      id: 'kt-ex3',
      level: 'challenge',
      title: 'Reachable squares',
      statement: 'Read n and k. A knight starts at (0, 0) on an n × n board. Print how many squares it can occupy after EXACTLY k moves (it may revisit squares).',
      examples: [{ input: '8 2', output: '10' }],
      hints: ['Keep a boolean grid of "possible positions" and advance it k times.'],
      solutionFile: 'knights-tour/Ex3.java',
      solutionExplain: 'Layer-by-layer breadth-first expansion: the set of squares reachable in exactly i moves.',
      tests: [{ stdin: '8 2\n', stdout: '10' }, { stdin: '8 1\n', stdout: '2' }, { stdin: '8 0\n', stdout: '1' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'How many moves can a knight in the middle of a large board make?', options: ['4', '6', '8', '12'], answer: 2, explain: 'Eight L-shaped jumps.' },
    { type: 'mcq', q: 'Warnsdorff\'s rule chooses the next square with…', options: ['the most onward moves', 'the fewest onward moves', 'the smallest row index', 'a random choice'], answer: 1, explain: 'Visit the most constrained square first.' },
    { type: 'mcq', q: 'Is Warnsdorff\'s rule guaranteed to find a tour?', options: ['Yes, always', 'No, it is a heuristic', 'Only on 8×8', 'Only from corners'], answer: 1, explain: 'It can get stuck; check the result.' },
    { type: 'mcq', q: 'The heuristic\'s running time on an N × N board is…', kind: 'complexity', options: ['O(N)', 'O(N²)', 'O(N!)', 'O(2^N)'], answer: 1, explain: 'N² moves with constant work each.' },
  ],
  interview: ['Why is a knight\'s tour a Hamiltonian path problem?', 'What is the "fail-first" principle?', 'How would you detect and recover when the heuristic gets stuck?', 'Open vs closed tour?'],
  videos: ['a-knights-tour', 'a-knights-tour#2'],
  revision: ['Knight: 8 moves (±1,±2),(±2,±1).', 'Warnsdorff: go to the unvisited neighbour with the fewest unvisited neighbours.', 'Heuristic — can fail; tie-break order matters.', 'Backtracking exponential; heuristic O(N²).'],
  sourceNotes: {
    discrepancies: ['This deck is named `downloadCourseMaterialFacultyPdf.pptx` and has no topic in its file name; its content is Warnsdorff\'s algorithm for the knight\'s tour.', 'The slide\'s class is not complete Java (e.g. `int y` without a semicolon, and the method `findClosedTour` is declared without a `return` on all paths in the screenshot). The lesson program is a clean, tested rewrite.', 'The slide uses `ThreadLocalRandom` to pick the first move to examine and loops until a CLOSED tour is found; its sample output is a closed tour starting at square (3, 2).'],
    assumptions: ['The deterministic tie-break (first move in the DX/DY list) is an educational simplification of the slide\'s randomised version.'],
  },
});
