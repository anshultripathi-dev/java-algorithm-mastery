import java.util.Scanner;

public class Ex2 {
    // Towers of Hanoi: print the moves for n disks from rod A to rod C using B.
    static int moves = 0;
    static StringBuilder out = new StringBuilder();

    static void hanoi(int n, char from, char to, char via) {
        if (n == 0) return;
        hanoi(n - 1, from, via, to);
        out.append("Move disk ").append(n).append(" from ").append(from).append(" to ").append(to).append('\n');
        moves++;
        hanoi(n - 1, via, to, from);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        hanoi(n, 'A', 'C', 'B');
        System.out.print(out);
        System.out.println("total moves: " + moves);
    }
}
