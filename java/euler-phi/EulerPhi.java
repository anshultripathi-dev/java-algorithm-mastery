import java.util.Scanner;

public class EulerPhi {
    // phi(n) = n * (1 - 1/p1) * (1 - 1/p2) * ...   over the DISTINCT primes p dividing n.
    // We apply each factor as  result -= result / p  which stays in whole numbers.
    static long phi(long n) {
        long result = n;
        for (long p = 2; p * p <= n; p++) {
            if (n % p == 0) {            // p is a prime factor of n
                while (n % p == 0) {     // strip every copy of p so we never test it again
                    n /= p;
                }
                result -= result / p;    // multiply result by (1 - 1/p)
            }
        }
        if (n > 1) {                     // what is left is one prime factor larger than sqrt(original n)
            result -= result / n;
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        System.out.println("phi(" + n + ") = " + phi(n));
    }
}
