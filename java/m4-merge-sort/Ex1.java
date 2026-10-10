import java.util.Scanner;

public class Ex1 {
    static void sort(int[] a, int lo, int hi, int[] t) {
        if (hi - lo < 2) return;
        int mid = (lo + hi) >>> 1;
        sort(a, lo, mid, t);
        sort(a, mid, hi, t);
        int i = lo, j = mid, k = lo;
        while (i < mid && j < hi) t[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i < mid) t[k++] = a[i++];
        while (j < hi) t[k++] = a[j++];
        System.arraycopy(t, lo, a, lo, hi - lo);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        sort(a, 0, n, new int[n]);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i == 0 ? "" : " ").append(a[i]);
        System.out.println(sb);
    }
}
