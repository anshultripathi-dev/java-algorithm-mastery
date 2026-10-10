import type { LabAlgorithm, TraceStep, Mark } from '../types';
import { arr, err, ints } from './helpers';

const num = (s: string | undefined) => (s === undefined || s.trim() === '' ? NaN : Math.trunc(+s));
const words = (s: string | undefined, max: number, re = /^[A-Za-z0-9]{1,10}$/): string[] | null => {
  const w = (s ?? '').split(/[\s,]+/).filter(Boolean);
  return w.length >= 1 && w.length <= max && w.every((x) => re.test(x)) ? w : null;
};
const javaHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
};
const spread = (h: number) => (h ^ (h >>> 16)) >>> 0;

// ───────────────────────── Module 3 ─────────────────────────

export const objectCreation: LabAlgorithm = {
  id: 'object-creation',
  title: 'What new Student(...) does',
  lesson: 'm3-classes-objects',
  summary: 'new allocates an object with default field values, the constructor fills them in, and variables only hold references.',
  inputs: [
    { key: 'name', label: 'name', default: 'Ana', type: 'text' },
    { key: 'age', label: 'age (0–120)', default: '20', type: 'number' },
  ],
  pseudocode: ['Student s;', 's = new Student(name, age);', 'Student t = s;', 't.age++;'],
  run({ name, age }) {
    const A = num(age);
    if (!name || !/^[A-Za-z]{1,10}$/.test(name) || !(A >= 0 && A <= 120)) return err('Name: letters only (≤ 10); age 0–120.');
    const steps: TraceStep[] = [];
    const show = (s: string, t: string, fields: string[] | null, hl: number[] = []) => [
      arr('stack (main)', [`s = ${s}`, `t = ${t}`]),
      arr('heap: object #1 (Student)', fields ?? ['(not created yet)'], Object.fromEntries(hl.map((i) => [i, 'cur'] as [number, Mark]))),
    ];
    steps.push({ note: 'Student s; declares a reference variable. No object exists yet: s is null (it holds no address).', line: 0, vars: { s: 'null' }, arrays: show('null', '—', null) });
    steps.push({ note: 'new Student(...) first allocates memory for one Student object on the heap. Every field gets its default value: null for references, 0 for numbers.', line: 1, vars: { 'name field': 'null', 'age field': 0 }, arrays: show('null', '—', ['name = null', 'age = 0'], [0, 1]) });
    steps.push({ note: `Now the constructor runs. this.name = name and this.age = age copy the arguments into the new object's fields.`, line: 1, vars: { 'this.name': `"${name}"`, 'this.age': A }, arrays: show('null', '—', [`name = "${name}"`, `age = ${A}`], [0, 1]) });
    steps.push({ note: 'The assignment s = … stores the ADDRESS of the new object in s.', line: 1, vars: { s: '→ #1' }, arrays: show('→ #1', '—', [`name = "${name}"`, `age = ${A}`]) });
    steps.push({ note: 'Student t = s copies the reference: t and s are two names for the SAME object. No second Student is created.', line: 2, vars: { s: '→ #1', t: '→ #1' }, arrays: show('→ #1', '→ #1', [`name = "${name}"`, `age = ${A}`]) });
    steps.push({ note: `t.age++ follows the reference and changes the one object. Reading s.age now gives ${A + 1}.`, line: 3, vars: { 's.age': A + 1, 't.age': A + 1 }, arrays: show('→ #1', '→ #1', [`name = "${name}"`, `age = ${A + 1}`], [1]) });
    return { steps, result: `one object, two references; s.age == t.age == ${A + 1}` };
  },
};

export const accessCheck: LabAlgorithm = {
  id: 'access-check',
  title: 'Who may touch a member?',
  lesson: 'm3-encapsulation-access',
  summary: 'The access modifier decides which code can compile a reference to the member.',
  inputs: [
    { key: 'modifier', label: 'modifier: private, package, protected, public', default: 'private', type: 'text' },
    { key: 'caller', label: 'caller: same-class, same-package, subclass, other', default: 'same-package', type: 'text' },
  ],
  pseudocode: ['class A { <modifier> int x; }', '// code in <caller> writes: a.x = 1;', 'private: only A itself', 'package: A + classes in A\'s package', 'protected: package + subclasses elsewhere', 'public: everyone'],
  run({ modifier, caller }) {
    const mods = ['private', 'package', 'protected', 'public'];
    const callers = ['same-class', 'same-package', 'subclass', 'other'];
    const m = (modifier ?? '').trim().toLowerCase().replace('default', 'package');
    const c = (caller ?? '').trim().toLowerCase().replace(/\s+/g, '-');
    if (!mods.includes(m) || !callers.includes(c)) return err('modifier: private, package, protected or public; caller: same-class, same-package, subclass or other.');
    const allowed: Record<string, string[]> = {
      private: ['same-class'],
      package: ['same-class', 'same-package'],
      protected: ['same-class', 'same-package', 'subclass'],
      public: callers,
    };
    const cells: string[][] = [['', ...callers], ...mods.map((mm) => [mm, ...callers.map((cc) => (allowed[mm].includes(cc) ? '✓' : '✗'))])];
    const mi = mods.indexOf(m) + 1, ci = callers.indexOf(c) + 1;
    const marks: Record<string, Mark> = {};
    mods.forEach((mm, r) => callers.forEach((cc, k) => (marks[`${r + 1},${k + 1}`] = allowed[mm].includes(cc) ? 'done' : 'dim')));
    const ok = allowed[m].includes(c);
    marks[`${mi},${ci}`] = ok ? 'found' : 'bad';
    const steps: TraceStep[] = [
      { note: `The field is declared ${m === 'package' ? 'with no modifier (package-private)' : m}. The caller is: ${c.replace(/-/g, ' ')}.`, line: 0, vars: { modifier: m, caller: c } },
      { note: ok ? `The table row "${m}" has a ✓ in column "${c}": the access compiles.` : `The table row "${m}" has a ✗ in column "${c}": the compiler reports an error ("x has ${m === 'package' ? 'package' : m} access in A").`, line: 1, vars: { allowed: ok }, grid: { cells, marks, caption: 'rows: modifier · columns: who is calling' } },
    ];
    return { steps, result: ok ? 'access allowed' : 'compile-time error: not accessible' };
  },
};

export const dynamicDispatch: LabAlgorithm = {
  id: 'dynamic-dispatch',
  title: 'Which speak() runs?',
  lesson: 'm3-inheritance-polymorphism',
  summary: 'The compiler checks the declared type; the JVM picks the method from the object\'s real class.',
  inputs: [{ key: 'cls', label: 'object created: Animal, Dog, Cat or Puppy', default: 'Puppy', type: 'text' }],
  pseudocode: ['Animal a = new <Class>();', 'a.speak();', 'Animal.speak() → "..."', 'Dog.speak()    → "Woof"', 'Cat.speak()    → "Meow"', 'Puppy extends Dog (no speak)'],
  run({ cls }) {
    const c = (cls ?? '').trim();
    const parent: Record<string, string | undefined> = { Animal: undefined, Dog: 'Animal', Cat: 'Animal', Puppy: 'Dog' };
    const says: Record<string, string | undefined> = { Animal: '...', Dog: 'Woof', Cat: 'Meow' };
    if (!(c in parent)) return err('Choose Animal, Dog, Cat or Puppy.');
    const chain: string[] = [];
    for (let k: string | undefined = c; k; k = parent[k]) chain.push(k);
    const steps: TraceStep[] = [
      { note: 'Compile time: the variable a has the DECLARED type Animal. The compiler only checks that Animal has a method speak(): it does, so the call compiles.', line: 1, vars: { 'declared type': 'Animal' } },
      { note: `Run time: the object created by new ${c}() has the REAL class ${c}.`, line: 0, vars: { 'real class': c }, arrays: [arr('class chain (real class first)', chain, { 0: 'cur' })] },
    ];
    let found = chain[0];
    for (let i = 0; i < chain.length; i++) {
      const has = says[chain[i]] !== undefined;
      steps.push({ note: has ? `${chain[i]} declares speak(): this is the version that runs.` : `${chain[i]} does not declare speak(): look in its superclass ${parent[chain[i]]}.`, line: 2, vars: { 'looking in': chain[i], 'has speak()': has }, arrays: [arr('class chain (real class first)', chain, { [i]: has ? 'found' : 'dim' })] });
      if (has) {
        found = chain[i];
        break;
      }
    }
    steps.push({ note: `Dynamic dispatch picks ${found}.speak() and prints "${says[found]}", although the variable's type is Animal.`, line: 1, vars: { output: says[found]! } });
    return { steps, result: `prints ${says[found]}` };
  },
};

export const interfaceCheck: LabAlgorithm = {
  id: 'interface-check',
  title: 'Does the class satisfy the interface?',
  lesson: 'm3-abstraction-interfaces',
  summary: 'A concrete class must implement every abstract method it inherits.',
  inputs: [
    { key: 'impl', label: 'methods Circle implements', default: 'area,perimeter', type: 'text', hint: 'any of area, perimeter, name' },
    { key: 'abs', label: 'is Circle declared abstract? (yes/no)', default: 'no', type: 'text' },
  ],
  pseudocode: ['interface Shape { double area(); double perimeter(); String name(); }', 'class Circle implements Shape { …only the methods listed… }', 'concrete class → must implement all three'],
  run({ impl, abs }) {
    const required = ['area', 'perimeter', 'name'];
    const have = (impl ?? '').split(/[\s,]+/).filter(Boolean);
    if (have.some((h) => !required.includes(h))) return err('Use only area, perimeter and name.');
    const isAbs = (abs ?? '').trim().toLowerCase() === 'yes';
    const steps: TraceStep[] = [{ note: 'Shape requires three abstract methods.', line: 0, vars: {}, arrays: [arr('Shape requires', required)] }];
    const missing: string[] = [];
    required.forEach((r, i) => {
      const ok = have.includes(r);
      if (!ok) missing.push(r);
      steps.push({ note: ok ? `${r}() is implemented by Circle.` : `${r}() is NOT implemented by Circle.`, line: 1, vars: { method: `${r}()`, implemented: ok }, arrays: [arr('Shape requires', required, Object.fromEntries(required.map((x, k) => [k, k < i ? (have.includes(x) ? 'done' : 'bad') : k === i ? (ok ? 'found' : 'bad') : 'dim'] as [number, Mark])))] });
    });
    if (!missing.length) {
      steps.push({ note: 'Every abstract method has a body, so Circle is a valid concrete class: new Circle(...) is allowed.', line: 2, vars: { compiles: true } });
      return { steps, result: 'compiles: Circle is a complete implementation' };
    }
    if (isAbs) {
      steps.push({ note: `Circle is declared abstract, so it may leave ${missing.map((m) => m + '()').join(', ')} unimplemented — but then it cannot be instantiated; a concrete subclass must finish the job.`, line: 2, vars: { compiles: true, 'can instantiate': false } });
      return { steps, result: 'compiles, but only as an abstract class' };
    }
    steps.push({ note: `The compiler reports: Circle is not abstract and does not override abstract method ${missing[0]}() in Shape.`, line: 2, vars: { compiles: false } });
    return { steps, result: `compile-time error: ${missing[0]}() missing` };
  },
};

export const initOrder: LabAlgorithm = {
  id: 'init-order',
  title: 'Initialisation order',
  lesson: 'm3-static-final-init',
  summary: 'static blocks run once when the class loads; the instance block and constructor run for every new object.',
  inputs: [{ key: 'n', label: 'objects created (1–4)', default: '2', type: 'number' }],
  pseudocode: ['class Demo {', '    static int count;', '    static { print("static block"); }', '    { print("instance block"); count++; }', '    Demo() { print("constructor, count=" + count); }', '    main: print("main starts"); new Demo() × n', '}'],
  run({ n }) {
    const N = num(n);
    if (!(N >= 1 && N <= 4)) return err('n must be 1–4.');
    const out: string[] = [];
    const steps: TraceStep[] = [];
    const log = (text: string, note: string, line: number, count: number) => {
      out.push(text);
      steps.push({ note, line, vars: { count }, arrays: [arr('console output', [...out], { [out.length - 1]: 'cur' })] });
    };
    log('static block', 'The JVM loads and initialises class Demo BEFORE calling main: static initialisers run, exactly once.', 2, 0);
    log('main starts', 'main begins.', 5, 0);
    let count = 0;
    for (let i = 1; i <= N; i++) {
      count++;
      log('instance block', `new Demo() #${i}: the instance block runs first (count becomes ${count}).`, 3, count);
      log(`constructor, count=${count}`, `Then the constructor body runs for object #${i}.`, 4, count);
    }
    return { steps, result: out.join(' → ') };
  },
};

const KNOWN: Record<string, string> = {
  String: 'java.lang', Math: 'java.lang', Integer: 'java.lang', System: 'java.lang', StringBuilder: 'java.lang',
  List: 'java.util', ArrayList: 'java.util', Map: 'java.util', HashMap: 'java.util', Scanner: 'java.util', Arrays: 'java.util', Collections: 'java.util', Set: 'java.util',
  BigInteger: 'java.math', BigDecimal: 'java.math', File: 'java.io', LocalDate: 'java.time',
};
export const importResolve: LabAlgorithm = {
  id: 'import-resolve',
  title: 'How the compiler finds a class name',
  lesson: 'm3-packages-imports',
  summary: 'java.lang is automatic; everything else needs an import (or its full name).',
  inputs: [
    { key: 'imports', label: 'imports (comma separated)', default: 'java.util.*', type: 'text' },
    { key: 'name', label: 'class name used in the code', default: 'List', type: 'text' },
  ],
  pseudocode: ['1. a class in this file / this package', '2. a single-type import  import java.util.List;', '3. java.lang (implicit)', '4. an on-demand import  import java.util.*;', 'otherwise: cannot find symbol'],
  run({ imports, name }) {
    const n = (name ?? '').trim();
    if (!/^[A-Z][A-Za-z0-9]*$/.test(n)) return err('Class name: starts with a capital letter, letters/digits only.');
    const imps = (imports ?? '').split(/[\s,;]+/).map((s) => s.replace(/^import\s*/, '')).filter(Boolean);
    if (imps.length > 6 || imps.some((i) => !/^[a-z][a-z0-9.]*(\.\*|\.[A-Z][A-Za-z0-9]*)$/.test(i))) return err('Imports like java.util.* or java.util.List (up to 6).');
    const pkg = KNOWN[n];
    const steps: TraceStep[] = [{ note: `The code uses the simple name ${n}. The compiler must decide which class that is.`, line: 0, vars: { name: n } }];
    steps.push({ note: 'Step 1: is there a class named ' + n + ' in this file or this package? No.', line: 0, vars: { found: false } });
    const single = imps.find((i) => i === `${pkg}.${n}`);
    const single2 = imps.find((i) => i.endsWith('.' + n));
    if (single || single2) {
      steps.push({ note: `Step 2: a single-type import ${single ?? single2} names it directly.`, line: 1, vars: { found: true, via: single ?? single2! } });
      return { steps, result: `resolved: ${single ?? single2}` };
    }
    steps.push({ note: 'Step 2: no single-type import ends in .' + n + '.', line: 1, vars: { found: false } });
    if (pkg === 'java.lang') {
      steps.push({ note: `Step 3: ${n} lives in java.lang, which is imported automatically.`, line: 2, vars: { found: true, via: 'java.lang' } });
      return { steps, result: `resolved: java.lang.${n} (no import needed)` };
    }
    steps.push({ note: 'Step 3: not in java.lang.', line: 2, vars: { found: false } });
    if (pkg && imps.includes(`${pkg}.*`)) {
      steps.push({ note: `Step 4: the on-demand import ${pkg}.* covers every public class of ${pkg}, including ${n}.`, line: 3, vars: { found: true, via: `${pkg}.*` } });
      return { steps, result: `resolved: ${pkg}.${n}` };
    }
    steps.push({ note: pkg ? `Step 4: ${n} is in ${pkg}, which is not imported.` : `Step 4: no imported package contains a class called ${n} (this demo knows ${Object.keys(KNOWN).length} common classes).`, line: 3, vars: { found: false } });
    steps.push({ note: `The compiler reports: cannot find symbol — class ${n}.`, line: 4, vars: { compiles: false } });
    return { steps, result: pkg ? `cannot find symbol: add   import ${pkg}.${n};` : `cannot find symbol: class ${n}` };
  },
};

export const exceptionFlow: LabAlgorithm = {
  id: 'exception-flow',
  title: 'try / catch / finally',
  lesson: 'm3-exceptions',
  summary: 'When something is thrown, the rest of the try block is skipped, the first matching catch runs, and finally always runs.',
  inputs: [
    { key: 'd', label: 'divisor d', default: '0', type: 'number' },
    { key: 'idx', label: 'array index (array length is 3)', default: '1', type: 'number' },
  ],
  pseudocode: ['try {', '    int r = 100 / d;', '    int[] a = new int[3]; a[idx] = r;', '    print("stored");', '} catch (ArithmeticException e) { print("math"); }', 'catch (ArrayIndexOutOfBoundsException e) { print("index"); }', 'finally { print("cleanup"); }', 'print("after");'],
  run({ d, idx }) {
    const D = num(d), I = num(idx);
    if (!Number.isFinite(D) || !Number.isFinite(I) || Math.abs(D) > 1e6 || Math.abs(I) > 1e6) return err('Enter two integers.');
    const out: string[] = [];
    const steps: TraceStep[] = [];
    const log = (t: string, note: string, line: number, vars: Record<string, string | number | boolean> = {}) => {
      out.push(t);
      steps.push({ note, line, vars, arrays: [arr('console', [...out], { [out.length - 1]: 'cur' })] });
    };
    steps.push({ note: 'Execution enters the try block.', line: 0, vars: { d: D, idx: I } });
    let thrown: 'math' | 'index' | null = null;
    if (D === 0) {
      thrown = 'math';
      steps.push({ note: '100 / d with d = 0 throws ArithmeticException. The remaining lines of the try block are SKIPPED.', line: 1, vars: { thrown: 'ArithmeticException' } });
    } else {
      const r = Math.trunc(100 / D);
      steps.push({ note: `100 / ${D} = ${r}.`, line: 1, vars: { r } });
      if (I < 0 || I > 2) {
        thrown = 'index';
        steps.push({ note: `a[${I}] with length 3 throws ArrayIndexOutOfBoundsException; the rest of the try block is skipped.`, line: 2, vars: { thrown: 'ArrayIndexOutOfBoundsException' } });
      } else {
        steps.push({ note: `a[${I}] = ${r} is fine.`, line: 2, vars: { 'a[idx]': r } });
        log('stored', 'No exception: the try block finishes normally and prints "stored". No catch block runs.', 3);
      }
    }
    if (thrown === 'math') log('math', 'The thrown ArithmeticException matches the first catch, which prints "math".', 4);
    if (thrown === 'index') log('index', 'The first catch (ArithmeticException) does not match; the second one does and prints "index".', 5);
    log('cleanup', 'finally ALWAYS runs: after a normal finish, after a caught exception, even after return.', 6);
    log('after', 'Because the exception was handled, execution continues after the whole try statement.', 7);
    return { steps, result: out.join(' → ') };
  },
};

export const arraylistOps: LabAlgorithm = {
  id: 'arraylist-ops',
  title: 'ArrayList growth and shifting',
  lesson: 'm3-collections-lists',
  summary: 'An ArrayList is an array with spare capacity: add at the end is cheap, inserting or removing inside shifts elements.',
  inputs: [
    { key: 'cap', label: 'initial capacity (1–8)', default: '4', type: 'number' },
    { key: 'ops', label: 'operations', default: 'add 5,add 7,add 9,add 2,add 8,add@0 1,remove@2', type: 'text', hint: 'add v · add@i v · remove@i' },
  ],
  pseudocode: ['new ArrayList<>(cap)', 'add(v)        // append; grow by 1.5x when full', 'add(i, v)     // shift [i..] right', 'remove(i)     // shift (i..] left'],
  run({ cap, ops }) {
    let C = num(cap);
    if (!(C >= 1 && C <= 8)) return err('Capacity must be 1–8.');
    const list: number[] = [];
    const items = (ops ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!items.length || items.length > 14) return err('Give 1–14 operations separated by commas.');
    const view = (hl: number[] = [], kind: Mark = 'cur') => {
      const cells: (string | number)[] = Array.from({ length: C }, (_, i) => (i < list.length ? list[i] : '·'));
      return [arr(`backing array (capacity ${C}, size ${list.length})`, cells, Object.fromEntries(hl.map((i) => [i, kind] as [number, Mark])))];
    };
    const steps: TraceStep[] = [{ note: `new ArrayList<>(${C}): an array of ${C} cells, size 0.`, line: 0, vars: { size: 0, capacity: C }, arrays: view() }];
    const grow = () => {
      if (list.length === C) {
        const nc = Math.max(C + (C >> 1), C + 1);
        steps.push({ note: `The array is full (${C}/${C}): a new array of ${nc} cells is allocated and every element is copied. This is the expensive step.`, line: 1, vars: { 'old capacity': C, 'new capacity': nc }, arrays: view() });
        C = nc;
      }
    };
    for (const op of items) {
      let m: RegExpMatchArray | null;
      if ((m = op.match(/^add\s+(-?\d+)$/))) {
        grow();
        list.push(+m[1]);
        steps.push({ note: `add(${m[1]}) writes into the next free cell (index ${list.length - 1}). O(1).`, line: 1, vars: { size: list.length, capacity: C }, arrays: view([list.length - 1], 'found') });
      } else if ((m = op.match(/^add@(\d+)\s+(-?\d+)$/))) {
        const i = +m[1];
        if (i > list.length) return err(`add@${i}: index ${i} is beyond size ${list.length} (IndexOutOfBoundsException).`);
        grow();
        const shifts = list.length - i;
        list.splice(i, 0, +m[2]);
        steps.push({ note: `add(${i}, ${m[2]}) first shifts ${shifts} element${shifts === 1 ? '' : 's'} one cell to the right, then writes the value. O(n).`, line: 2, vars: { size: list.length, shifts }, arrays: view([i], 'found') });
      } else if ((m = op.match(/^remove@(\d+)$/))) {
        const i = +m[1];
        if (i >= list.length) return err(`remove@${i}: index ${i} is out of range for size ${list.length}.`);
        const v = list[i];
        const shifts = list.length - 1 - i;
        list.splice(i, 1);
        steps.push({ note: `remove(${i}) takes out ${v} and shifts ${shifts} element${shifts === 1 ? '' : 's'} one cell to the left. O(n).`, line: 3, vars: { size: list.length, shifts }, arrays: view([i], 'swap') });
      } else return err(`Cannot read the operation "${op}". Use add 5 · add@1 5 · remove@2.`);
    }
    return { steps, result: `[${list.join(', ')}] — size ${list.length}, capacity ${C}` };
  },
};

export const hashBuckets: LabAlgorithm = {
  id: 'hash-buckets',
  title: 'Where HashMap / HashSet put a key',
  lesson: 'm3-collections-sets-maps',
  summary: 'hashCode → spread → index into 16 buckets; keys that land in the same bucket form a chain.',
  inputs: [{ key: 'keys', label: 'keys (letters/digits, comma separated, ≤ 10)', default: 'cat,dog,bird,emu,ant,cow,dog', type: 'text' }],
  pseudocode: ['h = key.hashCode()', 'h = h ^ (h >>> 16)        // spread the high bits', 'index = h & (capacity - 1)   // capacity = 16', 'bucket empty → store; same key → replace/ignore; else chain'],
  run({ keys }) {
    const ks = words(keys, 10);
    if (!ks) return err('Enter 1–10 keys of letters/digits (up to 10 characters each).');
    const buckets: string[][] = Array.from({ length: 16 }, () => []);
    const steps: TraceStep[] = [];
    let collisions = 0, dups = 0;
    const view = (idx: number, mark: Mark) => [arr('buckets 0–15', buckets.map((b) => (b.length ? b.join(' → ') : '·')), { [idx]: mark })];
    for (const k of ks) {
      const h = javaHash(k);
      const s = spread(h);
      const idx = s & 15;
      const b = buckets[idx];
      if (b.includes(k)) {
        dups++;
        steps.push({ note: `"${k}": hashCode = ${h}, bucket ${idx}. The key is ALREADY in that bucket (equals matches): a map would replace the value, a set ignores it.`, line: 3, vars: { key: k, hashCode: h, index: idx, size: buckets.flat().length }, arrays: view(idx, 'bad') });
        continue;
      }
      const coll = b.length > 0;
      if (coll) collisions++;
      b.push(k);
      steps.push({ note: coll ? `"${k}": hashCode = ${h} → bucket ${idx}, which already holds ${b.slice(0, -1).join(', ')}: a COLLISION, so the key is chained after it.` : `"${k}": hashCode = ${h}, spread = ${s}, index = ${s} & 15 = ${idx}. The bucket is empty: store the key there.`, line: 2, vars: { key: k, hashCode: h, index: idx, size: buckets.flat().length }, arrays: view(idx, coll ? 'swap' : 'found') });
    }
    const size = buckets.flat().length;
    return { steps, result: `size ${size}; ${collisions} collision${collisions === 1 ? '' : 's'}; ${dups} duplicate${dups === 1 ? '' : 's'} ignored` };
  },
};

export const comparatorSort: LabAlgorithm = {
  id: 'comparator-sort',
  title: 'Sorting with a comparator',
  lesson: 'm3-sorting-comparators',
  summary: 'The sort only asks "compare(a, b)": negative → a first, zero → tie, positive → b first.',
  inputs: [
    { key: 'words', label: 'words', default: 'pear,fig,apple,kiwi,plum', type: 'text' },
    { key: 'mode', label: 'comparator: 1 alphabetical, 2 length then alphabetical, 3 reverse alphabetical', default: '2', type: 'number' },
  ],
  pseudocode: ['compare(a, b):', '  1: a.compareTo(b)', '  2: Integer.compare(a.length(), b.length()), then a.compareTo(b)', '  3: b.compareTo(a)', 'insertion sort using compare'],
  run({ words: w, mode }) {
    const ws = words(w, 8, /^[A-Za-z]{1,10}$/);
    const m = num(mode);
    if (!ws || ![1, 2, 3].includes(m)) return err('Enter 1–8 words of letters and a mode of 1, 2 or 3.');
    const cmpStr = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
    const compare = (a: string, b: string) => (m === 1 ? cmpStr(a, b) : m === 3 ? cmpStr(b, a) : a.length !== b.length ? Math.sign(a.length - b.length) : cmpStr(a, b));
    const a = [...ws];
    const steps: TraceStep[] = [{ note: 'The list before sorting.', line: 4, vars: { comparator: ['', 'natural', 'length, then natural', 'reversed'][m] }, arrays: [arr('words', [...a])] }];
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0) {
        const c = compare(a[j], key);
        steps.push({ note: `compare("${a[j]}", "${key}") = ${c < 0 ? 'negative' : c > 0 ? 'positive' : 'zero'} → ${c > 0 ? `"${a[j]}" must come after "${key}": shift it right` : `"${a[j]}" stays before "${key}"`}.`, line: 0, vars: { 'compare result': c, key, j }, arrays: [arr('words', [...a], { [j]: c > 0 ? 'swap' : 'done', [i]: 'cur' })] });
        if (c > 0) {
          a[j + 1] = a[j];
          j--;
        } else break;
      }
      a[j + 1] = key;
    }
    steps.push({ note: 'Sorted.', line: 4, vars: {}, arrays: [arr('words', [...a], Object.fromEntries(a.map((_, i) => [i, 'done'] as [number, Mark])))] });
    return { steps, result: a.join(', ') };
  },
};

export const hashsetEquals: LabAlgorithm = {
  id: 'hashset-equals',
  title: 'HashSet<Point> and the equals/hashCode contract',
  lesson: 'm3-equals-hashcode-immutability',
  summary: 'A HashSet only calls equals() on keys that share a hash code.',
  inputs: [
    { key: 'mode', label: 'class overrides: 1 equals + hashCode, 2 equals only, 3 neither', default: '2', type: 'number' },
    { key: 'pts', label: 'points x:y', default: '1:2,1:2,3:4', type: 'text' },
  ],
  pseudocode: ['set.add(p):', '    h = p.hashCode()  → bucket', '    only entries with the SAME hash are compared with equals()', '    equal → already present, not added'],
  run({ mode, pts }) {
    const M = num(mode);
    const items = (pts ?? '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => s.split(':').map(Number));
    if (![1, 2, 3].includes(M) || !items.length || items.length > 6 || items.some((p) => p.length !== 2 || p.some((x) => !Number.isInteger(x) || Math.abs(x) > 99))) return err('Mode 1–3 and up to 6 points like 1:2,3:4 (|x|,|y| ≤ 99).');
    const eqOverridden = M !== 3, hashOverridden = M === 1;
    const set: { x: number; y: number; h: number }[] = [];
    const steps: TraceStep[] = [{ note: `Point ${hashOverridden ? 'overrides equals AND hashCode' : eqOverridden ? 'overrides equals but NOT hashCode (the contract is broken)' : 'overrides neither: identity comparison'}.`, line: 0, vars: { equals: eqOverridden, hashCode: hashOverridden } }];
    items.forEach(([x, y], k) => {
      const h = hashOverridden ? Math.imul(31, Math.imul(31, 1) + x) + y : 100000 + k * 7919; // k-th object gets a distinct identity hash
      const idx = spread(h | 0) & 15;
      const same = set.find((e) => e.h === h && (eqOverridden ? e.x === x && e.y === y : false));
      if (same) {
        steps.push({ note: `add(Point(${x},${y})): hash ${h} → bucket ${idx}. An entry with the same hash exists and equals() says true → duplicate, NOT added.`, line: 3, vars: { hash: h, bucket: idx, size: set.length }, arrays: [arr('set contents', set.map((e) => `(${e.x},${e.y}) h=${e.h}`), {})] });
      } else {
        const sameHashDifferent = set.some((e) => e.h === h);
        set.push({ x, y, h });
        steps.push({ note: `add(Point(${x},${y})): hash ${h} → bucket ${idx}. ${sameHashDifferent ? 'Same hash but equals() is false: ' : 'No entry with this hash exists, so equals() is never even called: '}added.${eqOverridden && !hashOverridden && set.slice(0, -1).some((e) => e.x === x && e.y === y) ? ' (An equal point is already stored in another bucket, but nobody looked there!)' : ''}`, line: 1, vars: { hash: h, bucket: idx, size: set.length }, arrays: [arr('set contents', set.map((e) => `(${e.x},${e.y}) h=${e.h}`), { [set.length - 1]: 'found' })] });
      }
    });
    return { steps, result: `size = ${set.length}${hashOverridden ? '' : '  (logically equal points are counted twice)'}` };
  },
};

// ───────────────────────── Module 4 ─────────────────────────

export const growthTable: LabAlgorithm = {
  id: 'growth-table',
  title: 'How fast do the classes grow?',
  lesson: 'm4-complexity-intro',
  summary: 'Double n repeatedly and watch which columns explode.',
  inputs: [{ key: 'max', label: 'largest n (2–64)', default: '16', type: 'number' }],
  pseudocode: ['for n = 1, 2, 4, 8, … :', '    log2 n   n   n·log2 n   n²   2ⁿ'],
  run({ max }) {
    const M = num(max);
    if (!(M >= 2 && M <= 64)) return err('Largest n must be 2–64.');
    const fmt = (b: bigint) => (b < 1_000_000_000_000n ? b.toString() : Number(b).toExponential(1));
    const rows: string[][] = [['n', 'log₂ n', 'n log₂ n', 'n²', '2ⁿ']];
    const steps: TraceStep[] = [];
    for (let n = 1; n <= M; n *= 2) {
      const lg = Math.log2(n);
      rows.push([String(n), String(lg), String(n * lg), String(n * n), fmt(2n ** BigInt(n))]);
      steps.push({ note: n === 1 ? 'n = 1: everything is tiny.' : `n = ${n}: doubling n added 1 to log₂ n, doubled n, roughly quadrupled n², and SQUARED 2ⁿ.`, line: 0, vars: { n }, grid: { cells: rows.map((r) => [...r]), marks: { [`${rows.length - 1},4`]: 'swap', [`${rows.length - 1},3`]: 'cur' }, caption: 'operation counts' } });
    }
    const last = rows[rows.length - 1];
    return { steps, result: `at n = ${last[0]}: n² = ${last[3]} but 2ⁿ = ${last[4]}` };
  },
};

export const recurrenceLevels: LabAlgorithm = {
  id: 'recurrence-levels',
  title: 'Recursion tree for T(n) = a·T(n/b) + n',
  lesson: 'm4-complexity-recursion',
  summary: 'Add up the work level by level; compare the root with the leaves.',
  inputs: [
    { key: 'a', label: 'a: subproblems (2–4)', default: '2', type: 'number' },
    { key: 'b', label: 'b: size divisor (2–4)', default: '2', type: 'number' },
    { key: 'n', label: 'n (2–4096)', default: '16', type: 'number' },
  ],
  pseudocode: ['level k: aᵏ nodes, each of size n / bᵏ', 'work at level k = aᵏ · (n / bᵏ)', 'levels continue until size 1', 'a = b → n per level × log n levels → Θ(n log n)'],
  run({ a, b, n }) {
    const A = num(a), B = num(b), N = num(n);
    if (!(A >= 2 && A <= 4 && B >= 2 && B <= 4 && N >= 2 && N <= 4096)) return err('a, b in 2–4 and n in 2–4096.');
    const rows: string[][] = [['level', 'nodes', 'size each', 'work']];
    const steps: TraceStep[] = [];
    let total = 0;
    let size = N, nodes = 1, level = 0;
    while (size >= 1 && level < 14) {
      const work = nodes * size;
      total += work;
      rows.push([String(level), String(nodes), String(size), String(work)]);
      steps.push({ note: `Level ${level}: ${nodes} node${nodes > 1 ? 's' : ''} of size ${size} → ${nodes} × ${size} = ${work} units of work. Running total ${total}.`, line: 1, vars: { level, nodes, size, work, total }, grid: { cells: rows.map((r) => [...r]), marks: { [`${rows.length - 1},3`]: 'cur' }, caption: 'level · nodes · size per node · work' } });
      if (size === 1) break;
      nodes *= A;
      size = Math.floor(size / B);
    }
    const lg = Math.log(A) / Math.log(B);
    const cls = A === B ? 'Θ(n log n): every level costs about n' : A < B ? 'Θ(n): the root level dominates (work shrinks geometrically)' : `Θ(n^${lg.toFixed(2)}): the leaves dominate (a > b)`;
    steps.push({ note: `Total work ${total}. Master theorem: log_${B}(${A}) = ${lg.toFixed(2)} compared with 1 → ${cls}.`, line: 3, vars: { total, 'log_b a': +lg.toFixed(3) } });
    return { steps, result: `${total} operations — ${cls}` };
  },
};

export const stackDepth: LabAlgorithm = {
  id: 'stack-depth',
  title: 'Recursion depth = stack space',
  lesson: 'm4-space-complexity',
  summary: 'The call stack holds one frame per ACTIVE call: depth n for a chain, about log₂ n when the problem halves.',
  inputs: [
    { key: 'n', label: 'n (1–40, or up to 4096 when halving)', default: '6', type: 'number' },
    { key: 'mode', label: 'mode: 1 sum(n) = n + sum(n−1), 2 halving f(n) = 1 + f(n/2)', default: '1', type: 'number' },
  ],
  pseudocode: ['sum(n): if n == 0 return 0; return n + sum(n - 1)', 'f(n):   if n <= 1 return 0; return 1 + f(n / 2)'],
  run({ n, mode }) {
    const N = num(n), M = num(mode);
    if (![1, 2].includes(M) || !(N >= 1 && N <= (M === 1 ? 40 : 4096))) return err('Mode 1 or 2; n 1–40 (mode 1) or 1–4096 (mode 2).');
    const stack: string[] = [];
    let max = 0;
    const steps: TraceStep[] = [];
    const show = (hl: Mark, note: string, line: number) => {
      max = Math.max(max, stack.length);
      steps.push({ note, line, vars: { depth: stack.length, 'max depth': max }, arrays: [arr('call stack (bottom → top)', [...stack], { [stack.length - 1]: hl })] });
    };
    const rec = (k: number): number => {
      const name = M === 1 ? `sum(${k})` : `f(${k})`;
      stack.push(name);
      show('cur', `Call ${name}: one more frame on the stack (depth ${stack.length}).`, 0);
      let r: number;
      if (M === 1) r = k === 0 ? 0 : k + rec(k - 1);
      else r = k <= 1 ? 0 : 1 + rec(Math.floor(k / 2));
      show('found', `${name} returns ${r}; its frame is about to be popped.`, 1);
      stack.pop();
      return r;
    };
    const r = rec(N);
    const label = M === 1 ? `O(n): ${max} frames for n = ${N}` : `O(log n): only ${max} frames for n = ${N}`;
    return { steps: steps.slice(0, 399), result: `result ${r}; maximum depth ${max} → ${label}` };
  },
};

export const searchCases: LabAlgorithm = {
  id: 'search-cases',
  title: 'Best, average and worst case of linear search',
  lesson: 'm4-best-avg-worst',
  summary: 'Same algorithm, same n — different inputs cost 1, n/2 or n comparisons.',
  inputs: [{ key: 'arr', label: 'array of distinct numbers', default: '8,3,5,9,1', type: 'text' }],
  pseudocode: ['for i in 0..n-1:', '    comparisons++', '    if a[i] == target: return i', 'return -1    // after n comparisons'],
  run({ arr: s }) {
    const a = ints(s, 10);
    if (!a || new Set(a).size !== a.length) return err('Enter up to 10 distinct integers.');
    const n = a.length;
    const steps: TraceStep[] = [];
    let total = 0;
    a.forEach((t, p) => {
      total += p + 1;
      steps.push({ note: `target = ${t} (at index ${p}): the scan makes ${p + 1} comparison${p ? 's' : ''}${p === 0 ? ' — the BEST case' : p === n - 1 ? ' — the WORST successful case' : ''}.`, line: 2, vars: { target: t, comparisons: p + 1 }, arrays: [arr('a', [...a], Object.fromEntries(a.map((_, i) => [i, i < p ? 'dim' : i === p ? 'found' : 'dim'] as [number, Mark])))] });
    });
    steps.push({ note: `A target that is not in the array costs all ${n} comparisons — the worst case overall.`, line: 3, vars: { comparisons: n }, arrays: [arr('a', [...a], Object.fromEntries(a.map((_, i) => [i, 'bad'] as [number, Mark])))] });
    const avg = total / n;
    steps.push({ note: `If every position is equally likely, the average number of comparisons is (1 + 2 + … + ${n}) / ${n} = ${avg}, i.e. (n + 1) / 2.`, line: 0, vars: { best: 1, average: avg, worst: n } });
    return { steps, result: `best 1, average ${avg}, worst ${n} comparisons` };
  },
};

// ───────────────────────── archive ─────────────────────────

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export const crtSieve: LabAlgorithm = {
  id: 'crt-sieve',
  title: 'Chinese remainder theorem by sieving',
  lesson: 'a-crt',
  summary: 'Walk through the numbers that satisfy the first congruence until the next one is also satisfied.',
  inputs: [{ key: 'pairs', label: 'x ≡ r (mod m) as r:m pairs', default: '2:3,3:5,2:7', type: 'text' }],
  pseudocode: ['x = r1; step = m1', 'for each further (r, m):', '    while x % m != r: x += step', '    step = lcm(step, m)', 'x is the smallest solution'],
  run({ pairs }) {
    const ps = (pairs ?? '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => s.split(':').map(Number));
    if (ps.length < 2 || ps.length > 4 || ps.some((p) => p.length !== 2 || !Number.isInteger(p[0]) || !Number.isInteger(p[1]) || p[1] < 2 || p[1] > 60 || p[0] < 0 || p[0] >= p[1])) return err('Give 2–4 pairs r:m with 2 ≤ m ≤ 60 and 0 ≤ r < m, e.g. 2:3,3:5,2:7.');
    let [x, step] = [ps[0][0], ps[0][1]];
    const steps: TraceStep[] = [{ note: `x ≡ ${ps[0][0]} (mod ${ps[0][1]}): the candidates are ${ps[0][0]}, ${ps[0][0] + ps[0][1]}, ${ps[0][0] + 2 * ps[0][1]}, … (step ${step}).`, line: 0, vars: { x, step } }];
    for (let i = 1; i < ps.length; i++) {
      const [r, m] = ps[i];
      const tried: number[] = [];
      let n = 0;
      while (x % m !== r && n <= m) {
        tried.push(x);
        x += step;
        n++;
      }
      if (x % m !== r) {
        steps.push({ note: `After ${m} candidates no number satisfies x ≡ ${r} (mod ${m}) together with the earlier ones: the system has NO solution (the moduli are not coprime and the remainders conflict).`, line: 2, vars: { 'congruence': `${r} mod ${m}` } });
        return { steps, result: 'no solution' };
      }
      tried.push(x);
      steps.push({ note: `Next condition x ≡ ${r} (mod ${m}). Candidates ${tried.slice(0, 10).join(', ')}${tried.length > 10 ? ', …' : ''}: ${x} % ${m} = ${r} ✓.`, line: 2, vars: { x, step, 'mod': m }, arrays: [arr(`candidates for mod ${m}`, tried.slice(-12), { [Math.min(tried.length, 12) - 1]: 'found' })] });
      const nstep = (step / gcd(step, m)) * m;
      steps.push({ note: `All later solutions differ by the lcm(${step}, ${m}) = ${nstep}, so the step grows to ${nstep}.`, line: 3, vars: { x, step: nstep } });
      step = nstep;
    }
    return { steps, result: `x = ${x} (repeats every ${step})` };
  },
};

export const pascalNcr: LabAlgorithm = {
  id: 'pascal-ncr',
  title: 'nCr from Pascal\'s triangle and from the formula',
  lesson: 'a-combination',
  summary: 'Every entry is the sum of the two above it; or multiply and divide step by step without factorials.',
  inputs: [
    { key: 'n', label: 'n (1–10)', default: '6', type: 'number' },
    { key: 'r', label: 'r (0–n)', default: '2', type: 'number' },
  ],
  pseudocode: ['Pascal: C(i, j) = C(i-1, j-1) + C(i-1, j)', 'multiplicative:', 'r = min(r, n - r); result = 1', 'for i = 1..r: result = result * (n - r + i) / i'],
  run({ n, r }) {
    const N = num(n);
    let R = num(r);
    if (!(N >= 1 && N <= 10) || !(R >= 0 && R <= N)) return err('n must be 1–10 and r 0–n.');
    const tri: number[][] = [];
    const steps: TraceStep[] = [];
    for (let i = 0; i <= N; i++) {
      tri[i] = [];
      for (let j = 0; j <= i; j++) tri[i][j] = j === 0 || j === i ? 1 : tri[i - 1][j - 1] + tri[i - 1][j];
      const cells = tri.map((row) => [...row.map(String), ...Array(N + 1 - row.length).fill('')]);
      const marks: Record<string, Mark> = {};
      for (let j = 0; j <= i; j++) marks[`${i},${j}`] = 'cur';
      steps.push({ note: i <= 1 ? `Row ${i}: the edges are always 1.` : `Row ${i}: each inner entry is the sum of the two entries above it.`, line: 0, vars: { row: i }, grid: { cells, marks, caption: "Pascal's triangle (row i, column j = C(i, j))" } });
    }
    const cells = tri.map((row) => [...row.map(String), ...Array(N + 1 - row.length).fill('')]);
    steps.push({ note: `C(${N}, ${R}) is the entry in row ${N}, column ${R} = ${tri[N][R]}.`, line: 0, vars: { [`C(${N},${R})`]: tri[N][R] }, grid: { cells, marks: { [`${N},${R}`]: 'found' }, caption: "Pascal's triangle" } });
    const r0 = R;
    R = Math.min(R, N - R);
    let result = 1;
    steps.push({ note: `Formula version: use symmetry C(${N}, ${r0}) = C(${N}, ${N - r0}) and take r = ${R} (fewer steps). result starts at 1.`, line: 2, vars: { r: R, result } });
    for (let i = 1; i <= R; i++) {
      result = (result * (N - R + i)) / i;
      steps.push({ note: `i = ${i}: result = result × (n − r + i) / i = × ${N - R + i} / ${i} → ${result}. It is always a whole number, so integer division is exact.`, line: 3, vars: { i, result } });
    }
    return { steps, result: `${N}C${r0} = ${tri[N][r0]}` };
  },
};

export const karatsubaTrace: LabAlgorithm = {
  id: 'karatsuba-trace',
  title: 'Karatsuba multiplication',
  lesson: 'a-karatsuba',
  summary: 'Three recursive multiplications instead of four.',
  inputs: [
    { key: 'x', label: 'x (0–99999)', default: '1234', type: 'number' },
    { key: 'y', label: 'y (0–99999)', default: '5678', type: 'number' },
  ],
  pseudocode: ['multiply(x, y):', '    if x < 10 or y < 10: return x * y', '    p = 10^(n/2);  x = a·p + b;  y = c·p + d', '    ac = multiply(a, c); bd = multiply(b, d)', '    abcd = multiply(a + b, c + d)', '    return ac·p² + (abcd − ac − bd)·p + bd'],
  run({ x, y }) {
    const X = num(x), Y = num(y);
    if (!(X >= 0 && X <= 99999 && Y >= 0 && Y <= 99999)) return err('x and y must be 0–99999.');
    const steps: TraceStep[] = [];
    let base = 0;
    const mul = (a: number, b: number, depth: number): number => {
      if (a < 10 || b < 10) {
        base++;
        steps.push({ note: `${'  '.repeat(depth)}base case: ${a} × ${b} = ${a * b} (one factor has a single digit).`, line: 1, vars: { depth, x: a, y: b, result: a * b, 'base multiplications': base } });
        return a * b;
      }
      const n = Math.max(String(a).length, String(b).length);
      const half = Math.floor(n / 2);
      const p = 10 ** half;
      const [ah, al] = [Math.floor(a / p), a % p];
      const [ch, cl] = [Math.floor(b / p), b % p];
      const ac = mul(ah, ch, depth + 1);
      const bd = mul(al, cl, depth + 1);
      const abcd = mul(ah + al, ch + cl, depth + 1);
      const mid = abcd - ac - bd;
      const res = ac * p * p + mid * p + bd;
      steps.push({ note: `${'  '.repeat(depth)}${a} × ${b}: split at 10^${half} → a=${ah}, b=${al}, c=${ch}, d=${cl}. ac=${ac}, bd=${bd}, (a+b)(c+d)=${abcd}, middle = ${abcd} − ${ac} − ${bd} = ${mid}. Result ${ac}·${p * p} + ${mid}·${p} + ${bd} = ${res}.`, line: 5, vars: { depth, ac, bd, 'a·d + b·c': mid, result: res } });
      return res;
    };
    const res = mul(X, Y, 0);
    if (steps.length > 380) return err('That input needs too many steps to display; try smaller numbers.');
    return { steps, result: `${X} × ${Y} = ${res} ${res === X * Y ? '(matches *)' : '(MISMATCH)'}, ${base} single-digit multiplications` };
  },
};

export const weightedString: LabAlgorithm = {
  id: 'weighted-string',
  title: 'Smallest string of a given weight',
  lesson: 'a-weighted-substring',
  summary: 'Weights 1, 3, 12, 60, 360 … (each letter n times the previous + the previous): take the biggest letters greedily.',
  inputs: [{ key: 'w', label: 'weight (1–1,000,000)', default: '100', type: 'number' }],
  pseudocode: ['weights: A=1, B=3, C=12, D=60, E=360, …', 'remaining = weight', 'for letter from largest to smallest:', '    while remaining >= weight(letter): take it', 'sort the letters (smallest first)'],
  run({ w }) {
    const W = num(w);
    if (!(W >= 1 && W <= 1_000_000)) return err('Weight must be 1–1,000,000.');
    const ws: number[] = [1];
    for (let n = 2; n <= 26; n++) {
      const next = ws[ws.length - 1] * (n + 1);
      if (next > W) break;
      ws.push(next);
    }
    const names = ws.map((_, i) => String.fromCharCode(65 + i));
    const steps: TraceStep[] = [{ note: `Weights not exceeding ${W}: ${names.map((c, i) => `${c}=${ws[i]}`).join(', ')}.`, line: 0, vars: { weight: W }, arrays: [arr('letters', names), arr('weights', ws)] }];
    let rem = W;
    const letters: string[] = [];
    for (let i = ws.length - 1; i >= 0; i--) {
      const take = Math.floor(rem / ws[i]);
      if (take > 0) {
        for (let k = 0; k < take; k++) letters.push(names[i]);
        rem -= take * ws[i];
      }
      steps.push({ note: take > 0 ? `Letter ${names[i]} (weight ${ws[i]}) fits ${take} time${take > 1 ? 's' : ''}: take ${names[i].repeat(take)}. Remaining ${rem}.` : `Letter ${names[i]} (weight ${ws[i]}) is larger than the remaining ${rem}: skip.`, line: 3, vars: { letter: names[i], taken: take, remaining: rem }, arrays: [arr('letters', names, { [i]: take > 0 ? 'found' : 'dim' }), arr('letters taken so far', [...letters])] });
    }
    const sorted = [...letters].sort();
    steps.push({ note: `Sort the letters so the string is lexicographically smallest: ${sorted.join('')}.`, line: 4, vars: { length: sorted.length }, arrays: [arr('string', sorted, Object.fromEntries(sorted.map((_, i) => [i, 'done'] as [number, Mark])))] });
    return { steps, result: `${sorted.join('')} (${sorted.length} letter${sorted.length === 1 ? '' : 's'})` };
  },
};

export const hyphenPartition: LabAlgorithm = {
  id: 'hyphen-partition',
  title: 'Move every hyphen to the front (in place)',
  lesson: 'a-move-hyphen',
  summary: 'Scan from the right; copy non-hyphens to the right end, then fill the rest with hyphens.',
  inputs: [{ key: 's', label: 'string (no spaces, ≤ 14 chars)', default: 'ab-c-d-ef', type: 'text' }],
  pseudocode: ['write = n - 1', 'for read = n-1 down to 0:', '    if a[read] != "-": a[write--] = a[read]', 'while write >= 0: a[write--] = "-"'],
  run({ s }) {
    if (!s || s.length > 14 || /\s/.test(s)) return err('Enter a string of up to 14 characters without spaces.');
    const a = s.split('');
    let write = a.length - 1;
    const steps: TraceStep[] = [{ note: 'read and write both start at the last cell.', line: 0, vars: { read: write, write }, arrays: [arr('a', [...a], {}, { [write]: 'read/write' })] }];
    for (let read = a.length - 1; read >= 0; read--) {
      if (a[read] !== '-') {
        a[write] = a[read];
        steps.push({ note: `a[${read}] = "${a[read]}" is not a hyphen: copy it to a[${write}].`, line: 2, vars: { read, write }, arrays: [arr('a', [...a], { [write]: 'found', [read]: 'cur' }, { [read]: 'read', ...(write !== read ? { [write]: 'write' } : {}) })] });
        write--;
      } else {
        steps.push({ note: `a[${read}] is a hyphen: skip it (only read moves left, so write falls behind).`, line: 2, vars: { read, write }, arrays: [arr('a', [...a], { [read]: 'dim' }, { [read]: 'read', ...(write !== read ? { [write]: 'write' } : {}) })] });
      }
    }
    const filled = write + 1;
    while (write >= 0) a[write--] = '-';
    steps.push({ note: filled > 0 ? `Fill the first ${filled} cell${filled > 1 ? 's' : ''} with hyphens.` : 'No hyphens to fill: the string is unchanged.', line: 3, vars: { hyphens: filled }, arrays: [arr('a', [...a], Object.fromEntries(a.map((c, i) => [i, i < filled ? 'swap' : 'done'] as [number, Mark])))] });
    return { steps, result: a.join('') };
  },
};

function chunks(s: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    const d = /[0-9]/.test(s[i]);
    while (j < s.length && /[0-9]/.test(s[j]) === d) j++;
    out.push(s.slice(i, j));
    i = j;
  }
  return out;
}
export const naturalCompare: LabAlgorithm = {
  id: 'natural-compare',
  title: 'Natural-order comparison',
  lesson: 'a-natural-sort',
  summary: 'Split both names into digit and non-digit chunks and compare chunk by chunk — numbers by value.',
  inputs: [
    { key: 'a', label: 'first name', default: 'file10.txt', type: 'text' },
    { key: 'b', label: 'second name', default: 'file9.txt', type: 'text' },
  ],
  pseudocode: ['chunks("file10.txt") = file | 10 | .txt', 'for i in 0..min(len)-1:', '    both numbers → compare as numbers', '    otherwise → compare text (ignore case)', '    first difference decides', 'shorter chunk list first'],
  run({ a, b }) {
    if (!a || !b || a.length > 20 || b.length > 20 || /\s/.test(a + b)) return err('Two names without spaces, up to 20 characters each.');
    const x = chunks(a), y = chunks(b);
    const steps: TraceStep[] = [{ note: 'Split each name into alternating chunks of non-digits and digits.', line: 0, vars: {}, arrays: [arr(`chunks of "${a}"`, x), arr(`chunks of "${b}"`, y)] }];
    let verdict = 0;
    for (let i = 0; i < Math.min(x.length, y.length); i++) {
      const p = x[i], q = y[i];
      const numeric = /^[0-9]/.test(p) && /^[0-9]/.test(q);
      let cmp: number;
      if (numeric) {
        const P = BigInt(p), Q = BigInt(q);
        cmp = P < Q ? -1 : P > Q ? 1 : 0;
      } else {
        const lp = p.toLowerCase(), lq = q.toLowerCase();
        cmp = lp < lq ? -1 : lp > lq ? 1 : 0;
      }
      steps.push({ note: `Chunk ${i}: ${numeric ? `numbers ${p} vs ${q} compared by VALUE (${BigInt(p)} vs ${BigInt(q)})` : `text "${p}" vs "${q}" compared ignoring case`} → ${cmp < 0 ? 'less' : cmp > 0 ? 'greater' : 'equal'}.`, line: numeric ? 2 : 3, vars: { chunk: i, comparison: cmp }, arrays: [arr(`chunks of "${a}"`, x, { [i]: cmp ? (cmp < 0 ? 'found' : 'bad') : 'done' }), arr(`chunks of "${b}"`, y, { [i]: cmp ? (cmp > 0 ? 'found' : 'bad') : 'done' })] });
      if (cmp !== 0) {
        verdict = cmp;
        break;
      }
    }
    if (verdict === 0) {
      verdict = Math.sign(x.length - y.length);
      steps.push({ note: `All shared chunks are equal, so the name with fewer chunks comes first (${x.length} vs ${y.length}).`, line: 5, vars: { verdict } });
    }
    const plain = a < b ? -1 : a > b ? 1 : 0;
    steps.push({ note: `For comparison, plain compareTo gives ${plain < 0 ? '"' + a + '" first' : plain > 0 ? '"' + b + '" first' : 'equal'} because it compares character by character ('1' < '9').`, line: 0, vars: { 'plain compareTo': plain, 'natural': verdict } });
    return { steps, result: verdict === 0 ? 'equal' : verdict < 0 ? `"${a}" comes before "${b}" (natural order)` : `"${b}" comes before "${a}" (natural order)` };
  },
};
