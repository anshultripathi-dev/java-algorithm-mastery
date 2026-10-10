public class ThreeKindsOfErrors {
    // 1. COMPILE-TIME errors never get this far: the compiler rejects the file (see the lesson snippets).

    // 2. RUNTIME error: the program starts, then fails on a bad operation. We catch it to show the message.
    static void runtimeError() {
        try {
            int a = 10;
            int b = 0;
            System.out.println(a / b);
        } catch (ArithmeticException e) {
            System.out.println("runtime error caught: " + e.getMessage());
        }
        try {
            int[] arr = new int[3];
            arr[3] = 1;
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("runtime error caught: " + e.getMessage());
        }
    }

    // 3. LOGIC error: compiles, runs, prints an answer — the WRONG answer.
    static double wrongAverage(int a, int b) {
        return a + b / 2;          // precedence: b/2 happens first!
    }

    static double rightAverage(int a, int b) {
        return (a + b) / 2.0;
    }

    public static void main(String[] args) {
        runtimeError();
        System.out.println("average of 10 and 20, buggy  : " + wrongAverage(10, 20));
        System.out.println("average of 10 and 20, correct: " + rightAverage(10, 20));
    }
}
