import java.util.Arrays;
import java.util.Scanner;

public class RotateReversal {
    static void reverse(int[] a, int lo, int hi) {
        while (lo < hi) {
            int t = a[lo];
            a[lo++] = a[hi];
            a[hi--] = t;
        }
    }

    // Reverse A, reverse B, then reverse the whole array:  (A^r B^r)^r = B A
    static void leftRotate(int[] a, int d) {
        int n = a.length;
        d %= n;
        reverse(a, 0, d - 1);
        reverse(a, d, n - 1);
        reverse(a, 0, n - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int d = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        leftRotate(a, d);
        System.out.println(Arrays.toString(a));
    }
}
