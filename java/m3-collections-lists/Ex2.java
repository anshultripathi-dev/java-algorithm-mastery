import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex2 {
    // Delete every element equal to the given value from a list, safely (no ConcurrentModificationException).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        int target = sc.nextInt();
        list.removeIf(x -> x == target);
        System.out.println(list);
    }
}
