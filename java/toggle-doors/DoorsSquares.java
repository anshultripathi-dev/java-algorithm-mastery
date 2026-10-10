import java.util.Scanner;

public class DoorsSquares {
    // A door is toggled once for every divisor of its number. Divisors come in pairs (d, n/d), so the
    // count is odd only when d == n/d, i.e. the number is a perfect square. Open doors = perfect squares.
    static long isqrt(long n) {
        long r = (long) Math.sqrt((double) n);
        while (r * r > n) r--;
        while ((r + 1) * (r + 1) <= n) r++;
        return r;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        System.out.println("open doors: " + isqrt(n));
    }
}
