import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex3 {
    // Generic method: return the largest element of any list of Comparable items.
    static <T extends Comparable<T>> T largest(List<T> list) {
        T best = list.get(0);
        for (T x : list) if (x.compareTo(best) > 0) best = x;
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) words.add(sc.next());
        System.out.println(largest(words));
    }
}
