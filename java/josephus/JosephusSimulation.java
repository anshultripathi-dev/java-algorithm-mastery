import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class JosephusSimulation {
    // Literally act out the circle: remove every k-th person until one is left.
    static int survivor(int n, int k, List<Integer> order) {
        List<Integer> circle = new ArrayList<>();
        for (int person = 1; person <= n; person++) {
            circle.add(person);
        }
        int index = 0;                              // where counting starts
        while (circle.size() > 1) {
            index = (index + k - 1) % circle.size(); // skip k-1 people, land on the k-th
            order.add(circle.remove(index));         // that person is out; the next count starts at the same index
        }
        return circle.get(0);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        List<Integer> order = new ArrayList<>();
        int last = survivor(n, k, order);
        System.out.println("eliminated in order: " + order);
        System.out.println("survivor: " + last);
    }
}
