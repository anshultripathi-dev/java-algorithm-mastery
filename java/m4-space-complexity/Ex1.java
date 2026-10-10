import java.util.Scanner;

public class Ex1 {
    static int depth, maxDepth;

    static long f(int n) {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
        long r = n <= 1 ? 1 : f(n - 1) + 1;
        depth--;
        return r;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        f(sc.nextInt());
        System.out.println(maxDepth);
    }
}
