import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        long product = (long) a * b;       // widen first, then multiply
        System.out.println(product);
    }
}
