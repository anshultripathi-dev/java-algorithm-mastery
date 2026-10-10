import java.util.Scanner;

public class MajorityBruteForce {
    // Count how many times each element occurs (two loops). O(n^2).
    static Integer majority(int[] a) {
        int n = a.length;
        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) {
                if (a[j] == a[i]) {
                    count++;
                }
            }
            if (count > n / 2) {      // strictly more than half
                return a[i];
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
