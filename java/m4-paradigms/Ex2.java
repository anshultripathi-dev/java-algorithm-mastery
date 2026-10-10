import java.util.Arrays;
import java.util.Scanner;

public class Ex2 {
    // Fewest coins to make the amount (any coin system), or -1.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        int[] coins = new int[k];
        for (int i = 0; i < k; i++) coins[i] = sc.nextInt();
        int amount = sc.nextInt();
        int INF = Integer.MAX_VALUE;
        int[] best = new int[amount + 1];
        Arrays.fill(best, INF);
        best[0] = 0;
        for (int x = 1; x <= amount; x++)
            for (int c : coins)
                if (c <= x && best[x - c] != INF) best[x] = Math.min(best[x], best[x - c] + 1);
        System.out.println(best[amount] == INF ? -1 : best[amount]);
    }
}
