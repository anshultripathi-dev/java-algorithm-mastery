import java.util.Scanner;

public class Ex3 {
    // Reverse the 32 bits of an unsigned 32-bit integer.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long input = sc.nextLong();
        int x = (int) input;
        int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (x & 1);
            x >>>= 1;
        }
        System.out.println(result & 0xFFFFFFFFL);
    }
}
