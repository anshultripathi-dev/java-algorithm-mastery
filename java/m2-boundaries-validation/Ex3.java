import java.util.Scanner;

public class Ex3 {
    // Safe element access: print a[i] if 0 <= i < n else `out of range`.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int k = 0; k < n; k++) a[k] = sc.nextInt();
        int i = sc.nextInt();
        System.out.println(i >= 0 && i < n ? String.valueOf(a[i]) : "out of range");
    }
}
