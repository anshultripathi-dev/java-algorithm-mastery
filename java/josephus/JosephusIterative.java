import java.util.Scanner;

public class JosephusIterative {
    // The same recurrence without recursion: build the answer for 1, 2, 3, ... n people (0-based positions).
    static int josephus(int n, int k) {
        int ans = 0;                       // with 1 person the survivor is at position 0
        for (int people = 2; people <= n; people++) {
            ans = (ans + k) % people;
        }
        return ans + 1;                    // convert to 1-based
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        System.out.println(josephus(n, k));
    }
}
