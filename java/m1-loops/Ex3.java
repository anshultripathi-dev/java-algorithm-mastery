import java.util.Scanner;

public class Ex3 {
    // Collatz: n -> n/2 if even, 3n+1 if odd. Count the steps until n becomes 1.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        int steps = 0;
        while (n != 1) {
            n = (n % 2 == 0) ? n / 2 : 3 * n + 1;
            steps++;
        }
        System.out.println(steps);
    }
}
