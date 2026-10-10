import java.util.Scanner;

public class Ex1 {
    // Count subarrays whose product is strictly positive.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int count = 0;
        for (int i = 0; i < n; i++) {
            int negatives = 0;
            for (int j = i; j < n; j++) {
                if (a[j] == 0) break;            // a zero makes every longer subarray's product 0
                if (a[j] < 0) negatives++;
                if (negatives % 2 == 0) count++;
            }
        }
        System.out.println(count);
    }
}
