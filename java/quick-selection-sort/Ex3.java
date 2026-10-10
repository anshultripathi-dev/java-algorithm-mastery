import java.util.Scanner;

public class Ex3 {
    // Quickselect: k-th smallest (1-based) without sorting everything. Average O(n).
    static int select(int[] a, int k) {
        int lo = 0, hi = a.length - 1;
        while (true) {
            int pivot = a[hi], i = lo - 1;
            for (int j = lo; j < hi; j++) {
                if (a[j] <= pivot) {
                    i++;
                    int t = a[i];
                    a[i] = a[j];
                    a[j] = t;
                }
            }
            int t = a[i + 1];
            a[i + 1] = a[hi];
            a[hi] = t;
            int p = i + 1;
            if (p == k - 1) return a[p];
            if (p > k - 1) hi = p - 1;
            else lo = p + 1;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(select(a, k));
    }
}
