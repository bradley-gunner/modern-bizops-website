import Link from "next/link";

import MaturityLadder from "@/components/learn/MaturityLadder";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// Ladder only: the page cites one benchmark (HBR retention economics), and the
// spec's bar for stat cards is two cited numbers. The Level 5 journey-mapping
// passage and its source stay in prose below the ladder.
const RUNGS = [
  {
    level: 1,
    desc: (
      <>
        There is a vague sense of &ldquo;how a deal happens,&rdquo; but it exists{" "}
        <b>nowhere except your own head</b>. Post-sale is a completely separate
        conversation from pre-sale, with no shared owner and no shared map.
      </>
    ),
  },
  {
    level: 2,
    desc: (
      <>
        An acquisition funnel exists, awareness, consideration, decision, but it stops
        at closed-won. The post-sale journey is not designed at all. Marketing and sales
        are working from one mental model, and delivery or customer success is working
        from an entirely different one.
      </>
    ),
  },
  {
    level: 3,
    desc: (
      <>
        The full lifecycle is mapped from first contact through onboarding, adoption,
        and expansion, <b>as one document, not two</b>. Stage transitions have documented
        criteria. Someone owns each stage. The map gets used to actually design how work
        happens, not filed away after the workshop that produced it.
      </>
    ),
  },
  {
    level: 4,
    desc: (
      <>
        The lifecycle map lives inside the CRM itself, not a slide deck. Stage
        transitions are timestamped. Conversion rates between stages are measured, so
        bottlenecks show up in the data instead of in someone&rsquo;s gut feeling months
        later.
      </>
    ),
  },
  {
    level: 5,
    desc: (
      <>
        The lifecycle model is the <b>organizing principle</b> behind every revenue
        metric, every piece of content, every process design decision the business makes.
      </>
    ),
  },
];

export default function RevenueLifecycleDesignBody() {
  return (
    <>
      <p>
        If a deal keeps stalling after a strong demo, the instinct is to blame the demo.
        Better slides. A sharper pitch. A different rep. Usually none of that is the
        actual problem. The deal stalled because nobody ever mapped what has to happen
        between &ldquo;the prospect liked what they saw&rdquo; and &ldquo;the prospect
        is now a client who renews.&rdquo; That gap is not a details question. It is a
        design question, and most businesses have never actually answered it.
      </p>

      <h2 className={h2}>
        What &ldquo;the journey&rdquo; actually means, and where most companies stop
        mapping it
      </h2>
      <p>
        Ask yourself: what happens to a customer the moment after they sign? If the
        honest answer involves a shrug, or &ldquo;onboarding, I guess,&rdquo; you have a
        real gap, and it is not a small one.
      </p>
      <p>
        Most businesses can describe their acquisition funnel reasonably well.
        Awareness, consideration, a demo, a proposal, closed-won. What almost nobody
        maps with the same care is everything after that point: onboarding, first
        value, expansion, renewal. Post-sale is treated as a separate
        department&rsquo;s problem rather than the second half of the same system. That
        split is exactly why deals that looked healthy right up to signature go quiet
        three months later. The map ended at the signature, so nobody was watching what
        happened next.
      </p>
      <p>
        This shows up as two disconnected mental models running in the same company.
        Marketing and sales think in terms of the acquisition funnel. Customer success
        or delivery thinks in terms of onboarding and renewal. Neither team is wrong
        about their half. The problem is that nobody owns the full thing as one
        connected system with a single set of stage definitions and a single owner for
        each transition.
      </p>

      <h2 className={h2}>Why the gap is expensive, not just untidy</h2>
      <p>
        Harvard Business Review&rsquo;s research on customer retention economics found
        that a five percent increase in retention has been associated with profit
        increases ranging from 25 to 95 percent (
        <a
          href="https://hbr.org/2014/10/the-value-of-keeping-the-right-customers"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ). That is a wide range, and it is wide for a specific reason: most businesses
        have never measured the post-sale side of the journey with anything close to
        the rigor they apply to pipeline and forecast on the pre-sale side. You cannot
        improve what you never mapped, and you cannot know what improving it is worth
        if you never measured the baseline.
      </p>
      <p>
        The real-world version of this shows up in the exact search behavior founders
        use when a deal goes sideways. &ldquo;Why deals stall after the demo&rdquo; is a
        question people ask constantly, and the honest answers that turn up when you
        look are rarely about the demo itself: buyers who were curious but never
        actually committed, champions without enough internal influence to bring legal
        or finance along, deals where nobody ever confirmed what specifically had to be
        true for the prospect to say yes. Every one of those is a lifecycle design
        failure. The stage existed on paper. Nobody had defined what actually moves a
        prospect out of it.
      </p>
      <p>
        The same failure mode repeats after the sale closes, just with different
        symptoms. A new client signs, and the handoff from sales to whoever delivers
        the work is an email that says &ldquo;we won this one.&rdquo; The new client
        repeats information they already gave during the sales process. Nobody has
        agreed on what &ldquo;onboarded&rdquo; or &ldquo;activated&rdquo; actually
        means, so nobody notices when a client quietly falls behind the pace that
        predicts they will stick around.
      </p>

      <h2 className={h2}>What good lifecycle design looks like, one step at a time</h2>

      <MaturityLadder
        label="The 1 to 5 scale"
        title="Revenue lifecycle design, Level 1 to Level 5"
        rungs={RUNGS}
        caption="Rendered directly from this page's Level 1 to 5 rubric. Same words, better scanning and AI extraction."
      />

      <p>
        At Level 5, increasingly, the map itself stops being something a person redraws
        twice a year and starts updating from real customer behavior instead. Modern
        journey-mapping tools ingest actual call transcripts, support
        tickets, and usage data and surface where the real friction sits, not where
        someone assumed it would be two years ago, &ldquo;unlike traditional journey
        mapping that relies on static documentation and periodic updates, AI creates
        living maps that adapt in real time based on actual customer behavior&rdquo; (
        <a
          href="https://thecxlead.com/tools/best-ai-customer-journey-mapping-tools/"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ).
      </p>
      <p>
        You do not need an enterprise journey-mapping platform to get a rough version
        of this yourself. Pull ten to fifteen recent sales call transcripts, most
        video-call tools already record and transcribe them, along with your support
        tickets from a new client&rsquo;s first ninety days and any churn notes you
        have. Ask Claude, ChatGPT, or Grok to map out the stages a customer actually
        moves through and flag where the friction shows up. You will have a rough draft
        in an afternoon. What that draft will not give you is validation, ten
        transcripts is a hypothesis, not a fact, or the actual stage-transition
        triggers and ownership that turn a map into something your team runs on instead
        of a diagram someone drew once.
      </p>

      <h2 className={h2}>Where to start</h2>
      <p>
        If you have never mapped this before, do not start with the post-sale half.
        Start by writing down, in plain language, what has to happen for a prospect to
        move from &ldquo;interested&rdquo; to &ldquo;committed,&rdquo; and be honest
        about where that break actually happens in your business right now. Then do the
        same thing for the first ninety days after a client signs. The two halves are
        one map, not two separate projects, and the businesses that treat them as one
        system are the ones whose post-demo deals stop mysteriously stalling and whose
        new clients stop quietly going dark.
      </p>
      <p>
        This competency depends on knowing who you are mapping the journey for in the
        first place. If your{" "}
        <Link href="/learn/ideal-customer-profile" className="text-navy underline">
          Ideal Customer Profile
        </Link>{" "}
        is still fuzzy, the lifecycle map will be too, because you cannot design a
        consistent journey for a customer you cannot describe consistently.
      </p>
    </>
  );
}
