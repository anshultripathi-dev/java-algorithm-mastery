public class BitwiseOperators {
    static String bits(int v) {
        String s = Integer.toBinaryString(v & 0xFF);          // show the low 8 bits
        return "0".repeat(8 - s.length()) + s;
    }

    public static void main(String[] args) {
        int a = 0b1100;   // 12
        int b = 0b1010;   // 10
        System.out.println("a      = " + bits(a) + " (" + a + ")");
        System.out.println("b      = " + bits(b) + " (" + b + ")");
        System.out.println("a & b  = " + bits(a & b) + "  AND: 1 only where both are 1");
        System.out.println("a | b  = " + bits(a | b) + "  OR : 1 where either is 1");
        System.out.println("a ^ b  = " + bits(a ^ b) + "  XOR: 1 where they differ");
        System.out.println("~a     = " + bits(~a) + "  NOT: flip every bit (= -a - 1 = " + (~a) + ")");
        System.out.println("a << 2 = " + bits(a << 2) + "  multiply by 4 (" + (a << 2) + ")");
        System.out.println("a >> 2 = " + bits(a >> 2) + "  divide by 4 (" + (a >> 2) + ")");
        System.out.println("-8 >> 1  = " + (-8 >> 1) + "   (arithmetic: sign is kept)");
        System.out.println("-8 >>> 28 = " + (-8 >>> 28) + "   (logical: zeros come in from the left)");

        // everyday bit tricks
        int x = 0b0101_0000;
        int bit = 4;
        System.out.println("bit 4 of x is " + ((x >> bit) & 1));
        System.out.println("set bit 0    : " + bits(x | (1 << 0)));
        System.out.println("clear bit 4  : " + bits(x & ~(1 << 4)));
        System.out.println("toggle bit 6 : " + bits(x ^ (1 << 6)));
        System.out.println("is 64 a power of two? " + (64 > 0 && (64 & (64 - 1)) == 0));
    }
}
