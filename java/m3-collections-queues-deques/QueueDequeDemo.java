import java.util.ArrayDeque;
import java.util.Collections;
import java.util.Deque;
import java.util.LinkedList;
import java.util.PriorityQueue;
import java.util.Queue;

public class QueueDequeDemo {
    // balanced brackets with a stack
    static boolean balanced(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else if (c == ')' || c == ']' || c == '}') {
                if (stack.isEmpty()) return false;
                char open = stack.pop();
                if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        // QUEUE: first in, first out. offer = add at the back, poll = remove from the front.
        Queue<String> line = new LinkedList<>();
        line.offer("Asha");
        line.offer("Ravi");
        line.offer("Mei");
        System.out.println(line.peek() + " is first; served: " + line.poll() + ", then " + line.poll());

        // STACK: last in, first out. Use ArrayDeque (java.util.Stack is legacy).
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        System.out.println("top " + stack.peek() + ", pop " + stack.pop() + ", pop " + stack.pop());

        // DEQUE: both ends
        Deque<Integer> dq = new ArrayDeque<>();
        dq.addFirst(2);
        dq.addLast(3);
        dq.addFirst(1);
        System.out.println(dq + " first=" + dq.peekFirst() + " last=" + dq.peekLast());

        // PRIORITY QUEUE: poll() returns the SMALLEST (min-heap) unless a comparator says otherwise
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : new int[] {5, 1, 4, 2}) pq.offer(x);
        StringBuilder sb = new StringBuilder();
        while (!pq.isEmpty()) sb.append(pq.poll()).append(' ');
        System.out.println("min-heap order: " + sb.toString().trim());
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        maxHeap.addAll(java.util.List.of(5, 1, 4, 2));
        System.out.println("max-heap top: " + maxHeap.peek());

        System.out.println(balanced("{[()]}") + " " + balanced("([)]") + " " + balanced("(("));
    }
}
