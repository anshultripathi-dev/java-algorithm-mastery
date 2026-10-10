import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] phi = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            phi[i] = i;
        }
        for (int p = 2; p <= n; p++) {
            if (phi[p] == p) {                       // p is prime
                for (int m = p; m <= n; m += p) {
                    phi[m] -= phi[m] / p;
                }
            }
        }
        long sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += phi[i];
        }
        System.out.println(sum);
    }
}
