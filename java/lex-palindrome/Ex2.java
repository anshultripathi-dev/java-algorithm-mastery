import java.util.Scanner;
import java.util.TreeMap;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        TreeMap<Character, Integer> f = new TreeMap<>();
        for (char c : sc.next().toLowerCase().toCharArray()) f.merge(c, 1, Integer::sum);
        String mid = "";
        int odd = 0;
        for (var e : f.entrySet()) {
            if (e.getValue() % 2 == 1) {
                odd++;
                mid = String.valueOf(e.getKey());
            }
        }
        if (odd > 1) {
            System.out.println("no palindromic string");
            return;
        }
        StringBuilder front = new StringBuilder();
        for (var e : f.entrySet()) front.append(String.valueOf(e.getKey()).repeat(e.getValue() / 2));
        System.out.println(front + mid + new StringBuilder(front).reverse());
    }
}
