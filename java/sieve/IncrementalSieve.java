import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IncrementalSieve {
    // An incremental (unbounded) sieve: no upper limit is needed in advance.
    // `composites` remembers, for each upcoming composite number, which primes will cross it out.
    private final Map<Long, List<Long>> composites = new HashMap<>();
    private long candidate = 1;

    long nextPrime() {
        while (true) {
            candidate++;
            List<Long> crossers = composites.remove(candidate);
            if (crossers == null) {
                // nobody has crossed candidate out, so it is prime; schedule its first multiple p*p
                composites.computeIfAbsent(candidate * candidate, k -> new ArrayList<>()).add(candidate);
                return candidate;
            }
            for (long p : crossers) {      // candidate is composite: move each p on to its next multiple
                composites.computeIfAbsent(candidate + p, k -> new ArrayList<>()).add(p);
            }
        }
    }

    public static void main(String[] args) {
        IncrementalSieve s = new IncrementalSieve();
        StringBuilder first = new StringBuilder();
        for (int i = 0; i < 15; i++) {
            first.append(s.nextPrime()).append(' ');
        }
        System.out.println("first 15 primes: " + first.toString().trim());

        // "start from N": keep generating and skip everything below N
        long N = 100;
        IncrementalSieve t = new IncrementalSieve();
        long p = t.nextPrime();
        while (p < N) {
            p = t.nextPrime();
        }
        StringBuilder from = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            from.append(p).append(' ');
            p = t.nextPrime();
        }
        System.out.println("first 5 primes >= " + N + ": " + from.toString().trim());
    }
}
