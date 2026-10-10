import java.util.Scanner;

public class Ex2 {
    // Binary search in a sorted array; print the index or -1.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int lo = 0, hi = n - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) { ans = mid; break; }
            if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        System.out.println(ans);
    }
}
