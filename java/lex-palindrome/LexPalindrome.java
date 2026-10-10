import java.util.Scanner;
import java.util.TreeMap;

public class LexPalindrome {
    // A string can be rearranged into a palindrome iff at most one character has an odd count
    // (and exactly one when the length is odd). The smallest palindrome puts the smallest letters
    // on the outside: front half in increasing order, middle = the odd character, back half mirrored.
    static String firstPalindrome(String input) {
        TreeMap<Character, Integer> freq = new TreeMap<>();    // TreeMap keeps characters sorted
        for (char c : input.toLowerCase().toCharArray()) {
            freq.merge(c, 1, Integer::sum);
        }

        String middle = "";
        int oddCount = 0;
        for (var e : freq.entrySet()) {
            if (e.getValue() % 2 == 1) {
                oddCount++;
                middle = String.valueOf(e.getKey());
            }
        }
        if (oddCount > 1) {
            return "no palindromic string";
        }

        StringBuilder front = new StringBuilder();
        for (var e : freq.entrySet()) {
            front.append(String.valueOf(e.getKey()).repeat(e.getValue() / 2));   // half of each count
        }
        String back = new StringBuilder(front).reverse().toString();
        return front + middle + back;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(firstPalindrome(sc.next()));
    }
}
