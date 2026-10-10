import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Map<Integer, Integer> freq = new HashMap<>();
        Integer winner = null;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            int c = freq.merge(x, 1, Integer::sum);
            if (c > n / 2) winner = x;
        }
        System.out.println(winner == null ? "No majority element" : winner);
    }
}
