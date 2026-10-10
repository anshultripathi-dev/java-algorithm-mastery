public class BoothCheck {
    // Compact copy of Booth's algorithm (no printing) so this file is self-contained.
    static int booth(int multiplicand, int multiplier, int width) {
        if (multiplicand == -(1 << (width - 1))) {
            width++;
        }
        int mask = (1 << width) - 1;
        int M = multiplicand & mask;
        int negM = (-multiplicand) & mask;
        int AC = 0;
        int Q = multiplier & mask;
        int qMinus1 = 0;
        for (int cycle = 0; cycle < width; cycle++) {
            int q0 = Q & 1;
            if (q0 == 1 && qMinus1 == 0) {
                AC = (AC + negM) & mask;
            } else if (q0 == 0 && qMinus1 == 1) {
                AC = (AC + M) & mask;
            }
            qMinus1 = Q & 1;
            Q = ((Q >> 1) | ((AC & 1) << (width - 1))) & mask;
            AC = (AC >> 1) | (AC & (1 << (width - 1)));
        }
        long raw = ((long) AC << width) | Q;
        return (int) ((raw & (1L << (2 * width - 1))) != 0 ? raw - (1L << (2 * width)) : raw);
    }

    // Exhaustively compares Booth's algorithm with the * operator for every pair of 6-bit signed numbers.
    public static void main(String[] args) {
        int width = 6;
        int lo = -(1 << (width - 1));      // -32
        int hi = (1 << (width - 1)) - 1;   //  31
        int checked = 0;
        for (int m = lo; m <= hi; m++) {
            for (int q = lo; q <= hi; q++) {
                int got = booth(m, q, width);
                if (got != m * q) {
                    System.out.println("MISMATCH " + m + " x " + q + " gave " + got);
                    return;
                }
                checked++;
            }
        }
        System.out.println("all " + checked + " products correct (including " + lo + " x " + lo + ")");
    }
}
