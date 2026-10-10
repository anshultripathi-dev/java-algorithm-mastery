import java.util.Arrays;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class SwapBasedPermutations {
    // The lecture's approach (sort the input, then generate by swapping, skipping repeated letters).
    // It produces every DISTINCT permutation exactly once, but NOT in sorted order.
    static StringBuilder out = new StringBuilder();

    static void permute(char[] chars, int index) {
        if (index == chars.length - 1) {
            out.append(String.valueOf(chars)).append(' ');
            return;
        }
        Set<Character> used = new HashSet<>();
        for (int i = index; i < chars.length; i++) {
            if (used.contains(chars[i])) {
                continue;
            }
            used.add(chars[i]);
            swap(chars, index, i);
            permute(chars, index + 1);
            swap(chars, index, i);
        }
    }

    static void swap(char[] a, int i, int j) {
        char t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[] chars = sc.next().toCharArray();
        Arrays.sort(chars);
        permute(chars, 0);
        System.out.println(out.toString().trim());
    }
}
