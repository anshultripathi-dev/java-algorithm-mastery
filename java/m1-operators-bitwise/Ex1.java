import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        System.out.println(n > 0 && (n & (n - 1)) == 0 ? "YES" : "NO");
    }
}
