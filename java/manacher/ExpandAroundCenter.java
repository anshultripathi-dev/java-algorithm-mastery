import java.util.Scanner;

public class ExpandAroundCenter {
    // Every palindrome has a centre (a character, or a gap between two characters). From each of the
    // 2n-1 centres grow outwards while the ends match. O(n^2) worst case, O(1) space.
    static String longestPalindrome(String s) {
        if (s.isEmpty()) {
            return "";
        }
        int bestStart = 0;
        int bestLen = 1;
        for (int centre = 0; centre < s.length(); centre++) {
            for (int type = 0; type < 2; type++) {          // type 0: odd length, type 1: even length
                int l = centre;
                int r = centre + type;
                while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
                    l--;
                    r++;
                }
                int len = r - l - 1;
                if (len > bestLen) {
                    bestLen = len;
                    bestStart = l + 1;
                }
            }
        }
        return s.substring(bestStart, bestStart + bestLen);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        String p = longestPalindrome(s);
        System.out.println("longest palindromic substring: " + p + " (length " + p.length() + ")");
    }
}
