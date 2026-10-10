import java.util.Scanner;

public class Ex2 {
    static boolean pal(int x) {
        int rev = 0, rest = x;
        while (rest > 0) {
            rev = (rev << 1) | (rest & 1);
            rest >>= 1;
        }
        return rev == x;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int count = 0;
        for (int i = 1; i <= n; i++) if (pal(i)) count++;
        System.out.println(count);
    }
}
