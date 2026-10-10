import java.util.Arrays;
import java.util.Scanner;

public class Ex2 {
    // Return a NEW array with every element doubled; the input array must stay unchanged.
    static int[] doubled(int[] a) {
        int[] r = new int[a.length];
        for (int i = 0; i < a.length; i++) r[i] = a[i] * 2;
        return r;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int k = 0; k < n; k++) a[k] = sc.nextInt();
        int[] d = doubled(a);
        System.out.println(Arrays.toString(a) + " " + Arrays.toString(d));
    }
}
