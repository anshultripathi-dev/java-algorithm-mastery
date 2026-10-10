import java.util.Scanner;

public class Ex2 {
    static int baseCases = 0;

    static long pow10(int k) {
        long p = 1;
        for (int i = 0; i < k; i++) p *= 10;
        return p;
    }

    static long multiply(long x, long y) {
        if (x < 10 || y < 10) {
            baseCases++;
            return x * y;
        }
        int n = Math.max(Long.toString(x).length(), Long.toString(y).length());
        int half = n / 2;
        long p = pow10(half);
        long a = x / p, b = x % p, c = y / p, d = y % p;
        long ac = multiply(a, c);
        long bd = multiply(b, d);
        long abcd = multiply(a + b, c + d);
        return ac * p * p + (abcd - ac - bd) * p + bd;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        multiply(sc.nextLong(), sc.nextLong());
        System.out.println(baseCases);
    }
}
