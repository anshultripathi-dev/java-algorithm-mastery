import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class EqualsHashCodeDemo {
    // WITHOUT equals/hashCode: two logically equal points are different objects.
    static class RawPoint {
        final int x, y;
        RawPoint(int x, int y) { this.x = x; this.y = y; }
    }

    // WITH equals + hashCode: value-based identity. The contract: equal objects MUST have equal hash codes.
    static final class Point {
        private final int x, y;                       // final + no setters = immutable

        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Point)) return false;
            Point p = (Point) o;
            return x == p.x && y == p.y;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }

        @Override
        public String toString() {
            return "(" + x + "," + y + ")";
        }
    }

    public static void main(String[] args) {
        RawPoint r1 = new RawPoint(1, 2);
        RawPoint r2 = new RawPoint(1, 2);
        System.out.println("raw equals? " + r1.equals(r2));          // false: compares references

        Point p1 = new Point(1, 2);
        Point p2 = new Point(1, 2);
        System.out.println("point equals? " + p1.equals(p2) + ", same hash? " + (p1.hashCode() == p2.hashCode()));

        Set<RawPoint> rawSet = new HashSet<>();
        rawSet.add(r1);
        rawSet.add(r2);
        Set<Point> set = new HashSet<>();
        set.add(p1);
        set.add(p2);
        System.out.println("raw set size " + rawSet.size() + ", point set size " + set.size());
        System.out.println("contains (1,2)? " + set.contains(new Point(1, 2)));

        // String is immutable too: methods return new objects
        String s = "abc";
        String t = s.concat("d");
        System.out.println(s + " " + t);
    }
}
