import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int best = 0;
        for (int bit = 0; bit < 32; bit++) {
            int y = x | (1 << bit);
            int run = 0;
            for (int i = 0; i < 32; i++) {
                if (((y >>> i) & 1) == 1) best = Math.max(best, ++run);
                else run = 0;
            }
        }
        System.out.println(best);
    }
}
