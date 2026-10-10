import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

export const classesObjects: Lesson = lesson({
  id: 'm3-classes-objects',
  dryRun: { algo: 'object-creation', input: { name: 'Ana', age: '20' }, caption: 'new allocates, the constructor initialises, references alias.' },
  module: 'm3',
  title: 'Classes, Objects, Fields, Constructors and `this`',
  summary: 'Define your own types: a blueprint (class) with data (fields) and behaviour (methods), and objects built from it.',
  level: 'beginner',
  track: 'syntax',
  minutes: 40,
  essential: false,
  prerequisites: ['m1-methods', 'm2-references-memory'],
  objectives: [
    'Declare a class with fields, constructors and methods, and create objects with `new`.',
    'Explain what `this` refers to and use constructor overloading and `this(...)`.',
    'Override `toString()` to print an object readably.',
    'Describe how object variables hold references (aliasing).',
  ],
  intuition: [
    p('So far all data has been numbers, Strings and arrays. A **class** lets you invent a new kind of thing: it bundles **fields** (what an object *has*) with **methods** (what it can *do*). An **object** is one concrete instance built from the class with `new`.'),
    pre(`
class Student {              ← blueprint
    String name;             ← fields (state)
    int marks;
    Student(String name, int marks) { this.name = name; this.marks = marks; }   ← constructor
    boolean passed() { return marks >= 40; }                                   ← method
}
Student asha = new Student("Asha", 82);   ← an object (instance)
`),
    why('Grouping data and the operations on it removes whole classes of mistakes: a Student always has both a name and marks, and the only code that interprets marks lives next to the data. In algorithm code you will mostly use small classes as **records** (`Point`, `Edge`, `Interval`) and let library classes (`ArrayList`, `HashMap`) do the heavy lifting.'),
    ul('**Constructor:** same name as the class, no return type; runs on `new` and sets the fields up. If you write none, Java supplies an empty default constructor.', '**`this`:** the object the method/constructor is working on. It disambiguates `this.name = name;` and lets one constructor call another with `this(...)`.', '**Object variables hold references:** `Student b = a;` copies the reference, so both names reach one object (see the references lesson).', '**`toString()`:** called automatically when an object is printed or concatenated to a String — override it to avoid output such as `Student@1b6d3586`.'),
  ],
  syntax: [
    code(`
public class Student {
    private String name;                  // fields (the object's state)
    private int age;

    public Student(String name, int age) {   // constructor: same name as the class, no return type
        this.name = name;                 // this.field = parameter
        this.age = age;
    }
    public Student(String name) { this(name, 18); }   // constructor chaining

    public String getName() { return name; }          // methods (behaviour)
    public void birthday() { age++; }
    @Override public String toString() { return name + " (" + age + ")"; }
}
Student s = new Student("Ana", 20);       // create an object
s.birthday();                              // call a method
`),
  ],
  tiny: [code(`
class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
}
Point p = new Point(3, 4);
System.out.println(p.x + p.y);   // 7
`)],
  guided: [prog('m3-classes-objects/ClassesDemo.java', 'A Student class: fields, two constructors, a method, toString and an alias')],
  programs: [
    {
      file: 'm3-classes-objects/ClassesDemo.java',
      title: 'A Student class',
      role: 'demo',
      description: 'The class is nested as `static class Student` only to keep everything in one file.',
      walkthrough: [
        { at: 'String name;', text: 'Fields: each Student object has its own copy.' },
        { at: 'this.name = name;', text: '`this.name` is the field; plain `name` is the parameter that shadows it.' },
        { at: 'this(name, 0);', text: 'Constructor chaining: reuse the two-argument constructor.' },
        { at: 'boolean passed()', text: 'A method can use the fields of its own object directly.' },
        { at: 'public String toString()', text: 'Overrides Object.toString so printing shows "Asha (82)".' },
        { at: 'Student alias = asha;', text: 'No new object: alias and asha refer to the same Student.' },
      ],
    },
  ],
  complexity: [p('Creating an object is O(1) plus its constructor work; accessing a field or calling a method is O(1) plus the method\'s own cost. Memory: the sum of the field sizes plus a small object header (about 12–16 bytes).')],
  mistakes: [
    { title: 'Assigning the parameter to itself', wrong: 'Student(String name, int marks) {\n    name = name;   // does nothing useful\n}', why: 'Both sides are the parameter; the field stays null.', fix: 'this.name = name;' },
    { title: 'Calling an instance method without an object', wrong: 'public static void main(...) { passed(); }', why: 'passed() needs an object to work on.', fix: 'asha.passed();' },
    { title: 'Using an object before creating it', wrong: 'Student s;\nSystem.out.println(s.marks);', why: 'The variable is unassigned / null (NullPointerException).', fix: 'Student s = new Student("A", 1);' },
  ],
  practice: [
    { id: 'cls-ex1', level: 'beginner', title: 'Rectangle class', statement: 'Create a class Rectangle with width and height, and methods area() and perimeter(). Read width and height (decimals) and print `area perimeter`.', examples: [{ input: '2.5 4', output: '10.0 13.0' }], hints: ['A constructor that stores both fields.'], solutionFile: 'm3-classes-objects/Ex1.java', solutionExplain: 'Fields + constructor + two methods that use the fields.', tests: [{ stdin: '2.5 4\n', stdout: '10.0 13.0' }, { stdin: '1 1\n', stdout: '1.0 4.0' }] },
    { id: 'cls-ex2', level: 'intermediate', title: 'Counter', statement: 'Create a Counter with increment(), add(k) and get(). Read n operations: `inc` or `add k`. Print the final value.', examples: [{ input: '4\ninc\nadd 5\ninc\nadd 10', output: '17' }], hints: ['A private int field.'], solutionFile: 'm3-classes-objects/Ex2.java', solutionExplain: 'State in a field changed only through methods.', tests: [{ stdin: '4\ninc\nadd 5\ninc\nadd 10\n', stdout: '17' }, { stdin: '1\ninc\n', stdout: '1' }] },
    { id: 'cls-ex3', level: 'intermediate', title: 'Distance between points', statement: 'Create a Point class with a method distanceTo(Point). Read x1 y1 x2 y2 and print the distance with three decimals.', examples: [{ input: '0 0 3 4', output: '5.000' }], hints: ['Math.sqrt(dx*dx + dy*dy)'], solutionFile: 'm3-classes-objects/Ex3.java', solutionExplain: 'A method that takes another object of the same class.', tests: [{ stdin: '0 0 3 4\n', stdout: '5.000' }, { stdin: '1 1 1 1\n', stdout: '0.000' }, { stdin: '-1 -1 2 3\n', stdout: '5.000' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'What is the difference between a class and an object?', options: ['none', 'a class is a blueprint; an object is an instance of it', 'an object is a blueprint', 'a class is created with new'], answer: 1, explain: 'new Student(...) builds an object from the Student class.' },
    { type: 'output', q: 'What is printed?', code: 'class P { int v; P(int v) { this.v = v; } }\nP a = new P(1);\nP b = a;\nb.v = 5;\nSystem.out.println(a.v);', answer: '5', explain: 'a and b are the same object.' },
    { type: 'mcq', q: 'A constructor…', options: ['has a return type void', 'has the same name as the class and no return type', 'must be static', 'is called manually'], answer: 1, explain: 'Written like a method without a return type.' },
    { type: 'mcq', q: 'What does `this` refer to inside a method?', options: ['the class', 'the object the method was called on', 'the parent class', 'the main method'], answer: 1, explain: 'The current object.' },
  ],
  interview: ['Class vs object?', 'What is a constructor? Can it be overloaded?', 'What happens if you do not define a constructor?', 'Why override toString()?'],
  videos: ['m3-classes-objects', 'm3-classes-objects#2'],
  revision: ['class = fields + constructors + methods; object = new Class(...).', 'this = current object; this(...) chains constructors.', 'Object variables are references; = aliases.', 'Override toString for printing.'],
});

export const encapsulation: Lesson = lesson({
  id: 'm3-encapsulation-access',
  dryRun: { algo: 'access-check', input: { modifier: 'private', caller: 'same-package' }, caption: 'Change the modifier and the caller to fill the table.' },
  module: 'm3',
  title: 'Encapsulation and Access Modifiers',
  summary: 'Hide the data, expose a safe interface: private fields, getters/setters, and the four access levels.',
  level: 'beginner',
  track: 'syntax',
  minutes: 30,
  essential: false,
  prerequisites: ['m3-classes-objects'],
  objectives: [
    'Make fields private and expose behaviour through public methods.',
    'Enforce an invariant (a rule that must always hold) inside the class.',
    'List what `private`, package-private, `protected` and `public` allow.',
    'Know when a getter/setter pair is appropriate and when it is not.',
  ],
  intuition: [
    p('**Encapsulation** means keeping an object\'s data private and letting outsiders touch it only through methods the class controls. The class can then guarantee its **invariants** — for example "a bank balance never goes negative".'),
    table(['modifier', 'same class', 'same package', 'subclass (other package)', 'everyone'], [['private', '✓', '✗', '✗', '✗'], ['(none) package-private', '✓', '✓', '✗', '✗'], ['protected', '✓', '✓', '✓', '✗'], ['public', '✓', '✓', '✓', '✓']]),
    why('If `balance` were public, any line of code anywhere could set it to −1000 and you would have to search the whole program to find the culprit. With a private field and a `withdraw` method that refuses overdrafts, **one** method is the only place the rule can be broken — and the only place to fix. Private fields also let you change the internal representation later (cents as `long` instead of dollars as `double`) without touching any caller.'),
    ul('Start with everything `private`; widen only when needed.', 'Provide a getter only if outsiders need to read the value; provide a setter only if arbitrary values are valid (or validate inside it).', 'Prefer *meaningful* methods (`deposit`, `withdraw`) to bare setters.', 'Mark fields that never change `final`.'),
  ],
  syntax: [
    table(['modifier', 'same class', 'same package', 'subclass (other package)', 'anywhere'], [['`private`', '✓', '✗', '✗', '✗'], ['(none) package-private', '✓', '✓', '✗', '✗'], ['`protected`', '✓', '✓', '✓', '✗'], ['`public`', '✓', '✓', '✓', '✓']]),
    code(`
public class Account {
    private double balance;                       // hidden state
    public double getBalance() { return balance; }            // read access
    public void deposit(double amount) {                      // controlled change
        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");
        balance += amount;
    }
}
`, 'Getter / validating setter'),
  ],
  tiny: [code(`
class Account {
    private long cents;
    void deposit(long c) { if (c > 0) cents += c; }
    long balance() { return cents; }
}
`)],
  guided: [prog('m3-encapsulation-access/EncapsulationDemo.java', 'A BankAccount whose invariant (no negative balance) is enforced by its methods')],
  programs: [
    {
      file: 'm3-encapsulation-access/EncapsulationDemo.java',
      title: 'Protecting an invariant',
      role: 'demo',
      description: 'All state is private; only deposit/withdraw change it.',
      walkthrough: [
        { at: 'private final String owner;', text: 'private + final: set once in the constructor and never visible for modification.' },
        { at: 'if (openingCents < 0)', text: 'The constructor validates: an object can never be created in an invalid state.' },
        { at: 'if (cents <= 0 || cents > balanceCents)', text: 'withdraw refuses rather than break the "balance ≥ 0" rule.' },
        { at: 'public long getBalanceCents()', text: 'A read-only getter: callers can see the balance but not set it.' },
      ],
    },
  ],
  complexity: [p('Access control is a compile-time check: no run-time cost.')],
  mistakes: [
    { title: 'Public fields', wrong: 'public int balance;', why: 'Any code can write an invalid value.', fix: 'private long balanceCents; with methods' },
    { title: 'A setter that validates nothing', wrong: 'void setAge(int a) { age = a; }', why: 'It is just a public field with extra typing.', fix: 'if (a < 0) throw new IllegalArgumentException(...)' },
    { title: 'Returning an internal mutable object', wrong: 'List<String> getItems() { return items; }', why: 'The caller can modify your list directly.', fix: 'return Collections.unmodifiableList(items);' },
  ],
  practice: [
    { id: 'enc-ex1', level: 'beginner', title: 'Validated temperature', statement: 'Create a Temperature class whose setCelsius rejects values below −273.15 by throwing IllegalArgumentException. Read a Celsius value; print the Fahrenheit value with one decimal, or `invalid: below absolute zero`.', examples: [{ input: '36.6', output: '97.9' }], hints: ['catch the exception in main.'], solutionFile: 'm3-encapsulation-access/Ex1.java', solutionExplain: 'The setter protects the invariant.', tests: [{ stdin: '36.6\n', stdout: '97.9' }, { stdin: '-300\n', stdout: 'invalid: below absolute zero' }, { stdin: '100\n', stdout: '212.0' }] },
    { id: 'enc-ex2', level: 'intermediate', title: 'Bounded stack', statement: 'Implement an int stack of capacity 3 with push (returns false if full) and pop. Read n commands (`push x` or `pop`); print `ok`/`full` for pushes and the popped value or `empty` for pops.', examples: [{ input: '5\npush 1\npush 2\npop\npop\npop', output: 'ok ok 2 1 empty' }], hints: ['A private array and a private size.'], solutionFile: 'm3-encapsulation-access/Ex2.java', solutionExplain: 'The array is hidden: callers cannot corrupt size.', tests: [{ stdin: '5\npush 1\npush 2\npop\npop\npop\n', stdout: 'ok ok 2 1 empty' }, { stdin: '5\npush 1\npush 2\npush 3\npush 4\npop\n', stdout: 'ok ok ok full 3' }] },
    { id: 'enc-ex3', level: 'beginner', title: 'Access levels', statement: 'Run the program: it prints the values of four fields declared with private, package-private, protected and public inside a class. (The output `42 7 3 1` shows they are all reachable from inside the same top-level class.)', examples: [{ input: '(no input)', output: '42 7 3 1' }], hints: ['Read the lesson table: same-class access is always allowed.'], solutionFile: 'm3-encapsulation-access/Ex3.java', solutionExplain: 'Nested classes share access with their enclosing class; across top-level classes in different packages only public (and protected for subclasses) would be visible.', tests: [{ stdin: '', stdout: '42 7 3 1' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Which modifier makes a member visible only inside its own class?', options: ['public', 'protected', 'private', 'default'], answer: 2, explain: 'private.' },
    { type: 'mcq', q: 'Why make fields private?', options: ['to make the program faster', 'so the class can enforce its rules and change internals later', 'because Java requires it', 'to save memory'], answer: 1, explain: 'Encapsulation protects invariants.' },
    { type: 'mcq', q: 'A member with no modifier is visible…', options: ['everywhere', 'in the same package', 'only in the class', 'in subclasses only'], answer: 1, explain: 'Package-private.' },
    { type: 'bug', q: 'Which line breaks encapsulation?', code: 'class Account {\n    public long balance;\n    void deposit(long c) { balance += c; }\n}', answerLine: 2, explain: 'A public mutable field can be set to anything.' },
  ],
  interview: ['What is encapsulation?', 'Difference between protected and default access?', 'Why avoid returning internal collections?', 'What is an invariant?'],
  videos: ['m3-encapsulation-access', 'm3-encapsulation-access#2'],
  revision: ['private fields + public methods.', 'private < package < protected < public.', 'Validate in constructors/setters.', 'Do not leak mutable internals.'],
});

export const inheritance: Lesson = lesson({
  id: 'm3-inheritance-polymorphism',
  dryRun: { algo: 'dynamic-dispatch', input: { cls: 'Puppy' }, caption: 'The JVM starts at the real class and walks up until it finds speak().' },
  module: 'm3',
  title: 'Inheritance, Overriding and Polymorphism',
  summary: 'Build new classes from existing ones with `extends`, redefine behaviour with `@Override`, and let one variable type stand for many.',
  level: 'intermediate',
  track: 'syntax',
  minutes: 45,
  essential: false,
  prerequisites: ['m3-encapsulation-access'],
  objectives: [
    'Write a subclass with `extends`, `super(...)` and `@Override`.',
    'Explain dynamic dispatch: the method that runs depends on the object\'s actual type.',
    'Use a superclass reference to hold subclass objects and `instanceof` to test them.',
    'Know when composition ("has-a") is better than inheritance ("is-a").',
  ],
  intuition: [
    p('**Inheritance** lets a class (the **subclass**) reuse and extend another (the **superclass**): `class Circle extends Shape`. A Circle *is a* Shape, so it has all of Shape\'s non-private members and can be used wherever a Shape is expected.'),
    p('A subclass may **override** a method — provide its own version with the same signature. **Polymorphism** ("many forms"): a variable of the superclass type may refer to any subclass object, and the call `shape.area()` runs the **subclass\'s** version, chosen at run time.'),
    pre(`
Shape s = new Circle(1);       static (declared) type: Shape
s.area();                      actual type: Circle → Circle.area() runs

Shape ← Rectangle ← Square     a Square is also a Rectangle and a Shape
`),
    why('Polymorphism lets you write code against the general type (`for (Shape s : shapes) total += s.area();`) and add new shapes later without touching that loop. Constructors run **parent first**: `super(...)` must be the first statement of a subclass constructor (the compiler inserts `super()` if you omit it). `super.method()` calls the parent\'s version from inside an override.'),
    ul('Use `@Override` — the compiler then checks that you really override something.', '`final` classes cannot be extended; `final` methods cannot be overridden.', '`instanceof` tests the actual type; casting `(Rectangle) s` is checked at run time (ClassCastException if wrong).', 'Prefer **composition** when the relationship is "has-a" (a Car *has* an Engine) or when you only want to reuse code.'),
  ],
  syntax: [
    code(`
class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {                       // Dog IS-A Animal
    Dog(String name) { super(name); }            // call the parent constructor FIRST
    @Override void speak() {                      // @Override: compiler checks the signature
        super.speak();                            // optionally reuse the parent version
        System.out.println("Woof");
    }
}
Animal a = new Dog("Rex");                        // parent-type variable, child object
a.speak();                                        // Dog's version runs (dynamic dispatch)
if (a instanceof Dog d) { d.name.length(); }      // test + cast (Java 16+)
`),
    ul('`final class X` cannot be extended; `final void m()` cannot be overridden.', 'A class has exactly one superclass (`extends`) but may implement many interfaces.'),
  ],
  tiny: [code(`
class Animal { String sound() { return "..."; } }
class Dog extends Animal { @Override String sound() { return "Woof"; } }
Animal a = new Dog();
System.out.println(a.sound());   // Woof
`)],
  guided: [prog('m3-inheritance-polymorphism/ShapesDemo.java', 'Shape → Circle, Rectangle → Square with overriding, super and instanceof')],
  programs: [
    {
      file: 'm3-inheritance-polymorphism/ShapesDemo.java',
      title: 'A shape hierarchy',
      role: 'demo',
      description: 'The list holds different kinds of shapes; area() is chosen per object.',
      walkthrough: [
        { at: 'super("Circle");', text: 'Call the parent constructor first.' },
        { at: '@Override', text: 'Same signature as Shape.area(); the compiler verifies it.' },
        { at: 'return "Square! " + super.toString();', text: 'super.toString() reuses Shape\'s version.' },
        { at: 'List<Shape> shapes = List.of(', text: 'One list type, four different object types.' },
        { at: 'if (s instanceof Rectangle rect)', text: 'Pattern matching: test and cast in one step (Java 16+).' },
      ],
    },
  ],
  complexity: [p('A virtual method call costs a table lookup — O(1) and nearly free in practice (the JIT often inlines it).')],
  mistakes: [
    { title: 'Overloading instead of overriding', wrong: 'class Dog extends Animal {\n    String sound(int times) { ... }   // different parameters!\n}', why: 'This is a new method, not an override; `animal.sound()` still returns "...". @Override would have flagged it.', fix: '@Override String sound() { ... }' },
    { title: 'Forgetting super(...) when the parent has no default constructor', wrong: 'class Child extends Parent {\n    Child() { }   // Parent(int) only\n}', why: 'The compiler cannot insert super() because Parent has no no-argument constructor.', fix: 'Child() { super(5); }' },
    { title: 'Calling a subclass-only method through the parent type', wrong: 'Shape s = new Circle(1);\ns.radius();', why: 'The static type Shape has no radius().', fix: '((Circle) s).radius();   // after an instanceof test' },
  ],
  practice: [
    { id: 'inh-ex1', level: 'beginner', title: 'Animal sounds', statement: 'Create Animal (sound "..."), Dog ("Woof") and Cat ("Meow"). Read n kinds (`dog`, `cat` or anything else = plain animal) and print each sound separated by spaces.', examples: [{ input: '3\ndog\ncat\nfish', output: 'Woof Meow ...' }], hints: ['Store each as an Animal reference and call sound().'], solutionFile: 'm3-inheritance-polymorphism/Ex1.java', solutionExplain: 'Polymorphic call: the object\'s class decides the output.', tests: [{ stdin: '3\ndog\ncat\nfish\n', stdout: 'Woof Meow ...' }, { stdin: '1\ncat\n', stdout: 'Meow' }] },
    { id: 'inh-ex2', level: 'intermediate', title: 'Payroll', statement: 'Employee pays base; Manager pays 1.5 × base. Read n lines `role name base` (role manager or staff) and print the total pay with two decimals.', examples: [{ input: '2\nmanager Ann 1000\nstaff Bob 800', output: '2300.00' }], hints: ['Override pay() in Manager.'], solutionFile: 'm3-inheritance-polymorphism/Ex2.java', solutionExplain: 'The same loop works for every employee type.', tests: [{ stdin: '2\nmanager Ann 1000\nstaff Bob 800\n', stdout: '2300.00' }, { stdin: '1\nstaff Z 10\n', stdout: '10.00' }] },
    { id: 'inh-ex3', level: 'beginner', title: 'Predict the order', statement: 'Run the program and write down the output: the constructors of a parent and child class, and a call through a parent-typed variable.', examples: [{ input: '(no input)', output: 'A()\nB()\nB' }], hints: ['Parent constructor first; the object is a B.'], solutionFile: 'm3-inheritance-polymorphism/Ex3.java', solutionExplain: 'new B() runs A() then B(); who() is dispatched on the actual object (B).', tests: [{ stdin: '', stdout: 'A()\nB()\nB' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'class A { String f() { return "A"; } }\nclass B extends A { String f() { return "B"; } }\nA x = new B();\nSystem.out.println(x.f());', answer: 'B', explain: 'Dynamic dispatch uses the actual type.' },
    { type: 'mcq', q: 'Which keyword calls the parent constructor?', options: ['this', 'super', 'parent', 'base'], answer: 1, explain: 'super(...).' },
    { type: 'mcq', q: 'Which relationship suggests composition rather than inheritance?', options: ['Dog is an Animal', 'Car has an Engine', 'Circle is a Shape', 'Manager is an Employee'], answer: 1, explain: '"has-a".' },
    { type: 'mcq', q: 'In the parent-child constructor chain, which runs first?', options: ['child body', 'parent constructor', 'static main', 'neither'], answer: 1, explain: 'Parent first.' },
  ],
  interview: ['Overloading vs overriding?', 'What is polymorphism?', 'Can you override a static method? a private method?', 'Why prefer composition?'],
  videos: ['m3-inheritance-polymorphism', 'm3-inheritance-polymorphism#2'],
  revision: ['extends, super(...), @Override.', 'Dynamic dispatch: actual type decides.', 'instanceof + cast.', 'is-a → inheritance; has-a → composition.'],
});

export const abstraction: Lesson = lesson({
  id: 'm3-abstraction-interfaces',
  dryRun: { algo: 'interface-check', input: { impl: 'area,perimeter', abs: 'no' }, caption: 'A concrete class that forgets one method does not compile.' },
  module: 'm3',
  title: 'Abstract Classes and Interfaces',
  summary: 'Define what something must do without saying how: abstract methods, interfaces, default methods and Comparable.',
  level: 'intermediate',
  track: 'syntax',
  minutes: 40,
  essential: false,
  prerequisites: ['m3-inheritance-polymorphism'],
  objectives: [
    'Declare an abstract class with abstract methods and extend it.',
    'Declare and implement an interface, including default methods.',
    'Choose between an abstract class and an interface.',
    'Implement `Comparable<T>` to give your class a natural order.',
  ],
  intuition: [
    p('An **abstract class** is a partly finished class: it can hold fields and real methods, but also **abstract methods** (a signature with no body) that every concrete subclass must supply. You cannot create an object of an abstract class.'),
    p('An **interface** is a pure contract: a list of methods a type promises to have. A class can **implement many interfaces** but extend only one class. Interface methods are `public abstract` by default; since Java 8 they may also have **default** (with a body) and **static** methods.'),
    table(['', 'abstract class', 'interface'], [['state (fields)', 'yes', 'only constants'], ['constructors', 'yes', 'no'], ['multiple per class', 'no (one superclass)', 'yes'], ['use when', 'subclasses share code/state', 'unrelated classes share a capability']]),
    why('Programming against an interface decouples **what** from **how**: a method taking `List<Integer>` works with an `ArrayList` or a `LinkedList`; a sort that needs `Comparable` works for any class that implements it. This is the single most important design idea for reusable code, and it is how the Java Collections Framework is organised.'),
  ],
  syntax: [code(`
interface Payable { double amountDue(); default String describe() { return "pay " + amountDue(); } }
abstract class Employee implements Payable { abstract double monthlyPay(); public double amountDue() { return monthlyPay(); } }
class Hourly extends Employee { double monthlyPay() { return 25 * 80; } }
`)],
  tiny: [code(`
interface Shape { double area(); }
class Square implements Shape {
    double s;
    public double area() { return s * s; }   // interface methods are public
}
`)],
  guided: [prog('m3-abstraction-interfaces/AbstractionDemo.java', 'An interface, an abstract class implementing it, two concrete subclasses and an unrelated implementer')],
  programs: [
    {
      file: 'm3-abstraction-interfaces/AbstractionDemo.java',
      title: 'Payable and Employee',
      role: 'demo',
      description: 'One list holds employees and an invoice because they share the Payable contract.',
      walkthrough: [
        { at: 'interface Payable', text: 'The contract: anything Payable can report an amount due.' },
        { at: 'default String describe()', text: 'A default method gives implementers free behaviour that they may override.' },
        { at: 'static abstract class Employee implements Payable', text: 'An abstract class may implement an interface and leave some methods for subclasses.' },
        { at: 'abstract double monthlyPay();', text: 'No body: each concrete subclass MUST implement it.' },
        { at: 'static class Invoice implements Payable', text: 'Unrelated to Employee yet usable wherever Payable is expected.' },
      ],
    },
  ],
  complexity: [p('Interface dispatch is O(1). The design choice affects maintainability, not asymptotic cost.')],
  mistakes: [
    { title: 'Instantiating an abstract class', wrong: 'Employee e = new Employee("x");', why: 'Compile error: Employee is abstract; cannot be instantiated.', fix: 'new Salaried("x", 1000)' },
    { title: 'Weaker access in the implementation', wrong: 'class Square implements Shape {\n    double area() { ... }   // package-private', why: 'Interface methods are public; an implementation cannot reduce visibility.', fix: 'public double area()' },
    { title: 'Forgetting to implement all abstract methods', wrong: 'class Hourly extends Employee { }', why: 'Hourly is not abstract, so it must implement monthlyPay().', fix: 'Implement it, or declare Hourly abstract.' },
  ],
  practice: [
    { id: 'abs-ex1', level: 'beginner', title: 'Total area', statement: 'Define an interface Shape with area(); implement Circle and Square. Read n lines `circle r` or `square s` and print the total area with two decimals.', examples: [{ input: '3\ncircle 1\nsquare 2\ncircle 2', output: '19.71' }], hints: ['A list/array of Shape.'], solutionFile: 'm3-abstraction-interfaces/Ex1.java', solutionExplain: 'The loop sees only Shape; each object supplies its own area.', tests: [{ stdin: '3\ncircle 1\nsquare 2\ncircle 2\n', stdout: '19.71' }, { stdin: '1\nsquare 3\n', stdout: '9.00' }] },
    { id: 'abs-ex2', level: 'intermediate', title: 'Abstract Vehicle', statement: 'Create an abstract class Vehicle with an abstract wheels() and a concrete describe() that prints `<ClassName> has <n> wheels`. Read `bike` or `car` and print the description.', examples: [{ input: 'bike', output: 'Bike has 2 wheels' }], hints: ['getClass().getSimpleName()'], solutionFile: 'm3-abstraction-interfaces/Ex2.java', solutionExplain: 'Shared code in the abstract class, variable part in the subclass.', tests: [{ stdin: 'bike\n', stdout: 'Bike has 2 wheels' }, { stdin: 'car\n', stdout: 'Car has 4 wheels' }] },
    { id: 'abs-ex3', level: 'intermediate', title: 'Comparable versions', statement: 'Create class Version implementing Comparable<Version> for strings like `1.10`. Read n versions and print them sorted by major then minor numerically.', examples: [{ input: '4\n1.10\n1.2\n2.0\n1.9', output: '1.2 1.9 1.10 2.0' }], hints: ['Integer.compare on major, then minor.'], solutionFile: 'm3-abstraction-interfaces/Ex3.java', solutionExplain: 'compareTo defines the natural order used by Collections.sort.', tests: [{ stdin: '4\n1.10\n1.2\n2.0\n1.9\n', stdout: '1.2 1.9 1.10 2.0' }, { stdin: '2\n3.1\n3.0\n', stdout: '3.0 3.1' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Which can a class do?', options: ['extend two classes', 'implement several interfaces', 'extend an interface', 'instantiate an interface'], answer: 1, explain: 'One superclass, many interfaces.' },
    { type: 'mcq', q: 'An abstract method…', options: ['has a body', 'has no body and must be implemented by a concrete subclass', 'is private', 'cannot be in a class'], answer: 1, explain: 'It declares a requirement.' },
    { type: 'mcq', q: 'To make `Collections.sort(list)` work for your class, implement…', options: ['Runnable', 'Comparable<T>', 'Serializable', 'Cloneable'], answer: 1, explain: 'compareTo defines the order.' },
    { type: 'mcq', q: 'Unrelated classes that share a capability are best modelled with…', options: ['an abstract class', 'an interface', 'a static method', 'a constructor'], answer: 1, explain: 'An interface.' },
  ],
  interview: ['Abstract class vs interface?', 'What is a default method?', 'Why program to an interface?', 'What is Comparable vs Comparator?'],
  videos: ['m3-abstraction-interfaces', 'm3-abstraction-interfaces#2'],
  revision: ['abstract class: state + partial code; cannot be instantiated.', 'interface: contract; many per class; default methods.', 'Program to the interface.', 'Comparable<T>.compareTo → natural ordering.'],
});

export const staticFinal: Lesson = lesson({
  id: 'm3-static-final-init',
  dryRun: { algo: 'init-order', input: { n: '2' }, caption: 'static block once, then instance block + constructor per object.' },
  module: 'm3',
  title: 'static, final and Initialisation Order',
  summary: 'Members that belong to the class rather than to objects, constants, and what runs when.',
  level: 'intermediate',
  track: 'syntax',
  minutes: 30,
  essential: false,
  prerequisites: ['m3-classes-objects'],
  objectives: [
    'Distinguish static (class-level) and instance (object-level) members.',
    'Use `final` for variables, methods and classes, and `static final` for constants.',
    'Predict the order: static blocks → instance initialisers → constructor.',
    'Explain why `main` is static and why a static method cannot use `this`.',
  ],
  intuition: [
    p('**Instance** members belong to each object (every Student has its own `marks`). **`static`** members belong to the **class** itself: one shared copy, accessible as `ClassName.member` without any object. `Math.sqrt(x)` and `Integer.MAX_VALUE` are static.'),
    table(['keyword', 'on a variable', 'on a method', 'on a class'], [['static', 'one shared copy', 'called on the class; no `this`', 'nested class independent of an outer object'], ['final', 'assigned once (a constant)', 'cannot be overridden', 'cannot be extended (String is final)']]),
    why('`main` is `static` because the JVM must be able to start the program **before any object exists**. For the same reason a static method cannot touch instance fields — there is no `this`. `final` protects the *variable*, not the object it refers to: a `final int[]` can still have its elements changed.'),
    h('Order of initialisation'),
    ol('Class loading: **static** fields/blocks run once, top to bottom.', 'Each `new`: instance field initialisers and **instance blocks** run, in source order…', '…then the **constructor** body.'),
  ],
  syntax: [
    code(`
class Counter {
    static int created = 0;                    // one copy shared by all objects
    final int id;                               // per object; assigned exactly once
    static final double TAX = 0.18;             // a constant: static + final, NAMES_IN_CAPS

    static { System.out.println("class loaded"); }   // static block: once, at class loading
    { created++; }                                   // instance block: before every constructor body
    Counter() { id = created; }
    static int total() { return created; }           // static method: call as Counter.total()
}
`),
    table(['', 'static member', 'instance member'], [['belongs to', 'the class', 'one object'], ['accessed with', '`ClassName.member`', '`object.member`'], ['can use `this`?', 'no', 'yes']]),
  ],
  tiny: [code(`
class Counter {
    static int created = 0;
    static final int MAX = 100;
    Counter() { created++; }
}
`)],
  guided: [prog('m3-static-final-init/StaticFinalDemo.java', 'A Ticket class with static counter, constant, static block, instance block and final array')],
  programs: [
    {
      file: 'm3-static-final-init/StaticFinalDemo.java',
      title: 'Static, final and init order',
      role: 'demo',
      description: 'Watch the order of the bracketed messages.',
      walkthrough: [
        { at: 'static int issued = 0;', text: 'Shared by all tickets: a counter of how many exist.' },
        { at: 'static final double TAX_RATE = 0.18;', text: 'A true constant: one copy, never reassigned, named in UPPER_SNAKE_CASE.' },
        { at: 'static {', text: 'Static block: runs once, the first time the class is used.' },
        { at: 'instance initialiser: runs before every constructor body', text: 'Instance block: runs for EVERY new object before the constructor body.' },
        { at: 'static double withTax(double price)', text: 'A static method: called as Ticket.withTax(100) with no object.' },
        { at: 'final int[] arr = {1, 2, 3};', text: 'final = the variable cannot be re-pointed; the array elements can still change.' },
      ],
    },
  ],
  complexity: [p('No run-time cost. A static field uses one memory location for all objects.')],
  mistakes: [
    { title: 'Using an instance member from static context', wrong: 'static void f() { System.out.println(count); }   // count is an instance field', why: 'No object, so no count: "non-static variable cannot be referenced from a static context".', fix: 'Make it static or call through an object.' },
    { title: 'Mutable static state', wrong: 'static List<Integer> cache = new ArrayList<>();   // shared by everything', why: 'Hidden coupling: one test or caller affects another.', fix: 'Prefer instance state; use static only for constants and pure helpers.' },
    { title: 'Assuming final means immutable object', wrong: 'final List<String> names = new ArrayList<>();\nnames.add("x");   // allowed!', why: 'Only the reference is final.', fix: 'Use List.of(...) or Collections.unmodifiableList for read-only data.' },
  ],
  practice: [
    { id: 'sf-ex1', level: 'beginner', title: 'ID generator', statement: 'Create a class with a static counter and a static method nextId(). Read n and print n generated IDs starting at 1, space separated.', examples: [{ input: '4', output: '1 2 3 4' }], hints: ['private static int next = 1; return next++;'], solutionFile: 'm3-static-final-init/Ex1.java', solutionExplain: 'One shared counter increments on every call.', tests: [{ stdin: '4\n', stdout: '1 2 3 4' }, { stdin: '1\n', stdout: '1' }] },
    { id: 'sf-ex2', level: 'beginner', title: 'A constant', statement: 'Define `static final double PI_APPROX = 3.14159` and a method circleArea(r). Read r and print the area with three decimals.', examples: [{ input: '2', output: '12.566' }], hints: ['printf("%.3f%n", ...)'], solutionFile: 'm3-static-final-init/Ex2.java', solutionExplain: 'A named constant avoids magic numbers.', tests: [{ stdin: '2\n', stdout: '12.566' }, { stdin: '1\n', stdout: '3.142' }] },
    { id: 'sf-ex3', level: 'intermediate', title: 'Initialisation order', statement: 'Run the program that creates two objects of a class with a static block, an instance block and a constructor; write down the order of the five lines.', examples: [{ input: '(no input)', output: 'static block\ninstance block\nconstructor\ninstance block\nconstructor' }], hints: ['Static block once; instance block + constructor for every object.'], solutionFile: 'm3-static-final-init/Ex3.java', solutionExplain: 'The class is loaded once; each object repeats instance init + constructor.', tests: [{ stdin: '', stdout: 'static block\ninstance block\nconstructor\ninstance block\nconstructor' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Why is main declared static?', options: ['for speed', 'the JVM calls it before any object exists', 'to hide it', 'because of the String[] parameter'], answer: 1, explain: 'No object is needed to start the program.' },
    { type: 'mcq', q: 'How many copies of a static field exist?', options: ['one per object', 'one per class', 'one per method', 'zero'], answer: 1, explain: 'A single shared copy.' },
    { type: 'output', q: 'What is printed?', code: 'class C { static int n; C() { n++; } }\nnew C(); new C(); new C();\nSystem.out.println(C.n);', answer: '3', explain: 'The static counter is shared.' },
    { type: 'mcq', q: 'A `final` variable of type int[]…', options: ['cannot be re-assigned but elements can change', 'is completely immutable', 'cannot be read', 'must be static'], answer: 0, explain: 'final protects the reference.' },
  ],
  interview: ['static vs instance?', 'What does final do on a class, method, variable?', 'Order of static and instance initialisation?', 'Can a static method be overridden?'],
  videos: ['m3-static-final-init', 'm3-static-final-init#2'],
  revision: ['static = per class; instance = per object.', 'final = assign once / no override / no extend.', 'Order: static blocks → instance blocks → constructor.', 'static methods have no this.'],
});

export const packagesImports: Lesson = lesson({
  id: 'm3-packages-imports',
  dryRun: { algo: 'import-resolve', input: { imports: 'java.util.*', name: 'List' }, caption: 'The order in which the compiler resolves a simple class name.' },
  module: 'm3',
  title: 'Packages and Imports',
  summary: 'How Java organises classes into namespaces, how `import` works, and the standard packages you will use.',
  level: 'beginner',
  track: 'syntax',
  minutes: 20,
  essential: false,
  prerequisites: ['m0-first-program'],
  objectives: [
    'Write a package declaration and map it to a folder structure.',
    'Use single-class, wildcard and static imports.',
    'Resolve name clashes with fully qualified names.',
    'Name the packages you will use most.',
  ],
  intuition: [
    p('A **package** is a named group of related classes — a namespace that avoids name clashes and organises code. The declaration `package com.shop.billing;` must be the first statement; the file then lives in the folder `com/shop/billing/`.'),
    table(['you write', 'meaning'], [['import java.util.List;', 'use `List` without the full name'], ['import java.util.*;', 'import every class of the package (not sub-packages)'], ['import static java.lang.Math.max;', 'use `max(a, b)` directly'], ['java.util.Date d;', 'fully qualified name: no import needed']]),
    why('`java.lang` (String, Math, System, Integer, Exception…) is imported automatically. Imports are only a **compile-time convenience** — they do not load anything; they just let you write short names. When two imported packages both contain a class called `Date`, use the fully qualified name for at least one of them.'),
    table(['package', 'contents you will meet'], [['java.lang', 'String, Math, Integer, Object, Thread, exceptions'], ['java.util', 'Scanner, ArrayList, HashMap, Arrays, Collections, Random, Optional'], ['java.io', 'BufferedReader, IOException, File'], ['java.math', 'BigInteger, BigDecimal'], ['java.util.function / java.util.stream', 'lambdas and streams']]),
  ],
  syntax: [
    code(`
package com.school.util;                 // first statement: the package of this file

import java.util.List;                    // one class
import java.util.*;                       // every class of the package
import static java.lang.Math.sqrt;        // a static member without the class prefix
`),
    code(`
src/com/school/util/Tools.java            // directory = package name
javac -d out src/com/school/util/Tools.java src/com/school/Main.java
java  -cp out com.school.Main             // run with the FULL class name
`, 'Compile and run from the project root'),
  ],
  tiny: [code(`
import java.util.ArrayList;
import java.util.List;
List<String> names = new ArrayList<>();
`)],
  guided: [prog('m3-packages-imports/ImportsDemo.java', 'Single-class imports, a static import and fully qualified names'), tip('Compiling a program that is inside a package: from the project root run `javac -d out com/shop/billing/Invoice.java` and run `java -cp out com.shop.billing.Invoice`. IDEs do this for you.', 'Command line')],
  programs: [
    {
      file: 'm3-packages-imports/ImportsDemo.java',
      title: 'Imports',
      role: 'demo',
      description: 'The default package is used here, so no package statement appears.',
      walkthrough: [
        { at: 'import static java.lang.Math.max;', text: 'Static import: call max(...) without the class name.' },
        { at: 'java.util.Date now = null;', text: 'A fully qualified name works without any import.' },
        { at: 'getPackageName()', text: 'Prints the package of a class — empty here (default package).' },
      ],
    },
  ],
  complexity: [p('Not applicable (compile-time feature).')],
  mistakes: [
    { title: 'Forgetting an import', wrong: 'List<String> a = new ArrayList<>();   // no import', why: 'cannot find symbol: class List.', fix: 'import java.util.List; import java.util.ArrayList;' },
    { title: 'Folder does not match package', wrong: '// package a.b; but the file is in the folder src/', why: 'The compiler/IDE cannot locate the class.', fix: 'Put the file in a/b/.' },
    { title: 'Importing a clashing wildcard', wrong: 'import java.util.*; import java.sql.*;\nDate d;', why: 'Reference to Date is ambiguous.', fix: 'java.util.Date d;' },
  ],
  practice: [
    { id: 'pkg-ex1', level: 'beginner', title: 'Static import', statement: 'Use a static import of Math.sqrt and print the square root of the input number.', examples: [{ input: '16', output: '4.0' }], hints: ['import static java.lang.Math.sqrt;'], solutionFile: 'm3-packages-imports/Ex1.java', solutionExplain: 'The static import lets you write sqrt(x).', tests: [{ stdin: '16\n', stdout: '4.0' }, { stdin: '2\n', stdout: '1.4142135623730951' }] },
    { id: 'pkg-ex2', level: 'beginner', title: 'Sort with Arrays', statement: 'Read n and an array. Import java.util.Arrays and print the sorted array as `[a, b, c]`.', examples: [{ input: '4\n9 3 7 1', output: '[1, 3, 7, 9]' }], hints: ['Arrays.sort then Arrays.toString'], solutionFile: 'm3-packages-imports/Ex2.java', solutionExplain: 'Two utility methods from one imported class.', tests: [{ stdin: '4\n9 3 7 1\n', stdout: '[1, 3, 7, 9]' }, { stdin: '1\n5\n', stdout: '[5]' }] },
    { id: 'pkg-ex3', level: 'intermediate', title: 'Same name, two packages', statement: 'Create a java.util.Date and a java.sql.Date using fully qualified names and print their class names (one per line).', examples: [{ input: '(no input)', output: 'java.util.Date\njava.sql.Date' }], hints: ['No imports needed.'], solutionFile: 'm3-packages-imports/Ex3.java', solutionExplain: 'Fully qualified names disambiguate clashes.', tests: [{ stdin: '', stdout: 'java.util.Date\njava.sql.Date' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Which package is imported automatically?', options: ['java.util', 'java.io', 'java.lang', 'java.math'], answer: 2, explain: 'java.lang.' },
    { type: 'mcq', q: 'Where must the package statement appear?', options: ['anywhere', 'first in the file', 'after imports', 'inside the class'], answer: 1, explain: 'It is the first statement (comments aside).' },
    { type: 'mcq', q: 'Does `import java.util.*;` import java.util.function.Function?', options: ['yes', 'no — sub-packages are separate'], answer: 1, explain: 'Wildcards cover one package only.' },
    { type: 'mcq', q: 'The folder for `package com.shop.billing;` is…', options: ['com.shop.billing/', 'com/shop/billing/', 'billing/', 'shop/'], answer: 1, explain: 'Dots become folder separators.' },
  ],
  interview: ['What is a package? Why use them?', 'Import vs fully qualified name?', 'What is the default package?', 'What does import static do?'],
  videos: ['m3-packages-imports', 'm3-packages-imports#2'],
  revision: ['package a.b.c; = folder a/b/c.', 'import X; import pkg.*; import static ...;', 'java.lang is automatic.', 'Clash → fully qualified name.'],
});

export const exceptions: Lesson = lesson({
  id: 'm3-exceptions',
  dryRun: { algo: 'exception-flow', input: { d: '0', idx: '1' }, caption: 'A thrown exception skips the rest of try; finally always runs.' },
  module: 'm3',
  title: 'Exceptions: try, catch, finally, throw and throws',
  summary: 'Handle run-time errors on purpose: checked vs unchecked, catching, cleaning up, and defining your own.',
  level: 'intermediate',
  track: 'syntax',
  minutes: 35,
  essential: false,
  prerequisites: ['m0-errors', 'm3-inheritance-polymorphism'],
  objectives: [
    'Use try/catch/finally and multi-catch correctly.',
    'Distinguish checked and unchecked exceptions and apply `throws`.',
    'Throw built-in and custom exceptions with a good message.',
    'Use try-with-resources to close resources automatically.',
  ],
  intuition: [
    p('An **exception** is an object that represents a problem. When code `throw`s one, normal execution stops and Java looks **up the call stack** for a matching `catch`. If none exists the program ends with a stack trace.'),
    pre(`
Throwable
 ├─ Error                         (JVM problems: OutOfMemoryError — don't catch)
 └─ Exception
     ├─ IOException ...           CHECKED: compiler forces you to handle or declare
     └─ RuntimeException          UNCHECKED: programming mistakes
          ├─ ArithmeticException, NullPointerException
          ├─ ArrayIndexOutOfBoundsException, ClassCastException
          └─ IllegalArgumentException, NumberFormatException
`),
    why('**Checked** exceptions model problems a correct program can still meet (a missing file); the compiler makes you decide. **Unchecked** ones signal bugs (a null, a bad index); fix the code instead of catching. `finally` runs **whatever happens** (even after a `return`), so it is the place for cleanup; try-with-resources does that for anything implementing `AutoCloseable`.'),
    ul('Catch the **most specific** exception first; order matters.', 'Never write an empty catch block; at least log or rethrow.', 'Throw early (validate arguments) and catch late (where you can do something about it).', 'Custom exception: `class MyException extends Exception` (checked) or `extends RuntimeException` (unchecked).'),
  ],
  syntax: [code(`
try {
    risky();
} catch (NumberFormatException | ArithmeticException e) {
    System.out.println(e.getMessage());
} finally {
    cleanup();
}

void read() throws IOException { /* may throw */ }          // declare
throw new IllegalArgumentException("n < 0");                 // raise
try (BufferedReader r = new BufferedReader(new FileReader("in.txt"))) { /* use r */ }   // auto-close
`)],
  tiny: [code(`
try {
    int x = Integer.parseInt("12x");
} catch (NumberFormatException e) {
    System.out.println("not a number");
}
`)],
  guided: [prog('m3-exceptions/ExceptionsDemo.java', 'finally, multi-catch, a custom checked exception, try-with-resources and ClassCastException')],
  programs: [
    {
      file: 'm3-exceptions/ExceptionsDemo.java',
      title: 'Exceptions tour',
      role: 'demo',
      description: 'Each section triggers one kind of exception.',
      walkthrough: [
        { at: 'static class InsufficientFundsException extends Exception', text: 'A custom CHECKED exception because it extends Exception (not RuntimeException).' },
        { at: 'throws InsufficientFundsException', text: 'Declares to callers that this method can throw it.' },
        { at: '} finally {', text: 'Runs after the try (and catch), including when the try returned early.' },
        { at: 'catch (ArithmeticException | ArrayIndexOutOfBoundsException e)', text: 'Multi-catch: one handler for two unrelated types.' },
        { at: 'try (BufferedReader r =', text: 'The reader is closed automatically at the end of the block.' },
      ],
    },
  ],
  complexity: [p('Throwing and catching an exception is relatively expensive (building the stack trace). Do not use exceptions for ordinary control flow in a hot loop.')],
  mistakes: [
    { title: 'Catching Exception everywhere', wrong: 'catch (Exception e) { }', why: 'Swallows real bugs and hides the cause.', fix: 'Catch the specific type and handle or rethrow.' },
    { title: 'Wrong catch order', wrong: 'catch (Exception e) {...}\ncatch (IOException e) {...}', why: 'Compile error: the second catch is unreachable.', fix: 'Put the subclass first.' },
    { title: 'Using return in finally', wrong: 'finally { return 0; }', why: 'It overrides any exception or earlier return.', fix: 'Use finally only for cleanup.' },
  ],
  practice: [
    { id: 'exc-ex1', level: 'beginner', title: 'Safe division', statement: 'Read two tokens. Print a / b as integers, `bad number` if either is not an integer, or `division by zero`.', examples: [{ input: '12 4', output: '3' }], hints: ['Two catch clauses.'], solutionFile: 'm3-exceptions/Ex1.java', solutionExplain: 'parseInt throws NumberFormatException; the division throws ArithmeticException.', tests: [{ stdin: '12 4\n', stdout: '3' }, { stdin: '5 0\n', stdout: 'division by zero' }, { stdin: 'x 2\n', stdout: 'bad number' }] },
    { id: 'exc-ex2', level: 'intermediate', title: 'Custom exception', statement: 'Define NegativeAgeException (unchecked). Read n ages; print `ok <age>` for valid ones, or the exception message `age cannot be negative: <age>`.', examples: [{ input: '3\n20\n-5\n0', output: 'ok 20\nage cannot be negative: -5\nok 0' }], hints: ['extends RuntimeException; call super(message).'], solutionFile: 'm3-exceptions/Ex2.java', solutionExplain: 'throw inside the check method; catch in the loop.', tests: [{ stdin: '3\n20\n-5\n0\n', stdout: 'ok 20\nage cannot be negative: -5\nok 0' }, { stdin: '1\n-1\n', stdout: 'age cannot be negative: -1' }] },
    { id: 'exc-ex3', level: 'intermediate', title: 'try / finally order', statement: 'Run the program: a method prints in try, returns 1, and prints in finally. Write the output order.', examples: [{ input: '(no input)', output: 'try\nfinally\n1' }], hints: ['finally runs before the value is delivered to the caller.'], solutionFile: 'm3-exceptions/Ex3.java', solutionExplain: 'The return value is computed, finally runs, then the value returns.', tests: [{ stdin: '', stdout: 'try\nfinally\n1' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'Which is a checked exception?', options: ['ArithmeticException', 'NullPointerException', 'IOException', 'IllegalArgumentException'], answer: 2, explain: 'IOException must be handled or declared.' },
    { type: 'output', q: 'What is printed?', code: 'try {\n    System.out.print("A");\n    int x = 1 / 0;\n    System.out.print("B");\n} catch (ArithmeticException e) {\n    System.out.print("C");\n} finally {\n    System.out.print("D");\n}', answer: 'ACD', explain: 'B is skipped; the catch and finally run.' },
    { type: 'mcq', q: 'What does `throws` do in a method signature?', options: ['throws an exception', 'declares that the method may throw a checked exception', 'catches an exception', 'ignores errors'], answer: 1, explain: 'It warns callers.' },
    { type: 'mcq', q: 'try-with-resources requires the resource to implement…', options: ['Serializable', 'AutoCloseable', 'Runnable', 'Comparable'], answer: 1, explain: 'close() is called automatically.' },
  ],
  interview: ['Checked vs unchecked?', 'Does finally always run?', 'How do you create a custom exception?', 'What is try-with-resources?'],
  videos: ['m3-exceptions', 'm3-exceptions#2'],
  revision: ['try / catch(specific first) / finally.', 'Checked: handle or declare; unchecked: fix the bug.', 'throw new X("msg"); throws X.', 'try-with-resources closes automatically.'],
});

export const collectionsLists: Lesson = lesson({
  id: 'm3-collections-lists',
  dryRun: { algo: 'arraylist-ops', input: { cap: '4', ops: 'add 5,add 7,add 9,add 2,add 8,add@0 1,remove@2' }, caption: 'Growth by 1.5× and the cost of shifting.' },
  module: 'm3',
  title: 'Generics and Lists: ArrayList and LinkedList',
  summary: 'Type-safe containers with `<T>`: the resizable array, the linked list, autoboxing and the remove() trap.',
  level: 'beginner',
  track: 'core',
  minutes: 40,
  essential: true,
  prerequisites: ['m2-arrays-1d', 'm3-classes-objects'],
  sources: ['Combination', 'Natural-Sort-order'],
  objectives: [
    'Create and use `List<T>` with `ArrayList` and `LinkedList`.',
    'Explain generics (`<T>`) and why primitives need wrapper types.',
    'Avoid the `remove(int)` vs `remove(Object)` trap.',
    'Choose a list type from the costs of its operations.',
  ],
  intuition: [
    p('Arrays have a fixed size. A **`List<E>`** is a resizable sequence from `java.util`. The type in angle brackets is a **generic type argument**: `List<Integer>` can only hold Integers, and the compiler checks it (no casts needed).'),
    table(['', 'ArrayList', 'LinkedList'], [['inside', 'a resizable array', 'a doubly-linked chain of nodes'], ['get(i) / set(i)', 'O(1)', 'O(n)'], ['add at end', 'O(1) amortised', 'O(1)'], ['insert / remove in the middle', 'O(n) (shifts)', 'O(1) once positioned, O(n) to find'], ['add/remove at the front', 'O(n)', 'O(1)'], ['memory', 'compact', 'node object per element'], ['default choice', 'yes', 'rarely — use ArrayDeque for queues']]),
    why('Generics were added so containers can be type-safe without code duplication: one `ArrayList` class works for `String`, `Integer`, or your own `Student`. They only work with **reference types**, so `List<int>` is illegal; Java automatically **boxes** an `int` into an `Integer` and unboxes it back (autoboxing).'),
    warn('`List<Integer> a; a.remove(1)` removes the element at **index 1**. To remove the **value** 1 write `a.remove(Integer.valueOf(1))`. Likewise `Integer p = 1000, q = 1000; p == q` is **false** — compare boxed values with `.equals()`.', 'Two classic traps'),
  ],
  syntax: [code(`
List<Integer> a = new ArrayList<>();       // diamond: type inferred
a.add(5); a.add(0, 9);                     // append / insert at index
a.get(0); a.set(0, 1); a.size(); a.isEmpty();
a.contains(5); a.indexOf(5);
a.remove(0); a.remove(Integer.valueOf(5)); // by index / by value
Collections.sort(a); Collections.reverse(a); Collections.max(a);
List<Integer> fixed = List.of(1, 2, 3);    // immutable
int[] arr = a.stream().mapToInt(Integer::intValue).toArray();
`)],
  tiny: [code(`
List<String> names = new ArrayList<>();
names.add("Asha");
for (String n : names) System.out.println(n);
`)],
  guided: [prog('m3-collections-lists/ListsDemo.java', 'ArrayList operations, a generic method, remove-by-index vs by-value, LinkedList and Integer caching')],
  programs: [
    {
      file: 'm3-collections-lists/ListsDemo.java',
      title: 'Lists and generics',
      role: 'demo',
      description: 'Compare each printed line with the code that produced it.',
      walkthrough: [
        { at: 'static <T> void swapFirstAndLast(List<T> list)', text: 'A generic method: `<T>` declares a type parameter used in the signature.' },
        { at: 'nums.add(1, 99);', text: 'Insert at index 1; elements to the right shift.' },
        { at: 'nums.remove(Integer.valueOf(99));', text: 'Remove by VALUE: passing an Integer object selects remove(Object).' },
        { at: 'a.remove(1);', text: 'Remove by INDEX: an int literal selects remove(int).' },
        { at: 'LinkedList<String> ll = new LinkedList<>(words);', text: 'Same List interface, different internals: addFirst/removeLast are O(1).' },
        { at: 'Integer p = 127, q = 127, r = 1000, s = 1000;', text: 'Integers −128..127 are cached so == happens to work; 1000 is not cached so r == s is false.' },
      ],
    },
  ],
  complexity: [p('ArrayList doubles its internal array when full, so `add` is **amortised O(1)**. `contains`/`indexOf` are O(n) on any list. Sorting is O(n log n). Prefer `ArrayList` unless you do many insertions at the front.')],
  mistakes: [
    { title: 'ConcurrentModificationException', wrong: 'for (Integer x : list) if (x == 3) list.remove(x);', why: 'Modifying a list while iterating over it with for-each.', fix: 'list.removeIf(x -> x == 3);  or use an Iterator' },
    { title: 'remove(int) vs remove(Object)', wrong: 'list.remove(5);   // meant the value 5', why: 'Removes the element at index 5 (or throws IndexOutOfBounds).', fix: 'list.remove(Integer.valueOf(5));' },
    { title: 'Using == on boxed numbers', wrong: 'if (list.get(0) == list.get(1))', why: 'Compares references: true only for the small cached values.', fix: 'list.get(0).equals(list.get(1))' },
  ],
  practice: [
    { id: 'list-ex1', level: 'beginner', title: 'Remove duplicates', statement: 'Read n integers and print them with duplicates removed, keeping the first occurrence of each.', examples: [{ input: '6\n3 1 3 2 1 4', output: '3 1 2 4' }], hints: ['Add to a result list only if !contains.'], solutionFile: 'm3-collections-lists/Ex1.java', solutionExplain: 'contains is O(n), so this is O(n²) — a HashSet makes it O(n) (next lesson).', tests: [{ stdin: '6\n3 1 3 2 1 4\n', stdout: '3 1 2 4' }, { stdin: '3\n7 7 7\n', stdout: '7' }] },
    { id: 'list-ex2', level: 'intermediate', title: 'Remove a value', statement: 'Read n integers and a target. Print the list (as `[a, b]`) with every occurrence of the target removed — without ConcurrentModificationException.', examples: [{ input: '6\n3 1 3 2 1 4\n3', output: '[1, 2, 1, 4]' }], hints: ['list.removeIf'], solutionFile: 'm3-collections-lists/Ex2.java', solutionExplain: 'removeIf iterates safely and in one pass.', tests: [{ stdin: '6\n3 1 3 2 1 4\n3\n', stdout: '[1, 2, 1, 4]' }, { stdin: '2\n5 5\n5\n', stdout: '[]' }] },
    { id: 'list-ex3', level: 'challenge', title: 'Generic maximum', statement: 'Write `static <T extends Comparable<T>> T largest(List<T> list)` and use it on n words; print the largest alphabetically.', examples: [{ input: '4\npear apple zebra fig', output: 'zebra' }], hints: ['`T extends Comparable<T>` lets you call compareTo.'], solutionFile: 'm3-collections-lists/Ex3.java', solutionExplain: 'A bounded generic method works for any comparable type.', tests: [{ stdin: '4\npear apple zebra fig\n', stdout: 'zebra' }, { stdin: '1\nx\n', stdout: 'x' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'List<Integer> a = new ArrayList<>(List.of(5, 6, 7));\na.remove(1);\nSystem.out.println(a);', answer: '[5, 7]', explain: 'remove(int) removes index 1 (the 6).' },
    { type: 'mcq', q: 'Which list is best for random access get(i)?', options: ['LinkedList', 'ArrayList', 'neither', 'both equal'], answer: 1, explain: 'ArrayList is O(1).' },
    { type: 'mcq', q: 'Why is List<int> illegal?', options: ['ints are too big', 'generics need reference types; use Integer', 'lists are only for strings', 'it is legal'], answer: 1, explain: 'Type arguments must be objects.' },
    { type: 'output', q: 'What is printed?', code: 'Integer a = 1000, b = 1000;\nSystem.out.println(a == b);', answer: 'false', explain: 'Outside the −128..127 cache, boxed values are different objects.' },
  ],
  interview: ['ArrayList vs LinkedList?', 'What are generics and type erasure?', 'What is autoboxing?', 'Why does for-each + remove throw?'],
  videos: ['m3-collections-lists', 'm3-collections-lists#2'],
  revision: ['List<E>: ArrayList (array) vs LinkedList (chain).', 'Wrapper types for primitives; remove(int index) vs remove(Object).', 'Modify during for-each → use removeIf / Iterator.', 'ArrayList add amortised O(1); contains O(n).'],
});

export const collectionsSetsMaps: Lesson = lesson({
  id: 'm3-collections-sets-maps',
  dryRun: { algo: 'hash-buckets', input: { keys: 'cat,dog,bird,emu,ant,cow,dog' }, caption: 'Real String.hashCode values decide the bucket.' },
  module: 'm3',
  title: 'Sets and Maps: HashSet, TreeSet, HashMap, TreeMap',
  summary: 'Fast membership and lookup: sets remove duplicates, maps connect keys to values, and counting with `merge`.',
  level: 'beginner',
  track: 'core',
  minutes: 40,
  essential: true,
  prerequisites: ['m3-collections-lists'],
  sources: ['Strobogrammatic-Number', 'Lexicographically-first-palindromic-string', 'Sorted-Unique-Permutation'],
  objectives: [
    'Use `HashSet` / `TreeSet` for uniqueness and membership.',
    'Use `HashMap` / `TreeMap` for counting and lookup, iterating with `entrySet()`.',
    'Apply `getOrDefault`, `merge` and `computeIfAbsent`.',
    'Pick hash vs tree vs linked variants by ordering needs and cost.',
  ],
  intuition: [
    p('A **Set** stores each value at most once and answers "is x in here?" quickly. A **Map** stores **key → value** pairs with unique keys and answers "what is the value for this key?".'),
    table(['', 'Hash…', 'Tree…', 'LinkedHash…'], [['order', 'none', 'sorted by key', 'insertion order'], ['add / contains / get', 'O(1) average', 'O(log n)', 'O(1) average'], ['needs', 'equals + hashCode', 'Comparable / Comparator', 'equals + hashCode'], ['use when', 'default', 'sorted output, floor/ceiling', 'predictable iteration']]),
    why('A **hash table** turns a key into an array index with `hashCode()`, so lookup does not depend on how many elements there are. That is why counting words in a `HashMap` is O(n) for n words while counting with a list (`contains` + search) is O(n²). The price: no ordering, and keys must have consistent `equals`/`hashCode` (see the last lesson of this module).'),
    p('Idiomatic counting: `freq.merge(key, 1, Integer::sum)` or `freq.put(key, freq.getOrDefault(key, 0) + 1)`. Grouping: `map.computeIfAbsent(k, x -> new ArrayList<>()).add(v)`.'),
  ],
  syntax: [code(`
Set<Integer> s = new HashSet<>();
s.add(3);  s.contains(3);  s.remove(3);  s.size();
Map<String, Integer> m = new HashMap<>();
m.put("a", 1);  m.get("a");  m.getOrDefault("z", 0);
m.containsKey("a");  m.remove("a");
for (Map.Entry<String, Integer> e : m.entrySet()) e.getKey(); e.getValue();
m.keySet();  m.values();
`)],
  tiny: [code(`
Map<Character, Integer> count = new HashMap<>();
for (char c : "banana".toCharArray()) count.merge(c, 1, Integer::sum);
// {a=3, b=1, n=2}
`)],
  guided: [prog('m3-collections-sets-maps/SetsMapsDemo.java', 'Duplicates with add(), word counts, TreeMap ordering and two-sum with a map')],
  programs: [
    {
      file: 'm3-collections-sets-maps/SetsMapsDemo.java',
      title: 'Sets and maps',
      role: 'demo',
      description: 'Four idioms you will reuse in many algorithm problems.',
      walkthrough: [
        { at: 'if (!seen.add(x))', text: 'add returns false when the value was already there — a free "have I seen this?" test.' },
        { at: 'freq.put(w, freq.getOrDefault(w, 0) + 1);', text: 'Increment a counter, treating a missing key as 0.' },
        { at: 'counts.merge(c, 1, Integer::sum);', text: 'The same in one call: insert 1, or combine the old value with 1 using sum.' },
        { at: 'new TreeMap<>(freq)', text: 'Copy into a TreeMap to print in sorted key order.' },
        { at: 'Integer j = index.get(target - a[i]);', text: 'Two-sum: remember where each value was seen; look up the complement in O(1).' },
      ],
    },
  ],
  complexity: [p('HashSet/HashMap: add, remove, contains/get are **O(1) average** (O(n) worst case with terrible hashing). TreeSet/TreeMap: **O(log n)**. Iterating a HashMap is O(capacity + size). Memory: O(n) with a noticeable constant per entry.')],
  mistakes: [
    { title: 'Mutating a key after inserting it', wrong: 'Point p = new Point(1, 2);\nset.add(p);\np.x = 9;   // lookup now fails', why: 'The hash code changed, so the entry sits in the wrong bucket.', fix: 'Use immutable keys.' },
    { title: 'Expecting HashMap order', wrong: 'for (String k : map.keySet()) // assumed insertion order', why: 'HashMap order is arbitrary and may change.', fix: 'LinkedHashMap (insertion) or TreeMap (sorted).' },
    { title: 'NullPointerException on unboxing', wrong: 'int v = map.get("missing");', why: 'get returns null; unboxing null fails.', fix: 'int v = map.getOrDefault("missing", 0);' },
  ],
  practice: [
    { id: 'set-ex1', level: 'beginner', title: 'Distinct count', statement: 'Read n integers and print how many distinct values there are.', examples: [{ input: '6\n3 1 3 2 1 4', output: '4' }], hints: ['A HashSet and its size().'], solutionFile: 'm3-collections-sets-maps/Ex1.java', solutionExplain: 'A set keeps each value once.', tests: [{ stdin: '6\n3 1 3 2 1 4\n', stdout: '4' }, { stdin: '1\n9\n', stdout: '1' }] },
    { id: 'set-ex2', level: 'intermediate', title: 'Word frequency', statement: 'Read words until the end of input (case-insensitive). Print each distinct word and its count, one `word count` per line, alphabetically.', examples: [{ input: 'the cat and The hat', output: 'and 1\ncat 1\nhat 1\nthe 2' }], hints: ['TreeMap<String,Integer> + merge.'], solutionFile: 'm3-collections-sets-maps/Ex2.java', solutionExplain: 'A TreeMap gives sorted iteration for free.', tests: [{ stdin: 'the cat and The hat and the bat\n', stdout: 'and 2\nbat 1\ncat 1\nhat 1\nthe 3' }, { stdin: 'a\n', stdout: 'a 1' }] },
    { id: 'set-ex3', level: 'challenge', title: 'Two-sum', statement: 'Read n, target and an array. Print the indices `i j` (i < j) of the pair with the smallest j such that a[i] + a[j] = target, or `none`. Use O(n).', examples: [{ input: '4 18\n2 7 11 15', output: '1 2' }], hints: ['For each j look up target − a[j] among the earlier elements.'], solutionFile: 'm3-collections-sets-maps/Ex3.java', solutionExplain: 'A map from value to index finds the complement in O(1).', tests: [{ stdin: '4 18\n2 7 11 15\n', stdout: '1 2' }, { stdin: '3 100\n1 2 3\n', stdout: 'none' }, { stdin: '4 6\n3 2 4 3\n', stdout: '1 2' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'What does Set.add return when the element is already present?', options: ['true', 'false', 'null', 'throws'], answer: 1, explain: 'false — the set is unchanged.' },
    { type: 'mcq', q: 'Which keeps keys sorted?', options: ['HashMap', 'TreeMap', 'LinkedHashMap', 'Hashtable'], answer: 1, explain: 'TreeMap, in O(log n).' },
    { type: 'mcq', q: 'Average cost of HashMap.get?', kind: 'complexity', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 0, explain: 'Hashing jumps to the bucket.' },
    { type: 'output', q: 'What is printed?', code: 'Map<String,Integer> m = new HashMap<>();\nm.merge("a", 1, Integer::sum);\nm.merge("a", 1, Integer::sum);\nSystem.out.println(m.get("a"));', answer: '2', explain: 'merge sums existing and new values.' },
  ],
  interview: ['How does a HashMap work internally?', 'HashMap vs TreeMap?', 'Why must keys be immutable?', 'How do you iterate a map?'],
  videos: ['m3-collections-sets-maps', 'm3-collections-sets-maps#2'],
  revision: ['Set = unique; Map = key → value.', 'Hash O(1) avg unordered; Tree O(log n) sorted; LinkedHash insertion.', 'Count: merge(k, 1, Integer::sum) / getOrDefault.', 'Keys need equals + hashCode and should not change.'],
});

export const collectionsQueues: Lesson = lesson({
  id: 'm3-collections-queues-deques',
  dryRun: { algo: 'stack-queue', input: { ops: 'a b c - - d -' }, caption: 'The same adds and removes applied to a stack and to a queue.' },
  module: 'm3',
  title: 'Queues, Deques, Stacks and PriorityQueue',
  summary: 'FIFO and LIFO structures in Java: `Queue`, `ArrayDeque` as a stack, and the min-heap `PriorityQueue`.',
  level: 'beginner',
  track: 'core',
  minutes: 35,
  essential: true,
  prerequisites: ['m3-collections-lists'],
  sources: ['Maze-Solving', 'Josephus-trap'],
  objectives: [
    'Use `Queue` (FIFO) with `offer`, `poll`, `peek` and `Deque`/`ArrayDeque` as a stack (LIFO).',
    'Explain why `java.util.Stack` should be avoided.',
    'Use `PriorityQueue` as a min-heap and max-heap and as "k largest" tool.',
    'Solve bracket matching with a stack and the Josephus order with a queue.',
  ],
  intuition: [
    table(['structure', 'rule', 'real life', 'Java'], [['Queue', 'first in, first out', 'a line at a counter', 'Queue<E> q = new ArrayDeque<>(); offer / poll / peek'], ['Stack', 'last in, first out', 'a pile of plates; undo', 'Deque<E> s = new ArrayDeque<>(); push / pop / peek'], ['Deque', 'both ends', 'a queue you may also join at the front', 'addFirst / addLast / pollFirst / pollLast'], ['PriorityQueue', 'smallest (or best) first', 'emergency room', 'new PriorityQueue<>(); poll() = minimum']]),
    why('A stack naturally matches **nesting** (brackets, recursion, undo): the most recently opened item must be closed first. A queue matches **fairness and level-by-level exploration** (BFS in the maze lesson: the cells found first are expanded first). A priority queue is a **binary heap**: insert and remove-min are O(log n), peek is O(1) — the basis of Dijkstra\'s algorithm and of "keep the k best".'),
    warn('Use `ArrayDeque` for stacks and queues. The old `java.util.Stack` class is synchronised, inherits from Vector and is slower; the `Queue` methods that **return a special value** (`offer`, `poll`, `peek`) are safer than the ones that throw (`add`, `remove`, `element`).', 'Which class?'),
  ],
  syntax: [code(`
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1); stack.push(2); stack.peek(); stack.pop();   // 2, then 2 removed
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(1); queue.offer(2); queue.peek(); queue.poll(); // 1
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
`)],
  tiny: [code(`
Deque<Character> st = new ArrayDeque<>();
st.push('(');
char top = st.pop();
`)],
  guided: [prog('m3-collections-queues-deques/QueueDequeDemo.java', 'Queue, stack, deque, min/max heap and balanced brackets')],
  programs: [
    {
      file: 'm3-collections-queues-deques/QueueDequeDemo.java',
      title: 'Queue, stack, deque, heap',
      role: 'demo',
      description: 'Each structure used once, then a bracket-matching function.',
      walkthrough: [
        { at: 'line.offer("Asha");', text: 'Add at the back of the queue.' },
        { at: 'line.poll()', text: 'Remove and return the front (null if empty).' },
        { at: 'stack.push(1);', text: 'Push adds at the FRONT of the deque; pop removes from the front — LIFO.' },
        { at: 'new PriorityQueue<>(Collections.reverseOrder())', text: 'A max-heap: the comparator reverses the order.' },
        { at: 'if (stack.isEmpty()) return false;', text: 'A closing bracket with nothing open is unbalanced.' },
        { at: 'return stack.isEmpty();', text: 'Anything left open at the end is unbalanced too.' },
      ],
    },
  ],
  complexity: [table(['operation', 'ArrayDeque', 'PriorityQueue'], [['add / push / offer', 'O(1) amortised', 'O(log n)'], ['poll / pop', 'O(1)', 'O(log n)'], ['peek', 'O(1)', 'O(1)'], ['contains', 'O(n)', 'O(n)']])],
  mistakes: [
    { title: 'Iterating a PriorityQueue and expecting sorted order', wrong: 'for (int x : pq) System.out.println(x);', why: 'The iterator walks the heap array, not sorted order.', fix: 'while (!pq.isEmpty()) pq.poll();' },
    { title: 'Using Stack/Vector', wrong: 'Stack<Integer> s = new Stack<>();', why: 'Legacy and slower.', fix: 'Deque<Integer> s = new ArrayDeque<>();' },
    { title: 'null elements', wrong: 'ArrayDeque<String> d = ...; d.add(null);', why: 'ArrayDeque forbids null (poll() uses null to mean empty).', fix: 'Use a sentinel value or Optional.' },
  ],
  practice: [
    { id: 'que-ex1', level: 'beginner', title: 'Balanced brackets', statement: 'Read a string of brackets ()[]{}. Print YES if balanced, else NO.', examples: [{ input: '{[()]}', output: 'YES' }], hints: ['Push openers; on a closer pop and compare.'], solutionFile: 'm3-collections-queues-deques/Ex1.java', solutionExplain: 'A stack holds the currently open brackets in order.', tests: [{ stdin: '{[()]}\n', stdout: 'YES' }, { stdin: '([)]\n', stdout: 'NO' }, { stdin: '((\n', stdout: 'NO' }, { stdin: '())\n', stdout: 'NO' }] },
    { id: 'que-ex2', level: 'intermediate', title: 'Josephus with a queue', statement: 'Read n and k. People 1..n stand in a queue; repeatedly move k−1 people to the back and remove the next. Print the removal order.', examples: [{ input: '5 2', output: '2 4 1 5 3' }], hints: ['q.add(q.poll()) k−1 times, then poll.'], solutionFile: 'm3-collections-queues-deques/Ex2.java', solutionExplain: 'A circle is a queue whose front keeps rotating to the back.', tests: [{ stdin: '5 2\n', stdout: '2 4 1 5 3' }, { stdin: '7 3\n', stdout: '3 6 2 7 5 1 4' }] },
    { id: 'que-ex3', level: 'challenge', title: 'k-th largest', statement: 'Read n, k and an array. Print the k-th largest element using a min-heap of size k (O(n log k)).', examples: [{ input: '6 2\n3 2 1 5 6 4', output: '5' }], hints: ['Add each element; if size > k, poll the minimum.'], solutionFile: 'm3-collections-queues-deques/Ex3.java', solutionExplain: 'The heap always contains the k largest seen so far; its top is the k-th largest.', tests: [{ stdin: '6 2\n3 2 1 5 6 4\n', stdout: '5' }, { stdin: '3 3\n9 8 7\n', stdout: '7' }, { stdin: '1 1\n4\n', stdout: '4' }] },
  ],
  quiz: [
    { type: 'output', q: 'What is printed?', code: 'Deque<Integer> s = new ArrayDeque<>();\ns.push(1); s.push(2); s.push(3);\nSystem.out.println(s.pop() + " " + s.peek());', answer: '3 2', explain: 'LIFO: 3 comes out first; 2 is now on top.' },
    { type: 'mcq', q: 'Which data structure is best for BFS?', kind: 'choose-algorithm', options: ['stack', 'queue', 'priority queue', 'set'], answer: 1, explain: 'FIFO explores level by level.' },
    { type: 'mcq', q: 'PriorityQueue<Integer>.poll() returns…', options: ['the first inserted', 'the largest', 'the smallest', 'a random one'], answer: 2, explain: 'Natural ordering is a min-heap.' },
    { type: 'mcq', q: 'Insert into a PriorityQueue costs…', kind: 'complexity', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, explain: 'Sift up through the heap.' },
  ],
  interview: ['Stack vs queue?', 'Implement a queue with two stacks.', 'How does a PriorityQueue work?', 'Why not java.util.Stack?'],
  videos: ['m3-collections-queues-deques', 'm3-collections-queues-deques#2'],
  revision: ['Queue FIFO offer/poll/peek; Stack LIFO push/pop/peek on ArrayDeque.', 'PriorityQueue = min-heap, O(log n) add/poll; reverseOrder for max.', 'Brackets → stack; BFS → queue; top-k → heap.', 'Avoid java.util.Stack.'],
});

export const sortingComparators: Lesson = lesson({
  id: 'm3-sorting-comparators',
  dryRun: { algo: 'comparator-sort', input: { words: 'pear,fig,apple,kiwi,plum', mode: '2' }, caption: 'The sort just keeps asking compare(a, b).' },
  module: 'm3',
  title: 'Sorting with Comparable and Comparator',
  summary: 'Order objects any way you like: natural order, comparator lambdas, multi-key sorts and stability.',
  level: 'intermediate',
  track: 'core',
  minutes: 35,
  essential: true,
  prerequisites: ['m3-collections-lists', 'm3-abstraction-interfaces'],
  sources: ['Natural-Sort-order', 'Weightes-substring'],
  objectives: [
    'Sort lists and arrays with `Collections.sort`, `List.sort` and `Arrays.sort`.',
    'Implement `Comparable<T>` and write a `Comparator<T>` as a lambda.',
    'Chain keys with `thenComparing` and reverse with `reversed()`.',
    'Explain stability and why a comparator must be consistent.',
  ],
  intuition: [
    p('Sorting needs a rule for "which of two items comes first?". Java expresses it as a number: **negative** = first goes first, **zero** = tie, **positive** = second goes first.'),
    table(['tool', 'where defined', 'use for'], [['Comparable<T>.compareTo', 'inside the class', 'the single natural order (String, Integer, Version)'], ['Comparator<T>.compare', 'outside the class', 'any other order; many per class']]),
    why('Because a Comparator is a small function, you can build orders by composition: `Comparator.comparingInt((Student s) -> s.marks).reversed().thenComparing(s -> s.age)` reads as "highest marks first, ties by younger age". The library sorts (TimSort for objects, dual-pivot quicksort for primitives) in **O(n log n)**; object sorts are **stable** — items that compare equal keep their original relative order — so sorting by one key and then another works as expected.'),
    p('A comparator must be a consistent total order: `compare(a, b) = −compare(b, a)` and transitivity. Do **not** compute it as `a − b` for ints: the subtraction can overflow. Use `Integer.compare(a, b)`.'),
  ],
  syntax: [code(`
Collections.sort(list);                          // natural order
list.sort(Comparator.comparing(Student::getName));
list.sort((a, b) -> Integer.compare(b.marks, a.marks));   // marks descending
Arrays.sort(arr, Collections.reverseOrder());    // Integer[] only
Arrays.sort(pairs, (x, y) -> Integer.compare(x[0], y[0]));
`)],
  tiny: [code(`
List<String> w = new ArrayList<>(List.of("pear", "fig", "apple"));
w.sort(Comparator.comparingInt(String::length));
// [fig, pear, apple]
`)],
  guided: [prog('m3-sorting-comparators/SortingDemo.java', 'Natural order, marks-descending, multi-key, arrays of Integer/String and int[] pairs')],
  programs: [
    {
      file: 'm3-sorting-comparators/SortingDemo.java',
      title: 'Comparators in practice',
      role: 'demo',
      description: 'Students sorted by name, by marks (stable), then by marks and age.',
      walkthrough: [
        { at: 'public int compareTo(Student o)', text: 'The natural order: by name. String.compareTo already returns negative/zero/positive.' },
        { at: 'Comparator.comparingInt((Student s) -> s.marks).reversed()', text: 'Order by marks, then flip it to descending.' },
        { at: '.thenComparing(s -> s.age)', text: 'Tie-breaker: when marks are equal, younger first.' },
        { at: 'Arrays.sort(boxed, Collections.reverseOrder());', text: 'Arrays.sort with a comparator needs object elements (Integer[], not int[]).' },
        { at: 'Integer.compare(x[0], y[0])', text: 'A hand-written comparator for int[] pairs; never use subtraction.' },
      ],
    },
  ],
  complexity: [p('Sorting n items takes O(n log n) comparisons; each comparison costs the comparator\'s time (O(1) for primitive keys, O(L) for strings of length L). TimSort uses O(n) extra space and is O(n) on already-sorted input.')],
  mistakes: [
    { title: 'Comparator by subtraction', wrong: '(a, b) -> a - b', why: 'Overflows for large/negative values: e.g. Integer.MIN_VALUE − 1.', fix: 'Integer.compare(a, b)' },
    { title: 'Sorting a primitive array with a comparator', wrong: 'Arrays.sort(intArray, Collections.reverseOrder());', why: 'Compile error: comparators need object arrays.', fix: 'Use Integer[] or sort ascending and reverse.' },
    { title: 'Inconsistent comparator', wrong: '(a, b) -> a.x < b.x ? -1 : 1   // never 0', why: 'Violates the contract (equal items compare as "greater" both ways): "Comparison method violates its general contract!"', fix: 'Return 0 for ties: use Integer.compare.' },
  ],
  practice: [
    { id: 'srt-ex1', level: 'beginner', title: 'Descending', statement: 'Read n integers and print them in descending order.', examples: [{ input: '5\n3 9 1 7 5', output: '9 7 5 3 1' }], hints: ['Collections.reverseOrder()'], solutionFile: 'm3-sorting-comparators/Ex1.java', solutionExplain: 'A reversed natural order.', tests: [{ stdin: '5\n3 9 1 7 5\n', stdout: '9 7 5 3 1' }, { stdin: '1\n2\n', stdout: '2' }] },
    { id: 'srt-ex2', level: 'intermediate', title: 'By length then alphabet', statement: 'Read n words and print them sorted by length, ties alphabetically.', examples: [{ input: '5\npear fig apple kiwi plum', output: 'fig kiwi pear plum apple' }], hints: ['comparingInt(String::length).thenComparing(...)'], solutionFile: 'm3-sorting-comparators/Ex2.java', solutionExplain: 'A two-key comparator.', tests: [{ stdin: '5\npear fig apple kiwi plum\n', stdout: 'fig kiwi pear plum apple' }, { stdin: '2\nb a\n', stdout: 'a b' }] },
    { id: 'srt-ex3', level: 'challenge', title: 'Merge intervals', statement: 'Read n intervals `start end`. Merge overlapping ones (touching counts) and print them as `[s,e]` separated by spaces in increasing order.', examples: [{ input: '4\n1 3\n8 10\n2 6\n15 18', output: '[1,6] [8,10] [15,18]' }], hints: ['Sort by start, then sweep keeping the current merged interval.'], solutionFile: 'm3-sorting-comparators/Ex3.java', solutionExplain: 'After sorting by start, overlapping intervals are adjacent: extend the end while the next start ≤ end.', tests: [{ stdin: '4\n1 3\n8 10\n2 6\n15 18\n', stdout: '[1,6] [8,10] [15,18]' }, { stdin: '2\n1 4\n4 5\n', stdout: '[1,5]' }, { stdin: '1\n3 7\n', stdout: '[3,7]' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'A comparator returning a negative number means…', options: ['a goes before b', 'b goes before a', 'they are equal', 'an error'], answer: 0, explain: 'Negative: first argument first.' },
    { type: 'mcq', q: 'Why is `(a, b) -> a - b` dangerous?', options: ['it is slower', 'integer overflow', 'it sorts descending', 'it does not compile'], answer: 1, explain: 'The subtraction can overflow.' },
    { type: 'mcq', q: 'A stable sort…', options: ['never crashes', 'keeps equal elements in their original order', 'is always O(n)', 'uses no memory'], answer: 1, explain: 'List.sort and Collections.sort are stable.' },
    { type: 'mcq', q: 'Time complexity of Collections.sort on n items?', kind: 'complexity', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1, explain: 'Merge-sort-like TimSort.' },
  ],
  interview: ['Comparable vs Comparator?', 'What is a stable sort and why does it matter?', 'How does Java sort primitives vs objects?', 'How do you sort by two keys?'],
  videos: ['m3-sorting-comparators', 'm3-sorting-comparators#2'],
  revision: ['compare → negative / 0 / positive.', 'Comparable: natural; Comparator: any order; thenComparing, reversed.', 'Use Integer.compare, never a − b.', 'Object sorts are stable, O(n log n).'],
});

export const equalsHashCode: Lesson = lesson({
  id: 'm3-equals-hashcode-immutability',
  dryRun: { algo: 'hashset-equals', input: { mode: '2', pts: '1:2,1:2,3:4' }, caption: 'Overriding equals without hashCode breaks HashSet.' },
  module: 'm3',
  title: 'equals(), hashCode() and Immutability',
  summary: 'When two objects count as "the same", why hash-based collections need both methods, and how to build immutable classes.',
  level: 'intermediate',
  track: 'core',
  minutes: 35,
  essential: false,
  prerequisites: ['m3-collections-sets-maps', 'm3-encapsulation-access'],
  objectives: [
    'Override `equals` and `hashCode` consistently and explain the contract.',
    'Explain what goes wrong in a `HashSet` if you override only one.',
    'Build an immutable class (final fields, no setters, defensive copies).',
    'Spot common object-related errors: `==` on objects, mutable keys, leaked references.',
  ],
  intuition: [
    p('By default `a.equals(b)` is the same as `a == b`: **identity** (same object). For value-like classes (a `Point`, a `Fraction`) you want **equality of content**, so you override `equals`.'),
    pre(`
The contract:
 • a.equals(a) is true; symmetric; transitive; consistent
 • equal objects MUST have equal hashCode()      ← the one people forget
 • unequal objects MAY share a hash code (a collision)
`),
    why('A HashSet first computes `hashCode()` to choose a **bucket**, then uses `equals()` to compare inside that bucket. If you override `equals` but not `hashCode`, two equal points land in different buckets and the set treats them as different — the exact bug the demo shows (`raw set size 2`). Using `Objects.hash(x, y)` and `Objects.equals` makes both methods short and correct.'),
    h('Immutability'),
    ul('Declare the class `final` (or all constructors private).', 'All fields `private final`; no setters.', 'Copy mutable inputs in the constructor and mutable outputs in getters (defensive copies), or return unmodifiable views.', 'Methods return **new** objects (`String.concat`, `BigInteger.add`).'),
    p('Immutable objects are safe to share, safe as map keys, and trivially thread-safe — that is why `String`, `Integer` and `BigInteger` are immutable.'),
  ],
  syntax: [code(`
@Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Point)) return false;
    Point p = (Point) o;
    return x == p.x && y == p.y;
}
@Override public int hashCode() { return Objects.hash(x, y); }
`)],
  tiny: [code(`
new Point(1, 2).equals(new Point(1, 2));   // false without an override, true with it
`)],
  guided: [prog('m3-equals-hashcode-immutability/EqualsHashCodeDemo.java', 'A class with and without equals/hashCode inside HashSets')],
  programs: [
    {
      file: 'm3-equals-hashcode-immutability/EqualsHashCodeDemo.java',
      title: 'Value equality',
      role: 'demo',
      description: 'RawPoint vs Point stored in HashSets.',
      walkthrough: [
        { at: 'static class RawPoint', text: 'No overrides: equality is identity, so two (1,2) points are different.' },
        { at: 'static final class Point', text: 'final class with private final fields: immutable.' },
        { at: 'if (!(o instanceof Point)) return false;', text: 'Guards against null and unrelated types in one test.' },
        { at: 'return Objects.hash(x, y);', text: 'Same fields as equals → equal objects get equal hash codes.' },
        { at: 'System.out.println("raw set size "', text: 'raw: 2 entries; value-equal Points collapse to 1.' },
      ],
    },
  ],
  complexity: [p('A good hashCode makes HashSet/HashMap operations O(1) average; a constant hashCode degrades them to O(n). equals/hashCode themselves are O(number of fields).')],
  mistakes: [
    { title: 'Overriding equals without hashCode', wrong: '@Override public boolean equals(Object o) { ... }', why: 'HashSet/HashMap look in the wrong bucket; contains() returns false for equal objects.', fix: 'Always override both, using the same fields.' },
    { title: 'Wrong signature', wrong: 'public boolean equals(Point p) { ... }', why: 'That OVERLOADS equals(Object); collections still call the Object version. @Override would have caught it.', fix: 'public boolean equals(Object o)' },
    { title: 'Leaking a mutable field', wrong: 'public List<String> getMembers() { return members; }', why: 'The "immutable" class can be changed from outside.', fix: 'return Collections.unmodifiableList(members);' },
  ],
  practice: [
    { id: 'eqh-ex1', level: 'intermediate', title: 'Distinct people', statement: 'Create a Person(name, age) class with equals/hashCode. Read n lines `name age` and print the number of distinct persons.', examples: [{ input: '4\nAsha 20\nRavi 21\nAsha 20\nAsha 22', output: '3' }], hints: ['Put Persons in a HashSet.'], solutionFile: 'm3-equals-hashcode-immutability/Ex1.java', solutionExplain: 'With equals + hashCode, the HashSet de-duplicates by content.', tests: [{ stdin: '4\nAsha 20\nRavi 21\nAsha 20\nAsha 22\n', stdout: '3' }, { stdin: '2\nA 1\nA 1\n', stdout: '1' }] },
    { id: 'eqh-ex2', level: 'intermediate', title: 'Immutable money', statement: 'Run the Money class whose plus() returns a new object; print the amounts of a and b = a.plus(175¢) for a = 250¢.', examples: [{ input: '(no input)', output: '250 425' }], hints: ['The original object is unchanged.'], solutionFile: 'm3-equals-hashcode-immutability/Ex2.java', solutionExplain: 'An immutable class returns new instances.', tests: [{ stdin: '', stdout: '250 425' }] },
    { id: 'eqh-ex3', level: 'challenge', title: 'Defensive copying', statement: 'A Team stores a copy of the member list given to its constructor and returns an unmodifiable view. Run it: the source list is changed afterwards (the team must not change) and a caller tries to add to the returned list.', examples: [{ input: '(no input)', output: '[Asha, Ravi]\nread-only' }], hints: ['new ArrayList<>(members) in; Collections.unmodifiableList out.'], solutionFile: 'm3-equals-hashcode-immutability/Ex3.java', solutionExplain: 'Copy in, read-only view out.', tests: [{ stdin: '', stdout: '[Asha, Ravi]\nread-only' }] },
  ],
  quiz: [
    { type: 'mcq', q: 'If a.equals(b) is true then…', options: ['a.hashCode() == b.hashCode() must hold', 'hash codes are unrelated', 'a == b must be true', 'they must be the same class only'], answer: 0, explain: 'That is the contract.' },
    { type: 'mcq', q: 'Which makes a class immutable?', options: ['public fields', 'private final fields and no setters', 'static methods', 'a toString method'], answer: 1, explain: 'State cannot change after construction.' },
    { type: 'output', q: 'What does a HashSet<Point> print for size if equals is overridden but hashCode is not?', code: 'set.add(new Point(1, 2));\nset.add(new Point(1, 2));\nSystem.out.println(set.size());', answer: '2', explain: 'Almost certainly: different hash codes put them in different buckets, so equals is never consulted.' },
    { type: 'mcq', q: 'Which of these classes is immutable?', options: ['StringBuilder', 'ArrayList', 'String', 'int[]'], answer: 2, explain: 'String never changes.' },
  ],
  interview: ['Why override hashCode with equals?', 'What is immutability and its benefits?', '== vs equals?', 'How does HashMap find an entry?'],
  videos: ['m3-equals-hashcode-immutability', 'm3-equals-hashcode-immutability#2'],
  revision: ['Override equals AND hashCode with the same fields.', 'Hash → bucket; equals → match inside bucket.', 'Immutable: final class, private final fields, no setters, defensive copies.', 'Use Objects.hash / Objects.equals.'],
});
