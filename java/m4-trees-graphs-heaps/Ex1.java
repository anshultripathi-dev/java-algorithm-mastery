import java.util.Scanner;

public class Ex1 {
    static class T { int k; T l, r; T(int k) { this.k = k; } }

    static T ins(T t, int k) {
        if (t == null) return new T(k);
        if (k < t.k) t.l = ins(t.l, k);
        else if (k > t.k) t.r = ins(t.r, k);
        return t;
    }

    static int height(T t) { return t == null ? 0 : 1 + Math.max(height(t.l), height(t.r)); }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        T root = null;
        for (int i = 0; i < n; i++) root = ins(root, sc.nextInt());
        System.out.println(height(root));
    }
}
