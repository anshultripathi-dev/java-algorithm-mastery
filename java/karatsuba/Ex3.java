import java.math.BigInteger;
import java.util.Scanner;

public class Ex3 {
    static BigInteger multiply(BigInteger x, BigInteger y) {
        int n = Math.max(x.bitLength(), y.bitLength());
        if (n <= 30) {                       // both factors < 2^30, so the product < 2^60 fits in a long
            return BigInteger.valueOf(x.longValue() * y.longValue());
        }
        int half = n / 2;
        BigInteger a = x.shiftRight(half);
        BigInteger b = x.subtract(a.shiftLeft(half));
        BigInteger c = y.shiftRight(half);
        BigInteger d = y.subtract(c.shiftLeft(half));
        BigInteger ac = multiply(a, c);
        BigInteger bd = multiply(b, d);
        BigInteger mid = multiply(a.add(b), c.add(d)).subtract(ac).subtract(bd);
        return ac.shiftLeft(2 * half).add(mid.shiftLeft(half)).add(bd);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        BigInteger x = new BigInteger(sc.next());
        BigInteger y = new BigInteger(sc.next());
        System.out.println(multiply(x, y));
    }
}
