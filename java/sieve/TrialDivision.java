import java.util.Scanner;

public class TrialDivision {
    // Test each number separately: n is prime if no d with 2 <= d <= sqrt(n) divides it.
    static boolean isPrime(int n) {
        if (n < 2) {
            return false;
        }
        for (int d = 2; (long) d * d <= n; d++) {
            if (n % d == 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int limit = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (int n = 2; n <= limit; n++) {
            if (isPrime(n)) {
                sb.append(n).append(' ');
                count++;
            }
        }
        System.out.println(sb.toString().trim());
        System.out.println("count = " + count);
    }
}
