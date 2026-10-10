import java.util.Scanner;

public class EuclidGcd {
    // Euclid's algorithm: gcd(a, b) = gcd(b, a mod b), and gcd(a, 0) = a.
    static long gcd(long a, long b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            long remainder = a % b;
            a = b;
            b = remainder;
        }
        return a;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();

        // Print the same Q | A | B | R table used in the lecture slides.
        System.out.println("   Q          A          B          R");
        long x = Math.abs(a);
        long y = Math.abs(b);
        while (y != 0) {
            long q = x / y;
            long r = x % y;
            System.out.printf("%4d %10d %10d %10d%n", q, x, y, r);
            x = y;
            y = r;
        }
        System.out.printf("%4s %10d %10d %10s%n", "-", x, y, "-");
        System.out.println("gcd(" + a + ", " + b + ") = " + gcd(a, b));
    }
}
