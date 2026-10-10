import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex3 {
    static List<String> build(int n, int total) {
        if (n == 0) return new ArrayList<>(List.of(""));
        if (n == 1) return new ArrayList<>(List.of("0", "1", "8"));
        List<String> res = new ArrayList<>();
        for (String inner : build(n - 2, total)) {
            if (n != total) res.add("0" + inner + "0");
            res.add("1" + inner + "1");
            res.add("6" + inner + "9");
            res.add("8" + inner + "8");
            res.add("9" + inner + "6");
        }
        return res;
    }

    // Count strobogrammatic numbers in [low, high] given as strings of up to 15 digits.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String low = sc.next();
        String high = sc.next();
        int count = 0;
        for (int len = low.length(); len <= high.length(); len++) {
            for (String s : build(len, len)) {
                if (len == low.length() && s.compareTo(low) < 0) continue;     // same length: string order = numeric order
                if (len == high.length() && s.compareTo(high) > 0) continue;
                count++;
            }
        }
        System.out.println(count);
    }
}
