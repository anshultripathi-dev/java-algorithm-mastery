import java.util.Scanner;

public class KnightBacktracking {
    static final int[] DX = {2, 1, -1, -2, -2, -1, 1, 2};
    static final int[] DY = {1, 2, 2, 1, -1, -2, -2, -1};
    static int n;
    static int[][] board;
    static long calls = 0;

    // Plain backtracking: try every move in a fixed order, undo when stuck. Exponential — only fine for tiny boards.
    static boolean solve(int x, int y, int step) {
        calls++;
        board[y][x] = step;
        if (step == n * n) {
            return true;
        }
        for (int m = 0; m < 8; m++) {
            int nx = x + DX[m], ny = y + DY[m];
            if (nx >= 0 && ny >= 0 && nx < n && ny < n && board[ny][nx] == 0) {
                if (solve(nx, ny, step + 1)) {
                    return true;
                }
            }
        }
        board[y][x] = 0;                   // backtrack
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        board = new int[n][n];
        boolean ok = solve(0, 0, 1);
        System.out.println(ok ? "tour found after " + calls + " calls" : "no tour");
        if (ok) {
            for (int y = 0; y < n; y++) {
                StringBuilder sb = new StringBuilder();
                for (int x = 0; x < n; x++) sb.append(String.format("%3d", board[y][x]));
                System.out.println(sb);
            }
        }
    }
}
