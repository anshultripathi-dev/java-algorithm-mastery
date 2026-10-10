import java.util.List;

public class ShapesDemo {
    static class Shape {
        protected final String name;

        Shape(String name) {
            this.name = name;
        }

        double area() {
            return 0;
        }

        @Override
        public String toString() {
            return name + " area=" + String.format("%.2f", area());
        }
    }

    static class Circle extends Shape {          // "is-a": a Circle IS a Shape
        private final double r;

        Circle(double r) {
            super("Circle");                      // call the parent constructor first
            this.r = r;
        }

        @Override
        double area() {                           // OVERRIDING: same signature, new behaviour
            return Math.PI * r * r;
        }
    }

    static class Rectangle extends Shape {
        private final double w, h;

        Rectangle(double w, double h) {
            super("Rectangle");
            this.w = w;
            this.h = h;
        }

        @Override
        double area() {
            return w * h;
        }
    }

    static class Square extends Rectangle {
        Square(double side) {
            super(side, side);
        }

        @Override
        public String toString() {
            return "Square! " + super.toString();   // reuse the parent's version
        }
    }

    public static void main(String[] args) {
        // POLYMORPHISM: one variable type (Shape), many actual types; the right area() runs at run time.
        List<Shape> shapes = List.of(new Circle(1), new Rectangle(2, 3), new Square(4), new Shape("Blob"));
        double total = 0;
        for (Shape s : shapes) {
            System.out.println(s);
            total += s.area();
        }
        System.out.printf("total area = %.2f%n", total);

        Shape s = new Square(2);
        System.out.println(s instanceof Rectangle);          // true
        System.out.println(s instanceof Circle);             // false
        if (s instanceof Rectangle rect) {                   // pattern matching (Java 16+)
            System.out.println("it is a rectangle with area " + rect.area());
        }
    }
}
