import java.util.Scanner;

public class Ex2 {
    // Are the two words anagrams (same letters, same counts, ignoring case)?
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next().toLowerCase();
        String b = sc.next().toLowerCase();
        int[] count = new int[26];
        for (char c : a.toCharArray()) count[c - 'a']++;
        for (char c : b.toCharArray()) count[c - 'a']--;
        boolean ok = a.length() == b.length();
        for (int x : count) if (x != 0) ok = false;
        System.out.println(ok ? "YES" : "NO");
    }
}
