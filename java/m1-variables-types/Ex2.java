import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double w = sc.nextDouble();
        double h = sc.nextDouble();
        System.out.println("area=" + w * h);
        System.out.println("perimeter=" + 2 * (w + h));
    }
}
