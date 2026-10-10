import java.util.Scanner;

public class Karatsuba {
    static int baseCases = 0;   // how many single-digit multiplications we performed

    static long pow10(int k) {
        long p = 1;
        for (int i = 0; i < k; i++) {
            p *= 10;
        }
        return p;
    }

    // Multiplies two non-negative numbers using 3 recursive multiplications instead of 4.
    static long multiply(long x, long y) {
        if (x < 10 || y < 10) {          // base case: a one-digit factor => plain multiplication
            baseCases++;
            return x * y;
        }
        int n = Math.max(Long.toString(x).length(), Long.toString(y).length());
        int half = n / 2;                // number of digits in the LOW part
        long p = pow10(half);

        long a = x / p, b = x % p;       // x = a * 10^half + b
        long c = y / p, d = y % p;       // y = c * 10^half + d

        long ac = multiply(a, c);
        long bd = multiply(b, d);
        long abcd = multiply(a + b, c + d);   // (a+b)(c+d) = ac + ad + bc + bd
        long adPlusBc = abcd - ac - bd;       // the middle term without a 4th multiplication

        return ac * p * p + adPlusBc * p + bd;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long x = sc.nextLong();
        long y = sc.nextLong();
        long result = multiply(x, y);
        System.out.println(x + " x " + y + " = " + result);
        System.out.println("check with *: " + (x * y) + " -> " + (result == x * y ? "match" : "MISMATCH"));
        System.out.println("single-digit multiplications used: " + baseCases);
    }
}
