import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Ex3 {
    // An "immutable" class that leaks its list: fix by copying defensively.
    static final class Team {
        private final List<String> members;

        Team(List<String> members) {
            this.members = new ArrayList<>(members);          // defensive copy in
        }

        List<String> getMembers() {
            return Collections.unmodifiableList(members);     // read-only view out
        }
    }

    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("Asha", "Ravi"));
        Team t = new Team(source);
        source.add("Intruder");                               // does not affect the Team
        System.out.println(t.getMembers());
        try {
            t.getMembers().add("Hacker");
        } catch (UnsupportedOperationException e) {
            System.out.println("read-only");
        }
    }
}
