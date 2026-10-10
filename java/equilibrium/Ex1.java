import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] a = new long[n];
        long total = 0;
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextLong();
            total += a[i];
        }
        long left = 0;
        for (int i = 0; i < n; i++) {
            if (left == total - left - a[i]) {
                System.out.println(i);
                return;
            }
            left += a[i];
        }
        System.out.println(-1);
    }
}
