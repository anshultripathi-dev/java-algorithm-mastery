import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next().toLowerCase();
        int[] freq = new int[256];
        for (char c : s.toCharArray()) freq[c]++;
        int odd = 0;
        for (int f : freq) if (f % 2 == 1) odd++;
        System.out.println(odd <= 1 ? "YES" : "NO");
    }
}
