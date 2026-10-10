import java.util.Scanner;

public class Ex1 {
    // Read a 3x3 matrix and print the single hourglass sum.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] m = new int[3][3];
        for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) m[i][j] = sc.nextInt();
        System.out.println(m[0][0] + m[0][1] + m[0][2] + m[1][1] + m[2][0] + m[2][1] + m[2][2]);
    }
}
