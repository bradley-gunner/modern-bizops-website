import Link from "next/link";
import StatCards from "@/components/learn/StatCards";
import StageList from "@/components/learn/StageList";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

const STATS = [
  {
    big: "7x",
    desc: "How much likelier firms that contacted a web lead within an hour were to reach a decision maker, versus waiting an hour longer.",
    source: "Harvard Business Review, 2011",
  },
  {
    big: "Button last, funnel first",
    desc: "The order almost everyone does backwards. Fix the pipeline handoffs first, then test a page only if that is genuinely where a real rate is stuck.",
    source: "Modern BizOps",
  },
];

const STAGES = [
  {
    name: "Speed-to-lead",
    desc: "A lead arrives. Does it get contacted, and how fast? Usually the largest and cheapest win available.",
  },
  {
    name: "Lead-to-opportunity",
    desc: "A contacted lead becomes a qualified opportunity, or it does not. Mostly about whether 'qualified' means the same thing to marketing and sales.",
  },
  {
    name: "Opportunity-to-proposal",
    desc: "A qualified opportunity gets a proposal, or it stalls.",
  },
  {
    name: "Proposal-to-close",
    desc: "The proposal closes, or stalls. Where founder-dependent selling shows up, because deals that only the founder can close pile up waiting for the founder.",
  },
];

export default function ConversionRateOptimizationBody() {
  return (
    <>
      <p>
        Almost everything written about conversion rate optimization is about your website.
        A/B testing headlines, moving buttons, changing colors, reducing form fields,
        watching heatmaps. If you sell to consumers off a landing page, that work matters.
        If you run a founder-led B2B company with a real sales motion,
        it is not where your money is leaking. Your biggest conversion losses are not on the
        page where someone fills out a form. They are in the pipeline, between the lead
        arriving and the deal closing, where a slow follow-up, an inconsistent process, and
        a founder-dependent close quietly lose deals that the marketing spend already paid
        for.
      </p>
      <p>
        So this page is not the standard version. Conversion rate optimization, for a
        business like yours, means finding and fixing the places in your revenue funnel
        where interested buyers fall out, and most of those places are nowhere near a
        button. I have done the tactical version too, in my own seat: I doubled the sales
        conversion rate at a VC-backed startup by fixing a process assumption nobody had
        questioned, not by testing a landing page. That is the lens here.
      </p>

      <h2 className={h2}>Your funnel has more than one conversion rate</h2>
      <p>
        The mistake that keeps founder-led businesses optimizing the wrong thing is treating
        conversion as a single number. It is not. Every handoff in your funnel is its own
        conversion rate, and the leak is almost never where you are looking.
      </p>
      <p>
        A lead arrives. Does it get contacted, and how fast? That is your speed-to-lead
        conversion, and it is usually the largest and cheapest win available. A contacted
        lead becomes a qualified opportunity, or it does not: that is your lead-to-opportunity
        rate, and it is mostly about whether &ldquo;qualified&rdquo; means the same thing to
        marketing and sales. A qualified opportunity gets a proposal, and the proposal
        closes, or stalls: those are two more distinct rates, and the second is where
        founder-dependent selling shows up, because deals that only the founder can close
        pile up waiting for the founder.
      </p>
      <p>
        When you map your funnel this way, the &ldquo;conversion rate optimization&rdquo;
        question stops being &ldquo;which button&rdquo; and becomes &ldquo;which handoff is
        leaking the most, and why.&rdquo; That is a revenue-operations question, and it has a
        much bigger answer than any landing-page test.
      </p>

      <StageList
        label="Your funnel, rate by rate"
        title="Four conversion rates, not one blended number"
        stages={STAGES}
      />

      <h2 className={h2}>Speed to lead is usually the biggest, cheapest fix</h2>
      <p>
        If you only look at one number, look at how long a new lead waits before someone
        reaches out. The evidence here is old and has not aged a day. In a Harvard Business
        Review study that audited how 2,241 US companies responded to a live web lead, firms
        that attempted contact within an hour were nearly seven times as likely to have a
        meaningful conversation with a decision maker as firms that waited even an hour
        longer, and the average response time among companies that responded at all was 42
        hours (
        <a
          href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Harvard Business Review, &ldquo;The Short Life of Online Sales Leads&rdquo;
        </a>
        ). Buyer patience has only shrunk since 2011.
      </p>
      <p>
        Read that as a conversion lever. If your marketing produces leads and they sit for a
        day or two before anyone calls, no landing-page test will recover the deals you are
        losing to the wait. The fix is operational: a routing rule that puts a new lead in
        front of a human fast, and a first-touch that actually happens. That single change
        moves more revenue than a quarter of button tests, and it costs almost nothing.
      </p>

      <StatCards
        label="The biggest lever is upstream"
        title="Speed to lead beats a quarter of button tests"
        stats={STATS}
      />

      <h2 className={h2}>The other leaks are process, not design</h2>
      <p>
        Past speed to lead, the remaining conversion leaks in a founder-led business are
        almost all process problems.
      </p>
      <p>
        One definition of &ldquo;qualified.&rdquo; When marketing and sales mean different
        things by the word, marketing hits its lead number and sales works whoever it feels
        like, and the lead-to-opportunity conversion rate is measuring two teams who never
        agreed on the terms. Fixing it is the{" "}
        <Link href="/learn/marketing-and-sales-alignment" className="text-navy underline">
          marketing and sales alignment
        </Link>{" "}
        work: one written definition both sides use.
      </p>
      <p>
        A pipeline that reflects reality. If your sales stages are named after activities
        (&ldquo;call made,&rdquo; &ldquo;demo done&rdquo;) instead of buyer decisions, your
        conversion rates between stages are meaningless and your forecast is a guess. Stages
        defined by what the buyer has decided, not what your rep did, are what make each
        conversion rate legible enough to improve.
      </p>
      <p>
        A close that does not depend only on you. If the founder is the only person who can
        move a deal from proposal to signed, your proposal-to-close rate is capped by the
        founder&rsquo;s calendar, and every deal waits in line behind the founder. Getting
        the close out of the founder&rsquo;s head and into a repeatable process is the single
        highest-value conversion project in most companies this size, and it is the opposite
        of a website test.
      </p>

      <h2 className={h2}>Where conversion optimization sits in revenue operations maturity</h2>
      <p>
        In the GTM Maturity Framework, a method I built for measuring the go-to-market
        competencies of a business, funnel conversion moves through clear stages. At the
        bottom, conversion is one blended number nobody can act on, leads are followed up
        whenever, and the founder is the only reliable closer. The first real step is
        separating the funnel into its distinct conversion rates and measuring each. Next is
        fixing the biggest leak (usually speed to lead, then the shared definition of
        qualified). Further up, the pipeline stages reflect buyer decisions, the close is a
        repeatable process, and every conversion rate is a number the team watches and
        improves. You do not need the top of that ladder this quarter. You need to stop
        treating conversion as one number and start seeing the handoff that is actually
        leaking.
      </p>
      <p>
        A word on tools, because the conversion-optimization market sells software hard. A/B
        testing platforms, heatmap tools, and AI that rewrites your landing-page copy are
        real and occasionally useful. They optimize the smallest, latest step in your funnel
        while the big leaks sit upstream in the pipeline. Fix the funnel handoffs first.
        Then, if a specific page is genuinely where a real conversion rate is stuck, test it.
        The order matters, and almost everyone does it backwards. The foundations start at{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          Stage 1 of the maturity framework
        </Link>
        , and the pipeline-legibility piece is{" "}
        <Link href="/learn/pipeline-stage-design" className="text-navy underline">
          pipeline stage design
        </Link>
        .
      </p>
    </>
  );
}
