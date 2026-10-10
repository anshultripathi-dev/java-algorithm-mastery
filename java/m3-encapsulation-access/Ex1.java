import java.util.Scanner;

public class Ex1 {
    static class Temperature {
        private double celsius;

        void setCelsius(double c) {
            if (c < -273.15) throw new IllegalArgumentException("below absolute zero");
            celsius = c;
        }

        double getCelsius() { return celsius; }
        double getFahrenheit() { return celsius * 9 / 5 + 32; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Temperature t = new Temperature();
        try {
            t.setCelsius(sc.nextDouble());
            System.out.printf("%.1f%n", t.getFahrenheit());
        } catch (IllegalArgumentException e) {
            System.out.println("invalid: " + e.getMessage());
        }
    }
}
