import java.util.Scanner;

public class Ex2 {
    // Climbing stairs: ways to climb n steps taking 1 or 2 at a time (Fibonacci in disguise), iteratively.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long a = 1, b = 1;
        for (int i = 2; i <= n; i++) {
            long next = a + b;
            a = b;
            b = next;
        }
        System.out.println(b);
    }
}
