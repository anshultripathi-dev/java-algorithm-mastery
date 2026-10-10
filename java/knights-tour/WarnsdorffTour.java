import java.util.Scanner;

public class WarnsdorffTour {
    static final int[] DX = {1, 1, 2, 2, -1, -1, -2, -2};   // the eight knight moves
    static final int[] DY = {2, -2, 1, -1, 2, -2, 1, -1};

    static int n;
    static int[][] board;      // board[y][x] = move number (1..n*n), 0 = not visited yet

    static boolean free(int x, int y) {
        return x >= 0 && y >= 0 && x < n && y < n && board[y][x] == 0;
    }

    // degree = how many unvisited squares a knight standing on (x, y) could still jump to
    static int degree(int x, int y) {
        int count = 0;
        for (int m = 0; m < 8; m++) {
            if (free(x + DX[m], y + DY[m])) {
                count++;
            }
        }
        return count;
    }

    // Warnsdorff's rule: always jump to the neighbour with the FEWEST onward moves.
    // Ties are broken by the first move in the DX/DY order (so the result is deterministic).
    static boolean tour(int startX, int startY) {
        int x = startX;
        int y = startY;
        board[y][x] = 1;
        for (int step = 2; step <= n * n; step++) {
            int bestMove = -1;
            int bestDegree = 9;
            for (int m = 0; m < 8; m++) {
                int nx = x + DX[m];
                int ny = y + DY[m];
                if (free(nx, ny)) {
                    int d = degree(nx, ny);
                    if (d < bestDegree) {
                        bestDegree = d;
                        bestMove = m;
                    }
                }
            }
            if (bestMove == -1) {
                return false;              // stuck: the heuristic failed from this start
            }
            x += DX[bestMove];
            y += DY[bestMove];
            board[y][x] = step;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        int sx = sc.nextInt();
        int sy = sc.nextInt();
        board = new int[n][n];
        if (!tour(sx, sy)) {
            System.out.println("Warnsdorff's rule got stuck");
            return;
        }
        for (int y = 0; y < n; y++) {
            StringBuilder sb = new StringBuilder();
            for (int x = 0; x < n; x++) {
                sb.append(String.format("%3d", board[y][x]));
            }
            System.out.println(sb);
        }
    }
}
