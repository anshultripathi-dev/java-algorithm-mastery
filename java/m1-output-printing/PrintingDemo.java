public class PrintingDemo {
    public static void main(String[] args) {
        // print vs println vs printf
        System.out.print("1. print ");
        System.out.print("2. print");
        System.out.println();                       // just a newline
        System.out.println("3. println");
        System.out.printf("4. printf: %d items cost %.2f each, name=%s%n", 3, 4.5, "pen");

        // the + operator: numbers ADD until a String appears, then it JOINS
        int a = 3, b = 4;
        System.out.println(a + b);                  // 7
        System.out.println("3" + "4");              // 34
        System.out.println("" + a + b);             // 34
        System.out.println(3 + 4 + a + " " + b + a);// 10 43
        System.out.println("Result: " + a + b);     // Result: 34
        System.out.println("Result: " + (a + b));   // Result: 7

        // char prints as a character, not its number
        char x = 65;
        char y = 'A';
        System.out.println(x);                      // A
        System.out.println((int) x);                // 65
        System.out.println(y + 1);                  // 66 (char + int is an int)
        System.out.println((char) (y + 1));         // B

        // formatting
        System.out.printf("[%5d] [%-5d] [%05d]%n", 42, 42, 42);
        System.out.printf("[%8.3f] [%.0f] [%,d]%n", Math.PI, 2.5, 1234567);
        System.out.printf("%s is %d years old%n", "Asha", 20);
        System.out.println(String.format("%x %o %c %b", 255, 8, 'z', true));
    }
}
