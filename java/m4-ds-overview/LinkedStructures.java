public class LinkedStructures {
    // A NODE: one value plus a reference to the next node.
    static class Node {
        int value;
        Node next;

        Node(int value) {
            this.value = value;
        }
    }

    // A singly linked list with head insertion/removal in O(1) and tail append in O(n).
    static class LinkedList {
        Node head;
        int size;

        void addFirst(int v) {
            Node n = new Node(v);
            n.next = head;
            head = n;
            size++;
        }

        void addLast(int v) {
            Node n = new Node(v);
            if (head == null) {
                head = n;
            } else {
                Node cur = head;
                while (cur.next != null) cur = cur.next;   // walk to the end: O(n)
                cur.next = n;
            }
            size++;
        }

        int removeFirst() {
            int v = head.value;
            head = head.next;
            size--;
            return v;
        }

        void reverse() {
            Node prev = null;
            Node cur = head;
            while (cur != null) {
                Node next = cur.next;     // remember the rest
                cur.next = prev;          // flip the link
                prev = cur;
                cur = next;
            }
            head = prev;
        }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder("[");
            for (Node c = head; c != null; c = c.next) {
                sb.append(c.value).append(c.next != null ? " -> " : "");
            }
            return sb.append("]").toString();
        }
    }

    // A STACK built on the list: push/pop at the head, both O(1).
    static class Stack {
        private final LinkedList list = new LinkedList();
        void push(int v) { list.addFirst(v); }
        int pop() { return list.removeFirst(); }
        boolean isEmpty() { return list.size == 0; }
    }

    // A QUEUE built on an array ring buffer: enqueue/dequeue both O(1).
    static class Queue {
        private final int[] data;
        private int head, size;

        Queue(int capacity) { data = new int[capacity]; }

        boolean enqueue(int v) {
            if (size == data.length) return false;
            data[(head + size) % data.length] = v;
            size++;
            return true;
        }

        int dequeue() {
            int v = data[head];
            head = (head + 1) % data.length;
            size--;
            return v;
        }

        boolean isEmpty() { return size == 0; }
    }

    public static void main(String[] args) {
        LinkedList list = new LinkedList();
        list.addFirst(2);
        list.addFirst(1);
        list.addLast(3);
        list.addLast(4);
        System.out.println(list + " size " + list.size);
        list.reverse();
        System.out.println("reversed " + list);

        Stack st = new Stack();
        for (int i = 1; i <= 3; i++) st.push(i);
        StringBuilder sb = new StringBuilder("stack pops:");
        while (!st.isEmpty()) sb.append(' ').append(st.pop());
        System.out.println(sb);

        Queue q = new Queue(3);
        q.enqueue(10);
        q.enqueue(20);
        q.enqueue(30);
        System.out.println("fourth enqueue accepted? " + q.enqueue(40));
        System.out.println("dequeued " + q.dequeue() + ", then enqueue 40 -> " + q.enqueue(40));
        sb = new StringBuilder("queue order:");
        while (!q.isEmpty()) sb.append(' ').append(q.dequeue());
        System.out.println(sb);
    }
}
