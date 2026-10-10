import java.util.Arrays;
import java.util.Scanner;

public class MajoritySorting {
    // After sorting, equal values sit together, so one pass counts every run. O(n log n).
    static Integer majority(int[] original) {
        int[] a = original.clone();
        Arrays.sort(a);
        int n = a.length;
        int run = 1;
        for (int i = 1; i <= n; i++) {
            if (i < n && a[i] == a[i - 1]) {
                run++;
            } else {
                if (run > n / 2) {
                    return a[i - 1];
                }
                run = 1;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        Integer m = majority(a);
        System.out.println(m == null ? "No majority element" : "Majority element: " + m);
    }
}
