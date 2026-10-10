import java.util.Scanner;

public class Ex3 {
    // Count split points k (1 <= k <= n-1) where sum(a[0..k-1]) == sum(a[k..n-1]).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] a = new long[n];
        long total = 0;
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextLong();
            total += a[i];
        }
        long prefix = 0;
        int count = 0;
        for (int k = 1; k < n; k++) {
            prefix += a[k - 1];
            if (prefix == total - prefix) count++;
        }
        System.out.println(count);
    }
}
