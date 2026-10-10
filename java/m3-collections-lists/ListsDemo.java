import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

public class ListsDemo {
    // A GENERIC method: works for a list of any element type T.
    static <T> void swapFirstAndLast(List<T> list) {
        if (list.size() < 2) return;
        T first = list.get(0);
        list.set(0, list.get(list.size() - 1));
        list.set(list.size() - 1, first);
    }

    public static void main(String[] args) {
        // ArrayList<E>: a resizable array. The type argument says what it holds.
        List<Integer> nums = new ArrayList<>();
        nums.add(30);
        nums.add(10);
        nums.add(20);
        nums.add(1, 99);                       // insert at index 1: shifts the rest right
        System.out.println(nums + " size=" + nums.size() + " get(2)=" + nums.get(2));

        nums.set(0, 31);
        nums.remove(Integer.valueOf(99));      // remove by VALUE
        nums.remove(0);                        // remove by INDEX
        System.out.println(nums + " contains 20? " + nums.contains(20) + " indexOf(10)=" + nums.indexOf(10));

        // the classic trap: a List<Integer> has two remove methods
        List<Integer> a = new ArrayList<>(List.of(5, 6, 7, 1));
        a.remove(1);                           // index 1 -> removes the 6
        a.remove(Integer.valueOf(1));          // the VALUE 1
        System.out.println(a);

        // loops
        int sum = 0;
        for (int x : a) sum += x;
        System.out.println("sum " + sum);

        // sorting and utilities
        List<String> words = new ArrayList<>(List.of("pear", "apple", "fig"));
        Collections.sort(words);
        System.out.println(words + " max=" + Collections.max(words) + " reversed=" + reversed(words));
        swapFirstAndLast(words);
        System.out.println(words);

        // LinkedList: fast insert/remove at both ends, slow get(i)
        LinkedList<String> ll = new LinkedList<>(words);
        ll.addFirst("kiwi");
        ll.removeLast();
        System.out.println(ll);

        // autoboxing: int <-> Integer is automatic, but == on Integer objects is dangerous
        Integer p = 127, q = 127, r = 1000, s = 1000;
        System.out.println((p == q) + " " + (r == s) + " " + r.equals(s));

        // a list cannot hold primitives: List<int> is illegal, use the wrapper type Integer
        System.out.println(List.of(1, 2, 3).getClass().getSimpleName().startsWith("List"));
    }

    static <T> List<T> reversed(List<T> in) {
        List<T> out = new ArrayList<>(in);
        Collections.reverse(out);
        return out;
    }
}
