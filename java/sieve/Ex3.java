import java.util.Scanner;

public class Ex3 {
    public static void main(String[] args) {
        int limit = 1_000_000;
        int[] spf = new int[limit + 1];            // spf[x] = smallest prime factor of x
        for (int i = 2; i <= limit; i++) {
            if (spf[i] == 0) {
                for (int m = i; m <= limit; m += i) {
                    if (spf[m] == 0) {
                        spf[m] = i;
                    }
                }
            }
        }
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        StringBuilder out = new StringBuilder();
        for (int t = 0; t < q; t++) {
            int x = sc.nextInt();
            int original = x;
            StringBuilder line = new StringBuilder();
            while (x > 1) {
                int p = spf[x];
                int e = 0;
                while (x % p == 0) {
                    x /= p;
                    e++;
                }
                if (line.length() > 0) {
                    line.append(" * ");
                }
                line.append(p);
                if (e > 1) {
                    line.append('^').append(e);
                }
            }
            out.append(original).append(" = ").append(original == 1 ? "1" : line).append('\n');
        }
        System.out.print(out);
    }
}
