public class RuntimeInfo {
    public static void main(String[] args) {
        Runtime rt = Runtime.getRuntime();
        long mb = 1024 * 1024;
        System.out.println("CPU cores available to the JVM : " + rt.availableProcessors());
        System.out.println("Maximum heap the JVM may use   : " + rt.maxMemory() / mb + " MB");
        System.out.println("Heap currently reserved        : " + rt.totalMemory() / mb + " MB");
        System.out.println("Garbage collector frees objects automatically — you never call free().");
    }
}
