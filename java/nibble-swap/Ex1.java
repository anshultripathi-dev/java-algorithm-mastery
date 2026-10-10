import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt() & 0xFF;
        System.out.println(((x & 0xF0) >>> 4) | ((x & 0x0F) << 4));
    }
}
