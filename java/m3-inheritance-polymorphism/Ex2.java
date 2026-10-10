import java.util.Scanner;

public class Ex2 {
    static class Employee {
        final String name;
        final double base;

        Employee(String name, double base) {
            this.name = name;
            this.base = base;
        }

        double pay() { return base; }
    }

    static class Manager extends Employee {
        Manager(String name, double base) { super(name, base); }

        @Override double pay() { return base * 1.5; }    // 50% bonus
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        double total = 0;
        for (int i = 0; i < n; i++) {
            String role = sc.next();
            String name = sc.next();
            double base = sc.nextDouble();
            Employee e = role.equals("manager") ? new Manager(name, base) : new Employee(name, base);
            total += e.pay();
        }
        System.out.printf("%.2f%n", total);
    }
}
