import java.util.Scanner;

public class Ex1 {
    interface Shape {
        double area();
    }

    static class Circle implements Shape {
        final double r;
        Circle(double r) { this.r = r; }
        public double area() { return Math.PI * r * r; }
    }

    static class Square implements Shape {
        final double s;
        Square(double s) { this.s = s; }
        public double area() { return s * s; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        double total = 0;
        for (int i = 0; i < n; i++) {
            String kind = sc.next();
            double v = sc.nextDouble();
            Shape s = kind.equals("circle") ? new Circle(v) : new Square(v);
            total += s.area();
        }
        System.out.printf("%.2f%n", total);
    }
}
