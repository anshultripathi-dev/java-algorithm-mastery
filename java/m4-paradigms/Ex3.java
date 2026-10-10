import java.util.Scanner;

public class Ex3 {
    // Backtracking: print all binary strings of length n with no two consecutive 1s, in order.
    static StringBuilder out = new StringBuilder();

    static void gen(int n, String s, boolean lastOne) {
        if (s.length() == n) {
            out.append(s).append('\n');
            return;
        }
        gen(n, s + "0", false);
        if (!lastOne) gen(n, s + "1", true);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        gen(sc.nextInt(), "", false);
        System.out.print(out);
    }
}
