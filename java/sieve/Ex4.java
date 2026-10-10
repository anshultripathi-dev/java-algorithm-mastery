import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex4 {
    // Count primes in [L, R] where R can be as large as 10^12 but R - L <= 10^6.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long low = sc.nextLong();
        long high = sc.nextLong();
        int root = (int) Math.sqrt((double) high);
        while ((long) root * root > high) root--;
        while ((long) (root + 1) * (root + 1) <= high) root++;

        boolean[] small = new boolean[root + 1];
        List<Integer> base = new ArrayList<>();
        for (int i = 2; i <= root; i++) {
            if (!small[i]) {
                base.add(i);
                for (long m = (long) i * i; m <= root; m += i) {
                    small[(int) m] = true;
                }
            }
        }
        boolean[] composite = new boolean[(int) (high - low + 1)];
        for (int p : base) {
            long start = Math.max((long) p * p, (low + p - 1) / p * p);
            for (long m = start; m <= high; m += p) {
                composite[(int) (m - low)] = true;
            }
        }
        int count = 0;
        for (long n = Math.max(low, 2); n <= high; n++) {
            if (!composite[(int) (n - low)]) {
                count++;
            }
        }
        System.out.println(count);
    }
}
