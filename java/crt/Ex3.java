import java.util.Scanner;

public class Ex3 {
    // Moduli need NOT be coprime. Walk through x = r1, r1 + m1, r1 + 2*m1, ... : only these satisfy
    // the first congruence. The remainders mod m2 repeat after m2 steps, so m2 tries are enough.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long r1 = sc.nextLong();
        long m1 = sc.nextLong();
        long r2 = sc.nextLong();
        long m2 = sc.nextLong();
        long x = r1 % m1;
        for (long k = 0; k < m2; k++) {
            if (x % m2 == r2 % m2) {
                System.out.println(x);
                return;
            }
            x += m1;
        }
        System.out.println(-1);
    }
}
