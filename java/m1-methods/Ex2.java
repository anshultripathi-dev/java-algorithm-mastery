import java.util.Scanner;

public class Ex2 {
    static long power(long base, int exp) {
        long result = 1;
        for (int i = 0; i < exp; i++) result *= base;
        return result;
    }

    static double power(double base, int exp) {      // overloaded version for decimals
        double result = 1;
        for (int i = 0; i < exp; i++) result *= base;
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long b = sc.nextLong();
        int e = sc.nextInt();
        System.out.println(power(b, e));
        System.out.println(power(2.5, 2));
    }
}
