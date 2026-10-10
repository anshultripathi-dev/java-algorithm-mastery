import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex2 {
    // Sort version numbers such as 1.2.10 and 1.10 numerically, field by field.
    static int cmp(String a, String b) {
        String[] x = a.split("\\.");
        String[] y = b.split("\\.");
        for (int i = 0; i < Math.max(x.length, y.length); i++) {
            long p = i < x.length ? Long.parseLong(x[i]) : 0;
            long q = i < y.length ? Long.parseLong(y[i]) : 0;
            if (p != q) return Long.compare(p, q);
        }
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<String> v = new ArrayList<>();
        for (int i = 0; i < n; i++) v.add(sc.next());
        v.sort(Ex2::cmp);
        System.out.println(String.join(" ", v));
    }
}
