import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

public class NaturalSort {
    // Split a name into alternating chunks of digits and non-digits:  "file10.txt" -> "file", "10", ".txt".
    static List<String> chunks(String s) {
        List<String> out = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            boolean digit = Character.isDigit(s.charAt(i));
            while (j < s.length() && Character.isDigit(s.charAt(j)) == digit) {
                j++;
            }
            out.add(s.substring(i, j));
            i = j;
        }
        return out;
    }

    // Compare chunk by chunk. Two number chunks are compared as numbers; anything else as text.
    static final Comparator<String> NATURAL = (a, b) -> {
        List<String> x = chunks(a);
        List<String> y = chunks(b);
        for (int i = 0; i < Math.min(x.size(), y.size()); i++) {
            String p = x.get(i);
            String q = y.get(i);
            int cmp;
            if (Character.isDigit(p.charAt(0)) && Character.isDigit(q.charAt(0))) {
                cmp = new BigInteger(p).compareTo(new BigInteger(q));     // numeric value, any length
            } else {
                cmp = p.compareToIgnoreCase(q);
            }
            if (cmp != 0) {
                return cmp;
            }
        }
        return Integer.compare(x.size(), y.size());                       // shorter list of chunks first
    };

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> names = new ArrayList<>();
        while (sc.hasNext()) {
            names.add(sc.next());
        }
        List<String> lexicographic = new ArrayList<>(names);
        Collections.sort(lexicographic);
        names.sort(NATURAL);
        System.out.println("plain sort  : " + lexicographic);
        System.out.println("natural sort: " + names);
    }
}
