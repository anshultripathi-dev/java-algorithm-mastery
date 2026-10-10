import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex1 {
    // Remove all duplicates keeping the first occurrence (order preserved), using a List only.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (!out.contains(x)) out.add(x);
        }
        StringBuilder sb = new StringBuilder();
        for (int x : out) sb.append(sb.length() == 0 ? "" : " ").append(x);
        System.out.println(sb);
    }
}
