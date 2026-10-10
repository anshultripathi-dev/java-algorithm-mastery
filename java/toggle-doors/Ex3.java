import java.util.Scanner;

public class Ex3 {
    // Only the first m monkeys are released. Count doors that are open afterwards.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        boolean[] open = new boolean[n + 1];
        for (int monkey = 1; monkey <= Math.min(m, n); monkey++) {
            for (int d = monkey; d <= n; d += monkey) open[d] = !open[d];
        }
        int c = 0;
        for (int d = 1; d <= n; d++) if (open[d]) c++;
        System.out.println(c);
    }
}
