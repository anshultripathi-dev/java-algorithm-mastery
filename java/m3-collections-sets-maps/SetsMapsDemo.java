import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

public class SetsMapsDemo {
    public static void main(String[] args) {
        // SET: no duplicates. HashSet = fast, unordered; TreeSet = sorted; LinkedHashSet = insertion order.
        Set<Integer> seen = new HashSet<>();
        for (int x : new int[] {3, 1, 3, 2, 1}) {
            if (!seen.add(x)) {                  // add returns false when the element was already present
                System.out.println("duplicate: " + x);
            }
        }
        System.out.println("size " + seen.size() + " contains 2? " + seen.contains(2));
        Set<String> sorted = new TreeSet<>(java.util.List.of("pear", "apple", "fig"));
        System.out.println(sorted);

        // MAP: key -> value. HashMap O(1) average, TreeMap sorted by key, LinkedHashMap insertion order.
        String text = "to be or not to be";
        Map<String, Integer> freq = new HashMap<>();
        for (String w : text.split(" ")) {
            freq.put(w, freq.getOrDefault(w, 0) + 1);
        }
        System.out.println(new TreeMap<>(freq));          // print in key order

        Map<Character, Integer> counts = new LinkedHashMap<>();
        for (char c : "banana".toCharArray()) {
            counts.merge(c, 1, Integer::sum);             // add 1, or insert 1
        }
        System.out.println(counts);

        for (Map.Entry<Character, Integer> e : counts.entrySet()) {
            System.out.print(e.getKey() + "=" + e.getValue() + ";");
        }
        System.out.println();
        System.out.println("has 'n'? " + counts.containsKey('n') + ", value of 'z' = " + counts.get('z'));

        // TWO-SUM with a map: remember what we have seen and where
        int[] a = {2, 7, 11, 15};
        int target = 18;
        Map<Integer, Integer> index = new HashMap<>();
        for (int i = 0; i < a.length; i++) {
            Integer j = index.get(target - a[i]);
            if (j != null) {
                System.out.println("two-sum: indices " + j + " and " + i);
            }
            index.put(a[i], i);
        }
    }
}
