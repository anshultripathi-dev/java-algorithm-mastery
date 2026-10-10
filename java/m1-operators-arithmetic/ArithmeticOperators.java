public class ArithmeticOperators {
    public static void main(String[] args) {
        int a = 17, b = 5;
        System.out.println("a + b = " + (a + b));
        System.out.println("a - b = " + (a - b));
        System.out.println("a * b = " + (a * b));
        System.out.println("a / b = " + (a / b) + "   (integer division)");
        System.out.println("a % b = " + (a % b) + "   (remainder)");
        System.out.println("-17 % 5 = " + (-17 % 5) + "   (sign follows the left operand)");

        // increment / decrement
        int x = 5;
        int y = x++;     // y gets the OLD value (5), then x becomes 6
        int z = ++x;     // x becomes 7 first, then z gets 7
        System.out.println("x=" + x + " y=" + y + " z=" + z);

        // compound assignment
        int n = 10;
        n += 5;          // n = n + 5
        n *= 2;          // n = n * 2
        n %= 7;          // n = n % 7
        System.out.println("n = " + n);

        // two classic uses of / and %
        int number = 4821;
        System.out.println("last digit : " + number % 10);
        System.out.println("without it : " + number / 10);
    }
}
