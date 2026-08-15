/**
 * The 26-week block. Three lanes run in parallel so a bad week costs a change
 * of lane rather than a stop. Mastery-gated, not calendar-gated: the schedule
 * is a guide with slack, not a debt you fall behind on.
 */

export const rhythm = [
  { when: 'Weekdays 05:45–07:00', hours: '6.25 hrs', what: 'Problems, AI off, narrated out loud. Before work, because it is the only slot nobody else can claim. Evening study fails for tired people with jobs — this is the highest-impact logistical choice in the plan.' },
  { when: 'Weekdays 21:00–21:30', hours: '2.5 hrs', what: 'The depth lane — Java, Spring, SQL, system design. Reading, not solving. Low-energy work that survives a hard day.' },
  { when: 'Daily, 10 minutes', hours: '1.2 hrs', what: 'Explain one thing you learned that day, out loud, to a camera, no notes. Watch one recording a week. This is your entire communication programme.' },
  { when: 'Saturday, 3 hours', hours: '3 hrs', what: 'One timed machine-coding build or system design case. Clock running, uninterrupted, as if it were real.' },
  { when: 'Sunday morning, 1 hour', hours: '1 hr', what: 'Re-solve the three problems you failed. Update the journal and the tracker. Plan next week.' },
  { when: 'Sunday afternoon', hours: 'Off', what: 'Nothing. Scheduled, not earned. The people who burn out at Week 14 are the ones who skipped this at Week 3.' },
]

export const phases = [
  {
    no: 'Phase 0 · Week 0',
    name: 'Unblock',
    goal: 'No new problems. Clear the one topic that most often ends an attempt, and set up the machinery.',
    weeks: [
      { n: 0, dsa: 'The complexity drill: 5 already-solved easy problems a day, two lines each. 35 total.',
        depth: 'Read the six rules and the lookup table until you can reproduce the table from memory.',
        design: 'Pick ONE sheet. Start the pattern journal. Build the tracker. Resume draft one.',
        mile: { tag: 'Gate', text: 'Given any of ten unseen code snippets, you state time and space correctly within ten seconds. Do not start Week 1 until this is true.' } },
    ],
  },
  {
    no: 'Phase 1 · Weeks 1–8',
    name: 'Foundations',
    goal: 'Tier-1 patterns, one per week, plus Java core. The slowest and most important phase — do not rush it.',
    weeks: [
      { n: 1, dsa: 'Arrays & prefix sums.', depth: 'OOP that gets tested; Collections — which structure, and why.', design: 'Journal page 1. Record your 90-second "tell me about yourself".' },
      { n: 2, dsa: 'Two pointers.', depth: 'HashMap internals — **build one from scratch**. Java release train.', design: 'Journal page 2. Frontend: semantic HTML.' },
      { n: 3, dsa: 'Sliding window.', depth: 'equals/hashCode, immutability, records. **Java 8**: lambdas, streams, java.time.', design: 'Journal page 3. Frontend: CSS box model, flexbox, grid.' },
      { n: 4, dsa: 'Hashing — map and set patterns.', depth: 'Generics and PECS. Java 9–11: collection factories, `var`, HttpClient.', design: 'Journal page 4. Frontend: responsive CSS, units, container queries.',
        mile: { tag: 'Gate', text: 'Four patterns, four journal pages, and every Week 1–2 problem re-solved cold. Slip a week here if you need it — this is the phase worth extending.' } },
      { n: 5, dsa: 'Binary search + binary search on the answer.', depth: 'Streams and collectors, Optional as a return type.', design: 'Journal page 5. Frontend: JS scope, closures, `this`.' },
      { n: 6, dsa: '**Sorting — implement merge sort and quicksort by hand.**', depth: 'Exceptions. Java 12–17: switch expressions, text blocks, records, sealed.', design: 'Journal page 6. Frontend: the event loop, promises, async/await.' },
      { n: 7, dsa: 'Stack & monotonic stack; queue & deque.', depth: 'Concurrency I & II: pools, synchronized, volatile, locks, deadlock.', design: 'Journal page 7. Frontend: ES6+, destructuring, optional chaining.' },
      { n: 8, dsa: 'Linked list, then consolidation — re-solve everything from Weeks 1–7.', depth: 'Concurrency III: ConcurrentHashMap, CompletableFuture. **Java 21: virtual threads.**', design: 'Journal page 8. Frontend: DOM, event delegation.',
        mile: { tag: 'Benchmark', text: 'One unseen easy-medium in 30 minutes, AI off, narrated, complexity stated confidently at the end.' } },
    ],
  },
  {
    no: 'Phase 2 · Weeks 9–16',
    name: 'Structures & backend depth',
    goal: 'Tier-2 patterns, Spring internals, SQL — and your first real interviews at the end, deliberately at companies you do not want.',
    weeks: [
      { n: 9, dsa: 'Recursion foundations. Take two weeks if needed — this is where people break.', depth: 'JVM: heap vs stack, GC basics, class loading.', design: 'SOLID, each principle against code you have actually written.' },
      { n: 10, dsa: 'Trees I: traversals, depth, construction.', depth: 'Spring IoC, DI, bean lifecycle, AOP and proxies.', design: 'Patterns: Strategy, Factory.' },
      { n: 11, dsa: 'Trees II: BST, LCA, views, validation.', depth: '@Transactional: propagation, isolation, the four silent failures.', design: 'Patterns: Observer, Builder, State. Machine coding: Parking Lot.' },
      { n: 12, dsa: 'Heaps & priority queues.', depth: 'JPA/Hibernate: persistence context, dirty checking, mapping traps.', design: 'Machine coding: LRU cache, ATM.',
        mile: { tag: 'Gate', text: 'Halfway. Every Phase-1 pattern still solvable cold, and one machine-coding build finished end to end.' } },
      { n: 13, dsa: 'Graphs I: representation, BFS, DFS.', depth: 'SQL I: joins, subqueries, CTEs, window functions.', design: 'Machine coding: Splitwise, timed at 90 minutes.' },
      { n: 14, dsa: 'Graphs II: topological sort, union-find.', depth: 'SQL II: indexes, composite indexes, execution plans.', design: 'Machine coding: rate limiter, logger.',
        mile: { tag: 'Action', text: 'Resume goes out. Ask five people for referrals. This is the week — not when you feel ready, which is never.' } },
      { n: 15, dsa: 'Backtracking: subsets, permutations, N-queens.', depth: 'SQL III: ACID, isolation levels, deadlocks, optimistic vs pessimistic locking.', design: 'Machine coding: elevator system.' },
      { n: 16, dsa: 'Consolidation. No new pattern — re-solve across Weeks 9–15.', depth: 'Spring Security: filter chain, JWT, OAuth2.', design: 'Machine coding: vending machine, notification service.',
        mile: { tag: 'Action', text: 'Two real interviews, deliberately at companies you do not want. You will do badly. That is the deliverable — a free, precise diagnostic no self-study can imitate.' } },
    ],
  },
  {
    no: 'Phase 3 · Weeks 17–22',
    name: 'DP & system design',
    goal: 'The hardest DSA topic and the round you have never sat, together. Three weeks on DP because it deserves three.',
    weeks: [
      { n: 17, dsa: 'DP I: the idea, then 1-D — stairs, house robber, coin change.', depth: 'HLD framework, estimation, load balancing, caching.', design: 'Case study: URL shortener. Weekly mock interviews begin.' },
      { n: 18, dsa: 'DP II: knapsack, subset sum, LIS.', depth: 'Sharding, replication, CAP, consistent hashing, idempotency.', design: 'Case studies: rate limiter, notification system.' },
      { n: 19, dsa: 'DP III: grid paths, string DP, edit distance.', depth: '**Kafka**: partitions, consumer groups, offsets, retries, DLQ.', design: 'Case study: chat system. Cloud fundamentals.' },
      { n: 20, dsa: 'Greedy, intervals.', depth: 'Kafka delivery guarantees. Docker: containerise your own service.', design: 'Case studies: e-commerce, food delivery. AWS core services.',
        mile: { tag: 'Action', text: 'Applications to the companies you actually want. Aim for offers landing inside one two-week window.' } },
      { n: 21, dsa: 'Tries, bit manipulation, mixed timed sets.', depth: '**Redis**: caching patterns, distributed locks. Kubernetes & CI/CD.', design: 'Case studies: news feed, payment. Frontend: React core.' },
      { n: 22, dsa: 'Mixed timed sets — whatever the mocks exposed.', depth: 'Microservices, resilience, observability, debugging a latency regression.', design: 'Case studies: job scheduler, video streaming. Frontend: React hooks.',
        mile: { tag: 'Benchmark', text: 'A 45-minute system design, out loud, recorded: estimation → API → data model → scale → trade-offs.' } },
    ],
  },
  {
    no: 'Phase 4 · Weeks 23–26',
    name: 'Convert',
    goal: 'No new core material. These weeks are driven by activity — onsites, post-mortems, negotiation — not by topics, so the reading load drops to almost nothing on purpose.',
    weeks: [
      { n: 23, dsa: 'Re-solve 30 known problems from memory. Nothing new from here.', depth: 'Read your own journal, cover to cover. That is the revision.', design: 'Eight STAR stories. Rehearse the six answers. Optional: React rendering & state, if a full-stack round is booked.' },
      { n: 24, dsa: 'One a day, purely to stay warm.', depth: 'Company-specific: their stack, their scale, their engineering blog.', design: 'Onsites. A written post-mortem after every single round.' },
      { n: 25, dsa: 'One a day.', depth: 'Patch whatever the last round exposed. Same day, while it stings.', design: 'Onsites. Rehearse the compensation conversation out loud.' },
      { n: 26, dsa: 'Maintenance only.', depth: '—', design: 'Negotiate. Compare. Sign.',
        mile: { tag: 'Rule', text: 'Do not accept the first offer without a second in hand. This one rule is worth more than any single week of study above.' } },
    ],
  },
]

export const checkpoints = [
  { week: 'WEEK 00', what: 'Ten unseen snippets, complexity stated correctly in ten seconds each.' },
  { week: 'WEEK 08', what: 'One unseen easy-medium in 30 minutes, AI off, narrated, complexity stated.' },
  { week: 'WEEK 12', what: 'One machine-coding build finished end to end. Phase-1 patterns still cold-solvable.' },
  { week: 'WEEK 16', what: 'Two real interviews sat. Two written post-mortems.' },
  { week: 'WEEK 22', what: 'A 45-minute system design, out loud, recorded, end to end.' },
  { week: 'WEEK 26', what: 'Two offers in hand. Then negotiate.' },
]

export const quitModes = [
  { name: 'Mode one', says: '"There is too much. I will never finish all this."', fix: '**Overwhelm.** Cut to one lane for seven days — morning problems only, drop the rest. The block survives a stripped week easily; it does not survive you quitting. Shrink the scope, never the streak.' },
  { name: 'Mode two', says: '"This is boring. Same thing every day."', fix: '**Boredom.** Switch lanes, do not stop. Sick of DP? Build a machine-coding problem instead. Three lanes exist precisely so boredom costs a change of subject rather than a change of plan.' },
  { name: 'Mode three', says: '"I have got nothing left after work."', fix: '**Depletion.** Take the scheduled rest day, then take a second. Then move the slot earlier — depletion is nearly always an evening-study problem. Under-slept practice at 11pm builds nothing and costs tomorrow too.' },
  { name: 'Mode four', says: '"I am not actually getting any better."', fix: '**Invisible progress.** Sit a timed mock. You almost certainly have improved — you cannot feel it because your baseline moved with you. That is what the Week 8, 12 and 22 benchmarks are for: external evidence for the days your own judgement is unreliable.' },
  { name: 'Mode five · yours', says: '"Everyone else gets this faster than me."', fix: '**Comparison.** The only honest comparison is you against you last month, and the journal is the record. Someone finishing a sheet in eight weeks and forgetting it by month four has learned less than you will. Nobody asks your solve rate in an interview.' },
]

export const laws = [
  '**Never miss twice.** One skipped day is noise. Two consecutive is a new pattern forming. This is the only rule here you cannot break, and it matters more than any topic in the schedule.',
  '**The twenty-five minute floor.** On the worst possible day: open the editor, one easy problem, close it. Continuity is worth more than volume, because continuity is what makes Week 22 exist at all.',
  '**Falling behind the calendar is allowed. Stopping is not.** This plan has slack in it deliberately. Arriving at Week 26 having done twenty-two weeks of work is a complete success.',
  '**Find one other person.** One engineer doing the same thing, one twenty-minute call a week, both reporting numbers. Solo preparation over six months fails far more often than paired.',
  '**Re-read the arithmetic.** An hour spent here returns something like ten times what an hour at your desk pays. On the mornings it feels pointless, that ratio is exactly as true as it was on the mornings it felt obvious.',
]

/**
 * Deliberately expressed as ratios rather than absolute figures, so the
 * numbers hold whatever your current compensation is. Substitute your own.
 */
export const economics = [
  ['A typical step-up at this level', '**+40% to +90%** on current compensation'],
  ['Take the mid-point', '+60%'],
  ['Cumulative, over three years before the next switch', '≈ **1.8×** one full year of your current salary'],
  ['Cost of this block', '≈ 340 hours'],
  ['Return per hour studied', '≈ **8× to 19×** your effective hourly rate'],
  ['At the mid-point', '≈ 13× — one hour of study outearns a full day at your desk'],
]

export const economicsNote =
  'Work it out for yourself once, with your own numbers, and write it somewhere you will see it. ' +
  'The point is not the precision — it is that the ratio is large enough to survive a bad week.'
