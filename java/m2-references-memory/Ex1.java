import java.util.Arrays;
import java.util.Scanner;

public class Ex1 {
    // Write a method that swaps a[i] and a[j] IN the array (this works because arrays are objects).
    static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int k = 0; k < n; k++) a[k] = sc.nextInt();
        int i = sc.nextInt(), j = sc.nextInt();
        swap(a, i, j);
        System.out.println(Arrays.toString(a));
    }
}
