import java.util.Scanner;

public class HourglassMax {
    // An hourglass has its top-left corner at (i, j):
    //   a b c      (i, j) (i, j+1) (i, j+2)
    //     d                (i+1, j+1)
    //   e f g      (i+2, j) (i+2, j+1) (i+2, j+2)
    static int hourglassSum(int[][] m, int i, int j) {
        return m[i][j] + m[i][j + 1] + m[i][j + 2]
                + m[i + 1][j + 1]
                + m[i + 2][j] + m[i + 2][j + 1] + m[i + 2][j + 2];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rows = sc.nextInt();
        int cols = sc.nextInt();
        int[][] m = new int[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                m[i][j] = sc.nextInt();
            }
        }
        if (rows < 3 || cols < 3) {
            System.out.println("Not possible");
            return;
        }
        int best = Integer.MIN_VALUE;           // NOT 0: every hourglass sum may be negative
        int bestRow = 0, bestCol = 0;
        for (int i = 0; i + 2 < rows; i++) {        // (rows - 2) possible top rows
            for (int j = 0; j + 2 < cols; j++) {    // (cols - 2) possible left columns
                int s = hourglassSum(m, i, j);
                if (s > best) {
                    best = s;
                    bestRow = i;
                    bestCol = j;
                }
            }
        }
        System.out.println("hourglasses: " + (rows - 2) * (cols - 2));
        System.out.println("maximum sum: " + best + " (top-left corner at row " + bestRow + ", column " + bestCol + ")");
    }
}
