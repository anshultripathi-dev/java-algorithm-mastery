import java.util.Scanner;

public class Ex3 {
    // The smallest element sits right after the "break" where a[i] > a[i+1].
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (a[mid] > a[hi]) {
                lo = mid + 1;       // the minimum is to the right of mid
            } else {
                hi = mid;           // the minimum is at mid or to its left
            }
        }
        System.out.println(lo);     // index of the minimum == number of left rotations
    }
}
