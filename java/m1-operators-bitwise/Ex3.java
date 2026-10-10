import java.util.Scanner;

public class Ex3 {
    // Read n, i and an operation (set / clear / toggle). Print the result.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int i = sc.nextInt();
        String op = sc.next();
        int mask = 1 << i;
        int result;
        if (op.equals("set")) result = n | mask;
        else if (op.equals("clear")) result = n & ~mask;
        else result = n ^ mask;
        System.out.println(result);
    }
}
