export const messaging = {
  id: 'messaging',
  name: 'Messaging & Caching',
  icon: '⇄',
  blurb: 'Kafka and Redis to working depth — the model, then production-grade code you can actually ship. Enough to build with them correctly, not just to describe them.',
  weeks: 'Weeks 19–21 (evenings)',
  topics: [
    {
      id: 'msg-why-queues',
      name: 'Why message queues exist',
      week: 19, mins: 90,
      summary: 'The problem they solve, before any product names.',
      blocks: [
        { k: 'p', body: [
          'Service A calls service B directly over HTTP. If B is down, A fails. If B is slow, A is slow. If B needs to scale, A must wait for it. And if a third service later needs to know about the same event, A must be changed to call it too.',
          'A queue breaks that coupling. A writes the event and moves on. B reads it when it can. C can start reading the same events without A knowing C exists.',
        ]},
        { k: 'analogy', body: 'The difference between phoning someone and posting a letter. On a phone call, both of you must be free at the same moment, and if they do not pick up you have achieved nothing. A letter goes in the postbox — you carry on with your day, they read it when they get home, and you can send the same letter to five people without waiting for any of them.' },
        { k: 'table', title: 'The four things you gain', head: ['Benefit', 'What it means'], rows: [
          ['**Decoupling**', 'The producer does not know or care who consumes'],
          ['**Buffering**', 'A traffic spike queues up instead of knocking the consumer over'],
          ['**Resilience**', 'The consumer can be down for an hour and lose nothing'],
          ['**Fan-out**', 'One event, many independent consumers'],
        ]},
        { k: 'note', tone: 'warn', title: 'What you give up', body: 'Everything becomes **eventually** consistent, so the caller cannot know the work succeeded. Debugging spans multiple systems. Message ordering needs deliberate design. And you now operate a broker. Do not add a queue because it sounds sophisticated — add it when you need one of the four benefits above, and be able to say which one.' },
      ],
    },
    {
      id: 'msg-kafka-core',
      name: 'Kafka — the core model',
      week: 19, mins: 160, tag: 'core',
      summary: 'Topics, partitions, offsets, consumer groups. Everything else is detail.',
      blocks: [
        { k: 'p', body: [
          'Kafka is not a queue in the traditional sense — it is a **distributed, append-only log**. Messages are appended to the end and stay there for a configured retention period, whether or not anyone has read them. Consumers track their own position.',
          'That single design decision explains almost everything about how Kafka behaves.',
        ]},
        { k: 'table', title: 'The vocabulary', head: ['Term', 'Meaning'], rows: [
          ['**Topic**', 'A named stream of messages, e.g. `order-events`'],
          ['**Partition**', 'A topic is split into partitions. This is the unit of parallelism.'],
          ['**Offset**', 'A message\'s position within its partition. Consumers commit offsets.'],
          ['**Producer**', 'Writes messages'],
          ['**Consumer group**', 'A set of consumers sharing the work of one topic'],
          ['**Broker**', 'One Kafka server. A cluster has several.'],
          ['**Replication factor**', 'How many copies of each partition exist'],
        ]},
        { k: 'p', title: 'The two rules that matter most', body: [
          '**1. Ordering is guaranteed within a partition, never across partitions.** If you need all events for one order processed in order, they must go to the same partition — which you achieve by using the order ID as the message key. Kafka hashes the key to pick the partition.',
          '**2. Within a consumer group, each partition is read by exactly one consumer.** So your maximum parallelism equals your partition count. Ten consumers on a three-partition topic means seven sit idle.',
        ]},
        { k: 'code', lang: 'java', cap: 'Producing and consuming in Spring', src: `// PRODUCER — the key decides the partition, and therefore the ordering
@Service
public class OrderEventPublisher {
    private final KafkaTemplate<String, OrderEvent> kafka;

    public void publish(OrderEvent event) {
        kafka.send("order-events",
                   event.orderId(),     // KEY: all events for this order
                   event);              //      land in the same partition
    }
}

// CONSUMER
@Component
public class OrderEventConsumer {

    @KafkaListener(topics = "order-events", groupId = "inventory-service")
    public void handle(OrderEvent event, Acknowledgment ack) {
        try {
            inventoryService.reserve(event);
            ack.acknowledge();          // commit the offset only after success
        } catch (TransientException e) {
            // do NOT ack -> the message is redelivered
            throw e;
        }
    }
}` },
        { k: 'code', lang: 'yaml', cap: 'The settings that matter', src: `spring:
  kafka:
    producer:
      acks: all              # wait for all in-sync replicas. Slower, no data loss.
                             # acks=1 -> leader only, faster, can lose on failover
                             # acks=0 -> fire and forget, do not use for real data
      retries: 3
      properties:
        enable.idempotence: true      # prevents duplicates from producer retries
        max.in.flight.requests.per.connection: 5

    consumer:
      group-id: inventory-service
      auto-offset-reset: earliest     # a NEW group starts from the beginning
                                       # 'latest' skips everything before it joined
      enable-auto-commit: false        # commit manually, AFTER processing
      max-poll-records: 100` },
        { k: 'note', tone: 'trap', title: 'The auto-commit trap', body: 'With `enable-auto-commit: true`, Kafka commits the offset on a timer regardless of whether your processing succeeded. Crash mid-processing after a commit and the message is **lost** — the consumer restarts past it. Always commit manually after the work is done, which gives you at-least-once delivery, and make your handler idempotent.' },
      ],
    },
    {
      id: 'msg-kafka-delivery',
      name: 'Kafka — delivery, ordering & failure',
      week: 20, mins: 150,
      summary: 'At-least-once, consumer lag, rebalancing and dead-letter queues.',
      blocks: [
        { k: 'table', title: 'Delivery guarantees', head: ['Guarantee', 'How', 'Reality'], rows: [
          ['At-most-once', 'Commit before processing', 'Can lose messages. Rarely wanted.'],
          ['**At-least-once**', 'Commit after processing', '**The normal choice.** Can duplicate — so be idempotent.'],
          ['Exactly-once', 'Transactions + idempotent producer', 'Real in Kafka-to-Kafka flows; effectively impossible once an external system is involved.'],
        ]},
        { k: 'note', tone: 'tip', title: 'The exactly-once answer', body: 'If asked "can you guarantee exactly-once?", the strong answer is: *"Kafka supports it within Kafka via transactions, but the moment I write to an external database or call a third-party API, the honest design is **at-least-once delivery plus idempotent consumers** — I make reprocessing the same message harmless, usually with a deduplication key or an upsert."* That answer is more correct and more impressive than claiming exactly-once.' },
        { k: 'code', lang: 'java', cap: 'A production consumer — retries, DLQ, and manual commit', src: `@Configuration
public class KafkaConsumerConfig {

    // Retry 3 times with exponential backoff, then route to a dead-letter topic.
    // Without this, one poison message blocks its whole partition forever.
    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {
        var recoverer = new DeadLetterPublishingRecoverer(template,
            (record, ex) -> new TopicPartition(record.topic() + ".DLT", record.partition()));

        var backoff = new ExponentialBackOffWithMaxRetries(3);
        backoff.setInitialInterval(1000L);
        backoff.setMultiplier(2.0);              // 1s, 2s, 4s

        var handler = new DefaultErrorHandler(recoverer, backoff);

        // Do NOT retry errors that can never succeed — a malformed payload
        // will fail identically on every attempt. Send it straight to the DLT.
        handler.addNotRetryableExceptions(
            JsonParseException.class, IllegalArgumentException.class);

        return handler;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OrderEvent> factory(
            ConsumerFactory<String, OrderEvent> cf, DefaultErrorHandler errorHandler) {

        var factory = new ConcurrentKafkaListenerContainerFactory<String, OrderEvent>();
        factory.setConsumerFactory(cf);
        factory.setCommonErrorHandler(errorHandler);
        factory.setConcurrency(3);               // 3 threads — match your partition count
        factory.getContainerProperties()
               .setAckMode(ContainerProperties.AckMode.MANUAL);   // commit after work
        return factory;
    }
}

@Component
public class OrderEventConsumer {

    @KafkaListener(topics = "order-events", groupId = "inventory-service")
    public void handle(@Payload OrderEvent event,
                       @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                       @Header(KafkaHeaders.OFFSET) long offset,
                       Acknowledgment ack) {

        MDC.put("eventId", event.eventId());     // correlate the logs
        try {
            inventoryService.reserve(event);
            ack.acknowledge();                    // commit ONLY after success
        } finally {
            MDC.clear();
        }
        // Throwing here hands control to the DefaultErrorHandler above:
        // it retries, and eventually publishes to order-events.DLT.
    }

    // Consume the dead-letter topic so failures are visible, not silent.
    @KafkaListener(topics = "order-events.DLT", groupId = "inventory-dlt")
    public void handleDead(OrderEvent event,
                           @Header(KafkaHeaders.EXCEPTION_MESSAGE) String reason) {
        log.error("Permanently failed eventId={} reason={}", event.eventId(), reason);
        failedEventRepository.save(FailedEvent.from(event, reason));   // for replay
    }
}` },
        { k: 'code', lang: 'java', cap: 'Idempotent consumption', src: `@KafkaListener(topics = "payment-events")
@Transactional
public void handle(PaymentEvent event) {
    // The event carries a unique ID. Processing it twice must be harmless.
    if (processedRepository.existsById(event.eventId())) {
        log.debug("Duplicate {}, skipping", event.eventId());
        return;
    }

    paymentService.apply(event);
    processedRepository.save(new ProcessedEvent(event.eventId(), Instant.now()));
    // Both writes in one transaction: either both happen, or neither.
}` },
        { k: 'list', title: 'Consumer lag — the metric to watch', items: [
          'Lag = latest offset in the partition − the consumer\'s committed offset. It is how far behind you are.',
          'Rising lag means consumers cannot keep up. Fix by adding consumers (up to the partition count), speeding up processing, or adding partitions.',
          '**Adding partitions breaks key-based ordering** for existing keys, because the hash maps them elsewhere. Size partitions generously up front.',
          'Alert on lag, not on error rate alone — a silently-falling-behind consumer produces no errors at all.',
        ]},
        { k: 'p', title: 'Rebalancing and DLQs', body: [
          'When a consumer joins or leaves a group, Kafka **rebalances** — reassigning partitions across the surviving consumers. During a rebalance, consumption pauses. Frequent rebalances (usually caused by processing taking longer than `max.poll.interval.ms`) cause a stalled consumer that looks alive.',
          'A **dead-letter queue** is where messages go after N failed attempts. Without one, a single poison message blocks its whole partition forever. With one, the bad message is parked for a human and the stream keeps moving.',
        ]},
      ],
    },
    {
      id: 'msg-redis',
      name: 'Redis & caching patterns',
      week: 21, mins: 150, tag: 'core',
      summary: 'Cache-aside, TTLs, eviction, and the invalidation problem.',
      blocks: [
        { k: 'p', body: [
          'Redis is an in-memory key-value store. Memory access is roughly a thousand times faster than disk, which is the entire value proposition. It is single-threaded for commands, so every operation is atomic — no locking needed for a single command.',
        ]},
        { k: 'table', title: 'The data types and what they are for', head: ['Type', 'Use'], rows: [
          ['String', 'Cached values, counters, flags'],
          ['Hash', 'An object — set/get individual fields'],
          ['List', 'Queues, recent-items feeds'],
          ['Set', 'Unique membership — "has this user seen it"'],
          ['Sorted Set', 'Leaderboards, rate limiters, priority queues'],
          ['Stream', 'An append-only log, a lightweight Kafka alternative'],
        ]},
        { k: 'code', lang: 'java', cap: 'Cache-aside — the pattern you will use 90% of the time', src: `public Product getProduct(Long id) {
    String key = "product:" + id;

    // 1. try the cache
    Product cached = redis.get(key);
    if (cached != null) return cached;                 // HIT

    // 2. miss -> go to the database
    Product product = repository.findById(id).orElseThrow();

    // 3. populate the cache WITH A TTL. Never cache without an expiry.
    redis.set(key, product, Duration.ofMinutes(10));

    return product;
}

// On update, INVALIDATE rather than overwrite — deleting is safe under
// concurrency, whereas writing a stale value from a slow thread is not.
@Transactional
public void updateProduct(Product p) {
    repository.save(p);
    redis.delete("product:" + p.getId());
}

// Spring's declarative version
@Cacheable(value = "products", key = "#id")
public Product get(Long id) { ... }

@CacheEvict(value = "products", key = "#p.id")
public void update(Product p) { ... }` },
        { k: 'table', title: 'Caching patterns', head: ['Pattern', 'How it works', 'Trade-off'], rows: [
          ['**Cache-aside**', 'App checks cache, loads on miss', 'The default. Simple, but the first request is slow.'],
          ['Read-through', 'The cache itself loads on miss', 'Cleaner code, needs cache support'],
          ['Write-through', 'Write to cache and DB together', 'Always consistent; slower writes'],
          ['Write-behind', 'Write to cache, flush to DB later', 'Fast writes; can lose data on crash'],
        ]},
        { k: 'note', tone: 'trap', title: 'The three cache failures worth naming', body: '**Cache stampede** — a popular key expires and a thousand requests hit the database simultaneously. Fix with a lock so only one rebuilds, or by adding random jitter to TTLs. **Cache penetration** — repeated requests for a key that does not exist bypass the cache every time; cache the negative result, or use a bloom filter. **Cache avalanche** — many keys expire at the same instant because they were populated together; jitter the TTLs.' },
        { k: 'code', lang: 'java', cap: 'A distributed lock — working code, including the release script', src: `@Component
public class RedisLock {

    private final StringRedisTemplate redis;

    // Release MUST be atomic: check the token and delete in one operation.
    // A plain DEL can delete a lock that already expired and was re-acquired
    // by someone else — you would then be silently unlocking their work.
    private static final DefaultRedisScript<Long> RELEASE = new DefaultRedisScript<>("""
        if redis.call('get', KEYS[1]) == ARGV[1] then
            return redis.call('del', KEYS[1])
        else
            return 0
        end
        """, Long.class);

    /** @return a token to release with, or empty if the lock was already held. */
    public Optional<String> acquire(String key, Duration ttl) {
        String token = UUID.randomUUID().toString();
        // SET key token NX PX ttl  -> set only if absent, with an expiry
        Boolean ok = redis.opsForValue().setIfAbsent(key, token, ttl);
        return Boolean.TRUE.equals(ok) ? Optional.of(token) : Optional.empty();
    }

    public boolean release(String key, String token) {
        Long freed = redis.execute(RELEASE, List.of(key), token);
        return Long.valueOf(1L).equals(freed);
    }

    /** The safe usage pattern — always release in a finally block. */
    public <T> Optional<T> withLock(String key, Duration ttl, Supplier<T> work) {
        Optional<String> token = acquire(key, ttl);
        if (token.isEmpty()) return Optional.empty();      // someone else has it
        try {
            return Optional.of(work.get());
        } finally {
            release(key, token.get());
        }
    }
}

// Usage
lock.withLock("lock:nightly-report", Duration.ofMinutes(5), () -> {
    reportService.generate();
    return null;
});` },
        { k: 'note', tone: 'trap', title: 'The TTL is a correctness decision, not a detail', body: 'The TTL exists so a crashed holder cannot deadlock everyone forever. But if the work outlasts the TTL, the lock expires **while you are still working** and a second worker starts — so you no longer have mutual exclusion. Two defences: set the TTL comfortably above the worst-case duration, or run a **watchdog** that extends it while the work is alive (this is what Redisson does). And be honest in an interview that single-node Redis locks are best-effort: for genuine correctness you need fencing tokens or a consensus store like etcd.' },
        { k: 'table', title: 'Eviction policies', head: ['Policy', 'Behaviour'], rows: [
          ['`noeviction`', 'Writes fail when memory is full — the default, rarely what you want for a cache'],
          ['**`allkeys-lru`**', 'Evict least recently used. **The usual choice for a cache.**'],
          ['`allkeys-lfu`', 'Evict least frequently used — better for skewed access'],
          ['`volatile-ttl`', 'Evict keys with a TTL, shortest first'],
        ]},
      ],
    },
  ],
}
