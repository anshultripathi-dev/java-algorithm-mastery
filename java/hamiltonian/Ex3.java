import java.util.Scanner;

public class Ex3 {
    static int v, count;
    static int[][] g;
    static boolean[] used;

    static void dfs(int cur, int placed) {
        if (placed == v) {
            if (g[cur][0] == 1) count++;
            return;
        }
        for (int nxt = 1; nxt < v; nxt++) {
            if (!used[nxt] && g[cur][nxt] == 1) {
                used[nxt] = true;
                dfs(nxt, placed + 1);
                used[nxt] = false;
            }
        }
    }

    // Count Hamiltonian cycles that start and end at vertex 0, counting a cycle and its reverse separately.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        v = sc.nextInt();
        g = new int[v][v];
        for (int i = 0; i < v; i++) for (int j = 0; j < v; j++) g[i][j] = sc.nextInt();
        used = new boolean[v];
        used[0] = true;
        dfs(0, 1);
        System.out.println(count);
    }
}
