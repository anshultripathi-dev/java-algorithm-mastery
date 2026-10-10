public class StringsDemo {
    public static void main(String[] args) {
        String s = "Java Programming";
        System.out.println(s.length());                      // 16
        System.out.println(s.charAt(0) + " " + s.charAt(s.length() - 1));
        System.out.println(s.substring(5));                  // Programming
        System.out.println(s.substring(0, 4));               // Java
        System.out.println(s.indexOf("gram") + " " + s.indexOf('z'));   // 8 and -1
        System.out.println(s.toUpperCase() + " | " + s.replace('a', '@'));
        System.out.println(s.contains("Pro") + " " + s.startsWith("Ja") + " " + s.endsWith("ing"));

        // comparing: equals vs ==
        String a = "hello";
        String b = new String("hello");
        System.out.println((a == b) + " " + a.equals(b) + " " + a.equalsIgnoreCase("HELLO"));
        System.out.println("apple".compareTo("banana") + " " + "b".compareTo("a"));

        // split / join / trim
        String csv = " red, green ,blue ";
        for (String part : csv.trim().split("\\s*,\\s*")) {
            System.out.print("[" + part + "]");
        }
        System.out.println();
        System.out.println(String.join("-", "2026", "10", "10"));

        // strings are IMMUTABLE: methods return new strings
        String t = "abc";
        t.toUpperCase();                                    // result thrown away
        System.out.println(t + " " + t.toUpperCase());

        // StringBuilder: mutable, efficient for many edits
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            sb.append(i).append(',');
        }
        sb.setLength(sb.length() - 1);                      // drop the trailing comma
        sb.insert(0, '[').append(']');
        System.out.println(sb + "  reversed: " + new StringBuilder("stressed").reverse());

        // char operations
        char c = 'q';
        System.out.println(Character.isLetter(c) + " " + Character.isDigit('7') + " " + Character.toUpperCase(c) + " " + (char) (c + 1) + " " + (c - 'a'));
        char[] letters = "hello".toCharArray();
        java.util.Arrays.sort(letters);
        System.out.println(new String(letters));
    }
}
