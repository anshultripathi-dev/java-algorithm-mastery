import java.util.Scanner;

public class MaxProductBrute {
    // Try every subarray (start i, end j): there are n(n+1)/2 of them. O(n^2).
    static long maxProduct(int[] a) {
        long best = a[0];
        for (int i = 0; i < a.length; i++) {
            long product = 1;
            for (int j = i; j < a.length; j++) {
                product *= a[j];               // product of a[i..j], extended one element at a time
                best = Math.max(best, product);
            }
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
