import java.util.Scanner;

public class Ex1 {
    // Greedy activity selection: maximum number of non-overlapping intervals (sort by END time).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] iv = new int[n][2];
        for (int i = 0; i < n; i++) {
            iv[i][0] = sc.nextInt();
            iv[i][1] = sc.nextInt();
        }
        java.util.Arrays.sort(iv, (a, b) -> Integer.compare(a[1], b[1]));
        int count = 0, lastEnd = Integer.MIN_VALUE;
        for (int[] x : iv) {
            if (x[0] >= lastEnd) {
                count++;
                lastEnd = x[1];
            }
        }
        System.out.println(count);
    }
}
