public class Ex2 {
    // An immutable "with" method: returns a NEW object instead of changing this one.
    static final class Money {
        private final long cents;

        Money(long cents) { this.cents = cents; }

        Money plus(Money other) { return new Money(cents + other.cents); }

        long cents() { return cents; }
    }

    public static void main(String[] args) {
        Money a = new Money(250);
        Money b = a.plus(new Money(175));
        System.out.println(a.cents() + " " + b.cents());
    }
}
