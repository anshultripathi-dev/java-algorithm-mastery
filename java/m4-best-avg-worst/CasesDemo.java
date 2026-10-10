import java.util.Random;

public class CasesDemo {
    static long linearComparisons(int[] a, int target) {
        long c = 0;
        for (int x : a) {
            c++;
            if (x == target) break;
        }
        return c;
    }

    static long insertionComparisons(int[] a) {
        a = a.clone();
        long c = 0;
        for (int i = 1; i < a.length; i++) {
            int key = a[i], j = i - 1;
            while (j >= 0) {
                c++;
                if (a[j] <= key) break;
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
        return c;
    }

    static long quickDepthWork;

    // quick sort on the LAST element as pivot: counts comparisons
    static void quick(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int pivot = a[hi], i = lo - 1;
        for (int j = lo; j < hi; j++) {
            quickDepthWork++;
            if (a[j] <= pivot) {
                i++;
                int t = a[i]; a[i] = a[j]; a[j] = t;
            }
        }
        int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;
        quick(a, lo, i);
        quick(a, i + 2, hi);
    }

    public static void main(String[] args) {
        int n = 1000;
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = i;
        System.out.println("LINEAR SEARCH in " + n + " elements");
        System.out.println("  best  (target is first)   : " + linearComparisons(a, 0));
        System.out.println("  worst (target is last)    : " + linearComparisons(a, n - 1));
        Random rnd = new Random(1);
        long total = 0;
        for (int t = 0; t < 10_000; t++) total += linearComparisons(a, rnd.nextInt(n));
        System.out.println("  average (10 000 random)   : " + total / 10_000);

        int[] sortedIn = a.clone();
        int[] reversed = new int[n];
        for (int i = 0; i < n; i++) reversed[i] = n - i;
        int[] random = new int[n];
        for (int i = 0; i < n; i++) random[i] = rnd.nextInt(n);
        System.out.println("INSERTION SORT comparisons for n = " + n);
        System.out.println("  best (sorted)    : " + insertionComparisons(sortedIn));
        System.out.println("  worst (reversed) : " + insertionComparisons(reversed));
        System.out.println("  random           : " + insertionComparisons(random));

        System.out.println("QUICK SORT (last-element pivot) comparisons for n = " + n);
        quickDepthWork = 0;
        quick(random.clone(), 0, n - 1);
        System.out.println("  random data      : " + quickDepthWork);
        quickDepthWork = 0;
        quick(sortedIn.clone(), 0, n - 1);
        System.out.println("  already sorted   : " + quickDepthWork + "   (worst case n(n-1)/2 = " + n * (n - 1) / 2 + ")");
    }
}
