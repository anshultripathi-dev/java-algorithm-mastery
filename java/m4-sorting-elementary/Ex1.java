import java.util.Scanner;

public class Ex1 {
    // Bubble sort; print the sorted array and the number of swaps (= number of inversions).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int swaps = 0;
        for (int pass = 0; pass < n - 1; pass++) {
            boolean any = false;
            for (int i = 0; i < n - 1 - pass; i++) {
                if (a[i] > a[i + 1]) {
                    int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
                    swaps++;
                    any = true;
                }
            }
            if (!any) break;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i == 0 ? "" : " ").append(a[i]);
        System.out.println(sb);
        System.out.println(swaps);
    }
}
