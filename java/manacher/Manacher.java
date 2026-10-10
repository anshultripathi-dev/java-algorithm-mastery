import java.util.Scanner;

public class Manacher {
    // Manacher's algorithm: longest palindromic substring in O(n).
    // 1. Insert '#' between characters so every palindrome has odd length:  "abba" -> "#a#b#b#a#".
    // 2. radius[i] = how far the palindrome centred at i extends (in the transformed string).
    // 3. Reuse the mirror image of i inside the biggest palindrome seen so far instead of starting from 0.
    static int[] radii(String s) {
        StringBuilder sb = new StringBuilder("#");
        for (char c : s.toCharArray()) {
            sb.append(c).append('#');
        }
        String t = sb.toString();
        int n = t.length();
        int[] radius = new int[n];
        int center = 0;     // centre of the palindrome that reaches furthest right
        int right = 0;      // its right edge (exclusive)
        for (int i = 0; i < n; i++) {
            if (i < right) {
                int mirror = 2 * center - i;
                radius[i] = Math.min(right - i, radius[mirror]);   // free information from symmetry
            }
            while (i - radius[i] - 1 >= 0 && i + radius[i] + 1 < n
                    && t.charAt(i - radius[i] - 1) == t.charAt(i + radius[i] + 1)) {
                radius[i]++;                                       // extend only as far as symmetry could not tell us
            }
            if (i + radius[i] > right) {
                center = i;
                right = i + radius[i];
            }
        }
        return radius;
    }

    static String longestPalindrome(String s) {
        if (s.isEmpty()) {
            return "";
        }
        int[] r = radii(s);
        int bestCentre = 0;
        for (int i = 1; i < r.length; i++) {
            if (r[i] > r[bestCentre]) {
                bestCentre = i;
            }
        }
        int start = (bestCentre - r[bestCentre]) / 2;   // map back to an index in the original string
        return s.substring(start, start + r[bestCentre]);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        String p = longestPalindrome(s);
        System.out.println("longest palindromic substring: " + p + " (length " + p.length() + ")");
    }
}
