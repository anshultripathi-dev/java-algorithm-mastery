import java.util.Scanner;

public class PathsFormula {
    // Every path has (m-1) downs and (n-1) rights in some order: choose where the downs go.
    // paths = C(m + n - 2, m - 1)
    static long paths(int m, int n) {
        int total = m + n - 2;
        int k = Math.min(m - 1, n - 1);
        long result = 1;
        for (int i = 1; i <= k; i++) {
            result = result * (total - k + i) / i;       // exact at every step
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int n = sc.nextInt();
        System.out.println(paths(m, n));
    }
}
