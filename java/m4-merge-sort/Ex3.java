import java.util.Scanner;

public class Ex3 {
    static long count(int[] a, int lo, int hi, int[] t) {
        if (hi - lo < 2) return 0;
        int mid = (lo + hi) >>> 1;
        long inv = count(a, lo, mid, t) + count(a, mid, hi, t);
        int i = lo, j = mid, k = lo;
        while (i < mid && j < hi) {
            if (a[i] <= a[j]) t[k++] = a[i++];
            else {
                inv += mid - i;
                t[k++] = a[j++];
            }
        }
        while (i < mid) t[k++] = a[i++];
        while (j < hi) t[k++] = a[j++];
        System.arraycopy(t, lo, a, lo, hi - lo);
        return inv;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(count(a, 0, n, new int[n]));
    }
}
