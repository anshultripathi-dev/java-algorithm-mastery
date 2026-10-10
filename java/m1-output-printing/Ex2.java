import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double price = sc.nextDouble();
        int qty = sc.nextInt();
        System.out.printf("Total: %,.2f%n", price * qty);
    }
}
