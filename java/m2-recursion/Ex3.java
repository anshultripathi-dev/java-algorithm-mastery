import java.util.Scanner;

public class Ex3 {
    // Print every subset of {1..n} (in the order: without the element first, then with it).
    static StringBuilder out = new StringBuilder();

    static void subsets(int i, int n, java.util.ArrayList<Integer> cur) {
        if (i > n) {
            out.append(cur.toString()).append('\n');
            return;
        }
        subsets(i + 1, n, cur);        // skip i
        cur.add(i);
        subsets(i + 1, n, cur);        // take i
        cur.remove(cur.size() - 1);    // undo
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        subsets(1, sc.nextInt(), new java.util.ArrayList<>());
        System.out.print(out);
    }
}
