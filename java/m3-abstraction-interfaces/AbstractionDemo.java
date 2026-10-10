import java.util.ArrayList;
import java.util.List;

public class AbstractionDemo {
    // An INTERFACE is a contract: what a type can do, with no state.
    interface Payable {
        double amountDue();

        default String describe() {                  // default method (Java 8+)
            return "pay " + String.format("%.2f", amountDue());
        }
    }

    // An ABSTRACT CLASS is a partly finished class: shared state and code, plus abstract holes to fill in.
    static abstract class Employee implements Payable {
        protected final String name;

        Employee(String name) {
            this.name = name;
        }

        abstract double monthlyPay();                // must be implemented by subclasses

        @Override
        public double amountDue() {
            return monthlyPay();
        }
    }

    static class Salaried extends Employee {
        private final double yearly;

        Salaried(String name, double yearly) {
            super(name);
            this.yearly = yearly;
        }

        @Override
        double monthlyPay() {
            return yearly / 12;
        }
    }

    static class Hourly extends Employee {
        private final double rate;
        private final int hours;

        Hourly(String name, double rate, int hours) {
            super(name);
            this.rate = rate;
            this.hours = hours;
        }

        @Override
        double monthlyPay() {
            return rate * hours;
        }
    }

    static class Invoice implements Payable {         // unrelated to Employee, still Payable
        private final double total;

        Invoice(double total) {
            this.total = total;
        }

        @Override
        public double amountDue() {
            return total;
        }
    }

    public static void main(String[] args) {
        List<Payable> bills = new ArrayList<>();
        bills.add(new Salaried("Asha", 120_000));
        bills.add(new Hourly("Ravi", 25.0, 80));
        bills.add(new Invoice(499.99));
        double sum = 0;
        for (Payable p : bills) {
            System.out.println(p.describe());
            sum += p.amountDue();
        }
        System.out.printf("total due: %.2f%n", sum);
        // new Employee("x");   // would NOT compile: abstract classes cannot be instantiated
    }
}
