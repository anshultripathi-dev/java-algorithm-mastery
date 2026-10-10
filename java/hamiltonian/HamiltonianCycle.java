import java.util.Arrays;
import java.util.Scanner;

public class HamiltonianCycle {
    static int v;
    static int[][] graph;
    static int[] path;

    // Can vertex `candidate` be placed at position `pos` of the path?
    static boolean isSafe(int candidate, int pos) {
        if (graph[path[pos - 1]][candidate] == 0) {
            return false;                              // there is no edge from the previous vertex
        }
        for (int i = 0; i < pos; i++) {
            if (path[i] == candidate) {
                return false;                          // each vertex may be used only once
            }
        }
        return true;
    }

    static boolean extend(int pos) {
        if (pos == v) {
            return graph[path[pos - 1]][path[0]] == 1; // all placed: the last must connect back to the start
        }
        for (int candidate = 1; candidate < v; candidate++) {
            if (isSafe(candidate, pos)) {
                path[pos] = candidate;                 // choose
                if (extend(pos + 1)) {
                    return true;
                }
                path[pos] = -1;                        // un-choose
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        v = sc.nextInt();
        graph = new int[v][v];
        for (int i = 0; i < v; i++) {
            for (int j = 0; j < v; j++) {
                graph[i][j] = sc.nextInt();
            }
        }
        path = new int[v];
        Arrays.fill(path, -1);
        path[0] = 0;                                   // a cycle can start anywhere: fix vertex 0
        if (!extend(1)) {
            System.out.println("Solution does not exist");
            return;
        }
        StringBuilder sb = new StringBuilder();
        for (int x : path) sb.append(x).append(' ');
        sb.append(path[0]);
        System.out.println("Solution exists: " + sb);
    }
}
