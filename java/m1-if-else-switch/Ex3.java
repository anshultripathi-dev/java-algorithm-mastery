import java.util.Scanner;

public class Ex3 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        if (a + b <= c || a + c <= b || b + c <= a) {
            System.out.println("not a triangle");
        } else if (a == b && b == c) {
            System.out.println("equilateral");
        } else if (a == b || b == c || a == c) {
            System.out.println("isosceles");
        } else {
            System.out.println("scalene");
        }
    }
}
