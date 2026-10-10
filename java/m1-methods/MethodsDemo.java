public class MethodsDemo {
    // A method: name, parameters (inputs), return type (output), body.
    static int square(int x) {
        return x * x;
    }

    // Method OVERLOADING: same name, different parameter lists.
    static int max(int a, int b) {
        return a > b ? a : b;
    }

    static double max(double a, double b) {
        return a > b ? a : b;
    }

    static int max(int a, int b, int c) {
        return max(max(a, b), c);
    }

    // A void method returns nothing; it performs an action.
    static void greet(String name) {
        System.out.println("Hello, " + name);
    }

    // Java passes arguments BY VALUE: the method gets a copy of the int.
    static void tryToChange(int n) {
        n = 999;
    }

    // Scope: a variable exists only inside the block where it is declared.
    static int sumTo(int n) {
        int total = 0;                   // local to this method
        for (int i = 1; i <= n; i++) {   // i exists only inside the loop
            total += i;
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(square(7));
        System.out.println(max(3, 9));
        System.out.println(max(2.5, 1.5));
        System.out.println(max(4, 8, 6));
        greet("Asha");
        int value = 5;
        tryToChange(value);
        System.out.println("value is still " + value);
        System.out.println(sumTo(100));
    }
}
