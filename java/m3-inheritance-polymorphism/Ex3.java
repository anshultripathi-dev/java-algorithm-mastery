public class Ex3 {
    // Predict the output: constructors run parent-first; the overridden method is chosen by the OBJECT's type.
    static class A {
        A() { System.out.println("A()"); }
        String who() { return "A"; }
    }

    static class B extends A {
        B() { System.out.println("B()"); }
        @Override String who() { return "B"; }
    }

    public static void main(String[] args) {
        A x = new B();
        System.out.println(x.who());
    }
}
