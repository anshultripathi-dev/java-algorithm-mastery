import java.util.Scanner;
import java.util.TreeMap;

public class Ex2 {
    // Word frequencies, words printed in alphabetical order.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        TreeMap<String, Integer> freq = new TreeMap<>();
        while (sc.hasNext()) {
            freq.merge(sc.next().toLowerCase(), 1, Integer::sum);
        }
        for (var e : freq.entrySet()) {
            System.out.println(e.getKey() + " " + e.getValue());
        }
    }
}
