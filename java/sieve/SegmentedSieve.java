import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class SegmentedSieve {
    // Step 1: ordinary sieve that returns every prime up to `limit`.
    static List<Integer> simpleSieve(int limit) {
        boolean[] composite = new boolean[limit + 1];
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= limit; i++) {
            if (!composite[i]) {
                primes.add(i);
                for (long m = (long) i * i; m <= limit; m += i) {
                    composite[(int) m] = true;
                }
            }
        }
        return primes;
    }

    // Step 2: sieve only the window [low, high] using the small primes up to sqrt(high).
    static List<Long> segmentedSieve(long low, long high) {
        int root = (int) Math.sqrt((double) high);
        while ((long) root * root > high) root--;            // guard against floating-point rounding
        while ((long) (root + 1) * (root + 1) <= high) root++;
        List<Integer> basePrimes = simpleSieve(root);

        boolean[] composite = new boolean[(int) (high - low + 1)];   // index i  <->  number low + i
        for (int p : basePrimes) {
            // first multiple of p that is >= low, but never below p*p (p itself must stay prime)
            long start = Math.max((long) p * p, (low + p - 1) / p * p);
            for (long m = start; m <= high; m += p) {
                composite[(int) (m - low)] = true;
            }
        }
        List<Long> primes = new ArrayList<>();
        for (long n = Math.max(low, 2); n <= high; n++) {
            if (!composite[(int) (n - low)]) {
                primes.add(n);
            }
        }
        return primes;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long low = sc.nextLong();
        long high = sc.nextLong();
        List<Long> primes = segmentedSieve(low, high);
        StringBuilder sb = new StringBuilder();
        for (long p : primes) {
            sb.append(p).append(' ');
        }
        System.out.println(sb.toString().trim());
        System.out.println("count = " + primes.size());
    }
}
