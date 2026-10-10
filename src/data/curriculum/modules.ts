import type { ModuleInfo } from '@/lib/types';

export const MODULES: ModuleInfo[] = [
  { id: 'm0', title: 'Programming & Java Setup', tagline: 'How Java runs, installing it, your first program', description: 'What programming is, how source code becomes bytecode and runs on the JVM, installing the JDK on macOS, running from an IDE and the terminal, and the three kinds of errors.' },
  { id: 'm1', title: 'Java Syntax & Fundamentals', tagline: 'Variables, operators, input/output, control flow, methods', description: 'Everything you need to read and write simple Java programs: data types, casting and overflow, every operator family, Scanner input, if/switch, loops, methods, and how to trace and debug.' },
  { id: 'm2', title: 'Core Programming Skills', tagline: 'Arrays, strings, binary numbers, math, recursion, memory', description: 'The building blocks of every algorithm: one- and two-dimensional arrays, strings and StringBuilder, number systems, GCD/primes/modular arithmetic, recursion, references, and writing robust code.' },
  { id: 'm3', title: 'Object-Oriented Programming', tagline: 'Classes, interfaces, exceptions, collections, comparators', description: 'Classes and objects, encapsulation, inheritance, polymorphism, abstraction, interfaces, static/final, packages, exceptions, generics, the Java Collections Framework and sorting with comparators.' },
  { id: 'm4', title: 'Data Structures & Algorithm Foundations', tagline: 'Structures, searching, sorting, paradigms, Big-O', description: 'The data structures behind the problems, linear and binary search, elementary sorting, iteration vs recursion, algorithm paradigms, and time/space complexity analysis.' },
  { id: 'm5', title: 'Archive Algorithm Mastery', tagline: 'Every algorithm and problem from your course slides', description: 'One full lesson for each algorithm and programming problem in your course archive — numbers and bits, arrays and matrices, strings, recursion and backtracking, and sorting — with naive and optimized solutions, dry runs, practice and quizzes.' },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m]));

export const TRACK_LABEL: Record<string, string> = {
  syntax: 'Essential Java syntax',
  core: 'Core programming & data structures',
  archive: 'Archive algorithm knowledge',
  enrichment: 'Optional enrichment',
};
