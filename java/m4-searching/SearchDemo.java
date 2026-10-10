import java.util.Arrays;

public class SearchDemo {
    static int comparisons;

    // LINEAR SEARCH: works on any array; O(n)
    static int linear(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            comparisons++;
            if (a[i] == target) return i;
        }
        return -1;
    }

    // BINARY SEARCH: needs a SORTED array; halves the range each step; O(log n)
    static int binary(int[] a, int target) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;          // never (lo + hi) / 2: that can overflow
            comparisons++;
            if (a[mid] == target) return mid;
            if (a[mid] < target) lo = mid + 1;     // target can only be on the right
            else hi = mid - 1;                     // or on the left
        }
        return -1;
    }

    // first index whose value is >= target (the "lower bound"): useful when duplicates exist
    static int lowerBound(int[] a, int target) {
        int lo = 0, hi = a.length;                 // hi is exclusive
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    static int binaryRecursive(int[] a, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        return a[mid] < target ? binaryRecursive(a, target, mid + 1, hi) : binaryRecursive(a, target, lo, mid - 1);
    }

    public static void main(String[] args) {
        int[] a = new int[1000];
        for (int i = 0; i < a.length; i++) a[i] = 2 * i + 1;      // 1, 3, 5, ... 1999 (sorted, distinct)
        comparisons = 0;
        System.out.println("linear 1999 -> index " + linear(a, 1999) + " after " + comparisons + " comparisons");
        comparisons = 0;
        System.out.println("binary 1999 -> index " + binary(a, 1999) + " after " + comparisons + " comparisons");
        System.out.println("binary 1000 (absent) -> " + binary(a, 1000));
        System.out.println("recursive 501 -> " + binaryRecursive(a, 501, 0, a.length - 1));
        int[] dup = {1, 2, 2, 2, 5, 9};
        System.out.println("lowerBound(2) = " + lowerBound(dup, 2) + ", lowerBound(3) = " + lowerBound(dup, 3));
        System.out.println("library: " + Arrays.binarySearch(a, 501));
    }
}
