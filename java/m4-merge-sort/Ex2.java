import java.util.Scanner;

public class Ex2 {
    // Merge two sorted arrays into one sorted array.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        int[] a = new int[n], b = new int[m];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        for (int i = 0; i < m; i++) b[i] = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        int i = 0, j = 0;
        while (i < n || j < m) {
            int v = (j >= m || (i < n && a[i] <= b[j])) ? a[i++] : b[j++];
            sb.append(sb.length() == 0 ? "" : " ").append(v);
        }
        System.out.println(sb);
    }
}
