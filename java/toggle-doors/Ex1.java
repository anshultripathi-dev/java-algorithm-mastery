import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        boolean[] open = new boolean[n + 1];
        for (int m = 1; m <= n; m++) for (int d = m; d <= n; d += m) open[d] = !open[d];
        int c = 0;
        for (int d = 1; d <= n; d++) if (open[d]) c++;
        System.out.println(c);
    }
}
