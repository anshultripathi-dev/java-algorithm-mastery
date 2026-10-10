import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Scanner;

public class Ex3 {
    // Next greater element to the right (or -1), in O(n) with a stack of candidates scanned from the right.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int[] ans = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();     // values, decreasing from top... top is nearest candidate
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && stack.peek() <= a[i]) {
                stack.pop();                           // can never be the next-greater for anything to the left
            }
            ans[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(a[i]);
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i == 0 ? "" : " ").append(ans[i]);
        System.out.println(sb);
    }
}
