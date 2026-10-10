import java.util.Scanner;

public class Ex3 {
    static long inside(long r) {
        return 2 * r * (r + 1) * (2 * r + 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long need = sc.nextLong();
        long lo = 1, hi = 200_000;
        while (lo < hi) {
            long mid = (lo + hi) / 2;
            if (inside(mid) >= need) hi = mid;
            else lo = mid + 1;
        }
        System.out.println(8 * lo);
    }
}
