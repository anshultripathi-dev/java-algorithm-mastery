public class EncapsulationDemo {
    // Encapsulation: hide the data (private) and expose a small, safe interface (public methods).
    static class BankAccount {
        private final String owner;       // never changes
        private long balanceCents;        // can only change through deposit/withdraw

        BankAccount(String owner, long openingCents) {
            if (openingCents < 0) {
                throw new IllegalArgumentException("opening balance cannot be negative");
            }
            this.owner = owner;
            this.balanceCents = openingCents;
        }

        public void deposit(long cents) {
            if (cents <= 0) {
                throw new IllegalArgumentException("deposit must be positive");
            }
            balanceCents += cents;
        }

        public boolean withdraw(long cents) {
            if (cents <= 0 || cents > balanceCents) {
                return false;             // refuse instead of breaking the rule "balance >= 0"
            }
            balanceCents -= cents;
            return true;
        }

        public String getOwner() { return owner; }
        public long getBalanceCents() { return balanceCents; }
    }

    public static void main(String[] args) {
        BankAccount acct = new BankAccount("Asha", 10_000);
        acct.deposit(2_500);
        System.out.println("withdraw 5000: " + acct.withdraw(5_000));
        System.out.println("withdraw 99999: " + acct.withdraw(99_999));
        System.out.println(acct.getOwner() + " has " + acct.getBalanceCents() / 100.0);
        // acct.balanceCents = -1;   // would NOT compile: the field is private
        try {
            acct.deposit(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }
    }
}
