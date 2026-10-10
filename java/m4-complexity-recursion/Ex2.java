import java.util.Scanner;

public class Ex2 {
    static long calls;

    static int g(int n) {
        calls++;
        if (n <= 1) return 0;
        return g(n / 2) + g(n / 2);        // two calls on HALF the size: T(n) = 2T(n/2) + 1
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        g(sc.nextInt());
        System.out.println(calls);
    }
}
