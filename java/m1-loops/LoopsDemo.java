public class LoopsDemo {
    public static void main(String[] args) {
        // for: when you know how many times
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum += i;
        }
        System.out.println("1+2+3+4+5 = " + sum);

        // while: repeat while a condition holds (condition checked BEFORE each pass)
        int n = 1000;
        int digits = 0;
        while (n > 0) {
            n /= 10;
            digits++;
        }
        System.out.println("1000 has " + digits + " digits");

        // do-while: body runs at least once (condition checked AFTER)
        int k = 10;
        do {
            System.out.println("do-while ran once with k = " + k);
        } while (k < 5);

        // nested loops: the inner loop restarts for every outer iteration
        for (int row = 1; row <= 3; row++) {
            StringBuilder line = new StringBuilder();
            for (int col = 1; col <= row; col++) {
                line.append('*');
            }
            System.out.println(line);
        }

        // break leaves the loop, continue skips to the next iteration
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) continue;     // skip evens
            if (i > 7) break;             // stop completely
            System.out.print(i + " ");
        }
        System.out.println();

        // for-each over an array
        int[] marks = {70, 85, 90};
        int total = 0;
        for (int m : marks) {
            total += m;
        }
        System.out.println("total = " + total);
    }
}
