import java.util.Scanner;

public class Ex2 {
    // Sum all integers until the end of input (the count is not given).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long sum = 0;
        while (sc.hasNextLong()) sum += sc.nextLong();
        System.out.println(sum);
    }
}
