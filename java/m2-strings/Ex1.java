import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().toLowerCase();
        int v = 0;
        for (char c : s.toCharArray()) {
            if ("aeiou".indexOf(c) >= 0) v++;
        }
        System.out.println(v);
    }
}
