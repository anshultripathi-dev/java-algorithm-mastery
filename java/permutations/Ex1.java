import java.util.Scanner;

public class Ex1 {
    // Number of distinct permutations = n! / (c1! * c2! * ...)
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int[] freq = new int[256];
        for (char c : s.toCharArray()) freq[c]++;
        long[] f = new long[21];
        f[0] = 1;
        for (int i = 1; i <= 20; i++) f[i] = f[i - 1] * i;
        long ways = f[s.length()];
        for (int x : freq) ways /= f[x];
        System.out.println(ways);
    }
}
