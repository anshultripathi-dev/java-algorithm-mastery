public class SpaceDemo {
    static int maxDepth;
    static int depth;

    // O(1) extra space: a loop with a few variables
    static long sumLoop(int[] a) {
        long s = 0;
        for (int x : a) s += x;
        return s;
    }

    // O(n) auxiliary space: builds a second array of the same size
    static int[] prefixSums(int[] a) {
        int[] p = new int[a.length];
        int run = 0;
        for (int i = 0; i < a.length; i++) {
            run += a[i];
            p[i] = run;
        }
        return p;
    }

    // O(n) STACK space: depth n, even though there is no array
    static long sumRecursive(int n) {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
        long r = n == 0 ? 0 : n + sumRecursive(n - 1);
        depth--;
        return r;
    }

    // O(log n) stack space: depth log2 n
    static long power(long b, int e) {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
        long r;
        if (e == 0) r = 1;
        else {
            long h = power(b, e / 2);
            r = e % 2 == 0 ? h * h : h * h * b;
        }
        depth--;
        return r;
    }

    // in place vs extra copy: reversing an array
    static void reverseInPlace(int[] a) {                 // O(1) auxiliary
        for (int i = 0, j = a.length - 1; i < j; i++, j--) {
            int t = a[i]; a[i] = a[j]; a[j] = t;
        }
    }

    static int[] reverseCopy(int[] a) {                   // O(n) auxiliary
        int[] r = new int[a.length];
        for (int i = 0; i < a.length; i++) r[a.length - 1 - i] = a[i];
        return r;
    }

    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5};
        System.out.println("sumLoop            : " + sumLoop(a) + "   extra space O(1)");
        System.out.println("prefixSums         : " + java.util.Arrays.toString(prefixSums(a)) + "   extra space O(n)");
        maxDepth = depth = 0;
        sumRecursive(1000);
        System.out.println("sumRecursive(1000) : max stack depth " + maxDepth + "   O(n) stack space");
        maxDepth = depth = 0;
        power(2, 1000);
        System.out.println("power(2, 1000)     : max stack depth " + maxDepth + "   O(log n) stack space");
        int[] b = a.clone();
        reverseInPlace(b);
        System.out.println("reverseInPlace     : " + java.util.Arrays.toString(b));
        System.out.println("reverseCopy        : " + java.util.Arrays.toString(reverseCopy(a)));
    }
}
