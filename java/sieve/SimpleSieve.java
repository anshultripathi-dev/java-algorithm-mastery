import java.util.Scanner;

public class SimpleSieve {
    // Sieve of Eratosthenes: cross out the multiples of every prime; whatever survives is prime.
    static boolean[] sieve(int limit) {
        boolean[] isPrime = new boolean[limit + 1];
        for (int i = 2; i <= limit; i++) {
            isPrime[i] = true;                         // assume prime until crossed out
        }
        for (int p = 2; (long) p * p <= limit; p++) {  // primes bigger than sqrt(limit) have nothing left to cross out
            if (isPrime[p]) {
                for (int m = p * p; m <= limit; m += p) {  // smaller multiples were crossed out by smaller primes
                    isPrime[m] = false;
                }
            }
        }
        return isPrime;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int limit = sc.nextInt();
        boolean[] isPrime = sieve(limit);
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (int n = 2; n <= limit; n++) {
            if (isPrime[n]) {
                sb.append(n).append(' ');
                count++;
            }
        }
        System.out.println(sb.toString().trim());
        System.out.println("count = " + count);
    }
}
