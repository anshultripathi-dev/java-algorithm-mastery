import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int temp = a;      // temp remembers a before it is overwritten
        a = b;
        b = temp;
        System.out.println(a + " " + b);
    }
}
