import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

// ───────────────────────────── Block swap (array rotation) ─────────────────────────────
export const blockSwap: Lesson = lesson({
  id: 'a-block-swap',
  module: 'm5',
  title: 'Block Swap Algorithm (Array Rotation)',
  summary: 'Rotate an array left by d positions in O(n) time and O(1) extra space by swapping blocks.',
  level: 'intermediate',
  track: 'archive',
  minutes: 50,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm1-loops', 'm1-methods'],
  sources: ['Block-Swap-Algorithm'],
  objectives: [
    'Define left rotation by d and compute it by hand.',
    'Implement the O(n·d) one-by-one rotation and the O(n) temp-array version.',
    'Explain and trace the block swap algorithm that works in place.',
    'Compare it with the three-reversal trick and verify all variants by testing.',
  ],
  intuition: [
    p('Rotating `{1,2,3,4,5,6,7}` left by 2 moves the first two elements to the end: `{3,4,5,6,7,1,2}`. Split the array into **A** = the first d elements and **B** = the rest. Rotation turns **AB** into **BA**.'),
    pre(`
d = 2:      [ 1 2 | 3 4 5 6 7 ]      A = [1 2]      B = [3 4 5 6 7]
 A shorter than B →  swap A with the LAST |A| elements of B:
            [ 6 7 | 3 4 5 | 1 2 ]  →  A is now in its final place at the end
 remaining: [6 7 | 3 4 5] , swap again:
            [ 3 4 | 6 7 | 5 ]  ...
`),
    why('Block swap is "Euclid\'s algorithm on blocks". If A is shorter than B, swapping A with the last |A| elements of B puts A in its final position (at the end) and leaves a smaller problem: rotate the front part `A_new B_front`. If A is longer, swapping B with the first |B| elements of A puts B at the front, and the remaining part `A_rest …` is a smaller rotation. Each step fixes some elements permanently and shrinks the problem like the subtraction form of Euclid\'s GCD, until both blocks are equal and one swap finishes.'),
    p('Alternative: **reversal**. Reverse A, reverse B, then reverse everything: (Aʳ Bʳ)ʳ = B A. Three passes, 2 loops of swaps, trivial to code.'),
  ],
  syntax: [
    code(`
int t = a[i]; a[i] = a[j]; a[j] = t;                       // swap two cells
System.arraycopy(a, from, b, to, len);                     // block copy (handles overlap)
int[] part = Arrays.copyOfRange(a, from, toExclusive);     // new array
Collections.rotate(list, -d);                              // library rotation of a List by -d (left d)
static void reverse(int[] a, int lo, int hi) {             // reverse a[lo..hi] in place
    while (lo < hi) { int t = a[lo]; a[lo++] = a[hi]; a[hi--] = t; }
}
`),
  ],
  tiny: [code(`
int first = a[0];
for (int i = 0; i < n - 1; i++) a[i] = a[i + 1];
a[n - 1] = first;      // rotate left by 1: O(n)
`)],
  guided: [
    p('Rotating by d with the tiny loop d times costs d·n moves. The block swap moves each element at most once or twice.'),
    prog('block-swap/RotateOneByOne.java', 'Simple: rotate by one, d times'),
    prog('block-swap/BlockSwapRotate.java', 'Block swap (lecture algorithm)'),
    prog('block-swap/RotateReversal.java', 'Alternative: three reversals'),
    prog('block-swap/BlockSwapCheck.java', 'Self-test: block swap vs the obvious answer for every n ≤ 40 and every d'),
  ],
  dryRun: { algo: 'block-swap', input: { arr: '1,2,3,4,5,6,7', d: '2' }, caption: 'The two shrinking blocks i and j are swapped until they are equal.' },
  programs: [
    {
      file: 'block-swap/RotateOneByOne.java',
      title: 'Rotate one position at a time',
      role: 'simple',
      description: 'Left-rotates by 1, d times. O(n·d) time, O(1) space.',
      walkthrough: [
        { at: 'd %= n;', text: 'Rotating by n returns the array to the start, so only d mod n matters.' },
        { at: 'int first = a[0];', text: 'The element that falls off the front must be saved.' },
        { at: 'a[i] = a[i + 1];', text: 'Everyone else moves one step left.' },
        { at: 'a[n - 1] = first;', text: 'The saved element lands at the end.' },
      ],
    },
    {
      file: 'block-swap/BlockSwapRotate.java',
      title: 'Block swap rotation',
      role: 'optimized',
      description: 'A = a[0..d−1], B = a[d..n−1]. Repeatedly swap the shorter block with part of the longer one.',
      walkthrough: [
        { at: 'd %= n;', text: 'Normalise d (the slide handles d > n the same way).' },
        { at: 'int i = d;', text: 'i = size of A still to be placed; j = size of B. They shrink like the two numbers in Euclid\'s algorithm.' },
        { at: 'if (i < j)', text: 'A is shorter: swap it with the LAST i elements of B. Those elements of B now hold A\'s old values and are in their final position.' },
        { at: 'swap(a, d - i, d + j - i, i);', text: 'Swap i elements starting at d−i (the end of A) with i elements starting at d+j−i (the tail of B).' },
        { at: 'j -= i;', text: 'The i swapped elements are final, so B effectively gets shorter.' },
        { at: 'swap(a, d - i, d, j);', text: 'A is longer: swap the last j elements of A with all of B; B is now in its final front position.' },
        { at: 'swap(a, d - i, d, i);', text: 'When i == j the two blocks are the same size and one swap finishes the job.' },
      ],
    },
    {
      file: 'block-swap/RotateReversal.java',
      title: 'Rotation by three reversals',
      role: 'optimized',
      description: 'reverse(A), reverse(B), reverse(whole). Easy to remember, O(n) time, O(1) space.',
      walkthrough: [
        { at: 'reverse(a, 0, d - 1);', text: 'Reverse the first block A in place.' },
        { at: 'reverse(a, d, n - 1);', text: 'Reverse the second block B in place.' },
        { at: 'reverse(a, 0, n - 1);', text: 'Reversing everything turns (Aʳ Bʳ) into B A.' },
      ],
    },
    {
      file: 'block-swap/BlockSwapCheck.java',
      title: 'Exhaustive check',
      role: 'demo',
      description: 'Compares the block swap output with `a[(i + d) % n]` for 1 680 combinations of n and d (including d > n and d = 0).',
      walkthrough: [{ at: 'expected[i] = a[(i + d) % n];', text: 'The definition of a left rotation by d: element i of the result is element (i + d) mod n of the input.' }],
    },
  ],
  complexity: [
    p('**One-by-one:** d passes × n moves → O(n·d) time, O(1) space.'),
    p('**Temp array:** copy the first d elements aside, shift the rest, copy back → O(n) time, O(d) space.'),
    p('**Block swap / reversal:** every element is swapped O(1) times → **O(n) time, O(1) auxiliary space** (iterative).'),
    warn('The slide says the recursive version uses O(log n) space. Recursion depth of the subtraction-style block swap can reach about n (try d = 1), so O(log n) is not guaranteed; the iterative loop above avoids the issue entirely.', 'Check the claim'),
    table(['method', 'time', 'extra space'], [['rotate by 1, d times', 'O(n·d)', 'O(1)'], ['temp array', 'O(n)', 'O(d)'], ['block swap (iterative)', 'O(n)', 'O(1)'], ['three reversals', 'O(n)', 'O(1)']]),
  ],
  mistakes: [
    { title: 'Using d without taking d mod n', wrong: 'for (int i = 0; i < n; i++) result[i] = a[i + d];', why: 'Throws ArrayIndexOutOfBoundsException for i + d ≥ n, and never wraps around.', fix: 'result[i] = a[(i + d) % n];' },
    { title: 'Mixing up left and right rotation', wrong: '// "rotate by 2" for {1,2,3,4,5} printed as {4,5,1,2,3}', why: 'That is a RIGHT rotation. Left rotation by 2 gives {3,4,5,1,2}. Always state the direction.', fix: 'Right rotation by d == left rotation by n − d.' },
    { title: 'Slide example 2 typo', wrong: '// {6,8,7,9,0,5,1,3,2,4}, d = 5 → "{5,1,2,3,4,6,8,7,9,0}"', why: 'The elements 3 and 2 are in the wrong order in the slide. The correct left rotation is {5,1,3,2,4,6,8,7,9,0} (verified by running the program).', fix: 'Trace by hand: take indices 5..9 then 0..4.' },
  ],
  practice: [
    {
      id: 'rot-ex1',
      level: 'beginner',
      title: 'Left rotation',
      statement: 'Read n, d and an array of n integers. Print the array after rotating it left by d positions.',
      constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ d ≤ 10⁹'],
      examples: [{ input: '5 2\n1 2 3 4 5', output: '3 4 5 1 2' }],
      hints: ['Only d mod n matters.', 'Output element i is input element (i + d) mod n.'],
      solutionFile: 'block-swap/Ex1.java',
      solutionExplain: 'The index formula (i + d) % n gives the result directly, without moving anything in place.',
      tests: [{ stdin: '5 2\n1 2 3 4 5\n', stdout: '3 4 5 1 2' }, { stdin: '4 0\n9 8 7 6\n', stdout: '9 8 7 6' }, { stdin: '3 7\n1 2 3\n', stdout: '2 3 1' }],
    },
    {
      id: 'rot-ex2',
      level: 'intermediate',
      title: 'Right rotation in place',
      statement: 'Read n, d and the array. Print the array rotated RIGHT by d, using O(1) extra memory (reversals).',
      examples: [{ input: '5 2\n1 2 3 4 5', output: '4 5 1 2 3' }],
      hints: ['A right rotation by d is a left rotation by n − d.', 'Reverse three times.'],
      solutionFile: 'block-swap/Ex2.java',
      solutionExplain: 'Convert to a left rotation by (n − d) mod n and apply the three-reversal trick.',
      tests: [{ stdin: '5 2\n1 2 3 4 5\n', stdout: '4 5 1 2 3' }, { stdin: '6 6\n1 2 3 4 5 6\n', stdout: '1 2 3 4 5 6' }, { stdin: '2 1\n1 2\n', stdout: '2 1' }],
    },
    {
      id: 'rot-ex3',
      level: 'challenge',
      title: 'How many rotations?',
      statement: 'A sorted array of distinct integers was rotated left an unknown number of times. Read n and the array and print how many left rotations produced it (the index of the minimum). Use O(log n) time.',
      examples: [{ input: '6\n15 18 2 3 6 12', output: '2' }],
      hints: ['The minimum is the only element smaller than its predecessor.', 'Binary search: compare a[mid] with a[hi].'],
      solutionFile: 'block-swap/Ex3.java',
      solutionExplain: 'If a[mid] > a[hi] the minimum is right of mid; otherwise it is at mid or left of it. The loop narrows to the minimum\'s index in O(log n).',
      tests: [{ stdin: '6\n15 18 2 3 6 12\n', stdout: '2' }, { stdin: '5\n1 2 3 4 5\n', stdout: '0' }, { stdin: '4\n2 3 4 1\n', stdout: '3' }],
    },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'int[] a = {1, 2, 3, 4, 5};\nint d = 2, n = a.length;\nfor (int i = 0; i < n; i++)\n    System.out.print(a[(i + d) % n] + " ");', answer: '3 4 5 1 2', explain: 'Element i of the output is element (i + 2) mod 5 of the input.' },
    { type: 'mcq', q: 'Which method rotates in O(n) time and O(1) extra space?', options: ['Rotate by one, d times', 'Copy to a temp array of size n', 'Three reversals', 'Sorting'], answer: 2, explain: 'Reverse(A), reverse(B), reverse(all) uses only swaps.' },
    { type: 'mcq', q: 'Right rotation by 2 of a 7-element array equals left rotation by…', options: ['2', '5', '7', '9'], answer: 1, explain: 'n − d = 5.' },
    { type: 'mcq', q: 'The time complexity of the one-by-one rotation by d is…', kind: 'complexity', options: ['O(n)', 'O(n + d)', 'O(n·d)', 'O(log n)'], answer: 2, explain: 'd passes of n element moves.' },
    { type: 'output', q: 'After reversal rotation of {1,2,3,4,5,6} left by 2, what is the 1st element?', code: '// reverse(0,1) -> 2 1 3 4 5 6\n// reverse(2,5) -> 2 1 6 5 4 3\n// reverse(0,5) -> ?', answer: '3', explain: 'Final array: 3 4 5 6 1 2.' },
  ],
  interview: ['Rotate an array in place without extra space — name two ways.', 'Why does the reversal method work? (Aʳ Bʳ)ʳ = ?', 'What is the juggling algorithm and how does it use gcd(n, d)?', 'How would you search a rotated sorted array?'],
  videos: ['a-block-swap', 'a-block-swap#2'],
  revision: ['Left rotate by d: result[i] = a[(i + d) % n]; use d mod n.', 'AB → BA. Block swap shrinks like Euclid; three reversals is simplest.', 'O(n) time, O(1) space.', 'Right by d = left by n − d.'],
  sourceNotes: {
    discrepancies: [
      'Example 2 on the slide prints {5,1,2,3,4,6,8,7,9,0}; the correct result is {5,1,3,2,4,6,8,7,9,0}.',
      'The slide says "O(log n)" auxiliary space for the recursive version. The depth can be O(n); the iterative version is O(1).',
      'The slide\'s `leftRotate` and the helper `swap` appear in a confusing order across two slides; they belong to the same class.',
    ],
  },
});

// ───────────────────────────── Leaders in an array ─────────────────────────────
export const leaders: Lesson = lesson({
  id: 'a-leaders',
  module: 'm5',
  title: 'Leaders in an Array',
  summary: 'An element is a leader if it is greater than everything to its right. Brute force vs a single right-to-left scan.',
  level: 'beginner',
  track: 'archive',
  minutes: 30,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm1-loops'],
  sources: ['Leaders-in-array'],
  objectives: [
    'State the definition of a leader and find all leaders in a small array by hand.',
    'Write the O(n²) brute force with a `break`.',
    'Write the O(n) right-to-left scan and explain why it works.',
    'Adapt it to non-strict leaders and next-greater-element.',
  ],
  intuition: [
    p('Imagine people standing in a line, all facing right. Someone is a **leader** if they are **taller than everybody standing to their right** — nobody ahead can look over them. In `{14, 20, 3, 6, 5}` the leaders are 20, 6 and 5 (the last person has nobody to their right, so is always a leader).'),
    pre(`
index :   0   1   2   3   4
value :  14  20   3   6   5
right max:20  6   6   5   –
leader?   ✗   ✓   ✗   ✓   ✓      → 20, 6, 5
`),
    why('Looking from the right, the only thing you need to know about "everything to my right" is its **maximum**. Walk from the last element to the first, keeping `maxFromRight`. If the current element is greater than that maximum it is a leader (and becomes the new maximum). One pass, one variable — the O(n²) comparisons collapse because the maximum summarises the whole suffix.'),
  ],
  syntax: [
    code(`
int max = Integer.MIN_VALUE;                       // largest value seen so far from the right
List<Integer> leaders = new ArrayList<>();
for (int i = a.length - 1; i >= 0; i--) {          // right-to-left loop
    if (a[i] > max) { leaders.add(a[i]); max = a[i]; }
}
Collections.reverse(leaders);                      // restore left-to-right order
`),
  ],
  tiny: [code(`
int max = a[n - 1];            // the last element is always a leader
for (int i = n - 2; i >= 0; i--)
    if (a[i] > max) max = a[i];   // a[i] is a leader
`)],
  guided: [
    p('The lecture slides show both approaches and print the leaders of `{16, 17, 4, 3, 5, 2}`: **17, 5, 2** (left to right). The right-to-left scan naturally finds them in the order 2, 5, 17, so the lesson program stores them and prints in the original order.'),
    prog('leaders/LeadersBruteForce.java', 'Brute force (two nested loops)'),
    prog('leaders/LeadersRightScan.java', 'Optimized: right-to-left scan with a running maximum'),
  ],
  dryRun: { algo: 'leaders', input: { arr: '16,17,4,3,5,2' }, caption: 'Scan right to left; each new maximum is a leader.' },
  programs: [
    {
      file: 'leaders/LeadersBruteForce.java',
      title: 'Brute force',
      role: 'simple',
      description: 'For every element, compare it with every element on its right.',
      walkthrough: [
        { at: 'for (int j = i + 1; j < n; j++)', text: 'Only elements to the RIGHT of i matter.' },
        { at: 'if (a[i] <= a[j])', text: 'A single element that is greater than or equal disqualifies a[i] ("greater than all" means strictly greater).' },
        { at: 'break;', text: 'No need to look further once a[i] has been disqualified.' },
      ],
    },
    {
      file: 'leaders/LeadersRightScan.java',
      title: 'Right-to-left scan',
      role: 'optimized',
      description: 'One pass from the right with a running maximum. O(n) time.',
      walkthrough: [
        { at: 'int maxFromRight = Integer.MIN_VALUE;', text: 'Nothing to the right of the last element, so any value beats this.' },
        { at: 'if (a[i] > maxFromRight)', text: 'Strictly greater than every element to its right.' },
        { at: 'maxFromRight = a[i];', text: 'The new leader is also the new maximum of the suffix.' },
        { at: 'for (int i = count - 1; i >= 0; i--)', text: 'Reverse the stored leaders to print them in left-to-right order.' },
      ],
    },
  ],
  complexity: [
    p('**Brute force:** element i is compared with up to n−i−1 later elements. When every element is a leader (a strictly decreasing array) the inner loop never breaks, so the total is n(n−1)/2 comparisons → **O(n²)** worst case.'),
    p('**Right scan:** one comparison per element → **O(n) time**, O(1) extra space besides the output.'),
    table(['n', 'brute force comparisons (worst)', 'right scan'], [['1 000', '≈ 500 000', '1 000'], ['100 000', '≈ 5 × 10⁹', '100 000']]),
  ],
  mistakes: [
    { title: 'Using >= and printing equal elements', wrong: 'if (a[i] >= maxFromRight)   // for the standard (strict) definition', why: 'With {7, 7} the first 7 is NOT greater than the 7 to its right. The strict definition excludes it.', fix: 'if (a[i] > maxFromRight)' },
    { title: 'Forgetting the last element', wrong: 'for (int i = n - 2; i >= 0; i--) { ... }   // never prints a[n-1]', why: 'The last element has nothing to its right so it is always a leader and must be included.', fix: 'start the scan at i = n − 1 with maxFromRight = MIN_VALUE' },
    { title: 'Initialising max to 0', wrong: 'int max = 0;', why: 'For an all-negative array like {-5, -7} nothing is greater than 0, so no leader is found.', fix: 'int max = Integer.MIN_VALUE;' },
  ],
  practice: [
    {
      id: 'lead-ex1',
      level: 'beginner',
      title: 'Print the leaders',
      statement: 'Read n and an array. Print all leaders (strictly greater than every element to their right) from left to right.',
      examples: [{ input: '6\n16 17 4 3 5 2', output: '17 5 2' }],
      hints: ['Scan from the right with a running maximum.', 'Store, then print in reverse.'],
      solutionFile: 'leaders/Ex1.java',
      solutionExplain: 'The running maximum of the suffix decides each element in O(1).',
      tests: [{ stdin: '6\n16 17 4 3 5 2\n', stdout: '17 5 2' }, { stdin: '5\n14 20 3 6 5\n', stdout: '20 6 5' }, { stdin: '3\n5 4 3\n', stdout: '5 4 3' }, { stdin: '3\n1 2 3\n', stdout: '3' }],
    },
    {
      id: 'lead-ex2',
      level: 'intermediate',
      title: 'Non-strict leaders',
      statement: 'Same as before, but an element counts as a leader when it is greater than OR EQUAL to every element on its right.',
      examples: [{ input: '5\n7 10 4 10 6', output: '10 10 6' }],
      hints: ['Only the comparison changes.'],
      solutionFile: 'leaders/Ex2.java',
      solutionExplain: 'Replace `>` by `>=` in the running-maximum test.',
      tests: [{ stdin: '5\n7 10 4 10 6\n', stdout: '10 10 6' }, { stdin: '3\n2 2 2\n', stdout: '2 2 2' }, { stdin: '1\n9\n', stdout: '9' }],
    },
    {
      id: 'lead-ex3',
      level: 'challenge',
      title: 'Next greater element',
      statement: 'For each element print the first element to its right that is strictly greater, or -1 if there is none.',
      examples: [{ input: '4\n4 5 2 25', output: '5 25 25 -1' }],
      hints: ['Scan from the right with a stack of candidates.', 'Pop candidates that are not greater than the current element.'],
      solutionFile: 'leaders/Ex3.java',
      solutionExplain: 'The stack holds the elements that could still be "next greater" for something on the left, in decreasing order. Each element is pushed and popped at most once: O(n).',
      tests: [{ stdin: '4\n4 5 2 25\n', stdout: '5 25 25 -1' }, { stdin: '4\n13 7 6 12\n', stdout: '-1 12 12 -1' }, { stdin: '3\n3 2 1\n', stdout: '-1 -1 -1' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'The leaders of {16, 17, 4, 3, 5, 2} are…', options: ['17 5 2', '16 17 5 2', '2 5 17', '17 4 3 5 2'], answer: 0, explain: '17 > all to its right; 5 > 2; 2 is last. 16 is smaller than 17.' },
    { type: 'bug', q: 'This leader finder gives wrong results for {-3, -5}. Which line is the bug?', code: 'int max = 0;\nfor (int i = n - 1; i >= 0; i--) {\n    if (a[i] > max) {\n        max = a[i];\n        print(a[i]);\n    }\n}', answerLine: 1, explain: 'Initialising max to 0 hides negative leaders; use Integer.MIN_VALUE.' },
    { type: 'mcq', q: 'The right-to-left scan runs in…', kind: 'complexity', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], answer: 1, explain: 'One pass.' },
    { type: 'mcq', q: 'Is the last element of an array always a leader?', options: ['Yes', 'No', 'Only if positive', 'Only if largest'], answer: 0, explain: 'Nothing to its right can be larger.' },
  ],
  interview: ['Why is the last element always a leader?', 'Can you find leaders in O(n) using O(1) extra space?', 'How is the leader problem related to the "next greater element" problem?'],
  videos: ['a-leaders', 'a-leaders#2'],
  revision: ['Leader = strictly greater than all elements to its right; last element is always one.', 'Scan from the right, keep max, a[i] > max → leader.', 'O(n²) brute force vs O(n) scan.', 'Print in original order by reversing the stored list.'],
  sourceNotes: {
    discrepancies: ['The Leaders deck is a screen-recorded video presentation (slides are images). Its right-to-left code prints leaders in reverse order (2 5 17) — the lesson prints them left-to-right to match the definition.'],
  },
});

// ───────────────────────────── Majority element ─────────────────────────────
export const majority: Lesson = lesson({
  id: 'a-majority-element',
  module: 'm5',
  title: 'Majority Element (Boyer–Moore Voting)',
  summary: 'Find the element that appears more than n/2 times: counting, sorting, and the clever O(1)-space voting algorithm.',
  level: 'intermediate',
  track: 'archive',
  minutes: 50,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm3-collections-sets-maps'],
  sources: ['Majority-element'],
  objectives: [
    'State the majority-element definition (more than n/2 occurrences) precisely.',
    'Implement counting (two loops), sorting, and hash-map solutions and compare their costs.',
    'Explain Boyer–Moore voting: why cancelling different pairs leaves the majority, and why a verification pass is required.',
    'Extend the idea to elements appearing more than n/3 times.',
  ],
  intuition: [
    p('An element is the **majority element** of an array of length n if it occurs **more than n/2 times**. In `{4,7,4,4,7,4,4,9,4,3}` (n = 10) the value 4 occurs 6 times > 5, so 4 is the majority. In `{1,7,8,2,6,8,1,3,2,8}` the best is 8 with 3 occurrences — there is **no** majority element.'),
    p('Voting analogy: every element is a voter for itself. Pair off two voters who disagree and send both home: the winner (who has more than half the votes) can never be completely eliminated, because every pair removed contains at most one of its voters. Whoever is left must be the only possible winner — but if there was no real winner, a loser is left too, so we have to **count** to confirm.'),
    pre(`
4 7 4 4 7 4 4 9 4 3         candidate  count
4                              4         1
  7  (differs → cancel)        4         0
    4 (count==0 → new)         4         1
      4                        4         2
        7 (cancel)             4         1
          4                    4         2
            4                  4         3
              9 (cancel)       4         2
                4              4         3
                  3 (cancel)   4         2    → candidate 4, then verify: 4 appears 6 > 5 ✓
`),
    why('Each time the counter decrements, one occurrence of the candidate is cancelled against one occurrence of a *different* value. If x appears more than n/2 times it has more occurrences than all other values combined, so after cancelling pairs of unequal elements at least one x remains. The candidate at the end is therefore x. If no value is a majority the algorithm still returns *some* value, so verify with one more pass.'),
  ],
  syntax: [
    code(`
int candidate = 0, count = 0;                       // Boyer–Moore vote
for (int x : a) {
    if (count == 0) candidate = x;
    count += (x == candidate) ? 1 : -1;
}

Map<Integer, Integer> freq = new HashMap<>();       // counting with a map
for (int x : a) freq.merge(x, 1, Integer::sum);     // or: freq.put(x, freq.getOrDefault(x, 0) + 1)
`),
  ],
  tiny: [code(`
int candidate = 0, count = 0;
for (int x : a) {
    if (count == 0) { candidate = x; count = 1; }
    else if (x == candidate) count++;
    else count--;
}
`)],
  guided: [
    prog('majority/MajorityBruteForce.java', 'Algorithm 1 in the slides: two loops, O(n²)'),
    prog('majority/MajoritySorting.java', 'Algorithm 2: sort and count runs, O(n log n)'),
    prog('majority/BoyerMoore.java', 'Algorithm 3: Boyer–Moore voting, O(n) time and O(1) space'),
    note('The slide uses `{2,1,2,4,7}` to show why step 2 is needed: after step 1 the candidate is 7 with count 1, yet 7 appears only once in 5 elements. Try it: `BoyerMoore.in` contains exactly that array and prints "No majority element".'),
  ],
  dryRun: { algo: 'majority', input: { arr: '4,7,4,4,7,4,4,9,4,3' }, caption: 'Boyer–Moore: candidate and count after each element; the final pass verifies it.' },
  programs: [
    {
      file: 'majority/MajorityBruteForce.java',
      title: 'Two nested loops',
      role: 'simple',
      description: 'Counts how often each element occurs. Simple, but O(n²).',
      walkthrough: [
        { at: 'for (int j = 0; j < n; j++)', text: 'For each candidate a[i], scan the whole array and count equal elements.' },
        { at: 'if (count > n / 2)', text: '"More than half": strictly greater than n/2 (integer division works: for n = 5, n/2 = 2, need ≥ 3).' },
      ],
    },
    {
      file: 'majority/MajoritySorting.java',
      title: 'Sort, then count runs',
      role: 'simple',
      description: 'After sorting, equal values are adjacent, so one pass counts every run. O(n log n).',
      walkthrough: [
        { at: 'int[] a = original.clone();', text: 'Sort a copy so the caller\'s array is not changed.' },
        { at: 'Arrays.sort(a);', text: 'O(n log n) dominates the running time.' },
        { at: 'if (run > n / 2)', text: 'Check at the end of every run of equal values.' },
      ],
    },
    {
      file: 'majority/BoyerMoore.java',
      title: 'Boyer–Moore majority vote',
      role: 'optimized',
      description: 'Phase 1 finds the only possible candidate; phase 2 confirms it.',
      walkthrough: [
        { at: 'if (count == 0)', text: 'No surviving voter: adopt the current element as the new candidate.' },
        { at: 'else if (x == candidate)', text: 'Same value: one more vote for the candidate.' },
        { at: 'count--;', text: 'Different value: the two cancel each other out.' },
        { at: 'Step 2: VERIFY', text: 'The candidate is only a *possible* majority. Count its real occurrences.' },
        { at: 'occurrences > a.length / 2', text: 'Strict majority test; otherwise report no majority.' },
      ],
    },
  ],
  complexity: [
    table(['approach', 'time', 'space'], [['two loops', 'O(n²)', 'O(1)'], ['sorting', 'O(n log n)', 'O(1)–O(n)'], ['HashMap of counts', 'O(n)', 'O(n)'], ['Boyer–Moore', 'O(n)', 'O(1)']]),
    p('Boyer–Moore does exactly two passes over the array (2n comparisons) and uses two variables. This matches the slide\'s final statement: **Time O(n), Space O(1)**.'),
  ],
  mistakes: [
    { title: 'Skipping the verification pass', wrong: 'return candidate;   // after phase 1', why: 'For {2, 1, 2, 4, 7} phase 1 ends with candidate 7, which is not a majority. Without phase 2 you report a wrong answer.', fix: 'Count occurrences of the candidate and compare with n/2.' },
    { title: 'Using ≥ n/2 instead of > n/2', wrong: 'if (count >= n / 2)', why: 'For {1, 2} the value 1 has exactly n/2 occurrences — not a majority.', fix: 'if (count > n / 2)' },
    { title: 'Comparing Integer objects with ==', wrong: 'Integer candidate = ...;\nif (x == candidate) ...', why: 'When one side is an Integer object and the other an int, Java unboxes — fine; but comparing two Integer objects with == compares references (works only for −128..127).', fix: 'Use int primitives, or candidate.equals(x).' },
  ],
  practice: [
    {
      id: 'maj-ex1',
      level: 'beginner',
      title: 'Majority with a HashMap',
      statement: 'Read n and an array. Print the majority element or the text `No majority element`.',
      examples: [{ input: '5\n2 2 1 1 1', output: '1' }],
      hints: ['Count frequencies with a HashMap<Integer,Integer>.', 'Majority means more than n/2.'],
      solutionFile: 'majority/Ex1.java',
      solutionExplain: 'merge(x, 1, Integer::sum) increments the counter; any value whose count passes n/2 is the answer.',
      tests: [{ stdin: '5\n2 2 1 1 1\n', stdout: '1' }, { stdin: '4\n1 2 1 2\n', stdout: 'No majority element' }, { stdin: '1\n7\n', stdout: '7' }],
    },
    {
      id: 'maj-ex2',
      level: 'intermediate',
      title: 'Boyer–Moore',
      statement: 'Same task, but use O(1) extra memory: no sorting, no hash map.',
      constraints: ['1 ≤ n ≤ 10⁶'],
      examples: [{ input: '7\n3 3 4 2 4 4 2', output: 'No majority element' }],
      hints: ['Two variables: candidate and count.', 'Verify with a second pass.'],
      solutionFile: 'majority/Ex2.java',
      solutionExplain: 'Phase 1 keeps a candidate and a vote counter; phase 2 counts the real occurrences.',
      tests: [{ stdin: '5\n2 2 1 1 1\n', stdout: '1' }, { stdin: '7\n3 3 4 2 4 4 2\n', stdout: 'No majority element' }, { stdin: '9\n2 2 2 6 2 2 8 2 1\n', stdout: '2' }],
    },
    {
      id: 'maj-ex3',
      level: 'challenge',
      title: 'Elements appearing more than n/3 times',
      statement: 'Print all values that occur more than ⌊n/3⌋ times, in increasing order, or `None`.',
      examples: [{ input: '8\n1 1 1 3 3 2 2 2', output: '1 2' }],
      hints: ['At most two values can exceed n/3.', 'Keep TWO candidates with two counters; decrement both when a third value arrives.', 'Verify both candidates in a second pass.'],
      solutionFile: 'majority/Ex3.java',
      solutionExplain: 'Generalised Boyer–Moore: removing three different values at a time cannot eliminate a value that has more than n/3 occurrences.',
      tests: [{ stdin: '8\n1 1 1 3 3 2 2 2\n', stdout: '1 2' }, { stdin: '3\n3 2 3\n', stdout: '3' }, { stdin: '4\n1 2 3 4\n', stdout: 'None' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'In an array of 9 elements, how many occurrences make a value the majority?', options: ['at least 4', 'at least 5', 'exactly 4', 'at least 9'], answer: 1, explain: 'More than 9/2 = 4.5 → at least 5.' },
    { type: 'trace', q: 'Run phase 1 of Boyer–Moore on {2, 1, 2, 4, 7}.', code: 'for (int x : a) {\n    if (count == 0) { candidate = x; count = 1; }\n    else if (x == candidate) count++;\n    else count--;\n}', items: [{ prompt: 'count after 2nd element (1)', answer: '0' }, { prompt: 'candidate after 3rd element (2)', answer: '2' }, { prompt: 'count after 4th element (4)', answer: '0' }, { prompt: 'final candidate', answer: '7' }], explain: '(2,1) → (2,0) → (2,1) → (2,0) → (7,1). 7 is only a candidate; verification fails.' },
    { type: 'mcq', q: 'Why is the second pass of Boyer–Moore needed?', options: ['To sort the array', 'The candidate may not be a majority', 'To reset the counter', 'To avoid overflow'], answer: 1, explain: 'If no majority exists, phase 1 still returns some value.' },
    { type: 'mcq', q: 'Which approach uses O(1) extra space and O(n) time?', kind: 'choose-algorithm', options: ['HashMap counting', 'Sorting', 'Boyer–Moore', 'Two loops'], answer: 2, explain: 'Voting needs only a candidate and a counter.' },
    { type: 'mcq', q: 'Sorting-based majority detection costs…', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1, explain: 'The sort dominates.' },
  ],
  interview: ['Prove that Boyer–Moore returns the majority element if one exists.', 'How would you find elements appearing more than n/k times?', 'What if the array is too large to fit in memory?', 'Why does the final verification matter in an interview answer?'],
  videos: ['a-majority-element', 'a-majority-element#2'],
  revision: ['Majority: count > n/2.', 'Boyer–Moore: candidate/count; count == 0 → adopt; same → ++; different → −−.', 'ALWAYS verify the candidate with a second pass.', 'O(n) time, O(1) space; > n/3 needs two candidates.'],
  sourceNotes: {
    discrepancies: ['The slide cites https://www.youtube.com/watch?v=fCGLjlsEsNA as the video for this topic. YouTube\'s own metadata shows that video is titled "Maximum average subarray of size k" (IDeserve) — it is not about majority elements. It is NOT used in this library.'],
    assumptions: ['The slide deck is a set of images from an IDeserve lecture; the Java fragments in the screenshots are reconstructed into the complete program `BoyerMoore.java`.'],
  },
});

// ───────────────────────────── Maximum product subarray ─────────────────────────────
export const maxProduct: Lesson = lesson({
  id: 'a-max-product-subarray',
  module: 'm5',
  title: 'Maximum Product Subarray',
  summary: 'Find the contiguous subarray with the largest product — negatives and zeros make this trickier than the sum version.',
  level: 'intermediate',
  track: 'archive',
  minutes: 50,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm1-loops', 'm1-conversion-casting-overflow'],
  sources: ['Max-product-subarray'],
  objectives: [
    'Define subarray and count them: n(n+1)/2.',
    'Solve with brute force in O(n²) and understand the cost.',
    'Explain why you must track BOTH the maximum and minimum product ending at each position.',
    'Handle zeros, all-negative arrays, and overflow, and verify against brute force.',
  ],
  intuition: [
    p('A **subarray** is a block of consecutive elements. `{4, 0, −2, 6}` has 4·5/2 = 10 subarrays (1 + 2 + 3 + 4). Their products are 4, 0, 0, 0, 0, 0, −2, −12, 0 and 6 — so the maximum is **6** (the slide lists them all).'),
    p('For sums, "best subarray ending here" needs only one number. For products it needs two, because multiplying by a **negative** number flips big positive into big negative and the other way round:'),
    pre(`
a = { -5, -4, -1, -2 }
        max ending here   min ending here
 -5          -5                -5
 -4          20  (-5·-4)       -4
 -1           4  (-4·-1)      -20  (20·-1)
 -2          40  (-20·-2)     -8   (4·-2)         answer = 40
`),
    why('A subarray ending at i is either just a[i] or a[i] times a subarray ending at i−1. If a[i] > 0 we want the biggest product ending at i−1 to make the biggest result, and the smallest to make the smallest result. If a[i] < 0 the roles are swapped: the **smallest** (most negative) previous product becomes the biggest. A zero resets both. That is why `max` and `min` are updated together and swapped when a[i] is negative.'),
  ],
  syntax: [
    code(`
long best = a[0], curMax = a[0], curMin = a[0];     // products can overflow int: use long
for (int i = 1; i < a.length; i++) {
    long x = a[i];
    long hi = curMax * x, lo = curMin * x;          // a negative x swaps the roles of max and min
    curMax = Math.max(x, Math.max(hi, lo));
    curMin = Math.min(x, Math.min(hi, lo));
    best = Math.max(best, curMax);
}
`),
  ],
  tiny: [code(`
long mx = a[0], mn = a[0], best = a[0];
for (int i = 1; i < n; i++) {
    long x = a[i];
    if (x < 0) { long t = mx; mx = mn; mn = t; }
    mx = Math.max(x, mx * x);
    mn = Math.min(x, mn * x);
    best = Math.max(best, mx);
}
`)],
  guided: [
    prog('max-product/MaxProductBrute.java', 'Simple: try every subarray (slides 4–5)'),
    prog('max-product/MaxProduct.java', 'Optimized: running maximum and minimum (slide 6, cleaned up)'),
    prog('max-product/MaxProductCheck.java', 'Random testing against brute force'),
  ],
  dryRun: { algo: 'max-product', input: { arr: '-5,-4,-1,-2' }, caption: 'The slide\'s execution trace: max and min after each element.' },
  programs: [
    {
      file: 'max-product/MaxProductBrute.java',
      title: 'Brute force over all subarrays',
      role: 'simple',
      description: 'For each start i, extend the end j and keep a running product.',
      walkthrough: [
        { at: 'long product = 1;', text: 'Product of the empty prefix; reset for every new start index.' },
        { at: 'product *= a[j];', text: 'Extending the subarray by one element needs only one multiplication, not a recomputation.' },
        { at: 'best = Math.max(best, product);', text: 'Keep the largest product seen over all (i, j).' },
      ],
    },
    {
      file: 'max-product/MaxProduct.java',
      title: 'Max/min product ending at each index',
      role: 'optimized',
      description: 'One pass, O(1) space. Swapping on negatives replaces the slide\'s three-way if/else.',
      walkthrough: [
        { at: 'long maxEnding = a[0];', text: 'Best product of a subarray ending at the current index.' },
        { at: 'long minEnding = a[0];', text: 'Worst (most negative) product ending here — it may become the best after a negative factor.' },
        { at: 'if (x < 0)', text: 'A negative factor reverses the order of products: swap the roles.' },
        { at: 'maxEnding = Math.max(x, maxEnding * x);', text: 'Either start fresh at x (the earlier product hurts) or extend.' },
        { at: 'best = Math.max(best, maxEnding);', text: 'Track the overall best.' },
      ],
    },
    {
      file: 'max-product/MaxProductCheck.java',
      title: 'Randomised check',
      role: 'demo',
      description: '20 000 random arrays over {−4..4} including zeros; the fast and brute versions must agree.',
      walkthrough: [{ at: 'rnd.nextInt(9) - 4', text: 'Values −4..4: lots of zeros and sign changes, which is where bugs hide.' }],
    },
  ],
  complexity: [
    p('**Brute force:** n(n+1)/2 subarrays, O(1) each with the running product → **O(n²) time**, O(1) space.'),
    p('**Max/min:** a single pass → **O(n) time, O(1) space**.'),
    warn('Products grow fast: 2⁶³ is reached after only 63 elements equal to 2. Use `long` (or BigInteger) and state the constraints; the answer is guaranteed to fit in the problem statement.'),
  ],
  mistakes: [
    { title: 'Tracking only the maximum', wrong: 'maxEnding = Math.max(a[i], maxEnding * a[i]);', why: 'For {−2, 3, −4} the answer is 24, but a max-only version stores 3 then 3·(−4) = −12 → 3·... it misses (−2·3·−4). The minimum −6 is needed.', fix: 'Keep maxEnding AND minEnding; swap when a[i] < 0.' },
    { title: 'Hard-coding the length (slide)', wrong: 'for (int i = 1; i < 4; i++)   // array happens to have 4 elements', why: 'Any other array length silently skips elements or throws.', fix: 'for (int i = 1; i < a.length; i++)' },
    { title: 'Initialising best with 0', wrong: 'long best = 0;', why: 'For {−3} the answer is −3 (a subarray must contain at least one element) but best stays 0.', fix: 'long best = a[0];' },
  ],
  practice: [
    {
      id: 'mp-ex1',
      level: 'beginner',
      title: 'Count subarrays with positive product',
      statement: 'Read n and an array. Print the number of subarrays whose product is strictly positive.',
      constraints: ['1 ≤ n ≤ 2000'],
      examples: [{ input: '5\n2 3 -2 4 0', output: '4' }],
      hints: ['A subarray is positive when it has no zero and an even number of negatives.', 'For each start extend until a zero appears.'],
      solutionFile: 'max-product/Ex1.java',
      solutionExplain: 'Track the parity of negatives while extending; stop at a zero.',
      tests: [{ stdin: '5\n2 3 -2 4 0\n', stdout: '4' }, { stdin: '3\n-1 -2 -3\n', stdout: '2' }, { stdin: '3\n0 0 0\n', stdout: '0' }],
    },
    {
      id: 'mp-ex2',
      level: 'intermediate',
      title: 'Maximum product subarray',
      statement: 'Read n and an array of integers. Print the largest product of a contiguous non-empty subarray.',
      constraints: ['1 ≤ n ≤ 10⁵', '−10 ≤ a[i] ≤ 10', 'the answer fits in a 64-bit signed integer'],
      examples: [{ input: '4\n2 3 -2 4', output: '6' }],
      hints: ['Keep both max and min ending at i.', 'Swap them when a[i] is negative.'],
      solutionFile: 'max-product/Ex2.java',
      solutionExplain: 'The O(n) max/min recurrence from the lesson.',
      tests: [{ stdin: '4\n2 3 -2 4\n', stdout: '6' }, { stdin: '3\n-2 0 -1\n', stdout: '0' }, { stdin: '4\n-5 -4 -1 -2\n', stdout: '40' }, { stdin: '1\n-7\n', stdout: '-7' }],
    },
    {
      id: 'mp-ex3',
      level: 'challenge',
      title: 'Which subarray?',
      statement: 'Print three numbers: the maximum product, then the start and end index (0-based) of the first subarray that achieves it (earliest start, then earliest end).',
      constraints: ['1 ≤ n ≤ 1000'],
      examples: [{ input: '4\n2 3 -2 4', output: '6 0 1' }],
      hints: ['The brute force O(n²) is fine for n ≤ 1000.', 'Only update on a STRICTLY larger product to keep the first one.'],
      solutionFile: 'max-product/Ex3.java',
      solutionExplain: 'Enumerate (i, j) in order and update the record only when the product is strictly greater.',
      tests: [{ stdin: '4\n2 3 -2 4\n', stdout: '6 0 1' }, { stdin: '1\n5\n', stdout: '5 0 0' }, { stdin: '3\n-1 -1 -1\n', stdout: '1 0 1' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'How many subarrays does an array of 5 elements have?', options: ['10', '15', '20', '25'], answer: 1, explain: 'n(n+1)/2 = 15.' },
    { type: 'output', q: 'What does the lesson\'s algorithm return for {−2, 3, −4}?', code: '// max/min product ending at each index', answer: '24', explain: '(−2)·3·(−4) = 24.' },
    { type: 'mcq', q: 'Why do we keep the MINIMUM product ending at i?', options: ['To find the minimum answer', 'A negative number can turn it into the maximum', 'To detect zeros', 'For overflow protection'], answer: 1, explain: 'Most negative × negative = largest positive.' },
    { type: 'mcq', q: 'Time complexity of the max/min algorithm?', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 0, explain: 'One pass with O(1) work per element.' },
    { type: 'output', q: 'Max product of {0, 2}?', code: '// a zero resets the running products', answer: '2', explain: 'The subarray {2} has product 2.' },
  ],
  interview: ['Why does the maximum-sum subarray (Kadane) not directly work for products?', 'How do zeros and negatives affect the algorithm?', 'What if the numbers are huge — how do you avoid overflow?', 'Solve it by splitting at zeros and counting negatives.'],
  videos: ['a-max-product-subarray', 'a-max-product-subarray#2'],
  revision: ['Keep max & min product ending here; swap if a[i] < 0.', 'max = max(a[i], max·a[i]); min = min(a[i], min·a[i]); best = max(best, max).', 'Zero resets; initialise from a[0], not 0.', 'O(n) time, O(1) space; use long.'],
  sourceNotes: {
    discrepancies: ['The slide prints `{4, 0, −2, 6}` products with a stray "x1 = …" notation, but its conclusion (6) is correct.', 'The slide code loops `i < 4` regardless of array length and uses a three-way branch with a temp variable; the swap form in this lesson is equivalent and shorter.'],
  },
});

// ───────────────────────────── Max equilibrium sum ─────────────────────────────
export const equilibrium: Lesson = lesson({
  id: 'a-equilibrium-sum',
  module: 'm5',
  title: 'Maximum Equilibrium Sum',
  summary: 'Find indices where the left sum equals the right sum, and report the largest such sum — in one pass with a running total.',
  level: 'beginner',
  track: 'archive',
  minutes: 35,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm1-loops'],
  sources: ['Max-Equlibrium-Sum'],
  objectives: [
    'Define an equilibrium index and find one by hand.',
    'Solve with brute force, then with a prefix/running sum in O(n).',
    'Compute the maximum equilibrium sum and distinguish the two common definitions.',
    'Handle negatives, a single element, and no equilibrium at all.',
  ],
  intuition: [
    p('An **equilibrium index** is a position where the sum of everything to its left equals the sum of everything to its right (the element itself is on neither side). For `A = {−7, 1, 5, 2, −4, 3, 0}`: index 3 works because −7 + 1 + 5 = −1 and −4 + 3 + 0 = −1; index 6 works because the left side sums to 0 and the right side is empty (sum 0).'),
    p('The **maximum equilibrium sum** is the largest of those equal side-sums. For `{1,2,3,4,5,4,3,2,1}` the only equilibrium is the middle 5, with both sides summing to **10**.'),
    pre(`
total = 25                           left   right = total − left − a[i]
i=0 a=1   left=0   right=24            0     24    no
i=1 a=2   left=1   right=22            1     22    no
i=2 a=3   left=3   right=19
i=3 a=4   left=6   right=15
i=4 a=5   left=10  right=10   ← equal! equilibrium, sum 10
`),
    why('Instead of re-adding the right side for every i, note that `right = total − left − a[i]`. Keep `left` as a running sum and update it after testing each index. The total is computed once. This is the same idea as a prefix-sum array, but needs only one variable.'),
    warn('**Two definitions are in circulation.** The slides (and this lesson\'s main answer) report the side-sum *excluding* a[i]. Many online versions ask for the prefix sum *including* a[i] that equals the suffix sum including a[i]; the equilibrium indices are the same, but the reported sum is larger by a[i] (15 instead of 10 for the example). The program prints both.'),
  ],
  syntax: [
    code(`
long[] prefix = new long[n + 1];                    // prefix[i] = a[0] + … + a[i-1]
for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + a[i];
long left  = prefix[i];                             // sum of a[0 .. i-1]
long right = prefix[n] - prefix[i + 1];             // sum of a[i+1 .. n-1]
long rangeSum = prefix[r + 1] - prefix[l];          // any range a[l..r] in O(1)
`),
  ],
  tiny: [code(`
long left = 0;
for (int i = 0; i < n; i++) {
    long right = total - left - a[i];
    if (left == right) { /* equilibrium at i */ }
    left += a[i];
}
`)],
  guided: [
    p('The slide animates the algorithm on `{1, 3, 5, 2, 2}`: total = 13; at index 2 (value 5) the left sum is 4 and the right sum 13 − 4 − 5 = 4 → equilibrium, position 3 in 1-based numbering (`pos = i + 1`).'),
    prog('equilibrium/EquilibriumBrute.java', 'Simple: recompute both sums for every index'),
    prog('equilibrium/MaxEquilibriumSum.java', 'Optimized: running left sum, maximum equilibrium sum'),
  ],
  dryRun: { algo: 'equilibrium', input: { arr: '1,3,5,2,2' }, caption: 'The slide\'s array: left sum and right sum at every index.' },
  programs: [
    {
      file: 'equilibrium/EquilibriumBrute.java',
      title: 'Brute force',
      role: 'simple',
      description: 'For each index add the left part and the right part separately. O(n²).',
      walkthrough: [
        { at: 'for (int j = 0; j < i; j++) left += a[j];', text: 'Sum of everything strictly before i.' },
        { at: 'for (int j = i + 1; j < n; j++) right += a[j];', text: 'Sum of everything strictly after i.' },
        { at: 'if (left == right)', text: 'Equilibrium: report the index and the side sum.' },
      ],
    },
    {
      file: 'equilibrium/MaxEquilibriumSum.java',
      title: 'One pass',
      role: 'optimized',
      description: 'Computes total once, then maintains left; right is derived. O(n) time, O(1) extra space.',
      walkthrough: [
        { at: 'total += a[i];', text: 'First pass: the total of the whole array.' },
        { at: 'long right = total - left - a[i];', text: 'Right sum without looping: everything except the left part and a[i] itself.' },
        { at: 'bestExcluding = Math.max(bestExcluding, left);', text: 'The slide\'s definition: the side sum (left == right).' },
        { at: 'bestIncluding = Math.max(bestIncluding, left + a[i]);', text: 'The alternative definition (prefix including a[i]).' },
        { at: 'left += a[i];', text: 'Update AFTER the test, so that `left` means "sum before i" at the top of the loop.' },
      ],
    },
  ],
  complexity: [
    p('Brute force: for each of n indices two sums of up to n elements → **O(n²)** time, O(1) space.'),
    p('One pass: two linear scans → **O(n) time, O(1) space** (apart from the input).'),
    p('Use `long` for the sums: 10⁵ values of 10⁹ overflow `int`.'),
  ],
  mistakes: [
    { title: 'Updating left before comparing', wrong: 'left += a[i];\nif (left == total - left) ...', why: 'Then `left` already includes a[i] and the comparison tests the "including" variant with a different right side. Mixing the two definitions produces off-by-one-element results.', fix: 'Compare first, then add a[i] to left.' },
    { title: 'Returning Integer.MIN_VALUE when nothing is found (slide)', wrong: 'return maxSum;   // MIN_VALUE if no equilibrium', why: 'The caller prints a huge negative number as if it were a real answer. Report "none" explicitly.', fix: 'Track a `found` flag.' },
    { title: 'int overflow', wrong: 'int total = 0; for (...) total += a[i];', why: 'Large inputs wrap around silently and create fake equilibria.', fix: 'long total' },
  ],
  practice: [
    {
      id: 'eq-ex1',
      level: 'beginner',
      title: 'First equilibrium index',
      statement: 'Read n and an array. Print the smallest equilibrium index (0-based) or -1.',
      examples: [{ input: '7\n-7 1 5 2 -4 3 0', output: '3' }],
      hints: ['right = total − left − a[i].', 'Stop at the first match.'],
      solutionFile: 'equilibrium/Ex1.java',
      solutionExplain: 'Running left sum and a precomputed total give the right sum in O(1).',
      tests: [{ stdin: '7\n-7 1 5 2 -4 3 0\n', stdout: '3' }, { stdin: '3\n1 2 3\n', stdout: '-1' }, { stdin: '1\n5\n', stdout: '0' }],
    },
    {
      id: 'eq-ex2',
      level: 'intermediate',
      title: 'Maximum equilibrium sum',
      statement: 'Print the largest side-sum over all equilibrium indices (left sum excluding a[i]), or the word `none`.',
      examples: [{ input: '9\n1 2 3 4 5 4 3 2 1', output: '10' }],
      hints: ['Collect a maximum over the equilibria.', 'Use a boolean for "found" instead of a sentinel.'],
      solutionFile: 'equilibrium/Ex2.java',
      solutionExplain: 'Same scan; update the maximum whenever left == right.',
      tests: [{ stdin: '9\n1 2 3 4 5 4 3 2 1\n', stdout: '10' }, { stdin: '7\n-7 1 5 2 -4 3 0\n', stdout: '0' }, { stdin: '2\n1 2\n', stdout: 'none' }],
    },
    {
      id: 'eq-ex3',
      level: 'challenge',
      title: 'Balanced split points',
      statement: 'Count the split positions k (1 ≤ k ≤ n−1) such that the sum of a[0..k−1] equals the sum of a[k..n−1].',
      constraints: ['2 ≤ n ≤ 10⁵'],
      examples: [{ input: '6\n1 -1 1 -1 1 -1', output: '2' }],
      hints: ['Both parts together sum to total, so the prefix must equal total/2.', 'One pass with a running prefix.'],
      solutionFile: 'equilibrium/Ex3.java',
      solutionExplain: 'prefix == total − prefix at each split point; count them.',
      tests: [{ stdin: '6\n1 -1 1 -1 1 -1\n', stdout: '2' }, { stdin: '4\n2 2 2 2\n', stdout: '1' }, { stdin: '3\n1 2 3\n', stdout: '1' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'For {1, 3, 5, 2, 2}, the equilibrium index (0-based) is…', options: ['1', '2', '3', 'none'], answer: 1, explain: 'Left 1+3 = 4, right 2+2 = 4 at index 2.' },
    { type: 'output', q: 'What is `right` at index 1 of {4, 1, 2, 1}?', code: 'long total = 8, left = 4;\nlong right = total - left - 1;\nSystem.out.println(right);', answer: '3', explain: '8 − 4 − 1 = 3 (the elements 2 and 1).' },
    { type: 'mcq', q: 'How do you get the right sum in O(1)?', options: ['Loop again', 'total − left − a[i]', 'left × 2', 'sort first'], answer: 1, explain: 'Everything not on the left and not a[i] is on the right.' },
    { type: 'mcq', q: 'Time complexity of the single-pass solution?', kind: 'complexity', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], answer: 1, explain: 'Two linear passes.' },
  ],
  interview: ['Find the equilibrium index in O(n) time and O(1) space.', 'What if the array has negative numbers and zeros — can there be several equilibrium indices?', 'How do you handle overflow?'],
  videos: ['a-equilibrium-sum', 'a-equilibrium-sum#2'],
  revision: ['Equilibrium index: sum(left) == sum(right), a[i] excluded.', 'right = total − left − a[i]; update left AFTER the test.', 'Max equilibrium sum = max of left over equilibria (none → report none).', 'O(n) time, O(1) space; use long.'],
  sourceNotes: {
    discrepancies: ['The Java program on the last slide returns Integer.MIN_VALUE when there is no equilibrium index; the lesson uses an explicit "none".', 'The deck explains the algorithm with a sequence of animated screenshots using the 1-based position `pos = i + 1`; Java indices here are 0-based.'],
    assumptions: ['"Maximum equilibrium sum" is taken as the maximum of the equal side-sum (the deck\'s code). The prefix-including-a[i] reading is shown as a labelled variant.'],
  },
});

// ───────────────────────────── Hourglass ─────────────────────────────
export const hourglass: Lesson = lesson({
  id: 'a-hourglass',
  module: 'm5',
  title: 'Maximum Sum of an Hourglass in a Matrix',
  summary: 'Slide a fixed 7-cell hourglass pattern over a 2-D array and keep the best sum.',
  level: 'beginner',
  track: 'archive',
  minutes: 30,
  essential: true,
  prerequisites: ['m2-arrays-2d', 'm1-loops'],
  sources: ['Maximum-sum-of-hour-glass-in-matrix'],
  objectives: [
    'Describe the hourglass shape and index its seven cells from a top-left corner.',
    'Count the hourglasses in an R×C matrix: (R−2)(C−2).',
    'Write two nested loops with correct bounds and a correct initial maximum.',
    'Generalise with 2-D prefix sums to any k×k window.',
  ],
  intuition: [
    p('An **hourglass** in a matrix is the 7-cell shape: a row of three cells, the single cell below its middle, and another row of three cells.'),
    pre(`
 a b c       (i, j)   (i, j+1)  (i, j+2)
   d                  (i+1, j+1)
 e f g       (i+2, j) (i+2, j+1)(i+2, j+2)
`, 'The hourglass is anchored by its top-left corner (i, j).'),
    p('For `4×4` matrix `1 2 3 4 / 5 6 7 8 / 9 1 2 3 / 4 5 6 7` there are (4−2)·(4−2) = 4 hourglasses with sums 24, 22, 34 and **41** — the slide\'s answer.'),
    why('The top-left corner can be at any row 0 … R−3 and any column 0 … C−3 (the hourglass needs 2 extra rows and columns). That gives (R−2) × (C−2) positions, and the problem becomes: evaluate a 7-term sum at each position and keep the largest.'),
  ],
  syntax: [
    code(`
for (int r = 0; r + 2 < rows; r++) {                // top-left corner of a 3 x 3 window
    for (int c = 0; c + 2 < cols; c++) {
        int sum = m[r][c]   + m[r][c+1]   + m[r][c+2]
                            + m[r+1][c+1]
                + m[r+2][c] + m[r+2][c+1] + m[r+2][c+2];
        best = Math.max(best, sum);
    }
}
int best = Integer.MIN_VALUE;                       // NOT 0: all sums may be negative
`),
  ],
  tiny: [code(`
int s = m[i][j] + m[i][j+1] + m[i][j+2]
      + m[i+1][j+1]
      + m[i+2][j] + m[i+2][j+1] + m[i+2][j+2];
`)],
  guided: [prog('hourglass/HourglassMax.java', 'Complete program: read an R×C matrix and print the maximum hourglass sum and its position')],
  dryRun: { algo: 'hourglass', input: { rows: '4', cols: '4', data: '1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7' }, caption: 'The four hourglasses of the slide\'s 4×4 example.' },
  programs: [
    {
      file: 'hourglass/HourglassMax.java',
      title: 'Maximum hourglass sum',
      role: 'optimized',
      description: 'Two nested loops over the valid top-left corners; O(R·C) time.',
      walkthrough: [
        { at: 'static int hourglassSum', text: 'Extracting the 7-term sum into a method makes the loops easy to read and the pattern easy to change.' },
        { at: 'if (rows < 3 || cols < 3)', text: 'No hourglass fits. Report it and stop (the slide calls System.exit(0) inside the method — returning is cleaner).' },
        { at: 'int best = Integer.MIN_VALUE;', text: 'NOT 0: if every hourglass sum is negative, starting at 0 would report 0, which is not the sum of any hourglass.' },
        { at: 'for (int i = 0; i + 2 < rows; i++)', text: 'Top row of the hourglass: it needs rows i, i+1, i+2.' },
        { at: 'for (int j = 0; j + 2 < cols; j++)', text: 'Left column: it needs columns j, j+1, j+2.' },
      ],
    },
  ],
  complexity: [
    p('(R−2)(C−2) hourglasses × 7 additions = **O(R·C) time**, O(1) extra space. For a fixed shape the constant 7 disappears into the O.'),
    p('For a general k×k window the naive cost is O(R·C·k²); with a 2-D prefix-sum table it drops to O(R·C) (challenge exercise).'),
  ],
  mistakes: [
    { title: 'Initial maximum of 0 (slide)', wrong: 'int max_sum = 0;', why: 'With all-negative hourglass sums the program prints 0, which is wrong.', fix: 'int max = Integer.MIN_VALUE;' },
    { title: 'Loop bounds off by two', wrong: 'for (int i = 0; i < rows; i++)   // then m[i + 2][...] → exception', why: 'The pattern reaches two rows and two columns beyond the corner.', fix: 'for (int i = 0; i + 2 < rows; i++)' },
    { title: 'Using the centre cell twice or the wrong middle row', wrong: 'm[i + 1][j] + m[i + 1][j + 1] + m[i + 1][j + 2]', why: 'That is a full middle row (a 3×3 block), not an hourglass: only the CENTRE of the middle row belongs to it.', fix: 'm[i + 1][j + 1]' },
  ],
  practice: [
    {
      id: 'hg-ex1',
      level: 'beginner',
      title: 'One hourglass',
      statement: 'Read a 3×3 matrix (nine integers) and print its hourglass sum.',
      examples: [{ input: '1 1 1\n0 1 0\n1 1 1', output: '7' }],
      hints: ['Skip m[1][0] and m[1][2].'],
      solutionFile: 'hourglass/Ex1.java',
      solutionExplain: 'Add the two full outer rows and the centre cell.',
      tests: [{ stdin: '1 1 1\n0 1 0\n1 1 1\n', stdout: '7' }, { stdin: '0 0 0\n5 5 5\n0 0 0\n', stdout: '5' }, { stdin: '-1 -1 -1\n-1 -1 -1\n-1 -1 -1\n', stdout: '-7' }],
    },
    {
      id: 'hg-ex2',
      level: 'intermediate',
      title: 'Maximum hourglass with negatives',
      statement: 'Read R, C and the matrix (R, C ≥ 3). Print the maximum hourglass sum.',
      constraints: ['3 ≤ R, C ≤ 100', '−100 ≤ value ≤ 100'],
      examples: [{ input: '3 3\n-1 -1 -1\n-1 -9 -1\n-1 -1 -1', output: '-15' }],
      hints: ['Start the maximum at Integer.MIN_VALUE.'],
      solutionFile: 'hourglass/Ex2.java',
      solutionExplain: 'All (R−2)(C−2) hourglass sums are compared; the initial value must be below any possible sum.',
      tests: [{ stdin: '3 3\n-1 -1 -1\n-1 -9 -1\n-1 -1 -1\n', stdout: '-15' }, { stdin: '4 4\n1 2 3 4\n5 6 7 8\n9 1 2 3\n4 5 6 7\n', stdout: '41' }, { stdin: '3 4\n1 1 1 1\n1 9 1 1\n1 1 1 1\n', stdout: '15' }],
    },
    {
      id: 'hg-ex3',
      level: 'challenge',
      title: 'Largest k×k block',
      statement: 'Read R, C, k and a matrix. Print the maximum sum of any k×k sub-matrix in O(R·C) time using 2-D prefix sums.',
      constraints: ['1 ≤ k ≤ min(R, C) ≤ 1000'],
      examples: [{ input: '3 3 2\n1 2 3\n4 5 6\n7 8 9', output: '28' }],
      hints: ['p[i][j] = sum of the rectangle (0,0)…(i−1,j−1).', 'Block sum = p[i][j] − p[i−k][j] − p[i][j−k] + p[i−k][j−k].'],
      solutionFile: 'hourglass/Ex3.java',
      solutionExplain: 'The prefix table lets any rectangle sum be evaluated in four lookups, independent of its size.',
      tests: [{ stdin: '3 3 2\n1 2 3\n4 5 6\n7 8 9\n', stdout: '28' }, { stdin: '2 2 2\n-1 -2\n-3 -4\n', stdout: '-10' }, { stdin: '2 3 1\n5 -1 3\n0 2 -4\n', stdout: '5' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'How many hourglasses fit in a 5×6 matrix?', options: ['12', '15', '20', '30'], answer: 0, explain: '(5−2)(6−2) = 12.' },
    { type: 'mcq', q: 'Which cells belong to the hourglass anchored at (i, j)?', options: ['the full 3×3 block', 'two full rows of 3 and the centre cell', 'the main diagonals', 'a plus sign'], answer: 1, explain: 'Top row, centre of the middle row, bottom row.' },
    { type: 'output', q: 'What is the hourglass sum of this 3×3?  1 2 3 / 4 5 6 / 7 8 9', code: '// a b c / d / e f g', answer: '35', explain: '1+2+3+5+7+8+9 = 35 (the slide\'s own example).' },
    { type: 'mcq', q: 'Why initialise the maximum with Integer.MIN_VALUE?', options: ['It is faster', 'All sums may be negative', 'Arrays start at 0', 'Required by Java'], answer: 1, explain: 'Otherwise the result 0 would not correspond to any hourglass.' },
  ],
  interview: ['How many hourglasses are in an R×C matrix and why?', 'How would you generalise to a k×k window in O(R·C)?', 'What if the matrix is stored row by row in a 1-D array?'],
  videos: ['a-hourglass', 'a-hourglass#2'],
  revision: ['Hourglass at (i, j): m[i][j..j+2], m[i+1][j+1], m[i+2][j..j+2].', 'Positions: i in 0..R−3, j in 0..C−3 → (R−2)(C−2).', 'Initial max = Integer.MIN_VALUE.', 'O(R·C) time, O(1) space.'],
  sourceNotes: {
    discrepancies: ['The slide initialises `max_sum = 0` (wrong for negative data) and exits the JVM with `System.exit(0)` inside the helper. The lesson program avoids both.', 'The slide\'s worked sums (24, 22, 34, 41) are correct.'],
  },
});

// ───────────────────────────── Toggle the switch (100 doors) ─────────────────────────────
export const toggleDoors: Lesson = lesson({
  id: 'a-toggle-doors',
  module: 'm5',
  title: 'Toggle the Switch (100 Doors)',
  summary: 'Monkeys flip doors by multiples. Why do exactly the perfect squares stay open?',
  level: 'intermediate',
  track: 'archive',
  minutes: 40,
  essential: true,
  prerequisites: ['m1-loops', 'm2-arrays-1d', 'm2-math-gcd-lcm-primes-mod'],
  sources: ['Toggle-the-switch-_-Alice-Apple-tree'],
  objectives: [
    'Simulate the doors puzzle with nested loops and a boolean array.',
    'Explain why a door is toggled once per divisor of its number.',
    'Prove that only perfect squares have an odd number of divisors and write an O(1) solution.',
    'Compute integer square roots safely for 64-bit inputs.',
  ],
  intuition: [
    p('There are 100 closed doors and 100 monkeys. Monkey 1 toggles every door; monkey 2 toggles doors 2, 4, 6, …; monkey 3 toggles 3, 6, 9, …; monkey k toggles every k-th door. How many doors are open at the end?'),
    p('Door number **n** is touched by monkey k exactly when **k divides n**. So door 12 is toggled by monkeys 1, 2, 3, 4, 6, 12 — six times → closed again. Door 16 by monkeys 1, 2, 4, 8, 16 — five times → **open**.'),
    why('Divisors come in pairs (d, n/d). Door 12: (1,12), (2,6), (3,4) — an even count, so it ends closed. The count is odd only if one pair is "d with itself", i.e. d = n/d, i.e. n = d² is a perfect square. Hence the open doors are exactly 1, 4, 9, …, 100: **10 doors**, and for n doors the answer is ⌊√n⌋.'),
    pre(`
door:     1  2  3  4  5  6  7  8  9 10 ...
toggles:  1  2  2  3  2  4  2  4  3  4
final:    O  c  c  O  c  c  c  c  O  c   (O = open: 1, 4, 9)
`),
  ],
  syntax: [
    code(`
boolean[] open = new boolean[n + 1];                // index 1..n, all closed
for (int pass = 1; pass <= n; pass++)
    for (int door = pass; door <= n; door += pass)  // every pass-th door
        open[door] = !open[door];                   // toggle
int count = (int) Math.sqrt(n);                     // the closed form: perfect squares <= n
`),
  ],
  tiny: [code(`
for (int monkey = 1; monkey <= n; monkey++)
    for (int door = monkey; door <= n; door += monkey)
        open[door] = !open[door];
`)],
  guided: [
    prog('toggle-doors/DoorsSimulation.java', 'Simple: simulate every monkey (n·H(n) toggles)'),
    prog('toggle-doors/DoorsSquares.java', 'Optimized: count perfect squares with an integer square root'),
  ],
  dryRun: { algo: 'doors', input: { n: '20' }, caption: 'After each monkey, which doors are open.' },
  programs: [
    {
      file: 'toggle-doors/DoorsSimulation.java',
      title: 'Doors by simulation',
      role: 'simple',
      description: 'A boolean array and the two nested loops of the puzzle.',
      walkthrough: [
        { at: 'boolean[] open = new boolean[n + 1];', text: 'Index = door number (1-based), false = closed.' },
        { at: 'for (int door = monkey; door <= n; door += monkey)', text: 'Monkey k visits k, 2k, 3k, …: step by k.' },
        { at: 'open[door] = !open[door];', text: 'Toggle: open ↔ closed.' },
      ],
    },
    {
      file: 'toggle-doors/DoorsSquares.java',
      title: 'Doors by mathematics',
      role: 'optimized',
      description: 'The number of perfect squares ≤ n is ⌊√n⌋. Works for n up to 10¹⁸.',
      walkthrough: [
        { at: '(long) Math.sqrt((double) n)', text: 'Floating-point sqrt may be off by one for large n (double has 53 bits of precision).' },
        { at: 'while (r * r > n) r--;', text: 'Correct an overestimate…' },
        { at: 'while ((r + 1) * (r + 1) <= n) r++;', text: '…and an underestimate. Now r is exactly ⌊√n⌋.' },
      ],
    },
  ],
  complexity: [
    p('**Simulation:** monkey k does ⌊n/k⌋ toggles; the total is n·(1 + 1/2 + … + 1/n) = **O(n log n)** (harmonic series). Space O(n).'),
    p('**Mathematical:** O(1) time and space (or O(log n) with a binary-search square root).'),
  ],
  mistakes: [
    { title: 'Toggling door j instead of door j·i (the slide code)', wrong: 'for (i = 1; i <= n; i++)\n    for (j = i; j * i <= n; j++)\n        b[j] = !b[j];   // toggles door j, not door i*j', why: 'The slide\'s loop never visits "every i-th door"; it toggles consecutive doors j with j·i ≤ n. For n = 100 it reports far more than 10 open doors.', fix: 'for (j = i; j <= n; j += i) b[j] = !b[j];' },
    { title: 'Counting open doors with floating-point sqrt', wrong: 'int open = (int) Math.sqrt(n);   // n up to 10^18', why: 'For large n the double rounding can give 999999999 or 1000000001 instead of 10⁹.', fix: 'Adjust with the two while-loops after Math.sqrt.' },
    { title: 'Using int for n', wrong: 'int n = sc.nextInt();   // n = 10^18', why: 'Does not fit in an int; Scanner throws InputMismatchException.', fix: 'long n = sc.nextLong();' },
  ],
  practice: [
    {
      id: 'door-ex1',
      level: 'beginner',
      title: 'Count the open doors',
      statement: 'Read n (≤ 1000) and simulate the monkeys. Print the number of doors that are open at the end.',
      examples: [{ input: '10', output: '3' }],
      hints: ['boolean[] and two loops.'],
      solutionFile: 'toggle-doors/Ex1.java',
      solutionExplain: 'Simulate every monkey and count the true cells.',
      tests: [{ stdin: '10\n', stdout: '3' }, { stdin: '100\n', stdout: '10' }, { stdin: '1\n', stdout: '1' }],
    },
    {
      id: 'door-ex2',
      level: 'intermediate',
      title: 'A trillion doors',
      statement: 'Read n up to 10¹⁸. Print how many doors are open.',
      examples: [{ input: '1000000000000000000', output: '1000000000' }],
      hints: ['Open doors are perfect squares.', 'Use an exact integer square root.'],
      solutionFile: 'toggle-doors/Ex2.java',
      solutionExplain: '⌊√n⌋ with a floating-point estimate corrected by two while-loops.',
      tests: [{ stdin: '1000000000000000000\n', stdout: '1000000000' }, { stdin: '99\n', stdout: '9' }, { stdin: '999999999999999999\n', stdout: '999999999' }],
    },
    {
      id: 'door-ex3',
      level: 'challenge',
      title: 'Only the first m monkeys',
      statement: 'Only monkeys 1..m are released (m ≤ n). Read n and m and print how many doors are open. (n ≤ 10⁶)',
      examples: [{ input: '10 3', output: '4' }],
      hints: ['A door is toggled once per divisor ≤ m.', 'Simulation over m monkeys is O(n log m).'],
      solutionFile: 'toggle-doors/Ex3.java',
      solutionExplain: 'The shortcut no longer applies (a door\'s toggle count is the number of divisors ≤ m), so simulate only the m monkeys.',
      tests: [{ stdin: '10 3\n', stdout: '4' }, { stdin: '10 10\n', stdout: '3' }, { stdin: '6 1\n', stdout: '6' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'After all 100 monkeys, how many doors are open?', options: ['5', '10', '25', '50'], answer: 1, explain: 'The perfect squares 1, 4, 9, …, 100.' },
    { type: 'mcq', q: 'Door 36 is toggled how many times?', options: ['8', '9', '10', '6'], answer: 1, explain: 'Divisors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36 — nine (odd), so it is open.' },
    { type: 'mcq', q: 'Why is the number of divisors odd only for perfect squares?', options: ['Primes have 2 divisors', 'Divisors pair up as (d, n/d) except when d = n/d', 'Squares are even', 'Because of overflow'], answer: 1, explain: 'The unpaired divisor √n makes the count odd.' },
    { type: 'mcq', q: 'The simulation\'s time complexity is…', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(√n)'], answer: 1, explain: 'Σ n/k = n H(n).' },
  ],
  interview: ['Why do only perfect squares stay open?', 'How would you compute ⌊√n⌋ exactly for n up to 10¹⁸?', 'What changes if the monkeys toggle only doors up to some limit?'],
  videos: ['a-toggle-doors', 'a-toggle-doors#2'],
  revision: ['Monkey k toggles multiples of k; door n flips once per divisor.', 'Odd number of divisors ⟺ perfect square.', 'Open doors = ⌊√n⌋.', 'Simulation O(n log n); formula O(1).'],
  sourceNotes: {
    discrepancies: ['The slide\'s `Toggle` program toggles b[j] for j from i while j·i ≤ n. That is not "every i-th door"; running it for n = 100 reports many more than 10 open doors. The lesson uses the correct inner loop `door += monkey`.', 'The deck combines two problems (this one and "Alice\'s Apple Tree"); each has its own lesson.'],
  },
});

// ───────────────────────────── Alice's apple tree ─────────────────────────────
export const aliceApple: Lesson = lesson({
  id: 'a-alice-apple-tree',
  module: 'm5',
  title: "Alice's Apple Tree (Minimum Garden Perimeter)",
  summary: 'Apples grow at every grid point; find the smallest square plot that contains enough — with a closed form and binary search.',
  level: 'advanced',
  track: 'archive',
  minutes: 45,
  essential: false,
  prerequisites: ['m1-loops', 'a-toggle-doors', 'm4-searching'],
  sources: ['Toggle-the-switch-_-Alice-Apple-tree'],
  objectives: [
    'Model the garden: tree (i, j) has |i| + |j| apples.',
    'Derive the apples in a ring and in a whole square: 12r² and 2r(r+1)(2r+1).',
    'Find the smallest r with a loop, then with binary search on a monotone function.',
    'Use `long` everywhere and avoid overflow.',
  ],
  intuition: [
    p('Alice stands at (0, 0) on an infinite grid. The tree at integer point (i, j) bears |i| + |j| apples. She wants a **square plot, centred at the origin and aligned with the axes**, that contains at least `neededApples` apples inside or on its border. What is the smallest possible **perimeter**?'),
    p('A square with half-side r has corners (±r, ±r) and perimeter 8r. Going from half-side r−1 to r adds a "ring". Counting the apples in that ring gives **12·r²** (the slide\'s `sum += 12*cnt*cnt`). Adding the rings 1..r:'),
    math('apples(r) = Σ 12k² (k = 1..r) = 2r(r + 1)(2r + 1) = 4r³ + 6r² + 2r'),
    p('That matches the slide\'s text: "The total apples is r·r·r·4 + r·r·6 + r·2." The answer is 8·r for the smallest r with apples(r) ≥ needed.'),
    why('apples(r) strictly increases with r, so the set of "good" values of r is an interval [r*, ∞). That monotone property is exactly what **binary search** needs: test the middle, discard half. The loop version adds ring by ring and is just as correct but takes O(r) steps, and r can be 500 000 for needed = 10¹⁵.'),
  ],
  syntax: [
    code(`
long lo = 1, hi = 1_000_000;                        // search the answer (the radius) itself
while (lo < hi) {
    long mid = lo + (hi - lo) / 2;
    if (apples(mid) >= needed) hi = mid; else lo = mid + 1;   // monotone yes/no test
}
return 8 * lo;                                       // perimeter of the square
static long apples(long r) { return 2 * r * (r + 1) * (2 * r + 1); }
`),
  ],
  tiny: [code(`
long apples = 0, r = 0;
while (apples < needed) {
    r++;
    apples += 12 * r * r;     // the ring at distance r
}
return 8 * r;
`)],
  guided: [
    p('Check: needed = 13 → r = 2 (apples(1) = 12 < 13, apples(2) = 60) → perimeter 16. needed = 1 → r = 1 → 8. needed = 10⁹ → r = 630 → perimeter **5040**.'),
    prog('alice-apple-tree/AppleTreeLoop.java', 'Simple: add ring by ring (the slide\'s program, with long)'),
    prog('alice-apple-tree/AppleTreeFormula.java', 'Optimized: binary search on the closed form'),
  ],
  dryRun: { algo: 'alice', input: { needed: '13' }, caption: 'Rings add 12, 48, 108, … apples.' },
  programs: [
    {
      file: 'alice-apple-tree/AppleTreeLoop.java',
      title: 'Ring by ring',
      role: 'simple',
      description: 'Adds 12r² for r = 1, 2, 3… until the total reaches the target. O(r).',
      walkthrough: [
        { at: 'long needed = sc.nextLong();', text: 'Targets up to 10¹⁵ do not fit in int.' },
        { at: 'apples += 12 * r * r;', text: 'All apples in the new ring: the slide uses exactly this term. `r` is long so r*r cannot overflow int.' },
        { at: 'minimum perimeter = " + 8 * r', text: 'A square of half-side r has perimeter 8r.' },
      ],
    },
    {
      file: 'alice-apple-tree/AppleTreeFormula.java',
      title: 'Binary search',
      role: 'optimized',
      description: 'Uses apples(r) = 2r(r+1)(2r+1). O(log R).',
      walkthrough: [
        { at: 'static long applesInside', text: 'The closed form of the ring sums.' },
        { at: 'long hi = 200_000;', text: 'An upper bound for r: apples(200000) ≈ 3.2 × 10¹⁶, which exceeds the largest allowed target of 10¹⁵, and the product still fits in a long.' },
        { at: 'if (applesInside(mid) >= needed)', text: 'mid is enough: the answer is mid or smaller.' },
        { at: 'lo = mid + 1;', text: 'mid is too small: the answer is larger.' },
      ],
    },
  ],
  complexity: [
    p('**Loop:** r iterations where r ≈ (needed/4)^(1/3) → **O(needed^(1/3))**. For needed = 10¹⁵ that is about 63 000… (r = 503 968 at 10¹⁵ — roughly half a million iterations, still instant).'),
    p('**Binary search:** log₂(200 000) ≈ 18 iterations → **O(log R)**.'),
    warn('Intermediate products: 2·r·(r+1)·(2r+1) for r = 200 000 is about 3.2 × 10¹⁶ ≪ 9.2 × 10¹⁸, so `long` is safe. With `int` it overflows already for r ≈ 800.'),
  ],
  mistakes: [
    { title: 'Using int (the slide)', wrong: 'int apple = sc.nextInt();\nint cnt = 0, sum = 0;\nsum += 12 * cnt * cnt;', why: 'The slide\'s code reads an int. 12·cnt² overflows int for cnt > 13 000 and the target itself may be up to 10¹⁵.', fix: 'long needed; long r; long apples;' },
    { title: 'Returning r instead of the perimeter', wrong: 'System.out.println(r);', why: 'The question asks for the perimeter 8r.', fix: 'System.out.println(8 * r);' },
    { title: 'Binary search with an unsafe upper bound', wrong: 'long hi = 1000;   // for needed up to 10^15', why: 'apples(1000) ≈ 4·10⁹ < 10¹⁵ so the search cannot find the answer.', fix: 'long hi = 200_000; or double hi until applesInside(hi) >= needed' },
  ],
  practice: [
    {
      id: 'apple-ex1',
      level: 'beginner',
      title: 'Apples in a square',
      statement: 'Read r. Print the number of apples inside the square with corners (±r, ±r).',
      examples: [{ input: '3', output: '168' }],
      hints: ['Use the closed form 2r(r+1)(2r+1).', 'Check r = 1: 12.'],
      solutionFile: 'alice-apple-tree/Ex1.java',
      solutionExplain: 'Direct evaluation of the closed form in long arithmetic.',
      tests: [{ stdin: '3\n', stdout: '168' }, { stdin: '1\n', stdout: '12' }, { stdin: '2\n', stdout: '60' }],
    },
    {
      id: 'apple-ex2',
      level: 'intermediate',
      title: 'Minimum perimeter (small)',
      statement: 'Read neededApples (≤ 10⁹) and print the minimum perimeter.',
      examples: [{ input: '13', output: '16' }],
      hints: ['Add the rings 12r² until the total is ≥ needed.'],
      solutionFile: 'alice-apple-tree/Ex2.java',
      solutionExplain: 'Ring-by-ring accumulation in long.',
      tests: [{ stdin: '13\n', stdout: '16' }, { stdin: '1\n', stdout: '8' }, { stdin: '1000000000\n', stdout: '5040' }],
    },
    {
      id: 'apple-ex3',
      level: 'challenge',
      title: 'Minimum perimeter (large)',
      statement: 'Read neededApples (≤ 10¹⁵) and print the minimum perimeter, using binary search.',
      examples: [{ input: '1000000000000000', output: '503968' }],
      hints: ['apples(r) = 2r(r+1)(2r+1) is increasing.', 'hi = 200000 is a valid upper bound.'],
      solutionFile: 'alice-apple-tree/Ex3.java',
      solutionExplain: 'Binary search for the smallest r with apples(r) ≥ needed; answer 8r.',
      tests: [{ stdin: '1000000000000000\n', stdout: '503968' }, { stdin: '13\n', stdout: '16' }, { stdin: '1\n', stdout: '8' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'How many apples are in the ring at distance r = 2?', options: ['24', '48', '60', '12'], answer: 1, explain: '12·2² = 48 (and 12 + 48 = 60 inside the r = 2 square).' },
    { type: 'output', q: 'What does applesInside(2) return?', code: 'static long applesInside(long r) {\n    return 2 * r * (r + 1) * (2 * r + 1);\n}', answer: '60', explain: '2·2·3·5 = 60.' },
    { type: 'mcq', q: 'Why can binary search be used here?', options: ['The array is sorted', 'apples(r) is monotonically increasing', 'r is always even', 'The answer is a prime'], answer: 1, explain: 'More rings always mean more apples.' },
    { type: 'mcq', q: 'What is the perimeter of the square with half-side r?', options: ['4r', '8r', 'r²', '2r + 2'], answer: 1, explain: 'Side length 2r, four sides: 8r.' },
  ],
  interview: ['Derive the number of apples in the r-th ring.', 'Why is binary search valid and what is its upper bound?', 'How do you avoid overflow?'],
  videos: ['a-alice-apple-tree', 'a-alice-apple-tree#2'],
  revision: ['Ring r holds 12r² apples; square of half-side r holds 2r(r+1)(2r+1).', 'Perimeter = 8r.', 'Smallest r with apples(r) ≥ needed → loop or binary search.', 'Use long: 10¹⁵ needs r ≈ 503 968.'],
  sourceNotes: {
    discrepancies: ['The slide\'s code uses int and a linear loop although the text on the previous slide says "then we apply binary search". Both appear here; the long type is required for the full constraint range (this is LeetCode 1954, "Minimum Garden Perimeter to Collect Enough Apples").'],
    assumptions: ['The problem statement is only given in diagrams on the slides; the lesson uses the standard statement (square centred at the origin, tree at (i, j) with |i| + |j| apples).'],
  },
});

// ───────────────────────────── Weighted substring ─────────────────────────────
export const weightedSubstring: Lesson = lesson({
  id: 'a-weighted-substring',
  dryRun: { algo: 'weighted-string', input: { w: '100' }, caption: 'Greedy from the heaviest letter: 100 = 60 + 3×12 + 3 + 1.' },
  module: 'm5',
  title: 'Weighted Substring (Smallest String of a Given Weight)',
  summary: 'Letters have factorial-like weights; build the shortest, then alphabetically smallest, string with a given total weight.',
  level: 'advanced',
  track: 'archive',
  minutes: 50,
  essential: false,
  prerequisites: ['m2-strings', 'm4-searching', 'm3-sorting-comparators'],
  sources: ['Weightes-substring'],
  objectives: [
    'Generate the letter weights A = 1, B = 3, C = 12, D = 60 … from the rule weight(n) = n·weight(n−1) + weight(n−1).',
    'Explain why the greedy "biggest letter first" gives the fewest letters.',
    'Sort the letters to get the lexicographically smallest string of that length.',
    'Use long (weights reach 10¹⁶) and stop generating before overflow.',
  ],
  intuition: [
    p('The weight of a letter depends on the previous one: A = 1, B = 2·A + A = 3, C = 3·B + B = 12, D = 4·C + C = 60 … so each weight is **(position + 1) × previous weight** (B = 3·1, C = 4·3, D = 5·12). These are the numbers 2!/2, 3!/2, 4!/2, 5!/2 … = 1, 3, 12, 60, 360, 2520 …'),
    p('The weight of a string is the sum of its letters\' weights. Given a target weight W, find the **shortest** string with exactly that weight and, among shortest strings, the **lexicographically smallest**. For W = 25 the strings `ABBBBC`, `ACC`, `AAAAAAABBBBBB` all weigh 25; the shortest is `ACC`.'),
    why('Each weight divides the next one (1 | 3 | 12 | 60 | …), like coins in a currency where each coin is a multiple of the previous. For such "canonical" coin systems the **greedy** strategy — always take the largest coin that fits — uses the fewest coins. Which letters appear is therefore fixed; to make the string alphabetically smallest, simply put them in ascending order.'),
    pre(`
W = 20     largest weight ≤ 20 is C = 12 → C, remaining 8
           largest ≤ 8 is B = 3          → B, remaining 5
           B again                        → B, remaining 2
           A, A                           → remaining 0
letters  C B B A A   sorted →  A A B B C
`),
  ],
  syntax: [
    code(`
char letter = (char) ('A' + index);                 // 0 -> 'A', 1 -> 'B', …
List<Character> letters = new ArrayList<>();
letters.add(letter);
Collections.sort(letters);                          // smallest letters first
StringBuilder sb = new StringBuilder();
for (char c : letters) sb.append(c);
String result = sb.toString();
long next = weight * (n + 1);                       // use long: weights grow factorially
`),
  ],
  tiny: [code(`
long[] w = {1, 3, 12, 60, 360};
long remaining = 20;
for (int i = w.length - 1; i >= 0; i--)
    while (remaining >= w[i]) { /* take letter i */ remaining -= w[i]; }
`)],
  guided: [
    prog('weighted-substring/WeightedString.java', 'Complete program: weights, greedy choice, sorted output (sample input 20 → AABBC)'),
    note('The slide uses a binary search (`findFloor`) to find the largest weight ≤ k each time. With at most 17 usable weights a simple backwards loop is just as fast; the binary search matters only if the alphabet were huge.'),
  ],
  programs: [
    {
      file: 'weighted-substring/WeightedString.java',
      title: 'Smallest string of a given weight',
      role: 'optimized',
      description: 'Builds weights up to the limit, takes letters greedily from the largest, then sorts.',
      walkthrough: [
        { at: 'long cur = 1;', text: 'weight(A) = 1.' },
        { at: 'long next = cur * (n + 1);', text: 'weight(n) = (n+1) · weight(n−1): this is "n·prev + prev".' },
        { at: 'if (next > limit', text: 'No letter heavier than the target is ever needed; stopping early also prevents overflow (26 letters would overflow long).' },
        { at: 'while (remaining >= w[i])', text: 'Greedy: use the current letter as many times as it fits.' },
        { at: 'Collections.sort(letters);', text: 'Ascending order is the lexicographically smallest arrangement of this multiset.' },
      ],
    },
  ],
  complexity: [
    p('Weights grow factorially, so only about 17 letters are ever below 10¹⁶. The greedy loop takes at most the sum over letters of (weight(next)/weight(this)) − 1 ≤ i + 1 copies each — at most ~160 letters. Time **O(L²)** or O(L log L) with the sort where L = answer length (tiny); space O(L).'),
  ],
  mistakes: [
    { title: 'int weights (the slide)', wrong: 'static int[] values = new int[26];', why: 'weight(M) = 14!/2 ≈ 4.4 × 10¹⁰ already overflows int and the constraint is up to 10¹⁶.', fix: 'long[] and a stopping rule' },
    { title: 'Computing all 26 weights', wrong: 'for (int i = 1; i < 26; i++) values[i] = (i + 1) * prev + prev;', why: 'weight(Z) = 27!/2 ≈ 5 × 10²⁷ overflows even long, giving negative nonsense that confuses the search.', fix: 'Stop when the next weight exceeds the target.' },
    { title: 'Printing without sorting', wrong: 'print letters in the order they were chosen (largest first): "CBBAA"', why: 'The task asks for the lexicographically smallest string, "AABBC".', fix: 'sort ascending (the slide reverses its list, which gives the same effect)' },
  ],
  practice: [
    {
      id: 'wsub-ex1',
      level: 'beginner',
      title: 'Weight of a string',
      statement: 'Read a string of uppercase letters and print its total weight (A=1, B=3, C=12, …, with weight(n) = (n+1)·weight(n−1)).',
      constraints: ['length ≤ 10', 'only letters A–J'],
      examples: [{ input: 'ACC', output: '25' }],
      hints: ['Build the weight table once.', 'Sum table[c − \'A\'].'],
      solutionFile: 'weighted-substring/Ex1.java',
      solutionExplain: 'Table lookup per character; sum in long.',
      tests: [{ stdin: 'ACC\n', stdout: '25' }, { stdin: 'AABBC\n', stdout: '20' }, { stdin: 'D\n', stdout: '60' }],
    },
    {
      id: 'wsub-ex2',
      level: 'intermediate',
      title: 'Smallest string',
      statement: 'Read a weight W (1 ≤ W ≤ 10¹⁶) and print the shortest string of weight W, choosing the lexicographically smallest among the shortest.',
      examples: [{ input: '25', output: 'ACC' }, { input: '20', output: 'AABBC' }],
      hints: ['Greedy from the heaviest letter that fits.', 'Sort at the end.'],
      solutionFile: 'weighted-substring/Ex2.java',
      solutionExplain: 'Each weight divides the next, so greedy gives the minimum count; ascending order gives the smallest string.',
      tests: [{ stdin: '25\n', stdout: 'ACC' }, { stdin: '20\n', stdout: 'AABBC' }, { stdin: '1\n', stdout: 'A' }, { stdin: '60\n', stdout: 'D' }],
    },
    {
      id: 'wsub-ex3',
      level: 'challenge',
      title: 'Normalise a string',
      statement: 'Read a string of uppercase letters (up to 10⁵ characters). Print the shortest, lexicographically smallest string with the same total weight — without ever computing the (possibly huge) total.',
      examples: [{ input: 'AAAAB', output: 'ABB', explain: 'Weight 4·1 + 3 = 7 = 3 + 3 + 1. Three A\'s carry into one B, leaving one A and two B\'s.' }],
      hints: ['(i + 2) copies of letter i weigh the same as one copy of letter i + 1 (A: 3 copies = B; B: 4 copies = C).', 'Count letters, then carry from A upwards like long addition.'],
      solutionFile: 'weighted-substring/Ex3.java',
      solutionExplain: 'A mixed-radix number system: carry count[i] / (i + 2) into the next letter and keep the remainder.',
      tests: [{ stdin: 'AAAAB\n', stdout: 'ABB' }, { stdin: 'AAA\n', stdout: 'B' }, { stdin: 'BBBB\n', stdout: 'C' }, { stdin: 'AABBC\n', stdout: 'AABBC' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'What is the weight of D?', options: ['12', '36', '60', '120'], answer: 2, explain: 'D = 4·C + C = 5·12 = 60.' },
    { type: 'mcq', q: 'Shortest string of weight 25?', options: ['ABBBBC', 'ACC', 'AAAAAAABBBBBB', 'BBBBBBBBA'], answer: 1, explain: '12 + 12 + 1 = 25 with just 3 letters.' },
    { type: 'output', q: 'What string does the lesson\'s method produce for weight 7?', code: '// weights A=1 B=3 C=12', answer: 'ABB', explain: 'Greedy takes B (3), B (3), then A (1): 3 + 3 + 1 = 7. Sorted: ABB.' },
    { type: 'mcq', q: 'Why does greedy work for these weights?', options: ['They are prime', 'Each weight divides the next', 'They are powers of two', 'Because letters are sorted'], answer: 1, explain: 'Divisibility makes the coin system canonical.' },
  ],
  interview: ['Why is greedy optimal when each coin divides the next?', 'Give a coin system where greedy fails.', 'How would you handle weights up to 10¹⁸ or more?'],
  videos: ['a-weighted-substring', 'a-weighted-substring#2'],
  revision: ['weight(n) = (n+1)·weight(n−1): 1, 3, 12, 60, 360 …', 'Greedy largest-first = fewest letters; sort for lexicographic order.', 'Use long; stop generating weights at the target.', 'Answer length is tiny (≤ ~160).'],
  sourceNotes: {
    discrepancies: ['The slide says the output "should be in the form of integer" but its sample output is the string AABBC for input 20 (a string, not an integer).', 'The slide stores weights in int[26] (overflows) and reads the weight with nextInt although the constraint is up to 10¹⁶.'],
  },
});
