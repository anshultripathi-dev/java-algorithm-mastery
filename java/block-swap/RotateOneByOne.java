import java.util.Arrays;
import java.util.Scanner;

public class RotateOneByOne {
    // Rotate left by one position, d times. Easy to understand, but d * n element moves.
    static void leftRotate(int[] a, int d) {
        int n = a.length;
        d %= n;
        for (int step = 0; step < d; step++) {
            int first = a[0];
            for (int i = 0; i < n - 1; i++) {
                a[i] = a[i + 1];
            }
            a[n - 1] = first;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int d = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        leftRotate(a, d);
        System.out.println(Arrays.toString(a));
    }
}
