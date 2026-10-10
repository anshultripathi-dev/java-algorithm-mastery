public class RatMazeDownRight {
    static final int N = 4;

    static boolean isSafe(int[][] maze, int x, int y) {
        return x >= 0 && x < N && y >= 0 && y < N && maze[x][y] == 1;   // inside the grid and an open cell
    }

    // The lecture's version: the rat may only move DOWN or RIGHT.
    static boolean solve(int[][] maze, int x, int y, int[][] sol) {
        if (x == N - 1 && y == N - 1) {
            sol[x][y] = 1;
            return true;                              // reached the exit
        }
        if (isSafe(maze, x, y)) {
            sol[x][y] = 1;                            // mark this cell as part of the path
            if (solve(maze, x + 1, y, sol)) return true;   // try down
            if (solve(maze, x, y + 1, sol)) return true;   // try right
            sol[x][y] = 0;                            // dead end: un-mark (backtrack)
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] maze = {
            {1, 0, 0, 0},
            {1, 1, 0, 1},
            {0, 1, 0, 0},
            {1, 1, 1, 1}
        };
        int[][] sol = new int[N][N];
        if (!solve(maze, 0, 0, sol)) {
            System.out.println("Solution doesn't exist");
            return;
        }
        for (int[] row : sol) {
            StringBuilder sb = new StringBuilder();
            for (int v : row) sb.append(' ').append(v).append(' ');
            System.out.println(sb);
        }
    }
}
