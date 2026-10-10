import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class StrobogrammaticCheck {
    // Rotating a number by 180 degrees reverses the digit order AND rotates each digit:
    // 0->0, 1->1, 8->8, 6->9, 9->6. Any other digit has no valid rotated form.
    static boolean isStrobogrammatic(String num) {
        Map<Character, Character> rotated = new HashMap<>();
        rotated.put('0', '0');
        rotated.put('1', '1');
        rotated.put('8', '8');
        rotated.put('6', '9');
        rotated.put('9', '6');

        int left = 0;
        int right = num.length() - 1;
        while (left <= right) {
            Character r = rotated.get(num.charAt(left));
            if (r == null || r != num.charAt(right)) {   // left digit must rotate into the right digit
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String n = sc.next();
        System.out.println(n + " -> " + isStrobogrammatic(n));
    }
}
