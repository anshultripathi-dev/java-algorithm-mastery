import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = n - 1; i >= 0; i--) sb.append(i == n - 1 ? "" : " ").append(a[i]);
        System.out.println(sb);
    }
}
