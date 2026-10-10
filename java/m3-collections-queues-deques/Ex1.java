import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        Deque<Character> st = new ArrayDeque<>();
        boolean ok = true;
        for (char c : s.toCharArray()) {
            if ("([{".indexOf(c) >= 0) st.push(c);
            else {
                if (st.isEmpty()) { ok = false; break; }
                char o = st.pop();
                if ("([{".indexOf(o) != ")]}".indexOf(c)) { ok = false; break; }
            }
        }
        System.out.println(ok && st.isEmpty() ? "YES" : "NO");
    }
}
