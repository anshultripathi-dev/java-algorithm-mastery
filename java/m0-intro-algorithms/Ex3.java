import java.util.Scanner;

public class Ex3 {
    // Is the sequence sorted in non-decreasing order?
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int prev = sc.nextInt();
        boolean sorted = true;
        for (int i = 1; i < n; i++) {
            int x = sc.nextInt();
            if (x < prev) sorted = false;
            prev = x;
        }
        System.out.println(sorted ? "YES" : "NO");
    }
}
