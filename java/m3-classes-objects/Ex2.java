import java.util.Scanner;

public class Ex2 {
    static class Counter {
        private int count;

        void increment() { count++; }
        void add(int k) { count += k; }
        int get() { return count; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Counter c = new Counter();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            if (op.equals("inc")) c.increment();
            else c.add(sc.nextInt());
        }
        System.out.println(c.get());
    }
}
