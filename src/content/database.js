export const database = {
  id: 'database',
  name: 'Databases & SQL',
  icon: '⛁',
  blurb: 'Consistently underestimated and consistently tested. Joins, window functions, indexes, execution plans, isolation levels and locking.',
  weeks: 'Weeks 12–16 (evenings)',
  topics: [
    {
      id: 'db-joins',
      name: 'Joins',
      week: 12, mins: 140, tag: 'core',
      summary: 'The four joins, drawn properly, plus the self-join everyone forgets.',
      blocks: [
        { k: 'table', title: 'The four', head: ['Join', 'Returns'], rows: [
          ['`INNER JOIN`', 'Only rows with a match on both sides'],
          ['`LEFT JOIN`', 'All left rows; NULLs where the right has no match'],
          ['`RIGHT JOIN`', 'All right rows (rare — people rewrite as LEFT)'],
          ['`FULL OUTER JOIN`', 'Everything from both sides'],
          ['`CROSS JOIN`', 'Every combination — use deliberately, never by accident'],
        ]},
        { k: 'code', lang: 'sql', cap: 'The queries you will be asked to write', src: `-- Customers and their orders (only customers who ordered)
SELECT c.name, o.id, o.total
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;

-- ALL customers, including those with no orders
SELECT c.name, COALESCE(SUM(o.total), 0) AS lifetime_value
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;

-- Customers who have NEVER ordered — the anti-join
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;                     -- the match failed

-- SELF JOIN: employees and their managers, from one table
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;` },
        { k: 'note', tone: 'trap', title: 'WHERE vs ON in a LEFT JOIN', body: 'Putting a condition on the *right* table in the `WHERE` clause silently turns a LEFT JOIN into an INNER JOIN, because the NULL rows fail the condition and get filtered out. If you want to filter the right table while keeping unmatched left rows, the condition belongs in the `ON` clause. This is one of the most reliable SQL interview questions.' },
        { k: 'code', lang: 'sql', cap: 'The trap, demonstrated', src: `-- BROKEN: acts as an INNER JOIN. Customers with no 2026 orders vanish.
SELECT c.name, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= '2026-01-01';

-- CORRECT: the filter moves into ON, so unmatched customers survive with NULL.
SELECT c.name, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
                   AND o.created_at >= '2026-01-01';` },
      ],
    },
    {
      id: 'db-aggregation',
      name: 'GROUP BY, HAVING & subqueries',
      week: 14, mins: 130,
      summary: 'Aggregation, and the WHERE/HAVING distinction that gets tested every time.',
      blocks: [
        { k: 'code', lang: 'sql', cap: 'Order of operations matters', src: `-- Departments with more than 5 employees earning over 50k on average
SELECT d.name, COUNT(*) AS headcount, AVG(e.salary) AS avg_salary
FROM employees e
JOIN departments d ON d.id = e.department_id
WHERE e.status = 'ACTIVE'        -- filters ROWS, before grouping
GROUP BY d.id, d.name
HAVING COUNT(*) > 5              -- filters GROUPS, after aggregation
   AND AVG(e.salary) > 50000
ORDER BY avg_salary DESC;

-- SQL logical execution order (NOT the order you write it):
-- FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT
-- This is why you cannot use a SELECT alias in WHERE, but CAN in ORDER BY.` },
        { k: 'code', lang: 'sql', cap: 'Subqueries and CTEs', src: `-- Correlated subquery: runs once per outer row. Readable, often slow.
SELECT e.name, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(salary) FROM employees
                  WHERE department_id = e.department_id);

-- CTE (WITH): the same thing, far more readable and usually faster
WITH dept_avg AS (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
)
SELECT e.name, e.salary, d.avg_salary
FROM employees e
JOIN dept_avg d ON d.department_id = e.department_id
WHERE e.salary > d.avg_salary;

-- RECURSIVE CTE: walk a hierarchy (org chart, category tree)
WITH RECURSIVE org AS (
    SELECT id, name, manager_id, 1 AS level
    FROM employees WHERE manager_id IS NULL        -- anchor: the top
  UNION ALL
    SELECT e.id, e.name, e.manager_id, o.level + 1  -- recurse downward
    FROM employees e
    JOIN org o ON e.manager_id = o.id
)
SELECT * FROM org ORDER BY level;` },
        { k: 'note', tone: 'tip', title: 'WHERE vs HAVING, in one line', body: '`WHERE` filters **rows before grouping**; `HAVING` filters **groups after aggregating**. You cannot use `COUNT(*)` in WHERE because the count does not exist yet at that point in the pipeline. Say it exactly like that.' },
      ],
    },
    {
      id: 'db-window-functions',
      name: 'Window functions',
      week: 15, mins: 150, tag: 'core',
      summary: 'Ranking and running totals without collapsing rows. The senior SQL signal.',
      blocks: [
        { k: 'p', body: [
          'A window function computes across a set of related rows *without* collapsing them the way GROUP BY does. Every row keeps its identity and gains an extra computed column.',
          'This is the clearest dividing line between "writes basic SQL" and "actually knows SQL" in an interview.',
        ]},
        { k: 'analogy', body: 'A class list where you want each pupil\'s own mark *and* their rank in the class *and* the class average, all on the same row. GROUP BY gives you one row per class and loses the pupils. A window function keeps every pupil and adds the class-level facts alongside.' },
        { k: 'code', lang: 'sql', cap: 'The functions worth knowing', src: `SELECT
    name,
    department,
    salary,

    -- RANKING: the difference between these three is asked constantly
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,
    RANK()       OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dense_rnk,

    -- AGGREGATES without collapsing
    AVG(salary)  OVER (PARTITION BY department) AS dept_avg,
    SUM(salary)  OVER (PARTITION BY department
                       ORDER BY hired_at
                       ROWS UNBOUNDED PRECEDING)  AS running_total,

    -- NAVIGATION: previous and next row
    LAG(salary)  OVER (PARTITION BY department ORDER BY hired_at) AS prev_hire_salary,
    LEAD(salary) OVER (PARTITION BY department ORDER BY hired_at) AS next_hire_salary
FROM employees;

-- ROW_NUMBER: 1,2,3,4    (always unique)
-- RANK:       1,2,2,4    (ties share, then it SKIPS)
-- DENSE_RANK: 1,2,2,3    (ties share, no gap)` },
        { k: 'code', lang: 'sql', cap: 'The classic: top N per group', src: `-- Top 3 highest-paid employees in each department
WITH ranked AS (
    SELECT name, department, salary,
           ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
    FROM employees
)
SELECT name, department, salary
FROM ranked
WHERE rn <= 3;

-- Note: you cannot filter on a window function in WHERE directly —
-- windows are computed AFTER WHERE. That is why the CTE is needed.

-- Second highest salary overall (a very common question)
SELECT DISTINCT salary
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS r
      FROM employees) t
WHERE r = 2;

-- Month-over-month growth
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_month,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / LAG(revenue) OVER (ORDER BY month), 2) AS growth_pct
FROM monthly_revenue;` },
        { k: 'note', tone: 'tip', title: 'The pattern to memorise', body: '"Top N per group", "the latest row per customer", "rank within category" — all the same shape: a CTE with `ROW_NUMBER() OVER (PARTITION BY … ORDER BY …)`, then filter on the row number. Recognising that one pattern covers a large fraction of SQL interview questions.' },
      ],
    },
    {
      id: 'db-indexes',
      name: 'Indexes',
      week: 14, mins: 170, tag: 'core',
      summary: 'How they work, when they help, and why more is not better.',
      blocks: [
        { k: 'p', body: [
          'An index is a sorted structure (almost always a B-tree) that maps column values to row locations. Without one, finding a row means scanning every row. With one, the database does the equivalent of a binary search.',
          'The cost: every index must be updated on every INSERT, UPDATE and DELETE, and it consumes disk. Indexes make reads fast and writes slower.',
        ]},
        { k: 'analogy', body: 'The index at the back of a textbook. Finding every mention of "polymorphism" without one means reading all 800 pages. With one, you look it up alphabetically and jump straight to three page numbers. But if the book were being rewritten daily, keeping the index accurate would be most of the work — which is exactly the trade-off on a write-heavy table.' },
        { k: 'code', lang: 'sql', cap: 'Creating the right indexes', src: `-- Single column
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- COMPOSITE: column order is critical. This index serves:
--   WHERE customer_id = ?
--   WHERE customer_id = ? AND status = ?
--   WHERE customer_id = ? AND status = ? AND created_at > ?
-- It does NOT serve:  WHERE status = ?        (skips the leading column)
CREATE INDEX idx_orders_lookup ON orders(customer_id, status, created_at);

-- COVERING index: includes everything the query needs, so the database
-- never touches the table at all. "Index-only scan."
CREATE INDEX idx_covering ON orders(customer_id, status) INCLUDE (total);

-- PARTIAL: index only the rows you actually query. Much smaller.
CREATE INDEX idx_active ON orders(created_at) WHERE status = 'ACTIVE';

-- UNIQUE: an index that also enforces a constraint
CREATE UNIQUE INDEX idx_email ON users(LOWER(email));` },
        { k: 'note', tone: 'trap', title: 'The leftmost-prefix rule', body: 'A composite index on `(a, b, c)` can be used for queries filtering on `a`, on `a, b`, or on `a, b, c` — but **not** for `b` alone or `c` alone. Think of a phone book sorted by surname then first name: finding "Kumar" is easy, finding everyone called "Rajesh" regardless of surname is not. Column order is the single most important decision when creating a composite index.' },
        { k: 'list', title: 'Things that silently disable an index', items: [
          '**A function on the column** — `WHERE UPPER(email) = ?` cannot use an index on `email`. Create a functional index instead.',
          '**Leading wildcard** — `LIKE \'%smith\'` cannot use a B-tree. `LIKE \'smith%\'` can.',
          '**Type mismatch** — comparing a varchar column to a number forces an implicit cast and a scan.',
          '**Low selectivity** — an index on a boolean or a status with 3 values is often ignored; a scan is cheaper than the index lookup plus row fetches.',
          '**`OR` across different columns** — often cannot use either index; rewrite as `UNION`.',
        ]},
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Why not index every column?', a: 'Because every index is a write amplifier — an insert into a table with eight indexes does nine writes, not one. Indexes also consume memory in the buffer pool, competing with the data itself, and the query planner takes longer with more options. The right approach is to index what your actual query patterns need, and periodically drop indexes with zero usage (`pg_stat_user_indexes` on Postgres will tell you).' },
          { q: 'Clustered vs non-clustered index?', a: 'A clustered index determines the *physical order of the rows on disk*, so there can only be one — in MySQL InnoDB the primary key is always clustered. A non-clustered index is a separate structure pointing back at the rows. Range scans on a clustered index are very fast because the rows are physically adjacent.' },
        ]},
      ],
    },
    {
      id: 'db-explain',
      name: 'Execution plans',
      week: 15, mins: 140,
      summary: 'Reading EXPLAIN. The skill that answers "why is this query slow?"',
      blocks: [
        { k: 'code', lang: 'sql', cap: 'Reading a plan', src: `EXPLAIN ANALYZE
SELECT o.id, c.name
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'PENDING' AND o.created_at > '2026-01-01';

-- Read the output BOTTOM-UP and INSIDE-OUT. Key things to look for:
--
--   Seq Scan on orders          <- BAD on a big table: no index used
--   Index Scan using idx_...    <- GOOD
--   Index Only Scan             <- BEST: never touched the table
--   Bitmap Heap Scan            <- OK: many matching rows
--
--   rows=1000 ... actual rows=980000
--        ^ ESTIMATE vs REALITY. A big gap means stale statistics —
--          run ANALYZE, because the planner is choosing badly.
--
--   Nested Loop    <- fine for small row counts, disastrous for large
--   Hash Join      <- good for large joins
--   Merge Join     <- good when both sides are already sorted` },
        { k: 'list', ordered: true, title: 'The debugging routine for "this query is slow"', items: [
          '`EXPLAIN ANALYZE` it. Do not guess.',
          'Find the node with the largest actual time, working from the inside out.',
          'Is it a sequential scan on a large table? A missing index is the likely cause.',
          'Is the row estimate wildly different from the actual? Run `ANALYZE` to refresh statistics.',
          'Are you selecting columns you do not need? A covering index may make it index-only.',
          'Is it an N+1 from the application rather than one slow query? Check the query *count*, not just the duration.',
          'Only then consider denormalisation, caching or a materialised view.',
        ]},
        { k: 'note', tone: 'tip', title: 'The answer they are listening for', body: 'When asked "a query got slow, what do you do?", the wrong answer is "add an index". The right answer is a *process*: reproduce, measure with EXPLAIN ANALYZE, identify the expensive node, form a hypothesis, change one thing, re-measure. Interviewers are testing whether you debug systematically or by superstition.' },
      ],
    },
    {
      id: 'db-transactions',
      name: 'Transactions, ACID & isolation',
      week: 16, mins: 160, tag: 'core',
      summary: 'What the isolation levels actually prevent, with concrete examples.',
      blocks: [
        { k: 'table', title: 'ACID', head: ['Property', 'Means'], rows: [
          ['**Atomicity**', 'All of it happens, or none of it does'],
          ['**Consistency**', 'Constraints hold before and after'],
          ['**Isolation**', 'Concurrent transactions do not corrupt each other'],
          ['**Durability**', 'Once committed, it survives a crash'],
        ]},
        { k: 'table', title: 'The three read anomalies', head: ['Anomaly', 'What happens'], rows: [
          ['**Dirty read**', 'You read data another transaction wrote but has not committed — it may roll back'],
          ['**Non-repeatable read**', 'You read the same row twice in one transaction and get different values'],
          ['**Phantom read**', 'You run the same query twice and get different *numbers of rows*'],
        ]},
        { k: 'table', title: 'Isolation levels', head: ['Level', 'Dirty', 'Non-repeatable', 'Phantom', 'Default in'], rows: [
          ['READ UNCOMMITTED', 'Possible', 'Possible', 'Possible', '—'],
          ['READ COMMITTED', 'Prevented', 'Possible', 'Possible', 'PostgreSQL, Oracle, SQL Server'],
          ['REPEATABLE READ', 'Prevented', 'Prevented', 'Possible*', 'MySQL InnoDB'],
          ['SERIALIZABLE', 'Prevented', 'Prevented', 'Prevented', '—'],
        ]},
        { k: 'code', lang: 'sql', cap: 'The classic lost-update race, and both fixes', src: `-- THE BUG: two people book the last seat at the same time
-- T1: SELECT seats FROM flights WHERE id=1;   -> 1
-- T2: SELECT seats FROM flights WHERE id=1;   -> 1
-- T1: UPDATE flights SET seats = 0 WHERE id=1;
-- T2: UPDATE flights SET seats = 0 WHERE id=1;
-- Two bookings, one seat.

-- FIX A — PESSIMISTIC locking: take the row lock up front.
BEGIN;
SELECT seats FROM flights WHERE id = 1 FOR UPDATE;   -- blocks the other txn
UPDATE flights SET seats = seats - 1 WHERE id = 1;
COMMIT;

-- FIX B — OPTIMISTIC locking: no lock, detect the conflict at write time.
UPDATE flights
SET seats = seats - 1, version = version + 1
WHERE id = 1 AND version = 7;      -- 0 rows updated => someone beat us, retry

-- FIX C — let the database do it atomically where possible:
UPDATE flights SET seats = seats - 1 WHERE id = 1 AND seats > 0;` },
        { k: 'note', tone: 'tip', title: 'Optimistic or pessimistic?', body: '**Optimistic** (a version column, JPA `@Version`) when conflicts are rare — no locks held, better throughput, but the caller must handle a retry. **Pessimistic** (`SELECT … FOR UPDATE`) when conflicts are likely or a retry is unacceptable — correctness is guaranteed but throughput drops and you risk deadlocks. Naming both, and choosing based on *expected contention*, is the senior answer.' },
      ],
    },
    {
      id: 'db-modelling',
      name: 'Modelling, normalisation & scaling',
      week: 16, mins: 150,
      summary: 'Normal forms in practice, when to denormalise, and how databases scale.',
      blocks: [
        { k: 'table', title: 'Normalisation, practically', head: ['Form', 'Rule', 'In plain terms'], rows: [
          ['1NF', 'Atomic values', 'No comma-separated lists in a column'],
          ['2NF', '1NF + no partial dependency', 'Non-key columns depend on the *whole* key'],
          ['3NF', '2NF + no transitive dependency', 'Non-key columns depend on *nothing but* the key'],
        ]},
        { k: 'note', tone: 'tip', title: 'The one-liner', body: '*"Every non-key column depends on the key, the whole key, and nothing but the key."* That sentence is 3NF, and 3NF is where real systems live. Beyond that is usually academic.' },
        { k: 'p', title: 'When to break the rules deliberately', body: [
          'Normalisation optimises for correct writes. Reads pay for it in joins. Denormalise when a read path is genuinely hot and the join cost is measured, not imagined — storing `order.customer_name` alongside `customer_id`, or keeping a `comment_count` on the post rather than counting every time.',
          'The price is that you now own the consistency problem: something must update the copy. Say that trade-off out loud whenever you propose denormalising.',
        ]},
        { k: 'table', title: 'Scaling a database, in order of what you should try', head: ['Step', 'What it does', 'Cost'], rows: [
          ['**Index & query tuning**', 'Often 10–100× for free', 'Almost none — always start here'],
          ['**Caching (Redis)**', 'Takes reads off the DB entirely', 'Invalidation complexity'],
          ['**Vertical scaling**', 'A bigger machine', 'Money; a hard ceiling'],
          ['**Read replicas**', 'Reads to copies, writes to primary', 'Replication lag — stale reads'],
          ['**Partitioning**', 'Split one big table by range or list', 'Query patterns must align'],
          ['**Sharding**', 'Split data across separate databases', 'Big complexity jump — last resort'],
        ]},
        { k: 'table', title: 'SQL vs NoSQL', head: ['Choose SQL when', 'Choose NoSQL when'], rows: [
          ['Relationships and joins matter', 'Documents are self-contained'],
          ['You need real transactions', 'Eventual consistency is acceptable'],
          ['The schema is stable', 'The schema varies per record'],
          ['Ad-hoc querying is required', 'Access patterns are known and fixed'],
          ['(Postgres, MySQL)', '(MongoDB, DynamoDB, Cassandra)'],
        ]},
        { k: 'note', tone: 'warn', title: 'The honest answer about NoSQL', body: 'Most systems that "needed NoSQL for scale" would have been fine on Postgres with proper indexing — a single well-tuned Postgres instance handles tens of thousands of transactions per second. Choose NoSQL for a genuine *data model* fit (documents, wide-column time series, key-value at extreme scale), not as a reflex for scale. Interviewers respect that answer far more than enthusiasm.' },
      ],
    },
  ],
}
