public class GrowthTable {
    static long steps;

    static void constant(int n) { steps++; }                                   // O(1)
    static void logarithmic(int n) { for (int i = n; i > 1; i /= 2) steps++; } // O(log n)
    static void linear(int n) { for (int i = 0; i < n; i++) steps++; }         // O(n)
    static void linearithmic(int n) {                                          // O(n log n)
        for (int i = 0; i < n; i++)
            for (int j = 1; j < n; j *= 2) steps++;
    }
    static void quadratic(int n) {                                             // O(n^2)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) steps++;
    }
    static void cubic(int n) {                                                 // O(n^3)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                for (int k = 0; k < n; k++) steps++;
    }
    static void exponential(int n) {                                           // O(2^n): all subsets
        if (n == 0) { steps++; return; }
        exponential(n - 1);
        exponential(n - 1);
    }

    interface Algo { void run(int n); }

    static long measure(Algo a, int n) {
        steps = 0;
        a.run(n);
        return steps;
    }

    public static void main(String[] args) {
        int[] sizes = {8, 16, 32, 64};
        System.out.printf("%-12s", "n");
        for (int n : sizes) System.out.printf("%12d", n);
        System.out.println();
        Object[][] rows = {
            {"O(1)", (Algo) GrowthTable::constant},
            {"O(log n)", (Algo) GrowthTable::logarithmic},
            {"O(n)", (Algo) GrowthTable::linear},
            {"O(n log n)", (Algo) GrowthTable::linearithmic},
            {"O(n^2)", (Algo) GrowthTable::quadratic},
            {"O(n^3)", (Algo) GrowthTable::cubic},
        };
        for (Object[] r : rows) {
            System.out.printf("%-12s", r[0]);
            for (int n : sizes) System.out.printf("%12d", measure((Algo) r[1], n));
            System.out.println();
        }
        System.out.printf("%-12s", "O(2^n)");
        for (int n : new int[] {8, 12, 16, 20}) System.out.printf("%12d", measure(GrowthTable::exponential, n));
        System.out.println("   (n = 8, 12, 16, 20)");
    }
}
