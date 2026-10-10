import java.util.Scanner;

public class FindLargest {
    // An ALGORITHM: a finite list of unambiguous steps that solves a problem.
    //  1. Take the first number as "largest so far".
    //  2. Look at each remaining number; if it is bigger, it becomes the largest so far.
    //  3. When no numbers remain, "largest so far" is the answer.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int largest = sc.nextInt();
        for (int i = 1; i < n; i++) {
            int x = sc.nextInt();
            if (x > largest) {
                largest = x;
            }
        }
        System.out.println("largest = " + largest);
    }
}
