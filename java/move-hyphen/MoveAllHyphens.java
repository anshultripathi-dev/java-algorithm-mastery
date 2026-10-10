import java.util.Scanner;

public class MoveAllHyphens {
    // Move EVERY hyphen to the front; the other characters keep their original order.
    static String moveAll(String s) {
        StringBuilder hyphens = new StringBuilder();
        StringBuilder others = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '-') {
                hyphens.append(c);
            } else {
                others.append(c);
            }
        }
        return hyphens.append(others).toString();
    }

    // The same result in ONE array, scanning from the right, no second builder.
    static String moveAllInPlace(String s) {
        char[] a = s.toCharArray();
        int write = a.length - 1;                   // next free slot from the right
        for (int read = a.length - 1; read >= 0; read--) {
            if (a[read] != '-') {
                a[write--] = a[read];               // push non-hyphens to the right end
            }
        }
        while (write >= 0) {
            a[write--] = '-';                       // fill the rest with hyphens
        }
        return new String(a);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(moveAll(s));
        System.out.println(moveAllInPlace(s));
    }
}
