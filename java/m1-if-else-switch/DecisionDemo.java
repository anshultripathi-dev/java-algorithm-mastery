import java.util.Scanner;

public class DecisionDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int marks = sc.nextInt();

        // if / else if / else: the FIRST true condition wins, the rest are skipped
        char grade;
        if (marks >= 90) {
            grade = 'A';
        } else if (marks >= 75) {
            grade = 'B';
        } else if (marks >= 50) {
            grade = 'C';
        } else {
            grade = 'F';
        }
        System.out.println("grade " + grade);

        // nested if
        if (marks >= 50) {
            if (marks % 2 == 0) {
                System.out.println("pass, even marks");
            } else {
                System.out.println("pass, odd marks");
            }
        }

        // switch: choose by exact value; break stops the fall-through
        int day = sc.nextInt();
        switch (day) {
            case 6:
            case 7:
                System.out.println("weekend");
                break;
            case 1:
                System.out.println("Monday");
                break;
            default:
                System.out.println("another weekday");
        }
    }
}
