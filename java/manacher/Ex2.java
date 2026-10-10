import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int bestStart = 0, bestLen = 1;
        for (int c = 0; c < s.length(); c++) {
            for (int t = 0; t < 2; t++) {
                int l = c, r = c + t;
                while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
                    l--;
                    r++;
                }
                if (r - l - 1 > bestLen) {
                    bestLen = r - l - 1;
                    bestStart = l + 1;
                }
            }
        }
        System.out.println(s.substring(bestStart, bestStart + bestLen));
    }
}
