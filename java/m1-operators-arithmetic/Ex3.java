import java.util.Scanner;

public class Ex3 {
    // Convert a number of days into "W weeks D days".
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int days = sc.nextInt();
        System.out.println(days / 7 + " weeks " + days % 7 + " days");
    }
}
