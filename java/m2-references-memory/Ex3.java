import java.util.Scanner;

public class Ex3 {
    // Prints "same" or "different" for two array variables that refer to the same / different arrays.
    // Mode 1: b = a (alias). Mode 2: b = a.clone() (copy).
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int mode = sc.nextInt();
        int[] a = {1, 2, 3};
        int[] b = mode == 1 ? a : a.clone();
        b[0] = 99;
        System.out.println(a[0] == 99 ? "same" : "different");
    }
}
