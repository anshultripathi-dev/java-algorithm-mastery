import java.util.Scanner;

public class Ex3 {
    static long[] fact = new long[21];

    // number of distinct arrangements of the remaining letters
    static long arrangements(int[] counts, int remaining) {
        long r = fact[remaining];
        for (int c : counts) r /= fact[c];
        return r;
    }

    // k-th (1-based) distinct permutation in sorted order, without generating the others.
    public static void main(String[] args) {
        fact[0] = 1;
        for (int i = 1; i <= 20; i++) fact[i] = fact[i - 1] * i;
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        long k = sc.nextLong();
        int[] counts = new int[256];
        for (char c : s.toCharArray()) counts[c]++;
        int n = s.length();
        if (k > arrangements(counts, n)) {
            System.out.println("NONE");
            return;
        }
        StringBuilder sb = new StringBuilder();
        for (int pos = 0; pos < n; pos++) {
            for (int c = 0; c < 256; c++) {
                if (counts[c] == 0) continue;
                counts[c]--;
                long block = arrangements(counts, n - pos - 1);   // permutations that start with this letter here
                if (k <= block) {
                    sb.append((char) c);
                    break;
                }
                k -= block;
                counts[c]++;
            }
        }
        System.out.println(sb);
    }
}
