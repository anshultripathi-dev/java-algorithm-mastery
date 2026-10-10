import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        if (m >= 90) System.out.println("A");
        else if (m >= 75) System.out.println("B");
        else if (m >= 50) System.out.println("C");
        else System.out.println("F");
    }
}
