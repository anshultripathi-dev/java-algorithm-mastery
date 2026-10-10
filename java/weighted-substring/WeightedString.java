import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class WeightedString {
    // weight(A) = 1, weight(B) = 2*A + A, weight(C) = 3*B + B, ...   i.e. weight(letter n) = (n + 1) * weight(letter n - 1)
    static long[] buildWeights(long limit) {
        List<Long> w = new ArrayList<>();
        long cur = 1;                                  // weight of 'A'
        w.add(cur);
        for (int n = 2; n <= 26; n++) {
            long next = cur * (n + 1);                 // (n+1) * previous weight, from "n*prev + prev"
            if (next > limit || next / (n + 1) != cur) break;   // stop before exceeding the limit / overflowing
            w.add(next);
            cur = next;
        }
        long[] arr = new long[w.size()];
        for (int i = 0; i < arr.length; i++) arr[i] = w.get(i);
        return arr;
    }

    // Shortest string with the given weight, lexicographically smallest among those of that length.
    static String smallestString(long weight) {
        long[] w = buildWeights(weight);
        List<Character> letters = new ArrayList<>();
        long remaining = weight;
        for (int i = w.length - 1; i >= 0; i--) {      // greedy: take the biggest letters first
            while (remaining >= w[i]) {
                letters.add((char) ('A' + i));
                remaining -= w[i];
            }
        }
        Collections.sort(letters);                      // smallest letters first = lexicographically smallest
        StringBuilder sb = new StringBuilder();
        for (char c : letters) sb.append(c);
        return sb.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long weight = sc.nextLong();
        System.out.println(smallestString(weight));
    }
}
