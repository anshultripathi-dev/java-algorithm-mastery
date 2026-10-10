import java.util.Scanner;

public class LongestOnes {
    // Longest run of consecutive 1 bits, scanning the 32 bits with shifts (no String needed).
    static int longestRun(int x) {
        int current = 0;
        int best = 0;
        for (int i = 0; i < 32; i++) {
            if ((x & 1) == 1) {
                current++;
                best = Math.max(best, current);
            } else {
                current = 0;                 // a 0 ends the run
            }
            x >>>= 1;                        // unsigned shift so negatives are handled
        }
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        System.out.println(Integer.toBinaryString(x) + " -> longest run of 1s = " + longestRun(x));
    }
}
