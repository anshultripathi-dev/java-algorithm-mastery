public class LogicalOperators {
    static boolean noisy(String name, boolean value) {
        System.out.println("  evaluating " + name);
        return value;
    }

    public static void main(String[] args) {
        int age = 20;
        boolean hasTicket = true;

        // relational operators produce a boolean
        System.out.println(age >= 18);          // true
        System.out.println(age == 20);          // true
        System.out.println(age != 20);          // false

        // logical operators combine booleans
        System.out.println(age >= 18 && hasTicket);   // AND
        System.out.println(age < 13 || age > 65);     // OR
        System.out.println(!hasTicket);               // NOT

        // short-circuit: the right side is skipped when the answer is already known
        System.out.println("false && ...:");
        boolean r1 = noisy("left", false) && noisy("right", true);
        System.out.println("true || ...:");
        boolean r2 = noisy("left", true) || noisy("right", false);

        // ternary operator: condition ? valueIfTrue : valueIfFalse
        int a = 7, b = 12;
        int larger = (a > b) ? a : b;
        String kind = (a % 2 == 0) ? "even" : "odd";
        System.out.println("larger = " + larger + ", a is " + kind);

        // precedence: && binds tighter than ||
        System.out.println(true || false && false);     // true  (&& first)
        System.out.println((true || false) && false);   // false
    }
}
