public class PascalTriangle {
    // C(n, r) = C(n-1, r-1) + C(n-1, r)  -- pick the last item or skip it.
    public static void main(String[] args) {
        int rows = 6;
        long[][] c = new long[rows][rows];
        for (int n = 0; n < rows; n++) {
            c[n][0] = 1;
            for (int r = 1; r <= n; r++) {
                c[n][r] = c[n - 1][r - 1] + (r <= n - 1 ? c[n - 1][r] : 0);
            }
        }
        for (int n = 0; n < rows; n++) {
            StringBuilder line = new StringBuilder();
            for (int r = 0; r <= n; r++) {
                line.append(c[n][r]).append(' ');
            }
            System.out.println(line.toString().trim());
        }
    }
}
