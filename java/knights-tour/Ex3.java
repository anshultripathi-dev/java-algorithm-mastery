import java.util.Scanner;

public class Ex3 {
    // Count the squares of an n x n board that a knight can reach from (0,0) in exactly k moves
    // (squares may be visited again). Plain breadth-first layers.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] dx = {1, 1, 2, 2, -1, -1, -2, -2};
        int[] dy = {2, -2, 1, -1, 2, -2, 1, -1};
        boolean[][] cur = new boolean[n][n];
        cur[0][0] = true;
        for (int step = 0; step < k; step++) {
            boolean[][] next = new boolean[n][n];
            for (int y = 0; y < n; y++) {
                for (int x = 0; x < n; x++) {
                    if (!cur[y][x]) continue;
                    for (int m = 0; m < 8; m++) {
                        int nx = x + dx[m], ny = y + dy[m];
                        if (nx >= 0 && ny >= 0 && nx < n && ny < n) next[ny][nx] = true;
                    }
                }
            }
            cur = next;
        }
        int c = 0;
        for (boolean[] row : cur) for (boolean b : row) if (b) c++;
        System.out.println(c);
    }
}
