import java.util.Scanner;

public class Ex3 {
    // returns {g, x, y} with a*x + b*y = g = gcd(a, b)
    static long[] extendedGcd(long a, long b) {
        if (b == 0) {
            return new long[] {a, 1, 0};
        }
        long[] next = extendedGcd(b, a % b);
        long g = next[0];
        long x = next[2];
        long y = next[1] - (a / b) * next[2];
        return new long[] {g, x, y};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long m = sc.nextLong();
        long[] r = extendedGcd(a, m);
        if (r[0] != 1) {
            System.out.println(-1); // a and m share a factor: no inverse exists
        } else {
            long inverse = ((r[1] % m) + m) % m; // shift a possibly-negative x into [0, m-1]
            System.out.println(inverse);
        }
    }
}
