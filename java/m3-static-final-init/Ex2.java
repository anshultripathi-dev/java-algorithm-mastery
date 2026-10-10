import java.util.Scanner;

public class Ex2 {
    static final double PI_APPROX = 3.14159;

    static double circleArea(double r) {
        return PI_APPROX * r * r;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.printf("%.3f%n", circleArea(sc.nextDouble()));
    }
}
