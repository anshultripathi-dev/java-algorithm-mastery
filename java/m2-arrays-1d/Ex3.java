import java.util.Scanner;

public class Ex3 {
    // Second largest DISTINCT value, or -1 if there is none. One pass, O(1) space.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long first = Long.MIN_VALUE, second = Long.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            long x = sc.nextLong();
            if (x > first) {
                second = first;
                first = x;
            } else if (x > second && x < first) {
                second = x;
            }
        }
        System.out.println(second == Long.MIN_VALUE ? "-1" : String.valueOf(second));
    }
}
