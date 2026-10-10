import java.util.Arrays;

public class MatrixDemo {
    public static void main(String[] args) {
        // a 2-D array is an array of rows
        int[][] m = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        int rows = m.length;
        int cols = m[0].length;
        System.out.println(rows + " x " + cols + ", m[1][2] = " + m[1][2]);

        // row-major traversal, row sums, column sums, diagonal
        int[] rowSum = new int[rows];
        int[] colSum = new int[cols];
        int diagonal = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                rowSum[i] += m[i][j];
                colSum[j] += m[i][j];
                if (i == j) diagonal += m[i][j];
            }
        }
        System.out.println("row sums " + Arrays.toString(rowSum) + " column sums " + Arrays.toString(colSum) + " diagonal " + diagonal);

        // transpose into a new matrix
        int[][] t = new int[cols][rows];
        for (int i = 0; i < rows; i++)
            for (int j = 0; j < cols; j++)
                t[j][i] = m[i][j];
        System.out.println("transpose: " + Arrays.deepToString(t));

        // jagged array: rows of different length
        int[][] tri = new int[4][];
        for (int i = 0; i < 4; i++) {
            tri[i] = new int[i + 1];
            tri[i][0] = tri[i][i] = 1;
            for (int j = 1; j < i; j++) tri[i][j] = tri[i - 1][j - 1] + tri[i - 1][j];
        }
        System.out.println("Pascal: " + Arrays.deepToString(tri));
    }
}
