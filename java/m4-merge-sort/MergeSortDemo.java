import java.util.Arrays;

public class MergeSortDemo {
    static long comparisons;

    // DIVIDE AND CONQUER: split in half, sort each half recursively, MERGE the two sorted halves.
    static void mergeSort(int[] a, int lo, int hi, int[] tmp) {
        if (hi - lo < 2) return;                    // 0 or 1 element: already sorted
        int mid = (lo + hi) >>> 1;
        mergeSort(a, lo, mid, tmp);
        mergeSort(a, mid, hi, tmp);
        merge(a, lo, mid, hi, tmp);
    }

    // merge a[lo..mid) and a[mid..hi), both sorted, into sorted order
    static void merge(int[] a, int lo, int mid, int hi, int[] tmp) {
        int i = lo, j = mid, k = lo;
        while (i < mid && j < hi) {
            comparisons++;
            if (a[i] <= a[j]) tmp[k++] = a[i++];    // <= takes the left one on ties: STABLE
            else tmp[k++] = a[j++];
        }
        while (i < mid) tmp[k++] = a[i++];
        while (j < hi) tmp[k++] = a[j++];
        System.arraycopy(tmp, lo, a, lo, hi - lo);
    }

    // The same merge also counts INVERSIONS (pairs i<j with a[i] > a[j]) in O(n log n).
    static long countInversions(int[] a, int lo, int hi, int[] tmp) {
        if (hi - lo < 2) return 0;
        int mid = (lo + hi) >>> 1;
        long inv = countInversions(a, lo, mid, tmp) + countInversions(a, mid, hi, tmp);
        int i = lo, j = mid, k = lo;
        while (i < mid && j < hi) {
            if (a[i] <= a[j]) tmp[k++] = a[i++];
            else {
                inv += mid - i;                      // a[j] jumps over every remaining left element
                tmp[k++] = a[j++];
            }
        }
        while (i < mid) tmp[k++] = a[i++];
        while (j < hi) tmp[k++] = a[j++];
        System.arraycopy(tmp, lo, a, lo, hi - lo);
        return inv;
    }

    public static void main(String[] args) {
        int[] a = {38, 27, 43, 3, 9, 82, 10};
        int[] copy = a.clone();
        mergeSort(a, 0, a.length, new int[a.length]);
        System.out.println(Arrays.toString(a) + " comparisons=" + comparisons);
        System.out.println("inversions in " + Arrays.toString(copy) + " = " + countInversions(copy, 0, copy.length, new int[copy.length]));

        int n = 1 << 16;                             // 65 536 elements, reverse sorted
        int[] big = new int[n];
        for (int i = 0; i < n; i++) big[i] = n - i;
        comparisons = 0;
        mergeSort(big, 0, n, new int[n]);
        System.out.println("n = " + n + ": " + comparisons + " comparisons (n log2 n = " + n * 16L + ")");
    }
}
