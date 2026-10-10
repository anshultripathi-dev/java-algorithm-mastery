import java.util.Arrays;
import java.util.Scanner;

public class Ex2 {
    static int v;
    static int[][] g;
    static int[] path;

    static boolean extend(int pos) {
        if (pos == v) return g[path[v - 1]][path[0]] == 1;
        for (int c = 1; c < v; c++) {
            boolean ok = g[path[pos - 1]][c] == 1;
            for (int i = 0; i < pos && ok; i++) if (path[i] == c) ok = false;
            if (!ok) continue;
            path[pos] = c;
            if (extend(pos + 1)) return true;
            path[pos] = -1;
        }
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        v = sc.nextInt();
        g = new int[v][v];
        for (int i = 0; i < v; i++) for (int j = 0; j < v; j++) g[i][j] = sc.nextInt();
        path = new int[v];
        Arrays.fill(path, -1);
        path[0] = 0;
        if (!extend(1)) {
            System.out.println("NO");
            return;
        }
        StringBuilder sb = new StringBuilder();
        for (int x : path) sb.append(x).append(' ');
        sb.append(0);
        System.out.println("YES " + sb);
    }
}
