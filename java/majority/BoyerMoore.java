import java.util.Scanner;

public class BoyerMoore {
    // Boyer-Moore voting: O(n) time, O(1) space.
    static Integer majority(int[] a) {
        // Step 1: find a CANDIDATE. Each different pair of elements "cancels out"; a true majority survives.
        Integer candidate = null;
        int count = 0;
        for (int x : a) {
            if (count == 0) {
                candidate = x;
                count = 1;
            } else if (x == candidate) {
                count++;
            } else {
                count--;
            }
        }
        if (candidate == null) {
            return null;
        }
        // Step 2: VERIFY. The survivor is only a candidate: it need not be a majority.
        int occurrences = 0;
        for (int x : a) {
            if (x == candidate) {
                occurrences++;
            }
        }
        return occurrences > a.length / 2 ? candidate : null;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        Integer m = majority(a);
        System.out.println(m == null ? "No majority element" : "Majority element: " + m);
    }
}
