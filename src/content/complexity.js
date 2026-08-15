export const complexity = {
  id: 'complexity',
  name: 'Complexity & Big-O',
  icon: '∑',
  blurb: 'This looks like mathematics, which is why it stops so many people. It is not — there is no formula and nothing to choose, you count loops. Do this section before any DSA.',
  weeks: 'Week 0',
  topics: [
    {
      id: 'cx-what-it-is',
      name: 'What Big-O actually is',
      week: 0, mins: 30, tag: 'core',
      summary: 'One question, one answer. No mathematics involved.',
      blocks: [
        { k: 'p', title: 'The whole idea', body: [
          'Big-O answers exactly one question: **if the input gets twice as big, roughly how much more work does this code do?**',
          'That is it. It is not a calculation you perform. It is a label you recognise by looking at the shape of the code. You will never derive anything, and no interviewer has ever asked anyone to.',
        ]},
        { k: 'note', tone: 'info', title: 'It looks harder than it is — here is why', body: 'Textbooks teach complexity with summations, limits and the Master Theorem, because textbooks are teaching *analysis of algorithms* as a branch of mathematics. That is a real subject and you do not need one page of it. The interview version has **five rules and a lookup table**, and that is genuinely all of it. Anyone who has found this confusing was almost certainly shown the university version of something that has a much smaller working version — which is a teaching problem, not a you problem.' },
        { k: 'analogy', body: 'Think about how long it takes to find a name in a phone book. Reading every page from the start — if the book doubles in size, it takes twice as long. That is O(n). Opening in the middle and throwing away half each time — if the book doubles, it takes just *one extra step*. That is O(log n). You did not calculate either of those. You reasoned about the shape of the search. That is the entire skill.' },
        { k: 'p', title: 'Why anyone cares', body: [
          'On a small input everything is fast, so complexity looks academic. It stops being academic at scale. An O(n²) solution on 10,000 items does 100 million operations — a few seconds. On 100,000 items it does 10 billion — several minutes. The O(n log n) version handles both without noticing.',
          'In an interview, complexity is how you prove you know *why* your solution is good, not just that it works. Getting the right answer with no complexity statement scores far worse than you would expect.',
        ]},
        { k: 'note', tone: 'tip', title: 'What you have to be able to do', body: 'Look at code, say a phrase like "this is O(n log n) time, O(n) space", and give a one-clause reason for each. Ten seconds, no hesitation. That is the entire bar.' },
      ],
    },
    {
      id: 'cx-counting-loops',
      name: 'Rule 1 — count the loops',
      week: 0, mins: 40, tag: 'core',
      summary: 'The rule that covers most code you will ever write.',
      blocks: [
        { k: 'p', body: [
          'Look at how many times the code walks over the input. That count *is* the answer.',
        ]},
        { k: 'table', head: ['What you see', 'Answer', 'Name'], rows: [
          ['No loop at all', 'O(1)', 'constant'],
          ['One loop over the input', 'O(n)', 'linear'],
          ['A loop inside a loop, both over the input', 'O(n²)', 'quadratic'],
          ['Three nested loops', 'O(n³)', 'cubic'],
        ]},
        { k: 'code', lang: 'java', cap: 'Each of these, read in five seconds', src: `// O(1) — no loop. Same work whether the array has 5 or 5 million items.
int first(int[] a) {
    return a[0];
}

// O(n) — one loop over n items.
int sum(int[] a) {
    int total = 0;
    for (int x : a) {   // runs n times
        total += x;
    }
    return total;
}

// O(n^2) — a loop inside a loop, both over n.
boolean hasDuplicateSlow(int[] a) {
    for (int i = 0; i < a.length; i++) {        // n times
        for (int j = i + 1; j < a.length; j++) { // ~n times each
            if (a[i] == a[j]) return true;
        }
    }
    return false;
}` },
        { k: 'note', tone: 'warn', title: 'The one that catches people', body: 'The inner loop above starts at `i + 1`, so it does not run the full n times — it averages about n/2. It is **still O(n²)**. Constants get thrown away (Rule 5). Do not try to be precise; precision is not what is being measured.' },
        { k: 'p', title: 'Loops that are not over n', body: [
          'A loop that runs a fixed number of times — `for (int i = 0; i < 26; i++)` over the alphabet, or over a 3×3 board — is **O(1)**, not O(n). It does not grow with the input. This trips people up constantly: it is a loop, so it *feels* like O(n), but the count never changes no matter how big the input gets.',
        ]},
        { k: 'code', lang: 'java', cap: 'A loop that is still O(1)', src: `// O(1) — 26 is a constant, it does not depend on the input size.
boolean isAnagram(int[] countsA, int[] countsB) {
    for (int i = 0; i < 26; i++) {
        if (countsA[i] != countsB[i]) return false;
    }
    return true;
}` },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'What is the complexity of two loops one after the other, not nested?', a: 'O(n). The first does n work, the second does n work, total 2n — and constants are dropped, so O(n). Nested loops multiply; sequential loops add, and then the addition disappears.' },
          { q: 'Is a loop that runs n/2 times O(n) or O(n/2)?', a: 'O(n). There is no such thing as O(n/2) in an interview answer — the 1/2 is a constant factor and gets dropped. Saying "O(n/2)" signals you have not internalised the rule.' },
        ]},
      ],
    },
    {
      id: 'cx-log-n',
      name: 'Rule 2 — halving is log n',
      week: 0, mins: 35, tag: 'core',
      summary: 'The one that looks like maths and is not.',
      blocks: [
        { k: 'p', body: [
          'If every step throws away **half** of what remains, the complexity is O(log n). That is the complete definition for interview purposes. You do not need to know what a logarithm is.',
        ]},
        { k: 'analogy', body: 'You are guessing a number I picked between 1 and 1,000,000. If you guess one at a time, worst case is a million guesses. If you always guess the middle and I tell you higher or lower, you throw away half the range every guess — and you will always find it in **20 guesses**. Now make it a *billion*: still only 30 guesses. A thousand times more data costs you ten extra steps. That gap between "a million" and "20" is the entire reason anyone cares about log n.' },
        { k: 'table', title: 'Get a feel for how flat it is', head: ['Input size n', 'Steps for O(log n)', 'Steps for O(n)'], rows: [
          ['1,000', '~10', '1,000'],
          ['1,000,000', '~20', '1,000,000'],
          ['1,000,000,000', '~30', '1,000,000,000'],
        ]},
        { k: 'code', lang: 'java', cap: 'Binary search — the canonical O(log n)', src: `// The array must already be sorted.
int binarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;   // avoids integer overflow

        if (a[mid] == target) return mid;

        if (a[mid] < target) {
            lo = mid + 1;   // throw away the left half
        } else {
            hi = mid - 1;   // throw away the right half
        }
    }
    return -1;   // not found
}` },
        { k: 'cx', time: 'O(log n)', space: 'O(1)', why: 'Half the remaining range is discarded on every pass, and only a few loose variables are created.' },
        { k: 'list', title: 'Where O(log n) shows up', items: [
          'Binary search on a sorted array',
          'Searching, inserting or deleting in a balanced BST (`TreeMap`, `TreeSet`)',
          'Push or pop on a heap / `PriorityQueue`',
          'Repeatedly dividing a number by 2 (digit counting, fast exponentiation)',
        ]},
        { k: 'note', tone: 'tip', title: 'The giveaway in code', body: 'Look for `/2`, `>> 1`, `mid`, or a `while` loop whose variable is halved. If the search space shrinks by half each pass, write O(log n) and move on.' },
      ],
    },
    {
      id: 'cx-combining',
      name: 'Rules 3–5 — combining and simplifying',
      week: 0, mins: 35, tag: 'core',
      summary: 'Sorting is always n log n. Nested multiplies, sequential adds. Then throw away the small stuff.',
      blocks: [
        { k: 'p', title: 'Rule 3 — sorting is always O(n log n)', body: [
          'If your solution sorts anything, the answer is **at least** O(n log n), no matter what else happens. `Arrays.sort()`, `Collections.sort()`, `list.sort()`, `stream().sorted()` — all O(n log n).',
          'Memorise this single fact and you never have to think about it again. It is also the most common way an interview answer goes wrong: people write an O(n) loop, sort at the top, and then confidently say "O(n)".',
        ]},
        { k: 'p', title: 'Rule 4 — nested multiplies, sequential adds', body: [
          'Something inside a loop **multiplies**. Something after a loop **adds**.',
        ]},
        { k: 'code', lang: 'java', cap: 'Multiplying and adding', src: `// MULTIPLY: binary search (log n) done inside a loop (n) => O(n log n)
int countPairs(int[] a, int[] sorted) {
    int count = 0;
    for (int x : a) {                       // n times
        if (binarySearch(sorted, -x) >= 0)  // log n work each time
            count++;
    }
    return count;                            // n * log n
}

// ADD: two loops one after the other => n + n => O(n)
int addThenAdd(int[] a) {
    int s = 0;
    for (int x : a) s += x;      // n
    for (int x : a) s += x * 2;  // n
    return s;                     // n + n = 2n -> O(n)
}

// BOTH: sort (n log n) then one loop (n) => n log n + n -> O(n log n)
int afterSorting(int[] a) {
    Arrays.sort(a);              // n log n   <-- the big term
    int best = 0;
    for (int i = 1; i < a.length; i++)  // n
        best = Math.max(best, a[i] - a[i - 1]);
    return best;                  // n log n wins
}` },
        { k: 'p', title: 'Rule 5 — drop constants and smaller terms', body: [
          'Only the biggest term survives, and no numbers ever appear in the final answer.',
        ]},
        { k: 'table', head: ['You worked out', 'You say'], rows: [
          ['O(3n)', 'O(n)'],
          ['O(n + 5)', 'O(n)'],
          ['O(n/2)', 'O(n)'],
          ['O(2n + 100)', 'O(n)'],
          ['O(n² + n)', 'O(n²)'],
          ['O(n log n + n)', 'O(n log n)'],
          ['O(n + m)', 'O(n + m) — keep it, these are two *different* inputs'],
        ]},
        { k: 'note', tone: 'warn', title: 'The exception worth knowing', body: 'When there are **two different inputs**, keep both letters. Merging two arrays of sizes n and m is O(n + m), not O(n). Traversing a graph is O(V + E) — vertices and edges are separate things and neither one bounds the other. Only collapse terms that measure the same input.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'You sort the array, then do a single pass. What is the complexity?', a: 'O(n log n). The sort dominates: n log n + n collapses to n log n. This is the single most common complexity question and the most common wrong answer ("O(n)").' },
          { q: 'Why do we drop constants? A 100n algorithm is genuinely slower than an n algorithm.', a: 'Because Big-O measures how something *scales*, not how fast it runs. Constants depend on hardware, language and compiler — n log n beats 100n eventually no matter what machine you use, and "eventually" is what Big-O describes. In practice you mention constants separately: "both are O(n), but this one has a much smaller constant."' },
        ]},
      ],
    },
    {
      id: 'cx-space',
      name: 'Rule 6 — space complexity',
      week: 0, mins: 30, tag: 'core',
      summary: 'Count what you created, not what you were handed.',
      blocks: [
        { k: 'p', body: [
          'Space complexity asks: **how much extra memory does this use as the input grows?**',
          'The key word is *extra*. The input itself does not count — you did not create it, it was handed to you. Only the memory your code allocates counts.',
        ]},
        { k: 'table', head: ['What you created', 'Space'], rows: [
          ['A few loose variables (`int i`, `int sum`)', 'O(1)'],
          ['A `HashMap` that could hold every element', 'O(n)'],
          ['A new array the same size as the input', 'O(n)'],
          ['A 2-D DP table n × m', 'O(n × m)'],
          ['Recursion that goes n calls deep', 'O(n) — the call stack is memory'],
          ['Recursion on a balanced tree, height h', 'O(h), which is O(log n) when balanced'],
        ]},
        { k: 'code', lang: 'java', cap: 'Same problem, two different space profiles', src: `// O(n) time, O(1) space — nothing allocated that grows with n.
int maxTwoPointer(int[] a) {
    int best = Integer.MIN_VALUE;
    for (int x : a) best = Math.max(best, x);
    return best;
}

// O(n) time, O(n) space — the HashSet can end up holding every element.
boolean hasDuplicate(int[] a) {
    Set<Integer> seen = new HashSet<>();   // <-- this is the O(n) space
    for (int x : a) {
        if (!seen.add(x)) return true;
    }
    return false;
}` },
        { k: 'note', tone: 'trap', title: 'Recursion is not free', body: 'Recursive code often looks like it allocates nothing, but every pending call sits on the stack holding its local variables. Recursing n deep is O(n) space even with no data structure in sight. This is why a recursive tree traversal is O(h) space — and why it can blow the stack on a degenerate tree shaped like a linked list.' },
        { k: 'p', title: 'The trade-off you will be asked to make', body: [
          'Almost every interview problem has a slow-but-tiny solution and a fast-but-hungry one. The classic: find two numbers that sum to a target. Nested loops is O(n²) time, O(1) space. A HashMap is O(n) time, O(n) space. You bought speed with memory.',
          'Saying that trade-off out loud, unprompted, is one of the strongest signals you can send in a coding round.',
        ]},
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Your solution sorts the input in place. Is that O(1) space?', a: 'Careful — it depends on the sort. In Java, `Arrays.sort()` on primitives is a dual-pivot quicksort using O(log n) stack space, and on objects it is Timsort using O(n). "In place" does not automatically mean O(1). The honest interview answer is "O(log n) auxiliary for primitives".' },
          { q: 'Does the output count towards space complexity?', a: 'By convention, no — if a problem asks you to return an array of n results, that array is not counted as extra space. Only working memory counts. Say this explicitly if it comes up; it shows you know the convention rather than getting lucky.' },
        ]},
      ],
    },
    {
      id: 'cx-every-complexity',
      name: 'Every complexity, with code',
      week: 0, mins: 60, tag: 'core',
      summary: 'One or two short examples for each class, so you can recognise every one on sight.',
      blocks: [
        { k: 'p', body: [
          'The rules so far cover the common cases. This page shows **every complexity class you will meet**, each with the smallest piece of code that produces it. Read the code first, guess the answer, then read the reason.',
          'You do not need to memorise these. You need to have *seen* them, so that the shape is familiar when it appears inside a bigger problem.',
        ]},

        { k: 'code', lang: 'java', cap: 'O(1) — constant. The work never changes.', src: `// One operation, regardless of size.
int first(int[] a)              { return a[0]; }
int lookup(Map<String,Integer> m, String k) { return m.get(k); }
void push(Deque<Integer> s, int x)          { s.push(x); }

// Still O(1) — the loop count is FIXED, it does not depend on the input.
boolean sameLetterCounts(int[] countsA, int[] countsB) {
    for (int i = 0; i < 26; i++) {          // 26 is a constant
        if (countsA[i] != countsB[i]) return false;
    }
    return true;
}` },
        { k: 'cx', time: 'O(1)', space: 'O(1)', why: 'The number of steps is fixed. Doubling the input changes nothing.' },

        { k: 'code', lang: 'java', cap: 'O(log n) — logarithmic. Each step discards half.', src: `// Binary search: the classic.
int binarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;   // discard the left half
        else                 hi = mid - 1;   // discard the right half
    }
    return -1;
}

// Doubling UP is the same shape as halving DOWN.
int countDoublings(int n) {
    int count = 0;
    for (int i = 1; i < n; i *= 2) count++;   // 1,2,4,8,16... reaches n in log n steps
    return count;
}` },
        { k: 'cx', time: 'O(log n)', space: 'O(1)', why: 'Halving a million takes ~20 steps; halving a billion takes ~30. Ten times the data costs ten extra steps.' },

        { k: 'code', lang: 'java', cap: 'O(√n) — square root. Rare, but it does appear.', src: `// Primality check: you only need to test divisors up to sqrt(n),
// because any factor above sqrt(n) has a partner below it.
boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; (long) i * i <= n; i++) {   // stops at sqrt(n)
        if (n % i == 0) return false;
    }
    return true;
}

// Same shape: find all divisors of n
List<Integer> divisors(int n) {
    List<Integer> out = new ArrayList<>();
    for (int i = 1; (long) i * i <= n; i++) {
        if (n % i == 0) {
            out.add(i);
            if (i != n / i) out.add(n / i);      // add the partner
        }
    }
    return out;
}` },
        { k: 'cx', time: 'O(√n)', space: 'O(1)', why: 'The loop runs to the square root of n, not to n. For n = 1,000,000 that is 1,000 iterations instead of a million.' },

        { k: 'code', lang: 'java', cap: 'O(n) — linear. One pass.', src: `int sum(int[] a) {
    int total = 0;
    for (int x : a) total += x;              // n iterations
    return total;
}

// Two pointers is still ONE pass — each pointer moves at most n times.
boolean isPalindrome(String s) {
    int lo = 0, hi = s.length() - 1;
    while (lo < hi) {
        if (s.charAt(lo++) != s.charAt(hi--)) return false;
    }
    return true;
}

// TWO loops one after the other: n + n = 2n -> still O(n)
int twoPasses(int[] a) {
    int max = Integer.MIN_VALUE, sum = 0;
    for (int x : a) max = Math.max(max, x);   // n
    for (int x : a) sum += x;                  // n
    return max + sum;
}` },
        { k: 'cx', time: 'O(n)', space: 'O(1)', why: 'Each element is touched a constant number of times. Sequential loops add, and constants are dropped.' },

        { k: 'code', lang: 'java', cap: 'O(n log n) — the sorting class. Two ways to get here.', src: `// WAY 1: you sorted something.
int biggestGap(int[] a) {
    Arrays.sort(a);                          // n log n  <-- dominates
    int best = 0;
    for (int i = 1; i < a.length; i++)       // n
        best = Math.max(best, a[i] - a[i-1]);
    return best;
}

// WAY 2: log-n work, done n times.
int countPairs(int[] a, int[] sortedOther) {
    int count = 0;
    for (int x : a) {                              // n times
        if (binarySearch(sortedOther, -x) >= 0)    // log n each
            count++;
    }
    return count;                                   // n * log n
}

// WAY 3: divide and conquer — split in half (log n levels),
// do O(n) work merging at each level.
void mergeSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid);           // half
    mergeSort(a, mid + 1, hi);       // other half
    merge(a, lo, mid, hi);           // O(n) work at this level
}` },
        { k: 'cx', time: 'O(n log n)', space: 'O(n) for merge sort', why: 'log n levels of splitting, O(n) work per level. Or: n iterations each doing log n work.' },

        { k: 'code', lang: 'java', cap: 'O(n²) — quadratic. A loop inside a loop over the same input.', src: `// Brute-force: check every pair.
boolean hasPairSummingTo(int[] a, int target) {
    for (int i = 0; i < a.length; i++) {          // n
        for (int j = i + 1; j < a.length; j++) {  // ~n
            if (a[i] + a[j] == target) return true;
        }
    }
    return false;
}
// Still O(n^2) even though the inner loop averages n/2 — constants are dropped.

// Bubble sort, for completeness.
void bubbleSort(int[] a) {
    for (int i = 0; i < a.length; i++)
        for (int j = 0; j < a.length - 1 - i; j++)
            if (a[j] > a[j+1]) { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }
}` },
        { k: 'cx', time: 'O(n²)', space: 'O(1)', why: 'n outer iterations × n inner iterations. At n = 100,000 that is 10 billion operations — it will time out.' },

        { k: 'code', lang: 'java', cap: 'O(n³) — cubic. Three nested loops.', src: `// Naive matrix multiplication of two n x n matrices.
int[][] multiply(int[][] A, int[][] B, int n) {
    int[][] C = new int[n][n];
    for (int i = 0; i < n; i++)                 // n
        for (int j = 0; j < n; j++)             // n
            for (int k = 0; k < n; k++)         // n
                C[i][j] += A[i][k] * B[k][j];
    return C;                                    // n * n * n
}` },
        { k: 'cx', time: 'O(n³)', space: 'O(n²)', why: 'Three nested loops multiply. The result matrix is n × n, which is the space.' },

        { k: 'code', lang: 'java', cap: 'O(n × m) — TWO different inputs. Do not collapse this to n².', src: `// Two different strings: n and m are independent.
int editDistance(String a, String b) {
    int n = a.length(), m = b.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 0; i <= n; i++)          // n+1
        for (int j = 0; j <= m; j++)      // m+1
            dp[i][j] = compute(i, j);
    return dp[n][m];                       // n * m cells
}

// A GRID is rows x cols, NOT "n squared".
int countLand(char[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int count = 0;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid[r][c] == '1') count++;
    return count;                          // rows * cols
}

// Merging two sorted arrays: O(n + m), not O(n)
int[] merge(int[] a, int[] b) {
    int[] out = new int[a.length + b.length];
    int i = 0, j = 0, k = 0;
    while (i < a.length && j < b.length)
        out[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
    while (i < a.length) out[k++] = a[i++];
    while (j < b.length) out[k++] = b[j++];
    return out;                            // n + m
}` },
        { k: 'note', tone: 'trap', title: 'Keep both letters', body: 'When there are **two independent inputs**, keep both in the answer. A grid is **O(rows × cols)**, not O(n²) — they are different dimensions and one does not bound the other. Merging two arrays is **O(n + m)**, not O(n). Collapsing them is wrong and interviewers notice, because it means you have not identified what actually varies.' },

        { k: 'code', lang: 'java', cap: 'O(V + E) — graphs. Vertices plus edges.', src: `// BFS/DFS visits every vertex once, and looks at every edge once.
void bfs(List<List<Integer>> graph, int start) {
    boolean[] visited = new boolean[graph.size()];
    Queue<Integer> q = new LinkedList<>();
    q.offer(start);
    visited[start] = true;

    while (!q.isEmpty()) {
        int node = q.poll();                       // each VERTEX dequeued once -> V

        for (int next : graph.get(node)) {         // each EDGE examined once -> E
            if (!visited[next]) {
                visited[next] = true;
                q.offer(next);
            }
        }
    }
}` },
        { k: 'p', title: 'Why it is V + E and not V²', body: [
          'The outer `while` runs once per vertex — that is the **V**. The inner `for` does not run V times; it runs once per *neighbour*, and across the whole traversal every edge is examined exactly once (twice for an undirected graph, which is still O(E)). So the totals add rather than multiply: **V + E**.',
          'It would be O(V²) with an **adjacency matrix**, because then finding a vertex\'s neighbours means scanning all V entries of its row, whether or not those edges exist. That is the entire practical argument for adjacency lists.',
          'For a **grid**, V = rows × cols and E ≈ 4V (each cell has up to four neighbours), so O(V + E) simplifies to just **O(rows × cols)**.',
        ]},
        { k: 'cx', time: 'O(V + E)', space: 'O(V)', why: 'Every vertex is queued once, every edge examined once. Space is the visited array plus the queue.' },

        { k: 'code', lang: 'java', cap: 'O(2ⁿ) — exponential. Two choices per element.', src: `// ALL SUBSETS: for each element you either take it or skip it.
// n elements x 2 choices = 2^n possible subsets.
void subsets(int[] nums, int i, List<Integer> cur, List<List<Integer>> out) {
    if (i == nums.length) {
        out.add(new ArrayList<>(cur));
        return;
    }
    subsets(nums, i + 1, cur, out);            // CHOICE 1: skip nums[i]

    cur.add(nums[i]);
    subsets(nums, i + 1, cur, out);            // CHOICE 2: take nums[i]
    cur.remove(cur.size() - 1);
}

// NAIVE FIBONACCI: two recursive calls per level, n levels deep.
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);            // branches into 2, every time
}
// fib(50) makes about 2^50 calls. That is roughly a thousand trillion.
// Adding a cache makes it O(n). That is the whole of dynamic programming.` },
        { k: 'cx', time: 'O(2ⁿ)', space: 'O(n)', why: 'Two branches at each of n levels gives 2ⁿ leaves. Space is only the recursion depth — one path at a time is on the stack.' },
        { k: 'note', tone: 'tip', title: 'The tell', body: 'A recursive function that calls itself **twice** and shrinks by one each time is O(2ⁿ). If you see that shape and the input is larger than about 40, the intended answer is memoisation — which turns 2ⁿ into n by never recomputing the same subproblem.' },

        { k: 'code', lang: 'java', cap: 'O(n!) — factorial. Every possible ordering.', src: `// ALL PERMUTATIONS: n choices for the first slot, n-1 for the second,
// n-2 for the third... = n x (n-1) x (n-2) x ... x 1 = n!
void permute(int[] nums, boolean[] used, List<Integer> cur, List<List<Integer>> out) {
    if (cur.size() == nums.length) {
        out.add(new ArrayList<>(cur));
        return;
    }
    for (int i = 0; i < nums.length; i++) {    // shrinking choice set
        if (used[i]) continue;

        used[i] = true;  cur.add(nums[i]);
        permute(nums, used, cur, out);
        cur.remove(cur.size() - 1);  used[i] = false;
    }
}
// n = 10 -> 3.6 million orderings.  n = 15 -> 1.3 trillion.
// This is why permutation problems always have tiny constraints.` },
        { k: 'cx', time: 'O(n! × n)', space: 'O(n)', why: 'n! orderings, and copying each completed permutation costs O(n). The honest answer is O(n! × n); saying O(n!) is accepted.' },

        { k: 'code', lang: 'java', cap: 'Amortised O(1) — usually free, occasionally expensive.', src: `// How ArrayList.add() works underneath:
class GrowableArray {
    private int[] data = new int[10];
    private int size = 0;

    void add(int value) {
        if (size == data.length) {
            // EXPENSIVE: allocate a bigger array and copy everything. O(n).
            data = Arrays.copyOf(data, data.length * 2);
        }
        data[size++] = value;      // CHEAP: O(1), which is almost every call
    }
}

// Adding 1000 items: 990 calls are O(1), and the ~10 resizes copy
// 10 + 20 + 40 + ... + 512 items in total, which is under 2000 operations.
// Spread across 1000 calls, that averages out to a constant.
// -> AMORTISED O(1).` },
        { k: 'note', tone: 'info', title: 'What "amortised" means', body: 'The *average cost per operation over a long sequence*, not the worst case of a single operation. A single `add` can be O(n) when it resizes; a thousand `add` calls together are O(n) total, so each one averages O(1). The same reasoning explains why the sliding-window template is O(n) despite having a nested `while` — each element enters and leaves the window at most once across the whole run.' },
      ],
    },
    {
      id: 'cx-lookup-table',
      name: 'The complete lookup table',
      week: 0, mins: 25, tag: 'core',
      summary: 'Every complexity you will ever state, on one page.',
      blocks: [
        { k: 'p', body: [
          'This is not a starting point. This is the whole thing — every complexity that will come out of your mouth in every interview you sit.',
        ]},
        { k: 'table', head: ['What the code does', 'Answer', 'Typical examples'], rows: [
          ['HashMap get/put, array index, arithmetic', 'O(1)', 'Lookup, swap, push/pop a stack'],
          ['Cheap almost always, occasionally copies', 'O(1) amortised', '`ArrayList.add`, sliding window, union-find'],
          ['Throws away half the data each step', 'O(log n)', 'Binary search, balanced BST, heap push/pop'],
          ['Loops only as far as the square root', 'O(√n)', 'Primality test, listing divisors'],
          ['One pass over the input', 'O(n)', 'Single loop, two pointers, sliding window'],
          ['Sorts, or does log-n work n times', 'O(n log n)', 'Any sort, heap of n items, merge intervals'],
          ['Nested loop over the same input', 'O(n²)', 'Brute-force pairs, naive substring search'],
          ['Fills a table over **two different** inputs', 'O(n × m)', 'Grid traversal, edit distance, LCS'],
          ['Visits every vertex and every edge', 'O(V + E)', 'BFS, DFS, topological sort'],
          ['Three nested loops', 'O(n³)', 'Naive matrix multiplication, Floyd–Warshall'],
          ['Recursion branching in two, depth n', 'O(2ⁿ)', 'Naive fibonacci, all subsets, power set'],
          ['Every ordering of the input', 'O(n!)', 'Permutations, brute-force travelling salesman'],
        ]},
        { k: 'note', tone: 'info', title: 'Each one has worked code', body: 'Every row above is demonstrated with a short runnable example in **[Every complexity, with code](#/t/cx-every-complexity)** — the page immediately before this one. Read the code, guess the answer, then check. That is far more effective than memorising the table.' },
        { k: 'note', tone: 'tip', title: 'What a full-marks answer sounds like', body: 'Two clauses, each one "the complexity, because the reason": *"It is **O(n) time** because I go through the array once, and **O(n) space** because the HashMap could end up holding every element."* That is complete. There is no follow-up mathematics. If the interviewer pushes, they push on "can you do better" — which is an algorithm question, not a maths question.' },
        { k: 'p', title: 'What is realistically achievable', body: [
          'A useful sanity check while solving: given the constraints, what complexity do they want? If n is up to 10⁵, an O(n²) solution does 10¹⁰ operations and will time out — they want O(n log n) or better. If n is only 20, they probably *do* want the exponential backtracking solution.',
        ]},
        { k: 'table', title: 'Constraint → target complexity', head: ['n up to', 'Aim for'], rows: [
          ['10–20', 'O(2ⁿ) or O(n!) is fine — they want backtracking'],
          ['500', 'O(n³) is fine'],
          ['5,000', 'O(n²) is fine'],
          ['10⁵ – 10⁶', 'O(n log n) or O(n)'],
          ['10⁹', 'O(log n) or O(1) — you cannot even read the input'],
        ]},
      ],
    },
    {
      id: 'cx-notations',
      name: 'The other notations — a short walkthrough',
      week: 0, mins: 30,
      summary: 'Big-O is the only one you will use. Here is what Ω, Θ and the rest mean, so nothing surprises you.',
      blocks: [
        { k: 'p', body: [
          'Interviews use **Big-O** and almost nothing else. But the other notations show up in textbooks and occasionally in a follow-up question, so it is worth twenty minutes to make sure none of them can throw you.',
          'All of them answer the same underlying question — *how does the cost grow?* — they just describe **different kinds of bound**.',
        ]},
        { k: 'analogy', body: 'Think of describing someone\'s commute. "It never takes more than an hour" is an upper bound. "It never takes less than twenty minutes" is a lower bound. "It always takes about forty minutes" is a tight bound — it pins the value from both directions. Big-O is the first, Omega is the second, Theta is the third.' },
        { k: 'table', title: 'The five notations', head: ['Symbol', 'Name', 'Means', 'Plain English'], rows: [
          ['**O**', 'Big-O', 'Upper bound', '"grows **at most** this fast" — the ceiling'],
          ['**Ω**', 'Big-Omega', 'Lower bound', '"grows **at least** this fast" — the floor'],
          ['**Θ**', 'Big-Theta', 'Tight bound (both)', '"grows **exactly** this fast" — floor and ceiling match'],
          ['o', 'little-o', 'Strict upper bound', '"grows **strictly slower** than" — a ceiling it never reaches'],
          ['ω', 'little-omega', 'Strict lower bound', '"grows **strictly faster** than"'],
        ]},
        { k: 'code', lang: 'java', cap: 'One function, described three ways', src: `int sum(int[] a) {
    int total = 0;
    for (int x : a) total += x;
    return total;
}

// This function is:
//   O(n)      — true. It takes at most linear time.
//   O(n^2)    — ALSO TRUE, and this surprises people. n^2 is a valid
//               upper bound; it is just a uselessly loose one.
//   Omega(n)  — true. It takes at least linear time.
//   Theta(n)  — true, and the most precise statement: it is
//               bounded above AND below by n.
//
// So Theta is what people usually MEAN when they say "it's O(n)".
// Saying Big-O is technically weaker but universally accepted.` },
        { k: 'note', tone: 'info', title: 'Why everyone says O when they mean Θ', body: 'Strictly, O(n²) is a correct statement about a linear function — an upper bound does not have to be tight. Θ is the precise claim. In practice the whole industry says "Big-O" and means "tight bound", and **no interviewer will correct you**. Use O. Just do not be thrown if someone writes Θ on a whiteboard — they mean the same thing you do.' },

        { k: 'p', title: 'The confusion worth clearing up', body: [
          'People routinely think **Big-O means worst case** and **Omega means best case**. It does not. These are two completely independent axes and conflating them is the single most common misunderstanding here.',
          '**The notation** (O, Ω, Θ) describes the *kind of bound*. **The case** (best, average, worst) describes *which input you are talking about*. You can apply any notation to any case.',
        ]},
        { k: 'table', title: 'Two independent axes', head: ['', 'Best case', 'Average case', 'Worst case'], rows: [
          ['**Quicksort**', 'Θ(n log n)', 'Θ(n log n)', 'Θ(n²) — already-sorted input with a bad pivot'],
          ['**Merge sort**', 'Θ(n log n)', 'Θ(n log n)', 'Θ(n log n) — always the same'],
          ['**HashMap get**', 'Θ(1)', 'Θ(1)', 'Θ(log n) in Java 8+ (bucket becomes a tree)'],
          ['**Linear search**', 'Θ(1) — first element', 'Θ(n)', 'Θ(n) — absent or last'],
        ]},
        { k: 'note', tone: 'tip', title: 'What to actually say in an interview', body: 'Default to the **worst case in Big-O**, because that is what is being asked for and what protects a real system. Mention a different case only when it is genuinely interesting: *"HashMap lookup is O(1) on average, though the worst case is O(log n) since Java 8 because long buckets convert to trees."* That sentence is worth real credit — it shows you know the difference rather than reciting one number.' },

        { k: 'p', title: 'Two more terms you may meet', body: [
          '**Amortised** — the average cost per operation across a long sequence, where a rare expensive operation is paid for by many cheap ones. `ArrayList.add` is amortised O(1). It is not the same as "average case": amortised is a *guarantee* about any sequence, whereas average case is a claim about typical inputs.',
          '**Pseudo-polynomial** — a complexity that looks polynomial but depends on the *value* of a number rather than the size of the input. The knapsack DP is O(n × capacity), which is fine when capacity is 1,000 and disastrous when it is a billion, even though n never changed. Worth knowing the phrase exists; you will rarely need to use it.',
        ]},
        { k: 'note', tone: 'tip', title: 'The whole of this page, in one line', body: 'Say **Big-O**, mean **worst case**, and be ready to name the average case when it differs interestingly. That covers every complexity question you will ever be asked. Everything else on this page is so that nothing catches you off guard.' },
      ],
    },
    {
      id: 'cx-drills',
      name: 'The Week Zero drill',
      week: 0, mins: 300, tag: 'core',
      summary: 'Thirty-five reps on problems you already know. This is where you actually start.',
      blocks: [
        { k: 'p', title: 'What to do, exactly', body: [
          'Take **five easy problems you have already solved before**. Not new ones — the point is that the problem is not the work. For each one, before looking at anything, write exactly two lines:',
        ]},
        { k: 'code', lang: 'text', cap: 'The two lines, every time', src: `time  = O(___) because ______________________
space = O(___) because ______________________` },
        { k: 'p', body: [
          'Then check yourself against the lookup table. Five a day for seven days is thirty-five reps. By day four it starts to feel automatic, because it is a **recognition** skill — and recognition is built by repetition, not by understanding a proof.',
          'Then keep writing those two lines for every problem you solve for the rest of the six months. That habit alone closes this gap permanently, and it is the reason the gate below is realistic rather than optimistic.',
        ]},
        { k: 'note', tone: 'warn', title: 'The gate before Week 1', body: 'Given any of ten unseen code snippets, you state time and space correctly within ten seconds. **Do not start the DSA section until this is true.** Everything downstream depends on it, and this is the exact point where most attempts stall — clearing it first turns a recurring obstacle into a week of work you only do once.' },
        { k: 'code', lang: 'java', cap: 'Practice set — work these out before scrolling', src: `// 1
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        System.out.println(i + j);

// 2
for (int i = 1; i < n; i = i * 2)
    System.out.println(i);

// 3
Arrays.sort(arr);
for (int x : arr) System.out.println(x);

// 4
Map<Integer, Integer> m = new HashMap<>();
for (int x : arr) m.put(x, m.getOrDefault(x, 0) + 1);

// 5
for (int i = 0; i < n; i++)
    for (int j = 0; j < 100; j++)
        doWork();` },
        { k: 'list', title: 'Answers', items: [
          '**1 —** O(n²) time, O(1) space. Two nested loops, both over n. Nothing allocated.',
          '**2 —** O(log n) time, O(1) space. `i` doubles each step, so it reaches n in about log n steps. Doubling up is the same shape as halving down.',
          '**3 —** O(n log n) time, O(log n) space. The sort dominates the loop; `Arrays.sort` on primitives uses O(log n) stack.',
          '**4 —** O(n) time, O(n) space. One pass, and the map can hold every distinct element.',
          '**5 —** O(n) time, O(1) space. The inner loop is a **constant** 100 — it does not grow with n, so it is a constant factor and gets dropped.',
        ]},
        { k: 'note', tone: 'tip', title: 'Use the scratchpad below', body: 'Paste code snippets into the scratchpad on this page with your two-line answer, flag them for review, and ask Claude to check them. Getting the first twenty corrected by someone is worth more than the next hundred done alone.' },
      ],
    },
  ],
}
