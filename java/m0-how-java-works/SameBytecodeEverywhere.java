public class SameBytecodeEverywhere {
    // The same Hello.class runs on macOS, Windows and Linux: only the JVM is different per platform.
    public static void main(String[] args) {
        String os = System.getProperty("os.name");
        System.out.println("Compiled once, running on: " + os);
        System.out.println("File separator on this OS: '" + java.io.File.separator + "'");
    }
}
