import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class Ex3 {
    // Implementing Comparable<T> gives a class a natural ordering usable by sort().
    static class Version implements Comparable<Version> {
        final int major, minor;

        Version(String s) {
            String[] p = s.split("\\.");
            major = Integer.parseInt(p[0]);
            minor = Integer.parseInt(p[1]);
        }

        @Override
        public int compareTo(Version o) {
            if (major != o.major) return Integer.compare(major, o.major);
            return Integer.compare(minor, o.minor);
        }

        @Override
        public String toString() {
            return major + "." + minor;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Version> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(new Version(sc.next()));
        Collections.sort(list);
        StringBuilder sb = new StringBuilder();
        for (Version v : list) sb.append(sb.length() == 0 ? "" : " ").append(v);
        System.out.println(sb);
    }
}
