import Link from "next/link";
import StatCards from "@/components/learn/StatCards";
import MaturityLadder from "@/components/learn/MaturityLadder";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// Both blocks below re-present copy that is already on the page; neither
// introduces a claim. The stat cards pull the two cited benchmarks out of the
// prose that surrounds them, and the ladder carries the Level 1-5 rubric that
// used to run as five paragraphs here.
const STATS = [
  {
    big: "$12.9M",
    desc: "The average cost of poor data quality, per organization, per year. Pipeline stage data, the thing your forecast is actually built on, is one of the most common places that cost originates.",
    source: "Gartner",
  },
  {
    big: "40 to 60%",
    desc: "Of B2B deals that fail to close are lost to customer indecision, not to a competitor. The buyer never said no. They just never said yes, and the deal quietly stalled while nobody was forcing the question.",
    source: "Dixon and McKenna, The JOLT Effect",
  },
];

const RUNGS = [
  {
    level: 1,
    desc: (
      <>
        Your CRM still has the default stages it shipped with: Lead, Qualified,
        Proposal, Closed. Nobody can articulate what actually moves a deal from
        one to the next. <b>Stage changes when the rep feels ready to change it.</b>
      </>
    ),
  },
  {
    level: 2,
    desc: (
      <>
        You have renamed the stages to match your business, but there is still no
        documented exit criteria. Advancement is subjective. Different reps
        interpret the same stage differently, which means your pipeline data
        cannot be used for reliable forecasting even though it looks organized.
      </>
    ),
  },
  {
    level: 3,
    desc: (
      <>
        Every stage has a written exit criterion phrased as a{" "}
        <b>buyer action or a verified fact, not a sales activity</b>. Your team
        actually knows the criteria and applies them.
      </>
    ),
  },
  {
    level: 4,
    desc: (
      <>
        Exit criteria become required CRM fields, so a deal literally cannot
        advance until the criterion is met. Stage conversion rates get tracked and
        benchmarked. Deals that try to skip a criterion get caught and corrected
        before they distort the picture.
      </>
    ),
  },
  {
    level: 5,
    desc: (
      <>
        Stage design keeps improving based on real conversion and win/loss data.
        Exit criteria are validated by what buyers actually did, not asserted by
        what a rep believes. Stage duration benchmarks flag stalled deals
        automatically, and the pipeline becomes something you can actually{" "}
        <b>forecast from</b>, not just a to-do list.
      </>
    ),
  },
];

export default function PipelineStageDesignBody() {
  return (
    <>
      <p>
        If you are asking why your sales cycle is so long and nobody in your company can
        give you a straight answer, the problem usually is not your reps. It is that
        your pipeline stages describe what your team did, not what the buyer actually
        decided. &ldquo;Sent proposal&rdquo; is an activity. &ldquo;Champion confirmed
        and next step scheduled with the economic buyer&rdquo; is a buyer decision.
        Those are not the same thing, and only one of them tells you anything real about
        whether a deal is going to close.
      </p>

      <h2 className={h2}>The tell</h2>
      <p>
        Ask your team to walk you through the last deal they won, stage by stage. Listen
        closely to the verbs. If every stage advancement sounds like &ldquo;I sent the
        proposal&rdquo; or &ldquo;I had the call,&rdquo; your stages are activity-based,
        and that is exactly why your pipeline cannot tell you anything trustworthy about
        what is actually going to close or when.
      </p>
      <p>
        Here is the deeper problem with activity-based stages: they let deals sit. A rep
        can genuinely believe a deal is progressing because they did something, a call,
        an email, a proposal, when the buyer has not actually moved at all. The deal
        looks alive on your dashboard. It is dead. And because nobody is forcing a real
        buyer action before advancing the stage, dead deals clog the pipeline for weeks
        or months before anyone notices, which drags out your average cycle length and
        wrecks your forecast at the same time.
      </p>

      <h2 className={h2}>What this actually costs you</h2>
      <p>
        Poor pipeline data is not a rounding error. Gartner&rsquo;s own research puts
        the average cost of poor data quality at $12.9 million a year per organization,
        and pipeline stage data, the thing your forecast is actually built on, is one of
        the most common places that cost originates (
        <a
          href="https://www.gartner.com/en/data-analytics/topics/data-quality"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ).
      </p>
      <p>
        Here is where most of that cost actually hides. Research by Matthew Dixon and
        Ted McKenna, based on an analysis of 2.5 million sales calls, found that 40 to
        60% of B2B deals that fail to close are lost to customer indecision, not to a
        competitor. The buyer never said no. They just never said yes, and the deal
        quietly stalled while nobody was forcing the question (
        <a
          href="https://hbr.org/2022/06/stop-losing-sales-to-customer-indecision"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ).
      </p>

      <StatCards
        label="What the research says"
        title="The price of stages nobody can trust"
        stats={STATS}
      />

      <p>
        Activity-based pipeline stages make this invisible. A rep genuinely believes
        a deal is progressing because they did something, a call, an email, a proposal,
        while the buyer has already gone quiet. The deal sits in your forecast as
        &ldquo;still working&rdquo; for weeks or months, consuming pipeline coverage and
        sales attention, until someone finally closes it out as lost, usually logged as
        lost to a competitor when the real cause was indecision the whole way through.
      </p>
      <p>
        This shows up differently by vertical, but the underlying mechanism is
        identical. Managed services contracts commonly run 30 to 180 day sales cycles,
        plenty of runway for a deal to sit &ldquo;in proposal&rdquo; for months while a
        buyer stalls on internal budget approval. An agency retainer pitch can sit in
        &ldquo;sent proposal&rdquo; for weeks after the prospect&rsquo;s internal
        champion has gone dark. A staffing submittal can look like real movement while
        the hiring manager never actually confirmed the role is still open. In every
        case, the fix is the same: define what the buyer has to do or confirm before the
        stage counts as real progress, not what your team did.
      </p>
      <p>
        That is the real cost of activity-based stages. It is not just a longer number
        on a dashboard. It is capital tied up in deals that were never going to close,
        reps spending time on the wrong things, and a forecast nobody can trust.
      </p>

      <h2 className={h2}>What good stage design looks like</h2>

      <MaturityLadder
        label="The 1 to 5 scale"
        title="Pipeline stage design, Level 1 to Level 5"
        rungs={RUNGS}
      />

      <p>
        Increasingly that Level 5 validation is not a manager double-checking a
        rep&rsquo;s note, it is conversation-intelligence AI listening to the actual
        sales call or reading the actual email thread and confirming whether the buyer
        really said what the rep logged. Tools built for exactly this, Gong and Clari
        among them, flag the gap automatically when a deal&rsquo;s stage does not match
        what happened on the call (
        <a
          href="https://www.theskillshift.com/blog/clari-ai-pipeline-health"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ).
      </p>
      <p>
        You do not need a dedicated tool to test whether this would help you. Pull the
        call recording or email thread from your longest-stalled deal right now, paste
        the transcript into Claude, ChatGPT, or Grok, and ask it directly: based on this
        conversation, did the buyer actually confirm what our exit criterion for this
        stage requires, or did our rep just believe they did? Most founders who try this
        on even one deal are surprised by the answer. That is the manual version of what
        conversation-intelligence software does continuously, and it costs nothing
        beyond a tool you likely already have. What &ldquo;buyer confirmed&rdquo; looks
        like will differ by business too. In field services, it might be a signed
        estimate inside ServiceTitan or Jobber rather than a verbal commitment on a
        recorded call, but the underlying discipline, verify against what actually
        happened, not what a rep believes happened, is identical.
      </p>

      <h2 className={h2}>Where to start</h2>
      <p>
        This competency depends on{" "}
        <Link href="/learn/revenue-lifecycle-design" className="text-navy underline">
          Revenue Lifecycle Design
        </Link>
        , the full map of how a
        customer moves from first contact through onboarding and expansion. If you have
        not mapped that yet, pipeline stage design will always feel like you are
        organizing symptoms instead of fixing the cause. Map the lifecycle first, then
        define your stages as the specific decision points a buyer crosses inside that
        map.
      </p>
      <p>
        If you already have that map, the fastest next step is picking your
        worst-performing stage transition, the one where deals seem to sit the longest,
        and writing down, in plain language, exactly what has to be true for a deal to
        leave it. Not what your team has to do. What the buyer has to do or confirm.
      </p>
    </>
  );
}
