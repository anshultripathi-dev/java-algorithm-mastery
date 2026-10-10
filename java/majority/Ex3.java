import java.util.Scanner;

public class Ex3 {
    // Elements appearing more than n/3 times: at most TWO of them exist, so keep two candidates.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int c1 = 0, c2 = 1, n1 = 0, n2 = 0;
        for (int x : a) {
            if (x == c1) n1++;
            else if (x == c2) n2++;
            else if (n1 == 0) { c1 = x; n1 = 1; }
            else if (n2 == 0) { c2 = x; n2 = 1; }
            else { n1--; n2--; }
        }
        int o1 = 0, o2 = 0;
        for (int x : a) {
            if (x == c1) o1++;
            else if (x == c2) o2++;
        }
        StringBuilder sb = new StringBuilder();
        if (o1 > n / 3) sb.append(c1);
        if (o2 > n / 3) sb.append(sb.length() == 0 ? "" : " ").append(c2);
        if (sb.length() > 0 && o1 > n / 3 && o2 > n / 3 && c1 > c2) {
            sb = new StringBuilder().append(c2).append(' ').append(c1);   // print in increasing order
        }
        System.out.println(sb.length() == 0 ? "None" : sb);
    }
}
