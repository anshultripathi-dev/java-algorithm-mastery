import java.util.Scanner;

public class Ex1 {
    static class Node {
        int v;
        Node next;
        Node(int v) { this.v = v; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node head = null;
        Node tail = null;
        for (int i = 0; i < n; i++) {
            Node node = new Node(sc.nextInt());
            if (head == null) head = tail = node;
            else {
                tail.next = node;
                tail = node;
            }
        }
        // reverse
        Node prev = null;
        for (Node c = head; c != null; ) {
            Node nx = c.next;
            c.next = prev;
            prev = c;
            c = nx;
        }
        StringBuilder sb = new StringBuilder();
        for (Node c = prev; c != null; c = c.next) sb.append(sb.length() == 0 ? "" : " ").append(c.v);
        System.out.println(sb);
    }
}
