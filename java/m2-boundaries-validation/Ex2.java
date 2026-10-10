import java.util.Scanner;

public class Ex2 {
    // Largest element, or `empty` when n = 0.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n == 0) {
            System.out.println("empty");
            return;
        }
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) max = Math.max(max, sc.nextInt());
        System.out.println(max);
    }
}
