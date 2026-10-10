import java.util.Scanner;

public class Ex2 {
    static class Stack {
        private final int[] data;
        private int size;

        Stack(int capacity) { data = new int[capacity]; }

        boolean push(int x) {
            if (size == data.length) return false;
            data[size++] = x;
            return true;
        }

        int pop() {
            if (size == 0) throw new IllegalStateException("empty");
            return data[--size];
        }

        boolean isEmpty() { return size == 0; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Stack s = new Stack(3);
        int n = sc.nextInt();
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            if (op.equals("push")) {
                out.append(s.push(sc.nextInt()) ? "ok " : "full ");
            } else {
                out.append(s.isEmpty() ? "empty " : s.pop() + " ");
            }
        }
        System.out.println(out.toString().trim());
    }
}
