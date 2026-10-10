import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        String from = "01689";
        String to = "01986";
        int l = 0, r = s.length() - 1;
        boolean ok = true;
        while (l <= r) {
            int i = from.indexOf(s.charAt(l));
            if (i < 0 || to.charAt(i) != s.charAt(r)) {
                ok = false;
                break;
            }
            l++;
            r--;
        }
        System.out.println(ok ? "YES" : "NO");
    }
}
