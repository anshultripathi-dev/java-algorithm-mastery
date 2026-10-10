import type { Lesson } from '@/lib/types';
import { euclidGcd } from './a-numbers-1';
import { eulerPhi, crt, combination, karatsuba, booth, simpleSieve, segmentedSieve } from './a-numbers-2';
import { binaryPalindrome, nibbleSwap, longestOnes, josephus } from './a-bits';
import { blockSwap, leaders, majority, maxProduct, equilibrium, hourglass, toggleDoors, aliceApple, weightedSubstring } from './a-arrays';
import { moveHyphen, strobogrammatic, lexPalindrome, manacher, naturalSort } from './a-strings';
import { gridPaths, permutations, nQueens, maze, hamiltonian, knightsTour } from './a-recursion';
import { selectionSort, quickSort } from './a-sorting';
import { howJavaWorks, javaLandscape, installMac, firstProgram, errors, introAlgorithms } from './m0';
import { variablesTypes, conversion, arithmeticOps, logicalOps, bitwiseOps, outputPrinting, inputScanner, ifElseSwitch, loops, methods, debugging } from './m1';
import { arrays1d, arrays2d, strings, numberSystems, mathBasics, recursion, references, boundaries } from './m2';
import { classesObjects, encapsulation, inheritance, abstraction, staticFinal, packagesImports, exceptions, collectionsLists, collectionsSetsMaps, collectionsQueues, sortingComparators, equalsHashCode } from './m3';
import { dsOverview, treesGraphsHeaps, searching, sortingElementary, mergeSort, iterationVsRecursion, paradigms, complexityIntro, complexityLoops, complexityRecursion, spaceComplexity, bestAvgWorst } from './m4';

/** Every lesson, in curriculum order (module order, then teaching order). */
const AUTHORED: Lesson[] = [
  // ── Module 0: orientation
  howJavaWorks, javaLandscape, installMac, firstProgram, errors, introAlgorithms,
  // ── Module 1: syntax
  variablesTypes, conversion, arithmeticOps, logicalOps, bitwiseOps, outputPrinting, inputScanner, ifElseSwitch, loops, methods, debugging,
  // ── Module 2: core skills
  arrays1d, arrays2d, strings, numberSystems, mathBasics, recursion, references, boundaries,
  // ── Module 3: OOP and the standard library
  classesObjects, encapsulation, inheritance, abstraction, staticFinal, packagesImports, exceptions,
  collectionsLists, collectionsSetsMaps, collectionsQueues, sortingComparators, equalsHashCode,
  // ── Module 4: data structures, algorithm foundations and complexity
  dsOverview, treesGraphsHeaps, searching, sortingElementary, mergeSort, iterationVsRecursion, paradigms,
  complexityIntro, complexityLoops, complexityRecursion, spaceComplexity, bestAvgWorst,
  // ── Module 5: archive algorithms
  // numbers
  euclidGcd, eulerPhi, crt, combination, karatsuba, booth, simpleSieve, segmentedSieve,
  // bits
  binaryPalindrome, nibbleSwap, longestOnes, josephus,
  // arrays & matrices
  blockSwap, leaders, majority, maxProduct, equilibrium, hourglass, toggleDoors, aliceApple, weightedSubstring,
  // strings
  moveHyphen, strobogrammatic, lexPalindrome, manacher, naturalSort,
  // recursion & backtracking
  gridPaths, permutations, nQueens, maze, hamiltonian, knightsTour,
  // sorting
  selectionSort, quickSort,
];

/**
 * Keep the authored order, but never list a lesson before its prerequisites
 * (stable depth-first topological sort), so "next lesson" and study plans are always valid.
 */
function orderByPrerequisites(lessons: Lesson[]): Lesson[] {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const done = new Set<string>();
  const out: Lesson[] = [];
  const visit = (l: Lesson, trail: string[]) => {
    if (done.has(l.id)) return;
    if (trail.includes(l.id)) throw new Error(`Prerequisite cycle: ${[...trail, l.id].join(' → ')}`);
    for (const p of l.prerequisites) {
      const d = byId.get(p);
      if (d) visit(d, [...trail, l.id]);
    }
    done.add(l.id);
    out.push(l);
  };
  lessons.forEach((l) => visit(l, []));
  return out;
}

export const LESSONS: Lesson[] = orderByPrerequisites(AUTHORED);

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
