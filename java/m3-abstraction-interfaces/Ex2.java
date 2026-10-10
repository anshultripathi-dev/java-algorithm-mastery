import java.util.Scanner;

public class Ex2 {
    static abstract class Vehicle {
        abstract int wheels();

        String describe() {
            return getClass().getSimpleName() + " has " + wheels() + " wheels";
        }
    }

    static class Bike extends Vehicle { int wheels() { return 2; } }
    static class Car extends Vehicle { int wheels() { return 4; } }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Vehicle v = sc.next().equals("bike") ? new Bike() : new Car();
        System.out.println(v.describe());
    }
}
