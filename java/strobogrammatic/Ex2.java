import java.util.Scanner;

public class Ex2 {
    // Count of n-digit strobogrammatic numbers (n >= 1, no leading zero; the single digit 0 counts for n = 1).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long count;
        if (n == 1) {
            count = 3;                              // 0, 1, 8
        } else {
            count = 4;                              // outer pair: 11, 69, 88, 96
            for (int i = 1; i < n / 2; i++) count *= 5;   // each inner pair: 00, 11, 69, 88, 96
            if (n % 2 == 1) count *= 3;             // middle digit: 0, 1, 8
        }
        System.out.println(count);
    }
}
