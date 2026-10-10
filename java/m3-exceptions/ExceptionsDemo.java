import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class ExceptionsDemo {
    // A CUSTOM checked exception
    static class InsufficientFundsException extends Exception {
        InsufficientFundsException(String message) {
            super(message);
        }
    }

    static void withdraw(int balance, int amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException("need " + (amount - balance) + " more");
        }
        System.out.println("withdrew " + amount);
    }

    static int parseOrDefault(String s, int fallback) {
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return fallback;
        } finally {
            System.out.println("  (finally always runs for \"" + s + "\")");
        }
    }

    public static void main(String[] args) {
        // try / catch / finally
        System.out.println(parseOrDefault("123", -1));
        System.out.println(parseOrDefault("12x", -1));

        // catching several exception types
        int[] data = {10, 0};
        try {
            System.out.println(data[0] / data[1]);
        } catch (ArithmeticException | ArrayIndexOutOfBoundsException e) {
            System.out.println("caught " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }

        // checked exceptions must be handled or declared
        try {
            withdraw(100, 30);
            withdraw(100, 250);
        } catch (InsufficientFundsException e) {
            System.out.println("refused: " + e.getMessage());
        }

        // try-with-resources closes the resource automatically
        try (BufferedReader r = new BufferedReader(new StringReader("line one\nline two"))) {
            System.out.println(r.readLine());
        } catch (IOException e) {
            System.out.println("io problem");
        }

        // unchecked: NullPointerException, IllegalArgumentException ... need no declaration
        try {
            Object o = "text";
            Integer i = (Integer) o;
        } catch (ClassCastException e) {
            System.out.println("ClassCastException caught");
        }
    }
}
