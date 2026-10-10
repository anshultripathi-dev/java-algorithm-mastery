import java.util.Scanner;

public class NaiveGcd {
    // Try every number from the smaller input down to 1.
    // The first one that divides BOTH numbers is the greatest common divisor.
    static int gcd(int a, int b) {
        int smaller = Math.min(a, b);
        for (int d = smaller; d >= 1; d--) {
            if (a % d == 0 && b % d == 0) {
                return d;
            }
        }
        return 1; // only reached if a or b is 0 or negative; see the lesson's edge-case notes
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println("gcd(" + a + ", " + b + ") = " + gcd(a, b));
    }
}
