import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int row = 1; row <= n; row++) {
            StringBuilder sb = new StringBuilder();
            for (int c = 1; c <= n - row; c++) sb.append(' ');
            for (int c = 1; c <= 2 * row - 1; c++) sb.append('*');
            System.out.println(sb);
        }
    }
}
