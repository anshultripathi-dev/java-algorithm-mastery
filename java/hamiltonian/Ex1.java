import java.util.Scanner;

public class Ex1 {
    // Input: v, adjacency matrix, then a vertex sequence of length v+1. Is it a Hamiltonian cycle?
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int v = sc.nextInt();
        int[][] g = new int[v][v];
        for (int i = 0; i < v; i++) for (int j = 0; j < v; j++) g[i][j] = sc.nextInt();
        int[] p = new int[v + 1];
        for (int i = 0; i <= v; i++) p[i] = sc.nextInt();
        boolean ok = p[0] == p[v];
        boolean[] seen = new boolean[v];
        for (int i = 0; i < v && ok; i++) {
            if (seen[p[i]]) ok = false;
            seen[p[i]] = true;
            if (g[p[i]][p[i + 1]] == 0) ok = false;
        }
        System.out.println(ok ? "YES" : "NO");
    }
}
