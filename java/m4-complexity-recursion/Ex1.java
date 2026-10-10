import java.util.Scanner;

public class Ex1 {
    static long calls;

    static int f(int n) {
        calls++;
        if (n <= 1) return 1;
        return f(n - 1) + f(n - 1);        // two calls, not one!
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        f(sc.nextInt());
        System.out.println(calls);
    }
}
