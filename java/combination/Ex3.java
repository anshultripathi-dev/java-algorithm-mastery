import java.util.Scanner;

public class Ex3 {
    static StringBuilder out = new StringBuilder();

    // choose(start, chosen): extend the current selection with numbers >= start
    static void choose(int n, int r, int start, int[] picked, int count) {
        if (count == r) {
            for (int i = 0; i < r; i++) {
                out.append(i == 0 ? "" : " ").append(picked[i]);
            }
            out.append('\n');
            return;
        }
        for (int v = start; v <= n; v++) {
            picked[count] = v;
            choose(n, r, v + 1, picked, count + 1);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int r = sc.nextInt();
        choose(n, r, 1, new int[r], 0);
        System.out.print(out);
    }
}
