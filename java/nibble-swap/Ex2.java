import java.util.Scanner;

public class Ex2 {
    // Swap every pair of adjacent bits (bit0<->bit1, bit2<->bit3, ...) of a 32-bit value; print as unsigned.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long input = sc.nextLong();
        int x = (int) input;
        int even = x & 0x55555555;      // bits 0, 2, 4, ...
        int odd = x & 0xAAAAAAAA;       // bits 1, 3, 5, ...
        int swapped = (even << 1) | (odd >>> 1);
        System.out.println(swapped & 0xFFFFFFFFL);
    }
}
