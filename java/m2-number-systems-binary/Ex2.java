import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int base = sc.nextInt();
        long value = 0;
        for (char c : s.toCharArray()) value = value * base + Character.digit(c, base);
        System.out.println(value);
    }
}
