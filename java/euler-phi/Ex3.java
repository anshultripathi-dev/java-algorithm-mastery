import java.util.Scanner;

public class Ex3 {
    // Number of ordered pairs (a, b) with 1 <= a, b <= n and gcd(a, b) = 1.
    // For each larger value b = 2..n there are phi(b) smaller partners a; double for order; add (1,1).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] phi = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            phi[i] = i;
        }
        for (int p = 2; p <= n; p++) {
            if (phi[p] == p) {
                for (int m = p; m <= n; m += p) {
                    phi[m] -= phi[m] / p;
                }
            }
        }
        long sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += phi[i];
        }
        System.out.println(2 * sum - 1);
    }
}
