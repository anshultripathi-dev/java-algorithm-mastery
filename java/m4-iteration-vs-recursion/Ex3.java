import java.util.Scanner;

public class Ex3 {
    // Binary-search count of steps both ways would be the same; here: convert the recursive
    // "reverse a string" into a loop and print both results.
    static String revRec(String s) {
        return s.isEmpty() ? "" : revRec(s.substring(1)) + s.charAt(0);
    }

    static String revLoop(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = s.length() - 1; i >= 0; i--) sb.append(s.charAt(i));
        return sb.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(revRec(s) + " " + revLoop(s));
    }
}
