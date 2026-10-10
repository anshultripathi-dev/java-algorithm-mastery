import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long megabytes = sc.nextLong();
        long bytes = megabytes * 1024 * 1024;   // megabytes is already a long, so no int overflow
        System.out.println(bytes);
    }
}
