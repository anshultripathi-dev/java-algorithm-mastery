import java.util.Arrays;

public class ElementarySorts {
    static long comparisons, swaps;

    static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
        swaps++;
    }

    // BUBBLE SORT: repeatedly swap adjacent out-of-order pairs; the largest "bubbles" to the end each pass.
    static void bubble(int[] a) {
        for (int pass = 0; pass < a.length - 1; pass++) {
            boolean swapped = false;
            for (int i = 0; i < a.length - 1 - pass; i++) {
                comparisons++;
                if (a[i] > a[i + 1]) {
                    swap(a, i, i + 1);
                    swapped = true;
                }
            }
            if (!swapped) break;                    // already sorted: O(n) best case
        }
    }

    // INSERTION SORT: grow a sorted prefix; insert the next element by shifting larger ones right.
    static void insertion(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0) {
                comparisons++;
                if (a[j] <= key) break;             // <= keeps equal elements in order: STABLE
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }

    static void selection(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int m = i;
            for (int j = i + 1; j < a.length; j++) {
                comparisons++;
                if (a[j] < a[m]) m = j;
            }
            if (m != i) swap(a, i, m);
        }
    }

    static void run(String name, java.util.function.Consumer<int[]> sorter, int[] input) {
        int[] a = input.clone();
        comparisons = 0;
        swaps = 0;
        sorter.accept(a);
        System.out.printf("%-10s %s  comparisons=%d swaps=%d%n", name, Arrays.toString(a), comparisons, swaps);
    }

    public static void main(String[] args) {
        int[] data = {5, 2, 9, 1, 5, 6};
        System.out.println("input     " + Arrays.toString(data));
        run("bubble", ElementarySorts::bubble, data);
        run("insertion", ElementarySorts::insertion, data);
        run("selection", ElementarySorts::selection, data);

        int[] sorted = {1, 2, 3, 4, 5, 6};
        System.out.println("already sorted input:");
        run("bubble", ElementarySorts::bubble, sorted);
        run("insertion", ElementarySorts::insertion, sorted);
        run("selection", ElementarySorts::selection, sorted);

        // stability: records with equal keys. Insertion sort keeps "b1" before "b2".
        String[] items = {"b1", "a1", "b2", "a2"};
        String[] stable = items.clone();
        for (int i = 1; i < stable.length; i++) {
            String key = stable[i];
            int j = i - 1;
            while (j >= 0 && stable[j].charAt(0) > key.charAt(0)) {   // compare letters only
                stable[j + 1] = stable[j];
                j--;
            }
            stable[j + 1] = key;
        }
        System.out.println("stable sort by letter: " + Arrays.toString(stable));
    }
}
