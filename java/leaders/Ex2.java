import java.util.Scanner;

public class Ex2 {
    // Non-strict leaders: an element counts if it is >= every element to its right.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int[] out = new int[n];
        int c = 0;
        int max = Integer.MIN_VALUE;
        for (int i = n - 1; i >= 0; i--) {
            if (a[i] >= max) {
                out[c++] = a[i];
                max = a[i];
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = c - 1; i >= 0; i--) sb.append(sb.length() == 0 ? "" : " ").append(out[i]);
        System.out.println(sb);
    }
}
