import java.util.Scanner;

public class Combination {
    // nCr without ever building n!: multiply and divide one step at a time.
    // After step i the running value is exactly C(n - r + i, i), always a whole number.
    static long nCr(int n, int r) {
        if (r < 0 || r > n) {
            return 0;
        }
        r = Math.min(r, n - r);         // C(n, r) == C(n, n - r); fewer steps
        long result = 1;
        for (int i = 1; i <= r; i++) {
            result = result * (n - r + i) / i;
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int r = sc.nextInt();
        System.out.println(n + "C" + r + " = " + nCr(n, r));
    }
}
