import java.math.BigInteger;
import java.util.Random;

public class KaratsubaBig {
    // Karatsuba on BigInteger, splitting by BITS (shifts are cheaper than powers of 10).
    static BigInteger multiply(BigInteger x, BigInteger y) {
        int n = Math.max(x.bitLength(), y.bitLength());
        if (n <= 32) {                       // small enough: use the machine multiply
            return x.multiply(y);
        }
        int half = n / 2;
        BigInteger a = x.shiftRight(half);                       // high part
        BigInteger b = x.subtract(a.shiftLeft(half));            // low part
        BigInteger c = y.shiftRight(half);
        BigInteger d = y.subtract(c.shiftLeft(half));

        BigInteger ac = multiply(a, c);
        BigInteger bd = multiply(b, d);
        BigInteger mid = multiply(a.add(b), c.add(d)).subtract(ac).subtract(bd);

        return ac.shiftLeft(2 * half).add(mid.shiftLeft(half)).add(bd);
    }

    public static void main(String[] args) {
        Random rnd = new Random(42);
        int ok = 0;
        for (int t = 0; t < 200; t++) {
            BigInteger x = new BigInteger(200 + rnd.nextInt(300), rnd);
            BigInteger y = new BigInteger(200 + rnd.nextInt(300), rnd);
            if (multiply(x, y).equals(x.multiply(y))) {
                ok++;
            }
        }
        System.out.println(ok + " of 200 random 200-500 bit products match BigInteger.multiply");
        BigInteger big = new BigInteger("123456789012345678901234567890");
        System.out.println(multiply(big, big));
    }
}
