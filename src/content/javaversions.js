export const javaversions = {
  id: 'javaversions',
  name: 'Java by Version (8 → 25)',
  icon: '⇧',
  blurb: 'What arrived when, and why it matters. "Which Java features have you used?" is a standard opener — this is how you answer it precisely instead of vaguely.',
  weeks: 'Weeks 2–9 (evenings)',
  topics: [
    {
      id: 'jv-overview',
      name: 'The release train & which version to claim',
      week: 2, mins: 60, tag: 'core',
      summary: 'Six-month releases, LTS every two years, and how to answer "what Java do you know?"',
      blocks: [
        { k: 'p', body: [
          'Since Java 9, a new version ships **every six months** — March and September, on the dot. Most are short-lived. Every two years one is designated **LTS** (Long Term Support), gets years of patches, and is what companies actually run.',
          'So the versions that matter commercially are the LTS ones: **8, 11, 17, 21, 25**. Everything in between is where features incubate as *preview* before being finalised in an LTS.',
        ]},
        { k: 'table', title: 'The LTS line', head: ['Version', 'Released', 'Headline feature', 'Still seen in production?'], rows: [
          ['**Java 8**', 'Mar 2014', 'Lambdas, Streams, Optional', 'Yes — a lot of legacy still sits here'],
          ['**Java 11**', 'Sep 2018', 'HttpClient, `var`, String methods', 'Yes — very common'],
          ['**Java 17**', 'Sep 2021', 'Records, sealed classes, switch expressions', 'Yes — the current mainstream'],
          ['**Java 21**', 'Sep 2023', '**Virtual threads**, pattern matching', 'Growing fast — the one to know now'],
          ['**Java 25**', 'Sep 2025', 'Compact source files, module imports', 'Early adoption'],
        ]},
        { k: 'note', tone: 'tip', title: 'How to answer "which Java version do you use?"', body: 'Be specific, then show range: *"We\'re on 17 in production — mainly for records and sealed classes, which cleaned up our DTOs and our state modelling. I\'ve used 21 on a side service for virtual threads. Before that I spent years on 8, so I know the pre-lambda idioms too."* That answer is worth far more than "Java 8 or 11, I think" — it says you track the language rather than just consume it.' },
        { k: 'p', title: 'What "preview" means', body: [
          'A preview feature is complete but not permanent — it ships behind `--enable-preview` and may change before it is finalised. This is why records were "in" Java 14 but only *final* in 16, and why virtual threads were previewed in 19 and 20 before landing properly in 21.',
          'In an interview, say "finalised in 21" rather than "added in 19". The finalisation version is the one people run.',
        ]},
      ],
    },
    {
      id: 'jv-java8',
      name: 'Java 8 — the version that changed the language',
      week: 3, mins: 200, tag: 'core',
      summary: 'Lambdas, streams, Optional, default methods, java.time. Still the single most-asked version.',
      blocks: [
        { k: 'p', body: [
          'Java 8 (2014) is the biggest change in the language\'s history and still the most heavily interviewed. Everything after it is refinement; this is where Java became partly functional.',
        ]},
        { k: 'code', lang: 'java', cap: 'Lambdas & functional interfaces', src: `// BEFORE Java 8 — anonymous inner class
Collections.sort(people, new Comparator<Person>() {
    @Override public int compare(Person a, Person b) {
        return a.getName().compareTo(b.getName());
    }
});

// AFTER — a lambda is an instance of a FUNCTIONAL INTERFACE
// (an interface with exactly one abstract method)
people.sort((a, b) -> a.getName().compareTo(b.getName()));

// Better still — a method reference
people.sort(Comparator.comparing(Person::getName));

// The built-in functional interfaces you must know by name:
Function<String, Integer>   length   = String::length;        // T -> R
Predicate<String>           isEmpty  = String::isEmpty;       // T -> boolean
Consumer<String>            print    = System.out::println;   // T -> void
Supplier<String>            make     = () -> "hello";         // () -> T
BiFunction<Integer,Integer,Integer> add = (a, b) -> a + b;    // (T,U) -> R
UnaryOperator<String>       upper    = String::toUpperCase;   // T -> T

// Your own:
@FunctionalInterface                      // compiler enforces exactly one method
interface Validator<T> { boolean validate(T value); }` },
        { k: 'code', lang: 'java', cap: 'Streams — the part interviewers dig into', src: `// A stream pipeline: SOURCE -> INTERMEDIATE (lazy) -> TERMINAL (runs it)
List<String> names = employees.stream()          // source
    .filter(e -> e.getSalary() > 50_000)         // intermediate — lazy
    .map(Employee::getName)                       // intermediate — lazy
    .sorted()                                     // intermediate — lazy
    .collect(Collectors.toList());                // TERMINAL — now it runs

// Grouping — the most useful collector
Map<String, List<Employee>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

Map<String, Long> countByDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));

// Partitioning — grouping into exactly two buckets
Map<Boolean, List<Employee>> split = employees.stream()
    .collect(Collectors.partitioningBy(e -> e.getSalary() > 50_000));

// flatMap — flatten nested structures
List<String> allSkills = employees.stream()
    .flatMap(e -> e.getSkills().stream())
    .distinct()
    .collect(Collectors.toList());

// reduce — fold a stream into one value
BigDecimal total = orders.stream()
    .map(Order::getAmount)
    .reduce(BigDecimal.ZERO, BigDecimal::add);` },
        { k: 'note', tone: 'trap', title: 'Laziness, demonstrated', body: 'Intermediate operations do nothing until a terminal operation runs. `list.stream().filter(expensive).findFirst()` on a million elements may evaluate `expensive` only **three times** — it stops as soon as it has an answer. That is why `.filter().map()` does not build two intermediate lists: each element flows through the whole pipeline one at a time. Being able to state this clearly is a reliable differentiator.' },
        { k: 'code', lang: 'java', cap: 'default & static interface methods — and why they were added', src: `interface Collection<E> {
    // DEFAULT methods let you add to an interface WITHOUT breaking
    // every existing implementation. This is the only reason they exist:
    // Java 8 needed to add stream() to Collection, and there are thousands
    // of Collection implementations in the wild that could not be edited.
    default Stream<E> stream() {
        return StreamSupport.stream(spliterator(), false);
    }

    // STATIC methods on an interface — utility methods that belong with it
    static <T> Predicate<T> not(Predicate<T> p) { return p.negate(); }
}

// The DIAMOND PROBLEM, and how Java resolves it:
interface A { default String hello() { return "A"; } }
interface B { default String hello() { return "B"; } }

class C implements A, B {
    // COMPILE ERROR without this — Java refuses to guess.
    @Override public String hello() {
        return A.super.hello();      // explicit: pick one
    }
}` },
        { k: 'code', lang: 'java', cap: 'java.time — the replacement for Date and Calendar', src: `// The old API was mutable, not thread-safe, and had months 0-indexed.
// The new one is immutable and thread-safe throughout.
LocalDate    date    = LocalDate.of(2026, Month.AUGUST, 15);   // no time, no zone
LocalTime    time    = LocalTime.of(14, 30);                    // no date
LocalDateTime dt     = LocalDateTime.now();                     // no zone
ZonedDateTime zoned  = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
Instant      instant = Instant.now();     // a point on the UTC timeline

// Arithmetic returns a NEW object — these types are immutable
LocalDate nextWeek = date.plusWeeks(1).minusDays(2);

// Duration = time-based amount;  Period = date-based amount
Duration between = Duration.between(Instant.now(), later);   // hours/mins/secs
Period age       = Period.between(birthDate, LocalDate.now()); // years/months/days

// WHICH TYPE TO STORE: use Instant (or ZonedDateTime) for anything
// that marks a real moment — timestamps, audit logs, events. Use
// LocalDate for things with no time zone meaning: a birthday, an invoice date.` },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'What is a functional interface?', a: 'An interface with exactly one abstract method, which makes it a valid target for a lambda or method reference. `@FunctionalInterface` is optional but makes the compiler enforce it. Default and static methods do not count against the one — which is why `Comparator` has dozens of methods and is still functional.' },
          { q: 'map vs flatMap?', a: '`map` transforms each element one-to-one: `Stream<String>` → `Stream<Integer>`. `flatMap` transforms each element into a *stream* and then flattens them all into one: `Stream<List<String>>` → `Stream<String>`. Use flatMap whenever the transformation produces a collection and you want the contents, not the collections.' },
          { q: 'Why is Optional not Serializable, and why should it not be a field?', a: 'It was designed purely as a return type to signal "this may find nothing". It is deliberately not Serializable, adds an object allocation per use, and as a field gives you two ways to represent absence (null Optional, or empty Optional) which is worse than one. Use it on repository-style method returns; leave fields nullable or non-null.' },
        ]},
      ],
    },
    {
      id: 'jv-java9-11',
      name: 'Java 9, 10 & 11 — modules, var, and a modern standard library',
      week: 4, mins: 150,
      summary: 'Collection factories, local type inference, the String methods you use daily, and HttpClient.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'Java 9 — collection factories and stream additions', src: `// IMMUTABLE collection factories — concise, and genuinely immutable
List<String>        list = List.of("a", "b", "c");
Set<Integer>        set  = Set.of(1, 2, 3);
Map<String,Integer> map  = Map.of("a", 1, "b", 2);       // up to 10 pairs
Map<String,Integer> big  = Map.ofEntries(Map.entry("a", 1), Map.entry("b", 2));
// NOTE: these throw UnsupportedOperationException on modification,
// and List.of does NOT allow null elements (Arrays.asList does).

// Stream additions
Stream.of(1,2,3,4,5).takeWhile(n -> n < 4);      // 1,2,3 — stops at first false
Stream.of(1,2,3,4,5).dropWhile(n -> n < 4);      // 4,5
Stream.iterate(1, n -> n < 100, n -> n * 2);     // 3-arg: has a built-in condition
Stream.ofNullable(maybeNull);                     // 0 or 1 element

// Optional additions
opt.ifPresentOrElse(v -> use(v), () -> log("missing"));
opt.or(() -> Optional.of(fallback));
opt.stream();                                     // Optional -> Stream, for flatMap

// Private interface methods — share code between default methods
interface Service {
    default void a() { common(); }
    default void b() { common(); }
    private void common() { }                     // Java 9+
}` },
        { k: 'note', tone: 'info', title: 'The module system (JPMS) — know what it is, do not over-claim', body: 'Java 9 introduced modules: a `module-info.java` declaring what a jar `exports` and `requires`, giving real encapsulation above the package level. It solved classpath hell and let the JDK be split up (which is how `jlink` builds a 40MB runtime). **In practice most applications never adopted it** — Spring Boot apps overwhelmingly still run on the classpath. Know what it is and that the JDK itself is modular; do not claim daily use unless you have it.' },
        { k: 'code', lang: 'java', cap: 'Java 10 — var, and where it helps or hurts', src: `// var infers the type from the right-hand side. It is NOT dynamic typing —
// the type is fixed at compile time, you just did not write it.

// GOOD — the type is obvious and the declaration was noise
var users = new ArrayList<Map<String, List<Integer>>>();
var entry = map.entrySet().iterator().next();
for (var e : map.entrySet()) { }

// BAD — now the reader has to go and look
var result = service.process();          // what IS this?
var x = 1;                                // int? long? just write int.

// NOT ALLOWED:
// var x;                  // no initialiser -> nothing to infer from
// var x = null;           // cannot infer
// private var field = 1;  // LOCAL variables only — not fields, not params
//                         // (lambda params became legal in Java 11)` },
        { k: 'code', lang: 'java', cap: 'Java 11 (LTS) — the String and Files methods you will use constantly', src: `// String
"  ".isBlank();                    // true — isEmpty() would be false
"  hi  ".strip();                  // "hi"  — Unicode-aware, unlike trim()
"ab".repeat(3);                    // "ababab"
"a\\nb\\nc".lines()                 // Stream<String> — no more split("\\n")
     .map(String::strip)
     .filter(s -> !s.isBlank())
     .toList();

// Files — one-liners that used to need a try-with-resources block
String content = Files.readString(Path.of("config.json"));
Files.writeString(Path.of("out.txt"), content);

// HttpClient — standard, HTTP/2, sync and async. Replaces HttpURLConnection.
HttpClient client = HttpClient.newBuilder()
        .version(HttpClient.Version.HTTP_2)
        .connectTimeout(Duration.ofSeconds(5))
        .build();

HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://api.example.com/orders"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(json))
        .timeout(Duration.ofSeconds(10))
        .build();

// synchronous
HttpResponse<String> res = client.send(request, HttpResponse.BodyHandlers.ofString());

// asynchronous — returns a CompletableFuture
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
      .thenApply(HttpResponse::body)
      .thenAccept(System.out::println);

// var in lambda parameters (Java 11) — only useful to add an annotation
list.forEach((@NonNull var item) -> process(item));` },
      ],
    },
    {
      id: 'jv-java12-17',
      name: 'Java 12–17 — records, sealed classes, switch expressions, text blocks',
      week: 6, mins: 190, tag: 'core',
      summary: 'The Java 17 LTS feature set. This is what most teams are running now.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'Switch expressions (final in 14) — no fall-through, returns a value', src: `// OLD: statement, fall-through bugs, verbose
int days;
switch (month) {
    case JANUARY:
    case MARCH:
        days = 31;
        break;               // forget this and you get a silent bug
    default:
        days = 30;
}

// NEW: an EXPRESSION. Arrow form has no fall-through at all.
int days = switch (month) {
    case JANUARY, MARCH, MAY, JULY, AUGUST, OCTOBER, DECEMBER -> 31;
    case APRIL, JUNE, SEPTEMBER, NOVEMBER                      -> 30;
    case FEBRUARY                                              -> isLeap ? 29 : 28;
};
// EXHAUSTIVE over an enum -> the compiler errors if you add a constant
// and forget to handle it. That check alone is worth the migration.

// Multi-line branch: use yield to produce the value
String describe = switch (status) {
    case ACTIVE -> "running";
    case FAILED -> {
        log.error("failed at {}", Instant.now());
        yield "failed";                  // yield, not return
    }
};` },
        { k: 'code', lang: 'java', cap: 'Text blocks (final in 15)', src: `// OLD
String json = "{\\n" +
              "  \\"name\\": \\"Karthik\\",\\n" +
              "  \\"role\\": \\"engineer\\"\\n" +
              "}";

// NEW — incidental leading whitespace is stripped automatically,
// based on the least-indented line (including the closing delimiter).
String json = """
        {
          "name": "Karthik",
          "role": "engineer"
        }
        """;

String query = """
        SELECT o.id, c.name
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        WHERE o.status = ?
        """;

// \\ at end of line = no newline;  \\s = keep a trailing space
String oneLine = """
        this joins \\
        onto one line""";` },
        { k: 'code', lang: 'java', cap: 'Records (final in 16) — immutable data carriers', src: `// This one line generates: constructor, accessors (name(), not getName()),
// equals, hashCode, and toString.
public record Money(BigDecimal amount, String currency) { }

// COMPACT CONSTRUCTOR — validation and normalisation
public record Money(BigDecimal amount, String currency) {
    public Money {
        Objects.requireNonNull(amount, "amount");
        if (amount.signum() < 0) throw new IllegalArgumentException("negative");
        currency = currency.toUpperCase();      // reassigning the PARAMETER
    }                                            // is how you normalise

    // You can add behaviour — records are classes, not structs
    public Money plus(Money other) {
        if (!currency.equals(other.currency)) throw new IllegalArgumentException();
        return new Money(amount.add(other.amount), currency);
    }

    public static Money zero(String currency) {
        return new Money(BigDecimal.ZERO, currency);
    }
}

// What records CANNOT do: extend a class (they extend java.lang.Record),
// have non-final instance fields, or be mutable.
// PERFECT for: DTOs, API request/response bodies, value objects, map keys.` },
        { k: 'note', tone: 'trap', title: 'Records are only shallowly immutable', body: 'A record holding a `List` still hands out the same mutable list — the *reference* is final, the contents are not. Copy defensively in the compact constructor with `List.copyOf(items)`, and return a copy from the accessor if callers must not mutate it. This is a very common follow-up once you mention records.' },
        { k: 'code', lang: 'java', cap: 'Sealed classes (final in 17) + pattern matching', src: `// Sealed = "these are the ONLY permitted subtypes". It closes a hierarchy,
// which lets the compiler reason about exhaustiveness.
public sealed interface Shape permits Circle, Square, Rectangle { }

public record Circle(double radius)              implements Shape { }
public record Square(double side)                implements Shape { }
public record Rectangle(double w, double h)      implements Shape { }
// Subtypes must be final, sealed, or non-sealed.

// PATTERN MATCHING FOR instanceof (final in 16) — no cast needed
if (shape instanceof Circle c && c.radius() > 10) {
    System.out.println(c.radius());       // 'c' is already typed
}

// PATTERN MATCHING FOR switch (final in 21) — with sealed types the
// compiler knows the list is complete, so NO DEFAULT BRANCH IS NEEDED.
double area = switch (shape) {
    case Circle c        -> Math.PI * c.radius() * c.radius();
    case Square s        -> s.side() * s.side();
    case Rectangle r     -> r.w() * r.h();
};   // add a 4th shape and this stops compiling. That is the point.` },
        { k: 'note', tone: 'tip', title: 'Why sealed + records + switch is the headline combination', body: 'Together they give Java **algebraic data types**: a closed set of shapes, each an immutable value, matched exhaustively with compiler-checked completeness. That replaces the visitor pattern and a lot of defensive `instanceof` chains. If asked "what do you like about modern Java", this trio is the best answer — it is a real design improvement, not syntax sugar.' },
        { k: 'table', title: 'Smaller things worth recognising', head: ['Version', 'Feature'], rows: [
          ['12', '`Collectors.teeing` — two collectors, then merge the results'],
          ['13', '`String.formatted()`, `stripIndent()`'],
          ['14', '**Helpful NullPointerExceptions** — tells you *which* variable was null'],
          ['15', 'Hidden classes; Nashorn JS engine removed'],
          ['16', '`Stream.toList()` — shorter than `collect(Collectors.toList())`, and immutable'],
          ['17', 'New `RandomGenerator` interface; strong encapsulation of JDK internals'],
        ]},
        { k: 'note', tone: 'info', title: 'The Java 17 upgrade pain, in one line', body: 'Java 16+ **strongly encapsulates JDK internals**, so libraries that reflected into `sun.misc.*` or `java.lang` internals break with `InaccessibleObjectException`. The fix is upgrading the library, or `--add-opens` as a stopgap. If asked about migrating to 17, that is the real answer — the language features are the easy part.' },
      ],
    },
    {
      id: 'jv-java21',
      name: 'Java 21 (LTS) — virtual threads & pattern matching',
      week: 7, mins: 180, tag: 'core',
      summary: 'The current hot topic. Virtual threads change how you think about concurrency.',
      blocks: [
        { k: 'p', title: 'Virtual threads — the headline', body: [
          'A platform thread maps 1:1 to an OS thread: roughly 1MB of stack, expensive to create, so you pool them. A pool of 200 threads means **200 concurrent blocking operations, maximum** — which is why high-throughput Java services historically had to go reactive.',
          'A **virtual thread** is scheduled by the JVM onto a small pool of carrier threads. It costs a few hundred bytes, starts in microseconds, and when it blocks on I/O the JVM *unmounts* it from the carrier so that carrier can run something else. You can have millions.',
          'The consequence is the interesting part: **blocking code becomes cheap again.** The straightforward, readable, thread-per-request style is now viable at scale, and much of the reason to write reactive code disappears.',
        ]},
        { k: 'analogy', body: 'Platform threads are like assigning one dedicated employee per customer — accurate, but you cannot afford 10,000 employees. Virtual threads are like a small staff who put a customer on hold the instant they start waiting for something, and pick up another. The customer still thinks they have a dedicated person; you are paying for twenty.' },
        { k: 'code', lang: 'java', cap: 'Virtual threads in practice', src: `// Create one directly
Thread.startVirtualThread(() -> {
    var response = httpClient.send(request, BodyHandlers.ofString());
    process(response);
});

// An executor that creates a NEW virtual thread per task.
// Note: do NOT pool virtual threads — they are cheap enough to create
// on demand, and pooling them reintroduces the limit you were escaping.
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> futures = urls.stream()
        .map(url -> executor.submit(() -> fetch(url)))    // blocking call
        .toList();

    for (var f : futures) System.out.println(f.get());
}   // close() waits for all tasks — that is why try-with-resources works here

// 10,000 concurrent blocking calls. On platform threads this would need
// 10,000 OS threads (~10GB of stack). On virtual threads it is routine.
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i ->
        executor.submit(() -> { Thread.sleep(1000); return i; }));
}

// In Spring Boot 3.2+, one property turns it on for the whole web layer:
//   spring.threads.virtual.enabled=true` },
        { k: 'note', tone: 'trap', title: 'The two ways virtual threads bite', body: '**(1) Pinning.** Inside a `synchronized` block, a virtual thread cannot unmount — it *pins* its carrier thread, and enough pinned threads starve the pool. Prefer `ReentrantLock` over `synchronized` around blocking I/O. **(2) They do not help CPU-bound work.** Virtual threads win on *waiting*, not on computing; for CPU-bound work you are still limited by cores. Saying both of these unprompted is the difference between having read a blog post and having used the feature.' },
        { k: 'code', lang: 'java', cap: 'Record patterns & pattern matching for switch (final in 21)', src: `sealed interface Shape permits Circle, Rectangle { }
record Point(int x, int y) { }
record Circle(Point centre, double radius)   implements Shape { }
record Rectangle(Point topLeft, Point bottomRight) implements Shape { }

// RECORD PATTERNS destructure in the pattern itself — note how the
// nested Point is unpacked into x and y directly.
String describe(Object o) {
    return switch (o) {
        case Circle(Point(var x, var y), var r) when r > 100
                          -> "big circle at " + x + "," + y;
        case Circle(Point p, var r)
                          -> "circle radius " + r;
        case Rectangle(Point tl, Point br)
                          -> "rectangle from " + tl + " to " + br;
        case Integer i    -> "int " + i;
        case String s when s.isBlank()
                          -> "blank string";
        case String s     -> "string " + s;
        case null         -> "null";      // switch can now handle null explicitly
        default           -> "something else";
    };
}
// 'when' guards, null handling, and destructuring — this replaces long
// if/else instanceof chains with something the compiler can verify.` },
        { k: 'code', lang: 'java', cap: 'Sequenced collections — a small but genuinely useful addition', src: `// Before 21 there was no common way to ask a List, a LinkedHashSet and a
// Deque for "the first element". Now there is a shared interface.
SequencedCollection<String> list = new ArrayList<>(List.of("a", "b", "c"));

list.getFirst();          // "a"   — instead of list.get(0)
list.getLast();           // "c"   — instead of list.get(list.size() - 1)
list.addFirst("z");
list.removeLast();
list.reversed();          // a reversed VIEW, not a copy

SequencedMap<String,Integer> map = new LinkedHashMap<>();
map.firstEntry();
map.putFirst("a", 1);
map.reversed();` },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Virtual threads or reactive programming (WebFlux)?', a: 'Virtual threads for the vast majority of cases now — you get the scalability of async with ordinary blocking code that is readable, debuggable, and gives you real stack traces. Reactive still wins where you genuinely need backpressure, streaming, or composed event pipelines. The honest framing: virtual threads removed the *main* reason most teams adopted reactive, which was thread exhaustion.' },
          { q: 'Should I switch my thread pool to virtual threads?', a: 'For I/O-bound work, yes — and stop pooling entirely, use `newVirtualThreadPerTaskExecutor`. For CPU-bound work, no; keep a bounded platform-thread pool sized near your core count, because virtual threads do not create more CPU. Also audit for `synchronized` around blocking calls first, because of pinning.' },
        ]},
      ],
    },
    {
      id: 'jv-java22-25',
      name: 'Java 22–25 — what has landed since',
      week: 8, mins: 90,
      summary: 'Recent additions. Worth recognising; nobody will fail you for not using them yet.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'Stream gatherers — custom intermediate operations', src: `// Streams always had a fixed set of intermediate ops. Gatherers let you
// write your own, the way Collector let you write your own terminal op.
var windows = Stream.of(1,2,3,4,5)
    .gather(Gatherers.windowSliding(2))
    .toList();                                  // [1,2], [2,3], [3,4], [4,5]

var fixed = Stream.of(1,2,3,4,5)
    .gather(Gatherers.windowFixed(2))
    .toList();                                  // [1,2], [3,4], [5]

// Running totals — previously awkward with streams
var runningTotals = Stream.of(1,2,3,4)
    .gather(Gatherers.scan(() -> 0, Integer::sum))
    .toList();                                  // 1, 3, 6, 10` },
        { k: 'code', lang: 'java', cap: 'Unnamed variables and patterns (22)', src: `// Underscore for things you must declare but never use.
try {
    process();
} catch (NumberFormatException _) {          // do not need the exception
    return fallback();
}

for (var _ : items) { count++; }             // do not need the element

// In record patterns — ignore components you do not care about
if (obj instanceof Point(int x, _)) {        // only want x
    System.out.println(x);
}` },
        { k: 'code', lang: 'java', cap: 'Compact source files & instance main methods (25)', src: `// A complete, runnable Java program in Java 25. No class declaration,
// no static, no String[] args, no System.out import.
void main() {
    IO.println("Hello");
}

// Run it directly:  java hello.java
// This exists to make the first day of Java far less intimidating —
// you no longer have to explain 'public static void main(String[] args)'
// before anyone can print a line.` },
        { k: 'table', title: 'The rest, briefly', head: ['Version', 'Notable'], rows: [
          ['22', 'Statements before `super(...)`; Foreign Function & Memory API final (a real replacement for JNI)'],
          ['23', 'Markdown in Javadoc; generational ZGC by default'],
          ['24', 'Stream gatherers final; Class-File API; quantum-resistant crypto algorithms'],
          ['25 (LTS)', 'Compact source files, module import declarations, scoped values, flexible constructor bodies'],
        ]},
        { k: 'note', tone: 'tip', title: 'How to handle "do you know the latest Java?"', body: 'Nobody expects production use of anything past the current LTS. The right answer shows awareness without over-claiming: *"We\'re on 17. I follow the release notes — 21 brought virtual threads and record patterns, which I\'ve used on a side project, and 25 is the new LTS. I haven\'t used gatherers in anger yet."* Honest, current, and specific.' },
      ],
    },
    {
      id: 'jv-migration',
      name: 'Upgrading Java versions — what actually breaks',
      week: 9, mins: 100,
      summary: 'A genuinely common interview question, and a genuinely common piece of real work.',
      blocks: [
        { k: 'p', body: [
          '"We\'re on Java 8 and want to move to 17 — how would you approach it?" is asked often, because it is real work that a lot of teams have in front of them. The language features are the easy part; the breakage is elsewhere.',
        ]},
        { k: 'table', title: 'What breaks, and why', head: ['Problem', 'Cause', 'Fix'], rows: [
          ['`ClassNotFoundException: javax.xml.bind.*`', 'Java EE modules removed in Java 11', 'Add `jakarta.xml.bind` as an explicit dependency'],
          ['`InaccessibleObjectException`', 'Strong encapsulation of JDK internals from 16', 'Upgrade the library; `--add-opens` as a stopgap'],
          ['Reflection / bytecode libraries fail', 'Old ASM, cglib, Lombok, Mockito predate the class file version', 'Upgrade them first — before anything else'],
          ['`Unsupported class file major version`', 'A tool compiled for an older JDK', 'Upgrade Gradle/Maven and their plugins'],
          ['GC behaviour changes', 'G1 became the default in 9; CMS removed in 14', 'Re-tune, and re-baseline your latency metrics'],
          ['`String.format` / locale differences', 'CLDR locale data became the default in 9', 'Pin the locale explicitly where output is parsed'],
        ]},
        { k: 'list', ordered: true, title: 'The order to do it in', items: [
          '**Upgrade dependencies first, while still on the old JDK.** Most breakage is libraries, not your code. Doing this separately keeps the change sets small and the blame obvious.',
          '**Compile with the new JDK but target the old one** (`--release 11`). This catches compilation issues without changing runtime behaviour yet.',
          '**Run the test suite on the new JDK** with the old target. Now you are testing runtime behaviour.',
          '**Bump the target.** Only now do you actually run as Java 17.',
          '**Re-baseline performance.** GC defaults changed; do not assume your latency profile survived.',
          '**Then, and only then, adopt new language features.** Records and switch expressions are a separate, low-risk refactor — do not mix them into the upgrade commit.',
        ]},
        { k: 'note', tone: 'tip', title: 'The answer that shows seniority', body: 'The naive answer is "change the version in the pom and fix the errors". The senior answer is the sequence above, plus one sentence on risk: *"I\'d do it incrementally with the test suite as the safety net, keep dependency upgrades in separate commits from the JDK bump so a regression is attributable, and treat the performance re-baseline as part of the work rather than a surprise afterwards."*' },
      ],
    },
  ],
}
