public class EuclidRecursive {
    // The recursive form is a direct copy of the rule  gcd(a, b) = gcd(b, a mod b).
    static int gcd(int a, int b) {
        System.out.println("gcd(" + a + ", " + b + ")");
        if (b == 0) {
            return a;          // base case: nothing left to divide by
        }
        return gcd(b, a % b);  // smaller problem: same answer, smaller numbers
    }

    public static void main(String[] args) {
        System.out.println("Answer: " + gcd(83, 19));
    }
}
