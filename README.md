# Prep Atlas

An offline-capable study atlas for a **26-week interview preparation block** — Java/Spring backend, targeting product companies. Aimed at working engineers with a few years of experience going after a significant step-up (typically **+40% to +90%** on current compensation).

Thirteen sections, 137 topics, 214 code examples, ordered **by dependency rather than importance** — complexity before DSA, low-level design before system design. Every topic has a plain explanation, a real-life analogy, working code, complexity with the reasoning, and the questions interviewers actually ask.

Built for **learning to code well**, not only for passing interviews: the data structures are implemented from scratch (heap, hash map, union-find, merge sort, quicksort) rather than only called, because the ideas inside them — divide-and-conquer, partitioning, hashing, amortised cost — are tools you reach for in real work.

Dark, mobile-first, and readable on a phone at 6am.

---

## Two modes, by design

| | Frontend only (GitHub Pages, phone) | Frontend + local backend |
|---|---|---|
| Read all content | ✅ | ✅ |
| Search, navigate, timeline | ✅ | ✅ |
| Tick topics complete | ❌ hidden | ✅ |
| Notes & pattern journal | ❌ hidden | ✅ |
| Code scratchpad + review queue | ❌ hidden | ✅ |

When the API is unreachable the app **does not pretend to save**. The write controls are replaced with an explanation and everything stays readable. That is the expected state on your phone.

---

## Quick start

### 1. Frontend

```bash
npm install
npm run dev          # http://localhost:5173
```

### 2. Backend (optional — needed for ticking, notes, scratchpad)

Needs MongoDB on `localhost:27017`, **no password** (as requested).

First time only — install its dependencies:

```bash
cd server
npm install
cd ..
```

Then start it. `npm run server` works from **either** directory:

```bash
npm run server       # from the repo root  → http://localhost:4000
```

```bash
cd server
npm run server       # from server/ — same thing (npm start also works)
```

Check it: <http://localhost:4000/api/health> should return `{"ok":true,"db":true}`.

If Mongo is not running the API still starts and retries every 5 seconds — the frontend just stays in read-only mode until it connects.

<details>
<summary>Installing MongoDB on Windows</summary>

Download MongoDB Community Server, or with a package manager:

```powershell
winget install MongoDB.Server
```

Then start it (the installer usually registers it as a service that starts automatically):

```powershell
Get-Service MongoDB          # check
Start-Service MongoDB        # start if stopped
```

Or run it manually:

```powershell
mongod --dbpath C:\data\db
```
</details>

---

## Deploying to GitHub Pages

Deployment is automatic via GitHub Actions — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes on every push to `development`.

**One-time setup** (needed once, in the browser):

1. Go to **Settings → Pages** in the repo.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push, or run the workflow by hand from the **Actions** tab (`Deploy to GitHub Pages` → *Run workflow*).

The site then lives at **https://karthikdulam.github.io/planner/**

Every later push to `development` redeploys it. Check progress in the **Actions** tab.

### Why it works from a sub-path

- `vite.config.js` sets `base: './'` → asset URLs are relative, so `/planner/` works with no extra config.
- Routing is **HashRouter** → deep links like `#/t/dsa-sorting` need no server-side rewrites, which GitHub Pages cannot do.
- `public/.nojekyll` stops Pages running the content through Jekyll.

### The backend, from the deployed site

The frontend is public; the API stays on your machine. Browsers treat `http://localhost` as a trustworthy origin, so an `https://` Pages site **is allowed** to call `http://localhost:4000` — meaning on the computer running `npm run server`, the deployed site is fully interactive.

Everywhere else — your phone, another laptop, a colleague's browser — it silently falls back to read-only. All 137 topics still render; only the ticking, notes and scratchpad are hidden. That is the intended behaviour, not a failure.

> Safari is stricter than Chrome/Edge/Firefox about localhost from https. If the badge stays on *read-only* on a Mac with the server running, use `npm run dev` locally instead.

### Manual alternative

`gh-pages` is still wired up if you ever want to push `dist/` to a branch by hand:

```bash
npm run deploy      # then set Pages → Source → gh-pages branch
```

---

## Getting your code reviewed

1. Open any topic, write a solution in the **code scratchpad** (AI off).
2. Tick **flag for review**.
3. Ask Claude: *"check my review queue"*.

Claude reads everything flagged at once:

```bash
curl http://localhost:4000/api/review-queue
```

The **Review queue** page in the app shows the same thing visually.

---

## API

All endpoints are unauthenticated and bound to `127.0.0.1` only.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Connection check. 503 if Mongo is down. |
| `GET` | `/api/state` | Every topic record |
| `GET` | `/api/state/:topicId` | One record |
| `PUT` | `/api/state/:topicId` | Upsert a patch |
| `DELETE` | `/api/state/:topicId` | Clear a record |
| `GET` | `/api/review-queue` | Everything flagged for review |
| `GET` | `/api/export` | Full dump — use this for backups |
| `GET` | `/api/stats` | Counts: completed, flagged, with notes |

Record shape:

```json
{
  "_id": "dsa-sliding-window",
  "completed": true,
  "completedAt": "2026-08-20T05:12:00.000Z",
  "note": "Tell: 'contiguous subarray'. Expand right, shrink while invalid, record.",
  "code": "int longestUnique(String s) { ... }",
  "lang": "java",
  "flaggedForReview": true,
  "updatedAt": "2026-08-20T05:12:00.000Z"
}
```

### Backup

```bash
curl http://localhost:4000/api/export > backups/prep-$(date +%F).json
```

---

## Project layout

```
├── docs/
│   └── the-block.html      # standalone single-page plan — open directly,
│                           # no npm, no server. Good for phone/print.
├── index.html
├── vite.config.js
├── src/
│   ├── App.jsx                 # routing + sidebar
│   ├── styles.css              # the whole design system
│   ├── lib/
│   │   ├── backend.jsx         # API client + online/offline context
│   │   └── highlight.js        # dependency-free syntax highlighter
│   ├── components/             # Block, CodeBlock, TopicView, Workspace, …
│   └── content/                # ← all study material lives here
│       ├── start.js            #   how to use it, the method, positioning
│       ├── complexity.js       #   Big-O without maths + every class with code
│       ├── dsa.js              #   30 patterns, structures implemented
│       ├── java.js             #   core + concurrency + JVM
│       ├── javaversions.js     #   Java 8 → 25, version by version
│       ├── spring.js           #   internals, transactions, JPA
│       ├── database.js         #   SQL, indexes, transactions
│       ├── lld.js              #   SOLID, patterns, machine coding
│       ├── hld.js              #   framework + 9 case studies
│       ├── messaging.js        #   Kafka, Redis (production-grade code)
│       ├── cloud.js            #   AWS, Docker, K8s, observability
│       ├── frontend.js         #   HTML, CSS, JS, React brush-up
│       ├── interview.js        #   resume, answers, negotiation
│       └── timeline.js         #   the 26-week schedule
└── server/
    ├── package.json
    └── server.js
```

## Editing or adding content

Content is plain JavaScript data — no build step, no CMS. Add a topic to any section's `topics` array:

```js
{
  id: 'dsa-my-topic',            // must be unique — it is also the DB key
  name: 'My Topic',
  week: 5, mins: 120, tag: 'core',
  summary: 'One line shown in lists.',
  blocks: [
    { k: 'p', title: 'Heading', body: ['Paragraph one.', 'Paragraph two.'] },
    { k: 'analogy', body: 'A real-life comparison.' },
    { k: 'code', lang: 'java', cap: 'Caption', src: 'int x = 1;' },
    { k: 'list', title: 'Points', items: ['One', 'Two'], ordered: false },
    { k: 'table', title: 'Compare', head: ['A', 'B'], rows: [['1', '2']] },
    { k: 'cx', time: 'O(n)', space: 'O(1)', why: 'One pass.' },
    { k: 'note', tone: 'warn', title: 'Careful', body: 'Text.' },
    { k: 'qa', title: 'Asked in interviews', items: [{ q: '…', a: '…' }] },
  ],
}
```

Inline markup in any string: `**bold**`, `` `code` ``, `*italic*`.
Callout tones: `info`, `tip`, `warn`, `trap`.

---

## Where to start

1. **[Start Here → The method that makes it stick](#/t/start-method)** — six rules that matter more than the syllabus.
2. **[Complexity & Big-O](#/s/complexity)** — the entire section, before touching a single DSA problem. It looks like mathematics, which is why it stops so many people; it isn't. There is no formula and nothing to choose — you count loops.
3. **Week 0 drill** — five already-solved problems a day, two lines of complexity each, for seven days.

Then Week 1, and the sidebar in order.

---

## A note on the numbers

Compensation targets, experience levels and salary figures are written as **ratios and placeholders** (`<N> years`, `+40–90%`, `<your target, +10-15%>`) rather than specific amounts, so the material applies to anyone using it. Substitute your own figures where you see a placeholder — and work the return-on-hours arithmetic out once with your real numbers, because that ratio is what has to survive a bad week.
