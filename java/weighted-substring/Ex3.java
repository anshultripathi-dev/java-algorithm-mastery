import java.util.Scanner;

public class Ex3 {
    // Normalise: print the shortest, lexicographically smallest string with the same weight as s.
    // Carry like a number system: (letter i+1 has weight (i+2) times letter i), so (i+2) copies of letter i
    // become one copy of letter i+1.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        long[] count = new long[27];
        for (char c : s.toCharArray()) count[c - 'A']++;
        for (int i = 0; i < 25; i++) {
            long base = i + 3;                       // weight(letter i+1) / weight(letter i): 3 for A->B, 4 for B->C, ...
            count[i + 1] += count[i] / base;
            count[i] %= base;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 26; i++) {
            for (long k = 0; k < count[i]; k++) sb.append((char) ('A' + i));
        }
        System.out.println(sb);
    }
}
