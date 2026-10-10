public class Ex3 {
    // Predict: which lines print, and in what order?
    static int f() {
        try {
            System.out.println("try");
            return 1;
        } finally {
            System.out.println("finally");
        }
    }

    public static void main(String[] args) {
        System.out.println(f());
    }
}
