import java.util.Scanner;

public class Ex2 {
    // Print the trace table "i value" for the loop value = value * 2 + 1 starting from the input.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int value = sc.nextInt();
        int steps = sc.nextInt();
        for (int i = 1; i <= steps; i++) {
            value = value * 2 + 1;
            System.out.println(i + " " + value);
        }
    }
}
