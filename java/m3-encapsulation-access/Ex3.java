public class Ex3 {
    // Which members are accessible? A tiny demonstration with output you can predict.
    static class Vault {
        private int secret = 42;
        int packageLevel = 7;
        protected int family = 3;
        public int open = 1;

        int reveal() { return secret; }      // inside the class: private is accessible
    }

    public static void main(String[] args) {
        Vault v = new Vault();
        // v.secret would be fine here only because Vault is a nested class of Ex3; the lesson explains the rule.
        System.out.println(v.reveal() + " " + v.packageLevel + " " + v.family + " " + v.open);
    }
}
