import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        int limit = 2_000_000;                    // the 100 000th prime is 1 299 709, so this is enough
        boolean[] composite = new boolean[limit + 1];
        int seen = 0;
        for (int i = 2; i <= limit; i++) {
            if (!composite[i]) {
                seen++;
                if (seen == k) {
                    System.out.println(i);
                    return;
                }
                for (long m = (long) i * i; m <= limit; m += i) {
                    composite[(int) m] = true;
                }
            }
        }
    }
}
