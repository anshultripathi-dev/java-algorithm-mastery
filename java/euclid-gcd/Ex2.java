import java.util.Scanner;

public class Ex2 {
    static long gcd(long a, long b) {
        while (b != 0) {
            long r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long lcm = 1;
        for (int i = 0; i < n; i++) {
            long x = sc.nextLong();
            // divide first, then multiply: keeps the intermediate value small
            lcm = lcm / gcd(lcm, x) * x;
        }
        System.out.println(lcm);
    }
}
