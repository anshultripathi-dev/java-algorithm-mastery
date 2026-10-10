import java.util.Scanner;

public class Ex3 {
    // Count how many times target occurs in a sorted array in O(log n): upper bound - lower bound.
    static int lower(int[] a, int t) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] < t) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(lower(a, target + 1) - lower(a, target));
    }
}
