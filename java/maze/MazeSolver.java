import java.util.Scanner;

public class MazeSolver {
    // Encoding from the lecture slide:
    // 0 road, 1 wall, 2 entry, 3 exit, 4 cell on the path found
    static int rows, cols;
    static int[][] g;
    static boolean[][] visited;
    static final int[] DR = {1, 0, -1, 0};    // down, right, up, left
    static final int[] DC = {0, 1, 0, -1};

    static boolean dfs(int r, int c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || g[r][c] == 1 || visited[r][c]) {
            return false;                           // outside, wall, or already explored
        }
        visited[r][c] = true;                       // remember: never walk in circles
        if (g[r][c] == 3) {
            return true;                            // exit found
        }
        for (int d = 0; d < 4; d++) {
            if (dfs(r + DR[d], c + DC[d])) {
                if (g[r][c] == 0) g[r][c] = 4;      // this cell lies on the successful route
                return true;
            }
        }
        return false;                               // all four directions failed: dead end
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        rows = sc.nextInt();
        cols = sc.nextInt();
        g = new int[rows][cols];
        visited = new boolean[rows][cols];
        int sr = 0, sc0 = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                g[i][j] = sc.nextInt();
                if (g[i][j] == 2) {
                    sr = i;
                    sc0 = j;
                }
            }
        }
        if (!dfs(sr, sc0)) {
            System.out.println("No path from entry to exit");
            return;
        }
        for (int[] row : g) {
            StringBuilder sb = new StringBuilder();
            for (int v : row) sb.append(sb.length() == 0 ? "" : " ").append(v);
            System.out.println(sb);
        }
    }
}
