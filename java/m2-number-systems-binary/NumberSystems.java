public class NumberSystems {
    // Convert a non-negative int to a string in the given base (2..16) by repeated division.
    static String toBase(int n, int base) {
        if (n == 0) return "0";
        String digits = "0123456789ABCDEF";
        StringBuilder sb = new StringBuilder();
        while (n > 0) {
            sb.append(digits.charAt(n % base));   // the remainder is the next digit (least significant first)
            n /= base;
        }
        return sb.reverse().toString();
    }

    // Convert back: Horner's rule.
    static int fromBase(String s, int base) {
        int value = 0;
        for (char c : s.toCharArray()) {
            value = value * base + Character.digit(c, base);
        }
        return value;
    }

    // n-bit two's complement pattern of a possibly negative number
    static String twosComplement(int x, int bits) {
        StringBuilder sb = new StringBuilder();
        for (int i = bits - 1; i >= 0; i--) {
            sb.append((x >> i) & 1);
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println("156 in binary : " + toBase(156, 2));
        System.out.println("156 in octal  : " + toBase(156, 8));
        System.out.println("156 in hex    : " + toBase(156, 16));
        System.out.println("10011100 (2)  : " + fromBase("10011100", 2));
        System.out.println("built-in      : " + Integer.toBinaryString(156) + " " + Integer.toHexString(156) + " " + Integer.parseInt("9C", 16));
        System.out.println("-5 in 8 bits  : " + twosComplement(-5, 8) + "  (flip 00000101 -> 11111010, add 1)");
        System.out.println(" 5 in 8 bits  : " + twosComplement(5, 8));
        System.out.println("-1 in 8 bits  : " + twosComplement(-1, 8));
        System.out.println("range of 8-bit two's complement: -128 .. 127");
    }
}
