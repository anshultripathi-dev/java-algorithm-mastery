import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int cur = 0, best = 0;
        for (int i = 0; i < 32; i++) {
            if ((x & 1) == 1) best = Math.max(best, ++cur);
            else cur = 0;
            x >>>= 1;
        }
        System.out.println(best);
    }
}
