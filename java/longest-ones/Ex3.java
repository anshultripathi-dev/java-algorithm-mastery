import java.util.Scanner;

public class Ex3 {
    // Longest run of 1s after flipping at most k zeros: sliding window over the 32 bits containing <= k zeros.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int k = sc.nextInt();
        int left = 0, zeros = 0, best = 0;
        for (int right = 0; right < 32; right++) {
            if (((x >>> right) & 1) == 0) zeros++;
            while (zeros > k) {
                if (((x >>> left) & 1) == 0) zeros--;
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        System.out.println(best);
    }
}
