import java.util.Arrays;
import java.util.Scanner;

public class BlockSwapRotate {
    // swap d elements starting at index fi with d elements starting at index si
    static void swap(int[] a, int fi, int si, int d) {
        for (int i = 0; i < d; i++) {
            int temp = a[fi + i];
            a[fi + i] = a[si + i];
            a[si + i] = temp;
        }
    }

    // Left-rotate a[0..n-1] by d using block swaps. A = a[0..d-1], B = a[d..n-1].
    static void leftRotate(int[] a, int d) {
        int n = a.length;
        if (n == 0) return;
        d %= n;
        if (d == 0) return;
        int i = d;          // size of block A (still to be placed)
        int j = n - d;      // size of block B
        while (i != j) {
            if (i < j) {                      // A is shorter: swap A with the LAST i elements of B
                swap(a, d - i, d + j - i, i);
                j -= i;                       // those i elements of B are now final
            } else {                          // A is longer: swap the LAST j elements of A with B
                swap(a, d - i, d, j);
                i -= j;
            }
        }
        swap(a, d - i, d, i);                 // equal sizes: one final block swap
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
