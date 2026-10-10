import java.util.Scanner;

public class Ex2 {
    // Is a linked list of n numbers a palindrome? Use an array to hold the values (simple version).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        boolean ok = true;
        for (int i = 0, j = n - 1; i < j; i++, j--) if (a[i] != a[j]) ok = false;
        System.out.println(ok ? "YES" : "NO");
    }
}
