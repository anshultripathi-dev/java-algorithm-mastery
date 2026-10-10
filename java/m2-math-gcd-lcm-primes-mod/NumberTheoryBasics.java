import java.util.Scanner;

public class NumberTheoryBasics {
    static boolean isPrime(long n) {
        if (n < 2) return false;
        if (n % 2 == 0) return n == 2;
        for (long d = 3; d * d <= n; d += 2) {
            if (n % d == 0) return false;
        }
        return true;
    }

    static long gcd(long a, long b) {
        while (b != 0) {
            long r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    // a^b mod m by repeated squaring: O(log b) multiplications
    static long powMod(long a, long b, long m) {
        long result = 1;
        a %= m;
        while (b > 0) {
            if ((b & 1) == 1) result = result * a % m;
            a = a * a % m;
            b >>= 1;
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        long g = gcd(a, b);
        System.out.println("gcd = " + g);
        System.out.println("lcm = " + (a / g * b));
        System.out.println(a + " prime? " + isPrime(a) + ", " + b + " prime? " + isPrime(b));
        System.out.println("a divisible by 3 (digit sum rule)? " + (digitSum(a) % 3 == 0));
        System.out.println("2^100 mod 1000000007 = " + powMod(2, 100, 1_000_000_007L));
        System.out.println("(-7) mod 5 = " + Math.floorMod(-7, 5) + "   (Java's % gives " + (-7 % 5) + ")");
        System.out.println("(a * b) mod 13 = " + (a % 13) * (b % 13) % 13);
    }

    static long digitSum(long n) {
        long s = 0;
        while (n > 0) {
            s += n % 10;
            n /= 10;
        }
        return s;
    }
}
