public class Ex3 {
    // Two classes named Date live in different packages; use fully qualified names to tell them apart.
    public static void main(String[] args) {
        java.util.Date util = new java.util.Date(0);
        java.sql.Date sql = new java.sql.Date(0);
        System.out.println(util.getClass().getName());
        System.out.println(sql.getClass().getName());
    }
}
