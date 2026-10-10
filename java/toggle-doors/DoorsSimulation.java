import java.util.Scanner;

public class DoorsSimulation {
    // Monkey i visits doors i, 2i, 3i, ... and toggles each one.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        boolean[] open = new boolean[n + 1];        // all doors start closed
        for (int monkey = 1; monkey <= n; monkey++) {
            for (int door = monkey; door <= n; door += monkey) {
                open[door] = !open[door];
            }
        }
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (int door = 1; door <= n; door++) {
            if (open[door]) {
                count++;
                sb.append(door).append(' ');
            }
        }
        System.out.println("open doors: " + count);
        System.out.println(sb.toString().trim());
    }
}
