import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long r = (long) Math.sqrt((double) n);
        while (r * r > n) r--;
        while ((r + 1) * (r + 1) <= n) r++;
        System.out.println(r);
    }
}
