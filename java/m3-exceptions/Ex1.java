import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next();
        String b = sc.next();
        try {
            int x = Integer.parseInt(a);
            int y = Integer.parseInt(b);
            System.out.println(x / y);
        } catch (NumberFormatException e) {
            System.out.println("bad number");
        } catch (ArithmeticException e) {
            System.out.println("division by zero");
        }
    }
}
