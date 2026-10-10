import java.util.Scanner;

public class MaxProduct {
    // Keep the best AND the worst product of a subarray ending at i. A negative number turns the
    // worst (most negative) product into the best one, so both are needed. O(n) time, O(1) space.
    static long maxProduct(int[] a) {
        long maxEnding = a[0];
        long minEnding = a[0];
        long best = a[0];
        for (int i = 1; i < a.length; i++) {
            long x = a[i];
            if (x < 0) {                         // multiplying by a negative swaps the roles
                long t = maxEnding;
                maxEnding = minEnding;
                minEnding = t;
            }
            maxEnding = Math.max(x, maxEnding * x);   // extend the previous run, or start fresh at x
            minEnding = Math.min(x, minEnding * x);
            best = Math.max(best, maxEnding);
        }
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(maxProduct(a));
    }
}
