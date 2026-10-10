import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int rev = 0, rest = x;
        while (rest > 0) {
            rev = (rev << 1) | (rest & 1);
            rest >>= 1;
        }
        System.out.println(rev == x ? "YES" : "NO");
    }
}
