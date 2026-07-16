import Link from "next/link";

import StatCards from "@/components/learn/StatCards";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// Stat cards only. No ladder: this is not a competency page and has no Level 1
// to 5 rubric. No comparison graphic either: the page's three pieces are
// sequential parts of one build, not an either/or worth setting side by side.
const STATS = [
  {
    big: "7x",
    desc: "Firms that attempted contact within an hour of a live web lead were nearly seven times as likely to have a meaningful conversation with a decision maker as firms that waited even an hour longer.",
    source: "HBR, The Short Life of Online Sales Leads",
  },
  {
    big: "42 hours",
    desc: "The average response time among the companies that responded at all, across an audit of 2,241 US companies. The study is from 2011; buyer patience has not grown since.",
    source: "HBR, The Short Life of Online Sales Leads",
  },
];

export default function MarketingAndSalesAlignmentBody() {
  return (
    <>
      <p>
        Marketing and sales alignment means both teams operate on one shared definition
        of a real opportunity, one documented handoff, and one set of numbers neither
        side gets to grade for itself. That is the whole thing. Not a retreat, not a
        shared Slack channel, not more meetings between two functions that each keep
        their own scoreboard.
      </p>
      <p>
        The reason alignment advice usually fails is that it treats a systems problem
        as a relationship problem. Marketing counts leads. Sales works whoever they
        feel like working. Both use the word &ldquo;qualified&rdquo; constantly and
        mean different things by it. You cannot fix that with trust falls, because the
        disagreement is not personal. It is the absence of a written definition either
        side could point to. In a study Forrester Consulting ran for LinkedIn back in
        2020, 89% of sales and marketing leaders said their coming year&rsquo;s
        priorities depended on successful alignment (
        <a
          href="https://business.linkedin.com/marketing-solutions/webinars/20/09/sales-marketing-alignment-moments-of-trust"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn, Moments of Trust
        </a>
        ). The intent has been there for years. The missing piece is almost never
        intent. It is three specific, buildable pieces of infrastructure.
      </p>
      <p>
        If you run a founder-led company where marketing is two people and you still
        close half the deals yourself, the enterprise version of this advice (RevOps
        referees, ABM platforms, quarterly alignment summits) is overkill. The three
        pieces below are not. They work at any size that has more than one person
        touching leads.
      </p>

      <h2 className={h2}>Piece one: a shared definition, written down</h2>
      <p>
        Ask your marketing lead and your best salesperson to each write down what a
        qualified lead looks like. If the answers match, you are ahead of most
        companies. When the answers differ, every downstream fight is already
        scheduled: marketing will hit its lead number, sales will ignore half those
        leads, and the quarterly meeting where each side presents its own numbers will
        start with a debate about whose numbers are right.
      </p>
      <p>
        The fix is a data dictionary both functions build together and actually sign:
        what &ldquo;lead,&rdquo; &ldquo;qualified,&rdquo; and &ldquo;opportunity&rdquo;
        mean, in observable criteria. Company size, role, a named pain, a budget
        signal, timing. Not vibes, and not one team&rsquo;s definition handed to the
        other, because a definition marketing owns alone becomes a volume target, and a
        definition sales owns alone becomes a moat. The criteria live in your CRM as
        required fields, not in a document nobody opens. This is the same discipline as
        a{" "}
        <Link href="/learn/lead-qualification-framework" className="text-navy underline">
          lead qualification framework
        </Link>
        , applied jointly: it only counts as alignment when both teams use the same
        one. And it depends on your{" "}
        <Link href="/learn/ideal-customer-profile" className="text-navy underline">
          ideal customer profile
        </Link>{" "}
        being real, because two teams cannot agree on what a qualified lead is if the
        company has never written down who it is for.
      </p>

      <h2 className={h2}>Piece two: a handoff with mechanics, not a hallway</h2>
      <p>
        Once &ldquo;qualified&rdquo; is defined, the handoff needs three mechanical
        parts: a trigger (what specifically moves a lead from marketing&rsquo;s
        ownership to sales), required data (what fields must be populated before the
        handoff fires), and an acceptance step (sales formally takes the lead or
        returns it with a reason code, inside a defined window).
      </p>
      <p>
        The reason code is the part most companies skip, and it is the most valuable.
        When sales can silently ignore leads, marketing learns nothing and resentment
        compounds. When sales must return a lead with &ldquo;wrong industry&rdquo; or
        &ldquo;no budget signal,&rdquo; those codes become a dataset. Sixty returns for
        &ldquo;wrong industry&rdquo; in a quarter is not a fight, it is a targeting fix
        with a name on it.
      </p>

      <h2 className={h2}>Piece three: an SLA with teeth, both directions</h2>
      <p>
        A sales and marketing SLA (service level agreement) is the written commitment
        each function makes to the other. Marketing commits to volume and quality of
        qualified leads per the shared definition. Sales commits to response time on
        every lead handed over, and to feedback via those reason codes.
      </p>
      <p>
        Response time is where the money is, and it is measurable. In a Harvard
        Business Review study that audited how 2,241 US companies responded to a live
        web lead, firms that attempted contact within an hour were nearly seven times
        as likely to have a meaningful conversation with a decision maker as firms that
        waited even an hour longer, and the average response time among companies that
        responded at all was 42 hours (
        <a
          href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads"
          target="_blank"
          rel="noopener noreferrer"
        >
          HBR, The Short Life of Online Sales Leads
        </a>
        ).
      </p>

      <StatCards
        label="What the research says"
        title="Response time is where the money is"
        stats={STATS}
      />

      <p>
        The study is from 2011; buyer patience has not grown since. If your
        marketing spend produces leads that sit for two days, your problem is not lead
        quality and no targeting change will fix it.
      </p>
      <p>
        The SLA works when violations are visible. Response time is a CRM report, not
        an opinion. Both sides review the same dashboard on a regular cadence, and the
        meeting produces changes: marketing adjusts targeting from reason-code data,
        sales adjusts criteria from what marketing is seeing upstream. In the Revenue
        Operations Maturity Model this is the marketing-sales feedback loop, and the
        test for whether yours exists is one question: when did marketing last change
        something specific because of what sales reported? If the answer is
        &ldquo;never&rdquo; or &ldquo;at the offsite,&rdquo; you have meetings, not a
        loop.
      </p>

      <h2 className={h2}>Where alignment sits in revenue operations maturity</h2>
      <p>
        These three pieces are Stage 2 competencies in the maturity model: shared
        revenue definitions and SLAs, the lead handoff process, and the marketing-sales
        feedback loop. That placement is worth noticing. Alignment is not an advanced
        capability for companies with a RevOps team, and it is also not step one. It
        assumes a working CRM and a real{" "}
        <Link href="/learn/ideal-customer-profile" className="text-navy underline">
          ideal customer profile
        </Link>{" "}
        underneath it, which is where{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          Stage 1
        </Link>{" "}
        work comes first. Most alignment initiatives fail for exactly this reason: they
        install an SLA on top of a CRM nobody trusts, and the SLA inherits the
        distrust.
      </p>
      <p>
        One more honest note on tooling. AI lead scoring and routing can enforce a
        shared definition within seconds of a lead arriving, and that is genuinely
        useful at volume. But an AI model trained on a definition that does not exist
        automates the disagreement. Write the definition first. The tools come after,
        and often you need fewer of them than the vendors ranking for this search term
        would suggest.
      </p>
    </>
  );
}
