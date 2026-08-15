export const interview = {
  id: 'interview',
  name: 'Interview Craft',
  icon: '◎',
  blurb: 'The resume, the six answers, round-by-round tactics, and the negotiation. Low weight per round, veto power overall.',
  weeks: 'Weeks 14–26',
  topics: [
    {
      id: 'iv-resume',
      name: 'The resume',
      week: 14, mins: 120, tag: 'core',
      summary: 'One page. Impact with numbers. Screened in six seconds.',
      blocks: [
        { k: 'p', body: [
          'A recruiter spends about six seconds on the first pass. The resume\'s only job is to survive that pass and get you a call. It is not an autobiography.',
        ]},
        { k: 'code', lang: 'text', cap: 'The structure that works', src: `NAME | <City> | phone | email | github.com/you | linkedin.com/in/you

SUMMARY  (2 lines, optional but useful)
  Backend engineer, <N> years, Java and Spring Boot. Built and operated
  REST services handling <X> requests/day. Prior <N> years in React.

EXPERIENCE  (most space goes here — reverse chronological)
  Company | Senior Software Engineer | Jan 2023 – present
    • [Impact bullet with a number]
    • [Impact bullet with a number]
    • [Impact bullet with a number]

SKILLS  (grouped, honest — you WILL be asked about anything listed)
  Languages: Java 17, SQL, JavaScript
  Frameworks: Spring Boot, Spring Security, JPA/Hibernate, React
  Data: PostgreSQL, Redis, Kafka
  Tools: Docker, Maven, Git, JUnit, Mockito, SonarQube

EDUCATION  (one line — it is 6 years ago, it does not matter now)
  B.E. Computer Science, <College>, 2020` },
        { k: 'table', title: 'Rewriting bullets — before and after', head: ['Weak', 'Strong'], rows: [
          ['Worked on backend APIs using Spring Boot', 'Built 12 REST endpoints serving 400k requests/day at p99 < 180ms'],
          ['Improved application performance', 'Cut checkout latency 2.1s → 320ms by eliminating an N+1 and adding a Redis cache'],
          ['Responsible for code quality', 'Raised test coverage 34% → 78%; cut production defects by roughly half over two quarters'],
          ['Worked in an Agile team', '*(delete this — it says nothing)*'],
        ]},
        { k: 'note', tone: 'tip', title: 'The bullet formula', body: '**Action verb + what you built + the measurable result.** If you genuinely do not have the number, estimate honestly and say "approximately" — "reduced a nightly job from ~4 hours to ~40 minutes" is fine. A bullet with no outcome is a job description, and job descriptions do not get callbacks.' },
        { k: 'list', title: 'Rules', items: [
          '**One page.** Below roughly ten years of experience, two pages signals you cannot prioritise.',
          '**No photo, no age, no marital status, no "Declaration".** Indian resume conventions that hurt at product companies.',
          '**No skill bars or percentages.** "Java 80%" is meaningless and slightly comic.',
          '**PDF, named `Firstname_Lastname_Backend.pdf`.** Not `resume_final_v3.docx`.',
          '**Everything listed is fair game.** If Kafka is on there, expect fifteen minutes on Kafka.',
          '**Tailor the top third** to the JD — the summary and the first two bullets.',
        ]},
      ],
    },
    {
      id: 'iv-six-answers',
      name: 'The six answers',
      week: 23, mins: 150, tag: 'core',
      summary: 'Rehearse these until they are boring. This is your entire communication programme.',
      blocks: [
        { k: 'p', body: [
          'Do not study English as a subject — it is the wrong unit of work and it is slow. Interview English is a narrow dialect: about three hundred technical words you already use daily, plus six answers you can deliver without thinking. Moderate English is entirely sufficient; interviewers at Indian product companies hear every fluency level there is, every day.',
          'What actually costs offers is **silence** — solving correctly without narrating, so the interviewer has nothing to grade.',
        ]},
        { k: 'code', lang: 'text', cap: '1. Tell me about yourself — 90 seconds, structured', src: `PRESENT  "I'm a backend engineer with about <N> years, currently at
          <company> working on <domain> in Java and Spring Boot. My main
          area is <the API / the service you own>."

PAST     "I started in <first area> — <N> years — then moved to backend
          <N> years ago, which is where I've stayed. That earlier background
          still helps: I design APIs knowing how they'll be consumed."

FUTURE   "I'm looking to move to a product company where I can work on
          systems at larger scale and go deeper on distributed systems —
          which is why this role interested me."

# 90 seconds. Do not narrate your degree. Do not list every project.` },
        { k: 'table', title: 'The other five', head: ['Question', 'The shape of a good answer'], rows: [
          ['**Why are you leaving?**', 'Growth and scale. *"I\'ve learned a lot but I\'ve stopped being stretched — I want harder distributed-systems problems."* **Never** salary, never your manager, never a complaint.'],
          ['**Hardest bug you\'ve debugged**', 'Symptom → what you ruled out → how you found it → the fix → what you changed so it could not recur. That last part is what separates senior from mid.'],
          ['**A project you owned end to end**', 'Pick the one with a number attached. Scope, your specific decisions, the trade-offs, the outcome.'],
          ['**A disagreement with a teammate**', 'A technical disagreement, resolved with data or a prototype. Show you can be wrong gracefully. Never a personality conflict.'],
          ['**Why this company?**', '30 seconds, specific, researched that morning. Their product, their scale, their engineering blog. Generic praise is worse than a short honest answer.'],
        ]},
        { k: 'note', tone: 'tip', title: 'How to rehearse — the actual method', body: 'Record yourself on your phone answering each one. Watch it back once. You will immediately hear the filler words and the rambling, and that self-correction is 90% of the improvement. Ten minutes a day for two weeks and all six are automatic. This is far more effective than any English course, and it is why there is no separate English study in this plan.' },
      ],
    },
    {
      id: 'iv-star',
      name: 'STAR stories',
      week: 23, mins: 120,
      summary: 'Eight prepared stories that cover almost every behavioural question.',
      blocks: [
        { k: 'p', body: [
          '**S**ituation, **T**ask, **A**ction, **R**esult. Most people spend too long on Situation and skip Result entirely. The ratio should be roughly 15% / 15% / 50% / 20% — the Action is where your judgement shows, and the Result is why anyone should care.',
        ]},
        { k: 'list', title: 'Write these eight. They cover almost everything.', items: [
          '**A production incident you handled** — the one where something broke and you fixed it',
          '**A hard technical decision with a real trade-off** — and why you chose as you did',
          '**A time you disagreed with someone** — and how it resolved',
          '**A time you failed or shipped a bug** — with what you changed afterwards',
          '**A time you had to learn something fast** — the AI-tooling shift is a genuinely good one here',
          '**A time you improved something nobody asked you to** — initiative',
          '**A time you helped someone else** — mentoring, code review, unblocking',
          '**Your proudest piece of work** — the one with the number',
        ]},
        { k: 'code', lang: 'text', cap: 'One worked example', src: `S  "Our checkout endpoint started timing out during a sale — p99 went
    from 300ms to over 8 seconds, and about 4% of checkouts were failing."

T  "I was on call. I needed to stabilise it that evening and find the
    root cause before the next day's sale."

A  "I checked the traces first and saw the time was all inside one
    service, not a dependency. The database CPU was flat but connection
    pool saturation was at 100%, which pointed at query volume rather
    than query cost. Turning on Hibernate statistics showed 200+ queries
    per checkout — an N+1 on order items that only appeared when a cart
    had more than about ten items, which is why we'd never seen it.
    Short term I raised the pool size to stop the bleeding. Then I
    replaced the lazy association with an EntityGraph, which took it
    to two queries."

R  "p99 went to 240ms, better than before the sale. I also added an
    integration test that asserts the query count for that endpoint,
    so if anyone reintroduces an N+1 the build fails rather than
    production. We've had no repeat in the year since."` },
        { k: 'note', tone: 'warn', title: 'The two failure modes', body: '**Rambling** — no structure, five minutes, the interviewer loses the thread. **"We"** — if every sentence is "we did", the interviewer cannot tell what *you* did. Say "the team decided X; I built Y" so your contribution is unambiguous without being boastful.' },
      ],
    },
    {
      id: 'iv-round-tactics',
      name: 'Round-by-round tactics',
      week: 24, mins: 130, tag: 'core',
      summary: 'What to do in the first two minutes of each round type.',
      blocks: [
        { k: 'list', ordered: true, title: 'The DSA round', items: [
          '**Repeat the problem back** in your own words. Catches misunderstandings for free.',
          '**Ask about constraints and edge cases.** Input size? Duplicates? Empty? Negative? Constraints also tell you the target complexity.',
          '**State the brute force first**, with its complexity. Always. It shows you understand the problem, and it gives you a fallback.',
          '**Say the approach before coding.** *"I\'ll use a sliding window with a HashMap for counts — O(n) time, O(k) space."* Get a nod, then code.',
          '**Narrate while typing.** Silence is the single biggest scoring loss in this round.',
          '**Walk through a small example by hand** when done. Do not say "it works" — prove it on `[3,1,2]`.',
          '**State the complexity unprompted** at the end, time and space, with the reason.',
        ]},
        { k: 'note', tone: 'tip', title: 'When you are completely stuck', body: 'Do not go silent. Say: *"I\'m considering two directions — sorting first, or a hash map for one-pass lookups. Sorting costs n log n but makes the pairing easier. Let me try the hash map first."* Thinking out loud converts a stuck moment into visible problem-solving, and interviewers routinely give a hint at that point. Silence gets no hint.' },
        { k: 'list', title: 'The LLD round', items: [
          'Clarify scope for five minutes and **write it down**.',
          'Enums and entities first — they are quick and they clarify the domain.',
          'Extract anything with more than one variant behind an interface (pricing, allocation, notification channel).',
          '**Get something running**, then extend. A working `main` beats a beautiful half-model.',
          'Say what you would do next with more time. Unbuilt-but-articulated still scores.',
        ]},
        { k: 'list', title: 'The system design round', items: [
          'Follow the timebox: requirements → estimate → API → data model → design → deep dive → bottlenecks.',
          '**Never draw before agreeing requirements.**',
          'Walk one request end to end through your own diagram.',
          'State trade-offs explicitly: *"I\'m choosing eventual consistency here because a stale like-count is harmless and strong consistency would cost us a lot of write throughput."*',
          'When you do not know something, say so and reason from principles. Bluffing is detected instantly and is far more damaging than not knowing.',
        ]},
        { k: 'list', title: 'The Java/Spring round', items: [
          'Answer the question asked, then add one layer of depth. Not five.',
          'Reach for concrete production examples — "we hit this when…" outweighs any definition.',
          'If you do not know: *"I haven\'t used that directly. My understanding is X — is that right?"* Honest and curious beats a confident guess every time.',
        ]},
        { k: 'note', tone: 'tip', title: 'Always have questions at the end', body: 'Having none reads as disinterest. Good ones: *"What does the on-call rotation look like?"*, *"How do changes get from merge to production, and how long does that take?"*, *"What is the biggest technical problem the team is facing right now?"*, *"What would you want someone in this role to have achieved in six months?"* That last one is genuinely useful to you as well.' },
      ],
    },
    {
      id: 'iv-applications',
      name: 'Applications & the process',
      week: 14, mins: 100,
      summary: 'When to apply, in what order, and how to run parallel processes.',
      blocks: [
        { k: 'note', tone: 'warn', title: 'Apply from Week 14, not Week 26', body: 'Interview cycles run four to eight weeks. If you wait until you feel ready you will be signing in month eleven. Week 14 is late enough that the feedback is informative and early enough that it still changes what you study. Early interviews are free, precise diagnostics — far more honest than self-assessment.' },
        { k: 'list', ordered: true, title: 'The sequence', items: [
          '**Week 14** — resume out. Ask five people directly for referrals.',
          '**Week 16** — two interviews at companies you do **not** want. You will do badly. That is the deliverable.',
          '**Weeks 17–19** — patch exactly what those rounds exposed. Keep applying to the second tier.',
          '**Week 20** — apply to the companies you actually want, in a batch, so offers land together.',
          '**Weeks 23–26** — onsites, then negotiate with two offers in hand.',
        ]},
        { k: 'table', title: 'Channels, by conversion rate', head: ['Channel', 'Response rate', 'Note'], rows: [
          ['**Referral**', 'Highest by a distance', 'Ask directly. Most people say yes; most people are never asked.'],
          ['Recruiter reaching out on LinkedIn', 'High', 'Keep your LinkedIn current and set "open to work" privately'],
          ['Direct on the company careers page', 'Medium', 'Better than aggregators'],
          ['Naukri / Instahyre / Cutshort', 'Medium', 'Volume play; good for the warm-up tier'],
          ['Cold application via a job board', 'Lowest', 'Use only as a fallback'],
        ]},
        { k: 'code', lang: 'text', cap: 'The referral message that works', src: `Hi <name>,

I'm a backend engineer with <N> years in Java and Spring Boot, currently
at <company>. I saw <company> is hiring for <role> (<req id>) and it lines
up well with what I've been doing — <one specific relevant thing>.

Would you be open to referring me? Happy to send my resume, and no
problem at all if you'd rather not.

Thanks,
<name>

# Short. Specific. An easy exit. Attach the resume only if they say yes.` },
        { k: 'note', tone: 'tip', title: 'Compress the timelines deliberately', body: 'Tell every recruiter you are in late stages elsewhere and ask to align schedules. This is completely normal and they will accommodate it. **Overlapping offers are the whole game** — one offer means you accept whatever you are handed.' },
      ],
    },
    {
      id: 'iv-negotiation',
      name: 'Negotiation',
      week: 25, mins: 100, tag: 'core',
      summary: 'The highest-paid hour of the entire six months.',
      blocks: [
        { k: 'p', body: [
          'You will spend roughly 340 hours preparing. The negotiation lasts about an hour and typically moves the final number by **5–15%**. Per hour, it is the single most valuable part of this whole process — and most people skip it entirely because it is uncomfortable.',
        ]},
        { k: 'list', title: 'The rules', items: [
          '**Never name a number first if you can avoid it.** *"I\'d rather understand the full scope and the band for this level first — what range do you have budgeted?"*',
          '**When you must name one, quote a range 10–15% above your actual target.** Ask for exactly your target and you will land below it. Ask 10–15% above and you land at or near it. This costs nothing and you only get to ask once.',
          '**When they ask your current compensation:** *"It\'s <current>, but I\'m interviewing against the market band for my experience level, which is where my expectation comes from."* Say it in one breath and then **stop talking**. Your current number anchors the conversation only if you leave it hanging alone.',
          '**Never accept on the call.** *"Thank you, I\'m really pleased. Could you send it in writing? I\'d like to review it properly and come back tomorrow."*',
          '**Negotiate on the total, not just base** — base, joining bonus, retention bonus, ESOPs (and their strike price, vesting, and last valuation), notice-period buyout.',
          '**Get everything in writing** before you resign. Verbal promises about "a review in six months" have no value.',
        ]},
        { k: 'code', lang: 'text', cap: 'The counter-offer script', src: `"Thank you — I'm genuinely excited about the team and the problems.

 I want to be straightforward about the number. Based on the market
 band for this experience level, and on another offer I'm considering,
 I was hoping for something closer to <your target, +10-15%>.

 Is there flexibility on the base? I'd like to make this work."

 [ Then stop. Say nothing. Let the silence sit.
   The silence is the technique — most people negotiate against
   themselves by filling it. ]` },
        { k: 'table', title: 'Understanding an Indian CTC breakdown', head: ['Component', 'Watch for'], rows: [
          ['Fixed base', 'The only number that is truly guaranteed. Maximise this.'],
          ['Variable / performance bonus', 'Often 10–20%, paid on company *and* individual performance. Ask what actually paid out last year.'],
          ['Joining bonus', 'One-time. Usually has a one-year clawback.'],
          ['Retention bonus', 'Paid at 12/24 months. Do not count it as annual income.'],
          ['ESOPs / RSUs', 'Ask: strike price, vesting schedule, cliff, last valuation, and whether there is a liquidity path.'],
          ['Gratuity, PF', 'Included in CTC but not in your take-home. Adjust mentally.'],
        ]},
        { k: 'note', tone: 'trap', title: 'The counter-offer from your current employer', body: 'When you resign, there is a good chance your current company offers more to keep you. The data on this is unambiguous: most people who accept a counter-offer leave within a year anyway, and the reasons you were leaving — scale, growth, the work itself — are still there. The money arrived because you threatened to leave, which tells you what it would have taken otherwise. Decide *before* you resign that you will decline it, so you are not deciding under pressure.' },
      ],
    },
    {
      id: 'iv-mocks',
      name: 'Mock interviews & tracking',
      week: 17, mins: 90,
      summary: 'How to run them so they are actually useful, and what to track.',
      blocks: [
        { k: 'list', title: 'Running a mock properly', items: [
          '**Weekly from Week 17, without exception.** interviewing.io peer mocks and Pramp are both free.',
          '**Camera on, timer running, no pausing.** A mock you can pause is study, not a mock.',
          '**Record it.** Watching yourself back is uncomfortable and is where most of the value is.',
          '**Ask for one specific criticism**, not general feedback. "What was the weakest part of my communication?" gets a useful answer; "how did I do?" gets "pretty good".',
          '**Write a post-mortem within an hour** — what went wrong, what you will change, what to study this week.',
        ]},
        { k: 'code', lang: 'text', cap: 'The post-mortem template — use it after every real round too', src: `Company / Round / Date:
Problem or topic:

What went well:

What went badly:

The exact moment I got stuck, and why:

What I would say differently:

What I need to study this week because of this:
  1.
  2.

Verdict guess (pass / borderline / fail) — and was I right?` },
        { k: 'note', tone: 'tip', title: 'The four numbers to track weekly', body: '**New problems solved. Problems re-solved. Hours logged. Journal pages written.** Nothing else — a tracker that takes more than a minute becomes another thing to abandon. Use the notes box on each topic page in this app for the journal, and tick topics complete as you go; the progress bars do the counting for you.' },
        { k: 'note', tone: 'warn', title: 'Rejections are data, not verdicts', body: 'You will be rejected, probably several times, and often for reasons that have nothing to do with you — headcount froze, someone internal applied, the panel wanted a different specialism. Ask for feedback every time (about a third of companies give something useful). Then write the post-mortem, patch the one specific gap, and move to the next. Six weeks of that loop is what moves a candidate from the bottom of a band to the top of it.' },
      ],
    },
  ],
}
