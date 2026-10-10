import java.util.Scanner;

public class Ex3 {
    static final long MOD = 1_000_000_007L;

    static long power(long b, long e) {
        long r = 1;
        b %= MOD;
        while (e > 0) {
            if ((e & 1) == 1) r = r * b % MOD;
            b = b * b % MOD;
            e >>= 1;
        }
        return r;
    }

    // C(m+n-2, m-1) modulo 1e9+7 for m, n up to 100000: factorials and a modular inverse (Fermat).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int n = sc.nextInt();
        int total = m + n - 2;
        long[] fact = new long[total + 1];
        fact[0] = 1;
        for (int i = 1; i <= total; i++) fact[i] = fact[i - 1] * i % MOD;
        long denom = fact[m - 1] * fact[n - 1] % MOD;
        System.out.println(fact[total] * power(denom, MOD - 2) % MOD);
    }
}
