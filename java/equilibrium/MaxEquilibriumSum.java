import java.util.Scanner;

public class MaxEquilibriumSum {
    // One pass with a running left sum. right = total - left - a[i]. O(n) time, O(1) space.
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
        long bestExcluding = Long.MIN_VALUE;   // the sum of ONE side (the slide's definition)
        long bestIncluding = Long.MIN_VALUE;   // prefix sum that also includes a[i] (a common textbook variant)
        for (int i = 0; i < n; i++) {
            long right = total - left - a[i];
            if (left == right) {
                found = true;
                bestExcluding = Math.max(bestExcluding, left);
                bestIncluding = Math.max(bestIncluding, left + a[i]);
                System.out.println("equilibrium index " + i + ": side sum = " + left + ", including a[i] = " + (left + a[i]));
            }
            left += a[i];
        }
        if (!found) {
            System.out.println("no equilibrium index");
        } else {
            System.out.println("max equilibrium sum (slide definition) = " + bestExcluding);
            System.out.println("max prefix-including-element variant   = " + bestIncluding);
        }
    }
}
