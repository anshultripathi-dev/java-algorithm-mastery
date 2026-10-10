import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int r1 = sc.nextInt();
        int b = sc.nextInt();
        int r2 = sc.nextInt();
        for (int x = 0; x < a * b; x++) {
            if (x % a == r1 && x % b == r2) {
                System.out.println(x);
                return;
            }
        }
    }
}
