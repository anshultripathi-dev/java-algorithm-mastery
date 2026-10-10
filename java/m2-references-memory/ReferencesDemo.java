import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ReferencesDemo {
    static void changePrimitive(int x) {
        x = 100;                       // changes only the local copy
    }

    static void changeArrayContent(int[] arr) {
        arr[0] = 100;                  // follows the reference: modifies the SHARED array
    }

    static void reassignReference(int[] arr) {
        arr = new int[] {7, 7, 7};     // only the local reference now points elsewhere
    }

    static void changeString(String s) {
        s = s + "!";                   // Strings are immutable: a NEW String, caller unaffected
    }

    static class Box {
        int value;
        Box(int value) { this.value = value; }
    }

    public static void main(String[] args) {
        int n = 5;
        changePrimitive(n);
        System.out.println("primitive: " + n);                    // 5

        int[] a = {1, 2, 3};
        changeArrayContent(a);
        System.out.println("array content changed: " + Arrays.toString(a));   // [100, 2, 3]
        reassignReference(a);
        System.out.println("after reassignment : " + Arrays.toString(a));     // still [100, 2, 3]

        String s = "hi";
        changeString(s);
        System.out.println("string: " + s);                       // hi

        // aliases: two variables, one object
        Box b1 = new Box(1);
        Box b2 = b1;                   // copies the REFERENCE, not the object
        b2.value = 42;
        System.out.println("b1.value = " + b1.value + "  same object? " + (b1 == b2));

        // copy vs alias for lists
        List<Integer> original = new ArrayList<>(List.of(1, 2, 3));
        List<Integer> alias = original;
        List<Integer> copy = new ArrayList<>(original);
        original.add(4);
        System.out.println("alias " + alias + "  copy " + copy);

        // null: a reference that points to nothing
        String missing = null;
        System.out.println("null check: " + (missing == null));
        try {
            System.out.println(missing.length());
        } catch (NullPointerException e) {
            System.out.println("NullPointerException caught");
        }

        // arrays of objects hold references
        Box[] boxes = new Box[2];
        System.out.println("before filling: " + boxes[0]);
        boxes[0] = new Box(9);
        System.out.println("after filling : " + boxes[0].value);
    }
}
