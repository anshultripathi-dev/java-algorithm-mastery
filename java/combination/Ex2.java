import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        final long MOD = 1_000_000_007L;
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int r = sc.nextInt();
        long[][] c = new long[n + 1][r + 1];
        for (int i = 0; i <= n; i++) {
            c[i][0] = 1;
            for (int j = 1; j <= Math.min(i, r); j++) {
                c[i][j] = (c[i - 1][j - 1] + (j <= i - 1 ? c[i - 1][j] : 0)) % MOD;
            }
        }
        System.out.println(c[n][r]);
    }
}
