public class MoveFirstHyphen {
    // The lecture version: only the FIRST hyphen moves to the front.
    static String moveHyphenToBeginning(String s) {
        int hyphenIndex = s.indexOf('-');
        if (hyphenIndex < 0) {
            return s;                               // no hyphen: nothing to do
        }
        return "-" + s.substring(0, hyphenIndex) + s.substring(hyphenIndex + 1);
    }

    public static void main(String[] args) {
        System.out.println(moveHyphenToBeginning("face-prep"));
        System.out.println(moveHyphenToBeginning("a-b-c"));
        System.out.println(moveHyphenToBeginning("nohyphen"));
    }
}
