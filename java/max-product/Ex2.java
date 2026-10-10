import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long mx = 0, mn = 0, best = 0;
        for (int i = 0; i < n; i++) {
            long x = sc.nextInt();
            if (i == 0) {
                mx = mn = best = x;
                continue;
            }
            if (x < 0) {
                long t = mx;
                mx = mn;
                mn = t;
            }
            mx = Math.max(x, mx * x);
            mn = Math.min(x, mn * x);
            best = Math.max(best, mx);
        }
        System.out.println(best);
    }
}
