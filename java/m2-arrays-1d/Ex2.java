import java.util.Scanner;

public class Ex2 {
    // Frequency of each value 0..9 in the array.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] freq = new int[10];
        for (int i = 0; i < n; i++) freq[sc.nextInt()]++;
        for (int d = 0; d < 10; d++) {
            if (freq[d] > 0) System.out.println(d + ": " + freq[d]);
        }
    }
}
