export const hld = {
  id: 'hld',
  name: 'System Design (HLD)',
  icon: '⬡',
  blurb: 'Usually the round with the least practice behind it, and the one that most separates offer bands at senior level. A repeatable framework, the building blocks, then nine worked case studies.',
  weeks: 'Weeks 17–22',
  topics: [
    {
      id: 'hld-framework',
      name: 'The 45-minute framework',
      week: 17, mins: 120, tag: 'core',
      summary: 'The single most important topic here. A repeatable structure so you are never lost.',
      blocks: [
        { k: 'p', body: [
          'System design interviews feel unbounded, which is why people freeze. The fix is a fixed structure you follow every time regardless of the question. The interviewer is not checking whether you have built Twitter — they are checking whether you can **drive a design conversation**.',
        ]},
        { k: 'table', title: 'The timebox', head: ['Minutes', 'Phase', 'What you produce'], rows: [
          ['0–5', 'Requirements', 'Functional, non-functional, explicit scope cuts'],
          ['5–8', 'Scale estimation', 'QPS, storage, read:write ratio'],
          ['8–12', 'API design', '4–6 endpoints with signatures'],
          ['12–18', 'Data model', 'Tables/collections, and the storage choice with a reason'],
          ['18–30', 'High-level design', 'The box diagram, and the request walked end to end'],
          ['30–40', 'Deep dive', 'Whatever the interviewer pushes on'],
          ['40–45', 'Bottlenecks', 'What breaks first at 10× and what you would do'],
        ]},
        { k: 'list', ordered: true, title: 'Phase 1 — requirements (never skip this)', items: [
          '**Functional:** "So users can shorten a URL and be redirected. Do we need custom aliases? Expiry? Analytics?" — write the answers down.',
          '**Non-functional:** How many users? Read-heavy or write-heavy? Latency target? Is consistency or availability more important?',
          '**Scope out loud:** "I\'ll leave auth and billing out of scope and focus on the core flow — is that right?" Getting agreement here is what stops you being marked down for omissions.',
        ]},
        { k: 'note', tone: 'warn', title: 'The commonest failure', body: 'Drawing boxes at minute two. Candidates who start designing before agreeing requirements build the wrong system beautifully, and the interviewer spends the whole session steering. Five minutes of questions is not wasted time — it is the part being graded most heavily.' },
        { k: 'note', tone: 'tip', title: 'Say this at minute 18', body: '*"Let me walk one request end to end before we go deeper — a user posts a URL, it hits the load balancer, the API service generates a key, writes to the database, and populates the cache. On read we check the cache first, then the DB, and return a 301."* Walking a request through your own diagram proves the design actually functions, and it is the moment most interviewers relax.' },
      ],
    },
    {
      id: 'hld-estimation',
      name: 'Back-of-envelope estimation',
      week: 17, mins: 90, tag: 'core',
      summary: 'Six numbers and aggressive rounding. This is the only arithmetic in the whole process.',
      blocks: [
        { k: 'p', body: [
          'You are not being tested on arithmetic. You are being tested on whether you can tell a system that needs one server from one that needs a thousand. Round aggressively and out loud — everyone does, and it is expected.',
        ]},
        { k: 'table', title: 'The complete set of numbers you need', head: ['Fact', 'Value'], rows: [
          ['Powers of two', '2¹⁰ ≈ 1 thousand · 2²⁰ ≈ 1 million · 2³⁰ ≈ 1 billion'],
          ['Seconds in a day', '86,400 ≈ 10⁵'],
          ['1 million requests/day', '≈ 12 per second'],
          ['1 billion requests/day', '≈ 12,000 per second'],
          ['Typical DB row', '≈ 1 KB → 1 million rows ≈ 1 GB'],
          ['Latency ladder', 'RAM 100ns · SSD 100µs · same-DC 0.5ms · cross-continent 150ms'],
        ]},
        { k: 'code', lang: 'text', cap: 'A worked estimate, exactly as you would say it aloud', src: `"Say 100 million daily active users, each doing 10 reads a day.
 That is 1 billion reads a day. Call it 12,000 per second.
 Peak is maybe 3x average, so ~35,000 QPS. Round to 40,000.

 Writes: say 1% of reads, so 10 million a day, ~120 per second.
 That is a heavily read-skewed system — roughly 100:1 — which
 tells me caching is the main lever and the write path is easy.

 Storage: 10 million new records a day, 1 KB each = 10 GB a day.
 Over 5 years that is ~18 TB. Too much for one machine, so we
 shard, or we use object storage with a metadata database.

 Cache: if 20% of content drives 80% of traffic, caching the hot
 20% of a day's data is ~2 GB. That fits in memory comfortably —
 so a Redis cluster handles the read path and the database only
 sees cache misses."` },
        { k: 'note', tone: 'tip', title: 'What the estimate is FOR', body: 'The numbers are not the deliverable — the *conclusions* are. "100:1 read ratio, so caching is the lever." "18 TB, so we shard." "40k QPS, so roughly 20 application servers." Always finish an estimate by saying what it tells you about the design. An estimate with no conclusion is wasted minutes.' },
      ],
    },
    {
      id: 'hld-load-balancing',
      name: 'Load balancing & the web tier',
      week: 18, mins: 110,
      summary: 'Spreading traffic, and why your servers must be stateless.',
      blocks: [
        { k: 'table', title: 'Algorithms', head: ['Algorithm', 'Behaviour', 'Use when'], rows: [
          ['Round robin', 'Next server in turn', 'Servers are identical, requests uniform'],
          ['Least connections', 'Fewest active connections', 'Request durations vary a lot'],
          ['**Consistent hashing**', 'Same key → same server', 'Cache affinity matters'],
          ['Weighted', 'Proportional to capacity', 'Mixed hardware'],
        ]},
        { k: 'table', title: 'Layer 4 vs Layer 7', head: ['', 'L4 (transport)', 'L7 (application)'], rows: [
          ['Sees', 'IP and port only', 'The full HTTP request'],
          ['Can route by', 'Nothing in the payload', 'Path, header, cookie'],
          ['Speed', 'Faster', 'Slower but far more capable'],
          ['Examples', 'AWS NLB', 'AWS ALB, nginx'],
        ]},
        { k: 'note', tone: 'trap', title: 'Statelessness is the whole point', body: 'If a server stores session state in memory, the load balancer must send that user back to the same box every time (sticky sessions). That breaks scaling — you cannot rebalance, and when the box dies those users are logged out. **Push state out**: sessions into Redis, files into object storage, and the app servers become identical and disposable. Say "the app tier is stateless so any instance can serve any request" and you have covered the point.' },
        { k: 'list', title: 'What sits in front of the app tier', items: [
          '**DNS** — the first level of routing, can do geographic distribution',
          '**CDN** — serves static assets from an edge close to the user; huge latency win, huge origin offload',
          '**Load balancer** — health checks, TLS termination, distribution',
          '**API gateway** — auth, rate limiting, routing, request/response shaping',
          '**Reverse proxy** — caching, compression, header manipulation',
        ]},
      ],
    },
    {
      id: 'hld-caching',
      name: 'Caching at system scale',
      week: 18, mins: 130, tag: 'core',
      summary: 'Where to cache, what to cache, and the invalidation problem.',
      blocks: [
        { k: 'table', title: 'Every layer you can cache at', head: ['Layer', 'What it holds', 'Typical hit'], rows: [
          ['Browser', 'Static assets, API responses', 'Free, but you cannot invalidate'],
          ['CDN', 'Images, JS, CSS, video', 'Massive origin offload'],
          ['API gateway', 'Whole responses', 'Good for public read endpoints'],
          ['**Application (Redis)**', 'Query results, sessions, computed values', '**The main lever**'],
          ['Database buffer pool', 'Recently read pages', 'Automatic'],
        ]},
        { k: 'p', title: 'What to cache', body: [
          'Cache things that are **read far more than written**, **expensive to compute**, and **tolerable slightly stale**. A product page: yes. A user\'s current account balance: be careful. A one-time payment confirmation: no.',
        ]},
        { k: 'table', title: 'The three failure modes, by name', head: ['Failure', 'What happens', 'Fix'], rows: [
          ['**Stampede**', 'A hot key expires; a thousand requests hit the DB at once', 'Lock so one rebuilds; or jitter the TTL; or refresh ahead of expiry'],
          ['**Penetration**', 'Requests for keys that do not exist bypass the cache every time', 'Cache the negative result briefly; bloom filter'],
          ['**Avalanche**', 'Many keys expire simultaneously because they were loaded together', 'Randomise TTLs (e.g. 10 min ± 2 min)'],
        ]},
        { k: 'note', tone: 'tip', title: 'The invalidation answer', body: 'When asked how you keep the cache correct, the strong answer names three options and picks: **TTL** (simplest, accepts bounded staleness), **write-through invalidation** (delete the key on update — precise but you must find every write path), and **event-driven** (publish a change event, consumers evict). Then say which you would choose and why. Most real systems use TTL plus explicit invalidation on the few paths that matter most.' },
      ],
    },
    {
      id: 'hld-db-scaling',
      name: 'Scaling the database',
      week: 18, mins: 150, tag: 'core',
      summary: 'Replication, partitioning, sharding — in the order you should actually try them.',
      blocks: [
        { k: 'list', ordered: true, title: 'The order that matters', items: [
          '**Index and query tuning** — routinely 10–100× for free. Always first.',
          '**Caching** — takes reads off the database entirely.',
          '**Vertical scaling** — a bigger machine. Boring, effective, has a ceiling.',
          '**Read replicas** — reads to copies, writes to the primary.',
          '**Partitioning** — one logical table split by range or hash, same database.',
          '**Sharding** — data split across separate databases. A large complexity jump.',
        ]},
        { k: 'note', tone: 'warn', title: 'Never jump to sharding', body: 'A candidate who reaches for sharding in minute five is signalling inexperience. A single well-tuned Postgres instance handles tens of thousands of transactions per second and tens of terabytes. Walk up the ladder out loud — "first I would check indexes, then add a cache, then read replicas; we would only shard if writes exceed what one primary can take" — and you sound like someone who has actually operated a database.' },
        { k: 'p', title: 'Replication', body: [
          'One primary takes writes; replicas copy from it and serve reads. This scales reads well and gives you failover.',
          'The cost is **replication lag**. A user writes, then immediately reads from a replica that has not caught up, and their own change appears to have vanished. Fixes: read-your-own-writes routing (send a user\'s reads to the primary for a few seconds after they write), or synchronous replication for the paths where it matters.',
        ]},
        { k: 'table', title: 'Sharding strategies', head: ['Strategy', 'How', 'Problem'], rows: [
          ['Range', 'Users A–M on shard 1, N–Z on shard 2', 'Hotspots — uneven distribution'],
          ['**Hash**', '`hash(userId) % shardCount`', 'Even; but resharding moves everything'],
          ['**Consistent hashing**', 'Hash onto a ring', 'Adding a shard moves only 1/n of the keys'],
          ['Directory', 'A lookup service maps key → shard', 'Flexible; the directory is a single point of failure'],
          ['Geographic', 'By user region', 'Good for latency and data residency'],
        ]},
        { k: 'note', tone: 'trap', title: 'What sharding costs you', body: 'Once data is on separate databases you lose: **joins across shards** (you now join in application code), **cross-shard transactions** (you now need a saga), **global uniqueness** (auto-increment IDs collide — use UUIDs or a snowflake generator), and **cheap aggregate queries** ("count all orders" becomes a scatter-gather). Naming these costs unprompted is one of the strongest things you can do in this round.' },
      ],
    },
    {
      id: 'hld-cap-consistency',
      name: 'CAP, consistency & consensus',
      week: 18, mins: 130,
      summary: 'What CAP actually says, and the consistency models that matter in practice.',
      blocks: [
        { k: 'p', title: 'CAP, stated correctly', body: [
          'Consistency, Availability, Partition tolerance — pick two. But in a distributed system, network partitions **will** happen, so P is not optional. The real choice is: **when a partition occurs, do you return possibly-stale data (AP) or refuse to answer (CP)?**',
          'Saying "we choose AP" or "we choose CP" is meaningless without "during a partition". Getting that qualifier right immediately marks you as someone who has read past the headline.',
        ]},
        { k: 'analogy', body: 'Two bank branches lose their link to each other. They can either keep serving withdrawals using their last-known balances — available, but someone might overdraw (AP) — or refuse all transactions until the link returns — consistent, but the customers are turned away (CP). No third option exists once the line is cut. Which you choose depends entirely on whether you are running a social feed or a ledger.' },
        { k: 'table', title: 'Consistency models', head: ['Model', 'Guarantee', 'Used by'], rows: [
          ['**Strong**', 'Every read sees the latest write', 'Payments, inventory, bookings'],
          ['**Eventual**', 'Reads converge, eventually', 'Social feeds, view counts, DNS'],
          ['Read-your-writes', 'You always see your own changes', 'Profile edits, comments'],
          ['Monotonic reads', 'You never see time go backwards', 'Message threads'],
          ['Causal', 'Related events stay ordered', 'Comment replies'],
        ]},
        { k: 'note', tone: 'tip', title: 'The answer that works every time', body: 'Do not pick one globally. Pick **per feature**: *"The payment ledger needs strong consistency, so those writes go to the primary with a transaction. The view counter is fine eventually consistent — a few seconds of staleness on a like count costs nothing, and making it strong would cost a lot."* That framing is exactly how real systems are built.' },
        { k: 'p', title: 'Where consensus fits', body: [
          'Raft and Paxos are how a cluster agrees on a value despite failures — leader election, replicated logs. You almost certainly will not implement one, but you should know that this is what makes etcd, ZooKeeper, Kafka\'s controller and most managed databases work, and that consensus requires a **majority quorum**, which is why clusters are sized 3 or 5 rather than 2 or 4.',
        ]},
      ],
    },
    {
      id: 'hld-building-blocks',
      name: 'Consistent hashing, idempotency & ID generation',
      week: 19, mins: 140, tag: 'core',
      summary: 'Three specific techniques that come up in almost every design.',
      blocks: [
        { k: 'p', title: 'Consistent hashing', body: [
          'The problem: with `hash(key) % N` servers, adding one server changes N and **almost every key remaps** — a total cache wipe.',
          'The fix: place servers on a conceptual ring of hash values. A key belongs to the first server clockwise from its hash. Adding a server only steals keys from its immediate neighbour, so roughly **1/n of keys move** rather than all of them. **Virtual nodes** — placing each physical server at many ring positions — keep the distribution even.',
        ]},
        { k: 'analogy', body: 'A clock face with shops placed around it. You walk clockwise from wherever you are to the next shop. Open a new shop and only the customers in the gap just before it change where they go — everyone else\'s walk is unchanged. Modulo hashing, by contrast, is renumbering every house in the city because one shop opened.' },
        { k: 'p', title: 'Idempotency', body: [
          'A network timeout does not tell you whether the request succeeded. So clients retry, and without protection the user is charged twice. **An idempotent operation produces the same result however many times it is applied.**',
        ]},
        { k: 'code', lang: 'java', cap: 'The idempotency key pattern', src: `// The client generates a unique key per logical operation and sends it
// with every retry of that same operation.
@PostMapping("/payments")
public ResponseEntity<PaymentResponse> pay(
        @RequestHeader("Idempotency-Key") String idempotencyKey,
        @RequestBody PaymentRequest request) {

    // Atomic insert — if the key exists, someone already did this.
    Optional<PaymentRecord> existing = repository.findByIdempotencyKey(idempotencyKey);
    if (existing.isPresent()) {
        return ResponseEntity.ok(PaymentResponse.from(existing.get()));  // same answer
    }

    PaymentRecord record = paymentService.process(request, idempotencyKey);
    return ResponseEntity.ok(PaymentResponse.from(record));
}
// The unique constraint on idempotency_key is what makes this safe under
// concurrency — two simultaneous retries, one insert wins, one gets a
// constraint violation and reads the winner's result.` },
        { k: 'table', title: 'Which HTTP methods are naturally idempotent', head: ['Method', 'Idempotent?'], rows: [
          ['GET, HEAD', 'Yes — reads change nothing'],
          ['PUT', 'Yes — sets to a value; doing it twice is the same'],
          ['DELETE', 'Yes — already-deleted stays deleted'],
          ['**POST**', '**No** — this is why it needs an idempotency key'],
          ['PATCH', 'Depends — "set x=5" yes, "increment x" no'],
        ]},
        { k: 'p', title: 'Distributed ID generation', body: [
          'Auto-increment does not work across shards. The options: **UUID** (simple, but 16 bytes and random, which destroys index locality), **Snowflake** (timestamp + machine ID + sequence — 64 bits, roughly sortable by time, the usual answer), or a **ticket server** (a single database handing out ranges — simple, but a single point of failure).',
          'Snowflake is the answer to give: *"64 bits — 41 for a millisecond timestamp, 10 for the machine ID, 12 for a per-millisecond sequence. Sortable by time, no coordination needed, 4 million IDs per second per machine."*',
        ]},
      ],
    },
    {
      id: 'hld-microservices',
      name: 'Microservices & resilience',
      week: 20, mins: 160,
      summary: 'When to split, and the patterns that stop one failure taking everything down.',
      blocks: [
        { k: 'p', title: 'When to split — and when not to', body: [
          'Microservices buy **independent deployment** and **independent scaling**. They cost you distributed transactions, network failure modes, harder debugging, and operational overhead.',
          'The honest position: **start with a well-structured monolith.** Split when a specific team or a specific scaling need demands it. A candidate who says "I would start with a modular monolith and extract services when there is a clear reason" sounds far more senior than one who reaches for twelve services immediately.',
        ]},
        { k: 'table', title: 'The resilience patterns', head: ['Pattern', 'Problem it solves'], rows: [
          ['**Timeout**', 'A hung dependency holding your threads forever. Always set one.'],
          ['**Retry with backoff**', 'Transient failures. Exponential + **jitter**, or you create a thundering herd.'],
          ['**Circuit breaker**', 'A dead dependency being hammered. Fail fast instead of queueing up.'],
          ['**Bulkhead**', 'One slow dependency exhausting the whole thread pool. Isolate pools per dependency.'],
          ['**Fallback**', 'Degrade gracefully — cached data, a default, a partial response.'],
          ['**Rate limiting**', 'Protecting yourself from a caller, and a caller from yourself.'],
        ]},
        { k: 'code', lang: 'java', cap: 'Resilience4j in Spring', src: `@CircuitBreaker(name = "inventory", fallbackMethod = "fallbackStock")
@Retry(name = "inventory")
@TimeLimiter(name = "inventory")
@Bulkhead(name = "inventory")
public CompletableFuture<Stock> getStock(Long productId) {
    return CompletableFuture.supplyAsync(() -> inventoryClient.fetch(productId));
}

// Called when the breaker is open or all retries fail
public CompletableFuture<Stock> fallbackStock(Long productId, Throwable t) {
    log.warn("Inventory unavailable, serving cached", t);
    return CompletableFuture.completedFuture(cachedStock.getOrDefault(productId, Stock.unknown()));
}` },
        { k: 'p', title: 'The circuit breaker states', body: [
          '**Closed** — traffic flows, failures are counted. **Open** — the failure rate crossed the threshold, so all calls fail instantly without touching the dependency, for a cool-off period. **Half-open** — after the cool-off, let a few probe requests through; if they succeed, close; if not, open again.',
          'The point is not to save the caller — it is to stop hammering a struggling service so it can recover, and to fail in 1ms instead of after a 30-second timeout.',
        ]},
        { k: 'p', title: 'The saga pattern', body: [
          'Once data is in separate services, you cannot use a database transaction across them. A **saga** is a sequence of local transactions where each step publishes an event triggering the next, and each step has a **compensating action** to undo it.',
          'Order → reserve inventory → charge payment → ship. If payment fails, the compensating action releases the inventory reservation. There is no rollback; there is only doing the opposite thing afterwards. Mentioning the **transactional outbox** — writing the event to a table in the same transaction as the data, then relaying it — shows you know how to publish events reliably.',
        ]},
      ],
    },
    {
      id: 'hld-case-url-shortener',
      name: 'Case study — URL shortener',
      week: 21, mins: 150, tag: 'core',
      summary: 'The starter case. Learn the framework on this one.',
      blocks: [
        { k: 'list', title: '1. Requirements', items: [
          '**Functional:** shorten a long URL; redirect a short URL; optional custom alias; optional expiry.',
          '**Non-functional:** extremely read-heavy (~100:1), redirect latency under 100ms, highly available, short links never collide.',
          '**Out of scope (agreed aloud):** user accounts, detailed analytics.',
        ]},
        { k: 'code', lang: 'text', cap: '2. Estimation', src: `100M new URLs per month  -> ~40 writes/sec
Read:write of 100:1      -> ~4,000 reads/sec, peak ~12,000

Storage: 100M/month x 500 bytes = 50 GB/month = 3 TB over 5 years
   -> comfortably one database with replicas; no sharding needed yet

Key space: 7 chars of [a-z A-Z 0-9] = 62^7 = ~3.5 trillion
   -> plenty. 6 chars = 56 billion, also probably enough.

Conclusion: read-heavy, small data. This is a CACHING problem,
not a storage problem.` },
        { k: 'code', lang: 'text', cap: '3. API', src: `POST /api/v1/urls
  { "longUrl": "...", "customAlias": "...", "expiresAt": "..." }
  -> 201 { "shortUrl": "https://sho.rt/aB3xY9z" }

GET /{shortCode}
  -> 301 Moved Permanently, Location: <longUrl>
  (301 is cached by the browser -> fewer hits. Use 302 if you need
   every hit for analytics. Say which and why — it is a real trade-off.)

DELETE /api/v1/urls/{shortCode}` },
        { k: 'code', lang: 'sql', cap: '4. Data model', src: `CREATE TABLE urls (
    short_code   VARCHAR(8) PRIMARY KEY,     -- the lookup key
    long_url     TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at   TIMESTAMPTZ,
    creator_id   BIGINT
);
CREATE INDEX idx_urls_expiry ON urls(expires_at) WHERE expires_at IS NOT NULL;

-- Key-value access by short_code with no joins: a KV store (DynamoDB,
-- Cassandra) fits perfectly. Postgres is also completely fine at this scale.` },
        { k: 'p', title: '5. Generating the short code — the interesting decision', body: [
          '**Option A — hash the URL** (MD5, take 7 chars). Deterministic, so the same URL yields the same code. But collisions must be detected and retried, and it leaks nothing useful.',
          '**Option B — a counter, base-62 encoded.** No collisions ever, guaranteed. But codes are sequential and therefore guessable and enumerable, which leaks your total volume.',
          '**Option C (best) — pre-generated key ranges.** A key-generation service hands each app server a block of 10,000 unused keys. No collisions, no coordination on the hot path, no sequential leakage if the blocks are shuffled. This is the answer to give.',
        ]},
        { k: 'code', lang: 'text', cap: '6. The design, and the read path', src: `            ┌─────┐
 Client ──▶ │ CDN │──▶ Load Balancer ──▶ API servers (stateless, ~10)
            └─────┘                            │
                                    ┌──────────┴──────────┐
                                    ▼                     ▼
                              Redis cluster          PostgreSQL
                              (hot short codes)      (primary + 2 replicas)
                                                           ▲
                                     Key Generation Service┘
                                     (pre-allocates blocks)

READ PATH (99% of traffic):
  1. Redis GET short_code    -> ~95% hit rate, <1ms
  2. On miss: read replica, then populate Redis with a TTL
  3. Return 301

WRITE PATH:
  1. Take the next key from the local block
  2. INSERT into the primary
  3. Write to Redis
  4. Return the short URL` },
        { k: 'list', title: '7. Bottlenecks and the 10× answer', items: [
          '**Hot keys** — a viral link. The cache absorbs it; add local in-process caching on each app server for the top N.',
          '**Cache misses at start-up** — a cold Redis sends everything to the DB. Warm it, or roll restarts.',
          '**Database writes** — at 10× (400/sec) still fine for one primary. Beyond that, shard by short_code hash.',
          '**Expiry cleanup** — a background job deleting expired rows in batches, not a giant DELETE.',
          '**Analytics** — do not write a counter on the redirect path. Publish to Kafka and aggregate asynchronously.',
        ]},
      ],
    },
    {
      id: 'hld-case-chat',
      name: 'Case study — chat system (WhatsApp)',
      week: 19, mins: 170,
      summary: 'WebSockets, delivery guarantees, and presence at scale.',
      blocks: [
        { k: 'list', title: 'Requirements', items: [
          '**Functional:** 1:1 messaging, group chat, delivery receipts (sent/delivered/read), online presence, message history, offline delivery.',
          '**Non-functional:** low latency (<200ms), messages never lost, ordering preserved within a conversation, 50M daily actives.',
        ]},
        { k: 'p', title: 'The core decision: how does the server push?', body: [
          '**Polling** — the client asks every few seconds. Simple; wasteful and slow. **Long polling** — the request hangs until there is data. Better; still heavy. **WebSocket** — a persistent bidirectional connection. The right answer for chat, and what you should propose.',
          'The consequence: connections are **stateful**. Each user is connected to one specific server, so the system needs a way to find which one. That is the interesting part of this design.',
        ]},
        { k: 'code', lang: 'text', cap: 'The architecture', src: `Client ──WebSocket──▶ ┌──────────────────┐
                      │ Chat Servers     │   (stateful — holds live sockets)
                      │  (many)          │
                      └────────┬─────────┘
                               │
     ┌──────────────┬──────────┼───────────┬────────────────┐
     ▼              ▼          ▼           ▼                ▼
 Redis           Kafka     Cassandra   Notification    Presence
 (userId ->      (message  (message    Service         Service
  serverId)      queue)     history)   (APNs/FCM       (Redis, TTL
                                        for offline)    heartbeats)

SENDING A MESSAGE:
  1. A sends over its WebSocket to chat server 1
  2. Server 1 persists to Cassandra (durability BEFORE ack)
  3. Server 1 acks A  -> "sent" tick
  4. Look up B in Redis: which server holds B's socket?
  5. If online: forward to server 4, which pushes to B -> "delivered"
  6. If offline: queue it, and send a push notification` },
        { k: 'code', lang: 'sql', cap: 'The data model — partitioning is the whole trick', src: `-- Cassandra. Partition by conversation so one conversation's messages
-- live together on one node, and clustering gives free ordering.
CREATE TABLE messages (
    conversation_id  UUID,
    message_id       TIMEUUID,      -- time-ordered ID
    sender_id        UUID,
    content          TEXT,
    created_at       TIMESTAMP,
    PRIMARY KEY ((conversation_id), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
-- "Give me the last 50 messages" is now a single-partition sequential read.
-- This is the single most important modelling decision in the design.

CREATE TABLE user_conversations (
    user_id          UUID,
    last_message_at  TIMESTAMP,
    conversation_id  UUID,
    unread_count     INT,
    PRIMARY KEY ((user_id), last_message_at, conversation_id)
) WITH CLUSTERING ORDER BY (last_message_at DESC);
-- The inbox list, sorted, in one read.` },
        { k: 'list', title: 'The deep dives they will push on', items: [
          '**Ordering** — do not trust client clocks. Use a server-assigned sequence number per conversation, or a TIMEUUID. Clients sort on that.',
          '**Delivery receipts** — three states, each a separate event: sent (server persisted), delivered (recipient\'s device acked), read (recipient opened it).',
          '**Groups** — for small groups, fan out on write to each member\'s inbox. For very large groups, fan out on read instead, or the write amplification kills you.',
          '**Presence** — a heartbeat every 30s into Redis with a 60s TTL. Key absent means offline. Do **not** broadcast presence to everyone; only to users with an open chat window.',
          '**Offline** — messages queue in Cassandra; on reconnect the client sends its last-seen message ID and gets everything after it.',
          '**Encryption** — end-to-end means the server stores ciphertext and cannot search it. Mention that trade-off; it also rules out server-side search.',
        ]},
      ],
    },
    {
      id: 'hld-case-newsfeed',
      name: 'Case study — news feed (Twitter/Instagram)',
      week: 21, mins: 170,
      summary: 'Fan-out on write vs read. The celebrity problem, and the hybrid answer.',
      blocks: [
        { k: 'p', title: 'The single decision this design turns on', body: [
          '**Fan-out on write (push):** when someone posts, immediately copy the post ID into every follower\'s precomputed feed. Reading a feed is then one fast lookup. But a user with 50 million followers triggers 50 million writes for one tweet.',
          '**Fan-out on read (pull):** store posts once. Build the feed at read time by fetching from everyone the user follows and merging. Writes are trivial; reads are expensive and slow.',
        ]},
        { k: 'table', title: 'The trade-off, laid out', head: ['', 'Fan-out on write', 'Fan-out on read'], rows: [
          ['Read latency', 'Very fast (precomputed)', 'Slow (merge at request time)'],
          ['Write cost', 'O(followers) — brutal for celebrities', 'O(1)'],
          ['Storage', 'High — duplicated per follower', 'Low'],
          ['Best for', 'Normal users', 'Celebrities'],
        ]},
        { k: 'note', tone: 'tip', title: 'The answer is hybrid, and saying so is the point', body: '*"Fan-out on write for normal users — that covers 99% of accounts and gives fast reads. For accounts above a threshold, say 100,000 followers, skip the fan-out entirely. At read time, take the user\'s precomputed feed and merge in the recent posts of the few celebrities they follow. That bounds the merge to a handful of extra fetches while keeping the common case fast."* That is the expected answer and it is what Twitter actually does.' },
        { k: 'code', lang: 'text', cap: 'The architecture', src: `POST ──▶ API ──▶ Post Service ──▶ Postgres/Cassandra (source of truth)
                       │
                       └──▶ Kafka "new-post" ──▶ Fan-out Workers
                                                      │
                                          is author a celebrity?
                                          ┌───────────┴───────────┐
                                         NO                      YES
                                          │                       │
                              push post_id into each      do nothing —
                              follower's Redis feed       merged at read time
                              (capped at ~800 entries)

READ FEED:
  1. Redis LRANGE user_feed:{id} 0 50      -> post IDs, precomputed
  2. Merge in recent posts from followed celebrities
  3. Rank (recency, engagement, affinity)
  4. Hydrate: batch-fetch post content + author from cache
  5. Return` },
        { k: 'list', title: 'Deep dives', items: [
          '**Feed cap** — store only ~800 entries per feed. Nobody scrolls further; older is served from the DB.',
          '**Hydration** — feeds store IDs, not content. Batch-fetch the content so editing a post does not require rewriting every feed.',
          '**Ranking** — chronological is simplest. Ranked needs a scoring service; mention it, do not design an ML system unless asked.',
          '**New follow** — backfill that user\'s feed asynchronously; do not block the follow request.',
          '**Thundering herd on a celebrity post** — the fan-out is async through Kafka, so it degrades as lag rather than as errors.',
        ]},
      ],
    },
    {
      id: 'hld-case-payment',
      name: 'Case study — payment system',
      week: 22, mins: 170, tag: 'core',
      summary: 'Where consistency is non-negotiable. Idempotency, ledgers, and sagas.',
      blocks: [
        { k: 'p', body: [
          'Payments are the case study where **strong consistency wins over availability**, and where every distributed-systems trap has real money attached. It is also the one where naming idempotency, double-entry ledgers and reconciliation immediately marks you as serious.',
        ]},
        { k: 'list', title: 'Requirements', items: [
          '**Functional:** accept a payment, handle multiple methods, refunds, transaction history, webhooks from providers.',
          '**Non-functional:** never double-charge, never lose a transaction, auditable forever, consistency over availability.',
        ]},
        { k: 'code', lang: 'sql', cap: 'The double-entry ledger — the core idea', src: `-- Never store a mutable "balance" column. Store immutable ENTRIES and
-- derive the balance. Every transaction writes at least two rows that
-- sum to zero, so the books can always be proven correct.

CREATE TABLE ledger_entries (
    id              BIGSERIAL PRIMARY KEY,
    transaction_id  UUID NOT NULL,
    account_id      BIGINT NOT NULL,
    amount          BIGINT NOT NULL,      -- in the smallest unit (paise). NEVER float.
    direction       VARCHAR(6) NOT NULL,  -- DEBIT | CREDIT
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    -- no UPDATE, no DELETE. Ever. Corrections are new reversing entries.
);
CREATE INDEX idx_ledger_account ON ledger_entries(account_id, created_at);

CREATE TABLE payments (
    id               UUID PRIMARY KEY,
    idempotency_key  VARCHAR(64) NOT NULL UNIQUE,   -- the double-charge guard
    amount           BIGINT NOT NULL,
    currency         CHAR(3) NOT NULL,
    status           VARCHAR(20) NOT NULL,  -- PENDING|AUTHORIZED|CAPTURED|FAILED|REFUNDED
    provider_ref     VARCHAR(128),
    version          INT NOT NULL DEFAULT 0,        -- optimistic locking
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);` },
        { k: 'code', lang: 'text', cap: 'The flow and the saga', src: `1. Client POSTs with an Idempotency-Key
2. Payment Service: INSERT payment (PENDING). Unique key -> a duplicate
   retry hits the constraint and returns the ORIGINAL result.
3. Call the provider (Stripe/Razorpay) with our payment ID as their
   idempotency key too — so their retries are safe as well.
4. Provider responds, OR times out.
5. On timeout: DO NOT retry blindly. Query the provider for the status
   of that idempotency key. This is the step people miss.
6. Write ledger entries + update status in ONE database transaction.
7. Publish a "payment.captured" event via the transactional outbox.

SAGA for an order:
   reserve inventory -> charge payment -> ship
   payment fails     -> COMPENSATE: release the inventory reservation
   shipping fails    -> COMPENSATE: refund the payment
   There is no rollback across services. Only compensating actions.` },
        { k: 'list', title: 'The things that earn marks here', items: [
          '**Money as integers** — store paise/cents as `BIGINT`, never a float or double.',
          '**Idempotency at both ends** — your key from the client, and your ID sent to the provider.',
          '**Timeout ≠ failure** — always reconcile by querying, never by retrying blind.',
          '**Immutable ledger** — corrections are reversing entries, never updates. This is what makes an audit possible.',
          '**Reconciliation job** — a nightly comparison of your ledger against the provider\'s settlement file. Real payment systems live or die on this and almost no candidate mentions it.',
          '**Webhooks are unreliable** — they arrive late, out of order, and more than once. Handle them idempotently and verify the signature.',
        ]},
      ],
    },
    {
      id: 'hld-case-others',
      name: 'Case studies — four more, sketched',
      week: 22, mins: 200,
      summary: 'Notification service, job scheduler, e-commerce, video streaming.',
      blocks: [
        { k: 'p', title: 'Notification service', body: [
          '**Core:** an API accepts a notification request, writes to Kafka, and channel workers (email, SMS, push) consume and deliver.',
          '**The interesting parts:** user preferences and opt-outs checked before sending; **deduplication** so a retry does not send twice; **rate limiting per user** so a bug cannot send 500 emails; template rendering with versioning; a **priority queue** so an OTP is never stuck behind a marketing batch; retries with a dead-letter queue; and delivery-status tracking via provider webhooks.',
        ]},
        { k: 'p', title: 'Distributed job scheduler', body: [
          '**Core:** jobs with a schedule (cron or one-off), workers that pick them up, and exactly-one-execution semantics.',
          '**The interesting parts:** how do you stop two workers running the same job? A **database row lock** (`SELECT … FOR UPDATE SKIP LOCKED`) is the simple, correct answer for moderate scale, or a distributed lock in Redis. For scale, shard jobs by hash across worker groups. Use a **time-bucketed index** so "what is due in the next minute" is one indexed query rather than a scan. Handle worker death with a lease and a heartbeat, so an abandoned job is reclaimed after its lease expires.',
        ]},
        { k: 'p', title: 'E-commerce checkout', body: [
          '**The hard problem is inventory under contention** — a flash sale where 10,000 people want 100 items.',
          '**Approaches:** optimistic locking with a version column and a retry (simple, fine for normal load); a **Redis atomic decrement** as a fast reservation gate in front of the database (handles flash sales); or a **queue-based** approach where checkout requests are serialised per SKU. Reservations must have a TTL so abandoned carts release stock. Then the order flow is a saga: reserve → pay → confirm, with compensation at each step.',
        ]},
        { k: 'p', title: 'Video streaming (YouTube/Netflix)', body: [
          '**Upload path:** client uploads to object storage (S3) via a pre-signed URL — never through your API servers. That triggers a **transcoding pipeline** which produces multiple bitrates and resolutions, chunked into segments.',
          '**Playback path:** an adaptive bitrate manifest (HLS/DASH) lists the available renditions; the player picks based on measured bandwidth and switches mid-stream. Segments are served from a **CDN**, which is doing essentially all the work — the origin sees almost no playback traffic.',
          '**Metadata** lives in a normal database. **View counts** are eventually consistent, aggregated from a stream. The key insight to state: *this is a CDN and storage problem, not a compute problem* — and transcoding is the only expensive part, so it is asynchronous and queued.',
        ]},
        { k: 'note', tone: 'tip', title: 'How to practise these', body: 'Do not read them. **Set a 45-minute timer, talk out loud to a camera, and design one from scratch** using the framework. Then watch it back and compare against the notes here. Reading system design and doing system design are almost unrelated skills, and only the second one is tested.' },
      ],
    },
  ],
}
