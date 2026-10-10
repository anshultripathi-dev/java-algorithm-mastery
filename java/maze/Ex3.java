import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Scanner;

public class Ex3 {
    // Length (number of moves) of the SHORTEST route from entry (2) to exit (3), or -1. Breadth-first search.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] g = new int[r][c];
        int si = 0, sj = 0;
        for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) {
            g[i][j] = sc.nextInt();
            if (g[i][j] == 2) { si = i; sj = j; }
        }
        int[][] dist = new int[r][c];
        for (int[] row : dist) java.util.Arrays.fill(row, -1);
        Deque<int[]> q = new ArrayDeque<>();
        q.add(new int[] {si, sj});
        dist[si][sj] = 0;
        int[] dr = {1, -1, 0, 0};
        int[] dc = {0, 0, 1, -1};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            if (g[cur[0]][cur[1]] == 3) {
                System.out.println(dist[cur[0]][cur[1]]);
                return;
            }
            for (int d = 0; d < 4; d++) {
                int ni = cur[0] + dr[d], nj = cur[1] + dc[d];
                if (ni < 0 || nj < 0 || ni >= r || nj >= c || g[ni][nj] == 1 || dist[ni][nj] != -1) continue;
                dist[ni][nj] = dist[cur[0]][cur[1]] + 1;
                q.add(new int[] {ni, nj});
            }
        }
        System.out.println(-1);
    }
}
