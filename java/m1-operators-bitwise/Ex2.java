import java.util.Scanner;

public class Ex2 {
    // Count the 1 bits (population count) with the "clear lowest set bit" trick.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int count = 0;
        while (n != 0) {
            n &= n - 1;
            count++;
        }
        System.out.println(count);
    }
}
