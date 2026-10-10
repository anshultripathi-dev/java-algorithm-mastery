import java.util.Random;

public class MaxProductCheck {
    static long brute(int[] a) {
        long best = Long.MIN_VALUE;
        for (int i = 0; i < a.length; i++) {
            long p = 1;
            for (int j = i; j < a.length; j++) {
                p *= a[j];
                best = Math.max(best, p);
            }
        }
        return best;
    }

    static long fast(int[] a) {
        long mx = a[0], mn = a[0], best = a[0];
        for (int i = 1; i < a.length; i++) {
            long x = a[i];
            if (x < 0) {
                long t = mx;
                mx = mn;
                mn = t;
            }
            mx = Math.max(x, mx * x);
            mn = Math.min(x, mn * x);
            best = Math.max(best, mx);
        }
        return best;
    }

    // 20 000 random arrays with values in [-4, 4] (zeros and negatives included) against brute force.
    public static void main(String[] args) {
        Random rnd = new Random(2024);
        for (int t = 0; t < 20000; t++) {
            int n = 1 + rnd.nextInt(9);
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = rnd.nextInt(9) - 4;
            if (brute(a) != fast(a)) {
                System.out.println("MISMATCH on " + java.util.Arrays.toString(a));
                return;
            }
        }
        System.out.println("fast version matches brute force on 20000 random arrays");
    }
}
