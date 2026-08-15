export const frontend = {
  id: 'frontend',
  name: 'Frontend — HTML, CSS, JS & React',
  icon: '◧',
  blurb: 'A brush-up for a backend-leaning engineer with real frontend history. Depth where it is asked — the event loop, closures, rendering, hooks — not a beginner tutorial.',
  weeks: 'Weeks 2–24 (light, alongside)',
  topics: [
    {
      id: 'fe-html',
      name: 'HTML — semantics & accessibility',
      week: 2, mins: 90,
      summary: 'The part that separates someone who writes divs from someone who writes markup.',
      blocks: [
        { k: 'p', body: [
          'Almost any layout can be built with `div` and `span`. The reason not to is that semantic elements carry **meaning** — for screen readers, for search engines, for keyboard navigation, and for the next developer.',
          'This is also the most reliable frontend interview filter: "what is the difference between a div and a section" tells the interviewer immediately whether you have thought about markup at all.',
        ]},
        { k: 'code', lang: 'javascript', cap: 'Semantic structure vs div soup', src: `<!-- DIV SOUP: works visually, communicates nothing -->
<div class="header">
  <div class="nav"><div class="link">Home</div></div>
</div>
<div class="main"><div class="article">...</div></div>

<!-- SEMANTIC: a screen reader can jump between landmarks;
     keyboard users get real focus behaviour for free -->
<header>
  <nav aria-label="Main">
    <ul><li><a href="/">Home</a></li></ul>
  </nav>
</header>

<main>
  <article>
    <h1>Title</h1>
    <section>
      <h2>A section</h2>
      <p>Body text.</p>
    </section>
  </article>

  <aside aria-label="Related">...</aside>
</main>

<footer>...</footer>` },
        { k: 'table', title: 'The elements that carry meaning', head: ['Element', 'Use for'], rows: [
          ['`<header>` / `<footer>`', 'Top and bottom of a page *or* of an article'],
          ['`<nav>`', 'A block of navigation links'],
          ['`<main>`', 'The primary content. **Exactly one per page.**'],
          ['`<article>`', 'Self-contained and independently distributable — a post, a card'],
          ['`<section>`', 'A thematic grouping. Should have a heading.'],
          ['`<aside>`', 'Tangential content — sidebar, pull quote'],
          ['`<button>` vs `<div onClick>`', '**Always `<button>`** — keyboard, focus, Enter/Space, screen-reader role, all free'],
        ]},
        { k: 'code', lang: 'javascript', cap: 'Forms and accessibility — the bits that get reviewed', src: `<!-- Labels MUST be associated. Placeholder is not a label —
     it disappears on focus and screen readers may skip it. -->
<label for="email">Email address</label>
<input
  id="email"
  name="email"
  type="email"
  autocomplete="email"
  required
  aria-describedby="email-help email-error"
/>
<p id="email-help">We will never share this.</p>
<p id="email-error" role="alert">Please enter a valid email.</p>

<!-- Correct input types give mobile users the right keyboard for free -->
<input type="tel">     <!-- numeric keypad -->
<input type="email">   <!-- @ key -->
<input type="number">
<input type="date">

<!-- Images: alt describes PURPOSE. Decorative images get alt="" so
     screen readers skip them entirely. -->
<img src="chart.png" alt="Revenue grew 40% between Q1 and Q3">
<img src="divider.png" alt="">` },
        { k: 'note', tone: 'tip', title: 'The four accessibility rules that cover most of it', body: '**(1)** Every input has an associated `<label>`. **(2)** Everything clickable is reachable and activatable by keyboard — which you get free by using `<button>` and `<a>`. **(3)** Text has sufficient contrast (4.5:1 for body). **(4)** Focus is visible — never `outline: none` without replacing it. Those four, plus semantic landmarks, cover the large majority of real accessibility failures.' },
      ],
    },
    {
      id: 'fe-css-layout',
      name: 'CSS — the box model, flexbox & grid',
      week: 3, mins: 140, tag: 'core',
      summary: 'Layout is the whole job. Flexbox for one dimension, Grid for two.',
      blocks: [
        { k: 'code', lang: 'javascript', cap: 'The box model — and the one line everyone sets', src: `/* By default, width = CONTENT only. Padding and border are added ON TOP,
   so width:300px + padding:20px + border:2px actually occupies 344px. */

/* border-box makes width mean the TOTAL. Set this globally, always. */
*, *::before, *::after { box-sizing: border-box; }

/* MARGIN COLLAPSE — a real source of confusion:
   vertical margins between siblings COLLAPSE to the larger of the two,
   they do not add. 20px below + 30px above = 30px gap, not 50px.
   It does not happen in flex or grid containers — another reason to use them. */` },
        { k: 'code', lang: 'javascript', cap: 'Flexbox — one dimension at a time', src: `.container {
  display: flex;
  flex-direction: row;          /* row | column */
  justify-content: space-between;  /* along the MAIN axis */
  align-items: center;             /* along the CROSS axis */
  gap: 16px;                       /* use this, not margins on children */
  flex-wrap: wrap;
}

.item {
  /* shorthand for: flex-grow  flex-shrink  flex-basis */
  flex: 1;            /* = 1 1 0%   -> share space equally */
  flex: 0 0 200px;    /* fixed 200px, never grow or shrink */
  flex: 1 1 auto;     /* grow and shrink from the content size */
}

/* The classic: push one item to the far end */
.nav { display: flex; }
.nav .spacer { margin-left: auto; }

/* Perfect centering, two lines */
.centre { display: flex; justify-content: center; align-items: center; }` },
        { k: 'note', tone: 'trap', title: 'justify vs align — the thing everyone forgets', body: '`justify-content` works along the **main** axis, `align-items` along the **cross** axis. With `flex-direction: row` the main axis is horizontal — so justify is horizontal, align is vertical. Switch to `column` and **they swap**. That is why centring "stops working" when someone changes the direction. Say "main axis" and "cross axis" rather than "horizontal" and "vertical" and you will never get it wrong.' },
        { k: 'code', lang: 'javascript', cap: 'Grid — two dimensions at once', src: `.layout {
  display: grid;
  grid-template-columns: 250px 1fr;    /* fixed sidebar, fluid main */
  grid-template-rows: auto 1fr auto;    /* header, body, footer */
  min-height: 100vh;
  gap: 20px;
}

/* Named areas — very readable for page layouts */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }

/* RESPONSIVE WITHOUT MEDIA QUERIES — the single most useful grid line.
   "as many columns as fit, each at least 260px, sharing space equally" */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}` },
        { k: 'table', title: 'Which one', head: ['Use Flexbox when', 'Use Grid when'], rows: [
          ['Laying out along ONE axis', 'You need rows AND columns'],
          ['Content size should drive the layout', 'The layout should drive content placement'],
          ['Navbars, toolbars, button rows', 'Page layouts, card galleries, dashboards'],
          ['You do not know how many items', 'You want explicit alignment in both directions'],
        ]},
        { k: 'code', lang: 'javascript', cap: 'Specificity & the cascade — why your rule is not applying', src: `/* Specificity is counted as (inline, id, class, element): */
p                    /* 0,0,0,1 */
.text                /* 0,0,1,0 */
#main                /* 0,1,0,0 */
#main .text p        /* 0,1,1,1  <- wins over all of the above */
style="..."          /* 1,0,0,0 */
!important           /* beats everything — an escape hatch, not a tool */

/* When two rules have EQUAL specificity, the LAST one in source order wins.
   This is why import order matters, and why a component's own stylesheet
   should load after the framework's. */

/* MODERN ANSWER: sidestep the whole problem with custom properties,
   which cascade cleanly and can be overridden per-scope. */
:root { --brand: #2A3B8F; --gap: 16px; }
.card { color: var(--brand); padding: var(--gap); }
.card.compact { --gap: 8px; }        /* redefine the token, not the rule */` },
      ],
    },
    {
      id: 'fe-css-responsive',
      name: 'CSS — responsive & modern layout',
      week: 2, mins: 100,
      summary: 'Mobile-first, units that actually work, and the modern features worth using.',
      blocks: [
        { k: 'code', lang: 'javascript', cap: 'Mobile-first media queries', src: `/* Write the MOBILE styles first, unconditionally.
   Then ADD complexity at larger widths with min-width queries.
   The reverse (max-width) means every small screen — the weakest
   devices — must parse and override the desktop rules. */

.container { padding: 16px; }                    /* mobile: the default */

@media (min-width: 768px) {                       /* tablet and up */
  .container { padding: 32px; max-width: 720px; margin: 0 auto; }
}

@media (min-width: 1200px) {                      /* desktop and up */
  .container { max-width: 1140px; }
}

/* Respect user preferences — both of these are expected in a review */
@media (prefers-color-scheme: dark)   { :root { --bg: #15171B; } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important;
                           transition-duration: .01ms !important; }
}` },
        { k: 'table', title: 'Units — when to use which', head: ['Unit', 'Relative to', 'Use for'], rows: [
          ['`px`', 'Nothing — absolute', 'Borders, tiny fixed offsets'],
          ['`rem`', 'Root font size', '**Spacing and font sizes.** Scales with user preference.'],
          ['`em`', 'The element\'s own font size', 'Padding that should scale with its own text'],
          ['`%`', 'The parent', 'Widths inside a known container'],
          ['`vw` / `vh`', 'Viewport', 'Full-screen sections. Watch mobile address bars — prefer `dvh`.'],
          ['`fr`', 'Free space in a grid', 'Grid columns'],
          ['`ch`', 'Width of "0"', '**Line length.** `max-width: 65ch` is the readability sweet spot.'],
        ]},
        { k: 'code', lang: 'javascript', cap: 'Modern CSS worth knowing', src: `/* clamp(min, preferred, max) — fluid type with no media queries at all */
h1 { font-size: clamp(1.75rem, 5vw, 3.5rem); }

/* Container queries — respond to the PARENT's width, not the viewport.
   This is what component-based design always needed. */
.card-wrapper { container-type: inline-size; }
@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 120px 1fr; }
}

/* :has() — the "parent selector" that was impossible for 20 years */
.card:has(img)          { padding-top: 0; }
label:has(+ input:invalid) { color: red; }

/* Logical properties — work in RTL languages automatically */
.box { margin-inline: auto; padding-block: 1rem; }

/* aspect-ratio — no more padding-top:56.25% hacks */
.video { aspect-ratio: 16 / 9; width: 100%; }` },
        { k: 'note', tone: 'tip', title: 'The two-line answer to "how do you make it responsive?"', body: '*"Mobile-first with min-width queries, relative units (rem for spacing, ch for line length), and layouts that reflow without breakpoints wherever possible — `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))` handles a card grid at every width with no media query at all. Then container queries for components that need to respond to their own space rather than the viewport."*' },
      ],
    },
    {
      id: 'fe-js-core',
      name: 'JavaScript — scope, closures & `this`',
      week: 5, mins: 160, tag: 'core',
      summary: 'The three things every JS interview probes. Closures especially.',
      blocks: [
        { k: 'code', lang: 'javascript', cap: 'var / let / const, and hoisting', src: `// var: FUNCTION-scoped, hoisted and initialised to undefined
// let/const: BLOCK-scoped, hoisted but in the "temporal dead zone"

console.log(a);   // undefined   <- var is hoisted AND initialised
var a = 1;

console.log(b);   // ReferenceError: Cannot access 'b' before initialization
let b = 1;        //                 ^ the temporal dead zone

// The classic loop bug
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));   // 3 3 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));   // 0 1 2
// var: ONE binding shared by all three callbacks, read after the loop ends.
// let: a NEW binding per iteration, captured separately.

// const prevents REASSIGNMENT, not mutation
const arr = [1, 2];
arr.push(3);        // fine — the array is mutated, the binding is not
// arr = [];        // TypeError` },
        { k: 'code', lang: 'javascript', cap: 'Closures — the most asked JS concept', src: `// A closure is a function that REMEMBERS the scope it was created in,
// even after that scope has finished executing.

function counter() {
  let count = 0;                 // this lives on because inner() references it
  return function inner() {
    count++;
    return count;
  };
}

const c1 = counter();
c1();  // 1
c1();  // 2
const c2 = counter();
c2();  // 1   <- a SEPARATE closure with its own count

// Practical use 1: private state (the module pattern)
const store = (() => {
  let items = [];                          // genuinely private
  return {
    add: (x) => items.push(x),
    get size() { return items.length; },
  };
})();

// Practical use 2: debounce — the timer id is held in the closure
function debounce(fn, delay) {
  let timer;                               // persists between calls
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
const search = debounce((q) => api.search(q), 300);` },
        { k: 'code', lang: 'javascript', cap: '`this` — determined by HOW a function is called', src: `// Rule order, highest priority first:
// 1. new          -> the newly created object
// 2. call/apply/bind -> whatever you passed
// 3. method call  -> the object before the dot
// 4. plain call   -> undefined in strict mode, globalThis otherwise
// 5. arrow fn     -> LEXICAL: inherited from where it was DEFINED

const obj = {
  name: 'obj',
  regular() { return this.name; },          // 'obj' — called as obj.regular()
  arrow: () => this?.name,                   // undefined — 'this' is the module
};

// The classic bug
const fn = obj.regular;
fn();                    // undefined — 'this' is lost, it is now a plain call

// Three fixes
const bound = obj.regular.bind(obj);
obj.regular.call(obj);
setTimeout(() => obj.regular(), 0);          // arrow keeps the outer 'this'

// Why arrow functions fixed React class components:
class Button {
  handleClick = () => {                       // arrow -> 'this' is the instance
    console.log(this.props);                  // works when passed as a callback
  };
}` },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'What is a closure and where have you used one?', a: 'A function that retains access to its defining scope after that scope has returned. Practical uses: private state without a class, debounce and throttle (the timer id lives in the closure), memoisation caches, and every React hook — `useState` returns a setter that closes over the state slot for that component instance.' },
          { q: 'Can closures cause memory leaks?', a: 'Yes. A closure keeps its entire enclosing scope alive, so if a long-lived callback closes over a large object, that object cannot be collected. The classic case is an event listener that captures a big DOM subtree and is never removed — hence removing listeners in cleanup, which is what a React `useEffect` return function is for.' },
        ]},
      ],
    },
    {
      id: 'fe-js-async',
      name: 'JavaScript — the event loop & async',
      week: 6, mins: 150, tag: 'core',
      summary: 'How single-threaded JavaScript does concurrency. Guaranteed question.',
      blocks: [
        { k: 'p', body: [
          'JavaScript runs on **one thread**. It achieves concurrency by never blocking: slow work (network, timers, file I/O) is handed to the environment, and a callback is queued for when it completes.',
          'The **event loop** is the rule that decides what runs next: when the call stack is empty, drain the **microtask** queue completely, then take **one** macrotask, then drain microtasks again, and repeat.',
        ]},
        { k: 'analogy', body: 'A single chef in a kitchen. They never stand watching a pot boil — they put it on, set a timer, and start the next dish. When a timer goes off they finish that dish at the next natural break. Microtasks are "and while I am here, plate the thing that is already cooked"; macrotasks are "start the next order". Everything already cooked gets plated before a new order starts.' },
        { k: 'code', lang: 'javascript', cap: 'The classic ordering question — work it out before reading on', src: `console.log('1');

setTimeout(() => console.log('2'), 0);         // MACROtask

Promise.resolve().then(() => console.log('3')); // MICROtask

queueMicrotask(() => console.log('4'));         // MICROtask

console.log('5');

// OUTPUT: 1, 5, 3, 4, 2
//
// 1 and 5 are synchronous — they run immediately.
// Then the stack empties, so ALL microtasks drain: 3, then 4.
// Only then is one macrotask taken: 2.
//
// The rule: microtasks (promises, queueMicrotask) ALWAYS run before
// the next macrotask (setTimeout, setInterval, I/O), no matter that
// the timeout was 0.` },
        { k: 'code', lang: 'javascript', cap: 'Promises and async/await in practice', src: `// async/await is syntax over promises — an async function ALWAYS
// returns a promise, and await pauses only that function, not the thread.

async function loadDashboard(userId) {
  try {
    // SEQUENTIAL — 100ms + 150ms + 200ms = 450ms.
    // Only do this when each call depends on the previous result.
    const user    = await fetchUser(userId);
    const orders  = await fetchOrders(user.id);

    // PARALLEL — total = the SLOWEST call, not the sum.
    // Start them all, then await them together.
    const [profile, prefs, notifications] = await Promise.all([
      fetchProfile(userId),
      fetchPrefs(userId),
      fetchNotifications(userId),
    ]);

    return { user, orders, profile, prefs, notifications };
  } catch (err) {
    // Promise.all REJECTS FAST — one failure fails the whole thing.
    console.error('Dashboard failed', err);
    throw err;
  }
}

// When partial failure is acceptable, use allSettled
const results = await Promise.allSettled([a(), b(), c()]);
results.forEach(r => {
  if (r.status === 'fulfilled') use(r.value);
  else                          log(r.reason);
});

// Promise.race — first to settle wins. A timeout, for example:
const withTimeout = (p, ms) => Promise.race([
  p,
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
]);` },
        { k: 'note', tone: 'trap', title: 'The await-in-a-loop mistake', body: '`for (const id of ids) { await fetch(id); }` runs every request **one after another** — 100 ids at 100ms each is 10 seconds. If the calls are independent, use `await Promise.all(ids.map(fetch))` and it is 100ms. This is the most common real performance bug in async JavaScript, and interviewers look for it specifically. Sequential is only correct when each iteration genuinely depends on the last.' },
        { k: 'qa', title: 'Asked in interviews', items: [
          { q: 'Is JavaScript single-threaded? Then how is it concurrent?', a: 'The JS execution thread is single. Concurrency comes from the runtime: the browser or Node hands off timers, network and file I/O to other threads (or the OS), and queues a callback when the work completes. The event loop then runs those callbacks on the one JS thread. So JS is single-threaded but non-blocking — and genuinely CPU-bound work *will* freeze the UI, which is what Web Workers are for.' },
          { q: 'callback vs promise vs async/await?', a: 'All the same underlying mechanism, increasing readability. Callbacks nest into "callback hell" and have no standard error channel. Promises flatten it into a chain with `.catch`. async/await makes asynchronous code read top-to-bottom like synchronous code, with normal try/catch — which is the real win, because you get ordinary control flow back.' },
        ]},
      ],
    },
    {
      id: 'fe-js-modern',
      name: 'JavaScript — ES6+ and the bits you use daily',
      week: 7, mins: 110,
      summary: 'Destructuring, spread, optional chaining, modules, and the equality rules.',
      blocks: [
        { k: 'code', lang: 'javascript', cap: 'Destructuring and spread', src: `// Object destructuring, with renaming and defaults
const { name, age = 0, address: { city } = {} } = user;

// In function parameters — very common in React
function Card({ title, subtitle = '', onClick }) { }

// Array destructuring, and swapping
const [first, second, ...rest] = [1, 2, 3, 4, 5];
let [a, b] = [1, 2];
[a, b] = [b, a];                       // swap, no temp variable

// Spread — SHALLOW copies
const merged  = { ...defaults, ...overrides };     // later wins
const appended = [...arr1, ...arr2];

// Immutable update patterns — the backbone of React state
const updated = { ...user, name: 'New' };
const withItem = [...items, newItem];
const without  = items.filter(i => i.id !== id);
const mapped   = items.map(i => i.id === id ? { ...i, done: true } : i);

// SHALLOW is the trap: nested objects are still shared references
const copy = { ...user };
copy.address.city = 'X';               // ALSO changes user.address.city
const deep = structuredClone(user);    // modern deep clone` },
        { k: 'code', lang: 'javascript', cap: 'Optional chaining, nullish coalescing, and equality', src: `// ?.  short-circuits to undefined instead of throwing
const city = user?.address?.city;
const first = users?.[0]?.name;
callback?.();                          // only call if it exists

// ??  falls back only on null/undefined — NOT on falsy values
const count1 = value ?? 10;            // 0 stays 0        <- usually what you want
const count2 = value || 10;            // 0 becomes 10     <- classic bug

// == vs ===
0 == '0'          // true   — == coerces types
0 === '0'         // false  — === compares type AND value
null == undefined // true
null === undefined// false
NaN === NaN       // false! use Number.isNaN(x) or Object.is(a, b)
[] == false       // true   — this is why you always use ===

// Falsy values, in full: false, 0, -0, 0n, "", null, undefined, NaN
// EVERYTHING else is truthy — including [] and {}.` },
        { k: 'code', lang: 'javascript', cap: 'Modules and useful built-ins', src: `// ES modules
export const helper = () => {};
export default class Service {}
import Service, { helper } from './service.js';
import * as utils from './utils.js';
const mod = await import('./heavy.js');    // dynamic — this is code splitting

// Array methods worth having at your fingertips
arr.map(fn); arr.filter(fn); arr.reduce(fn, init);
arr.find(fn); arr.findIndex(fn); arr.some(fn); arr.every(fn);
arr.flat(2); arr.flatMap(fn); arr.at(-1);          // last element
[...new Set(arr)];                                  // dedupe

// Object helpers
Object.entries(obj).map(([k, v]) => ...);
Object.fromEntries(pairs);
Object.groupBy(items, item => item.category);       // recent, very handy

// Map vs plain object: Map allows ANY key type, preserves insertion
// order, has .size, and is faster for frequent add/delete.
const cache = new Map();
cache.set(objKey, value);` },
      ],
    },
    {
      id: 'fe-dom-events',
      name: 'The DOM & event handling',
      week: 8, mins: 90,
      summary: 'Bubbling, delegation, and why frameworks exist.',
      blocks: [
        { k: 'code', lang: 'javascript', cap: 'Event propagation — three phases', src: `// A click travels: CAPTURE (window -> target), then TARGET,
// then BUBBLE (target -> window). Handlers run on bubble by default.

parent.addEventListener('click', handler);           // bubble phase
parent.addEventListener('click', handler, true);     // capture phase

element.addEventListener('click', (e) => {
  e.stopPropagation();      // stop it travelling further up
  e.preventDefault();       // cancel the default action (form submit, link nav)
  e.target;                 // what was ACTUALLY clicked
  e.currentTarget;          // what the listener is ATTACHED to
});` },
        { k: 'code', lang: 'javascript', cap: 'Event delegation — one listener instead of a thousand', src: `// BAD: a listener per row. 1,000 rows = 1,000 listeners, and rows added
// later have none at all.
document.querySelectorAll('.row').forEach(row =>
  row.addEventListener('click', handleClick));

// GOOD: ONE listener on the container. Works for rows added later,
// uses far less memory, and nothing to clean up per row.
document.querySelector('#table').addEventListener('click', (e) => {
  const row = e.target.closest('.row');       // walk up to the row
  if (!row) return;                            // clicked outside a row
  handleClick(row.dataset.id);
});

// This is exactly what React does internally — it attaches a small number
// of listeners at the root and dispatches from there.` },
        { k: 'p', title: 'Why frameworks exist', body: [
          'Direct DOM manipulation is **slow** because each change can force layout recalculation, and it is **error-prone** because your UI state and your data live in two places that drift apart.',
          'React\'s answer is to make the UI a *function of state*: you describe what the UI should look like for the current data, and React works out the minimum DOM operations to get there. You stop writing "find the element, change its text" and start writing "given this data, here is the markup".',
        ]},
        { k: 'note', tone: 'tip', title: 'Debounce vs throttle', body: '**Debounce** waits for a pause — fire only after N ms of *silence*. Use for search-as-you-type: you want the request after they stop typing. **Throttle** fires at most once per N ms regardless — use for scroll and resize handlers, where you want regular updates but not 200 a second. Being able to state the difference and pick correctly is a standard frontend question.' },
      ],
    },
    {
      id: 'fe-react-core',
      name: 'React — components, JSX & state basics',
      week: 21, mins: 120, tag: 'core',
      summary: 'The mental model: UI as a function of state.',
      blocks: [
        { k: 'code', lang: 'javascript', cap: 'The fundamentals', src: `// A component is a function that takes props and returns JSX.
function UserCard({ user, onSelect }) {
  return (
    <article className="card" onClick={() => onSelect(user.id)}>
      <h2>{user.name}</h2>
      {user.isAdmin && <span className="badge">Admin</span>}
      {user.bio ? <p>{user.bio}</p> : <p className="muted">No bio</p>}
    </article>
  );
}

// JSX is not HTML — it compiles to React.createElement calls.
// The differences that catch people:
//   class      -> className
//   for        -> htmlFor
//   onclick    -> onClick   (camelCase)
//   style      -> an object: style={{ color: 'red', fontSize: 14 }}
//   must return ONE root -> use a fragment <>...</> if needed

// Lists need a STABLE key
{users.map(u => <UserCard key={u.id} user={u} />)}
// key={index} is a bug whenever the list can reorder, filter or have
// items inserted — React matches elements by key, so an index key makes
// it reuse the wrong component and state ends up attached to the wrong row.` },
        { k: 'code', lang: 'javascript', cap: 'State — and the rules that trip people up', src: `function Counter() {
  const [count, setCount] = useState(0);

  // WRONG when updates batch: both read the same stale 'count'
  const addTwoBroken = () => { setCount(count + 1); setCount(count + 1); };  // +1

  // RIGHT: the functional form receives the latest value
  const addTwo = () => { setCount(c => c + 1); setCount(c => c + 1); };      // +2

  return <button onClick={addTwo}>{count}</button>;
}

// STATE IS IMMUTABLE. Mutating it does not re-render, because React
// compares by reference and the reference did not change.
const [items, setItems] = useState([]);

items.push(newItem);            // BROKEN — no re-render
setItems([...items, newItem]);  // correct

setUser({ ...user, name: 'New' });                    // object
setUsers(users.map(u => u.id === id ? { ...u, done: true } : u));  // in a list

// Derived values do NOT belong in state — just compute them.
const [items2, setItems2] = useState([]);
const total = items2.reduce((s, i) => s + i.price, 0);   // no useState needed` },
        { k: 'note', tone: 'trap', title: 'Two state mistakes that cause most bugs', body: '**(1) Mutating state directly.** React re-renders when the reference changes; `push` keeps the same array, so nothing happens and it looks like React is broken. **(2) Duplicating derived data into state.** If `total` is computed from `items`, storing it separately means two sources of truth that will drift. Compute it during render — that is cheap, and always correct.' },
      ],
    },
    {
      id: 'fe-react-hooks',
      name: 'React — hooks in depth',
      week: 22, mins: 170, tag: 'core',
      summary: 'useEffect properly, the memo hooks, refs, and writing your own.',
      blocks: [
        { k: 'code', lang: 'javascript', cap: 'useEffect — dependencies and cleanup', src: `// Runs AFTER render. The dependency array controls when.
useEffect(() => { });              // after EVERY render — usually a bug
useEffect(() => { }, []);          // once, on mount
useEffect(() => { }, [userId]);    // whenever userId changes

// CLEANUP: the returned function runs before the next effect AND on unmount.
// This is where you undo subscriptions, timers and in-flight requests.
useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(e => { if (e.name !== 'AbortError') setError(e); });

  return () => controller.abort();   // cancel if userId changes mid-flight
}, [userId]);                         // <- without this, a slow earlier
                                      //    response can overwrite a newer one

// Subscriptions
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);   // ALWAYS
}, []);` },
        { k: 'note', tone: 'trap', title: 'The infinite loop, and why it happens', body: 'Putting an object, array or function in the dependency array recreates it on every render, so the effect runs, sets state, re-renders, recreates the dependency, runs again — forever. Fixes: move the object *inside* the effect, wrap it in `useMemo`/`useCallback`, or depend on a primitive (`user.id` rather than `user`). This is the single most common React bug and a guaranteed interview question.' },
        { k: 'code', lang: 'javascript', cap: 'useMemo, useCallback, useRef', src: `// useMemo — cache an expensive COMPUTATION between renders
const sorted = useMemo(
  () => hugeList.sort((a, b) => a.value - b.value),
  [hugeList]
);

// useCallback — cache a FUNCTION IDENTITY so memoised children do not
// re-render just because the parent did. useCallback(fn, deps) is
// exactly useMemo(() => fn, deps).
const handleSelect = useCallback((id) => setSelected(id), []);

// useRef — a mutable box that survives renders and does NOT trigger one
const inputRef = useRef(null);            // DOM access
useEffect(() => inputRef.current?.focus(), []);

const renderCount = useRef(0);            // mutable value, no re-render
renderCount.current++;

const timerRef = useRef();                // hold a timer id
useEffect(() => {
  timerRef.current = setInterval(tick, 1000);
  return () => clearInterval(timerRef.current);
}, []);

// useReducer — when the next state depends on the previous in complex ways
const [state, dispatch] = useReducer(reducer, { count: 0, status: 'idle' });` },
        { k: 'note', tone: 'warn', title: 'Do not memoise everything', body: '`useMemo` and `useCallback` are not free — they cost memory and a dependency comparison every render. Wrapping a cheap arithmetic expression is a net loss. Reach for them only when **(a)** the computation is genuinely expensive, or **(b)** you are passing a value or callback into a `React.memo` child whose re-renders you are trying to prevent. "Measure with the Profiler first" is the answer interviewers want.' },
        { k: 'code', lang: 'javascript', cap: 'Custom hooks — extracting stateful logic', src: `// A custom hook is just a function starting with 'use' that calls
// other hooks. This is how you share LOGIC (not markup) between components.
function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(\`HTTP \${r.status}\`); return r.json(); })
      .then(setData)
      .catch(e => { if (e.name !== 'AbortError') setError(e); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// THE RULES OF HOOKS: only call them at the TOP LEVEL of a component or
// another hook — never in a condition, loop or nested function. React
// matches hooks to state slots BY CALL ORDER, so a conditional hook
// shifts every subsequent hook onto the wrong slot.` },
      ],
    },
    {
      id: 'fe-react-rendering',
      name: 'React — rendering, reconciliation & performance',
      week: 23, mins: 140,
      summary: 'What actually causes a re-render, and how to stop the unnecessary ones.',
      blocks: [
        { k: 'p', title: 'What triggers a re-render', body: [
          'Exactly three things: **its own state changed**, **its parent re-rendered**, or **a context it consumes changed**. Notably, props changing is not a separate cause — props change *because* the parent re-rendered.',
          'When a component re-renders, React builds a new virtual DOM tree, **diffs** it against the previous one (reconciliation), and applies only the differences to the real DOM. Re-rendering is therefore not automatically expensive — the expensive part is the DOM work, which React is already minimising.',
        ]},
        { k: 'code', lang: 'javascript', cap: 'Stopping unnecessary re-renders', src: `// React.memo — skip re-render if props are shallow-equal
const Row = React.memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

// But memo is DEFEATED by a new object or function identity each render:
function List({ items }) {
  // BROKEN: a new arrow function every render -> onSelect always "changed"
  return items.map(i => <Row key={i.id} item={i} onSelect={(id) => pick(id)} />);
}

function ListFixed({ items }) {
  const onSelect = useCallback((id) => pick(id), []);   // stable identity
  return items.map(i => <Row key={i.id} item={i} onSelect={onSelect} />);
}

// Same trap with objects:
<Child config={{ theme: 'dark' }} />              // new object every render
const config = useMemo(() => ({ theme: 'dark' }), []);   // stable` },
        { k: 'code', lang: 'javascript', cap: 'Why keys matter — a concrete failure', src: `// Items: [A, B, C], rendered with key={index} -> keys 0, 1, 2
// Now DELETE A.  New list [B, C] -> keys 0, 1
//
// React compares by key:
//   key 0: was A, now B  -> React REUSES A's component instance and
//                            just changes the props. Any internal state
//                            (an open dropdown, text typed in an input)
//                            stays attached to the WRONG row.
//   key 2: gone          -> unmounted
//
// With key={item.id}, React sees B and C unchanged and A removed.
// It unmounts A's instance and leaves B and C completely alone.

{items.map((item, i) => <Row key={item.id} item={item} />)}   // correct` },
        { k: 'code', lang: 'javascript', cap: 'Code splitting and lists at scale', src: `// Lazy-load a route or heavy component — it becomes a separate bundle
const Dashboard = React.lazy(() => import('./Dashboard'));

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>

// LONG LISTS: rendering 10,000 rows creates 10,000 DOM nodes and will
// jank. Virtualise — render only what is visible (react-window etc.).
// The concept matters more than the library: a windowed list renders
// ~20 rows regardless of whether the data has 100 or 100,000 items.` },
        { k: 'list', title: 'The optimisation order — do it in this sequence', items: [
          '**Measure first** with the React Profiler. Most "performance problems" are one specific component.',
          '**Fix keys.** Index keys cause both bugs and wasted work.',
          '**Move state down.** If only a subtree needs it, do not hold it at the root — that re-renders everything.',
          '**Split contexts.** One context holding many values re-renders every consumer when any value changes.',
          '**Then** `React.memo` + `useCallback`/`useMemo` on the hot path.',
          '**Virtualise** long lists, **lazy-load** heavy routes.',
        ]},
      ],
    },
    {
      id: 'fe-react-state-mgmt',
      name: 'React — state management & data fetching',
      week: 23, mins: 120,
      summary: 'Context, Redux Toolkit, and the server-state distinction that changed everything.',
      blocks: [
        { k: 'p', title: 'The distinction that simplifies most decisions', body: [
          '**Client state** is yours: is the modal open, what is in the form, which tab is selected. **Server state** is a cache of someone else\'s data: it can go stale, needs refetching, loading and error states, and can be shared between components.',
          'Most Redux codebases were 80% server state stored manually — actions, reducers and thunks re-implementing caching badly. Tools like **React Query / TanStack Query** or **RTK Query** handle server state properly, which leaves very little genuine client state and often removes the need for Redux at all.',
        ]},
        { k: 'code', lang: 'javascript', cap: 'Context — and its performance trap', src: `const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  // WITHOUT useMemo, this object is new on every render, so EVERY
  // consumer re-renders even when the theme did not change.
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

// THE TRAP: any change to a context value re-renders ALL consumers.
// Do not put frequently-changing values in a context that many
// components read. Split into several contexts by update frequency —
// a stable one for setters, a volatile one for values.` },
        { k: 'code', lang: 'javascript', cap: 'Redux Toolkit — the modern, much shorter form', src: `// createSlice generates the action creators and the reducer together.
const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], status: 'idle' },
  reducers: {
    // Immer under the hood: this LOOKS like mutation but produces
    // an immutable update. This is the main ergonomic win over old Redux.
    added(state, action)  { state.items.push(action.payload); },
    cleared(state)        { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending,   (s) => { s.status = 'loading'; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.status = 'idle'; s.items = a.payload; })
      .addCase(fetchOrders.rejected,  (s) => { s.status = 'failed'; });
  },
});

export const fetchOrders = createAsyncThunk(
  'orders/fetch',
  async (userId) => (await api.get(\`/orders?user=\${userId}\`)).data
);

// In a component
const orders = useSelector(state => state.orders.items);
const dispatch = useDispatch();
useEffect(() => { dispatch(fetchOrders(userId)); }, [dispatch, userId]);` },
        { k: 'note', tone: 'tip', title: 'The decision, as a ladder', body: 'Climb only as far as you need. **1.** `useState` — local to one component. **2.** Lift it to the nearest common parent. **3.** `useContext` — genuinely global, rarely-changing (theme, auth user, locale). **4.** A server-state library (React Query / RTK Query) — anything fetched from an API. **5.** Redux Toolkit or Zustand — complex *client* state shared widely, with real cross-component interactions. Reaching for step 5 first is the classic over-engineering, and saying "I\'d start at the lowest step that works" is exactly the right answer.' },
      ],
    },
    {
      id: 'fe-interview',
      name: 'Frontend interview questions & full-stack framing',
      week: 24, mins: 100,
      summary: 'What actually gets asked, and how to position frontend as a backend-leaning candidate.',
      blocks: [
        { k: 'qa', title: 'JavaScript', items: [
          { q: 'Explain the event loop.', a: 'One JS thread. Slow work is delegated to the runtime, which queues a callback when done. When the call stack empties, the loop drains **all** microtasks (promise callbacks, queueMicrotask), then takes **one** macrotask (setTimeout, I/O), then drains microtasks again. That is why a resolved promise always runs before a `setTimeout(fn, 0)`.' },
          { q: 'What is hoisting?', a: 'Declarations are processed before execution. `var` is hoisted and initialised to `undefined`, so reading it early gives undefined. `let` and `const` are hoisted but uninitialised — reading them early throws a ReferenceError, and that window is called the temporal dead zone. Function declarations are fully hoisted; function *expressions* follow their variable\'s rules.' },
          { q: 'Difference between == and ===?', a: '`===` compares type and value with no coercion. `==` coerces first, which produces surprises like `[] == false` being true and `null == undefined` being true. Always use `===`, with the one common exception of `x == null` as a deliberate shorthand for "null or undefined".' },
          { q: 'How would you deep clone an object?', a: '`structuredClone(obj)` in modern environments — it handles Dates, Maps, Sets and cycles. `JSON.parse(JSON.stringify(obj))` is the old trick but silently loses functions, `undefined`, Dates become strings, and it throws on cycles. Spread (`{...obj}`) is shallow only — nested objects are still shared.' },
        ]},
        { k: 'qa', title: 'React', items: [
          { q: 'What is the virtual DOM and why does it help?', a: 'A lightweight JS representation of the UI. On a state change React builds a new tree, diffs it against the old one, and applies only the differences to the real DOM. It helps because direct DOM manipulation is expensive and easy to get wrong — React batches and minimises the real changes, and you get to write declarative "what it should look like" code instead of imperative "find it and change it".' },
          { q: 'Why do lists need keys, and why not the index?', a: 'Keys tell React which element is which between renders. With an index key, deleting or reordering an item makes React reuse the wrong component instance — internal state like a typed input value or an open dropdown ends up attached to the wrong row. It also causes needless re-renders. Use a stable unique id; index keys are only safe for a static list that never reorders.' },
          { q: 'useEffect ran twice in development — is that a bug?', a: 'No, that is React 18 StrictMode deliberately mounting, unmounting and remounting components in development to surface missing cleanup. If your effect breaks when run twice, it has a real bug — usually a subscription or request that is never cancelled. It does not happen in production builds.' },
          { q: 'Controlled vs uncontrolled components?', a: 'Controlled: React state is the source of truth, `value={state}` plus `onChange`. Predictable, easy to validate and transform as the user types — the default choice. Uncontrolled: the DOM holds the value and you read it with a ref. Useful for file inputs, for integrating non-React code, and for large forms where per-keystroke re-renders hurt.' },
        ]},
        { k: 'p', title: 'How to position frontend as a backend candidate', body: [
          'Do not present yourself as equally strong in both — it reads as unfocused. Present it as **depth plus useful reach**: a backend engineer who can ship a feature end to end without waiting for someone else.',
          'The concrete value is real, and worth saying out loud: you design APIs knowing how they will be consumed, you can debug across the boundary instead of throwing issues over a wall, and you can ship a small feature without a handoff.',
        ]},
        { k: 'note', tone: 'tip', title: 'The line that works', body: '*"I\'m a backend engineer — Java and Spring is where my depth is. I spent my first two years in React, so I can pick up a frontend ticket when the team needs it, and it means I design APIs thinking about how they\'ll actually be consumed rather than just what\'s convenient to serve."* One sentence, then move the conversation back to backend. Mentioned once, it is an asset; dwelt on, it dilutes the pitch.' },
      ],
    },
  ],
}
