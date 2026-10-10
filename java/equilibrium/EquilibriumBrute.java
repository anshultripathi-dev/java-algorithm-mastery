import java.util.Scanner;

public class EquilibriumBrute {
    // For every index i, add up everything to its left and everything to its right. O(n^2).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        boolean found = false;
        for (int i = 0; i < n; i++) {
            long left = 0, right = 0;
            for (int j = 0; j < i; j++) left += a[j];
            for (int j = i + 1; j < n; j++) right += a[j];
            if (left == right) {
                System.out.println("equilibrium index " + i + "  (each side sums to " + left + ")");
                found = true;
            }
        }
        if (!found) System.out.println("no equilibrium index");
    }
}
