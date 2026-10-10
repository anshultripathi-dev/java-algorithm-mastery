import java.util.Scanner;

public class ValidationDemo {
    // Parse a token into an int; return empty on any bad input instead of crashing.
    static java.util.OptionalInt parse(String s) {
        try {
            return java.util.OptionalInt.of(Integer.parseInt(s.trim()));
        } catch (NumberFormatException e) {
            return java.util.OptionalInt.empty();
        }
    }

    static String average(int[] a) {
        if (a == null || a.length == 0) {
            return "no data";                // an empty array would divide by zero
        }
        long sum = 0;                        // long: the sum of many ints can overflow int
        for (int x : a) sum += x;
        return String.valueOf((double) sum / a.length);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String line = sc.nextLine();
            System.out.println("\"" + line + "\" -> " + (parse(line).isPresent() ? "number " + parse(line).getAsInt() : "invalid"));
        }
        System.out.println(average(new int[] {}));
        System.out.println(average(new int[] {Integer.MAX_VALUE, Integer.MAX_VALUE}));

        // boundary values worth testing: empty, one element, min, max, negative, zero
        int[] a = {5};
        System.out.println("last index of a one-element array: " + (a.length - 1));
        System.out.println("Math.abs(Integer.MIN_VALUE) = " + Math.abs(Integer.MIN_VALUE) + "  (still negative!)");
    }
}
