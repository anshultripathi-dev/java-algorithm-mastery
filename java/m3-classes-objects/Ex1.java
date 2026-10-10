import java.util.Scanner;

public class Ex1 {
    static class Rectangle {
        double width, height;

        Rectangle(double width, double height) {
            this.width = width;
            this.height = height;
        }

        double area() { return width * height; }
        double perimeter() { return 2 * (width + height); }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rectangle r = new Rectangle(sc.nextDouble(), sc.nextDouble());
        System.out.println(r.area() + " " + r.perimeter());
    }
}
