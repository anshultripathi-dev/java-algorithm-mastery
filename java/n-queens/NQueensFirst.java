import java.util.Scanner;

public class NQueensFirst {
    static int n;
    static int[][] board;

    // Can a queen stand at (row, col)? Check the column and both diagonals ABOVE the row
    // (rows below are still empty because we fill the board one row at a time).
    static boolean isSafe(int row, int col) {
        for (int r = 0; r < row; r++) {
            if (board[r][col] == 1) {
                return false;                         // same column
            }
        }
        for (int r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
            if (board[r][c] == 1) {
                return false;                         // upper-left diagonal
            }
        }
        for (int r = row - 1, c = col + 1; r >= 0 && c < n; r--, c++) {
            if (board[r][c] == 1) {
                return false;                         // upper-right diagonal
            }
        }
        return true;
    }

    // Place one queen per row. Returns true as soon as every row has a queen.
    static boolean solve(int row) {
        if (row == n) {
            return true;                              // all N queens placed
        }
        for (int col = 0; col < n; col++) {
            if (isSafe(row, col)) {
                board[row][col] = 1;                  // choose
                if (solve(row + 1)) {                 // explore the next row
                    return true;
                }
                board[row][col] = 0;                  // un-choose: BACKTRACK and try the next column
            }
        }
        return false;                                 // no column works in this row -> previous row must move
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        board = new int[n][n];
        if (!solve(0)) {
            System.out.println("Solution does not exist");
            return;
        }
        for (int[] row : board) {
            StringBuilder sb = new StringBuilder();
            for (int cell : row) {
                sb.append(sb.length() == 0 ? "" : " ").append(cell);
            }
            System.out.println(sb);
        }
    }
}
