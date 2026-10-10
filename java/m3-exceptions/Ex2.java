import java.util.Scanner;

public class Ex2 {
    static class NegativeAgeException extends RuntimeException {
        NegativeAgeException(int age) {
            super("age cannot be negative: " + age);
        }
    }

    static void check(int age) {
        if (age < 0) throw new NegativeAgeException(age);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int age = sc.nextInt();
            try {
                check(age);
                System.out.println("ok " + age);
            } catch (NegativeAgeException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
