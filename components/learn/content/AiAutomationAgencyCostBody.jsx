import Link from "next/link";
import { LADDER, TRAINING, AUDIT_TERMS } from "@/lib/offers";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

// Verbatim transcription of the approved AEO asset 1 source copy
// (Marketing Systems/SEO Pilot/pending-approval/aeo-1-ai-automation-agency-cost.md,
// drafted 2026-08-11 at ai-pivot-execution-v4 step 15, published 2026-08-26).
// The draft's inline [cite: ...] markers reference the private research corpus
// (02 Competitor Teardowns, 03 Voice Synthesis, 04 Buyer Evidence) and are
// provenance notes for the drafting record, not page copy, so they do not
// render. Ladder prices interpolate from lib/offers.js so a price on this page
// can never disagree with the pricing page, and the audit guarantee sentence is
// AUDIT_TERMS.guarantee verbatim rather than the draft's older paraphrase of
// the same term.
export default function AiAutomationAgencyCostBody() {
  return (
    <>
      <p>
        Most AI automation agencies charge one of three ways: fixed-price
        projects (roughly $2,000 to $25,000 per system), monthly retainers
        (roughly $1,500 to $10,000 a month), or hourly consulting ($100 to $300
        an hour). The wide ranges are real, and they are the first thing to
        understand: the market has no standard rate card, most agencies publish
        no prices at all, and two quotes for the same automation can differ by
        10x.
      </p>
      <p>
        This guide gives you the real numbers, the pricing models behind them,
        and the questions that separate a fair quote from a padded one. It ends
        with our own published prices, because a pricing guide from a company
        that hides its own pricing is not much of a guide.
      </p>

      <h2 className={h2}>The three pricing models, and what each actually costs</h2>
      <p>
        <strong>Fixed-price projects.</strong> One named automation, one price,
        one deadline. Simple single-system builds (lead routing, follow-up
        sequences, CRM cleanup) typically run $2,000 to $6,500. Multi-system
        builds and custom agent work run $7,500 to $25,000. Above that you are
        usually buying either genuine enterprise complexity or a brand name.
      </p>
      <p>
        <strong>Monthly retainers.</strong> Ongoing build-and-maintain
        arrangements start around $1,500 to $2,500 a month at the low end,
        cluster between $4,000 and $8,000 a month for a dedicated senior
        operator&rsquo;s attention, and reach $10,000 and beyond when the agency
        staffs a team. The thing to check is what a month actually buys: hours,
        named deliverables, or &ldquo;access.&rdquo;
      </p>
      <p>
        <strong>Hourly consulting.</strong> $100 to $300 an hour for automation
        consultants and engineers, higher for named specialists. Hourly works
        for scoping and advice. It works badly for builds, because the incentive
        runs against finishing.
      </p>
      <p>
        <strong>The fourth number nobody quotes: the diagnostic.</strong> Some
        agencies run a paid audit or assessment first, usually $1,000 to $5,000,
        often credited against later work. This is generally a good sign, not a
        bad one. An agency willing to be paid to tell you what NOT to build is
        an agency you can believe when it tells you what to build.
      </p>

      <h2 className={h2}>What actually drives the price up or down</h2>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>How many systems the automation touches.</strong> One CRM is
          one price. CRM plus billing plus a marketing platform plus a
          scheduling tool is real integration work, and honest agencies price
          each added system explicitly.
        </li>
        <li>
          <strong>The state of your data.</strong> This is the cost driver
          buyers least expect. If your CRM has duplicate records, empty fields,
          and stages nobody agreed on, the automation either gets built on sand
          or the cleanup gets priced in. Ask any agency how they handle it; the
          answer tells you whether they have shipped automations that survived
          contact with real data.
        </li>
        <li>
          <strong>Custom AI work vs. assembled workflows.</strong> Most business
          automation is workflow assembly on proven tools, and should be priced
          like it. Custom model work is rarer and more expensive. Be suspicious
          of a custom-AI price for an assembled-workflow scope.
        </li>
        <li>
          <strong>Maintenance.</strong> Automations break when the tools
          underneath them change. Market rate for per-system monitoring and
          upkeep runs $300 to $800 a month. If a proposal has no maintenance
          answer, the automation has a planned lifespan nobody mentioned.
        </li>
      </ul>

      <h2 className={h2}>Where the money gets wasted</h2>
      <p>
        The expensive failure in this market is not overpaying for a working
        automation. It is paying anything for an automation that gets abandoned.
        The pattern, from buyer accounts, runs: an ambitious agent project, a
        demo that impresses, a rollout the team routes around, a quiet
        cancellation some months later.
      </p>
      <p>Three questions expose most of it before you sign:</p>
      <ol className="list-decimal pl-6 space-y-3">
        <li>
          <strong>
            &ldquo;What exactly will exist when you are done, and who on my team
            owns it?&rdquo;
          </strong>{" "}
          No named deliverable and no named owner means you are buying hours,
          not outcomes.
        </li>
        <li>
          <strong>
            &ldquo;What has to be true about my data and process before this
            works?&rdquo;
          </strong>{" "}
          An agency that answers &ldquo;nothing, we handle everything&rdquo; has
          not looked, or is not planning to.
        </li>
        <li>
          <strong>&ldquo;What happens when it breaks in month four?&rdquo;</strong>{" "}
          Listen for a number and a process, not reassurance.
        </li>
      </ol>

      <h2 className={h2}>Our prices, published</h2>
      <p>
        We sell fixed-scope automation for B2B go-to-market teams, at published
        prices, foundation first. The ladder:
      </p>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>{rung.scan.name}: free.</strong> A self-serve readiness read.
        </li>
        <li>
          <strong>
            {rung.audit.name}: {rung.audit.price}.
          </strong>{" "}
          Connects to your actual stack (20+ tool integrations), computes a
          maturity heat map, and hands you a prioritized automation map with
          fixed prices attached. {AUDIT_TERMS.creditPercent} of the fee credits
          toward {AUDIT_TERMS.creditTarget} within {AUDIT_TERMS.creditWindow}.{" "}
          {AUDIT_TERMS.guarantee}
        </li>
        <li>
          <strong>
            {rung.builds.name}: {rung.builds.price} per named system.
          </strong>{" "}
          Fixed price, named scope, a delivery clock, a runbook, and your team
          trained to own it.
        </li>
        <li>
          <strong>
            {rung.partner.name}: {rung.partner.price}
          </strong>{" "}
          (a monthly engagement, not equity). Up to three systems monitored and
          maintained, plus a monthly working session.{" "}
          <strong>
            {rung["partner-plus"].name}: {rung["partner-plus"].price}
          </strong>{" "}
          for companies automating in more than one function.
        </li>
        <li>
          <strong>
            {TRAINING.name}: {TRAINING.price}.
          </strong>
        </li>
      </ul>
      <p>
        Why the audit comes first: most AI automation fails for a boring reason.
        It is built on a broken operations foundation, and the debt you could
        tolerate for years (dirty data, duct-tape process, fields nobody fills
        in) now decides whether AI works for you at all. Paying for the
        diagnosis before the build is how you avoid buying automation your
        foundation cannot hold. The full ladder, with every number on one page,
        is on our <Link href="/pricing" className="text-navy underline">pricing page</Link>.
      </p>
    </>
  );
}
