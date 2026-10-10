import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class StrobogrammaticGenerate {
    // All strobogrammatic numbers with exactly n digits (no leading zero except the single digit "0").
    // Build from the middle outward: wrap every (n-2)-digit answer with a matching pair.
    static List<String> build(int n, int total) {
        if (n == 0) {
            return new ArrayList<>(List.of(""));
        }
        if (n == 1) {
            return new ArrayList<>(List.of("0", "1", "8"));
        }
        List<String> result = new ArrayList<>();
        for (String inner : build(n - 2, total)) {
            if (n != total) {
                result.add("0" + inner + "0");     // zeros are fine on the inside, never on the outside
            }
            result.add("1" + inner + "1");
            result.add("6" + inner + "9");
            result.add("8" + inner + "8");
            result.add("9" + inner + "6");
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<String> all = build(n, n);
        System.out.println(all.size() + " numbers: " + all);
    }
}
