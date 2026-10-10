import java.util.Scanner;

public class Ex1 {
    // Count how many times the inner statement runs for a double loop i in 1..n, j in 1..i.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long count = 0;
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= i; j++) count++;
        System.out.println(count);
    }
}
