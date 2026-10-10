import java.util.Scanner;

public class Ex3 {
    // a^b mod m with fast exponentiation
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong(), b = sc.nextLong(), m = sc.nextLong();
        long result = 1 % m;
        a %= m;
        while (b > 0) {
            if ((b & 1) == 1) result = result * a % m;
            a = a * a % m;
            b >>= 1;
        }
        System.out.println(result);
    }
}
