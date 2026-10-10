import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long k = sc.nextLong();
        long ans = 0;
        for (long people = 2; people <= n; people++) {
            ans = (ans + k) % people;
        }
        System.out.println(ans + 1);
    }
}
