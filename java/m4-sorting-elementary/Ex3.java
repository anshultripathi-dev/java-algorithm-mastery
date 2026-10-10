import java.util.Scanner;

public class Ex3 {
    // Is the sort stable? Input: n pairs "key label". Sort by key with insertion sort and print the labels.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] key = new int[n];
        String[] label = new String[n];
        for (int i = 0; i < n; i++) {
            key[i] = sc.nextInt();
            label[i] = sc.next();
        }
        for (int i = 1; i < n; i++) {
            int k = key[i];
            String l = label[i];
            int j = i - 1;
            while (j >= 0 && key[j] > k) {
                key[j + 1] = key[j];
                label[j + 1] = label[j];
                j--;
            }
            key[j + 1] = k;
            label[j + 1] = l;
        }
        System.out.println(String.join(" ", label));
    }
}
