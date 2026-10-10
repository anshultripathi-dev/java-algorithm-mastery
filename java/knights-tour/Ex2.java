import java.util.Scanner;

public class Ex2 {
    // How many squares can a knight on (x, y) reach on an empty n x n board? (the "degree" Warnsdorff uses)
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int x = sc.nextInt();
        int y = sc.nextInt();
        int[] dx = {1, 1, 2, 2, -1, -1, -2, -2};
        int[] dy = {2, -2, 1, -1, 2, -2, 1, -1};
        int c = 0;
        for (int m = 0; m < 8; m++) {
            int nx = x + dx[m], ny = y + dy[m];
            if (nx >= 0 && ny >= 0 && nx < n && ny < n) c++;
        }
        System.out.println(c);
    }
}
