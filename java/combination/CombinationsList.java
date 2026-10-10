import java.util.ArrayList;
import java.util.List;

public class CombinationsList {
    // Prints every way to choose r items from the array (the "harder" part mentioned in the lecture).
    static void combos(int[] items, int r, int start, List<Integer> current) {
        if (current.size() == r) {
            System.out.println(current);
            return;
        }
        for (int i = start; i < items.length; i++) {
            current.add(items[i]);               // choose items[i]
            combos(items, r, i + 1, current);    // go on with the items to its right
            current.remove(current.size() - 1);  // un-choose (backtrack)
        }
    }

    public static void main(String[] args) {
        combos(new int[] {9, 12, 19, 61}, 2, 0, new ArrayList<>());
    }
}
