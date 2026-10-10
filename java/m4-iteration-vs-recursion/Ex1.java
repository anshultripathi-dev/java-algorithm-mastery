import java.util.Scanner;

public class Ex1 {
    // gcd both ways; print iterative then recursive result
    static int gcdLoop(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    static int gcdRec(int a, int b) {
        return b == 0 ? a : gcdRec(b, a % b);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt();
        System.out.println(gcdLoop(a, b) + " " + gcdRec(a, b));
    }
}
