import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int count = sc.nextInt();            // reads one token and converts it
        double price = sc.nextDouble();
        String word = sc.next();             // one word (stops at whitespace)
        sc.nextLine();                       // consume the rest of the current line (the newline!)
        String sentence = sc.nextLine();     // the whole next line
        System.out.println("count=" + count + " price=" + price + " word=" + word);
        System.out.println("sentence=[" + sentence + "]");

        // read until the input ends
        int total = 0;
        while (sc.hasNextInt()) {
            total += sc.nextInt();
        }
        System.out.println("sum of the rest = " + total);
    }
}
