import java.util.Scanner;

public class Ex2 {
    static int r, c;
    static int[][] g;
    static boolean[][] seen;

    static boolean reach(int i, int j) {
        if (i < 0 || j < 0 || i >= r || j >= c || g[i][j] == 1 || seen[i][j]) return false;
        if (g[i][j] == 3) return true;
        seen[i][j] = true;
        return reach(i + 1, j) || reach(i - 1, j) || reach(i, j + 1) || reach(i, j - 1);
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
        System.out.println(reach(si, sj) ? "YES" : "NO");
    }
}
