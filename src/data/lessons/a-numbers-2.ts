import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

// ───────────────────────────── Euler's phi ─────────────────────────────
export const eulerPhi: Lesson = lesson({
  id: 'a-euler-phi',
  module: 'm5',
  title: "Euler's Phi (Totient) Function",
  summary: 'Count the numbers up to n that share no factor with n — using prime factorisation instead of testing each one.',
  level: 'intermediate',
  track: 'archive',
  minutes: 45,
  essential: true,
  prerequisites: ['a-euclid-gcd', 'm2-math-gcd-lcm-primes-mod', 'm1-loops'],
  sources: ["Euler's-phi-Algorithm"],
  objectives: [
    'Define coprime numbers and Euler\'s φ(n) and compute φ for small n by hand.',
    'Derive φ(n) = n · ∏(1 − 1/p) from the idea "remove the multiples of each prime factor".',
    'Write the O(√n) Java method and explain every line, including the "leftover prime" step.',
    'Spot and explain the error in the lecture\'s worked example φ(60).',
  ],
  intuition: [
    p('Two numbers are **coprime** when their only common divisor is 1 (gcd = 1). 8 and 15 are coprime; 8 and 12 are not (both divisible by 4). **Euler\'s totient** φ(n) counts how many numbers from 1 to n are coprime to n.'),
    pre(`
n = 12  →  1  2  3  4  5  6  7  8  9 10 11 12
coprime →  ✓  ·  ·  ·  ✓  ·  ✓  ·  ·  ·  ✓  ·       φ(12) = 4  (1, 5, 7, 11)
`, 'A number fails to be coprime to 12 exactly when it shares the factor 2 or the factor 3.'),
    p('So φ(n) is "n minus everything that shares a prime factor with n". Take n = 12 = 2² · 3:'),
    ul('Half of the numbers are multiples of 2 → keep **1/2** of them (× (1 − 1/2)).', 'A third are multiples of 3 → keep **2/3** of those (× (1 − 1/3)).'),
    math('φ(12) = 12 × (1 − 1/2) × (1 − 1/3) = 12 × 1/2 × 2/3 = 4'),
    why('The formula φ(n) = n · ∏ (1 − 1/p) takes the product over the **distinct** primes p that divide n. Multiples of different primes are independent of each other (that is what the Chinese Remainder Theorem says), so the "survival fractions" multiply. A prime appearing 5 times in n counts only once — its multiples are the same numbers however many times it divides n.'),
  ],
  syntax: [
    p('Java ideas used: `for` loops with a condition that involves multiplication (`p * p <= n`), the remainder operator `%`, and `n /= p` (shorthand for `n = n / p`). Use `long` so that `p * p` cannot overflow for large n.'),
  ],
  tiny: [
    p('The smallest correct program literally counts coprime numbers (using the Euclid lesson):'),
    code(`
int count = 0;
for (int k = 1; k <= n; k++) {
    if (gcd(k, n) == 1) count++;
}
`),
  ],
  guided: [
    p('The efficient program never tests individual numbers. It **finds the prime factors of n** by trial division and applies "× (1 − 1/p)" once for each. Trace n = 60 = 2² · 3 · 5:'),
    table(['step', 'p', 'n before', 'p divides n?', 'n after', 'result'], [
      ['start', '—', '60', '—', '60', '60'],
      ['1', '2', '60', 'yes (strip 2,2)', '15', '60 − 60/2 = 30'],
      ['2', '3', '15', 'yes (strip 3)', '5', '30 − 30/3 = 20'],
      ['3', '4', '5', 'loop stops: 4·4 > 5', '5', '20'],
      ['leftover', '—', '5 > 1', 'prime factor 5 remains', '5', '20 − 20/5 = 16'],
    ], 'φ(60) = 16.'),
    prog('euler-phi/BruteForcePhi.java', 'Simple solution: test every k with gcd'),
    prog('euler-phi/EulerPhi.java', 'Optimized solution: prime factorisation'),
    prog('euler-phi/EulerPhiTable.java', 'Bonus: φ(1..N) for all numbers at once, sieve style'),
  ],
  dryRun: { algo: 'euler-phi', input: { n: '60' }, caption: 'φ(60): strip each prime factor of n and multiply result by (1 − 1/p).' },
  programs: [
    {
      file: 'euler-phi/BruteForcePhi.java',
      title: 'Brute force φ(n)',
      role: 'simple',
      description: 'Counts every k in 1..n with gcd(k, n) = 1. O(n log n).',
      walkthrough: [
        { at: 'static int gcd', text: 'Euclid\'s algorithm from the previous lesson, reused as a helper.' },
        { at: 'for (int k = 1; k <= n; k++)', text: 'Test every number from 1 to n.' },
        { at: 'if (gcd(k, n) == 1)', text: 'k is coprime to n exactly when the gcd is 1.' },
      ],
    },
    {
      file: 'euler-phi/EulerPhi.java',
      title: 'φ(n) from prime factors',
      role: 'optimized',
      description: 'Finds each distinct prime factor p ≤ √n and applies result × (1 − 1/p) in integer form. O(√n).',
      walkthrough: [
        { at: 'long result = n;', text: 'Start with "all n numbers survive" and remove the unwanted ones prime by prime.' },
        { at: 'p * p <= n', text: 'A composite number has a prime factor ≤ its square root, so after this loop at most ONE prime factor is left over. Using `long` prevents p*p overflowing.' },
        { at: 'if (n % p == 0)', text: 'The first p that divides n is always prime (any smaller prime factor was already removed).' },
        { at: 'n /= p;', text: 'Strip every copy of p so that n shrinks and p is never counted twice.' },
        { at: 'result -= result / p;', text: 'Multiply result by (1 − 1/p). `result / p` is exact because result is still divisible by p, so there is no rounding.' },
        { at: 'if (n > 1)', text: 'Whatever is left is one prime factor bigger than √(original n). It needs its own (1 − 1/p) factor.' },
      ],
    },
    {
      file: 'euler-phi/EulerPhiTable.java',
      title: 'φ for every number up to N',
      role: 'demo',
      description: 'Same formula applied sieve-style: for each prime p, update all its multiples. O(N log log N).',
      walkthrough: [
        { at: 'phi[i] = i;', text: 'Every φ starts at i itself.' },
        { at: 'if (phi[p] == p)', text: 'Nobody has reduced phi[p] yet, so p has no smaller prime factor: p is prime.' },
        { at: 'phi[multiple] -= phi[multiple] / p;', text: 'Apply (1 − 1/p) to every multiple of the prime p.' },
      ],
    },
  ],
  complexity: [
    p('**Brute force:** n gcd calls, each O(log n) → O(n log n).'),
    p('**Factorisation method:** the loop variable p goes up to √n (n only gets smaller) and the divisions inside the loop add at most O(log n) in total → **O(√n) time, O(1) space**. For n ≈ 10¹² that is about 10⁶ steps instead of 10¹².'),
    p('**Table for 1..N:** each prime p touches N/p multiples; the sum of N/p over primes is N · log log N.'),
    table(['n', 'Brute force steps', 'Factor method steps'], [['10⁶', '10⁶ gcds', '≤ 1 000'], ['10¹²', '10¹² gcds (impossible)', '≤ 10⁶']]),
  ],
  mistakes: [
    {
      title: 'Using the formula with (p − 1) · p^(k−1) but also dividing again',
      wrong: '// φ(60) the "slide" way: (2-1)*2^1 * (2-1)*2^2 * (3-1)*3^0 * (5-1)*5^0 * (5-1)*5^1 = 32',
      why: 'The lecture example repeats the factors for 2 and 5. Each distinct prime contributes ONE factor (p − 1)·p^(k−1). The correct product is (2−1)·2¹ × (3−1)·3⁰ × (5−1)·5⁰ = 2 × 2 × 4 = 16.',
      fix: '// one factor per distinct prime\nphi = (2-1)*2 * (3-1)*1 * (5-1)*1;   // = 16',
    },
    {
      title: 'Forgetting the leftover prime',
      wrong: 'for (int p = 2; p * p <= n; p++) { ... }\nreturn result;   // missing: if (n > 1) result -= result / n;',
      why: 'For n = 14 the loop strips 2 and leaves n = 7. 7·7 > 7 ends the loop before 7 is handled, so φ(14) would come out as 7 instead of 6.',
      fix: 'if (n > 1) result -= result / n;',
    },
    {
      title: 'int overflow in p * p',
      wrong: 'for (int p = 2; p * p <= n; p++)   // n up to 2·10^9',
      why: 'When p reaches ~46 341, p * p exceeds Integer.MAX_VALUE and becomes negative, so the loop never ends or ends wrongly.',
      fix: 'for (long p = 2; p * p <= n; p++)',
    },
  ],
  practice: [
    {
      id: 'phi-ex1',
      level: 'beginner',
      title: 'List the coprime numbers',
      statement: 'Read n. Print, in increasing order and separated by spaces, every k with 1 ≤ k ≤ n and gcd(k, n) = 1.',
      constraints: ['1 ≤ n ≤ 10⁵'],
      examples: [{ input: '12', output: '1 5 7 11' }],
      hints: ['You need a gcd helper — reuse Euclid.', 'Build the output in a StringBuilder and print once.'],
      solutionFile: 'euler-phi/Ex1.java',
      solutionExplain: 'For each k test gcd(k, n) == 1 and collect the passes.',
      tests: [{ stdin: '24\n', stdout: '1 5 7 11 13 17 19 23' }, { stdin: '12\n', stdout: '1 5 7 11' }, { stdin: '7\n', stdout: '1 2 3 4 5 6' }],
    },
    {
      id: 'phi-ex2',
      level: 'intermediate',
      title: 'Sum of totients',
      statement: 'Read n and print φ(1) + φ(2) + … + φ(n).',
      constraints: ['1 ≤ n ≤ 10⁶'],
      examples: [{ input: '10', output: '32' }],
      hints: ['Computing φ separately for each i with trial division is too slow in the worst case — use the table approach.', 'Remember the answer can exceed int range for large n: use long for the sum.'],
      solutionFile: 'euler-phi/Ex2.java',
      solutionExplain: 'The sieve-style table computes all φ values in O(n log log n); the sum is a plain loop.',
      tests: [{ stdin: '10\n', stdout: '32' }, { stdin: '1\n', stdout: '1' }, { stdin: '100\n', stdout: '3044' }],
    },
    {
      id: 'phi-ex3',
      level: 'challenge',
      title: 'Coprime pairs',
      statement: 'Count ordered pairs (a, b) with 1 ≤ a, b ≤ n and gcd(a, b) = 1.',
      constraints: ['1 ≤ n ≤ 10⁶'],
      examples: [{ input: '3', output: '7', explain: '(1,1) (1,2) (2,1) (1,3) (3,1) (2,3) (3,2)' }],
      hints: ['For a fixed larger value b ≥ 2, how many a < b are coprime to b?', 'Each such unordered pair counts twice (a,b) and (b,a). Don\'t forget (1,1).'],
      solutionFile: 'euler-phi/Ex3.java',
      solutionExplain: 'For each b ≥ 2 there are φ(b) values a < b that are coprime to it. Counting both orders gives 2·Σφ(b) for b = 2..n, plus the pair (1,1): 2·(Σ_{i=1..n} φ(i)) − 1.',
      tests: [{ stdin: '3\n', stdout: '7' }, { stdin: '5\n', stdout: '19' }, { stdin: '1\n', stdout: '1' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'What is φ(17)?', options: ['8', '15', '16', '17'], answer: 2, explain: '17 is prime: every k from 1 to 16 is coprime to it. φ(p) = p − 1.' },
    { type: 'mcq', q: 'What is φ(60)?', options: ['16', '24', '32', '48'], answer: 0, explain: '60 = 2²·3·5 → 60 × 1/2 × 2/3 × 4/5 = 16. (The lecture slide says 32 — that is a mistake.)' },
    { type: 'output', q: 'What does phi(36) return for the optimized method?', code: 'long result = 36, n = 36;\nfor (long p = 2; p * p <= n; p++) {\n    if (n % p == 0) {\n        while (n % p == 0) n /= p;\n        result -= result / p;\n    }\n}\nif (n > 1) result -= result / n;\nSystem.out.println(result);', answer: '12', explain: '36 = 2²·3² → 36 − 18 = 18 (p = 2); then 18 − 6 = 12 (p = 3).' },
    { type: 'fill', q: 'Complete the line that applies the factor (1 − 1/p).', template: 'if (n % p == 0) {\n    while (n % p == 0) n /= p;\n    result ___ result / p;\n}', blanks: [['-=']], explain: 'result − result/p = result · (1 − 1/p).' },
    { type: 'mcq', q: 'Why is `if (n > 1)` needed after the loop?', options: ['To avoid dividing by zero', 'A prime factor larger than √n can remain', 'Because n is always 1 after the loop', 'To handle n = 0'], answer: 1, explain: 'The loop only searches p ≤ √n. A single bigger prime factor can survive as the remaining value of n.' },
    { type: 'match', q: 'Match each n with φ(n).', pairs: [['φ(1)', '1'], ['φ(9)', '6'], ['φ(10)', '4'], ['φ(13)', '12']], explain: 'φ(9) = 9 − 3 = 6; φ(10) = 4 (1,3,7,9); φ(13) = 12 (prime).' },
  ],
  interview: [
    'What does Euler\'s totient count? Give φ(p) and φ(pᵏ).',
    'Prove or explain why φ(ab) = φ(a)φ(b) when gcd(a, b) = 1.',
    'How would you compute φ for all numbers up to 10⁷?',
    'Where does φ appear? (Euler\'s theorem, RSA, modular inverses).',
  ],
  videos: ['a-euler-phi', 'a-euler-phi#2'],
  revision: [
    'φ(n) = count of k in 1..n with gcd(k, n) = 1.',
    'φ(n) = n · Π(1 − 1/p) over DISTINCT primes p | n.',
    'Code: for p ≤ √n strip p, result −= result/p; finally if n > 1: result −= result/n.',
    'O(√n) time, O(1) space. Prime: φ(p) = p − 1.',
    'φ(60) = 16 (not 32).',
  ],
  sourceNotes: {
    discrepancies: [
      'The slide computes φ(60) = 32. The correct value is 16: 60 × (1/2) × (2/3) × (4/5) = 16. The slide repeated factors for the primes 2 and 5. The Java code on the slide is correct and returns 16.',
      'The slide\'s product formula φ(n) = (p₁−1)(p₂−1)…·p₁^(k₁−1)… is right, but its intermediate text for φ(60) lists the factors of 5 twice.',
    ],
  },
});

// ───────────────────────────── Chinese Remainder Theorem ─────────────────────────────
export const crt: Lesson = lesson({
  id: 'a-crt',
  dryRun: { algo: 'crt-sieve', input: { pairs: '2:3,3:5,2:7' }, caption: "Sun Tzu's classic: x ≡ 2 (mod 3), 3 (mod 5), 2 (mod 7) → 23." },
  module: 'm5',
  title: 'Chinese Remainder Theorem',
  summary: 'Recover a number from its remainders modulo several pairwise-coprime numbers.',
  level: 'intermediate',
  track: 'archive',
  minutes: 45,
  essential: false,
  prerequisites: ['a-euclid-gcd', 'm2-math-gcd-lcm-primes-mod'],
  sources: ['Remainder-Theorem'],
  objectives: [
    'Read a system of congruences x ≡ r (mod m) and explain what it asks.',
    'Solve small systems by searching, and larger ones with the CRT formula.',
    'Compute a modular inverse and use it inside the formula.',
    'Explain why the answer is unique only modulo M = m₁·m₂·…',
  ],
  intuition: [
    p('A general lines up soldiers in rows of 3 and 2 are left over; in rows of 5, 3 are left over; in rows of 7, 2 are left over. How many soldiers are there? The question "find x such that x % 3 = 2, x % 5 = 3, x % 7 = 2" is called a **system of congruences**, and it is written x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7).'),
    p('Think of three clocks with 3, 5 and 7 positions. A counter x makes all three tick. The three clock positions together are different for every x between 0 and 104, and the pattern repeats every 3 × 5 × 7 = 105 steps. So **the triple of remainders identifies x uniquely, up to multiples of 105**. That is the theorem (it needs the moduli to be pairwise coprime — share no factors).'),
    why('To build the answer we make three "switches". For modulus 3 we need a number that is 1 mod 3 but a multiple of 5 and 7, i.e. a multiple of M₁ = 105/3 = 35 that is ≡ 1 (mod 3): 35 · inverse(35 mod 3) = 35 · 2 = 70. Multiply by the wanted remainder 2 and it is "on" for modulus 3 and invisible (≡ 0) for 5 and 7. Add the three switched-on parts and take mod 105.'),
    pre(`
x = 2·(35·2) + 3·(21·1) + 2·(15·1) = 140 + 63 + 30 = 233
233 mod 105 = 23          ← the smallest non-negative solution
check: 23 mod 3 = 2 ✓   23 mod 5 = 3 ✓   23 mod 7 = 2 ✓
`),
  ],
  syntax: [p('Java ideas: arrays for the moduli and remainders, nested loops with `break`, `long` arithmetic for products of moduli, and the remainder operator on possibly large numbers.')],
  tiny: [
    code(`
int x = 0;
while (!(x % 3 == 2 && x % 5 == 3 && x % 7 == 2)) {
    x++;
}
System.out.println(x);   // 23
`, 'Brute force: try x = 0, 1, 2, … until all three remainders match.'),
  ],
  guided: [
    p('The slide solution is exactly this search generalised to arrays. It is perfectly fine while M is small, but needs up to M iterations. The formula needs only a few multiplications and one modular inverse per modulus.'),
    prog('crt/CrtBruteForce.java', 'Simple solution (the slide\'s idea, made to compile and terminate)'),
    prog('crt/CrtFormula.java', 'Optimized: closed-form CRT using modular inverses'),
  ],
  programs: [
    {
      file: 'crt/CrtBruteForce.java',
      title: 'CRT by search',
      role: 'simple',
      description: 'Tries x = 0 … M−1 until x % m[i] == r[i] for every i. At most M iterations.',
      walkthrough: [
        { at: 'limit *= m;', text: 'The answers repeat every M = m₁·m₂·…, so searching below M is enough; if nothing is found there is no solution.' },
        { at: 'x % mods[i] != rems[i]', text: 'One failed congruence rejects x immediately.' },
        { at: 'break;', text: 'Leave the inner loop early — no need to test the remaining moduli.' },
      ],
    },
    {
      file: 'crt/CrtFormula.java',
      title: 'CRT by formula',
      role: 'optimized',
      description: 'x = Σ rᵢ · Mᵢ · inverse(Mᵢ mod mᵢ), reduced mod M.',
      walkthrough: [
        { at: 'long Mi = M / mods[i];', text: 'Mᵢ is the product of all the OTHER moduli. It is ≡ 0 modulo each of them and invertible modulo mᵢ.' },
        { at: 'long b = inverse(Mi, mods[i]);', text: 'b·Mᵢ ≡ 1 (mod mᵢ). Here the inverse is found by trying 1..m−1; the Euclid lesson gives a faster way.' },
        { at: 'x += rems[i] * Mi % M * b % M;', text: 'Scale the "switch" by the required remainder. `% M` after each multiplication keeps numbers small.' },
      ],
    },
  ],
  complexity: [
    p('**Search:** O(M · k) where M = ∏ mᵢ and k is the number of congruences — exponential in the number of moduli.'),
    p('**Formula:** for each of the k congruences one inverse (O(log m) with extended Euclid, O(m) with the loop used here) → O(k · log M) with Euclid. Space O(k).'),
  ],
  mistakes: [
    {
      title: 'Moduli that are not coprime',
      wrong: '// x % 6 == 2 and x % 4 == 1   →  no x exists, but the formula silently returns garbage',
      why: 'The CRT formula needs gcd(mᵢ, mⱼ) = 1. 6 and 4 share the factor 2, so x must be even (from mod 6) and odd (from mod 4) — impossible. Without coprimality the inverse does not exist.',
      fix: '// check gcd(mi, mj) == 1 first, or use the general merge from the challenge exercise',
    },
    {
      title: 'Reading the answer as THE solution',
      wrong: '// "x = 233" for the slide example',
      why: 'Any x + 105k is a solution. The conventional answer is the smallest non-negative one: 233 mod 105 = 23.',
      fix: 'x = ((x % M) + M) % M;',
    },
    {
      title: 'Overflow in the products',
      wrong: 'x += rems[i] * Mi * b;   // can exceed long for big moduli',
      why: 'Mi alone may be near 10¹², and times b and remainder may overflow 64 bits.',
      fix: 'x = (x + rems[i] % M * Mi % M * b) % M;',
    },
  ],
  practice: [
    {
      id: 'crt-ex1',
      level: 'beginner',
      title: 'Two congruences',
      statement: 'Given coprime moduli a and b and remainders r1, r2 (read in the order `a r1 b r2`), print the smallest non-negative x with x % a = r1 and x % b = r2.',
      constraints: ['2 ≤ a, b ≤ 1000, gcd(a, b) = 1', '0 ≤ r1 < a, 0 ≤ r2 < b'],
      examples: [{ input: '3 2 5 3', output: '8' }],
      hints: ['The answer is below a·b.', 'Loop x from 0 and test both conditions.'],
      solutionFile: 'crt/Ex1.java',
      solutionExplain: 'CRT guarantees exactly one solution in [0, a·b). A simple loop finds it.',
      tests: [{ stdin: '3 2 5 3\n', stdout: '8' }, { stdin: '4 3 9 5\n', stdout: '23' }, { stdin: '7 0 11 0\n', stdout: '0' }],
    },
    {
      id: 'crt-ex2',
      level: 'intermediate',
      title: 'CRT with the formula',
      statement: 'Read n, then n lines `m r`. All moduli are pairwise coprime. Print the smallest non-negative x with x ≡ r (mod m) for all lines.',
      constraints: ['1 ≤ n ≤ 5', '2 ≤ m ≤ 1000', 'product of moduli ≤ 10¹²'],
      examples: [{ input: '3\n3 2\n5 3\n7 2', output: '23' }],
      hints: ['Mᵢ = M / mᵢ.', 'Inverse of Mᵢ modulo mᵢ: extended Euclid, or try 1..mᵢ−1.', 'Reduce mod M after every multiplication.'],
      solutionFile: 'crt/Ex2.java',
      solutionExplain: 'Each term rᵢ·Mᵢ·inv(Mᵢ) is ≡ rᵢ for modulus mᵢ and ≡ 0 for all others. Summing and reducing mod M gives the unique answer.',
      tests: [{ stdin: '3\n3 2\n5 3\n7 2\n', stdout: '23' }, { stdin: '2\n5 4\n11 7\n', stdout: '29' }, { stdin: '1\n13 6\n', stdout: '6' }],
    },
    {
      id: 'crt-ex3',
      level: 'challenge',
      title: 'Non-coprime moduli',
      statement: 'Read `r1 m1 r2 m2` (the moduli may share factors). Print the smallest non-negative x with x ≡ r1 (mod m1) and x ≡ r2 (mod m2), or -1 if none exists.',
      constraints: ['1 ≤ m1, m2 ≤ 10⁶', '0 ≤ r1 < m1, 0 ≤ r2 < m2'],
      examples: [{ input: '2 6 4 10', output: '14' }, { input: '2 6 1 4', output: '-1', explain: 'x must be even from the first and odd from the second.' }],
      hints: ['Only numbers r1, r1+m1, r1+2·m1, … satisfy the first congruence.', 'Their remainders modulo m2 repeat after at most m2 steps — try that many.'],
      solutionFile: 'crt/Ex3.java',
      solutionExplain: 'Walk through the candidates r1 + k·m1. Their residues mod m2 form a cycle of length ≤ m2, so after m2 candidates every possibility has been checked.',
      tests: [{ stdin: '2 6 4 10\n', stdout: '14' }, { stdin: '2 6 1 4\n', stdout: '-1' }, { stdin: '0 5 0 5\n', stdout: '0' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'The smallest non-negative x with x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7) is…', options: ['23', '233', '105', '35'], answer: 0, explain: '233 mod 105 = 23 and 23 checks out for all three.' },
    { type: 'mcq', q: 'Which condition do the moduli need for the CRT formula?', options: ['All equal', 'All prime', 'Pairwise coprime', 'Sum to 100'], answer: 2, explain: 'Pairwise coprime moduli make each Mᵢ invertible modulo mᵢ.' },
    { type: 'output', q: 'What is printed?', code: 'int x = 0;\nwhile (!(x % 4 == 1 && x % 5 == 2)) x++;\nSystem.out.println(x);', answer: '17', explain: 'Numbers ≡ 1 (mod 4): 1, 5, 9, 13, 17 → 17 % 5 = 2.' },
    { type: 'mcq', q: 'In the formula, what is Mᵢ?', options: ['mᵢ squared', 'M / mᵢ', 'M − mᵢ', 'rᵢ · mᵢ'], answer: 1, explain: 'Mᵢ = M / mᵢ is the product of all the other moduli.' },
    { type: 'mcq', q: 'The system x ≡ 1 (mod 6), x ≡ 2 (mod 4) has…', options: ['x = 13', 'x = 5', 'no solution', 'infinitely many but none below 24'], answer: 2, explain: 'x ≡ 1 (mod 6) forces x odd; x ≡ 2 (mod 4) forces x even.' },
  ],
  interview: ['State the CRT. When is the solution unique?', 'Compute the modular inverse of 35 modulo 3 by hand.', 'How would you solve a system whose moduli are not coprime?', 'Where does CRT appear in cryptography (RSA speed-up)?'],
  videos: ['a-crt', 'a-crt#2'],
  revision: [
    'x ≡ rᵢ (mod mᵢ), mᵢ pairwise coprime → unique x modulo M = Πmᵢ.',
    'x = Σ rᵢ·Mᵢ·inv(Mᵢ mod mᵢ), Mᵢ = M / mᵢ, then x mod M.',
    'Slide example: x = 233 ≡ 23 (mod 105).',
    'Not coprime? Check consistency (gcd) first.',
  ],
  sourceNotes: {
    discrepancies: [
      'The slide gives the answer as "x ≡ 233 (mod 105)". That is a correct congruence but the canonical answer is the reduced value 23.',
      'The slide\'s Java program has a compile error (`for(int i=0; i<n; i++)` uses n, which is never declared — it should be `size`) and its brute-force loop never terminates when no solution exists. The versions in this lesson fix both.',
    ],
    assumptions: ['The slide\'s program takes the divisors first and then the remainders; the lesson programs use the same input order (`n`, then moduli, then remainders).'],
  },
});

// ───────────────────────────── Combination ─────────────────────────────
export const combination: Lesson = lesson({
  id: 'a-combination',
  dryRun: { algo: 'pascal-ncr', input: { n: '6', r: '2' }, caption: "Pascal's triangle and the multiplicative formula agree." },
  module: 'm5',
  title: 'Combinations (nCr)',
  summary: 'Count the ways to choose r items from n, and list them — without overflowing on big factorials.',
  level: 'beginner',
  track: 'archive',
  minutes: 40,
  essential: false,
  prerequisites: ['m1-loops', 'm1-methods', 'm2-recursion'],
  sources: ['Combination'],
  objectives: [
    'Explain the difference between a permutation (order matters) and a combination (order does not).',
    'Compute nCr with the factorial formula and see why it overflows for n ≥ 13.',
    'Compute nCr safely with a multiply-then-divide loop and with Pascal\'s triangle.',
    'Generate all combinations of an array with recursion and backtracking.',
  ],
  intuition: [
    p('Choosing 2 friends from {Ann, Ben, Cy} for a pair project: {Ann, Ben}, {Ann, Cy}, {Ben, Cy} — **3** ways. {Ann, Ben} and {Ben, Ann} are the same team, so **order does not matter**. That count is written **C(3, 2)** or ³C₂ ("3 choose 2").'),
    p('If order did matter (president and vice-president), there would be 3 × 2 = 6 arrangements (a **permutation**). Every team of 2 was counted 2! = 2 times, so the number of teams is 6 / 2 = 3. In general:'),
    math('C(n, r) = n! / (r! · (n − r)!)       (what the lecture slide uses)'),
    why('Another way to see the formula is Pascal\'s rule: C(n, r) = C(n−1, r−1) + C(n−1, r). Take one special item. Either it is in the team (choose r−1 more from the other n−1) or it is not (choose all r from the other n−1). That recurrence builds Pascal\'s triangle and never needs a factorial.'),
  ],
  syntax: [
    code(`
long result = 1;
for (int i = 1; i <= r; i++) result = result * (n - r + i) / i;   // multiply THEN divide: stays whole

// import java.math.BigInteger;                                 // when long overflows (n > ~60)
BigInteger f = BigInteger.ONE;
f = f.multiply(BigInteger.valueOf(k)).divide(BigInteger.valueOf(i));
long safe = Math.multiplyExact(a, b);                            // throws ArithmeticException instead of wrapping
`),
  ],
  tiny: [code(`
// 5C2 = 5! / (2! * 3!) = 120 / (2 * 6) = 10
`)],
  guided: [
    p('The lecture program puts numbers in an `ArrayList` and uses only its **size** n = 5 — the list contents (9, 12, 19, 61, 19) play no role in counting. `fact` is written with a `while` loop. It prints 10.'),
    warn('`int` can only hold up to 2 147 483 647. 13! = 6 227 020 800 already overflows, so the factorial formula silently gives wrong answers for n ≥ 13 — even when the final answer is small.'),
    prog('combination/CombinationNaive.java', 'Simple (the slide\'s formula)'),
    prog('combination/Combination.java', 'Optimized: multiplicative formula, no factorials'),
    prog('combination/PascalTriangle.java', "Pascal's triangle (addition only)"),
    prog('combination/CombinationsList.java', 'Listing all combinations with backtracking'),
  ],
  programs: [
    {
      file: 'combination/CombinationNaive.java',
      title: 'nCr with factorials',
      role: 'simple',
      description: 'Direct translation of n! / (r! (n−r)!). Correct for n ≤ 12, breaks for larger n because of overflow.',
      walkthrough: [
        { at: 'static int fact', text: 'Multiplies 2 · 3 · … · k. The starting value 1 also handles 0! = 1.' },
        { at: 'fact(n) / (fact(r) * fact(n - r))', text: 'Integer division is exact because the true quotient is a whole number — if nothing overflowed.' },
      ],
    },
    {
      file: 'combination/Combination.java',
      title: 'nCr multiplicatively',
      role: 'optimized',
      description: 'Builds the answer in r steps: after step i the value is C(n−r+i, i). Uses long and the symmetry C(n, r) = C(n, n−r).',
      walkthrough: [
        { at: 'r = Math.min(r, n - r);', text: 'C(100, 98) = C(100, 2): choose the smaller side so the loop is short.' },
        { at: 'result = result * (n - r + i) / i;', text: 'Multiply FIRST then divide. The product of i consecutive numbers is always divisible by i!, so `/ i` is exact at every step.' },
      ],
    },
    {
      file: 'combination/PascalTriangle.java',
      title: "Pascal's triangle",
      role: 'demo',
      description: 'Each entry is the sum of the two entries above it. Only addition, so no overflow until the numbers themselves are huge.',
      walkthrough: [
        { at: 'c[n][0] = 1;', text: 'There is one way to choose nothing.' },
        { at: 'c[n][r] = c[n - 1][r - 1]', text: 'Pascal\'s rule: include the last item, or skip it.' },
      ],
    },
    {
      file: 'combination/CombinationsList.java',
      title: 'List all combinations (backtracking)',
      role: 'demo',
      description: 'Choose an item, recurse on the items to its right, then un-choose it and try the next item.',
      walkthrough: [
        { at: 'if (current.size() == r)', text: 'Base case: we have exactly r items — print this combination.' },
        { at: 'current.add(items[i]);', text: 'Choose.' },
        { at: 'combos(items, r, i + 1, current);', text: 'Explore: only items to the RIGHT can be added, which prevents duplicates like [12, 9].' },
        { at: 'current.remove(current.size() - 1);', text: 'Un-choose (backtrack) so the next loop iteration starts from a clean selection.' },
      ],
    },
  ],
  complexity: [
    p('**Factorial formula:** O(n) multiplications, O(1) space — but incorrect for n ≥ 13 in `int` (n ≥ 21 in `long`).'),
    p('**Multiplicative loop:** O(min(r, n−r)) time, O(1) space. Valid whenever the *result* fits in the type.'),
    p('**Pascal:** O(n · r) time, O(n · r) space (can be O(r) with a single row).'),
    p('**Listing all combinations:** there are C(n, r) of them, each costing O(r) to print → O(r · C(n, r)). The count itself explodes — C(40, 20) ≈ 1.4 × 10¹¹.'),
  ],
  mistakes: [
    { title: 'Overflow in the factorial', wrong: 'int c = fact(20) / (fact(2) * fact(18));', why: '20! overflows int (and even long is borderline). The result printed is nonsense, with no error message.', fix: 'long result = 1;\nfor (int i = 1; i <= r; i++) result = result * (n - r + i) / i;' },
    { title: 'Divide before multiply', wrong: 'result = result / i * (n - r + i);', why: 'Integer division truncates: 4/3 becomes 1 and the answer is wrong.', fix: 'result = result * (n - r + i) / i;   // multiply first' },
    { title: 'Treating order as important', wrong: '// printing [9,12] and [12,9] as two different combinations', why: 'A combination is a set. Starting the recursive loop at i + 1 (not 0) prevents revisiting earlier items.', fix: 'for (int i = start; i < items.length; i++) ...' },
  ],
  practice: [
    {
      id: 'comb-ex1',
      level: 'beginner',
      title: 'nCr as a number',
      statement: 'Read n and r (0 ≤ r ≤ n ≤ 30). Print C(n, r).',
      examples: [{ input: '5 2', output: '10' }],
      hints: ['Multiply first, then divide, one step at a time.', 'Use long.'],
      solutionFile: 'combination/Ex1.java',
      solutionExplain: 'The loop keeps the exact value C(n−r+i, i) after step i, so each division is exact.',
      tests: [{ stdin: '5 2\n', stdout: '10' }, { stdin: '30 15\n', stdout: '155117520' }, { stdin: '7 0\n', stdout: '1' }],
    },
    {
      id: 'comb-ex2',
      level: 'intermediate',
      title: 'nCr modulo 1 000 000 007',
      statement: 'Read n and r (0 ≤ r ≤ n ≤ 1000). Print C(n, r) mod 1 000 000 007.',
      examples: [{ input: '10 3', output: '120' }],
      hints: ['The true value is far too large for long — use Pascal\'s rule and take % MOD after each addition.'],
      solutionFile: 'combination/Ex2.java',
      solutionExplain: 'Pascal\'s recurrence uses only additions, so applying `% MOD` at each step keeps every value small.',
      tests: [{ stdin: '10 3\n', stdout: '120' }, { stdin: '1000 500\n', stdout: '159835829' }, { stdin: '5 5\n', stdout: '1' }],
    },
    {
      id: 'comb-ex3',
      level: 'challenge',
      title: 'List all combinations',
      statement: 'Read n and r (1 ≤ r ≤ n ≤ 10). Print every r-element subset of {1..n}, one per line, elements in increasing order, subsets in lexicographic order.',
      examples: [{ input: '4 2', output: '1 2\n1 3\n1 4\n2 3\n2 4\n3 4' }],
      hints: ['Recursion: choose(start, count).', 'Only pick values larger than the previous one.'],
      solutionFile: 'combination/Ex3.java',
      solutionExplain: 'Recursive loop from `start` upwards: choose a value, recurse with start = value + 1. Because values only increase, each subset appears once and in lexicographic order.',
      tests: [{ stdin: '4 2\n', stdout: '1 2\n1 3\n1 4\n2 3\n2 4\n3 4' }, { stdin: '3 3\n', stdout: '1 2 3' }, { stdin: '3 1\n', stdout: '1\n2\n3' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'What is C(6, 2)?', options: ['12', '15', '30', '36'], answer: 1, explain: '6!/(2!·4!) = 720/(2·24) = 15.' },
    { type: 'mcq', q: 'How many ways to arrange (order matters) 2 of 6 items?', options: ['12', '15', '30', '36'], answer: 2, explain: '6 · 5 = 30. Dividing by 2! gives the 15 combinations.' },
    { type: 'output', q: 'What is printed?', code: 'long result = 1;\nint n = 6, r = 2;\nfor (int i = 1; i <= r; i++)\n    result = result * (n - r + i) / i;\nSystem.out.println(result);', answer: '15', explain: 'i=1: 1·5/1 = 5; i=2: 5·6/2 = 15.' },
    { type: 'mcq', q: 'Why does `fact(15) / (fact(2) * fact(13))` print a wrong answer in int arithmetic?', options: ['Division is wrong', 'fact(15) overflows int', 'r is too small', 'nCr is undefined for n=15'], answer: 1, explain: '15! ≈ 1.3 × 10¹² > 2.1 × 10⁹.' },
    { type: 'mcq', q: 'C(n, r) equals…', options: ['C(n, n−r)', 'C(n, r+1)', 'C(n−1, r)', 'n · r'], answer: 0, explain: 'Choosing r to include is the same as choosing n−r to leave out.' },
  ],
  interview: ['Difference between nCr and nPr?', 'Compute C(1000, 3) without overflow.', 'Why is Pascal\'s rule true?', 'How many subsets does an n-element set have? (2ⁿ = Σ C(n, r))'],
  videos: ['a-combination', 'a-combination#2'],
  revision: ['C(n,r) = n! / (r!(n−r)!)', 'C(n,r) = C(n,n−r); C(n,0) = C(n,n) = 1', 'Loop: result = result*(n−r+i)/i for i=1..r', 'Pascal: C(n,r) = C(n−1,r−1) + C(n−1,r)', 'Overflow: 13! > int, 21! > long'],
  sourceNotes: {
    discrepancies: [
      'The slide places an ArrayList of 5 numbers into the program, but only list.size() is ever used, so the "9, 12, 19, 61, 19" values have no effect on the result (10).',
      'The slide\'s factorial uses int and would overflow for n ≥ 13 — fine for the sample, wrong in general.',
    ],
  },
});

// ───────────────────────────── Karatsuba ─────────────────────────────
export const karatsuba: Lesson = lesson({
  id: 'a-karatsuba',
  dryRun: { algo: 'karatsuba-trace', input: { x: '1234', y: '5678' }, caption: 'Three recursive multiplications per level instead of four.' },
  module: 'm5',
  title: "Karatsuba's Multiplication",
  summary: 'Multiply two big numbers with three recursive multiplications instead of four — a first taste of divide and conquer.',
  level: 'advanced',
  track: 'archive',
  minutes: 55,
  essential: false,
  prerequisites: ['m2-recursion', 'm4-paradigms', 'a-euclid-gcd'],
  sources: ['Karatsuba-Algorithm'],
  objectives: [
    'Explain school-book multiplication and its O(n²) digit multiplications.',
    'Derive the 3-multiplication trick (a+b)(c+d) − ac − bd = ad + bc.',
    'Implement Karatsuba for long and for BigInteger and test it against *.',
    'Solve the recurrence T(n) = 3T(n/2) + O(n) = O(n^1.585).',
  ],
  intuition: [
    p('Multiply 1234 × 5678 by splitting each number into two halves: 1234 = **12**·100 + **34** and 5678 = **56**·100 + **78**. Call the halves a = 12, b = 34, c = 56, d = 78.'),
    math('(a·100 + b)(c·100 + d) = ac·100² + (ad + bc)·100 + bd'),
    p('That needs **four** smaller multiplications: ac, ad, bc, bd. Karatsuba noticed that the middle term can be obtained from ONE extra multiplication that we already half-have:'),
    math('(a + b)(c + d) = ac + ad + bc + bd     ⟹     ad + bc = (a+b)(c+d) − ac − bd'),
    why('We already compute ac and bd for the outer terms. One more product, (a+b)(c+d), gives the middle term after two subtractions. Subtractions are cheap (linear time), multiplications are expensive, so trading one multiplication for a few additions makes the recursion branch 3 ways instead of 4. Over many levels that is the difference between n² and n^1.585.'),
    pre(`
1234 × 5678          a=12 b=34   c=56 d=78
ac       = 12 × 56 =   672
bd       = 34 × 78 =  2652
(a+b)(c+d)= 46 × 134 =  6164
ad + bc  = 6164 − 672 − 2652 = 2840
result   = 672·10000 + 2840·100 + 2652 = 7 006 652  ✓
`),
  ],
  syntax: [p('Java ideas: recursion with a base case, `Long.toString(x).length()` to count digits, integer division `/` and remainder `%` to split a number, and `BigInteger` with `shiftLeft/shiftRight` for the bit-splitting version.')],
  tiny: [code(`
// split 1234 into halves with p = 100
long a = 1234 / 100;   // 12
long b = 1234 % 100;   // 34
`)],
  guided: [
    prog('karatsuba/Karatsuba.java', 'Karatsuba for long (decimal split) — counts the single-digit multiplications it used'),
    prog('karatsuba/KaratsubaBig.java', 'Karatsuba for BigInteger (bit split) — tested against BigInteger.multiply on random inputs'),
    p('For 1234 × 5678 the program reports **11** single-digit multiplications. The school method needs 4 × 4 = 16 digit multiplications — and the gap widens fast with the number of digits.'),
  ],
  programs: [
    {
      file: 'karatsuba/Karatsuba.java',
      title: 'Karatsuba (decimal split)',
      role: 'simple',
      description: 'Splits both numbers at half their digit count and recurses on three products.',
      walkthrough: [
        { at: 'if (x < 10 || y < 10)', text: 'Base case: if either factor has one digit, ordinary multiplication is already cheap.' },
        { at: 'int half = n / 2;', text: 'The LOW part gets `half` digits; the high part gets the rest. This differs from the slide (which used (n+1)/2 with Math.pow) but both are valid.' },
        { at: 'long a = x / p, b = x % p;', text: 'x = a·10^half + b, so division gives the high part and remainder gives the low part.' },
        { at: 'long abcd = multiply(a + b, c + d);', text: 'The single extra multiplication that replaces both ad and bc.' },
        { at: 'long adPlusBc = abcd - ac - bd;', text: 'Remove the terms we already know. What remains is exactly ad + bc.' },
        { at: 'return ac * p * p + adPlusBc * p + bd;', text: 'Shift the three parts into place and add them (shifting = multiplying by powers of 10).' },
      ],
    },
    {
      file: 'karatsuba/KaratsubaBig.java',
      title: 'Karatsuba (bit split, BigInteger)',
      role: 'optimized',
      description: 'Same idea using shifts on BigInteger; handles numbers of hundreds of digits and is self-checked against BigInteger.multiply.',
      walkthrough: [
        { at: 'if (n <= 32)', text: 'Small enough for the hardware: use the built-in multiply instead of recursing further.' },
        { at: 'x.shiftRight(half)', text: 'Shifting right by `half` bits is x / 2^half — the high part.' },
        { at: 'BigInteger mid =', text: 'The same three-product identity, with BigInteger operations.' },
        { at: 'ac.shiftLeft(2 * half)', text: 'Multiplying by 2^(2·half) is a left shift — much cheaper than a decimal power.' },
      ],
    },
  ],
  complexity: [
    p('Let T(n) be the cost for n-digit numbers. We make **3** recursive calls on numbers about half as long, plus linear work for splitting, adding and subtracting:'),
    math('T(n) = 3·T(n/2) + O(n)   ⟹   T(n) = O(n^(log₂ 3)) ≈ O(n^1.585)'),
    p('School-book multiplication satisfies T(n) = 4·T(n/2) + O(n) = O(n²). For 1000-digit numbers that is about 10⁶ vs 1000^1.585 ≈ 5.6 × 10⁴ digit operations.'),
    p('Space: the recursion depth is log₂ n, but every level allocates numbers of size O(n), so O(n) extra space overall.'),
    table(['digits n', 'school n²', 'Karatsuba n^1.585', 'speed-up'], [['10', '100', '38', '≈ 2.6×'], ['100', '10 000', '1 479', '≈ 6.8×'], ['1 000', '1 000 000', '56 000', '≈ 18×'], ['10 000', '100 000 000', '2 200 000', '≈ 45×']]),
    note('For small inputs ordinary multiplication is faster because Karatsuba has overhead. Real libraries switch to schoolbook below a threshold (BigInteger uses 80 ints) — exactly what the base case does.'),
  ],
  mistakes: [
    { title: 'Using Math.pow for powers of 10', wrong: 'long p = (long) Math.pow(10, half);', why: 'Math.pow returns a double. Beyond 2⁵³ it cannot represent every integer, so results can silently be off by one.', fix: 'long p = 1; for (int i = 0; i < half; i++) p *= 10;' },
    { title: 'Declaring a variable named ad+bc', wrong: 'long ad+bc = multiply(a + b, c + d) - ac - bd;   // the slide', why: 'Identifiers cannot contain "+". This is a compile-time error.', fix: 'long adPlusBc = multiply(a + b, c + d) - ac - bd;' },
    { title: 'Forgetting that a+b may have more digits', wrong: '// assuming (a+b) has n/2 digits', why: 'The sum of two half-length numbers can carry into one more digit. The algorithm still works because every recursion strictly decreases the numbers, but the digit count of a+b is not n/2.', fix: 'Recompute the length inside every call (the code above does this)' },
  ],
  practice: [
    {
      id: 'karat-ex1',
      level: 'beginner',
      title: 'School-book multiplication',
      statement: 'Read two non-negative integers as digit strings (up to 100 digits each). Print their product without using BigInteger or `long` arithmetic on the whole numbers.',
      examples: [{ input: '12345 6789', output: '83810205' }],
      hints: ['Digit i of x times digit j of y contributes to position i + j + 1 of the result.', 'Keep a carry as you add.'],
      solutionFile: 'karatsuba/Ex1.java',
      solutionExplain: 'The classic method: n·m single-digit products, each added into the right position with carry.',
      tests: [{ stdin: '12345 6789\n', stdout: '83810205' }, { stdin: '0 98765\n', stdout: '0' }, { stdin: '99999999999 99999999999\n', stdout: '9999999999800000000001' }],
    },
    {
      id: 'karat-ex2',
      level: 'intermediate',
      title: 'Count the base multiplications',
      statement: 'Run the lesson\'s Karatsuba algorithm (split at n/2 low digits; base case when either factor < 10) on x and y (both < 10⁹). Print how many times the base case is reached.',
      examples: [{ input: '1234 5678', output: '11' }],
      hints: ['Add a static counter incremented in the base case.', 'Do not change the splitting rule — the answer depends on it.'],
      solutionFile: 'karatsuba/Ex2.java',
      solutionExplain: 'A static counter in the base case counts leaf calls of the recursion tree.',
      tests: [{ stdin: '1234 5678\n', stdout: '11' }, { stdin: '5 7\n', stdout: '1' }, { stdin: '12 34\n', stdout: '3' }],
    },
    {
      id: 'karat-ex3',
      level: 'challenge',
      title: 'Big Karatsuba',
      statement: 'Read two non-negative integers (up to 1000 digits). Multiply them with your own Karatsuba on BigInteger (do not call BigInteger.multiply except below a 30-bit threshold) and print the product.',
      examples: [{ input: '123456789 987654321', output: '121932631112635269' }],
      hints: ['Use bitLength() to decide the split point.', 'Use shiftLeft/shiftRight and subtract to obtain the low part.'],
      solutionFile: 'karatsuba/Ex3.java',
      solutionExplain: 'Same three-product identity as the long version, but with BigInteger and bit shifts; the base case is a plain 30-bit multiplication.',
      tests: [{ stdin: '123456789 987654321\n', stdout: '121932631112635269' }, { stdin: '100000000000000000000 100000000000000000000\n', stdout: '10000000000000000000000000000000000000000' }, { stdin: '0 5\n', stdout: '0' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'How many recursive multiplications does Karatsuba make per level?', options: ['2', '3', '4', '5'], answer: 1, explain: 'ac, bd and (a+b)(c+d).' },
    { type: 'mcq', q: 'Which expression equals ad + bc?', options: ['(a+b)(c+d) − ac − bd', '(a−b)(c−d)', 'ac + bd', '(a+c)(b+d)'], answer: 0, explain: 'Expanding (a+b)(c+d) = ac + ad + bc + bd.' },
    { type: 'mcq', q: 'The running time of Karatsuba is…', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n^1.585)', 'O(n²)'], answer: 2, explain: 'T(n) = 3T(n/2) + O(n) gives n^(log₂ 3).' },
    { type: 'output', q: 'With a=12, b=34, c=56, d=78, what is (a+b)(c+d) − ac − bd?', code: '// ac = 672, bd = 2652\nlong abcd = 46 * 134;\nSystem.out.println(abcd - 672 - 2652);', answer: '2840', explain: '46 × 134 = 6164; 6164 − 672 − 2652 = 2840 = ad + bc.' },
    { type: 'mcq', q: 'Why do libraries use school-book multiplication for small numbers?', options: ['It is more accurate', 'Karatsuba has overhead that dominates for small n', 'It is required by the JVM', 'Karatsuba cannot handle small numbers'], answer: 1, explain: 'Recursion and extra additions cost more than 1-2 machine multiplications.' },
  ],
  interview: ['Derive Karatsuba\'s 3-multiplication identity.', 'Solve T(n) = 3T(n/2) + n with the master theorem.', 'Why does BigInteger switch algorithms with size?', 'Name an algorithm faster than Karatsuba for huge numbers (Toom–Cook, FFT/Schönhage–Strassen).'],
  videos: ['a-karatsuba', 'a-karatsuba#2'],
  revision: ['x=a·10^m+b, y=c·10^m+d', 'ac, bd, (a+b)(c+d); middle = third − ac − bd', 'x·y = ac·10^(2m) + mid·10^m + bd', 'T(n) = 3T(n/2) + O(n) → O(n^1.585)', 'Base case: small factor → plain multiply'],
  sourceNotes: {
    discrepancies: [
      'The slide code contains `long ad+bc = …` and later uses `adbc`; neither compiles. The slide also uses Math.pow (floating point) to build powers of ten.',
      'The slide\'s explanation labels z0 = ac in one paragraph and z0 = bd in the next. In this lesson ac is the high product and bd the low product, consistently.',
      'The slide says the three-product count "reduces overall complexity" but never states it: it is O(n^1.585) versus O(n²).',
    ],
  },
});

// ───────────────────────────── Booth's algorithm ─────────────────────────────
export const booth: Lesson = lesson({
  id: 'a-booth',
  module: 'm5',
  title: "Booth's Algorithm (signed binary multiplication)",
  summary: 'Multiply two signed two\'s-complement numbers with additions, subtractions and shifts — the way hardware does.',
  level: 'advanced',
  track: 'archive',
  minutes: 60,
  essential: false,
  prerequisites: ['m2-number-systems-binary', 'm1-operators-bitwise', 'm1-loops'],
  sources: ["Booth's-Algorithm"],
  objectives: [
    'Convert numbers to and from n-bit two\'s complement and negate them.',
    'Explain an arithmetic right shift and why it preserves the sign.',
    'Apply the three Booth rules (Q₀Q₋₁ = 00/11, 10, 01) by hand for n = 4.',
    'Implement the algorithm in Java and verify it against * for every input.',
  ],
  intuition: [
    p('Ordinary binary multiplication adds a shifted copy of the multiplicand for every 1 in the multiplier. 0111 (7) has three 1s so it costs three additions. But 7 = 8 − 1: **one shift and one subtraction**. A run of 1s from bit position j to k equals 2^(k+1) − 2^j.'),
    p('Booth\'s algorithm scans the multiplier bit pairs from right to left and uses that observation: **subtract** the multiplicand where a run of 1s begins, **add** it where the run ends, and do nothing inside a run or inside a run of 0s.'),
    table(['Q₀', 'Q₋₁', 'meaning', 'action'], [['0', '0', 'inside a run of 0s', 'only shift'], ['1', '1', 'inside a run of 1s', 'only shift'], ['1', '0', 'a run of 1s begins', 'AC = AC − M, then shift'], ['0', '1', 'a run of 1s ends', 'AC = AC + M, then shift']], 'Booth\'s conditions — the slide\'s "CONDITIONS" box.'),
    why('Treat the multiplier as the sum Σ(qᵢ₋₁ − qᵢ)·2ⁱ. Each pair contributes +1, 0 or −1 times the multiplicand shifted into place. Doing the multiply with signed digits works for NEGATIVE multipliers too, because in two\'s complement the leading bit has a negative weight and the same pair rule gives it the right sign. The arithmetic shift (copying the sign bit) keeps the partial product\'s sign.'),
  ],
  syntax: [
    p('**Two\'s complement** represents −x in n bits as (2ⁿ − x): flip every bit and add 1. For n = 4: 7 = 0111; −7 = 1000 + 1 = 1001.'),
    p('**Arithmetic shift right** moves every bit one place right and keeps the leftmost (sign) bit: 1100 → 1110. Java\'s `>>` does this for `int`; `>>>` shifts in zeros instead.'),
    p('Java bit tools: `x & mask` (keep bits), `x | y`, `x << k`, `x >> k`, `(1 << n) - 1` (n ones).'),
  ],
  tiny: [code(`
int M = 7;                 // 0111
int negM = (~M + 1);       // flip bits and add 1  →  -7
System.out.println(negM);          // -7
System.out.println(negM & 0xF);    // 9  (= 1001, the 4-bit pattern of -7)
`)],
  guided: [
    p('The slide traces M = 0111 (7) and Q = 0011 (3) with registers **AC** (accumulator), **Q** (multiplier) and **Q₋₁**. The table below is produced by the program `BoothMultiply` on the same input:'),
    table(['cycle', 'Q₀ Q₋₁', 'operation', 'AC', 'Q', 'Q₋₁'], [['init', '', '', '0000', '0011', '0'], ['1', '1 0', 'AC = AC − M, ASR', '1100', '1001', '1'], ['2', '1 1', 'shift only', '1110', '0100', '1'], ['3', '0 1', 'AC = AC + M, ASR', '0010', '1010', '0'], ['4', '0 0', 'shift only', '0001', '0101', '0']], 'Result = AC:Q = 0001 0101 = 21 = 7 × 3'),
    prog('booth/BoothMultiply.java', 'Booth\'s algorithm with a printed trace'),
    prog('booth/BoothCheck.java', 'Exhaustive self-test against * for all 6-bit pairs'),
  ],
  dryRun: { algo: 'booth', input: { m: '7', q: '3', bits: '4' }, caption: 'The slide example M = 7, Q = 3 in 4 bits.' },
  programs: [
    {
      file: 'booth/BoothMultiply.java',
      title: "Booth's algorithm with trace",
      role: 'optimized',
      description: 'Simulates AC, Q, Q₋₁ registers of `width` bits. Handles negative operands and the most-negative-number edge case.',
      walkthrough: [
        { at: 'if (multiplicand == -(1 << (width - 1)))', text: 'Edge case: the most negative n-bit number (−8 in 4 bits) has no positive partner in n bits, so −M cannot be formed. One extra bit (sign extension) fixes it.' },
        { at: 'int negM = (-multiplicand) & mask;', text: 'Two\'s complement of M as an n-bit pattern, precomputed so the loop can just ADD it to subtract M.' },
        { at: 'if (q0 == 1 && qMinus1 == 0)', text: 'Pair "10": a run of 1s begins → AC = AC − M (adding −M).' },
        { at: 'else if (q0 == 0 && qMinus1 == 1)', text: 'Pair "01": a run of 1s ends → AC = AC + M.' },
        { at: 'qMinus1 = Q & 1;', text: 'Arithmetic shift of the 2n+1-bit chain AC|Q|Q₋₁: the lowest bit of Q falls into Q₋₁…' },
        { at: 'Q = ((Q >> 1) | ((AC & 1) << (width - 1))) & mask;', text: '…Q shifts right and receives the lowest bit of AC at its top…' },
        { at: 'AC = (AC >> 1) | sign;', text: '…and AC shifts right while the sign bit is kept: that is the arithmetic shift.' },
        { at: 'long raw = ((long) AC << width) | Q;', text: 'The 2n-bit product is AC concatenated with Q.' },
        { at: 'raw - (1L << (2 * width))', text: 'If the top bit is set the number is negative: subtract 2^(2n) to read it as signed.' },
      ],
    },
    {
      file: 'booth/BoothCheck.java',
      title: 'Exhaustive test',
      role: 'demo',
      description: 'A compact copy of the algorithm compared with the * operator for all 64 × 64 six-bit pairs, including (−32) × (−32).',
      walkthrough: [
        { at: 'for (int m = lo; m <= hi; m++)', text: 'Every signed 6-bit multiplicand from −32 to 31.' },
        { at: 'if (got != m * q)', text: 'Any disagreement with Java\'s own multiplication is reported immediately.' },
      ],
    },
  ],
  complexity: [
    p('The loop runs once per multiplier bit, and each cycle does at most one n-bit addition and one shift → **O(n²) bit operations** for n-bit operands (n cycles × n-bit add), O(n) cycles. Space O(n).'),
    p('Why bother? In hardware shifting is nearly free, so the cost is the number of add/subtract operations. Booth turns a run of k ones into 2 operations instead of k. For multipliers with long runs of 1s (like −1 = 1111…1) that is a huge saving; worst case (alternating 0101…) is still n operations.'),
  ],
  mistakes: [
    { title: 'Logical shift instead of arithmetic shift', wrong: 'AC = AC >> 1;   // on an n-bit pattern held in a larger int', why: 'The top bit of the n-bit pattern is not the int\'s sign bit, so >> shifts in 0. Negative partial products become positive.', fix: 'AC = (AC >> 1) | (AC & signBit);   // re-insert the sign bit' },
    { title: 'Forgetting to discard the carry', wrong: 'AC = AC + M;   // AC is int, bit n silently appears', why: 'The addition can produce an (n+1)th bit. Hardware drops it; in software you must mask.', fix: 'AC = (AC + M) & mask;' },
    { title: 'Negating the most negative number', wrong: 'booth(-8, 3, 4)   // -(-8) is 8, which does not fit in 4-bit two\'s complement', why: '−8 = 1000 and its two\'s complement is again 1000. The subtraction adds the wrong value.', fix: 'Use width + 1 bits when the multiplicand is −2^(n−1) (as BoothMultiply does).' },
  ],
  practice: [
    {
      id: 'booth-ex1',
      level: 'beginner',
      title: 'n-bit two\'s complement',
      statement: 'Read an integer x and a width n (1 ≤ n ≤ 16, x fits in n bits). Print the n-bit two\'s complement bit pattern of x.',
      examples: [{ input: '-5 8', output: '11111011' }],
      hints: ['Walk from the top bit n−1 down to 0 and print (x >> bit) & 1.', 'Java\'s >> on a negative int already yields the two\'s complement bits.'],
      solutionFile: 'booth/Ex1.java',
      solutionExplain: 'Java stores int in two\'s complement, so shifting and masking one bit at a time reads off the pattern directly.',
      tests: [{ stdin: '-5 8\n', stdout: '11111011' }, { stdin: '7 4\n', stdout: '0111' }, { stdin: '-1 4\n', stdout: '1111' }],
    },
    {
      id: 'booth-ex2',
      level: 'intermediate',
      title: 'Booth\'s operations',
      statement: 'Read an n-bit multiplier as a bit string. For each cycle (from the rightmost bit to the leftmost), print the operation Booth\'s algorithm performs: `-M`, `+M` or `0`. Separate with spaces.',
      examples: [{ input: '0110', output: '0 -M 0 +M' }],
      hints: ['Keep the previous bit (starting at 0).', '(1,0) → −M; (0,1) → +M; otherwise 0.'],
      solutionFile: 'booth/Ex2.java',
      solutionExplain: 'The current bit with the previously processed (lower) bit forms the pair Q₀Q₋₁; the table of conditions gives the action.',
      tests: [{ stdin: '0110\n', stdout: '0 -M 0 +M' }, { stdin: '0011\n', stdout: '-M 0 +M 0' }, { stdin: '1111\n', stdout: '-M 0 0 0' }],
    },
    {
      id: 'booth-ex3',
      level: 'challenge',
      title: 'Booth multiplication',
      statement: 'Read two signed integers (each fits in 16-bit two\'s complement). Print their product, computed by simulating Booth\'s algorithm on registers (no `*`).',
      examples: [{ input: '-3 4', output: '-12' }],
      hints: ['Use width = 16 (17 if the multiplicand is −32768).', 'Mask AC and M to the register width after every addition.', 'Combine AC and Q at the end and sign-extend the 2n-bit value.'],
      solutionFile: 'booth/Ex3.java',
      solutionExplain: 'Direct simulation of the hardware loop; the final 2n-bit pattern is converted to a signed number.',
      tests: [{ stdin: '-3 4\n', stdout: '-12' }, { stdin: '7 3\n', stdout: '21' }, { stdin: '-8 -8\n', stdout: '64' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Booth\'s algorithm subtracts the multiplicand when (Q₀, Q₋₁) is…', options: ['00', '01', '10', '11'], answer: 2, explain: '"10" marks the start of a run of 1s.' },
    { type: 'output', q: 'What is the 4-bit two\'s complement of 0111 (7)?', code: '// flip: 1000, add 1', answer: '1001', explain: '1000 + 0001 = 1001 = −7.' },
    { type: 'mcq', q: 'An arithmetic right shift of 1100 (4-bit) gives…', options: ['0110', '1110', '1100', '0100'], answer: 1, explain: 'The sign bit (1) is copied into the vacated left position.' },
    { type: 'mcq', q: 'What is 0111 × 0011 after 4 Booth cycles in AC:Q?', options: ['00010101', '00011001', '00001111', '00010011'], answer: 0, explain: '0001 0101 = 21 = 7 × 3.' },
    { type: 'mcq', q: 'Which multiplier makes Booth\'s algorithm most efficient?', options: ['01010101', '11111111', '10101010', '00000001'], answer: 1, explain: 'A single long run of 1s needs just one subtract (and the result is just a shift).' },
  ],
  interview: ['Why does Booth\'s algorithm work for negative multipliers?', 'What are the three registers and what does each do?', 'Why is an extra bit needed for the most negative multiplicand?', 'How does Booth compare to shift-and-add on an input with many consecutive 1s?'],
  videos: ['a-booth', 'a-booth#2'],
  revision: ['Pairs (Q0 Q-1): 10 → AC−M, 01 → AC+M, 00/11 → nothing; then arithmetic shift right.', 'n cycles; product = AC:Q (2n bits).', '−M = ~M + 1.', 'Run of 1s = 2^(k+1) − 2^j: one subtract, one add.', 'Example: 7 × 3 = 0001 0101 = 21.'],
  sourceNotes: {
    discrepancies: ['The Booth deck is entirely screenshots from a video lecture; it has no Java code. The program here is original and verified exhaustively.'],
    assumptions: ['The slides use M = 0111, Q = 0011 (n = 4) and a second example with M = 01011, Q = 01110 (n = 5). Both are supported by the program.'],
  },
});

// ───────────────────────────── Simple sieve ─────────────────────────────
export const simpleSieve: Lesson = lesson({
  id: 'a-simple-sieve',
  module: 'm5',
  title: 'Simple Sieve of Eratosthenes',
  summary: 'Find every prime up to n by crossing out multiples — far faster than testing each number.',
  level: 'beginner',
  track: 'archive',
  minutes: 40,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm1-loops', 'm2-math-gcd-lcm-primes-mod'],
  sources: ['Simple-Sieve'],
  objectives: [
    'Explain how crossing out multiples finds primes.',
    'Justify the two optimisations: start at p·p and stop at √n.',
    'Write the sieve with a boolean array and count / print primes.',
    'State O(n log log n) time and O(n) space and when a sieve is the right tool.',
  ],
  intuition: [
    p('A **prime** is a number greater than 1 whose only divisors are 1 and itself. To list the primes up to 50 you could test each number — or you can do what Eratosthenes did 2 200 years ago: write the numbers down, and repeatedly cross out multiples.'),
    ol('Write 2, 3, 4, …, n. Nothing is crossed out.', 'Take the first number that is not crossed out (2). It is prime. Cross out its multiples: 4, 6, 8, …', 'Take the next surviving number (3). It is prime. Cross out its multiples 6, 9, 12, …', 'Repeat. Every surviving number is prime.'),
    pre(`
n = 30      2  3  4  5  6  7  8  9 10 11 12 13 14 15 ...
p = 2       2  3  ✗  5  ✗  7  ✗  9  ✗ 11  ✗ 13  ✗ 15 ...
p = 3       2  3     5     7     ✗    11    13     ✗ ...
p = 5       2  3     5     7         11    13       ... (25 crossed; 5·5 = 25 ≤ 30)
`),
    why('**Why start at p·p?** Any multiple p·k with k < p has a smaller prime factor than p (one of the factors of k), so it was already crossed out earlier. **Why stop at √n?** If a composite number m ≤ n had no prime factor ≤ √n, then m would be at least (√n)·(√n) > n — contradiction. So every composite is crossed out by a prime ≤ √n; primes larger than √n have nothing new to cross out.'),
  ],
  syntax: [p('A `boolean[]` of size n+1 is indexed by the number itself: `isPrime[17]` answers "is 17 prime?". Java initialises boolean arrays to `false`, so the program either sets all to `true` first or flips the meaning to `composite[]`.')],
  tiny: [code(`
int n = 20;
boolean[] isPrime = new boolean[n + 1];
for (int i = 2; i <= n; i++) isPrime[i] = true;
for (int p = 2; p * p <= n; p++)
    if (isPrime[p])
        for (int m = p * p; m <= n; m += p)
            isPrime[m] = false;
`)],
  guided: [
    p('Compare with testing each number separately by trial division up to √k:'),
    prog('sieve/TrialDivision.java', 'Simple solution: test each number'),
    prog('sieve/SimpleSieve.java', 'Optimized solution: the sieve'),
    p('Both print the primes up to 50: `2 3 5 7 11 13 17 19 23 29 31 37 41 43 47` (15 primes).'),
  ],
  dryRun: { algo: 'sieve', input: { n: '30' }, caption: 'Primes up to 30: watch each prime cross out its multiples.' },
  programs: [
    {
      file: 'sieve/TrialDivision.java',
      title: 'Trial division',
      role: 'simple',
      description: 'For every number k, test divisors up to √k. Total about n·√n operations.',
      walkthrough: [
        { at: 'if (n < 2)', text: '0 and 1 are not prime by definition.' },
        { at: '(long) d * d <= n', text: 'Only divisors up to √n need testing; casting to long avoids overflow.' },
        { at: 'return false;', text: 'Found a divisor — n is composite. Return immediately.' },
      ],
    },
    {
      file: 'sieve/SimpleSieve.java',
      title: 'Sieve of Eratosthenes',
      role: 'optimized',
      description: 'Crosses out multiples of each surviving prime starting at p·p. O(n log log n).',
      walkthrough: [
        { at: 'isPrime[i] = true;', text: 'Optimistically mark every number prime; crossing out will correct this.' },
        { at: '(long) p * p <= limit', text: 'Only primes up to √limit need to cross out multiples.' },
        { at: 'if (isPrime[p])', text: 'p survived all smaller primes so p is prime. Composite p can be skipped because their multiples were already handled.' },
        { at: 'int m = p * p; m <= limit; m += p', text: 'Smaller multiples were crossed out by smaller primes; stepping by p visits each multiple once.' },
      ],
    },
  ],
  complexity: [
    p('Prime p crosses out about n/p numbers. Summed over primes p ≤ √n that is n·(1/2 + 1/3 + 1/5 + …) = n · log log n (a very slowly growing function: for n = 10⁹ it is about 3).'),
    math('time = O(n log log n)       space = O(n)  (one boolean per number)'),
    table(['n', 'Trial division ≈ n√n', 'Sieve ≈ n log log n'], [['10⁶', '10⁹', '3 × 10⁶'], ['10⁷', '3 × 10¹⁰', '3 × 10⁷']]),
    note('Use a sieve when you need ALL primes up to n, or many primality queries. Use trial division (or Miller–Rabin) when you need to test a single large number. When n is too large for memory but the range is narrow, use the segmented sieve (next lesson).'),
  ],
  mistakes: [
    { title: 'Index out of bounds', wrong: 'boolean[] isPrime = new boolean[limit];\nisPrime[limit] = true;', why: 'A boolean[limit] has indices 0..limit−1. To use the number `limit` itself the size must be limit + 1.', fix: 'new boolean[limit + 1]' },
    { title: 'Starting at 2·p', wrong: 'for (int m = 2 * p; m <= limit; m += p)', why: 'Correct, but does redundant work — those multiples were already crossed out. It does NOT break correctness, only speed (a common beginner version).', fix: 'for (int m = p * p; ...)' },
    { title: 'Counting 0 and 1 as prime', wrong: 'for (int i = 0; i <= limit; i++) if (isPrime[i]) count++;', why: 'With the "all true" initialisation, 0 and 1 stay true unless set to false.', fix: 'Start both the initialisation and the counting loops at 2.' },
  ],
  practice: [
    {
      id: 'sieve-ex1',
      level: 'beginner',
      title: 'Count primes',
      statement: 'Read n and print how many primes are ≤ n.',
      constraints: ['1 ≤ n ≤ 10⁷'],
      examples: [{ input: '100', output: '25' }],
      hints: ['Use a boolean array of size n + 1.', 'Count while you sieve.'],
      solutionFile: 'sieve/Ex1.java',
      solutionExplain: 'Standard sieve; every i not crossed out when reached is prime and is counted, then its multiples are crossed out.',
      tests: [{ stdin: '100\n', stdout: '25' }, { stdin: '1\n', stdout: '0' }, { stdin: '1000000\n', stdout: '78498' }],
    },
    {
      id: 'sieve-ex2',
      level: 'intermediate',
      title: 'The k-th prime',
      statement: 'Read k (1 ≤ k ≤ 100 000) and print the k-th prime (2 is the 1st).',
      examples: [{ input: '1000', output: '7919' }],
      hints: ['How large can the 100 000-th prime be? About 1.3 million.', 'Sieve up to a fixed safe bound and count.'],
      solutionFile: 'sieve/Ex2.java',
      solutionExplain: 'A single sieve to 2 000 000 contains the 100 000th prime (1 299 709); count survivors until the k-th.',
      tests: [{ stdin: '1000\n', stdout: '7919' }, { stdin: '1\n', stdout: '2' }, { stdin: '100000\n', stdout: '1299709' }],
    },
    {
      id: 'sieve-ex3',
      level: 'challenge',
      title: 'Prime factorisation queries',
      statement: 'Read q, then q numbers x (2 ≤ x ≤ 10⁶). For each, print its prime factorisation as `x = p1^e1 * p2^e2` (exponent omitted when 1).',
      examples: [{ input: '3\n12\n97\n360', output: '12 = 2^2 * 3\n97 = 97\n360 = 2^3 * 3^2 * 5' }],
      hints: ['Build an array spf[x] = smallest prime factor with a sieve.', 'Repeatedly divide x by spf[x].'],
      solutionFile: 'sieve/Ex3.java',
      solutionExplain: 'A "smallest prime factor" sieve stores for each number its smallest prime divisor, so every factorisation takes O(log x) steps.',
      tests: [{ stdin: '3\n12\n97\n360\n', stdout: '12 = 2^2 * 3\n97 = 97\n360 = 2^3 * 3^2 * 5' }, { stdin: '2\n2\n1000000\n', stdout: '2 = 2\n1000000 = 2^6 * 5^6' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'In the sieve, why can the outer loop stop at p·p ≤ n?', options: ['Because larger primes are not prime', 'Because every composite ≤ n has a prime factor ≤ √n', 'Because arrays are limited to √n', 'Because p·p is always prime'], answer: 1, explain: 'A composite m = a·b with a ≤ b has a ≤ √m ≤ √n.' },
    { type: 'output', q: 'Which numbers does p = 3 cross out for n = 30 (starting at p·p)?', code: 'for (int m = 9; m <= 30; m += 3) System.out.print(m + " ");', answer: '9 12 15 18 21 24 27 30', explain: 'Multiples of 3 starting from 9.' },
    { type: 'mcq', q: 'Time complexity of the sieve of Eratosthenes?', kind: 'complexity', options: ['O(n)', 'O(n log log n)', 'O(n²)', 'O(n√n)'], answer: 1, explain: 'Σ n/p over primes ≈ n log log n.' },
    { type: 'bug', q: 'This sieve reports no primes at all. Which line is wrong?', code: 'boolean[] isPrime = new boolean[n + 1];\nArrays.fill(isPrime, true);\nfor (int p = 2; p * p <= n; p++)\n    for (int m = p; m <= n; m += p)\n        isPrime[m] = false;', answerLine: 4, explain: 'Starting at m = p crosses out p itself, so every prime is removed. Start at 2·p (or p·p).' },
    { type: 'mcq', q: 'How many primes are there below 50?', options: ['13', '15', '17', '19'], answer: 1, explain: '2 3 5 7 11 13 17 19 23 29 31 37 41 43 47.' },
  ],
  interview: ['Why is the sieve O(n log log n)?', 'How would you reduce the memory of a sieve?', 'Difference between sieve and trial division — when to use which?', 'How do you get the smallest prime factor of every number?'],
  videos: ['a-simple-sieve', 'a-simple-sieve#2'],
  revision: ['isPrime[0..n]=true (except 0,1)', 'for p with p·p ≤ n and isPrime[p]: cross out p·p, p·p+p, …', 'Time O(n log log n), space O(n)', 'Use for "all primes ≤ n" and many queries'],
  sourceNotes: {
    discrepancies: ['The slide walk-through for n = 20 is correct, but its last numbered step is cut off ("11. The rem…"); the final answer is 2 3 5 7 11 13 17 19.'],
  },
});

// ───────────────────────────── Segmented & incremental sieve ─────────────────────────────
export const segmentedSieve: Lesson = lesson({
  id: 'a-segmented-sieve',
  module: 'm5',
  title: 'Segmented & Incremental Sieve',
  summary: 'Find primes inside a window [L, R] with R up to 10¹², or generate primes one at a time with no upper bound.',
  level: 'advanced',
  track: 'archive',
  minutes: 55,
  essential: false,
  prerequisites: ['a-simple-sieve', 'm3-collections-sets-maps'],
  sources: ['Segmented-_-Incremental-Sieve'],
  objectives: [
    'Explain why a simple sieve cannot handle R = 10¹² and how segmenting fixes it.',
    'Implement the segmented sieve: base primes up to √R, then mark multiples inside [L, R].',
    'Handle the tricky parts: first multiple ≥ L, never marking p itself, and L < 2.',
    'Describe an incremental sieve that produces primes one at a time using a map of upcoming composites.',
  ],
  intuition: [
    p('The ordinary sieve needs an array of size n. To find the primes between 10¹² and 10¹² + 10⁶ it would need a trillion cells. But the interval itself is only a million numbers wide. The key fact: **a composite number in [L, R] has a prime factor ≤ √R ≤ 10⁶**. So we only need the small primes up to √R to cross out everything in the window.'),
    ol('Run the simple sieve to get all **base primes** up to √R.', 'Create a small array for the window; cell i stands for the number L + i.', 'For each base prime p find its first multiple inside the window and cross out every p-th cell.', 'The cells never crossed out are the primes in [L, R].'),
    pre(`
window [10, 30], base primes ≤ √30 = 5 →  2, 3, 5

index  0  1  2  3  4  5 ...      number = 10 + index
n     10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
p=2    ✗     ✗     ✗     ✗     ✗     ✗     ✗     ✗     ✗     ✗     ✗
p=3    ·     ✗        ✗     ✗        ✗     ✗        ✗     ✗        ✗
p=5    ✗                 ✗                       ✗                    (10, 15, 20, 25, 30)
primes: 11 13 17 19 23 29
`),
    why('The first multiple of p that is ≥ L is ⌈L/p⌉·p. But we must also never start below p·p: if L ≤ p ≤ R, then p itself lies in the window and must not be crossed out. Starting at max(p·p, ⌈L/p⌉·p) gives both guarantees.'),
    h('Incremental sieve'),
    p('The incremental (a.k.a. unbounded or "rolling") sieve produces **the next prime on demand**, with no limit decided in advance. It keeps a dictionary mapping an upcoming composite number to the list of primes that will cross it out. When the counter reaches a number: if it is in the dictionary it is composite — move each of its primes to the next multiple; if it is not, it is prime and we schedule its square.'),
  ],
  syntax: [p('New Java here: `HashMap<Long, List<Long>>` (a map from a number to a list of numbers), `computeIfAbsent(key, k -> new ArrayList<>())` (get the list, creating it if missing), and `map.remove(key)` which returns the removed value or `null`.')],
  tiny: [code(`
long low = 10, p = 3;
long start = Math.max(p * p, (low + p - 1) / p * p);   // 12: first multiple of 3 that is >= 10
`, '(low + p − 1) / p rounds low/p UP using integer division.')],
  guided: [
    prog('sieve/SegmentedSieve.java', 'Segmented sieve for [L, R]'),
    prog('sieve/IncrementalSieve.java', 'Incremental sieve: next prime on demand'),
  ],
  dryRun: { algo: 'segmented-sieve', input: { low: '10', high: '30' }, caption: 'Window [10, 30]: base primes 2, 3, 5 cross out cells; survivors are prime.' },
  programs: [
    {
      file: 'sieve/SegmentedSieve.java',
      title: 'Segmented sieve',
      role: 'optimized',
      description: 'Simple sieve up to √high, then marks multiples inside the window. Memory O(√high + (high − low)).',
      walkthrough: [
        { at: 'int root = (int) Math.sqrt', text: 'We need base primes up to √high. The two while loops correct floating-point rounding.' },
        { at: 'List<Integer> basePrimes = simpleSieve(root);', text: 'The ordinary sieve from the previous lesson, but returning the primes.' },
        { at: 'new boolean[(int) (high - low + 1)]', text: 'Only the window is stored. Index i represents the number low + i.' },
        { at: 'long start = Math.max', text: 'First multiple ≥ low, but not below p·p so that p itself (if in the window) survives.' },
        { at: 'composite[(int) (m - low)] = true;', text: 'Translate the number m into its array index by subtracting low.' },
        { at: 'Math.max(low, 2)', text: 'Numbers below 2 are not prime, so a window starting at 0 or 1 must skip them.' },
      ],
    },
    {
      file: 'sieve/IncrementalSieve.java',
      title: 'Incremental sieve (assumed from the slide description)',
      role: 'demo',
      description: 'An unbounded generator of primes using a map of upcoming composites. The slide only describes this algorithm in words, so the implementation is inferred.',
      walkthrough: [
        { at: 'composites.remove(candidate)', text: 'If someone scheduled this number, it is composite and the list holds its prime factors seen so far.' },
        { at: 'candidate * candidate', text: 'A new prime p can first cross out p·p (smaller multiples have smaller factors).' },
        { at: 'candidate + p', text: 'Each prime that hit a composite moves on to its next multiple.' },
      ],
    },
  ],
  complexity: [
    p('**Segmented:** base primes cost O(√R log log R). Marking the window costs about (R − L) · log log R. So time ≈ O((R − L) log log R + √R) and space O(√R + (R − L)). For R = 10¹², R − L = 10⁶ this is a few million operations.'),
    p('**Incremental:** each new prime p inserts one map entry; each composite c causes one map move per distinct prime factor. Memory is proportional to the number of primes found up to √(current) — the map keeps only "next composite" per prime.'),
  ],
  mistakes: [
    { title: 'Marking the prime itself', wrong: 'for (long m = (low / p) * p; m <= high; m += p) composite[...] = true;   // slide style', why: 'If low ≤ p (for example low = 2), this crosses out p itself, so 2 is reported as composite.', fix: 'long start = Math.max((long) p * p, (low + p - 1) / p * p);' },
    { title: 'Using int for the window bounds', wrong: 'int low = 1_000_000_000_000;', why: '10¹² is far above Integer.MAX_VALUE (2.1·10⁹): it does not compile; computations on int bounds overflow silently.', fix: 'long low, high;   // but keep the ARRAY index (high − low) as an int' },
    { title: 'Forgetting to initialise (slide)', wrong: 'boolean prime[] = new boolean[h + 1];   // all false, then marks them false again', why: 'The slide\'s array starts as all false and the commented-out Arrays.fill is never run, so the printed result is empty. It also writes `False` (capital F), which does not compile.', fix: 'Use a composite[] array: false means "still possibly prime", so no fill is needed.' },
  ],
  practice: [
    {
      id: 'seg-ex1',
      level: 'beginner',
      title: 'Primes in a small range',
      statement: 'Read L and R (1 ≤ L ≤ R ≤ 10⁶). Print how many primes are in [L, R].',
      examples: [{ input: '10 30', output: '6' }],
      hints: ['A plain sieve up to R is fine here.', 'Count only values ≥ max(L, 2).'],
      solutionFile: 'sieve/Ex4.java',
      solutionExplain: 'This reference solution already uses the segmented method, which also covers small ranges.',
      tests: [{ stdin: '10 30\n', stdout: '6' }, { stdin: '1 1\n', stdout: '0' }, { stdin: '100 130\n', stdout: '6' }],
    },
    {
      id: 'seg-ex2',
      level: 'intermediate',
      title: 'Primes in a huge range',
      statement: 'Read L and R with R ≤ 10¹² and R − L ≤ 10⁶. Print how many primes lie in [L, R].',
      examples: [{ input: '1000000000000 1000000000100', output: '4' }],
      hints: ['The simple sieve cannot allocate 10¹² cells.', 'Base primes up to 10⁶, then window marking.'],
      solutionFile: 'sieve/Ex4.java',
      solutionExplain: 'Segmented sieve: base primes up to √R (≤ 10⁶) and a window array of at most 10⁶ + 1 cells.',
      tests: [{ stdin: '1000000000000 1000000000100\n', stdout: '4' }, { stdin: '2 2\n', stdout: '1' }, { stdin: '999999999900 1000000000000\n', stdout: '4' }],
    },
    {
      id: 'seg-ex3',
      level: 'challenge',
      title: 'Largest prime gap in a window',
      statement: 'Read L and R (R − L ≤ 10⁶, R ≤ 10¹²). Print the largest difference between two consecutive primes in [L, R], or -1 if there are fewer than two primes.',
      examples: [{ input: '1 100', output: '8', explain: '89 and 97 are consecutive primes.' }],
      hints: ['Sieve the window, then scan keeping the previous prime.'],
      solutionFile: 'sieve/Ex5.java',
      solutionExplain: 'After the segmented sieve, one pass over the window tracks the last prime seen and the maximum gap.',
      tests: [{ stdin: '1 100\n', stdout: '8' }, { stdin: '90 96\n', stdout: '-1' }, { stdin: '2 3\n', stdout: '1' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'To sieve [L, R] you need base primes up to…', options: ['R', 'R/2', '√R', 'L'], answer: 2, explain: 'Every composite ≤ R has a prime factor ≤ √R.' },
    { type: 'output', q: 'What is the first multiple of 7 that is ≥ 100 and ≥ 49?', code: 'long low = 100, p = 7;\nSystem.out.println(Math.max(p * p, (low + p - 1) / p * p));', answer: '105', explain: '(100 + 6) / 7 = 15; 15 · 7 = 105.' },
    { type: 'mcq', q: 'Why start marking at max(p·p, first multiple ≥ L)?', options: ['To speed up only', 'To avoid marking p itself and values below p·p', 'Because arrays start at p', 'It makes memory smaller'], answer: 1, explain: 'Smaller multiples were handled by smaller primes; p itself must stay unmarked.' },
    { type: 'mcq', q: 'Which statement describes an incremental sieve?', options: ['Needs the limit up front', 'Produces primes one after another, remembering upcoming composites', 'Only works on [L, R]', 'Uses recursion on array halves'], answer: 1, explain: 'It stores for each upcoming composite the primes that will cross it out.' },
  ],
  interview: ['How do you find primes in [10¹², 10¹² + 10⁶]?', 'Why is √R enough for base primes?', 'What is the memory of a segmented sieve?', 'How does an incremental sieve avoid fixing the upper bound?'],
  videos: ['a-segmented-sieve', 'a-segmented-sieve#2'],
  revision: ['Base primes ≤ √R via simple sieve.', 'window[i] ↔ L + i', 'start = max(p·p, ⌈L/p⌉·p)', 'skip numbers < 2', 'Incremental: map composite → primes crossing it'],
  sourceNotes: {
    discrepancies: [
      'The slide\'s SegSieve does not compile (`False`, a commented Arrays.fill) and, if repaired naively, marks small primes in the window as composite and ignores the p·p optimisation.',
      'The slide\'s array has size h + 1 (memory proportional to R), which defeats the purpose of segmenting.',
    ],
    assumptions: ['The slide describes the incremental sieve only in words ("check N + i using primes up to L"). The lesson implements the standard incremental (dictionary-based) sieve and labels it as such.'],
  },
});
