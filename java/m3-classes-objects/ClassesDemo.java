public class ClassesDemo {
    // A CLASS is a blueprint; an OBJECT is one thing built from it.
    static class Student {
        // fields: the data each object carries
        String name;
        int marks;

        // constructor: runs when you write `new Student(...)`; same name as the class, no return type
        Student(String name, int marks) {
            this.name = name;      // `this` is the object being built; it separates the field from the parameter
            this.marks = marks;
        }

        // second constructor (overloading), delegating to the first with this(...)
        Student(String name) {
            this(name, 0);
        }

        // a method: behaviour that works on the object's own fields
        boolean passed() {
            return marks >= 40;
        }

        @Override
        public String toString() {
            return name + " (" + marks + ")";
        }
    }

    public static void main(String[] args) {
        Student asha = new Student("Asha", 82);        // an object on the heap
        Student ravi = new Student("Ravi");
        ravi.marks = 35;
        System.out.println(asha + " passed? " + asha.passed());
        System.out.println(ravi + " passed? " + ravi.passed());

        Student alias = asha;                           // another name for the SAME object
        alias.marks = 90;
        System.out.println(asha);

        Student[] roll = {asha, ravi, new Student("Mei", 71)};
        int total = 0;
        for (Student s : roll) {
            total += s.marks;
        }
        System.out.println("average = " + total / roll.length);
    }
}
