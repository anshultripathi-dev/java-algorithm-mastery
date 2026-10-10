import java.util.Scanner;

public class Ex2 {
    static StringBuilder out = new StringBuilder();

    static void build(int[] counts, char[] cur, int pos) {
        if (pos == cur.length) {
            out.append(new String(cur)).append('\n');
            return;
        }
        for (int c = 0; c < counts.length; c++) {
            if (counts[c] == 0) continue;
            counts[c]--;
            cur[pos] = (char) c;
            build(counts, cur, pos + 1);
            counts[c]++;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int[] counts = new int[256];
        for (char c : s.toCharArray()) counts[c]++;
        build(counts, new char[s.length()], 0);
        System.out.print(out);
    }
}
