public class FindTheBug {
    // BUG: the loop is meant to count the even numbers in the array, but it prints 2 instead of 3.
    static int countEvensBuggy(int[] a) {
        int count = 0;
        for (int i = 1; i < a.length; i++) {      // starts at 1: skips a[0]
            if (a[i] % 2 == 0) {
                count++;
            }
        }
        return count;
    }

    static int countEvensFixed(int[] a) {
        int count = 0;
        for (int i = 0; i < a.length; i++) {
            if (a[i] % 2 == 0) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[] a = {2, 7, 4, 9, 6};
        System.out.println("buggy: " + countEvensBuggy(a));
        System.out.println("fixed: " + countEvensFixed(a));
    }
}
