import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int r = sc.nextInt();
        long result = 1;
        for (int i = 1; i <= r; i++) {
            result = result * (n - r + i) / i;   // always exact: result is C(n-r+i, i)
        }
        System.out.println(result);
    }
}
