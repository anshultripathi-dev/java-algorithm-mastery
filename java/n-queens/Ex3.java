import java.util.Scanner;

public class Ex3 {
    static int n;
    static int[] pos;
    static boolean[] c, d1, d2;

    static boolean place(int r) {
        if (r == n) return true;
        for (int col = 0; col < n; col++) {
            int a = r - col + n - 1, b = r + col;
            if (c[col] || d1[a] || d2[b]) continue;
            c[col] = d1[a] = d2[b] = true;
            pos[r] = col;
            if (place(r + 1)) return true;
            c[col] = d1[a] = d2[b] = false;
        }
        return false;
    }

    // The lexicographically first solution as "column of the queen in each row" (1-based), or NONE.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        pos = new int[n];
        c = new boolean[n];
        d1 = new boolean[2 * n];
        d2 = new boolean[2 * n];
        if (!place(0)) {
            System.out.println("NONE");
            return;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i == 0 ? "" : " ").append(pos[i] + 1);
        System.out.println(sb);
    }
}
