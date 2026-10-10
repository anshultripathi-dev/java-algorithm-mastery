import java.util.Scanner;

public class AppleTreeLoop {
    // Alice stands at the origin of an infinite grid; the tree at (i, j) has |i| + |j| apples.
    // She buys a square plot [-r, r] x [-r, r] (perimeter 8r) and keeps every apple inside.
    // The apples in the NEW ring when the plot grows from r-1 to r are exactly 12 * r * r.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long needed = sc.nextLong();
        long r = 0;
        long apples = 0;
        while (apples < needed) {
            r++;
            apples += 12 * r * r;       // add the ring at distance r
        }
        System.out.println("half-side r = " + r + ", total apples = " + apples + ", minimum perimeter = " + 8 * r);
    }
}
