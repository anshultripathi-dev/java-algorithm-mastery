import java.util.Scanner;

public class LeadersRightScan {
    // Scan from the right keeping the largest value seen so far. One pass, O(1) extra space for the scan.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int[] leaders = new int[n];
        int count = 0;
        int maxFromRight = Integer.MIN_VALUE;
        for (int i = n - 1; i >= 0; i--) {
            if (a[i] > maxFromRight) {          // bigger than everything to its right
                leaders[count++] = a[i];
                maxFromRight = a[i];
            }
        }
        // leaders were found right-to-left; print them in the original left-to-right order
        StringBuilder sb = new StringBuilder();
        for (int i = count - 1; i >= 0; i--) {
            sb.append(sb.length() == 0 ? "" : " ").append(leaders[i]);
        }
        System.out.println(sb);
    }
}
