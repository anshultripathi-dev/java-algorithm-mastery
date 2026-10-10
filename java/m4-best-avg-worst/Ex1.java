import java.util.Scanner;

public class Ex1 {
    // Comparisons a linear search makes for the target (n if absent).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int comparisons = 0;
        boolean found = false;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (!found) {
                comparisons++;
                if (x == target) found = true;
            }
        }
        System.out.println(comparisons);
    }
}
