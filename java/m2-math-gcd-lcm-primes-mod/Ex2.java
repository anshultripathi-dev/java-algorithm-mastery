import java.util.Scanner;

public class Ex2 {
    // Print all divisors of n in increasing order using the sqrt trick (pairs d, n/d).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        java.util.TreeSet<Long> divisors = new java.util.TreeSet<>();
        for (long d = 1; d * d <= n; d++) {
            if (n % d == 0) {
                divisors.add(d);
                divisors.add(n / d);
            }
        }
        StringBuilder sb = new StringBuilder();
        for (long d : divisors) sb.append(sb.length() == 0 ? "" : " ").append(d);
        System.out.println(sb);
    }
}
