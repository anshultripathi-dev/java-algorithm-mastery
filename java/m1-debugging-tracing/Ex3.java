import java.util.Scanner;

public class Ex3 {
    // Fixed version of a buggy "largest of n numbers" that started with max = 0.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (x > max) max = x;
        }
        System.out.println(max);
    }
}
