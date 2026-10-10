import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int smallest = sc.nextInt();
        for (int i = 1; i < n; i++) {
            int x = sc.nextInt();
            if (x < smallest) smallest = x;
        }
        System.out.println(smallest);
    }
}
