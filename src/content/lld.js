export const lld = {
  id: 'lld',
  name: 'Low-Level Design',
  icon: '◱',
  blurb: 'Your strongest round. SOLID, the patterns that actually appear, and nine machine-coding problems worked through end to end.',
  weeks: 'Weeks 9–18 (weekends)',
  topics: [
    {
      id: 'lld-approach',
      name: 'How to attack a machine coding round',
      week: 9, mins: 100, tag: 'core',
      summary: 'Ninety minutes, a blank file. The sequence that keeps you out of trouble.',
      blocks: [
        { k: 'p', body: [
          'You get a loose problem statement — "design a parking lot" — and ninety minutes. What is graded is not cleverness. It is whether your class model is sensible, whether it extends without rewriting, and whether it runs.',
        ]},
        { k: 'list', ordered: true, title: 'The sequence — do not deviate', items: [
          '**Clarify for 5 minutes.** What is in scope? Multiple floors? Payments? Concurrency? Write the agreed scope down. Silently guessing is the most common way to fail this round.',
          '**Name the entities out loud.** Nouns in the problem statement are usually your classes: Vehicle, Slot, Ticket, Floor, Payment.',
          '**Define the enums first.** They are free, they clarify the domain instantly, and they take two minutes.',
          '**Write the interfaces for anything with more than one variant.** Pricing strategy, allocation strategy, payment method.',
          '**Write the core entity classes.** Fields, constructor, no logic yet.',
          '**Write the service/manager class** that orchestrates them. This is where the real logic lives.',
          '**Write a `main` that demonstrates the happy path.** Working code beats a beautiful half-finished model, every time.',
          '**Only then** add extras — concurrency, edge cases, extra features — narrating what you would do next if you had more time.',
        ]},
        { k: 'note', tone: 'warn', title: 'The three ways people fail this round', body: '**(1) Over-engineering.** Six design patterns and no working `main` at minute 85. **(2) Under-modelling.** One giant `ParkingLotService` with everything in it and no classes. **(3) Silence.** Building for 40 minutes without saying anything, so the interviewer cannot help and cannot follow your reasoning.' },
        { k: 'note', tone: 'tip', title: 'The sentence that buys you goodwill', body: 'Around minute 10: *"I\'m going to model the core flow end to end first and keep it running, then layer in pricing strategies and concurrency if there\'s time. Does that split match what you want to see?"* You have now agreed the scope, and anything you do not reach was a stated choice rather than a failure.' },
      ],
    },
    {
      id: 'lld-solid',
      name: 'SOLID',
      week: 9, mins: 130, tag: 'core',
      summary: 'Five principles. Checked against code you have actually written.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'S — Single Responsibility: one reason to change', src: `// BAD: this class changes when the DB changes, when the email template
// changes, AND when the discount rules change. Three reasons.
class OrderManager {
    void save(Order o)          { /* SQL */ }
    void sendConfirmation(Order o) { /* SMTP */ }
    BigDecimal calcDiscount(Order o) { /* rules */ }
}

// GOOD: each one has a single reason to change.
class OrderRepository   { void save(Order o) { } }
class OrderNotifier     { void sendConfirmation(Order o) { } }
class DiscountCalculator{ BigDecimal calculate(Order o) { return null; } }` },
        { k: 'code', lang: 'java', cap: 'O — Open/Closed: extend without editing', src: `// BAD: every new payment method means editing this method again.
class PaymentProcessor {
    void pay(String type, BigDecimal amt) {
        if (type.equals("CARD"))      { }
        else if (type.equals("UPI"))  { }
        else if (type.equals("WALLET")) { }   // and again, and again...
    }
}

// GOOD: a new method is a new class. Nothing existing is touched.
interface PaymentMethod { void pay(BigDecimal amount); }

class CardPayment   implements PaymentMethod { public void pay(BigDecimal a) { } }
class UpiPayment    implements PaymentMethod { public void pay(BigDecimal a) { } }

class PaymentProcessorGood {
    private final Map<PaymentType, PaymentMethod> methods;
    void pay(PaymentType type, BigDecimal amount) {
        methods.get(type).pay(amount);
    }
}` },
        { k: 'code', lang: 'java', cap: 'L — Liskov: a subtype must be usable as its parent', src: `// BAD: the classic violation. A Square IS-A Rectangle mathematically,
// but substituting one breaks code that sets width and height separately.
class Rectangle {
    protected int w, h;
    void setWidth(int w)  { this.w = w; }
    void setHeight(int h) { this.h = h; }
    int area() { return w * h; }
}
class Square extends Rectangle {
    void setWidth(int w)  { this.w = w; this.h = w; }   // surprise!
    void setHeight(int h) { this.w = h; this.h = h; }
}
// r.setWidth(5); r.setHeight(4); assert r.area() == 20;  // FAILS for a Square

// GOOD: they are not substitutable, so do not relate them by inheritance.
interface Shape { int area(); }
class Rect   implements Shape { }
class Sq     implements Shape { }` },
        { k: 'code', lang: 'java', cap: 'I & D — Interface Segregation and Dependency Inversion', src: `// I — BAD: a fat interface forces empty implementations
interface Worker { void work(); void eat(); void sleep(); }
class Robot implements Worker {
    public void work()  { }
    public void eat()   { throw new UnsupportedOperationException(); }  // smell
    public void sleep() { throw new UnsupportedOperationException(); }
}
// GOOD: small focused interfaces, implemented as needed
interface Workable { void work(); }
interface Feedable { void eat(); }

// D — depend on abstractions, not concretions
class OrderServiceBad {
    private final MySqlOrderRepository repo = new MySqlOrderRepository();  // welded
}
class OrderServiceGood {
    private final OrderRepository repo;                    // an interface
    OrderServiceGood(OrderRepository repo) { this.repo = repo; }   // injected
}` },
        { k: 'note', tone: 'tip', title: 'How to use SOLID in the room', body: 'Do not recite the acronym. **Narrate it while designing:** "I\'ll extract pricing behind an interface so adding a new pricing rule doesn\'t mean touching this class" is Open/Closed applied, and it lands far better than the definition. Interviewers are checking whether the principles shape your decisions, not whether you memorised five sentences.' },
      ],
    },
    {
      id: 'lld-creational',
      name: 'Creational patterns',
      week: 10, mins: 140,
      summary: 'Factory, Builder, Singleton. Object creation, made flexible.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'Factory — pick the implementation at runtime', src: `interface NotificationSender { void send(String to, String body); }

class EmailSender implements NotificationSender { public void send(String t, String b) { } }
class SmsSender   implements NotificationSender { public void send(String t, String b) { } }
class PushSender  implements NotificationSender { public void send(String t, String b) { } }

// A registry-based factory: adding a channel means adding one map entry,
// never editing a switch statement.
class NotificationFactory {
    private final Map<Channel, NotificationSender> senders;

    NotificationFactory(List<NotificationSender> all) {
        this.senders = all.stream()
            .collect(Collectors.toMap(NotificationSender::channel, s -> s));
    }

    NotificationSender get(Channel channel) {
        NotificationSender s = senders.get(channel);
        if (s == null) throw new IllegalArgumentException("No sender: " + channel);
        return s;
    }
}
// In Spring, injecting List<NotificationSender> gives you every implementation
// automatically — this is the idiomatic factory in a Spring codebase.` },
        { k: 'code', lang: 'java', cap: 'Builder — many optional parameters', src: `// The problem it solves: a constructor with 8 parameters where 6 are optional,
// and callers cannot tell what new Pizza(true, false, true, false...) means.
class Pizza {
    private final Size size;              // required
    private final boolean cheese, mushrooms, olives;   // optional

    private Pizza(Builder b) {
        this.size = b.size;
        this.cheese = b.cheese;
        this.mushrooms = b.mushrooms;
        this.olives = b.olives;
    }

    static Builder builder(Size size) { return new Builder(size); }

    static class Builder {
        private final Size size;
        private boolean cheese, mushrooms, olives;

        Builder(Size size) { this.size = size; }

        Builder cheese()    { this.cheese = true; return this; }
        Builder mushrooms() { this.mushrooms = true; return this; }
        Builder olives()    { this.olives = true; return this; }

        Pizza build() {
            // validation belongs here — the object is never half-built
            return new Pizza(this);
        }
    }
}

Pizza p = Pizza.builder(Size.LARGE).cheese().olives().build();` },
        { k: 'code', lang: 'java', cap: 'Singleton — and why you probably should not', src: `// Thread-safe, lazy, serialisation-safe, reflection-safe: use an enum.
enum ConfigManager {
    INSTANCE;
    private final Map<String, String> config = new ConcurrentHashMap<>();
    public String get(String key) { return config.get(key); }
}

// The classic double-checked locking version — know it, expect to be asked.
class Singleton {
    private static volatile Singleton instance;    // volatile is REQUIRED
    private Singleton() { }

    static Singleton getInstance() {
        if (instance == null) {                     // no lock on the common path
            synchronized (Singleton.class) {
                if (instance == null) {             // check again inside the lock
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}` },
        { k: 'note', tone: 'warn', title: 'Why volatile is required there', body: '`instance = new Singleton()` is three steps: allocate memory, run the constructor, assign the reference. The JVM is allowed to reorder steps 2 and 3. Without `volatile`, another thread can see a non-null reference pointing at a half-constructed object. `volatile` forbids that reordering. This is a favourite follow-up and very few candidates can explain it.' },
        { k: 'note', tone: 'tip', title: 'The singleton opinion worth having', body: '*"In a Spring application I would not hand-roll a singleton at all — a `@Component` is already one per context, and it stays injectable and therefore testable. A static singleton is global mutable state, which makes tests order-dependent."* That answer is more valuable than a correct implementation.' },
      ],
    },
    {
      id: 'lld-behavioral',
      name: 'Behavioural patterns',
      week: 11, mins: 170, tag: 'core',
      summary: 'Strategy, Observer, State, Command, Template. These are the ones that actually appear.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'Strategy — swap an algorithm at runtime. The most useful pattern there is.', src: `interface PricingStrategy {
    BigDecimal price(Duration parked, VehicleType type);
}

class HourlyPricing implements PricingStrategy {
    public BigDecimal price(Duration d, VehicleType t) {
        long hours = Math.max(1, d.toHours());
        return t.getHourlyRate().multiply(BigDecimal.valueOf(hours));
    }
}

class FlatDayPricing implements PricingStrategy {
    public BigDecimal price(Duration d, VehicleType t) { return new BigDecimal("200"); }
}

class WeekendPricing implements PricingStrategy { /* ... */ }

// The context holds a strategy and delegates. Adding a pricing model
// never touches this class.
class ParkingCharger {
    private PricingStrategy strategy;
    void setStrategy(PricingStrategy s) { this.strategy = s; }
    BigDecimal charge(Ticket t) {
        return strategy.price(t.duration(), t.vehicleType());
    }
}` },
        { k: 'code', lang: 'java', cap: 'Observer — one event, many reactions', src: `interface OrderListener { void onOrderPlaced(Order order); }

class OrderPublisher {
    private final List<OrderListener> listeners = new CopyOnWriteArrayList<>();
                                            // ^ safe for concurrent iteration
    void subscribe(OrderListener l)   { listeners.add(l); }
    void unsubscribe(OrderListener l) { listeners.remove(l); }

    void publish(Order order) {
        for (OrderListener l : listeners) {
            try {
                l.onOrderPlaced(order);
            } catch (Exception e) {
                log.error("Listener failed, continuing", e);  // one bad listener
            }                                                  // must not break the rest
        }
    }
}

class EmailListener     implements OrderListener { public void onOrderPlaced(Order o) { } }
class InventoryListener implements OrderListener { public void onOrderPlaced(Order o) { } }
class AnalyticsListener implements OrderListener { public void onOrderPlaced(Order o) { } }` },
        { k: 'code', lang: 'java', cap: 'State — behaviour changes with the object\'s state', src: `// Instead of a switch on status scattered through the codebase,
// each state knows what transitions it allows.
interface OrderState {
    OrderState next(Order order);
    OrderState cancel(Order order);
    String name();
}

class PlacedState implements OrderState {
    public OrderState next(Order o)   { return new ShippedState(); }
    public OrderState cancel(Order o) { o.refund(); return new CancelledState(); }
    public String name() { return "PLACED"; }
}

class ShippedState implements OrderState {
    public OrderState next(Order o)   { return new DeliveredState(); }
    public OrderState cancel(Order o) {
        throw new IllegalStateException("Cannot cancel a shipped order");
    }
    public String name() { return "SHIPPED"; }
}

class DeliveredState implements OrderState {
    public OrderState next(Order o)   { return this; }
    public OrderState cancel(Order o) {
        throw new IllegalStateException("Already delivered");
    }
    public String name() { return "DELIVERED"; }
}` },
        { k: 'code', lang: 'java', cap: 'Command & Template Method', src: `// COMMAND: wrap an action as an object -> undo, queue, log, retry
interface Command { void execute(); void undo(); }

class AddTextCommand implements Command {
    private final Document doc; private final String text;
    AddTextCommand(Document d, String t) { this.doc = d; this.text = t; }
    public void execute() { doc.append(text); }
    public void undo()    { doc.removeLast(text.length()); }
}

class CommandHistory {
    private final Deque<Command> history = new ArrayDeque<>();
    void run(Command c) { c.execute(); history.push(c); }
    void undo()         { if (!history.isEmpty()) history.pop().undo(); }
}

// TEMPLATE METHOD: fixed skeleton, subclasses fill in the steps
abstract class DataImporter {
    // final: the ORDER is the contract and must not be overridden
    public final void importData(Path file) {
        var raw = read(file);
        var parsed = parse(raw);
        validate(parsed);
        persist(parsed);
    }
    protected abstract List<String> read(Path file);
    protected abstract List<Record> parse(List<String> raw);
    protected void validate(List<Record> records) { }   // optional hook
    protected abstract void persist(List<Record> records);
}` },
        { k: 'table', title: 'Which pattern, when', head: ['Problem', 'Pattern'], rows: [
          ['A long if/else or switch on a type', '**Strategy**'],
          ['One thing happens, several must react', '**Observer**'],
          ['An object behaves differently by status, with illegal transitions', '**State**'],
          ['Need undo, queueing, or retry of actions', '**Command**'],
          ['Same steps, different details per case', '**Template Method**'],
          ['Creating one of several implementations', '**Factory**'],
          ['Constructor has many optional parameters', '**Builder**'],
          ['Adding behaviour without subclassing', '**Decorator**'],
          ['Two incompatible interfaces must work together', '**Adapter**'],
        ]},
        { k: 'note', tone: 'warn', title: 'Do not lead with patterns', body: 'Saying "I\'ll use the Abstract Factory pattern" before you understand the problem is the single clearest sign of a candidate performing rather than designing. Reach for a pattern when the code shows the smell it solves — a growing switch statement, a constructor with nine parameters — and *name it as you apply it*.' },
      ],
    },
    {
      id: 'lld-structural',
      name: 'Structural patterns',
      week: 11, mins: 110,
      summary: 'Decorator, Adapter, Facade. Composing objects rather than inheriting.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'Decorator — wrap to add behaviour', src: `interface Coffee { BigDecimal cost(); String description(); }

class SimpleCoffee implements Coffee {
    public BigDecimal cost() { return new BigDecimal("100"); }
    public String description() { return "Coffee"; }
}

// A decorator IMPLEMENTS the interface and HOLDS one
abstract class CoffeeDecorator implements Coffee {
    protected final Coffee inner;
    CoffeeDecorator(Coffee inner) { this.inner = inner; }
}

class WithMilk extends CoffeeDecorator {
    WithMilk(Coffee c) { super(c); }
    public BigDecimal cost() { return inner.cost().add(new BigDecimal("20")); }
    public String description() { return inner.description() + " + milk"; }
}

class WithSyrup extends CoffeeDecorator {
    WithSyrup(Coffee c) { super(c); }
    public BigDecimal cost() { return inner.cost().add(new BigDecimal("30")); }
    public String description() { return inner.description() + " + syrup"; }
}

Coffee order = new WithSyrup(new WithMilk(new SimpleCoffee()));   // 150
// Inheritance would need MilkCoffee, SyrupCoffee, MilkSyrupCoffee...
// n options = 2^n classes. Decorators compose linearly instead.

// You use this every day: new BufferedReader(new FileReader(f))` },
        { k: 'code', lang: 'java', cap: 'Adapter & Facade', src: `// ADAPTER: make a third-party interface fit yours
interface PaymentGateway { PaymentResult charge(BigDecimal amount, String token); }

class StripeAdapter implements PaymentGateway {
    private final StripeClient stripe;        // their API, their shapes

    public PaymentResult charge(BigDecimal amount, String token) {
        StripeCharge c = stripe.createCharge(
            amount.multiply(BigDecimal.valueOf(100)).intValue(),   // they want paise
            "inr", token);
        return new PaymentResult(c.getId(), c.getStatus().equals("succeeded"));
    }
}
// Swapping Stripe for Razorpay is now one new adapter class.

// FACADE: one simple entry point over a complicated subsystem
class OrderFacade {
    private final InventoryService inventory;
    private final PaymentGateway payment;
    private final ShippingService shipping;
    private final NotificationService notifier;

    public OrderResult placeOrder(OrderRequest req) {
        inventory.reserve(req.items());
        var result = payment.charge(req.total(), req.token());
        if (!result.success()) {
            inventory.release(req.items());
            return OrderResult.failed(result.message());
        }
        shipping.schedule(req);
        notifier.confirm(req.customerEmail());
        return OrderResult.success();
    }
}` },
      ],
    },
    {
      id: 'mc-parking-lot',
      name: 'Machine coding — Parking Lot',
      week: 12, mins: 180, tag: 'core',
      summary: 'The most-asked machine coding problem. Do this one first.',
      blocks: [
        { k: 'list', title: 'Clarify first (say these out loud)', items: [
          'Multiple floors? Multiple entry/exit gates?',
          'Vehicle types and matching slot sizes?',
          'Pricing — hourly, flat, per type?',
          'Do we handle payments, or just issue a ticket?',
          'Concurrency — several gates allocating at once?',
        ]},
        { k: 'code', lang: 'java', cap: 'Enums and entities first', src: `enum VehicleType { MOTORCYCLE, CAR, TRUCK }
enum SlotType    { SMALL, MEDIUM, LARGE;
    static SlotType fits(VehicleType v) {
        return switch (v) {
            case MOTORCYCLE -> SMALL;
            case CAR        -> MEDIUM;
            case TRUCK      -> LARGE;
        };
    }
}
enum TicketStatus { ACTIVE, PAID }

record Vehicle(String registration, VehicleType type) { }

class ParkingSlot {
    private final String id;
    private final SlotType type;
    private final int floor;
    private Vehicle occupant;             // null == free

    boolean isFree()          { return occupant == null; }
    boolean canFit(Vehicle v) { return isFree() && type == SlotType.fits(v.type()); }
    void assign(Vehicle v)    { this.occupant = v; }
    void release()            { this.occupant = null; }
}

class Ticket {
    private final String id;
    private final Vehicle vehicle;
    private final ParkingSlot slot;
    private final Instant entryTime;
    private Instant exitTime;
    private BigDecimal amount;
    private TicketStatus status = TicketStatus.ACTIVE;

    Duration duration() {
        return Duration.between(entryTime, exitTime != null ? exitTime : Instant.now());
    }
}` },
        { k: 'code', lang: 'java', cap: 'Strategies — this is where the marks are', src: `// Slot allocation is a STRATEGY: nearest, cheapest, random...
interface SlotAllocationStrategy {
    Optional<ParkingSlot> allocate(List<ParkingSlot> slots, Vehicle vehicle);
}

class NearestSlotStrategy implements SlotAllocationStrategy {
    public Optional<ParkingSlot> allocate(List<ParkingSlot> slots, Vehicle v) {
        return slots.stream().filter(s -> s.canFit(v)).findFirst();
    }
}

// Pricing is a STRATEGY too
interface PricingStrategy { BigDecimal calculate(Ticket t); }

class HourlyPricing implements PricingStrategy {
    private final Map<VehicleType, BigDecimal> rates;
    public BigDecimal calculate(Ticket t) {
        long hours = Math.max(1, (long) Math.ceil(t.duration().toMinutes() / 60.0));
        return rates.get(t.vehicle().type()).multiply(BigDecimal.valueOf(hours));
    }
}` },
        { k: 'code', lang: 'java', cap: 'The service — with the concurrency point made explicit', src: `class ParkingLotService {
    private final List<ParkingSlot> slots;
    private final Map<String, Ticket> activeTickets = new ConcurrentHashMap<>();
    private final SlotAllocationStrategy allocator;
    private final PricingStrategy pricing;

    // synchronized: two gates must not be handed the same slot.
    // In a real system this would be a per-floor lock or an atomic DB update
    // rather than a lock over the whole lot — say that out loud.
    public synchronized Ticket park(Vehicle vehicle) {
        ParkingSlot slot = allocator.allocate(slots, vehicle)
            .orElseThrow(() -> new NoSlotAvailableException(vehicle.type()));

        slot.assign(vehicle);
        Ticket ticket = new Ticket(UUID.randomUUID().toString(), vehicle, slot, Instant.now());
        activeTickets.put(ticket.getId(), ticket);
        return ticket;
    }

    public BigDecimal exit(String ticketId) {
        Ticket ticket = activeTickets.remove(ticketId);
        if (ticket == null) throw new InvalidTicketException(ticketId);

        ticket.setExitTime(Instant.now());
        BigDecimal amount = pricing.calculate(ticket);
        ticket.setAmount(amount);
        ticket.getSlot().release();
        return amount;
    }
}` },
        { k: 'note', tone: 'tip', title: 'What earns the marks here', body: 'Two strategy interfaces (allocation and pricing), an explicit note about the concurrency boundary, and a `main` that parks two cars and charges one on exit. If you get that far in 90 minutes with clean names, you have passed. Everything beyond it — multiple gates, reservations, a display board — is bonus you narrate rather than build.' },
      ],
    },
    {
      id: 'mc-splitwise',
      name: 'Machine coding — Splitwise',
      week: 13, mins: 180,
      summary: 'Expense splitting and debt simplification. Tests modelling more than algorithms.',
      blocks: [
        { k: 'list', title: 'Clarify first', items: [
          'Split types — equal, exact amounts, percentages, shares?',
          'Groups, or just individuals?',
          'Do we need debt simplification (minimise the number of transfers)?',
          'Settlements — partial payments allowed?',
        ]},
        { k: 'code', lang: 'java', cap: 'The split hierarchy — Strategy again', src: `enum SplitType { EQUAL, EXACT, PERCENTAGE }

record User(String id, String name, String email) { }

// A split is one person's share of one expense
record Split(User user, BigDecimal amount) { }

interface SplitStrategy {
    List<Split> split(BigDecimal total, List<User> participants, List<BigDecimal> values);
}

class EqualSplit implements SplitStrategy {
    public List<Split> split(BigDecimal total, List<User> users, List<BigDecimal> ignored) {
        BigDecimal each = total.divide(BigDecimal.valueOf(users.size()), 2, RoundingMode.HALF_UP);
        List<Split> splits = new ArrayList<>();
        BigDecimal running = BigDecimal.ZERO;

        for (int i = 0; i < users.size(); i++) {
            // give the rounding remainder to the last person, so the
            // splits always sum exactly to the total
            BigDecimal amt = (i == users.size() - 1) ? total.subtract(running) : each;
            splits.add(new Split(users.get(i), amt));
            running = running.add(amt);
        }
        return splits;
    }
}

class PercentageSplit implements SplitStrategy {
    public List<Split> split(BigDecimal total, List<User> users, List<BigDecimal> pcts) {
        if (pcts.stream().reduce(BigDecimal.ZERO, BigDecimal::add)
                .compareTo(BigDecimal.valueOf(100)) != 0) {
            throw new IllegalArgumentException("Percentages must total 100");
        }
        List<Split> out = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            out.add(new Split(users.get(i),
                total.multiply(pcts.get(i)).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)));
        }
        return out;
    }
}` },
        { k: 'code', lang: 'java', cap: 'The balance sheet — the core data structure', src: `class BalanceSheet {
    // who owes whom:  balances.get(A).get(B) = amount A owes B
    private final Map<String, Map<String, BigDecimal>> balances = new HashMap<>();

    void addExpense(Expense expense) {
        String payerId = expense.paidBy().id();

        for (Split split : expense.splits()) {
            String owerId = split.user().id();
            if (owerId.equals(payerId)) continue;      // you do not owe yourself

            // ower owes payer
            adjust(owerId, payerId, split.amount());
            // and symmetrically, payer is owed by ower
            adjust(payerId, owerId, split.amount().negate());
        }
    }

    private void adjust(String from, String to, BigDecimal delta) {
        balances.computeIfAbsent(from, k -> new HashMap<>())
                .merge(to, delta, BigDecimal::add);
    }

    // Net position of one user across everyone
    Map<String, BigDecimal> balancesFor(String userId) {
        return balances.getOrDefault(userId, Map.of()).entrySet().stream()
            .filter(e -> e.getValue().signum() != 0)
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}` },
        { k: 'code', lang: 'java', cap: 'Debt simplification — the bonus that impresses', src: `// Minimise the NUMBER of transfers. Greedy: repeatedly match the person
// owed the most with the person owing the most.
List<Transfer> simplify(Map<String, BigDecimal> netBalances) {
    PriorityQueue<Map.Entry<String, BigDecimal>> creditors =
        new PriorityQueue<>((a, b) -> b.getValue().compareTo(a.getValue()));
    PriorityQueue<Map.Entry<String, BigDecimal>> debtors =
        new PriorityQueue<>(Map.Entry.comparingByValue());

    netBalances.forEach((user, net) -> {
        if (net.signum() > 0) creditors.add(Map.entry(user, net));
        if (net.signum() < 0) debtors.add(Map.entry(user, net));
    });

    List<Transfer> transfers = new ArrayList<>();
    while (!creditors.isEmpty() && !debtors.isEmpty()) {
        var creditor = creditors.poll();
        var debtor   = debtors.poll();

        BigDecimal amount = creditor.getValue().min(debtor.getValue().abs());
        transfers.add(new Transfer(debtor.getKey(), creditor.getKey(), amount));

        BigDecimal creditLeft = creditor.getValue().subtract(amount);
        BigDecimal debtLeft   = debtor.getValue().add(amount);

        if (creditLeft.signum() > 0) creditors.add(Map.entry(creditor.getKey(), creditLeft));
        if (debtLeft.signum()   < 0) debtors.add(Map.entry(debtor.getKey(), debtLeft));
    }
    return transfers;
}` },
        { k: 'note', tone: 'warn', title: 'Use BigDecimal, never double', body: '`0.1 + 0.2 == 0.30000000000000004` in floating point. Money in a `double` is a bug waiting to be found by an accountant. Use `BigDecimal` with an explicit `RoundingMode`, and handle the rounding remainder so splits sum exactly. Reaching for BigDecimal unprompted is a small, very reliable signal in any financial-domain interview.' },
      ],
    },
    {
      id: 'mc-lru-cache',
      name: 'Machine coding — LRU Cache',
      week: 11, mins: 140, tag: 'core',
      summary: 'HashMap plus doubly linked list. Asked in both DSA and LLD rounds.',
      blocks: [
        { k: 'p', body: [
          'A cache with a capacity. When it is full, evict the **least recently used** entry. Both `get` and `put` must be O(1).',
          'The insight: a HashMap gives O(1) lookup but no ordering. A doubly linked list gives O(1) removal from anywhere *if you already hold the node*. Combine them — the map stores key → node, the list maintains recency order.',
        ]},
        { k: 'analogy', body: 'A desk with room for five files. Every time you use one it goes back on top of the pile. When a sixth arrives, the one at the bottom — untouched longest — goes in the drawer. The map is your memory of which pile position each file is in, so you never have to search the pile.' },
        { k: 'code', lang: 'java', cap: 'The full implementation', src: `class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0);   // dummy: most recent side
    private final Node tail = new Node(0, 0);   // dummy: least recent side

    private static class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;      // dummies remove every null check
        tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) return -1;
        moveToFront(node);            // touching it makes it most-recent
        return node.value;
    }

    public void put(int key, int value) {
        Node existing = map.get(key);
        if (existing != null) {
            existing.value = value;
            moveToFront(existing);
            return;
        }
        if (map.size() == capacity) {
            Node lru = tail.prev;      // the node just before the tail dummy
            remove(lru);
            map.remove(lru.key);
        }
        Node fresh = new Node(key, value);
        map.put(key, fresh);
        addFirst(fresh);
    }

    private void remove(Node n) {
        n.prev.next = n.next;
        n.next.prev = n.prev;
    }
    private void addFirst(Node n) {
        n.next = head.next;
        n.prev = head;
        head.next.prev = n;
        head.next = n;
    }
    private void moveToFront(Node n) { remove(n); addFirst(n); }
}` },
        { k: 'cx', time: 'O(1)', space: 'O(capacity)', why: 'Map lookup is O(1); list removal and insertion are O(1) because we always hold the node reference. Space is bounded by the capacity.' },
        { k: 'note', tone: 'tip', title: 'The two things to mention', body: '**(1)** The dummy head and tail nodes — they eliminate every null check and are why the code has no edge cases. **(2)** `LinkedHashMap` with `accessOrder=true` and an overridden `removeEldestEntry` does all of this in five lines. Write the manual version (that is what is being tested), then say the library version exists. Knowing both is the complete answer.' },
        { k: 'code', lang: 'java', cap: 'The five-line version, for completeness', src: `class LRUCacheSimple<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    LRUCacheSimple(int capacity) {
        super(capacity, 0.75f, true);      // true = ACCESS order, not insertion
        this.capacity = capacity;
    }
    @Override protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}` },
      ],
    },
    {
      id: 'mc-rate-limiter',
      name: 'Machine coding — Rate Limiter',
      week: 15, mins: 160, tag: 'core',
      summary: 'Four algorithms, and knowing which one to pick. Also a system design favourite.',
      blocks: [
        { k: 'table', title: 'The four algorithms', head: ['Algorithm', 'How', 'Trade-off'], rows: [
          ['Fixed window', 'Count per clock window', 'Simple; allows 2× burst at the boundary'],
          ['Sliding window log', 'Store every request timestamp', 'Exact; memory grows with traffic'],
          ['Sliding window counter', 'Weighted blend of two windows', 'Good accuracy, low memory. **Usual choice.**'],
          ['**Token bucket**', 'Tokens refill at a steady rate', 'Allows controlled bursts. **Most common in practice.**'],
        ]},
        { k: 'analogy', body: 'Token bucket is a bucket that refills with tokens at a fixed rate and holds at most N. Every request spends one. If the bucket is empty you are rejected. Because tokens accumulate while you are idle, a user who has been quiet can briefly burst — which is usually exactly the behaviour you want, and is why it beats a hard fixed window.' },
        { k: 'code', lang: 'java', cap: 'Token bucket', src: `class TokenBucket {
    private final long capacity;
    private final double refillPerSecond;
    private double tokens;
    private long lastRefillNanos;

    TokenBucket(long capacity, double refillPerSecond) {
        this.capacity = capacity;
        this.refillPerSecond = refillPerSecond;
        this.tokens = capacity;                    // start full
        this.lastRefillNanos = System.nanoTime();
    }

    synchronized boolean tryConsume() {
        refill();
        if (tokens >= 1) { tokens -= 1; return true; }
        return false;
    }

    // Lazy refill: no background thread. Compute what WOULD have accrued.
    private void refill() {
        long now = System.nanoTime();
        double elapsedSeconds = (now - lastRefillNanos) / 1_000_000_000.0;
        tokens = Math.min(capacity, tokens + elapsedSeconds * refillPerSecond);
        lastRefillNanos = now;
    }
}` },
        { k: 'code', lang: 'java', cap: 'Sliding window log, and the per-user manager', src: `class SlidingWindowLog {
    private final int limit;
    private final long windowMillis;
    private final Deque<Long> timestamps = new ArrayDeque<>();

    synchronized boolean allow() {
        long now = System.currentTimeMillis();
        // drop everything that has fallen out of the window
        while (!timestamps.isEmpty() && timestamps.peekFirst() <= now - windowMillis) {
            timestamps.pollFirst();
        }
        if (timestamps.size() < limit) {
            timestamps.offerLast(now);
            return true;
        }
        return false;
    }
}

// Per-user limiting
class RateLimiterService {
    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();
    private final long capacity; private final double refillRate;

    boolean allow(String userId) {
        return buckets
            .computeIfAbsent(userId, k -> new TokenBucket(capacity, refillRate))
            .tryConsume();
    }
}` },
        { k: 'note', tone: 'warn', title: 'The distributed follow-up', body: 'This works on one server. With ten servers each allowing 100/min, a user gets 1000/min. The fix is shared state in **Redis** — `INCR` with an `EXPIRE`, or a Lua script so the check-and-increment is atomic. The trade-off is a network hop on every request, which some systems solve by giving each node a local share of the budget. Expect this follow-up every single time you present a rate limiter.' },
        { k: 'note', tone: 'tip', title: 'The response, not just the decision', body: 'A rate limiter should return **429 Too Many Requests** with a `Retry-After` header, and ideally `X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset`. Mentioning the response contract shows you have built one rather than only read about one.' },
      ],
    },
    {
      id: 'mc-elevator',
      name: 'Machine coding — Elevator system',
      week: 18, mins: 170,
      summary: 'State machines and scheduling. Tests modelling under genuine ambiguity.',
      blocks: [
        { k: 'list', title: 'Clarify first', items: [
          'How many lifts, how many floors?',
          'Internal requests (a button inside the lift) vs external (a call from a floor)?',
          'Scheduling policy — nearest lift, or same-direction preference?',
          'Do we simulate time, or just decide assignments?',
        ]},
        { k: 'code', lang: 'java', cap: 'Model the states and requests', src: `enum Direction { UP, DOWN, IDLE }
enum DoorState { OPEN, CLOSED }

// External: "I am on floor 5 and want to go UP"
record ExternalRequest(int floor, Direction direction) { }
// Internal: "take me to floor 12"
record InternalRequest(int targetFloor) { }

class Elevator {
    private final int id;
    private int currentFloor = 0;
    private Direction direction = Direction.IDLE;
    private DoorState door = DoorState.CLOSED;

    // Two sorted sets: floors above, floors below. This is the key modelling
    // choice — it makes "keep going in the same direction" natural.
    private final TreeSet<Integer> upStops   = new TreeSet<>();
    private final TreeSet<Integer> downStops = new TreeSet<>(Comparator.reverseOrder());

    void addStop(int floor) {
        if (floor > currentFloor)      upStops.add(floor);
        else if (floor < currentFloor) downStops.add(floor);
        else                            openDoor();
    }

    void step() {
        Integer next = nextStop();
        if (next == null) { direction = Direction.IDLE; return; }

        if (next > currentFloor)      { currentFloor++; direction = Direction.UP; }
        else if (next < currentFloor) { currentFloor--; direction = Direction.DOWN; }

        if (currentFloor == next) {
            upStops.remove(currentFloor);
            downStops.remove(currentFloor);
            openDoor();
        }
    }

    // Keep going the way we are pointed until that side is exhausted (LOOK algorithm)
    private Integer nextStop() {
        if (direction == Direction.UP)   return !upStops.isEmpty() ? upStops.first()
                                                : (!downStops.isEmpty() ? downStops.first() : null);
        if (direction == Direction.DOWN) return !downStops.isEmpty() ? downStops.first()
                                                : (!upStops.isEmpty() ? upStops.first() : null);
        if (!upStops.isEmpty())   return upStops.first();
        if (!downStops.isEmpty()) return downStops.first();
        return null;
    }
    int distanceTo(int floor) { return Math.abs(currentFloor - floor); }
}` },
        { k: 'code', lang: 'java', cap: 'The scheduler — Strategy again', src: `interface ElevatorSelectionStrategy {
    Elevator select(List<Elevator> lifts, ExternalRequest request);
}

class NearestElevatorStrategy implements ElevatorSelectionStrategy {
    public Elevator select(List<Elevator> lifts, ExternalRequest r) {
        return lifts.stream()
            // prefer an idle lift, or one already heading the right way
            .filter(e -> e.getDirection() == Direction.IDLE
                      || e.getDirection() == r.direction())
            .min(Comparator.comparingInt(e -> e.distanceTo(r.floor())))
            .orElseGet(() -> lifts.stream()
                .min(Comparator.comparingInt(e -> e.distanceTo(r.floor())))
                .orElseThrow());
    }
}

class ElevatorController {
    private final List<Elevator> lifts;
    private final ElevatorSelectionStrategy strategy;

    void handleExternal(ExternalRequest r) { strategy.select(lifts, r).addStop(r.floor()); }
    void tick() { lifts.forEach(Elevator::step); }
}` },
        { k: 'note', tone: 'tip', title: 'The modelling decision that carries this problem', body: 'Two `TreeSet`s (up stops ascending, down stops descending) instead of one queue. It makes "continue in the current direction, then reverse" fall out naturally, which is how real lifts work (the LOOK algorithm). Explaining *why* you chose that structure is worth more than the rest of the code.' },
      ],
    },
    {
      id: 'mc-others',
      name: 'Machine coding — four more, sketched',
      week: 16, mins: 200,
      summary: 'Logger, notification service, tic-tac-toe, vending machine. The models, not full code.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'Logging framework — Chain of Responsibility', src: `enum LogLevel { DEBUG, INFO, WARN, ERROR }

interface LogAppender { void append(LogLevel level, String message); }

class ConsoleAppender implements LogAppender { public void append(LogLevel l, String m) { } }
class FileAppender    implements LogAppender { public void append(LogLevel l, String m) { } }

class Logger {
    private final LogLevel threshold;
    private final List<LogAppender> appenders;

    void log(LogLevel level, String message) {
        if (level.ordinal() < threshold.ordinal()) return;   // below threshold: drop
        for (LogAppender a : appenders) a.append(level, message);
    }
    void info(String m)  { log(LogLevel.INFO, m); }
    void error(String m) { log(LogLevel.ERROR, m); }
}
// Extensions to mention: async appender with a BlockingQueue, log rotation,
// structured (JSON) formatting, per-package thresholds.` },
        { k: 'code', lang: 'java', cap: 'Notification service — Strategy + Observer + Template', src: `enum Channel { EMAIL, SMS, PUSH }

interface NotificationChannel {
    Channel channel();
    void send(User user, String subject, String body);
}

// Template Method: the retry/logging skeleton is shared, the send differs
abstract class BaseChannel implements NotificationChannel {
    public final void send(User user, String subject, String body) {
        for (int attempt = 1; attempt <= 3; attempt++) {
            try { doSend(user, subject, body); return; }
            catch (TransientException e) { backoff(attempt); }
        }
        deadLetter(user, subject, body);
    }
    protected abstract void doSend(User u, String subject, String body);
}

class NotificationService {
    private final Map<Channel, NotificationChannel> channels;
    private final UserPreferenceRepository preferences;

    void notify(User user, NotificationType type, String subject, String body) {
        for (Channel c : preferences.channelsFor(user, type)) {   // respect opt-outs
            channels.get(c).send(user, subject, body);
        }
    }
}` },
        { k: 'code', lang: 'java', cap: 'Tic-tac-toe / board games — the winner check is the interesting bit', src: `class Board {
    private final char[][] grid;
    private final int size;
    // O(1) win check: keep running counts instead of scanning the board
    private final int[] rowCount, colCount;
    private int diagCount, antiDiagCount;

    // player is +1 or -1; a count reaching ±size means that player won
    boolean place(int r, int c, int player) {
        grid[r][c] = player == 1 ? 'X' : 'O';
        rowCount[r] += player;
        colCount[c] += player;
        if (r == c)            diagCount += player;
        if (r + c == size - 1) antiDiagCount += player;

        return Math.abs(rowCount[r]) == size || Math.abs(colCount[c]) == size
            || Math.abs(diagCount)   == size || Math.abs(antiDiagCount) == size;
    }
}` },
        { k: 'code', lang: 'java', cap: 'Vending machine — the State pattern, textbook case', src: `interface VendingState {
    void insertCoin(VendingMachine m, Coin c);
    void selectItem(VendingMachine m, String code);
    void dispense(VendingMachine m);
}

class IdleState implements VendingState {
    public void insertCoin(VendingMachine m, Coin c) {
        m.addBalance(c.value());
        m.setState(new HasMoneyState());
    }
    public void selectItem(VendingMachine m, String code) {
        throw new IllegalStateException("Insert money first");
    }
    public void dispense(VendingMachine m) {
        throw new IllegalStateException("Nothing selected");
    }
}
// HasMoneyState -> ItemSelectedState -> DispensingState -> back to Idle.
// Every illegal transition throws from the state that owns it, rather than
// from a giant switch somewhere else.` },
        { k: 'note', tone: 'tip', title: 'The pattern across all of these', body: 'Notice how few patterns actually recur: **Strategy** for anything with interchangeable rules, **State** for anything with a lifecycle and illegal transitions, **Observer** for fan-out, **Factory** for choosing an implementation, **Template Method** for a shared skeleton. Five patterns cover essentially every machine coding problem you will be given.' },
      ],
    },
  ],
}
