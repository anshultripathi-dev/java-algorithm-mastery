import java.util.Arrays;
import java.util.Scanner;

public class NextPermutation {
    // Rearrange a into the next lexicographically larger permutation; return false if a is the largest.
    static boolean next(char[] a) {
        int i = a.length - 2;
        while (i >= 0 && a[i] >= a[i + 1]) {
            i--;                                  // 1. find the rightmost position that can still grow
        }
        if (i < 0) {
            return false;
        }
        int j = a.length - 1;
        while (a[j] <= a[i]) {
            j--;                                  // 2. smallest value to its right that is bigger
        }
        char t = a[i];
        a[i] = a[j];
        a[j] = t;                                 // 3. swap them
        for (int l = i + 1, r = a.length - 1; l < r; l++, r--) {
            t = a[l];
            a[l] = a[r];
            a[r] = t;                             // 4. the tail was decreasing: reverse it to make it smallest
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[] a = sc.next().toCharArray();
        Arrays.sort(a);                           // start from the smallest arrangement
        StringBuilder sb = new StringBuilder();
        do {
            sb.append(new String(a)).append(' ');
        } while (next(a));
        System.out.println(sb.toString().trim());
    }
}
