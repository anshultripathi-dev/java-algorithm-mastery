import java.util.Scanner;

public class Ex3 {
    // Smallest n for which n^2 exceeds 10 * n * log2(n) ... i.e. when does a quadratic algorithm become
    // slower than an n log n one that does 10x more work per step? Print that n (n >= 2).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int factor = sc.nextInt();
        int n = 2;
        while (!((double) n * n > factor * n * (Math.log(n) / Math.log(2)))) n++;
        System.out.println(n);
    }
}
