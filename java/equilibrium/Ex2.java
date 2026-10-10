import java.util.Scanner;

public class Ex2 {
    // Print the maximum equilibrium sum (one side's sum), or "none".
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] a = new long[n];
        long total = 0;
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextLong();
            total += a[i];
        }
        long left = 0;
        boolean found = false;
        long best = Long.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            if (left == total - left - a[i]) {
                found = true;
                best = Math.max(best, left);
            }
            left += a[i];
        }
        System.out.println(found ? String.valueOf(best) : "none");
    }
}
