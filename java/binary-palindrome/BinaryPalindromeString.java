import java.util.Scanner;

public class BinaryPalindromeString {
    // Convert to a binary String and compare characters from both ends.
    static boolean isBinaryPalindrome(int x) {
        String bits = Integer.toBinaryString(x);   // no leading zeros, e.g. 17 -> "10001"
        int left = 0;
        int right = bits.length() - 1;
        while (left < right) {
            if (bits.charAt(left) != bits.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        System.out.println(x + " (" + Integer.toBinaryString(x) + ") " + (isBinaryPalindrome(x) ? "is" : "is not") + " a binary palindrome");
    }
}
