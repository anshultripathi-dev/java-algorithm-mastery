import java.util.Scanner;

public class Ex1 {
    static class Animal {
        String sound() { return "..."; }
    }

    static class Dog extends Animal {
        @Override String sound() { return "Woof"; }
    }

    static class Cat extends Animal {
        @Override String sound() { return "Meow"; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            String kind = sc.next();
            Animal a = kind.equals("dog") ? new Dog() : kind.equals("cat") ? new Cat() : new Animal();
            sb.append(sb.length() == 0 ? "" : " ").append(a.sound());
        }
        System.out.println(sb);
    }
}
