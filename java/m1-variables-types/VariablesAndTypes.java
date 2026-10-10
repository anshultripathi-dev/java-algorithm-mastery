public class VariablesAndTypes {
    public static void main(String[] args) {
        // A variable = a named box that holds ONE value of ONE declared type.
        byte tiny = 100;                 // 8-bit   -128 .. 127
        short small = 30_000;            // 16-bit
        int count = 2_000_000_000;       // 32-bit  about +-2.1 billion  (the default for whole numbers)
        long big = 9_000_000_000L;       // 64-bit  needs the L suffix
        float f = 3.14f;                 // 32-bit decimal, needs the f suffix
        double d = 2.718281828;          // 64-bit decimal (the default for decimals)
        char letter = 'J';               // one UTF-16 character, single quotes
        boolean ready = true;            // true or false
        String text = "Java";            // a reference type: a sequence of characters

        final double PI = 3.14159;       // final = constant: cannot be reassigned; UPPER_SNAKE_CASE

        System.out.println(tiny + " " + small + " " + count + " " + big);
        System.out.println(f + " " + d + " " + letter + " " + ready + " " + text);
        System.out.println("PI = " + PI);
        System.out.println("int range: " + Integer.MIN_VALUE + " .. " + Integer.MAX_VALUE);
        System.out.println("long max : " + Long.MAX_VALUE);
        System.out.println("char 'J' has code " + (int) letter);
    }
}
