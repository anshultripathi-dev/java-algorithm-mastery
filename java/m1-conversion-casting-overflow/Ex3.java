import java.util.Scanner;

public class Ex3 {
    // Print OK if a + b fits in an int, otherwise OVERFLOW.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        long sum = a + b;
        boolean fits = sum >= Integer.MIN_VALUE && sum <= Integer.MAX_VALUE;
        System.out.println(fits ? "OK" : "OVERFLOW");
    }
}
