public class CastingAndOverflow {
    public static void main(String[] args) {
        // WIDENING (automatic, always safe): small type -> bigger type
        int i = 42;
        long l = i;
        double d = i;
        System.out.println("widening: " + l + " " + d);

        // NARROWING (manual cast, may lose information)
        double pi = 3.99;
        int truncated = (int) pi;                 // drops the fraction, does NOT round
        System.out.println("(int) 3.99 = " + truncated);
        System.out.println("rounded   = " + Math.round(pi));

        // OVERFLOW wraps around silently
        int max = Integer.MAX_VALUE;
        System.out.println("MAX + 1   = " + (max + 1));          // -2147483648
        long safe = (long) max + 1;                              // widen BEFORE adding
        System.out.println("(long)MAX + 1 = " + safe);

        // Integer division vs floating-point division
        System.out.println("7 / 2     = " + 7 / 2);
        System.out.println("7 / 2.0   = " + 7 / 2.0);
        System.out.println("(double) 7 / 2 = " + (double) 7 / 2);

        // char is a small integer
        char c = 'A';
        c = (char) (c + 2);
        System.out.println("'A' + 2   = " + c);
        System.out.println("'a' - 'A' = " + ('a' - 'A'));

        // the classic trap: a byte cast wraps
        System.out.println("(byte) 200 = " + (byte) 200);

        // detect overflow instead of ignoring it
        try {
            Math.addExact(Integer.MAX_VALUE, 1);
        } catch (ArithmeticException e) {
            System.out.println("addExact: " + e.getMessage());
        }
    }
}
