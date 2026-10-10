import java.util.HashMap;
import java.util.Map;

public class IterationVsRecursion {
    static long calls;

    // factorial: loop and recursion do the same job; the loop needs O(1) stack, the recursion O(n)
    static long factIterative(int n) {
        long r = 1;
        for (int i = 2; i <= n; i++) r *= i;
        return r;
    }

    static long factRecursive(int n) {
        return n <= 1 ? 1 : n * factRecursive(n - 1);
    }

    // Fibonacci three ways
    static long fibRecursive(int n) {
        calls++;
        return n <= 1 ? n : fibRecursive(n - 1) + fibRecursive(n - 2);
    }

    static Map<Integer, Long> memo = new HashMap<>();

    static long fibMemo(int n) {
        calls++;
        if (n <= 1) return n;
        Long cached = memo.get(n);
        if (cached != null) return cached;
        long v = fibMemo(n - 1) + fibMemo(n - 2);
        memo.put(n, v);
        return v;
    }

    static long fibIterative(int n) {
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            long next = a + b;
            a = b;
            b = next;
        }
        return a;
    }

    // a recursion that is NOT easy to turn into a loop: it explores a tree (subset sum)
    static boolean subsetSum(int[] a, int i, int target) {
        if (target == 0) return true;
        if (i == a.length || target < 0) return false;
        return subsetSum(a, i + 1, target - a[i]) || subsetSum(a, i + 1, target);
    }

    // recursion converted to an explicit stack to avoid StackOverflowError on a long chain
    static long sumRecursive(int n) {
        return n == 0 ? 0 : n + sumRecursive(n - 1);
    }

    static long sumWithExplicitStack(int n) {
        java.util.ArrayDeque<Integer> stack = new java.util.ArrayDeque<>();
        for (int i = n; i > 0; i--) stack.push(i);
        long total = 0;
        while (!stack.isEmpty()) total += stack.pop();
        return total;
    }

    public static void main(String[] args) {
        System.out.println(factIterative(10) + " " + factRecursive(10));
        calls = 0;
        System.out.println("fibRecursive(30) = " + fibRecursive(30) + " in " + calls + " calls");
        calls = 0;
        System.out.println("fibMemo(30)      = " + fibMemo(30) + " in " + calls + " calls");
        System.out.println("fibIterative(30) = " + fibIterative(30) + " in 30 loop steps");
        System.out.println("subsetSum {3,34,4,12,5,2}, 9 -> " + subsetSum(new int[] {3, 34, 4, 12, 5, 2}, 0, 9));
        try {
            System.out.println(sumRecursive(10_000_000));
        } catch (StackOverflowError e) {
            System.out.println("StackOverflowError for depth 10 000 000");
        }
        System.out.println("explicit stack: " + sumWithExplicitStack(1_000_000));
    }
}
