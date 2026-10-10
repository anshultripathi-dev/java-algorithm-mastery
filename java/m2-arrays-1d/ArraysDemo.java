import java.util.Arrays;

public class ArraysDemo {
    public static void main(String[] args) {
        // creating arrays
        int[] marks = new int[5];                 // five zeros
        int[] primes = {2, 3, 5, 7, 11};          // initialiser list
        String[] names = new String[2];           // two nulls
        System.out.println("length = " + primes.length + "  first = " + primes[0] + "  last = " + primes[primes.length - 1]);
        System.out.println(Arrays.toString(marks) + " " + Arrays.toString(names));

        // traversing: indexed loop and for-each
        int sum = 0;
        for (int i = 0; i < primes.length; i++) {
            sum += primes[i];
        }
        System.out.println("sum = " + sum);
        for (int p : primes) {
            System.out.print(p * p + " ");
        }
        System.out.println();

        // typical algorithms: max, reverse in place, copy
        int[] a = {4, 9, 2, 7};
        int max = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] > max) max = a[i];
        }
        for (int i = 0, j = a.length - 1; i < j; i++, j--) {
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        int[] copy = Arrays.copyOf(a, a.length);   // a real copy
        int[] alias = a;                            // the SAME array
        copy[0] = 100;
        alias[1] = -5;
        System.out.println("max = " + max + ", reversed a = " + Arrays.toString(a) + ", copy = " + Arrays.toString(copy));

        // utilities
        int[] b = {5, 1, 4};
        Arrays.sort(b);
        System.out.println(Arrays.toString(b) + " index of 4 = " + Arrays.binarySearch(b, 4));
        Arrays.fill(marks, 7);
        System.out.println(Arrays.toString(marks) + " equals? " + Arrays.equals(b, new int[]{1, 4, 5}));
    }
}
