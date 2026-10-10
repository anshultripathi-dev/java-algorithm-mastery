import java.util.Scanner;

public class Ex3 {
    // Print "product start end" for the maximum-product subarray (0-based, earliest start, then earliest end).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        long best = Long.MIN_VALUE;
        int bs = 0, be = 0;
        for (int i = 0; i < n; i++) {
            long p = 1;
            for (int j = i; j < n; j++) {
                p *= a[j];
                if (p > best) {
                    best = p;
                    bs = i;
                    be = j;
                }
            }
        }
        System.out.println(best + " " + bs + " " + be);
    }
}
