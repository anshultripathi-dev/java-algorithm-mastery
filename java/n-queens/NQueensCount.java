import java.util.Scanner;

public class NQueensCount {
    static int n;
    static boolean[] column;      // column c already has a queen
    static boolean[] diagDown;    // diagonal r - c + (n - 1)
    static boolean[] diagUp;      // anti-diagonal r + c
    static int solutions;

    // O(1) safety test: three boolean arrays instead of scanning the board.
    static void place(int row) {
        if (row == n) {
            solutions++;
            return;
        }
        for (int col = 0; col < n; col++) {
            int d1 = row - col + n - 1;
            int d2 = row + col;
            if (column[col] || diagDown[d1] || diagUp[d2]) {
                continue;
            }
            column[col] = diagDown[d1] = diagUp[d2] = true;      // choose
            place(row + 1);                                      // explore
            column[col] = diagDown[d1] = diagUp[d2] = false;     // un-choose
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        column = new boolean[n];
        diagDown = new boolean[2 * n - 1];
        diagUp = new boolean[2 * n - 1];
        place(0);
        System.out.println("N = " + n + ": " + solutions + " solutions");
    }
}
