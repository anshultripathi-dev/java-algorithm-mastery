import java.util.Scanner;

public class Ex2 {
    // Shift an uppercase letter forward by k positions, wrapping Z -> A.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char c = sc.next().charAt(0);
        int k = sc.nextInt();
        char shifted = (char) ('A' + (c - 'A' + k) % 26);
        System.out.println(shifted);
    }
}
