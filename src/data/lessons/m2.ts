import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

export const arrays1d: Lesson = lesson({
  id: 'm2-arrays-1d',
  dryRun: { algo: 'array-scan', input: { arr: '7,3,9,4,9,2' }, caption: 'One pass over an array keeping the best value so far.' },
  module: 'm2',
  title: 'One-Dimensional Arrays',
  summary: 'A fixed-size, indexed list of values of one type: create, traverse, search, reverse, copy — and the aliasing trap.',
  level: 'beginner',
  track: 'core',
  minutes: 40,
  essential: true,
  prerequisites: ['m1-loops', 'm1-methods'],
  sources: ['Block-Swap-Algorithm'],
  objectives: [
    'Declare, create and initialise arrays; read and write elements by index.',
    'Traverse with indexed loops and for-each; know the valid index range 0 … length − 1.',
    'Write the standard array algorithms: sum, maximum, reverse, frequency count.',
    'Distinguish copying an array from aliasing it, and use `java.util.Arrays`.',
  ],
  intuition: [
    p('An **array** is a numbered row of boxes holding values of the same type, created with a fixed **length**. Elements are accessed by **index**, starting at 0.'),
    pre(`
int[] a = {10, 29, 35, 77, 88};
index :   0   1   2   3   4          a.length == 5
value :  10  29  35  77  88          last index = a.length - 1
`),
    why('Elements live next to each other in memory, so `a[i]` is found with one multiplication and one addition — **O(1) time** whatever the array size. The price: the length is fixed when the array is created, and inserting in the middle means shifting everything after it (O(n)). Because arrays are **objects**, an array variable holds a *reference* — a copy of the variable shares the same elements.'),
    table(['task', 'code'], [['create 5 zeros', 'int[] a = new int[5];'], ['literal', 'int[] a = {2, 3, 5, 7};'], ['length', 'a.length   (no parentheses!)'], ['last element', 'a[a.length - 1]'], ['print', 'Arrays.toString(a)'], ['sort / copy / fill', 'Arrays.sort(a);  Arrays.copyOf(a, n);  Arrays.fill(a, v);'], ['compare contents', 'Arrays.equals(a, b)   (a == b compares references)']]),
  ],
  syntax: [
    code(`
int[] a = new int[5];                 // five zeros; length is fixed
int[] b = {3, 1, 4};                  // initialiser list
int[] c = new int[]{1, 2, 3};
a[0] = 10;  int x = a[2];             // index 0 .. a.length - 1
int n = a.length;                     // a field, not a method (no parentheses)
for (int v : b) System.out.println(v);
`, 'Declare, create, index'),
    table(['java.util.Arrays', 'does'], [['Arrays.toString(a)', 'text like `[3, 1, 4]`'], ['Arrays.sort(a)', 'ascending, in place'], ['Arrays.fill(a, 7)', 'set every cell'], ['Arrays.copyOf(a, n)', 'new array of length n (pads with zeros / truncates)'], ['Arrays.equals(a, b)', 'same length and same elements'], ['a.clone()', 'a shallow copy']]),
  ],
  tiny: [code(`
int[] a = {4, 9, 2};
int sum = 0;
for (int x : a) sum += x;      // 15
`)],
  guided: [prog('m2-arrays-1d/ArraysDemo.java', 'Create, traverse, max, reverse in place, copy vs alias, and Arrays utilities')],
  programs: [
    {
      file: 'm2-arrays-1d/ArraysDemo.java',
      title: 'Arrays in action',
      role: 'demo',
      description: 'Each block demonstrates one array skill.',
      walkthrough: [
        { at: 'int[] marks = new int[5];', text: 'Numeric arrays start as all zeros; object arrays start as all null.' },
        { at: 'primes[primes.length - 1]', text: 'The last valid index is length − 1.' },
        { at: 'for (int i = 0, j = a.length - 1; i < j; i++, j--)', text: 'Two indices walking towards each other reverse the array in place.' },
        { at: 'int[] copy = Arrays.copyOf(a, a.length);', text: 'A real, independent copy.' },
        { at: 'int[] alias = a;', text: 'NOT a copy: both variables name the same array, so alias[1] = −5 changes a as well.' },
      ],
    },
  ],
  complexity: [table(['operation', 'time'], [['read / write a[i]', 'O(1)'], ['find an element (unsorted)', 'O(n)'], ['find (sorted, binary search)', 'O(log n)'], ['insert / delete in the middle', 'O(n)'], ['copy', 'O(n)']]), p('An array of n ints uses 4n bytes plus a small header (O(n) space).')],
  mistakes: [
    { title: 'ArrayIndexOutOfBoundsException', wrong: 'int[] a = new int[5];\na[5] = 1;', why: 'Valid indices are 0..4.', fix: 'a[4] = 1;   // or loop with i < a.length' },
    { title: 'length vs length()', wrong: 'for (int i = 0; i < a.length(); i++)', why: 'Arrays have a field `length`; Strings have a method `length()`.', fix: 'a.length' },
    { title: 'Copying with =', wrong: 'int[] b = a;\nb[0] = 99;   // a[0] changes too', why: 'Both variables refer to the same array.', fix: 'int[] b = a.clone();   // or Arrays.copyOf(a, a.length)' },
  ],
  practice: [
    { id: 'arr-ex1', level: 'beginner', title: 'Print reversed', statement: 'Read n and an array; print its elements in reverse order separated by spaces.', examples: [{ input: '5\n1 2 3 4 5', output: '5 4 3 2 1' }], hints: ['Loop from n − 1 down to 0.'], solutionFile: 'm2-arrays-1d/Ex1.java', solutionExplain: 'A downward loop; no need to change the array.', tests: [{ stdin: '5\n1 2 3 4 5\n', stdout: '5 4 3 2 1' }, { stdin: '1\n7\n', stdout: '7' }, { stdin: '3\n-1 0 1\n', stdout: '1 0 -1' }] },
    { id: 'arr-ex2', level: 'intermediate', title: 'Digit frequencies', statement: 'Read n digits (0–9). For every digit that occurs print `digit: count` in increasing digit order.', examples: [{ input: '6\n3 1 3 0 9 1', output: '0: 1\n1: 2\n3: 2\n9: 1' }], hints: ['A counting array of size 10: freq[d]++.'], solutionFile: 'm2-arrays-1d/Ex2.java', solutionExplain: 'The value itself is the index of its counter.', tests: [{ stdin: '6\n3 1 3 0 9 1\n', stdout: '0: 1\n1: 2\n3: 2\n9: 1' }, { stdin: '1\n5\n', stdout: '5: 1' }] },
    { id: 'arr-ex3', level: 'challenge', title: 'Second largest distinct', statement: 'Print the second largest DISTINCT value, or -1 if there is none. One pass, O(1) extra space.', examples: [{ input: '5\n4 9 9 2 7', output: '7' }], hints: ['Track first and second; update second only when x is strictly between them.'], solutionFile: 'm2-arrays-1d/Ex3.java', solutionExplain: 'Two variables updated in one pass; duplicates of the maximum must not become the second.', tests: [{ stdin: '5\n4 9 9 2 7\n', stdout: '7' }, { stdin: '3\n5 5 5\n', stdout: '-1' }, { stdin: '2\n-3 -1\n', stdout: '-3' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'int[] a = {3, 1, 4, 1, 5};\nSystem.out.println(a.length + " " + a[a.length - 2]);', answer: '5 1', explain: 'length is 5; index 3 holds 1.' },
    { type: 'output', q: 'What is printed?', code: 'int[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 9;\nSystem.out.println(a[0]);', answer: '9', explain: 'b is an alias of a.' },
    { type: 'mcq', q: 'What does `new int[3]` contain?', options: ['three nulls', 'three zeros', 'garbage', 'nothing'], answer: 1, explain: 'Numeric arrays are zero-initialised.' },
    { type: 'mcq', q: 'Which is the valid index range of an array of length n?', options: ['1 … n', '0 … n', '0 … n−1', '1 … n−1'], answer: 2, explain: 'Zero-based indexing.' },
  ],
  interview: ['Array vs ArrayList?', 'What is the time to access, search, insert?', 'How do you copy an array?', 'What is ArrayIndexOutOfBoundsException?'],
  videos: ['m2-arrays-1d', 'm2-arrays-1d#2'],
  revision: ['Indices 0 … length−1; a.length is a field.', 'O(1) access; O(n) search/insert.', '= copies the reference; clone / Arrays.copyOf copies the data.', 'Arrays.toString / sort / fill / equals.'],
  sourceNotes: { discrepancies: ['The Block Swap slide introduces arrays using C-like syntax (`Int Arr[5]= {…}`, `Char Arr[7]={…}` with only 6 initialisers). Java declares `int[] arr = {…};` and the size is taken from the initialiser.'] },
});

export const arrays2d: Lesson = lesson({
  id: 'm2-arrays-2d',
  dryRun: { algo: 'matrix-rows', input: { n: '4' }, caption: 'Nested loops: row by row, column by column.' },
  module: 'm2',
  title: 'Two-Dimensional Arrays (Matrices)',
  summary: 'Arrays of arrays: rows and columns, nested loops, transpose, diagonals and jagged arrays.',
  level: 'beginner',
  track: 'core',
  minutes: 40,
  essential: true,
  prerequisites: ['m2-arrays-1d'],
  sources: ['Maximum-sum-of-hour-glass-in-matrix', 'Maze-Solving'],
  objectives: [
    'Create and traverse a rows × columns matrix with nested loops.',
    'Use `m.length` (rows) and `m[0].length` (columns) correctly.',
    'Compute row sums, column sums, a diagonal and a transpose.',
    'Explain row-major order and jagged arrays.',
  ],
  intuition: [
    p('A **2-D array** is an array whose elements are themselves arrays — each a **row**. `int[][] m = new int[3][4]` is 3 rows of 4 columns; `m[i][j]` is row i, column j.'),
    pre(`
int[][] m = { {1, 2, 3},
              {4, 5, 6},
              {7, 8, 9} };
 m[1][2] = 6      m.length = 3 rows      m[0].length = 3 columns
 diagonal: m[i][i]       anti-diagonal: m[i][n-1-i]
`),
    why('Two nested loops visit every cell: the outer loop picks the row, the inner loop sweeps the columns — **row-major order**, which is also the fastest order in memory. Problems on grids (hourglass, maze, N-Queens, grid paths) all start with exactly this traversal. Many grid problems also use *neighbour offsets* (`dr`, `dc` arrays) to step up/down/left/right without copying code.'),
    p('Rows need not have the same length (a **jagged** array): `int[][] tri = new int[4][];` then `tri[i] = new int[i + 1];` builds a triangle such as Pascal\'s.'),
  ],
  syntax: [
    code(`
int[][] m = new int[3][4];            // 3 rows, 4 columns, all zeros
int[][] t = {{1, 2, 3}, {4, 5, 6}};   // 2 x 3
int rows = t.length;                  // number of rows
int cols = t[0].length;               // length of row 0
t[1][2] = 60;                         // row 1, column 2
int[][] jagged = new int[3][];        // rows created separately
for (int i = 0; i < 3; i++) jagged[i] = new int[i + 1];
System.out.println(Arrays.deepToString(t));
`),
    warn('`m[i][j]` is "row i, column j". Mixing the two indices is the most common 2-D bug; name them `r` and `c` while learning.'),
  ],
  tiny: [code(`
int total = 0;
for (int i = 0; i < m.length; i++)
    for (int j = 0; j < m[i].length; j++)
        total += m[i][j];
`)],
  guided: [prog('m2-arrays-2d/MatrixDemo.java', 'Traversal, row/column sums, diagonal, transpose and a jagged Pascal triangle')],
  programs: [
    {
      file: 'm2-arrays-2d/MatrixDemo.java',
      title: 'Matrix operations',
      role: 'demo',
      description: 'A 3×3 matrix processed with nested loops.',
      walkthrough: [
        { at: 'int cols = m[0].length;', text: 'The number of columns is the length of any row.' },
        { at: 'rowSum[i] += m[i][j];', text: 'Row i accumulates across the inner loop; colSum[j] accumulates down the rows.' },
        { at: 'if (i == j) diagonal += m[i][j];', text: 'Main diagonal: row index equals column index.' },
        { at: 't[j][i] = m[i][j];', text: 'Transpose swaps the roles of row and column.' },
        { at: 'int[][] tri = new int[4][];', text: 'Only the number of rows is given: each row array is created separately and may differ in length.' },
      ],
    },
  ],
  complexity: [p('Visiting every cell of an R × C matrix is **O(R·C)**; a transpose needs O(R·C) extra space; reading one cell is O(1). Square matrices (n × n) make n² cells — so a nested double loop over the matrix is O(n²) in n but linear in the number of cells.')],
  mistakes: [
    { title: 'Swapping rows and columns in the loop bounds', wrong: 'for (int i = 0; i < m[0].length; i++)\n    for (int j = 0; j < m.length; j++)\n        use(m[i][j]);', why: 'For a non-square matrix this runs off the end: i indexes rows (bounded by m.length).', fix: 'i < m.length for rows; j < m[i].length for columns' },
    { title: 'Using the same variable in both loops', wrong: 'for (int i = 0; i < n; i++)\n    for (int i = 0; i < n; i++)', why: 'The inner i is already declared: compile error.', fix: 'Use i and j.' },
    { title: 'Copying a matrix with clone()', wrong: 'int[][] b = a.clone();', why: 'clone is shallow: b shares the row arrays with a, so writing b[0][0] also changes a[0][0].', fix: 'Copy each row: for (int i...) b[i] = a[i].clone();' },
  ],
  practice: [
    { id: 'mat-ex1', level: 'beginner', title: 'Sum of a matrix', statement: 'Read R, C and the matrix. Print the sum of all elements.', examples: [{ input: '2 3\n1 2 3\n4 5 6', output: '21' }], hints: ['Two nested loops.'], solutionFile: 'm2-arrays-2d/Ex1.java', solutionExplain: 'Accumulate while reading.', tests: [{ stdin: '2 3\n1 2 3\n4 5 6\n', stdout: '21' }, { stdin: '1 1\n-4\n', stdout: '-4' }] },
    { id: 'mat-ex2', level: 'intermediate', title: 'Transpose', statement: 'Read R, C and the matrix. Print the C × R transpose, one row per line.', examples: [{ input: '2 3\n1 2 3\n4 5 6', output: '1 4\n2 5\n3 6' }], hints: ['Swap the loop order when printing.'], solutionFile: 'm2-arrays-2d/Ex2.java', solutionExplain: 'Print column j of the original as row j.', tests: [{ stdin: '2 3\n1 2 3\n4 5 6\n', stdout: '1 4\n2 5\n3 6' }, { stdin: '1 2\n7 8\n', stdout: '7\n8' }] },
    { id: 'mat-ex3', level: 'challenge', title: 'Spiral order', statement: 'Read n and an n × n matrix. Print its elements in clockwise spiral order starting at the top-left, on one line.', examples: [{ input: '3\n1 2 3\n4 5 6\n7 8 9', output: '1 2 3 6 9 8 7 4 5' }], hints: ['Keep four boundaries: top, bottom, left, right and shrink them.'], solutionFile: 'm2-arrays-2d/Ex3.java', solutionExplain: 'Peel the outer ring, then recurse inwards by moving the boundaries.', tests: [{ stdin: '3\n1 2 3\n4 5 6\n7 8 9\n', stdout: '1 2 3 6 9 8 7 4 5' }, { stdin: '1\n5\n', stdout: '5' }, { stdin: '2\n1 2\n3 4\n', stdout: '1 2 4 3' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'int[][] m = {{1, 2}, {3, 4}, {5, 6}};\nSystem.out.println(m.length + " " + m[0].length + " " + m[2][1]);', answer: '3 2 6', explain: '3 rows, 2 columns, element in row 2 col 1.' },
    { type: 'mcq', q: 'The main diagonal of a square matrix is where…', options: ['i + j = n', 'i == j', 'i > j', 'j == 0'], answer: 1, explain: 'Row index equals column index.' },
    { type: 'mcq', q: 'The time to read all cells of an R × C matrix is…', kind: 'complexity', options: ['O(R + C)', 'O(R·C)', 'O(log R)', 'O(1)'], answer: 1, explain: 'Every cell once.' },
    { type: 'mcq', q: 'Which statement creates a 3-row jagged array?', options: ['new int[3][3]', 'new int[3][]', 'new int[][3]', 'new int[3]'], answer: 1, explain: 'Only the first dimension is required.' },
  ],
  interview: ['What is row-major order?', 'How do you rotate a matrix 90° in place?', 'How are 2-D arrays stored in Java?', 'Why does clone() on a 2-D array not give an independent copy?'],
  videos: ['m2-arrays-2d', 'm2-arrays-2d#2'],
  revision: ['m.length = rows; m[i].length = columns.', 'Nested loops: outer row, inner column.', 'Diagonal i==j; anti-diagonal i+j==n−1; transpose t[j][i]=m[i][j].', 'clone() is shallow for 2-D arrays.'],
});

export const strings: Lesson = lesson({
  id: 'm2-strings',
  dryRun: { algo: 'reverse-chars', input: { s: 'racecar1' }, caption: 'Two pointers swapping characters until they meet.' },
  module: 'm2',
  title: 'Strings, StringBuilder and Characters',
  summary: 'Immutable text, the methods you will use daily, comparing correctly, and StringBuilder for efficient edits.',
  level: 'beginner',
  track: 'core',
  minutes: 45,
  essential: true,
  prerequisites: ['m1-methods', 'm2-arrays-1d'],
  sources: ['Move-hyphen-to-beginning', 'Manacher\'s-Algorithm', 'Natural-Sort-order'],
  objectives: [
    'Use `length`, `charAt`, `substring`, `indexOf`, `equals`, `compareTo`, `split`, `join`, `trim`, `replace`.',
    'Explain immutability and why `==` is wrong for comparing content.',
    'Build and modify text with `StringBuilder`.',
    'Process a string character by character with `char` arithmetic (`c - \'a\'`).',
  ],
  intuition: [
    p('A **String** is a sequence of characters. It is an **immutable** object: methods such as `toUpperCase()` never change the original; they return a new String. Indexing is zero-based: `"Java".charAt(0)` is `\'J\'`.'),
    table(['method', 'returns', 'example on s = "Java Programming"'], [['length()', 'number of chars', '16'], ['charAt(i)', 'char at i', "s.charAt(5) = 'P'"], ['substring(a, b)', 'chars a … b−1', 's.substring(0, 4) = "Java"'], ['indexOf(x)', 'first position or −1', 's.indexOf("gram") = 8'], ['equals(t) / equalsIgnoreCase(t)', 'content equality', 'true / false'], ['compareTo(t)', '< 0, 0, > 0 (dictionary order)', '"apple".compareTo("banana") < 0'], ['contains / startsWith / endsWith', 'boolean', 's.contains("Pro") = true'], ['trim()  toUpperCase()  replace(a, b)', 'new String', 's.replace(\'a\', \'@\')'], ['split(regex)  String.join(sep, …)', 'String[] / String', '"a,b".split(",") → {"a","b"}']]),
    why('Because Strings are immutable, `s = s + c` inside a loop copies the whole string each time — O(n²) for n appends. **StringBuilder** keeps a growable char buffer: `append`, `insert`, `reverse`, `setCharAt`, `deleteCharAt` modify in place, and `toString()` produces the final String. Use it whenever you build text in a loop.'),
    p('A **char** is a small number, so letter arithmetic is natural: `c - \'a\'` is 0 for `\'a\'`…25 for `\'z\'` (an index for a 26-element counter array), and `(char) (\'a\' + 3)` is `\'d\'`. `Character.isDigit / isLetter / isUpperCase / toUpperCase` classify and convert.'),
    warn('`"hello" == new String("hello")` is **false**: `==` compares object identity. Always use `.equals()` for text.'),
  ],
  syntax: [
    table(['String method', 'result'], [['s.length()', 'number of characters'], ['s.charAt(i)', 'char at index i'], ['s.substring(a, b)', 'characters a … b−1'], ['s.indexOf("x")  /  lastIndexOf', 'first / last position or −1'], ['s.equals(t)  /  equalsIgnoreCase', 'content comparison (never `==`)'], ['s.compareTo(t)', 'negative, 0 or positive (alphabetical)'], ['s.toUpperCase()  /  toLowerCase()', 'new String'], ['s.trim()  /  strip()', 'without leading/trailing spaces'], ['s.split(" ")', 'String[] of pieces'], ['s.replace("a", "b")', 'new String'], ['s.contains("x")  /  startsWith  /  endsWith', 'boolean'], ['s.toCharArray()', 'char[] copy'], ['String.valueOf(x)  /  String.join(",", list)', 'conversion / joining']]),
    code(`
StringBuilder sb = new StringBuilder();
sb.append("ab").append('c').append(42);     // "abc42"  (mutable, no copying)
sb.insert(0, "X");  sb.reverse();  sb.setCharAt(0, 'Z');  sb.deleteCharAt(1);
String result = sb.toString();
// char helpers
boolean d = Character.isDigit(c), l = Character.isLetter(c);
char up = Character.toUpperCase(c);
int digit = c - '0';                       // '7' - '0' == 7
`),
  ],
  tiny: [code(`
String s = "level";
boolean pal = new StringBuilder(s).reverse().toString().equals(s);   // true
`)],
  guided: [prog('m2-strings/StringsDemo.java', 'Methods, equality, split/join, immutability, StringBuilder and char operations')],
  programs: [
    {
      file: 'm2-strings/StringsDemo.java',
      title: 'String toolbox',
      role: 'demo',
      description: 'A tour of everything above.',
      walkthrough: [
        { at: 's.indexOf("gram") + " " + s.indexOf(\'z\')', text: '8 (found) and −1 (not found).' },
        { at: 'System.out.println((a == b) + " " + a.equals(b)', text: 'false / true: identity vs content. The reason `==` is a bug for Strings.' },
        { at: 'csv.trim().split("\\\\s*,\\\\s*")', text: 'split takes a regular expression: here "optional spaces, a comma, optional spaces".' },
        { at: 't.toUpperCase();', text: 'The returned String is discarded, so t is unchanged — immutability.' },
        { at: 'sb.setLength(sb.length() - 1);', text: 'StringBuilder can be shortened in place to remove a trailing separator.' },
        { at: 'java.util.Arrays.sort(letters);', text: 'toCharArray + sort + new String gives the characters in order — a standard trick for anagrams.' },
      ],
    },
  ],
  complexity: [table(['operation', 'time'], [['length(), charAt(i)', 'O(1)'], ['substring, concatenation, equals, indexOf', 'O(n)'], ['s += c repeated n times', 'O(n²)'], ['StringBuilder.append repeated n times', 'O(n) amortised'], ['sorting the characters', 'O(n log n)']])],
  mistakes: [
    { title: 'Comparing with ==', wrong: 'if (answer == "yes")', why: 'Compares references; may be true by accident for literals and false for input read from the keyboard.', fix: 'if (answer.equals("yes"))   // or "yes".equals(answer) to be null-safe' },
    { title: 'Ignoring the return value', wrong: 's.trim();\nSystem.out.println(s);', why: 'trim returns a new String.', fix: 's = s.trim();' },
    { title: 'substring end index', wrong: 's.substring(2, 5)   // expecting 5 characters', why: 'The end index is exclusive: this has 3 characters.', fix: 's.substring(2, 7)   // 5 characters' },
  ],
  practice: [
    { id: 'str-ex1', level: 'beginner', title: 'Count vowels', statement: 'Read a line and print how many vowels (a, e, i, o, u, case-insensitive) it contains.', examples: [{ input: 'Programming Language', output: '7' }], hints: ['"aeiou".indexOf(c) >= 0'], solutionFile: 'm2-strings/Ex1.java', solutionExplain: 'Lower-case the text and test each char for membership.', tests: [{ stdin: 'Programming Language\n', stdout: '7' }, { stdin: 'rhythm\n', stdout: '0' }, { stdin: 'AEIOU aeiou\n', stdout: '10' }] },
    { id: 'str-ex2', level: 'intermediate', title: 'Anagrams', statement: 'Read two words. Print YES if they are anagrams (same letters, same counts, ignoring case), else NO.', examples: [{ input: 'Listen Silent', output: 'YES' }], hints: ['A 26-element count array: ++ for the first word, −− for the second.'], solutionFile: 'm2-strings/Ex2.java', solutionExplain: 'Equal multisets of letters give all-zero counters.', tests: [{ stdin: 'Listen Silent\n', stdout: 'YES' }, { stdin: 'abc abd\n', stdout: 'NO' }, { stdin: 'aa a\n', stdout: 'NO' }] },
    { id: 'str-ex3', level: 'intermediate', title: 'Run-length encoding', statement: 'Read a word and print its run-length encoding: each maximal block of equal characters becomes the character followed by the block length.', examples: [{ input: 'aaabccdddd', output: 'a3b1c2d4' }], hints: ['A while loop with an inner scan for the end of the run.'], solutionFile: 'm2-strings/Ex3.java', solutionExplain: 'Find the end j of the run starting at i, append char and count, continue at j.', tests: [{ stdin: 'aaabccdddd\n', stdout: 'a3b1c2d4' }, { stdin: 'a\n', stdout: 'a1' }, { stdin: 'abab\n', stdout: 'a1b1a1b1' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'String s = "hello";\nSystem.out.println(s.substring(1, 3) + s.indexOf(\'l\'));', answer: 'el2', explain: 'substring(1,3) = "el"; first l is at index 2.' },
    { type: 'output', q: 'What is printed?', code: 'String a = "hi";\nString b = new String("hi");\nSystem.out.println(a == b);', answer: 'false', explain: 'Different objects.' },
    { type: 'mcq', q: 'Which class should you use to build a long string in a loop?', options: ['String', 'StringBuilder', 'char', 'Scanner'], answer: 1, explain: 'It avoids O(n²) copying.' },
    { type: 'output', q: 'What is printed?', code: "char c = 'd';\nSystem.out.println(c - 'a');", answer: '3', explain: 'char arithmetic: 100 − 97.' },
    { type: 'mcq', q: 'Strings are…', options: ['mutable', 'immutable', 'primitive', 'arrays of int'], answer: 1, explain: 'Their contents never change after creation.' },
  ],
  interview: ['Why is String immutable?', 'String vs StringBuilder vs StringBuffer?', '== vs equals for Strings?', 'What is the String pool?'],
  videos: ['m2-strings', 'm2-strings#2'],
  revision: ['Immutable; methods return new Strings.', 'Compare with equals, not ==. compareTo for order.', 'substring(a, b) excludes b; indexOf → −1 if absent.', 'StringBuilder for loops; c − \'a\' maps letters to 0..25.'],
});

export const numberSystems: Lesson = lesson({
  id: 'm2-number-systems-binary',
  dryRun: { algo: 'to-binary', input: { n: '45' }, caption: "Repeated division by 2; try −45 for two's complement." },
  module: 'm2',
  title: 'Number Systems, Binary and Two\'s Complement',
  summary: 'Positional notation in base 2, 8, 10 and 16; converting by repeated division; how negative numbers are stored.',
  level: 'beginner',
  track: 'core',
  minutes: 40,
  essential: true,
  prerequisites: ['m1-operators-arithmetic', 'm1-loops'],
  sources: ['Booth\'s-Algorithm', 'Binary-Palindrome', 'Swap-two-nibbles-in-a-byte'],
  objectives: [
    'Read a number written in any base as the sum of digit × baseᵖᵒˢⁱᵗⁱᵒⁿ.',
    'Convert decimal ↔ binary ↔ hexadecimal by hand and in Java.',
    'Add binary numbers with carries.',
    'Explain two\'s complement and compute the n-bit pattern of a negative number.',
  ],
  intuition: [
    p('In everyday (**decimal**) notation each position is worth ten times the one to its right: 156 = 1·10² + 5·10¹ + 6·10⁰. **Binary** works the same way with base 2; each digit (a **bit**) is 0 or 1:'),
    pre(`
10011100₂ = 1·128 + 0·64 + 0·32 + 1·16 + 1·8 + 1·4 + 0·2 + 0·1 = 156
weights :   128  64  32  16   8   4   2   1
`),
    table(['base', 'name', 'digits', 'used for'], [['2', 'binary', '0 1', 'how computers store everything'], ['8', 'octal', '0–7', 'file permissions'], ['10', 'decimal', '0–9', 'people'], ['16', 'hexadecimal', '0–9 A–F', 'compact binary: 1 hex digit = 4 bits (a nibble)']]),
    h('Decimal → base b: repeated division'),
    pre(`
156 ÷ 2 = 78 r 0
 78 ÷ 2 = 39 r 0
 39 ÷ 2 = 19 r 1
 19 ÷ 2 =  9 r 1
  9 ÷ 2 =  4 r 1
  4 ÷ 2 =  2 r 0
  2 ÷ 2 =  1 r 0
  1 ÷ 2 =  0 r 1     read the remainders from the bottom up → 10011100
`),
    why('The remainder of n ÷ 2 is the **lowest bit**; dividing by 2 drops that bit. So repeating "take n % 2, then n /= 2" produces the bits from least to most significant — hence they are reversed at the end. The reverse direction (**Horner\'s rule**: value = value × base + digit) rebuilds the number in one pass.'),
    h("Two's complement (negative numbers)"),
    p('Computers store a **signed** n-bit integer so that addition works the same for positive and negative numbers. The top bit has weight −2ⁿ⁻¹. To get the pattern of −x: **flip all bits of x, then add 1** (equivalently 2ⁿ − x).'),
    pre(`
 5 = 0000 0101
~5 = 1111 1010
+1 = 1111 1011   = −5          (8 bits: range −128 … 127)
`),
  ],
  syntax: [table(['Java', 'does'], [['Integer.toBinaryString(n)', 'binary text of n (negative → 32-bit pattern)'], ['Integer.toHexString(n)', 'hex text'], ['Integer.parseInt("9C", 16)', 'parse text in a base'], ['Integer.toString(n, 7)', 'any base 2…36'], ['0b1010  0x1F  017', 'binary, hex, octal literals'], ['Integer.bitCount(n)', 'number of 1 bits']])],
  tiny: [code(`
String bits = Integer.toBinaryString(156);   // "10011100"
int back = Integer.parseInt(bits, 2);        // 156
`)],
  guided: [prog('m2-number-systems-binary/NumberSystems.java', 'toBase and fromBase written by hand, plus two\'s complement patterns')],
  programs: [
    {
      file: 'm2-number-systems-binary/NumberSystems.java',
      title: 'Base conversion by hand',
      role: 'demo',
      description: 'Converting without library calls so that you see the arithmetic.',
      walkthrough: [
        { at: 'sb.append(digits.charAt(n % base));', text: 'The remainder is the least significant digit; look it up in "0123456789ABCDEF".' },
        { at: 'n /= base;', text: 'Remove that digit.' },
        { at: 'return sb.reverse().toString();', text: 'Digits were produced backwards.' },
        { at: 'value = value * base + Character.digit(c, base);', text: 'Horner\'s rule: shift everything left one position and add the new digit.' },
        { at: 'sb.append((x >> i) & 1);', text: 'Reading bit i from the top: Java ints are already in two\'s complement, so this prints the pattern for negatives too.' },
      ],
    },
  ],
  complexity: [p('Conversion takes one step per digit: log_b(n) steps for a number n in base b — O(log n).')],
  mistakes: [
    { title: 'Reading remainders top-down', wrong: '// 156 → "00111001"', why: 'The first remainder is the lowest bit; the result must be reversed.', fix: 'Read the remainders bottom-up (or reverse the StringBuilder).' },
    { title: 'Forgetting leading zeros when a fixed width is needed', wrong: 'Integer.toBinaryString(5)   // "101" not "00000101"', why: 'The method drops leading zeros.', fix: '"0".repeat(8 - s.length()) + s' },
    { title: 'Confusing the stored bits with the printed text', wrong: 'int x = 0b1010; // "x is binary"', why: 'x is just a number; binary, decimal and hex are different WRITINGS of the same value.', fix: 'Format only when printing.' },
  ],
  practice: [
    { id: 'num-ex1', level: 'beginner', title: 'To binary', statement: 'Read a non-negative integer and print its binary representation (without Integer.toBinaryString).', examples: [{ input: '156', output: '10011100' }], hints: ['Repeated division by 2; reverse the remainders; handle 0.'], solutionFile: 'm2-number-systems-binary/Ex1.java', solutionExplain: 'Remainders are the bits from low to high.', tests: [{ stdin: '156\n', stdout: '10011100' }, { stdin: '0\n', stdout: '0' }, { stdin: '1\n', stdout: '1' }, { stdin: '1023\n', stdout: '1111111111' }] },
    { id: 'num-ex2', level: 'intermediate', title: 'From any base', statement: 'Read a number written in base b (2 ≤ b ≤ 16) and the base. Print its decimal value.', examples: [{ input: '9C 16', output: '156' }], hints: ['value = value * base + digit'], solutionFile: 'm2-number-systems-binary/Ex2.java', solutionExplain: 'Horner\'s rule over the digits.', tests: [{ stdin: '9C 16\n', stdout: '156' }, { stdin: '1010 2\n', stdout: '10' }, { stdin: '777 8\n', stdout: '511' }] },
    { id: 'num-ex3', level: 'challenge', title: 'Add two binary strings', statement: 'Read two binary numbers as strings (up to 1000 digits) and print their sum in binary, without converting to int.', examples: [{ input: '1010 1110', output: '11000' }], hints: ['Add digit by digit from the right with a carry.'], solutionFile: 'm2-number-systems-binary/Ex3.java', solutionExplain: 'Column addition: sum = a + b + carry; digit = sum % 2; carry = sum / 2.', tests: [{ stdin: '1010 1110\n', stdout: '11000' }, { stdin: '1 1\n', stdout: '10' }, { stdin: '0 0\n', stdout: '0' }, { stdin: '111 1\n', stdout: '1000' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is 1011₂ in decimal?', code: '// 8 + 0 + 2 + 1', answer: '11', explain: '1·8 + 0·4 + 1·2 + 1·1.' },
    { type: 'output', q: 'What is the 8-bit two\'s complement pattern of −3?', code: '// 3 = 00000011', answer: '11111101', explain: 'Flip → 11111100, add 1 → 11111101.' },
    { type: 'mcq', q: 'One hexadecimal digit corresponds to how many bits?', options: ['2', '3', '4', '8'], answer: 2, explain: '16 = 2⁴.' },
    { type: 'mcq', q: 'The range of an 8-bit two\'s-complement integer is…', options: ['0…255', '−127…127', '−128…127', '−256…255'], answer: 2, explain: '−2⁷ … 2⁷ − 1.' },
    { type: 'mcq', q: 'In repeated division by 2, the first remainder is…', options: ['the most significant bit', 'the least significant bit', 'always 0', 'the sign'], answer: 1, explain: 'It is n mod 2.' },
  ],
  interview: ['How do computers represent negative integers?', 'Convert 255 to binary and hex.', 'Why hexadecimal?', 'What is overflow in two\'s complement?'],
  videos: ['m2-number-systems-binary', 'm2-number-systems-binary#2'],
  revision: ['Position weights: base^k. Binary 128 64 32 16 8 4 2 1.', 'Decimal→base: repeated ÷, read remainders upwards. Base→decimal: Horner.', '1 hex digit = 4 bits.', 'Two\'s complement: −x = ~x + 1; n-bit range −2ⁿ⁻¹ … 2ⁿ⁻¹−1.'],
  sourceNotes: { discrepancies: ['The Booth deck revises binary addition and two\'s complement only as screenshots (21 → 10101 by repeated division); this lesson makes those prerequisites explicit.'] },
});

export const mathBasics: Lesson = lesson({
  id: 'm2-math-gcd-lcm-primes-mod',
  dryRun: { algo: 'prime-trial', input: { n: '91' }, caption: '91 = 7 × 13: found after six trial divisions.' },
  module: 'm2',
  title: 'Divisibility, GCD/LCM, Primes and Modular Arithmetic',
  summary: 'The number-theory vocabulary used by the archive: divisors, gcd, lcm, primes, congruence and fast exponentiation.',
  level: 'beginner',
  track: 'core',
  minutes: 45,
  essential: true,
  prerequisites: ['m1-methods', 'm1-loops', 'm1-operators-arithmetic'],
  sources: ['Euclid\'s-Algorithm', 'Euler\'s-phi-Algorithm', 'Simple-Sieve', 'Remainder-Theorem'],
  objectives: [
    'Test divisibility and list the divisors of n in O(√n).',
    'Define gcd, lcm and coprime; relate lcm to gcd.',
    'Test primality by trial division up to √n.',
    'Use modular arithmetic rules and compute aᵇ mod m by repeated squaring.',
  ],
  intuition: [
    p('**a divides b** (written a | b) when b % a == 0. The **divisors** of 36 are 1, 2, 3, 4, 6, 9, 12, 18, 36. A **prime** has exactly two divisors (1 and itself); a **composite** has more. Two numbers are **coprime** when their gcd is 1.'),
    table(['concept', 'meaning', 'example'], [['gcd(a, b)', 'largest number dividing both', 'gcd(84, 36) = 12'], ['lcm(a, b)', 'smallest positive number divisible by both', 'lcm(84, 36) = 252'], ['relation', 'gcd(a, b) × lcm(a, b) = a × b', '12 × 252 = 84 × 36'], ['a mod m', 'remainder after division by m (0 … m−1)', '−7 mod 5 = 3']]),
    why('**Divisors come in pairs** (d, n/d); one of the two is ≤ √n. So to list divisors or test for a divisor you only have to look at d ≤ √n — O(√n) instead of O(n). This single fact is behind trial division, the sieve, Euler\'s φ and many other algorithms in this course.'),
    h('Modular arithmetic'),
    p('Working "mod m" means keeping only remainders: numbers wrap around like a clock of m hours. The key rules (for **+, −, ×**, not division):'),
    math('(a + b) mod m = ((a mod m) + (b mod m)) mod m        (a · b) mod m = ((a mod m) · (b mod m)) mod m'),
    p('That lets you keep numbers small even when the true result is astronomically large — e.g. aᵇ mod m by **repeated squaring**: square the base each time and multiply it into the result only when the current bit of the exponent is 1. It needs O(log b) multiplications.'),
  ],
  syntax: [warn('Java\'s `%` can return negative numbers. For a result in 0…m−1 use `Math.floorMod(a, m)` or `((a % m) + m) % m`.', 'Negative remainders')],
  tiny: [code(`
static boolean isPrime(long n) {
    if (n < 2) return false;
    for (long d = 2; d * d <= n; d++)
        if (n % d == 0) return false;
    return true;
}
`)],
  guided: [prog('m2-math-gcd-lcm-primes-mod/NumberTheoryBasics.java', 'gcd, lcm, primality, digit-sum divisibility, powMod and floorMod')],
  programs: [
    {
      file: 'm2-math-gcd-lcm-primes-mod/NumberTheoryBasics.java',
      title: 'Number theory toolkit',
      role: 'demo',
      description: 'Sample input: `84 36`.',
      walkthrough: [
        { at: 'static boolean isPrime(long n)', text: 'Handles 2 separately, then tests odd divisors up to √n.' },
        { at: 'long r = a % b;', text: 'Euclid\'s algorithm (full lesson later in the archive module).' },
        { at: 'if ((b & 1) == 1) result = result * a % m;', text: 'Repeated squaring: when the current bit of the exponent is 1, multiply the base into the result.' },
        { at: 'a = a * a % m;', text: 'Square the base and reduce — values stay below m².' },
        { at: 'Math.floorMod(-7, 5)', text: '3, the mathematically correct residue; −7 % 5 is −2.' },
      ],
    },
  ],
  complexity: [p('Trial division: O(√n). gcd: O(log min(a, b)). powMod: O(log b). Listing all divisors by the √n trick: O(√n).')],
  mistakes: [
    { title: 'Looping to n instead of √n', wrong: 'for (int d = 2; d < n; d++)', why: 'For n = 10⁹ that is a billion iterations; √n is 31 623.', fix: 'for (long d = 2; d * d <= n; d++)' },
    { title: 'Overflow in the modular product', wrong: 'int r = a * b % m;   // a, b up to 10^9', why: 'a * b overflows int before % is applied.', fix: 'long r = (long) a * b % m;' },
    { title: 'Dividing under a modulus', wrong: '(a / b) % m', why: 'Modular division is not ordinary division; you need the modular inverse.', fix: 'a * inverse(b) % m (see the Euclid and CRT lessons)' },
  ],
  practice: [
    { id: 'math-ex1', level: 'beginner', title: 'gcd and lcm', statement: 'Read a and b (up to 10⁹). Print gcd and lcm separated by a space.', examples: [{ input: '12 18', output: '6 36' }], hints: ['lcm = a / gcd * b with long.'], solutionFile: 'm2-math-gcd-lcm-primes-mod/Ex1.java', solutionExplain: 'Euclid for the gcd; divide first to avoid overflow in the lcm.', tests: [{ stdin: '12 18\n', stdout: '6 36' }, { stdin: '7 13\n', stdout: '1 91' }, { stdin: '1000000000 1000000000\n', stdout: '1000000000 1000000000' }] },
    { id: 'math-ex2', level: 'intermediate', title: 'All divisors', statement: 'Read n (up to 10¹²) and print all divisors in increasing order.', examples: [{ input: '36', output: '1 2 3 4 6 9 12 18 36' }], hints: ['For each d ≤ √n add both d and n/d to a sorted set.'], solutionFile: 'm2-math-gcd-lcm-primes-mod/Ex2.java', solutionExplain: 'Divisors pair up; a TreeSet keeps them sorted and removes the duplicate when d = n/d.', tests: [{ stdin: '36\n', stdout: '1 2 3 4 6 9 12 18 36' }, { stdin: '1\n', stdout: '1' }, { stdin: '97\n', stdout: '1 97' }] },
    { id: 'math-ex3', level: 'challenge', title: 'Modular power', statement: 'Read a, b, m (a, m ≤ 10⁹, b ≤ 10¹⁸). Print a^b mod m.', examples: [{ input: '3 200 13', output: '9' }], hints: ['Repeated squaring; use long and reduce after every multiplication.'], solutionFile: 'm2-math-gcd-lcm-primes-mod/Ex3.java', solutionExplain: 'O(log b) squarings; each product is below m² ≤ 10¹⁸ so long suffices.', tests: [{ stdin: '3 200 13\n', stdout: '9' }, { stdin: '2 10 1000\n', stdout: '24' }, { stdin: '5 0 7\n', stdout: '1' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'gcd(18, 24) × lcm(18, 24) = ?', options: ['42', '432', '6', '72'], answer: 1, explain: 'It equals 18 × 24 = 432.' },
    { type: 'output', q: 'What does Math.floorMod(-7, 3) return?', code: 'System.out.println(Math.floorMod(-7, 3));', answer: '2', explain: '−7 = −3·3 + 2.' },
    { type: 'mcq', q: 'To test whether n is prime by trial division you need to test divisors up to…', options: ['n', 'n/2', '√n', 'log n'], answer: 2, explain: 'A composite has a divisor ≤ √n.' },
    { type: 'output', q: 'What is (17 * 23) % 5?', code: 'System.out.println((17 % 5) * (23 % 5) % 5);', answer: '1', explain: '2 · 3 = 6, 6 mod 5 = 1.' },
  ],
  interview: ['How do you test primality in O(√n)?', 'Relation between gcd and lcm?', 'Why can you reduce mod m at every step?', 'How does fast exponentiation work?'],
  videos: ['m2-math-gcd-lcm-primes-mod', 'm2-math-gcd-lcm-primes-mod#2'],
  revision: ['Divisors pair (d, n/d): only look up to √n.', 'gcd·lcm = a·b; coprime ⟺ gcd = 1.', 'Modular + − × are safe to reduce at every step; use floorMod.', 'powMod: square, multiply when exponent bit is 1.'],
});

export const recursion: Lesson = lesson({
  id: 'm2-recursion',
  dryRun: { algo: 'factorial-stack', input: { n: '4' }, caption: 'The call stack grows to the base case and then unwinds.' },
  module: 'm2',
  title: 'Recursion: Base Case, Recursive Case and the Call Stack',
  summary: 'Solve a problem by solving a smaller copy of it — and see exactly what the call stack does.',
  level: 'intermediate',
  track: 'core',
  minutes: 50,
  essential: true,
  prerequisites: ['m1-methods', 'm1-debugging-tracing'],
  sources: ['Josephus-trap', 'Maneuvering', 'Time-_-Space-complexity-1_2'],
  objectives: [
    'Write a recursive method with a base case and a recursive case that moves toward it.',
    'Trace the call stack and the return values of a recursive call.',
    'Draw a recursion tree and count calls; compare linear and branching recursion (factorial vs Fibonacci).',
    'Recognise when recursion is a good fit and when it risks StackOverflowError.',
  ],
  intuition: [
    p('A method is **recursive** if it calls itself. Every correct recursive method has two parts:'),
    ol('**Base case** — a tiny input whose answer is immediate (so the recursion stops).', '**Recursive case** — reduce the problem to a **smaller** instance of itself and combine the result.'),
    pre(`
factorial(4)
 = 4 * factorial(3)
       = 3 * factorial(2)
             = 2 * factorial(1)
                   = 1            ← base case
       ↑ the answers come back up: 2, 6, 24
`),
    why('Each call gets its own **stack frame** holding its parameters and local variables. Calls pile up on the **call stack** until a base case returns; then the frames unwind one by one, each combining the value that came back. This is why recursion depth costs memory: factorial(n) needs n frames (O(n) space), and a missing base case ends in `StackOverflowError`.'),
    p('The shape of the **recursion tree** tells you the cost. `factorial` makes one call per level (a chain, n calls). `fib(n) = fib(n−1) + fib(n−2)` makes two calls per level: the tree doubles, so the number of calls grows like 2ⁿ — fib(20) takes 21 891 calls — although the stack depth is only n. Branching recursion with repeated sub-problems is the cue for **memoisation / dynamic programming**.'),
    table(['pattern', 'example', 'calls', 'depth'], [['linear', 'factorial(n), sumDigits(n)', 'n', 'n'], ['halving', 'power(b, n/2), binary search', 'log n', 'log n'], ['two branches, overlapping', 'fib(n), grid paths', '~2ⁿ', 'n'], ['divide & conquer', 'merge sort, quick sort', 'n', 'log n']]),
  ],
  syntax: [
    code(`
returnType name(parameters) {
    if (/* smallest case */) {
        return /* answer without recursing */;      // 1. BASE CASE: stops the recursion
    }
    // 2. RECURSIVE CASE: call yourself on a SMALLER input
    return /* combine */ name(/* smaller */);
}
`, 'The template'),
    table(['shape', 'example', 'calls'], [['linear', '`f(n) = n * f(n - 1)`', '1 per level'], ['halving', '`f(n) = f(n / 2) + 1`', '1 per level, log n levels'], ['two-way', '`f(n) = f(n - 1) + f(n - 2)`', '2 per level (exponential)'], ['accumulating', '`sum(a, i) = a[i] + sum(a, i + 1)`', 'extra parameter i tracks progress']]),
  ],
  tiny: [code(`
static long factorial(int n) {
    if (n <= 1) return 1;           // base case
    return n * factorial(n - 1);    // recursive case
}
`)],
  guided: [prog('m2-recursion/RecursionDemo.java', 'factorial, an indented call trace, Fibonacci call counts, fast power, recursive palindrome check')],
  programs: [
    {
      file: 'm2-recursion/RecursionDemo.java',
      title: 'Recursion toolbox',
      role: 'demo',
      description: 'Run it to see the call tree printed with indentation.',
      walkthrough: [
        { at: 'if (n <= 1) {', text: 'Base case: no further call. Without it: infinite recursion → StackOverflowError.' },
        { at: 'return n * factorial(n - 1);', text: 'The argument shrinks every call, so the base case is eventually reached.' },
        { at: 'String indent = "  ".repeat(depth);', text: 'depth mirrors the stack depth so the trace prints as a staircase.' },
        { at: 'return fib(n - 1) + fib(n - 2);', text: 'Two calls: the tree of calls doubles.' },
        { at: 'long half = power(base, exp / 2);', text: 'One call on half the exponent: depth log₂ exp. Square it (and multiply by base if exp is odd).' },
        { at: 'isPalindrome(s.substring(1, s.length() - 1))', text: 'Strip both ends and ask the same question of the middle.' },
      ],
    },
  ],
  complexity: [table(['function', 'time', 'stack space'], [['factorial(n)', 'O(n)', 'O(n)'], ['fib(n) naive', 'O(2ⁿ) (≈ 1.6ⁿ)', 'O(n)'], ['power(b, n) by halving', 'O(log n)', 'O(log n)'], ['isPalindrome(s)', 'O(n²) with substring copies', 'O(n)']]), p('Space for recursion = **maximum depth of the call stack** × size of a frame — not the total number of calls. That is the slide\'s own answer: `int add(int n)` recursing n times uses O(n) space even though it is O(n) time too.')],
  mistakes: [
    { title: 'No base case / not moving toward it', wrong: 'static int f(int n) { return n * f(n - 1); }   // never stops', why: 'StackOverflowError: the stack fills with frames.', fix: 'if (n <= 1) return 1;' },
    { title: 'Recomputing the same sub-problems', wrong: 'fib(50) with the plain recursive version', why: 'Billions of calls: it recomputes fib(48), fib(47)… repeatedly.', fix: 'Memoise in an array, or use a loop.' },
    { title: 'Forgetting to use the returned value', wrong: 'factorial(n - 1);\nreturn n;', why: 'The recursive result is thrown away.', fix: 'return n * factorial(n - 1);' },
  ],
  practice: [
    { id: 'rec-ex1', level: 'beginner', title: 'Recursive digit sum', statement: 'Read n ≥ 0 and print the sum of its digits using recursion (no loops).', examples: [{ input: '4821', output: '15' }], hints: ['sumDigits(n) = n % 10 + sumDigits(n / 10); base case n < 10.'], solutionFile: 'm2-recursion/Ex1.java', solutionExplain: 'The last digit plus the digit sum of the rest.', tests: [{ stdin: '4821\n', stdout: '15' }, { stdin: '0\n', stdout: '0' }, { stdin: '999\n', stdout: '27' }] },
    { id: 'rec-ex2', level: 'intermediate', title: 'Towers of Hanoi', statement: 'Move n disks from rod A to rod C using B. Print each move as `Move disk k from X to Y`, then `total moves: M`.', constraints: ['1 ≤ n ≤ 10'], examples: [{ input: '2', output: 'Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\ntotal moves: 3' }], hints: ['Move n−1 disks to the spare rod, move the biggest, move n−1 on top of it.'], solutionFile: 'm2-recursion/Ex2.java', solutionExplain: 'T(n) = 2T(n−1) + 1 = 2ⁿ − 1 moves.', tests: [{ stdin: '2\n', stdout: 'Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\ntotal moves: 3' }, { stdin: '1\n', stdout: 'Move disk 1 from A to C\ntotal moves: 1' }] },
    { id: 'rec-ex3', level: 'challenge', title: 'All subsets', statement: 'Read n (1 ≤ n ≤ 10). Print all subsets of {1..n} in the order produced by "skip i" before "take i" (see example).', examples: [{ input: '2', output: '[]\n[2]\n[1]\n[1, 2]' }], hints: ['subsets(i): skip i then take i, undo after taking.'], solutionFile: 'm2-recursion/Ex3.java', solutionExplain: 'Each element is either excluded or included: 2ⁿ leaves.', tests: [{ stdin: '2\n', stdout: '[]\n[2]\n[1]\n[1, 2]' }, { stdin: '1\n', stdout: '[]\n[1]' }] },
  ],
  quiz: [
    { type: 'output', q: 'What does f(4) return?', code: 'static int f(int n) {\n    if (n == 0) return 0;\n    return n + f(n - 1);\n}', answer: '10', explain: '4 + 3 + 2 + 1 + 0.' },
    { type: 'mcq', q: 'What happens if a recursive method has no reachable base case?', options: ['returns 0', 'StackOverflowError', 'compile error', 'nothing'], answer: 1, explain: 'Frames pile up until the stack is exhausted.' },
    { type: 'mcq', q: 'How many calls does naive fib(5) make (counting fib(5) itself)?', options: ['5', '9', '15', '25'], answer: 2, explain: 'calls(n) = calls(n−1) + calls(n−2) + 1: 1,1,3,5,9,15.' },
    { type: 'mcq', q: 'The SPACE used by add(n) = n + add(n−1) is…', kind: 'complexity', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 1, explain: 'n stack frames at the deepest point.' },
    { type: 'mcq', q: 'Recursion tree with overlapping sub-problems suggests…', options: ['sorting', 'memoisation / dynamic programming', 'binary search', 'a bigger stack'], answer: 1, explain: 'Cache each sub-answer once.' },
  ],
  interview: ['What is the call stack?', 'Recursion vs iteration — when each?', 'How do you convert recursion to a loop?', 'Why is naive Fibonacci exponential?'],
  videos: ['m2-recursion', 'm2-recursion#2'],
  revision: ['Base case + smaller recursive case.', 'Stack frame per call; space = depth.', 'Chain: n calls. Two branches: ~2ⁿ. Halving: log n.', 'Overlap → memoise.'],
});

export const references: Lesson = lesson({
  id: 'm2-references-memory',
  dryRun: { algo: 'pass-by-value', input: { n: '5', first: '1' }, caption: 'The int is copied; the array reference is copied, so the object is shared.' },
  module: 'm2',
  title: 'References, Pass-by-Value and Memory',
  summary: 'What a variable really holds, why arrays and objects can be changed by a method, and what null means.',
  level: 'intermediate',
  track: 'core',
  minutes: 35,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm1-methods'],
  objectives: [
    'Distinguish primitive variables (hold values) from reference variables (hold addresses).',
    'Explain "Java is always pass-by-value" including for objects.',
    'Predict aliasing effects and make shallow copies and independent copies.',
    'Understand `null`, `NullPointerException` and the stack/heap split.',
  ],
  intuition: [
    p('A **primitive** variable stores the value itself. A **reference** variable (arrays, Strings, any object) stores the **address** of an object that lives on the heap. Assigning a reference copies the address — not the object.'),
    pre(`
int[] a = {1, 2, 3};      stack                heap
int[] b = a;              a ──────────┐
                          b ──────────┼──►  [1, 2, 3]
b[0] = 9;  →  a[0] is 9 too: one array, two names
`),
    why('**Java is strictly pass-by-value.** When you call `f(x)`, the *value of x* is copied into the parameter. For a primitive that is the number; for an object reference it is the address. The method can therefore **follow the copied address and change the object** (`arr[0] = 100` is visible to the caller), but it cannot make the caller\'s variable point somewhere else (`arr = new int[3]` only changes the local copy). Strings are immutable, so there is nothing to change at all.'),
    ul('`null` means "this reference points to no object". Calling a method on it throws **NullPointerException**.', '`==` on references asks "same object?"; `.equals()` asks "same content?" (for classes that define it).', 'Copying: `int[] c = a.clone();` or `Arrays.copyOf(a, a.length)`; for lists `new ArrayList<>(list)`. Nested objects need a **deep copy**.'),
  ],
  syntax: [
    code(`
int[] a = {1, 2, 3};
int[] b = a;                  // ALIAS: same array object
int[] c = a.clone();          // independent copy (shallow)
int[] d = Arrays.copyOf(a, a.length);
String s = null;              // a reference that points to nothing
if (s != null && s.length() > 0) { /* safe to use s */ }   // guard before dereferencing
boolean same = (a == b);               // true: the same object
boolean eq1 = a.equals(c);             // false: arrays compare by identity
boolean eq2 = Arrays.equals(a, c);     // true: same contents
`),
    table(['kind', 'variable holds', 'passed to a method as'], [['int, double, char, boolean …', 'the value itself', 'a copy of the value'], ['arrays, objects, Strings', 'a reference (address)', 'a copy of the reference — same object']]),
  ],
  tiny: [code(`
Box b1 = new Box(1);
Box b2 = b1;       // alias
b2.value = 42;     // b1.value is 42 as well
`)],
  guided: [prog('m2-references-memory/ReferencesDemo.java', 'Primitive vs array vs String parameters, aliasing, copies, null')],
  programs: [
    {
      file: 'm2-references-memory/ReferencesDemo.java',
      title: 'References and parameters',
      role: 'demo',
      description: 'Each static helper isolates one rule.',
      walkthrough: [
        { at: 'static void changeArrayContent(int[] arr)', text: 'arr is a COPY of the reference, but it points at the caller\'s array: changing elements is visible.' },
        { at: 'static void reassignReference(int[] arr)', text: 'Re-pointing the local copy does not affect the caller: still [100, 2, 3].' },
        { at: 'Box b2 = b1;', text: 'Copying the reference, not the object: both names refer to one Box.' },
        { at: 'List<Integer> copy = new ArrayList<>(original);', text: 'A genuinely independent list (a shallow copy of the elements).' },
        { at: 'System.out.println(missing.length());', text: 'Dereferencing null throws NullPointerException; the try/catch shows the exception type.' },
      ],
    },
  ],
  complexity: [p('Assigning a reference is O(1); copying an array or list of n items is O(n). Memory: each object has a small header plus its fields; a reference itself is 4–8 bytes.')],
  mistakes: [
    { title: 'Expecting a method to swap two int variables', wrong: 'static void swap(int a, int b) { int t = a; a = b; b = t; }', why: 'The method swaps its own copies.', fix: 'Swap elements inside an array, or return the new values.' },
    { title: 'Forgetting that arrays default to null/0', wrong: 'String[] names = new String[3];\nnames[0].length();', why: 'The array holds three nulls: NullPointerException.', fix: 'Assign each element before using it.' },
    { title: 'Shallow copy surprises', wrong: 'int[][] b = a.clone();', why: 'The rows are shared.', fix: 'Clone every row.' },
  ],
  practice: [
    { id: 'ref-ex1', level: 'beginner', title: 'Swap inside an array', statement: 'Read n, the array and two indices i and j. Print the array after swapping a[i] and a[j] using a method `swap(int[] a, int i, int j)`.', examples: [{ input: '4\n1 2 3 4\n0 3', output: '[4, 2, 3, 1]' }], hints: ['The method changes the shared array, so it works.'], solutionFile: 'm2-references-memory/Ex1.java', solutionExplain: 'The parameter references the caller\'s array.', tests: [{ stdin: '4\n1 2 3 4\n0 3\n', stdout: '[4, 2, 3, 1]' }, { stdin: '2\n5 6\n0 0\n', stdout: '[5, 6]' }] },
    { id: 'ref-ex2', level: 'intermediate', title: 'Return a new array', statement: 'Read n and an array. Print the original and a NEW array with every element doubled, as `[orig] [doubled]`.', examples: [{ input: '3\n1 2 3', output: '[1, 2, 3] [2, 4, 6]' }], hints: ['Allocate a second array; do not modify the first.'], solutionFile: 'm2-references-memory/Ex2.java', solutionExplain: 'Creating a new array keeps the caller\'s data intact.', tests: [{ stdin: '3\n1 2 3\n', stdout: '[1, 2, 3] [2, 4, 6]' }, { stdin: '1\n0\n', stdout: '[0] [0]' }] },
    { id: 'ref-ex3', level: 'beginner', title: 'Alias or copy?', statement: 'Read mode 1 or 2. Mode 1: b = a; mode 2: b = a.clone(). Then set b[0] = 99 and print `same` if a[0] also became 99, else `different`.', examples: [{ input: '1', output: 'same' }], hints: ['clone() creates a new array.'], solutionFile: 'm2-references-memory/Ex3.java', solutionExplain: 'An alias shares the object; a clone does not.', tests: [{ stdin: '1\n', stdout: 'same' }, { stdin: '2\n', stdout: 'different' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'static void f(int[] a) { a[0] = 7; a = new int[]{9}; }\npublic static void main(String[] x) {\n    int[] v = {1, 2};\n    f(v);\n    System.out.println(v[0]);\n}', answer: '7', explain: 'The element change is seen; the reassignment is not.' },
    { type: 'mcq', q: 'Java passes arguments…', options: ['by reference', 'by value (references are copied)', 'by name', 'by pointer arithmetic'], answer: 1, explain: 'Always by value; for objects the value is the reference.' },
    { type: 'mcq', q: 'Calling a method on a null reference throws…', options: ['IllegalArgumentException', 'NullPointerException', 'ArithmeticException', 'ClassCastException'], answer: 1, explain: 'NullPointerException.' },
    { type: 'mcq', q: 'Where do objects live?', options: ['stack', 'heap', 'registers', 'constant pool only'], answer: 1, explain: 'The heap; references to them may be on the stack.' },
  ],
  interview: ['Is Java pass-by-value or pass-by-reference?', 'What is aliasing?', 'Shallow vs deep copy?', 'What is a NullPointerException and how do you avoid it?'],
  videos: ['m2-references-memory', 'm2-references-memory#2'],
  revision: ['Primitive variable = value; reference variable = address of a heap object.', 'Pass-by-value: the reference is copied; the object can be modified, the caller\'s variable cannot be re-pointed.', 'b = a aliases; clone/copyOf copies; deep copy for nested objects.', 'null → NPE.'],
});

export const boundaries: Lesson = lesson({
  id: 'm2-boundaries-validation',
  dryRun: { algo: 'bounds-check', input: { arr: '3,1,4,1,5', mode: '2' }, caption: 'i <= length reads one cell too far.' },
  module: 'm2',
  title: 'Boundary Conditions, Validation and Common Mistakes',
  summary: 'The edge cases that break otherwise-correct programs, and the habit of validating input and testing the extremes.',
  level: 'beginner',
  track: 'core',
  minutes: 30,
  essential: true,
  prerequisites: ['m1-debugging-tracing', 'm2-arrays-1d'],
  objectives: [
    'List the standard boundary conditions for numbers, arrays and strings.',
    'Validate input with `try/catch` and guard conditions.',
    'Spot the classic mistakes: off-by-one, overflow, empty input, `Math.abs(MIN_VALUE)`.',
    'Design a small test list before writing code.',
  ],
  intuition: [
    p('A program is correct only if it is correct **at the edges**. Most real bugs live there. Before coding, write the **boundary cases** next to the problem statement:'),
    table(['input kind', 'check these'], [['an array / string', 'empty, one element, all equal, sorted, reverse sorted, maximum length'], ['a number', '0, 1, −1, negative, the largest allowed, a prime, a power of two'], ['an index', 'first, last, one past the end, negative'], ['a loop', 'zero iterations, one iteration, the final iteration'], ['input from a user', 'not a number, empty line, too large, extra spaces']]),
    why('Validation turns "crashes with a stack trace" into "reports a clear problem": check preconditions (`if (n < 0) …`), convert risky input with `try { Integer.parseInt(s) } catch (NumberFormatException e) { … }`, and never index before checking the bounds. For competition-style problems the input is guaranteed valid — but you must still handle the *valid* extremes (n = 1, n = 10⁵, values 10⁹).'),
    h('The usual suspects'),
    ul('**Off-by-one:** `<` vs `<=`, `length` vs `length − 1`.', '**Overflow:** sums and products of ints; use `long`.', '**Integer division:** `a / b` truncates; `(a + b) / 2` can overflow — use `a + (b − a) / 2`.', '**`Math.abs(Integer.MIN_VALUE)`** is still negative (there is no +2³¹ in an int).', '**Initialising a maximum with 0** when all values may be negative.', '**Using `==` on Strings / boxed Integers.**'),
  ],
  syntax: [
    code(`
if (n < 0) throw new IllegalArgumentException("n must be >= 0");   // reject bad input early
Objects.requireNonNull(name, "name");                              // fail fast on null
int total = Math.addExact(a, b);                                   // throws ArithmeticException on overflow
try {
    int v = Integer.parseInt(text);                                // may throw NumberFormatException
} catch (NumberFormatException e) {
    System.out.println("not a number");
}
for (int i = 0; i < a.length; i++) { /* body */ }    // "<" with length;   "<=" would read one too far
`, 'Defensive patterns'),
    table(['test these inputs', 'why'], [['empty / length 1', 'loops that assume a first and last element'], ['0, 1, −1', 'divisions, signs, base cases'], ['Integer.MAX_VALUE', 'overflow on +, *'], ['all equal / already sorted / reversed', 'algorithms with hidden assumptions']]),
  ],
  tiny: [code(`
try {
    int n = Integer.parseInt(token);
} catch (NumberFormatException e) {
    System.out.println("not a number: " + token);
}
`)],
  guided: [prog('m2-boundaries-validation/ValidationDemo.java', 'Parsing with try/catch, empty arrays, overflow in sums and Math.abs(MIN_VALUE)')],
  programs: [
    {
      file: 'm2-boundaries-validation/ValidationDemo.java',
      title: 'Defensive code',
      role: 'demo',
      description: 'Feed it lines such as `42`, ` abc `, `2147483648`.',
      walkthrough: [
        { at: 'Integer.parseInt(s.trim())', text: 'Throws NumberFormatException for "abc" and for 2147483648 (too large for int).' },
        { at: 'if (a == null || a.length == 0)', text: 'Guard BEFORE dividing: an empty array would make sum / 0.' },
        { at: 'long sum = 0;', text: 'The sum of two Integer.MAX_VALUE values only fits in a long.' },
        { at: 'Math.abs(Integer.MIN_VALUE)', text: 'There is no +2147483648 in an int; the result stays negative.' },
      ],
    },
  ],
  complexity: [p('Validation checks are O(1) (or O(length) for scanning a string). They almost never dominate the running time.')],
  mistakes: [
    { title: 'Midpoint overflow', wrong: 'int mid = (lo + hi) / 2;   // lo, hi ~ 10^9', why: 'lo + hi exceeds 2³¹ − 1 and becomes negative.', fix: 'int mid = lo + (hi - lo) / 2;' },
    { title: 'Assuming at least one element', wrong: 'int first = a[0];   // a may be empty', why: 'ArrayIndexOutOfBoundsException for n = 0.', fix: 'if (a.length == 0) return …;' },
    { title: 'Catching everything silently', wrong: 'catch (Exception e) { }', why: 'Hides real bugs.', fix: 'Catch the specific exception and report or handle it.' },
  ],
  practice: [
    { id: 'bnd-ex1', level: 'beginner', title: 'Sum the valid numbers', statement: 'Read whitespace-separated tokens. Print `sum bad` where sum is the total of the tokens that are valid ints and bad is how many are not.', examples: [{ input: '5 x 7 3.5 -2', output: '10 2' }], hints: ['try { Integer.parseInt } catch (NumberFormatException e)'], solutionFile: 'm2-boundaries-validation/Ex1.java', solutionExplain: 'Each token is validated by attempting the conversion.', tests: [{ stdin: '5 x 7 3.5 -2\n', stdout: '10 2' }, { stdin: 'a b\n', stdout: '0 2' }, { stdin: '10 20\n', stdout: '30 0' }] },
    { id: 'bnd-ex2', level: 'beginner', title: 'Maximum or empty', statement: 'Read n, then n integers. Print the maximum, or `empty` when n = 0.', examples: [{ input: '0', output: 'empty' }], hints: ['Handle n = 0 first.'], solutionFile: 'm2-boundaries-validation/Ex2.java', solutionExplain: 'A guard for the empty case; MIN_VALUE as the initial maximum.', tests: [{ stdin: '0\n', stdout: 'empty' }, { stdin: '3\n-5 -2 -9\n', stdout: '-2' }, { stdin: '1\n7\n', stdout: '7' }] },
    { id: 'bnd-ex3', level: 'intermediate', title: 'Safe element access', statement: 'Read n, an array and an index i. Print a[i] if 0 ≤ i < n, else `out of range`.', examples: [{ input: '3\n10 20 30\n3', output: 'out of range' }], hints: ['Check both ends of the range.'], solutionFile: 'm2-boundaries-validation/Ex3.java', solutionExplain: 'The bounds check comes before the access.', tests: [{ stdin: '3\n10 20 30\n3\n', stdout: 'out of range' }, { stdin: '3\n10 20 30\n0\n', stdout: '10' }, { stdin: '3\n10 20 30\n-1\n', stdout: 'out of range' }] },
  ],
  quiz: [
    { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.abs(Integer.MIN_VALUE) < 0);', answer: 'true', explain: 'The absolute value overflows back to MIN_VALUE.' },
    { type: 'mcq', q: 'The safe way to compute the midpoint of lo and hi is…', options: ['(lo + hi) / 2', 'lo + (hi - lo) / 2', 'hi / 2 + lo', 'lo * hi / 2'], answer: 1, explain: 'It cannot overflow when lo ≤ hi.' },
    { type: 'mcq', q: 'Which input is a boundary case for "find the maximum of an array"?', options: ['an array of 5 random numbers', 'an empty array', 'an array of 100 numbers', 'an array sorted ascending'], answer: 1, explain: 'There is no maximum of nothing.' },
    { type: 'mcq', q: 'Integer.parseInt("12.5") throws…', options: ['ArithmeticException', 'NumberFormatException', 'NullPointerException', 'nothing'], answer: 1, explain: 'It is not a valid int.' },
  ],
  interview: ['What edge cases would you test for a function that reverses a string?', 'How do you avoid overflow when averaging?', 'When should you validate input?'],
  videos: ['m2-boundaries-validation', 'm2-boundaries-validation#2'],
  revision: ['Test: empty, one, max, negative, equal, sorted.', 'Validate before use; try/catch for parsing.', 'mid = lo + (hi − lo) / 2; use long for sums.', 'Math.abs(MIN_VALUE) < 0.'],
});
