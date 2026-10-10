import java.util.Scanner;

public class Ex2 {
    // for (i = n/2; i >= 1; i--) for (j = 1; j <= n; j *= 2) count++;
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long count = 0;
        for (int i = n / 2; i >= 1; i--)
            for (long j = 1; j <= n; j *= 2) count++;
        System.out.println(count);
    }
}
