import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        if (b == 0) {
            System.out.println("cannot divide by zero");
        } else {
            System.out.println(a / b);
        }
    }
}
