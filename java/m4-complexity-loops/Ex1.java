import java.util.Scanner;

public class Ex1 {
    // How many times does "count++" execute?   for (i = 1; i <= n; i *= 3) for (j = 0; j < n; j++) count++;
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long count = 0;
        for (long i = 1; i <= n; i *= 3)
            for (int j = 0; j < n; j++) count++;
        System.out.println(count);
    }
}
