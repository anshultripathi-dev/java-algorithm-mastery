import java.util.Scanner;

public class Ex3 {
    // Run-length encode: aaabccdddd -> a3b1c2d4
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder out = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;
            out.append(s.charAt(i)).append(j - i);
            i = j;
        }
        System.out.println(out);
    }
}
