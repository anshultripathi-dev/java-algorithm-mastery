import java.util.Scanner;

public class BinaryPalindromeBits {
    // Build the bit-reversal of x with shifts and compare with x. O(log x) time, O(1) space, no String.
    static boolean isBinaryPalindrome(int x) {
        int reversed = 0;
        int rest = x;
        while (rest > 0) {
            reversed <<= 1;           // make room on the right
            reversed |= (rest & 1);   // copy the lowest bit of rest into the new lowest bit
            rest >>= 1;               // drop the bit we just used
        }
        return reversed == x;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        System.out.println(x + (isBinaryPalindrome(x) ? " has a binary palindrome representation." : " does not have a binary palindrome representation."));
    }
}
