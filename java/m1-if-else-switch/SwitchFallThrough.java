public class SwitchFallThrough {
    public static void main(String[] args) {
        int level = 2;
        System.out.println("with break missing:");
        switch (level) {
            case 1: System.out.println("  case 1");
            case 2: System.out.println("  case 2");   // matches here...
            case 3: System.out.println("  case 3");   // ...and FALLS THROUGH
            default: System.out.println("  default");
        }
        System.out.println("modern arrow switch (Java 14+), no fall-through:");
        String name = switch (level) {
            case 1 -> "low";
            case 2 -> "medium";
            default -> "high";
        };
        System.out.println("  " + name);
    }
}
