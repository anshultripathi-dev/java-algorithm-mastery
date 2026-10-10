import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

// ───────────────────────────── Move hyphen to beginning ─────────────────────────────
export const moveHyphen: Lesson = lesson({
  id: 'a-move-hyphen',
  dryRun: { algo: 'hyphen-partition', input: { s: 'ab-c-d-ef' }, caption: 'Right-to-left copy, then fill the front with hyphens.' },
  module: 'm5',
  title: 'Move Hyphen to the Beginning',
  summary: 'Rearrange a string with `indexOf`, `substring` and StringBuilder — then do it for every hyphen in one pass.',
  level: 'beginner',
  track: 'archive',
  minutes: 30,
  essential: true,
  prerequisites: ['m2-strings', 'm1-methods'],
  sources: ['Move-hyphen-to-beginning'],
  objectives: [
    'Use `indexOf`, `substring`, `contains` and string concatenation correctly.',
    'Explain that Java Strings are immutable and what that means for repeated edits.',
    'Move all hyphens to the front, preserving the order of the other characters.',
    'Do it in one pass over a `char[]`, scanning from the right.',
  ],
  intuition: [
    p('The slide transforms `"face-prep"` into `"-faceprep"`: find the hyphen, take everything before it and everything after it, and put the hyphen first.'),
    pre(`
face-prep      indexOf('-') = 4
face | - | prep
"-"  + "face" + "prep"   →  -faceprep
`),
    p('The slide solves only the **first** hyphen. A more interesting problem moves **all** hyphens to the front without disturbing the other characters: `a-b-c-d` → `---abcd`. This is a *stable partition*: hyphens first, everything else in its original order.'),
    why('Scanning from the right, write every non-hyphen character into the rightmost free slot; whatever slots remain on the left must be hyphens (their count equals the number of hyphens). Because each character is read at or before the position where it is written, nothing is overwritten before being read — so one array and one pass suffice.'),
  ],
  syntax: [
    table(['method', 'returns', 'example (s = "face-prep")'], [['s.indexOf(\'-\')', 'index of first match, or −1', '4'], ['s.contains("-")', 'boolean', 'true'], ['s.substring(a, b)', 'chars a … b−1', 'substring(0, 4) = "face"'], ['s.substring(a)', 'chars a … end', 'substring(5) = "prep"'], ['s.toCharArray()', 'a char[] copy', '[f,a,c,e,-,p,r,e,p]']]),
    warn('Strings are **immutable**: `s.substring(...)` returns a NEW string; `s` itself never changes. Repeated `+=` in a loop creates many temporary strings (O(n²)); use `StringBuilder`.'),
  ],
  tiny: [code(`
String s = "face-prep";
int i = s.indexOf('-');
String result = "-" + s.substring(0, i) + s.substring(i + 1);   // -faceprep
`)],
  guided: [
    prog('move-hyphen/MoveFirstHyphen.java', 'The lecture version: first hyphen only'),
    prog('move-hyphen/MoveAllHyphens.java', 'All hyphens: with two StringBuilders, then in place from the right'),
  ],
  programs: [
    {
      file: 'move-hyphen/MoveFirstHyphen.java',
      title: 'Move the first hyphen',
      role: 'archive-original',
      description: 'indexOf + substring. O(n) time (copying) and O(n) space for the new string.',
      walkthrough: [
        { at: "s.indexOf('-')", text: 'Position of the first hyphen, or −1 if there is none.' },
        { at: 'if (hyphenIndex < 0)', text: 'No hyphen: return the original (the slide uses `contains` then `indexOf`, i.e. searches twice).' },
        { at: 's.substring(0, hyphenIndex)', text: 'Everything before the hyphen.' },
        { at: 's.substring(hyphenIndex + 1)', text: 'Everything after the hyphen (skip it with +1).' },
      ],
    },
    {
      file: 'move-hyphen/MoveAllHyphens.java',
      title: 'Move every hyphen',
      role: 'optimized',
      description: 'Two versions of the same stable partition.',
      walkthrough: [
        { at: 'StringBuilder hyphens = new StringBuilder();', text: 'Two builders: hyphens and everything else. Appending to a StringBuilder is amortised O(1).' },
        { at: 'return hyphens.append(others).toString();', text: 'Hyphens first, then the others in their original order.' },
        { at: 'int write = a.length - 1;', text: 'The in-place version: `write` is the next free slot from the right.' },
        { at: 'if (a[read] != \'-\')', text: 'Copy non-hyphen characters towards the right end, preserving their order (read ≤ write always).' },
        { at: 'a[write--] = \'-\';', text: 'The remaining slots on the left are exactly the hyphens.' },
      ],
    },
  ],
  complexity: [
    p('All versions are **O(n) time**. Memory: the substring/builder versions use O(n) extra characters; the `char[]` right-scan uses O(1) extra beyond the array itself.'),
    p('The naive "remove each hyphen and insert it at index 0" costs O(n) per hyphen → O(n·h), up to O(n²).'),
  ],
  mistakes: [
    { title: 'Expecting the string to change', wrong: 's.substring(0, 3);\nSystem.out.println(s);   // unchanged', why: 'Strings are immutable. The result of substring must be stored.', fix: 's = s.substring(0, 3);' },
    { title: 'Off-by-one on the second substring', wrong: 's.substring(0, i) + s.substring(i)', why: 'substring(i) still contains the hyphen: the output has the hyphen twice.', fix: 's.substring(i + 1)' },
    { title: 'Building the result with += in a loop', wrong: 'String out = "";\nfor (char c : s.toCharArray()) out += c;', why: 'Each += copies the whole string so far: O(n²).', fix: 'StringBuilder sb = new StringBuilder(); sb.append(c);' },
  ],
  practice: [
    {
      id: 'hy-ex1',
      level: 'beginner',
      title: 'First hyphen to the front',
      statement: 'Read a line. If it contains a hyphen, move its FIRST hyphen to the beginning; otherwise print the line unchanged.',
      examples: [{ input: 'face-prep', output: '-faceprep' }],
      hints: ['indexOf, then substring twice.'],
      solutionFile: 'move-hyphen/Ex1.java',
      solutionExplain: 'Rebuild the string as "-" + before + after.',
      tests: [{ stdin: 'face-prep\n', stdout: '-faceprep' }, { stdin: 'abc\n', stdout: 'abc' }, { stdin: 'a-b-c\n', stdout: '-ab-c' }],
    },
    {
      id: 'hy-ex2',
      level: 'intermediate',
      title: 'All hyphens to the front',
      statement: 'Move every hyphen to the beginning of the line, keeping the other characters in order.',
      constraints: ['length ≤ 10⁶'],
      examples: [{ input: 'a-b-c', output: '--abc' }],
      hints: ['Two StringBuilders, or one char array scanned from the right.'],
      solutionFile: 'move-hyphen/Ex2.java',
      solutionExplain: 'A stable partition into hyphens and non-hyphens, concatenated.',
      tests: [{ stdin: 'a-b-c\n', stdout: '--abc' }, { stdin: '---\n', stdout: '---' }, { stdin: 'abc\n', stdout: 'abc' }],
    },
    {
      id: 'hy-ex3',
      level: 'challenge',
      title: 'Minimum adjacent swaps',
      statement: 'Print the minimum number of swaps of ADJACENT characters needed to bring all hyphens to the front.',
      constraints: ['length ≤ 10⁶ (answer may need long)'],
      examples: [{ input: 'a-b-c', output: '3' }],
      hints: ['Each hyphen must pass every non-hyphen character that stands before it.', 'Sum, over hyphens, the number of non-hyphen characters seen so far.'],
      solutionFile: 'move-hyphen/Ex3.java',
      solutionExplain: 'Hyphens never need to cross each other (that would be a wasted swap), so the cost is the number of (non-hyphen, hyphen) inversions.',
      tests: [{ stdin: 'a-b-c\n', stdout: '3' }, { stdin: '--ab\n', stdout: '0' }, { stdin: 'ab--\n', stdout: '4' }],
    },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'String s = "ab-cd";\nint i = s.indexOf(\'-\');\nSystem.out.println("-" + s.substring(0, i) + s.substring(i + 1));', answer: '-abcd', explain: 'Before: "ab", after: "cd".' },
    { type: 'mcq', q: 'What does "face-prep".indexOf(\'x\') return?', options: ['0', '-1', 'null', 'an exception'], answer: 1, explain: 'indexOf returns −1 when there is no match.' },
    { type: 'mcq', q: 'Why is building a long string with += in a loop slow?', options: ['+= is not allowed', 'Strings are immutable so every += copies the string', 'Because of garbage collection', 'It is not slow'], answer: 1, explain: 'Each step creates a new String of increasing length.' },
    { type: 'mcq', q: 'Time complexity of the one-pass right scan?', kind: 'complexity', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], answer: 1, explain: 'Every character is read once and written once.' },
  ],
  interview: ['Why are Java Strings immutable?', 'Move all zeros to the end of an array — how is it the same problem?', 'How do you do a stable partition in place?'],
  videos: ['a-move-hyphen', 'a-move-hyphen#2'],
  revision: ['indexOf, substring(a, b) = a..b−1, substring(a) = a..end.', 'Strings are immutable; use StringBuilder for building.', 'All hyphens: stable partition, right-to-left write pointer.', 'O(n).'],
  sourceNotes: {
    discrepancies: ['The slide moves only the first hyphen (by name it suggests "the hyphen"); the generalisation to all hyphens is added here and labelled as such.'],
  },
});

// ───────────────────────────── Strobogrammatic ─────────────────────────────
export const strobogrammatic: Lesson = lesson({
  id: 'a-strobogrammatic',
  module: 'm5',
  title: 'Strobogrammatic Number',
  summary: 'Numbers that look the same when rotated 180°: check one with two pointers and a map, generate them all with recursion.',
  level: 'intermediate',
  track: 'archive',
  minutes: 40,
  essential: false,
  prerequisites: ['m2-strings', 'm3-collections-sets-maps', 'm2-recursion'],
  sources: ['Strobogrammatic-Number'],
  objectives: [
    'State exactly which digits rotate to which: 0→0, 1→1, 8→8, 6→9, 9→6.',
    'Check a number with two pointers and a HashMap.',
    'Generate all n-digit strobogrammatic numbers by wrapping smaller ones.',
    'Count them with a formula and spot errors in informal definitions.',
  ],
  intuition: [
    p('Turn a number **upside down** (rotate it 180°). Some digits look like a digit again: 0 → 0, 1 → 1, 8 → 8, 6 → 9, 9 → 6. A number is **strobogrammatic** if the rotated picture is the *same number*. Rotating reverses the order of digits as well as turning each one: `69` → rotate 9→6 and 6→9 and read from the other side → `69`. `818` → 818. `906` → 906. `25` → no (2 and 5 do not rotate into a digit in this definition).'),
    pre(`
number  6 9           rotate each digit    9 6
read backwards ←      (6→9, 9→6)           ↓ reverse  →  6 9   ✓ same as the original
`),
    why('Position i from the left must rotate into the digit at position i from the right. So walk two pointers from the two ends: for each pair (left, right) require `rotate(left) == right`. When the pointers meet in the middle (odd length) the digit must rotate into **itself** — only 0, 1 and 8 can sit in the middle, never 6 or 9. `while (left <= right)` with the same test handles that case automatically because left == right.'),
  ],
  syntax: [
    code(`
static char rotate(char c) {                        // what a digit looks like upside down
    switch (c) {
        case '0': case '1': case '8': return c;
        case '6': return '9';
        case '9': return '6';
        default:  return '?';                       // not strobogrammatic
    }
}
int l = 0, r = s.length() - 1;                      // two pointers moving inwards
while (l <= r) { if (rotate(s.charAt(l)) != s.charAt(r)) return false; l++; r--; }
`),
  ],
  tiny: [code(`
String from = "01689", to = "01986";
int i = from.indexOf(c);   // c rotated = to.charAt(i)
`)],
  guided: [
    p('The slide solution builds a `HashMap<Character,Character>` and runs the two-pointer loop. The lesson adds the generator (LeetCode 247) so you can see all numbers of a given length.'),
    prog('strobogrammatic/StrobogrammaticCheck.java', 'Check one number (slide algorithm)'),
    prog('strobogrammatic/StrobogrammaticGenerate.java', 'Generate every strobogrammatic number of length n'),
  ],
  dryRun: { algo: 'strobogrammatic', input: { s: '906' }, caption: 'Compare rotate(left) with right while the pointers close in.' },
  programs: [
    {
      file: 'strobogrammatic/StrobogrammaticCheck.java',
      title: 'Strobogrammatic check',
      role: 'optimized',
      description: 'A map of rotations and two pointers. O(n) time, O(1) space (the map has 5 entries).',
      walkthrough: [
        { at: "rotated.put('6', '9');", text: '6 rotates into 9 and 9 into 6; 0, 1, 8 map to themselves. Any other digit is simply absent.' },
        { at: 'while (left <= right)', text: '`<=` (not `<`) so that the middle digit of an odd-length number is also tested against itself.' },
        { at: 'if (r == null || r != num.charAt(right))', text: 'Either the digit cannot rotate, or it rotates into something other than its mirrored partner.' },
      ],
    },
    {
      file: 'strobogrammatic/StrobogrammaticGenerate.java',
      title: 'Generate all of length n',
      role: 'demo',
      description: 'build(n) wraps every build(n−2) result with 1…1, 6…9, 8…8, 9…6 (and 0…0 on the inside).',
      walkthrough: [
        { at: 'if (n == 0)', text: 'Base case for even lengths: the empty string.' },
        { at: 'if (n == 1)', text: 'Base case for odd lengths: the self-rotating digits 0, 1, 8.' },
        { at: 'if (n != total)', text: 'A leading zero is not allowed: 0…0 is added only for the inner layers.' },
        { at: 'result.add("6" + inner + "9");', text: 'Wrapping with a rotating pair keeps the property.' },
      ],
    },
  ],
  complexity: [
    p('**Check:** one pass over half the digits → O(n) time, O(1) space.'),
    p('**Generate:** for length n there are 4·5^(n/2−1) numbers (n even) or 4·5^((n−1)/2−1)·3 (n odd, n ≥ 3); each has n characters, so the output size alone is Θ(n·5^(n/2)). Exponential — but optimal, since you must print them.'),
    table(['n', '1', '2', '3', '4', '5', '6'], [['count', '3', '4', '12', '20', '60', '100']], 'Counts of strobogrammatic numbers (no leading zero; the single digit 0 counts for n = 1).'),
  ],
  mistakes: [
    { title: 'Only mapping, not mirroring', wrong: '// treating "88" and "69" as the only valid ones because "digits look the same"', why: 'The slide says 6 and 9 are "not strobogrammatic" digits; yet 69 is. The correct statement: each digit must rotate to a digit AND appear mirrored.', fix: 'Use the pair map {6→9, 9→6, 0→0, 1→1, 8→8} with two pointers.' },
    { title: 'Using < instead of <= in the loop', wrong: 'while (left < right)', why: '"6" would be accepted: the middle digit is never tested. A single 6 is not strobogrammatic.', fix: 'while (left <= right)' },
    { title: 'Claiming 2 and 5 work', wrong: '// slide: "The digits 2 and 5 can also be considered strobogrammatic"', why: 'On a seven-segment display 2 and 5 look alike when rotated, but in the standard definition (digits that turn into valid digits on a printed page) they do not. The standard set is {0, 1, 8, 6, 9}.', fix: 'Stick to the stated definition and state it in the problem.' },
  ],
  practice: [
    {
      id: 'stro-ex1',
      level: 'beginner',
      title: 'Is it strobogrammatic?',
      statement: 'Read a number as a string. Print YES if it looks the same rotated by 180°, else NO.',
      examples: [{ input: '69', output: 'YES' }, { input: '25', output: 'NO' }],
      hints: ['Two pointers from both ends.', 'Allowed rotations: 0-0, 1-1, 8-8, 6-9, 9-6.'],
      solutionFile: 'strobogrammatic/Ex1.java',
      solutionExplain: 'The digit at the left pointer must rotate into the digit at the right pointer; the middle digit must be 0, 1 or 8.',
      tests: [{ stdin: '69\n', stdout: 'YES' }, { stdin: '818\n', stdout: 'YES' }, { stdin: '962\n', stdout: 'NO' }, { stdin: '6\n', stdout: 'NO' }, { stdin: '906\n', stdout: 'YES' }],
    },
    {
      id: 'stro-ex2',
      level: 'intermediate',
      title: 'How many of length n?',
      statement: 'Read n (1 ≤ n ≤ 18). Print how many n-digit strobogrammatic numbers have no leading zero (for n = 1 the digit 0 counts).',
      examples: [{ input: '4', output: '20' }],
      hints: ['The outermost pair has 4 choices (11, 69, 88, 96).', 'Each inner pair has 5 choices; an odd middle digit has 3.'],
      solutionFile: 'strobogrammatic/Ex2.java',
      solutionExplain: 'Multiplication principle: 4 · 5^(pairs−1) · (3 if n is odd).',
      tests: [{ stdin: '4\n', stdout: '20' }, { stdin: '1\n', stdout: '3' }, { stdin: '3\n', stdout: '12' }, { stdin: '6\n', stdout: '100' }],
    },
    {
      id: 'stro-ex3',
      level: 'challenge',
      title: 'Strobogrammatic in a range',
      statement: 'Read low and high (as strings of up to 15 digits, low ≤ high). Print how many strobogrammatic numbers lie in [low, high].',
      examples: [{ input: '50 100', output: '3', explain: '69, 88, 96' }],
      hints: ['Generate by length from len(low) to len(high).', 'For equal lengths, string comparison equals numeric comparison.'],
      solutionFile: 'strobogrammatic/Ex3.java',
      solutionExplain: 'Generate all candidates for each length and filter the ones outside the bounds.',
      tests: [{ stdin: '50 100\n', stdout: '3' }, { stdin: '0 0\n', stdout: '1' }, { stdin: '1 1000\n', stdout: '18' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Which number is strobogrammatic?', options: ['25', '962', '69', '1962'], answer: 2, explain: '69 rotated by 180° is 69. 25 and 1962 contain 2 (no valid rotation); 962 contains 2 as well.' },
    { type: 'mcq', q: 'Which digits can be the MIDDLE digit of an odd-length strobogrammatic number?', options: ['0, 1, 8', '6, 9', '2, 5', 'any digit'], answer: 0, explain: 'The middle digit must rotate into itself.' },
    { type: 'output', q: 'What does the check print for "88"?', code: '// pairs: (8,8) → rotate(8) = 8 ✓', answer: 'true', explain: '8 rotates to 8 and 88 reads the same.' },
    { type: 'mcq', q: 'How many 2-digit strobogrammatic numbers (no leading zero) exist?', options: ['3', '4', '5', '9'], answer: 1, explain: '11, 69, 88, 96.' },
  ],
  interview: ['Check a strobogrammatic number in O(n).', 'Generate all strobogrammatic numbers of length n (LeetCode 247).', 'Why must the middle digit be 0, 1 or 8?'],
  videos: ['a-strobogrammatic', 'a-strobogrammatic#2'],
  revision: ['Rotations: 0↔0, 1↔1, 8↔8, 6↔9.', 'Two pointers: rotate(s[l]) == s[r]; use l <= r.', 'Middle digit ∈ {0, 1, 8}.', 'Count for n digits: 4·5^(⌈n/2⌉−1)… (×3/÷5 for the odd middle).'],
  sourceNotes: {
    discrepancies: [
      'The slide says digits 2 and 5 "can also be considered strobogrammatic" and that 6 and 9 "are not"; the standard definition (and the slide\'s own Java code) uses {0, 1, 8} as self-rotating and {6 ↔ 9} as a pair.',
      'The slide explains 906 as "looks like 609". 906 is strobogrammatic because the rotated number equals 906 itself.',
      'The slide program is split across two slides with numbered lines (22–30) that continue the class; the lesson program is the whole class.',
    ],
  },
});

// ───────────────────────────── Lexicographically first palindromic string ─────────────────────────────
export const lexPalindrome: Lesson = lesson({
  id: 'a-lex-palindrome',
  module: 'm5',
  title: 'Lexicographically First Palindromic Rearrangement',
  summary: 'Rearrange the letters of a string into the alphabetically smallest palindrome — using character counts, not permutations.',
  level: 'intermediate',
  track: 'archive',
  minutes: 40,
  essential: true,
  prerequisites: ['m2-strings', 'm2-arrays-1d', 'm3-collections-sets-maps'],
  sources: ['Lexicographically-first-palindromic-string'],
  objectives: [
    'State when a multiset of letters can form a palindrome (at most one odd count).',
    'Build the smallest palindrome: half of each letter in alphabetical order, the odd letter in the middle, then the mirror.',
    'Explain why the brute-force permutation search is hopeless for long strings.',
    'Handle case and non-letter characters safely.',
  ],
  intuition: [
    p('Given `malayalam` rearrange its letters so the result is a **palindrome** and, among all palindromes, the **alphabetically first**. Answer: `aalmymlaa`.'),
    p('**When is it possible?** A palindrome mirrors itself, so every letter must appear an even number of times — except possibly one letter that sits alone in the middle. `malayalam` has a:4, l:2, m:2, y:1 → only `y` is odd ✓. `apple` has a:1, p:2, l:1, e:1 → three odd letters ✗ → "no palindromic string".'),
    pre(`
counts   a:4  l:2  m:2  y:1
half     a:2  l:1  m:1         front = a a l m   (alphabetical)
middle   y
back     m l a a              (front reversed)
result   aalm + y + mlaa  =  aalmymlaa
`),
    why('To make the string alphabetically small, the **left half** should be the smallest possible arrangement of the letters available for it: sort them. The right half is forced — it must mirror the left. Putting the single odd letter in the middle uses it up without affecting the order of the halves. Trying permutations one by one (the slide\'s "simple approach") finds the same answer but needs up to n! steps.'),
  ],
  syntax: [
    code(`
int[] freq = new int[26];
for (char c : s.toCharArray()) freq[c - 'a']++;      // count letters
StringBuilder half = new StringBuilder();
for (int i = 0; i < 26; i++)
    half.append(String.valueOf((char) ('a' + i)).repeat(freq[i] / 2));   // half of each letter, in order
String palindrome = half + middle + new StringBuilder(half).reverse();
`),
  ],
  tiny: [code(`
int[] freq = new int[26];
for (char c : s.toCharArray()) freq[c - 'a']++;
`)],
  guided: [
    prog('lex-palindrome/LexPalindromeBrute.java', 'Simple (slide "Simple Approach"): next permutations until one is a palindrome'),
    prog('lex-palindrome/LexPalindrome.java', 'Efficient: counts + TreeMap'),
  ],
  dryRun: { algo: 'lex-palindrome', input: { s: 'malayalam' }, caption: 'Counts → half → mirrored string.' },
  programs: [
    {
      file: 'lex-palindrome/LexPalindromeBrute.java',
      title: 'Try permutations in order',
      role: 'simple',
      description: 'Sort the characters (the smallest permutation) and iterate next-permutation until one reads the same both ways. Correct, O(n·n!).',
      walkthrough: [
        { at: 'static boolean nextPermutation', text: 'The standard algorithm for the next lexicographic permutation (see the Sorted Unique Permutation lesson).' },
        { at: 'Arrays.sort(a);', text: 'The very first permutation is the sorted one.' },
        { at: 'while (nextPermutation(a))', text: 'Stops after the last permutation → "no palindromic string".' },
      ],
    },
    {
      file: 'lex-palindrome/LexPalindrome.java',
      title: 'Lexicographically first palindrome by counting',
      role: 'optimized',
      description: 'O(n + σ log σ): count letters, test the odd-count rule, build half + middle + mirror.',
      walkthrough: [
        { at: 'new TreeMap<>()', text: 'A TreeMap stores keys in sorted order — iteration is alphabetical for free.' },
        { at: 'if (e.getValue() % 2 == 1)', text: 'Counting letters with an odd frequency.' },
        { at: 'if (oddCount > 1)', text: 'More than one odd letter cannot be placed: no palindrome exists.' },
        { at: 'e.getValue() / 2', text: 'Each letter contributes half of its (even part of its) count to the front.' },
        { at: 'new StringBuilder(front).reverse()', text: 'The right half is the mirror of the left.' },
      ],
    },
  ],
  complexity: [
    p('**Permutation search:** up to n!/(c₁!c₂!…) candidates × O(n) test → factorial time: n = 12 is already ~10⁸–10⁹ operations.'),
    p('**Counting:** one pass to count (O(n)), σ distinct letters to build (O(σ log σ) with the TreeMap, O(σ) with a 26-array), → **O(n) time, O(σ) extra space** apart from the output.'),
  ],
  mistakes: [
    { title: 'Crash on uppercase letters (slide)', wrong: 'freq[str.charAt(i) - \'a\']++;   // "Malayalam" → \'M\' - \'a\' = -20', why: 'The slide\'s intro shows the input "Malayalam" but the code only works for lowercase: index −20 throws ArrayIndexOutOfBoundsException.', fix: 'Normalise with toLowerCase() first, or use a Map / int[256].' },
    { title: 'A stray space in rear_str (slide)', wrong: 'String front_str = "", rear_str = " ";', why: 'The back half starts with a space character, so the printed palindrome has a space in it ("aalmymlaa " ... ). It is not a palindrome any more.', fix: 'String rear = "";' },
    { title: 'Putting the odd letter at the front', wrong: 'return oddLetter + front + back;', why: 'The odd letter has no partner, so it must stand alone in the exact middle; anywhere else the string is not symmetric.', fix: 'return front + oddLetter + back;' },
  ],
  practice: [
    {
      id: 'lexp-ex1',
      level: 'beginner',
      title: 'Can it be a palindrome?',
      statement: 'Read a word (letters only, case-insensitive). Print YES if its letters can be rearranged into a palindrome, else NO.',
      examples: [{ input: 'aabb', output: 'YES' }],
      hints: ['Count letters; how many have an odd count?'],
      solutionFile: 'lex-palindrome/Ex1.java',
      solutionExplain: 'At most one letter may have an odd frequency.',
      tests: [{ stdin: 'aabb\n', stdout: 'YES' }, { stdin: 'apple\n', stdout: 'NO' }, { stdin: 'Malayalam\n', stdout: 'YES' }],
    },
    {
      id: 'lexp-ex2',
      level: 'intermediate',
      title: 'Build the smallest palindrome',
      statement: 'Read a word. Print the lexicographically first palindrome using ALL its letters (case-insensitive, print in lowercase), or `no palindromic string`.',
      examples: [{ input: 'Malayalam', output: 'aalmymlaa' }, { input: 'apple', output: 'no palindromic string' }],
      hints: ['TreeMap<Character,Integer> keeps letters sorted.', 'front = each letter repeated count/2 times.'],
      solutionFile: 'lex-palindrome/Ex2.java',
      solutionExplain: 'Front half sorted, optional odd letter in the middle, mirrored back half.',
      tests: [{ stdin: 'Malayalam\n', stdout: 'aalmymlaa' }, { stdin: 'aabbcc\n', stdout: 'abccba' }, { stdin: 'apple\n', stdout: 'no palindromic string' }, { stdin: 'x\n', stdout: 'x' }],
    },
    {
      id: 'lexp-ex3',
      level: 'challenge',
      title: 'How many palindromes?',
      statement: 'Read a word of up to 20 letters. Print the number of DISTINCT palindromes that can be formed from all its letters (0 if impossible).',
      examples: [{ input: 'aabbcc', output: '6' }],
      hints: ['Only the left half can be chosen freely.', 'Number of arrangements of a multiset: m! / (c₁! c₂! …) where counts are halved.'],
      solutionFile: 'lex-palindrome/Ex3.java',
      solutionExplain: 'The palindrome is determined by its left half; count the distinct arrangements of the half-multiset.',
      tests: [{ stdin: 'aabbcc\n', stdout: '6' }, { stdin: 'aabb\n', stdout: '2' }, { stdin: 'abc\n', stdout: '0' }, { stdin: 'aaa\n', stdout: '1' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Which word can be rearranged into a palindrome?', options: ['apple', 'level', 'abcd', 'aabbcd'], answer: 1, explain: 'level: l:2, e:2, v:1 — one odd count.' },
    { type: 'output', q: 'Smallest palindrome from "bbaac"?', code: '// counts a:2 b:2 c:1', answer: 'abcba', explain: 'front "ab", middle "c", back "ba".' },
    { type: 'mcq', q: 'Time complexity of the counting solution?', kind: 'complexity', options: ['O(n!)', 'O(n²)', 'O(n)', 'O(2ⁿ)'], answer: 2, explain: 'One pass to count plus a pass over the alphabet.' },
    { type: 'mcq', q: 'In an even-length string, how many letters may have an odd count?', options: ['0', '1', '2', 'any'], answer: 0, explain: 'The counts add up to an even number, so the number of odd counts is even; for a palindrome it must be ≤ 1, hence 0.' },
  ],
  interview: ['How do you know if a palindrome permutation exists?', 'Build the lexicographically smallest one in O(n).', 'What about the lexicographically LARGEST?', 'Count the number of distinct palindromic permutations.'],
  videos: ['a-lex-palindrome', 'a-lex-palindrome#2'],
  revision: ['Palindrome possible ⟺ ≤ 1 letter with odd count.', 'Result = sorted half + odd letter + mirror.', 'Normalise case; use TreeMap or int[26].', 'O(n).'],
  sourceNotes: {
    discrepancies: ['The slide program starts `rear_str = " "` (a space) and subtracts `\'a\'` from characters although its first example input is "Malayalam" with a capital M; the lesson program lowercases and fixes the initial value.', 'The slide (slide 4) states the expected output for "Malayalam" as "aalmymlaa", which is correct for the lowercased word.'],
  },
});

// ───────────────────────────── Manacher ─────────────────────────────
export const manacher: Lesson = lesson({
  id: 'a-manacher',
  module: 'm5',
  title: "Manacher's Algorithm (Longest Palindromic Substring)",
  summary: 'Find the longest palindromic substring in linear time by reusing the symmetry of palindromes inside palindromes.',
  level: 'advanced',
  track: 'archive',
  minutes: 65,
  essential: false,
  prerequisites: ['m2-strings', 'a-lex-palindrome', 'm4-complexity-loops'],
  sources: ["Manacher's-Algorithm"],
  objectives: [
    'Define substring vs subsequence and find the longest palindromic substring by expanding around centres.',
    'Explain why inserting separators makes all palindromes odd-length.',
    'Describe the mirror idea and trace the centre/right-edge bookkeeping.',
    'Argue why the total work is O(n) and verify the code with a brute-force test.',
  ],
  intuition: [
    p('A **palindromic substring** is a block of consecutive characters that reads the same both ways. The longest in `forgeeksskeegfor` is `geeksskeeg` (length 10). The straightforward method is to treat every position as the **centre** of a palindrome and grow outwards while the two ends match — O(n²) in the worst case (try `aaaa…a`).'),
    p('Manacher\'s observation: **a palindrome inside a bigger palindrome is mirrored**. If we already know a big palindrome centred at C that reaches to R, then for a position i inside it, the palindrome around i is at least as large as the palindrome around its mirror position 2C − i (up to the border R). So we never need to start from radius 0 again.'),
    pre(`
        C-radius ... mirror  C  i ... R
         [ . . . . m . . . C . . i . . . ]
   what is known on the left of C also holds on the right of C
   → radius[i] = min(radius[mirror], R − i), then try to extend only beyond R
`),
    why('To treat even and odd palindromes uniformly, insert a separator between all characters: `abba` → `#a#b#b#a#`. Every palindrome of the original is now an odd-length palindrome centred on a real character or a `#`. The radius in the transformed string equals the length of the palindrome in the original. Because R only ever moves right, and every successful extension moves R right by one, the `while` loops run at most 2n times in total — linear.'),
  ],
  syntax: [
    code(`
StringBuilder t = new StringBuilder("#");            // "abba" -> "#a#b#b#a#"
for (char c : s.toCharArray()) t.append(c).append('#');
int[] p = new int[t.length()];                       // p[i] = palindrome radius around i
int centre = 0, right = 0;
for (int i = 0; i < t.length(); i++) {
    if (i < right) p[i] = Math.min(right - i, p[2 * centre - i]);   // reuse the mirror
    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < t.length()
           && t.charAt(i - p[i] - 1) == t.charAt(i + p[i] + 1)) p[i]++;   // expand
    if (i + p[i] > right) { centre = i; right = i + p[i]; }
}
`),
  ],
  tiny: [code(`
// expand around centre i
int l = i, r = i;
while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
// palindrome is s.substring(l + 1, r)
`)],
  guided: [
    prog('manacher/ExpandAroundCenter.java', 'Simple: expand around each of the 2n−1 centres, O(n²)'),
    prog('manacher/Manacher.java', 'Manacher with the "#" transformation, O(n)'),
    prog('manacher/ManacherCheck.java', 'Compare with a brute force on 20 000 random binary strings'),
  ],
  dryRun: { algo: 'manacher', input: { s: 'abaxabaxabb' }, caption: 'Radii in the transformed string; the mirror trick saves re-expansion.' },
  programs: [
    {
      file: 'manacher/ExpandAroundCenter.java',
      title: 'Expand around centres',
      role: 'simple',
      description: 'For each centre (a character or a gap) grow while the characters match. O(n²) time, O(1) space.',
      walkthrough: [
        { at: 'for (int type = 0; type < 2; type++)', text: 'type 0 = odd palindrome centred on a character; type 1 = even palindrome centred between two characters.' },
        { at: 'int r = centre + type;', text: 'For even palindromes the right pointer starts one step to the right.' },
        { at: 'int len = r - l - 1;', text: 'After the loop l and r are one step past the palindrome on both sides.' },
      ],
    },
    {
      file: 'manacher/Manacher.java',
      title: "Manacher's algorithm",
      role: 'optimized',
      description: 'Radius array over the "#"-padded string with centre/right-edge reuse. O(n) time and space.',
      walkthrough: [
        { at: 'sb.append(c).append(\'#\');', text: 'Pad: "#a#b#b#a#". Every palindrome is odd-length now.' },
        { at: 'int center = 0;', text: 'Centre of the palindrome whose right edge `right` is the furthest seen so far.' },
        { at: 'if (i < right)', text: 'i lies inside the known palindrome, so its mirror gives free information.' },
        { at: 'radius[i] = Math.min(right - i, radius[mirror]);', text: 'The mirrored radius, limited by the border (beyond `right` nothing is known).' },
        { at: 'while (i - radius[i] - 1 >= 0', text: 'Extend only while characters match — each success pushes the border right.' },
        { at: 'if (i + radius[i] > right)', text: 'New furthest palindrome: update centre and right edge.' },
        { at: 'int start = (bestCentre - r[bestCentre]) / 2;', text: 'Map back: a radius r around transformed index c covers original indices (c − r)/2 … (c − r)/2 + r − 1.' },
      ],
    },
    {
      file: 'manacher/ManacherCheck.java',
      title: 'Brute-force verification',
      role: 'demo',
      description: 'The O(n) result must equal the longest palindrome found by checking every substring.',
      walkthrough: [{ at: 'sb.append((char) (\'a\' + rnd.nextInt(2)));', text: 'A two-letter alphabet creates many palindromes and repeated structure — exactly where bugs in the mirror logic show up.' }],
    },
  ],
  complexity: [
    p('**Centre expansion:** each of the 2n−1 centres may expand up to n/2 steps → **O(n²)** worst case (`aaaa…`), O(1) space.'),
    p('**Manacher:** `right` never decreases and increases at most 2n+1 times in total; each outer iteration does O(1) work apart from successful extensions → **O(n) time, O(n) space** for the radius array and padded string.'),
  ],
  mistakes: [
    { title: 'Forgetting even-length palindromes', wrong: '// expand only from characters: misses "bb" in "cbbd"', why: 'Palindromes of even length have a centre between two characters.', fix: 'Try both (i, i) and (i, i + 1) — or insert separators.' },
    { title: 'Reading beyond the border', wrong: 'radius[i] = radius[mirror];   // without min(right - i, …)', why: 'The mirror\'s palindrome may extend past the known palindrome; nothing is known beyond `right`, so the copied radius can be too large.', fix: 'radius[i] = Math.min(right - i, radius[mirror]);' },
    { title: 'Wrong mapping back to the original string', wrong: 's.substring(centre - radius, centre + radius)', why: 'In the padded string indices are doubled. A radius r around transformed index c corresponds to original start (c − r) / 2 and length r.', fix: 'int start = (c - r) / 2; s.substring(start, start + r)' },
  ],
  practice: [
    {
      id: 'man-ex1',
      level: 'beginner',
      title: 'Is it a palindrome?',
      statement: 'Read a word. Print YES if it is a palindrome, else NO.',
      examples: [{ input: 'racecar', output: 'YES' }],
      hints: ['Two pointers moving inwards.'],
      solutionFile: 'manacher/Ex1.java',
      solutionExplain: 'Compare the characters at both ends and move inwards; any mismatch decides NO.',
      tests: [{ stdin: 'racecar\n', stdout: 'YES' }, { stdin: 'abca\n', stdout: 'NO' }, { stdin: 'a\n', stdout: 'YES' }],
    },
    {
      id: 'man-ex2',
      level: 'intermediate',
      title: 'Longest palindromic substring (expand)',
      statement: 'Read a word (length ≤ 2000). Print its longest palindromic substring; if several have the same length, print the one that starts first.',
      examples: [{ input: 'cbbd', output: 'bb' }],
      hints: ['Two kinds of centres.', 'Update only when strictly longer to keep the earliest.'],
      solutionFile: 'manacher/Ex2.java',
      solutionExplain: 'Centre expansion with odd and even centres; O(n²).',
      tests: [{ stdin: 'cbbd\n', stdout: 'bb' }, { stdin: 'babad\n', stdout: 'bab' }, { stdin: 'a\n', stdout: 'a' }, { stdin: 'abcd\n', stdout: 'a' }],
    },
    {
      id: 'man-ex3',
      level: 'challenge',
      title: 'Count palindromic substrings',
      statement: 'Read a word of up to 10⁵ letters. Print how many substrings (counted by position) are palindromes, in O(n).',
      examples: [{ input: 'abba', output: '6', explain: 'a, b, b, a, bb, abba' }],
      hints: ['In the padded string a radius r around a centre contributes ⌈r/2⌉ palindromes.', 'Use long.'],
      solutionFile: 'manacher/Ex3.java',
      solutionExplain: 'Manacher\'s radii give, for every centre, the number of palindromes centred there; summing them is O(n).',
      tests: [{ stdin: 'abba\n', stdout: '6' }, { stdin: 'aaa\n', stdout: '6' }, { stdin: 'abc\n', stdout: '3' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Why does Manacher\'s algorithm insert "#" between characters?', options: ['To speed up comparison', 'To make every palindrome odd-length', 'To sort the string', 'To avoid overflow'], answer: 1, explain: 'Even palindromes get a "#" centre.' },
    { type: 'mcq', q: 'The time complexity of Manacher\'s algorithm is…', kind: 'complexity', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(n³)'], answer: 2, explain: 'The right edge only moves forward.' },
    { type: 'output', q: 'The padded form of "abba" is…', code: '// insert # at the start, end, and between characters', answer: '#a#b#b#a#', explain: 'n characters → 2n+1 characters.' },
    { type: 'mcq', q: 'The worst case input for centre expansion is…', options: ['abcdef', 'aaaaaa', 'abababa', 'a'], answer: 1, explain: 'Every centre expands to the borders.' },
  ],
  interview: ['Explain Manacher\'s algorithm in two minutes.', 'Why is it linear although it has nested loops?', 'Substring vs subsequence?', 'Compare with a suffix-array / hashing approach.'],
  videos: ['a-manacher', 'a-manacher#2'],
  revision: ['Pad with # → all palindromes odd. radius[i] = palindrome radius at i.', 'Keep (center, right). If i < right: radius[i] = min(right − i, radius[2·center − i]).', 'Extend while chars match; update center/right.', 'O(n) time & space; original start = (c − r)/2, length r.'],
  sourceNotes: {
    discrepancies: ['The slide listing of the Java program stops in the middle of the main loop (slide 5 ends after the first while loop and slide 6 is "Thank you"), so the code is incomplete. The lesson provides a complete, tested implementation.', 'The slide text (steps 1–12) describes the version with sentinels "@" and "$" and array `p`; the Java snippet uses a different (GeeksforGeeks-style) layout with array `L`. The lesson implements the classical radius-array formulation that both describe.'],
    assumptions: ['The unfinished Java fragment on the slide is replaced by the standard algorithm; the explanation follows the 12 steps on slides 3–4.'],
  },
});

// ───────────────────────────── Natural sort ─────────────────────────────
export const naturalSort: Lesson = lesson({
  id: 'a-natural-sort',
  dryRun: { algo: 'natural-compare', input: { a: 'file10.txt', b: 'file9.txt' }, caption: 'Numbers inside names are compared by value.' },
  module: 'm5',
  title: 'Natural Sort Order',
  summary: 'Sort "file2" before "file10" by splitting names into text and number chunks and writing a Comparator.',
  level: 'intermediate',
  track: 'archive',
  minutes: 40,
  essential: false,
  prerequisites: ['m3-sorting-comparators', 'm2-strings', 'm3-collections-lists'],
  sources: ['Natural-Sort-order'],
  objectives: [
    'Explain why plain string comparison puts "file10" before "file2".',
    'Split a name into alternating digit and non-digit chunks.',
    'Write a `Comparator<String>` that compares number chunks numerically.',
    'Handle ties (leading zeros, case) deterministically.',
  ],
  intuition: [
    p('Java\'s default String order compares characters one at a time using their codes. `"file10"` vs `"file2"`: the first difference is `1` vs `2`; `1` < `2`, so `file10` sorts before `file2`. Humans expect the opposite, because 10 is bigger than 2.'),
    pre(`
plain sort    : file1.txt  file10.txt  file2.txt  file20.txt  file3.txt
natural sort  : file1.txt  file2.txt   file3.txt  file10.txt  file20.txt
`),
    why('Natural order cuts each name into chunks where digits and non-digits alternate: `file10.txt` → `file`, `10`, `.txt`. Two names are compared chunk by chunk: if both chunks are numbers, compare them as numbers (`2 < 10`); otherwise compare them as text. The first difference decides. A name that is a prefix of the other (fewer chunks) comes first.'),
  ],
  syntax: [
    p('A `Comparator<T>` is an object with `int compare(T a, T b)`: negative if a goes first, 0 if equal, positive if b goes first. In Java 8+ you can write it as a lambda: `(a, b) -> …`. `list.sort(comparator)` sorts in place and is **stable**.'),
    code(`
Comparator<String> byLength = (a, b) -> Integer.compare(a.length(), b.length());
names.sort(byLength);
`),
  ],
  tiny: [code(`
boolean isD = Character.isDigit('7');          // true
String num = "file10".substring(4);            // "10"
int c = new java.math.BigInteger("0010").compareTo(new java.math.BigInteger("10"));   // 0
`)],
  guided: [
    prog('natural-sort/NaturalSort.java', 'Chunk-based natural comparator with a demonstration run'),
    note('The slide code compares `List<String>` objects returned by `extractNumericParts` with `Comparator.comparing(...)`. A `List` is not `Comparable`, so that line **does not compile**, and even if it did it would compare "10" before "2" as text. The lesson compares chunk by chunk and uses `BigInteger` for number chunks of any length.'),
  ],
  programs: [
    {
      file: 'natural-sort/NaturalSort.java',
      title: 'Natural-order comparator',
      role: 'optimized',
      description: 'Splits both names into chunks and compares them pairwise; O(L) per comparison for names of length L.',
      walkthrough: [
        { at: 'static List<String> chunks(String s)', text: 'Splits "file10.txt" into ["file", "10", ".txt"] by walking while the character class (digit / non-digit) stays the same.' },
        { at: 'new BigInteger(p).compareTo(new BigInteger(q))', text: 'Numeric comparison of arbitrarily long digit strings (leading zeros ignored).' },
        { at: 'p.compareToIgnoreCase(q)', text: 'Text chunks compared case-insensitively so that "File2" and "file2" are neighbours.' },
        { at: 'return Integer.compare(x.size(), y.size());', text: 'All shared chunks are equal: the name with fewer chunks goes first.' },
        { at: 'names.sort(NATURAL);', text: 'List.sort is a stable merge sort (TimSort): equal names keep their input order.' },
      ],
    },
  ],
  complexity: [
    p('Each comparison costs O(L) (splitting and comparing). Sorting n names: O(n log n) comparisons → **O(n · L · log n)** time, O(n·L) space for the chunk lists. Pre-computing each name\'s chunk list once (a "Schwartzian transform") avoids re-splitting at every comparison.'),
  ],
  mistakes: [
    { title: 'Comparing numeric chunks as text', wrong: '"10".compareTo("2")   // negative: "10" < "2"', why: 'Strings are ordered by character codes, so a longer number can come first.', fix: 'Parse as number (BigInteger for unlimited length) before comparing.' },
    { title: 'Using Integer.parseInt on arbitrary chunks', wrong: 'Integer.parseInt("99999999999")', why: 'Throws NumberFormatException for numbers above 2³¹−1.', fix: 'new BigInteger(chunk) or compare by (length after stripping zeros, then text)' },
    { title: 'A comparator that is not a total order', wrong: 'return 0;   // for everything that is not obviously different', why: 'If equal-looking names (file01 vs file1) compare equal while others are ordered inconsistently, sort may throw "Comparison method violates its general contract".', fix: 'Add tie-breakers: length, then compareTo (see exercise 3).' },
  ],
  practice: [
    {
      id: 'nat-ex1',
      level: 'beginner',
      title: 'Sort file names naturally',
      statement: 'Read n and then n file names. Print them in natural order, one per line (case-insensitive text, numbers compared numerically).',
      examples: [{ input: '4\nimg12.png\nimg10.png\nimg2.png\nIMG1.png', output: 'IMG1.png\nimg2.png\nimg10.png\nimg12.png' }],
      hints: ['Chunk, compare chunk by chunk.', 'List.sort(comparator).'],
      solutionFile: 'natural-sort/Ex1.java',
      solutionExplain: 'The comparator from the lesson, applied with List.sort.',
      tests: [{ stdin: '4\nimg12.png\nimg10.png\nimg2.png\nIMG1.png\n', stdout: 'IMG1.png\nimg2.png\nimg10.png\nimg12.png' }, { stdin: '2\nb2\na10\n', stdout: 'a10\nb2' }, { stdin: '3\nx9\nx10\nx1\n', stdout: 'x1\nx9\nx10' }],
    },
    {
      id: 'nat-ex2',
      level: 'intermediate',
      title: 'Sort version numbers',
      statement: 'Read n and n version strings like 1.2.10. Print them in increasing version order on one line (a missing component counts as 0).',
      examples: [{ input: '4\n1.10\n1.2.10\n1.2.9\n1.9', output: '1.2.9 1.2.10 1.9 1.10' }],
      hints: ['split("\\\\.") and compare component by component as numbers.'],
      solutionFile: 'natural-sort/Ex2.java',
      solutionExplain: 'Numeric comparison per dotted component; pad the shorter version with zeros.',
      tests: [{ stdin: '4\n1.10\n1.2.10\n1.2.9\n1.9\n', stdout: '1.2.9 1.2.10 1.9 1.10' }, { stdin: '2\n2.0\n1.9.9\n', stdout: '1.9.9 2.0' }, { stdin: '2\n1.0\n1.0.0\n', stdout: '1.0 1.0.0' }],
    },
    {
      id: 'nat-ex3',
      level: 'challenge',
      title: 'Natural order with deterministic ties',
      statement: 'Sort names naturally, ignoring case in text chunks. If two names are numerically equal chunk by chunk (e.g. file01 and file1), the SHORTER name comes first, then plain compareTo. Print on one line separated by spaces.',
      examples: [{ input: '4\nfile01\nfile1\nFile2\nfile10', output: 'file1 file01 File2 file10' }],
      hints: ['Compare chunk by chunk, then the number of chunks, then total length, then compareTo.'],
      solutionFile: 'natural-sort/Ex3.java',
      solutionExplain: 'Adding tie-breakers makes the comparator a strict total order, so the output is deterministic.',
      tests: [{ stdin: '4\nfile01\nfile1\nFile2\nfile10\n', stdout: 'file1 file01 File2 file10' }, { stdin: '3\na1\nA1\na01\n', stdout: 'A1 a1 a01' }, { stdin: '1\nzzz\n', stdout: 'zzz' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Plain String ordering puts which first?', options: ['file2', 'file10', 'they are equal', 'depends on locale'], answer: 1, explain: 'Compare "1" with "2": 1 < 2, so file10 comes first.' },
    { type: 'mcq', q: 'How should two digit chunks "07" and "7" compare in natural order?', options: ['"07" < "7"', 'equal numerically (then tie-break)', '"07" > "7"', 'error'], answer: 1, explain: 'Numerically they are both 7; add a tie-breaker for a deterministic order.' },
    { type: 'mcq', q: 'What does a Comparator return when a should come before b?', options: ['a positive number', 'zero', 'a negative number', 'true'], answer: 2, explain: 'Negative, zero, positive: less, equal, greater.' },
    { type: 'mcq', q: 'List.sort in Java is…', options: ['stable', 'unstable', 'randomised', 'not allowed for Strings'], answer: 0, explain: 'It uses TimSort, a stable sort.' },
  ],
  interview: ['How would you implement natural sort for file names like "a10b2" vs "a10b10"?', 'What makes a comparator valid?', 'Why use BigInteger for the number chunks?'],
  videos: ['a-natural-sort', 'a-natural-sort#2'],
  revision: ['Split into digit / non-digit chunks.', 'Number chunks → numeric compare (BigInteger); text → compareToIgnoreCase.', 'First difference decides; fewer chunks first.', 'Add tie-breakers so the order is total.'],
  sourceNotes: {
    discrepancies: ['The slide\'s `Comparator.comparing(NaturalSort::extractNumericParts)` does not compile (List is not Comparable) and compares digits as text. The lesson replaces it with a chunk comparator.', 'The slide text describes sorting by the numeric part "in ascending order, otherwise regular string comparison" — which ignores that prefix text must be compared first.'],
  },
});
