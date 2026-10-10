import java.util.Scanner;

public class Ex2 {
    // Count the passes of: while (n > 1) n /= 2;  (the floor of log2 n)
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        int passes = 0;
        while (n > 1) {
            n /= 2;
            passes++;
        }
        System.out.println(passes);
    }
}
