# Curriculum map

Modules in learning order. *Essential* lessons form the minimum-viable path.

- **83 lessons**, about **55.9 hours** of reading (36.2 h on the minimum-viable path of 55 lessons), plus practice time.

## M0 · Programming & Java Setup

What programming is, how source code becomes bytecode and runs on the JVM, installing the JDK on macOS, running from an IDE and the terminal, and the three kinds of errors.

| Lesson | Level | Track | Min | Essential | Needs | Exercises | Quiz |
|---|---|---|---:|:-:|---|---:|---:|
| `m0-how-java-works` How Java Works: Source, Bytecode, JVM, JRE, JDK | beginner | Essential Java syntax | 25 | ✓ | — | 1 | 4 |
| `m0-java-landscape` The Java Landscape: History, Features, Editions, JVM Memory | beginner | Essential Java syntax | 25 | – | `m0-how-java-works` | 1 | 4 |
| `m0-install-mac` Installing Java on macOS and Choosing an Editor | beginner | Essential Java syntax | 30 | ✓ | `m0-how-java-works` | 1 | 4 |
| `m0-first-program` Your First Program: class, main, statements, comments | beginner | Essential Java syntax | 35 | ✓ | `m0-install-mac` | 3 | 5 |
| `m0-errors` Compile-time, Runtime and Logic Errors | beginner | Essential Java syntax | 30 | ✓ | `m0-first-program` | 2 | 5 |
| `m0-intro-algorithms` What Is an Algorithm? | beginner | Core programming & data structures | 30 | ✓ | `m0-first-program` | 3 | 4 |

## M1 · Java Syntax & Fundamentals

Everything you need to read and write simple Java programs: data types, casting and overflow, every operator family, Scanner input, if/switch, loops, methods, and how to trace and debug.

| Lesson | Level | Track | Min | Essential | Needs | Exercises | Quiz |
|---|---|---|---:|:-:|---|---:|---:|
| `m1-variables-types` Variables, Constants and Primitive Types | beginner | Essential Java syntax | 35 | ✓ | `m0-first-program` | 3 | 5 |
| `m1-conversion-casting-overflow` Type Conversion, Casting and Overflow | beginner | Essential Java syntax | 35 | ✓ | `m1-variables-types` | 3 | 5 |
| `m1-operators-arithmetic` Arithmetic, Assignment and Increment Operators | beginner | Essential Java syntax | 30 | ✓ | `m1-conversion-casting-overflow` | 3 | 5 |
| `m1-operators-logical-ternary` Relational, Logical and Ternary Operators; Precedence | beginner | Essential Java syntax | 30 | ✓ | `m1-operators-arithmetic` | 3 | 5 |
| `m1-operators-bitwise` Bitwise Operators and Shifts | intermediate | Essential Java syntax | 40 | ✓ | `m1-operators-logical-ternary` | 3 | 5 |
| `m1-output-printing` Output: print, println, printf and String Concatenation | beginner | Essential Java syntax | 30 | ✓ | `m1-operators-arithmetic` | 3 | 5 |
| `m1-input-scanner` Input: Scanner, BufferedReader and Command-Line Arguments | beginner | Essential Java syntax | 35 | ✓ | `m1-output-printing` | 3 | 4 |
| `m1-if-else-switch` Decision Making: if, else, switch | beginner | Essential Java syntax | 35 | ✓ | `m1-operators-logical-ternary`, `m1-input-scanner` | 3 | 5 |
| `m1-loops` Loops: for, while, do-while, break and continue | beginner | Essential Java syntax | 40 | ✓ | `m1-if-else-switch` | 3 | 5 |
| `m1-methods` Methods: Parameters, Return Values, Scope and Overloading | beginner | Essential Java syntax | 40 | ✓ | `m1-loops` | 3 | 4 |
| `m1-debugging-tracing` Tracing and Debugging Programs | beginner | Essential Java syntax | 30 | ✓ | `m1-methods`, `m0-errors` | 3 | 4 |

## M2 · Core Programming Skills

The building blocks of every algorithm: one- and two-dimensional arrays, strings and StringBuilder, number systems, GCD/primes/modular arithmetic, recursion, references, and writing robust code.

| Lesson | Level | Track | Min | Essential | Needs | Exercises | Quiz |
|---|---|---|---:|:-:|---|---:|---:|
| `m2-arrays-1d` One-Dimensional Arrays | beginner | Core programming & data structures | 40 | ✓ | `m1-loops`, `m1-methods` | 3 | 4 |
| `m2-arrays-2d` Two-Dimensional Arrays (Matrices) | beginner | Core programming & data structures | 40 | ✓ | `m2-arrays-1d` | 3 | 4 |
| `m2-strings` Strings, StringBuilder and Characters | beginner | Core programming & data structures | 45 | ✓ | `m1-methods`, `m2-arrays-1d` | 3 | 5 |
| `m2-number-systems-binary` Number Systems, Binary and Two's Complement | beginner | Core programming & data structures | 40 | ✓ | `m1-operators-arithmetic`, `m1-loops` | 3 | 5 |
| `m2-math-gcd-lcm-primes-mod` Divisibility, GCD/LCM, Primes and Modular Arithmetic | beginner | Core programming & data structures | 45 | ✓ | `m1-methods`, `m1-loops`, `m1-operators-arithmetic` | 3 | 4 |
| `m2-recursion` Recursion: Base Case, Recursive Case and the Call Stack | intermediate | Core programming & data structures | 50 | ✓ | `m1-methods`, `m1-debugging-tracing` | 3 | 5 |
| `m2-references-memory` References, Pass-by-Value and Memory | intermediate | Core programming & data structures | 35 | ✓ | `m2-arrays-1d`, `m1-methods` | 3 | 4 |
| `m2-boundaries-validation` Boundary Conditions, Validation and Common Mistakes | beginner | Core programming & data structures | 30 | ✓ | `m1-debugging-tracing`, `m2-arrays-1d` | 3 | 4 |

## M3 · Object-Oriented Programming

Classes and objects, encapsulation, inheritance, polymorphism, abstraction, interfaces, static/final, packages, exceptions, generics, the Java Collections Framework and sorting with comparators.

| Lesson | Level | Track | Min | Essential | Needs | Exercises | Quiz |
|---|---|---|---:|:-:|---|---:|---:|
| `m3-classes-objects` Classes, Objects, Fields, Constructors and `this` | beginner | Essential Java syntax | 40 | – | `m1-methods`, `m2-references-memory` | 3 | 4 |
| `m3-encapsulation-access` Encapsulation and Access Modifiers | beginner | Essential Java syntax | 30 | – | `m3-classes-objects` | 3 | 4 |
| `m3-inheritance-polymorphism` Inheritance, Overriding and Polymorphism | intermediate | Essential Java syntax | 45 | – | `m3-encapsulation-access` | 3 | 4 |
| `m3-abstraction-interfaces` Abstract Classes and Interfaces | intermediate | Essential Java syntax | 40 | – | `m3-inheritance-polymorphism` | 3 | 4 |
| `m3-static-final-init` static, final and Initialisation Order | intermediate | Essential Java syntax | 30 | – | `m3-classes-objects` | 3 | 4 |
| `m3-packages-imports` Packages and Imports | beginner | Essential Java syntax | 20 | – | `m0-first-program` | 3 | 4 |
| `m3-exceptions` Exceptions: try, catch, finally, throw and throws | intermediate | Essential Java syntax | 35 | – | `m0-errors`, `m3-inheritance-polymorphism` | 3 | 4 |
| `m3-collections-lists` Generics and Lists: ArrayList and LinkedList | beginner | Core programming & data structures | 40 | ✓ | `m2-arrays-1d`, `m3-classes-objects` | 3 | 4 |
| `m3-collections-sets-maps` Sets and Maps: HashSet, TreeSet, HashMap, TreeMap | beginner | Core programming & data structures | 40 | ✓ | `m3-collections-lists` | 3 | 4 |
| `m3-collections-queues-deques` Queues, Deques, Stacks and PriorityQueue | beginner | Core programming & data structures | 35 | ✓ | `m3-collections-lists` | 3 | 4 |
| `m3-sorting-comparators` Sorting with Comparable and Comparator | intermediate | Core programming & data structures | 35 | ✓ | `m3-collections-lists`, `m3-abstraction-interfaces` | 3 | 4 |
| `m3-equals-hashcode-immutability` equals(), hashCode() and Immutability | intermediate | Core programming & data structures | 35 | – | `m3-collections-sets-maps`, `m3-encapsulation-access` | 3 | 4 |

## M4 · Data Structures & Algorithm Foundations

The data structures behind the problems, linear and binary search, elementary sorting, iteration vs recursion, algorithm paradigms, and time/space complexity analysis.

| Lesson | Level | Track | Min | Essential | Needs | Exercises | Quiz |
|---|---|---|---:|:-:|---|---:|---:|
| `m4-ds-overview` Data Structures Overview: Arrays, Linked Lists, Stacks, Queues, Hash Tables | beginner | Core programming & data structures | 45 | ✓ | `m3-collections-lists`, `m2-references-memory` | 3 | 4 |
| `m4-trees-graphs-heaps` Trees, Graphs and Heaps | intermediate | Core programming & data structures | 50 | – | `m4-ds-overview`, `m2-recursion`, `m3-collections-queues-deques` | 3 | 4 |
| `m4-searching` Searching: Linear and Binary Search | beginner | Core programming & data structures | 40 | ✓ | `m2-arrays-1d`, `m1-loops`, `m2-boundaries-validation` | 3 | 4 |
| `m4-sorting-elementary` Elementary Sorting: Bubble, Insertion, Selection; Stability | beginner | Core programming & data structures | 45 | ✓ | `m2-arrays-1d`, `m1-loops` | 3 | 4 |
| `m4-merge-sort` Merge Sort and Divide and Conquer | intermediate | Core programming & data structures | 45 | ✓ | `m2-recursion`, `m4-sorting-elementary` | 3 | 4 |
| `m4-iteration-vs-recursion` Iteration versus Recursion | intermediate | Core programming & data structures | 35 | – | `m2-recursion`, `m1-loops` | 3 | 4 |
| `m4-complexity-intro` Time Complexity and Big-O Notation | beginner | Core programming & data structures | 45 | ✓ | `m1-loops`, `m0-intro-algorithms` | 3 | 5 |
| `m4-paradigms` Algorithm Design Paradigms | intermediate | Core programming & data structures | 50 | ✓ | `m2-recursion`, `m4-complexity-intro` | 3 | 4 |
| `m4-complexity-loops` Analysing Loops: Counting Iterations | intermediate | Core programming & data structures | 50 | ✓ | `m4-complexity-intro`, `m1-loops` | 3 | 5 |
| `m4-complexity-recursion` Analysing Recursion: Recurrence Relations | intermediate | Core programming & data structures | 40 | – | `m4-complexity-loops`, `m2-recursion` | 3 | 4 |
| `m4-space-complexity` Space Complexity and the Call Stack | beginner | Core programming & data structures | 30 | ✓ | `m4-complexity-intro`, `m2-recursion` | 3 | 4 |
| `m4-best-avg-worst` Best, Average and Worst Case | intermediate | Core programming & data structures | 30 | – | `m4-complexity-intro`, `m4-searching` | 3 | 4 |

## M5 · Archive Algorithm Mastery

One full lesson for each algorithm and programming problem in your course archive — numbers and bits, arrays and matrices, strings, recursion and backtracking, and sorting — with naive and optimized solutions, dry runs, practice and quizzes.

| Lesson | Level | Track | Min | Essential | Needs | Exercises | Quiz |
|---|---|---|---:|:-:|---|---:|---:|
| `a-euclid-gcd` Euclid's Algorithm (GCD) | beginner | Archive algorithm knowledge | 40 | ✓ | `m1-loops`, `m1-methods`, `m2-math-gcd-lcm-primes-mod`, `m2-recursion` | 3 | 6 |
| `a-euler-phi` Euler's Phi (Totient) Function | intermediate | Archive algorithm knowledge | 45 | ✓ | `a-euclid-gcd`, `m2-math-gcd-lcm-primes-mod`, `m1-loops` | 3 | 6 |
| `a-crt` Chinese Remainder Theorem | intermediate | Archive algorithm knowledge | 45 | – | `a-euclid-gcd`, `m2-math-gcd-lcm-primes-mod` | 3 | 5 |
| `a-combination` Combinations (nCr) | beginner | Archive algorithm knowledge | 40 | – | `m1-loops`, `m1-methods`, `m2-recursion` | 3 | 5 |
| `a-karatsuba` Karatsuba's Multiplication | advanced | Archive algorithm knowledge | 55 | – | `m2-recursion`, `m4-paradigms`, `a-euclid-gcd` | 3 | 5 |
| `a-booth` Booth's Algorithm (signed binary multiplication) | advanced | Archive algorithm knowledge | 60 | – | `m2-number-systems-binary`, `m1-operators-bitwise`, `m1-loops` | 3 | 5 |
| `a-simple-sieve` Simple Sieve of Eratosthenes | beginner | Archive algorithm knowledge | 40 | ✓ | `m2-arrays-1d`, `m1-loops`, `m2-math-gcd-lcm-primes-mod` | 3 | 5 |
| `a-segmented-sieve` Segmented & Incremental Sieve | advanced | Archive algorithm knowledge | 55 | – | `a-simple-sieve`, `m3-collections-sets-maps` | 3 | 4 |
| `a-binary-palindrome` Binary Palindrome | beginner | Archive algorithm knowledge | 35 | ✓ | `m2-number-systems-binary`, `m1-operators-bitwise`, `m1-loops` | 3 | 5 |
| `a-nibble-swap` Swap Two Nibbles in a Byte | beginner | Archive algorithm knowledge | 30 | – | `m1-operators-bitwise`, `m2-number-systems-binary`, `m1-conversion-casting-overflow` | 3 | 4 |
| `a-longest-ones` Longest Sequence of 1s (and after flipping a bit) | intermediate | Archive algorithm knowledge | 45 | – | `a-binary-palindrome`, `m1-operators-bitwise`, `m2-strings` | 3 | 4 |
| `a-josephus` Josephus Problem | intermediate | Archive algorithm knowledge | 50 | ✓ | `m2-recursion`, `m2-math-gcd-lcm-primes-mod`, `m3-collections-lists` | 3 | 5 |
| `a-block-swap` Block Swap Algorithm (Array Rotation) | intermediate | Archive algorithm knowledge | 50 | ✓ | `m2-arrays-1d`, `m1-loops`, `m1-methods` | 3 | 5 |
| `a-leaders` Leaders in an Array | beginner | Archive algorithm knowledge | 30 | ✓ | `m2-arrays-1d`, `m1-loops` | 3 | 4 |
| `a-majority-element` Majority Element (Boyer–Moore Voting) | intermediate | Archive algorithm knowledge | 50 | ✓ | `m2-arrays-1d`, `m3-collections-sets-maps` | 3 | 5 |
| `a-max-product-subarray` Maximum Product Subarray | intermediate | Archive algorithm knowledge | 50 | ✓ | `m2-arrays-1d`, `m1-loops`, `m1-conversion-casting-overflow` | 3 | 5 |
| `a-equilibrium-sum` Maximum Equilibrium Sum | beginner | Archive algorithm knowledge | 35 | ✓ | `m2-arrays-1d`, `m1-loops` | 3 | 4 |
| `a-hourglass` Maximum Sum of an Hourglass in a Matrix | beginner | Archive algorithm knowledge | 30 | ✓ | `m2-arrays-2d`, `m1-loops` | 3 | 4 |
| `a-toggle-doors` Toggle the Switch (100 Doors) | intermediate | Archive algorithm knowledge | 40 | ✓ | `m1-loops`, `m2-arrays-1d`, `m2-math-gcd-lcm-primes-mod` | 3 | 4 |
| `a-alice-apple-tree` Alice's Apple Tree (Minimum Garden Perimeter) | advanced | Archive algorithm knowledge | 45 | – | `m1-loops`, `a-toggle-doors`, `m4-searching` | 3 | 4 |
| `a-weighted-substring` Weighted Substring (Smallest String of a Given Weight) | advanced | Archive algorithm knowledge | 50 | – | `m2-strings`, `m4-searching`, `m3-sorting-comparators` | 3 | 4 |
| `a-move-hyphen` Move Hyphen to the Beginning | beginner | Archive algorithm knowledge | 30 | ✓ | `m2-strings`, `m1-methods` | 3 | 4 |
| `a-strobogrammatic` Strobogrammatic Number | intermediate | Archive algorithm knowledge | 40 | – | `m2-strings`, `m3-collections-sets-maps`, `m2-recursion` | 3 | 4 |
| `a-lex-palindrome` Lexicographically First Palindromic Rearrangement | intermediate | Archive algorithm knowledge | 40 | ✓ | `m2-strings`, `m2-arrays-1d`, `m3-collections-sets-maps` | 3 | 4 |
| `a-manacher` Manacher's Algorithm (Longest Palindromic Substring) | advanced | Archive algorithm knowledge | 65 | – | `m2-strings`, `a-lex-palindrome`, `m4-complexity-loops` | 3 | 4 |
| `a-natural-sort` Natural Sort Order | intermediate | Archive algorithm knowledge | 40 | – | `m3-sorting-comparators`, `m2-strings`, `m3-collections-lists` | 3 | 4 |
| `a-maneuvering` Maneuvering (Counting Grid Paths) | intermediate | Archive algorithm knowledge | 45 | ✓ | `m2-recursion`, `m2-arrays-2d`, `a-combination` | 3 | 4 |
| `a-sorted-permutations` Sorted Distinct Permutations | intermediate | Archive algorithm knowledge | 50 | – | `m2-recursion`, `m2-strings`, `a-combination` | 3 | 4 |
| `a-n-queens` N-Queens (Backtracking) | advanced | Archive algorithm knowledge | 60 | ✓ | `m2-recursion`, `m2-arrays-2d`, `m4-paradigms` | 3 | 5 |
| `a-maze-solving` Maze Solving (Rat in a Maze) | advanced | Archive algorithm knowledge | 55 | ✓ | `m2-recursion`, `m2-arrays-2d`, `a-n-queens` | 3 | 4 |
| `a-hamiltonian-cycle` Hamiltonian Cycle | advanced | Archive algorithm knowledge | 55 | – | `m4-trees-graphs-heaps`, `a-n-queens`, `m2-arrays-2d` | 3 | 4 |
| `a-knights-tour` Knight's Tour & Warnsdorff's Rule | advanced | Archive algorithm knowledge | 55 | – | `a-n-queens`, `a-maze-solving`, `m2-arrays-2d` | 3 | 4 |
| `a-selection-sort` Selection Sort | beginner | Archive algorithm knowledge | 35 | ✓ | `m2-arrays-1d`, `m1-loops`, `m1-methods` | 3 | 4 |
| `a-quick-sort` Quick Sort | intermediate | Archive algorithm knowledge | 55 | ✓ | `m2-recursion`, `a-selection-sort`, `m4-paradigms` | 3 | 5 |

