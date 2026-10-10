import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

// ───────────────────────────── Binary palindrome ─────────────────────────────
export const binaryPalindrome: Lesson = lesson({
  id: 'a-binary-palindrome',
  module: 'm5',
  title: 'Binary Palindrome',
  summary: 'Decide whether the binary form of a number reads the same forwards and backwards, using strings and then pure bit operations.',
  level: 'beginner',
  track: 'archive',
  minutes: 35,
  essential: true,
  prerequisites: ['m2-number-systems-binary', 'm1-operators-bitwise', 'm1-loops'],
  sources: ['Binary-Palindrome'],
  objectives: [
    'Write a number in binary and decide by hand whether it is a palindrome.',
    'Explain what `x & 1`, `x >> 1`, `r << 1` and `r | bit` do and combine them to reverse bits.',
    'Implement both a String-based and a bit-based palindrome check and compare them.',
    'Understand why leading zeros are NOT part of the binary representation.',
  ],
  intuition: [
    p('A palindrome reads the same in both directions (`racecar`, `12321`). A **binary palindrome** is a number whose binary digits form a palindrome. 17 is `10001` — reversed it is still `10001`, so it is a binary palindrome. 16 is `10000`; reversed it is `00001`, which is not the same, so 16 is not.'),
    table(['n', 'binary', 'reversed', 'palindrome?'], [['5', '101', '101', 'yes'], ['6', '110', '011 → 11 ≠ 110', 'no'], ['9', '1001', '1001', 'yes'], ['10', '1010', '0101', 'no'], ['51', '110011', '110011', 'yes']]),
    why('Binary has **no leading zeros**: 6 is written `110`, never `0110`. So a number whose binary form ends in zeros can never be a palindrome (its reverse would start with zeros that vanish). This is why the bit-reversal trick below can compare plain integers: if the reversed bits give the same integer, they gave the same bit string.'),
    p('To reverse the bits of x with arithmetic, peel bits off the right end of x (`x & 1` reads the lowest bit; `x >> 1` removes it) and push them onto the right end of a new number (`r << 1` makes room, `r | bit` adds the bit).'),
  ],
  syntax: [
    table(['expression', 'meaning', 'example with x = 13 (1101)'], [['x & 1', 'lowest bit', '1'], ['x >> 1', 'drop lowest bit (÷ 2)', '110 = 6'], ['r << 1', 'make room (× 2)', '1 → 10'], ['r | b', 'set the lowest bit to b', '10 | 1 = 11']]),
  ],
  tiny: [code(`
int x = 5;                       // 101
System.out.println(Integer.toBinaryString(x));   // "101"
`)],
  guided: [
    prog('binary-palindrome/BinaryPalindromeString.java', 'Simple: build the binary String and compare both ends'),
    prog('binary-palindrome/BinaryPalindromeBits.java', 'Optimized: reverse the bits arithmetically (the lecture solution)'),
  ],
  dryRun: { algo: 'binary-palindrome', input: { n: '51' }, caption: 'Peel bits off x one at a time and push them onto reversed.' },
  programs: [
    {
      file: 'binary-palindrome/BinaryPalindromeString.java',
      title: 'Binary palindrome with a String',
      role: 'simple',
      description: 'Uses Integer.toBinaryString and two pointers moving inwards.',
      walkthrough: [
        { at: 'Integer.toBinaryString(x)', text: 'Gives the bits without leading zeros, e.g. 17 → "10001".' },
        { at: 'int left = 0;', text: 'Two pointers start at the two ends of the string.' },
        { at: 'bits.charAt(left) != bits.charAt(right)', text: 'One mismatch is enough to answer "no".' },
        { at: 'left++;', text: 'Move both pointers one step towards the middle.' },
      ],
    },
    {
      file: 'binary-palindrome/BinaryPalindromeBits.java',
      title: 'Binary palindrome with bit operations',
      role: 'optimized',
      description: 'Builds the bit-reversed number and compares it with the original. No String, no array.',
      walkthrough: [
        { at: 'int reversed = 0;', text: 'The number being built, starting empty.' },
        { at: 'while (rest > 0)', text: 'Each iteration consumes one bit of the copy `rest`; the loop ends when no bits remain.' },
        { at: 'reversed <<= 1;', text: 'Shift left: make room for the next bit on the right.' },
        { at: 'reversed |= (rest & 1);', text: '`rest & 1` is the lowest bit of rest; OR-ing puts it into the freed spot.' },
        { at: 'rest >>= 1;', text: 'Remove the bit we just copied.' },
        { at: 'return reversed == x;', text: 'Both numbers have the same number of bits, so they are equal exactly when the bit strings are mirror images.' },
      ],
    },
  ],
  complexity: [
    p('A number x has ⌊log₂ x⌋ + 1 bits, and each loop iteration removes one: **O(log x) time, O(1) space** for the bit method. The String method is also O(log x) time but allocates a String of that length (O(log x) space).'),
    p('Why log? Doubling the number adds only one more bit, so 10⁹ has just 30 bits — 30 iterations.'),
  ],
  mistakes: [
    { title: 'Forgetting that zero bits at the end matter', wrong: '// "10" is 2 in binary; someone treats 010 as a palindrome', why: 'Leading zeros are not stored. 2 = `10` which reversed is `01` = 1 ≠ 2, so 2 is not a palindrome.', fix: 'Compare the integer reversal with the original (the lesson code) — it handles this automatically.' },
    { title: 'Reversing the same variable you are reading', wrong: 'while (x > 0) {\n    reversed = (reversed << 1) | (x & 1);\n    x >>= 1;\n}\nreturn reversed == x;   // x is 0 now!', why: 'The loop destroys x. After the loop x == 0, so the comparison is almost always false.', fix: 'int rest = x;   // work on a copy; compare with the untouched x' },
    { title: 'Negative numbers', wrong: 'isBinaryPalindrome(-5)', why: 'Java stores negatives in two\'s complement (32 bits starting with 1…). The loop `while (x > 0)` never runs and returns `0 == -5` → false, which is a reasonable answer but a different question.', fix: 'Decide the problem\'s rule (usually: n ≥ 0) and document it.' },
  ],
  practice: [
    {
      id: 'binpal-ex1',
      level: 'beginner',
      title: 'Is it a binary palindrome?',
      statement: 'Read a non-negative integer n. Print YES if its binary representation is a palindrome, otherwise NO.',
      constraints: ['0 ≤ n ≤ 2³¹ − 1'],
      examples: [{ input: '5', output: 'YES' }, { input: '10', output: 'NO' }],
      hints: ['Compare the number with its bit reversal.', 'Remember 0 is written "0" — a palindrome.'],
      solutionFile: 'binary-palindrome/Ex1.java',
      solutionExplain: 'Reverse the bits into a second variable with shifts and compare. 0 never enters the loop, reversed stays 0 and equals n.',
      tests: [{ stdin: '5\n', stdout: 'YES' }, { stdin: '10\n', stdout: 'NO' }, { stdin: '0\n', stdout: 'YES' }, { stdin: '231\n', stdout: 'YES' }],
    },
    {
      id: 'binpal-ex2',
      level: 'intermediate',
      title: 'Count binary palindromes up to n',
      statement: 'Read n. Print how many integers from 1 to n have a palindromic binary representation.',
      constraints: ['1 ≤ n ≤ 10⁶'],
      examples: [{ input: '10', output: '5', explain: '1, 3, 5, 7, 9' }],
      hints: ['Loop and reuse your checker.', 'Check your answer by listing them for n = 10.'],
      solutionFile: 'binary-palindrome/Ex2.java',
      solutionExplain: 'Test every i in 1..n with the O(log i) check. Total O(n log n).',
      tests: [{ stdin: '10\n', stdout: '5' }, { stdin: '1\n', stdout: '1' }, { stdin: '100\n', stdout: '19' }],
    },
    {
      id: 'binpal-ex3',
      level: 'challenge',
      title: 'Next binary palindrome',
      statement: 'Read n. Print the smallest binary palindrome strictly greater than n.',
      constraints: ['0 ≤ n ≤ 10⁹'],
      examples: [{ input: '7', output: '9', explain: '8 = 1000 is not; 9 = 1001 is.' }],
      hints: ['Palindromes are fairly dense: the gap is never larger than about 2^(bits/2).', 'Start at n + 1 and keep going.'],
      solutionFile: 'binary-palindrome/Ex3.java',
      solutionExplain: 'Simple forward search is fast enough because the next palindrome is always within about 2^(len/2) steps (for a 30-bit number, at most ~33 000 steps).',
      tests: [{ stdin: '7\n', stdout: '9' }, { stdin: '0\n', stdout: '1' }, { stdin: '51\n', stdout: '63' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Which of these numbers is a binary palindrome?', options: ['6 (110)', '9 (1001)', '12 (1100)', '14 (1110)'], answer: 1, explain: '1001 reads the same both ways.' },
    { type: 'output', q: 'What does this print?', code: 'int x = 6, r = 0;\nwhile (x > 0) {\n    r = (r << 1) | (x & 1);\n    x >>= 1;\n}\nSystem.out.println(r);', answer: '3', explain: '6 = 110 → reversed 011 = 3.' },
    { type: 'mcq', q: 'What does `r << 1` do to the number r?', options: ['divides by 2', 'multiplies by 2', 'adds 1', 'flips all bits'], answer: 1, explain: 'A left shift moves every bit one place to the left: multiplication by 2.' },
    { type: 'fill', q: 'Fill in the bit that is copied each step.', template: 'reversed = (reversed << 1) | (rest ___ 1);\nrest = rest >> 1;', blanks: [['&']], explain: '`rest & 1` isolates the lowest bit.' },
    { type: 'mcq', q: 'Time complexity of the bit-reversal palindrome test?', kind: 'complexity', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, explain: 'One iteration per bit; the number of bits is log₂ n.' },
  ],
  interview: ['How would you check a binary palindrome without converting to a String?', 'Why can\'t a number that is a multiple of 2 be a binary palindrome (other than 0)?', 'How would you reverse the 32 bits of an int?'],
  videos: ['a-binary-palindrome', 'a-binary-palindrome#2'],
  revision: ['x & 1 = lowest bit; x >> 1 drops it; r << 1 | bit pushes it.', 'Reverse the bits, compare with the original.', 'O(log n) time, O(1) space.', 'Even numbers (> 0) are never binary palindromes: they end in 0 but start with 1.'],
  sourceNotes: { discrepancies: ['The slides list 16 (10000) as a non-palindrome and 17 (10001) as a palindrome — both correct. The explanation text calls the reversed value "00001"; mathematically the reversed integer is 1.'] },
});

// ───────────────────────────── Swap nibbles ─────────────────────────────
export const nibbleSwap: Lesson = lesson({
  id: 'a-nibble-swap',
  module: 'm5',
  title: 'Swap Two Nibbles in a Byte',
  summary: 'Exchange the high and low 4-bit halves of a byte using masks and shifts.',
  level: 'beginner',
  track: 'archive',
  minutes: 30,
  essential: false,
  prerequisites: ['m1-operators-bitwise', 'm2-number-systems-binary', 'm1-conversion-casting-overflow'],
  sources: ['Swap-two-nibbles-in-a-byte'],
  objectives: [
    'Define a nibble and split a byte into its two nibbles with masks 0xF0 and 0x0F.',
    'Combine shifts and OR to rebuild the byte with nibbles swapped.',
    'Explain why Java\'s signed `byte` needs `& 0xFF` before shifting.',
    'Generalise: swap adjacent bits and reverse all 32 bits.',
  ],
  intuition: [
    p('A **bit** is 0 or 1. A **nibble** is 4 bits (half a byte; it holds exactly one hexadecimal digit, 0–F). A **byte** is 8 bits = two nibbles. In `1010 1100` (0xAC) the high nibble is `1010` (A) and the low nibble is `1100` (C). Swapping the nibbles gives `1100 1010` (0xCA).'),
    pre(`
        1010 1100                  0xAC
  & 0xF0 → 1010 0000   (keep high nibble)   >>> 4 → 0000 1010
  & 0x0F → 0000 1100   (keep low  nibble)   <<  4 → 1100 0000
                                        OR → 1100 1010   0xCA
`),
    why('A mask is a pattern of 1s over the bits you want to keep: `x & mask` zeroes everything else. Shifting by 4 slides a nibble across the byte boundary: multiplying by 16 (`<< 4`) moves the low nibble up, dividing by 16 (`>>> 4`) moves the high nibble down. OR glues the two moved pieces back together because they occupy different bit positions.'),
  ],
  syntax: [
    p('Hexadecimal literals start with `0x`: `0xF0` = 240 = `1111 0000`, `0x0F` = 15 = `0000 1111`.'),
    warn('Java\'s `byte` is **signed** (−128..127). When a byte is used in an expression it is converted to `int` with sign extension: `(byte) 0xAB` becomes `0xFFFFFFAB`. Always mask with `& 0xFF` to get the unsigned 0–255 value first.', 'byte is signed'),
  ],
  tiny: [code(`
int b = 0xAC;
int swapped = ((b & 0xF0) >>> 4) | ((b & 0x0F) << 4);
System.out.println(Integer.toHexString(swapped));   // ca
`)],
  guided: [
    prog('nibble-swap/NibbleSwap.java', 'Swap nibbles of a value 0..255 and print both in binary'),
    prog('nibble-swap/NibbleSwapByte.java', 'The lecture version with the Java type byte'),
  ],
  dryRun: { algo: 'nibble-swap', input: { n: '172' }, caption: '172 = 1010 1100 → 1100 1010 = 202.' },
  programs: [
    {
      file: 'nibble-swap/NibbleSwap.java',
      title: 'Swap nibbles (int based)',
      role: 'optimized',
      description: 'Works on an int holding 0..255, which avoids all the signed-byte surprises.',
      walkthrough: [
        { at: 'int b = value & 0xFF;', text: 'Keep exactly 8 bits so the value is 0–255 regardless of the input\'s sign.' },
        { at: '(b & 0xF0) >>> 4', text: 'Isolate the high nibble and slide it to the low position.' },
        { at: '(b & 0x0F) << 4', text: 'Isolate the low nibble and slide it to the high position.' },
        { at: 'return upper | lower;', text: 'OR combines the two non-overlapping pieces.' },
        { at: 'String s = Integer.toBinaryString(v & 0xFF);', text: 'Pad with leading zeros so all 8 bits are shown.' },
      ],
    },
    {
      file: 'nibble-swap/NibbleSwapByte.java',
      title: 'Swap nibbles with the byte type (lecture version)',
      role: 'archive-original',
      description: 'Uses (byte) casts. Correct, but see the notes about sign extension.',
      walkthrough: [
        { at: '(b & 0xF0) >>> 4', text: 'b is promoted to int; the mask clears the sign-extension bits.' },
        { at: 'byteValue & 0xFF', text: 'Mask when printing, otherwise a negative byte prints as a 32-bit pattern with many leading 1s.' },
      ],
    },
  ],
  complexity: [p('A fixed number of operations on a fixed-size value: **O(1) time, O(1) space**. (For an n-bit word the same pattern still takes O(1) word operations.)')],
  mistakes: [
    { title: 'Using >> instead of >>> on a negative byte', wrong: 'byte b = (byte) 0xAB;\nint high = (b & 0xF0) >> 4;', why: 'Here the mask already removes the sign, so it happens to work — but without the mask `b >> 4` copies the sign bit and gives 0xFFFFFFFA. Always mask first.', fix: 'int high = (b & 0xF0) >>> 4;' },
    { title: 'Printing a byte directly', wrong: 'System.out.println(Integer.toBinaryString(b));   // b = (byte) 0xAB', why: 'b is sign-extended to 32 bits: prints 11111111111111111111111110101011.', fix: 'System.out.println(Integer.toBinaryString(b & 0xFF));' },
    { title: 'Forgetting that << can overflow a byte', wrong: 'byte low = (byte) (b & 0x0F);\nbyte r = low << 4;   // compile error: int to byte', why: 'Arithmetic on bytes yields int; assigning back needs a cast.', fix: 'byte r = (byte) (low << 4);' },
  ],
  practice: [
    {
      id: 'nib-ex1',
      level: 'beginner',
      title: 'Swap the nibbles',
      statement: 'Read an integer 0 ≤ x ≤ 255 and print the value obtained by swapping its two 4-bit halves.',
      examples: [{ input: '171', output: '186', explain: '171 = 1010 1011 → 1011 1010 = 186' }],
      hints: ['High nibble: (x & 0xF0) >>> 4', 'Low nibble: (x & 0x0F) << 4'],
      solutionFile: 'nibble-swap/Ex1.java',
      solutionExplain: 'Mask each nibble, shift into the other\'s place, OR together.',
      tests: [{ stdin: '171\n', stdout: '186' }, { stdin: '0\n', stdout: '0' }, { stdin: '255\n', stdout: '255' }, { stdin: '1\n', stdout: '16' }],
    },
    {
      id: 'nib-ex2',
      level: 'intermediate',
      title: 'Swap adjacent bits',
      statement: 'Read an unsigned 32-bit integer and swap bit 0 with bit 1, bit 2 with bit 3, and so on. Print the result as an unsigned number.',
      examples: [{ input: '23', output: '43', explain: '10111 → 101011' }],
      hints: ['Even-position bits: x & 0x55555555; odd-position bits: x & 0xAAAAAAAA.', 'Shift evens left by 1 and odds right by 1 (use >>>).', 'Print `result & 0xFFFFFFFFL` to see it unsigned.'],
      solutionFile: 'nibble-swap/Ex2.java',
      solutionExplain: 'The two masks split the word into non-overlapping bit sets; each set moves by one position into the other set\'s slots.',
      tests: [{ stdin: '23\n', stdout: '43' }, { stdin: '0\n', stdout: '0' }, { stdin: '4294967295\n', stdout: '4294967295' }],
    },
    {
      id: 'nib-ex3',
      level: 'challenge',
      title: 'Reverse 32 bits',
      statement: 'Read an unsigned 32-bit integer and print the integer whose binary form is the original\'s 32-bit pattern reversed.',
      examples: [{ input: '43261596', output: '964176192' }],
      hints: ['Loop 32 times: shift result left, OR in the lowest bit of x, shift x right with >>>.', 'Print as unsigned (long).'],
      solutionFile: 'nibble-swap/Ex3.java',
      solutionExplain: 'Same peel-and-push technique as the binary-palindrome lesson, but for exactly 32 iterations so leading zeros are included.',
      tests: [{ stdin: '43261596\n', stdout: '964176192' }, { stdin: '1\n', stdout: '2147483648' }, { stdin: '0\n', stdout: '0' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'How many bits are in a nibble?', options: ['2', '4', '8', '16'], answer: 1, explain: 'A nibble is half a byte: 4 bits.' },
    { type: 'output', q: 'What does this print (decimal)?', code: 'int b = 0x3C;\nSystem.out.println(((b & 0xF0) >>> 4) | ((b & 0x0F) << 4));', answer: '195', explain: '0x3C → 0xC3 = 195.' },
    { type: 'mcq', q: 'Which mask keeps only the high nibble of a byte?', options: ['0x0F', '0xF0', '0xFF', '0x80'], answer: 1, explain: '0xF0 = 1111 0000.' },
    { type: 'mcq', q: 'Why write `b & 0xFF` for a Java byte b?', options: ['To make it faster', 'To remove sign extension and get 0–255', 'To convert to hexadecimal', 'To make it a char'], answer: 1, explain: 'Bytes are signed; & 0xFF keeps the low 8 bits as an unsigned value.' },
  ],
  interview: ['How would you swap the two halves of a 32-bit int?', 'What is the difference between >> and >>>?', 'How many hex digits does a byte have?'],
  videos: ['a-nibble-swap', 'a-nibble-swap#2'],
  revision: ['byte = 8 bits = 2 nibbles; one nibble = one hex digit.', 'swap = ((b & 0xF0) >>> 4) | ((b & 0x0F) << 4)', 'Mask with & 0xFF before shifting a Java byte.', 'O(1).'],
  sourceNotes: {
    discrepancies: ['The slide\'s English steps are written as Python (`swap_nibbles(byte)`, `bin()`) but the program on the next slide is Java — the Java is what this lesson explains. In the example, the slide moves from `1010 1100` (0xAC) to `1100 1010` (0xCA), while its code demo uses 0xAB → 0xBA; both are consistent.'],
  },
});

// ───────────────────────────── Longest sequence of 1s ─────────────────────────────
export const longestOnes: Lesson = lesson({
  id: 'a-longest-ones',
  module: 'm5',
  title: 'Longest Sequence of 1s (and after flipping a bit)',
  summary: 'Find the longest run of consecutive 1 bits, then the longest run you can create by flipping a single 0.',
  level: 'intermediate',
  track: 'archive',
  minutes: 45,
  essential: false,
  prerequisites: ['a-binary-palindrome', 'm1-operators-bitwise', 'm2-strings'],
  sources: ['Longest-Sequence-of-1-after-flipping-a-bit'],
  objectives: [
    'Count the longest run of 1s with a scan using `count` and `maxCount`.',
    'Handle the "flip one 0" variant by remembering the run before the last 0.',
    'Do it on 32-bit ints without strings and handle negative numbers and the all-ones case.',
    'Verify a bit trick against brute force.',
  ],
  intuition: [
    p('Look at a binary number as a string of 0s and 1s and find the longest block of consecutive 1s. `1101110111111001` has runs 11, 111, 111111, 1 — the longest is **6**.'),
    pre(`
1 1 0 1 1 1 0 1 1 1 1 1 1 0 0 1
└┘   └───┘   └─────────┘     └ 1
 2     3          6
`),
    p('Now you may flip exactly one 0 to a 1. Flipping the 0 between `111` and `111111` joins both runs: 3 + 1 + 6 = **10**. In general a flipped 0 can join the run on its left, the run on its right, and itself.'),
    why('Scan the bits once, always remembering two things: the length of the run of 1s you are in now (`current`) and the length of the run just before the last 0 (`previous`). When you stand on a 0, flipping it would give `previous + 1 + current` — but only if that 0 is a single 0 (if two zeros in a row precede, `previous` is not adjacent). So one pass with two counters is enough.'),
  ],
  syntax: [
    table(['call / idiom', 'result'], [['`Integer.toBinaryString(x)`', 'the bits without leading zeros'], ['`Integer.bitCount(x)`', 'number of 1 bits'], ['`Integer.highestOneBit(x)`', 'only the top set bit'], ['`Integer.numberOfTrailingZeros(x)`', 'index of the lowest set bit'], ['`x & 1`', 'the lowest bit'], ['`x >>= 1`  /  `x >>> 1`', 'drop the lowest bit (arithmetic / logical)'], ['`x & (x - 1)`', 'clear the lowest set bit'], ['`x | (x << 1)`', 'every run of 1s grows by one position']]),
  ],
  tiny: [code(`
int current = 0, best = 0;
for (int i = 0; i < 32; i++) {
    if ((x & 1) == 1) { current++; best = Math.max(best, current); }
    else current = 0;
    x >>>= 1;
}
`)],
  guided: [
    prog('longest-ones/LongestOnes.java', 'Longest run of 1s (bit scan)'),
    prog('longest-ones/FlipOneBit.java', 'Longest run after flipping one bit'),
    prog('longest-ones/FlipCheck.java', 'Self-test against brute force on 200 000 random integers'),
  ],
  dryRun: { algo: 'longest-ones', input: { n: '478' }, caption: '478 = 111011110: flipping the 0 in the middle gives 3 + 1 + 4 = 8.' },
  programs: [
    {
      file: 'longest-ones/LongestOnes.java',
      title: 'Longest run of 1s',
      role: 'simple',
      description: 'Examines all 32 bits with shifts; no String needed, negative numbers work.',
      walkthrough: [
        { at: 'for (int i = 0; i < 32; i++)', text: 'An int has exactly 32 bits, so 32 iterations cover every bit including leading zeros.' },
        { at: 'if ((x & 1) == 1)', text: 'The lowest bit is 1: the current run grows.' },
        { at: 'best = Math.max(best, current);', text: 'Keep the best run seen so far.' },
        { at: 'current = 0;', text: 'A 0 ends the run.' },
        { at: 'x >>>= 1;', text: 'Unsigned shift so the sign bit does not repeat for negatives.' },
      ],
    },
    {
      file: 'longest-ones/FlipOneBit.java',
      title: 'Longest run after flipping one bit',
      role: 'optimized',
      description: 'Tracks `current` and `previous`; the candidate at every position is previous + current + 1.',
      walkthrough: [
        { at: 'if (x == -1)', text: 'All 32 bits are already 1: there is nothing to flip, the answer is 32 (not 33).' },
        { at: 'previous = ((x & 2) == 0) ? 0 : current;', text: 'On a 0: if the NEXT bit is also 0, flipping this 0 cannot connect to the earlier run (the other 0 is in the way), so previous restarts at 0; otherwise the run we just finished becomes `previous`.' },
        { at: 'best = Math.max(best, previous + current + 1);', text: 'Left run + the flipped bit + right run (the run we are in).' },
        { at: 'return Math.min(best, 32);', text: 'A 32-bit int cannot hold a longer run.' },
      ],
    },
    {
      file: 'longest-ones/FlipCheck.java',
      title: 'Brute-force verification',
      role: 'demo',
      description: 'Tries flipping every one of the 32 bits and measures the run directly, comparing with the fast version.',
      walkthrough: [
        { at: 'int y = x | (1 << bit);', text: 'Force bit number `bit` to 1 (flipping a 0, or leaving a 1 unchanged).' },
        { at: 'rnd.nextInt()', text: '200 000 random 32-bit integers, including negatives.' },
      ],
    },
  ],
  complexity: [
    p('Both programs look at each of the 32 bits once: **O(w)** where w = 32 is the word size (equivalently O(log n) for the number\'s value). Space O(1).'),
    p('The String-based version on the slides is also O(log n) time but uses O(log n) memory and breaks for negative numbers, where `Integer.toBinaryString(-1)` has 32 ones and the +1 gives 33.'),
  ],
  mistakes: [
    { title: 'Wrong decimal value in the slide example', wrong: '0b1101110111111001  // "87769" and answer "5"', why: '0b1101110111111001 is 56 825, and its longest run of 1s is 6, not 5.', fix: 'Always verify examples by running them (java LongestOnes with 56825 prints 6).' },
    { title: 'Using toBinaryString on a negative number', wrong: 'Integer.toBinaryString(-1).length()   // 32', why: 'Works but then "flip one bit" returns 33 for -1; the result must be capped at the 32 bits.', fix: 'if (x == -1) return 32;' },
    { title: 'Resetting current without saving previous', wrong: 'else { current = 0; }   // flip variant', why: 'You lose the run to the left of the zero; the join length cannot be computed.', fix: 'previous = current; current = 0;' },
  ],
  practice: [
    {
      id: 'ones-ex1',
      level: 'beginner',
      title: 'Longest run of 1s',
      statement: 'Read an int and print the length of the longest block of consecutive 1 bits in its 32-bit two\'s-complement representation.',
      examples: [{ input: '56825', output: '6' }],
      hints: ['Scan 32 bits with `x & 1` and `x >>>= 1`.'],
      solutionFile: 'longest-ones/Ex1.java',
      solutionExplain: 'Count while bits are 1, reset on 0, remember the maximum.',
      tests: [{ stdin: '56825\n', stdout: '6' }, { stdin: '0\n', stdout: '0' }, { stdin: '-1\n', stdout: '32' }, { stdin: '1775\n', stdout: '4' }],
    },
    {
      id: 'ones-ex2',
      level: 'intermediate',
      title: 'Flip one bit',
      statement: 'Read an int. You may flip exactly one bit (0 → 1 or leave it). Print the longest run of 1s you can obtain among the 32 bits.',
      examples: [{ input: '478', output: '8' }],
      hints: ['Brute force is fine: try each of the 32 bits.', 'Or track current and previous runs in one pass.'],
      solutionFile: 'longest-ones/Ex2.java',
      solutionExplain: 'Set each bit in turn (OR with 1 << bit) and measure the longest run; the maximum over 32 trials is the answer. The one-pass method from the lesson gives the same result.',
      tests: [{ stdin: '478\n', stdout: '8' }, { stdin: '0\n', stdout: '1' }, { stdin: '-1\n', stdout: '32' }, { stdin: '1775\n', stdout: '8' }],
    },
    {
      id: 'ones-ex3',
      level: 'challenge',
      title: 'Flip up to k zeros',
      statement: 'Read an int x and k. Print the longest run of 1s in the 32-bit representation after flipping at most k zeros to ones.',
      constraints: ['0 ≤ k ≤ 32'],
      examples: [{ input: '478 2', output: '9' }],
      hints: ['Sliding window over the 32 bits: keep the number of zeros inside the window ≤ k.', 'Move the left end forward whenever the window has too many zeros.'],
      solutionFile: 'longest-ones/Ex3.java',
      solutionExplain: 'Classic two-pointer window: the right end moves one step per bit; the left end only moves forward, so total work is O(32).',
      tests: [{ stdin: '478 2\n', stdout: '9' }, { stdin: '0 5\n', stdout: '5' }, { stdin: '-1 0\n', stdout: '32' }],
    },
  ],
  quiz: [
    { type: 'output', q: 'What does this print?', code: 'int x = 0b0110_1110;\nint cur = 0, best = 0;\nfor (int i = 0; i < 8; i++) {\n    if ((x & 1) == 1) best = Math.max(best, ++cur);\n    else cur = 0;\n    x >>>= 1;\n}\nSystem.out.println(best);', answer: '3', explain: '01101110: runs of 1s are 3 (bits 1–3) and 2 (bits 5–6).' },
    { type: 'mcq', q: 'In the flip variant, which value is the candidate on a 0?', options: ['current', 'previous', 'previous + current + 1', 'current × 2'], answer: 2, explain: 'Left run + flipped bit + right run.' },
    { type: 'mcq', q: 'The longest run of 1s after flipping one bit in -1 (all ones) is…', options: ['31', '32', '33', '1'], answer: 1, explain: 'All 32 bits are already 1; a 32-bit int cannot hold more.' },
    { type: 'mcq', q: 'What is the time complexity of the bit scan?', kind: 'complexity', options: ['O(1)', 'O(log n) (32 steps)', 'O(n)', 'O(n²)'], answer: 1, explain: 'One step per bit; the number of bits is logarithmic in the value.' },
  ],
  interview: ['Flip one bit to get the longest sequence of 1s — outline the O(w) solution.', 'Why do you need `previous` in addition to `current`?', 'What changes if you may flip k bits?'],
  videos: ['a-longest-ones', 'a-longest-ones#2'],
  revision: ['Scan bits: current++ on 1, reset on 0, best = max.', 'Flip variant: candidate = previous + current + 1 at each 0; previous = current (unless next bit is 0 too).', 'All ones (−1) → 32.', 'O(32) time, O(1) space.'],
  sourceNotes: {
    discrepancies: [
      'The slide states that 0b1101110111111001 equals 87769 and that its longest run is 5. It equals 56825 and the longest run is 6.',
      'The slide\'s Longafterflip code uses Integer.toBinaryString and char loops; its last line `maxLength = max(maxLength, currentLength + previousLength + 1)` yields 33 for -1. This lesson caps the answer at 32.',
    ],
  },
});

// ───────────────────────────── Josephus ─────────────────────────────
export const josephus: Lesson = lesson({
  id: 'a-josephus',
  module: 'm5',
  title: 'Josephus Problem',
  summary: 'People stand in a circle and every k-th one is removed. Who is left? A recursion that becomes a three-line loop.',
  level: 'intermediate',
  track: 'archive',
  minutes: 50,
  essential: true,
  prerequisites: ['m2-recursion', 'm2-math-gcd-lcm-primes-mod', 'm3-collections-lists'],
  sources: ['Josephus-trap'],
  objectives: [
    'Simulate the elimination with a list and print the order of elimination.',
    'Derive the recurrence J(n) = (J(n−1) + k) mod n and explain each term.',
    'Implement the recursive and iterative O(n) solutions and convert between 0-based and 1-based positions.',
    'Use the k = 2 shortcut 2·(n − 2^m) + 1.',
  ],
  intuition: [
    p('N people stand in a circle, numbered 1..N. Starting at person 1, count k people; the k-th person leaves the circle. Counting continues from the next person. The last person left is the survivor. For N = 7, k = 3 the order of leaving is 3, 6, 2, 7, 5, 1 and person **4** survives.'),
    pre(`
N = 5, k = 2          1 2 3 4 5   start counting at 1
 kill 2   →           1 _ 3 4 5   next count starts at 3
 kill 4   →           1 _ 3 _ 5   next count starts at 5
 kill 1   →           _ _ 3 _ 5   next count starts at 3
 kill 5   →           _ _ 3 _ _   survivor: 3
`),
    why('Suppose you know the answer for a circle of n−1 people, counted from the person right after the first victim. The only difference between that circle and the real circle of n people is that positions are shifted: the first victim stood at position k (0-based k−1), and the new count starts k places further round. Translating a position p of the small circle back to the big circle therefore adds k and wraps around n: **J(n) = (J(n−1) + k) mod n** (0-based). With 1 person the survivor is position 0, which seeds the loop.'),
  ],
  syntax: [p('The `%` remainder operator wraps a position around a circle: `(index + k) % size` always lands inside 0..size−1. Lists (`ArrayList<Integer>`) support `remove(index)`, which shifts the later elements left.')],
  tiny: [code(`
int ans = 0;                       // 1 person: position 0
for (int people = 2; people <= n; people++)
    ans = (ans + k) % people;
return ans + 1;                    // 1-based
`)],
  guided: [
    p('Check the formula against the slide examples by running the recursive program: (5, 2) → 3, (7, 3) → 4, (6, 2) → 5, (14, 2) → 13.'),
    prog('josephus/JosephusSimulation.java', 'Simple: act out the circle with an ArrayList (shows the elimination order)'),
    prog('josephus/JosephusRecursive.java', 'Recursive recurrence (lecture slide 9)'),
    prog('josephus/JosephusIterative.java', 'Iterative loop (lecture slide 10)'),
    prog('josephus/JosephusPowerOfTwo.java', 'Special case k = 2 with one bit trick'),
  ],
  dryRun: { algo: 'josephus', input: { n: '7', k: '3' }, caption: 'Watch the circle shrink as every 3rd person leaves.' },
  programs: [
    {
      file: 'josephus/JosephusSimulation.java',
      title: 'Josephus by simulation',
      role: 'simple',
      description: 'Keeps the circle as a list and removes the k-th person repeatedly. O(n²) because removal from the middle shifts elements.',
      walkthrough: [
        { at: 'index = (index + k - 1) % circle.size();', text: 'Skip k−1 people (counting the current one as 1) and wrap with %.' },
        { at: 'circle.remove(index)', text: 'Remove the victim. The person who was after them slides into `index`, which is exactly where the next count starts.' },
        { at: 'return circle.get(0);', text: 'One person remains.' },
      ],
    },
    {
      file: 'josephus/JosephusRecursive.java',
      title: 'Josephus recursively',
      role: 'optimized',
      description: 'J(1) = 1; J(n) = (J(n−1) + k − 1) mod n + 1 in 1-based form.',
      walkthrough: [
        { at: 'if (n == 1)', text: 'Base case: one person left.' },
        { at: 'josephus(n - 1, k)', text: 'Solve the smaller circle first.' },
        { at: '+ k - 1) % n + 1', text: 'Convert to 0-based (−1), add k, wrap in n people, convert back (+1). The slide folds the "−1 … +1" into this expression.' },
      ],
    },
    {
      file: 'josephus/JosephusIterative.java',
      title: 'Josephus iteratively',
      role: 'optimized',
      description: 'Same recurrence, built bottom-up: O(n) time, O(1) space, no recursion depth problem.',
      walkthrough: [
        { at: 'int ans = 0;', text: 'With one person the survivor is at (0-based) position 0.' },
        { at: 'ans = (ans + k) % people;', text: 'Grow the circle by one person: shift by k and wrap.' },
        { at: 'return ans + 1;', text: 'Convert to 1-based numbering.' },
      ],
    },
    {
      file: 'josephus/JosephusPowerOfTwo.java',
      title: 'Josephus for k = 2',
      role: 'optimized',
      description: 'Write n = 2^m + r; the survivor is 2r + 1. O(1).',
      walkthrough: [
        { at: 'Long.highestOneBit(n)', text: 'The largest power of two not above n (e.g. 14 → 8).' },
        { at: 'return 2 * (n - highestPowerOfTwo) + 1;', text: 'After r = n − 2^m eliminations the circle has exactly 2^m people and the next person to count is 2r + 1 — and with k = 2 and a power of two people, the first person always survives.' },
      ],
    },
  ],
  complexity: [
    p('**Simulation:** each of the n−1 removals costs O(n) (list shift) → O(n²). With a linked list or a Fenwick tree this improves but is still not simple.'),
    p('**Recurrence:** n steps of O(1) → **O(n) time**. Recursive form uses O(n) stack space; the loop uses O(1).'),
    p('**k = 2:** O(1) with a bit operation (O(log n) without highestOneBit).'),
    note('For huge n and small k there is an O(k log n) algorithm; for k = 2 it collapses to the bit trick above.'),
  ],
  mistakes: [
    { title: 'Mixing 0-based and 1-based positions', wrong: 'return (josephus(n - 1, k) + k) % n;   // returns 0..n-1 but the problem is 1-based', why: 'The answer is off by one. Decide which indexing you use and convert once, at the end (or use the slide\'s +k−1 … +1 form).', fix: 'return (josephus(n - 1, k) + k - 1) % n + 1;' },
    { title: 'Skipping k instead of k − 1', wrong: 'index = (index + k) % circle.size();   // simulation', why: 'The current person counts as the first; the k-th person is k−1 steps further. Using k kills the wrong person.', fix: 'index = (index + k - 1) % circle.size();' },
    { title: 'Stack overflow on large n', wrong: 'josephus(1_000_000, 2)   // recursive', why: 'One stack frame per person: about 10⁵–10⁶ deep recursion throws StackOverflowError.', fix: 'Use the iterative loop (same recurrence).' },
  ],
  practice: [
    {
      id: 'jos-ex1',
      level: 'beginner',
      title: 'Elimination order',
      statement: 'Read N and k. Print the numbers in the order in which people are removed; the survivor is printed last.',
      examples: [{ input: '5 2', output: '2 4 1 5 3' }],
      hints: ['Keep an ArrayList 1..N and an index.', 'index = (index + k − 1) % size, then remove(index).'],
      solutionFile: 'josephus/Ex1.java',
      solutionExplain: 'Direct simulation; the last remaining person is removed at the end of the loop so the output ends with the survivor.',
      tests: [{ stdin: '5 2\n', stdout: '2 4 1 5 3' }, { stdin: '7 3\n', stdout: '3 6 2 7 5 1 4' }, { stdin: '1 5\n', stdout: '1' }],
    },
    {
      id: 'jos-ex2',
      level: 'intermediate',
      title: 'Survivor for large N',
      statement: 'Read N and k and print the survivor\'s position (1-based).',
      constraints: ['1 ≤ N ≤ 10⁷', '1 ≤ k ≤ 10⁹'],
      examples: [{ input: '10 3', output: '4' }],
      hints: ['Simulation is too slow for N = 10⁷ — use the recurrence.', 'Use long for (ans + k).'],
      solutionFile: 'josephus/Ex2.java',
      solutionExplain: 'The loop ans = (ans + k) % people for people = 2..N takes O(N) time and O(1) space.',
      tests: [{ stdin: '10 3\n', stdout: '4' }, { stdin: '14 2\n', stdout: '13' }, { stdin: '1 7\n', stdout: '1' }],
    },
    {
      id: 'jos-ex3',
      level: 'challenge',
      title: 'Josephus with k = 2 and N up to 10¹⁸',
      statement: 'Every second person is removed (k = 2). Read N and print the survivor.',
      constraints: ['1 ≤ N ≤ 10¹⁸'],
      examples: [{ input: '100', output: '73' }],
      hints: ['Write N = 2^m + r. What happens after r eliminations?', 'Long.highestOneBit gives 2^m.'],
      solutionFile: 'josephus/Ex3.java',
      solutionExplain: 'After r eliminations 2^m people remain and the counting position is person 2r+1; with k = 2 and a power-of-two circle that person survives.',
      tests: [{ stdin: '100\n', stdout: '73' }, { stdin: '1\n', stdout: '1' }, { stdin: '64\n', stdout: '1' }, { stdin: '14\n', stdout: '13' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'For N = 6 and k = 2, who survives?', options: ['1', '3', '5', '6'], answer: 2, explain: 'Order: 2, 4, 6, 3, 1 → survivor 5.' },
    { type: 'output', q: 'What does this print?', code: 'int ans = 0;\nfor (int people = 2; people <= 5; people++)\n    ans = (ans + 2) % people;\nSystem.out.println(ans + 1);', answer: '3', explain: 'ans: 0 → (0+2)%2=0 → (0+2)%3=2 → (2+2)%4=0 → (0+2)%5=2; +1 = 3.' },
    { type: 'mcq', q: 'What is the time complexity of the iterative Josephus recurrence?', kind: 'complexity', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, explain: 'One loop iteration per person.' },
    { type: 'fill', q: 'Complete the recurrence for 0-based positions.', template: 'ans = (ans ___ k) % people;', blanks: [['+']], explain: 'Shift by k places and wrap around the circle of `people`.' },
    { type: 'mcq', q: 'For k = 2 and N = 20 (= 16 + 4) the survivor is…', options: ['9', '17', '8', '4'], answer: 0, explain: '2·4 + 1 = 9.' },
  ],
  interview: ['Derive J(n) = (J(n−1) + k) mod n.', 'How would you print the elimination order efficiently for N = 10⁵?', 'Is there a closed form for k = 2?', 'What data structure speeds up the simulation?'],
  videos: ['a-josephus', 'a-josephus#2'],
  revision: ['J(1) = 0; J(n) = (J(n−1) + k) mod n (0-based). Add 1 for 1-based.', 'Simulation: index = (index + k − 1) % size; remove.', 'k = 2: n = 2^m + r → 2r + 1.', 'Iterative O(n) time, O(1) space; recursion depth n.'],
  sourceNotes: {
    discrepancies: ['The slide\'s explanatory text says "recursively delete the Kth position until only one person is left", but its code does not delete anything: it uses the arithmetic recurrence. The slide diagram (steps 01–06) uses start = (start + k) % size with k = 1 in 0-based form, which is the same idea as the recurrence run forwards.'],
  },
});
