import java.util.Scanner;

public class CrtBruteForce {
    // Slide approach: try x = 1, 2, 3, ... until x % m[i] == r[i] for every i.
    static long solve(int[] mods, int[] rems) {
        long limit = 1;
        for (int m : mods) {
            limit *= m;          // the answer repeats every M = product of moduli
        }
        for (long x = 0; x < limit; x++) {
            boolean ok = true;
            for (int i = 0; i < mods.length; i++) {
                if (x % mods[i] != rems[i]) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                return x;
            }
        }
        return -1; // no solution (moduli not pairwise coprime / inconsistent)
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
