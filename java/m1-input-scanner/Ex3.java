import java.util.Scanner;

public class Ex3 {
    // A name on the first line, an age on the second: the classic nextInt / nextLine trap.
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        sc.nextLine();                         // throw away the end of the age line
        String name = sc.nextLine();
        System.out.println(name + " is " + age);
    }
}
