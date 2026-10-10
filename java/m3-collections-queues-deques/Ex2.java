import java.util.ArrayDeque;
import java.util.Queue;
import java.util.Scanner;

public class Ex2 {
    // Josephus with a queue: n people, every k-th leaves; print the order of leaving.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 1; i <= n; i++) q.add(i);
        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) {
            for (int i = 1; i < k; i++) q.add(q.poll());     // rotate k-1 people to the back
            sb.append(sb.length() == 0 ? "" : " ").append(q.poll());
        }
        System.out.println(sb);
    }
}
