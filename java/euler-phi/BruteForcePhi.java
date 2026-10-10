import java.util.Scanner;

public class BruteForcePhi {
    static int gcd(int a, int b) {
        while (b != 0) {
            int r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    // phi(n) = how many numbers k in 1..n have gcd(k, n) = 1  ("coprime to n")
    static int phi(int n) {
        int count = 0;
        for (int k = 1; k <= n; k++) {
            if (gcd(k, n) == 1) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println("phi(" + n + ") = " + phi(n));
    }
}
