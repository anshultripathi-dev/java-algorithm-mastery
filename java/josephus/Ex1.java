import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        List<Integer> circle = new ArrayList<>();
        for (int i = 1; i <= n; i++) circle.add(i);
        StringBuilder sb = new StringBuilder();
        int idx = 0;
        while (!circle.isEmpty()) {
            idx = (idx + k - 1) % circle.size();
            sb.append(sb.length() == 0 ? "" : " ").append(circle.remove(idx));
        }
        System.out.println(sb);
    }
}
