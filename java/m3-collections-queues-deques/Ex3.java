import java.util.PriorityQueue;
import java.util.Scanner;

public class Ex3 {
    // k-th largest element using a min-heap of size k.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int i = 0; i < n; i++) {
            heap.add(sc.nextInt());
            if (heap.size() > k) heap.poll();     // drop the smallest: the heap keeps the k largest
        }
        System.out.println(heap.peek());
    }
}
