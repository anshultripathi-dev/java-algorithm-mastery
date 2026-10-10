public class CommandLineArgs {
    // run:  java CommandLineArgs 67 98 91
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("no arguments given; try: java CommandLineArgs 67 98 91");
            return;
        }
        double sum = 0;
        for (String s : args) {
            sum += Double.parseDouble(s);      // arguments are ALWAYS Strings
        }
        System.out.println("average = " + sum / args.length);
        if (args.length >= 2) {
            System.out.println("args[0] + args[1] as text   : " + (args[0] + args[1]));       // joining strings, NOT adding
            System.out.println("as numbers they add up to   : " + (Integer.parseInt(args[0]) + Integer.parseInt(args[1])));
        }
    }
}
