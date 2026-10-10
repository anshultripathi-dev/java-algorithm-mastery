import java.util.Scanner;

public class Ex2 {
    // Insertion sort: print the array after every insertion step i = 1..n-1.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        for (int i = 1; i < n; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
            StringBuilder sb = new StringBuilder();
            for (int k = 0; k < n; k++) sb.append(k == 0 ? "" : " ").append(a[k]);
            System.out.println(sb);
        }
    }
}
