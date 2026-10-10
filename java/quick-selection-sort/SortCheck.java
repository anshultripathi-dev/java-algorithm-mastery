import java.util.Arrays;
import java.util.Random;

public class SortCheck {
    static void selection(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int m = i;
            for (int j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
            int t = a[m]; a[m] = a[i]; a[i] = t;
        }
    }

    static int partition(int[] a, int lo, int hi) {
        int p = a[hi], i = lo - 1;
        for (int j = lo; j < hi; j++) if (a[j] <= p) { i++; int t = a[i]; a[i] = a[j]; a[j] = t; }
        int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;
        return i + 1;
    }

    static void quick(int[] a, int lo, int hi) {
        if (lo < hi) {
            int p = partition(a, lo, hi);
            quick(a, lo, p - 1);
            quick(a, p + 1, hi);
        }
    }

    // 5000 random arrays (with many duplicates) sorted by both algorithms and compared with Arrays.sort.
    public static void main(String[] args) {
        Random rnd = new Random(5);
        for (int t = 0; t < 5000; t++) {
            int n = rnd.nextInt(30);
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = rnd.nextInt(10) - 5;
            int[] expected = a.clone();
            Arrays.sort(expected);
            int[] s = a.clone();
            selection(s);
            int[] q = a.clone();
            quick(q, 0, n - 1);
            if (!Arrays.equals(s, expected) || !Arrays.equals(q, expected)) {
                System.out.println("MISMATCH on " + Arrays.toString(a));
                return;
            }
        }
        System.out.println("selection sort and quick sort agree with Arrays.sort on 5000 random arrays");
    }
}
