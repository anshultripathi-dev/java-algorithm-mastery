public class ShowJavaVersion {
    public static void main(String[] args) {
        // These values come from the JVM that is running this very program.
        System.out.println("Java version : " + System.getProperty("java.version"));
        System.out.println("JVM name     : " + System.getProperty("java.vm.name"));
        System.out.println("Operating sys: " + System.getProperty("os.name"));
        System.out.println("This program was compiled to bytecode and is now being interpreted/JIT-compiled by the JVM.");
    }
}
