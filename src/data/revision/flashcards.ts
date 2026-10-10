import type { Flashcard } from '@/lib/types';
import { LESSONS } from '@/data/lessons';
import { stripInline } from '@/lib/inline';

/** Hand-written cards for the ideas that are easiest to forget. */
const CUSTOM: Flashcard[] = [
  { id: 'c-1', front: 'Which operator gives the remainder in Java?', back: '`%` — e.g. 17 % 5 = 2. The result takes the sign of the left operand: -7 % 3 = -1.' },
  { id: 'c-2', front: 'Why is `7 / 2` equal to 3 in Java?', back: 'Both operands are int, so Java performs integer division and drops the fraction. Use `7 / 2.0` for 3.5.' },
  { id: 'c-3', front: 'How do you compare two Strings by content?', back: '`a.equals(b)` — `==` compares references, not characters.' },
  { id: 'c-4', front: 'What does `i++` vs `++i` do inside an expression?', back: '`i++` yields the OLD value then increments; `++i` increments first and yields the new value.' },
  { id: 'c-5', front: 'int overflow: what is Integer.MAX_VALUE + 1?', back: 'Integer.MIN_VALUE (−2 147 483 648). Java integers wrap around silently.' },
  { id: 'c-6', front: 'What must every recursive method have?', back: 'A base case that stops the recursion, and a recursive step that moves toward it.' },
  { id: 'c-7', front: 'Pass-by-value for objects: what is copied?', back: 'The reference (the address). The called method can change the object, but cannot make the caller’s variable point to a different object.' },
  { id: 'c-8', front: 'Difference between == and equals() for Integer objects?', back: '`==` compares references (cached only for −128..127); `equals` compares values. Prefer equals.' },
  { id: 'c-9', front: 'What does a `break` do inside a switch?', back: 'Leaves the switch. Without it, execution falls through into the next case.' },
  { id: 'c-10', front: 'How do you get the last digit and drop the last digit of n?', back: 'Last digit: `n % 10`. Drop it: `n / 10`.' },
  { id: 'c-11', front: 'Stable vs unstable sorting?', back: 'A stable sort keeps equal elements in their original relative order (merge sort, insertion sort). Quick sort and selection sort are not stable.' },
  { id: 'c-12', front: 'What does “in-place” mean?', back: 'The algorithm uses O(1) extra memory beyond the input (it rearranges elements within the array).' },
  { id: 'c-13', front: 'Big-O vs Big-Omega vs Big-Theta?', back: 'O = upper bound (at most), Ω = lower bound (at least), Θ = tight bound (both).' },
  { id: 'c-14', front: 'Auxiliary space vs space complexity?', back: 'Auxiliary = extra temporary memory. Space complexity = auxiliary + the input itself.' },
  { id: 'c-15', front: 'Backtracking template?', back: 'choose → explore (recurse) → un-choose. Undo the choice so the next option starts from a clean state.' },
  { id: 'c-16', front: 'x & (x − 1) does what?', back: 'Clears the lowest set bit. x is a power of two exactly when x > 0 and x & (x−1) == 0.' },
  { id: 'c-17', front: 'Arithmetic vs logical right shift?', back: '`>>` copies the sign bit (divides negatives correctly); `>>>` always shifts in 0.' },
  { id: 'c-18', front: 'Two’s complement: how do you negate?', back: 'Flip every bit and add 1. −x = ~x + 1.' },
];

export function allFlashcards(): Flashcard[] {
  const auto: Flashcard[] = [];
  for (const l of LESSONS) {
    l.revision.forEach((r, i) => {
      auto.push({ id: `rev-${l.id}-${i}`, lesson: l.id, front: `${l.title}: recall this key fact (#${i + 1}) from memory`, back: stripInline(r) });
    });
    l.quiz.forEach((q, i) => {
      if (q.type === 'mcq' && !q.code) auto.push({ id: `q-${l.id}-${i}`, lesson: l.id, front: stripInline(q.q), back: `${stripInline(q.options[q.answer])} — ${stripInline(q.explain)}` });
      if (q.type === 'output') auto.push({ id: `q-${l.id}-${i}`, lesson: l.id, front: `${stripInline(q.q)}\n\n${q.code}`, back: `${q.answer} — ${stripInline(q.explain)}` });
    });
  }
  return [...CUSTOM, ...auto];
}
