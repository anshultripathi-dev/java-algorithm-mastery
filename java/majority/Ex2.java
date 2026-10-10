import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int candidate = 0, count = 0;
        for (int x : a) {
            if (count == 0) {
                candidate = x;
                count = 1;
            } else if (x == candidate) count++;
            else count--;
        }
        int occ = 0;
        for (int x : a) if (x == candidate) occ++;
        System.out.println(occ > n / 2 ? String.valueOf(candidate) : "No majority element");
    }
}
