export const spring = {
  id: 'spring',
  name: 'Spring Boot Internals',
  icon: '🍃',
  blurb: 'Beyond CRUD. What the annotations actually do, why @Transactional silently fails, and where Hibernate destroys your performance.',
  weeks: 'Weeks 10–17 (evenings)',
  topics: [
    {
      id: 'spring-ioc-di',
      name: 'IoC & dependency injection',
      week: 10, mins: 140, tag: 'core',
      summary: 'The idea the entire framework is built on.',
      blocks: [
        { k: 'p', body: [
          '**Inversion of Control**: instead of your class creating what it needs, something else creates it and hands it over. **Dependency injection** is how Spring does that — the container builds every object, works out what each one requires, and wires them together.',
          'The reason it exists is testing and swapping. If `OrderService` calls `new StripeGateway()` inside itself, you can never test it without hitting Stripe. If the gateway is injected, you pass a fake.',
        ]},
        { k: 'analogy', body: 'A restaurant kitchen. The chef does not go and buy the fish — a supplier delivers it. The chef declares "I need fish, flour and eggs" and someone else satisfies that. Change supplier and the chef\'s recipe does not change at all. That decoupling is the whole point; the chef is your service class and Spring is the supplier.' },
        { k: 'code', lang: 'java', cap: 'Constructor injection — the only kind you should use', src: `@Service
public class OrderService {

    private final PaymentGateway gateway;
    private final OrderRepository repository;

    // No @Autowired needed since Spring 4.3 for a single constructor
    public OrderService(PaymentGateway gateway, OrderRepository repository) {
        this.gateway = gateway;
        this.repository = repository;
    }
}

// DO NOT do this — field injection
@Service
public class BadService {
    @Autowired private PaymentGateway gateway;   // cannot be final
                                                  // cannot construct in a unit test
                                                  // hides that the class has 8 deps
}` },
        { k: 'table', title: 'The stereotype annotations', head: ['Annotation', 'Means', 'Extra behaviour'], rows: [
          ['`@Component`', 'A generic Spring-managed bean', 'None'],
          ['`@Service`', 'Business logic', 'None — purely semantic'],
          ['`@Repository`', 'Data access', 'Translates DB exceptions to Spring\'s hierarchy'],
          ['`@Controller` / `@RestController`', 'Web layer', 'Request mapping; RestController adds `@ResponseBody`'],
          ['`@Configuration` + `@Bean`', 'Manual bean definitions', 'For third-party classes you cannot annotate'],
        ]},
        { k: 'note', tone: 'tip', title: 'Why constructor injection, in one sentence', body: '*"Constructor injection lets the fields be final, makes the dependencies explicit and impossible to forget, allows the class to be constructed in a plain unit test without Spring, and fails fast at startup on a circular dependency instead of at runtime."* That answer covers the whole question.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'What happens on a circular dependency?', a: 'With constructor injection Spring cannot build either bean and fails at startup with `BeanCurrentlyInCreationException` — which is the *good* outcome, because it surfaces a design problem immediately. With field or setter injection Spring can sometimes resolve it by injecting a half-built proxy, hiding the problem until something breaks oddly at runtime. The real fix is almost always to extract the shared logic into a third bean.' },
          { q: 'What are bean scopes?', a: '`singleton` (default) — one instance for the whole context. `prototype` — a new instance every time it is requested. `request`, `session`, `application` — web scopes. The important consequence of singleton being the default is that **your service beans must be stateless**: any mutable instance field is shared across every concurrent request.' },
        ]},
      ],
    },
    {
      id: 'spring-bean-lifecycle',
      name: 'Bean lifecycle & configuration',
      week: 10, mins: 120,
      summary: 'What happens between startup and your first request.',
      blocks: [
        { k: 'list', ordered: true, title: 'The lifecycle', items: [
          'Spring scans for classes with stereotype annotations and reads `@Bean` methods',
          'Bean definitions are registered (not yet instantiated)',
          '`BeanFactoryPostProcessor`s run — this is where `@Value` placeholders get resolved',
          'The bean is instantiated (constructor runs, constructor deps injected)',
          'Field and setter dependencies are injected',
          '`@PostConstruct` runs — safe to use dependencies here, unlike the constructor',
          'The bean is proxied if needed (`@Transactional`, `@Async`, `@Cacheable`)',
          'Application is ready. `ApplicationReadyEvent` fires.',
          'On shutdown: `@PreDestroy` runs',
        ]},
        { k: 'code', lang: 'java', cap: 'Conditional beans and configuration properties', src: `@Configuration
public class AppConfig {

    // Manual bean for a third-party class you cannot annotate
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(Duration.ofSeconds(3))
            .setReadTimeout(Duration.ofSeconds(5))
            .build();
    }

    // Only created if no other bean of this type exists
    @Bean
    @ConditionalOnMissingBean
    public CacheManager cacheManager() { return new ConcurrentMapCacheManager(); }

    // Only in specific environments
    @Bean
    @Profile("!prod")
    public DataSeeder seeder() { return new DataSeeder(); }
}

// Typed configuration — far better than scattering @Value everywhere
@ConfigurationProperties(prefix = "payment")
@Validated
public record PaymentProperties(
    @NotBlank String apiKey,
    @Min(1) int retries,
    Duration timeout
) { }
// binds from application.yml:
//   payment:
//     api-key: abc123
//     retries: 3
//     timeout: 5s` },
        { k: 'note', tone: 'trap', title: 'Do not use injected dependencies in the constructor body', body: 'At constructor time the injected beans exist but may not be fully initialised, and any proxying has not happened yet. Anything that needs a working dependency belongs in `@PostConstruct`, which runs after the whole graph is wired.' },
      ],
    },
    {
      id: 'spring-autoconfiguration',
      name: 'Auto-configuration — how the magic works',
      week: 11, mins: 110,
      summary: 'Why adding a dependency configures your whole app.',
      blocks: [
        { k: 'p', body: [
          'You add `spring-boot-starter-data-jpa` and suddenly a `DataSource`, an `EntityManager` and a transaction manager exist. That is not magic — it is a set of ordinary `@Configuration` classes that only apply when certain conditions are met.',
        ]},
        { k: 'code', lang: 'java', cap: 'What an auto-configuration actually looks like', src: `@AutoConfiguration
@ConditionalOnClass(DataSource.class)              // only if JDBC is on the classpath
@ConditionalOnMissingBean(DataSource.class)        // only if YOU did not define one
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {

    @Bean
    public DataSource dataSource(DataSourceProperties props) {
        return props.initializeDataSourceBuilder().build();
    }
}

// @SpringBootApplication is three annotations in one:
//   @Configuration          — this class can define beans
//   @ComponentScan          — scan this package and below
//   @EnableAutoConfiguration— load the conditional configs listed in
//                             META-INF/spring/...AutoConfiguration.imports` },
        { k: 'table', title: 'The conditions that drive it', head: ['Annotation', 'Applies when'], rows: [
          ['`@ConditionalOnClass`', 'A class is on the classpath'],
          ['`@ConditionalOnMissingBean`', 'You have not defined that bean yourself'],
          ['`@ConditionalOnProperty`', 'A property has a given value'],
          ['`@ConditionalOnWebApplication`', 'It is a web app'],
        ]},
        { k: 'note', tone: 'tip', title: 'The debugging flag worth knowing', body: 'Run with `--debug` and Spring Boot prints an **auto-configuration report** — every configuration it applied, and every one it skipped *with the reason*. When something is not being configured the way you expect, that report answers it in seconds. Mentioning it in an interview shows you have actually debugged a Spring app rather than only written one.' },
      ],
    },
    {
      id: 'spring-aop',
      name: 'AOP & proxies',
      week: 11, mins: 140, tag: 'core',
      summary: 'How @Transactional, @Cacheable and @Async work — and why self-calls break them.',
      blocks: [
        { k: 'p', body: [
          'Aspect-oriented programming pulls cross-cutting concerns — transactions, caching, logging, security — out of your business methods. Spring implements it with **proxies**: the bean you get injected is not your class, it is a generated wrapper that adds behaviour and then delegates.',
          'Understanding this one mechanism explains a whole family of "why did my annotation do nothing" bugs.',
        ]},
        { k: 'analogy', body: 'A personal assistant who screens your calls. Everyone dials your number but reaches the assistant, who logs the call, checks you are available, and only then puts it through. The caller never knows. But if *you* pick up the internal phone and dial yourself, the assistant is bypassed entirely — and that is exactly the self-invocation problem below.' },
        { k: 'code', lang: 'java', cap: 'The self-invocation trap — this catches everyone', src: `@Service
public class OrderService {

    // Called from OUTSIDE -> goes through the proxy -> transaction starts. Works.
    @Transactional
    public void placeOrder(Order o) {
        repository.save(o);
        updateInventory(o);      // <-- INTERNAL call: 'this.updateInventory(o)'
    }

    // NO TRANSACTION HERE. The internal call bypassed the proxy completely,
    // so this annotation does absolutely nothing.
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateInventory(Order o) {
        inventoryRepository.decrement(o.getItems());
    }
}

// FIX 1 (best): move it to another bean, so the call crosses a proxy boundary
@Service
public class InventoryService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateInventory(Order o) { ... }
}

// FIX 2: self-inject the proxy (works, but a design smell)
@Autowired @Lazy private OrderService self;
// then call self.updateInventory(o);` },
        { k: 'code', lang: 'java', cap: 'Writing your own aspect', src: `@Aspect
@Component
public class TimingAspect {

    @Around("@annotation(Timed)")
    public Object time(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        try {
            return pjp.proceed();                       // run the real method
        } finally {
            long ms = (System.nanoTime() - start) / 1_000_000;
            log.info("{} took {}ms", pjp.getSignature().getName(), ms);
        }
    }
}` },
        { k: 'note', tone: 'trap', title: 'The four rules of Spring proxies', body: '**(1)** Self-invocation bypasses the proxy — the annotation is ignored. **(2)** `private` and `final` methods cannot be proxied. **(3)** JDK dynamic proxies only work through interfaces; CGLIB subclasses the class (which is why the class cannot be `final`). **(4)** The proxy only wraps calls that come from *outside* the bean. Every "my `@Transactional` / `@Cacheable` / `@Async` did nothing" bug is one of these four.' },
      ],
    },
    {
      id: 'spring-rest',
      name: 'REST APIs done properly',
      week: 12, mins: 140,
      summary: 'Status codes, DTOs, versioning — the things that get picked apart in review.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'A controller that would survive review', src: `@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService service;
    public OrderController(OrderService service) { this.service = service; }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> get(@PathVariable Long id) {
        return service.findById(id)
                .map(OrderResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());     // 404, not null
    }

    @GetMapping
    public Page<OrderResponse> list(
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return service.search(status, pageable).map(OrderResponse::from);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req) {
        Order created = service.create(req.toCommand());
        URI location = URI.create("/api/v1/orders/" + created.getId());
        return ResponseEntity.created(location)                 // 201 + Location header
                             .body(OrderResponse.from(created));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();              // 204
    }
}` },
        { k: 'table', title: 'Status codes you must use correctly', head: ['Code', 'When'], rows: [
          ['200 OK', 'Successful GET, PUT, PATCH'],
          ['201 Created', 'POST created a resource. Include a `Location` header.'],
          ['204 No Content', 'Successful DELETE, or a PUT returning nothing'],
          ['400 Bad Request', 'Malformed or invalid input'],
          ['401 Unauthorized', 'Not authenticated (badly named — it means unauthenticated)'],
          ['403 Forbidden', 'Authenticated but not allowed'],
          ['404 Not Found', 'Resource does not exist'],
          ['409 Conflict', 'Version conflict, duplicate key'],
          ['422 Unprocessable', 'Syntactically fine, semantically invalid'],
          ['429 Too Many Requests', 'Rate limited'],
          ['500 / 503', 'Your fault / temporarily unavailable'],
        ]},
        { k: 'note', tone: 'warn', title: 'Never expose entities directly', body: 'Returning a JPA `@Entity` from a controller leaks your database schema into your public API, triggers lazy-loading exceptions during serialisation, and risks exposing fields like `passwordHash`. Always map to a DTO or a record. This is one of the most reliable things an interviewer will probe on.' },
      ],
    },
    {
      id: 'spring-validation-errors',
      name: 'Validation & error handling',
      week: 12, mins: 110,
      summary: 'One place for all errors, and consistent responses.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'Bean validation plus a global handler', src: `public record CreateOrderRequest(
    @NotNull(message = "customerId is required")   Long customerId,
    @NotEmpty(message = "at least one item")       List<@Valid ItemRequest> items,
    @Email                                          String contactEmail,
    @Positive                                       BigDecimal total
) { }

// One handler for the whole application
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> onValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fields = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(FieldError::getField,
                                      FieldError::getDefaultMessage,
                                      (a, b) -> a));
        return ResponseEntity.badRequest()
            .body(new ApiError("VALIDATION_FAILED", "Invalid request", fields));
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ApiError> onNotFound(OrderNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiError("ORDER_NOT_FOUND", ex.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> onUnexpected(Exception ex) {
        log.error("Unhandled", ex);                   // log the detail internally
        return ResponseEntity.status(500)
            .body(new ApiError("INTERNAL_ERROR", "Something went wrong", null));
        //  ^ never leak the stack trace or SQL to the caller
    }
}` },
        { k: 'note', tone: 'tip', title: 'The point of @RestControllerAdvice', body: 'Without it, every controller ends up with its own try/catch and the error shapes drift apart, so clients cannot parse errors reliably. One advice class means one error contract for the whole API. Say "consistent error contract" and you have answered the question.' },
      ],
    },
    {
      id: 'spring-transactions',
      name: '@Transactional — propagation & isolation',
      week: 13, mins: 180, tag: 'core',
      summary: 'The annotation everyone uses and few can explain. Heavily interviewed.',
      blocks: [
        { k: 'p', body: [
          '`@Transactional` wraps a method so that everything inside either commits together or rolls back together. Spring does it with the proxy mechanism, which is why all the proxy caveats apply.',
        ]},
        { k: 'table', title: 'Propagation — what happens if a transaction already exists', head: ['Value', 'Behaviour', 'Use for'], rows: [
          ['`REQUIRED`', 'Join the existing one, or start one', 'The default. 95% of cases.'],
          ['`REQUIRES_NEW`', 'Suspend the caller\'s, start a fresh independent one', 'Audit logs that must survive a rollback'],
          ['`SUPPORTS`', 'Join if one exists, otherwise run without', 'Read-only helpers'],
          ['`MANDATORY`', 'Join, or throw if none exists', 'Methods that must never run standalone'],
          ['`NEVER`', 'Throw if a transaction exists', 'Rare'],
          ['`NESTED`', 'A savepoint inside the current transaction', 'Partial rollback'],
        ]},
        { k: 'table', title: 'Isolation — what you can see of other transactions', head: ['Level', 'Prevents', 'Still allows'], rows: [
          ['READ_UNCOMMITTED', 'Nothing', 'Dirty reads'],
          ['READ_COMMITTED', 'Dirty reads', 'Non-repeatable reads (Postgres, Oracle default)'],
          ['REPEATABLE_READ', '+ non-repeatable reads', 'Phantom reads (MySQL default)'],
          ['SERIALIZABLE', 'Everything', 'Nothing — slowest'],
        ]},
        { k: 'code', lang: 'java', cap: 'The rollback trap', src: `@Service
public class PaymentService {

    // DEFAULT: rolls back ONLY on RuntimeException and Error.
    // A CHECKED exception commits the transaction. This surprises everyone.
    @Transactional
    public void pay(Order o) throws PaymentException {
        repository.save(o);
        throw new PaymentException("declined");   // <-- COMMITS! Checked exception.
    }

    // FIX: say so explicitly
    @Transactional(rollbackFor = Exception.class)
    public void payFixed(Order o) throws PaymentException { ... }

    // Read-only: skips dirty-checking, lets the DB use a read replica
    @Transactional(readOnly = true)
    public List<Order> findAll() { return repository.findAll(); }

    // Another trap: catching the exception yourself means NO rollback happens,
    // because the proxy never sees an exception escape the method.
    @Transactional
    public void silentlyBroken(Order o) {
        try {
            repository.save(o);
            riskyCall();
        } catch (Exception e) {
            log.error("failed", e);       // swallowed -> transaction COMMITS
        }
    }
}` },
        { k: 'note', tone: 'trap', title: 'The four ways @Transactional silently does nothing', body: '**(1)** Self-invocation — the internal call bypasses the proxy. **(2)** The method is `private` or `final` — cannot be proxied. **(3)** A checked exception is thrown — no rollback by default. **(4)** You caught the exception yourself — the proxy sees a normal return. Being able to list these four is one of the strongest Spring answers there is, because it proves production experience.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'What does readOnly = true actually do?', a: 'Two things. It tells Hibernate to skip dirty-checking, so it does not snapshot every loaded entity and compare at flush time — a real performance win on large reads. And it flags the transaction so a routing DataSource can send it to a read replica. It does *not* enforce anything at the database level in most setups, so it is a hint, not a guarantee.' },
        ]},
      ],
    },
    {
      id: 'spring-jpa',
      name: 'JPA & Hibernate',
      week: 14, mins: 180, tag: 'core',
      summary: 'The persistence context, entity states, and why saves happen when you did not expect.',
      blocks: [
        { k: 'p', title: 'The persistence context', body: [
          'Hibernate keeps a first-level cache — the persistence context — for the length of a transaction. Every entity you load goes in. At the end, Hibernate compares each one against the snapshot it took when loading, and issues UPDATEs for anything that changed. That is **dirty checking**, and it is why you often do not need to call `save()` at all.',
        ]},
        { k: 'code', lang: 'java', cap: 'Dirty checking surprises people', src: `@Transactional
public void renameUser(Long id, String newName) {
    User user = repository.findById(id).orElseThrow();
    user.setName(newName);
    // NO save() call — and it still UPDATEs at commit, because 'user' is
    // MANAGED and Hibernate compares it against the load-time snapshot.
}

// The flip side: an accidental modification also persists.
@Transactional
public BigDecimal calculateDiscount(Long id) {
    Order o = repository.findById(id).orElseThrow();
    o.setTotal(o.getTotal().multiply(new BigDecimal("0.9")));  // "just for the maths"
    return o.getTotal();
    // This WRITES TO THE DATABASE. A very common production bug.
}` },
        { k: 'table', title: 'Entity states', head: ['State', 'Meaning', 'Changes tracked?'], rows: [
          ['Transient', 'Just `new`-ed, never persisted', 'No'],
          ['Managed', 'Loaded or saved in an open context', '**Yes**'],
          ['Detached', 'Was managed, context has closed', 'No'],
          ['Removed', 'Marked for deletion', 'Deleted at flush'],
        ]},
        { k: 'code', lang: 'java', cap: 'Mapping choices that matter', src: `@Entity
@Table(name = "orders", indexes = @Index(columnList = "customer_id, created_at"))
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ALWAYS default to LAZY on associations. EAGER loads on every query,
    // whether you need it or not, and it is the root of most N+1 problems.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "order",
               cascade = CascadeType.ALL,
               orphanRemoval = true,
               fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)    // NEVER ORDINAL — reordering the enum
    private OrderStatus status;      // silently corrupts every existing row

    @Version
    private Long version;            // optimistic locking

    @CreationTimestamp
    private Instant createdAt;
}` },
        { k: 'note', tone: 'trap', title: 'Three mapping decisions that bite later', body: '**(1)** `EnumType.ORDINAL` stores the enum position — insert a new value in the middle and every existing row now means something different. Always `STRING`. **(2)** `FetchType.EAGER` on `@ManyToOne` is the JPA *default*; override it to LAZY. **(3)** `CascadeType.REMOVE` on a `@ManyToOne` will delete the parent when you delete a child. Cascades belong on the owning side only.' },
      ],
    },
    {
      id: 'spring-n-plus-one',
      name: 'The N+1 problem',
      week: 17, mins: 140, tag: 'core',
      summary: 'The single most common performance bug in Spring apps. Guaranteed interview question.',
      blocks: [
        { k: 'p', body: [
          'You load 100 orders with one query. Then you loop over them reading `order.getCustomer().getName()`. Because the association is lazy, each access fires its own SELECT. One query becomes 101.',
          'On a page showing 100 rows, that is 101 round trips to the database — a request that should take 20ms takes 2 seconds.',
        ]},
        { k: 'analogy', body: 'Going to the supermarket with a shopping list of 100 items and making a separate trip for each one. The items are the same either way; the travel destroys you. Fetch joins are simply doing one trip with a trolley.' },
        { k: 'code', lang: 'java', cap: 'The bug and three fixes', src: `// THE BUG
@Transactional(readOnly = true)
public List<OrderDto> listOrders() {
    List<Order> orders = orderRepository.findAll();       // 1 query
    return orders.stream()
        .map(o -> new OrderDto(o.getId(), o.getCustomer().getName()))
        .toList();                                         // + N queries. 101 total.
}

// FIX 1: JOIN FETCH — one query, best for a single collection
@Query("SELECT o FROM Order o JOIN FETCH o.customer")
List<Order> findAllWithCustomer();

// FIX 2: EntityGraph — declarative, composable, no JPQL needed
@EntityGraph(attributePaths = {"customer", "items"})
List<Order> findAll();

// FIX 3 (best for read-only endpoints): a projection.
// Fetches ONLY the columns you need, never materialises an entity at all.
public interface OrderSummary {
    Long getId();
    String getCustomerName();
}
@Query("SELECT o.id AS id, c.name AS customerName FROM Order o JOIN o.customer c")
List<OrderSummary> findSummaries();` },
        { k: 'code', lang: 'java', cap: 'How to catch it before production', src: `# application.yml — in DEV only, never production
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        generate_statistics: true      # logs the query COUNT per session

logging:
  level:
    org.hibernate.SQL: DEBUG

# Better: add the datasource-proxy or p6spy library, or an assertion in tests
# that fails the build if a request issues more than N queries.` },
        { k: 'note', tone: 'warn', title: 'The MultipleBagFetchException trap', body: 'You cannot `JOIN FETCH` two `List` collections in one query — Hibernate throws `MultipleBagFetchException` because the cartesian product would be ambiguous. Fixes: change the collections to `Set`, or fetch one collection per query, or use `@BatchSize(size = 25)` which turns N queries into N/25. This exact follow-up comes up often once you mention JOIN FETCH.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'How would you find an N+1 in a running application?', a: 'Turn on `generate_statistics` and look at the query count per request, or read the APM traces — an N+1 has an unmistakable shape, one span followed by a hundred identical short spans. To stop it recurring, add an integration test that asserts the query count for that endpoint, so a regression fails the build rather than reaching production.' },
        ]},
      ],
    },
    {
      id: 'spring-security',
      name: 'Spring Security & JWT',
      week: 15, mins: 170,
      summary: 'The filter chain, and stateless authentication done correctly.',
      blocks: [
        { k: 'p', body: [
          'Spring Security is a **chain of servlet filters** in front of your controllers. Each filter has one job — read a token, check a session, enforce CSRF. A request that fails any of them never reaches your code.',
          'The distinction to keep straight: **authentication** is *who are you*, **authorisation** is *what may you do*.',
        ]},
        { k: 'code', lang: 'java', cap: 'A stateless JWT configuration', src: `@Configuration
@EnableWebSecurity
@EnableMethodSecurity                       // enables @PreAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain chain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        return http
            // CSRF protects cookie-based sessions. A stateless JWT API does not
            // use cookies, so it is disabled deliberately — not carelessly.
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();     // NEVER store plaintext or MD5
    }
}

// Method-level authorisation
@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
public UserDto getUser(@PathVariable Long userId) { ... }` },
        { k: 'table', title: 'JWT — what to know', head: ['Part', 'Contains'], rows: [
          ['Header', 'Algorithm and token type'],
          ['Payload', 'Claims — subject, roles, expiry. **Base64, not encrypted.**'],
          ['Signature', 'Proves it was not tampered with'],
        ]},
        { k: 'note', tone: 'trap', title: 'JWT mistakes that get flagged', body: '**(1)** Putting secrets in the payload — it is base64, anyone can read it. **(2)** No expiry, or a very long one — a JWT cannot be revoked, so it is valid until it expires. **(3)** Accepting `alg: none`. **(4)** Storing it in `localStorage` where any XSS can steal it; an httpOnly cookie is safer. The standard design is a **short-lived access token (15 min) plus a revocable refresh token** — say that and you have answered the whole question.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Session-based auth or JWT?', a: 'Sessions are simpler and revocable instantly — the server holds the state, so logging someone out is one delete. They need sticky sessions or a shared store when you scale horizontally. JWTs are stateless and scale trivially, but cannot be revoked before expiry, which is why you pair a short access token with a refresh token you *can* revoke. For a monolith, sessions. For microservices or mobile, JWT.' },
        ]},
      ],
    },
    {
      id: 'spring-profiles-actuator',
      name: 'Profiles, config & Actuator',
      week: 16, mins: 90,
      summary: 'Environment separation and production observability.',
      blocks: [
        { k: 'code', lang: 'yaml', cap: 'Profile-based configuration', src: `# application.yml — shared defaults
spring:
  application:
    name: order-service
  jpa:
    open-in-view: false          # turn this OFF. It keeps a DB connection
                                  # open for the whole request and hides N+1s.

management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, prometheus
  endpoint:
    health:
      show-details: when-authorized
---
spring:
  config:
    activate:
      on-profile: local
  datasource:
    url: jdbc:postgresql://localhost:5432/orders
  jpa:
    show-sql: true
---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: \${DB_URL}              # from the environment, never committed
    username: \${DB_USER}
    password: \${DB_PASSWORD}` },
        { k: 'table', title: 'Actuator endpoints that matter', head: ['Endpoint', 'Use'], rows: [
          ['`/actuator/health`', 'Kubernetes liveness and readiness probes'],
          ['`/actuator/metrics`', 'JVM, HTTP, datasource metrics'],
          ['`/actuator/prometheus`', 'Scrape target for Prometheus'],
          ['`/actuator/loggers`', 'Change log levels at runtime, no redeploy'],
          ['`/actuator/env`', 'Effective configuration — **secure this**'],
        ]},
        { k: 'note', tone: 'warn', title: 'open-in-view', body: 'Spring Boot enables `spring.jpa.open-in-view` by default. It holds a database connection open for the entire request so lazy loading works in the view layer — which means N+1 problems never surface as errors, they just quietly consume your connection pool. Turn it off, and be ready to explain why. It is a great "have you actually run this in production" answer.' },
      ],
    },
    {
      id: 'spring-testing',
      name: 'Testing Spring applications',
      week: 16, mins: 120,
      summary: 'The pyramid, and the annotations that keep tests fast.',
      blocks: [
        { k: 'code', lang: 'java', cap: 'Three levels, three costs', src: `// 1. UNIT — no Spring at all. Milliseconds. Have hundreds of these.
class OrderServiceTest {
    private final PaymentGateway gateway = mock(PaymentGateway.class);
    private final OrderRepository repo = mock(OrderRepository.class);
    private final OrderService service = new OrderService(gateway, repo);

    @Test
    void rejectsOrderWhenPaymentDeclined() {
        when(gateway.charge(any())).thenReturn(Result.declined());
        assertThrows(PaymentFailedException.class, () -> service.place(anOrder()));
        verify(repo, never()).save(any());
    }
}

// 2. SLICE — loads only the web layer. Fast. Use for controllers.
@WebMvcTest(OrderController.class)
class OrderControllerTest {
    @Autowired MockMvc mvc;
    @MockBean OrderService service;

    @Test
    void returns404WhenMissing() throws Exception {
        when(service.findById(1L)).thenReturn(Optional.empty());
        mvc.perform(get("/api/v1/orders/1"))
           .andExpect(status().isNotFound());
    }
}

// 3. INTEGRATION — the whole context + a real database in Docker. Slow.
// Have a handful, covering the critical paths only.
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class OrderIntegrationTest {
    @Container
    static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", db::getJdbcUrl);
        r.add("spring.datasource.username", db::getUsername);
        r.add("spring.datasource.password", db::getPassword);
    }
}` },
        { k: 'table', title: 'The slice annotations', head: ['Annotation', 'Loads'], rows: [
          ['`@WebMvcTest`', 'Controllers, filters, converters — no services or repos'],
          ['`@DataJpaTest`', 'Repositories + an in-memory DB, transactional and rolled back'],
          ['`@JsonTest`', 'Just the JSON serialisation'],
          ['`@SpringBootTest`', 'Everything. Slow — use sparingly.'],
        ]},
        { k: 'note', tone: 'tip', title: 'What to say about coverage', body: 'Coverage percentage is a weak signal — it is easy to reach 90% while testing nothing meaningful. The useful framing: *"I aim for high coverage of business logic through fast unit tests, a slice test per controller, and a small number of integration tests over the critical paths. I care more about whether a test would actually fail when the behaviour breaks than about the number."*' },
      ],
    },
  ],
}
