import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex3 {
    static List<String> chunks(String s) {
        List<String> out = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            boolean d = Character.isDigit(s.charAt(i));
            while (j < s.length() && Character.isDigit(s.charAt(j)) == d) j++;
            out.add(s.substring(i, j));
            i = j;
        }
        return out;
    }

    // Natural order, ignoring case. When two names are equal numerically (file01 vs file1),
    // the one with FEWER leading zeros (the shorter text) comes first, then plain compareTo.
    static int cmp(String a, String b) {
        List<String> x = chunks(a), y = chunks(b);
        for (int i = 0; i < Math.min(x.size(), y.size()); i++) {
            String p = x.get(i), q = y.get(i);
            int c = (Character.isDigit(p.charAt(0)) && Character.isDigit(q.charAt(0))) ? new BigInteger(p).compareTo(new BigInteger(q)) : p.compareToIgnoreCase(q);
            if (c != 0) return c;
        }
        if (x.size() != y.size()) return Integer.compare(x.size(), y.size());
        if (a.length() != b.length()) return Integer.compare(a.length(), b.length());
        return a.compareTo(b);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<String> names = new ArrayList<>();
        for (int i = 0; i < n; i++) names.add(sc.next());
        names.sort(Ex3::cmp);
        System.out.println(String.join(" ", names));
    }
}
