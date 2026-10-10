import java.util.Scanner;

public class Ex1 {
    // Print x in n-bit two's complement (works for negative x too).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int n = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int bit = n - 1; bit >= 0; bit--) {
            sb.append((x >> bit) & 1);      // >> on a negative int keeps the sign, so high bits come out as 1s
        }
        System.out.println(sb);
    }
}
