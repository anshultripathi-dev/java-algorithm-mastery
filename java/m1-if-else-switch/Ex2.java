import java.util.Scanner;

public class Ex2 {
    // A small calculator: "<a> <op> <b>" with op one of + - * /
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        char op = sc.next().charAt(0);
        int b = sc.nextInt();
        switch (op) {
            case '+': System.out.println(a + b); break;
            case '-': System.out.println(a - b); break;
            case '*': System.out.println(a * b); break;
            case '/':
                if (b == 0) System.out.println("error");
                else System.out.println(a / b);
                break;
            default: System.out.println("unknown operator");
        }
    }
}
