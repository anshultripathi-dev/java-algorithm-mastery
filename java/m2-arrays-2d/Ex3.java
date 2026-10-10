import java.util.Scanner;

public class Ex3 {
    // Print an n x n matrix in clockwise spiral order, space separated.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] m = new int[n][n];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) m[i][j] = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        int top = 0, bottom = n - 1, left = 0, right = n - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) sb.append(m[top][j]).append(' ');
            top++;
            for (int i = top; i <= bottom; i++) sb.append(m[i][right]).append(' ');
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) sb.append(m[bottom][j]).append(' ');
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) sb.append(m[i][left]).append(' ');
                left++;
            }
        }
        System.out.println(sb.toString().trim());
    }
}
