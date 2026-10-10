import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        boolean[] composite = new boolean[n + 1];
        int count = 0;
        for (int i = 2; i <= n; i++) {
            if (!composite[i]) {
                count++;
                for (long m = (long) i * i; m <= n; m += i) {
                    composite[(int) m] = true;
                }
            }
        }
        System.out.println(count);
    }
}
