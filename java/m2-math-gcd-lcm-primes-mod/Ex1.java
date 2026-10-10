import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong(), b = sc.nextLong();
        long x = a, y = b;
        while (y != 0) {
            long r = x % y;
            x = y;
            y = r;
        }
        System.out.println(x + " " + (a / x * b));
    }
}
