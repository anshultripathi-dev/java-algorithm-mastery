import java.util.Scanner;

public class Ex3 {
    // Return the number of digits and the digit sum through two separate methods.
    static int digitCount(long n) {
        int c = 0;
        do {
            c++;
            n /= 10;
        } while (n > 0);
        return c;
    }

    static int digitSum(long n) {
        int s = 0;
        while (n > 0) {
            s += n % 10;
            n /= 10;
        }
        return s;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        System.out.println(digitCount(n) + " " + digitSum(n));
    }
}
