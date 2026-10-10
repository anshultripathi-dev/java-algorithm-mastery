import type { LabAlgorithm } from './types';
import { euclidGcd } from './algorithms/euclidGcd';
import { eulerPhi } from './algorithms/eulerPhi';
import { booth } from './algorithms/booth';
import { sieve } from './algorithms/sieve';
import { segmentedSieve } from './algorithms/segmentedSieve';
import { binaryPalindrome, nibbleSwap, longestOnes, josephus, blockSwap } from './algorithms/bitsAlgos';
import { leaders, majority, maxProduct, equilibrium, hourglass, doors, alice } from './algorithms/arrayAlgos';
import { strobogrammatic, lexPalindrome, manacher } from './algorithms/stringAlgos';
import { paths, permutations, nQueens, maze, hamiltonian, knightsTour } from './algorithms/recursionAlgos';
import { selectionSort, quickSort } from './algorithms/sortAlgos';
import {
  loopTrace, gradeLadder, byteOverflow, arrayScan, matrixRows, reverseChars, factorialStack, stackQueue,
  listReverse, bfs, binarySearch, insertionSort, bubbleSort, mergeSort, fibMemo, coinDp, nestedCount,
} from './algorithms/foundationAlgos';
import {
  jvmPipeline, stackHeap, setupCheck, printBuffer, errorKinds, swapTemp, exprEval, logicEval, bitOps, printfFmt,
  scannerTokens, callStackTrace, traceTable, toBinary, primeTrial, passByValue, boundsCheck,
} from './algorithms/foundationAlgos2';
import {
  objectCreation, accessCheck, dynamicDispatch, interfaceCheck, initOrder, importResolve, exceptionFlow, arraylistOps,
  hashBuckets, comparatorSort, hashsetEquals, growthTable, recurrenceLevels, stackDepth, searchCases, crtSieve,
  pascalNcr, karatsubaTrace, weightedString, hyphenPartition, naturalCompare,
} from './algorithms/foundationAlgos3';

export const LAB_ALGORITHMS: LabAlgorithm[] = [
  // foundations (modules 1–4)
  loopTrace, gradeLadder, byteOverflow, arrayScan, matrixRows, reverseChars, factorialStack, stackQueue,
  listReverse, bfs, binarySearch, insertionSort, bubbleSort, mergeSort, fibMemo, coinDp, nestedCount,
  jvmPipeline, stackHeap, setupCheck, printBuffer, errorKinds, swapTemp, exprEval, logicEval, bitOps, printfFmt,
  scannerTokens, callStackTrace, traceTable, toBinary, primeTrial, passByValue, boundsCheck,
  objectCreation, accessCheck, dynamicDispatch, interfaceCheck, initOrder, importResolve, exceptionFlow, arraylistOps,
  hashBuckets, comparatorSort, hashsetEquals, growthTable, recurrenceLevels, stackDepth, searchCases, crtSieve,
  pascalNcr, karatsubaTrace, weightedString, hyphenPartition, naturalCompare,
  // archive algorithms (module 5)
  euclidGcd, eulerPhi, booth, sieve, segmentedSieve,
  binaryPalindrome, nibbleSwap, longestOnes, josephus, blockSwap,
  leaders, majority, maxProduct, equilibrium, hourglass, doors, alice,
  strobogrammatic, lexPalindrome, manacher,
  paths, permutations, nQueens, maze, hamiltonian, knightsTour,
  selectionSort, quickSort,
];
export const LAB_BY_ID: Record<string, LabAlgorithm> = Object.fromEntries(LAB_ALGORITHMS.map((a) => [a.id, a]));
