import java.util.Scanner;

public class Ex3 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int q = sc.nextInt();
        int width = 16;                      // inputs fit in 16-bit signed numbers
        if (m == -(1 << (width - 1))) {
            width++;
        }
        long mask = (1L << width) - 1;
        long M = m & mask;
        long negM = (-m) & mask;
        long ac = 0;
        long qr = q & mask;
        int qm1 = 0;
        for (int i = 0; i < width; i++) {
            int q0 = (int) (qr & 1);
            if (q0 == 1 && qm1 == 0) {
                ac = (ac + negM) & mask;
            } else if (q0 == 0 && qm1 == 1) {
                ac = (ac + M) & mask;
            }
            qm1 = (int) (qr & 1);
            qr = ((qr >> 1) | ((ac & 1) << (width - 1))) & mask;
            ac = (ac >> 1) | (ac & (1L << (width - 1)));
        }
        long raw = (ac << width) | qr;
        long sign = 1L << (2 * width - 1);
        long product = (raw & sign) != 0 ? raw - (1L << (2 * width)) : raw;   // read the 2n-bit pattern as signed
        System.out.println(product);
    }
}
