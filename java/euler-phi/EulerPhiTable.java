public class EulerPhiTable {
    // Computes phi(1..limit) for all numbers at once with a sieve-like pass.
    static int[] phiUpTo(int limit) {
        int[] phi = new int[limit + 1];
        for (int i = 0; i <= limit; i++) {
            phi[i] = i;
        }
        for (int p = 2; p <= limit; p++) {
            if (phi[p] == p) {                       // untouched so far => p is prime
                for (int multiple = p; multiple <= limit; multiple += p) {
                    phi[multiple] -= phi[multiple] / p;
                }
            }
        }
        return phi;
    }

    public static void main(String[] args) {
        int[] phi = phiUpTo(20);
        for (int n = 1; n <= 20; n++) {
            System.out.println("phi(" + n + ") = " + phi[n]);
        }
    }
}
