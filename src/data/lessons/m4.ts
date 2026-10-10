import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

export const dsOverview: Lesson = lesson({
  id: 'm4-ds-overview',
  dryRun: { algo: 'list-reverse', input: { arr: '1,2,3,4,5' }, caption: 'prev / cur / next flipping one link at a time.' },
  module: 'm4',
  title: 'Data Structures Overview: Arrays, Linked Lists, Stacks, Queues, Hash Tables',
  summary: 'The main ways to organise data in memory, what each makes fast or slow, and a hand-built linked list, stack and queue.',
  level: 'beginner',
  track: 'core',
  minutes: 45,
  essential: true,
  prerequisites: ['m3-collections-lists', 'm2-references-memory'],
  objectives: [
    'Compare arrays, linked lists, stacks, queues and hash tables by the cost of their operations.',
    'Build a singly linked list with a `Node` class and reverse it.',
    'Implement a stack on a list and a queue on a ring buffer.',
    'Choose a data structure from the operations a problem needs.',
  ],
  intuition: [
    p('A **data structure** is a way of arranging data so that the operations you need are cheap. Every structure trades something: fast access for slow insertion, speed for memory, order for convenience.'),
    table(['structure', 'access by index', 'search', 'insert / delete', 'good for'], [['array', 'O(1)', 'O(n) / O(log n) sorted', 'O(n) middle, O(1) end', 'fixed-size sequences, matrices'], ['linked list', 'O(n)', 'O(n)', 'O(1) at a known node / head', 'frequent insertion at the front, building queues'], ['stack (LIFO)', '—', '—', 'push/pop O(1)', 'undo, brackets, recursion, DFS'], ['queue (FIFO)', '—', '—', 'enqueue/dequeue O(1)', 'scheduling, BFS'], ['hash table', '—', 'O(1) average', 'O(1) average', 'lookup, counting, de-duplication'], ['balanced tree / TreeMap', '—', 'O(log n)', 'O(log n)', 'sorted data, range queries'], ['heap / priority queue', '—', 'min only O(1)', 'O(log n)', 'repeatedly take the best item']]),
    why('A linked list stores each value in a separate **node** that holds a reference to the next node. There is no way to jump to element i without walking i links (O(n)), but inserting at the head — or after a node you already hold — only re-wires two references (O(1)), with no shifting. An array is the opposite. Stacks and queues are not new storage; they are **disciplines**: restrict *where* you may add and remove, and every operation becomes O(1).'),
    pre(`
head ─► [ 1 | ●─]──►[ 2 | ●─]──►[ 3 | ● ]──► null
          value next
`),
  ],
  syntax: [
    table(['structure', 'Java type', 'typical calls'], [['array', '`int[] a`', '`a[i]`, `a.length`'], ['dynamic array', '`ArrayList<Integer>`', '`add(x)`, `get(i)`, `set(i, x)`, `remove(i)`, `size()`'], ['linked list', '`LinkedList<Integer>`', '`addFirst`, `removeFirst`, `getFirst`'], ['stack', '`ArrayDeque<Integer>`', '`push(x)`, `pop()`, `peek()`'], ['queue', '`ArrayDeque<Integer>`', '`offer(x)`, `poll()`, `peek()`'], ['hash table', '`HashMap<K,V>` / `HashSet<E>`', '`put`, `get`, `containsKey`, `add`, `contains`']]),
    code(`
class Node {                       // hand-made linked list node
    int value;
    Node next;
    Node(int value) { this.value = value; }
}
Node head = new Node(1);
head.next = new Node(2);          // head -> 1 -> 2 -> null
`),
  ],
  tiny: [code(`
class Node {
    int value;
    Node next;
    Node(int value) { this.value = value; }
}
Node head = new Node(1);
head.next = new Node(2);
`)],
  guided: [prog('m4-ds-overview/LinkedStructures.java', 'A linked list (add, reverse), a stack on top of it, and a circular-array queue')],
  programs: [
    {
      file: 'm4-ds-overview/LinkedStructures.java',
      title: 'Linked list, stack and queue from scratch',
      role: 'demo',
      description: 'No library collections: only Node and arrays.',
      walkthrough: [
        { at: 'while (cur.next != null) cur = cur.next;', text: 'Reaching the tail requires walking the whole list: addLast is O(n) unless you also keep a tail reference.' },
        { at: 'Node next = cur.next;     // remember the rest', text: 'Reversal: save the next node BEFORE overwriting the link, otherwise the rest of the list is lost.' },
        { at: 'cur.next = prev;          // flip the link', text: 'Each node now points backwards.' },
        { at: 'void push(int v) { list.addFirst(v); }', text: 'A stack is the head operations of the list: both O(1).' },
        { at: 'data[(head + size) % data.length] = v;', text: 'A circular buffer: the modulo wraps indices around, so neither end ever needs shifting.' },
      ],
    },
  ],
  complexity: [p('See the table above. Space: an array of n ints uses 4n bytes; a linked list uses about 16–24 bytes per element (value + reference + object header) — noticeably more.')],
  mistakes: [
    { title: 'Losing the rest of the list', wrong: 'cur.next = prev;   // before saving cur.next', why: 'The only reference to the remaining nodes is overwritten.', fix: 'Node next = cur.next; cur.next = prev; ...' },
    { title: 'Dereferencing null', wrong: 'head.next.value   // empty list or last node', why: 'NullPointerException.', fix: 'Check head != null / cur.next != null.' },
    { title: 'Off-by-one in a ring buffer', wrong: 'data[head + size]   // missing % capacity', why: 'Index runs off the end of the array.', fix: 'data[(head + size) % capacity]' },
  ],
  practice: [
    { id: 'ds-ex1', level: 'beginner', title: 'Reverse a linked list', statement: 'Read n and n numbers into a singly linked list (your own Node class); reverse it and print it.', examples: [{ input: '5\n1 2 3 4 5', output: '5 4 3 2 1' }], hints: ['Use three references: prev, cur, next.'], solutionFile: 'm4-ds-overview/Ex1.java', solutionExplain: 'One pass flipping each link.', tests: [{ stdin: '5\n1 2 3 4 5\n', stdout: '5 4 3 2 1' }, { stdin: '1\n9\n', stdout: '9' }] },
    { id: 'ds-ex2', level: 'beginner', title: 'Palindromic list', statement: 'Read n numbers; print YES if the sequence reads the same forwards and backwards.', examples: [{ input: '5\n1 2 3 2 1', output: 'YES' }], hints: ['Two indices moving inwards.'], solutionFile: 'm4-ds-overview/Ex2.java', solutionExplain: 'Compare the i-th from the front with the i-th from the back.', tests: [{ stdin: '5\n1 2 3 2 1\n', stdout: 'YES' }, { stdin: '3\n1 2 3\n', stdout: 'NO' }, { stdin: '1\n7\n', stdout: 'YES' }] },
    { id: 'ds-ex3', level: 'intermediate', title: 'Circular queue', statement: 'Implement a queue of capacity c on an array. Read c and n commands `enq x` / `deq`; print `ok`/`full` for enq and the removed value or `empty` for deq.', examples: [{ input: '2 6\nenq 1\nenq 2\nenq 3\ndeq\nenq 3\ndeq', output: 'ok ok full 1 ok 2' }], hints: ['head and size; index (head + size) % c.'], solutionFile: 'm4-ds-overview/Ex3.java', solutionExplain: 'Modulo arithmetic turns the array into a ring.', tests: [{ stdin: '2 6\nenq 1\nenq 2\nenq 3\ndeq\nenq 3\ndeq\n', stdout: 'ok ok full 1 ok 2' }, { stdin: '1 2\ndeq\nenq 5\n', stdout: 'empty ok' }] },
  ],
  quiz: [
    { type: 'match', q: 'Match the structure to its best-known operation cost.', pairs: [['array index lookup', 'O(1)'], ['linked list lookup by position', 'O(n)'], ['hash table lookup (average)', 'O(1)'], ['sorted tree lookup', 'O(log n)']], explain: 'Arrays jump by arithmetic; lists walk; hashing jumps by hash; trees halve.' },
    { type: 'mcq', q: 'Which structure matches "undo"?', kind: 'choose-algorithm', options: ['queue', 'stack', 'set', 'heap'], answer: 1, explain: 'The most recent action is undone first: LIFO.' },
    { type: 'mcq', q: 'Insert at the head of a singly linked list costs…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 0, explain: 'Re-wire two references.' },
    { type: 'mcq', q: 'Which is best for BFS?', kind: 'choose-algorithm', options: ['stack', 'queue', 'array', 'tree'], answer: 1, explain: 'FIFO explores by levels.' },
  ],
  interview: ['Array vs linked list?', 'How do you reverse a linked list?', 'Implement a queue with two stacks.', 'Detect a cycle in a linked list (Floyd).'],
  videos: ['m4-ds-overview', 'm4-ds-overview#2'],
  revision: ['Array: O(1) index, O(n) insert. Linked list: O(1) head insert, O(n) index.', 'Stack LIFO, queue FIFO, hash table O(1) average lookup.', 'Reverse: save next, flip link, advance.', 'Ring buffer: (head + size) % capacity.'],
});

export const treesGraphsHeaps: Lesson = lesson({
  id: 'm4-trees-graphs-heaps',
  dryRun: { algo: 'bfs', input: { edges: '0-1,0-2,1-3,2-3,3-4', start: '0' }, caption: 'BFS discovers vertices level by level.' },
  module: 'm4',
  title: 'Trees, Graphs and Heaps',
  summary: 'Hierarchical and networked data: binary search trees, graph representations with BFS/DFS, and the array-based min-heap.',
  level: 'intermediate',
  track: 'core',
  minutes: 50,
  essential: false,
  prerequisites: ['m4-ds-overview', 'm2-recursion', 'm3-collections-queues-deques'],
  sources: ['Hamiltonian-Cycle', 'Maze-Solving'],
  objectives: [
    'Describe trees, binary search trees, and traversals (inorder, preorder, postorder).',
    'Represent a graph as an adjacency matrix and an adjacency list; know when each is better.',
    'Write BFS (queue) and DFS (recursion/stack) and state their cost.',
    'Explain a binary heap stored in an array and its sift-up / sift-down operations.',
  ],
  intuition: [
    p('A **tree** is a connected structure of nodes without cycles: one **root**, and every node has **children**. In a **binary search tree (BST)** each node\'s key is larger than everything in its left subtree and smaller than everything in its right subtree, so **inorder traversal prints keys in sorted order** and searching discards half the tree at each step (O(height), which is O(log n) when balanced).'),
    p('A **graph** is a set of **vertices** joined by **edges** (directed or undirected). The Hamiltonian-cycle lesson stored one as an **adjacency matrix** (`graph[i][j] == 1`: V² memory, O(1) edge test). An **adjacency list** (`List<List<Integer>>`: each vertex lists its neighbours) uses O(V + E) memory and is best for sparse graphs.'),
    pre(`
BST insert 50, 30, 70, 20, 40, 60, 80          graph: 0─1  0─2  1─3  2─3  3─4
          50                                   BFS from 0:  0 1 2 3 4   (by distance)
        /    \\                                 DFS from 0:  0 1 3 2 4   (as deep as possible first)
      30      70
     /  \\    /  \\
    20  40  60  80          inorder: 20 30 40 50 60 70 80
`),
    why('**BFS** uses a queue, so vertices are processed in order of distance from the start: the first time it reaches a vertex is along a shortest path (fewest edges). **DFS** goes as deep as possible then backtracks — exactly the structure of the N-Queens, maze and Hamiltonian-cycle searches. Both visit every vertex and edge once: O(V + E) with an adjacency list.'),
    h('Heap'),
    p('A **binary min-heap** is a complete binary tree stored in an array where every parent ≤ its children. For index i: parent = (i−1)/2, children = 2i+1 and 2i+2. **add** puts the item at the end and **sifts up**; **removeMin** moves the last item to the root and **sifts down**. Both are O(log n); reading the minimum is O(1). This is what `PriorityQueue` does.'),
  ],
  syntax: [
    code(`
class TreeNode { int key; TreeNode left, right; TreeNode(int k) { key = k; } }

List<List<Integer>> adj = new ArrayList<>();            // adjacency list for V vertices
for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
adj.get(u).add(v);  adj.get(v).add(u);                  // undirected edge

PriorityQueue<Integer> minHeap = new PriorityQueue<>();                         // smallest first
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

Deque<Integer> queue = new ArrayDeque<>();              // BFS
queue.offer(start);  seen[start] = true;
while (!queue.isEmpty()) {
    int v = queue.poll();
    for (int w : adj.get(v)) if (!seen[w]) { seen[w] = true; queue.offer(w); }
}
`),
  ],
  tiny: [code(`
static boolean contains(TreeNode t, int key) {
    while (t != null) {
        if (key == t.key) return true;
        t = key < t.key ? t.left : t.right;
    }
    return false;
}
`)],
  guided: [prog('m4-trees-graphs-heaps/TreeGraphDemo.java', 'A BST with inorder/height/contains, an adjacency-list graph with BFS and DFS, and a hand-written min-heap')],
  programs: [
    {
      file: 'm4-trees-graphs-heaps/TreeGraphDemo.java',
      title: 'Trees, graphs and heaps',
      role: 'demo',
      description: 'Three structures in one file.',
      walkthrough: [
        { at: 'static TreeNode insert(TreeNode root, int key)', text: 'Recursive BST insertion: go left or right until an empty spot; duplicates are ignored.' },
        { at: 'static void inorder(TreeNode t, List<Integer> out)', text: 'Left subtree, then the node, then the right subtree: sorted output.' },
        { at: 'adj.get(e[1]).add(e[0]);', text: 'Undirected graph: store the edge in both directions.' },
        { at: 'boolean[] seen = new boolean[adj.size()];', text: 'Mark vertices when they are ENQUEUED so each is queued once.' },
        { at: 'while (i > 0 && a[(i - 1) / 2] > a[i])', text: 'Sift up: swap with the parent while smaller than it.' },
        { at: 'int l = 2 * i + 1, r = l + 1, s = i;', text: 'Sift down: pick the smaller child and swap if it is smaller than a[i].' },
      ],
    },
  ],
  complexity: [table(['operation', 'time'], [['BST search/insert (balanced)', 'O(log n)'], ['BST search/insert (degenerate: sorted input)', 'O(n)'], ['BFS / DFS (adjacency list)', 'O(V + E)'], ['BFS / DFS (adjacency matrix)', 'O(V²)'], ['heap add / removeMin', 'O(log n)'], ['heap peek', 'O(1)'], ['build a heap from n items', 'O(n)']])],
  mistakes: [
    { title: 'Marking visited too late in BFS', wrong: 'seen[v] = true;   // only when polled', why: 'A vertex may be added to the queue many times.', fix: 'Mark when enqueuing.' },
    { title: 'Assuming a BST is balanced', wrong: 'inserting 1, 2, 3, 4, 5 in order', why: 'The tree degenerates into a linked list: O(n) operations.', fix: 'Use TreeMap (red-black tree) or shuffle/balance.' },
    { title: 'Treating the heap array as sorted', wrong: 'printing the array of a heap', why: 'Only the parent ≤ child rule holds, not full sortedness.', fix: 'Repeatedly removeMin to obtain sorted order.' },
  ],
  practice: [
    { id: 'tgh-ex1', level: 'beginner', title: 'Height of a BST', statement: 'Read n distinct keys, insert them into a BST in the given order, and print its height (number of nodes on the longest root-to-leaf path).', examples: [{ input: '7\n50 30 70 20 40 60 80', output: '3' }], hints: ['height(t) = 1 + max(height(left), height(right)); null has height 0.'], solutionFile: 'm4-trees-graphs-heaps/Ex1.java', solutionExplain: 'Recursive definition mirrors the tree.', tests: [{ stdin: '7\n50 30 70 20 40 60 80\n', stdout: '3' }, { stdin: '5\n1 2 3 4 5\n', stdout: '5' }, { stdin: '1\n7\n', stdout: '1' }] },
    { id: 'tgh-ex2', level: 'intermediate', title: 'Connected components', statement: 'Read n, m and m undirected edges. Print the number of connected components.', examples: [{ input: '6 3\n0 1\n1 2\n3 4', output: '3' }], hints: ['Start a BFS from every unvisited vertex and count the starts.'], solutionFile: 'm4-trees-graphs-heaps/Ex2.java', solutionExplain: 'Each BFS/DFS discovers exactly one component.', tests: [{ stdin: '6 3\n0 1\n1 2\n3 4\n', stdout: '3' }, { stdin: '3 0\n', stdout: '3' }, { stdin: '2 1\n0 1\n', stdout: '1' }] },
    { id: 'tgh-ex3', level: 'challenge', title: 'Shortest path length', statement: 'Read n, m and the edges of an undirected graph. Print the minimum number of edges from vertex 0 to vertex n−1, or -1.', examples: [{ input: '5 5\n0 1\n0 2\n1 3\n2 3\n3 4', output: '3' }], hints: ['BFS with a distance array.'], solutionFile: 'm4-trees-graphs-heaps/Ex3.java', solutionExplain: 'BFS reaches each vertex first by a shortest path.', tests: [{ stdin: '5 5\n0 1\n0 2\n1 3\n2 3\n3 4\n', stdout: '3' }, { stdin: '3 1\n0 1\n', stdout: '-1' }, { stdin: '1 0\n', stdout: '0' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Inorder traversal of a BST yields…', options: ['sorted keys', 'level order', 'reverse order', 'random order'], answer: 0, explain: 'left, node, right.' },
    { type: 'mcq', q: 'Which data structure drives BFS?', options: ['stack', 'queue', 'heap', 'hash set'], answer: 1, explain: 'FIFO queue.' },
    { type: 'mcq', q: 'The children of heap index 3 (0-based) are at…', options: ['6 and 7', '7 and 8', '4 and 5', '1 and 2'], answer: 1, explain: '2·3+1 = 7 and 2·3+2 = 8.' },
    { type: 'mcq', q: 'Memory for an adjacency matrix of V vertices is…', kind: 'complexity', options: ['O(V)', 'O(V + E)', 'O(V²)', 'O(E²)'], answer: 2, explain: 'One cell per vertex pair.' },
  ],
  interview: ['BFS vs DFS?', 'Why is a BST search O(log n) only if balanced?', 'Adjacency list vs matrix?', 'How does a priority queue work?'],
  videos: ['m4-trees-graphs-heaps', 'm4-trees-graphs-heaps#2'],
  revision: ['BST: left < node < right; inorder sorted; O(height).', 'Graph: matrix O(V²) / list O(V+E). BFS queue → shortest edges; DFS recursion → depth.', 'Heap: parent (i−1)/2, children 2i+1, 2i+2; sift up/down O(log n).', 'Mark visited when enqueuing.'],
});

export const searching: Lesson = lesson({
  id: 'm4-searching',
  dryRun: { algo: 'binary-search', input: { arr: '2,5,8,12,16,23,38,56,72,91', target: '23' }, caption: 'The search window halves on every probe.' },
  module: 'm4',
  title: 'Searching: Linear and Binary Search',
  summary: 'Find an element by scanning, or by halving a sorted range — and the lower-bound variant for duplicates.',
  level: 'beginner',
  track: 'core',
  minutes: 40,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm1-loops', 'm2-boundaries-validation'],
  sources: ['Weightes-substring', 'Toggle-the-switch-_-Alice-Apple-tree'],
  objectives: [
    'Write linear search and binary search (iterative and recursive).',
    'Explain why binary search needs sorted data and runs in O(log n).',
    'Avoid the `(lo + hi) / 2` overflow and the common off-by-one mistakes.',
    'Use lower bound to count occurrences and "binary search on the answer".',
  ],
  intuition: [
    p('**Linear search** inspects elements one by one until it finds the target: works on anything, O(n). **Binary search** needs a **sorted** array: compare the target with the middle element; if the target is smaller it must be in the left half, if larger in the right half — so **half of the remaining candidates vanish every step**.'),
    pre(`
find 9 in [1 3 5 7 9 11 13]
 lo=0 hi=6 mid=3 a[3]=7  <9  → lo=4
 lo=4 hi=6 mid=5 a[5]=11 >9  → hi=4
 lo=4 hi=4 mid=4 a[4]=9  ==  → found at index 4      (3 steps for 7 elements)
`),
    why('After k steps at most n / 2ᵏ elements remain; the search ends when that reaches 1: k = log₂ n. A billion sorted elements need only about 30 comparisons. The loop invariant is "if the target is in the array, it is in a[lo..hi]"; each branch preserves it by discarding a half that cannot contain the target.'),
    h('Beyond "is it there?"'),
    ul('**Lower bound:** first index with `a[i] >= target`. Then `count = lowerBound(t + 1) − lowerBound(t)` gives the number of copies in O(log n).', '**Binary search on the answer:** when a yes/no test is monotone (false… false true… true) you can binary search the *value*. The Alice\'s-apple-tree lesson searches the smallest r with apples(r) ≥ needed.'),
  ],
  syntax: [
    code(`
// closed range [lo, hi] — find an exact match
int lo = 0, hi = a.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
}
return -1;

// half-open [lo, hi) — first index with a[i] >= target (lower bound)
int lo = 0, hi = a.length;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < target) lo = mid + 1; else hi = mid;
}
return lo;
`, 'The two templates'),
    p('The library does it for you on **sorted** data: `Arrays.binarySearch(a, key)` returns the index, or `-(insertionPoint) - 1` when the key is absent.'),
  ],
  tiny: [code(`
int lo = 0, hi = a.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
}
return -1;
`)],
  guided: [prog('m4-searching/SearchDemo.java', 'Linear vs binary on 1000 elements with comparison counts, lower bound, recursion')],
  programs: [
    {
      file: 'm4-searching/SearchDemo.java',
      title: 'Search methods',
      role: 'demo',
      description: 'Comparison counters show 1000 vs 10 steps.',
      walkthrough: [
        { at: 'int mid = lo + (hi - lo) / 2;', text: 'Equivalent to (lo + hi) / 2 but cannot overflow for large indices.' },
        { at: 'if (a[mid] < target) lo = mid + 1;', text: 'Target is to the right of mid: mid itself is excluded (+1).' },
        { at: 'else hi = mid - 1;', text: 'Target is to the left: exclude mid (−1). Forgetting ±1 causes infinite loops.' },
        { at: 'int lo = 0, hi = a.length;                 // hi is exclusive', text: 'Half-open range [lo, hi): the loop ends with lo == hi at the answer.' },
        { at: 'else hi = mid;', text: 'mid might be the answer, so keep it.' },
      ],
    },
  ],
  complexity: [table(['search', 'time', 'needs'], [['linear', 'O(n)', 'nothing'], ['binary', 'O(log n)', 'sorted data, random access'], ['hash lookup', 'O(1) average', 'a hash structure']]), p('Binary search is O(1) space iteratively and O(log n) stack space recursively.')],
  mistakes: [
    { title: 'Binary search on unsorted data', wrong: 'Arrays.binarySearch(unsorted, x)', why: 'The result is undefined (wrong index or negative).', fix: 'Sort first (O(n log n)) or use linear search.' },
    { title: 'lo = mid instead of mid + 1', wrong: 'if (a[mid] < target) lo = mid;', why: 'With lo == mid the range never shrinks → infinite loop.', fix: 'lo = mid + 1;' },
    { title: 'Overflowing midpoint', wrong: 'int mid = (lo + hi) / 2;', why: 'lo + hi can exceed 2³¹ − 1.', fix: 'lo + (hi - lo) / 2' },
  ],
  practice: [
    { id: 'srch-ex1', level: 'beginner', title: 'First occurrence', statement: 'Read n, target and n numbers (unsorted). Print the index of the first occurrence of the target, or -1.', examples: [{ input: '5 7\n4 9 7 1 7', output: '2' }], hints: ['A for loop with an early exit.'], solutionFile: 'm4-searching/Ex1.java', solutionExplain: 'Linear search remembers the first match.', tests: [{ stdin: '5 7\n4 9 7 1 7\n', stdout: '2' }, { stdin: '3 5\n1 2 3\n', stdout: '-1' }] },
    { id: 'srch-ex2', level: 'intermediate', title: 'Binary search', statement: 'Read n, target and a SORTED array of distinct numbers. Print the index of the target or -1 using binary search.', examples: [{ input: '6 9\n1 3 5 7 9 11', output: '4' }], hints: ['lo, hi, mid; discard half each time.'], solutionFile: 'm4-searching/Ex2.java', solutionExplain: 'O(log n) with the standard invariant.', tests: [{ stdin: '6 9\n1 3 5 7 9 11\n', stdout: '4' }, { stdin: '3 4\n1 2 3\n', stdout: '-1' }, { stdin: '1 5\n5\n', stdout: '0' }] },
    { id: 'srch-ex3', level: 'challenge', title: 'Count occurrences', statement: 'In a sorted array (duplicates allowed) print how many times the target occurs, in O(log n).', examples: [{ input: '8 2\n1 2 2 2 2 3 5 9', output: '4' }], hints: ['lowerBound(target + 1) − lowerBound(target).'], solutionFile: 'm4-searching/Ex3.java', solutionExplain: 'Two lower-bound searches bracket the run of equal values.', tests: [{ stdin: '8 2\n1 2 2 2 2 3 5 9\n', stdout: '4' }, { stdin: '3 7\n1 2 3\n', stdout: '0' }, { stdin: '4 1\n1 1 1 1\n', stdout: '4' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'How many comparisons does binary search need (at most) for 1 000 000 sorted elements?', options: ['10', '20', '1000', '500000'], answer: 1, explain: '⌈log₂ 10⁶⌉ = 20.' },
    { type: 'mcq', q: 'Binary search requires the data to be…', options: ['unique', 'sorted', 'positive', 'in a list'], answer: 1, explain: 'Sorted order lets us discard a half.' },
    { type: 'trace', q: 'Binary search for 7 in [1, 3, 5, 7, 9, 11, 13].', code: 'int lo = 0, hi = 6;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == 7) break;\n    if (a[mid] < 7) lo = mid + 1; else hi = mid - 1;\n}', items: [{ prompt: 'first mid', answer: '3' }, { prompt: 'a[first mid]', answer: '7' }], explain: 'mid = 3 and a[3] = 7: found at the first probe.' },
    { type: 'mcq', q: 'The time complexity of binary search is…', kind: 'complexity', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, explain: 'The range halves each step.' },
  ],
  interview: ['Why is binary search O(log n)?', 'What is the invariant?', 'How do you search a rotated sorted array?', 'What is "binary search on the answer"?'],
  videos: ['m4-searching', 'm4-searching#2'],
  revision: ['Linear O(n) any data; binary O(log n) sorted data.', 'mid = lo + (hi − lo)/2; lo = mid+1 / hi = mid−1.', 'lowerBound for duplicates and counting.', 'Monotone test → binary search on the answer.'],
});

export const sortingElementary: Lesson = lesson({
  id: 'm4-sorting-elementary',
  dryRun: { algo: 'insertion-sort', input: { arr: '5,2,4,6,1,3' }, caption: 'A sorted prefix grows by one element per step.' },
  module: 'm4',
  title: 'Elementary Sorting: Bubble, Insertion, Selection; Stability',
  summary: 'The three O(n²) sorts side by side, with comparison and swap counts, and what "stable" and "in-place" mean.',
  level: 'beginner',
  track: 'core',
  minutes: 45,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm1-loops'],
  sources: ['Quick_-Selection-Sort'],
  objectives: [
    'Trace bubble, insertion and selection sort by hand.',
    'State best, average and worst-case time of each and their swap/shift behaviour.',
    'Define stable and in-place and classify each algorithm.',
    'Explain why insertion sort is the best of the three on nearly sorted data.',
  ],
  intuition: [
    table(['algorithm', 'idea', 'best', 'worst', 'swaps / shifts', 'stable', 'in place'], [['bubble', 'swap adjacent out-of-order pairs; largest sinks each pass', 'O(n) with early exit', 'O(n²)', 'up to n²/2 swaps', 'yes', 'yes'], ['insertion', 'insert the next item into the sorted prefix', 'O(n)', 'O(n²)', 'one shift per inversion', 'yes', 'yes'], ['selection', 'pick the minimum, swap to the front', 'O(n²)', 'O(n²)', '≤ n − 1 swaps', 'no', 'yes']]),
    why('Every adjacent-swap sort must fix each **inversion** (a pair out of order) one at a time, and a random array has about n²/4 inversions — hence Θ(n²). Insertion sort does work proportional to n + inversions, so it is **O(n) on nearly sorted input** and is used inside real library sorts for small ranges. **Stable** means equal keys keep their input order (essential when sorting by one field after another); **in place** means O(1) extra memory.'),
    p('Rule of thumb: for n ≤ ~50, insertion sort is perfectly fine; beyond that use O(n log n) algorithms (merge sort, quick sort, `Arrays.sort`).'),
  ],
  syntax: [
    code(`
// the swap idiom (needs a temporary)
int t = a[i]; a[i] = a[j]; a[j] = t;

// library sorts — in practice use these
Arrays.sort(a);                         // int[] ascending (dual-pivot quicksort)
Arrays.sort(a, 2, 7);                   // only indices 2 … 6
Integer[] boxed = {5, 2, 9};
Arrays.sort(boxed, Collections.reverseOrder());   // objects need Integer[], not int[]
Collections.sort(list);                 // List<T> ascending (stable merge sort / TimSort)
list.sort((x, y) -> y - x);             // with a comparator
`),
  ],
  tiny: [code(`
for (int i = 1; i < a.length; i++) {
    int key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
    a[j + 1] = key;
}
`)],
  guided: [prog('m4-sorting-elementary/ElementarySorts.java', 'Bubble, insertion and selection side by side with counters, plus a stability demonstration')],
  programs: [
    {
      file: 'm4-sorting-elementary/ElementarySorts.java',
      title: 'Three sorts, one test harness',
      role: 'demo',
      description: 'The harness prints comparisons and swaps for random and already sorted input.',
      walkthrough: [
        { at: 'if (!swapped) break;', text: 'Early exit: a pass without swaps proves the array is sorted — best case O(n).' },
        { at: 'if (a[j] <= key) break;', text: '<= stops at equal elements, so they keep their order (stable).' },
        { at: 'a[j + 1] = a[j];', text: 'Shifting right instead of swapping: one write per step.' },
        { at: 'run("selection", ElementarySorts::selection, data);', text: 'Method references pass each algorithm to the same measuring code.' },
      ],
    },
  ],
  complexity: [p('All three are **O(n²)** in the worst and average case; space O(1). The counters on a sorted input show bubble (with early exit) and insertion doing only n−1 comparisons while selection still does n(n−1)/2.')],
  mistakes: [
    { title: 'Bubble sort without the shrinking bound', wrong: 'for (int i = 0; i < n - 1; i++)   // every pass', why: 'Correct but re-examines the already-placed tail; wastes ~half the work.', fix: 'i < n - 1 - pass' },
    { title: 'Insertion sort overwriting the key', wrong: 'a[j + 1] = a[j];   // key not saved', why: 'The value being inserted is lost.', fix: 'int key = a[i]; ... a[j + 1] = key;' },
    { title: 'Using > instead of >= for stability', wrong: 'while (j >= 0 && a[j] >= key)', why: 'Moves equal elements past each other: not stable.', fix: 'a[j] > key' },
  ],
  practice: [
    { id: 'elem-ex1', level: 'beginner', title: 'Bubble sort with swap count', statement: 'Read n numbers. Bubble-sort them; print the sorted array and, on the next line, the number of swaps performed.', examples: [{ input: '5\n4 3 2 1 5', output: '1 2 3 4 5\n6' }], hints: ['The swap count equals the number of inversions.'], solutionFile: 'm4-sorting-elementary/Ex1.java', solutionExplain: 'Each swap removes exactly one inversion.', tests: [{ stdin: '5\n4 3 2 1 5\n', stdout: '1 2 3 4 5\n6' }, { stdin: '3\n1 2 3\n', stdout: '1 2 3\n0' }, { stdin: '2\n2 1\n', stdout: '1 2\n1' }] },
    { id: 'elem-ex2', level: 'intermediate', title: 'Insertion steps', statement: 'Read n numbers. After each insertion step i = 1..n−1 print the whole array.', examples: [{ input: '4\n5 2 4 1', output: '2 5 4 1\n2 4 5 1\n1 2 4 5' }], hints: ['Print after placing the key.'], solutionFile: 'm4-sorting-elementary/Ex2.java', solutionExplain: 'The sorted prefix grows by one element per step.', tests: [{ stdin: '4\n5 2 4 1\n', stdout: '2 5 4 1\n2 4 5 1\n1 2 4 5' }, { stdin: '2\n1 2\n', stdout: '1 2' }] },
    { id: 'elem-ex3', level: 'challenge', title: 'Stable by key', statement: 'Read n pairs `key label`. Sort them by key with a stable algorithm and print the labels in order, separated by spaces.', examples: [{ input: '5\n2 a\n1 b\n2 c\n1 d\n2 e', output: 'b d a c e' }], hints: ['Insertion sort with a strict > comparison on the keys.'], solutionFile: 'm4-sorting-elementary/Ex3.java', solutionExplain: 'Equal keys never pass each other, so labels with equal keys keep input order.', tests: [{ stdin: '5\n2 a\n1 b\n2 c\n1 d\n2 e\n', stdout: 'b d a c e' }, { stdin: '2\n1 x\n1 y\n', stdout: 'x y' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Which of these sorts is NOT stable?', options: ['bubble', 'insertion', 'selection', 'merge'], answer: 2, explain: 'Selection sort swaps across equal elements.' },
    { type: 'mcq', q: 'Insertion sort on an already sorted array takes…', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 0, explain: 'One comparison per element.' },
    { type: 'output', q: 'How many swaps does bubble sort make on {3, 2, 1}?', code: '// adjacent swaps only', answer: '3', explain: '3 inversions → 3 swaps.' },
    { type: 'mcq', q: 'In-place means…', options: ['the array is already sorted', 'O(1) extra memory', 'no comparisons', 'stable'], answer: 1, explain: 'Rearranges within the input.' },
  ],
  interview: ['Which elementary sort do you prefer and why?', 'What is an inversion?', 'Stable vs unstable?', 'Why does insertion sort suit small arrays?'],
  videos: ['m4-sorting-elementary', 'm4-sorting-elementary#2'],
  revision: ['Bubble: adjacent swaps, early exit O(n) best. Insertion: shift into sorted prefix, adaptive. Selection: ≤ n−1 swaps, always n².', 'All O(n²), O(1) space; bubble & insertion stable, selection not.', 'Swaps = inversions.', 'n small → insertion; else O(n log n).'],
});

export const mergeSort: Lesson = lesson({
  id: 'm4-merge-sort',
  dryRun: { algo: 'merge-sort', input: { arr: '38,27,43,3,9,82,10' }, caption: 'Small sorted runs merge into bigger ones.' },
  module: 'm4',
  title: 'Merge Sort and Divide and Conquer',
  summary: 'Split, sort each half, merge: a guaranteed O(n log n), stable sort — and counting inversions as a bonus.',
  level: 'intermediate',
  track: 'core',
  minutes: 45,
  essential: true,
  prerequisites: ['m2-recursion', 'm4-sorting-elementary'],
  sources: ['Karatsuba-Algorithm', 'Quick_-Selection-Sort'],
  objectives: [
    'Describe divide and conquer: divide, conquer, combine.',
    'Implement the merge of two sorted ranges and the recursive merge sort.',
    'Derive O(n log n) from the recursion tree and state its O(n) extra space.',
    'Use the merge step to count inversions.',
  ],
  intuition: [
    p('**Divide and conquer** solves a problem by (1) **dividing** it into smaller instances of the same problem, (2) **conquering** them recursively, (3) **combining** the answers. Merge sort: split the array in half, sort each half, then **merge** the two sorted halves.'),
    pre(`
[38 27 43 3 9 82 10]
 ├─ [38 27 43 3]           ├─ [9 82 10]
 │   ├─ [38 27] → [27 38]  │   ├─ [9] [82 10] → [10 82]
 │   └─ [43 3]  → [3 43]   │   └─ merge → [9 10 82]
 └─ merge → [3 27 38 43]
 merge → [3 9 10 27 38 43 82]
`),
    why('**Merging** two sorted lists is easy and linear: keep a pointer at the front of each and repeatedly take the smaller front element. The recursion has log₂ n levels (halving), and every level touches each element once while merging → n · log₂ n. Unlike quick sort the split is always exactly in the middle, so the worst case is the same as the average. Taking the LEFT element on ties makes the sort **stable**.'),
    p('The same merge can **count inversions**: whenever an element of the right half is taken before the remaining left elements, it jumps over all of them — add `mid − i` to the counter. That counts every out-of-order pair in O(n log n).'),
  ],
  syntax: [
    code(`
static void mergeSort(int[] a, int[] tmp, int lo, int hi) {   // sorts a[lo .. hi)
    if (hi - lo < 2) return;                    // base case
    int mid = (lo + hi) >>> 1;
    mergeSort(a, tmp, lo, mid);
    mergeSort(a, tmp, mid, hi);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi)  tmp[k++] = a[j++];
    System.arraycopy(tmp, lo, a, lo, hi - lo);  // copy the merged run back
}
mergeSort(a, new int[a.length], 0, a.length);
`, 'Skeleton (half-open ranges)'),
    tip('`System.arraycopy(src, srcPos, dest, destPos, length)` and `Arrays.copyOfRange(a, from, to)` are the fast ways to move blocks of an array.'),
  ],
  tiny: [code(`
// merge a[lo..mid) and a[mid..hi) using tmp
while (i < mid && j < hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
while (i < mid) tmp[k++] = a[i++];
while (j < hi)  tmp[k++] = a[j++];
`)],
  guided: [prog('m4-merge-sort/MergeSortDemo.java', 'Merge sort with a comparison counter, an inversion counter, and a 65 536-element test')],
  programs: [
    {
      file: 'm4-merge-sort/MergeSortDemo.java',
      title: 'Merge sort',
      role: 'optimized',
      description: 'Half-open ranges [lo, hi) and one reusable temporary array.',
      walkthrough: [
        { at: 'if (hi - lo < 2) return;', text: 'Base case: 0 or 1 elements are sorted.' },
        { at: 'int mid = (lo + hi) >>> 1;', text: 'Unsigned shift: overflow-safe midpoint.' },
        { at: 'if (a[i] <= a[j]) tmp[k++] = a[i++];', text: '<= takes from the left on ties: stability.' },
        { at: 'System.arraycopy(tmp, lo, a, lo, hi - lo);', text: 'Copy the merged range back into the original array.' },
        { at: 'inv += mid - i;', text: 'a[j] is smaller than all remaining left elements: that is (mid − i) inversions at once.' },
      ],
    },
  ],
  complexity: [
    math('T(n) = 2·T(n/2) + O(n)   ⟹   T(n) = O(n log n)'),
    p('Every level of the recursion tree does about n work and there are log₂ n levels. For n = 65 536 the demo needs 524 288 comparisons (about n·log₂n/2, since merging stops when one side empties). Extra space **O(n)** for the temporary array; recursion depth O(log n). Merge sort is the algorithm behind `List.sort` for objects (as TimSort, a merge-sort hybrid).'),
  ],
  mistakes: [
    { title: 'Allocating a new array in every merge', wrong: 'int[] tmp = new int[hi - lo];   // inside merge', why: 'Many small allocations slow it down (still correct).', fix: 'Allocate one tmp array of size n once.' },
    { title: 'Forgetting the leftovers', wrong: '// after the main while loop, nothing else', why: 'When one side runs out the other side\'s remaining elements are never copied.', fix: 'while (i < mid) …; while (j < hi) …;' },
    { title: 'Wrong midpoint for half-open ranges', wrong: 'mergeSort(a, lo, mid - 1); mergeSort(a, mid, hi);', why: 'Mixing inclusive and exclusive bounds drops an element.', fix: 'Use [lo, mid) and [mid, hi) consistently.' },
  ],
  practice: [
    { id: 'merge-ex1', level: 'beginner', title: 'Merge sort', statement: 'Read n numbers and print them sorted using your own merge sort.', examples: [{ input: '7\n38 27 43 3 9 82 10', output: '3 9 10 27 38 43 82' }], hints: ['Recurse on halves, then merge with a temp array.'], solutionFile: 'm4-merge-sort/Ex1.java', solutionExplain: 'Standard top-down merge sort.', tests: [{ stdin: '7\n38 27 43 3 9 82 10\n', stdout: '3 9 10 27 38 43 82' }, { stdin: '1\n5\n', stdout: '5' }, { stdin: '4\n2 2 1 1\n', stdout: '1 1 2 2' }] },
    { id: 'merge-ex2', level: 'intermediate', title: 'Merge two sorted arrays', statement: 'Read n, m and two sorted arrays. Print their merge as one sorted array.', examples: [{ input: '3 4\n1 4 9\n2 3 10 11', output: '1 2 3 4 9 10 11' }], hints: ['Two pointers; take the smaller front value.'], solutionFile: 'm4-merge-sort/Ex2.java', solutionExplain: 'The merge step on its own: O(n + m).', tests: [{ stdin: '3 4\n1 4 9\n2 3 10 11\n', stdout: '1 2 3 4 9 10 11' }, { stdin: '1 1\n5\n5\n', stdout: '5 5' }] },
    { id: 'merge-ex3', level: 'challenge', title: 'Count inversions', statement: 'Read n (≤ 10⁵) numbers and print the number of pairs i < j with a[i] > a[j]. Use O(n log n).', examples: [{ input: '5\n2 4 1 3 5', output: '3' }], hints: ['During the merge, when you take from the right half add mid − i.'], solutionFile: 'm4-merge-sort/Ex3.java', solutionExplain: 'Each right-half element that jumps ahead passes all remaining left-half elements.', tests: [{ stdin: '5\n2 4 1 3 5\n', stdout: '3' }, { stdin: '3\n3 2 1\n', stdout: '3' }, { stdin: '4\n1 2 3 4\n', stdout: '0' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'What is the time complexity of merge sort in the worst case?', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1, explain: 'Always n log n.' },
    { type: 'mcq', q: 'Merge sort\'s extra space is…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, explain: 'The temporary array.' },
    { type: 'mcq', q: 'The three steps of divide and conquer are…', options: ['sort, search, merge', 'divide, conquer, combine', 'split, copy, delete', 'read, compute, print'], answer: 1, explain: 'Divide, conquer (recurse), combine.' },
    { type: 'output', q: 'How many inversions does {3, 1, 2} have?', code: '// pairs (3,1), (3,2)', answer: '2', explain: '3 > 1 and 3 > 2; 1 < 2.' },
  ],
  interview: ['Why is merge sort O(n log n)?', 'Merge sort vs quick sort?', 'Why is merge sort good for linked lists?', 'How do you count inversions?'],
  videos: ['m4-merge-sort', 'm4-merge-sort#2'],
  revision: ['Divide → recurse → merge; base case size ≤ 1.', 'Merge two sorted ranges in O(n); take left on ties for stability.', 'T(n) = 2T(n/2) + n → O(n log n); O(n) space.', 'Inversions: add mid − i when taking from the right.'],
  sourceNotes: { discrepancies: ['Merge sort is not itself a slide topic; it is added because divide and conquer (Karatsuba, quick sort) needs a clean worked example and "merge sort" appears in the lecture\'s Big-O cheat sheet as the O(n log n) example.'] },
});

export const iterationVsRecursion: Lesson = lesson({
  id: 'm4-iteration-vs-recursion',
  dryRun: { algo: 'fib-memo', input: { n: '7' }, caption: 'Cache hits replace the exponential repeated work.' },
  module: 'm4',
  title: 'Iteration versus Recursion',
  summary: 'The same problem solved with loops and with recursion: cost, memoisation, stack depth, and converting between them.',
  level: 'intermediate',
  track: 'core',
  minutes: 35,
  essential: false,
  prerequisites: ['m2-recursion', 'm1-loops'],
  sources: ['Josephus-trap', 'Maneuvering'],
  objectives: [
    'Convert simple recursions into loops and vice versa.',
    'Compare time and stack costs of the two styles (factorial, Fibonacci, Josephus).',
    'Apply memoisation to a branching recursion.',
    'Decide which style is clearer and safer for a given problem.',
  ],
  intuition: [
    p('Anything a recursion can compute a loop can compute (with an explicit stack if needed), and vice versa. The choice is about **clarity** and **resource use**.'),
    table(['', 'iteration', 'recursion'], [['memory', 'O(1) loop variables', 'one stack frame per active call (O(depth))'], ['speed', 'no call overhead', 'small overhead per call'], ['clarity', 'good for linear scans', 'excellent for trees, backtracking, divide and conquer'], ['risk', 'off-by-one in bounds', 'StackOverflowError for very deep chains'], ['when', 'simple counting / accumulating', 'the problem is defined in terms of smaller copies of itself']]),
    why('Josephus, grid paths and Fibonacci show both faces. The Josephus recurrence `J(n) = (J(n−1) + k) mod n` is naturally recursive, but because each call depends only on the previous one it becomes a 3-line loop that runs bottom-up with O(1) memory. Fibonacci\'s two overlapping calls explode exponentially; **memoisation** (cache each answer in a map) cuts 2.7 million calls for fib(30) to 59, and the bottom-up loop needs only two variables.'),
    ul('**Tail-position recursion** can always be turned into a loop mechanically; Java does not do this optimisation for you.', 'Deep recursion (10⁵ levels or more) risks `StackOverflowError`; iterate or use an explicit `Deque` as a stack.', 'Exploring all choices (subsets, permutations, N-Queens) is much shorter recursively; converting it to loops needs an explicit stack.'),
  ],
  syntax: [
    code(`
// recursion
long f(int n) { return n <= 1 ? 1 : n * f(n - 1); }
// the same computation as a loop
long r = 1;
for (int i = 2; i <= n; i++) r *= i;

// memoisation: a cache turns exponential recursion into linear
static long[] memo = new long[91];
static long fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}

// explicit stack replaces the call stack
Deque<Integer> stack = new ArrayDeque<>();
stack.push(start);
while (!stack.isEmpty()) { int x = stack.pop(); /* process x, push children */ }
`),
  ],
  tiny: [code(`
// recursion
long f(int n) { return n <= 1 ? 1 : n * f(n - 1); }
// iteration
long r = 1;
for (int i = 2; i <= n; i++) r *= i;
`)],
  guided: [prog('m4-iteration-vs-recursion/IterationVsRecursion.java', 'factorial, Fibonacci three ways with call counts, subset sum, and an explicit stack')],
  programs: [
    {
      file: 'm4-iteration-vs-recursion/IterationVsRecursion.java',
      title: 'Same answers, different costs',
      role: 'demo',
      description: 'fib(30) takes 2 692 537 calls recursively, 59 with memoisation and 30 loop steps iteratively.',
      walkthrough: [
        { at: 'static long fibMemo(int n)', text: 'Check the cache first; compute and store only when missing.' },
        { at: 'static long fibIterative(int n)', text: 'Bottom-up: keep only the last two values.' },
        { at: 'static boolean subsetSum(int[] a, int i, int target)', text: 'Two choices per element: take it or leave it — a natural recursion.' },
        { at: 'catch (StackOverflowError e)', text: 'Depth 10 000 000 overflows the default stack; the explicit-stack loop below handles it.' },
      ],
    },
  ],
  complexity: [table(['problem', 'recursive time', 'iterative time', 'extra space'], [['factorial', 'O(n)', 'O(n)', 'O(n) stack vs O(1)'], ['fib naive', 'O(φⁿ)', 'O(n)', 'O(n) stack vs O(1)'], ['fib memoised', 'O(n)', '—', 'O(n)'], ['Josephus', 'O(n)', 'O(n)', 'O(n) stack vs O(1)']])],
  mistakes: [
    { title: 'Using naive recursion for Fibonacci/DP', wrong: 'fib(50)   // ~2·10^10 calls', why: 'Exponential time.', fix: 'Memoise or iterate.' },
    { title: 'Recursing 10⁶ deep', wrong: 'sumRecursive(1_000_000)', why: 'StackOverflowError on default settings.', fix: 'Loop (or raise -Xss only as a last resort).' },
    { title: 'Forgetting the cache check', wrong: 'long v = fib(n-1) + fib(n-2); memo.put(n, v);   // never reads memo', why: 'No benefit: still exponential.', fix: 'if (memo.containsKey(n)) return memo.get(n);' },
  ],
  practice: [
    { id: 'ivr-ex1', level: 'beginner', title: 'gcd both ways', statement: 'Read a and b. Print the gcd computed iteratively and recursively, separated by a space.', examples: [{ input: '84 36', output: '12 12' }], hints: ['The loop and the recursion use the same rule.'], solutionFile: 'm4-iteration-vs-recursion/Ex1.java', solutionExplain: 'while (b != 0) vs return gcd(b, a % b).', tests: [{ stdin: '84 36\n', stdout: '12 12' }, { stdin: '7 13\n', stdout: '1 1' }] },
    { id: 'ivr-ex2', level: 'intermediate', title: 'Climbing stairs', statement: 'You may climb 1 or 2 steps at a time. Read n and print the number of distinct ways to climb n steps, using a loop.', examples: [{ input: '10', output: '89' }], hints: ['ways(n) = ways(n−1) + ways(n−2): Fibonacci.'], solutionFile: 'm4-iteration-vs-recursion/Ex2.java', solutionExplain: 'Bottom-up with two variables.', tests: [{ stdin: '10\n', stdout: '89' }, { stdin: '1\n', stdout: '1' }, { stdin: '2\n', stdout: '2' }] },
    { id: 'ivr-ex3', level: 'beginner', title: 'Reverse a string', statement: 'Read a word. Print its reverse computed recursively, a space, then computed with a loop.', examples: [{ input: 'stressed', output: 'desserts desserts' }], hints: ['reverse(s) = reverse(s.substring(1)) + s.charAt(0).'], solutionFile: 'm4-iteration-vs-recursion/Ex3.java', solutionExplain: 'Same result; the recursion creates a new string at each level.', tests: [{ stdin: 'stressed\n', stdout: 'desserts desserts' }, { stdin: 'a\n', stdout: 'a a' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Which uses O(1) extra space for factorial?', options: ['recursion', 'loop', 'both', 'neither'], answer: 1, explain: 'Recursion needs a stack frame per level.' },
    { type: 'mcq', q: 'Memoisation turns naive Fibonacci from…', options: ['O(n) to O(1)', 'O(2ⁿ) to O(n)', 'O(n²) to O(n)', 'O(n) to O(log n)'], answer: 1, explain: 'Each value is computed once.' },
    { type: 'mcq', q: 'Which is best solved by recursion?', kind: 'choose-algorithm', options: ['sum of an array', 'all subsets of a set', 'maximum of an array', 'counting digits'], answer: 1, explain: 'Branching choices form a tree.' },
    { type: 'mcq', q: 'What error may deep recursion cause?', options: ['OutOfMemoryError: heap', 'StackOverflowError', 'ArithmeticException', 'ClassCastException'], answer: 1, explain: 'The call stack is exhausted.' },
  ],
  interview: ['How would you convert recursion to iteration?', 'What is memoisation?', 'Tail recursion?', 'When is recursion clearer?'],
  videos: ['m4-iteration-vs-recursion', 'm4-iteration-vs-recursion#2'],
  revision: ['Loop O(1) space; recursion O(depth) stack.', 'Branching recursion → memoise / bottom-up.', 'Deep chains → loop or explicit stack.', 'Trees, backtracking, D&C → recursion reads best.'],
});

export const paradigms: Lesson = lesson({
  id: 'm4-paradigms',
  dryRun: { algo: 'coin-dp', input: { coins: '4,3,1', amount: '6' }, caption: 'DP finds 3 + 3 where greedy settles for 4 + 1 + 1.' },
  module: 'm4',
  title: 'Algorithm Design Paradigms',
  summary: 'Brute force, divide and conquer, greedy, backtracking and dynamic programming — recognise the pattern, pick the tool.',
  level: 'intermediate',
  track: 'core',
  minutes: 50,
  essential: true,
  prerequisites: ['m2-recursion', 'm4-complexity-intro'],
  sources: ['N-Queens', 'Karatsuba-Algorithm', 'Weightes-substring', 'Maneuvering'],
  objectives: [
    'Describe each paradigm in one sentence and give an archive example.',
    'Decide when greedy is safe (and show a counterexample when it is not).',
    'Use dynamic programming to repair a failing greedy solution (coin change).',
    'Recognise the signals: sorted data, choices, overlapping sub-problems, constraints.',
  ],
  intuition: [
    table(['paradigm', 'idea', 'signal', 'archive examples'], [['brute force', 'try every candidate', 'tiny input; need a baseline', 'trial division, O(n²) leaders, all-subsets sum'], ['divide & conquer', 'split, solve, combine', 'problem splits into independent halves', 'merge sort, quick sort, Karatsuba, block swap'], ['greedy', 'take the best local choice', 'a "best next step" provably extends to the optimum', 'weighted string, activity selection, Euclid'], ['backtracking', 'build step by step, undo', 'constraints prune a search tree', 'N-Queens, maze, Hamiltonian cycle, permutations, knight\'s tour'], ['dynamic programming', 'store answers to overlapping sub-problems', 'same sub-problem appears again', 'grid paths, Fibonacci, coin change']]),
    why('**Greedy** is fast but only valid when a local best choice never ruins the global optimum (the weights 1, 3, 12, 60 each divide the next, so taking the biggest letter first is optimal). With coins {4, 3, 1} and amount 6 greedy takes 4+1+1 (3 coins) but 3+3 uses 2: greedy fails, and **dynamic programming** — which tries every coin for every smaller amount and remembers the best — is correct. **Backtracking** is brute force with early rejection: abandon a partial solution the moment it violates a constraint.'),
    h('How to choose'),
    ol('Can you solve it by brute force? How big is the input? (If n ≤ 20 maybe 2ⁿ is fine.)', 'Is there a sorted order, a monotone property or a "best choice"? Try greedy — then try to break it.', 'Do sub-problems repeat? Define the DP state and recurrence.', 'Are there constraints that cut a search tree? Backtrack.', 'Does the problem split into independent halves? Divide and conquer.'),
  ],
  syntax: [
    code(`
// GREEDY: sort, then take the best remaining choice
sort(items by key);  for (item : items) if (fits(item)) take(item);

// BACKTRACKING: choose - explore - un-choose
void solve(int step) {
    if (complete(step)) { record(); return; }
    for (option : options(step)) {
        if (!valid(option)) continue;          // prune
        apply(option);  solve(step + 1);  undo(option);
    }
}

// DYNAMIC PROGRAMMING: state, recurrence, base
long[] dp = new long[n + 1];
dp[0] = base;
for (int i = 1; i <= n; i++) dp[i] = combine(dp[i - 1], dp[i - 2] /* ... */);

// DIVIDE AND CONQUER: split, solve, combine
R solve(P p) { if (small(p)) return direct(p); return combine(solve(left(p)), solve(right(p))); }
`, 'Skeletons (pseudo-Java)'),
  ],
  tiny: [code(`
// greedy fails: coins {4, 3, 1}, amount 6
// greedy:        4 + 1 + 1 = 3 coins
// optimal (DP):  3 + 3     = 2 coins
`)],
  guided: [prog('m4-paradigms/Paradigms.java', 'One small program per paradigm, including the greedy-vs-DP coin example')],
  programs: [
    {
      file: 'm4-paradigms/Paradigms.java',
      title: 'Five paradigms',
      role: 'demo',
      description: 'Each static method is a minimal example of its paradigm.',
      walkthrough: [
        { at: 'for (int mask = 0; mask < (1 << n); mask++)', text: 'Brute force: every subset is one n-bit mask: 2ⁿ candidates.' },
        { at: 'return Math.max(maxDC(a, lo, mid), maxDC(a, mid + 1, hi));', text: 'Divide and conquer: combine the answers of two halves.' },
        { at: 'count += amount / c;', text: 'Greedy: take as many of the biggest coin as possible, then move on.' },
        { at: 'best[x] = Math.min(best[x], best[x - c] + 1);', text: 'DP: the best way for amount x extends the best way for x − c by one coin.' },
        { at: 'ways(remaining - 1, soFar + " 1", out);', text: 'Backtracking: try a 1, then a 2, by recursion — the "undo" is implicit because the string is immutable.' },
      ],
    },
  ],
  complexity: [table(['paradigm', 'typical cost'], [['brute force subsets', 'O(2ⁿ · n)'], ['divide & conquer (merge sort)', 'O(n log n)'], ['greedy (sort + scan)', 'O(n log n)'], ['backtracking', 'exponential worst case, much less with pruning'], ['DP coin change', 'O(amount × coins)']])],
  mistakes: [
    { title: 'Assuming greedy is always right', wrong: 'coinsGreedy({4, 3, 1}, 6)', why: 'Counterexample above.', fix: 'Prove it, or test against brute force/DP on small inputs.' },
    { title: 'Using DP without identifying the state', wrong: '// "memoise everything"', why: 'If every sub-problem is distinct there is nothing to reuse.', fix: 'Write the recurrence and check that sub-problems overlap.' },
    { title: 'Backtracking without pruning', wrong: 'generate all N^N boards then test', why: 'Hopelessly slow.', fix: 'Test constraints at each step (isSafe).' },
  ],
  practice: [
    { id: 'par-ex1', level: 'intermediate', title: 'Activity selection (greedy)', statement: 'Read n intervals `start end`. Print the maximum number of mutually non-overlapping intervals (touching endpoints are allowed).', examples: [{ input: '5\n1 3\n2 4\n3 5\n0 6\n5 7', output: '3' }], hints: ['Sort by end time; always take the earliest-finishing compatible interval.'], solutionFile: 'm4-paradigms/Ex1.java', solutionExplain: 'The earliest finish leaves the most room — a provable greedy choice.', tests: [{ stdin: '5\n1 3\n2 4\n3 5\n0 6\n5 7\n', stdout: '3' }, { stdin: '1\n0 1\n', stdout: '1' }, { stdin: '3\n1 5\n2 3\n3 4\n', stdout: '2' }] },
    { id: 'par-ex2', level: 'intermediate', title: 'Fewest coins (DP)', statement: 'Read k, the k coin values and an amount. Print the fewest coins needed, or -1.', examples: [{ input: '3\n4 3 1\n6', output: '2' }], hints: ['best[x] = 1 + min over coins of best[x − c].'], solutionFile: 'm4-paradigms/Ex2.java', solutionExplain: 'Bottom-up over amounts 1..amount.', tests: [{ stdin: '3\n4 3 1\n6\n', stdout: '2' }, { stdin: '1\n2\n3\n', stdout: '-1' }, { stdin: '3\n25 10 1\n30\n', stdout: '3' }] },
    { id: 'par-ex3', level: 'challenge', title: 'No two adjacent ones (backtracking)', statement: 'Read n (≤ 10). Print all binary strings of length n with no two consecutive 1s, in increasing order.', examples: [{ input: '3', output: '000\n001\n010\n100\n101' }], hints: ['Recurse by length; only append 1 if the last char is not 1.'], solutionFile: 'm4-paradigms/Ex3.java', solutionExplain: 'The constraint is checked as the string grows, pruning invalid branches immediately.', tests: [{ stdin: '3\n', stdout: '000\n001\n010\n100\n101' }, { stdin: '1\n', stdout: '0\n1' }, { stdin: '2\n', stdout: '00\n01\n10' }] },
  ],
  quiz: [
    { type: 'match', q: 'Match each problem to its paradigm.', pairs: [['N-Queens', 'backtracking'], ['merge sort', 'divide and conquer'], ['shortest string of given weight', 'greedy'], ['grid paths count', 'dynamic programming']], explain: 'See the table in the lesson.' },
    { type: 'output', q: 'How many coins does the greedy method use for 30 with {25, 10, 5, 1}?', code: '// greedy takes 25, then 5', answer: '2', explain: '25 + 5.' },
    { type: 'mcq', q: 'A greedy algorithm is correct when…', options: ['it is fast', 'the best local choice leads to a global optimum', 'the array is sorted', 'recursion is used'], answer: 1, explain: 'Provability is the key.' },
    { type: 'mcq', q: 'Overlapping sub-problems suggest…', kind: 'choose-algorithm', options: ['greedy', 'dynamic programming', 'binary search', 'hashing'], answer: 1, explain: 'Store and reuse answers.' },
  ],
  interview: ['Greedy vs DP?', 'Give a case where greedy fails.', 'Backtracking vs brute force?', 'How do you recognise a DP problem?'],
  videos: ['m4-paradigms', 'm4-paradigms#2'],
  revision: ['Brute force (try all), D&C (split-solve-combine), greedy (local best), backtracking (choose-explore-undo), DP (store sub-answers).', 'Greedy needs proof — coins {4,3,1} break it.', 'DP: state + recurrence + base.', 'Prune early in backtracking.'],
});

export const complexityIntro: Lesson = lesson({
  id: 'm4-complexity-intro',
  dryRun: { algo: 'growth-table', input: { max: '16' }, caption: 'Double n and see which columns explode.' },
  module: 'm4',
  title: 'Time Complexity and Big-O Notation',
  summary: 'Measure an algorithm by how its work grows with the input: Big-O, Big-Ω, Big-Θ, the common classes and the cheat sheet.',
  level: 'beginner',
  track: 'core',
  minutes: 45,
  essential: true,
  prerequisites: ['m1-loops', 'm0-intro-algorithms'],
  sources: ['Time-_-Space-complexity-1_1', 'Time-_-Space-complexity-1_2'],
  objectives: [
    'Define time complexity as a count of basic operations as a function of input size n.',
    'State and use Big-O (upper bound), Big-Ω (lower bound) and Big-Θ (tight bound).',
    'Order the common classes from O(1) to O(n!) and give an example of each.',
    'Simplify an operation count by dropping constants and lower-order terms.',
  ],
  intuition: [
    p('We cannot compare algorithms by stopwatch: the answer depends on the computer, the language and the data. Instead we **count basic operations** as a function of the input size **n** and look at how that function **grows**. Constant factors and small terms stop mattering when n is large.'),
    table(['class', 'name', 'example', 'n = 10', 'n = 1000', 'n = 10⁶'], [['O(1)', 'constant', 'odd or even; array access', '1', '1', '1'], ['O(log n)', 'logarithmic', 'binary search', '3', '10', '20'], ['O(√n)', 'square root', 'trial division', '3', '32', '1000'], ['O(n)', 'linear', 'find the maximum', '10', '10³', '10⁶'], ['O(n log n)', 'linearithmic', 'merge sort', '33', '10⁴', '2·10⁷'], ['O(n²)', 'quadratic', 'bubble sort', '100', '10⁶', '10¹²'], ['O(n³)', 'cubic', 'naive matrix multiply', '10³', '10⁹', '10¹⁸'], ['O(2ⁿ)', 'exponential', 'all subsets', '1024', '10³⁰¹', '—'], ['O(n!)', 'factorial', 'all permutations', '3.6·10⁶', '—', '—']], 'The Big-O cheat sheet from the lecture, with sizes.'),
    why('**Big-O** says "f(n) is at most proportional to g(n) for large n": f(n) = O(g(n)) means there are constants c and n₀ with f(n) ≤ c·g(n) for all n ≥ n₀. **Big-Ω** is the matching lower bound and **Big-Θ** means both: the growth is *exactly* of that order. When people say "the time complexity is O(n log n)" they usually mean the tight bound for the *worst case*. Rules: drop constants (3n → n), keep the dominant term (n² + n → n²), and add sequential blocks / multiply nested ones.'),
    pre(`
f(n) = 3n² + 10n + 7     →  O(n²)        (n² dominates)
for … n  { … }  then  for … n { … }      →  O(n + n) = O(n)
for … n  { for … n { … } }                →  O(n · n) = O(n²)
`),
    warn('The slide that says "quadratic time complexity means the running time increases **exponentially** with the input size" is wrong: quadratic growth is **polynomial** (n²); exponential means 2ⁿ.', 'A slide correction'),
  ],
  syntax: [
    table(['notation', 'read as', 'meaning'], [['f(n) = O(g(n))', 'big-O', 'f(n) ≤ c·g(n) for all large n — an upper bound'], ['f(n) = Ω(g(n))', 'big-omega', 'f(n) ≥ c·g(n) for all large n — a lower bound'], ['f(n) = Θ(g(n))', 'big-theta', 'both: the growth is exactly of that order'], ['log n', 'log base 2 here', 'times a number must be doubled to reach n']]),
    table(['useful sum', 'value'], [['1 + 2 + … + n', 'n(n+1)/2'], ['1 + 2 + 4 + … + 2ᵏ', '2ᵏ⁺¹ − 1'], ['1 + 1/2 + 1/3 + … + 1/n', '≈ ln n'], ['n·(n−1)/2 pairs', 'number of pairs i < j']]),
  ],
  tiny: [code(`
for (int i = 0; i < n; i++) sum += a[i];   // n additions → O(n)
`)],
  guided: [prog('m4-complexity-intro/GrowthTable.java', 'Real operation counts for each class at n = 8, 16, 32, 64 — watch which columns explode')],
  programs: [
    {
      file: 'm4-complexity-intro/GrowthTable.java',
      title: 'Counting steps',
      role: 'demo',
      description: 'Each method increments a static counter once per basic step.',
      walkthrough: [
        { at: 'static void logarithmic(int n) { for (int i = n; i > 1; i /= 2) steps++; }', text: 'Halving: log₂ n steps (8 → 3, 64 → 6).' },
        { at: 'static void linearithmic(int n)', text: 'n outer × log n inner.' },
        { at: 'static void exponential(int n)', text: 'Two recursive calls of size n−1: 2ⁿ leaves — at n = 20 already a million.' },
        { at: 'for (int n : new int[] {8, 12, 16, 20})', text: 'Smaller n for the exponential row: otherwise the program would never finish.' },
      ],
    },
  ],
  complexity: [p('This lesson *is* about complexity. Remember the hierarchy: **1 < log n < √n < n < n log n < n² < n³ < 2ⁿ < n!**. For ~10⁸ simple operations per second, n up to about 10⁸ is feasible for O(n), 10⁴ for O(n²), 500 for O(n³), 25 for O(2ⁿ).')],
  mistakes: [
    { title: 'Keeping constants', wrong: '"This is O(3n + 5)"', why: 'Big-O hides constants and lower-order terms: O(n).', fix: 'O(n)' },
    { title: 'Confusing O with "always"', wrong: '"binary search is O(n²)" (technically true but useless)', why: 'Big-O is an upper bound, so loose bounds are true but not informative.', fix: 'State the tightest bound: Θ(log n).' },
    { title: 'Counting the wrong n', wrong: 'matrix n × n scanned "in O(n)"', why: 'It has n² cells; scanning them is O(n²) in terms of the side length.', fix: 'Say O(R·C) or O(n²) with n the side.' },
  ],
  practice: [
    { id: 'cplx-ex1', level: 'beginner', title: 'Count the triangle', statement: 'Read n and print how many times the innermost statement runs in: for i = 1..n, for j = 1..i, count++.', examples: [{ input: '5', output: '15' }], hints: ['1 + 2 + … + n = n(n+1)/2.'], solutionFile: 'm4-complexity-intro/Ex1.java', solutionExplain: 'Triangular numbers: O(n²).', tests: [{ stdin: '5\n', stdout: '15' }, { stdin: '1\n', stdout: '1' }, { stdin: '100\n', stdout: '5050' }] },
    { id: 'cplx-ex2', level: 'beginner', title: 'Passes of a halving loop', statement: 'Read n and print how many times `n /= 2` runs in `while (n > 1)`.', examples: [{ input: '1000', output: '9' }], hints: ['⌊log₂ n⌋.'], solutionFile: 'm4-complexity-intro/Ex2.java', solutionExplain: 'Each pass halves n; ⌊log₂ 1000⌋ = 9.', tests: [{ stdin: '1000\n', stdout: '9' }, { stdin: '1\n', stdout: '0' }, { stdin: '1024\n', stdout: '10' }] },
    { id: 'cplx-ex3', level: 'challenge', title: 'The crossover point', statement: 'An O(n²) algorithm does n² steps; an O(n log₂ n) one does `factor · n · log₂ n` steps. Read factor and print the smallest n ≥ 2 for which the quadratic algorithm does MORE steps.', examples: [{ input: '10', output: '59' }], hints: ['Search upwards from n = 2.'], solutionFile: 'm4-complexity-intro/Ex3.java', solutionExplain: 'n² > factor · n · log₂ n  ⟺  n > factor · log₂ n; for factor 10 this first holds at n = 59.', tests: [{ stdin: '10\n', stdout: '59' }, { stdin: '2\n', stdout: '5' }] },
  ],
  quiz: [
    { type: 'match', q: 'Match each algorithm to its time complexity.', pairs: [['binary search', 'O(log n)'], ['find max in unsorted array', 'O(n)'], ['merge sort', 'O(n log n)'], ['bubble sort', 'O(n²)'], ['all subsets', 'O(2ⁿ)'], ['all permutations', 'O(n!)']], explain: 'The lecture\'s Big-O cheat sheet.' },
    { type: 'mcq', q: 'f(n) = 4n² + 100n + 7 is…', options: ['O(n)', 'O(n²)', 'O(n³ ) only', 'O(1)'], answer: 1, explain: 'The n² term dominates (n³ is true but loose).' },
    { type: 'mcq', q: 'Which means "tight bound"?', options: ['Big-O', 'Big-Ω', 'Big-Θ', 'little-o'], answer: 2, explain: 'Θ is both an upper and a lower bound.' },
    { type: 'mcq', q: 'Which is the fastest-growing?', options: ['n³', '2ⁿ', 'n log n', 'n²'], answer: 1, explain: 'Exponential beats every polynomial.' },
    { type: 'mcq', q: 'The time complexity of accessing an element of an array by index is…', kind: 'complexity', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 0, explain: 'Constant: address arithmetic.' },
  ],
  interview: ['Explain Big-O, Big-Θ and Big-Ω.', 'Why do we ignore constants?', 'Rank 2ⁿ, n!, n², n log n, log n.', 'What is the complexity of nested loops with i and j ≤ i?'],
  videos: ['m4-complexity-intro', 'm4-complexity-intro#2'],
  revision: ['Count basic operations vs n; drop constants & low-order terms.', 'O upper, Ω lower, Θ tight.', '1 < log n < √n < n < n log n < n² < n³ < 2ⁿ < n!', 'Sequential: add; nested: multiply.'],
  sourceNotes: { discrepancies: ['The slide on the time-complexity chart says quadratic time complexity "increases exponentially with the input size"; quadratic is polynomial.', 'Slide 10 attributes O(n²·2ⁿ) to brute-force travelling salesman and slide 11 O(n!); both describe brute-force enumeration — the Held–Karp DP achieves O(n²·2ⁿ).'] },
});

export const complexityLoops: Lesson = lesson({
  id: 'm4-complexity-loops',
  dryRun: { algo: 'nested-count', input: { n: '6', mode: '1' }, caption: 'Every shaded cell is one execution of the inner statement.' },
  module: 'm4',
  title: 'Analysing Loops: Counting Iterations',
  summary: 'A step-by-step method for the 20 classic "predict the complexity" snippets: linear, nested, doubling, harmonic, sums.',
  level: 'intermediate',
  track: 'core',
  minutes: 50,
  essential: true,
  prerequisites: ['m4-complexity-intro', 'm1-loops'],
  sources: ['Time-_-Space-complexity-1_1'],
  objectives: [
    'Count the iterations of a single loop from its start, condition and update.',
    'Handle nested loops, dependent bounds (j ≤ i), step sizes (j += i) and `break`.',
    'Recognise log n (doubling/halving), √n (i·i ≤ n) and harmonic n log n patterns.',
    'Correct the mistakes in the lecture solutions for the n⁴ and n log n problems.',
  ],
  intuition: [
    p('Method: (1) find how many times the **innermost statement** runs; (2) express it as a sum over the loop variables; (3) keep the dominant term.'),
    table(['loop', 'iterations', 'class'], [['for (i = 1; i < n; i++)', 'n − 1', 'O(n)'], ['for (i = 1; i <= √n; i++) / i·i ≤ n', '√n', 'O(√n)'], ['for (i = 1; i <= n; i *= 2)', '⌊log₂ n⌋ + 1', 'O(log n)'], ['while (n > 1) n /= 2', '⌊log₂ n⌋', 'O(log n)'], ['for i<n { for j<n }', 'n²', 'O(n²)'], ['for i<n { for j<n { break; } }', 'n', 'O(n)'], ['for i<n { for (j = 1; j < n; j += i) }', 'n(1 + 1/2 + … + 1/n) ≈ n ln n', 'O(n log n)'], ['for i<n { for (j = 1; j < n; j *= 2) }', 'n · log₂ n', 'O(n log n)'], ['for i=1..n { for j=1..i { 20× } }', '20·n(n+1)/2', 'O(n²)'], ['for i { for j ≤ i² { for k ≤ n/2 } }', 'Σ i² · n/2 ≈ n⁴/6', 'O(n⁴)'], ['while (s <= n) { i++; s += i; }', 'i(i+1)/2 > n → i ≈ √(2n)', 'O(√n)'], ['while (n > 0) { n /= 10; }', 'number of digits', 'O(log n)']]),
    why('A loop with a **multiplicative** update (`i *= 2`, `n /= 2`) shrinks/grows geometrically, so it runs a logarithmic number of times. A **dependent** inner bound (`j <= i`) turns a rectangle into a triangle: the sum 1 + 2 + … + n is n(n+1)/2, still O(n²). The **harmonic** pattern (`j += i`) gives n/i inner iterations for each i, and 1 + 1/2 + 1/3 + … + 1/n ≈ ln n, so the total is n ln n.'),
    h('Where the lecture answers need correcting'),
    ul('`for i<n { for j=1; j<n; j*=2 }` is **O(n log n)** (n × log n). The lecture\'s derivation of "log² n" multiplies the wrong things: the outer loop is linear, not logarithmic.', '`for i<=n { for j<=i*i { for k<=n/2 } }` is **O(n⁴)** (the lecture\'s choice D is right, but the written explanation arrives at n³).', '`for i = n/2..n { for j<=n/2 { for k *= 2 } }` is O(n² log n): (n/2)·(n/2)·log n.'),
  ],
  syntax: [
    table(['loop header', 'iterations'], [['`for (i = a; i < b; i++)`', 'b − a'], ['`for (i = a; i < b; i += s)`', '⌈(b − a) / s⌉'], ['`for (i = 1; i < n; i *= c)`', '⌈log_c n⌉'], ['`for (i = n; i > 1; i /= c)`', '⌊log_c n⌋'], ['`for (i = 1; i * i <= n; i++)`', '⌊√n⌋'], ['`for (j = 0; j < i; j++)` inside `for i = 0..n-1`', '0 + 1 + … + (n−1) = n(n−1)/2'], ['`for (j = i; j <= n; j += i)` inside `for i = 1..n`', 'n/1 + n/2 + … + n/n ≈ n ln n']]),
    p('Rule: total = Σ over the outer variable of the inner count; then keep the dominant term.'),
  ],
  tiny: [code(`
for (int i = 1; i < n; i = i * 2) {   // i = 1, 2, 4, 8 ... → log2(n) iterations
    work();
}
`)],
  guided: [prog('m4-complexity-loops/LoopCounts.java', 'Twelve snippets executed with counters at three sizes — compare the growth ratios with the claimed class'), p('Open **Dry-run & complexity lab → Complexity lab** to drag n and watch the iteration counts of the same snippets update live.')],
  programs: [
    {
      file: 'm4-complexity-loops/LoopCounts.java',
      title: 'Measured iteration counts',
      role: 'demo',
      description: 'Verify every claim in the table above by running it.',
      walkthrough: [
        { at: 'static long sqrtBound(int n)', text: '`i * i <= n` is written with long so i·i cannot overflow.' },
        { at: 'static long harmonic(int n)', text: 'The inner step grows with i: total ≈ n ln n (566 for n = 100 versus n² = 10 000).' },
        { at: 'static long quartic(int n)', text: 'Adds n/2 inside the double loop: Σ i² · n/2 — the n⁴ result; kept to n ≤ 40 so it finishes instantly.' },
        { at: 'static void row(String name, String bigO, IntToLongFunction f, int[] sizes)', text: 'Prints count for three n values: if the count multiplies by ~10 when n does, it is linear; by ~100, quadratic; by ~1 + small, logarithmic.' },
      ],
    },
  ],
  complexity: [p('The program itself is O(sum of the snippet costs) — dominated by the n x n rows. The point is the growth *ratios*: when n grows 10× the counts should grow ≈10× (O(n)), ≈100× (O(n²)), ≈1.3× (O(log n)), ≈3.2× (O(√n)).')],
  mistakes: [
    { title: 'Treating a break as free', wrong: 'for i<n { for j<n { work(); break; } }  → "O(n²)"', why: 'The inner loop runs once per outer pass: O(n).', fix: 'Count executed iterations, not the written bound.' },
    { title: 'log base confusion', wrong: '"O(log₂ n) ≠ O(log₁₀ n)"', why: 'They differ by a constant factor (log₂ n = 3.32 log₁₀ n), which Big-O ignores. The lecture\'s digit-sum loop is O(log₁₀ n) = O(log n).', fix: 'Write O(log n).' },
    { title: 'Adding where you should multiply', wrong: 'two nested loops "O(n + n)"', why: 'Nested loops multiply: n × n.', fix: 'Only sequential blocks add.' },
  ],
  practice: [
    { id: 'cl-ex1', level: 'intermediate', title: 'Tripling outer loop', statement: 'Read n. Count how many times `count++` runs in: for (i = 1; i <= n; i *= 3) for (j = 0; j < n; j++) count++.', examples: [{ input: '30', output: '120' }], hints: ['The outer loop runs ⌊log₃ n⌋ + 1 times.'], solutionFile: 'm4-complexity-loops/Ex1.java', solutionExplain: '4 outer iterations (1, 3, 9, 27) × 30 = 120: O(n log n).', tests: [{ stdin: '30\n', stdout: '120' }, { stdin: '1\n', stdout: '1' }, { stdin: '100\n', stdout: '500' }] },
    { id: 'cl-ex2', level: 'intermediate', title: 'Half-linear times log', statement: 'Read n. Count: for (i = n/2; i >= 1; i--) for (j = 1; j <= n; j *= 2) count++.', examples: [{ input: '16', output: '40' }], hints: ['(n/2) outer × (⌊log₂ n⌋ + 1) inner.'], solutionFile: 'm4-complexity-loops/Ex2.java', solutionExplain: '8 × 5 = 40: O(n log n).', tests: [{ stdin: '16\n', stdout: '40' }, { stdin: '2\n', stdout: '2' }, { stdin: '100\n', stdout: '350' }] },
    { id: 'cl-ex3', level: 'challenge', title: 'Measure the growth ratio', statement: 'For the triangular loop (j ≤ i) let count(n) be the iteration count. Read n and print count(2n) / count(n) with one decimal.', examples: [{ input: '500', output: '4.0' }], hints: ['A ratio near 4 means quadratic growth.'], solutionFile: 'm4-complexity-loops/Ex3.java', solutionExplain: 'Doubling n quadruples n(n+1)/2 (almost exactly), the signature of O(n²).', tests: [{ stdin: '500\n', stdout: '4.0' }, { stdin: '1000\n', stdout: '4.0' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'for (i = 1; i < n; i = i * 2) runs…', options: ['n times', 'log₂ n times', '√n times', 'n/2 times'], answer: 1, explain: 'Geometric growth.' },
    { type: 'mcq', q: 'for (i=1;i<=n;i++) for (j=1;j<=i;j++) is…', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 2, explain: 'n(n+1)/2.' },
    { type: 'mcq', q: 'for (i=1;i<n;i++) for (j=1;j<n;j=j+i) is…', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1, explain: 'Harmonic series: n·H(n).' },
    { type: 'mcq', q: 'int fun(){ for(i=1;i<n;i++) for(j=1;j<sqrt(n);j++) … } is…', kind: 'complexity', options: ['O(n)', 'O(n√n)', 'O(n²)', 'O(n log n)'], answer: 1, explain: 'n outer × √n inner.' },
    { type: 'mcq', q: 'The loop `while(n > 0) { ans += n % 10; n /= 10; }` runs…', options: ['n times', 'log₁₀ n times (the number of digits)', '10 times', 'n/10 times'], answer: 1, explain: 'One iteration per digit.' },
  ],
  interview: ['What is the complexity of `for (i=1;i<=n;i*=2)`?', 'Nested loops where the inner bound is i — complexity?', 'How do you count `j += i`?', 'Sum of the first n squares is…?'],
  videos: ['m4-complexity-loops', 'm4-complexity-loops#2'],
  revision: ['i *= c or n /= c → log n. i·i ≤ n → √n.', 'Nested multiply; dependent j ≤ i → n²/2; j += i → n log n.', 'break/early exit changes the count.', 'Verify by measuring with a counter.'],
  sourceNotes: { discrepancies: ['Slide 22: the written derivation of O(log² n) is incorrect; the total is O(n log n) (the multiple-choice option C is the right one).', 'Slide 26: option D (n⁴) is correct but the explanation concludes n³.', 'Slide 20 claims that with `break` the loop is O(n) — correct — but its prose says "the inner loop always runs only once", which is also correct; the worry is only the suggested answer list that omits O(n) in that choice set.', 'Slide 33 correctly derives O(√n) for `s = s + i`.'] },
});

export const complexityRecursion: Lesson = lesson({
  id: 'm4-complexity-recursion',
  dryRun: { algo: 'recurrence-levels', input: { a: '2', b: '2', n: '16' }, caption: "Merge sort's recursion tree: n work on each of log n levels." },
  module: 'm4',
  title: 'Analysing Recursion: Recurrence Relations',
  summary: 'Write T(n) for a recursive algorithm and solve it: linear, halving, branching, divide and conquer, and Karatsuba.',
  level: 'intermediate',
  track: 'core',
  minutes: 40,
  essential: false,
  prerequisites: ['m4-complexity-loops', 'm2-recursion'],
  sources: ['Karatsuba-Algorithm', 'Time-_-Space-complexity-1_2'],
  objectives: [
    'Turn a recursive method into a recurrence relation T(n).',
    'Solve the five common shapes by unrolling or a recursion tree.',
    'State the master-theorem results for T(n) = aT(n/b) + O(nᵈ).',
    'Predict the number of calls and the stack depth.',
  ],
  intuition: [
    p('The running time of a recursive algorithm satisfies an equation in terms of itself — a **recurrence**. Solving it (by unrolling or by drawing the recursion tree and adding level by level) gives the closed form.'),
    table(['recurrence', 'shape', 'solution', 'example'], [['T(n) = T(n−1) + O(1)', 'chain', 'O(n)', 'factorial, linear recursion'], ['T(n) = T(n−1) + O(n)', 'chain with linear work', 'O(n²)', 'worst-case quick sort, selection sort'], ['T(n) = T(n/2) + O(1)', 'halving', 'O(log n)', 'binary search, fast power'], ['T(n) = 2T(n/2) + O(n)', 'balanced split', 'O(n log n)', 'merge sort'], ['T(n) = 2T(n−1) + O(1)', 'binary branching', 'O(2ⁿ)', 'Towers of Hanoi, subsets'], ['T(n) = T(n−1) + T(n−2) + O(1)', 'Fibonacci', 'O(φⁿ) ≈ 1.618ⁿ', 'naive Fibonacci'], ['T(n) = 3T(n/2) + O(n)', 'three half-size calls', 'O(n^log₂3) ≈ n^1.585', 'Karatsuba']]),
    why('**Master theorem** for T(n) = a·T(n/b) + O(nᵈ): compare the work at the root (nᵈ) with the work at the leaves (n^(log_b a)). If the leaves dominate (d < log_b a) → O(n^(log_b a)); if equal (d = log_b a) → O(nᵈ log n); if the root dominates → O(nᵈ). Karatsuba: a = 3, b = 2, d = 1, log₂3 ≈ 1.585 > 1 → leaves dominate → O(n^1.585). Merge sort: a = 2, b = 2, d = 1 = log₂2 → O(n log n).'),
    pre(`
merge sort recursion tree        level work   levels = log2 n
        n                           n
    n/2   n/2                       n              total n·log2 n
  n/4 n/4 n/4 n/4                   n
`),
  ],
  syntax: [
    math('T(n) = a · T(n / b) + f(n)        a ≥ 1 subproblems of size n/b, plus f(n) work to split and combine'),
    table(['compare f(n) with n^(log_b a)', 'result'], [['f(n) grows slower', 'T(n) = Θ(n^(log_b a))   (leaves dominate)'], ['same order, f(n) = Θ(n^(log_b a))', 'T(n) = Θ(n^(log_b a) · log n)'], ['f(n) grows faster (and regularity holds)', 'T(n) = Θ(f(n))   (root dominates)']], 'Master theorem'),
    code(`
// from code to recurrence: count the calls and the work outside them
int f(int n) {                // T(n) = 2 T(n/2) + n
    if (n <= 1) return 1;
    int s = f(n / 2) + f(n / 2);
    for (int i = 0; i < n; i++) s++;     // the + n
    return s;
}
`),
  ],
  tiny: [code(`
static int f(int n) { return n <= 1 ? 1 : f(n - 1) + f(n - 1); }   // T(n) = 2T(n−1) + 1 → 2^n
`)],
  guided: [prog('m4-complexity-recursion/RecurrenceCounts.java', 'Call counts for the five recurrence shapes at n = 8, 16, 24, 32')],
  programs: [
    {
      file: 'm4-complexity-recursion/RecurrenceCounts.java',
      title: 'Counting calls',
      role: 'demo',
      description: 'A static counter is incremented on entry to each recursive function.',
      walkthrough: [
        { at: 'static long halving(int n)', text: 'One call on n/2: log₂ n + 1 calls in total.' },
        { at: 'long work = n;', text: 'The linear combine cost at each node (like the merge step).' },
        { at: 'return n <= 1 ? n : fib(n - 1) + fib(n - 2);', text: 'Two calls of nearly equal size → exponential in n (3193 calls for n = 16, 7 million for n = 32).' },
        { at: 'return n == 0 ? 0 : 1 + 2 * hanoi(n - 1);', text: 'Moves for Hanoi: 2ⁿ − 1.' },
      ],
    },
  ],
  complexity: [p('Space is the recursion **depth**: chain O(n), halving O(log n), balanced D&C O(log n) (+ output buffers), Fibonacci O(n). Time is the total of the tree.')],
  mistakes: [
    { title: 'Counting depth instead of calls', wrong: '"fib(n) is O(n) because it recurses n deep"', why: 'Depth is n, but the number of calls is exponential.', fix: 'Time = number of nodes in the call tree.' },
    { title: 'Forgetting the combine cost', wrong: 'merge sort "T(n) = 2T(n/2)"', why: 'Without + O(n) the solution would be O(n), which is impossible for comparison sorting.', fix: 'T(n) = 2T(n/2) + O(n)' },
    { title: 'Using the master theorem when a, b are not constants', wrong: 'T(n) = T(n−1) + O(1)', why: 'Subtracting one is not dividing by b; solve by unrolling.', fix: 'T(n) = O(n)' },
  ],
  practice: [
    { id: 'cr-ex1', level: 'intermediate', title: 'Count the calls', statement: 'Read n. Count the calls of f where f(n) = f(n−1) + f(n−1) for n > 1 and returns 1 for n ≤ 1 (count every call including the first).', examples: [{ input: '10', output: '1023' }], hints: ['calls(n) = 1 + 2·calls(n−1), calls(1) = 1 → 2ⁿ − 1.'], solutionFile: 'm4-complexity-recursion/Ex1.java', solutionExplain: 'A complete binary tree of depth n−1.', tests: [{ stdin: '10\n', stdout: '1023' }, { stdin: '1\n', stdout: '1' }, { stdin: '5\n', stdout: '31' }] },
    { id: 'cr-ex2', level: 'intermediate', title: 'Two half calls', statement: 'g(n) = g(n/2) + g(n/2) for n > 1 (integer division), 0 for n ≤ 1. Count all calls including the first for the input n.', examples: [{ input: '16', output: '31' }], hints: ['For n a power of two the tree has 2n − 1 nodes.'], solutionFile: 'm4-complexity-recursion/Ex2.java', solutionExplain: 'T(n) = 2T(n/2) + 1 = O(n): a full binary tree with n leaves.', tests: [{ stdin: '16\n', stdout: '31' }, { stdin: '1\n', stdout: '1' }, { stdin: '8\n', stdout: '15' }] },
    { id: 'cr-ex3', level: 'challenge', title: 'Karatsuba work', statement: 'Define t(n): if n ≤ 1 add 1 to a counter; otherwise add n, then call t(n/2) three times. For n a power of two print the final counter value.', examples: [{ input: '8', output: '65' }], hints: ['Level k has 3ᵏ nodes each adding n/2ᵏ; leaves add 1.'], solutionFile: 'm4-complexity-recursion/Ex3.java', solutionExplain: 'Σ n(3/2)ᵏ + 3^(log n) = Θ(n^1.585).', tests: [{ stdin: '8\n', stdout: '65' }, { stdin: '2\n', stdout: '5' }, { stdin: '1\n', stdout: '1' }] },
  ],
  quiz: [
    { type: 'match', q: 'Match the recurrence with its solution.', pairs: [['T(n) = T(n−1) + 1', 'O(n)'], ['T(n) = T(n/2) + 1', 'O(log n)'], ['T(n) = 2T(n/2) + n', 'O(n log n)'], ['T(n) = 2T(n−1) + 1', 'O(2ⁿ)']], explain: 'See the table.' },
    { type: 'mcq', q: 'By the master theorem T(n) = 3T(n/2) + n is…', options: ['O(n)', 'O(n log n)', 'O(n^1.585)', 'O(n²)'], answer: 2, explain: 'Leaves dominate: n^log₂3.' },
    { type: 'mcq', q: 'What is the recursion depth of merge sort?', options: ['n', 'log n', 'n log n', '1'], answer: 1, explain: 'Halving.' },
    { type: 'mcq', q: 'Naive fib(n) makes about…', kind: 'complexity', options: ['n calls', 'n² calls', '1.618ⁿ calls', 'log n calls'], answer: 2, explain: 'Exponential in the golden ratio.' },
  ],
  interview: ['Solve T(n) = 2T(n/2) + n.', 'State the master theorem.', 'Why is naive Fibonacci exponential?', 'What is the worst-case recurrence of quick sort?'],
  videos: ['m4-complexity-recursion', 'm4-complexity-recursion#2'],
  revision: ['Write T(n); solve by unrolling or a recursion tree.', 'T(n−1)+1 → n; T(n/2)+1 → log n; 2T(n/2)+n → n log n; 2T(n−1)+1 → 2ⁿ.', 'Master: compare nᵈ with n^log_b(a).', 'Space = depth.'],
});

export const spaceComplexity: Lesson = lesson({
  id: 'm4-space-complexity',
  dryRun: { algo: 'stack-depth', input: { n: '6', mode: '1' }, caption: 'One frame per active call: depth n for a chain, log n for halving (mode 2).' },
  module: 'm4',
  title: 'Space Complexity and the Call Stack',
  summary: 'How much memory an algorithm needs beyond its input: auxiliary space, data-structure cost and recursion depth.',
  level: 'beginner',
  track: 'core',
  minutes: 30,
  essential: true,
  prerequisites: ['m4-complexity-intro', 'm2-recursion'],
  sources: ['Time-_-Space-complexity-1_2'],
  objectives: [
    'Distinguish space complexity from auxiliary space.',
    'Compute the space of variables, arrays, matrices and recursion.',
    'Explain why recursion depth, not call count, determines stack space.',
    'Trade space for time and vice versa.',
  ],
  intuition: [
    p('**Space complexity** is the total memory an algorithm uses as a function of the input size, **including the input**. **Auxiliary space** is only the *extra* memory it allocates. Sorting an array in place has O(1) auxiliary space although its space complexity is O(n) (the array itself).'),
    table(['what you allocate', 'space'], [['a fixed number of variables', 'O(1)'], ['an array of n elements', 'O(n)'], ['an n × n matrix', 'O(n²)'], ['a recursion of depth d', 'O(d) stack frames'], ['a HashMap with n entries', 'O(n)'], ['a StringBuilder of length n', 'O(n)']]),
    why('Each recursive call keeps its parameters and local variables in a **stack frame** until it returns. Only the calls that are active *at the same time* occupy memory, so space = **maximum depth × frame size** — not the total number of calls. `add(n) = n + add(n−1)` is O(n) space; naive `fibonacci(n)` makes exponentially many calls but is only n deep, so it needs **O(n)** stack space (the lecture\'s answer b); `power(b, e)` halving the exponent needs O(log n).'),
    p('Time and space trade off: memoising Fibonacci spends O(n) memory to cut time from O(2ⁿ) to O(n); the iterative version needs only two variables. A hash set removes duplicates in O(n) time using O(n) memory, while sorting in place needs O(n log n) time and O(1) extra memory.'),
  ],
  syntax: [
    table(['Java item (64-bit HotSpot, typical)', 'memory'], [['int / float', '4 bytes'], ['long / double', '8 bytes'], ['boolean / byte', '1 byte (in arrays)'], ['reference', '4 bytes (compressed) — 8 otherwise'], ['int[n]', '≈ 16 + 4n bytes'], ['Integer object', '≈ 16 bytes (+ the reference)'], ['String of n chars', '≈ 40 + n bytes']], 'Rough sizes (they vary by JVM; use them for orders of magnitude)'),
    code(`
int[] a = new int[n];          // O(n) extra space
int[][] grid = new int[n][n];  // O(n^2)
// recursion adds one frame per active call: depth d  =>  O(d) stack space
`),
  ],
  tiny: [code(`
int add(int n) { return n <= 0 ? 0 : n + add(n - 1); }   // O(n) stack space
`)],
  guided: [prog('m4-space-complexity/SpaceDemo.java', 'Measures the actual maximum stack depth of two recursions and contrasts in-place with copying')],
  programs: [
    {
      file: 'm4-space-complexity/SpaceDemo.java',
      title: 'Measuring space',
      role: 'demo',
      description: 'depth/maxDepth static counters track the live stack depth.',
      walkthrough: [
        { at: 'depth++;', text: 'Entering a call: one more frame is live.' },
        { at: 'depth--;', text: 'Leaving the call: the frame is released.' },
        { at: 'static int[] prefixSums(int[] a)', text: 'Allocates a second array of size n: O(n) auxiliary space.' },
        { at: 'static void reverseInPlace(int[] a)', text: 'Two indices and one temp: O(1) auxiliary space.' },
      ],
    },
  ],
  complexity: [p('Remember the three-part habit when analysing an algorithm: **time**, **auxiliary space**, and — for recursion — **stack depth**.')],
  mistakes: [
    { title: 'Counting the input as extra space', wrong: '"in-place reverse uses O(n) space"', why: 'The auxiliary space is O(1); the input is given.', fix: 'Say "O(1) auxiliary space".' },
    { title: 'Ignoring the recursion stack', wrong: '"recursive sum uses O(1) space — no arrays"', why: 'n frames are live at the deepest point.', fix: 'O(n) stack space.' },
    { title: 'Confusing calls with depth', wrong: '"fib(n) uses O(2ⁿ) space"', why: 'Calls are made sequentially along each branch; only a path of length n is live.', fix: 'O(n).' },
  ],
  practice: [
    { id: 'sp-ex1', level: 'beginner', title: 'Maximum recursion depth', statement: 'f(n) = f(n−1) + 1 for n > 1, f(1) = 1. Read n and print the maximum number of simultaneously active calls.', examples: [{ input: '50', output: '50' }], hints: ['It equals n.'], solutionFile: 'm4-space-complexity/Ex1.java', solutionExplain: 'A chain of n calls is all active at the base case.', tests: [{ stdin: '50\n', stdout: '50' }, { stdin: '1\n', stdout: '1' }, { stdin: '200\n', stdout: '200' }] },
    { id: 'sp-ex2', level: 'intermediate', title: 'Fibonacci in O(1) space', statement: 'Read n (≤ 90) and print the n-th Fibonacci number (F(0) = 0, F(1) = 1) using only two variables.', examples: [{ input: '50', output: '12586269025' }], hints: ['Keep the last two values and slide them forward.'], solutionFile: 'm4-space-complexity/Ex2.java', solutionExplain: 'The loop only needs F(i−1) and F(i).', tests: [{ stdin: '50\n', stdout: '12586269025' }, { stdin: '0\n', stdout: '0' }, { stdin: '1\n', stdout: '1' }, { stdin: '90\n', stdout: '2880067194370816120' }] },
    { id: 'sp-ex3', level: 'challenge', title: 'Duplicates with O(1) extra space', statement: 'Read n numbers; print YES if any value appears twice. Do it by sorting the array in place (no HashSet).', examples: [{ input: '5\n4 1 7 1 9', output: 'YES' }], hints: ['After sorting, duplicates are adjacent.'], solutionFile: 'm4-space-complexity/Ex3.java', solutionExplain: 'Trade time (O(n log n) sort) for space (no extra structure).', tests: [{ stdin: '5\n4 1 7 1 9\n', stdout: 'YES' }, { stdin: '3\n1 2 3\n', stdout: 'NO' }, { stdin: '1\n5\n', stdout: 'NO' }] },
  ],
  quiz: [
    { type: 'match', q: 'Match each lecture snippet with its space complexity.', pairs: [['int add(int n) recursive sum', 'O(n)'], ['loop with sum += pairSum(i, i+1)', 'O(1)'], ['new int[n] filled in a loop', 'O(n)'], ['int sum; for (i<n) sum += i', 'O(1)'], ['recursive fibonacci(n) (stack)', 'O(n)'], ['linked list with n inserts', 'O(n)']], explain: 'The six "predict the space complexity" slides.' },
    { type: 'mcq', q: 'Auxiliary space is…', options: ['the space of the input', 'the extra space used besides the input', 'the stack only', 'the heap only'], answer: 1, explain: 'Temporary memory.' },
    { type: 'mcq', q: 'A recursion that halves n each call has stack space…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 1, explain: 'Depth log₂ n.' },
    { type: 'mcq', q: 'A 1000 × 1000 int matrix uses about…', options: ['4 KB', '4 MB', '4 GB', '1 MB'], answer: 1, explain: '10⁶ × 4 bytes.' },
  ],
  interview: ['Space complexity vs auxiliary space?', 'What is the space complexity of recursive Fibonacci?', 'Can you trade time for space? Example.', 'Is merge sort in place?'],
  videos: ['m4-space-complexity', 'm4-space-complexity#2'],
  revision: ['Space = auxiliary + input; recursion = max depth × frame.', 'Variables O(1); array O(n); matrix O(n²).', 'fib naive: O(n) stack; halving recursion O(log n).', 'Trade: memo O(n) memory for O(n) time.'],
  sourceNotes: { discrepancies: ['Slide 9 answers O(n) for recursive fibonacci space — correct (depth n), but the printed reason talks about "recursive calls n times"; precisely it is the depth of the call tree, n, not the number of calls.'] },
});

export const bestAvgWorst: Lesson = lesson({
  id: 'm4-best-avg-worst',
  dryRun: { algo: 'search-cases', input: { arr: '8,3,5,9,1' }, caption: 'The same scan costs 1, (n+1)/2 or n comparisons depending on the target.' },
  module: 'm4',
  title: 'Best, Average and Worst Case',
  summary: 'The same algorithm can behave very differently on different inputs: what each case means and when it matters.',
  level: 'intermediate',
  track: 'core',
  minutes: 30,
  essential: false,
  prerequisites: ['m4-complexity-intro', 'm4-searching'],
  objectives: [
    'Define best, average and worst case of an algorithm for inputs of the same size.',
    'Find the best/worst input for linear search, insertion sort and quick sort.',
    'Explain why worst-case Big-O is the usual guarantee, and when average case is the better description.',
    'Distinguish a case from a bound (O/Ω/Θ).',
  ],
  intuition: [
    p('For a fixed input **size n**, different inputs can cost very different amounts. The **best case** is the cheapest input, the **worst case** the most expensive, and the **average case** the expected cost over some distribution of inputs.'),
    table(['algorithm', 'best', 'average', 'worst', 'worst-case input'], [['linear search', 'O(1): target is first', 'O(n): ≈ n/2', 'O(n): last / absent', 'target at the end'], ['binary search', 'O(1)', 'O(log n)', 'O(log n)', 'target absent'], ['insertion sort', 'O(n) sorted', 'O(n²)', 'O(n²)', 'reverse sorted'], ['selection sort', 'O(n²)', 'O(n²)', 'O(n²)', 'any'], ['quick sort (last pivot)', 'O(n log n)', 'O(n log n)', 'O(n²)', 'already sorted'], ['merge sort', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'any'], ['hash table lookup', 'O(1)', 'O(1)', 'O(n) all keys collide', 'terrible hashCode']]),
    why('The **worst case** is a *guarantee*: it holds for every input, so it is what real-time and safety-critical software designs for. The **average case** describes typical behaviour but needs an assumption about the input distribution. Quick sort illustrates both: its worst case is quadratic (and happens with a fixed last-element pivot on sorted data), yet its average is n log n with tiny constants, so it is usually the fastest in practice — randomising the pivot makes the bad input unlikely.'),
    p('A *case* and a *bound* are different axes: you can give an upper (O), lower (Ω) or tight (Θ) bound for the best case, the average case or the worst case. "Linear search is Θ(1) in the best case and Θ(n) in the worst case."'),
  ],
  syntax: [
    math('T_best(n) = min over inputs of size n        T_worst(n) = max over inputs of size n'),
    math('T_avg(n) = Σ  P(input) · T(input)      (for a uniform distribution: the plain mean)'),
    table(['symbol', 'means'], [['O(T_worst)', 'an upper bound that holds for EVERY input'], ['Ω(T_best)', 'no input is cheaper than this'], ['Θ(T_avg)', 'typical behaviour under a stated input distribution']]),
  ],
  tiny: [code(`
// linear search: target is a[0] → 1 comparison; target is last or absent → n comparisons
`)],
  guided: [prog('m4-best-avg-worst/CasesDemo.java', 'Measured best / average / worst comparison counts for linear search, insertion sort and quick sort at n = 1000')],
  programs: [
    {
      file: 'm4-best-avg-worst/CasesDemo.java',
      title: 'Measuring the cases',
      role: 'demo',
      description: 'The numbers match the table: 1 / ~500 / 1000 for linear search, 999 vs 499 500 for insertion sort, 499 500 for quick sort on sorted input.',
      walkthrough: [
        { at: 'static long linearComparisons(int[] a, int target)', text: 'Counts comparisons until the target is found.' },
        { at: 'total += linearComparisons(a, rnd.nextInt(n));', text: 'Average: 10 000 random targets — about n/2 = 500.' },
        { at: 'int[] reversed = new int[n];', text: 'The worst input for insertion sort: every element must travel to the front.' },
        { at: 'quick(sortedIn.clone(), 0, n - 1);', text: 'A sorted array with the last element as pivot makes every partition maximally unbalanced.' },
      ],
    },
  ],
  complexity: [p('Always specify the **case** with the bound. If an interviewer says "what is the complexity?" give the worst case, then mention the average if it differs importantly.')],
  mistakes: [
    { title: 'Quoting the best case as the complexity', wrong: '"insertion sort is O(n)"', why: 'Only for (nearly) sorted input; the guarantee is O(n²).', fix: 'O(n²) worst/average, O(n) best.' },
    { title: 'Assuming "average" means "typical for my data"', wrong: '"average O(1) hashing" for adversarial keys', why: 'The average assumes a good hash function and non-adversarial input.', fix: 'Know the assumption; use randomised/secure hashing if needed.' },
    { title: 'Mixing case and bound', wrong: '"O is the worst case, Ω the best case"', why: 'O/Ω/Θ are bounds on a function; each case is itself a function that can have all three.', fix: 'Say "Θ(n²) in the worst case".' },
  ],
  practice: [
    { id: 'case-ex1', level: 'beginner', title: 'Comparisons in a linear search', statement: 'Read n, a target and n numbers. Print how many comparisons a linear search makes (n if the target is absent).', examples: [{ input: '5 7\n4 9 7 1 7', output: '3' }], hints: ['Stop counting at the first match.'], solutionFile: 'm4-best-avg-worst/Ex1.java', solutionExplain: 'The count equals index + 1 for a hit and n for a miss.', tests: [{ stdin: '5 7\n4 9 7 1 7\n', stdout: '3' }, { stdin: '3 9\n1 2 3\n', stdout: '3' }, { stdin: '2 1\n1 2\n', stdout: '1' }] },
    { id: 'case-ex2', level: 'beginner', title: 'Average successful search', statement: 'Read n. Print the average number of comparisons of a successful linear search over n elements when every position is equally likely, with one decimal.', examples: [{ input: '9', output: '5.0' }], hints: ['(1 + 2 + … + n) / n = (n + 1) / 2.'], solutionFile: 'm4-best-avg-worst/Ex2.java', solutionExplain: 'Average of 1..n.', tests: [{ stdin: '9\n', stdout: '5.0' }, { stdin: '1\n', stdout: '1.0' }, { stdin: '10\n', stdout: '5.5' }] },
    { id: 'case-ex3', level: 'intermediate', title: 'Insertion sort comparisons', statement: 'Read n numbers and print the number of comparisons insertion sort makes (compare the key with elements to its left until one is ≤ key).', examples: [{ input: '5\n5 4 3 2 1', output: '10' }], hints: ['A reversed array of 5 gives 4+3+2+1.'], solutionFile: 'm4-best-avg-worst/Ex3.java', solutionExplain: 'Each element is compared with every larger predecessor plus one stopping comparison (when it exists).', tests: [{ stdin: '5\n5 4 3 2 1\n', stdout: '10' }, { stdin: '5\n1 2 3 4 5\n', stdout: '4' }, { stdin: '1\n1\n', stdout: '0' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Worst-case input for insertion sort?', options: ['sorted', 'reverse sorted', 'all equal', 'random'], answer: 1, explain: 'Every element moves to the front.' },
    { type: 'mcq', q: 'Quick sort with the last element as pivot is O(n²) on…', options: ['random data', 'already sorted data', 'all different data', 'never'], answer: 1, explain: 'Unbalanced partitions.' },
    { type: 'mcq', q: 'Which case is a guarantee for every input?', options: ['best', 'average', 'worst', 'typical'], answer: 2, explain: 'The worst case bounds all inputs.' },
    { type: 'mcq', q: 'Merge sort\'s best, average and worst case are…', options: ['O(n), O(n log n), O(n²)', 'all O(n log n)', 'all O(n)', 'O(log n), O(n), O(n²)'], answer: 1, explain: 'It always splits evenly.' },
  ],
  interview: ['Best vs average vs worst case?', 'Why is quick sort used despite O(n²) worst case?', 'How do you avoid the worst case?', 'What is amortised analysis?'],
  videos: ['m4-best-avg-worst', 'm4-best-avg-worst#2'],
  revision: ['Case = which input; bound = O/Ω/Θ of its cost.', 'Linear search 1 / n/2 / n; insertion sort n / n² / n²; quick sort n log n / n log n / n².', 'Worst case = guarantee.', 'Randomise the pivot.'],
});
