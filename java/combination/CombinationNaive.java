import java.util.Scanner;

public class CombinationNaive {
    // The slide's formula nCr = n! / (r! * (n-r)!) -- correct, but n! overflows int for n > 12.
    static int fact(int k) {
        int f = 1;
        for (int j = 2; j <= k; j++) {
            f *= j;
        }
        return f;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int r = sc.nextInt();
        System.out.println(n + "C" + r + " = " + fact(n) / (fact(r) * fact(n - r)));
    }
}
