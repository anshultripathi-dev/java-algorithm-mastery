import java.util.Scanner;

public class Ex1 {
    // Read tokens; print the sum of the ones that are valid integers and the count of invalid tokens.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long sum = 0;
        int bad = 0;
        while (sc.hasNext()) {
            String t = sc.next();
            try {
                sum += Integer.parseInt(t);
            } catch (NumberFormatException e) {
                bad++;
            }
        }
        System.out.println(sum + " " + bad);
    }
}
