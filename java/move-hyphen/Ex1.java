import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        int i = s.indexOf('-');
        System.out.println(i < 0 ? s : "-" + s.substring(0, i) + s.substring(i + 1));
    }
}
