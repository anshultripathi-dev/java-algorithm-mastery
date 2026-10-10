import java.util.Scanner;

public class Ex2 {
    static long[] extGcd(long a, long b) {
        if (b == 0) {
            return new long[] {a, 1, 0};
        }
        long[] r = extGcd(b, a % b);
        return new long[] {r[0], r[2], r[1] - (a / b) * r[2]};
    }

    static long inverse(long a, long m) {
        long x = extGcd(((a % m) + m) % m, m)[1];
        return ((x % m) + m) % m;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] mod = new long[n];
        long[] rem = new long[n];
        long M = 1;
        for (int i = 0; i < n; i++) {
            mod[i] = sc.nextLong();
            rem[i] = sc.nextLong();
            M *= mod[i];
        }
        long x = 0;
        for (int i = 0; i < n; i++) {
            long Mi = M / mod[i];
            long term = rem[i] % M * Mi % M * inverse(Mi, mod[i]) % M;
            x = (x + term) % M;
        }
        System.out.println(x);
    }
}
