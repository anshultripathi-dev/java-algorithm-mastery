/**
 * Inventory of the course archive (38 slide decks) and where each item is taught.
 * Used by the coverage audit (`npm run audit`), the content tests and the generated
 * content/*.md documents, so a slide topic can never silently go missing.
 *
 * `slides` / `words` / `media` come from the extraction of the .pptx files (media = embedded
 * images; text inside images was OCR'd locally and cross-checked against the algorithms).
 */
export interface DeckItem {
  topic: string;
  /** lesson that teaches it */
  lesson: string;
  kind: 'concept' | 'algorithm' | 'problem' | 'exercise';
}

export interface ArchiveDeck {
  /** file base name without the FALLSEM… prefix and the .pptx extension */
  base: string;
  title: string;
  slides: number;
  words: number;
  media: number;
  items: DeckItem[];
}

const D = (base: string, title: string, slides: number, words: number, media: number, items: [string, string, DeckItem['kind']][]): ArchiveDeck => ({
  base,
  title,
  slides,
  words,
  media,
  items: items.map(([topic, lesson, kind]) => ({ topic, lesson, kind })),
});

export const ARCHIVE_DECKS: ArchiveDeck[] = [
  D('Java-Introduction_-Features_-Structure_-Data-Types', 'Java Introduction: Features, Structure, Data Types', 17, 242, 7, [
    ['Features of Java, history, editions', 'm0-java-landscape', 'concept'],
    ['JVM, JRE, JDK and bytecode', 'm0-how-java-works', 'concept'],
    ['Structure of a Java program', 'm0-first-program', 'concept'],
    ['Data types and variables', 'm1-variables-types', 'concept'],
  ]),
  D('Basic-I_O_-Operators', 'Basic Input/Output and Operators', 27, 801, 3, [
    ['System.out.print / println / printf', 'm1-output-printing', 'concept'],
    ['Scanner and console input', 'm1-input-scanner', 'concept'],
    ['Arithmetic, assignment and unary operators', 'm1-operators-arithmetic', 'concept'],
    ['Bitwise and shift operators', 'm1-operators-bitwise', 'concept'],
    ['Type conversion and casting', 'm1-conversion-casting-overflow', 'concept'],
  ]),
  D('Introduction-to-Algorithms', 'Introduction to Algorithms', 4, 194, 3, [['What an algorithm is; pseudocode and flowcharts', 'm0-intro-algorithms', 'concept']]),
  D('Decision-making-and-Control-structures', 'Decision Making and Control Structures', 29, 811, 9, [
    ['if / if-else / else-if ladder / nested if', 'm1-if-else-switch', 'concept'],
    ['switch statement', 'm1-if-else-switch', 'concept'],
    ['for, while and do-while loops; break and continue', 'm1-loops', 'concept'],
  ]),
  D('Time-_-Space-complexity-1_1', 'Time and Space Complexity (part 1)', 34, 1191, 14, [
    ['Big-O, Big-Ω, Big-Θ and the complexity chart', 'm4-complexity-intro', 'concept'],
    ['20 "predict the time complexity" loop snippets', 'm4-complexity-loops', 'exercise'],
  ]),
  D('Time-_-Space-complexity-1_2', 'Time and Space Complexity (part 2)', 11, 399, 6, [
    ['Recursive time complexity (factorial, Fibonacci, power)', 'm4-complexity-recursion', 'concept'],
    ['Space complexity and recursion stack', 'm4-space-complexity', 'concept'],
  ]),
  D("Euclid's-Algorithm", "Euclid's Algorithm", 10, 96, 13, [['GCD by repeated remainder', 'a-euclid-gcd', 'algorithm']]),
  D("Euler's-phi-Algorithm", "Euler's Phi (Totient) Function", 7, 504, 3, [['φ(n) via prime factors', 'a-euler-phi', 'algorithm']]),
  D('Remainder-Theorem', 'Chinese Remainder Theorem', 7, 613, 3, [['Solving simultaneous congruences', 'a-crt', 'algorithm']]),
  D('Combination', 'Combinations (nCr)', 7, 245, 6, [['nCr computation', 'a-combination', 'algorithm']]),
  D('Karatsuba-Algorithm', 'Karatsuba Multiplication', 8, 723, 3, [['Divide-and-conquer multiplication', 'a-karatsuba', 'algorithm']]),
  D("Booth's-Algorithm", "Booth's Multiplication", 14, 12, 18, [['Signed binary multiplication (slides are images)', 'a-booth', 'algorithm']]),
  D('Simple-Sieve', 'Sieve of Eratosthenes', 6, 422, 3, [['Primes up to n', 'a-simple-sieve', 'algorithm']]),
  D('Segmented-_-Incremental-Sieve', 'Segmented and Incremental Sieve', 4, 295, 3, [['Primes in [L, R]; incremental sieve', 'a-segmented-sieve', 'algorithm']]),
  D('Binary-Palindrome', 'Binary Palindrome', 7, 583, 3, [['Is the binary representation a palindrome?', 'a-binary-palindrome', 'problem']]),
  D('Swap-two-nibbles-in-a-byte', 'Swap Two Nibbles in a Byte', 7, 713, 6, [['Nibble swap with masks and shifts', 'a-nibble-swap', 'problem']]),
  D('Longest-Sequence-of-1-after-flipping-a-bit', 'Longest Sequence of 1s after Flipping a Bit', 10, 865, 6, [['Longest 1-run after one flip', 'a-longest-ones', 'problem']]),
  D('Josephus-trap', 'Josephus Problem', 13, 781, 10, [['Josephus: simulation, recursion and closed form', 'a-josephus', 'problem']]),
  D('Block-Swap-Algorithm', 'Block Swap (Array Rotation)', 12, 1053, 6, [['Rotate an array by d positions', 'a-block-swap', 'algorithm']]),
  D('Leaders-in-array', 'Leaders in an Array', 10, 9, 20, [['Elements greater than everything on their right (slides are images)', 'a-leaders', 'problem']]),
  D('Majority-element', 'Majority Element', 19, 170, 25, [['Element appearing more than n/2 times (slides are images)', 'a-majority-element', 'problem']]),
  D('Max-product-subarray', 'Maximum Product Subarray', 8, 407, 4, [['Contiguous subarray with maximum product', 'a-max-product-subarray', 'problem']]),
  D('Max-Equlibrium-Sum', 'Maximum Equilibrium Sum', 14, 105, 19, [['Prefix = suffix index with maximum sum (slides mostly images)', 'a-equilibrium-sum', 'problem']]),
  D('Maximum-sum-of-hour-glass-in-matrix', 'Maximum Hourglass Sum in a Matrix', 8, 321, 5, [['Scanning a matrix for the best hourglass', 'a-hourglass', 'problem']]),
  D('Toggle-the-switch-_-Alice-Apple-tree', "Toggle the Switch and Alice's Apple Tree", 8, 343, 6, [
    ['100 doors / toggle the switch', 'a-toggle-doors', 'problem'],
    ["Alice's apple tree (minimum perimeter)", 'a-alice-apple-tree', 'problem'],
  ]),
  D('Weightes-substring', 'Weighted Substring', 7, 493, 5, [['Smallest string with a given weight', 'a-weighted-substring', 'problem']]),
  D('Move-hyphen-to-beginning', 'Move Hyphen to the Beginning', 3, 91, 3, [['In-place partition of a string', 'a-move-hyphen', 'problem']]),
  D('Strobogrammatic-Number', 'Strobogrammatic Number', 6, 347, 3, [['Number that looks the same upside down', 'a-strobogrammatic', 'problem']]),
  D('Lexicographically-first-palindromic-string', 'Lexicographically First Palindromic String', 14, 687, 6, [['Smallest palindrome from a multiset of letters', 'a-lex-palindrome', 'problem']]),
  D("Manacher's-Algorithm", "Manacher's Algorithm", 6, 567, 3, [['Longest palindromic substring in O(n)', 'a-manacher', 'algorithm']]),
  D('Natural-Sort-order', 'Natural Sort Order', 5, 527, 3, [['Comparator for strings with numbers', 'a-natural-sort', 'problem']]),
  D('Maneuvering', 'Maneuvering (Grid Paths)', 7, 417, 3, [['Counting paths in a grid', 'a-maneuvering', 'problem']]),
  D('Sorted-Unique-Permutation', 'Sorted Unique Permutations', 6, 350, 3, [['Distinct permutations in sorted order', 'a-sorted-permutations', 'problem']]),
  D('N-Queens', 'N-Queens', 11, 612, 11, [['Backtracking placement of N queens', 'a-n-queens', 'algorithm']]),
  D('Maze-Solving', 'Maze Solving', 7, 382, 5, [['Rat in a maze by backtracking', 'a-maze-solving', 'algorithm']]),
  D('Hamiltonian-Cycle', 'Hamiltonian Cycle', 7, 458, 3, [['Backtracking search for a Hamiltonian cycle', 'a-hamiltonian-cycle', 'algorithm']]),
  D('Quick_-Selection-Sort', 'Quick Sort and Selection Sort', 8, 1209, 3, [
    ['Selection sort', 'a-selection-sort', 'algorithm'],
    ['Quick sort', 'a-quick-sort', 'algorithm'],
  ]),
  D('downloadCourseMaterialFacultyPdf', "Knight's Tour (Warnsdorff's Rule)", 8, 562, 6, [["Knight's tour with Warnsdorff's heuristic", 'a-knights-tour', 'algorithm']]),
];
