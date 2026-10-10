public class JosephusRecursive {
    // survivor's position (1-based) among n people when every k-th is eliminated.
    // Idea: after the first elimination there are n-1 people and counting restarts right after the
    // eliminated person. Solve that smaller circle, then translate its answer back to the n-circle.
    static int josephus(int n, int k) {
        if (n == 1) {
            return 1;                                 // one person left: they survive
        }
        return (josephus(n - 1, k) + k - 1) % n + 1;  // shift by k places and wrap around the circle of n
    }

    public static void main(String[] args) {
        int[][] cases = {{5, 2}, {7, 3}, {6, 2}, {14, 2}};
        for (int[] c : cases) {
            System.out.println("josephus(" + c[0] + ", " + c[1] + ") = " + josephus(c[0], c[1]));
        }
    }
}
