import type { LabAlgorithm, TraceStep, Mark } from '../types';
import { arr, err, ints } from './helpers';

export const paths: LabAlgorithm = {
  id: 'paths',
  title: 'Grid paths DP',
  lesson: 'a-maneuvering',
  summary: 'dp[i][j] = dp[i−1][j] + dp[i][j−1].',
  inputs: [
    { key: 'm', label: 'rows m (≤ 8)', default: '4', type: 'number' },
    { key: 'n', label: 'cols n (≤ 8)', default: '5', type: 'number' },
  ],
  pseudocode: ['for i in 0..m-1:', '  for j in 0..n-1:', '    if i == 0 or j == 0: dp[i][j] = 1', '    else dp[i][j] = dp[i-1][j] + dp[i][j-1]', 'return dp[m-1][n-1]'],
  run({ m, n }) {
    const M = Math.trunc(+m), N = Math.trunc(+n);
    if (!Number.isFinite(M) || !Number.isFinite(N) || M < 1 || N < 1 || M > 8 || N > 8) return err('Both sizes must be 1–8.');
    const dp: number[][] = Array.from({ length: M }, () => Array(N).fill(0));
    const steps: TraceStep[] = [];
    const snap = (i: number, j: number, note: string, line: number) => {
      const marks: Record<string, Mark> = { [`${i},${j}`]: 'cur' };
      if (i > 0) marks[`${i - 1},${j}`] = 'found';
      if (j > 0) marks[`${i},${j - 1}`] = 'found';
      steps.push({ note, line, vars: { i, j, 'dp[i][j]': dp[i][j] }, grid: { cells: dp.map((r) => r.map((v) => (v === 0 ? '·' : String(v)))), marks } });
    };
    for (let i = 0; i < M; i++)
      for (let j = 0; j < N; j++) {
        if (i === 0 || j === 0) {
          dp[i][j] = 1;
          snap(i, j, `Cell (${i}, ${j}) is on the first row/column: only one way.`, 2);
        } else {
          dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
          snap(i, j, `Cell (${i}, ${j}) = ${dp[i - 1][j]} (from above) + ${dp[i][j - 1]} (from the left) = ${dp[i][j]}.`, 3);
        }
      }
    return { steps, result: `${dp[M - 1][N - 1]} paths` };
  },
};

export const permutations: LabAlgorithm = {
  id: 'permutations',
  title: 'Next permutation',
  lesson: 'a-sorted-permutations',
  summary: 'Pivot, swap with the next larger letter, reverse the suffix.',
  inputs: [{ key: 's', label: 'word (≤ 5 letters)', default: 'AAB', type: 'text' }],
  pseudocode: ['sort(a)', 'repeat:', '    print a', '    i = rightmost index with a[i] < a[i+1]', '    j = rightmost index with a[j] > a[i]', '    swap(a[i], a[j]); reverse(a[i+1..])'],
  run({ s }) {
    if (!/^[A-Za-z]{1,5}$/.test(s)) return err('Enter 1–5 letters.');
    const a = s.split('').sort();
    const steps: TraceStep[] = [];
    let count = 0;
    for (;;) {
      count++;
      let i = a.length - 2;
      while (i >= 0 && a[i] >= a[i + 1]) i--;
      steps.push({ note: i < 0 ? `Permutation #${count}: ${a.join('')} — the last one (no pivot).` : `Permutation #${count}: ${a.join('')}. Pivot index ${i} (${a[i]}).`, line: 2, vars: { '#': count, permutation: a.join(''), pivot: i < 0 ? '—' : i }, arrays: [arr('current', [...a], i >= 0 ? { [i]: 'cur' } : {})] });
      if (i < 0 || steps.length > 130) break;
      let j = a.length - 1;
      while (a[j] <= a[i]) j--;
      [a[i], a[j]] = [a[j], a[i]];
      const tail = a.splice(i + 1).reverse();
      a.push(...tail);
    }
    return { steps, result: `${count} distinct permutations` };
  },
};

export const nQueens: LabAlgorithm = {
  id: 'nqueens',
  title: 'N-Queens backtracking',
  lesson: 'a-n-queens',
  summary: 'One queen per row; undo when a row has no safe column.',
  inputs: [{ key: 'n', label: 'N (4–6)', default: '4', type: 'number' }],
  pseudocode: ['solve(row):', '  if row == n: success', '  for col in 0..n-1:', '    if safe(row, col):', '      place; if solve(row+1): return true', '      remove  (backtrack)', '  return false'],
  run({ n }) {
    const N = Math.trunc(+n);
    if (!Number.isFinite(N) || N < 4 || N > 6) return err('Choose N between 4 and 6 for the animation.');
    const q: number[] = [];
    const steps: TraceStep[] = [];
    const grid = (mark?: [number, number, Mark]) => {
      const cells = Array.from({ length: N }, () => Array(N).fill('·'));
      q.forEach((c, r) => (cells[r][c] = '♛'));
      const marks: Record<string, Mark> = {};
      q.forEach((c, r) => (marks[`${r},${c}`] = 'found'));
      if (mark) marks[`${mark[0]},${mark[1]}`] = mark[2];
      return { cells, marks };
    };
    const safe = (r: number, c: number) => q.every((qc, qr) => qc !== c && Math.abs(qc - c) !== r - qr);
    let solved = false;
    const solve = (row: number): boolean => {
      if (row === N) return true;
      for (let c = 0; c < N; c++) {
        if (steps.length > 350) return false;
        if (safe(row, c)) {
          q.push(c);
          steps.push({ note: `Row ${row}: column ${c} is safe → place a queen.`, line: 4, vars: { row, col: c, queens: q.length }, grid: grid() });
          if (solve(row + 1)) return true;
          q.pop();
          steps.push({ note: `Row ${row + 1} had no safe column → remove the queen from row ${row}, column ${c} (backtrack).`, line: 5, vars: { row, col: c, queens: q.length }, grid: grid([row, c, 'bad']) });
        } else {
          steps.push({ note: `Row ${row}: column ${c} is attacked — skip.`, line: 3, vars: { row, col: c, queens: q.length }, grid: grid([row, c, 'bad']) });
        }
      }
      return false;
    };
    solved = solve(0);
    return { steps, result: solved ? `solution (column per row): ${q.map((c) => c + 1).join(' ')}` : 'no solution found' };
  },
};

export const maze: LabAlgorithm = {
  id: 'maze',
  title: 'Rat in a maze (down/right)',
  lesson: 'a-maze-solving',
  summary: 'Try down, then right; un-mark dead ends.',
  inputs: [{ key: 'grid', label: 'rows (1 = open), comma-separated', default: '1000,1101,0100,1111', type: 'text' }],
  pseudocode: ['solve(x, y):', '  if (x, y) is the exit: mark; return true', '  if safe(x, y):', '    mark sol[x][y]', '    if solve(x+1, y): return true   (down)', '    if solve(x, y+1): return true   (right)', '    unmark sol[x][y]  (dead end)', '  return false'],
  run({ grid }) {
    const rows = grid.split(',').map((r) => r.trim());
    const N = rows.length;
    if (N < 2 || N > 6 || rows.some((r) => !/^[01]+$/.test(r) || r.length !== N)) return err('Enter a square maze of 2–6 rows made of 0s and 1s, e.g. 1000,1101,0100,1111.');
    const maze = rows.map((r) => r.split('').map(Number));
    const sol = maze.map((r) => r.map(() => 0));
    const steps: TraceStep[] = [];
    const view = (cur: [number, number], kind: Mark): TraceStep['grid'] => {
      const marks: Record<string, Mark> = {};
      sol.forEach((r, i) => r.forEach((v, j) => v && (marks[`${i},${j}`] = 'found')));
      marks[`${cur[0]},${cur[1]}`] = kind;
      return { cells: maze.map((r, i) => r.map((v, j) => (sol[i][j] ? '→' : v ? '1' : '▓'))), marks, caption: '→ = current path, 1 = open, ▓ = wall' };
    };
    const solve = (x: number, y: number): boolean => {
      if (steps.length > 300) return false;
      if (x === N - 1 && y === N - 1 && maze[x][y] === 1) {
        sol[x][y] = 1;
        steps.push({ note: `(${x}, ${y}) is the exit — success!`, line: 1, vars: { x, y }, grid: view([x, y], 'cur') });
        return true;
      }
      if (x >= 0 && y >= 0 && x < N && y < N && maze[x][y] === 1 && !sol[x][y]) {
        sol[x][y] = 1;
        steps.push({ note: `Mark (${x}, ${y}) as part of the path.`, line: 3, vars: { x, y }, grid: view([x, y], 'cur') });
        if (solve(x + 1, y)) return true;
        if (solve(x, y + 1)) return true;
        sol[x][y] = 0;
        steps.push({ note: `Down and right both failed: (${x}, ${y}) is a dead end — unmark it.`, line: 6, vars: { x, y }, grid: view([x, y], 'bad') });
      }
      return false;
    };
    const ok = solve(0, 0);
    return { steps, result: ok ? 'path found' : "solution doesn't exist" };
  },
};

export const hamiltonian: LabAlgorithm = {
  id: 'hamiltonian',
  title: 'Hamiltonian cycle',
  lesson: 'a-hamiltonian-cycle',
  summary: 'Extend a path vertex by vertex; un-choose on failure; close the cycle.',
  inputs: [{ key: 'matrix', label: 'adjacency rows (≤ 6), comma-separated', default: '01010,10111,01001,11001,01110', type: 'text' }],
  pseudocode: ['path[0] = 0', 'extend(pos):', '  if pos == V: return edge(path[V-1], path[0])', '  for v in 1..V-1:', '    if edge(path[pos-1], v) and v not in path:', '      path[pos] = v; if extend(pos+1): return true', '      path[pos] = -1', '  return false'],
  run({ matrix }) {
    const rows = matrix.split(',').map((r) => r.trim());
    const V = rows.length;
    if (V < 3 || V > 6 || rows.some((r) => !/^[01]+$/.test(r) || r.length !== V)) return err('Enter a square 0/1 matrix with 3–6 rows, e.g. 01010,10111,01001,11001,01110');
    const g = rows.map((r) => r.split('').map(Number));
    const path: number[] = [0];
    const steps: TraceStep[] = [{ note: 'Fix the start at vertex 0.', line: 0, vars: { pos: 1 }, arrays: [arr('path', [0], {})] }];
    const extend = (pos: number): boolean => {
      if (steps.length > 300) return false;
      if (pos === V) {
        const ok = g[path[V - 1]][path[0]] === 1;
        steps.push({ note: ok ? `All ${V} vertices placed and ${path[V - 1]} → ${path[0]} is an edge: cycle closed!` : `All placed but there is no edge ${path[V - 1]} → ${path[0]}: fail.`, line: 2, vars: { pos }, arrays: [arr('path', [...path], { [V - 1]: ok ? 'found' : 'bad' })] });
        return ok;
      }
      for (let v = 1; v < V; v++) {
        if (g[path[pos - 1]][v] === 1 && !path.includes(v)) {
          path.push(v);
          steps.push({ note: `Position ${pos}: vertex ${v} is adjacent to ${path[pos - 1]} and unused → place it.`, line: 5, vars: { pos, v }, arrays: [arr('path', [...path], { [pos]: 'cur' })] });
          if (extend(pos + 1)) return true;
          path.pop();
          steps.push({ note: `Backtrack: remove vertex ${v} from position ${pos}.`, line: 6, vars: { pos, v }, arrays: [arr('path', [...path], {})] });
        }
      }
      return false;
    };
    const ok = extend(1);
    return { steps, result: ok ? `Hamiltonian cycle: ${[...path, 0].join(' → ')}` : 'Solution does not exist' };
  },
};

export const knightsTour: LabAlgorithm = {
  id: 'knights-tour',
  title: "Warnsdorff's knight's tour",
  lesson: 'a-knights-tour',
  summary: 'Always jump to the square with the fewest onward moves.',
  inputs: [
    { key: 'n', label: 'board n (5–8)', default: '5', type: 'number' },
    { key: 'x', label: 'start x', default: '0', type: 'number' },
    { key: 'y', label: 'start y', default: '0', type: 'number' },
  ],
  pseudocode: ['board[start] = 1', 'for step = 2..n*n:', '    among unvisited knight moves choose', '    the one with the smallest degree', '    (first move wins ties)', '    move there; board = step'],
  run({ n, x, y }) {
    const N = Math.trunc(+n);
    let X = Math.trunc(+x), Y = Math.trunc(+y);
    if (!Number.isFinite(N) || N < 5 || N > 8 || X < 0 || Y < 0 || X >= N || Y >= N) return err('Board 5–8 and a start square inside it.');
    const dx = [1, 1, 2, 2, -1, -1, -2, -2];
    const dy = [2, -2, 1, -1, 2, -2, 1, -1];
    const b = Array.from({ length: N }, () => Array(N).fill(0));
    const free = (a: number, c: number) => a >= 0 && c >= 0 && a < N && c < N && b[c][a] === 0;
    const deg = (a: number, c: number) => dx.filter((_, m) => free(a + dx[m], c + dy[m])).length;
    b[Y][X] = 1;
    const view = (cx: number, cy: number): TraceStep['grid'] => {
      const marks: Record<string, Mark> = {};
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (b[r][c]) marks[`${r},${c}`] = 'done';
      marks[`${cy},${cx}`] = 'cur';
      return { cells: b.map((r) => r.map((v) => (v ? String(v) : '·'))), marks };
    };
    const steps: TraceStep[] = [{ note: `Start on (${X}, ${Y}).`, line: 0, vars: { x: X, y: Y, step: 1 }, grid: view(X, Y) }];
    for (let step = 2; step <= N * N; step++) {
      let best = -1, bd = 9;
      for (let m = 0; m < 8; m++) {
        const a = X + dx[m], c = Y + dy[m];
        if (free(a, c)) {
          const d = deg(a, c);
          if (d < bd) {
            bd = d;
            best = m;
          }
        }
      }
      if (best < 0) {
        steps.push({ note: 'No unvisited square reachable: the heuristic is stuck.', vars: { step }, grid: view(X, Y) });
        return { steps, result: `stuck after ${step - 1} squares` };
      }
      X += dx[best];
      Y += dy[best];
      b[Y][X] = step;
      steps.push({ note: `Move ${step}: go to (${X}, ${Y}), the square with the fewest onward moves (${bd}).`, line: 5, vars: { x: X, y: Y, step, 'degree chosen': bd }, grid: view(X, Y) });
    }
    return { steps, result: `tour completed: all ${N * N} squares visited` };
  },
};

void ints;
