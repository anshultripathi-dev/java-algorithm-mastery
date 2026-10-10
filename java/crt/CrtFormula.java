import java.util.Scanner;

public class CrtFormula {
    // modular inverse of a modulo m by trying 1..m-1 (fine for small moduli; see Euclid lesson for the fast way)
    static long inverse(long a, long m) {
        a %= m;
        for (long x = 1; x < m; x++) {
            if (a * x % m == 1) {
                return x;
            }
        }
        throw new IllegalArgumentException("no inverse: moduli are not coprime");
    }

    // x = sum( r_i * M_i * inv(M_i mod m_i) )  mod M    where M_i = M / m_i
    static long solve(int[] mods, int[] rems) {
        long M = 1;
        for (int m : mods) {
            M *= m;
        }
        long x = 0;
        for (int i = 0; i < mods.length; i++) {
            long Mi = M / mods[i];
            long b = inverse(Mi, mods[i]);
            x += rems[i] * Mi % M * b % M;
            x %= M;
        }
        return x;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] mods = new int[n];
        int[] rems = new int[n];
        for (int i = 0; i < n; i++) mods[i] = sc.nextInt();
        for (int i = 0; i < n; i++) rems[i] = sc.nextInt();
        System.out.println(solve(mods, rems));
    }
}
