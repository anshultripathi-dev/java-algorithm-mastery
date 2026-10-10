import java.util.Scanner;

public class Ex1 {
    // Total weight of a string made of A..Z, with weight(A)=1 and weight(next) = (index+1) * weight(previous).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        long[] w = new long[26];
        w[0] = 1;
        for (int i = 1; i < 26; i++) w[i] = w[i - 1] * (i + 2);
        long sum = 0;
        for (char c : s.toCharArray()) sum += w[c - 'A'];
        System.out.println(sum);
    }
}
