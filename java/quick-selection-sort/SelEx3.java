import java.util.Scanner;

public class SelEx3 {
    // The k smallest values in increasing order using only k selection passes: O(n * k).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        for (int i = 0; i < k; i++) {
            int m = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[m]) m = j;
            }
            int t = a[m];
            a[m] = a[i];
            a[i] = t;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) sb.append(i == 0 ? "" : " ").append(a[i]);
        System.out.println(sb);
    }
}
