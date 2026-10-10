import java.util.Scanner;

public class Ex3 {
    static boolean pal(long x) {
        long rev = 0, rest = x;
        while (rest > 0) {
            rev = (rev << 1) | (rest & 1);
            rest >>= 1;
        }
        return rev == x;
    }

    // Smallest binary palindrome strictly greater than n.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long x = n + 1;
        while (!pal(x)) x++;
        System.out.println(x);
    }
}
