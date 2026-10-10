import java.util.Scanner;

public class FlipOneBit {
    // Longest run of 1s you can get by flipping at most one 0 to 1 (32-bit int; negatives handled).
    // Track the length of the current run and the run before the last 0.
    static int longestAfterFlip(int x) {
        if (x == -1) {
            return 32;                       // already all ones: nothing to flip
        }
        int current = 0;                     // run of 1s ending at this bit
        int previous = 0;                    // run of 1s just before the most recent 0
        int best = 1;                        // flipping any 0 gives at least 1
        for (int i = 0; i < 32; i++) {
            if ((x & 1) == 1) {
                current++;
            } else {
                previous = ((x & 2) == 0) ? 0 : current;   // two zeros in a row: the flipped 0 cannot join two runs
                current = 0;
            }
            best = Math.max(best, previous + current + 1);
            x >>>= 1;
        }
        return Math.min(best, 32);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        System.out.println(Integer.toBinaryString(x) + " -> longest run after flipping one bit = " + longestAfterFlip(x));
    }
}
