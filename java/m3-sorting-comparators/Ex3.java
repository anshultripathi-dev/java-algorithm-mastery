import java.util.Arrays;
import java.util.Scanner;

public class Ex3 {
    // Intervals: sort by start, then merge overlapping ones.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] iv = new int[n][2];
        for (int i = 0; i < n; i++) {
            iv[i][0] = sc.nextInt();
            iv[i][1] = sc.nextInt();
        }
        Arrays.sort(iv, (a, b) -> Integer.compare(a[0], b[0]));
        StringBuilder sb = new StringBuilder();
        int start = iv[0][0], end = iv[0][1];
        for (int i = 1; i < n; i++) {
            if (iv[i][0] <= end) {
                end = Math.max(end, iv[i][1]);
            } else {
                sb.append('[').append(start).append(',').append(end).append("] ");
                start = iv[i][0];
                end = iv[i][1];
            }
        }
        sb.append('[').append(start).append(',').append(end).append(']');
        System.out.println(sb);
    }
}
