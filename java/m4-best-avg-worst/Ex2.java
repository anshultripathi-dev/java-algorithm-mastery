import java.util.Scanner;

public class Ex2 {
    // Average comparisons of a successful linear search over n elements when every position is equally likely.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.printf("%.1f%n", (n + 1) / 2.0);
    }
}
