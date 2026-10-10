import java.util.Scanner;

public class LeadersBruteForce {
    // An element is a leader if it is strictly greater than EVERY element to its right.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            boolean isLeader = true;
            for (int j = i + 1; j < n; j++) {      // compare with everything on the right
                if (a[i] <= a[j]) {
                    isLeader = false;
                    break;                          // one bigger-or-equal element is enough
                }
            }
            if (isLeader) {
                sb.append(sb.length() == 0 ? "" : " ").append(a[i]);
            }
        }
        System.out.println(sb);
    }
}
