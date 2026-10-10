import java.util.Scanner;

public class Ex3 {
    // Largest sum of any k x k block, using a 2-D prefix-sum table so each block costs O(1).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int k = sc.nextInt();
        long[][] p = new long[r + 1][c + 1];    // p[i][j] = sum of the rectangle rows 0..i-1, cols 0..j-1
        for (int i = 1; i <= r; i++) {
            for (int j = 1; j <= c; j++) {
                p[i][j] = sc.nextLong() + p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1];
            }
        }
        long best = Long.MIN_VALUE;
        for (int i = k; i <= r; i++) {
            for (int j = k; j <= c; j++) {
                long s = p[i][j] - p[i - k][j] - p[i][j - k] + p[i - k][j - k];
                best = Math.max(best, s);
            }
        }
        System.out.println(best);
    }
}
