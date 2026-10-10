import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long need = sc.nextLong();
        long r = 0, sum = 0;
        while (sum < need) {
            r++;
            sum += 12 * r * r;
        }
        System.out.println(8 * r);
    }
}
