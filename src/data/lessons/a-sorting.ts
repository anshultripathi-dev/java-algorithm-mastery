import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

// ───────────────────────────── Selection sort ─────────────────────────────
export const selectionSort: Lesson = lesson({
  id: 'a-selection-sort',
  module: 'm5',
  title: 'Selection Sort',
  summary: 'Repeatedly select the smallest remaining element and swap it into place — simple, always O(n²), at most n−1 swaps.',
  level: 'beginner',
  track: 'archive',
  minutes: 35,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm1-loops', 'm1-methods'],
  sources: ['Quick_-Selection-Sort'],
  objectives: [
    'Trace selection sort on an array and show the sorted/unsorted split after every pass.',
    'Write the nested loops with a `minIndex` variable and a single swap per pass.',
    'State its time (O(n²) always), space (O(1)), stability (not stable) and swap count.',
    'Explain when its few swaps matter.',
  ],
  intuition: [
    p('Imagine sorting a hand of cards. Look through the whole hand, pick the **smallest** card and put it at the left end. Then look through the remaining cards, pick the smallest and place it second. Repeat. After each pass the left part of the array is sorted **and final**.'),
    pre(`
64 25 12 22 11      pass 1: minimum is 11 → swap with 64
11 25 12 22 64      pass 2: minimum of [25 12 22 64] is 12 → swap with 25
11 12 25 22 64      pass 3: minimum of [25 22 64] is 22 → swap with 25
11 12 22 25 64      pass 4: minimum of [25 64] is 25 → already in place
11 12 22 25 64      sorted
`),
    why('After pass i the first i elements are the i smallest values in order — they can never need to move again. Each pass shrinks the unsorted part by one, so n−1 passes sort the array. The swap puts the minimum in its final position in a single move, which is why selection sort performs at most **n−1 swaps** — the fewest of the simple sorts.'),
  ],
  syntax: [
    code(`
for (int i = 0; i < n - 1; i++) {                  // i = first index of the unsorted part
    int min = i;
    for (int j = i + 1; j < n; j++)                // scan the rest
        if (a[j] < a[min]) min = j;
    if (min != i) { int t = a[i]; a[i] = a[min]; a[min] = t; }   // at most n - 1 swaps overall
}
`),
  ],
  tiny: [code(`
int minIndex = i;
for (int j = i + 1; j < n; j++)
    if (a[j] < a[minIndex]) minIndex = j;
int t = a[minIndex]; a[minIndex] = a[i]; a[i] = t;
`)],
  guided: [
    prog('quick-selection-sort/SelectionSort.java', 'Selection sort with the array printed after every pass'),
    note('On the slide the intermediate arrays are drawn as "[11 | 64 25 12 22]" — i.e. the minimum moved to the front and the other elements shifted right. Real selection sort **swaps**, so the rest of the array is `[25 12 22 64]` (64 goes to where 11 was). Both end sorted, but the program prints what the code really does.'),
  ],
  dryRun: { algo: 'selection-sort', input: { arr: '64,25,12,22,11' }, caption: 'The sorted prefix grows by one element per pass.' },
  programs: [
    {
      file: 'quick-selection-sort/SelectionSort.java',
      title: 'Selection sort',
      role: 'simple',
      description: 'In-place, O(n²) comparisons, at most n−1 swaps.',
      walkthrough: [
        { at: 'for (int i = 0; i < n - 1; i++)', text: 'Pass i fixes position i. The last element is automatically in place after n−1 passes.' },
        { at: 'int minIndex = i;', text: 'Assume the first unsorted element is the smallest…' },
        { at: 'if (a[j] < a[minIndex])', text: '…and look for a smaller one in the rest. Strict `<` keeps the first of equal minima.' },
        { at: 'int temp = a[minIndex];', text: 'Exactly one swap per pass puts the minimum at index i.' },
      ],
    },
  ],
  complexity: [
    p('Pass i makes n−1−i comparisons whatever the data looks like → (n−1) + (n−2) + … + 1 = n(n−1)/2 comparisons → **O(n²) in best, average and worst case**. Swaps ≤ n−1. Space O(1) (in place).'),
    table(['n', 'comparisons', 'swaps (max)'], [['10', '45', '9'], ['1 000', '499 500', '999'], ['100 000', '≈ 5 × 10⁹', '99 999']]),
    p('**Not stable:** swapping a far-away minimum over equal elements can reorder them (`[3a, 3b, 1]` → `[1, 3b, 3a]`). Useful when writes are expensive (flash memory) because swaps are minimal.'),
  ],
  mistakes: [
    { title: 'Swapping inside the inner loop', wrong: 'if (a[j] < a[i]) swap(a, i, j);   // inside the j-loop', why: 'This "exchange sort" does up to O(n²) swaps and is a different (worse) algorithm, though it also sorts.', fix: 'Remember minIndex and swap once after the loop.' },
    { title: 'Off-by-one in the outer loop', wrong: 'for (int i = 0; i < n; i++) {   // inner loop j = i + 1 → fine', why: 'It works, but the last pass does nothing. Using i ≤ n−1 elsewhere with a[j+1] causes an out-of-bounds read.', fix: 'for (int i = 0; i < n - 1; i++)' },
    { title: 'Using <= to compare', wrong: 'if (a[j] <= a[minIndex]) minIndex = j;', why: 'Picks the LAST of several equal minima, increasing the number of reorderings of equal keys.', fix: 'if (a[j] < a[minIndex])' },
  ],
  practice: [
    {
      id: 'sel-ex1',
      level: 'beginner',
      title: 'Sort and count swaps',
      statement: 'Read n and an array. Sort it with selection sort and print the sorted array on one line, then the number of swaps that actually moved something (skip a swap when minIndex = i).',
      examples: [{ input: '5\n64 25 12 22 11', output: '11 12 22 25 64\n3' }],
      hints: ['Count a swap only when minIndex != i.'],
      solutionFile: 'quick-selection-sort/Ex1.java',
      solutionExplain: 'Standard selection sort with a counter around the swap.',
      tests: [{ stdin: '5\n64 25 12 22 11\n', stdout: '11 12 22 25 64\n3' }, { stdin: '3\n1 2 3\n', stdout: '1 2 3\n0' }, { stdin: '4\n4 3 2 1\n', stdout: '1 2 3 4\n2' }],
    },
    {
      id: 'sel-ex2',
      level: 'intermediate',
      title: 'Largest first',
      statement: 'Sort an array in DESCENDING order using the same idea (select the maximum). Print on one line.',
      examples: [{ input: '5\n3 1 4 1 5', output: '5 4 3 1 1' }],
      hints: ['Only the comparison changes.'],
      solutionFile: 'quick-selection-sort/SelEx2.java',
      solutionExplain: 'Select the largest remaining value in each pass.',
      tests: [{ stdin: '5\n3 1 4 1 5\n', stdout: '5 4 3 1 1' }, { stdin: '1\n7\n', stdout: '7' }, { stdin: '3\n-1 -5 -3\n', stdout: '-1 -3 -5' }],
    },
    {
      id: 'sel-ex3',
      level: 'challenge',
      title: 'K smallest, cheaply',
      statement: 'Read n, k and an array. Print the k smallest values in increasing order using only k passes of selection (O(n·k)).',
      constraints: ['1 ≤ k ≤ n ≤ 5000'],
      examples: [{ input: '6 3\n7 10 4 3 20 15', output: '3 4 7' }],
      hints: ['You do not have to finish the sort: stop after k passes.'],
      solutionFile: 'quick-selection-sort/SelEx3.java',
      solutionExplain: 'Reuse selection: after k passes the first k positions hold the k smallest in order.',
      tests: [{ stdin: '6 3\n7 10 4 3 20 15\n', stdout: '3 4 7' }, { stdin: '3 3\n3 2 1\n', stdout: '1 2 3' }, { stdin: '4 1\n9 8 7 6\n', stdout: '6' }],
    },
  ],
  quiz: [
    { type: 'output', q: 'What is the array after the 2nd pass?', code: 'int[] a = {29, 10, 14, 37, 13};\n// selection sort', answer: '10 13 14 37 29', explain: 'Pass 1: swap 10 with 29 → 10 29 14 37 13. Pass 2: min of rest is 13 → swap with 29 → 10 13 14 37 29.' },
    { type: 'mcq', q: 'How many comparisons does selection sort make on 6 elements, whatever their order?', options: ['5', '10', '15', '36'], answer: 2, explain: '5 + 4 + 3 + 2 + 1 = 15.' },
    { type: 'mcq', q: 'Which property is TRUE of selection sort?', options: ['Stable', 'At most n−1 swaps', 'O(n) best case', 'Uses extra O(n) memory'], answer: 1, explain: 'One swap per pass at most.' },
    { type: 'mcq', q: 'Best-case time complexity of selection sort?', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 2, explain: 'It always scans the entire unsorted part.' },
  ],
  interview: ['Why is selection sort not stable? Give an example.', 'When would you prefer selection sort?', 'How many swaps does it make in the worst case?', 'Compare with insertion sort.'],
  videos: ['a-selection-sort', 'a-selection-sort#2'],
  revision: ['Find minimum of the unsorted part, swap to the front, repeat.', 'O(n²) always; ≤ n−1 swaps; in place; not stable.', 'After pass i: first i+1 elements final.'],
  sourceNotes: {
    discrepancies: ['The slide shows each iteration as "sorted [11], unsorted [64, 25, 12, 22]", which looks like the minimum was inserted at the front and the rest shifted. The slide\'s code swaps instead, giving [25, 12, 22, 64] after pass 1. The program output matches the code.', 'The slide describes Quick sort and Selection sort in the same deck; they are split into two lessons here.'],
  },
});

// ───────────────────────────── Quick sort ─────────────────────────────
export const quickSort: Lesson = lesson({
  id: 'a-quick-sort',
  module: 'm5',
  title: 'Quick Sort',
  summary: 'Pick a pivot, partition the array around it, and recursively sort the two parts: divide and conquer in place.',
  level: 'intermediate',
  track: 'archive',
  minutes: 55,
  essential: true,
  prerequisites: ['m2-recursion', 'a-selection-sort', 'm4-paradigms'],
  sources: ['Quick_-Selection-Sort'],
  objectives: [
    'Explain divide and conquer and why one partition places the pivot in its final position.',
    'Implement Lomuto partitioning and the recursive driver.',
    'Derive best/average O(n log n) and worst-case O(n²) and say what triggers the worst case.',
    'Use quickselect to find the k-th smallest element in expected O(n).',
  ],
  intuition: [
    p('**Quick sort** is divide and conquer. Choose one element as the **pivot**. Rearrange the array so that everything ≤ pivot is on its left and everything > pivot is on its right — this is called **partitioning**. The pivot is now in its final sorted position! Then sort the left part and the right part the same way.'),
    pre(`
[8 3 1 7 0 10 2]   pivot = last element = 2
 partition →  [1 0 | 2 | 7 3 10 8]
               ≤2   pivot  >2
 sort [1 0] → [0 1]       sort [7 3 10 8] → [3 7 8 10]
 result  [0 1 2 3 7 8 10]
`),
    why('Partitioning does O(n) work and fixes one element permanently. If the pivot splits the array roughly in half, the recursion depth is log n and every level does O(n) total work: O(n log n). If the pivot is always the smallest or largest element (e.g. a sorted array with a last-element pivot) one part is empty each time, the depth is n and the total work is O(n²). Randomising the pivot or choosing the median of three makes the bad case very unlikely.'),
    h('Lomuto partition in words'),
    p('Keep an index `i` marking the end of the "≤ pivot" region. Scan j from left to right; whenever `a[j] ≤ pivot` grow the region (`i++`) and swap `a[j]` into it. Finally swap the pivot into position `i + 1`.'),
  ],
  syntax: [
    code(`
static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;                          // 0 or 1 element
    int p = partition(a, lo, hi);                   // pivot lands on its final index p
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}
static int partition(int[] a, int lo, int hi) {    // Lomuto: pivot = last element
    int pivot = a[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) { i++; int t = a[i]; a[i] = a[j]; a[j] = t; }
    int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;
    return i + 1;
}
// randomised pivot avoids the sorted-input worst case:
int r = java.util.concurrent.ThreadLocalRandom.current().nextInt(lo, hi + 1);   // then swap a[r] and a[hi]
`),
  ],
  tiny: [code(`
int pivot = a[high];
int i = low - 1;
for (int j = low; j < high; j++)
    if (a[j] <= pivot) { i++; swap(a, i, j); }
swap(a, i + 1, high);
`)],
  guided: [
    prog('quick-selection-sort/QuickSort.java', 'Quick sort (Lomuto) printing each pivot placement'),
    prog('quick-selection-sort/SortCheck.java', 'Both sorts agree with Arrays.sort on 5000 random arrays'),
    note('For the slide\'s array `[8, 3, 1, 7, 0, 10, 2]` the slide says one partition gives `[1, 0, 2, 7, 8, 10, 3]`. The slide\'s own Lomuto code produces `[1, 0, 2, 7, 3, 10, 8]` — also a valid partition (everything left of 2 is ≤ 2, everything right is > 2) with the pivot at index 2.'),
  ],
  dryRun: { algo: 'quick-sort', input: { arr: '8,3,1,7,0,10,2' }, caption: 'Pivot placements and the shrinking sub-arrays.' },
  programs: [
    {
      file: 'quick-selection-sort/QuickSort.java',
      title: 'Quick sort with Lomuto partition',
      role: 'optimized',
      description: 'Expected O(n log n), worst O(n²), O(log n) average recursion depth.',
      walkthrough: [
        { at: 'int pivot = a[high];', text: 'The last element is the pivot (simple, but bad for already-sorted input).' },
        { at: 'int i = low - 1;', text: '`i` is the last index of the "≤ pivot" region; it starts empty.' },
        { at: 'if (a[j] <= pivot)', text: 'This element belongs in the left region: extend it and swap it in.' },
        { at: 'int t = a[i + 1];', text: 'Put the pivot between the two regions; it is now final.' },
        { at: 'if (low < high)', text: 'Base case: 0 or 1 elements are already sorted.' },
        { at: 'quickSort(a, low, p - 1);', text: 'Sort everything left of the pivot…' },
        { at: 'quickSort(a, p + 1, high);', text: '…and everything right of it. The pivot itself needs no more work.' },
      ],
    },
    {
      file: 'quick-selection-sort/SortCheck.java',
      title: 'Randomised verification',
      role: 'demo',
      description: 'Sorts 5 000 random arrays with many duplicates and negative numbers and compares with Arrays.sort.',
      walkthrough: [{ at: 'rnd.nextInt(10) - 5', text: 'Small value range = many duplicates, which is where partition bugs (`<` vs `<=`) show up.' }],
    },
  ],
  complexity: [
    p('Let T(n) be the time to sort n elements. A partition costs n. A balanced split gives T(n) = 2T(n/2) + n = **O(n log n)**; an unbalanced split T(n) = T(n−1) + n = **O(n²)**.'),
    table(['case', 'time', 'when'], [['best', 'O(n log n)', 'pivot near the median every time'], ['average', 'O(n log n)', 'random data / random pivot'], ['worst', 'O(n²)', 'sorted/reverse-sorted input with first/last pivot, or all equal elements with ≤ partitioning']]),
    p('Space: **O(log n)** average for the recursion stack (O(n) worst case). In place, not stable. Recurse into the smaller part first (and loop on the larger) to guarantee O(log n) stack.'),
  ],
  mistakes: [
    { title: 'Quick sort on sorted data with last-element pivot', wrong: 'quickSort(sortedArray)   // n = 100 000', why: 'Every partition peels one element: depth 100 000 → StackOverflowError and O(n²) time.', fix: 'Random pivot or median-of-three: swap a random element into a[high] first.' },
    { title: 'Infinite recursion from the pivot index', wrong: 'quickSort(a, low, p);   // should be p - 1', why: 'The pivot is already in place; including it can leave the sub-problem the same size forever.', fix: 'quickSort(a, low, p - 1); quickSort(a, p + 1, high);' },
    { title: 'Wrong swap temp', wrong: 'a[i] = a[j]; a[j] = a[i];', why: 'The first assignment destroys the old a[i]; both end up equal.', fix: 'int t = a[i]; a[i] = a[j]; a[j] = t;' },
  ],
  practice: [
    {
      id: 'qs-ex1',
      level: 'beginner',
      title: 'Count the partitions',
      statement: 'Quick sort the array with the lesson\'s Lomuto code. Read n and the array; print the sorted array. (Implement quick sort yourself; the output is simply the sorted array.)',
      examples: [{ input: '7\n8 3 1 7 0 10 2', output: '0 1 2 3 7 8 10' }],
      hints: ['partition returns the pivot\'s final index.', 'Recurse on both sides.'],
      solutionFile: 'quick-selection-sort/QuickSortEx1.java',
      solutionExplain: 'The lesson\'s algorithm with the output formatted as one line.',
      tests: [{ stdin: '7\n8 3 1 7 0 10 2\n', stdout: '0 1 2 3 7 8 10' }, { stdin: '1\n5\n', stdout: '5' }, { stdin: '5\n2 2 2 2 2\n', stdout: '2 2 2 2 2' }],
    },
    {
      id: 'qs-ex2',
      level: 'intermediate',
      title: 'Descending quick sort',
      statement: 'Sort the array in descending order using quick sort.',
      examples: [{ input: '5\n3 1 4 1 5', output: '5 4 3 1 1' }],
      hints: ['Flip the comparison in the partition: move elements ≥ pivot to the left region.'],
      solutionFile: 'quick-selection-sort/QuickSortEx2.java',
      solutionExplain: 'Partition by "≥ pivot goes left" and recurse as before.',
      tests: [{ stdin: '5\n3 1 4 1 5\n', stdout: '5 4 3 1 1' }, { stdin: '2\n1 2\n', stdout: '2 1' }, { stdin: '1\n0\n', stdout: '0' }],
    },
    {
      id: 'qs-ex3',
      level: 'challenge',
      title: 'k-th smallest with quickselect',
      statement: 'Read n, k and an array. Print the k-th smallest element (1-based) in expected O(n) time without fully sorting.',
      examples: [{ input: '6 3\n7 10 4 3 20 15', output: '7' }],
      hints: ['After a partition the pivot is at index p. If p == k−1 you are done; otherwise only recurse into ONE side.'],
      solutionFile: 'quick-selection-sort/Ex3.java',
      solutionExplain: 'Quickselect discards the side that cannot contain the k-th element, so the work forms a geometric series ≈ 2n.',
      tests: [{ stdin: '6 3\n7 10 4 3 20 15\n', stdout: '7' }, { stdin: '3 1\n9 8 7\n', stdout: '7' }, { stdin: '4 4\n1 2 3 4\n', stdout: '4' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'After one partition, the pivot is…', options: ['at the middle always', 'in its final sorted position', 'at index 0', 'removed'], answer: 1, explain: 'Everything left is ≤ and everything right is >.' },
    { type: 'mcq', q: 'Worst-case time of quick sort?', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 2, explain: 'Highly unbalanced partitions.' },
    { type: 'output', q: 'What does partition return for this call?', code: 'int[] a = {3, 8, 2, 5, 1, 4, 7, 6};\nint p = partition(a, 0, 7);   // pivot = a[7] = 6\nSystem.out.println(p);', answer: '5', explain: 'Five elements (3, 2, 5, 1, 4) are ≤ 6 so the pivot goes to index 5.' },
    { type: 'mcq', q: 'Which strategy is used by quick sort?', kind: 'choose-algorithm', options: ['Greedy', 'Divide and conquer', 'Dynamic programming', 'Brute force'], answer: 1, explain: 'Partition, then solve the two halves independently.' },
    { type: 'mcq', q: 'Is quick sort stable?', options: ['Yes', 'No'], answer: 1, explain: 'Partitioning swaps distant elements, so equal keys may be reordered.' },
  ],
  interview: ['Why is quick sort usually faster than merge sort in practice?', 'How do you avoid the O(n²) worst case?', 'What is quickselect and its complexity?', 'Hoare vs Lomuto partitioning?'],
  videos: ['a-quick-sort', 'a-quick-sort#2'],
  revision: ['Pivot → partition (≤ left, > right) → recurse both sides.', 'Lomuto: i = low−1; scan j; if a[j] ≤ pivot {i++; swap}; swap pivot to i+1.', 'Average O(n log n), worst O(n²), space O(log n), in place, unstable.', 'Quickselect: recurse on one side only.'],
  sourceNotes: {
    discrepancies: ['The slide\'s worked example gives the partition result `[1, 0, 2, 7, 8, 10, 3]`; the code produces `[1, 0, 2, 7, 3, 10, 8]`. Then the slide partitions `[7, 8, 10, 3]` with pivot 3 as `[7, 8, 3, 10]`, which is also not what Lomuto does (`[3, 8, 10, 7]`). The final sorted result on the slide is correct.'],
  },
});
