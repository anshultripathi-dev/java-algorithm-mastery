import type { Lesson } from '@/lib/types';
import { lesson, p, h, ul, ol, tip, warn, note, why, ex, code, prog, pre, table, math } from './_h';

export const howJavaWorks: Lesson = lesson({
  id: 'm0-how-java-works',
  dryRun: { algo: 'jvm-pipeline', input: { cls: 'Hello', msg: 'Hi' }, caption: 'From Hello.java to the text on your screen: compile, load, run.' },
  module: 'm0',
  title: 'How Java Works: Source, Bytecode, JVM, JRE, JDK',
  summary: 'What actually happens between typing a .java file and seeing output — and what JDK, JRE and JVM mean.',
  level: 'beginner',
  track: 'syntax',
  minutes: 25,
  essential: true,
  sources: ['Java-Introduction_-Features_-Structure_-Data-Types'],
  objectives: [
    'Explain what programming is and why a program must be translated before a computer can run it.',
    'Trace the path: source code (.java) → compiler (javac) → bytecode (.class) → JVM → machine code.',
    'Tell JDK, JRE and JVM apart.',
    'Explain "write once, run anywhere" and why Java is called both compiled and interpreted.',
  ],
  intuition: [
    p('A **program** is a list of precise instructions for a computer. Humans write instructions in a *programming language* like Java because it is readable; a CPU only understands very low-level machine code. Something must translate.'),
    p('Java uses a two-step trick. First the **compiler** (`javac`) translates your readable **source code** (`Hello.java`) into **bytecode** (`Hello.class`): a compact instruction set for an imaginary computer. Then the **Java Virtual Machine (JVM)** — a real program installed on your computer — runs that bytecode, translating it to the actual machine\'s instructions on the fly.'),
    pre(`
  Hello.java  ──javac──►  Hello.class  ──java──►  JVM  ──►  your CPU
  (you write)    compile    (bytecode)    run     interprets + JIT compiles
`),
    why('Because the bytecode is the same on every computer, you compile **once** and the file runs on any operating system that has a JVM — Windows, macOS, Linux. Only the JVM is different for each platform. That is Java\'s slogan: **write once, run anywhere**.'),
    table(['term', 'what it is', 'you need it to…'], [['JVM', 'Java Virtual Machine: runs bytecode', 'run any Java program'], ['JRE', 'Java Runtime Environment = JVM + standard libraries', 'run Java programs (end users)'], ['JDK', 'Java Development Kit = JRE + compiler (javac) + tools', 'write and compile Java (developers: you)']]),
    p('"Compiled **and** interpreted": the compiler turns source into bytecode (compiled); the JVM then executes the bytecode (interpreted), and compiles the *hot* (frequently used) parts into native machine code at run time with a **JIT** (Just-In-Time) compiler to make them fast.'),
  ],
  syntax: [
    code(`
javac Hello.java     # compile:  Hello.java  ->  Hello.class
java  Hello          # run it:   the CLASS name (no .java, no .class)
java  Hello.java     # Java 11+: compile in memory and run one source file
java -version        # which runtime is first on the PATH?
javac -version       # which compiler?
`, 'The commands you will use all course (macOS / Linux / Windows terminal)'),
    ul('The file is named after its **public class**: `public class Hello` must be in `Hello.java` (upper/lower case matters).', 'Source files are plain text ending in `.java`; the compiler produces `.class` files containing bytecode.', 'Execution starts at `public static void main(String[] args)`.'),
  ],
  tiny: [code(`
// Hello.java  -- the file you write
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hi");
    }
}
// $ javac Hello.java   -> creates Hello.class (bytecode)
// $ java Hello         -> the JVM runs it and prints: Hi
`)],
  guided: [
    p('This program asks the JVM that is running it a few questions, proving that the JVM — not your operating system — executes your bytecode:'),
    prog('m0-how-java-works/ShowJavaVersion.java', 'Ask the running JVM who it is'),
    prog('m0-how-java-works/SameBytecodeEverywhere.java', 'Same .class file, different platform'),
  ],
  programs: [
    {
      file: 'm0-how-java-works/ShowJavaVersion.java',
      title: 'Which JVM am I running on?',
      role: 'demo',
      description: 'System.getProperty reads values the JVM exposes about itself and the machine.',
      walkthrough: [
        { at: 'System.getProperty("java.version")', text: 'A system property: a named setting provided by the JVM. This one is the Java version.' },
        { at: 'System.getProperty("java.vm.name")', text: 'The name of the virtual machine implementation (HotSpot on most computers).' },
        { at: 'System.getProperty("os.name")', text: 'The operating system. The same bytecode prints a different value on a different OS.' },
      ],
    },    {
      file: 'm0-how-java-works/SameBytecodeEverywhere.java',
      title: 'Same bytecode, different platform',
      role: 'demo',
      description: 'The program text never changes; only the operating-system values it reads do.',
      walkthrough: [
        { at: 'System.getProperty("os.name")', text: 'Read the operating system name at run time — it differs on macOS, Windows and Linux although the .class file is identical.' },
        { at: 'java.io.File.separator', text: 'The path separator also comes from the platform: "/" on macOS and Linux, "\\" on Windows.' },
      ],
    },
  ],
  complexity: [p('Not applicable for this concept lesson. (Cost model: the JVM starts, loads classes, verifies bytecode, then interprets — the first run is a little slower than later iterations of a hot loop because of JIT compilation.)')],
  mistakes: [
    { title: 'Installing only a JRE', wrong: '$ javac Hello.java\nzsh: command not found: javac', why: 'A JRE can run programs but does not contain the compiler. You need a JDK.', fix: 'Install a JDK (Temurin / OpenJDK 17 or newer).' },
    { title: 'Running the source file name with .class', wrong: '$ java Hello.class', why: '`java` takes a **class name**, not a file name.', fix: '$ java Hello' },
    { title: 'Thinking the .class file is machine code', wrong: '// "I compiled on a Mac, so it will not run on Windows"', why: 'Bytecode is platform independent; it only needs a JVM for that platform.', fix: 'Copy Hello.class to the other machine and run java Hello there.' },
  ],
  practice: [
    {
      id: 'how-ex1',
      level: 'beginner',
      title: 'Print your own message',
      statement: 'Write a program that prints exactly: `Write once, run anywhere`',
      examples: [{ input: '(no input)', output: 'Write once, run anywhere' }],
      hints: ['System.out.println("…");'],
      solutionFile: 'm0-how-java-works/Ex1.java',
      solutionExplain: 'A class with a main method that prints the text.',
      tests: [{ stdin: '', stdout: 'Write once, run anywhere' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'What does the `javac` command produce?', options: ['machine code', 'bytecode (.class files)', 'a .exe file', 'a PDF'], answer: 1, explain: 'javac compiles .java source into .class bytecode.' },
    { type: 'mcq', q: 'Which package must you install to COMPILE Java programs?', options: ['JVM', 'JRE', 'JDK', 'JIT'], answer: 2, explain: 'The JDK contains the compiler and tools.' },
    { type: 'mcq', q: 'Why can the same .class file run on Windows and macOS?', options: ['It is machine code for both', 'It is bytecode executed by a platform-specific JVM', 'Java converts it manually', 'It cannot'], answer: 1, explain: 'The JVM hides the platform differences.' },
    { type: 'mcq', q: 'JIT compilation means…', options: ['compiling before the program is written', 'compiling frequently used bytecode to machine code at run time', 'compiling only comments', 'running bytecode twice'], answer: 1, explain: 'Hot code is compiled to native code just in time to speed it up.' },
  ],
  interview: ['Explain the difference between JDK, JRE and JVM.', 'Why is Java platform independent?', 'Is Java compiled or interpreted?', 'What is bytecode?'],
  videos: ['m0-how-java-works', 'm0-how-java-works#2'],
  revision: ['.java → javac → .class (bytecode) → JVM → machine code.', 'JDK ⊃ JRE ⊃ JVM.', 'Write once, run anywhere: only the JVM differs per OS.', 'JIT compiles hot bytecode to native code at run time.'],
  sourceNotes: { discrepancies: ['The slide "Why is JAVA slow?" says Java is slow because linking happens at run time; modern JVMs with JIT compilation are competitive with C++ for long-running programs. Start-up time is where Java is slower.'] },
});

export const javaLandscape: Lesson = lesson({
  id: 'm0-java-landscape',
  dryRun: { algo: 'stack-heap', input: { x: '7', y: '8' }, caption: 'Primitives sit in stack slots; arrays and objects live on the heap behind references.' },
  module: 'm0',
  title: 'The Java Landscape: History, Features, Editions, JVM Memory',
  summary: 'Why Java exists, what it is used for, its editions, and what the JVM does with memory.',
  level: 'beginner',
  track: 'syntax',
  minutes: 25,
  essential: false,
  prerequisites: ['m0-how-java-works'],
  sources: ['Java-Introduction_-Features_-Structure_-Data-Types'],
  objectives: [
    'Name Java\'s key features and what kinds of applications are written in it.',
    'Distinguish Java SE, EE, ME and JavaFX.',
    'Describe the JVM\'s memory areas: heap, stack, method area, and what garbage collection does.',
    'Explain, with reasons, when "Java is slow" is true and false.',
  ],
  intuition: [
    p('Java was created at Sun Microsystems (James Gosling, released 1995) and is now maintained by Oracle and the OpenJDK community. It was designed to be **simple, object-oriented, secure, portable, robust** (strong typing, exceptions, automatic memory management) and **multithreaded**.'),
    table(['Edition', 'For', 'Examples'], [['Java SE (Standard)', 'the core language and libraries — what this course uses', 'console programs, algorithms'], ['Java EE / Jakarta EE (Enterprise)', 'large server-side systems', 'web services, banking back-ends'], ['Java ME (Micro)', 'small embedded devices', 'smart cards, older phones'], ['JavaFX', 'desktop graphical user interfaces', 'rich client apps']]),
    p('Java applications fall into four families: **standalone** (desktop/console), **web**, **enterprise**, and **mobile** (Android apps are written in Java/Kotlin).'),
    h('What the JVM does for you'),
    ul('**Loads** class files and **verifies** that the bytecode is safe.', '**Executes** the bytecode (interpreter + JIT).', 'Manages **memory**: you create objects with `new`; the **garbage collector** frees them when nothing refers to them any more. No manual `free()`.'),
    pre(`
JVM memory areas
┌─────────────┐  ┌──────────────┐  ┌────────────────────────────┐
│ Method area │  │ Stack        │  │ Heap                        │
│ class code, │  │ one frame per│  │ all objects (garbage-       │
│ static data │  │ method call: │  │ collected)                  │
│             │  │ local vars   │  │                             │
└─────────────┘  └──────────────┘  └────────────────────────────┘
`),
    why('Local variables and method calls live on the **stack** (fast, automatic, limited — a runaway recursion overflows it). Objects live on the **heap** (large, flexible, cleaned by the garbage collector). Understanding this split explains StackOverflowError, OutOfMemoryError and pass-by-value of references later in the course.'),
  ],
  syntax: [
    table(['feature', 'since', 'syntax'], [['var (local type inference)', 'Java 10', '`var n = 5;`'], ['switch expression', 'Java 14', '`int d = switch (x) { case 1 -> 10; default -> 0; };`'], ['text block', 'Java 15', '`String s = """ ...multi-line... """;`'], ['record', 'Java 16', '`record Point(int x, int y) { }`'], ['pattern matching for instanceof', 'Java 16', '`if (o instanceof String s) { ... s.length() ... }`']], 'Syntax that appeared after Java 8 (this course targets Java 17+)'),
    p('**Long-term-support (LTS)** releases are the ones companies stay on: Java 8, 11, 17, 21 and 25. A new feature release appears every six months; `javac --release 17` compiles *as if* for Java 17, even on a newer JDK.'),
  ],
  tiny: [code(`
int x = 5;                    // x lives on the stack
int[] numbers = new int[100]; // the array object lives on the heap; 'numbers' (a reference) lives on the stack
`)],
  guided: [prog('m0-java-landscape/RuntimeInfo.java', 'Ask the JVM about its cores and heap')],
  programs: [
    {
      file: 'm0-java-landscape/RuntimeInfo.java',
      title: 'JVM resources',
      role: 'demo',
      description: 'Runtime.getRuntime() gives access to the JVM\'s view of the machine.',
      walkthrough: [
        { at: 'Runtime rt = Runtime.getRuntime();', text: 'The singleton object that represents the running JVM.' },
        { at: 'rt.availableProcessors()', text: 'How many CPU cores the JVM may use.' },
        { at: 'rt.maxMemory() / mb', text: 'The largest heap it may grow to, converted from bytes to megabytes.' },
      ],
    },
  ],
  complexity: [p('Not applicable. (Memory model: stack frames are created and destroyed in LIFO order in O(1); heap allocation is O(1) amortised; garbage collection runs automatically and is not under the programmer\'s control.)')],
  mistakes: [
    { title: 'Believing Java has no memory leaks', wrong: 'static List<byte[]> cache = new ArrayList<>();\ncache.add(new byte[10_000_000]);   // never removed', why: 'The garbage collector frees only unreachable objects. Anything still referenced stays in memory.', fix: 'Remove references (set to null / clear the collection) when no longer needed.' },
    { title: 'Mixing up edition names', wrong: '// "I need Java EE to write a console algorithm program"', why: 'Algorithms and this whole course use Java SE.', fix: 'Install a standard JDK.' },
    { title: 'Assuming Java is always slow', wrong: '// "the slides say dynamic linking makes Java slow"', why: 'With the JIT, steady-state performance is close to native for most algorithmic code. Short programs pay a start-up cost.', fix: 'Measure; do not assume.' },
  ],
  practice: [
    {
      id: 'land-ex1',
      level: 'beginner',
      title: 'Powers of two in memory units',
      statement: 'Read a number of megabytes M and print how many bytes that is (1 MB = 1024 × 1024 bytes). Use long.',
      constraints: ['0 ≤ M ≤ 8 000 000 000'],
      examples: [{ input: '256', output: '268435456' }],
      hints: ['long bytes = (long) M * 1024 * 1024;'],
      solutionFile: 'm0-java-landscape/Ex1.java',
      solutionExplain: 'Cast to long before multiplying to avoid int overflow.',
      tests: [{ stdin: '256\n', stdout: '268435456' }, { stdin: '1\n', stdout: '1048576' }, { stdin: '4096\n', stdout: '4294967296' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Where are Java objects stored?', options: ['stack', 'heap', 'registers', 'method area'], answer: 1, explain: 'Objects live on the heap; references to them may live on the stack.' },
    { type: 'mcq', q: 'What does the garbage collector do?', options: ['compiles code', 'frees objects that are no longer reachable', 'sorts memory', 'closes files'], answer: 1, explain: 'Automatic memory management.' },
    { type: 'mcq', q: 'Which edition is used for standard Java programs and algorithms?', options: ['Java ME', 'Java EE', 'Java SE', 'JavaFX only'], answer: 2, explain: 'Java SE (Standard Edition).' },
    { type: 'mcq', q: 'A recursion that never stops usually ends with…', options: ['OutOfMemoryError: heap', 'StackOverflowError', 'a compile error', 'NullPointerException'], answer: 1, explain: 'The call stack is exhausted.' },
  ],
  interview: ['What are the main features of Java?', 'Stack vs heap?', 'What is garbage collection?', 'Is Java pass-by-value or pass-by-reference? (preview)'],
  videos: ['m0-java-landscape', 'm0-java-landscape#2'],
  revision: ['Java SE = core; EE = enterprise servers; ME = embedded; JavaFX = GUIs.', 'Stack: frames/locals. Heap: objects. GC frees unreachable objects.', 'Features: OO, portable, robust, secure, multithreaded.'],
});

export const installMac: Lesson = lesson({
  id: 'm0-install-mac',
  dryRun: { algo: 'setup-check', input: { jdk: '21' }, caption: 'The five commands that prove your JDK works.' },
  module: 'm0',
  title: 'Installing Java on macOS and Choosing an Editor',
  summary: 'Install a JDK, verify it from the terminal, and run a program from VS Code or IntelliJ IDEA.',
  level: 'beginner',
  track: 'syntax',
  minutes: 30,
  essential: true,
  prerequisites: ['m0-how-java-works'],
  sources: ['Java-Introduction_-Features_-Structure_-Data-Types'],
  objectives: [
    'Install a JDK 17+ on macOS and verify `java -version` and `javac -version`.',
    'Compile and run a program from the Terminal.',
    'Run the same program from VS Code or IntelliJ IDEA.',
    'Fix the two most common set-up problems (command not found, wrong version).',
  ],
  intuition: [
    p('You need three things: a **JDK**, a **terminal** (built into macOS) and an **editor or IDE**. This course targets **Java 17 (LTS)**: every program compiles with `javac --release 17`, so any newer JDK works too.'),
    h('1. Install the JDK'),
    ol('Install Homebrew-free: download a JDK 17+ installer (**Temurin** from adoptium.net, or Oracle OpenJDK) and run it; **or** with Homebrew: `brew install --cask temurin@17`.', 'Open a new Terminal window.', 'Verify (see below).'),
    h('2. Verify it'),
    code(`
java -version        # shows e.g.  openjdk version "17.0.x"
javac -version       # shows e.g.  javac 17.0.x
`),
    h('3. Compile and run in the terminal'),
    code(`
cd ~/Desktop
nano Hello.java            # type the program, save with Ctrl-O, quit with Ctrl-X
javac Hello.java           # creates Hello.class
java Hello                 # runs it
`),
    h('4. Pick an editor'),
    table(['Tool', 'Good for', 'Notes'], [['VS Code + "Extension Pack for Java"', 'lightweight, fast start', 'install the extension pack, open a folder, click Run above main'], ['IntelliJ IDEA Community', 'full-featured IDE', 'File ▸ New ▸ Project, choose your JDK; Run with the green arrow'], ['Terminal + any text editor', 'learning exactly what happens', 'javac / java as above']]),
    why('An IDE runs exactly the same two commands (`javac`, then `java`) for you when you press Run. Knowing the terminal commands means you are never stuck when the IDE misbehaves and you can use this site\'s playground, which compiles with the same tools.'),
  ],
  syntax: [
    code(`
brew install --cask temurin@17        # a free OpenJDK build (Homebrew); 21 or 25 also work
/usr/libexec/java_home -V             # list every JDK installed on this Mac
export JAVA_HOME=$(/usr/libexec/java_home -v 17)   # choose one for this terminal session
echo $JAVA_HOME
javac -version && java -version       # both must print the same major version
`, 'macOS terminal'),
    note('Homebrew is optional: you can also download a `.pkg` installer from adoptium.net. The terminal commands above are the same either way.'),
  ],
  tiny: [code(`
public class VerifyInstall {
    public static void main(String[] args) {
        System.out.println("java.version = " + System.getProperty("java.version"));
    }
}
`)],
  guided: [prog('m0-install-mac/VerifyInstall.java', 'Save as VerifyInstall.java, then: javac VerifyInstall.java && java VerifyInstall'), tip('If `javac` is not found but `java` is, you installed only a runtime. Install the JDK. If you have several JDKs, `/usr/libexec/java_home -V` lists them and `export JAVA_HOME=$(/usr/libexec/java_home -v 17)` selects one for the current terminal.', 'Troubleshooting on macOS')],
  programs: [
    {
      file: 'm0-install-mac/VerifyInstall.java',
      title: 'Verify the installation',
      role: 'demo',
      description: 'If this compiles and prints, your JDK is correctly installed.',
      walkthrough: [
        { at: 'public class VerifyInstall', text: 'The file must be named VerifyInstall.java — a public class must match its file name.' },
        { at: 'java.home', text: 'The folder of the JDK that is actually running — useful when several are installed.' },
      ],
    },
  ],
  complexity: [p('Not applicable (set-up lesson).')],
  mistakes: [
    { title: 'File name does not match the class', wrong: '// saved as hello.java\npublic class Hello { ... }', why: 'javac reports "class Hello is public, should be declared in a file named Hello.java". Names are case-sensitive.', fix: 'Save as Hello.java.' },
    { title: 'Running from the wrong folder', wrong: '$ java Hello\nError: Could not find or load main class Hello', why: 'The .class file is not in the current directory (or you included the .class extension).', fix: 'cd to the folder with Hello.class, run `java Hello`.' },
    { title: 'Old Java picked up first', wrong: '$ java -version\njava version "1.8.0_…"', why: 'An older JDK is first on the PATH.', fix: 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)  (and add it to ~/.zshrc)' },
  ],
  practice: [
    {
      id: 'inst-ex1',
      level: 'beginner',
      title: 'Compile and run it yourself',
      statement: 'In the playground or your terminal run the verification program. Then write a program that prints the two lines `JDK ready` and `Let us begin`.',
      examples: [{ input: '(no input)', output: 'JDK ready\nLet us begin' }],
      hints: ['Two System.out.println statements.'],
      solutionFile: 'm0-install-mac/Ex1.java',
      solutionExplain: 'Two print statements, each followed by a newline.',
      tests: [{ stdin: '', stdout: 'JDK ready\nLet us begin' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Which command compiles Hello.java?', options: ['java Hello.java', 'javac Hello.java', 'compile Hello', 'jvm Hello'], answer: 1, explain: 'javac is the compiler.' },
    { type: 'mcq', q: 'After compiling you run it with…', options: ['java Hello', 'java Hello.class', 'javac Hello', './Hello.java'], answer: 0, explain: 'Use the class name, without extension.' },
    { type: 'mcq', q: '"javac: command not found" usually means…', options: ['your code has an error', 'no JDK (compiler) is installed or on the PATH', 'Java is too old', 'the file is empty'], answer: 1, explain: 'The compiler is missing from the PATH.' },
    { type: 'mcq', q: 'This course compiles programs for which Java language level?', options: ['Java 8', 'Java 11', 'Java 17', 'Java 21 preview'], answer: 2, explain: 'Java 17 (LTS); newer JDKs compile with --release 17.' },
  ],
  interview: ['What is the PATH and why does javac need to be on it?', 'What does an IDE do when you press Run?', 'What is JAVA_HOME for?'],
  videos: ['m0-install-mac', 'm0-install-mac#2'],
  revision: ['Install JDK 17+; verify java -version and javac -version.', 'javac X.java → X.class; java X.', 'File name = public class name.', 'IDEs just call javac and java for you.'],
});

export const firstProgram: Lesson = lesson({
  id: 'm0-first-program',
  dryRun: { algo: 'print-buffer', input: { words: 'A,B,C,D' }, caption: 'print keeps the cursor on the line; println ends it.' },
  module: 'm0',
  title: 'Your First Program: class, main, statements, comments',
  summary: 'Every part of Hello World explained: the class, the main method, statements, braces, semicolons, comments, files and packages.',
  level: 'beginner',
  track: 'syntax',
  minutes: 35,
  essential: true,
  prerequisites: ['m0-install-mac'],
  sources: ['Java-Introduction_-Features_-Structure_-Data-Types', 'Basic-I_O_-Operators'],
  objectives: [
    'Write, compile and run a program from scratch and explain every keyword in it.',
    'Use statements, blocks `{}`, semicolons and comments correctly.',
    'Explain the relationship between file name, class name, package and folder.',
    'Read a line of input with Scanner for the first time.',
  ],
  intuition: [
    pre(`
public class HelloWorld {                      ← a class: every Java program lives in one
    public static void main(String[] args) {   ← main: the JVM starts running here
        System.out.println("Hello, Java!");    ← a statement (ends with ;)
    }                                          ← } closes the method
}                                              ← } closes the class
`),
    table(['piece', 'meaning'], [['public', 'access modifier: visible to everyone (the JVM must be able to call main)'], ['class HelloWorld', 'declares a class named HelloWorld; the file must be HelloWorld.java'], ['static', 'belongs to the class itself, so the JVM can call it without creating an object'], ['void', 'the method returns no value'], ['main', 'the special name where execution begins'], ['String[] args', 'command-line arguments, an array of strings (unused for now)'], ['System.out.println(...)', 'print a line: System is a class, out its output stream, println a method']]),
    why('Java is strict: *everything* is inside a class, and execution starts at `public static void main(String[] args)`. Memorise this line as a unit for now; each word is explained fully in the OOP module. A **statement** is one instruction and ends with `;`. Braces `{ }` group statements into a **block**. Indentation does not matter to the compiler but matters hugely to readers.'),
    h('Files, folders, packages'),
    ul('One public class per file, and the file is named exactly like the class (`HelloWorld.java`).', 'A **package** groups related classes: `package com.example.demo;` as the first line means the file lives in a folder `com/example/demo/`. Small programs use the default (no) package.', 'Class names use `UpperCamelCase`; methods and variables `lowerCamelCase`; constants `UPPER_SNAKE_CASE`.'),
    h('Comments'),
    code(`
// single-line comment
/* multi-line
   comment */
/** Javadoc: documents the next class or method */
`),
  ],
  syntax: [tip('You can save typing with an IDE template: in IntelliJ type `psvm` + Tab, in VS Code type `main` + Tab.', 'Shortcut')],
  tiny: [code(`
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
`)],
  guided: [
    prog('m0-first-program/HelloWorld.java', 'The classic'),
    prog('m0-first-program/AnatomyOfAProgram.java', 'Variables, an expression and comments'),
    prog('m0-first-program/Greeting.java', 'Your first program that reads input'),
  ],
  programs: [
    {
      file: 'm0-first-program/HelloWorld.java',
      title: 'Hello, Java!',
      role: 'tiny',
      description: 'The smallest complete Java program.',
      walkthrough: [
        { at: 'public class HelloWorld', text: 'Declares the class. The name must match the file name HelloWorld.java.' },
        { at: 'public static void main(String[] args)', text: 'The entry point the JVM looks for.' },
        { at: 'System.out.println("Hello, Java!");', text: 'Prints the text and moves to a new line. Text in double quotes is a String literal.' },
      ],
    },
    {
      file: 'm0-first-program/AnatomyOfAProgram.java',
      title: 'Anatomy: variables and expressions',
      role: 'demo',
      description: 'Shows comments, two int variables, an expression, and string concatenation.',
      walkthrough: [
        { at: 'int apples = 3;', text: 'A variable declaration with a value: type `int`, name `apples`.' },
        { at: 'int fruit = apples + oranges;', text: 'An expression is evaluated and its result stored.' },
        { at: 'System.out.println("Fruit: " + fruit);', text: '`+` joins a String with a number: the number is converted to text.' },
      ],
    },
    {
      file: 'm0-first-program/Greeting.java',
      title: 'Reading a name',
      role: 'demo',
      description: 'Scanner reads from the keyboard (System.in).',
      walkthrough: [
        { at: 'import java.util.Scanner;', text: 'Brings the Scanner class into scope so we can use its short name.' },
        { at: 'Scanner in = new Scanner(System.in);', text: 'Create a scanner attached to standard input.' },
        { at: 'in.nextLine()', text: 'Read a whole line of text the user typed.' },
      ],
    },
  ],
  complexity: [p('Not applicable. (Each statement here takes constant time.)')],
  mistakes: [
    { title: 'Missing semicolon', wrong: 'System.out.println("Hi")', why: 'Compile error: ";" expected. Every statement ends with a semicolon.', fix: 'System.out.println("Hi");' },
    { title: 'Wrong capitalisation', wrong: 'system.out.println("Hi");', why: 'Java is case-sensitive: `System` is the class; `system` does not exist (error: package system does not exist).', fix: 'System.out.println("Hi");' },
    { title: 'Mismatched braces', wrong: 'public class A {\n    public static void main(String[] a) {\n        System.out.println("x");\n}', why: 'The class brace is never closed: "reached end of file while parsing".', fix: 'Add the missing } and let the editor auto-indent to see structure.' },
  ],
  practice: [
    {
      id: 'first-ex1',
      level: 'beginner',
      title: 'Print a box',
      statement: 'Print exactly these three lines:\n```\n+--+\n|Hi|\n+--+\n```',
      examples: [{ input: '(no input)', output: '+--+\n|Hi|\n+--+' }],
      hints: ['Three println statements.'],
      solutionFile: 'm0-first-program/Ex1.java',
      solutionExplain: 'Each println prints one line.',
      tests: [{ stdin: '', stdout: '+--+\n|Hi|\n+--+' }],
    },
    {
      id: 'first-ex2',
      level: 'beginner',
      title: 'Echo a name',
      statement: 'Read a name (one line) and print `Hello, <name>!`',
      examples: [{ input: 'Asha', output: 'Hello, Asha!' }],
      hints: ['Scanner.nextLine() and string concatenation.'],
      solutionFile: 'm0-first-program/Ex2.java',
      solutionExplain: 'Read one line, then concatenate.',
      tests: [{ stdin: 'Asha\n', stdout: 'Hello, Asha!' }, { stdin: 'Java Learner\n', stdout: 'Hello, Java Learner!' }],
    },
    {
      id: 'first-ex3',
      level: 'intermediate',
      title: 'Sum two numbers',
      statement: 'Read two integers on one line and print their sum.',
      examples: [{ input: '7 5', output: '12' }],
      hints: ['sc.nextInt() twice.'],
      solutionFile: 'm0-first-program/Ex3.java',
      solutionExplain: 'Scanner.nextInt() reads whitespace-separated integers.',
      tests: [{ stdin: '7 5\n', stdout: '12' }, { stdin: '-3 10\n', stdout: '7' }, { stdin: '0 0\n', stdout: '0' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'Where does a Java program start executing?', options: ['the first line of the file', 'the main method', 'the class name', 'the package statement'], answer: 1, explain: 'The JVM calls public static void main(String[] args).' },
    { type: 'bug', q: 'Which line has the compile error?', code: 'public class T {\n    public static void main(String[] args) {\n        System.out.println("Hi")\n    }\n}', answerLine: 3, explain: 'A semicolon is missing at the end of the statement.' },
    { type: 'fill', q: 'Complete the program.', template: 'public ___ Hello {\n    public static ___ main(String[] args) {\n        System.out.println("Hi");\n    }\n}', blanks: [['class'], ['void']], explain: 'A class declaration and a void return type.' },
    { type: 'output', q: 'What is printed?', code: 'System.out.print("A");\nSystem.out.print("B");\nSystem.out.println("C");\nSystem.out.println("D");', answer: 'ABC\nD', explain: 'print does not add a newline; println does.' },
    { type: 'mcq', q: 'The file for `public class Counter` must be named…', options: ['counter.java', 'Counter.java', 'Main.java', 'any name'], answer: 1, explain: 'A public class must be in a file with exactly its name.' },
  ],
  interview: ['Why is main static?', 'What happens if the file name differs from the public class name?', 'What is a package?', 'What does String[] args contain?'],
  videos: ['m0-first-program', 'm0-first-program#2'],
  revision: ['public class X {...} in X.java; main = public static void main(String[] args).', 'Statements end with ;  Blocks use { }.', 'Comments: // line, /* block */, /** javadoc */.', 'Case-sensitive; classes UpperCamelCase.'],
});

export const errors: Lesson = lesson({
  id: 'm0-errors',
  dryRun: { algo: 'error-kinds', input: { kind: '1' }, caption: 'A compile-time error stops everything before the program runs. Try scenarios 2 and 3 as well.' },
  module: 'm0',
  title: 'Compile-time, Runtime and Logic Errors',
  summary: 'The three families of bugs, how each one shows up, and how to read an error message.',
  level: 'beginner',
  track: 'syntax',
  minutes: 30,
  essential: true,
  prerequisites: ['m0-first-program'],
  objectives: [
    'Recognise a compile-time error message and locate the line it points to.',
    'Recognise a runtime exception and read its stack trace.',
    'Detect a logic error by comparing the output with what you expected.',
    'Apply a simple debugging routine: read, reproduce, isolate, fix, re-test.',
  ],
  intuition: [
    table(['kind', 'when', 'what you see', 'example'], [['Compile-time (syntax / type)', 'before the program runs', 'javac refuses; no .class file', 'missing ;  int x = "hi";'], ['Runtime', 'while it runs', 'program stops with an exception and a stack trace', '10 / 0,  array index 5 of 3,  null.length()'], ['Logic', 'always compiles & runs', 'wrong answer, no message', 'average = a + b / 2']]),
    p('The compiler is your first teacher: it reports the **file, line number and message**. Read the *first* error first — one mistake often causes a cascade of later complaints.'),
    code(`
Hello.java:3: error: ';' expected
        System.out.println("Hi")
                                ^
1 error
`, 'A typical compile-time error: file:line, the message, the source line with a caret.'),
    code(`
Exception in thread "main" java.lang.ArithmeticException: / by zero
        at Calc.main(Calc.java:6)
`, 'A runtime error: exception type, message, and the stack trace (where it happened).'),
    why('Compile-time errors are the cheapest to fix because the compiler finds them for you. Runtime errors need a test that reaches the faulty line. Logic errors are the most expensive: nothing complains, and the program is simply wrong. That is why you must **check outputs against hand-calculated examples** — the habit this course trains with dry runs and tests.'),
  ],
  syntax: [
    pre(`
Hello.java:5: error: ';' expected          <- compile-time: file : line : message
        System.out.println("Hi")
                                ^         <- the caret points at the problem

Exception in thread "main" java.lang.ArithmeticException: / by zero
        at Hello.main(Hello.java:7)        <- run-time: exception type, message, then the call stack
`, 'How to read the two kinds of message'),
    table(['message', 'usually means'], [["';' expected", 'a missing semicolon on that line or the line above'], ['cannot find symbol', 'misspelt name, missing import, or variable out of scope'], ['incompatible types', 'a value of the wrong type (e.g. a double assigned to an int)'], ['missing return statement', 'some path through the method never returns'], ['ArrayIndexOutOfBoundsException', 'index < 0 or >= length'], ['NullPointerException', 'a reference that holds null was dereferenced'], ['NumberFormatException', 'Integer.parseInt on text that is not a number']]),
  ],
  tiny: [code(`
int total = 10;
int count = 4;
double average = total / count;   // logic error: integer division → 2.0, not 2.5
`)],
  guided: [prog('m0-errors/ThreeKindsOfErrors.java', 'Catches two runtime errors on purpose and shows a logic bug next to the fix')],
  programs: [
    {
      file: 'm0-errors/ThreeKindsOfErrors.java',
      title: 'Three kinds of errors',
      role: 'demo',
      description: 'try/catch lets the program keep running after a runtime error so we can print the message.',
      walkthrough: [
        { at: 'catch (ArithmeticException e)', text: 'Handle the exception named ArithmeticException: dividing an int by zero throws it.' },
        { at: 'e.getMessage()', text: 'The human-readable detail: "/ by zero".' },
        { at: 'arr[3] = 1;', text: 'An array of length 3 has indices 0, 1, 2 — index 3 throws ArrayIndexOutOfBoundsException.' },
        { at: 'return a + b / 2;', text: 'A LOGIC error: `/` binds tighter than `+`, so this is a + (b / 2) = 20, not the average 15.' },
      ],
    },
  ],
  complexity: [p('Not applicable.')],
  mistakes: [
    { title: 'Fixing the last error first', wrong: '// 12 errors reported; start from the bottom', why: 'Early errors (a missing brace) cause later ones. Fix the first, recompile.', fix: 'Start from the top; recompile after each fix.' },
    { title: 'Ignoring the stack trace line number', wrong: '// "NullPointerException" → randomly editing code', why: 'The trace names the exact line where the exception was thrown.', fix: 'Open that line and ask which value is null / out of range.' },
    { title: 'Trusting output without checking', wrong: 'double avg = (a + b) / 2;   // a, b are ints', why: 'Integer division silently truncates. No error — only a wrong answer.', fix: 'double avg = (a + b) / 2.0;' },
  ],
  practice: [
    {
      id: 'err-ex1',
      level: 'beginner',
      title: 'Correct average',
      statement: 'Read two integers a and b and print their average as a decimal with exactly one digit after the point (e.g. 2.5).',
      examples: [{ input: '2 3', output: '2.5' }],
      hints: ['Divide by 2.0, not 2.', 'System.out.printf("%.1f%n", value);'],
      solutionFile: 'm0-errors/Ex1.java',
      solutionExplain: 'Dividing by the double 2.0 forces floating-point division; printf formats one decimal.',
      tests: [{ stdin: '2 3\n', stdout: '2.5' }, { stdin: '10 20\n', stdout: '15.0' }, { stdin: '-1 0\n', stdout: '-0.5' }],
    },
    {
      id: 'err-ex2',
      level: 'intermediate',
      title: 'Safe division',
      statement: 'Read two integers a and b. Print a / b as integer division, or the text `cannot divide by zero` if b is 0 (without crashing).',
      examples: [{ input: '7 2', output: '3' }, { input: '5 0', output: 'cannot divide by zero' }],
      hints: ['Check b first, or catch ArithmeticException.'],
      solutionFile: 'm0-errors/Ex2.java',
      solutionExplain: 'A guard condition prevents the runtime error.',
      tests: [{ stdin: '7 2\n', stdout: '3' }, { stdin: '5 0\n', stdout: 'cannot divide by zero' }, { stdin: '-7 2\n', stdout: '-3' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: '`int x = "hello";` is…', options: ['a runtime error', 'a compile-time error', 'a logic error', 'fine'], answer: 1, explain: 'A type mismatch is found by the compiler.' },
    { type: 'mcq', q: 'The program prints 20 where 15 was expected, with no error message. This is a…', options: ['compile-time error', 'runtime error', 'logic error', 'warning'], answer: 2, explain: 'It runs fine but is wrong.' },
    { type: 'mcq', q: 'Which of these is a runtime error?', options: ['missing semicolon', 'dividing an int by zero', 'misspelled keyword', 'unmatched brace'], answer: 1, explain: 'ArithmeticException happens while running.' },
    { type: 'output', q: 'What does this print?', code: 'int a = 7, b = 2;\nSystem.out.println(a / b);', answer: '3', explain: 'Integer division truncates the .5.' },
    { type: 'mcq', q: 'In "Hello.java:3: error: \';\' expected" what does 3 mean?', options: ['3 errors', 'line number', 'column', 'error code'], answer: 1, explain: 'Line 3 of Hello.java.' },
  ],
  interview: ['Difference between compile-time and runtime errors?', 'What is a stack trace?', 'How do you debug a logic error?', 'What is an exception?'],
  videos: ['m0-errors', 'm0-errors#2'],
  revision: ['Compile-time: compiler refuses (syntax/type). Runtime: exception while running. Logic: wrong answer, no message.', 'Read the first compiler error; use the line number.', 'Stack trace: exception type, message, where.', 'Check outputs against hand examples.'],
});

export const introAlgorithms: Lesson = lesson({
  id: 'm0-intro-algorithms',
  dryRun: { algo: 'array-scan', input: { arr: '7,3,9,4,9,2' }, caption: 'An algorithm in action: a single left-to-right scan that finds the largest value.' },
  module: 'm0',
  title: 'What Is an Algorithm?',
  summary: 'An algorithm is a precise, finite list of steps. Learn to describe one, check it for correctness and think about efficiency.',
  level: 'beginner',
  track: 'core',
  minutes: 30,
  essential: true,
  prerequisites: ['m0-first-program'],
  sources: ['Introduction-to-Algorithms'],
  objectives: [
    'Define an algorithm and list its essential properties.',
    'Express an algorithm in plain English, pseudocode and Java.',
    'Explain correctness and efficiency as the two quality measures.',
    'Recognise the main families of algorithms you will meet in this course.',
  ],
  intuition: [
    p('An **algorithm** is a set of well-defined instructions — a sequence of steps — that solves a specific problem or performs a task. A recipe is an algorithm for cooking; a route description is an algorithm for travel. To count as an algorithm the steps must be:'),
    ul('**Unambiguous** — each step has exactly one meaning.', '**Finite** — it stops after a bounded number of steps.', '**Effective** — each step is simple enough to be carried out.', '**Input and output** — it takes zero or more inputs and produces a result.'),
    p('You can express the same algorithm in several ways: natural language, **pseudocode**, a flowchart, or a programming language. Example — "find the largest number in a list":'),
    pre(`
natural language : Remember the first number. Look at each other number; if it is
                   bigger than the remembered one, remember it instead. The
                   remembered number at the end is the largest.

pseudocode       : largest = list[0]
                   for each x in list[1..]
                       if x > largest then largest = x
                   return largest
`),
    why('Two questions decide whether an algorithm is good: **Is it correct?** (does it give the right answer for *every* valid input, including edge cases?) and **Is it efficient?** (how much time and memory does it use as the input grows?). A fast wrong algorithm is useless; a correct but hopelessly slow one is also unusable. The rest of this course keeps returning to these two questions — with correctness checked by dry runs and tests, and efficiency expressed with Big-O.'),
    table(['family', 'idea', 'examples in this course'], [['searching / sorting', 'find or order data', 'linear/binary search, quick sort'], ['number theory', 'properties of integers', 'GCD, sieve, φ, CRT'], ['divide and conquer', 'split, solve, combine', 'Karatsuba, quick sort'], ['greedy', 'best local choice', 'weighted string'], ['backtracking', 'try, undo, try again', 'N-Queens, maze'], ['dynamic programming', 'remember sub-answers', 'grid paths']]),
  ],
  syntax: [
    table(['idea', 'pseudocode', 'Java'], [['assignment', '`x ← 5`', '`x = 5;`'], ['decision', '`if a > b then … else …`', '`if (a > b) { … } else { … }`'], ['counting loop', '`for i from 1 to n`', '`for (int i = 1; i <= n; i++)`'], ['conditional loop', '`while cond do …`', '`while (cond) { … }`'], ['result', '`return v`', '`return v;`'], ['input / output', '`read n` / `print x`', '`n = sc.nextInt();` / `System.out.println(x);`']], 'From pseudocode to Java'),
    p('Flowchart symbols: **oval** = start/end, **rectangle** = process step, **diamond** = decision (yes/no), **parallelogram** = input/output, **arrows** = order of execution.'),
  ],
  tiny: [code(`
int largest = list[0];
for (int i = 1; i < list.length; i++)
    if (list[i] > largest) largest = list[i];
`)],
  guided: [prog('m0-intro-algorithms/FindLargest.java', 'The algorithm above as a complete Java program (try it in the playground)')],
  programs: [
    {
      file: 'm0-intro-algorithms/FindLargest.java',
      title: 'Find the largest number',
      role: 'tiny',
      description: 'Reads n and then n integers; prints the largest.',
      walkthrough: [
        { at: 'int largest = sc.nextInt();', text: 'Step 1: the first number is the largest so far.' },
        { at: 'for (int i = 1; i < n; i++)', text: 'Step 2: examine the remaining n − 1 numbers.' },
        { at: 'if (x > largest)', text: 'A bigger number replaces the remembered one.' },
        { at: 'System.out.println("largest = " + largest);', text: 'Step 3: report the answer.' },
      ],
    },
  ],
  complexity: [p('The algorithm looks at each number exactly once: **n − 1 comparisons → O(n) time, O(1) space.** Doubling the list doubles the work — that "grows in proportion to n" statement is exactly what Big-O captures (see the complexity lessons).')],
  mistakes: [
    { title: 'Starting with 0 as the largest', wrong: 'int largest = 0;', why: 'If all numbers are negative, 0 is returned although it is not in the list.', fix: 'Start with the first element (or Integer.MIN_VALUE).' },
    { title: 'Forgetting the empty-input case', wrong: 'int largest = sc.nextInt();   // n = 0', why: 'An algorithm must say what happens for every valid input, including "no numbers".', fix: 'Check n ≥ 1 or define the result for an empty list.' },
    { title: 'An ambiguous step', wrong: '"Find the biggest element and swap it with a big one."', why: 'Which big one? Algorithms must be unambiguous.', fix: 'Specify exactly which element and how it is chosen.' },
  ],
  practice: [
    {
      id: 'alg-ex1',
      level: 'beginner',
      title: 'Find the smallest',
      statement: 'Read n and n integers. Print the smallest.',
      examples: [{ input: '4\n5 2 8 1', output: '1' }],
      hints: ['Mirror the "largest" algorithm with < instead of >.'],
      solutionFile: 'm0-intro-algorithms/Ex1.java',
      solutionExplain: 'Same scan, opposite comparison.',
      tests: [{ stdin: '4\n5 2 8 1\n', stdout: '1' }, { stdin: '1\n7\n', stdout: '7' }, { stdin: '3\n-5 -9 -1\n', stdout: '-9' }],
    },
    {
      id: 'alg-ex2',
      level: 'beginner',
      title: 'Sum of the numbers',
      statement: 'Read n and n integers. Print their sum.',
      examples: [{ input: '4\n5 2 8 1', output: '16' }],
      hints: ['An accumulator variable that starts at 0.'],
      solutionFile: 'm0-intro-algorithms/Ex2.java',
      solutionExplain: 'Add each number to a running total.',
      tests: [{ stdin: '4\n5 2 8 1\n', stdout: '16' }, { stdin: '2\n-3 3\n', stdout: '0' }, { stdin: '1\n100\n', stdout: '100' }],
    },
    {
      id: 'alg-ex3',
      level: 'intermediate',
      title: 'Is it sorted?',
      statement: 'Read n and n integers. Print YES if they are in non-decreasing order, otherwise NO.',
      examples: [{ input: '4\n1 2 2 3', output: 'YES' }],
      hints: ['Compare each number with the previous one.'],
      solutionFile: 'm0-intro-algorithms/Ex3.java',
      solutionExplain: 'One pass remembering the previous element; any decrease means NO.',
      tests: [{ stdin: '4\n1 2 2 3\n', stdout: 'YES' }, { stdin: '3\n3 2 1\n', stdout: 'NO' }, { stdin: '1\n5\n', stdout: 'YES' }],
    },
  ],
  quiz: [
    { type: 'mcq', q: 'What is an algorithm?', options: ['A computer program', 'A set of instructions to solve a problem', 'A programming language', 'A hardware component'], answer: 1, explain: 'The slide\'s own MCQ: a set of well-defined instructions that solves a problem.' },
    { type: 'mcq', q: 'Which property is NOT required of an algorithm?', options: ['finite', 'unambiguous', 'written in Java', 'produces output'], answer: 2, explain: 'It can be expressed in any notation.' },
    { type: 'mcq', q: 'A correct algorithm that takes 10 years on real inputs is…', options: ['good', 'impractical: efficiency matters too', 'incorrect', 'a heuristic'], answer: 1, explain: 'Correctness and efficiency are both needed.' },
    { type: 'mcq', q: 'To find the largest of n numbers you need at least…', options: ['1 comparison', 'n − 1 comparisons', 'n² comparisons', 'log n comparisons'], answer: 1, explain: 'Each of the other n − 1 numbers must be compared at least once.' },
  ],
  interview: ['Define an algorithm and its properties.', 'Difference between an algorithm and a program?', 'How do you prove an algorithm correct?', 'Why does efficiency matter?'],
  videos: ['m0-intro-algorithms', 'm0-intro-algorithms#2'],
  revision: ['Algorithm = finite, unambiguous, effective steps from input to output.', 'Write as English / pseudocode / code.', 'Judge by correctness and efficiency.', 'Families: search/sort, number theory, divide & conquer, greedy, backtracking, DP.'],
  sourceNotes: { discrepancies: ['The Introduction deck is a single definition and one MCQ ("What is an algorithm?" answer: b). The properties listed here are the standard textbook definition.'] },
});
