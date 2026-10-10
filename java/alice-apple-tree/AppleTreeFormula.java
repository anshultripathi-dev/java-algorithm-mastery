import java.util.Scanner;

public class AppleTreeFormula {
    // Apples inside the square of half-side r:  2 r (r + 1) (2 r + 1)   (= 4r^3 + 6r^2 + 2r)
    static long applesInside(long r) {
        return 2 * r * (r + 1) * (2 * r + 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long needed = sc.nextLong();
        long lo = 1;
        long hi = 200_000;                    // 2 * 200000 * 200001 * 400001 > 3 * 10^16, enough for needed <= 10^15
        while (lo < hi) {                     // smallest r with applesInside(r) >= needed
            long mid = (lo + hi) / 2;
            if (applesInside(mid) >= needed) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        System.out.println(8 * lo);
    }
}
