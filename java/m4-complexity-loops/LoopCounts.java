import java.util.function.IntToLongFunction;

public class LoopCounts {
    // The lecture's "predict the time complexity" snippets, executed with counters.
    static long linear(int n) { long c = 0; for (int i = 1; i < n; i++) c++; return c; }                                    // O(n)
    static long sqrtBound(int n) { long c = 0; for (long i = 1; i * i <= n; i++) c++; return c; }                           // O(sqrt n)
    static long doubling(int n) { long c = 0; for (long i = 1; i <= n; i *= 2) c++; return c; }                             // O(log n)
    static long halving(int n) { long c = 0; while (n > 1) { n /= 2; c++; } return c; }                                     // O(log n)
    static long nested(int n) { long c = 0; for (int i = 1; i < n; i++) for (int j = 1; j < n; j++) c++; return c; }        // O(n^2)
    static long withBreak(int n) { long c = 0; for (int i = 1; i < n; i++) for (int j = 1; j < n; j++) { c++; break; } return c; } // O(n)
    static long harmonic(int n) { long c = 0; for (int i = 1; i < n; i++) for (int j = 1; j < n; j += i) c++; return c; }   // O(n log n)
    static long nLogN(int n) { long c = 0; for (int i = 1; i < n; i++) for (long j = 1; j < n; j *= 2) c++; return c; }      // O(n log n)
    static long triangle(int n) { long c = 0; for (int i = 1; i <= n; i++) for (int j = 1; j <= i; j++) for (int k = 1; k <= 20; k++) c++; return c; } // O(n^2)
    static long quartic(int n) { long c = 0; for (long i = 1; i <= n; i++) for (long j = 1; j <= i * i; j++) c += n / 2; return c; }     // O(n^4)
    static long sumLimit(int n) { long c = 0, s = 1, i = 1; while (s <= n) { i++; s += i; c++; } return c; }                // O(sqrt n)
    static long digits(int n) { long c = 0; while (n > 0) { n /= 10; c++; } return c; }                                     // O(log n)

    static void row(String name, String bigO, IntToLongFunction f, int[] sizes) {
        StringBuilder sb = new StringBuilder(String.format("%-22s %-11s", name, bigO));
        for (int n : sizes) sb.append(String.format("  n=%-6d -> %-12d", n, f.applyAsLong(n)));
        System.out.println(sb);
    }

    public static void main(String[] args) {
        int[] big = {100, 1_000, 10_000};
        int[] mid = {100, 200, 400};         // quadratic-ish: keep n small
        int[] small = {10, 20, 40};          // quartic
        row("for (i<n)", "O(n)", LoopCounts::linear, big);
        row("i*i <= n", "O(sqrt n)", LoopCounts::sqrtBound, big);
        row("i *= 2", "O(log n)", LoopCounts::doubling, big);
        row("n /= 2", "O(log n)", LoopCounts::halving, big);
        row("n x n", "O(n^2)", LoopCounts::nested, mid);
        row("inner break", "O(n)", LoopCounts::withBreak, big);
        row("j += i", "O(n log n)", LoopCounts::harmonic, big);
        row("i x (j *= 2)", "O(n log n)", LoopCounts::nLogN, big);
        row("triangle x 20", "O(n^2)", LoopCounts::triangle, mid);
        row("j <= i*i, k <= n/2", "O(n^4)", LoopCounts::quartic, small);
        row("s += i until s > n", "O(sqrt n)", LoopCounts::sumLimit, big);
        row("digits of n", "O(log n)", LoopCounts::digits, big);
    }
}
