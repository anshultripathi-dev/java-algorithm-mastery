public class VerifyInstall {
    public static void main(String[] args) {
        System.out.println("If you can read this, your JDK compiler (javac) and runtime (java) both work.");
        System.out.println("java.version = " + System.getProperty("java.version"));
        System.out.println("java.home    = " + System.getProperty("java.home"));
    }
}
