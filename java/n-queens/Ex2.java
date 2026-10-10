import java.util.Scanner;

public class Ex2 {
    static int n, solutions;
    static boolean[] c, d1, d2;

    static void place(int r) {
        if (r == n) {
            solutions++;
            return;
        }
        for (int col = 0; col < n; col++) {
            int a = r - col + n - 1, b = r + col;
            if (c[col] || d1[a] || d2[b]) continue;
            c[col] = d1[a] = d2[b] = true;
            place(r + 1);
            c[col] = d1[a] = d2[b] = false;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        c = new boolean[n];
        d1 = new boolean[2 * n];
        d2 = new boolean[2 * n];
        place(0);
        System.out.println(solutions);
    }
}
