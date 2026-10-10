import java.util.Scanner;

public class Ex1 {
    static int gcd(int a, int b) {
        while (b != 0) {
            int r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int numerator = sc.nextInt();
        int denominator = sc.nextInt();
        int g = gcd(numerator, denominator);
        System.out.println((numerator / g) + "/" + (denominator / g));
    }
}
