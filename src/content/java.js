export const java = {
  id: 'java',
  name: 'Java Core & Internals',
  icon: '☕',
  blurb: 'The stack you are hired for, so this is the room to be unembarrassable in. The gap is rarely syntax — it is knowing why Java behaves the way it does. Collections internals, concurrency, and the JVM.',
  weeks: 'Weeks 1–9 (evenings)',
  topics: [
    {
      id: 'java-oop',
      name: 'OOP that interviewers actually test',
      week: 1, mins: 120,
      summary: 'Not the textbook four pillars. The behaviours that show up in code review.',
      blocks: [
        { k: 'p', body: [
          'Everyone can recite encapsulation, inheritance, polymorphism, abstraction. Nobody gets hired for that. What gets tested is whether you make the right modelling decisions — which is really about *composition versus inheritance*, and about programming to interfaces.',
        ]},
        { k: 'code', lang: 'java', cap: 'The distinction that matters most', src: `// INHERITANCE — "is-a". Use sparingly. Java allows only one parent,
// and it couples the child to the parent's implementation forever.
class SavingsAccount extends Account { }

// COMPOSITION — "has-a". Prefer this. Flexible, testable, swappable.
class OrderService {
    private final PaymentGateway gateway;      // HAS a gateway
    private final NotificationSender notifier; // HAS a notifier

    OrderService(PaymentGateway gateway, NotificationSender notifier) {
        this.gateway = gateway;
        this.notifier = notifier;
    }
}

// INTERFACE vs ABSTRACT CLASS
interface Payable {                 // a contract. Many can be implemented.
    void pay(BigDecimal amount);
    default String label() { return "payment"; }   // Java 8+: shared default
}

abstract class BaseProcessor {      // shared STATE + partial implementation
    protected final AuditLog log;   // fields live here; interfaces cannot have them
    BaseProcessor(AuditLog log) { this.log = log; }
    abstract void process();
}` },
        { k: 'table', title: 'Interface or abstract class?', head: ['', 'Interface', 'Abstract class'], rows: [
          ['How many', 'Implement many', 'Extend exactly one'],
          ['Fields', 'Only `public static final`', 'Any instance fields'],
          ['Constructor', 'No', 'Yes'],
          ['Use for', 'A capability ("can be paid")', 'Shared state + partial behaviour'],
          ['Default choice', '**This one**', 'Only when you need shared state'],
        ]},
        { k: 'note', tone: 'tip', title: 'The one-liner that lands', body: '*"Favour composition over inheritance — inheritance couples you to the parent\'s implementation and you only get one, whereas composition lets you swap the collaborator, and it is far easier to test because I can inject a fake."* That sentence signals seniority faster than any definition.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Method overloading vs overriding?', a: 'Overloading is same name, different parameter list, resolved at **compile time** by the declared types. Overriding is a subclass replacing a parent method with the same signature, resolved at **runtime** by the actual object type. Compile-time vs runtime is the answer they are listening for.' },
          { q: 'Can you override a static method?', a: 'No. Statics belong to the class, not the instance, so they are *hidden*, not overridden — resolution happens at compile time from the reference type, not the object type. `Parent p = new Child(); p.staticMethod()` calls the Parent version, which surprises people and is exactly why the question is asked.' },
        ]},
      ],
    },
    {
      id: 'java-collections',
      name: 'Collections — choosing the right one',
      week: 1, mins: 150, tag: 'core',
      summary: 'The map of the whole framework, and how to pick under pressure.',
      blocks: [
        { k: 'p', body: [
          'Three families. **List** — ordered, duplicates allowed, indexed. **Set** — no duplicates. **Map** — key to value. Everything else is a variation on how those three are stored.',
        ]},
        { k: 'table', title: 'The decision table', head: ['Need', 'Use', 'Why'], rows: [
          ['Ordered list, lots of reads by index', '`ArrayList`', 'O(1) index, cache-friendly'],
          ['Lots of inserts/removes at the ends', '`ArrayDeque`', 'Faster than LinkedList in practice'],
          ['No duplicates, do not care about order', '`HashSet`', 'O(1) add/contains'],
          ['No duplicates, keep insertion order', '`LinkedHashSet`', 'O(1) plus predictable iteration'],
          ['No duplicates, sorted', '`TreeSet`', 'O(log n), range queries'],
          ['Key → value, fastest', '`HashMap`', 'O(1) average'],
          ['Key → value, insertion/access order', '`LinkedHashMap`', 'The basis of an LRU cache'],
          ['Key → value, sorted keys', '`TreeMap`', 'floor/ceiling/subMap'],
          ['Thread-safe map', '`ConcurrentHashMap`', 'Never `Hashtable`'],
        ]},
        { k: 'note', tone: 'warn', title: 'LinkedList is almost always the wrong answer', body: 'Textbooks say LinkedList wins for insertions. In practice `ArrayList` and `ArrayDeque` beat it almost everywhere, because contiguous memory is enormously more cache-friendly than chasing pointers around the heap. The only real use is when you need `Deque` behaviour *and* nulls. Saying this shows you have measured things rather than memorised them.' },
        { k: 'code', lang: 'java', cap: 'Immutable and defensive collections', src: `// Java 9+ factory methods — immutable, compact, throw on modification
List<String> fixed = List.of("a", "b", "c");
Map<String, Integer> config = Map.of("retries", 3, "timeout", 30);

// Defensive copy — stop callers mutating your internal state
class Order {
    private final List<Item> items;
    Order(List<Item> items) {
        this.items = List.copyOf(items);        // snapshot on the way in
    }
    List<Item> getItems() {
        return Collections.unmodifiableList(items);   // read-only on the way out
    }
}` },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'ArrayList vs LinkedList — which is faster to insert in the middle?', a: 'Trick question. LinkedList insertion is O(1) *once you are at the node*, but getting there is O(n) — so a middle insert is O(n) either way. ArrayList is O(n) for the shift but that shift is a single fast memory copy. In real benchmarks ArrayList usually wins. The right answer names both costs rather than reciting the table.' },
          { q: 'How do you make a collection thread-safe?', a: 'Three options, worst to best: `Collections.synchronizedList()` wraps every method in a lock — simple, and a bottleneck. `CopyOnWriteArrayList` copies the whole array on write — excellent for read-heavy, terrible for write-heavy. `ConcurrentHashMap` uses fine-grained per-bin locking — the right default for maps. Never `Hashtable` or `Vector`; they are legacy and lock the entire structure.' },
        ]},
      ],
    },
    {
      id: 'java-hashmap-internals',
      name: 'HashMap internals — and building one',
      week: 2, mins: 220, tag: 'core',
      summary: 'The most asked Java internals question. Write a working one from scratch and it stops being memorisation.',
      blocks: [
        { k: 'p', title: 'What actually happens on put()', body: [
          '**1.** `hashCode()` is called on the key. **2.** Java applies a spreading function (`h ^ (h >>> 16)`) so that high bits influence the result — poor hash functions otherwise collide badly. **3.** The bucket index is `hash & (capacity - 1)`, which works as a fast modulo *because capacity is always a power of two*. **4.** If the bucket is empty, store. If not, walk the bucket comparing with `equals()` — replace on match, append if not.',
        ]},
        { k: 'analogy', body: 'A car park with numbered rows. The attendant computes your row from your number plate rather than assigning the next free space. Finding your car later means recomputing the row and walking just that row, not the whole car park. Two plates can compute to the same row — that is a collision, and you then walk that one row comparing plates.' },
        { k: 'table', title: 'The numbers to remember', head: ['Property', 'Value'], rows: [
          ['Default capacity', '16 buckets'],
          ['Load factor', '0.75'],
          ['Resize trigger', 'size > capacity × 0.75 (so 12 for a fresh map)'],
          ['Resize behaviour', 'Capacity doubles; every entry is rehashed'],
          ['Treeify threshold', '8 entries in one bucket → becomes a red-black tree'],
          ['Untreeify threshold', 'Back to a list at 6'],
        ]},
        { k: 'code', lang: 'java', cap: 'Build one. Every interview answer about HashMap comes out of this code.', src: `class MyHashMap<K, V> {

    // Each bucket is the head of a singly linked list of entries.
    private static class Node<K, V> {
        final K key;
        V value;
        final int hash;
        Node<K, V> next;
        Node(int hash, K key, V value, Node<K, V> next) {
            this.hash = hash; this.key = key; this.value = value; this.next = next;
        }
    }

    private Node<K, V>[] table;
    private int size;
    private static final float LOAD_FACTOR = 0.75f;

    @SuppressWarnings("unchecked")
    MyHashMap() { table = new Node[16]; }      // capacity is a POWER OF TWO

    // SPREAD: mix the high bits down into the low bits. Without this, keys
    // whose hashes differ only in the upper bits all collide, because the
    // bucket index only looks at the low bits.
    private static int spread(Object key) {
        if (key == null) return 0;
        int h = key.hashCode();
        return h ^ (h >>> 16);
    }

    // Fast modulo. Works ONLY because length is a power of two:
    // (length - 1) is a mask of all-ones in the low bits.
    private int indexFor(int hash) { return hash & (table.length - 1); }

    V get(Object key) {
        int hash = spread(key);
        for (Node<K, V> e = table[indexFor(hash)]; e != null; e = e.next) {
            // compare HASH first (cheap int compare), then equals (may be costly)
            if (e.hash == hash && (e.key == key || (key != null && key.equals(e.key)))) {
                return e.value;
            }
        }
        return null;
    }

    V put(K key, V value) {
        int hash = spread(key);
        int i = indexFor(hash);

        // 1. Walk the bucket looking for an existing equal key
        for (Node<K, V> e = table[i]; e != null; e = e.next) {
            if (e.hash == hash && (e.key == key || (key != null && key.equals(e.key)))) {
                V old = e.value;
                e.value = value;               // REPLACE — size does not change
                return old;
            }
        }

        // 2. Not found: prepend a new node to this bucket
        table[i] = new Node<>(hash, key, value, table[i]);
        size++;

        // 3. Grow if we have exceeded the load factor
        if (size > table.length * LOAD_FACTOR) resize();
        return null;
    }

    @SuppressWarnings("unchecked")
    private void resize() {
        Node<K, V>[] old = table;
        table = new Node[old.length * 2];      // DOUBLE — stays a power of two

        // Every entry must be REHASHED, because indexFor depends on length.
        for (Node<K, V> head : old) {
            for (Node<K, V> e = head; e != null; ) {
                Node<K, V> next = e.next;      // save it: we overwrite e.next
                int i = indexFor(e.hash);
                e.next = table[i];
                table[i] = e;
                e = next;
            }
        }
    }

    int size() { return size; }
}` },
        { k: 'note', tone: 'tip', title: 'What writing it teaches you that reading cannot', body: 'Three things become obvious the moment you have written this. **(1)** Why a mutated key is unreachable — `indexFor` sends the lookup to a different bucket, and the entry sits there forever. **(2)** Why `equals` and `hashCode` must agree — the bucket is chosen by hash, the match inside it is decided by equals, so a disagreement means the entry is in a bucket nobody will search. **(3)** Why resizing is expensive — every single entry is rehashed and relinked, which is precisely why you pre-size a map you know will be large.' },
        { k: 'note', tone: 'info', title: 'What the real implementation adds', body: 'Java\'s `HashMap` is this plus three refinements: buckets convert to **red-black trees** at 8 entries (capping the worst case at O(log n) instead of O(n)); resizing splits each bucket into a *low* and *high* list without recomputing hashes, since doubling the capacity only exposes one extra bit; and there is a `modCount` field so iterators can throw `ConcurrentModificationException` on structural change. The core above is genuinely the shape of it.' },

        { k: 'code', lang: 'java', cap: 'Why the sizing matters in real code', src: `// BAD: default capacity 16, so inserting 10,000 entries triggers
// roughly 10 resizes, each rehashing everything inserted so far.
Map<String, User> users = new HashMap<>();

// GOOD: size it up front. Capacity should be expected / 0.75.
Map<String, User> sized = new HashMap<>(16384);   // for ~12,000 entries

// A terrible hashCode makes every key land in one bucket:
class BadKey {
    @Override public int hashCode() { return 1; }   // O(log n) lookups forever
}` },
        { k: 'note', tone: 'trap', title: 'Why treeify exists', body: 'Before Java 8, a bucket was a linked list, so an attacker who could control keys could force every one into a single bucket and turn O(1) lookups into O(n) — a real denial-of-service vector on web forms. Java 8 converts long buckets to red-black trees, capping the worst case at O(log n). This is a very good answer to "what changed in HashMap in Java 8".' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'What happens if two keys have the same hashCode?', a: 'They land in the same bucket. `equals()` is then used to distinguish them. If `equals()` also says they are equal, the second put **replaces** the first value. If not, both are stored in that bucket — as a list, or as a red-black tree once the bucket reaches 8 entries.' },
          { q: 'Why is HashMap capacity always a power of two?', a: 'So the bucket index can be computed as `hash & (capacity - 1)` — a single bitwise AND — instead of the much slower `hash % capacity`. It only works because subtracting one from a power of two gives a mask of all-ones in the low bits.' },
          { q: 'What happens if you mutate a key after putting it in a map?', a: 'Its `hashCode` changes, so lookups compute a different bucket and the entry becomes unreachable — it is in the map, `size()` counts it, but `get()` returns null and it will never be garbage collected. This is why map keys should be **immutable**, and why `String` being immutable makes it the ideal key.' },
        ]},
      ],
    },
    {
      id: 'java-equals-hashcode',
      name: 'equals() & hashCode()',
      week: 1, mins: 120, tag: 'core',
      summary: 'The contract, why it exists, and what breaks when you get it wrong.',
      blocks: [
        { k: 'p', title: 'The contract', body: [
          '**1.** If `a.equals(b)` then `a.hashCode() == b.hashCode()`. Mandatory. **2.** If hash codes are equal, objects may or may not be equal — collisions are allowed. **3.** Both must be consistent: same object, same answers, unless the fields used change.',
          'Rule 1 is the one people break, and the failure is silent and baffling: objects disappear into HashMaps and HashSets.',
        ]},
        { k: 'code', lang: 'java', cap: 'The failure, then the fix', src: `// BROKEN: equals overridden, hashCode not.
class User {
    private final String email;
    User(String email) { this.email = email; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        return email.equals(((User) o).email);
    }
    // no hashCode! -> inherits Object's identity hash
}

Set<User> set = new HashSet<>();
set.add(new User("a@b.com"));
set.contains(new User("a@b.com"));   // FALSE. Different bucket entirely.

// FIXED
class UserFixed {
    private final String email;
    UserFixed(String email) { this.email = email; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return Objects.equals(email, ((UserFixed) o).email);
    }
    @Override public int hashCode() {
        return Objects.hash(email);      // same fields as equals. Always.
    }
}

// BEST for a value type: a record generates both correctly, for free.
record UserRecord(String email, String name) { }` },
        { k: 'note', tone: 'tip', title: 'The rule that prevents every bug here', body: 'Use **exactly the same fields** in `equals` and `hashCode`, and make those fields **final**. If you cannot make them final, do not use the class as a map key. Better still, use a `record` for value types and let the compiler write both.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Why is it legal for unequal objects to share a hashCode?', a: 'Because hashCode returns an `int` — about 4 billion values — while there are unlimited possible objects. Collisions are mathematically unavoidable, so the map handles them with `equals()` inside the bucket. The contract only forbids the reverse: equal objects with different hash codes, because those would land in different buckets and never be compared.' },
          { q: 'Is `getClass() != o.getClass()` or `instanceof` correct in equals?', a: '`getClass()` is stricter and keeps the symmetry requirement intact when subclasses exist — a Point and a ColouredPoint are never equal. `instanceof` allows a subclass to equal its parent, which breaks symmetry if the subclass adds fields to equals. Use `getClass()` unless you have a specific reason, and be ready to explain the symmetry problem.' },
        ]},
      ],
    },
    {
      id: 'java-generics',
      name: 'Generics & type erasure',
      week: 3, mins: 130,
      summary: 'Compile-time safety that vanishes at runtime, and the wildcards nobody remembers.',
      blocks: [
        { k: 'p', body: [
          'Generics let the compiler catch type errors before they run. At runtime they are **erased** — `List<String>` and `List<Integer>` are both just `List`. The compiler inserts casts for you; the JVM never sees the type parameter.',
          'That erasure explains every strange generics rule you have hit.',
        ]},
        { k: 'code', lang: 'java', cap: 'What erasure means in practice', src: `List<String> strings = new ArrayList<>();
List<Integer> ints = new ArrayList<>();
System.out.println(strings.getClass() == ints.getClass());   // true!

// So these are all impossible:
// new T();                            // cannot instantiate a type parameter
// new T[10];                          // cannot create a generic array
// if (obj instanceof List<String>)    // cannot test an erased type
// void f(List<String> a) {} + void f(List<Integer> a) {}  // same erasure` },
        { k: 'code', lang: 'java', cap: 'PECS — the wildcard rule worth memorising', src: `// PRODUCER extends — you only READ from it
double sum(List<? extends Number> numbers) {
    double total = 0;
    for (Number n : numbers) total += n.doubleValue();   // reading: fine
    // numbers.add(1);   // COMPILE ERROR — could be List<Double>
    return total;
}

// CONSUMER super — you only WRITE to it
void addIntegers(List<? super Integer> target) {
    target.add(1);        // writing: fine
    target.add(2);
    // Integer x = target.get(0);   // ERROR — could be List<Object>
}

// Bounded type parameter — T must be comparable to itself
<T extends Comparable<T>> T max(List<T> list) {
    T best = list.get(0);
    for (T item : list) if (item.compareTo(best) > 0) best = item;
    return best;
}` },
        { k: 'note', tone: 'tip', title: 'PECS', body: '**P**roducer **E**xtends, **C**onsumer **S**uper. If the collection *produces* values you read, use `? extends`. If it *consumes* values you write, use `? super`. If you do both, use a plain `T`. Naming PECS by name in an interview is a small, reliable signal.' },
      ],
    },
    {
      id: 'java-streams',
      name: 'Streams & lambdas',
      week: 4, mins: 160, tag: 'core',
      summary: 'Declarative data processing. Used daily; asked about constantly.',
      blocks: [
        { k: 'p', body: [
          'A stream is a pipeline: a source, zero or more **intermediate** operations (lazy, they build the pipeline), and exactly one **terminal** operation (which actually runs it). Nothing happens until the terminal operation is called.',
        ]},
        { k: 'code', lang: 'java', cap: 'The operations you will use 95% of the time', src: `List<Employee> staff = ...;

// filter + map + collect
List<String> names = staff.stream()
    .filter(e -> e.getSalary() > 50_000)
    .map(Employee::getName)
    .collect(Collectors.toList());

// groupingBy — the most useful collector there is
Map<String, List<Employee>> byDept = staff.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

// groupingBy with a downstream collector
Map<String, Long> countByDept = staff.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));

Map<String, Double> avgByDept = staff.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment,
             Collectors.averagingDouble(Employee::getSalary)));

// toMap — watch out for duplicate keys, it throws
Map<Long, Employee> byId = staff.stream()
    .collect(Collectors.toMap(Employee::getId, e -> e));

// toMap with a merge function to handle duplicates
Map<String, Employee> topPerDept = staff.stream()
    .collect(Collectors.toMap(Employee::getDepartment, e -> e,
             (a, b) -> a.getSalary() > b.getSalary() ? a : b));

// reduce, sorted, distinct, limit
Optional<Employee> highest = staff.stream()
    .max(Comparator.comparingDouble(Employee::getSalary));

// flatMap — flatten nested structures
List<String> allSkills = staff.stream()
    .flatMap(e -> e.getSkills().stream())
    .distinct()
    .sorted()
    .toList();                      // Java 16+, nicer than collect(toList())` },
        { k: 'note', tone: 'trap', title: 'Three traps', body: '**(1)** A stream is consumed once — reusing one throws `IllegalStateException`. **(2)** `Collectors.toMap` throws on duplicate keys; always supply a merge function unless keys are guaranteed unique. **(3)** `parallelStream()` is almost never faster for small collections and is actively dangerous with shared mutable state. Use it only for large CPU-bound work, never for I/O.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'What is lazy evaluation in streams?', a: 'Intermediate operations do not run when called — they only record what to do. The whole pipeline executes when the terminal operation runs, and it processes elements one at a time through the full chain rather than materialising intermediate lists. That is why `.filter().findFirst()` on a million elements can stop after examining three.' },
          { q: 'Stream or for loop?', a: 'Streams for declarative transformations — filter, map, group — where they read better and express intent. Loops when you need early exit with complex conditions, when you are mutating, when index arithmetic matters, or in a genuinely hot path where the extra allocation shows up in a profiler. "Readability first, measure before optimising" is the answer they want.' },
        ]},
      ],
    },
    {
      id: 'java-optional',
      name: 'Optional & null handling',
      week: 5, mins: 90,
      summary: 'A return type, not a field type. Most people misuse it.',
      blocks: [
        { k: 'p', body: [
          '`Optional<T>` exists to say, in the type signature, "this method might not return anything." It is documentation the compiler enforces. It is **not** a general null replacement, and using it as a field or a parameter is a design smell.',
        ]},
        { k: 'code', lang: 'java', cap: 'Right and wrong', src: `// GOOD — a return type that might legitimately be empty
Optional<User> findByEmail(String email) {
    return Optional.ofNullable(repository.getByEmail(email));
}

// Consuming it well — no isPresent()/get() pair
String name = findByEmail(email)
    .map(User::getName)
    .orElse("Unknown");

findByEmail(email).ifPresentOrElse(
    user -> log.info("Found {}", user.getName()),
    ()   -> log.warn("No user for {}", email)
);

User user = findByEmail(email)
    .orElseThrow(() -> new UserNotFoundException(email));

// BAD — the anti-patterns
// if (opt.isPresent()) { opt.get(); }     // this is just a null check with ceremony
// private Optional<String> name;           // never a FIELD (not serialisable, wasteful)
// void process(Optional<User> u)           // never a PARAMETER — overload instead
// opt.get()                                // without checking: throws NoSuchElementException` },
        { k: 'note', tone: 'tip', title: 'The rule', body: 'Optional belongs in **return types of methods that may find nothing** — typically repository lookups. Fields stay nullable or non-null; parameters get overloads. Saying "Optional is a return type, not a field type" is a small precise signal that you have thought about it.' },
      ],
    },
    {
      id: 'java-exceptions',
      name: 'Exceptions',
      week: 5, mins: 110,
      summary: 'Checked vs unchecked, and the handling patterns that survive code review.',
      blocks: [
        { k: 'table', title: 'The hierarchy', head: ['Type', 'Extends', 'Checked?', 'Meaning'], rows: [
          ['`Error`', 'Throwable', 'No', 'JVM is broken — `OutOfMemoryError`. Do not catch.'],
          ['`RuntimeException`', 'Exception', 'No', 'Programming bug — NPE, IllegalArgument'],
          ['Other `Exception`', 'Exception', '**Yes**', 'Recoverable condition — IOException'],
        ]},
        { k: 'code', lang: 'java', cap: 'The patterns that matter', src: `// try-with-resources — auto-closes, in reverse order, even on exception
try (var conn = dataSource.getConnection();
     var stmt = conn.prepareStatement(SQL)) {
    return stmt.executeQuery();
}   // both closed automatically, no finally block needed

// Wrap and rethrow — ALWAYS keep the cause
try {
    externalApi.call();
} catch (IOException e) {
    throw new PaymentFailedException("Gateway unreachable", e);   // <-- e preserved
}

// A meaningful custom exception
class InsufficientFundsException extends RuntimeException {
    private final BigDecimal shortfall;
    InsufficientFundsException(BigDecimal shortfall) {
        super("Short by " + shortfall);
        this.shortfall = shortfall;
    }
    BigDecimal getShortfall() { return shortfall; }
}` },
        { k: 'note', tone: 'trap', title: 'The three sins', body: '**(1)** `catch (Exception e) { }` — swallowing silently. The bug becomes invisible and you will lose a day to it later. **(2)** `throw new RuntimeException(e.getMessage())` — drops the stack trace; always pass `e` itself. **(3)** Using exceptions for control flow — throwing to signal "not found" in a loop is orders of magnitude slower than returning a value, because building a stack trace is expensive.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Checked or unchecked for your own exceptions?', a: 'Unchecked, in most modern code. Checked exceptions force every caller up the chain to handle or declare, which produces `throws` clauses that leak implementation details and lots of empty catch blocks. Spring, Hibernate and most modern frameworks use unchecked throughout. Use checked only when the caller genuinely can and should recover at the call site.' },
          { q: 'What happens if finally has a return statement?', a: 'It **overrides** whatever the try or catch block was returning, and silently discards any in-flight exception. It is a notorious bug source and most static analysers flag it. Never return from finally.' },
        ]},
      ],
    },
    {
      id: 'java-immutability',
      name: 'Immutability & records',
      week: 5, mins: 100,
      summary: 'Why immutable objects remove entire categories of bug.',
      blocks: [
        { k: 'p', body: [
          'An immutable object cannot change after construction. That single property makes it automatically thread-safe, safe as a map key, safe to share freely, and impossible to corrupt by accident from a distant part of the codebase.',
        ]},
        { k: 'code', lang: 'java', cap: 'The five rules, then the shortcut', src: `// The manual way — all five rules applied
final class Money {                                   // 1. class is final
    private final BigDecimal amount;                  // 2. fields are final
    private final List<String> tags;                  // 3. private

    Money(BigDecimal amount, List<String> tags) {
        this.amount = amount;
        this.tags = List.copyOf(tags);                // 4. defensive copy IN
    }

    BigDecimal getAmount() { return amount; }
    List<String> getTags() { return tags; }           // 5. already immutable OUT

    Money plus(Money other) {                          // return a NEW object
        return new Money(amount.add(other.amount), tags);
    }
}

// Java 16+: a record does all of this for you.
record Money2(BigDecimal amount, String currency) {
    // compiler generates: constructor, accessors, equals, hashCode, toString

    Money2 {                                           // compact constructor
        Objects.requireNonNull(amount);
        if (amount.signum() < 0) throw new IllegalArgumentException("negative");
    }

    Money2 plus(Money2 other) {
        return new Money2(amount.add(other.amount), currency);
    }
}` },
        { k: 'note', tone: 'warn', title: 'Records are shallowly immutable', body: 'A record with a `List` field still hands out the same mutable list — the *reference* is final, not the contents. If a record holds a collection, copy it in the compact constructor with `List.copyOf(...)`. This is a favourite follow-up question.' },
      ],
    },
    {
      id: 'java-threads',
      name: 'Threads & the executor framework',
      week: 6, mins: 180, tag: 'core',
      summary: 'Never create threads manually. Use pools, and know why.',
      blocks: [
        { k: 'p', body: [
          'A thread is an independent path of execution. Creating one is expensive — around 1MB of stack plus an OS-level call — so creating one per task collapses under load. Pools reuse a fixed set of threads, which is the entire point of the executor framework.',
        ]},
        { k: 'code', lang: 'java', cap: 'Pools, and the submit/execute distinction', src: `// Fixed pool: n threads, unbounded queue. The everyday choice.
ExecutorService pool = Executors.newFixedThreadPool(10);

// Runnable — no result, exceptions vanish silently with execute()
pool.execute(() -> System.out.println("work"));

// Callable — returns a value, and the Future carries any exception
Future<Integer> future = pool.submit(() -> expensiveCalculation());
Integer result = future.get();          // BLOCKS until done
Integer bounded = future.get(5, TimeUnit.SECONDS);   // better: with a timeout

// Always shut down, or the JVM will not exit
pool.shutdown();                                     // no new tasks; finish existing
if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
    pool.shutdownNow();                              // interrupt what is running
}

// PRODUCTION: build the pool explicitly so the queue is BOUNDED
ExecutorService prod = new ThreadPoolExecutor(
    10, 20,                                  // core, max threads
    60L, TimeUnit.SECONDS,                   // idle keep-alive
    new ArrayBlockingQueue<>(100),           // BOUNDED — this is the key part
    new ThreadPoolExecutor.CallerRunsPolicy() // backpressure when saturated
);` },
        { k: 'note', tone: 'trap', title: 'Why Executors.newFixedThreadPool is risky in production', body: 'It uses an **unbounded** `LinkedBlockingQueue`. Under a traffic spike, tasks queue up without limit until the heap is exhausted and you get an `OutOfMemoryError` — the service dies rather than shedding load. Real systems use a bounded queue plus a rejection policy so that overload degrades instead of crashing. This is an excellent thing to say unprompted.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'How do you size a thread pool?', a: 'For CPU-bound work, roughly the number of cores — more threads just add context switching. For I/O-bound work you can go much higher, because threads spend most of their time blocked; the classic formula is cores × (1 + waitTime/computeTime). The honest answer is "start from that estimate and then measure under realistic load".' },
          { q: 'What is the difference between execute() and submit()?', a: '`execute` takes a Runnable and returns nothing — if the task throws, the exception goes to the thread\'s uncaught handler and is easy to miss entirely. `submit` returns a `Future` and **captures** any exception, rethrowing it wrapped in an `ExecutionException` when you call `get()`. Silently swallowed exceptions from `execute` are a very common production bug.' },
        ]},
      ],
    },
    {
      id: 'java-synchronization',
      name: 'synchronized, volatile & locks',
      week: 7, mins: 180, tag: 'core',
      summary: 'The two problems concurrency creates, and the three tools that fix them.',
      blocks: [
        { k: 'p', title: 'Two separate problems', body: [
          '**Visibility** — thread A changes a value, thread B never sees it, because each CPU core caches its own copy. **Atomicity** — `count++` is actually read, add, write; two threads can interleave and one update vanishes.',
          '`volatile` fixes visibility only. `synchronized` fixes both. Confusing the two is the most common concurrency misunderstanding.',
        ]},
        { k: 'code', lang: 'java', cap: 'Each tool doing its job', src: `// VOLATILE: visibility only. Perfect for a flag, useless for a counter.
private volatile boolean running = true;
public void stop() { running = false; }      // other threads see it immediately
public void run() { while (running) { doWork(); } }

// volatile does NOT make this safe — ++ is still three operations
private volatile int broken = 0;
public void increment() { broken++; }        // STILL loses updates

// SYNCHRONIZED: mutual exclusion + visibility
private int count = 0;
public synchronized void increment() { count++; }     // locks 'this'

private final Object lock = new Object();
public void safeIncrement() {
    synchronized (lock) { count++; }         // better: a private lock object
}

// ATOMIC: lock-free, uses a CPU compare-and-swap. Faster under contention.
private final AtomicInteger atomicCount = new AtomicInteger();
public void fastIncrement() { atomicCount.incrementAndGet(); }

// ReentrantLock: when you need tryLock, timeouts, or fairness
private final ReentrantLock rlock = new ReentrantLock();
public void withTimeout() throws InterruptedException {
    if (rlock.tryLock(1, TimeUnit.SECONDS)) {
        try { count++; } finally { rlock.unlock(); }   // unlock in finally. Always.
    } else {
        // could not get the lock — degrade gracefully instead of blocking
    }
}` },
        { k: 'table', title: 'Choosing', head: ['Tool', 'Visibility', 'Atomicity', 'Use for'], rows: [
          ['`volatile`', 'Yes', 'No', 'A flag written by one thread, read by many'],
          ['`synchronized`', 'Yes', 'Yes', 'The simple default'],
          ['`AtomicInteger`', 'Yes', 'Yes', 'Counters — faster than a lock'],
          ['`ReentrantLock`', 'Yes', 'Yes', 'tryLock, timeouts, multiple conditions'],
          ['`ReadWriteLock`', 'Yes', 'Yes', 'Many readers, rare writers'],
        ]},
        { k: 'note', tone: 'trap', title: 'Deadlock', body: 'Thread A holds lock 1 and wants lock 2; thread B holds lock 2 and wants lock 1. Both wait forever. The standard prevention is **always acquire locks in the same global order** — for example, by object ID. `tryLock` with a timeout is the other defence. Expect to be asked to describe a deadlock and how you would avoid it.' },
      ],
    },
    {
      id: 'java-concurrent-collections',
      name: 'Concurrent collections',
      week: 7, mins: 130,
      summary: 'ConcurrentHashMap and friends. Why they beat wrapping things in locks.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'The ones you actually use', src: `// ConcurrentHashMap — locks per bin, not per map. The default choice.
Map<String, Integer> counts = new ConcurrentHashMap<>();
counts.merge("key", 1, Integer::sum);                     // atomic
counts.computeIfAbsent("k", k -> expensiveLoad(k));       // atomic, runs once
counts.putIfAbsent("k", 0);                                // atomic

// CopyOnWriteArrayList — every write copies the whole array.
// Perfect for listener lists: read constantly, write almost never.
List<Listener> listeners = new CopyOnWriteArrayList<>();

// BlockingQueue — the producer/consumer backbone
BlockingQueue<Task> queue = new LinkedBlockingQueue<>(1000);
queue.put(task);          // blocks if full  -> natural backpressure
Task t = queue.take();    // blocks if empty -> no busy-waiting

// CountDownLatch — wait for n things to finish
CountDownLatch latch = new CountDownLatch(3);
// each worker calls latch.countDown() when done
latch.await();            // main thread waits for all three` },
        { k: 'note', tone: 'trap', title: 'Atomic methods vs atomic sequences', body: 'Each individual `ConcurrentHashMap` method is atomic, but a *sequence* of them is not. `if (!map.containsKey(k)) map.put(k, v)` is a race — two threads can both pass the check. Use `putIfAbsent` or `computeIfAbsent`, which do the whole check-and-act under one lock. This is an extremely common real-world bug and a great interview answer.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'How is ConcurrentHashMap better than Hashtable?', a: 'Hashtable synchronises every method on the whole map, so one writer blocks every reader and every other writer. ConcurrentHashMap locks only the individual bin being written (since Java 8 — before that, 16 segments), and reads are usually completely lock-free because the nodes are volatile. Under concurrent load the throughput difference is enormous.' },
        ]},
      ],
    },
    {
      id: 'java-completable-future',
      name: 'CompletableFuture',
      week: 8, mins: 140,
      summary: 'Async composition without blocking. Very common in microservice code.',
      blocks: [
        { k: 'p', body: [
          '`Future.get()` blocks, which throws away the benefit of being asynchronous. `CompletableFuture` lets you describe what happens *when* a result arrives, and compose several async calls without any thread sitting idle.',
        ]},
        { k: 'code', lang: 'java', cap: 'Chaining, combining and handling errors', src: `// Run async and transform the result
CompletableFuture<String> f = CompletableFuture
    .supplyAsync(() -> userService.fetch(id))       // runs on the pool
    .thenApply(User::getName)                        // transform (sync)
    .thenApply(String::toUpperCase);

// thenCompose: when the next step is ITSELF async (flatMap)
CompletableFuture<Order> chained = CompletableFuture
    .supplyAsync(() -> userService.fetch(id))
    .thenCompose(user -> orderService.fetchLatestAsync(user.getId()));

// PARALLEL FAN-OUT — three calls at once instead of one after another
CompletableFuture<User>    user    = CompletableFuture.supplyAsync(() -> userSvc.get(id));
CompletableFuture<Orders>  orders  = CompletableFuture.supplyAsync(() -> orderSvc.get(id));
CompletableFuture<Profile> profile = CompletableFuture.supplyAsync(() -> profSvc.get(id));

CompletableFuture.allOf(user, orders, profile).join();
Dashboard dash = new Dashboard(user.join(), orders.join(), profile.join());
// total latency = the SLOWEST call, not the sum. This is the whole point.

// Error handling
CompletableFuture<String> safe = CompletableFuture
    .supplyAsync(() -> riskyCall())
    .exceptionally(ex -> "fallback")                 // recover
    .orTimeout(3, TimeUnit.SECONDS);                 // Java 9+` },
        { k: 'note', tone: 'tip', title: 'Where this earns its keep', body: 'A page that needs user, orders and recommendations. Sequentially: 100ms + 150ms + 200ms = 450ms. In parallel with `allOf`: 200ms. Being able to describe that concrete win — and to name `thenCompose` vs `thenApply` as flatMap vs map — is a strong senior signal in a Java round.' },
      ],
    },
    {
      id: 'java-jvm-memory',
      name: 'JVM memory model',
      week: 9, mins: 150, tag: 'core',
      summary: 'Heap, stack, metaspace — and how to read an OutOfMemoryError.',
      blocks: [
        { k: 'table', title: 'The regions', head: ['Region', 'Holds', 'Scope', 'Fails with'], rows: [
          ['**Heap**', 'All objects and arrays', 'Shared by all threads', '`OutOfMemoryError: Java heap space`'],
          ['**Stack**', 'Local variables, call frames', 'One per thread', '`StackOverflowError`'],
          ['**Metaspace**', 'Class metadata', 'Shared', '`OutOfMemoryError: Metaspace`'],
          ['**Code cache**', 'JIT-compiled machine code', 'Shared', 'Rare'],
        ]},
        { k: 'code', lang: 'java', cap: 'Where each thing lives', src: `void method() {
    int x = 5;                       // STACK: primitive local
    User u = new User();             // 'u' reference on STACK, User OBJECT on HEAP
    int[] a = new int[1000];         // 'a' on STACK, the 1000 ints on HEAP
}   // stack frame pops here; the heap objects wait for GC

// The heap is split by generation:
//   Young gen: Eden + two Survivor spaces  <- new objects, collected often & fast
//   Old gen:   objects that survived several collections <- collected rarely & slowly
//
// Most objects die young. That observation is why generational GC works.` },
        { k: 'code', lang: 'java', cap: 'Flags worth knowing', src: `# Heap sizing — set min = max in containers to avoid resize pauses
-Xms2g -Xmx2g

# Dump the heap automatically when it blows up. Set this in production. Always.
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/log/app/

# Pick a collector
-XX:+UseG1GC                       # default since Java 9, balanced
-XX:MaxGCPauseMillis=200           # G1 target pause

# Per-thread stack size (raise it for deep recursion)
-Xss512k` },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'You get an OutOfMemoryError in production. What do you do?', a: 'First, read *which* OOM it is — heap space, metaspace and GC-overhead-limit have completely different causes. Then take the heap dump (which `-XX:+HeapDumpOnOutOfMemoryError` should already have written) and open it in Eclipse MAT, which points straight at the dominator tree. Usually it is an unbounded cache, an unbounded queue, a `ThreadLocal` never cleaned up, or a genuinely undersized heap. The order matters: identify, dump, analyse, then fix — not guess and restart.' },
          { q: 'Is Java pass-by-value or pass-by-reference?', a: 'Always pass-by-value. For objects, the *value being copied is the reference*. So reassigning the parameter inside the method does not affect the caller, but mutating the object it points at does. That distinction is the whole answer, and demonstrating it with a two-line example is better than asserting it.' },
        ]},
      ],
    },
    {
      id: 'java-gc',
      name: 'Garbage collection',
      week: 9, mins: 130,
      summary: 'How memory is reclaimed, and what a GC pause actually costs you.',
      blocks: [
        { k: 'p', body: [
          'An object is eligible for collection when it is no longer reachable from a GC root — a stack local, a static field, an active thread. Not when it goes out of scope; when it becomes *unreachable*.',
          'Collection is generational, because most objects die almost immediately. New objects go into Eden; the few that survive several minor collections get promoted to the old generation, which is collected far less often.',
        ]},
        { k: 'analogy', body: 'A restaurant clearing tables. Most tables turn over quickly (young generation) — a waiter sweeps through often and clears them fast. A few regulars sit all evening (old generation), and there is no point checking their tables every ten minutes. Occasionally the whole restaurant is deep-cleaned and everyone must stop — that is a full GC, and it is what you are trying to avoid.' },
        { k: 'table', title: 'The collectors', head: ['Collector', 'Best for', 'Typical pause'], rows: [
          ['Serial', 'Tiny heaps, single core', 'Long'],
          ['Parallel', 'Batch jobs, throughput over latency', 'Long but efficient'],
          ['**G1** (default)', 'General purpose, heaps 4–64GB', '~200ms target'],
          ['ZGC / Shenandoah', 'Very large heaps, latency-critical', '<10ms'],
        ]},
        { k: 'note', tone: 'trap', title: 'The classic memory leaks in Java', body: 'Garbage collection does not prevent leaks — it prevents *dangling pointers*. You still leak by holding references you no longer need: **(1)** a static `Map` used as a cache with no eviction, **(2)** listeners registered and never removed, **(3)** `ThreadLocal` values not cleared in a pooled thread, so they survive across unrelated requests, **(4)** an unclosed stream or connection. All four are common, and all four are good answers.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Can you force garbage collection?', a: 'No. `System.gc()` is a *suggestion* the JVM is free to ignore, and calling it is nearly always harmful — it can trigger a full stop-the-world collection at exactly the wrong moment. If you find yourself wanting it, the real problem is somewhere else.' },
          { q: 'What is a stop-the-world pause?', a: 'A phase where all application threads are frozen so the collector can work on a consistent view of the heap. Every collector has them; modern ones (G1, ZGC) do most work concurrently and keep pauses short. It matters because a 2-second full GC on a service with a 1-second client timeout produces a burst of failures with no error in your own logs.' },
        ]},
      ],
    },
  ],
}
