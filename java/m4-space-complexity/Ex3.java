import java.util.Scanner;

public class Ex3 {
    // Does the array contain a duplicate? O(n log n) time but only O(1) extra space apart from sorting in place.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        java.util.Arrays.sort(a);
        boolean dup = false;
        for (int i = 1; i < n; i++) if (a[i] == a[i - 1]) dup = true;
        System.out.println(dup ? "YES" : "NO");
    }
}
