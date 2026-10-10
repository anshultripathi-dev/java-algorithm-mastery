import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long weight = sc.nextLong();
        List<Long> w = new ArrayList<>();
        long cur = 1;
        w.add(cur);
        for (int n = 2; n <= 26; n++) {
            if (cur > weight / (n + 1)) break;
            cur *= (n + 1);
            w.add(cur);
        }
        List<Character> out = new ArrayList<>();
        for (int i = w.size() - 1; i >= 0; i--) {
            while (weight >= w.get(i)) {
                out.add((char) ('A' + i));
                weight -= w.get(i);
            }
        }
        Collections.sort(out);
        StringBuilder sb = new StringBuilder();
        for (char c : out) sb.append(c);
        System.out.println(sb);
    }
}
