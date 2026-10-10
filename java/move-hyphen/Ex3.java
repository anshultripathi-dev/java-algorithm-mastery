import java.util.Scanner;

public class Ex3 {
    // Minimum number of ADJACENT swaps to bring all hyphens to the front:
    // each hyphen must jump over every non-hyphen character that stands before it.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        long nonHyphensSeen = 0;
        long swaps = 0;
        for (char c : s.toCharArray()) {
            if (c == '-') swaps += nonHyphensSeen;
            else nonHyphensSeen++;
        }
        System.out.println(swaps);
    }
}
