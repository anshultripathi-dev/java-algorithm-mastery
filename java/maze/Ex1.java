import java.util.Scanner;

public class Ex1 {
    // Count the cells reachable from the entry (2) moving up/down/left/right through non-walls (flood fill).
    static int r, c;
    static int[][] g;
    static boolean[][] seen;

    static int fill(int i, int j) {
        if (i < 0 || j < 0 || i >= r || j >= c || g[i][j] == 1 || seen[i][j]) return 0;
        seen[i][j] = true;
        return 1 + fill(i + 1, j) + fill(i - 1, j) + fill(i, j + 1) + fill(i, j - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        r = sc.nextInt();
        c = sc.nextInt();
        g = new int[r][c];
        seen = new boolean[r][c];
        int si = 0, sj = 0;
        for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) {
            g[i][j] = sc.nextInt();
            if (g[i][j] == 2) { si = i; sj = j; }
        }
        System.out.println(fill(si, sj));
    }
}
