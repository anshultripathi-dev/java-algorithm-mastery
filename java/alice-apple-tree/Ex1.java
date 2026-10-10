import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long r = sc.nextLong();
        System.out.println(2 * r * (r + 1) * (2 * r + 1));
    }
}
