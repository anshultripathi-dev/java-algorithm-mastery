public class FlipCheck {
    static int fast(int x) {
        if (x == -1) return 32;
        int current = 0, previous = 0, best = 1;
        for (int i = 0; i < 32; i++) {
            if ((x & 1) == 1) {
                current++;
            } else {
                previous = ((x & 2) == 0) ? 0 : current;
                current = 0;
            }
            best = Math.max(best, previous + current + 1);
            x >>>= 1;
        }
        return Math.min(best, 32);
    }

    // Try flipping each of the 32 bits and measure the longest run directly.
    static int brute(int x) {
        int best = 0;
        for (int bit = 0; bit < 32; bit++) {
            int y = x | (1 << bit);
            int run = 0, longest = 0;
            for (int i = 0; i < 32; i++) {
                if (((y >>> i) & 1) == 1) {
                    run++;
                    longest = Math.max(longest, run);
                } else run = 0;
            }
            best = Math.max(best, longest);
        }
        return best;
    }

    public static void main(String[] args) {
        java.util.Random rnd = new java.util.Random(7);
        int[] special = {0, 1, -1, 15, Integer.MIN_VALUE, Integer.MAX_VALUE, 0b111011110, 0b1101110111111001};
        for (int x : special) {
            if (fast(x) != brute(x)) { System.out.println("MISMATCH " + x); return; }
        }
        for (int t = 0; t < 200000; t++) {
            int x = rnd.nextInt();
            if (fast(x) != brute(x)) { System.out.println("MISMATCH " + x); return; }
        }
        System.out.println("flip-one-bit matches brute force on 200000 random ints and the special cases");
    }
}
