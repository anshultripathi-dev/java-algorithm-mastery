import java.util.Scanner;

public class Ex1 {
    static int gcd(int a, int b) {
        while (b != 0) {
            int r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int k = 1; k <= n; k++) {
            if (gcd(k, n) == 1) {
                sb.append(k).append(' ');
            }
        }
        System.out.println(sb.toString().trim());
    }
}
