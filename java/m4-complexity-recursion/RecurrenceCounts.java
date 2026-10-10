public class RecurrenceCounts {
    static long calls;

    // T(n) = T(n-1) + O(1)  -> n calls            O(n)
    static long linear(int n) {
        calls++;
        return n <= 1 ? 1 : 1 + linear(n - 1);
    }

    // T(n) = T(n/2) + O(1)  -> log2 n calls       O(log n)
    static long halving(int n) {
        calls++;
        return n <= 1 ? 1 : 1 + halving(n / 2);
    }

    // T(n) = 2T(n/2) + O(n) -> n log n work      (merge sort shape)
    static long splitTwoLinear(int n) {
        calls++;
        if (n <= 1) return 0;
        long work = n;                               // the "merge" step costs n
        return work + splitTwoLinear(n / 2) + splitTwoLinear(n - n / 2);
    }

    // T(n) = T(n-1) + T(n-2) + O(1) -> ~1.618^n   (Fibonacci shape)
    static long fib(int n) {
        calls++;
        return n <= 1 ? n : fib(n - 1) + fib(n - 2);
    }

    // T(n) = 2T(n-1) + O(1) -> 2^n                (Towers of Hanoi shape)
    static long hanoi(int n) {
        calls++;
        return n == 0 ? 0 : 1 + 2 * hanoi(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("n      linear  halving  n*log(n) work   fib calls   hanoi moves");
        for (int n : new int[] {8, 16, 24, 32}) {
            calls = 0; linear(n); long a = calls;
            calls = 0; halving(n); long b = calls;
            calls = 0; long w = splitTwoLinear(n);
            calls = 0; fib(n); long f = calls;
            calls = 0; long h = hanoi(Math.min(n, 20));
            System.out.printf("%-6d %-7d %-8d %-15d %-11d %d%n", n, a, b, w, f, h);
        }
    }
}
