import java.util.Scanner;

public class Ex1 {
    // Read n and, for each row, the column of its queen. Print VALID if no two queens attack each other.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] col = new int[n];
        for (int i = 0; i < n; i++) col[i] = sc.nextInt();
        boolean ok = true;
        for (int i = 0; i < n && ok; i++) {
            for (int j = i + 1; j < n; j++) {
                if (col[i] == col[j] || Math.abs(col[i] - col[j]) == j - i) {
                    ok = false;
                    break;
                }
            }
        }
        System.out.println(ok ? "VALID" : "INVALID");
    }
}
