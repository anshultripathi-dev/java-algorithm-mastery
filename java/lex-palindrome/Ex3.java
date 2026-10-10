import java.util.Scanner;

public class Ex3 {
    // Number of DISTINCT palindromic permutations: arrange the first half freely.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next().toLowerCase();
        int[] freq = new int[256];
        for (char c : s.toCharArray()) freq[c]++;
        int odd = 0;
        for (int f : freq) if (f % 2 == 1) odd++;
        if (odd > 1) {
            System.out.println(0);
            return;
        }
        long[] fact = new long[21];
        fact[0] = 1;
        for (int i = 1; i <= 20; i++) fact[i] = fact[i - 1] * i;
        int half = s.length() / 2;
        long ways = fact[half];
        for (int f : freq) ways /= fact[f / 2];
        System.out.println(ways);
    }
}
