import java.util.Scanner;

public class Ex2 {
    // Space-efficient: nth Fibonacci with O(1) space (two variables) instead of an array of n values.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            long c = a + b;
            a = b;
            b = c;
        }
        System.out.println(a);
    }
}
