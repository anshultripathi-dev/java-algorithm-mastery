import java.util.Scanner;

public class JosephusPowerOfTwo {
    // Special case k = 2: write n = 2^m + r (largest power of two not above n). Answer = 2r + 1.
    static long josephusK2(long n) {
        long highestPowerOfTwo = Long.highestOneBit(n);
        return 2 * (n - highestPowerOfTwo) + 1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        System.out.println(josephusK2(n));
    }
}
