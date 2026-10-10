import java.util.Scanner;

public class Ex1 {
    // Selection sort; print how many swaps that actually move something (minIndex != i) were performed.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int swaps = 0;
        for (int i = 0; i < n - 1; i++) {
            int m = i;
            for (int j = i + 1; j < n; j++) if (a[j] < a[m]) m = j;
            if (m != i) {
                int t = a[m];
                a[m] = a[i];
                a[i] = t;
                swaps++;
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i == 0 ? "" : " ").append(a[i]);
        System.out.println(sb);
        System.out.println(swaps);
    }
}
