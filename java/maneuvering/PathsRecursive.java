import java.util.Scanner;

public class PathsRecursive {
    static long calls = 0;

    // Number of paths from the top-left to the bottom-right of an m x n grid using only right/down moves.
    static long numberOfPaths(int m, int n) {
        calls++;
        if (m == 1 || n == 1) {
            return 1;                  // a single row or column: only one way
        }
        return numberOfPaths(m - 1, n) + numberOfPaths(m, n - 1);   // arrive from above or from the left
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int n = sc.nextInt();
        System.out.println("paths = " + numberOfPaths(m, n));
        System.out.println("recursive calls = " + calls);
    }
}
