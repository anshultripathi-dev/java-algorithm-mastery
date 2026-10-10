import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

export const variablesTypes: Lesson = lesson({
  id: 'm1-variables-types',
  dryRun: { algo: 'swap-temp', input: { a: '3', b: '8' }, caption: 'Swapping needs a temporary variable because assignment overwrites.' },
  module: 'm1',
  title: 'Variables, Constants and Primitive Types',
  summary: 'Named boxes that hold one value of one type: the eight primitives, String, `final`, and naming rules.',
  level: 'beginner',
  track: 'syntax',
  minutes: 35,
  essential: true,
  prerequisites: ['m0-first-program'],
  sources: ['Java-Introduction_-Features_-Structure_-Data-Types'],
  objectives: [
    'Declare and initialise variables of every primitive type and of type String.',
    'Choose the right type for a quantity and know the size/range of int and long.',
    'Make a constant with `final` and follow Java naming conventions.',
    'Explain the difference between a primitive and a reference type.',
  ],
  intuition: [
    p('A **variable** is a named place in memory that holds a value. Java is **statically typed**: you declare the type once (`int count`), and the compiler guarantees that only values of that type are ever stored there. This catches whole families of mistakes before the program runs.'),
    table(['type', 'size', 'holds', 'example'], [['byte', '8 bits', 'tiny whole numbers −128…127', 'byte b = 100;'], ['short', '16 bits', '−32 768…32 767', 'short s = 30000;'], ['int', '32 bits', 'whole numbers about ±2.1 billion (the default)', 'int n = 42;'], ['long', '64 bits', 'big whole numbers', 'long big = 9_000_000_000L;'], ['float', '32 bits', 'decimals (≈7 digits)', 'float f = 3.14f;'], ['double', '64 bits', 'decimals (≈15 digits), the default', 'double d = 2.718;'], ['char', '16 bits', 'one character', "char c = 'J';"], ['boolean', '1 bit*', 'true / false', 'boolean ok = true;']]),
    p('**String** is not a primitive: it is a *reference type* (a class) holding a sequence of characters. Text is written in double quotes `"Java"`; a single character in single quotes `\'J\'`.'),
    why('Why so many integer types? Memory and range. `int` is almost always right. Use `long` when a value can exceed about 2 billion (factorials, big sums, timestamps), and `double` for measurements. Use the smaller types only for arrays of millions of items, or when the problem says so.'),
    h('Naming rules and conventions'),
    ul('Letters, digits, `_` and `$`; cannot start with a digit; cannot be a keyword (`class`, `int`, …).', '`lowerCamelCase` for variables and methods: `totalMarks`.', '`UPPER_SNAKE_CASE` for constants: `final int MAX_SIZE = 100;`.', 'Pick names that say what the value MEANS: `daysLeft`, not `x1`.'),
  ],
  syntax: [
    code(`
int age;                 // declaration: reserves a box named age
age = 20;                // assignment: puts a value in it
int year = 2026;         // declaration + initialisation
int a = 1, b = 2;        // several of the same type
final double TAX = 0.18; // constant: assigning again is a compile error
var list = new java.util.ArrayList<String>();   // 'var' lets the compiler infer the type (Java 10+)
`),
    warn('A local variable must be assigned **before it is read**: `int x; System.out.println(x);` is a compile error ("variable x might not have been initialized").'),
  ],
  tiny: [code(`
int apples = 3;
apples = apples + 2;     // now 5: the right side is computed first
`)],
  guided: [prog('m1-variables-types/VariablesAndTypes.java', 'Every primitive type, a constant, and the limits of int and long')],
  programs: [
    {
      file: 'm1-variables-types/VariablesAndTypes.java',
      title: 'A tour of the types',
      role: 'demo',
      description: 'Declares one variable of every kind and prints the limits.',
      walkthrough: [
        { at: 'long big = 9_000_000_000L;', text: 'Underscores in numbers are only for readability. The `L` suffix is required: without it 9 000 000 000 is read as an int and does not fit.' },
        { at: 'float f = 3.14f;', text: 'Decimal literals are double by default; `f` makes it float.' },
        { at: "char letter = 'J';", text: 'A char is written with single quotes and is stored as a number (its Unicode code).' },
        { at: 'final double PI = 3.14159;', text: '`final` makes it a constant.' },
        { at: 'Integer.MAX_VALUE', text: 'The largest int, 2 147 483 647. Wrapper classes expose the limits of each type.' },
        { at: '(int) letter', text: 'A cast shows the character\'s numeric code: \'J\' is 74.' },
      ],
    },
  ],
  complexity: [p('Reading or assigning a variable is O(1). A primitive variable takes a fixed number of bytes (int = 4 bytes, long = 8, double = 8).')],
  mistakes: [
    { title: 'Forgetting the L suffix', wrong: 'long big = 9000000000;', why: 'The literal 9000000000 is an int literal that is too large: "integer number too large".', fix: 'long big = 9000000000L;' },
    { title: 'Using single quotes for a String', wrong: "String s = 'Java';", why: 'Single quotes are for ONE char. Java is a String literal and needs double quotes.', fix: 'String s = "Java";' },
    { title: 'Using a variable before it is initialised', wrong: 'int total;\ntotal += 5;', why: 'total has no value yet; += reads it first.', fix: 'int total = 0;\ntotal += 5;' },
  ],
  practice: [
    { id: 'var-ex1', level: 'beginner', title: 'Swap two numbers', statement: 'Read two integers a and b and print them swapped: `b a`.', examples: [{ input: '3 8', output: '8 3' }], hints: ['You need a third variable to hold one value temporarily.'], solutionFile: 'm1-variables-types/Ex1.java', solutionExplain: 'temp keeps the first value so it is not lost when a is overwritten.', tests: [{ stdin: '3 8\n', stdout: '8 3' }, { stdin: '-1 0\n', stdout: '0 -1' }, { stdin: '5 5\n', stdout: '5 5' }] },
    { id: 'var-ex2', level: 'beginner', title: 'Rectangle', statement: 'Read the width and height (decimals). Print `area=…` and `perimeter=…` on two lines using default double printing.', examples: [{ input: '2.5 4', output: 'area=10.0\nperimeter=13.0' }], hints: ['double area = w * h;'], solutionFile: 'm1-variables-types/Ex2.java', solutionExplain: 'Plain arithmetic on doubles; string concatenation prints the value.', tests: [{ stdin: '2.5 4\n', stdout: 'area=10.0\nperimeter=13.0' }, { stdin: '1 1\n', stdout: 'area=1.0\nperimeter=4.0' }] },
    { id: 'var-ex3', level: 'intermediate', title: 'Seconds to h:m:s', statement: 'Read a number of seconds and print it as `hours:minutes:seconds` (no leading zeros).', examples: [{ input: '3725', output: '1:2:5' }], hints: ['hours = total / 3600; minutes = (total % 3600) / 60; seconds = total % 60.'], solutionFile: 'm1-variables-types/Ex3.java', solutionExplain: 'Integer division and remainder peel off the units.', tests: [{ stdin: '3725\n', stdout: '1:2:5' }, { stdin: '59\n', stdout: '0:0:59' }, { stdin: '86399\n', stdout: '23:59:59' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Which type should hold 5 000 000 000?', options: ['int', 'short', 'long', 'char'], answer: 2, explain: 'It exceeds the int limit of 2.1 billion.' },
    { type: 'bug', q: 'Which line does not compile?', code: 'int a = 5;\ndouble d = 2.5;\nint c = d;\nSystem.out.println(a + c);', answerLine: 3, explain: 'A double cannot be assigned to an int without a cast (lossy conversion).' },
    { type: 'mcq', q: 'Which is a valid variable name?', options: ['2ndPlace', 'total-marks', 'totalMarks', 'class'], answer: 2, explain: 'It cannot start with a digit, contain "-", or be a keyword.' },
    { type: 'output', q: 'What is printed?', code: 'final int LIMIT = 10;\nint x = LIMIT * 2;\nSystem.out.println(x);', answer: '20', explain: 'LIMIT * 2 = 20.' },
    { type: 'mcq', q: 'Which of these is NOT a primitive type?', options: ['int', 'boolean', 'String', 'char'], answer: 2, explain: 'String is a class (reference type).' },
  ],
  interview: ['What are the primitive types in Java and their sizes?', 'Difference between float and double?', 'What does final mean on a variable?', 'Is String a primitive?'],
  videos: ['m1-variables-types', 'm1-variables-types#2'],
  revision: ['byte/short/int/long; float/double; char; boolean; String is a reference type.', 'int default for whole numbers, double for decimals; L and f suffixes.', 'final = constant; UPPER_SNAKE_CASE; variables lowerCamelCase.', 'Initialise before use.'],
});

export const conversion: Lesson = lesson({
  id: 'm1-conversion-casting-overflow',
  dryRun: { algo: 'byte-overflow', input: { start: '120', add: '5' }, caption: 'A byte silently wraps from 127 to −128.' },
  module: 'm1',
  title: 'Type Conversion, Casting and Overflow',
  summary: 'When Java converts types for you, when you must cast, and why int arithmetic can silently wrap around.',
  level: 'beginner',
  track: 'syntax',
  minutes: 35,
  essential: true,
  prerequisites: ['m1-variables-types'],
  sources: ['Basic-I_O_-Operators'],
  objectives: [
    'Predict the type and value of mixed expressions such as `7 / 2`, `7 / 2.0` and `\'A\' + 1`.',
    'Use explicit casts for narrowing conversions and understand what is lost.',
    'Recognise integer overflow and avoid it by widening before the operation.',
    'Use `Math.addExact` / `Math.multiplyExact` to detect overflow.',
  ],
  intuition: [
    p('**Widening** (small → big: `int` → `long` → `float` → `double`) is automatic because nothing is lost. **Narrowing** (big → small) can lose information, so Java makes you say so with a **cast**: `(int) 3.99` is `3` — the fraction is **truncated**, not rounded.'),
    pre(`
byte → short → int → long → float → double      (automatic →)
                  ↑
                 char                           (narrowing needs a cast ←)
`),
    p('In an expression the operands are promoted to the **biggest type present** (and at least `int`): `3 + 4.5` is a `double`; `byte + byte` is an `int`.'),
    why('Integers have fixed width. An `int` has 32 bits, so after 2 147 483 647 the next value wraps to −2 147 483 648. No error, no warning: the bits simply roll over, like a car odometer. The cure is to **widen before you compute**: `(long) a * b`, not `(long) (a * b)` — in the second form the multiplication has already overflowed.'),
  ],
  syntax: [
    table(['expression', 'type', 'value'], [['7 / 2', 'int', '3'], ['7 / 2.0', 'double', '3.5'], ['(double) 7 / 2', 'double', '3.5 (cast applies to 7 first)'], ["'A' + 1", 'int', '66'], ["(char) ('A' + 1)", 'char', "'B'"], ['(int) 3.99', 'int', '3'], ['(byte) 200', 'byte', '−56 (wraps)'], ['Integer.MAX_VALUE + 1', 'int', '−2147483648']]),
  ],
  tiny: [code(`
int a = 100_000, b = 100_000;
long wrong = a * b;          // overflows in int arithmetic first: 1410065408
long right = (long) a * b;   // 10000000000
`)],
  guided: [prog('m1-conversion-casting-overflow/CastingAndOverflow.java', 'Widening, narrowing, overflow, char arithmetic and detection with addExact')],
  programs: [
    {
      file: 'm1-conversion-casting-overflow/CastingAndOverflow.java',
      title: 'Casting and overflow tour',
      role: 'demo',
      description: 'Every conversion rule in one runnable program.',
      walkthrough: [
        { at: 'long l = i;', text: 'Widening: no cast needed.' },
        { at: 'int truncated = (int) pi;', text: 'Narrowing: the fraction .99 is cut off. Use Math.round for rounding.' },
        { at: 'System.out.println("MAX + 1   = " + (max + 1));', text: 'int overflow: wraps to the most negative int.' },
        { at: 'long safe = (long) max + 1;', text: 'Cast the operand BEFORE the addition so the arithmetic is done in long.' },
        { at: "c = (char) (c + 2);", text: "'A' + 2 is an int (67); casting back gives 'C'." },
        { at: 'Math.addExact(Integer.MAX_VALUE, 1);', text: 'addExact throws ArithmeticException instead of wrapping silently.' },
      ],
    },
  ],
  complexity: [p('Casts and arithmetic on primitives are O(1).')],
  mistakes: [
    { title: 'Casting the result instead of the operands', wrong: 'long product = (long) (a * b);', why: 'a * b is evaluated in int first and may already have overflowed; the cast then widens the wrong value.', fix: 'long product = (long) a * b;' },
    { title: 'Expecting integer division to round', wrong: 'double avg = (a + b) / 2;   // a, b ints', why: 'The division is done on ints and truncated; the result is then widened to double.', fix: 'double avg = (a + b) / 2.0;' },
    { title: 'Assuming char + int is a char', wrong: "char next = 'a' + 1;   // fine only for constants!\nchar c = 'a';\nchar d = c + 1;      // error", why: "char + int is an int. A constant expression that fits may be assigned directly, a variable expression may not.", fix: "char d = (char) (c + 1);" },
  ],
  practice: [
    { id: 'cast-ex1', level: 'beginner', title: 'Big product', statement: 'Read two ints a, b (up to 10⁹ each) and print a × b exactly.', examples: [{ input: '100000 100000', output: '10000000000' }], hints: ['Cast one operand to long before multiplying.'], solutionFile: 'm1-conversion-casting-overflow/Ex1.java', solutionExplain: '(long) a promotes the multiplication to long arithmetic.', tests: [{ stdin: '100000 100000\n', stdout: '10000000000' }, { stdin: '2147483647 2147483647\n', stdout: '4611686014132420609' }, { stdin: '-3 4\n', stdout: '-12' }] },
    { id: 'cast-ex2', level: 'intermediate', title: 'Shift a letter', statement: 'Read an uppercase letter and k (0 ≤ k ≤ 1000). Print the letter k places further in the alphabet, wrapping Z to A.', examples: [{ input: 'Y 3', output: 'B' }], hints: ["('A' + (c - 'A' + k) % 26) then cast to char."], solutionFile: 'm1-conversion-casting-overflow/Ex2.java', solutionExplain: 'Convert to 0..25, add k, wrap with %, convert back.', tests: [{ stdin: 'Y 3\n', stdout: 'B' }, { stdin: 'A 0\n', stdout: 'A' }, { stdin: 'Z 26\n', stdout: 'Z' }] },
    { id: 'cast-ex3', level: 'intermediate', title: 'Will it overflow?', statement: 'Read two long values a and b. Print OK if a + b fits in an int, otherwise OVERFLOW.', examples: [{ input: '2000000000 2000000000', output: 'OVERFLOW' }], hints: ['Compute the sum as long and compare with Integer.MIN_VALUE / MAX_VALUE.'], solutionFile: 'm1-conversion-casting-overflow/Ex3.java', solutionExplain: 'A long sum cannot overflow for int-sized inputs; compare it with the int bounds.', tests: [{ stdin: '2000000000 2000000000\n', stdout: 'OVERFLOW' }, { stdin: '1 2\n', stdout: 'OK' }, { stdin: '-2147483648 -1\n', stdout: 'OVERFLOW' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'System.out.println(7 / 2 + 7 / 2.0);', answer: '6.5', explain: '3 + 3.5 = 6.5.' },
    { type: 'output', q: 'What is printed?', code: 'int x = Integer.MAX_VALUE;\nx++;\nSystem.out.println(x < 0);', answer: 'true', explain: 'Overflow wraps to −2147483648.' },
    { type: 'mcq', q: 'Which statement computes 100000 × 100000 correctly?', options: ['long p = 100000 * 100000;', 'long p = (long) (100000 * 100000);', 'long p = 100000L * 100000;', 'int p = 100000 * 100000;'], answer: 2, explain: 'One operand is long, so the multiplication happens in long.' },
    { type: 'output', q: 'What is printed?', code: "char c = 'A';\nc += 2;\nSystem.out.println(c);", answer: 'C', explain: 'Compound assignment includes an implicit cast.' },
    { type: 'mcq', q: '(int) 9.99 equals…', options: ['9', '10', '9.99', '0'], answer: 0, explain: 'Casting truncates toward zero.' },
  ],
  interview: ['What is integer overflow and how do you detect it?', 'Difference between implicit and explicit conversion?', 'Why does (long)(a*b) not fix overflow?', 'What does (int) -3.7 give?'],
  videos: ['m1-conversion-casting-overflow', 'm1-conversion-casting-overflow#2'],
  revision: ['Widening automatic; narrowing needs a cast and may lose data.', 'int/int is integer division; use 2.0 or a cast.', 'Overflow wraps silently; widen BEFORE the operation; Math.xxxExact detects.', 'char is a number: char + int → int.'],
});

export const arithmeticOps: Lesson = lesson({
  id: 'm1-operators-arithmetic',
  dryRun: { algo: 'expr-eval', input: { expr: '7 + 3 * 2 - 8 / 3 % 2' }, caption: 'Precedence and integer division, one reduction at a time.' },
  module: 'm1',
  title: 'Arithmetic, Assignment and Increment Operators',
  summary: '`+ - * / %`, compound assignment, `++` and `--` — and the two jobs of `%` and `/` that every algorithm uses.',
  level: 'beginner',
  track: 'syntax',
  minutes: 30,
  essential: true,
  prerequisites: ['m1-conversion-casting-overflow'],
  sources: ['Basic-I_O_-Operators'],
  objectives: [
    'Evaluate expressions with `+ - * / %`, including negative operands.',
    'Use `+=`, `-=`, `*=`, `/=`, `%=` and the prefix/postfix forms of `++` and `--`.',
    'Extract and remove the last digit of a number using `%` and `/`.',
    'Use `Math` methods for powers, roots and rounding.',
  ],
  intuition: [
    table(['operator', 'meaning', 'example', 'result'], [['+', 'add (also joins Strings)', '17 + 5', '22'], ['-', 'subtract', '17 - 5', '12'], ['*', 'multiply', '17 * 5', '85'], ['/', 'divide (integer division for ints)', '17 / 5', '3'], ['%', 'remainder (modulo)', '17 % 5', '2']]),
    why('`/` and `%` are a pair: `a == (a / b) * b + a % b`. On the clock, `% 12` wraps around; on the decimal digits of a number, `% 10` is the **last digit** and `/ 10` removes it. Loops built from these two operations drive digit sums, reversal, base conversion, GCD and half of the algorithms in this course.'),
    p('**Increment/decrement:** `x++` means "use the value, then add 1"; `++x` means "add 1, then use the value". As a statement on its own they behave the same.'),
    pre(`
int x = 5;
int y = x++;   // y = 5, x = 6      (post-increment: old value)
int z = ++x;   // x = 7, z = 7      (pre-increment : new value)
`),
    p('**Compound assignment** `a += b` is shorthand for `a = (type) (a + b)` — it even includes an implicit cast, so `byte b = 10; b += 5;` compiles while `b = b + 5;` does not.'),
  ],
  syntax: [
    table(['Math method', 'meaning', 'example'], [['Math.abs(x)', 'absolute value', 'Math.abs(-7) = 7'], ['Math.pow(a, b)', 'a to the power b (double)', 'Math.pow(2, 10) = 1024.0'], ['Math.sqrt(x)', 'square root', 'Math.sqrt(81) = 9.0'], ['Math.max(a, b) / min', 'larger / smaller', 'Math.max(3, 9) = 9'], ['Math.floor / ceil / round', 'round down / up / nearest', 'Math.round(2.5) = 3'], ['Math.floorMod(a, b)', 'modulo that is never negative', 'Math.floorMod(-7, 3) = 2']]),
  ],
  tiny: [code(`
int n = 4821;
int last = n % 10;   // 1
n = n / 10;          // 482
`)],
  guided: [prog('m1-operators-arithmetic/ArithmeticOperators.java', 'All the operators, increment forms and the digit trick')],
  programs: [
    {
      file: 'm1-operators-arithmetic/ArithmeticOperators.java',
      title: 'Arithmetic operators in action',
      role: 'demo',
      description: 'Run it and match every printed line to a rule.',
      walkthrough: [
        { at: 'a % b', text: 'Remainder after division: 17 = 3·5 + 2.' },
        { at: '-17 % 5', text: 'The sign of the result follows the LEFT operand: −2, not 3. Use Math.floorMod when you want a non-negative result.' },
        { at: 'int y = x++;', text: 'Post-increment: y receives the old value of x.' },
        { at: 'int z = ++x;', text: 'Pre-increment: x is incremented first.' },
        { at: 'n %= 7;', text: 'n = n % 7: 30 % 7 = 2.' },
        { at: 'number % 10', text: 'The last digit.' },
      ],
    },
  ],
  complexity: [p('Each arithmetic operation is O(1). Digit-peeling loops run once per digit: O(log₁₀ n).')],
  mistakes: [
    { title: 'Using ^ for powers', wrong: 'int sq = x ^ 2;', why: '`^` is bitwise XOR, not exponent: 5 ^ 2 = 7.', fix: 'int sq = x * x;   // or (int) Math.pow(x, 2)' },
    { title: 'Negative remainders', wrong: 'int idx = (i - 1) % n;   // i = 0', why: '−1 % n is −1: an invalid array index.', fix: 'int idx = ((i - 1) % n + n) % n;   // or Math.floorMod(i - 1, n)' },
    { title: 'Using ++ twice in one expression', wrong: 'int r = i++ + i++;', why: 'Hard to read and easy to get wrong; the value depends on evaluation order.', fix: 'Use separate statements.' },
  ],
  practice: [
    { id: 'arith-ex1', level: 'beginner', title: 'Digit sum', statement: 'Read a positive integer and print the sum of its digits.', examples: [{ input: '4821', output: '15' }], hints: ['while (n > 0) { sum += n % 10; n /= 10; }'], solutionFile: 'm1-operators-arithmetic/Ex1.java', solutionExplain: 'Repeatedly take the last digit and drop it.', tests: [{ stdin: '4821\n', stdout: '15' }, { stdin: '7\n', stdout: '7' }, { stdin: '1000\n', stdout: '1' }] },
    { id: 'arith-ex2', level: 'beginner', title: 'Reverse the digits', statement: 'Read a positive integer and print it reversed (trailing zeros of the input vanish: 1200 → 21).', examples: [{ input: '1200', output: '21' }], hints: ['reversed = reversed * 10 + n % 10'], solutionFile: 'm1-operators-arithmetic/Ex2.java', solutionExplain: 'Push each last digit onto the new number.', tests: [{ stdin: '1200\n', stdout: '21' }, { stdin: '12345\n', stdout: '54321' }, { stdin: '5\n', stdout: '5' }] },
    { id: 'arith-ex3', level: 'beginner', title: 'Days to weeks', statement: 'Read a number of days and print `W weeks D days`.', examples: [{ input: '30', output: '4 weeks 2 days' }], hints: ['days / 7 and days % 7'], solutionFile: 'm1-operators-arithmetic/Ex3.java', solutionExplain: 'Quotient and remainder of division by 7.', tests: [{ stdin: '30\n', stdout: '4 weeks 2 days' }, { stdin: '7\n', stdout: '1 weeks 0 days' }, { stdin: '0\n', stdout: '0 weeks 0 days' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'int x = 5;\nint y = x++ + ++x;\nSystem.out.println(y + " " + x);', answer: '12 7', explain: 'x++ yields 5 (x→6); ++x makes x 7 and yields 7. y = 12, x = 7.' },
    { type: 'output', q: 'What is -17 % 5?', code: 'System.out.println(-17 % 5);', answer: '-2', explain: 'The remainder has the sign of the dividend.' },
    { type: 'mcq', q: 'Which expression gives the last digit of n?', options: ['n / 10', 'n % 10', 'n * 10', 'n - 10'], answer: 1, explain: 'n % 10.' },
    { type: 'output', q: 'What is printed?', code: 'int n = 10;\nn += 5;\nn *= 2;\nn %= 7;\nSystem.out.println(n);', answer: '2', explain: '15 → 30 → 2.' },
    { type: 'mcq', q: 'What does 5 ^ 2 compute in Java?', options: ['25', '7', '10', '3'], answer: 1, explain: '^ is XOR: 101 ^ 010 = 111 = 7.' },
  ],
  interview: ['Difference between ++i and i++?', 'What does % do for negative numbers?', 'How do you compute x² without Math.pow?', 'How to get digits of a number?'],
  videos: ['m1-operators-arithmetic', 'm1-operators-arithmetic#2'],
  revision: ['/ on ints truncates; % is the remainder (sign of the left operand).', 'x++ yields old value; ++x yields new.', 'n % 10 = last digit; n / 10 = drop it.', '^ is XOR, not power.'],
  sourceNotes: { discrepancies: ['The "Basic I/O & Operators" deck introduces printing, input and arithmetic together; operators are covered here and I/O in the next two lessons.'] },
});

export const logicalOps: Lesson = lesson({
  id: 'm1-operators-logical-ternary',
  dryRun: { algo: 'logic-eval', input: { x: '0', y: '10', z: '5' }, caption: 'Short-circuit evaluation avoids a division by zero.' },
  module: 'm1',
  title: 'Relational, Logical and Ternary Operators; Precedence',
  summary: 'Comparing values, combining conditions with `&&` `||` `!`, short-circuiting, `?:`, and the order Java evaluates things.',
  level: 'beginner',
  track: 'syntax',
  minutes: 30,
  essential: true,
  prerequisites: ['m1-operators-arithmetic'],
  objectives: [
    'Write boolean expressions with `< <= > >= == !=`.',
    'Combine conditions with `&&`, `||` and `!` and explain short-circuit evaluation.',
    'Use the ternary operator `cond ? a : b` where it improves clarity.',
    'Read an expression using precedence and associativity rules (and add parentheses when in doubt).',
  ],
  intuition: [
    p('**Relational operators** compare two values and produce a `boolean`: `<`, `<=`, `>`, `>=`, `==` (equal), `!=` (not equal). **Logical operators** combine booleans: `&&` (AND), `||` (OR), `!` (NOT).'),
    table(['a', 'b', 'a && b', 'a || b', '!a'], [['true', 'true', 'true', 'true', 'false'], ['true', 'false', 'false', 'true', 'false'], ['false', 'true', 'false', 'true', 'true'], ['false', 'false', 'false', 'false', 'true']]),
    why('`&&` and `||` are **short-circuit**: in `a && b`, if `a` is false the whole result is false, so `b` is never evaluated; in `a || b`, if `a` is true, `b` is skipped. This is how `if (i < n && a[i] > 0)` is safe: when `i == n` the array access never happens.'),
    p('The **ternary operator** is an if-else that produces a value: `String kind = (n % 2 == 0) ? "even" : "odd";`.'),
    h('Precedence (highest → lowest) and associativity'),
    table(['level', 'operators', 'associativity'], [['1', '()  []  .', 'left → right'], ['2', 'x++ x-- ++x --x  +x -x  !  ~  (cast)', 'right → left'], ['3', '*  /  %', 'left → right'], ['4', '+  -', 'left → right'], ['5', '<<  >>  >>>', 'left → right'], ['6', '<  <=  >  >=  instanceof', 'left → right'], ['7', '==  !=', 'left → right'], ['8', '&  then  ^  then  |', 'left → right'], ['9', '&&  then  ||', 'left → right'], ['10', '?:', 'right → left'], ['11', '=  +=  -=  *= …', 'right → left']]),
  ],
  syntax: [
    table(['group', 'operators', 'notes'], [['relational', '`==  !=  <  >  <=  >=`', 'produce a boolean; compare numbers/chars (use `.equals` for Strings)'], ['logical', '`&&  ||  !`', '`&&` and `||` short-circuit (the right side may not run)'], ['non-short-circuit', '`&  |  ^`', 'on booleans they always evaluate both sides'], ['ternary', '`cond ? a : b`', 'an expression: it has a value (a or b)']]),
    code(`
int max = (a > b) ? a : b;                       // ternary
boolean ok = x >= 0 && x <= 100;                 // range check
boolean either = a == 0 || b == 0;
// precedence, high to low:   !   * / %   + -   < <= > >=   == !=   &&   ||   ?:   =
`, 'Forms'),
  ],
  tiny: [code(`
boolean valid = age >= 18 && age <= 65;
int bigger = (a > b) ? a : b;
`)],
  guided: [prog('m1-operators-logical-ternary/LogicalOperators.java', 'Truth tables, short-circuit evaluation made visible, ternary and precedence')],
  programs: [
    {
      file: 'm1-operators-logical-ternary/LogicalOperators.java',
      title: 'Logic in action',
      role: 'demo',
      description: 'Helper method `noisy` prints when it is evaluated, which proves short-circuiting.',
      walkthrough: [
        { at: 'noisy("left", false) && noisy("right", true)', text: 'Only "left" is printed: the right operand is never evaluated.' },
        { at: 'int larger = (a > b) ? a : b;', text: 'Ternary: choose a value by a condition.' },
        { at: 'true || false && false', text: '&& binds tighter than ||, so this is true || (false && false) = true.' },
        { at: '(true || false) && false', text: 'Parentheses override precedence: false.' },
      ],
    },
  ],
  complexity: [p('All O(1). Short-circuiting can also save time: place the cheaper / more likely-to-fail test first.')],
  mistakes: [
    { title: '= instead of ==', wrong: 'if (x = 5) { ... }', why: 'Assignment, not comparison. For ints this is a compile error; for booleans it silently assigns.', fix: 'if (x == 5)' },
    { title: 'Chained comparison', wrong: 'if (0 <= x <= 10)', why: 'Java evaluates (0 <= x) → boolean, then boolean <= 10: compile error.', fix: 'if (0 <= x && x <= 10)' },
    { title: 'Comparing Strings with ==', wrong: 'if (name == "Asha")', why: '== compares references, not content; it may work by accident and fail later.', fix: 'if (name.equals("Asha"))' },
  ],
  practice: [
    { id: 'logic-ex1', level: 'beginner', title: 'Leap year', statement: 'Read a year. Print `leap` if it is a leap year (divisible by 4, except centuries unless divisible by 400), otherwise `common`.', examples: [{ input: '2000', output: 'leap' }], hints: ['(y % 4 == 0 && y % 100 != 0) || y % 400 == 0'], solutionFile: 'm1-operators-logical-ternary/Ex1.java', solutionExplain: 'Combine the three divisibility rules with && and ||.', tests: [{ stdin: '2000\n', stdout: 'leap' }, { stdin: '1900\n', stdout: 'common' }, { stdin: '2024\n', stdout: 'leap' }, { stdin: '2023\n', stdout: 'common' }] },
    { id: 'logic-ex2', level: 'beginner', title: 'Maximum of three', statement: 'Read three integers and print the largest using only ternary operators.', examples: [{ input: '4 9 7', output: '9' }], hints: ['Nest a ternary inside a ternary.'], solutionFile: 'm1-operators-logical-ternary/Ex2.java', solutionExplain: 'Compare a with b, then the winner with c.', tests: [{ stdin: '4 9 7\n', stdout: '9' }, { stdin: '5 5 5\n', stdout: '5' }, { stdin: '-1 -2 -3\n', stdout: '-1' }] },
    { id: 'logic-ex3', level: 'intermediate', title: 'In range?', statement: 'Read x, lo and hi. Print IN if lo ≤ x ≤ hi, else OUT.', examples: [{ input: '5 1 10', output: 'IN' }], hints: ['Two comparisons joined by &&.'], solutionFile: 'm1-operators-logical-ternary/Ex3.java', solutionExplain: 'x >= lo && x <= hi.', tests: [{ stdin: '5 1 10\n', stdout: 'IN' }, { stdin: '11 1 10\n', stdout: 'OUT' }, { stdin: '1 1 10\n', stdout: 'IN' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'int a = 5, b = 0;\nSystem.out.println(b != 0 && a / b > 1);', answer: 'false', explain: 'b != 0 is false, so a / b is never evaluated (no exception).' },
    { type: 'output', q: 'What is printed?', code: 'System.out.println(true || false && false);', answer: 'true', explain: '&& is evaluated before ||.' },
    { type: 'mcq', q: 'Which is the correct way to test 1 ≤ x ≤ 10?', options: ['1 <= x <= 10', '1 <= x && x <= 10', '1 <= x & <= 10', 'x in 1..10'], answer: 1, explain: 'Two comparisons joined by &&.' },
    { type: 'mcq', q: 'What does `5 > 3 ? "yes" : "no"` evaluate to?', options: ['true', '"yes"', '"no"', 'a compile error'], answer: 1, explain: 'The condition is true, so the first value.' },
    { type: 'bug', q: 'Which line is a classic bug?', code: 'int score = 90;\nif (score = 100) {\n    System.out.println("perfect");\n}', answerLine: 2, explain: '`=` assigns; use `==` to compare.' },
  ],
  interview: ['What is short-circuit evaluation?', 'Difference between & and &&?', 'Operator precedence of && vs ||?', 'How do you compare Strings?'],
  videos: ['m1-operators-logical-ternary', 'm1-operators-logical-ternary#2'],
  revision: ['< <= > >= == != give boolean; && || ! combine.', '&& and || short-circuit: right side may be skipped.', 'cond ? a : b is an expression.', 'Precedence: arithmetic > comparison > == > && > || > ?: > =; use parentheses.'],
});

export const bitwiseOps: Lesson = lesson({
  id: 'm1-operators-bitwise',
  dryRun: { algo: 'bit-ops', input: { a: '12', b: '10', k: '2' }, caption: 'Every bitwise operator on two bytes, in binary.' },
  module: 'm1',
  title: 'Bitwise Operators and Shifts',
  summary: '`& | ^ ~ << >> >>>` — operating on the individual bits of an integer, with the everyday bit tricks.',
  level: 'intermediate',
  track: 'syntax',
  minutes: 40,
  essential: true,
  prerequisites: ['m1-operators-logical-ternary'],
  sources: ['Basic-I_O_-Operators'],
  objectives: [
    'Apply AND, OR, XOR, NOT and the three shifts to small numbers by hand, in binary.',
    'Read, set, clear and toggle a given bit using masks.',
    'Use `x & (x - 1)` and `x & -x` for power-of-two tests and bit counting.',
    'Tell `>>` (arithmetic) from `>>>` (logical).',
  ],
  intuition: [
    p('Every integer is stored as a row of bits. Bitwise operators work on **each bit position independently**:'),
    pre(`
        a = 1100  (12)          b = 1010  (10)
a & b = 1000  (8)    both bits 1              AND
a | b = 1110  (14)   at least one bit 1       OR
a ^ b = 0110  (6)    bits differ               XOR
~a    = ...0011      flip every bit            NOT  (= -a - 1)
a << 2 = 110000 (48) shift left, fill 0        × 2²
a >> 2 = 0011  (3)   shift right, keep sign    ÷ 2²
`),
    why('A **mask** is a number whose 1-bits select the positions you care about. `x & mask` keeps only those bits; `x | mask` forces them to 1; `x ^ mask` flips them; `x & ~mask` clears them. With `1 << i` you can build a mask for bit i, which gives the four universal bit operations below.'),
    table(['goal', 'expression'], [['read bit i', '(x >> i) & 1'], ['set bit i', 'x | (1 << i)'], ['clear bit i', 'x & ~(1 << i)'], ['toggle bit i', 'x ^ (1 << i)'], ['is x a power of two? (x > 0)', '(x & (x - 1)) == 0'], ['clear the lowest set bit', 'x & (x - 1)'], ['isolate the lowest set bit', 'x & -x'], ['is x odd?', '(x & 1) == 1']]),
    p('**Shifts:** `x << k` multiplies by 2ᵏ (until overflow). `x >> k` divides by 2ᵏ rounding toward −∞ and **copies the sign bit** (arithmetic shift), so −8 >> 1 is −4. `x >>> k` shifts in zeros (logical shift): −8 >>> 28 is 15 for an int.'),
  ],
  syntax: [warn('Binary literals use `0b`: `0b1100` is 12; hexadecimal uses `0x`: `0xFF` is 255. In Java the shift distance is taken mod 32 for int (mod 64 for long): `1 << 32` is 1, not 0.', 'Literals and a trap')],
  tiny: [code(`
int x = 0b0101_0000;
boolean bit4 = ((x >> 4) & 1) == 1;     // true
x = x | (1 << 0);                      // 0b0101_0001
`)],
  guided: [prog('m1-operators-bitwise/BitwiseOperators.java', 'Every operator printed in binary, plus set/clear/toggle')],
  programs: [
    {
      file: 'm1-operators-bitwise/BitwiseOperators.java',
      title: 'Bitwise operators in binary',
      role: 'demo',
      description: 'A helper prints 8-bit patterns so you can verify each operator by eye.',
      walkthrough: [
        { at: 'static String bits(int v)', text: 'Masking with 0xFF shows only the low 8 bits; padded with zeros for alignment.' },
        { at: 'a & b', text: 'Only positions that are 1 in both survive.' },
        { at: '~a', text: 'Flips every bit; for two\'s complement ~a == −a − 1.' },
        { at: '-8 >> 1', text: 'Arithmetic shift keeps the sign: −4.' },
        { at: '-8 >>> 28', text: 'Logical shift brings in zeros at the top: 15.' },
        { at: '(x >> bit) & 1', text: 'Read one bit: shift it to position 0, then mask with 1.' },
      ],
    },
  ],
  complexity: [p('Every bitwise operation on a machine word is O(1) — a single CPU instruction. Algorithms using them to process one bit at a time on a b-bit number cost O(b) = O(log value).')],
  mistakes: [
    { title: 'Mixing & with &&', wrong: 'if (x > 0 & y / x > 1)', why: '`&` does not short-circuit: y / x is evaluated even if x == 0 → ArithmeticException.', fix: 'if (x > 0 && y / x > 1)' },
    { title: 'Forgetting precedence', wrong: 'if (x & 1 == 1)', why: '`==` binds tighter than `&`: it parses as x & (1 == 1), a type error.', fix: 'if ((x & 1) == 1)' },
    { title: 'Shifting by negative or too large amounts', wrong: 'int y = 1 << 32;   // 1', why: 'The shift distance is reduced mod 32: you get 1, not 0.', fix: 'Use long (1L << 32) or check the distance.' },
  ],
  practice: [
    { id: 'bit-ex1', level: 'beginner', title: 'Power of two?', statement: 'Read a positive integer (up to 10¹⁸). Print YES if it is a power of two, otherwise NO.', examples: [{ input: '64', output: 'YES' }], hints: ['n & (n − 1) clears the lowest set bit; a power of two has only one.'], solutionFile: 'm1-operators-bitwise/Ex1.java', solutionExplain: 'A power of two has exactly one 1 bit, so clearing it leaves 0.', tests: [{ stdin: '64\n', stdout: 'YES' }, { stdin: '12\n', stdout: 'NO' }, { stdin: '1\n', stdout: 'YES' }, { stdin: '1024\n', stdout: 'YES' }] },
    { id: 'bit-ex2', level: 'intermediate', title: 'Count the 1 bits', statement: 'Read a non-negative int and print how many 1 bits its binary form has (without Integer.bitCount).', examples: [{ input: '255', output: '8' }], hints: ['n &= n − 1 removes one set bit each time.'], solutionFile: 'm1-operators-bitwise/Ex2.java', solutionExplain: 'Brian Kernighan\'s method: the loop runs once per set bit.', tests: [{ stdin: '255\n', stdout: '8' }, { stdin: '0\n', stdout: '0' }, { stdin: '1024\n', stdout: '1' }, { stdin: '2147483647\n', stdout: '31' }] },
    { id: 'bit-ex3', level: 'intermediate', title: 'Set, clear or toggle', statement: 'Read n, a bit index i (0-based) and an operation word `set`, `clear` or `toggle`. Print the resulting integer.', examples: [{ input: '5 1 set', output: '7' }], hints: ['mask = 1 << i; then |, & ~mask, or ^.'], solutionFile: 'm1-operators-bitwise/Ex3.java', solutionExplain: 'Build the one-bit mask and apply the matching operator.', tests: [{ stdin: '5 1 set\n', stdout: '7' }, { stdin: '5 0 clear\n', stdout: '4' }, { stdin: '5 2 toggle\n', stdout: '1' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is 12 & 10?', code: 'System.out.println(12 & 10);', answer: '8', explain: '1100 & 1010 = 1000.' },
    { type: 'output', q: 'What is 5 ^ 3?', code: 'System.out.println(5 ^ 3);', answer: '6', explain: '101 ^ 011 = 110.' },
    { type: 'mcq', q: 'Which expression sets bit 3 of x?', options: ['x & (1 << 3)', 'x | (1 << 3)', 'x ^ 3', 'x << 3'], answer: 1, explain: 'OR with the mask forces the bit to 1.' },
    { type: 'output', q: 'What is -16 >> 2?', code: 'System.out.println(-16 >> 2);', answer: '-4', explain: 'Arithmetic shift divides by 4 keeping the sign.' },
    { type: 'mcq', q: 'x & (x - 1) does what?', options: ['clears the lowest set bit', 'sets the lowest bit', 'negates x', 'doubles x'], answer: 0, explain: 'Subtracting 1 flips the lowest set bit and everything below it.' },
  ],
  interview: ['How do you check if a number is a power of two?', 'Difference between >> and >>>?', 'How do you count set bits?', 'Swap two variables without a temp using XOR.'],
  videos: ['m1-operators-bitwise', 'm1-operators-bitwise#2'],
  revision: ['& AND, | OR, ^ XOR, ~ NOT, << >> >>>.', 'mask = 1 << i; read (x>>i)&1; set |; clear & ~; toggle ^.', 'x & (x−1) clears lowest set bit → power-of-two test, popcount.', '<< k = ×2ᵏ; >> keeps sign; >>> fills zeros.'],
});

export const outputPrinting: Lesson = lesson({
  id: 'm1-output-printing',
  dryRun: { algo: 'printf-fmt', input: { name: 'Pen', price: '2.5', qty: '7' }, caption: 'How each printf specifier pads its argument.' },
  module: 'm1',
  title: 'Output: print, println, printf and String Concatenation',
  summary: 'Every way to show results, including the famous `+` puzzle and number formatting.',
  level: 'beginner',
  track: 'syntax',
  minutes: 30,
  essential: true,
  prerequisites: ['m1-operators-arithmetic'],
  sources: ['Basic-I_O_-Operators'],
  objectives: [
    'Choose between `print`, `println` and `printf`.',
    'Predict the output of mixed `+` expressions of numbers and Strings.',
    'Format numbers with width, precision, zero padding and thousands separators.',
    'Know the three standard streams: `System.in`, `System.out`, `System.err`.',
  ],
  intuition: [
    p('Java has three **standard streams**: `System.in` (input), `System.out` (normal output) and `System.err` (error messages). The three output methods:'),
    table(['method', 'what it does'], [['print(x)', 'prints x, stays on the same line'], ['println(x)', 'prints x, then moves to the next line'], ['printf(format, args…)', 'prints formatted text; add %n for a newline']]),
    why('`+` has two jobs. Between two numbers it **adds**; as soon as one operand is a String it **joins** (concatenates) — and Java works **left to right**. That is why `3 + 4 + "x"` is `"7x"` but `"x" + 3 + 4` is `"x34"`. Parentheses fix it: `"x" + (3 + 4)` is `"x7"`.'),
    pre(`
System.out.println(3 + 4);              // 7
System.out.println("3" + "4");          // 34
System.out.println("" + 3 + 4);         // 34
System.out.println(3 + 4 + 3 + " " + 4 + 3);   // 10 43   ← the lecture puzzle
System.out.println("Result: " + 3 + 4); // Result: 34
System.out.println("Result: " + (3 + 4)); // Result: 7
`),
    table(['format', 'meaning', 'example → output'], [['%d', 'integer', 'printf("%d", 42) → 42'], ['%5d / %-5d / %05d', 'width / left-aligned / zero padded', '[   42] [42   ] [00042]'], ['%f / %.2f', 'decimal / 2 decimals', '3.141593 / 3.14'], ['%,d', 'thousands separator', '1,234,567'], ['%s', 'String (any object)', 'Asha'], ['%c  %b  %x', 'char / boolean / hex', 'z  true  ff'], ['%n', 'platform newline', '']]),
    p('A `char` prints as a character (`char c = 65;` prints `A`); cast it to see the number: `(int) c`. `char + int` is an int: `y + 1` prints 66 for `y = \'A\'`.'),
  ],
  syntax: [
    table(['specifier', 'meaning', 'example → output'], [['%d', 'int / long', '`printf("%d", 42)` → `42`'], ['%5d  %-5d  %05d', 'width 5, left-justified, zero-padded', '`[   42]  [42   ]  [00042]`'], ['%,d', 'thousands separator', '`printf("%,d", 1234567)` → `1,234,567`'], ['%f  %.2f  %8.3f', 'double (6 decimals default), 2 decimals, width 8 / 3 decimals', '`printf("%.2f", 3.14159)` → `3.14`'], ['%s  %-10s', 'String (any object), left-justified in 10', '`printf("%s", "hi")` → `hi`'], ['%c  %b', 'char, boolean', '`printf("%c", 65)` → `A`'], ['%x  %o  %e', 'hex, octal, scientific', '`printf("%x", 255)` → `ff`'], ['%n  %%', 'line break, literal percent', '']]),
    code(`
System.out.print("no newline");
System.out.println("with newline");
System.out.printf("%-8s|%6.2f%n", "tea", 1.5);        // formatted, you add %n yourself
String line = String.format("%03d", 7);              // same specifiers, returns a String
`),
  ],
  tiny: [code(`
System.out.printf("%s scored %d (%.1f%%)%n", "Asha", 45, 90.0);
// Asha scored 45 (90.0%)
`)],
  guided: [prog('m1-output-printing/PrintingDemo.java', 'print / println / printf and the + puzzle, line by line')],
  programs: [
    {
      file: 'm1-output-printing/PrintingDemo.java',
      title: 'Printing in every style',
      role: 'demo',
      description: 'The lecture\'s "guess the output" examples plus formatting.',
      walkthrough: [
        { at: 'System.out.println();', text: 'println with no argument prints just a newline.' },
        { at: 'System.out.println(3 + 4 + a + " " + b + a);', text: 'Left to right: 3 + 4 + 3 = 10 (numbers), then " " turns it into a String, then b and a are JOINED: "10 43".' },
        { at: 'char x = 65;', text: 'A char initialised with a number prints as its character.' },
        { at: 'System.out.println(y + 1);', text: "'A' + 1 is an int (66), not a char." },
        { at: '[%5d] [%-5d] [%05d]', text: 'Width 5, left-justified, zero padded.' },
      ],
    },
  ],
  complexity: [p('Printing is O(length of output). In loops, build a StringBuilder and print once: thousands of tiny println calls are far slower than one large print.')],
  mistakes: [
    { title: 'Forgetting %n or \\n in printf', wrong: 'System.out.printf("%d", 5);\nSystem.out.printf("%d", 6);   // 56 on one line', why: 'printf does not add a newline.', fix: 'System.out.printf("%d%n", 5);' },
    { title: 'Wrong format letter', wrong: 'System.out.printf("%d", 3.5);', why: 'IllegalFormatConversionException: d != java.lang.Double.', fix: 'System.out.printf("%.1f", 3.5);' },
    { title: 'Concatenating before adding', wrong: 'System.out.println("Sum = " + a + b);', why: 'Prints the digits side by side: "Sum = 34".', fix: 'System.out.println("Sum = " + (a + b));' },
  ],
  practice: [
    { id: 'out-ex1', level: 'beginner', title: 'Times table', statement: 'Read n and print `n x i = n·i` for i = 1..5, one line each.', examples: [{ input: '7', output: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35' }], hints: ['printf("%d x %d = %d%n", …)'], solutionFile: 'm1-output-printing/Ex1.java', solutionExplain: 'A loop with printf.', tests: [{ stdin: '7\n', stdout: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35' }, { stdin: '1\n', stdout: '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5' }] },
    { id: 'out-ex2', level: 'intermediate', title: 'Invoice total', statement: 'Read a unit price (decimal) and a quantity. Print `Total: X` with thousands separators and exactly two decimals.', examples: [{ input: '1999.5 3', output: 'Total: 5,998.50' }], hints: ['%,.2f'], solutionFile: 'm1-output-printing/Ex2.java', solutionExplain: '%,.2f formats with grouping and two decimals.', tests: [{ stdin: '1999.5 3\n', stdout: 'Total: 5,998.50' }, { stdin: '0.1 3\n', stdout: 'Total: 0.30' }, { stdin: '1000000 1\n', stdout: 'Total: 1,000,000.00' }] },
    { id: 'out-ex3', level: 'beginner', title: 'Predict, then run', statement: 'The program prints the value of `a + b + "=" + a + b` for a = 2, b = 3. Run it and write what it prints (this exercise checks that you reproduce the output exactly).', examples: [{ input: '(no input)', output: '5=23' }], hints: ['Left to right.'], solutionFile: 'm1-output-printing/Ex3.java', solutionExplain: '2 + 3 = 5 first; then "=" is joined, then 2 and 3 are joined as text.', tests: [{ stdin: '', stdout: '5=23' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'System.out.println(1 + 2 + "3" + 4 + 5);', answer: '3345', explain: '1 + 2 = 3, then "3" joins → "33", then "4", "5" → 3345.' },
    { type: 'output', q: 'What is printed?', code: 'char c = \'A\';\nSystem.out.println(c + 1);', answer: '66', explain: 'char + int is an int.' },
    { type: 'mcq', q: 'Which prints 3.14?', options: ['printf("%d", 3.14159)', 'printf("%.2f", 3.14159)', 'printf("%s", 3.14159, 2)', 'println(%.2f)'], answer: 1, explain: '%.2f formats a decimal with two digits.' },
    { type: 'mcq', q: 'Which method does NOT end the line?', options: ['println', 'printf("%n")', 'print', 'println()'], answer: 2, explain: 'print leaves the cursor on the same line.' },
    { type: 'mcq', q: 'System.err is used for…', options: ['normal results', 'error messages', 'keyboard input', 'files'], answer: 1, explain: 'The standard error stream.' },
  ],
  interview: ['Difference between print and println?', 'What does "Hello" + 1 + 2 print?', 'How do you format a double to two decimals?', 'Why is System.out.println slow in loops?'],
  videos: ['m1-output-printing', 'm1-output-printing#2'],
  revision: ['print (same line), println (newline), printf (format, add %n).', '+ adds numbers, joins once a String is involved; left to right.', '%d %f %.2f %s %c %b %x %n; %5d width, %-5d left, %05d zeros, %,d groups.', 'char prints as a char; char+int is int.'],
});

export const inputScanner: Lesson = lesson({
  id: 'm1-input-scanner',
  dryRun: { algo: 'scanner-tokens', input: { text: '12 7|Alice Smith|', calls: 'nextInt,nextInt,nextLine,nextLine' }, caption: 'nextInt() leaves the line break behind, so nextLine() returns an empty string.' },
  module: 'm1',
  title: 'Input: Scanner, BufferedReader and Command-Line Arguments',
  summary: 'Read numbers, words and lines from the keyboard or a file, process input until it ends, and use `args`.',
  level: 'beginner',
  track: 'syntax',
  minutes: 35,
  essential: true,
  prerequisites: ['m1-output-printing'],
  sources: ['Basic-I_O_-Operators'],
  objectives: [
    'Read ints, doubles, words and lines with `Scanner`.',
    'Avoid the `nextInt()` / `nextLine()` newline trap.',
    'Read until end of input with `hasNext…()`.',
    'Use `BufferedReader` for fast input and `String[] args` for command-line arguments.',
  ],
  intuition: [
    p('Input arrives as a stream of characters. **Scanner** splits it into **tokens** (separated by whitespace) and converts them: `nextInt()`, `nextLong()`, `nextDouble()`, `next()` (a word) and `nextLine()` (the rest of the current line).'),
    table(['way', 'when to use', 'notes'], [['Scanner(System.in)', 'most programs', 'convenient, a bit slow for huge input'], ['BufferedReader + InputStreamReader', 'large inputs, contests', 'readLine() returns a String; parse with Integer.parseInt'], ['Console', 'passwords in a terminal', 'does not work inside an IDE'], ['String[] args', 'values given on the command line', 'always Strings: parse them']]),
    why('`nextInt()` reads the digits but leaves the **line break** in the stream. A following `nextLine()` then returns the empty rest of that line instead of the next line. After a numeric read, call `nextLine()` once to consume the newline before reading a full line of text.'),
    code(`
int age = sc.nextInt();
sc.nextLine();                 // eat the newline left behind
String name = sc.nextLine();   // now reads the real next line
`),
    p('To process input of unknown length use the **has** methods: `while (sc.hasNextInt()) { … }` ends at end-of-input (Ctrl-D in a macOS terminal). Command-line arguments are passed after the class name: `java Average 67 98 91` → `args = {"67","98","91"}`.'),
  ],
  syntax: [code(`
import java.util.Scanner;
Scanner sc = new Scanner(System.in);
int    n = sc.nextInt();
double x = sc.nextDouble();
String w = sc.next();
String line = sc.nextLine();
sc.close();                    // optional for System.in
`)],
  tiny: [code(`
Scanner sc = new Scanner(System.in);
int a = sc.nextInt();
int b = sc.nextInt();
System.out.println(a + b);
`)],
  guided: [prog('m1-input-scanner/ScannerDemo.java', 'Tokens, the newline trap and reading until end of input'), prog('m1-input-scanner/FastReader.java', 'BufferedReader + StringTokenizer'), prog('m1-input-scanner/CommandLineArgs.java', 'Arguments are Strings: run it with `java CommandLineArgs 67 98 91`')],
  programs: [
    {
      file: 'm1-input-scanner/ScannerDemo.java',
      title: 'Scanner in detail',
      role: 'demo',
      description: 'Sample input: `3 4.5 hello` then a sentence, then numbers.',
      walkthrough: [
        { at: 'int count = sc.nextInt();', text: 'Reads one whitespace-delimited token and converts it to int.' },
        { at: 'sc.nextLine();', text: 'Consumes the newline that follows "hello" so the next nextLine() returns the sentence.' },
        { at: 'while (sc.hasNextInt())', text: 'True while another int is available — ends cleanly at end-of-input.' },
      ],
    },
    {
      file: 'm1-input-scanner/FastReader.java',
      title: 'BufferedReader',
      role: 'optimized',
      description: 'Much faster for 10⁵+ numbers.',
      walkthrough: [
        { at: 'new BufferedReader(new InputStreamReader(System.in))', text: 'Wrap the byte stream System.in in a character reader, then a buffer. Hard to remember, hence a template.' },
        { at: 'Integer.parseInt(br.readLine().trim())', text: 'readLine() returns the whole line as a String; convert it yourself.' },
        { at: 'StringTokenizer st', text: 'Splits the line into whitespace-separated tokens.' },
      ],
    },
    {
      file: 'm1-input-scanner/CommandLineArgs.java',
      title: 'Command-line arguments',
      role: 'demo',
      description: 'Arguments arrive as Strings; "1" + "8" joins to "18"; parseInt converts.',
      walkthrough: [
        { at: 'if (args.length == 0)', text: 'Always check how many arguments you received.' },
        { at: 'Double.parseDouble(s)', text: 'Converts the text "67" to the number 67.0.' },
        { at: 'args[0] + args[1]', text: 'The lecture\'s trap: two Strings are JOINED, not added.' },
      ],
    },
  ],
  complexity: [p('Scanner parses roughly 10⁶ tokens per second; BufferedReader+StringTokenizer is about 5–10× faster. For n up to 10⁵ either is fine; for 10⁶+ numbers prefer the buffered reader.')],
  mistakes: [
    { title: 'nextInt() then nextLine()', wrong: 'int age = sc.nextInt();\nString name = sc.nextLine();   // returns ""', why: 'The newline after the number is still in the buffer.', fix: 'Call sc.nextLine() once between them.' },
    { title: 'Adding the Strings from args', wrong: 'System.out.println(args[0] + args[1]);   // 1 8 → 18', why: 'Both are Strings; + concatenates.', fix: 'Integer.parseInt(args[0]) + Integer.parseInt(args[1])' },
    { title: 'Reading more tokens than exist', wrong: 'int x = sc.nextInt();   // input exhausted', why: 'NoSuchElementException.', fix: 'Check hasNextInt() or the stated count.' },
  ],
  practice: [
    { id: 'in-ex1', level: 'beginner', title: 'Average', statement: 'Read n and then n decimals. Print their average with two decimals.', examples: [{ input: '3\n1.5 2.5 3.5', output: '2.50' }], hints: ['printf("%.2f%n", sum / n)'], solutionFile: 'm1-input-scanner/Ex1.java', solutionExplain: 'Accumulate the sum as a double.', tests: [{ stdin: '3\n1.5 2.5 3.5\n', stdout: '2.50' }, { stdin: '1\n7\n', stdout: '7.00' }, { stdin: '2\n1 2\n', stdout: '1.50' }] },
    { id: 'in-ex2', level: 'intermediate', title: 'Sum until the end', statement: 'The input has any number of integers over several lines. Print their sum.', examples: [{ input: '4 5 6\n7', output: '22' }], hints: ['while (sc.hasNextLong())'], solutionFile: 'm1-input-scanner/Ex2.java', solutionExplain: 'hasNextLong() ends the loop at end of input.', tests: [{ stdin: '4 5 6\n7\n', stdout: '22' }, { stdin: '10\n', stdout: '10' }, { stdin: '-5 5\n', stdout: '0' }] },
    { id: 'in-ex3', level: 'intermediate', title: 'Age then name', statement: 'The first line has an age, the second a full name (with spaces). Print `<name> is <age>`.', examples: [{ input: '20\nAsha Rao', output: 'Asha Rao is 20' }], hints: ['Consume the newline after nextInt().'], solutionFile: 'm1-input-scanner/Ex3.java', solutionExplain: 'Call nextLine() once to discard the rest of the age line.', tests: [{ stdin: '20\nAsha Rao\n', stdout: 'Asha Rao is 20' }, { stdin: '7\nBo\n', stdout: 'Bo is 7' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'After `sc.nextInt()` the next `sc.nextLine()` returns…', options: ['the next full line', 'an empty string (the rest of the number\'s line)', 'an exception', 'null'], answer: 1, explain: 'The newline is still waiting.' },
    { type: 'output', q: 'java A 1 8 with System.out.println(args[0] + args[1]) prints…', code: 'public static void main(String[] args) {\n    System.out.println(args[0] + args[1]);\n}', answer: '18', explain: 'String concatenation.' },
    { type: 'mcq', q: 'Which class is best for reading 10⁶ numbers fast?', options: ['Console', 'Scanner', 'BufferedReader', 'System.err'], answer: 2, explain: 'Buffered input is the fastest of the three.' },
    { type: 'fill', q: 'Complete the end-of-input loop.', template: 'while (sc.___()) {\n    sum += sc.nextInt();\n}', blanks: [['hasNextInt']], explain: 'hasNextInt() is true while another int is available.' },
  ],
  interview: ['Scanner vs BufferedReader?', 'Why does nextLine() sometimes return an empty string?', 'What type are command-line arguments?', 'How do you read input until EOF?'],
  videos: ['m1-input-scanner', 'm1-input-scanner#2'],
  revision: ['Scanner: nextInt/nextDouble/next/nextLine; hasNextXxx for EOF.', 'After nextInt call nextLine once before reading a line.', 'BufferedReader.readLine + parseInt for speed.', 'args are Strings; check args.length.'],
  sourceNotes: { discrepancies: ['The slide example `avg = (args[0]+args[1]+…)/5` does not compile (String / int); the slide then fixes it with Float.valueOf — as the lesson shows, convert BEFORE adding.', 'On the Console slide the code `System.console().readLine()` returns null in IDEs and when input is piped; use Scanner for programs that must work everywhere.'] },
});

export const ifElseSwitch: Lesson = lesson({
  id: 'm1-if-else-switch',
  dryRun: { algo: 'grade-ladder', input: { score: '72' }, caption: 'Conditions are tested top to bottom; the first true one wins.' },
  module: 'm1',
  title: 'Decision Making: if, else, switch',
  summary: 'Choose between actions: if / else if / else, nested conditions, switch with fall-through, and the arrow form.',
  level: 'beginner',
  track: 'syntax',
  minutes: 35,
  essential: true,
  prerequisites: ['m1-operators-logical-ternary', 'm1-input-scanner'],
  sources: ['Decision-making-and-Control-structures'],
  objectives: [
    'Write if, if-else, else-if ladders and nested conditions.',
    'Use `switch` with `break`, `default` and fall-through, and the arrow form (Java 14+).',
    'Predict compile errors from the lecture quiz (int condition, missing braces, `break` outside a loop).',
    'Choose between if-else and switch.',
  ],
  intuition: [
    p('A decision statement runs one block or another depending on a **boolean condition**. In Java the condition must really be a `boolean` — unlike C, an `int` is not accepted.'),
    table(['form', 'use'], [['if (c) { … }', 'run the block only when c is true'], ['if (c) { A } else { B }', 'two-way choice'], ['if (c1) {…} else if (c2) {…} else {…}', 'multi-way: the first true condition wins'], ['switch (v) { case x: … break; default: … }', 'multi-way by exact value (int, char, String, enum)']]),
    why('An else-if ladder is evaluated **top to bottom and stops at the first true condition**, so the order matters: test the most specific/highest range first (`marks >= 90` before `marks >= 75`). A `switch` jumps straight to the matching `case` — and keeps running into the following cases until it meets `break` (**fall-through**), which is occasionally useful (`case 6: case 7:`) and a frequent bug.'),
    p('**Braces are optional for a single statement, but always use them**: the lecture\'s "Predict the output" quiz shows how a second statement without braces breaks an `else` (`error: \'else\' without \'if\'`).'),
  ],
  syntax: [code(`
if (marks >= 90) {
    grade = 'A';
} else if (marks >= 75) {
    grade = 'B';
} else {
    grade = 'C';
}

switch (day) {
    case 6:
    case 7:  System.out.println("weekend"); break;
    default: System.out.println("weekday");
}

String name = switch (level) { case 1 -> "low"; case 2 -> "medium"; default -> "high"; };   // Java 14+
`)],
  tiny: [code(`
if (n % 2 == 0) System.out.println("even");
else            System.out.println("odd");
`)],
  guided: [
    prog('m1-if-else-switch/DecisionDemo.java', 'Grade ladder, nested if and a switch with grouped cases'),
    prog('m1-if-else-switch/SwitchFallThrough.java', 'What happens when `break` is missing — and the arrow form'),
    note('The lecture quiz answers: `if (x)` with an int → compile error (incompatible types); two statements under `if` without braces followed by `else` → compile error; `if (true) ;` → valid (empty statement), prints nothing; `switch (x + 1 + 1)` with `case 10 + 1 + 1:` → case labels must be constants, and 10+1+1 is a constant expression → prints BYE; `break` inside a plain `if` → error: break outside switch or loop.'),
  ],
  programs: [
    {
      file: 'm1-if-else-switch/DecisionDemo.java',
      title: 'Decisions',
      role: 'demo',
      description: 'Input: marks, then a day number.',
      walkthrough: [
        { at: 'if (marks >= 90)', text: 'Highest range first — the ladder stops at the first true condition.' },
        { at: 'if (marks % 2 == 0)', text: 'Nested if: only reached when marks ≥ 50.' },
        { at: 'case 6:', text: 'Two case labels with no code between them: 6 and 7 share one block (intentional fall-through).' },
        { at: 'default:', text: 'Runs when no case matches. It may appear anywhere but is conventionally last.' },
      ],
    },
    {
      file: 'm1-if-else-switch/SwitchFallThrough.java',
      title: 'Fall-through and arrow switch',
      role: 'demo',
      description: 'Run it: with level = 2 three cases print because there is no break.',
      walkthrough: [
        { at: 'case 2: System.out.println("  case 2");', text: 'The match — but execution continues into case 3 and default.' },
        { at: 'String name = switch (level) {', text: 'Arrow-form switch expression: each case yields a value, no fall-through, no break.' },
      ],
    },
  ],
  complexity: [p('A decision is O(1) per evaluation. An else-if ladder with k branches costs up to k comparisons; a switch on dense ints compiles to a jump table (O(1)).')],
  mistakes: [
    { title: 'Dangling else without braces', wrong: 'if (x > 0)\n    System.out.println("pos");\n    System.out.println("done");\nelse\n    System.out.println("neg");', why: 'Only the first println belongs to the if; "else without if" is a compile error. Indentation is ignored by the compiler.', fix: 'Always use braces.' },
    { title: 'Forgetting break', wrong: 'case 1: doA();\ncase 2: doB();', why: 'Selecting case 1 runs doA() AND doB().', fix: 'case 1: doA(); break;' },
    { title: 'Semicolon after the condition', wrong: 'if (x > 5);\n{\n    System.out.println("big");\n}', why: 'The `;` is an empty statement: the block always runs.', fix: 'if (x > 5) { … }' },
  ],
  practice: [
    { id: 'if-ex1', level: 'beginner', title: 'Grade', statement: 'Read marks and print A (≥ 90), B (≥ 75), C (≥ 50) or F.', examples: [{ input: '82', output: 'B' }], hints: ['Highest range first.'], solutionFile: 'm1-if-else-switch/Ex1.java', solutionExplain: 'An else-if ladder ordered from the highest threshold down.', tests: [{ stdin: '82\n', stdout: 'B' }, { stdin: '90\n', stdout: 'A' }, { stdin: '49\n', stdout: 'F' }, { stdin: '50\n', stdout: 'C' }] },
    { id: 'if-ex2', level: 'intermediate', title: 'Calculator', statement: 'Read `a op b` with op one of + - * /. Print the result of integer arithmetic; for / by zero print `error`; for any other operator print `unknown operator`.', examples: [{ input: '12 / 4', output: '3' }], hints: ['switch on the char.'], solutionFile: 'm1-if-else-switch/Ex2.java', solutionExplain: 'A switch on the operator character with a guard for division.', tests: [{ stdin: '12 / 4\n', stdout: '3' }, { stdin: '5 / 0\n', stdout: 'error' }, { stdin: '6 * 7\n', stdout: '42' }, { stdin: '1 ? 2\n', stdout: 'unknown operator' }] },
    { id: 'if-ex3', level: 'intermediate', title: 'Triangle type', statement: 'Read three side lengths. Print `not a triangle`, `equilateral`, `isosceles` or `scalene`.', examples: [{ input: '5 5 8', output: 'isosceles' }], hints: ['The triangle inequality: every side must be shorter than the sum of the other two.'], solutionFile: 'm1-if-else-switch/Ex3.java', solutionExplain: 'Check validity first, then count equal sides.', tests: [{ stdin: '5 5 8\n', stdout: 'isosceles' }, { stdin: '3 3 3\n', stdout: 'equilateral' }, { stdin: '3 4 5\n', stdout: 'scalene' }, { stdin: '1 2 3\n', stdout: 'not a triangle' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'What happens with `int x = 10; if (x) { … }`?', options: ['runs the block', 'compile-time error', 'runtime error', 'skips the block'], answer: 1, explain: 'incompatible types: int cannot be converted to boolean.' },
    { type: 'output', q: 'What is printed?', code: 'int i = 9;\nswitch (i) {\n    case 0: System.out.println("zero"); break;\n    case 1: System.out.println("one"); break;\n    default: System.out.println("many");\n}', answer: 'many', explain: 'No case matches 9, so default runs.' },
    { type: 'output', q: 'What is printed?', code: 'int x = 2;\nswitch (x) {\n    case 1: System.out.print("a");\n    case 2: System.out.print("b");\n    case 3: System.out.print("c");\n    default: System.out.print("d");\n}', answer: 'bcd', explain: 'Fall-through from case 2.' },
    { type: 'mcq', q: 'What does `if (true) ;` do?', options: ['compile error', 'nothing — ; is an empty statement', 'infinite loop', 'prints true'], answer: 1, explain: 'The empty statement is legal.' },
    { type: 'bug', q: 'Which line prevents this from compiling?', code: 'public class A {\n    public static void main(String[] args) {\n        if (true)\n            break;\n    }\n}', answerLine: 4, explain: 'break is only allowed inside a loop or switch.' },
  ],
  interview: ['What is fall-through in a switch?', 'Which types can a switch use?', 'if-else vs switch — when?', 'What is the dangling-else problem?'],
  videos: ['m1-if-else-switch', 'm1-if-else-switch#2'],
  revision: ['Condition must be boolean; always use braces.', 'else-if ladder: first true wins — order matters.', 'switch: break stops fall-through; default for the rest; types int/char/String/enum.', 'Arrow switch (Java 14+) has no fall-through.'],
});

export const loops: Lesson = lesson({
  id: 'm1-loops',
  dryRun: { algo: 'loop-trace', input: { n: '8' }, caption: 'Follow i and sum through every iteration, including the skipped even numbers.' },
  module: 'm1',
  title: 'Loops: for, while, do-while, break and continue',
  summary: 'Repeat work: counting loops, condition loops, nested loops, leaving early, skipping, and for-each.',
  level: 'beginner',
  track: 'syntax',
  minutes: 40,
  essential: true,
  prerequisites: ['m1-if-else-switch'],
  sources: ['Decision-making-and-Control-structures', 'Time-_-Space-complexity-1_1'],
  objectives: [
    'Choose between `for`, `while` and `do-while` and write each correctly.',
    'Control a loop with `break` and `continue`; understand nested loops.',
    'Trace a loop with a table of variable values.',
    'Count how many times a loop body runs (a first step to Big-O).',
  ],
  intuition: [
    table(['loop', 'form', 'checks the condition', 'best when'], [['for', 'for (init; cond; update) {…}', 'before each pass', 'you know the count'], ['while', 'while (cond) {…}', 'before each pass', 'repeat until something changes'], ['do-while', 'do {…} while (cond);', 'after each pass', 'body must run at least once'], ['for-each', 'for (T x : collection) {…}', '—', 'visit every element']]),
    pre(`
for (int i = 1; i <= 3; i++) { body }
 1. init:   i = 1
 2. test:   i <= 3 ? yes → run body
 3. update: i++   → back to step 2
 ...stops when i becomes 4
`),
    why('Every loop needs three things: a **starting state**, a **condition** that eventually becomes false, and an **update** that moves the state toward that. If the update never makes the condition false you have an infinite loop. A reliable way to check a loop is a **trace table** — write the variables down after every iteration.'),
    p('**`break`** leaves the innermost loop immediately; **`continue`** skips the rest of this pass and goes to the next iteration. In nested loops the inner loop runs completely for every pass of the outer loop, so two loops of n passes run n × n times.'),
  ],
  syntax: [
    code(`
for (int i = 0; i < n; i++) { /* body */ }          // counting: init; condition; update
while (condition) { /* body */ }                      // test BEFORE each pass (may run 0 times)
do { /* body */ } while (condition);                  // test AFTER each pass (runs at least once)
for (int x : array) { /* body */ }                    // enhanced for: every element, no index
break;                                         // leave the innermost loop
continue;                                      // skip to the next iteration
outer:                                         // a label lets break/continue target an outer loop
for (int i = 0; i < n; i++) { for (int j = 0; j < n; j++) { if (found) break outer; } }
`, 'The loop statements'),
    table(['you know…', 'use'], [['how many times', 'for'], ['only a stopping condition', 'while'], ['must run once before checking', 'do-while'], ['just want every element', 'enhanced for']]),
  ],
  tiny: [code(`
int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
// sum = 5050
`)],
  guided: [prog('m1-loops/LoopsDemo.java', 'Every loop form, nested loops, break/continue and for-each')],
  programs: [
    {
      file: 'm1-loops/LoopsDemo.java',
      title: 'Loops in one program',
      role: 'demo',
      description: 'Trace each section by hand before running it.',
      walkthrough: [
        { at: 'for (int i = 1; i <= 5; i++)', text: 'Counting loop: i takes 1, 2, 3, 4, 5.' },
        { at: 'while (n > 0)', text: 'Digit count: dividing by 10 until nothing is left (4 passes for 1000).' },
        { at: '} while (k < 5);', text: 'The test is at the bottom, so the body runs once even though k < 5 is false.' },
        { at: 'for (int col = 1; col <= row; col++)', text: 'The inner loop\'s limit depends on the outer variable → a triangle.' },
        { at: 'if (i % 2 == 0) continue;', text: 'Skips even numbers.' },
        { at: 'if (i > 7) break;', text: 'Stops everything when i reaches 8.' },
        { at: 'for (int m : marks)', text: 'for-each: m takes each element in turn.' },
      ],
    },
  ],
  complexity: [p('A loop that runs n times is O(n); two nested loops of n are O(n²); a loop that doubles its counter (`i *= 2`) runs log₂ n times. Counting passes this way is exactly how time complexity is analysed — see the complexity lessons and the lab.')],
  mistakes: [
    { title: 'Off-by-one', wrong: 'for (int i = 0; i <= arr.length; i++) { arr[i] ... }', why: 'The last index is length − 1; i == length throws ArrayIndexOutOfBoundsException.', fix: 'i < arr.length' },
    { title: 'Infinite loop', wrong: 'int i = 0;\nwhile (i < 10) {\n    System.out.println(i);\n}', why: 'i never changes.', fix: 'Add i++ inside the body.' },
    { title: 'Semicolon after for', wrong: 'for (int i = 0; i < 3; i++);\n{\n    System.out.println("hi");\n}', why: 'The loop body is the empty statement; the block runs once afterwards.', fix: 'Remove the ;' },
  ],
  practice: [
    { id: 'loop-ex1', level: 'beginner', title: 'Factorial', statement: 'Read n (0 ≤ n ≤ 20) and print n! (use long).', examples: [{ input: '10', output: '3628800' }], hints: ['Start with 1 and multiply by 2, 3, …, n.'], solutionFile: 'm1-loops/Ex1.java', solutionExplain: 'An accumulator multiplied in a for loop.', tests: [{ stdin: '10\n', stdout: '3628800' }, { stdin: '0\n', stdout: '1' }, { stdin: '20\n', stdout: '2432902008176640000' }] },
    { id: 'loop-ex2', level: 'intermediate', title: 'Pyramid', statement: 'Read n and print a pyramid of n rows of `*`, row i has 2i−1 stars, centred with leading spaces.', examples: [{ input: '3', output: '  *\n ***\n*****' }], hints: ['Row r: n − r spaces then 2r − 1 stars.'], solutionFile: 'm1-loops/Ex2.java', solutionExplain: 'Two inner loops per row: spaces, then stars.', tests: [{ stdin: '3\n', stdout: '  *\n ***\n*****' }, { stdin: '1\n', stdout: '*' }, { stdin: '2\n', stdout: ' *\n***' }] },
    { id: 'loop-ex3', level: 'intermediate', title: 'Collatz steps', statement: 'Start from n. If n is even divide it by 2, otherwise compute 3n + 1. Count the steps until n becomes 1.', examples: [{ input: '6', output: '8' }], hints: ['Use long; a while loop with a counter.'], solutionFile: 'm1-loops/Ex3.java', solutionExplain: 'The loop condition is "n != 1"; the update depends on parity.', tests: [{ stdin: '6\n', stdout: '8' }, { stdin: '1\n', stdout: '0' }, { stdin: '27\n', stdout: '111' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'int s = 0;\nfor (int i = 1; i <= 4; i++) {\n    if (i == 3) continue;\n    s += i;\n}\nSystem.out.println(s);', answer: '7', explain: '1 + 2 + 4 = 7 (3 is skipped).' },
    { type: 'output', q: 'How many times does the body run?', code: 'int count = 0;\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 4; j++)\n        count++;\nSystem.out.println(count);', answer: '12', explain: '3 × 4.' },
    { type: 'mcq', q: 'A loop whose body must run at least once is best written as…', options: ['for', 'while', 'do-while', 'for-each'], answer: 2, explain: 'do-while tests after the body.' },
    { type: 'output', q: 'What is printed?', code: 'int i = 1;\nwhile (i < 100) {\n    i *= 3;\n}\nSystem.out.println(i);', answer: '243', explain: '1, 3, 9, 27, 81, 243 — stops when i ≥ 100.' },
    { type: 'bug', q: 'Which line makes this loop infinite?', code: 'int n = 10;\nwhile (n > 0) {\n    System.out.println(n);\n    n++;\n}', answerLine: 4, explain: 'n++ moves n away from 0; it should be n--.' },
  ],
  interview: ['for vs while vs do-while?', 'What does continue do?', 'How many iterations does `for (i = 1; i < n; i *= 2)` run?', 'How do you exit nested loops?'],
  videos: ['m1-loops', 'm1-loops#2'],
  revision: ['for = known count; while = until condition; do-while = at least once.', 'break exits, continue skips to next pass.', 'Nested loops multiply: n × n.', 'Check start, condition, update; trace with a table.'],
});

export const methods: Lesson = lesson({
  id: 'm1-methods',
  dryRun: { algo: 'call-stack-trace', input: { a: '4', b: '9', c: '6' }, caption: 'Arguments are copied into parameters; each return value flows to the caller.' },
  module: 'm1',
  title: 'Methods: Parameters, Return Values, Scope and Overloading',
  summary: 'Package code into named, reusable pieces; pass values in, get a value out, and keep variables local.',
  level: 'beginner',
  track: 'syntax',
  minutes: 40,
  essential: true,
  prerequisites: ['m1-loops'],
  objectives: [
    'Write methods with parameters and return types, and call them.',
    'Explain pass-by-value for primitive arguments.',
    'Describe the scope of local variables and parameters.',
    'Overload a method and decide when a helper method improves a program.',
  ],
  intuition: [
    p('A **method** is a named block of code that can be called from elsewhere. It has a **signature** (name and parameter types), a **return type** (or `void`), and a **body**.'),
    code(`
static int square(int x) {   // returns an int; takes one int parameter
    return x * x;
}
int y = square(7);           // call: 7 is the ARGUMENT, x is the PARAMETER
`),
    why('Methods let you write a piece of logic once, give it a name that says *what* it does, test it in isolation and reuse it. Algorithms in this course are almost always written as methods (`gcd(a, b)`, `isPrime(n)`, `josephus(n, k)`) with a small `main` that reads input and prints the result.'),
    ul('**Pass by value:** the method receives a **copy** of each primitive argument. Changing the parameter inside the method does not change the caller\'s variable.', '**Scope:** a variable exists only inside the block `{ }` in which it is declared. Parameters and locals vanish when the method returns.', '**Overloading:** several methods may share a name if their parameter lists differ (types or count). The compiler picks the best match from the argument types.', '**static:** for now, write helper methods as `static` so `main` (which is static) can call them directly.'),
  ],
  syntax: [table(['part', 'example'], [['modifiers', 'public static'], ['return type', 'int  /  void  /  boolean  /  String'], ['name', 'isPrime  (lowerCamelCase, a verb)'], ['parameters', '(int n, int k)'], ['body', '{ …  return value; }']])],
  tiny: [code(`
static boolean isEven(int n) {
    return n % 2 == 0;
}
`)],
  guided: [prog('m1-methods/MethodsDemo.java', 'Parameters, return values, overloading, pass-by-value and scope')],
  programs: [
    {
      file: 'm1-methods/MethodsDemo.java',
      title: 'Methods demo',
      role: 'demo',
      description: 'Each helper method illustrates one rule.',
      walkthrough: [
        { at: 'static int square(int x)', text: 'A pure function: result depends only on the parameter.' },
        { at: 'static double max(double a, double b)', text: 'Overload: same name, different parameter types — the call max(2.5, 1.5) picks this one.' },
        { at: 'static int max(int a, int b, int c)', text: 'Overload with a different number of parameters, reusing the two-argument version.' },
        { at: 'static void tryToChange(int n)', text: 'n is a COPY. Assigning to it does not affect the caller (pass-by-value).' },
        { at: 'int total = 0;', text: 'Local variable: exists only during this call; every call starts fresh.' },
      ],
    },
  ],
  complexity: [p('A method call costs O(1) plus the work done inside it. Each active call occupies a stack frame — relevant for recursion (next module).')],
  mistakes: [
    { title: 'Forgetting to return', wrong: 'static int square(int x) {\n    int r = x * x;\n}', why: 'Compile error: missing return statement.', fix: 'return r;' },
    { title: 'Ignoring the return value', wrong: 'square(5);   // result discarded\nSystem.out.println(x);', why: 'The method does not change anything outside; its value must be used.', fix: 'int s = square(5);' },
    { title: 'Expecting a method to modify a primitive argument', wrong: 'static void inc(int n) { n++; }\nint a = 1; inc(a);   // a is still 1', why: 'Java passes a copy.', fix: 'Return the new value: a = inc(a);' },
  ],
  practice: [
    { id: 'meth-ex1', level: 'beginner', title: 'isPrime method', statement: 'Write `static boolean isPrime(int n)` and use it to print `prime` or `not prime` for the input.', examples: [{ input: '97', output: 'prime' }], hints: ['Test divisors from 2 while d·d ≤ n.'], solutionFile: 'm1-methods/Ex1.java', solutionExplain: 'Trial division up to √n returns false at the first divisor.', tests: [{ stdin: '97\n', stdout: 'prime' }, { stdin: '1\n', stdout: 'not prime' }, { stdin: '91\n', stdout: 'not prime' }, { stdin: '2\n', stdout: 'prime' }] },
    { id: 'meth-ex2', level: 'intermediate', title: 'Overloaded power', statement: 'Write two methods named `power`: one for (long base, int exp) and one for (double base, int exp). Read base and exp and print power(base, exp) as long, then print power(2.5, 2).', examples: [{ input: '3 4', output: '81\n6.25' }], hints: ['Multiply in a loop.'], solutionFile: 'm1-methods/Ex2.java', solutionExplain: 'Overloading chooses the version from the argument types.', tests: [{ stdin: '3 4\n', stdout: '81\n6.25' }, { stdin: '2 10\n', stdout: '1024\n6.25' }] },
    { id: 'meth-ex3', level: 'intermediate', title: 'Digits helpers', statement: 'Using two helper methods print `<number of digits> <sum of digits>` for a non-negative integer (0 has 1 digit).', examples: [{ input: '90210', output: '5 12' }], hints: ['A do-while loop counts digits correctly even for 0.'], solutionFile: 'm1-methods/Ex3.java', solutionExplain: 'Two small methods are easier to test than one big main.', tests: [{ stdin: '90210\n', stdout: '5 12' }, { stdin: '0\n', stdout: '1 0' }, { stdin: '7\n', stdout: '1 7' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'static void change(int n) { n = 99; }\npublic static void main(String[] a) {\n    int v = 5;\n    change(v);\n    System.out.println(v);\n}', answer: '5', explain: 'The method changed its own copy.' },
    { type: 'mcq', q: 'Which pair is a valid overload?', options: ['int f(int a) and int f(int b)', 'int f(int a) and double f(int a)', 'int f(int a) and int f(double a)', 'void f() and void f()'], answer: 2, explain: 'Different parameter types; return type alone does not distinguish.' },
    { type: 'bug', q: 'Which line is the compile error?', code: 'static int twice(int x) {\n    if (x > 0) {\n        return x * 2;\n    }\n}', answerLine: 5, explain: 'Not all paths return a value: missing return statement.' },
    { type: 'mcq', q: 'A variable declared inside a for loop body is visible…', options: ['in the whole method', 'only inside that loop body', 'in the whole class', 'in other methods'], answer: 1, explain: 'Scope is the enclosing block.' },
  ],
  interview: ['What is method overloading? Overriding (preview)?', 'Is Java pass-by-value or pass-by-reference?', 'What is a stack frame?', 'Why break a program into methods?'],
  videos: ['m1-methods', 'm1-methods#2'],
  revision: ['returnType name(params) { … return value; }', 'Arguments are copied (pass by value).', 'Scope = enclosing braces.', 'Overload = same name, different parameters.'],
});

export const debugging: Lesson = lesson({
  id: 'm1-debugging-tracing',
  dryRun: { algo: 'trace-table', input: { arr: '2,7,4,9,6' }, caption: 'A trace table exposes the loop that starts at 1 instead of 0.' },
  module: 'm1',
  title: 'Tracing and Debugging Programs',
  summary: 'Execute code by hand with a trace table, use print debugging, and learn the IDE debugger workflow.',
  level: 'beginner',
  track: 'syntax',
  minutes: 30,
  essential: true,
  prerequisites: ['m1-methods', 'm0-errors'],
  objectives: [
    'Build a trace table for loops and method calls.',
    'Use temporary print statements to inspect state.',
    'Use breakpoints, step over, step into and the variables pane of an IDE.',
    'Apply a systematic debugging routine.',
  ],
  intuition: [
    p('**Tracing** means executing the program by hand, writing down the value of every variable after each step. It is the single most useful skill for understanding algorithms — every "dry run" in this course is a trace table.'),
    table(['i', 'x before', 'x after (x = x·2 + i)'], [['0', '1', '1·2 + 0 = 2'], ['1', '2', '2·2 + 1 = 5'], ['2', '5', '5·2 + 2 = 12'], ['3', '12', '12·2 + 3 = 27']], 'Trace of: int x = 1; for (int i = 0; i < 4; i++) x = x * 2 + i;  → 27'),
    why('When a program misbehaves, guessing wastes time. Debugging is the scientific method: **observe** the wrong output, **hypothesise** which line produces it, **test** the hypothesis by inspecting values, **fix**, and **re-run** the failing case. Printing the variables inside the loop (or stepping through with a debugger) replaces speculation with facts.'),
    h('IDE debugger quick guide'),
    ul('Click in the margin next to a line to set a **breakpoint**; run in Debug mode.', '**Step over** runs the current line; **step into** enters a method call; **step out** finishes the method.', 'The **variables** pane shows current values; add **watch** expressions for what you care about.', 'In VS Code: Run ▸ Start Debugging (F5); IntelliJ: the bug icon (Shift-F9).'),
  ],
  syntax: [
    code(`
System.out.println("i=" + i + " sum=" + sum);      // print-debugging: label every value
assert count >= 0 : "count went negative";          // checked only when run with:  java -ea Main
`, 'Two quick tools'),
    table(['debugger command', 'what it does'], [['breakpoint', 'stop before a chosen line executes'], ['step over', 'run the current line, do not enter called methods'], ['step into', 'enter the method called on the current line'], ['step out', 'finish the current method and stop in its caller'], ['resume', 'run until the next breakpoint'], ['watch / variables pane', 'show current values of variables and expressions']]),
    p('A **trace table** has one column per variable and one row per step; fill it in by hand while reading the code, then compare with what you expected.'),
  ],
  tiny: [code(`
for (int i = 1; i <= 3; i++) {
    sum += i * i;
    System.out.println("i=" + i + " sum=" + sum);   // temporary debugging print
}
`)],
  guided: [prog('m1-debugging-tracing/TraceTable.java', 'Print a trace table from inside the program'), prog('m1-debugging-tracing/FindTheBug.java', 'A real bug (loop starts at 1), shown next to the fix')],
  programs: [
    {
      file: 'm1-debugging-tracing/TraceTable.java',
      title: 'Printing a trace table',
      role: 'demo',
      description: 'Sum of squares with one line printed per iteration.',
      walkthrough: [
        { at: 'System.out.println("i  sum");', text: 'The header of the trace table.' },
        { at: 'sum += i * i;', text: 'The state change we want to observe.' },
        { at: 'System.out.println(i + "  " + sum);', text: 'One row per iteration — the same table you would write by hand.' },
      ],
    },
    {
      file: 'm1-debugging-tracing/FindTheBug.java',
      title: 'Find the bug',
      role: 'demo',
      description: 'countEvensBuggy starts its loop at index 1 and so ignores the first element.',
      walkthrough: [
        { at: 'for (int i = 1; i < a.length; i++) {      // starts at 1', text: 'The bug: the loop skips a[0]. A trace table on {2,7,4,9,6} immediately shows the count missing the first 2.' },
        { at: 'static int countEvensFixed', text: 'The fix is a single character: start at 0.' },
      ],
    },
  ],
  complexity: [p('Not applicable. (Debug prints inside a hot loop can dominate running time — remove them afterwards.)')],
  mistakes: [
    { title: 'Debugging by random edits', wrong: '// change a + to a -, re-run, hope', why: 'Without a hypothesis you may fix the symptom and add a new bug.', fix: 'Trace a small failing input; find the first line where reality differs from your expectation.' },
    { title: 'Leaving debug prints in submitted code', wrong: 'System.out.println("here 1");', why: 'Extra output makes tests fail.', fix: 'Remove or guard them.' },
    { title: 'Testing only the happy path', wrong: '// tested with 5 normal numbers', why: 'Bugs hide at the edges: empty input, one element, negatives, duplicates, maximum size.', fix: 'Write down edge cases first and trace each.' },
  ],
  practice: [
    { id: 'dbg-ex1', level: 'beginner', title: 'Trace by hand', statement: 'What does the program print? (Trace x = 1; for i = 0..3: x = x·2 + i.) Run it to check.', examples: [{ input: '(no input)', output: '27' }], hints: ['Write the trace table.'], solutionFile: 'm1-debugging-tracing/Ex1.java', solutionExplain: 'See the table in the lesson: 2, 5, 12, 27.', tests: [{ stdin: '', stdout: '27' }] },
    { id: 'dbg-ex2', level: 'intermediate', title: 'Print the trace', statement: 'Read a start value and a number of steps. Repeat value = value·2 + 1 for that many steps and print `step value` after each.', examples: [{ input: '1 3', output: '1 3\n2 7\n3 15' }], hints: ['A loop with one println inside.'], solutionFile: 'm1-debugging-tracing/Ex2.java', solutionExplain: 'The printed lines are the rows of the trace table.', tests: [{ stdin: '1 3\n', stdout: '1 3\n2 7\n3 15' }, { stdin: '0 2\n', stdout: '1 1\n2 3' }] },
    { id: 'dbg-ex3', level: 'intermediate', title: 'Fix the maximum', statement: 'A buggy program started `max = 0` and so failed on all-negative inputs. Write the correct version: read n and n integers; print the largest.', examples: [{ input: '3\n-4 -2 -9', output: '-2' }], hints: ['Start from Integer.MIN_VALUE or the first element.'], solutionFile: 'm1-debugging-tracing/Ex3.java', solutionExplain: 'The initial value must be smaller than every possible input.', tests: [{ stdin: '3\n-4 -2 -9\n', stdout: '-2' }, { stdin: '1\n0\n', stdout: '0' }, { stdin: '2\n5 3\n', stdout: '5' }] },
  ],
  quiz: [
    { type: 'trace', q: 'Trace this program.', code: 'int n = 10, count = 0;\nwhile (n > 1) {\n    n = n / 2;\n    count++;\n}', items: [{ prompt: 'n after pass 1', answer: '5' }, { prompt: 'n after pass 2', answer: '2' }, { prompt: 'final count', answer: '3' }], explain: '10 → 5 → 2 → 1: three passes.' },
    { type: 'mcq', q: 'In a debugger, "step over" does what?', options: ['runs the current line without entering called methods', 'enters the called method', 'stops the program', 'restarts'], answer: 0, explain: 'Step into enters methods; step over treats them as one step.' },
    { type: 'mcq', q: 'The best FIRST step when a program gives a wrong answer is…', options: ['rewrite it', 'trace a small failing input', 'add random prints everywhere', 'change the data type'], answer: 1, explain: 'Reproduce and observe.' },
    { type: 'output', q: 'What does FindTheBug.countEvensBuggy return for {2, 7, 4, 9, 6}?', code: '// loop starts at i = 1', answer: '2', explain: 'It skips a[0] = 2 and counts only 4 and 6.' },
  ],
  interview: ['How do you debug a program that gives wrong output?', 'What is a breakpoint?', 'What edge cases do you test?', 'What is a trace table?'],
  videos: ['m1-debugging-tracing', 'm1-debugging-tracing#2'],
  revision: ['Trace table: variables after every iteration.', 'Debug loop: observe → hypothesise → inspect → fix → retest.', 'Breakpoint, step over/into/out, variables pane.', 'Test edges: empty, one, negatives, duplicates, max.'],
});
