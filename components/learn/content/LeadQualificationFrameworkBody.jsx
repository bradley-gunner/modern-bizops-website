import Link from "next/link";

import MaturityLadder from "@/components/learn/MaturityLadder";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// Ladder only: the page cites one benchmark (scoring accuracy, House of
// Martech), and the spec's bar for stat cards is two. The Level 5 AI-agent
// passage stays as prose below the ladder.
const RUNGS = [
  {
    level: 1,
    desc: (
      <>
        Qualification is intuitive. &ldquo;I can usually tell if someone is
        serious&rdquo; is <b>the entire framework</b>. There is no shared definition
        anywhere. Marketing measures lead volume. Sales works whoever they feel like. The
        two functions mean different things when they say &ldquo;qualified,&rdquo; and
        neither one notices until it becomes a fight.
      </>
    ),
  },
  {
    level: 2,
    desc: (
      <>
        A framework exists in some form, BANT is common, but it is not consistently
        applied. Different salespeople use different criteria. Marketing and sales have
        not actually agreed on what qualified means, and the criteria live nowhere the
        CRM can enforce.
      </>
    ),
  },
  {
    level: 3,
    desc: (
      <>
        A shared qualification framework is documented and agreed to by both marketing
        and sales. The criteria are <b>specific and observable</b>: company size, job
        title, a specific pain, a budget signal, timing, not vibes. The framework is used
        to filter inbound leads and evaluate outbound prospects, and disqualification
        reasons actually get captured instead of silently discarded.
      </>
    ),
  },
  {
    level: 4,
    desc: (
      <>
        Qualification criteria are encoded as CRM fields, not just written down in a
        shared doc. Disqualification data gets reviewed regularly and used to sharpen the
        criteria over time. Qualification scores are tracked against actual close rates,
        so the framework is validated against real outcomes instead of assumed to be
        correct.
      </>
    ),
  },
  {
    level: 5,
    desc: (
      <>
        The framework keeps refining itself based on win/loss and cohort data. It
        distinguishes <b>fit qualification</b>, does this company match our ideal
        customer profile, from <b>intent qualification</b>, is this company actually in
        an active buying cycle right now, which most businesses never separate.
      </>
    ),
  },
];

export default function LeadQualificationFrameworkBody() {
  return (
    <>
      <p>
        Ask your best salesperson how they know a lead is worth their time, and you
        will probably get a confident answer. Ask them to write that answer down, and
        share it with marketing, and watch what happens. Most businesses discover in
        that moment that &ldquo;we can usually tell&rdquo; is not actually a framework.
        It is one person&rsquo;s gut, and gut instinct does not scale past that one
        person.
      </p>

      <h2 className={h2}>What &ldquo;a waste of time&rdquo; actually means</h2>
      <p>
        Here is the tell. Marketing counts leads. Sales works whoever they feel like
        working. Both teams use the word &ldquo;qualified&rdquo; constantly, and
        neither one means the same thing by it. That is not a communication problem you
        fix with a better meeting. It is the absence of a shared, written definition
        that both functions have actually agreed to.
      </p>
      <p>
        Without one, qualification becomes intuitive and personal. &ldquo;I can usually
        tell if someone is serious&rdquo; works fine for the rep who has been doing it
        for five years. It falls apart the moment you hire a second rep, because now
        you have two different, unwritten standards operating on the same pipeline, and
        no way to tell which leads got skipped because they genuinely were not a fit
        versus which ones got skipped because a particular rep happened to have a bad
        day.
      </p>
      <p>
        The cost shows up in two directions at once. Waste time on the wrong leads, and
        your best reps burn hours on conversations that were never going to close.
        Filter too aggressively with no shared standard, and you disqualify real
        opportunities because one rep&rsquo;s private bar for &ldquo;serious&rdquo; was
        set higher than it needed to be. Neither failure is visible on a dashboard.
        Both are visible in a sales cycle that takes longer than it should and a team
        that is quietly exhausted.
      </p>

      <h2 className={h2}>Why this happens even with experienced salespeople</h2>
      <p>
        The root cause is not a skills gap. It is that qualification, when it exists at
        all, usually exists as a framework someone read about once, BANT is the most
        common version, applied inconsistently rather than encoded anywhere. Different
        salespeople use different criteria without realizing it. Marketing and sales
        have never actually sat down and agreed on what &ldquo;qualified&rdquo; means
        in writing, so the disagreement resurfaces every time pipeline gets reviewed,
        usually as finger-pointing rather than a fixable process gap.
      </p>
      <p>
        This is also a competency where the AI-accelerated version has genuinely
        changed what &ldquo;good&rdquo; looks like, in two distinct ways worth
        separating. The first is scoring: a model built from your own closed-won and
        closed-lost history, weighting behavioral activity, firmographic fit, and
        intent signals, has been shown to raise qualification accuracy from roughly 60
        percent to somewhere between 75 and 90 percent (
        <a
          href="https://houseofmartech.com/blog/lead-qualification-framework-for-2026-combining-behavioral-signals-firmographics-and-ai-scoring"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ). The second is instant response: AI agents that respond to a new inbound lead
        within seconds, hold a real qualifying conversation, and route only the genuine
        opportunities to a rep. These are not the same problem, and conflating them
        leads to buying the wrong tool.
      </p>
      <p>
        The scoring half is genuinely something you can approximate yourself today.
        Export your closed-won and closed-lost leads, ask Claude, ChatGPT, or Grok
        which behavioral and firmographic signals actually separated the two groups,
        and use that to sharpen your written criteria, for free, this week. The
        instant-response half is different. Qualifying and routing a lead within
        seconds of a form submission requires something actually connected to your
        website and CRM in real time, not a chat window exercise. Know which problem
        you are actually trying to solve before deciding whether you need a new tool at
        all, or just a better written definition applied consistently.
      </p>

      <h2 className={h2}>What good looks like, one step at a time</h2>

      <MaturityLadder
        label="The 1 to 5 scale"
        title="Lead qualification framework, Level 1 to Level 5"
        rungs={RUNGS}
      />

      <p>
        At Level 5, increasingly, this scoring runs continuously and automatically, and
        for the highest-volume inbound motions, an AI agent applies the qualifying
        conversation itself within seconds of a new lead arriving, instead of a rep
        getting to it two days later.
      </p>

      <h2 className={h2}>
        Where this competency depends on getting something else right first
      </h2>
      <p>
        Lead qualification depends on{" "}
        <Link href="/learn/ideal-customer-profile" className="text-navy underline">
          Ideal Customer Profile
        </Link>{" "}
        being real, not aspirational. An AI qualification model, or a human one,
        trained against a fuzzy or unwritten ICP does not fix the fuzziness. It just
        applies it faster and with more apparent confidence, which is worse than a
        rep&rsquo;s honest gut check, because it looks rigorous while being built on
        the same undefined foundation.
      </p>
    </>
  );
}
