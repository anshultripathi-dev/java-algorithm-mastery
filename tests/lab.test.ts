import { describe, expect, it } from 'vitest';
import { LAB_ALGORITHMS, LAB_BY_ID } from '../src/features/dry-run-lab/registry';

const run = (id: string, input: Record<string, string>) => LAB_BY_ID[id].run(input);

describe('dry-run lab algorithms produce the same answers as the verified Java programs', () => {
  it('Euclid: gcd(83,19)=1 and gcd(50,12)=2', () => {
    expect(run('euclid-gcd', { a: '83', b: '19' }).result).toBe('gcd = 1');
    expect(run('euclid-gcd', { a: '50', b: '12' }).result).toBe('gcd = 2');
  });
  it("Euler's phi: φ(60)=16, φ(24)=8, φ(97)=96", () => {
    expect(run('euler-phi', { n: '60' }).result).toBe('φ(60) = 16');
    expect(run('euler-phi', { n: '24' }).result).toBe('φ(24) = 8');
    expect(run('euler-phi', { n: '97' }).result).toBe('φ(97) = 96');
  });
  it("Booth: 7×3=21, −3×4=−12, −8×−8=64", () => {
    expect(run('booth', { m: '7', q: '3', bits: '4' }).result).toBe('7 × 3 = 21');
    expect(run('booth', { m: '-3', q: '4', bits: '4' }).result).toBe('-3 × 4 = -12');
    expect(run('booth', { m: '-8', q: '-8', bits: '4' }).result).toBe('-8 × -8 = 64');
  });
  it('Booth matches * for every pair of 4-bit signed numbers', () => {
    for (let m = -8; m <= 7; m++)
      for (let q = -8; q <= 7; q++) {
        expect(run('booth', { m: String(m), q: String(q), bits: '4' }).result).toBe(`${m} × ${q} = ${m * q}`);
      }
  });
  it('sieves find the right primes', () => {
    expect(run('sieve', { n: '30' }).result).toBe('10 primes: 2 3 5 7 11 13 17 19 23 29');
    expect(run('segmented-sieve', { low: '10', high: '30' }).result).toBe('6 primes: 11 13 17 19 23 29');
    expect(run('segmented-sieve', { low: '0', high: '10' }).result).toBe('4 primes: 2 3 5 7');
  });
  it('Josephus matches the slide examples', () => {
    expect(run('josephus', { n: '5', k: '2' }).result).toContain('survivor = 3');
    expect(run('josephus', { n: '7', k: '3' }).result).toContain('survivor = 4');
    expect(run('josephus', { n: '6', k: '2' }).result).toContain('survivor = 5');
  });
  it('bit algorithms', () => {
    expect(run('binary-palindrome', { n: '51' }).result).toContain('is a binary palindrome');
    expect(run('binary-palindrome', { n: '16' }).result).toContain('is not a binary palindrome');
    expect(run('nibble-swap', { n: '172' }).result).toContain('172 → 202');
    expect(run('longest-ones', { n: '478' }).result).toBe('longest run of 1s = 4; after flipping one bit = 8');
    expect(run('longest-ones', { n: '56825' }).result).toBe('longest run of 1s = 6; after flipping one bit = 10');
  });
  it('block swap rotates left', () => {
    expect(run('block-swap', { arr: '1,2,3,4,5,6,7', d: '2' }).result).toBe('[3, 4, 5, 6, 7, 1, 2]');
    expect(run('block-swap', { arr: '6,8,7,9,0,5,1,3,2,4', d: '5' }).result).toBe('[5, 1, 3, 2, 4, 6, 8, 7, 9, 0]');
  });
  it('array algorithms', () => {
    expect(run('leaders', { arr: '16,17,4,3,5,2' }).result).toBe('leaders (left→right): 17 5 2');
    expect(run('majority', { arr: '4,7,4,4,7,4,4,9,4,3' }).result).toBe('majority element = 4');
    expect(run('majority', { arr: '2,1,2,4,7' }).result).toBe('no majority element');
    expect(run('max-product', { arr: '-5,-4,-1,-2' }).result).toBe('maximum product = 40');
    expect(run('equilibrium', { arr: '1,3,5,2,2' }).result).toBe('maximum equilibrium sum = 4');
    expect(run('hourglass', { rows: '4', cols: '4', data: '1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7' }).result).toBe('maximum hourglass sum = 41');
    expect(run('doors', { n: '40' }).result).toBe('6 open doors: 1 4 9 16 25 36');
    expect(run('alice', { needed: '13' }).result).toBe('r = 2, perimeter = 16');
  });
  it('string algorithms', () => {
    expect(run('strobogrammatic', { s: '906' }).result).toContain('IS strobogrammatic');
    expect(run('strobogrammatic', { s: '25' }).result).toContain('NOT');
    expect(run('lex-palindrome', { s: 'malayalam' }).result).toBe('aalmymlaa');
    expect(run('lex-palindrome', { s: 'apple' }).result).toBe('no palindromic string');
    expect(run('manacher', { s: 'abaxabaxabb' }).result).toContain('baxabaxab');
  });
  it('recursion and backtracking algorithms', () => {
    expect(run('paths', { m: '4', n: '5' }).result).toBe('35 paths');
    expect(run('permutations', { s: 'AAB' }).result).toBe('3 distinct permutations');
    expect(run('nqueens', { n: '4' }).result).toBe('solution (column per row): 2 4 1 3');
    expect(run('maze', { grid: '1000,1101,0100,1111' }).result).toBe('path found');
    expect(run('hamiltonian', { matrix: '01010,10111,01001,11001,01110' }).result).toBe('Hamiltonian cycle: 0 → 1 → 2 → 4 → 3 → 0');
    expect(run('hamiltonian', { matrix: '01010,10111,01001,11000,01100' }).result).toBe('Solution does not exist');
    expect(run('knights-tour', { n: '8', x: '0', y: '0' }).result).toBe('tour completed: all 64 squares visited');
  });
  it('sorting algorithms', () => {
    expect(run('selection-sort', { arr: '64,25,12,22,11' }).result).toContain('[11, 12, 22, 25, 64]');
    expect(run('quick-sort', { arr: '8,3,1,7,0,10,2' }).result).toBe('[0, 1, 2, 3, 7, 8, 10]');
  });
  it('every algorithm handles bad input without throwing', () => {
    for (const a of LAB_ALGORITHMS) {
      const bad = Object.fromEntries(a.inputs.map((i) => [i.key, 'zzz']));
      expect(() => a.run(bad)).not.toThrow();
    }
  });
  it('default inputs of every algorithm are valid and produce steps', () => {
    for (const a of LAB_ALGORITHMS) {
      const r = a.run(Object.fromEntries(a.inputs.map((i) => [i.key, i.default])));
      expect(r.error, a.id).toBeUndefined();
      expect(r.steps.length, a.id).toBeGreaterThan(0);
    }
  });
});

describe('foundation lab algorithms (hand-checked values)', () => {
  it('loop with continue: odd numbers up to 8 sum to 16', () => {
    expect(run('loop-trace', { n: '8' }).result).toBe('sum = 16');
  });
  it('else-if ladder grades', () => {
    expect(run('grade-ladder', { score: '72' }).result).toBe('grade = C');
    expect(run('grade-ladder', { score: '95' }).result).toBe('grade = A');
    expect(run('grade-ladder', { score: '10' }).result).toBe('grade = F');
    expect(run('grade-ladder', { score: '90' }).result).toBe('grade = A');
  });
  it('byte overflow: 120 + 5×8 wraps to −96', () => {
    expect(run('byte-overflow', { start: '120', add: '5' }).result).toBe('b = -96');
  });
  it('array scan keeps the FIRST maximum on ties', () => {
    expect(run('array-scan', { arr: '7,3,9,4,9,2' }).result).toBe('max = 9 at index 2');
  });
  it('matrix diagonal of 1..16 is 34', () => {
    expect(run('matrix-rows', { n: '4' }).result).toBe('diagonal sum = 34');
  });
  it('two-pointer reversal', () => {
    expect(run('reverse-chars', { s: 'racecar1' }).result).toBe('1racecar');
    expect(run('reverse-chars', { s: 'ab' }).result).toBe('ba');
  });
  it('factorial stack depth and value', () => {
    const r = run('factorial-stack', { n: '4' });
    expect(r.result).toBe('4! = 24');
    expect(Math.max(...r.steps.map((s) => s.arrays![0].values.length))).toBe(4);
  });
  it('stack vs queue removal order', () => {
    expect(run('stack-queue', { ops: 'a b c - - d -' }).result).toBe('removed (stack/queue): c/a, b/b, d/c');
  });
  it('list reversal flips every link', () => {
    const r = run('list-reverse', { arr: '1,2,3,4,5' });
    expect(r.result).toBe('5 → 4 → 3 → 2 → 1');
    const last = r.steps[r.steps.length - 1].arrays![0].values;
    expect(last).toEqual(['1→∅', '2→1', '3→2', '4→3', '5→4']);
  });
  it('BFS order and distance', () => {
    const r = run('bfs', { edges: '0-1,0-2,1-3,2-3,3-4', start: '0' });
    expect(r.result).toBe('visit order: 0 1 2 3 4');
    expect(r.steps[r.steps.length - 1].arrays![0].values).toEqual([0, 1, 1, 2, 3]);
  });
  it('binary search finds 23 in 3 probes and reports a miss', () => {
    expect(run('binary-search', { arr: '2,5,8,12,16,23,38,56,72,91', target: '23' }).result).toBe('found at index 5 after 3 probe(s)');
    expect(run('binary-search', { arr: '2,5,8,12', target: '9' }).result).toMatch(/^not found/);
    expect(run('binary-search', { arr: '3,1,2', target: '1' }).error).toBeDefined();
  });
  it('insertion sort counts', () => {
    expect(run('insertion-sort', { arr: '5,2,4,6,1,3' }).result).toBe('[1, 2, 3, 4, 5, 6] — 12 comparisons, 9 shifts');
  });
  it('bubble sort swaps equal the number of inversions (4)', () => {
    expect(run('bubble-sort', { arr: '5,1,4,2,8' }).result).toBe('[1, 2, 4, 5, 8] — 4 swaps');
  });
  it('merge sort sorts arbitrary arrays', () => {
    for (const a of ['38,27,43,3,9,82,10', '1', '5,5,5', '9,8,7,6,5,4,3,2,1', '-3,0,-3,2']) {
      const sorted = a.split(',').map(Number).sort((x, y) => x - y);
      expect(run('merge-sort', { arr: a }).result.startsWith(`[${sorted.join(', ')}]`)).toBe(true);
    }
  });
  it('memoised fib(7) = 13 with exactly 13 calls', () => {
    expect(run('fib-memo', { n: '7' }).result).toMatch(/^fib\(7\) = 13 using 13 calls/);
  });
  it('coin DP beats greedy for {4,3,1} → 6', () => {
    expect(run('coin-dp', { coins: '4,3,1', amount: '6' }).result).toBe('2 coin(s) (greedy would use 3)');
    expect(run('coin-dp', { coins: '2', amount: '3' }).result).toMatch(/^impossible/);
  });
  it('nested loop counts', () => {
    expect(run('nested-count', { n: '6', mode: '1' }).result).toMatch(/^count = 21 /);
    expect(run('nested-count', { n: '6', mode: '2' }).result).toMatch(/^count = 36 /);
    expect(run('nested-count', { n: '8', mode: '3' }).result).toMatch(/^count = 32 /);
  });
  it('all lab algorithms reject nonsense input with an error, not an exception', () => {
    for (const a of LAB_ALGORITHMS) {
      const bad = Object.fromEntries(a.inputs.map((i) => [i.key, 'zzz']));
      expect(() => a.run(bad)).not.toThrow();
    }
  });
});

describe('second batch of foundation lab algorithms (hand-checked, and Karatsuba vs the Java program)', () => {
  const res = (id: string, input: Record<string, string>) => run(id, input).result;
  it('Module 0', () => {
    expect(res('jvm-pipeline', { cls: 'Hello', msg: 'Hi' })).toBe('console shows: Hi');
    expect(run('jvm-pipeline', { cls: '1bad', msg: 'x' }).error).toBeDefined();
    const sh = run('stack-heap', { x: '7', y: '8' });
    expect(sh.steps[3].arrays![1].values).toEqual(['#1 int[] {99, 8}']);
    expect(sh.steps[5].arrays![1].values[0]).toBe('#1 int[] {}');
    expect(res('setup-check', { jdk: '21' })).toMatch(/^Ready/);
    expect(res('setup-check', { jdk: '11' })).toMatch(/older than 17/);
    expect(res('print-buffer', { words: 'A,B,C,D' })).toBe('ABC ⏎ D');
    expect(res('error-kinds', { kind: '3' })).toContain('prints 20 instead of 15');
    expect(res('error-kinds', { kind: '1' })).toMatch(/compile-time/);
    expect(res('error-kinds', { kind: '2' })).toMatch(/ArrayIndexOutOfBounds/);
  });
  it('Module 1', () => {
    expect(res('swap-temp', { a: '3', b: '8' })).toBe('a = 8, b = 3');
    expect(res('expr-eval', { expr: '7 + 3 * 2 - 8 / 3 % 2' })).toBe('13');
    expect(res('expr-eval', { expr: '(2 + 3) * 4 - -6 / 4' })).toBe('21');
    expect(res('expr-eval', { expr: '-7 % 3' })).toBe('-1');
    expect(res('expr-eval', { expr: '10 / 0' })).toMatch(/ArithmeticException/);
    expect(res('expr-eval', { expr: '999999999 * 3' })).toBe('-1294967299');
    expect(run('expr-eval', { expr: '2 +' }).error).toBeDefined();
    expect(res('logic-eval', { x: '0', y: '10', z: '5' })).toBe('r = true, s = yes');
    expect(res('logic-eval', { x: '5', y: '10', z: '1' })).toBe('r = false, s = no');
    expect(res('logic-eval', { x: '2', y: '10', z: '1' })).toBe('r = true, s = yes');
    expect(res('bit-ops', { a: '12', b: '10', k: '2' })).toBe('a & b = 8, a | b = 14, a ^ b = 6, ~a = -13, a << 2 = 48, a >> 2 = 3');
    expect(res('printf-fmt', { name: 'Pen', price: '2.5', qty: '7' })).toBe('Pen·····|····2.50|0007   (· = space)');
    expect(res('printf-fmt', { name: 'x', price: '2.675', qty: '1' })).toContain('2.68');
    expect(res('printf-fmt', { name: 'x', price: '1.005', qty: '1' })).toContain('1.01');
    expect(res('scanner-tokens', { text: '12 7|Alice Smith|', calls: 'nextInt,nextInt,nextLine,nextLine' })).toBe('nextInt() → "12"   nextInt() → "7"   nextLine() → ""   nextLine() → "Alice Smith"');
    expect(res('scanner-tokens', { text: 'abc', calls: 'nextInt' })).toBe('InputMismatchException');
    expect(res('call-stack-trace', { a: '4', b: '9', c: '6' })).toBe('max3(4, 9, 6) = 9');
    expect(res('trace-table', { arr: '2,7,4,9,6' })).toBe('buggy count = 2, correct = 3 → off-by-one at the loop start');
  });
  it('Module 2', () => {
    expect(res('to-binary', { n: '45' })).toBe('45 = 00101101 (8 bits)');
    expect(res('to-binary', { n: '-45' })).toBe("-45 = 11010011 (8-bit two's complement)");
    expect(res('to-binary', { n: '0' })).toBe('0 = 00000000 (8 bits)');
    expect(res('to-binary', { n: '-128' })).toBe("-128 = 10000000 (8-bit two's complement)");
    expect(res('prime-trial', { n: '91' })).toBe('91 is composite: 7 × 13 (found after 6 tests)');
    expect(res('prime-trial', { n: '97' })).toBe('97 is prime (8 tests instead of 95)');
    expect(res('prime-trial', { n: '2' })).toMatch(/prime/);
    expect(res('pass-by-value', { n: '5', first: '1' })).toBe('n stays 5; a[0] became 99 (the object was shared)');
    expect(res('bounds-check', { arr: '3,1,4,1,5', mode: '1' })).toBe('sum = 14');
    expect(res('bounds-check', { arr: '3,1,4,1,5', mode: '2' })).toContain('(index 5, length 5) after summing 14');
  });
  it('Module 3', () => {
    expect(res('object-creation', { name: 'Ana', age: '20' })).toContain('== 21');
    expect(res('access-check', { modifier: 'private', caller: 'same-package' })).toMatch(/not accessible/);
    expect(res('access-check', { modifier: 'protected', caller: 'subclass' })).toBe('access allowed');
    expect(res('access-check', { modifier: 'default', caller: 'same-package' })).toBe('access allowed');
    expect(res('access-check', { modifier: 'public', caller: 'other' })).toBe('access allowed');
    expect(res('dynamic-dispatch', { cls: 'Puppy' })).toBe('prints Woof');
    expect(res('dynamic-dispatch', { cls: 'Cat' })).toBe('prints Meow');
    expect(res('dynamic-dispatch', { cls: 'Animal' })).toBe('prints ...');
    expect(res('interface-check', { impl: 'area,perimeter', abs: 'no' })).toBe('compile-time error: name() missing');
    expect(res('interface-check', { impl: 'area,perimeter,name', abs: 'no' })).toMatch(/^compiles/);
    expect(res('interface-check', { impl: 'area', abs: 'yes' })).toMatch(/abstract class/);
    expect(res('init-order', { n: '2' })).toBe('static block → main starts → instance block → constructor, count=1 → instance block → constructor, count=2');
    expect(res('import-resolve', { imports: 'java.util.*', name: 'List' })).toBe('resolved: java.util.List');
    expect(res('import-resolve', { imports: '', name: 'List' })).toBe('cannot find symbol: add   import java.util.List;');
    expect(res('import-resolve', { imports: '', name: 'String' })).toMatch(/java\.lang\.String/);
    expect(res('import-resolve', { imports: 'java.util.List', name: 'List' })).toBe('resolved: java.util.List');
    expect(res('import-resolve', { imports: 'java.util.*', name: 'Foo' })).toBe('cannot find symbol: class Foo');
    expect(res('exception-flow', { d: '0', idx: '1' })).toBe('math → cleanup → after');
    expect(res('exception-flow', { d: '5', idx: '1' })).toBe('stored → cleanup → after');
    expect(res('exception-flow', { d: '5', idx: '7' })).toBe('index → cleanup → after');
    expect(res('arraylist-ops', { cap: '4', ops: 'add 5,add 7,add 9,add 2,add 8,add@0 1,remove@2' })).toBe('[1, 5, 9, 2, 8] — size 5, capacity 6');
    expect(run('arraylist-ops', { cap: '4', ops: 'remove@3' }).error).toBeDefined();
    const hb = run('hash-buckets', { keys: 'cat,dog,bird,emu,ant,cow,dog' });
    expect(hb.steps[0].note).toContain('hashCode = 98262');
    expect(hb.steps[0].note).toContain('index = 98263 & 15 = 7');
    expect(hb.result).toMatch(/^size 6;.* 1 duplicate ignored$/);
    expect(res('comparator-sort', { words: 'pear,fig,apple,kiwi,plum', mode: '2' })).toBe('fig, kiwi, pear, plum, apple');
    expect(res('comparator-sort', { words: 'pear,fig,apple,kiwi,plum', mode: '1' })).toBe('apple, fig, kiwi, pear, plum');
    expect(res('comparator-sort', { words: 'pear,fig,apple,kiwi,plum', mode: '3' })).toBe('plum, pear, kiwi, fig, apple');
    expect(res('hashset-equals', { mode: '1', pts: '1:2,1:2,3:4' })).toBe('size = 2');
    expect(res('hashset-equals', { mode: '2', pts: '1:2,1:2,3:4' })).toMatch(/^size = 3/);
    expect(res('hashset-equals', { mode: '3', pts: '1:2,1:2,3:4' })).toMatch(/^size = 3/);
  });
  it('Module 4', () => {
    expect(res('growth-table', { max: '16' })).toBe('at n = 16: n² = 256 but 2ⁿ = 65536');
    expect(res('recurrence-levels', { a: '2', b: '2', n: '16' })).toMatch(/^80 operations — Θ\(n log n\)/);
    expect(res('recurrence-levels', { a: '3', b: '2', n: '8' })).toMatch(/^65 operations — Θ\(n\^1\.58/);
    expect(res('recurrence-levels', { a: '2', b: '4', n: '16' })).toMatch(/Θ\(n\)/);
    expect(res('stack-depth', { n: '6', mode: '1' })).toBe('result 21; maximum depth 7 → O(n): 7 frames for n = 6');
    expect(res('stack-depth', { n: '1024', mode: '2' })).toContain('maximum depth 11');
    expect(res('search-cases', { arr: '8,3,5,9,1' })).toBe('best 1, average 3, worst 5 comparisons');
    expect(run('search-cases', { arr: '1,1,2' }).error).toBeDefined();
  });
  it('Archive', () => {
    expect(res('crt-sieve', { pairs: '2:3,3:5,2:7' })).toBe('x = 23 (repeats every 105)');
    expect(res('crt-sieve', { pairs: '1:2,0:4' })).toBe('no solution');
    expect(res('pascal-ncr', { n: '6', r: '2' })).toBe('6C2 = 15');
    expect(res('pascal-ncr', { n: '10', r: '5' })).toBe('10C5 = 252');
    expect(res('pascal-ncr', { n: '7', r: '7' })).toBe('7C7 = 1');
    // Karatsuba: same product and the same number of single-digit multiplications as the verified Java program
    expect(res('karatsuba-trace', { x: '1234', y: '5678' })).toBe('1234 × 5678 = 7006652 (matches *), 11 single-digit multiplications');
    expect(res('karatsuba-trace', { x: '99999', y: '99999' })).toBe('99999 × 99999 = 9999800001 (matches *), 33 single-digit multiplications');
    expect(res('karatsuba-trace', { x: '12', y: '3456' })).toBe('12 × 3456 = 41472 (matches *), 7 single-digit multiplications');
    expect(res('weighted-string', { w: '100' })).toBe('ABCCCD (6 letters)');
    expect(res('weighted-string', { w: '1' })).toBe('A (1 letter)');
    expect(res('hyphen-partition', { s: 'ab-c-d-ef' })).toBe('---abcdef');
    expect(res('hyphen-partition', { s: 'abc' })).toBe('abc');
    expect(res('hyphen-partition', { s: '-a' })).toBe('-a');
    expect(res('hyphen-partition', { s: 'a-' })).toBe('-a');
    expect(res('natural-compare', { a: 'file10.txt', b: 'file9.txt' })).toBe('"file9.txt" comes before "file10.txt" (natural order)');
    expect(res('natural-compare', { a: 'img2', b: 'img2' })).toBe('equal');
    expect(res('natural-compare', { a: 'a', b: 'a1' })).toBe('"a" comes before "a1" (natural order)');
  });
  it('every lesson that references a dry run uses valid default input', () => {
    for (const a of LAB_ALGORITHMS) expect(a.run(Object.fromEntries(a.inputs.map((i) => [i.key, i.default]))).error, a.id).toBeUndefined();
  });
});
