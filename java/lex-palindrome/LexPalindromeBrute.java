import java.util.Arrays;
import java.util.Scanner;

public class LexPalindromeBrute {
    // Sorted string, then walk through successive permutations until one reads the same backwards.
    // Correct but factorial time: only usable for very short strings.
    static boolean nextPermutation(char[] a) {
        int i = a.length - 2;
        while (i >= 0 && a[i] >= a[i + 1]) i--;
        if (i < 0) return false;
        int j = a.length - 1;
        while (a[j] <= a[i]) j--;
        char t = a[i]; a[i] = a[j]; a[j] = t;
        for (int l = i + 1, r = a.length - 1; l < r; l++, r--) {
            t = a[l]; a[l] = a[r]; a[r] = t;
        }
        return true;
    }

    static boolean isPalindrome(char[] a) {
        for (int l = 0, r = a.length - 1; l < r; l++, r--) {
            if (a[l] != a[r]) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[] a = sc.next().toLowerCase().toCharArray();
        Arrays.sort(a);
        do {
            if (isPalindrome(a)) {
                System.out.println(new String(a));
                return;
            }
        } while (nextPermutation(a));
        System.out.println("no palindromic string");
    }
}
