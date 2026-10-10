import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex1 {
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

    static int cmp(String a, String b) {
        List<String> x = chunks(a), y = chunks(b);
        for (int i = 0; i < Math.min(x.size(), y.size()); i++) {
            String p = x.get(i), q = y.get(i);
            int c = (Character.isDigit(p.charAt(0)) && Character.isDigit(q.charAt(0))) ? new BigInteger(p).compareTo(new BigInteger(q)) : p.compareToIgnoreCase(q);
            if (c != 0) return c;
        }
        return Integer.compare(x.size(), y.size());
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<String> names = new ArrayList<>();
        for (int i = 0; i < n; i++) names.add(sc.next());
        names.sort(Ex1::cmp);
        for (String s : names) System.out.println(s);
    }
}
