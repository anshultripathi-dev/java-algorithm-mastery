public class Ex3 {
    // Predict the output of the initialisation order.
    static class Init {
        static { System.out.println("static block"); }
        { System.out.println("instance block"); }
        Init() { System.out.println("constructor"); }
    }

    public static void main(String[] args) {
        new Init();
        new Init();
    }
}
