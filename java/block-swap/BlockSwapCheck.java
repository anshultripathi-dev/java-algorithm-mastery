import java.util.Arrays;

public class BlockSwapCheck {
    static void swap(int[] a, int fi, int si, int d) {
        for (int i = 0; i < d; i++) {
            int t = a[fi + i];
            a[fi + i] = a[si + i];
            a[si + i] = t;
        }
    }

    static void blockSwap(int[] a, int d) {
        int n = a.length;
        d %= n;
        if (d == 0) return;
        int i = d, j = n - d;
        while (i != j) {
            if (i < j) {
                swap(a, d - i, d + j - i, i);
                j -= i;
            } else {
                swap(a, d - i, d, j);
                i -= j;
            }
        }
        swap(a, d - i, d, i);
    }

    // Compares block swap with the obvious "rotate through a temp array" for every n <= 40 and every d.
    public static void main(String[] args) {
        int checked = 0;
        for (int n = 1; n <= 40; n++) {
            for (int d = 0; d <= 2 * n; d++) {
                int[] a = new int[n];
                for (int i = 0; i < n; i++) a[i] = i + 1;
                int[] expected = new int[n];
                for (int i = 0; i < n; i++) expected[i] = a[(i + d) % n];
                blockSwap(a, d);
                if (!Arrays.equals(a, expected)) {
                    System.out.println("MISMATCH n=" + n + " d=" + d + " got " + Arrays.toString(a));
                    return;
                }
                checked++;
            }
        }
        System.out.println("block swap matches the reference for all " + checked + " (n, d) pairs");
    }
}
