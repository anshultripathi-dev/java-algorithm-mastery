import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Ex3 {
    // Two-sum: print the indices (smaller first) of the first pair that adds up to target, or `none`.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < n; i++) {
            Integer j = seen.get(target - a[i]);
            if (j != null) {
                System.out.println(j + " " + i);
                return;
            }
            seen.put(a[i], i);
        }
        System.out.println("none");
    }
}
