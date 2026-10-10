public class TraceTable {
    // A trace table records the variables after every pass of a loop. Printing it is the
    // simplest debugger there is.
    public static void main(String[] args) {
        int n = 5;
        int sum = 0;
        System.out.println("i  sum");
        for (int i = 1; i <= n; i++) {
            sum += i * i;
            System.out.println(i + "  " + sum);
        }
        System.out.println("sum of squares = " + sum);
    }
}
