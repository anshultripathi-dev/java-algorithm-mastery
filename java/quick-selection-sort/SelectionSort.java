import java.util.Arrays;
import java.util.Scanner;

public class SelectionSort {
    // Repeatedly find the smallest value in the unsorted part and swap it to the front of that part.
    static void sort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;                          // position of the smallest value seen so far
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[minIndex]) {
                    minIndex = j;
                }
            }
            int temp = a[minIndex];                    // one swap per pass
            a[minIndex] = a[i];
            a[i] = temp;
            System.out.println("after pass " + (i + 1) + ": " + Arrays.toString(a));
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        sort(a);
        System.out.println("sorted: " + Arrays.toString(a));
    }
}
