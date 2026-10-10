import java.util.Scanner;

public class Ex2 {
    // Print the transpose of an r x c matrix.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] m = new int[r][c];
        for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) m[i][j] = sc.nextInt();
        for (int j = 0; j < c; j++) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < r; i++) sb.append(i == 0 ? "" : " ").append(m[i][j]);
            System.out.println(sb);
        }
    }
}
