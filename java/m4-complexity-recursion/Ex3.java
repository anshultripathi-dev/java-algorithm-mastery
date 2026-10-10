import java.util.Scanner;

public class Ex3 {
    static long work;

    // T(n) = 3T(n/2) + n  (Karatsuba shape): count the "n" work terms for n a power of two.
    static void t(int n) {
        if (n <= 1) {
            work += 1;
            return;
        }
        work += n;
        t(n / 2);
        t(n / 2);
        t(n / 2);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        t(sc.nextInt());
        System.out.println(work);
    }
}
