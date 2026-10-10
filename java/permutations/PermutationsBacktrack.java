import java.util.Arrays;
import java.util.Scanner;

public class PermutationsBacktrack {
    static StringBuilder out = new StringBuilder();

    // counts[c] = how many copies of letter c are still unused. Trying letters in alphabetical order
    // produces the permutations in sorted order, and each DISTINCT letter is tried once per position.
    static void build(int[] counts, char[] current, int pos) {
        if (pos == current.length) {
            out.append(new String(current)).append(' ');
            return;
        }
        for (int c = 0; c < counts.length; c++) {
            if (counts[c] == 0) {
                continue;
            }
            counts[c]--;                          // choose
            current[pos] = (char) ('A' + c);
            build(counts, current, pos + 1);      // explore
            counts[c]++;                          // un-choose
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int[] counts = new int[26];
        for (char ch : s.toCharArray()) {
            counts[ch - 'A']++;
        }
        build(counts, new char[s.length()], 0);
        System.out.println(out.toString().trim());
    }
}
