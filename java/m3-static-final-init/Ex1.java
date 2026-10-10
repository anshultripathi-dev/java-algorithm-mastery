import java.util.Scanner;

public class Ex1 {
    static class IdGenerator {
        private static int next = 1;

        static int nextId() {
            return next++;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(sb.length() == 0 ? "" : " ").append(IdGenerator.nextId());
        System.out.println(sb);
    }
}
