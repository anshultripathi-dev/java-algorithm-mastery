import java.util.Arrays;
import java.util.Scanner;

public class QuickSort {
    // Lomuto partition: the pivot is the LAST element. Afterwards everything <= pivot is on its left,
    // everything > pivot on its right, and the pivot stands at its final sorted position.
    static int partition(int[] a, int low, int high) {
        int pivot = a[high];
        int i = low - 1;                              // end of the "<= pivot" region
        for (int j = low; j < high; j++) {
            if (a[j] <= pivot) {
                i++;
                int t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        int t = a[i + 1];                             // drop the pivot between the two regions
        a[i + 1] = a[high];
        a[high] = t;
        return i + 1;
    }

    static void quickSort(int[] a, int low, int high) {
        if (low < high) {                             // 0 or 1 element: already sorted (base case)
            int p = partition(a, low, high);
            System.out.println("pivot " + a[p] + " placed at index " + p + ": " + Arrays.toString(a));
            quickSort(a, low, p - 1);
            quickSort(a, p + 1, high);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        quickSort(a, 0, n - 1);
        System.out.println("sorted: " + Arrays.toString(a));
    }
}
