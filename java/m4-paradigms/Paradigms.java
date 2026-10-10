import java.util.Arrays;

public class Paradigms {
    // 1. BRUTE FORCE: try everything. Subset sum over all 2^n subsets using bit masks.
    static boolean subsetSumBrute(int[] a, int target) {
        int n = a.length;
        for (int mask = 0; mask < (1 << n); mask++) {
            int sum = 0;
            for (int i = 0; i < n; i++) {
                if ((mask >> i & 1) == 1) sum += a[i];
            }
            if (sum == target) return true;
        }
        return false;
    }

    // 2. DIVIDE AND CONQUER: maximum of an array by splitting it in halves.
    static int maxDC(int[] a, int lo, int hi) {
        if (lo == hi) return a[lo];
        int mid = (lo + hi) >>> 1;
        return Math.max(maxDC(a, lo, mid), maxDC(a, mid + 1, hi));
    }

    // 3. GREEDY: take the largest coin that fits. Optimal for canonical systems only.
    static int coinsGreedy(int[] coinsDescending, int amount) {
        int count = 0;
        for (int c : coinsDescending) {
            count += amount / c;
            amount %= c;
        }
        return amount == 0 ? count : -1;
    }

    // 4. DYNAMIC PROGRAMMING: fewest coins for ANY coin system; reuse the answers for smaller amounts.
    static int coinsDP(int[] coins, int amount) {
        int[] best = new int[amount + 1];
        Arrays.fill(best, Integer.MAX_VALUE);
        best[0] = 0;
        for (int x = 1; x <= amount; x++) {
            for (int c : coins) {
                if (c <= x && best[x - c] != Integer.MAX_VALUE) {
                    best[x] = Math.min(best[x], best[x - c] + 1);
                }
            }
        }
        return best[amount] == Integer.MAX_VALUE ? -1 : best[amount];
    }

    // 5. BACKTRACKING: all ways to write n as an ordered sum of 1s and 2s (print them).
    static void ways(int remaining, String soFar, java.util.List<String> out) {
        if (remaining == 0) {
            out.add(soFar.trim());
            return;
        }
        if (remaining >= 1) ways(remaining - 1, soFar + " 1", out);   // choose 1, explore, (un-choose is implicit)
        if (remaining >= 2) ways(remaining - 2, soFar + " 2", out);
    }

    public static void main(String[] args) {
        System.out.println("brute force: subset of {3, 34, 4, 12, 5, 2} summing to 9? " + subsetSumBrute(new int[] {3, 34, 4, 12, 5, 2}, 9));
        System.out.println("divide & conquer max: " + maxDC(new int[] {4, 17, 3, 9, 25, 1}, 0, 5));
        int[] canonical = {25, 10, 5, 1};
        int[] tricky = {4, 3, 1};
        System.out.println("greedy 63 with {25,10,5,1}: " + coinsGreedy(canonical, 63) + " coins");
        System.out.println("greedy 6 with {4,3,1}     : " + coinsGreedy(tricky, 6) + " coins (4+1+1) — NOT optimal");
        System.out.println("DP     6 with {4,3,1}     : " + coinsDP(tricky, 6) + " coins (3+3)");
        java.util.List<String> out = new java.util.ArrayList<>();
        ways(4, "", out);
        System.out.println("ways to sum 4 with 1s and 2s: " + out);
    }
}
