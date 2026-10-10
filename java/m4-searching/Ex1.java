import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int found = -1;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (x == target && found == -1) found = i;
        }
        System.out.println(found);
    }
}
