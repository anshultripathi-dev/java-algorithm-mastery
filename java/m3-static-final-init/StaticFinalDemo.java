public class StaticFinalDemo {
    static class Ticket {
        static int issued = 0;                       // ONE copy shared by all tickets
        static final double TAX_RATE = 0.18;         // constant: static + final
        private final int number;                    // one per object, set exactly once

        static {                                      // static block: runs once, when the class is loaded
            System.out.println("[Ticket class loaded]");
        }

        {                                             // instance initialiser: runs before every constructor body
            issued++;
        }

        Ticket() {
            number = issued;
            System.out.println("[Ticket #" + number + " created]");
        }

        static double withTax(double price) {         // static method: no `this`, called on the class
            return price * (1 + TAX_RATE);
        }

        int getNumber() {
            return number;
        }
    }

    public static void main(String[] args) {
        System.out.println("start");
        Ticket a = new Ticket();
        Ticket b = new Ticket();
        System.out.println("issued so far: " + Ticket.issued);
        System.out.printf("100 with tax: %.2f%n", Ticket.withTax(100));
        System.out.println("numbers: " + a.getNumber() + ", " + b.getNumber());
        // Ticket.TAX_RATE = 0.2;   // would NOT compile: final
        final int[] arr = {1, 2, 3};
        arr[0] = 99;                                  // allowed: final protects the reference, not the contents
        System.out.println("final array first element: " + arr[0]);
    }
}
