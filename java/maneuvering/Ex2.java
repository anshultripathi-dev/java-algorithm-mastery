import java.util.Scanner;

public class Ex2 {
    // Grid of 0 (free) and 1 (blocked). Count right/down paths from top-left to bottom-right.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] g = new int[r][c];
        for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) g[i][j] = sc.nextInt();
        long[][] dp = new long[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                if (g[i][j] == 1) {
                    dp[i][j] = 0;
                } else if (i == 0 && j == 0) {
                    dp[i][j] = 1;
                } else {
                    dp[i][j] = (i > 0 ? dp[i - 1][j] : 0) + (j > 0 ? dp[i][j - 1] : 0);
                }
            }
        }
        System.out.println(dp[r - 1][c - 1]);
    }
}
