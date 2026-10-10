import java.util.Scanner;

public class Ex1 {
    // Input: n, then an n x n board of move numbers. Is it a valid knight's tour (1..n*n, each step a knight move)?
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] px = new int[n * n + 1];
        int[] py = new int[n * n + 1];
        boolean ok = true;
        for (int y = 0; y < n; y++) {
            for (int x = 0; x < n; x++) {
                int v = sc.nextInt();
                if (v < 1 || v > n * n || px[v] != 0) {   // out of range or a repeated number
                    ok = false;
                } else {
                    px[v] = x + 1;
                    py[v] = y + 1;
                }
            }
        }
        for (int v = 1; v < n * n && ok; v++) {
            if (px[v] == 0 || px[v + 1] == 0) {
                ok = false;
                break;
            }
            int dx = Math.abs(px[v] - px[v + 1]);
            int dy = Math.abs(py[v] - py[v + 1]);
            if (!((dx == 1 && dy == 2) || (dx == 2 && dy == 1))) ok = false;
        }
        System.out.println(ok ? "YES" : "NO");
    }
}
