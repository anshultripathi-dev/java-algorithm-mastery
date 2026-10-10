import java.util.Random;

public class ManacherCheck {
    static int[] radii(String s) {
        StringBuilder sb = new StringBuilder("#");
        for (char c : s.toCharArray()) sb.append(c).append('#');
        String t = sb.toString();
        int n = t.length();
        int[] radius = new int[n];
        int center = 0, right = 0;
        for (int i = 0; i < n; i++) {
            if (i < right) radius[i] = Math.min(right - i, radius[2 * center - i]);
            while (i - radius[i] - 1 >= 0 && i + radius[i] + 1 < n && t.charAt(i - radius[i] - 1) == t.charAt(i + radius[i] + 1)) radius[i]++;
            if (i + radius[i] > right) { center = i; right = i + radius[i]; }
        }
        return radius;
    }

    static int longestFast(String s) {
        int best = 0;
        for (int r : radii(s)) best = Math.max(best, r);
        return best;
    }

    static int longestBrute(String s) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            for (int j = i; j < s.length(); j++) {
                boolean pal = true;
                for (int l = i, r = j; l < r; l++, r--) if (s.charAt(l) != s.charAt(r)) { pal = false; break; }
                if (pal) best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }

    // 20000 random strings over a tiny alphabet (many palindromes) compared with a triple-loop brute force.
    public static void main(String[] args) {
        Random rnd = new Random(11);
        for (int t = 0; t < 20000; t++) {
            int n = 1 + rnd.nextInt(14);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) sb.append((char) ('a' + rnd.nextInt(2)));
            String s = sb.toString();
            if (longestFast(s) != longestBrute(s)) {
                System.out.println("MISMATCH on " + s);
                return;
            }
        }
        System.out.println("Manacher matches brute force on 20000 random strings");
    }
}
