import java.util.Scanner;

public class Ex3 {
    // Print IN if lo <= x <= hi, otherwise OUT.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int lo = sc.nextInt();
        int hi = sc.nextInt();
        System.out.println(x >= lo && x <= hi ? "IN" : "OUT");
    }
}
