import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SortingDemo {
    static class Student implements Comparable<Student> {
        final String name;
        final int marks;
        final int age;

        Student(String name, int marks, int age) {
            this.name = name;
            this.marks = marks;
            this.age = age;
        }

        // NATURAL ORDER: by name. A negative result means "this comes first".
        @Override
        public int compareTo(Student o) {
            return name.compareTo(o.name);
        }

        @Override
        public String toString() {
            return name + ":" + marks + ":" + age;
        }
    }

    public static void main(String[] args) {
        List<Student> list = new ArrayList<>(List.of(
            new Student("Mei", 71, 20), new Student("Asha", 90, 19),
            new Student("Ravi", 71, 18), new Student("Zoe", 55, 21)));

        Collections.sort(list);                                   // uses compareTo
        System.out.println("by name      : " + list);

        list.sort(Comparator.comparingInt((Student s) -> s.marks).reversed());   // marks descending
        System.out.println("by marks desc: " + list);               // stable: Mei before Ravi (both 71)

        list.sort(Comparator.comparingInt((Student s) -> s.marks).reversed().thenComparing(s -> s.age));
        System.out.println("marks desc, then age: " + list);

        // arrays
        Integer[] boxed = {5, 2, 9, 1};
        Arrays.sort(boxed, Collections.reverseOrder());
        System.out.println(Arrays.toString(boxed));
        String[] words = {"banana", "fig", "apple", "kiwi"};
        Arrays.sort(words, Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));
        System.out.println(Arrays.toString(words));

        // a comparator written the long way: negative, zero, positive
        Comparator<int[]> byFirstThenSecond = (x, y) -> x[0] != y[0] ? Integer.compare(x[0], y[0]) : Integer.compare(x[1], y[1]);
        int[][] pairs = {{2, 5}, {1, 9}, {2, 1}};
        Arrays.sort(pairs, byFirstThenSecond);
        System.out.println(Arrays.deepToString(pairs));
    }
}
