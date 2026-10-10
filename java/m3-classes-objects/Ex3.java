import java.util.Scanner;

public class Ex3 {
    static class Point {
        final int x, y;

        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        double distanceTo(Point other) {
            int dx = x - other.x;
            int dy = y - other.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Point a = new Point(sc.nextInt(), sc.nextInt());
        Point b = new Point(sc.nextInt(), sc.nextInt());
        System.out.printf("%.3f%n", a.distanceTo(b));
    }
}
