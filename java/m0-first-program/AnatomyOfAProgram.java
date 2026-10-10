// A comment: ignored by the compiler. Use comments to explain WHY, not WHAT.
/* A block comment
   can span several lines. */
public class AnatomyOfAProgram {              // 1. a class: the container; its name matches the file name
    public static void main(String[] args) { // 2. main: where execution starts
        int apples = 3;                       // 3. a statement ends with a semicolon
        int oranges = 4;
        int fruit = apples + oranges;         // 4. an expression computed from variables
        System.out.println("Fruit: " + fruit);// 5. output
    }                                         // braces { } group statements into a block
}
