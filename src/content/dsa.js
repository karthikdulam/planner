export const dsa = {
  id: 'dsa',
  name: 'Data Structures & Algorithms',
  icon: '◈',
  blurb: 'Patterns, not problems. One per week, six new problems each, every problem solved three times. This is the section that gates every other round.',
  weeks: 'Weeks 1–21',
  topics: [
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-arrays',
      name: 'Arrays & traversal',
      week: 1, mins: 180, tag: 'core',
      summary: 'The base everything else is built on. Index arithmetic, in-place edits, the off-by-one traps.',
      blocks: [
        { k: 'p', body: [
          'An array is a block of memory where every element is the same size, sitting one after another. That is why `a[i]` is instant: the computer multiplies `i` by the element size, adds the start address, and reads. No searching involved.',
          'Everything expensive about arrays comes from that same layout. Inserting in the middle means shifting everything after it. Growing means allocating a bigger block and copying.',
        ]},
        { k: 'analogy', body: 'A row of numbered lockers in a corridor. Getting to locker 47 is instant — you walk straight to it, because you know exactly where it is. But squeezing a new locker in between 12 and 13 means physically moving every locker from 13 onwards down by one. That asymmetry is the whole personality of an array.' },
        { k: 'table', head: ['Operation', 'Cost', 'Why'], rows: [
          ['Read/write `a[i]`', 'O(1)', 'Direct address arithmetic'],
          ['Append (dynamic array, amortised)', 'O(1)', 'Usually free; occasionally doubles and copies'],
          ['Insert/delete at the middle', 'O(n)', 'Everything after it shifts'],
          ['Search unsorted', 'O(n)', 'Must look at every element'],
          ['Search sorted', 'O(log n)', 'Binary search'],
        ]},
        { k: 'code', lang: 'java', cap: 'The three traversals you use constantly', src: `int[] a = {5, 3, 8, 1, 9};

// 1. Forward with index — when you need i
for (int i = 0; i < a.length; i++) {
    System.out.println(i + " -> " + a[i]);
}

// 2. For-each — when you only need the value (cleaner, prefer it)
for (int x : a) {
    System.out.println(x);
}

// 3. Backward — when removing, or when the answer builds from the right
for (int i = a.length - 1; i >= 0; i--) {
    System.out.println(a[i]);
}

// Reverse in place with two pointers — no extra array
void reverse(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int tmp = a[lo];
        a[lo] = a[hi];
        a[hi] = tmp;
        lo++; hi--;
    }
}` },
        { k: 'cx', time: 'O(n)', space: 'O(1)', why: 'One pass over the array; only a couple of index variables created.' },
        { k: 'note', tone: 'trap', title: 'The three bugs that cost people offers', body: '**(1)** `i <= a.length` instead of `<` — instant `ArrayIndexOutOfBoundsException`. **(2)** Computing `(lo + hi) / 2` on large indices — can overflow `int`; write `lo + (hi - lo) / 2`. **(3)** Modifying a list while iterating it with for-each — throws `ConcurrentModificationException`. Iterate backwards with an index, or use `Iterator.remove()`.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Array vs ArrayList — when do you use which?', a: 'Array when the size is fixed and known, or when you need primitives without boxing overhead (`int[]` not `List<Integer>` — the latter allocates an Integer object per element). ArrayList for everything else: it grows automatically and has the collection API. In interviews use `int[]` for primitives and `ArrayList` when the size is unknown.' },
          { q: 'How does ArrayList grow?', a: 'It holds an internal array. When full, it allocates a new array of about 1.5× the size and copies everything across. That copy is O(n), but it happens rarely enough that appends average out to O(1) — this is called amortised O(1). If you know the final size, `new ArrayList<>(expectedSize)` avoids the copies entirely.' },
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-prefix-sum',
      name: 'Prefix sums',
      week: 1, mins: 150,
      summary: 'Precompute once, then answer any range-sum question in O(1).',
      blocks: [
        { k: 'p', body: [
          'If you are asked for the sum of elements between index `i` and `j`, and you will be asked many times, do not add them up each time. Build a running-total array once, then every answer is a single subtraction.',
        ]},
        { k: 'analogy', body: 'A car odometer. To know how far you drove between two towns you do not re-drive the road counting — you read the odometer at each town and subtract. `prefix[j] - prefix[i]` is exactly that subtraction.' },
        { k: 'code', lang: 'java', cap: 'Build once, query forever', src: `// prefix[i] = sum of the first i elements (prefix[0] = 0)
int[] buildPrefix(int[] a) {
    int[] prefix = new int[a.length + 1];
    for (int i = 0; i < a.length; i++) {
        prefix[i + 1] = prefix[i] + a[i];
    }
    return prefix;
}

// Sum of a[from..to] inclusive — O(1)
int rangeSum(int[] prefix, int from, int to) {
    return prefix[to + 1] - prefix[from];
}

// Classic: count subarrays that sum to k — O(n) using prefix + HashMap
int subarraySum(int[] a, int k) {
    Map<Integer, Integer> seen = new HashMap<>();
    seen.put(0, 1);              // empty prefix, so a full prefix can match
    int running = 0, count = 0;

    for (int x : a) {
        running += x;
        // if some earlier prefix was (running - k), the bit between sums to k
        count += seen.getOrDefault(running - k, 0);
        seen.merge(running, 1, Integer::sum);
    }
    return count;
}` },
        { k: 'cx', time: 'O(n) build, O(1) query', space: 'O(n)', why: 'One extra array of size n+1; each query is a single subtraction.' },
        { k: 'note', tone: 'tip', title: 'The tell', body: 'The words **"sum of a subarray"**, **"range sum"**, or **"how many subarrays where…"** almost always mean prefix sums, usually paired with a HashMap. The `seen.put(0, 1)` line is the part everyone forgets and it is why their answer is off by exactly the subarrays that start at index 0.' },
        { k: 'list', title: 'Variants worth knowing', items: [
          '**Prefix XOR** — same trick, `^` instead of `+`. Used for "subarray with XOR = k".',
          '**Prefix product** — careful with zeros; usually done as prefix/suffix pairs instead (product of array except self).',
          '**2-D prefix sums** — for rectangle sums in a matrix. Same idea, inclusion-exclusion on four corners.',
          '**Difference array** — the inverse: range *updates* in O(1), one final pass to materialise.',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-two-pointers',
      name: 'Two pointers',
      week: 2, mins: 240, tag: 'core',
      summary: 'Two indices moving through the data, turning an O(n²) scan into O(n).',
      blocks: [
        { k: 'p', body: [
          'Instead of checking every pair with nested loops, you keep two indices and move them intelligently. Each pointer only ever moves forward, so the whole thing is one pass.',
          'There are two shapes. **Opposite ends** — one pointer at each end, moving inward, used on sorted data. **Same direction** — both start at the left, one races ahead, used for in-place filtering and for linked lists.',
        ]},
        { k: 'analogy', body: 'You and a friend are searching a sorted shelf of books for two whose page counts add up to 500. You start at the thinnest, they start at the thickest. Too big? Your friend steps down one. Too small? You step up one. Neither of you ever backtracks, so between you the shelf is walked once instead of every pair being compared.' },
        { k: 'code', lang: 'java', cap: 'Both shapes', src: `// SHAPE 1: opposite ends — two-sum on a SORTED array
int[] twoSumSorted(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int sum = a[lo] + a[hi];
        if (sum == target) return new int[]{lo, hi};
        if (sum < target) lo++;   // need bigger -> move left pointer up
        else              hi--;   // need smaller -> move right pointer down
    }
    return new int[]{-1, -1};
}

// SHAPE 2: same direction — remove duplicates in place from a SORTED array
int removeDuplicates(int[] a) {
    if (a.length == 0) return 0;
    int write = 1;                       // slow pointer: where to place next keeper
    for (int read = 1; read < a.length; read++) {   // fast pointer: scans
        if (a[read] != a[read - 1]) {
            a[write++] = a[read];
        }
    }
    return write;                        // new logical length
}

// SHAPE 2 again: is it a palindrome, ignoring non-letters
boolean isPalindrome(String s) {
    int lo = 0, hi = s.length() - 1;
    while (lo < hi) {
        while (lo < hi && !Character.isLetterOrDigit(s.charAt(lo))) lo++;
        while (lo < hi && !Character.isLetterOrDigit(s.charAt(hi))) hi--;
        if (Character.toLowerCase(s.charAt(lo)) != Character.toLowerCase(s.charAt(hi)))
            return false;
        lo++; hi--;
    }
    return true;
}` },
        { k: 'cx', time: 'O(n)', space: 'O(1)', why: 'Each pointer moves at most n steps and never goes backwards; only index variables are created.' },
        { k: 'note', tone: 'warn', title: 'The precondition everyone forgets', body: 'The opposite-ends shape needs **sorted** input. If the input is not sorted you must sort first, which makes the whole thing O(n log n) — and at that point a HashMap solution at O(n) may be better. Always say which one you are choosing and why.' },
        { k: 'list', title: 'When to reach for it', items: [
          'Sorted array + "find a pair/triplet that…" → opposite ends',
          '"Remove/move elements in place" → same direction (slow/fast)',
          '"Is it a palindrome" → opposite ends',
          '"Container with most water", "trapping rain water" → opposite ends with a greedy move rule',
          '3-sum → sort, fix one element, two-pointer the rest. O(n²), and that is the expected answer.',
        ]},
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Two-sum: HashMap or two pointers?', a: 'If the array is unsorted and you must return indices, HashMap — O(n) time, O(n) space, one pass, and it preserves the original indices. If the array is already sorted or you can return values, two pointers — O(n) time, O(1) space. Stating both and choosing deliberately is worth more than either answer alone.' },
          { q: 'Why is 3-sum O(n²) and not O(n³)?', a: 'You sort first (n log n), then fix the first element with an outer loop (n) and two-pointer the remaining subarray (n). That gives n × n = n², which dominates the sort. The two-pointer inner scan is what removes the third nested loop.' },
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-sliding-window',
      name: 'Sliding window',
      week: 3, mins: 260, tag: 'core',
      summary: 'A moving range over the data. The single highest-frequency pattern in interviews.',
      blocks: [
        { k: 'p', body: [
          'You need something about every *contiguous* chunk of the input — longest, shortest, maximum sum, count. The naive way regenerates every chunk from scratch, which is O(n²). The window way keeps a running answer and updates it as the window moves, which is O(n).',
          'Two flavours. **Fixed size** — the window is always k wide, so one element enters and one leaves each step. **Variable size** — the right edge always expands, and the left edge only catches up when a rule is broken.',
        ]},
        { k: 'analogy', body: 'A train passing a bridge that can hold exactly three carriages. As it rolls, one carriage rolls on at the front and one rolls off at the back — you never re-weigh the whole train, you just add the new weight and subtract the old. That is the fixed window. The variable window is the same bridge, except it stretches until it is over its weight limit, then shortens from the back until it is safe again.' },
        { k: 'code', lang: 'java', cap: 'Fixed size — max sum of any k consecutive elements', src: `int maxSumOfSizeK(int[] a, int k) {
    int windowSum = 0;

    // build the first window
    for (int i = 0; i < k; i++) windowSum += a[i];
    int best = windowSum;

    // slide: add the entering element, subtract the leaving one
    for (int i = k; i < a.length; i++) {
        windowSum += a[i] - a[i - k];
        best = Math.max(best, windowSum);
    }
    return best;
}` },
        { k: 'code', lang: 'java', cap: 'Variable size — the template that solves most of them', src: `// Longest substring with no repeating characters
int longestUnique(String s) {
    Map<Character, Integer> count = new HashMap<>();
    int left = 0, best = 0;

    for (int right = 0; right < s.length(); right++) {
        // 1. EXPAND: bring s[right] into the window
        char c = s.charAt(right);
        count.merge(c, 1, Integer::sum);

        // 2. SHRINK: while the window is invalid, pull left forward
        while (count.get(c) > 1) {
            char leaving = s.charAt(left);
            count.merge(leaving, -1, Integer::sum);
            if (count.get(leaving) == 0) count.remove(leaving);
            left++;
        }

        // 3. RECORD: the window is valid here
        best = Math.max(best, right - left + 1);
    }
    return best;
}` },
        { k: 'cx', time: 'O(n)', space: 'O(k)', why: 'Right moves n times and left moves at most n times total, so 2n passes → O(n). Space is whatever the window holds — O(k) for k distinct items, O(1) if it is a fixed alphabet.' },
        { k: 'note', tone: 'tip', title: 'The three-step template', body: '**Expand** the right edge. **Shrink** from the left `while` the window is invalid. **Record** the answer when valid. Nearly every variable-window problem is those three steps with a different definition of "invalid". Write the skeleton first, then fill in the rule — that alone gets you most of the way in the room.' },
        { k: 'note', tone: 'warn', title: 'Where does "record" go?', body: 'For **longest** problems, record *after* shrinking (the window is guaranteed valid there). For **shortest** problems, record *inside* the shrink loop (you want the smallest valid window, so you measure while shrinking). Getting these two the wrong way round is the most common bug in this pattern.' },
        { k: 'list', title: 'The problems this pattern owns', items: [
          'Longest substring without repeating characters',
          'Minimum window substring (the hard one — same template)',
          'Longest repeating character replacement',
          'Permutation in string / find all anagrams',
          'Max consecutive ones after flipping at most k zeros',
          'Fruit into baskets (= longest subarray with at most 2 distinct)',
        ]},
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Both pointers move n times — why is that O(n) and not O(n²)?', a: 'Because they move independently and neither ever goes backwards. `right` advances exactly n times across the whole run; `left` advances at most n times in total across the whole run — not n times per step. Total work is bounded by 2n, so O(n). This is amortised reasoning and stating it correctly is a strong signal.' },
          { q: 'When does sliding window NOT apply?', a: 'When the elements you need are not contiguous (that is usually DP or a heap), or when negative numbers break the invariant. "Minimum subarray sum ≥ target" with negatives cannot use a plain window, because shrinking no longer reliably decreases the sum — you need prefix sums plus a deque instead.' },
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-hashing',
      name: 'Hashing — HashMap & HashSet',
      week: 4, mins: 240, tag: 'core',
      summary: 'Trading memory for speed. The single most useful data structure in interviews.',
      blocks: [
        { k: 'p', body: [
          'A hash map turns "have I seen this before?" from an O(n) scan into an O(1) lookup. You pay for it in memory. That trade is the correct answer to a surprising share of interview problems.',
          'The mechanism: the key is run through `hashCode()` to get a number, that number is squeezed into a bucket index, and the entry is stored there. Looking up runs the same calculation and goes straight to the bucket — no searching.',
        ]},
        { k: 'analogy', body: 'A cloakroom where the ticket number is calculated from your coat rather than handed out in order. Instead of walking the rail looking for your coat, the attendant computes the number and walks straight to that peg. Two coats can compute to the same peg — that is a collision, and then a short chain hangs off that peg.' },
        { k: 'code', lang: 'java', cap: 'The four moves you will use constantly', src: `Map<String, Integer> map = new HashMap<>();

// 1. Count occurrences — merge is cleaner than get-then-put
for (String w : words) {
    map.merge(w, 1, Integer::sum);
}

// 2. Default when absent — avoids null checks
int c = map.getOrDefault("hello", 0);

// 3. Group things — computeIfAbsent creates the list only when needed
Map<String, List<String>> groups = new HashMap<>();
for (String w : words) {
    char[] ch = w.toCharArray();
    Arrays.sort(ch);
    String key = new String(ch);              // anagrams share a sorted key
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
}

// 4. Seen-before with a Set — add() returns false if already present
Set<Integer> seen = new HashSet<>();
for (int x : nums) {
    if (!seen.add(x)) {
        System.out.println("duplicate: " + x);
    }
}` },
        { k: 'code', lang: 'java', cap: 'Two-sum — the canonical one-pass hash solution', src: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> valueToIndex = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        // check BEFORE inserting, so we never pair an element with itself
        if (valueToIndex.containsKey(need)) {
            return new int[]{ valueToIndex.get(need), i };
        }
        valueToIndex.put(nums[i], i);
    }
    return new int[]{-1, -1};
}` },
        { k: 'cx', time: 'O(n)', space: 'O(n)', why: 'One pass; each lookup and insert is O(1) on average. The map may end up holding every element.' },
        { k: 'note', tone: 'warn', title: 'Why "on average"', body: 'O(1) is the *average* case. If every key collides into one bucket, lookups degrade — historically to O(n), and since Java 8 to O(log n) because long chains convert to red-black trees. It never happens with sensible keys, but saying "O(1) average, O(log n) worst case in modern Java" is the answer that lands.' },
        { k: 'note', tone: 'trap', title: 'The equals/hashCode contract', body: 'If you use your own class as a map key you **must** override both `equals` and `hashCode`, and consistently. Override only `equals` and your objects vanish into the map — you put one in and cannot find it, because the lookup goes to a different bucket. This is asked constantly and is covered properly in the Java section.' },
        { k: 'table', title: 'Choosing the right map', head: ['Type', 'Order', 'Ops', 'Use when'], rows: [
          ['HashMap', 'None', 'O(1) avg', 'The default. Fastest.'],
          ['LinkedHashMap', 'Insertion (or access)', 'O(1) avg', 'You need predictable iteration order, or an LRU cache.'],
          ['TreeMap', 'Sorted by key', 'O(log n)', 'You need range queries, floor/ceiling, or sorted iteration.'],
        ]},
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'How would you find the first non-repeating character in a string?', a: 'Two passes with a LinkedHashMap of char → count, or an int[26] if it is lowercase ASCII. First pass counts, second pass returns the first char with count 1. O(n) time; O(1) space with the array version since 26 is a constant. Mentioning the int[26] optimisation is what separates a good answer from an average one.' },
          { q: 'Group anagrams — what is the key?', a: 'Either the sorted characters of the word (O(k log k) per word) or a 26-length count signature (O(k) per word). The count signature is strictly better for long words; the sorted key is faster to write. Say both, pick one, and state the trade-off.' },
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-binary-search',
      name: 'Binary search',
      week: 4, mins: 240, tag: 'core',
      summary: 'Halve the search space every step. Simple idea, brutal off-by-one traps.',
      blocks: [
        { k: 'p', body: [
          'On sorted data, look at the middle. If it is too small, the answer is to the right and you discard the entire left half. If it is too big, discard the right. Each step halves what remains, so a million items takes twenty steps.',
          'The idea takes one minute. The implementation takes a week, because the boundary conditions are genuinely fiddly. **Memorise one template and never deviate from it** — this is the one place in DSA where memorisation beats understanding.',
        ]},
        { k: 'code', lang: 'java', cap: 'Template 1 — exact match (memorise this exactly)', src: `int search(int[] a, int target) {
    int lo = 0, hi = a.length - 1;          // hi is INCLUSIVE

    while (lo <= hi) {                       // note: <=
        int mid = lo + (hi - lo) / 2;        // overflow-safe

        if (a[mid] == target)  return mid;
        if (a[mid] < target)   lo = mid + 1;
        else                   hi = mid - 1;
    }
    return -1;
}` },
        { k: 'code', lang: 'java', cap: 'Template 2 — leftmost / boundary (the one that actually shows up)', src: `// First index where a[i] >= target. Returns a.length if none.
// This one answers "how many are smaller", "where do I insert",
// "first bad version", "leftmost occurrence" — all the same shape.
int lowerBound(int[] a, int target) {
    int lo = 0, hi = a.length;               // hi is EXCLUSIVE this time

    while (lo < hi) {                         // note: <
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < target) lo = mid + 1;    // mid is too small, discard it
        else                 hi = mid;        // mid might BE the answer, keep it
    }
    return lo;                                 // lo == hi == the boundary
}

// Count of elements equal to target
int countOf(int[] a, int target) {
    return lowerBound(a, target + 1) - lowerBound(a, target);
}` },
        { k: 'cx', time: 'O(log n)', space: 'O(1)', why: 'Half the range is discarded each iteration; only three index variables exist.' },
        { k: 'note', tone: 'trap', title: 'The four bugs', body: '**(1)** `(lo + hi) / 2` overflows when both are large — always `lo + (hi - lo) / 2`. **(2)** Mixing the templates: `<=` goes with inclusive `hi = length - 1`, `<` goes with exclusive `hi = length`. **(3)** `hi = mid` in a `lo <= hi` loop is an infinite loop. **(4)** Forgetting the array must be sorted.' },
        { k: 'note', tone: 'tip', title: 'Java gives you these for free', body: '`Arrays.binarySearch(a, key)` returns the index, or `-(insertionPoint) - 1` if absent. `TreeMap` has `floorKey`, `ceilingKey`, `higherKey`, `lowerKey` — all O(log n). Knowing these exist is worth mentioning even when you hand-roll the search.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Search in a rotated sorted array.', a: 'Still O(log n). At each step, one of the two halves is guaranteed to be properly sorted — check which by comparing `a[lo]` with `a[mid]`. If the target lies inside that sorted half\'s range, search there; otherwise search the other half. The trick is that "which half is sorted" is always answerable in O(1).' },
          { q: 'Find the peak element in an unsorted array.', a: 'Binary search still works even though the array is not sorted, because the *condition* is monotonic enough: if `a[mid] < a[mid+1]` an upward slope means a peak exists to the right, otherwise one exists at mid or to the left. O(log n). This is the bridge to "binary search on the answer".' },
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-bs-on-answer',
      name: 'Binary search on the answer',
      week: 5, mins: 200,
      summary: 'When the array is not what you search — the answer itself is.',
      blocks: [
        { k: 'p', body: [
          'This is the advanced form and it feels like magic the first time. Instead of searching an array, you binary search over the **range of possible answers**, using a helper function that asks "is this candidate feasible?"',
          'It works whenever feasibility is *monotonic*: if a capacity of 10 works, then 11, 12, 13 all work too. That monotonic yes/no boundary is exactly what binary search finds.',
        ]},
        { k: 'analogy', body: 'You are hiring a van and want the smallest one that fits your move. You do not measure the furniture — you ask "does a 3-tonne van fit everything? yes. a 2-tonne? yes. a 1-tonne? no." and binary search the van sizes. The furniture never got sorted. The *van sizes* did.' },
        { k: 'code', lang: 'java', cap: 'Ship packages within D days — the classic', src: `// Given package weights in order, and D days, find the smallest ship
// capacity that gets everything delivered in D days.
int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) {
        lo = Math.max(lo, w);   // must at least carry the heaviest package
        hi += w;                // at most, carry everything in one day
    }

    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canShip(weights, mid, days)) hi = mid;   // feasible, try smaller
        else                             lo = mid + 1;
    }
    return lo;
}

// The feasibility check — simple greedy simulation, O(n)
private boolean canShip(int[] weights, int capacity, int days) {
    int used = 1, load = 0;
    for (int w : weights) {
        if (load + w > capacity) {   // start a new day
            used++;
            load = 0;
        }
        load += w;
    }
    return used <= days;
}` },
        { k: 'cx', time: 'O(n log S)', space: 'O(1)', why: 'S is the size of the answer range. Each of the log S binary search steps runs an O(n) feasibility check.' },
        { k: 'list', title: 'How to spot it', items: [
          'The question says **"minimum maximum"** or **"maximum minimum"** — a huge tell',
          '"Smallest capacity / speed / size such that…"',
          '"Split the array into k parts, minimise the largest part"',
          'Koko eating bananas, split array largest sum, minimum days to make bouquets',
        ]},
        { k: 'note', tone: 'tip', title: 'The recipe', body: '**(1)** What is the answer range — lowest possible and highest possible? **(2)** Write `boolean feasible(candidate)` as a plain greedy loop. **(3)** Binary search the range with template 2. Write those three pieces separately and the problem falls apart; try to write it in one go and you will tangle it.' },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-sorting',
      name: 'Sorting — implemented',
      week: 6, mins: 260, tag: 'core',
      summary: 'Write merge sort and quicksort by hand. Divide-and-conquer and partitioning are reusable tools, not just sorting trivia.',
      blocks: [
        { k: 'p', body: [
          'Implement these. Not because an interviewer will demand quicksort from scratch — they usually will not — but because **the two ideas inside them are load-bearing everywhere else.**',
          '**Merge sort teaches divide-and-conquer**: split until trivial, solve, combine. That exact shape reappears in merge k sorted lists, counting inversions, closest pair of points, and most "split the problem in half" solutions. **Quicksort teaches partitioning**: rearrange around a pivot so one element lands in its final position. That is the whole idea behind Quickselect (find the kth largest in O(n) average), the Dutch national flag problem, and sort-colours.',
          'You cannot reach for a tool you have never built. Write both, by hand, at least once.',
        ]},
        { k: 'table', head: ['Algorithm', 'Time', 'Space', 'Stable', 'Where it is used'], rows: [
          ['Merge sort', 'O(n log n) always', 'O(n)', 'Yes', 'Java `Collections.sort` on objects (Timsort)'],
          ['Quicksort', 'O(n log n) avg, O(n²) worst', 'O(log n)', 'No', 'Java `Arrays.sort` on primitives (dual-pivot)'],
          ['Heap sort', 'O(n log n) always', 'O(1)', 'No', 'When memory is tight'],
          ['Counting sort', 'O(n + k)', 'O(k)', 'Yes', 'Small fixed range of values'],
        ]},
        { k: 'code', lang: 'java', cap: 'Merge sort — divide, solve, combine', src: `void mergeSort(int[] a) {
    if (a.length < 2) return;
    int[] buffer = new int[a.length];      // allocate ONCE, not per call —
    sort(a, buffer, 0, a.length - 1);      // a fresh array per recursion is
}                                           // the usual performance mistake

private void sort(int[] a, int[] buf, int lo, int hi) {
    if (lo >= hi) return;                  // BASE CASE: 0 or 1 element is sorted
    int mid = lo + (hi - lo) / 2;

    sort(a, buf, lo, mid);                 // 1. sort the left half
    sort(a, buf, mid + 1, hi);             // 2. sort the right half
    merge(a, buf, lo, mid, hi);            // 3. combine two sorted halves
}

// The interesting part. Both halves are already sorted; walk them in
// parallel, always taking the smaller front element.
private void merge(int[] a, int[] buf, int lo, int mid, int hi) {
    System.arraycopy(a, lo, buf, lo, hi - lo + 1);   // snapshot the range

    int i = lo;        // read pointer into the left half
    int j = mid + 1;   // read pointer into the right half

    for (int k = lo; k <= hi; k++) {       // write pointer
        if      (i > mid)           a[k] = buf[j++];   // left exhausted
        else if (j > hi)            a[k] = buf[i++];   // right exhausted
        else if (buf[j] < buf[i])   a[k] = buf[j++];   // right is strictly smaller
        else                        a[k] = buf[i++];   // left wins ties  <-- STABILITY
    }
}` },
        { k: 'note', tone: 'tip', title: 'The one character that makes it stable', body: 'In the merge, `buf[j] < buf[i]` is **strictly** less-than. On a tie the `else` branch fires and the element from the **left** half is taken — which is the one that came first in the original array. Change it to `<=` and merge sort stops being stable. That single comparison is the entire stability guarantee, and it is a genuinely good thing to be able to point at.' },
        { k: 'cx', time: 'O(n log n) always', space: 'O(n)', why: 'log n levels of splitting (the array halves each time), and O(n) work merging at every level. The buffer is the O(n) space — this is the price of guaranteed performance.' },

        { k: 'code', lang: 'java', cap: 'Quicksort — partition around a pivot', src: `private final Random rnd = new Random();

void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;

    int p = partition(a, lo, hi);   // a[p] is now in its FINAL position
    quickSort(a, lo, p - 1);        // sort everything smaller
    quickSort(a, p + 1, hi);        // sort everything larger
}                                    // note: no merge step — that is the difference

// Lomuto partition. Afterwards: everything left of the returned index is
// <= pivot, everything right is > pivot, and the pivot itself is home.
private int partition(int[] a, int lo, int hi) {
    // RANDOM PIVOT. Without this, an already-sorted array is the O(n^2)
    // worst case — which is also the most common real-world input.
    swap(a, lo + rnd.nextInt(hi - lo + 1), hi);

    int pivot = a[hi];
    int i = lo;              // boundary: everything in [lo, i) is <= pivot

    for (int j = lo; j < hi; j++) {
        if (a[j] <= pivot) {
            swap(a, i, j);   // move it into the "small" region
            i++;             // grow the boundary
        }
    }
    swap(a, i, hi);          // drop the pivot into the gap
    return i;
}

private void swap(int[] a, int x, int y) { int t = a[x]; a[x] = a[y]; a[y] = t; }` },
        { k: 'note', tone: 'trap', title: 'Why the random pivot is not optional', body: 'Always taking `a[hi]` as the pivot makes an **already-sorted array** the worst case: every partition splits into 0 and n-1, giving n levels of recursion and O(n²) time — plus a `StackOverflowError` on a large input. Sorted or nearly-sorted data is extremely common in practice, so the naive version fails on exactly the inputs you will meet. Randomising the pivot makes the bad case astronomically unlikely.' },
        { k: 'cx', time: 'O(n log n) average, O(n²) worst', space: 'O(log n)', why: 'Each partition is O(n) and there are ~log n levels when splits are balanced. Space is the recursion stack, not a buffer — this is why quicksort is called in-place and beats merge sort on memory.' },

        { k: 'code', lang: 'java', cap: 'Partitioning reused — Quickselect finds the kth largest in O(n) average', src: `// Same partition function. But instead of recursing into BOTH sides,
// you only recurse into the side that can contain the answer.
// That turns n log n into n.
int quickSelect(int[] a, int k) {          // k = 1 means the largest
    int target = a.length - k;             // its index in a sorted array
    int lo = 0, hi = a.length - 1;

    while (lo <= hi) {
        int p = partition(a, lo, hi);
        if      (p == target) return a[p];  // landed exactly on it
        else if (p < target)  lo = p + 1;   // answer is to the right
        else                  hi = p - 1;   // answer is to the left
    }
    return -1;
}
// n + n/2 + n/4 + ... = 2n  ->  O(n) average.
// This is the optimal answer to "kth largest element", better than the
// heap solution's O(n log k). Knowing it comes straight from having
// written partition yourself.` },

        { k: 'code', lang: 'java', cap: 'Beating O(n log n) — counting sort does not compare', src: `// Comparison-based sorting cannot beat O(n log n). But if you know the
// values are small integers, you can skip comparing altogether.
int[] countingSort(int[] a, int maxValue) {
    int[] counts = new int[maxValue + 1];

    for (int x : a) counts[x]++;              // O(n) — tally each value

    int[] out = new int[a.length];
    int idx = 0;
    for (int v = 0; v <= maxValue; v++) {     // O(k) — walk the value range
        while (counts[v] > 0) {
            out[idx++] = v;
            counts[v]--;
        }
    }
    return out;                                // O(n + k)
}

// The same idea powers "sort colours" (Dutch national flag) in ONE pass,
// with three pointers instead of counts:
void sortColors(int[] a) {                    // values are only 0, 1, 2
    int low = 0, mid = 0, high = a.length - 1;
    while (mid <= high) {
        if      (a[mid] == 0) swap(a, low++, mid++);
        else if (a[mid] == 2) swap(a, mid, high--);   // do NOT advance mid
        else                  mid++;
    }
}` },
        { k: 'note', tone: 'info', title: 'Why O(n log n) is a real floor', body: 'Any sort that works by **comparing pairs** has a proven lower bound of O(n log n). The reasoning is short: there are n! possible orderings, each comparison gives you one bit of information (yes/no), so you need at least log₂(n!) ≈ n log n comparisons to distinguish them. Counting and radix sort get under that bound only because they never compare — they use the values as array indices instead. That is why they need a small, known value range.' },

        { k: 'code', lang: 'java', cap: 'Custom sorting — what you use every working day', src: `// Sort by one field
people.sort(Comparator.comparingInt(Person::getAge));

// Descending
people.sort(Comparator.comparingInt(Person::getAge).reversed());

// Multi-level: age ascending, then name alphabetically
people.sort(Comparator.comparingInt(Person::getAge)
                      .thenComparing(Person::getName));

// Sort intervals by start time — the setup for most interval problems
Arrays.sort(intervals, (x, y) -> Integer.compare(x[0], y[0]));

// Sort strings by length, longest first
words.sort((a, b) -> b.length() - a.length());   // careful: overflow-prone
words.sort(Comparator.comparingInt(String::length).reversed());  // safer` },
        { k: 'note', tone: 'trap', title: 'The subtraction trap', body: 'Writing `(a, b) -> a.value - b.value` looks neat and silently breaks when the values are far apart, because the subtraction overflows `int` and flips sign. Use `Integer.compare(a.value, b.value)` or `Comparator.comparingInt`. Interviewers who know this notice it every time.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Why does Java use two different sorts?', a: 'Primitives (`int[]`) use dual-pivot quicksort: no extra memory, and stability is meaningless for primitives since equal ints are indistinguishable. Objects use Timsort (a merge sort variant): it is stable, which matters when you sort by one field then another, and real-world data is often partially ordered which Timsort exploits to get close to O(n).' },
          { q: 'What is a stable sort and when does it matter?', a: 'Stable means equal elements keep their original relative order. It matters when you sort multiple times to get a multi-level ordering — sort by name, then by department, and a stable sort leaves names alphabetical within each department. An unstable sort scrambles them.' },
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-stack',
      name: 'Stack',
      week: 7, mins: 180, tag: 'core',
      summary: 'Last in, first out. The pattern for matching, nesting and undo.',
      blocks: [
        { k: 'p', body: [
          'A stack only lets you touch the top: push on, pop off, peek at. That restriction is the point — it naturally models anything where the most recent thing must be dealt with first.',
        ]},
        { k: 'analogy', body: 'A stack of plates. You add to the top and take from the top. Reaching for the bottom plate means moving everything above it, which is precisely why you never do — and why every nested structure (brackets, HTML tags, function calls) matches the shape so well: the innermost thing opened is always the first thing that must close.' },
        { k: 'code', lang: 'java', cap: 'Valid parentheses — the canonical stack problem', src: `boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();   // prefer this over Stack
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');

    for (char c : s.toCharArray()) {
        if (pairs.containsValue(c)) {
            stack.push(c);                          // an opener
        } else if (pairs.containsKey(c)) {
            // a closer: top of stack must be the matching opener
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
        }
    }
    return stack.isEmpty();   // nothing left unclosed
}` },
        { k: 'cx', time: 'O(n)', space: 'O(n)', why: 'One pass; worst case every character is an opener and lands on the stack.' },
        { k: 'note', tone: 'warn', title: 'Never use java.util.Stack', body: '`Stack` extends `Vector`, so every method is synchronised and slower, and it iterates bottom-to-top which is the opposite of what you expect. Use `Deque<T> stack = new ArrayDeque<>()` with `push`/`pop`/`peek`. Saying this out loud in an interview is free credibility.' },
        { k: 'list', title: 'What stacks solve', items: [
          'Bracket / tag matching and nesting validation',
          'Undo-redo (two stacks)',
          'Converting recursion to iteration — the call stack made explicit',
          'Evaluating expressions (postfix, infix-to-postfix)',
          'Backtracking through a path (DFS iteratively)',
          'Min-stack: track the minimum in O(1) with a second stack',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-monotonic-stack',
      name: 'Monotonic stack',
      week: 7, mins: 200,
      summary: 'A stack kept in sorted order. Solves "next greater element" in O(n).',
      blocks: [
        { k: 'p', body: [
          'A monotonic stack keeps its contents always increasing or always decreasing. Before pushing, you pop everything that would break that order — and *those pops are where the answer gets recorded*.',
          'It turns "for each element, find the next one bigger than it" from O(n²) into O(n), because every element is pushed once and popped once.',
        ]},
        { k: 'analogy', body: 'People queuing by height, each wanting to know who is the next taller person ahead of them. Anyone shorter than the newcomer can never be the answer for people further back — the newcomer blocks their view — so they leave the queue, and as each one leaves you tell them "the newcomer is your answer". Everyone joins once and leaves once.' },
        { k: 'code', lang: 'java', cap: 'Next greater element to the right', src: `int[] nextGreater(int[] a) {
    int n = a.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);                 // -1 = nothing greater exists

    Deque<Integer> stack = new ArrayDeque<>();  // holds INDICES, decreasing values

    for (int i = 0; i < n; i++) {
        // a[i] is the "next greater" for everything smaller still on the stack
        while (!stack.isEmpty() && a[stack.peek()] < a[i]) {
            result[stack.pop()] = a[i];
        }
        stack.push(i);
    }
    return result;
}

// Daily temperatures: how many days until a warmer day — same code,
// just store the index gap instead of the value.
int[] dailyTemperatures(int[] t) {
    int[] res = new int[t.length];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < t.length; i++) {
        while (!stack.isEmpty() && t[stack.peek()] < t[i]) {
            int prev = stack.pop();
            res[prev] = i - prev;
        }
        stack.push(i);
    }
    return res;
}` },
        { k: 'cx', time: 'O(n)', space: 'O(n)', why: 'The while loop looks nested but each index is pushed exactly once and popped at most once, so total work across the whole run is 2n.' },
        { k: 'note', tone: 'tip', title: 'The tell', body: 'The phrases **"next greater"**, **"previous smaller"**, **"how many days until"**, **"largest rectangle"**, **"how far can you see"** all mean monotonic stack. Store **indices**, not values — you almost always need the position too, and you can always get the value back with `a[index]`.' },
        { k: 'list', title: 'The problems', items: [
          'Next greater / next smaller element (I, II with wraparound)',
          'Daily temperatures',
          'Largest rectangle in histogram — the hard one, same idea',
          'Trapping rain water (one of several valid approaches)',
          'Remove k digits to make the smallest number',
          'Stock span problem',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-queue-deque',
      name: 'Queue & deque',
      week: 8, mins: 180,
      summary: 'First in, first out — plus the double-ended version that powers sliding-window maximum.',
      blocks: [
        { k: 'p', body: [
          'A queue serves in arrival order: add at the back, remove from the front. It is the backbone of BFS, of task scheduling, and of anything level-by-level.',
          'A **deque** (double-ended queue) allows adding and removing at *both* ends. That extra freedom unlocks the monotonic deque, which answers "maximum of every window" in O(n).',
        ]},
        { k: 'analogy', body: 'A queue is the line at a bank — strictly first come, first served. A deque is a train carriage with doors at both ends: people can board or leave from either end, which is odd for a queue but exactly what you want when you are discarding stale candidates from the front while adding fresh ones at the back.' },
        { k: 'code', lang: 'java', cap: 'Sliding window maximum — monotonic deque', src: `// Maximum of every window of size k, in O(n).
int[] maxSlidingWindow(int[] a, int k) {
    int[] res = new int[a.length - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();   // indices, values DECREASING

    for (int i = 0; i < a.length; i++) {
        // 1. drop indices that have slid out of the window
        while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();

        // 2. drop values smaller than the newcomer — they can never be max
        while (!dq.isEmpty() && a[dq.peekLast()] < a[i]) dq.pollLast();

        dq.offerLast(i);

        // 3. the front is always the max of the current window
        if (i >= k - 1) res[i - k + 1] = a[dq.peekFirst()];
    }
    return res;
}` },
        { k: 'cx', time: 'O(n)', space: 'O(k)', why: 'Each index enters and leaves the deque once. The deque never holds more than k indices.' },
        { k: 'table', title: 'Which Java type to use', head: ['Need', 'Use', 'Note'], rows: [
          ['Plain FIFO queue', '`ArrayDeque` via `Queue`', 'Fastest general choice'],
          ['Stack (LIFO)', '`ArrayDeque`', 'Also the best stack — never `java.util.Stack`'],
          ['Both ends', '`ArrayDeque`', 'The default deque'],
          ['Priority order', '`PriorityQueue`', 'A heap, not a real queue — O(log n) ops'],
          ['Thread-safe queue', '`LinkedBlockingQueue`', 'Producer/consumer, covered in Java concurrency'],
        ]},
        { k: 'note', tone: 'warn', title: 'ArrayDeque does not take nulls', body: '`ArrayDeque` throws `NullPointerException` on a null element, because null is its internal "empty" sentinel. If you genuinely need nulls, use `LinkedList` — but you almost never do.' },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-linked-list',
      name: 'Linked list',
      week: 8, mins: 220, tag: 'core',
      summary: 'Pointer surgery. Loved by interviewers because it is impossible to fake.',
      blocks: [
        { k: 'p', body: [
          'Nodes scattered in memory, each holding a value and a reference to the next. No index arithmetic — reaching position 5 means walking five links.',
          'The reason it appears in every interview is that it cannot be bluffed. Reversing a list correctly requires holding three pointers in your head simultaneously, and that either works or it does not.',
        ]},
        { k: 'analogy', body: 'A treasure hunt. Each clue tells you where the next clue is. Getting to the tenth clue means following nine before it — but inserting a new clue anywhere is trivial: you just rewrite one note to point at the new one, and point the new one at whatever came next.' },
        { k: 'code', lang: 'java', cap: 'Reverse a list — learn this until it is muscle memory', src: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

ListNode reverse(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;

    while (curr != null) {
        ListNode next = curr.next;  // 1. remember where we were going
        curr.next = prev;           // 2. flip the arrow backwards
        prev = curr;                // 3. prev moves up
        curr = next;                // 4. curr moves up
    }
    return prev;                     // prev is the new head
}` },
        { k: 'code', lang: 'java', cap: 'Fast & slow pointers — cycle detection and finding the middle', src: `// Does the list have a cycle? (Floyd's tortoise and hare)
boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;          // 1 step
        fast = fast.next.next;     // 2 steps
        if (slow == fast) return true;   // they meet => there is a loop
    }
    return false;
}

// Middle node in one pass — when fast hits the end, slow is halfway
ListNode middle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}` },
        { k: 'cx', time: 'O(n)', space: 'O(1)', why: 'One walk through the list; only a fixed number of pointers, no matter how long the list is.' },
        { k: 'note', tone: 'tip', title: 'The dummy head trick', body: 'When the head itself might be removed or replaced, create `ListNode dummy = new ListNode(0); dummy.next = head;` and work from `dummy`. Return `dummy.next` at the end. It removes every special case for "what if it is the first node", which is where most linked-list bugs live.' },
        { k: 'list', title: 'The problems that come up', items: [
          'Reverse a list (iterative and recursive), reverse in groups of k',
          'Detect a cycle, and find where the cycle starts',
          'Merge two sorted lists; merge k sorted lists (heap)',
          'Remove the nth node from the end (two pointers, n apart)',
          'Find the middle; check for palindrome (middle + reverse + compare)',
          'Add two numbers represented as lists',
          'LRU cache — doubly linked list + HashMap. Comes up constantly.',
        ]},
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Why does the fast/slow cycle detection actually work?', a: 'If there is a loop, both pointers end up inside it. Fast gains exactly one position on slow per step, so the gap closes by one each time and must eventually reach zero — they cannot jump past each other. If there is no loop, fast reaches null first. O(n) time, O(1) space, which is why it beats the HashSet approach.' },
          { q: 'Array or linked list — when would you actually choose the list?', a: 'Honestly, rarely in application code. Choose it when you insert and delete constantly at known positions and never index randomly — a queue implementation, an LRU cache, an undo history. Arrays win almost everywhere else because contiguous memory is far more cache-friendly, and that speed difference in practice is large.' },
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-recursion',
      name: 'Recursion',
      week: 9, mins: 300, tag: 'core',
      summary: 'The concept that gates trees, graphs, backtracking and DP. Take two weeks if you need them.',
      blocks: [
        { k: 'p', body: [
          'A recursive function solves a problem by calling itself on a smaller version of the same problem, until it hits a case small enough to answer directly.',
          'Every recursive function has exactly two parts: the **base case** (when to stop) and the **recursive case** (how to shrink the problem). Miss the base case and you get a `StackOverflowError`. Fail to shrink and you get the same thing.',
        ]},
        { k: 'analogy', body: 'You are in a cinema and want to know which row you are in. You cannot see the front. So you ask the person in front: "which row are you in?" They do not know either, so they ask forward. Eventually someone in row 1 says "row 1" — that is the base case. Then the answer travels back: 1, 2, 3… each person adding one to what they heard. Every person does one tiny piece of work and trusts the person ahead to do the rest.' },
        { k: 'note', tone: 'tip', title: 'The mental trick that makes it click', body: 'Do not try to trace the whole call tree in your head — that is where people drown. Instead: **assume the recursive call already works correctly**, and just ask "given the correct answer for the smaller problem, how do I build my answer?" This is the leap of faith, and it is genuinely how experienced people write recursion.' },
        { k: 'code', lang: 'java', cap: 'The shape, three times', src: `// 1. Factorial — the simplest possible shape
int factorial(int n) {
    if (n <= 1) return 1;              // BASE CASE
    return n * factorial(n - 1);       // shrink by 1, use the result
}

// 2. Sum of a list — same shape, different work
int sum(int[] a, int i) {
    if (i == a.length) return 0;       // BASE CASE: past the end
    return a[i] + sum(a, i + 1);
}

// 3. Fibonacci — TWO recursive calls, and that is where the cost explodes
int fib(int n) {
    if (n <= 1) return n;              // BASE CASE
    return fib(n - 1) + fib(n - 2);    // O(2^n) — recomputes everything
}

// Same thing memoised: O(n). This is literally the door into DP.
int fibMemo(int n, Integer[] memo) {
    if (n <= 1) return n;
    if (memo[n] != null) return memo[n];       // already solved it
    return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}` },
        { k: 'cx', time: 'depends on the shape', space: 'O(depth)', why: 'One recursive call per step is O(n) time. Two calls per step, depth n, is O(2ⁿ). Space is always the maximum call-stack depth, because every pending call holds its locals.' },
        { k: 'table', title: 'Reading recursion complexity', head: ['Shape', 'Time', 'Example'], rows: [
          ['One call, shrink by 1', 'O(n)', 'factorial, list sum'],
          ['One call, halve the input', 'O(log n)', 'binary search'],
          ['Two calls, shrink by 1', 'O(2ⁿ)', 'naive fibonacci, subsets'],
          ['Two calls, halve the input', 'O(n log n)', 'merge sort'],
          ['n calls, shrink by 1', 'O(n!)', 'permutations'],
        ]},
        { k: 'note', tone: 'trap', title: 'Java has no tail-call optimisation', body: 'Some languages turn tail recursion into a loop for free. Java does not. Recursion depth is bounded by the JVM stack — roughly 10,000–20,000 frames by default. Recursing over a million-element linked list will blow the stack, so for deep-but-linear problems, write the loop.' },
        { k: 'list', title: 'How to practise this specific topic', items: [
          'Write factorial, then sum-of-array, then reverse-a-string recursively. Boring on purpose.',
          'Then: print numbers 1..n, then n..1. Notice that swapping two lines flips the order — that is the difference between doing work *before* vs *after* the recursive call, and it is the whole of pre-order vs post-order later.',
          'Then: recursion on a linked list (reverse it recursively).',
          'Only then move to trees. Trees are just recursion with two branches.',
          'If you are stuck after ten days, that is normal and it is the right place to spend the time — everything downstream depends on this.',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-trees',
      name: 'Trees & traversals',
      week: 10, mins: 260, tag: 'core',
      summary: 'Recursion with two branches. Four traversals, and knowing which one to use.',
      blocks: [
        { k: 'p', body: [
          'A binary tree is a node with a value, a left child and a right child — each of which is itself a tree. That self-similarity is why almost every tree solution is three lines of recursion.',
          'There are four ways to visit every node, and they differ *only* in where you do your work relative to the two recursive calls.',
        ]},
        { k: 'code', lang: 'java', cap: 'The four traversals', src: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

// PRE-ORDER: work, then left, then right.  Use for: copying a tree, serialising.
void preorder(TreeNode n, List<Integer> out) {
    if (n == null) return;
    out.add(n.val);           // <-- work happens BEFORE the children
    preorder(n.left, out);
    preorder(n.right, out);
}

// IN-ORDER: left, work, right.  On a BST this yields values IN SORTED ORDER.
void inorder(TreeNode n, List<Integer> out) {
    if (n == null) return;
    inorder(n.left, out);
    out.add(n.val);           // <-- work happens BETWEEN the children
    inorder(n.right, out);
}

// POST-ORDER: left, right, work.  Use when the answer needs the children first
// (height, deleting a tree, most "compute something bottom-up" problems).
void postorder(TreeNode n, List<Integer> out) {
    if (n == null) return;
    postorder(n.left, out);
    postorder(n.right, out);
    out.add(n.val);           // <-- work happens AFTER the children
}

// LEVEL-ORDER (BFS): row by row, using a queue instead of recursion.
List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> out = new ArrayList<>();
    if (root == null) return out;

    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);

    while (!q.isEmpty()) {
        int size = q.size();               // freeze the size = this level
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null)  q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        out.add(level);
    }
    return out;
}` },
        { k: 'cx', time: 'O(n)', space: 'O(h)', why: 'Every node is visited once. Space is the recursion depth h — O(log n) for a balanced tree, O(n) for a degenerate one shaped like a linked list. BFS space is O(width), which is O(n) at the widest level.' },
        { k: 'code', lang: 'java', cap: 'The post-order shape that solves half of all tree problems', src: `// Height of the tree
int height(TreeNode n) {
    if (n == null) return 0;
    return 1 + Math.max(height(n.left), height(n.right));
}

// Is it balanced? Returns height, or -1 if any subtree is unbalanced.
// The "return a sentinel to signal failure upward" trick is very reusable.
int checkBalanced(TreeNode n) {
    if (n == null) return 0;
    int l = checkBalanced(n.left);
    if (l == -1) return -1;
    int r = checkBalanced(n.right);
    if (r == -1) return -1;
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
}` },
        { k: 'note', tone: 'tip', title: 'Choosing the traversal', body: 'Ask: **do I need the children\'s answers before I can compute mine?** Yes → post-order (height, diameter, sum, balanced, most things). No, I process top-down passing context → pre-order (path sums, serialising). Sorted output from a BST → in-order. Level-by-level or shortest path → BFS.' },
        { k: 'list', title: 'The problems', items: [
          'Max depth, min depth, diameter, balanced check',
          'Invert / mirror a tree; check if two trees are identical or symmetric',
          'Level order, zigzag level order, right side view',
          'Path sum (I, II, III), maximum path sum (the hard one)',
          'Lowest common ancestor',
          'Serialise and deserialise a tree',
          'Build a tree from preorder + inorder arrays',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-bst',
      name: 'Binary search tree',
      week: 11, mins: 200,
      summary: 'A tree with an ordering rule, which makes search O(log n) — until it does not.',
      blocks: [
        { k: 'p', body: [
          'A BST adds one rule to a binary tree: **everything in the left subtree is smaller than the node; everything in the right subtree is larger.** That single rule means searching works exactly like binary search — compare, then discard half the tree.',
          'The catch: the rule says nothing about *shape*. Insert 1,2,3,4,5 in order and you get a straight line, and every operation degrades to O(n). Real implementations (`TreeMap`, `TreeSet`) use red-black trees that rebalance automatically.',
        ]},
        { k: 'analogy', body: 'A well-organised filing cabinet where every drawer says "surnames before M in here, after M over there". Finding "Kumar" takes a handful of decisions, not a search of every file. But if someone files everything alphabetically into one long chain, the labels are still correct and the cabinet is useless — that is an unbalanced BST.' },
        { k: 'code', lang: 'java', cap: 'Search, insert, and the validation trap', src: `TreeNode search(TreeNode n, int target) {
    if (n == null || n.val == target) return n;
    return target < n.val ? search(n.left, target) : search(n.right, target);
}

TreeNode insert(TreeNode n, int val) {
    if (n == null) return new TreeNode(val);
    if (val < n.val) n.left  = insert(n.left, val);
    else             n.right = insert(n.right, val);
    return n;
}

// VALIDATE — the classic trap. Checking only node vs its two children is WRONG:
// every node must be inside a RANGE inherited from its ancestors.
boolean isValidBST(TreeNode n, Long min, Long max) {
    if (n == null) return true;
    if (n.val <= min || n.val >= max) return false;
    return isValidBST(n.left,  min, (long) n.val)
        && isValidBST(n.right, (long) n.val, max);
}
// call: isValidBST(root, Long.MIN_VALUE, Long.MAX_VALUE)` },
        { k: 'cx', time: 'O(h)', space: 'O(h)', why: 'h is the height: O(log n) when balanced, O(n) when degenerate. This distinction is the most common BST follow-up question.' },
        { k: 'note', tone: 'trap', title: 'The validation trap, spelled out', body: 'Tree `[10, 5, 15, null, null, 6, 20]` — the node 6 is a left child of 15, so locally it looks fine. But 6 is in the *right* subtree of 10 and must therefore be greater than 10. It is not. Any validation that only compares parent to child passes this tree and is wrong. Carry min/max bounds down, or do an in-order traversal and check it is strictly increasing.' },
        { k: 'list', title: 'The problems', items: [
          'Validate a BST',
          'Kth smallest element (in-order traversal, stop at k)',
          'Lowest common ancestor in a BST (much easier than the general tree version — just walk down comparing)',
          'Insert into / delete from a BST (delete is fiddly: three cases)',
          'Convert a sorted array to a balanced BST',
          'Range sum of a BST',
        ]},
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Why is TreeMap O(log n) when a plain BST can be O(n)?', a: 'TreeMap is a red-black tree, a self-balancing BST. After every insert or delete it performs rotations and recolouring to guarantee the height stays within 2·log(n+1). You pay a small constant cost per write to get a guaranteed logarithmic height, rather than hoping the input arrives in a lucky order.' },
          { q: 'HashMap or TreeMap?', a: 'HashMap unless you need order. TreeMap costs O(log n) instead of O(1) but gives you sorted iteration, plus `floorKey`, `ceilingKey`, `headMap`, `tailMap` and `subMap` — range queries a HashMap simply cannot answer. If the question involves "closest value", "next larger", or "everything between X and Y", TreeMap is the answer.' },
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-heap',
      name: 'Heap / PriorityQueue',
      week: 12, mins: 260, tag: 'core',
      summary: 'Build one from scratch, then use the library. An array that behaves like a tree.',
      blocks: [
        { k: 'p', body: [
          'A heap keeps only one promise: the minimum (or maximum) is always at the top, reachable in O(1). Everything else is loosely ordered, and that looseness is why inserting and removing cost only O(log n) instead of the O(n log n) of keeping everything fully sorted.',
          'If the problem says **"top k"**, **"k largest"**, **"k closest"**, or **"median"**, it is a heap problem.',
        ]},
        { k: 'analogy', body: 'A hospital triage queue. You do not need everyone ranked by severity — you only ever need to know who is worst right now. Keeping a full ranking of two hundred patients after every arrival would be wasted work; keeping the worst case reliably at the front is cheap and sufficient.' },

        { k: 'p', title: 'How it actually works — an array pretending to be a tree', body: [
          'A heap is a **complete binary tree** (every level full, last level filled left to right) stored in a **flat array**. Because the tree is complete, you never need child pointers — the positions are pure arithmetic:',
          'For the node at index `i`: **parent** is `(i-1)/2`, **left child** is `2i+1`, **right child** is `2i+2`. That is the entire trick, and it is why heaps are so fast: no pointer chasing, perfect cache locality.',
          'The only rule (the *heap property*) is that **every parent is ≤ both its children** in a min-heap. Note what this does *not* say: siblings are unordered, and the array as a whole is not sorted. That looseness is exactly why insert and remove cost O(log n) instead of O(n).',
        ]},
        { k: 'code', lang: 'java', cap: 'A complete min-heap — write this once and heaps stop being mysterious', src: `class MinHeap {
    private int[] heap = new int[16];
    private int size = 0;

    //   index:   0   1   2   3   4   5   6
    //   value:   1   3   6   5   9   8
    //                    1
    //                  /   \\
    //                 3     6
    //                / \\   /
    //               5   9 8
    private static int parent(int i) { return (i - 1) / 2; }
    private static int left(int i)   { return 2 * i + 1; }
    private static int right(int i)  { return 2 * i + 2; }

    int peek() {
        if (size == 0) throw new NoSuchElementException();
        return heap[0];                       // the minimum is ALWAYS at index 0
    }

    void offer(int value) {
        if (size == heap.length) heap = Arrays.copyOf(heap, size * 2);
        heap[size] = value;                   // 1. put it at the very end
        siftUp(size);                          // 2. bubble it up to where it belongs
        size++;
    }

    // Walk up swapping with the parent while we are smaller than it.
    // At most the height of the tree = log n swaps.
    private void siftUp(int i) {
        while (i > 0 && heap[i] < heap[parent(i)]) {
            swap(i, parent(i));
            i = parent(i);
        }
    }

    int poll() {
        int top = heap[0];
        heap[0] = heap[--size];               // 1. move the LAST element to the root
        siftDown(0);                           // 2. sink it to where it belongs
        return top;
    }

    // Walk down swapping with the SMALLER child while a child beats us.
    private void siftDown(int i) {
        while (true) {
            int smallest = i;
            int l = left(i), r = right(i);

            if (l < size && heap[l] < heap[smallest]) smallest = l;
            if (r < size && heap[r] < heap[smallest]) smallest = r;

            if (smallest == i) return;         // heap property restored
            swap(i, smallest);
            i = smallest;
        }
    }

    private void swap(int a, int b) { int t = heap[a]; heap[a] = heap[b]; heap[b] = t; }
}` },
        { k: 'note', tone: 'tip', title: 'Why sift-down goes to the SMALLER child', body: 'If you swapped with the larger child, that child would become the parent of its smaller sibling — instantly violating the heap property again. Swapping with the smaller of the two guarantees the new parent is ≤ both children. Getting this wrong is the classic bug when writing a heap from memory, and being able to explain *why* it must be the smaller child is a strong signal.' },

        { k: 'code', lang: 'java', cap: 'Build-heap in O(n) — a genuinely surprising result', src: `// Turning an unsorted array into a heap. The obvious way is n inserts
// at O(log n) each = O(n log n). But there is an O(n) way:
// sift DOWN from the last parent backwards.
void heapify(int[] a) {
    heap = a;
    size = a.length;
    for (int i = size / 2 - 1; i >= 0; i--) {   // last parent -> root
        siftDown(i);
    }
}

// WHY IS THIS O(n) AND NOT O(n log n)?
// Because most nodes are near the BOTTOM, where sift-down does almost
// no work. Half the nodes are leaves and move 0 steps. A quarter move
// at most 1 step. An eighth move at most 2...
//
//   n/2 x 0  +  n/4 x 1  +  n/8 x 2  +  n/16 x 3  + ...
//   = n x (0/2 + 1/4 + 2/8 + 3/16 + ...)  =  n x 1  =  O(n)
//
// The series converges to 1. Only the root does log n work, and there
// is exactly one root. Sifting UP would be O(n log n) instead, because
// then the expensive nodes are the numerous leaves.` },
        { k: 'note', tone: 'info', title: 'Heap sort falls straight out of this', body: 'Once you have `heapify` and `siftDown`, heap sort is four lines: build a max-heap, then repeatedly swap the root with the last element, shrink the size by one, and sift down. O(n log n) guaranteed, **O(1) extra space** — the only comparison sort that is both. It loses to quicksort in practice purely on cache behaviour, because it jumps around the array instead of scanning it.' },

        { k: 'code', lang: 'java', cap: 'Now the library — what you use in real code', src: `// Min-heap (default in Java): smallest on top
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap: pass a reversed comparator
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

// Heap of objects by a field
PriorityQueue<Task> byPriority =
    new PriorityQueue<>(Comparator.comparingInt(Task::getPriority));

// TOP-K TRICK: to find the k LARGEST, use a MIN-heap of size k.
// Counter-intuitive but correct — the smallest of your k best sits on top,
// so it is the cheapest one to evict when something better arrives.
int[] topK(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();   // MIN-heap
    for (int x : nums) {
        heap.offer(x);
        if (heap.size() > k) heap.poll();   // drop the smallest
    }
    return heap.stream().mapToInt(Integer::intValue).toArray();
}` },
        { k: 'cx', time: 'O(n log k)', space: 'O(k)', why: 'One pass over n items; each heap operation is O(log k) because the heap never grows beyond k. Far better than sorting everything at O(n log n) when k is small.' },
        { k: 'table', title: 'Heap operations', head: ['Operation', 'Cost'], rows: [
          ['`peek()` — look at top', 'O(1)'],
          ['`offer(x)` — insert', 'O(log n)'],
          ['`poll()` — remove top', 'O(log n)'],
          ['`remove(x)` — remove arbitrary', 'O(n) — it has to find it first'],
          ['Build from n items (heapify)', 'O(n) — better than n inserts'],
        ]},
        { k: 'note', tone: 'trap', title: 'A PriorityQueue is not sorted', body: 'Iterating a `PriorityQueue` with a for-each does **not** give you sorted order — only `poll()` does, one at a time. Printing a PriorityQueue shows the internal array layout and looks scrambled. This surprises people in interviews constantly.' },
        { k: 'list', title: 'The problems', items: [
          'Kth largest element in an array / in a stream',
          'Top k frequent elements (HashMap to count, then heap)',
          'Merge k sorted lists — heap of the k current heads',
          'K closest points to the origin',
          'Find median from a data stream — **two heaps**, a max-heap for the lower half and a min-heap for the upper. Classic hard question.',
          'Task scheduler, meeting rooms II (minimum rooms needed)',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-graph-basics',
      name: 'Graphs — representation',
      week: 13, mins: 180, tag: 'core',
      summary: 'How to store a graph before you can traverse one. Adjacency lists, almost always.',
      blocks: [
        { k: 'p', body: [
          'A graph is nodes plus connections. Trees are graphs with no cycles and a single root; grids are graphs where each cell connects to its neighbours. Once you see that, a large chunk of "hard" problems become BFS or DFS with different neighbour rules.',
        ]},
        { k: 'table', title: 'Vocabulary you must have straight', head: ['Term', 'Meaning'], rows: [
          ['Vertex / node', 'A point'],
          ['Edge', 'A connection between two points'],
          ['Directed', 'Edges are one-way (Twitter follows)'],
          ['Undirected', 'Edges go both ways (Facebook friends)'],
          ['Weighted', 'Edges have a cost (road distances)'],
          ['Cycle', 'A path that returns to where it started'],
          ['Connected component', 'An island of nodes reachable from each other'],
          ['DAG', 'Directed acyclic graph — the shape of any dependency list'],
        ]},
        { k: 'code', lang: 'java', cap: 'The two representations', src: `// ADJACENCY LIST — use this ~always. O(V + E) space.
Map<Integer, List<Integer>> graph = new HashMap<>();
void addEdge(int from, int to) {
    graph.computeIfAbsent(from, k -> new ArrayList<>()).add(to);
    graph.computeIfAbsent(to,   k -> new ArrayList<>()).add(from);  // drop for directed
}

// From an edge list, the usual input format
List<List<Integer>> buildGraph(int n, int[][] edges) {
    List<List<Integer>> g = new ArrayList<>();
    for (int i = 0; i < n; i++) g.add(new ArrayList<>());
    for (int[] e : edges) {
        g.get(e[0]).add(e[1]);
        g.get(e[1]).add(e[0]);
    }
    return g;
}

// ADJACENCY MATRIX — O(V^2) space. Only for dense graphs or small V.
boolean[][] matrix = new boolean[n][n];
matrix[from][to] = true;

// A GRID is a graph. These four deltas are the neighbour rule.
int[][] DIRS = {{0,1},{1,0},{0,-1},{-1,0}};
for (int[] d : DIRS) {
    int nr = r + d[0], nc = c + d[1];
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        // valid neighbour
    }
}` },
        { k: 'table', title: 'List vs matrix', head: ['', 'Adjacency list', 'Adjacency matrix'], rows: [
          ['Space', 'O(V + E)', 'O(V²)'],
          ['Is there an edge u→v?', 'O(degree)', 'O(1)'],
          ['Iterate a node\'s neighbours', 'O(degree)', 'O(V)'],
          ['Best for', 'Sparse graphs — almost all of them', 'Dense graphs, or tiny V'],
        ]},
        { k: 'note', tone: 'tip', title: 'The step everyone skips', body: 'Most graph problems hand you an **edge list** (`int[][] edges`). Building the adjacency list is step zero and takes four lines. Do it explicitly and out loud before you start traversing — interviewers notice when candidates try to traverse an edge list directly and tie themselves in knots.' },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-bfs-dfs',
      name: 'BFS & DFS',
      week: 13, mins: 280, tag: 'core',
      summary: 'The two ways to explore. Nearly every graph question is one of these with a twist.',
      blocks: [
        { k: 'p', body: [
          '**DFS** goes as deep as possible down one path before backing up. Recursion, or an explicit stack.',
          '**BFS** explores in rings — everything one step away, then everything two steps away. A queue. Because it expands in order of distance, **the first time BFS reaches a node it has found the shortest path** (when every edge costs the same). That guarantee is the whole reason to choose it.',
        ]},
        { k: 'analogy', body: 'Exploring a cave system. DFS is one person walking down a passage until it dead-ends, then backtracking to the last junction and trying the next passage. BFS is a hundred people fanning out together, all advancing one step at a time — slower per person, but the first to reach the exit definitely took the shortest route.' },
        { k: 'code', lang: 'java', cap: 'Both templates — learn both cold', src: `// DFS (recursive) — the visited set is what stops infinite loops
void dfs(int node, List<List<Integer>> g, boolean[] visited) {
    visited[node] = true;
    // ... do work on 'node' here ...
    for (int next : g.get(node)) {
        if (!visited[next]) dfs(next, g, visited);
    }
}

// BFS — shortest path in an UNWEIGHTED graph
int shortestPath(List<List<Integer>> g, int start, int target) {
    boolean[] visited = new boolean[g.size()];
    Queue<Integer> q = new LinkedList<>();

    q.offer(start);
    visited[start] = true;
    int distance = 0;

    while (!q.isEmpty()) {
        int size = q.size();              // one whole ring at a time
        for (int i = 0; i < size; i++) {
            int node = q.poll();
            if (node == target) return distance;

            for (int next : g.get(node)) {
                if (!visited[next]) {
                    visited[next] = true;  // mark on ENQUEUE, not on dequeue
                    q.offer(next);
                }
            }
        }
        distance++;                        // finished a ring
    }
    return -1;
}` },
        { k: 'code', lang: 'java', cap: 'Number of islands — the grid classic', src: `int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;
                sink(grid, r, c);   // flood-fill the whole island away
            }
        }
    }
    return count;
}

private void sink(char[][] g, int r, int c) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1')
        return;
    g[r][c] = '0';           // mark visited by mutating the grid — no extra space
    sink(g, r + 1, c);
    sink(g, r - 1, c);
    sink(g, r, c + 1);
    sink(g, r, c - 1);
}` },
        { k: 'cx', time: 'O(V + E)', space: 'O(V)', why: 'Every vertex is visited once and every edge examined once. Space is the visited set plus the queue or recursion stack. For a grid, V = rows × cols and E ≈ 4V, so it is just O(rows × cols).' },
        { k: 'note', tone: 'trap', title: 'Mark visited when you ENQUEUE', body: 'In BFS, set `visited[next] = true` at the moment you add the node to the queue, not when you pop it. Marking on dequeue lets the same node be queued many times through different neighbours, which quietly turns O(V+E) into something much worse and can produce wrong distances.' },
        { k: 'table', title: 'Choosing between them', head: ['Use BFS when', 'Use DFS when'], rows: [
          ['Shortest path, unweighted', 'Just need to reach everything'],
          ['Level-by-level processing', 'Detecting cycles'],
          ['"Minimum number of steps"', 'Topological sort'],
          ['Spreading simulations (rotting oranges)', 'Path enumeration / backtracking'],
          ['The graph is very deep', 'The graph is very wide'],
        ]},
        { k: 'list', title: 'The problems', items: [
          'Number of islands, max area of island, surrounded regions',
          'Clone a graph',
          'Rotting oranges — multi-source BFS (seed the queue with all sources)',
          'Word ladder — BFS where neighbours are words one letter apart',
          'Course schedule — cycle detection in a directed graph',
          'Shortest path in a binary matrix, walls and gates',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-topo-sort',
      name: 'Topological sort',
      week: 14, mins: 180,
      summary: 'Ordering things with dependencies. Also the standard way to detect a cycle in a DAG.',
      blocks: [
        { k: 'p', body: [
          'Given tasks where some must happen before others, produce a valid order. It only exists if there are no cycles — and that fact makes topological sort the standard cycle detector for directed graphs.',
          'The clean version is **Kahn\'s algorithm**: count how many prerequisites each node has, start with the ones that have zero, and every time you finish a node, decrement its dependents. If you cannot finish everything, there is a cycle.',
        ]},
        { k: 'analogy', body: 'Getting dressed. Socks before shoes, shirt before jumper. Several valid orders exist — but if someone told you socks go before shoes *and* shoes go before socks, no order exists at all. That impossibility is a cycle, and detecting it is half of what this algorithm is for.' },
        { k: 'code', lang: 'java', cap: "Kahn's algorithm — order and cycle detection in one", src: `// numCourses tasks, prerequisites[i] = {course, mustComeFirst}
int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> next = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) next.add(new ArrayList<>());
    int[] inDegree = new int[numCourses];

    for (int[] p : prerequisites) {
        next.get(p[1]).add(p[0]);   // p[1] unlocks p[0]
        inDegree[p[0]]++;            // p[0] has one more prerequisite
    }

    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) q.offer(i);   // no prerequisites: start here
    }

    int[] order = new int[numCourses];
    int idx = 0;

    while (!q.isEmpty()) {
        int course = q.poll();
        order[idx++] = course;

        for (int dependent : next.get(course)) {
            if (--inDegree[dependent] == 0) q.offer(dependent);
        }
    }

    // If we could not place every course, a cycle blocked us.
    return idx == numCourses ? order : new int[0];
}` },
        { k: 'cx', time: 'O(V + E)', space: 'O(V + E)', why: 'Every node is queued once and every edge is examined once when its source is processed.' },
        { k: 'list', title: 'Where it shows up', items: [
          'Course schedule I (can it be done?) and II (give me the order)',
          'Build systems and package managers resolving dependencies',
          'Alien dictionary — derive letter order from sorted words',
          'Task scheduling with prerequisites',
          'Detecting a cycle in any directed graph',
        ]},
        { k: 'note', tone: 'tip', title: 'The DFS alternative', body: 'You can also topologically sort with DFS: run post-order and push each finished node onto a stack; the reversed finish order is a valid topological order. Kahn\'s is easier to get right under pressure and its cycle detection falls out naturally, so default to Kahn\'s and mention the DFS version exists.' },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-union-find',
      name: 'Union-Find (Disjoint Set)',
      week: 15, mins: 180,
      summary: 'Track which things are connected, in effectively constant time.',
      blocks: [
        { k: 'p', body: [
          'Union-Find answers two questions extremely fast: "are these two in the same group?" and "merge these two groups". It is the right tool whenever connectivity is being built up incrementally.',
          'Two optimisations make it fast, and you need both. **Path compression** flattens the tree during lookup. **Union by rank/size** always attaches the smaller tree under the bigger one. With both, operations are effectively O(1).',
        ]},
        { k: 'analogy', body: 'Merging friend groups at a party. Each group has one nominated spokesperson. To check if two people are in the same group, ask each for their spokesperson and compare. To merge, one spokesperson starts deferring to the other. Path compression is everyone learning to name the top spokesperson directly, rather than passing the question along a chain.' },
        { k: 'code', lang: 'java', cap: 'The whole data structure — worth memorising', src: `class UnionFind {
    private final int[] parent;
    private final int[] rank;
    private int components;

    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        components = n;
        for (int i = 0; i < n; i++) parent[i] = i;   // everyone is their own leader
    }

    // Find the leader, flattening the path on the way back up
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);   // PATH COMPRESSION
        }
        return parent[x];
    }

    // Merge two groups. Returns false if they were already merged.
    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;         // already connected -> a cycle edge

        // UNION BY RANK: hang the shallower tree under the deeper one
        if (rank[ra] < rank[rb])      parent[ra] = rb;
        else if (rank[ra] > rank[rb]) parent[rb] = ra;
        else { parent[rb] = ra; rank[ra]++; }

        components--;
        return true;
    }

    boolean connected(int a, int b) { return find(a) == find(b); }
    int count() { return components; }
}` },
        { k: 'cx', time: 'O(α(n)) ≈ O(1)', space: 'O(n)', why: 'α is the inverse Ackermann function — below 5 for any input that fits in the universe. Say "effectively constant"; you will never need the real name.' },
        { k: 'list', title: 'When to use it instead of DFS/BFS', items: [
          'Edges arrive one at a time and you must answer connectivity as you go',
          'Number of connected components / number of provinces',
          'Detect a cycle in an **undirected** graph — if `union` returns false, that edge closes a cycle',
          'Redundant connection (find the edge that creates a cycle)',
          'Kruskal\'s minimum spanning tree',
          'Accounts merge, friend circles, "is this network connected"',
        ]},
        { k: 'note', tone: 'tip', title: 'How to decide', body: 'If the graph is fully built and you traverse it once, **DFS/BFS**. If connections are added incrementally and you must answer questions in between, **Union-Find**. If the question mentions "as each edge is added…", that is Union-Find with near certainty.' },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-shortest-path',
      name: "Dijkstra & weighted paths",
      week: 15, mins: 160,
      summary: 'BFS with a heap, for when edges have different costs.',
      blocks: [
        { k: 'p', body: [
          'Plain BFS finds the shortest path only when every edge costs the same. Once edges have weights — road distances, latencies, prices — BFS breaks, because fewer hops may cost more.',
          'Dijkstra fixes it with one change: replace the queue with a **min-heap keyed by total distance so far**. You always expand the cheapest-known node next, which preserves the "first time we reach it, it is optimal" guarantee.',
        ]},
        { k: 'analogy', body: 'Driving with a satnav. The route with the fewest junctions is not the fastest — a two-hop route through the city centre can be slower than a five-hop motorway route. The satnav always explores the cheapest partial route it knows about, which is exactly what the heap does.' },
        { k: 'code', lang: 'java', cap: 'Dijkstra — BFS with a priority queue', src: `// graph.get(u) holds int[]{neighbour, weight}
int[] dijkstra(List<List<int[]>> graph, int start) {
    int n = graph.size();
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;

    // heap of {node, distanceSoFar}, smallest distance first
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    pq.offer(new int[]{start, 0});

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int node = cur[0], d = cur[1];

        if (d > dist[node]) continue;   // stale entry, we already did better

        for (int[] edge : graph.get(node)) {
            int next = edge[0], weight = edge[1];
            int nd = d + weight;
            if (nd < dist[next]) {      // found a cheaper route
                dist[next] = nd;
                pq.offer(new int[]{next, nd});
            }
        }
    }
    return dist;
}` },
        { k: 'cx', time: 'O((V + E) log V)', space: 'O(V + E)', why: 'Every edge can trigger a heap insert, and each heap operation is O(log V).' },
        { k: 'note', tone: 'warn', title: 'Dijkstra cannot handle negative weights', body: 'It assumes that once a node is finalised, no cheaper route to it exists — a negative edge breaks that assumption outright. For negative weights use Bellman-Ford at O(V·E). You will almost certainly not have to implement Bellman-Ford, but knowing *why* Dijkstra fails is a common follow-up.' },
        { k: 'list', title: 'Where it appears', items: [
          'Network delay time',
          'Cheapest flights within k stops (Dijkstra variant, or Bellman-Ford)',
          'Path with minimum effort / maximum probability',
          'Any "shortest/cheapest/fastest" question where the edges have differing costs',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-backtracking',
      name: 'Backtracking',
      week: 16, mins: 260, tag: 'core',
      summary: 'Try, recurse, undo. The pattern for "generate all possible…".',
      blocks: [
        { k: 'p', body: [
          'Backtracking builds a candidate answer step by step. At each step you try an option, recurse, and then **undo the option** before trying the next one. That undo is what makes it backtracking rather than plain recursion.',
          'It is exponential by nature, and that is fine — these problems have small inputs precisely because the answer set is huge.',
        ]},
        { k: 'analogy', body: 'Walking a hedge maze with a piece of chalk. At each junction you pick a direction and mark it. Dead end? Walk back, rub out the mark, and take the next direction. The rubbing-out is essential — leave the mark and you will believe you have already tried routes you have not.' },
        { k: 'code', lang: 'java', cap: 'The universal template', src: `void backtrack(State state, List<Result> results) {
    if (isComplete(state)) {
        results.add(copyOf(state));   // COPY — do not add the live object
        return;
    }
    for (Choice c : availableChoices(state)) {
        if (!isValid(c, state)) continue;   // prune early = massive speedup
        apply(c, state);                     // 1. CHOOSE
        backtrack(state, results);           // 2. EXPLORE
        undo(c, state);                      // 3. UN-CHOOSE  <-- the key line
    }
}` },
        { k: 'code', lang: 'java', cap: 'Subsets and permutations — the two you must know', src: `// ALL SUBSETS (power set) — at each index, take it or skip it
void subsets(int[] nums, int i, List<Integer> current, List<List<Integer>> out) {
    if (i == nums.length) {
        out.add(new ArrayList<>(current));   // COPY
        return;
    }
    // choice 1: skip nums[i]
    subsets(nums, i + 1, current, out);

    // choice 2: take nums[i]
    current.add(nums[i]);
    subsets(nums, i + 1, current, out);
    current.remove(current.size() - 1);       // UNDO
}

// ALL PERMUTATIONS
void permute(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> out) {
    if (current.size() == nums.length) {
        out.add(new ArrayList<>(current));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;

        used[i] = true;                       // CHOOSE
        current.add(nums[i]);

        permute(nums, used, current, out);    // EXPLORE

        current.remove(current.size() - 1);   // UNDO
        used[i] = false;
    }
}` },
        { k: 'cx', time: 'O(2ⁿ) or O(n!)', space: 'O(n)', why: 'Subsets: each element is in or out, so 2ⁿ results. Permutations: n! orderings. Space is the recursion depth plus the current partial answer — the output itself is usually not counted.' },
        { k: 'note', tone: 'trap', title: 'Two bugs that account for most failures', body: '**(1) Forgetting the copy.** `out.add(current)` adds a *reference* to a list you are about to mutate — every entry in your results ends up identical (usually empty). Always `new ArrayList<>(current)`. **(2) Forgetting the undo.** Without it, state leaks between branches and you get wrong, non-obvious answers.' },
        { k: 'list', title: 'The problems', items: [
          'Subsets, subsets II (with duplicates), combination sum I & II',
          'Permutations, permutations II',
          'N-Queens — the showcase problem for pruning',
          'Word search in a grid',
          'Palindrome partitioning',
          'Letter combinations of a phone number',
          'Sudoku solver',
        ]},
        { k: 'note', tone: 'tip', title: 'Pruning is the real skill', body: 'The template is easy; making it fast is the interesting part. Sorting first so you can skip duplicates, abandoning a branch the moment the running sum exceeds the target, tracking used columns and diagonals in N-Queens — pruning is what turns "correct but times out" into "correct".' },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-dp-intro',
      name: 'Dynamic programming — the idea',
      week: 17, mins: 240, tag: 'core',
      summary: 'Recursion that remembers. Not a new technique — an optimisation of one you already have.',
      blocks: [
        { k: 'p', body: [
          'DP has a reputation for being hard. It is not a new idea; it is *recursion plus a cache*. If you can write the recursive solution, you are one step from the DP solution, and that step is mechanical.',
          'Two conditions must hold. **Overlapping subproblems** — the same sub-question comes up repeatedly. **Optimal substructure** — the best answer is built from best answers to smaller pieces.',
        ]},
        { k: 'analogy', body: 'Working out how many ways there are to climb a staircase. You start recomputing "ways to reach step 5" over and over from different branches. DP is writing each answer on a sticky note as you get it. The second time you need step 5, you read the note. Nothing about the reasoning changed — you just stopped repeating yourself.' },
        { k: 'code', lang: 'java', cap: 'One problem, three stages — watch the transformation', src: `// STAGE 1: plain recursion. Correct, and O(2^n) — unusable past n=40.
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// STAGE 2: MEMOISATION (top-down). Add a cache. Two extra lines. O(n).
int fibMemo(int n, Integer[] memo) {
    if (n <= 1) return n;
    if (memo[n] != null) return memo[n];             // <-- read the note
    return memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);  // <-- write it
}

// STAGE 3: TABULATION (bottom-up). Same recurrence, as a loop. O(n).
int fibTab(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}

// STAGE 4 (bonus): space optimised. Only the last two values matter. O(1) space.
int fibOpt(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}` },
        { k: 'note', tone: 'tip', title: 'The method — do it in this order, always', body: '**(1)** Write the brute-force recursion, even though it is too slow. **(2)** Identify the *state* — what arguments actually change between calls? **(3)** Add a cache keyed on that state. Done, you have memoisation. **(4)** Only if asked, convert to a bottom-up table. Trying to write the table first is why DP feels impossible; almost nobody can do that directly.' },
        { k: 'table', title: 'Memoisation vs tabulation', head: ['', 'Memoisation (top-down)', 'Tabulation (bottom-up)'], rows: [
          ['How', 'Recursion + cache', 'Loop filling an array'],
          ['Easier to write', 'Yes — follows the recursion', 'No — needs the right fill order'],
          ['Computes', 'Only the states you actually need', 'Every state'],
          ['Risk', 'Stack overflow when deep', 'None'],
          ['Space optimisable', 'Rarely', 'Often, down to O(1) rows'],
        ]},
        { k: 'note', tone: 'warn', title: 'Take three weeks on DP, not one', body: 'DP is the hardest DSA topic and the one where "one pattern per week" matters most. Weeks 17–19 are all DP. Do not compress it — and do not skip it either. DP appears in roughly one coding round in three.' },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-dp-1d',
      name: 'DP patterns — 1-D',
      week: 17, mins: 260,
      summary: 'One array, one decision per position. Start here.',
      blocks: [
        { k: 'p', body: [
          'The simplest DP family: `dp[i]` is the answer for the first `i` items, and it depends on a small number of earlier entries. Almost every 1-D DP is "climb stairs" or "house robber" wearing a disguise.',
        ]},
        { k: 'code', lang: 'java', cap: 'The two base problems', src: `// CLIMBING STAIRS: 1 or 2 steps at a time. How many distinct ways to reach n?
// dp[i] = ways to reach step i
int climbStairs(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1; dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];   // arrive from one below or two below
    }
    return dp[n];
}

// HOUSE ROBBER: cannot rob two adjacent houses. Maximise the total.
// dp[i] = best takings considering the first i houses
int rob(int[] nums) {
    int prev2 = 0;   // best up to i-2
    int prev1 = 0;   // best up to i-1

    for (int money : nums) {
        int take = prev2 + money;   // rob this one, so skip the previous
        int skip = prev1;            // do not rob it, keep the running best
        int cur = Math.max(take, skip);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}` },
        { k: 'code', lang: 'java', cap: 'Coin change — the "minimum number of" shape', src: `// Fewest coins summing to amount, or -1 if impossible.
int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);   // sentinel meaning "impossible"
    dp[0] = 0;                      // zero coins make zero

    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (coin <= a) {
                dp[a] = Math.min(dp[a], dp[a - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}` },
        { k: 'cx', time: 'O(n × choices)', space: 'O(n)', why: 'One entry per state, and each entry looks at a bounded number of earlier entries. Often reducible to O(1) space when only the last one or two entries matter.' },
        { k: 'list', title: 'The 1-D family', items: [
          'Climbing stairs, min cost climbing stairs',
          'House robber I, II (circular), III (on a tree)',
          'Coin change (minimum coins) and coin change II (count ways)',
          'Longest increasing subsequence — O(n²) DP, or O(n log n) with binary search',
          'Word break',
          'Decode ways',
          'Maximum subarray (Kadane\'s — DP in disguise)',
        ]},
        { k: 'note', tone: 'tip', title: 'How to find the recurrence', body: 'Ask one question: **"what is the last decision I make, and what does it leave behind?"** For house robber the last decision is rob-or-skip house i, leaving the best answer for i-2 or i-1. Naming the last decision hands you the recurrence almost every time.' },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-dp-knapsack',
      name: 'DP patterns — knapsack',
      week: 18, mins: 260,
      summary: 'Take it or leave it, with a budget. One shape, many disguises.',
      blocks: [
        { k: 'p', body: [
          'The knapsack family: you have items, each with a cost and a value, and a capacity. For each item you decide take or skip, and the state is `(which item, how much capacity is left)`.',
          'It looks like a specific puzzle. It is actually the shape behind subset-sum, partition, target-sum and several string problems.',
        ]},
        { k: 'analogy', body: 'Packing for a flight with a 20kg limit. For each item you weigh it against what it is worth to you and what else you would then have to leave behind. You cannot judge the camera in isolation — only against the space it costs. That coupling of cost and value against a budget is exactly the recurrence.' },
        { k: 'code', lang: 'java', cap: '0/1 knapsack — take each item at most once', src: `// dp[i][w] = best value using the first i items with capacity w
int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            // option 1: skip item i-1
            dp[i][w] = dp[i - 1][w];

            // option 2: take it, if it fits
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(dp[i][w],
                        dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            }
        }
    }
    return dp[n][capacity];
}

// SPACE OPTIMISED: only the previous row matters, so use one row and
// iterate capacity BACKWARDS (so each item is used at most once).
int knapsack1D(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
        for (int w = capacity; w >= weights[i]; w--) {   // <-- backwards
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}` },
        { k: 'code', lang: 'java', cap: 'Partition equal subset sum — knapsack in disguise', src: `// Can the array be split into two halves with equal sums?
// = can we hit exactly total/2 with some subset? = subset-sum = knapsack.
boolean canPartition(int[] nums) {
    int total = Arrays.stream(nums).sum();
    if (total % 2 != 0) return false;          // odd total can never split
    int target = total / 2;

    boolean[] dp = new boolean[target + 1];
    dp[0] = true;                               // sum 0 is always reachable

    for (int num : nums) {
        for (int s = target; s >= num; s--) {   // backwards again
            dp[s] = dp[s] || dp[s - num];
        }
    }
    return dp[target];
}` },
        { k: 'cx', time: 'O(n × capacity)', space: 'O(capacity)', why: 'One entry per (item, capacity) pair. Space collapses to a single row because each row depends only on the row above it.' },
        { k: 'note', tone: 'warn', title: 'Forwards or backwards?', body: '**0/1 knapsack** (each item once) → iterate capacity **backwards**, so an item cannot be reused within the same pass. **Unbounded knapsack** (unlimited copies, e.g. coin change) → iterate **forwards**, which deliberately allows reuse. That single loop direction is the entire difference between the two variants.' },
        { k: 'list', title: 'The disguises', items: [
          'Partition equal subset sum',
          'Target sum (assign + or - to each number)',
          'Last stone weight II',
          'Ones and zeroes (a two-dimensional capacity)',
          'Coin change II — counting combinations, unbounded',
          'Combination sum IV — order matters, so the loops swap',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-dp-grid-string',
      name: 'DP patterns — grids & strings',
      week: 19, mins: 280,
      summary: 'Two-dimensional tables. Edit distance, LCS, and the grid walks.',
      blocks: [
        { k: 'p', body: [
          'When the state needs two indices — a position in each of two strings, or a row and column in a grid — you get a 2-D table. The recurrence almost always looks at three neighbours: up, left, and diagonal.',
        ]},
        { k: 'code', lang: 'java', cap: 'Grid DP — unique paths and minimum path sum', src: `// How many ways from top-left to bottom-right, moving only right or down?
int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];

    for (int i = 0; i < m; i++) dp[i][0] = 1;   // one way down the first column
    for (int j = 0; j < n; j++) dp[0][j] = 1;   // one way along the first row

    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];  // arrive from above or from left
        }
    }
    return dp[m-1][n-1];
}

// Cheapest path from top-left to bottom-right
int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    dp[0][0] = grid[0][0];

    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];

    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);

    return dp[m-1][n-1];
}` },
        { k: 'code', lang: 'java', cap: 'String DP — LCS and edit distance', src: `// LONGEST COMMON SUBSEQUENCE
// dp[i][j] = LCS length of the first i chars of a and first j chars of b
int lcs(String a, String b) {
    int[][] dp = new int[a.length() + 1][b.length() + 1];

    for (int i = 1; i <= a.length(); i++) {
        for (int j = 1; j <= b.length(); j++) {
            if (a.charAt(i-1) == b.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1] + 1;                    // match: extend diagonal
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);    // drop one char
            }
        }
    }
    return dp[a.length()][b.length()];
}

// EDIT DISTANCE: fewest insert/delete/replace ops to turn a into b
int editDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 0; i <= m; i++) dp[i][0] = i;   // delete everything
    for (int j = 0; j <= n; j++) dp[0][j] = j;   // insert everything

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i-1) == b.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];          // free, characters match
            } else {
                dp[i][j] = 1 + Math.min(dp[i-1][j-1],              // replace
                                Math.min(dp[i-1][j],               // delete
                                         dp[i][j-1]));             // insert
            }
        }
    }
    return dp[m][n];
}` },
        { k: 'cx', time: 'O(m × n)', space: 'O(m × n)', why: 'One entry per pair of positions. Reducible to O(min(m, n)) because each row depends only on the row above.' },
        { k: 'note', tone: 'tip', title: 'The three-neighbour rule', body: 'In almost every 2-D string DP, `dp[i][j]` depends on `dp[i-1][j-1]` (diagonal, characters matched), `dp[i-1][j]` (up, skipped a char in the first string) and `dp[i][j-1]` (left, skipped in the second). Draw a 3×3 grid by hand for two tiny strings before writing code — the recurrence becomes obvious and stays obvious.' },
        { k: 'list', title: 'The family', items: [
          'Unique paths I & II (with obstacles), minimum path sum',
          'Longest common subsequence, longest common substring',
          'Edit distance, one edit distance',
          'Distinct subsequences',
          'Longest palindromic subsequence and substring',
          'Regular expression / wildcard matching (the hard end)',
          'Interleaving string',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-greedy',
      name: 'Greedy',
      week: 20, mins: 160,
      summary: 'Take the locally best option and never look back. Fast when it works, wrong when it does not.',
      blocks: [
        { k: 'p', body: [
          'A greedy algorithm makes the choice that looks best right now and never reconsiders. When it is valid it is beautifully simple — usually a sort plus one pass. When it is not valid it produces confidently wrong answers, which is far more dangerous than being slow.',
          'The hard part is never the code. It is knowing whether greedy is *allowed* for that problem.',
        ]},
        { k: 'analogy', body: 'Making change for £6.30 with UK coins: take the biggest coin that fits, repeat. Optimal, every time. Now imagine a currency with 1, 3 and 4 unit coins and you need 6. Greedy takes 4, then 1, then 1 — three coins. The right answer is 3 + 3 — two coins. Identical algorithm, different coin set, wrong result. Nothing in the code tells you which world you are in.' },
        { k: 'code', lang: 'java', cap: 'Two greedy problems that do work', src: `// JUMP GAME: each value is the max jump length from that spot. Can you reach the end?
// Greedy: track the furthest index reachable so far.
boolean canJump(int[] nums) {
    int furthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > furthest) return false;             // stranded before here
        furthest = Math.max(furthest, i + nums[i]);
    }
    return true;
}

// NON-OVERLAPPING INTERVALS: fewest removals so none overlap.
// Greedy: sort by END time, always keep the one that finishes soonest —
// it leaves the most room for everything after it.
int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int kept = 1;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {   // no overlap, keep it
            kept++;
            lastEnd = intervals[i][1];
        }
    }
    return intervals.length - kept;
}` },
        { k: 'cx', time: 'O(n log n)', space: 'O(1)', why: 'Dominated by the sort; the pass itself is O(n) with a couple of variables.' },
        { k: 'note', tone: 'warn', title: 'How to know if greedy is safe', body: 'Ask: **could taking the best option now ever make a later option impossible in a way that costs more than it saved?** If yes, greedy is unsafe and you need DP. In an interview, try to construct a counter-example in ten seconds — if you cannot, propose greedy and say "I believe the exchange argument holds here because…". Reasoning aloud about *why* it is safe scores far higher than just writing it.' },
        { k: 'list', title: 'Problems where greedy is provably correct', items: [
          'Activity selection / non-overlapping intervals (sort by end)',
          'Merge intervals (sort by start)',
          'Jump game I & II',
          'Gas station',
          'Task scheduler',
          'Assign cookies, boats to save people',
          'Best time to buy and sell stock II (take every rise)',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-intervals',
      name: 'Intervals',
      week: 20, mins: 150,
      summary: 'Sort, then sweep. A small pattern with an outsized presence in interviews.',
      blocks: [
        { k: 'p', body: [
          'Interval problems are calendars, bookings, ranges. They are almost all solved the same way: **sort by start time, then walk through merging or counting.** The variation is only in what you do on overlap.',
        ]},
        { k: 'code', lang: 'java', cap: 'Merge intervals — the base problem', src: `int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));   // by START

    List<int[]> merged = new ArrayList<>();
    int[] current = intervals[0];

    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] <= current[1]) {
            // overlap: stretch the current interval's end
            current[1] = Math.max(current[1], intervals[i][1]);
        } else {
            merged.add(current);       // no overlap: bank it and move on
            current = intervals[i];
        }
    }
    merged.add(current);               // do not forget the last one
    return merged.toArray(new int[0][]);
}` },
        { k: 'code', lang: 'java', cap: 'Meeting rooms II — minimum rooms needed', src: `// Two equivalent approaches. This is the sweep-line one: separate the
// starts and ends, then walk the timeline counting concurrent meetings.
int minMeetingRooms(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n], ends = new int[n];

    for (int i = 0; i < n; i++) {
        starts[i] = intervals[i][0];
        ends[i]   = intervals[i][1];
    }
    Arrays.sort(starts);
    Arrays.sort(ends);

    int rooms = 0, maxRooms = 0, e = 0;
    for (int s = 0; s < n; s++) {
        while (e < n && ends[e] <= starts[s]) { rooms--; e++; }  // meetings that ended
        rooms++;                                                  // one starting now
        maxRooms = Math.max(maxRooms, rooms);
    }
    return maxRooms;
}` },
        { k: 'cx', time: 'O(n log n)', space: 'O(n)', why: 'The sort dominates; the sweep is one linear pass.' },
        { k: 'note', tone: 'tip', title: 'Sort by start or by end?', body: '**By start** when merging or combining overlapping ranges. **By end** when maximising how many non-overlapping items you can keep (finishing earliest leaves the most room for the rest). Getting this backwards is the classic interval mistake — say which one you are choosing and why before you write the sort.' },
        { k: 'list', title: 'The problems', items: [
          'Merge intervals; insert interval',
          'Non-overlapping intervals (minimum removals)',
          'Meeting rooms I (can one person attend all?) and II (how many rooms?)',
          'Interval list intersections',
          'Car pooling, my calendar I/II',
          'Employee free time',
        ]},
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-trie',
      name: 'Trie (prefix tree)',
      week: 21, mins: 150,
      summary: 'A tree of characters. Prefix search in O(length), independent of dictionary size.',
      blocks: [
        { k: 'p', body: [
          'A trie stores strings by sharing their common prefixes. "car", "card" and "care" all walk the same first three nodes. Looking up a word costs O(word length) — completely independent of how many words are stored.',
          'That property is why autocomplete uses one. A HashSet can tell you whether a whole word exists; only a trie can efficiently answer "give me everything starting with car".',
        ]},
        { k: 'analogy', body: 'A library where books are filed by spelling the title letter by letter down a corridor of doors. Everything beginning "hist-" is behind the same four doors, so "show me every history book" is just walking to that door and taking everything below it. A hash-based index cannot do that — it scatters similar titles deliberately.' },
        { k: 'code', lang: 'java', cap: 'A complete trie', src: `class Trie {
    private final TrieNode root = new TrieNode();

    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];   // lowercase a-z
        boolean isEndOfWord;
    }

    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isEndOfWord = true;
    }

    boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.isEndOfWord;   // must be a complete word
    }

    boolean startsWith(String prefix) {
        return walk(prefix) != null;                // the prefix alone is enough
    }

    private TrieNode walk(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) return null;
            node = node.children[i];
        }
        return node;
    }
}` },
        { k: 'cx', time: 'O(L)', space: 'O(total characters × 26)', why: 'L is the word length. Every operation walks one node per character. Space is generous — a HashMap of children instead of a 26-array saves a lot when the alphabet is sparse.' },
        { k: 'list', title: 'When a trie is the answer', items: [
          'Implement a trie / add and search word (with `.` wildcards → DFS)',
          'Autocomplete and typeahead',
          'Word search II — a trie over the dictionary, then DFS the board once',
          'Longest common prefix of a set of strings',
          'Replace words / word break with a large dictionary',
          'IP routing and phone-number prefix matching (real-world use)',
        ]},
        { k: 'note', tone: 'tip', title: 'The tell', body: 'If the problem involves **many words and prefix queries**, it is a trie. If it involves many words and only whole-word membership, a HashSet is simpler and faster — say so. Choosing the simpler structure when it suffices is itself a signal.' },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'dsa-bit-manipulation',
      name: 'Bit manipulation',
      week: 21, mins: 130,
      summary: 'Low frequency, high payoff when it appears. A handful of tricks covers it.',
      blocks: [
        { k: 'p', body: [
          'Numbers are stored as bits, and a few operators let you work on them directly. It is a small topic — maybe one question in fifteen — but the tricks are short and memorisable, so the return per hour is good.',
        ]},
        { k: 'table', title: 'The operators', head: ['Op', 'Name', 'Effect'], rows: [
          ['`&`', 'AND', '1 only when both bits are 1 — used for masking'],
          ['`|`', 'OR', '1 when either is 1 — used for setting'],
          ['`^`', 'XOR', '1 when the bits differ — self-cancelling'],
          ['`~`', 'NOT', 'Flips every bit'],
          ['`<<`', 'Left shift', 'Multiply by 2 per shift'],
          ['`>>`', 'Right shift', 'Divide by 2 (sign-preserving)'],
          ['`>>>`', 'Unsigned right shift', 'Divide by 2, fills with 0 — Java-specific'],
        ]},
        { k: 'code', lang: 'java', cap: 'The tricks worth memorising', src: `// XOR cancels itself: x ^ x == 0, and x ^ 0 == x.
// So XOR-ing everything leaves only the element that appears once.
int singleNumber(int[] nums) {
    int result = 0;
    for (int x : nums) result ^= x;
    return result;
}

// Is a power of two? A power of two has exactly one bit set,
// and n & (n-1) clears the lowest set bit.
boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

// Count set bits (Brian Kernighan's) — loops once per SET bit, not per bit.
int countBits(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);   // clear the lowest set bit
        count++;
    }
    return count;
}

// Standard bit operations on position i
boolean isSet(int n, int i) { return (n & (1 << i)) != 0; }
int set(int n, int i)       { return n | (1 << i); }
int clear(int n, int i)     { return n & ~(1 << i); }
int toggle(int n, int i)    { return n ^ (1 << i); }

// Swap without a temporary (a party trick, but it does get asked)
a = a ^ b;  b = a ^ b;  a = a ^ b;` },
        { k: 'cx', time: 'O(1)', space: 'O(1)', why: 'Bit operations are single CPU instructions on fixed-width integers.' },
        { k: 'list', title: 'The problems', items: [
          'Single number I (XOR), II and III (harder variants)',
          'Number of 1 bits, counting bits from 0 to n',
          'Reverse bits',
          'Missing number (XOR indices against values)',
          'Sum of two integers without `+`',
          'Subsets via bitmask — an alternative to backtracking',
        ]},
        { k: 'note', tone: 'tip', title: 'Where this actually pays off', body: 'Beyond puzzle questions, bitmasks are how you represent "which of these ≤20 things have I used" as a single `int` in DP — travelling salesman, assignment problems. If you see a constraint like `n ≤ 20`, a bitmask DP is very likely the intended solution.' },
      ],
    },
  ],
}
