import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;

public class TreeGraphDemo {
    // ---------- binary search tree ----------
    static class TreeNode {
        int key;
        TreeNode left, right;

        TreeNode(int key) { this.key = key; }
    }

    static TreeNode insert(TreeNode root, int key) {
        if (root == null) return new TreeNode(key);
        if (key < root.key) root.left = insert(root.left, key);
        else if (key > root.key) root.right = insert(root.right, key);
        return root;
    }

    static boolean contains(TreeNode root, int key) {
        while (root != null) {
            if (key == root.key) return true;
            root = key < root.key ? root.left : root.right;     // discard one half each step
        }
        return false;
    }

    static void inorder(TreeNode t, List<Integer> out) {        // left, node, right: SORTED order for a BST
        if (t == null) return;
        inorder(t.left, out);
        out.add(t.key);
        inorder(t.right, out);
    }

    static int height(TreeNode t) {
        return t == null ? 0 : 1 + Math.max(height(t.left), height(t.right));
    }

    // ---------- graph as adjacency list ----------
    static List<List<Integer>> graph(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);       // undirected: add both directions
        }
        return adj;
    }

    static List<Integer> bfs(List<List<Integer>> adj, int start) {
        boolean[] seen = new boolean[adj.size()];
        List<Integer> order = new ArrayList<>();
        Queue<Integer> q = new ArrayDeque<>();
        q.add(start);
        seen[start] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            for (int v : adj.get(u)) {
                if (!seen[v]) {
                    seen[v] = true;
                    q.add(v);
                }
            }
        }
        return order;
    }

    static void dfs(List<List<Integer>> adj, int u, boolean[] seen, List<Integer> order) {
        seen[u] = true;
        order.add(u);
        for (int v : adj.get(u)) {
            if (!seen[v]) dfs(adj, v, seen, order);
        }
    }

    // ---------- binary min-heap in an array ----------
    static class MinHeap {
        int[] a = new int[16];
        int size;

        void add(int x) {
            a[size] = x;
            int i = size++;
            while (i > 0 && a[(i - 1) / 2] > a[i]) {          // sift up: parent of i is (i-1)/2
                int p = (i - 1) / 2;
                int t = a[p]; a[p] = a[i]; a[i] = t;
                i = p;
            }
        }

        int removeMin() {
            int min = a[0];
            a[0] = a[--size];
            int i = 0;
            while (true) {                                     // sift down: children 2i+1, 2i+2
                int l = 2 * i + 1, r = l + 1, s = i;
                if (l < size && a[l] < a[s]) s = l;
                if (r < size && a[r] < a[s]) s = r;
                if (s == i) break;
                int t = a[s]; a[s] = a[i]; a[i] = t;
                i = s;
            }
            return min;
        }
    }

    public static void main(String[] args) {
        TreeNode root = null;
        for (int k : new int[] {50, 30, 70, 20, 40, 60, 80, 30}) root = insert(root, k);   // 30 twice: ignored
        List<Integer> sorted = new ArrayList<>();
        inorder(root, sorted);
        System.out.println("inorder  : " + sorted);
        System.out.println("height   : " + height(root) + ", contains 60? " + contains(root, 60) + ", 65? " + contains(root, 65));

        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {3, 4}};
        List<List<Integer>> adj = graph(5, edges);
        System.out.println("adjacency: " + adj);
        System.out.println("BFS from 0: " + bfs(adj, 0));
        List<Integer> d = new ArrayList<>();
        dfs(adj, 0, new boolean[5], d);
        System.out.println("DFS from 0: " + d);

        MinHeap h = new MinHeap();
        for (int x : new int[] {9, 4, 7, 1, 8, 2}) h.add(x);
        int[] out = new int[6];
        for (int i = 0; i < 6; i++) out[i] = h.removeMin();
        System.out.println("heap order: " + Arrays.toString(out));
    }
}
