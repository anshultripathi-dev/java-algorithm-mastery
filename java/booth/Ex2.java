import java.util.Scanner;

public class Ex2 {
    // For an n-bit multiplier given as a bit string, list Booth's operation for each cycle (rightmost bit first).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String q = sc.next();
        int previous = 0;                            // Q-1 starts as 0
        StringBuilder sb = new StringBuilder();
        for (int i = q.length() - 1; i >= 0; i--) {
            int current = q.charAt(i) - '0';
            String op;
            if (current == 1 && previous == 0) {
                op = "-M";
            } else if (current == 0 && previous == 1) {
                op = "+M";
            } else {
                op = "0";
            }
            sb.append(sb.length() == 0 ? "" : " ").append(op);
            previous = current;
        }
        System.out.println(sb);
    }
}
