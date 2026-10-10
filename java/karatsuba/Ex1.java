import java.util.Scanner;

public class Ex1 {
    // School-book multiplication of two digit strings: O(n * m) digit multiplications.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String x = sc.next();
        String y = sc.next();
        int[] result = new int[x.length() + y.length()];
        for (int i = x.length() - 1; i >= 0; i--) {
            for (int j = y.length() - 1; j >= 0; j--) {
                int product = (x.charAt(i) - '0') * (y.charAt(j) - '0');
                int pos = i + j + 1;               // units position of this partial product
                int sum = product + result[pos];
                result[pos] = sum % 10;
                result[pos - 1] += sum / 10;       // carry into the next position to the left
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int digit : result) {
            if (!(sb.length() == 0 && digit == 0)) {
                sb.append(digit);
            }
        }
        System.out.println(sb.length() == 0 ? "0" : sb);
    }
}
