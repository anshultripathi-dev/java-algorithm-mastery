import java.util.Scanner;

public class Ex3 {
    // A circular queue (ring buffer) of capacity c. Commands: enq x -> ok/full ; deq -> value/empty.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cap = sc.nextInt();
        int n = sc.nextInt();
        int[] data = new int[cap];
        int head = 0, size = 0;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            if (op.equals("enq")) {
                int x = sc.nextInt();
                if (size == cap) sb.append("full ");
                else {
                    data[(head + size) % cap] = x;
                    size++;
                    sb.append("ok ");
                }
            } else {
                if (size == 0) sb.append("empty ");
                else {
                    sb.append(data[head]).append(' ');
                    head = (head + 1) % cap;
                    size--;
                }
            }
        }
        System.out.println(sb.toString().trim());
    }
}
