export const start = {
  id: 'start',
  name: 'Start Here',
  icon: '◉',
  blurb: 'How to use this, how to study so it sticks, and the two habits that decide whether any of this works.',
  weeks: 'Week 0',
  topics: [
    {
      id: 'start-how-to-use',
      name: 'How to use this app',
      week: 0, mins: 20, tag: 'core',
      summary: 'The order to read things in, and what the buttons do.',
      blocks: [
        { k: 'p', title: 'The short version', body: [
          'Work top to bottom through the sidebar. The sections are ordered by dependency, not by importance — **Complexity** comes before **DSA** because you cannot do DSA without it, and **LLD** comes before **System Design** because designing one class well is the smaller version of designing one system well.',
          'Every topic is self-contained: a plain explanation, a real-life comparison, working Java code, and the questions an interviewer actually asks about it. Read the explanation, run the code, then close the page and try to explain the idea out loud. If you cannot, read it again. That loop is the whole method.',
        ]},
        { k: 'note', tone: 'info', title: 'Two modes', body: 'When your local backend is running you get the full app — tick things off, write notes, save code. When it is not (for example on your phone, from the GitHub Pages link) everything still **reads** perfectly. Only the saving is switched off. Nothing is ever lost because of it; the buttons simply do not appear.' },
        { k: 'list', title: 'What each part of a topic page is for', items: [
          '**Explanation** — the concept in plain language. No jargon that has not been introduced.',
          '**Real life** — an analogy from outside programming. If the analogy sticks, the concept sticks.',
          '**Code** — Java, runnable, commented. Type it out by hand at least once; do not copy-paste.',
          '**Complexity** — time and space with the reason. Say it out loud before you read it.',
          '**Interview questions** — what gets asked, and a model answer. These are the actual round.',
          '**Your notes / scratchpad** — at the bottom of every topic when the backend is up. Doubts go in notes, practice code goes in the scratchpad.',
        ]},
        { k: 'p', title: 'The scratchpad is for getting your code reviewed', body: [
          'Every topic has a code box. Write a solution to a practice problem there, tick **flag for review**, and it lands in the review queue. Ask Claude to "check my review queue" and it can read everything you flagged, all at once, and tell you what is wrong with each one.',
          'That is the loop that replaces having a senior sitting next to you: you write it alone with no AI, you flag it, you get told what you missed.',
        ]},
      ],
    },
    {
      id: 'start-method',
      name: 'The method that makes it stick',
      week: 0, mins: 25, tag: 'core',
      summary: 'Six rules. These matter more than the syllabus.',
      blocks: [
        { k: 'p', body: [
          'Starting DSA several times and stopping is almost never an ability problem. It is a method problem. The standard advice — grind a 450-problem sheet fast — is built for someone who retains things on the first pass. If you are not that person it will fail you every time, and it will feel like the failure is yours.',
          'These six rules replace it. They are slower per problem and dramatically faster overall.',
        ]},
        { k: 'list', ordered: true, title: 'The rules', items: [
          '**Twenty-five minutes, then read the solution.** Try alone for 25 minutes. Still stuck? Open the editorial with no guilt at all. Reading solutions is how you *acquire* patterns. Grinding one problem for three hours is how you quit in week five.',
          '**Solve every problem three times.** Day 0 with help if needed, Day 3 alone, Day 14 alone and timed. Only the third pass counts as learned. This is why the target is six new problems a week and not sixteen.',
          '**One pattern per week. Never two.** A whole week on sliding window. Then a whole week on binary search. Depth beats coverage, and nobody is tested on obscure patterns.',
          '**Move on when you can, not when the calendar says.** The gate for leaving a pattern is three *unseen* problems in it, solved alone, in time. If that takes eleven days instead of seven, take eleven days.',
          '**Keep the pattern journal.** One page per pattern with three things: what tips me off that it is this pattern, the skeleton code, the complexity and why. Use the notes box on each topic page. You will re-read these more than any book.',
          '**Narrate out loud, always.** Even alone at 6am. Silent solving trains a skill nobody tests — the interviewer grades what you *say*. This doubles as your entire communication practice.',
        ]},
        { k: 'note', tone: 'tip', title: 'The one rule you cannot break', body: '**Never miss twice.** One skipped day is noise. Two in a row is a new habit forming. On a terrible day the floor is 25 minutes: open the editor, one easy problem, close it. Continuity is worth more than volume.' },
        { k: 'analogy', body: 'This is how people learn an instrument, not how they cram for an exam. Nobody learns guitar by playing 450 different songs once each. They play eight songs until their hands know them, and then every new song is made of pieces they already own. Patterns are the chords.' },
      ],
    },
    {
      id: 'start-positioning',
      name: 'What you are selling',
      week: 0, mins: 15,
      summary: 'Pick one identity and go deep. Breadth is not the product.',
      blocks: [
        { k: 'p', body: [
          'A few years of Java and Spring Boot in production, with frontend experience before or alongside it, is a very common profile. The mistake is presenting it as a list — "I know Java, React, MUI, Maven, Sonar" — which reads as someone who has touched many things and owns none of them.',
          'Present it as one identity with a bonus: **a Java backend engineer who can also ship the frontend.** Backend is the depth you are hired for. The frontend experience is the thing that makes you more useful than the other backend candidate — mention it once, then drop it.',
        ]},
        { k: 'table', title: 'Where the interview weight actually sits', head: ['Round', 'Rounds', 'Weight', 'Typical position for a working engineer'], rows: [
          ['Coding / DSA', '2', '~30%', 'Usually the weakest — and the most predictably recoverable. Most of this app is about it.'],
          ['Low-level design', '1', '~20%', 'Usually a strength. Years of writing service classes is exactly this skill.'],
          ['System design', '1–2', '~25%', 'Often never tested before. The biggest single lever on the final band.'],
          ['Java & Spring depth', '1', '~15%', 'Home ground, once the internals gap is closed.'],
          ['Hiring manager', '1', '~10%', 'Veto power. Six rehearsed answers fix it entirely.'],
        ]},
        { k: 'note', tone: 'warn', title: 'The trap', body: 'Do not spread study time across twelve technologies to look complete. Twelve areas at fourteen hours a week means you revisit each one every twelve weeks and retain none. Six areas studied properly beats twelve skimmed, every time, and the interview only tests six.' },
      ],
    },
    {
      id: 'start-ai-protocol',
      name: 'Getting your hands back',
      week: 0, mins: 15,
      summary: 'Undoing the damage from letting AI write your code.',
      blocks: [
        { k: 'p', body: [
          'If you have spent a couple of years letting an assistant write the first draft, the thing that atrophied is very specific: **motor recall under time pressure.** Going from an empty file to working code without a prompt. That is a trained skill, not lost knowledge, and it comes back in six to eight weeks.',
          'What did *not* atrophy is your judgement. Reviewing generated code for two years has made you better at spotting bad structure than you were. That part is an asset — it is most of what the LLD round tests.',
        ]},
        { k: 'list', title: 'Four rules for the whole block', items: [
          '**Practice hours are AI-off, completely.** No assistant, no Copilot, no autocomplete. A plain editor and the language docs. If it feels unpleasant for the first two weeks, that is the diagnosis confirming itself.',
          '**Invert the order at work.** Write the first draft yourself, then hand it to the AI to review. Right now you review what it writes, which trains judgement and starves recall. Reversing costs nothing in output.',
          '**Use AI as an examiner, not an author.** "Quiz me on ConcurrentHashMap." "Where does my design break?" "Is my complexity answer right?" All fine. "Write this for me" is banned until you have signed an offer.',
          '**One paper problem a week.** Saturday, on paper, no compiler. Brief, uncomfortable, and the fastest way to find out what you actually know versus what you can look up.',
        ]},
        { k: 'note', tone: 'trap', title: 'Why this matters more than it sounds', body: 'The DSA round is 45 minutes in a plain editor with a stranger watching. It is the single most artificial environment in the whole process, and it is the one where the AI habit shows up hardest. Practising with autocomplete on is practising the wrong thing.' },
      ],
    },
  ],
}
