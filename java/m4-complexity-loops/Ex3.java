import java.util.Scanner;

public class Ex3 {
    // Measure the growth: print count(2n) / count(n) rounded to 1 decimal for a double loop where j runs i times.
    static long count(int n) {
        long c = 0;
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= i; j++) c++;
        return c;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.printf("%.1f%n", (double) count(2 * n) / count(n));
    }
}
