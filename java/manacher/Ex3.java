import java.util.Scanner;

public class Ex3 {
    // Count ALL palindromic substrings (by position) in O(n) using Manacher's radii.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder sb = new StringBuilder("#");
        for (char c : s.toCharArray()) sb.append(c).append('#');
        String t = sb.toString();
        int n = t.length();
        int[] rad = new int[n];
        int center = 0, right = 0;
        long total = 0;
        for (int i = 0; i < n; i++) {
            if (i < right) rad[i] = Math.min(right - i, rad[2 * center - i]);
            while (i - rad[i] - 1 >= 0 && i + rad[i] + 1 < n && t.charAt(i - rad[i] - 1) == t.charAt(i + rad[i] + 1)) rad[i]++;
            if (i + rad[i] > right) {
                center = i;
                right = i + rad[i];
            }
            total += (rad[i] + 1) / 2;       // a radius of r in the transformed string gives ceil(r/2) palindromes
        }
        System.out.println(total);
    }
}
