import java.util.Scanner;

public class BoothMultiply {
    static String bits(int value, int width) {
        String s = Integer.toBinaryString(value & ((1 << width) - 1));
        return "0".repeat(width - s.length()) + s;
    }

    // Booth's algorithm for two signed numbers that each fit in `width` bits (two's complement).
    static int multiply(int multiplicand, int multiplier, int width, boolean trace) {
        if (multiplicand == -(1 << (width - 1))) {
            width++;   // the most negative number cannot be negated in `width` bits: use one extra bit
        }
        int mask = (1 << width) - 1;
        int M = multiplicand & mask;           // multiplicand register
        int negM = (-multiplicand) & mask;     // two's complement of M  (flip bits, add 1)
        int AC = 0;                            // accumulator
        int Q = multiplier & mask;             // multiplier register
        int qMinus1 = 0;                       // the extra bit to the right of Q

        if (trace) {
            System.out.println("M = " + bits(M, width) + "   -M = " + bits(negM, width));
            System.out.println("cycle  Q0 Q-1  operation        AC    Q     Q-1   (state AFTER the shift)");
            System.out.println("init               -               " + bits(AC, width) + "  " + bits(Q, width) + "  " + qMinus1);
        }
        for (int cycle = 1; cycle <= width; cycle++) {
            int q0 = Q & 1;
            int pairQ = qMinus1;
            String op = "shift only";
            if (q0 == 1 && qMinus1 == 0) {          // pair "10": a run of 1s begins -> subtract M
                AC = (AC + negM) & mask;
                op = "AC = AC - M, ASR";
            } else if (q0 == 0 && qMinus1 == 1) {   // pair "01": a run of 1s ends -> add M
                AC = (AC + M) & mask;
                op = "AC = AC + M, ASR";
            }
            // arithmetic shift right of the combined register  AC | Q | Q-1
            qMinus1 = Q & 1;
            Q = ((Q >> 1) | ((AC & 1) << (width - 1))) & mask;
            int sign = AC & (1 << (width - 1));    // remember the sign bit...
            AC = (AC >> 1) | sign;                 // ...and put it back on the left
            if (trace) {
                System.out.println("  " + cycle + "     " + q0 + "   " + pairQ + "   " + String.format("%-15s", op) + " " + bits(AC, width) + "  " + bits(Q, width) + "  " + qMinus1);
            }
        }
        long raw = ((long) AC << width) | Q;               // 2*width-bit result  AC:Q
        long signBit = 1L << (2 * width - 1);
        return (int) ((raw & signBit) != 0 ? raw - (1L << (2 * width)) : raw);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int q = sc.nextInt();
        int width = sc.nextInt();
        int product = multiply(m, q, width, true);
        System.out.println(m + " x " + q + " = " + product + "   (check: " + (m * q) + ")");
    }
}
