public class RecursionDemo {
    static int depth = 0;

    // factorial: n! = n * (n-1)!   with 0! = 1  (base case)
    static long factorial(int n) {
        if (n <= 1) {
            return 1;                      // BASE CASE: stops the recursion
        }
        return n * factorial(n - 1);       // RECURSIVE CASE: smaller problem
    }

    // see the calls and returns
    static int sumTo(int n) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "sumTo(" + n + ")");
        if (n == 0) {
            System.out.println(indent + "-> 0");
            return 0;
        }
        depth++;
        int inner = sumTo(n - 1);
        depth--;
        System.out.println(indent + "-> " + (n + inner));
        return n + inner;
    }

    // two recursive calls: the tree of calls grows exponentially
    static int fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }

    static long fibCalls = 0;
    static int fibCounted(int n) {
        fibCalls++;
        if (n <= 1) return n;
        return fibCounted(n - 1) + fibCounted(n - 2);
    }

    // fast power: halve the exponent each time
    static long power(long base, int exp) {
        if (exp == 0) return 1;
        long half = power(base, exp / 2);
        return exp % 2 == 0 ? half * half : half * half * base;
    }

    // recursion on a String
    static boolean isPalindrome(String s) {
        if (s.length() <= 1) return true;
        if (s.charAt(0) != s.charAt(s.length() - 1)) return false;
        return isPalindrome(s.substring(1, s.length() - 1));
    }

    public static void main(String[] args) {
        System.out.println("5! = " + factorial(5));
        System.out.println("sumTo(3) trace:");
        sumTo(3);
        System.out.println("fib(10) = " + fib(10));
        fibCounted(20);
        System.out.println("fib(20) needed " + fibCalls + " calls");
        System.out.println("2^30 = " + power(2, 30));
        System.out.println("racecar palindrome? " + isPalindrome("racecar") + ", level? " + isPalindrome("leaves"));
    }
}
