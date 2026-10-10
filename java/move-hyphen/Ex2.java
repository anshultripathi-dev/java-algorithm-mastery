import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        StringBuilder h = new StringBuilder();
        StringBuilder o = new StringBuilder();
        for (char c : s.toCharArray()) (c == '-' ? h : o).append(c);
        System.out.println(h.append(o));
    }
}
