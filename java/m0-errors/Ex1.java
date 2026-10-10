import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        double average = (a + b) / 2.0;      // 2.0 forces floating-point division
        System.out.printf("%.1f%n", average);
    }
}
