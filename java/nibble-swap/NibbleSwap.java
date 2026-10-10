import java.util.Scanner;

public class NibbleSwap {
    // A byte has 8 bits = two 4-bit nibbles. Swap high and low nibble.
    static int swapNibbles(int value) {
        int b = value & 0xFF;               // work on exactly one byte (0..255)
        int upper = (b & 0xF0) >>> 4;       // keep the high 4 bits and move them to the right
        int lower = (b & 0x0F) << 4;        // keep the low 4 bits and move them to the left
        return upper | lower;               // glue them back together
    }

    static String bits(int v) {
        String s = Integer.toBinaryString(v & 0xFF);
        return "0".repeat(8 - s.length()) + s;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int value = sc.nextInt();
        int swapped = swapNibbles(value);
        System.out.println("original: " + value + " = " + bits(value));
        System.out.println("swapped : " + swapped + " = " + bits(swapped));
    }
}
