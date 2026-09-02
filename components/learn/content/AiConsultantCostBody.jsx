import Link from "next/link";
import StatCards from "@/components/learn/StatCards";
import ComparisonTable from "@/components/learn/ComparisonTable";
import {
  LADDER,
  TRAINING,
  AUDIT_TERMS,
  CLEANUP_PRICE_FLOOR,
  CLEANUP_PRICE_CEILING,
} from "@/lib/offers";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";
const link = "text-navy underline";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

// Primary sources the draft cites with [link: ...] markers. Both resolved and
// fetched live on 2026-09-01 at publish time.
const ZIPRECRUITER_URL = "https://www.ziprecruiter.com/Salaries/Ai-Automation-Salary";
const FIVERR_URL = "https://www.fiverr.com/resources/guides/costs/ai-automation-experts";

// Verbatim transcription of the approved AEO batch 2 asset 4 source copy
// (Marketing Systems/SEO Pilot/pending-approval/aeo-4-ai-consultant-cost.md,
// APPROVED-BY-BRADLEY 2026-09-01, published 2026-09-01). The consultant-side
// cost guide beside the agency-side one (ai-automation-agency-cost); the two
// cross-link, and this one links out to both comparison pages. Ladder prices,
// the cleanup band and the audit terms interpolate from lib/offers.js so a
// number here can never disagree with the pricing page (aeo-1 precedent). The
// "$120K to $160K loaded" hire figure is the draft's own, approved as written;
// the handoff's open recommendation to raise it to the ICP v2 band is flagged
// in the deploy receipt, not applied here.
export default function AiConsultantCostBody() {
  return (
    <>
      <p>
        Most independent AI consultants charge $150 to $350 an hour. Project
        engagements for a small or mid-sized business typically run $5,000 to
        $25,000, and monthly advisory retainers run $2,000 to $10,000. Big-firm
        consulting sits far above all of that, at $500 an hour and up. The
        spread is real, and it exists because &ldquo;AI consultant&rdquo;
        describes at least three different jobs sold under one title.
      </p>
      <p>
        This guide gives you the real numbers by pricing model, explains which
        kind of consultant each number buys, and ends with our own published
        prices, because a cost guide from a company that hides its own pricing
        is not much of a guide.
      </p>

      {/* The draft note's stat pair: the independent hourly range and the
          small-business project band, both from the opening paragraph. */}
      <StatCards
        label="The benchmarks"
        title="What an independent AI consultant charges in 2026"
        stats={[
          {
            big: "$150 to $350",
            desc: "an hour is what most independent AI consultants charge. Named specialists and boutique firms run $300 to $500 and up; big-firm consulting sits at $500 an hour and up.",
            source: "2026 market rates, this guide",
          },
          {
            big: "$5,000 to $25,000",
            desc: "is the commonly quoted project band for a small or mid-sized business. Single-system builds sit at the bottom of it.",
            source: "2026 market rates, this guide",
          },
        ]}
      />

      <h2 className={h2}>The three jobs hiding inside one title</h2>
      <p>
        <strong>The advisor.</strong> Strategy, use-case selection, vendor
        evaluation. Sells hours or a fixed-fee roadmap. This is where hourly
        pricing is honest, because advice is genuinely open-ended.
      </p>
      <p>
        <strong>The builder.</strong> Scopes and ships working automations: lead
        routing, follow-up sequences, reporting, data pipelines. The fair
        pricing model here is a fixed price per named system, because the
        deliverable can be named before the work starts.
      </p>
      <p>
        <strong>The staff augmentation seat.</strong> A contractor inside your
        team, billed monthly. Priced like a fractional hire, and it should be
        compared against one: an operations or GTM engineering hire runs
        roughly $120K to $160K loaded, and market salary data puts the average
        AI automation role at about $117K base (
        <a
          href={ZIPRECRUITER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          ZipRecruiter, Ai Automation Salary, August 2026
        </a>
        ).
      </p>
      <p>
        Most bad purchases in this market come from paying one job&rsquo;s rate
        for a different job&rsquo;s work. Hourly advice rates applied to a
        build is the common one, and it is expensive, because the incentive
        runs against finishing.
      </p>

      <h2 className={h2}>What the rates actually look like in 2026</h2>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>Hourly.</strong> $100 to $150 for junior generalists, $150 to
          $350 for experienced independents, $300 to $500 and up for named
          specialists and boutique firms. Marketplace rates run far lower, $18
          to $150 an hour, and you get what that buys: template installs, not
          systems your team can own (
          <a
            href={FIVERR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            Fiverr AI automation cost guide, August 2026
          </a>
          ).
        </li>
        <li>
          <strong>Fixed-price projects.</strong> $5,000 to $25,000 is the
          commonly quoted small-business band. Single-system builds sit at the
          bottom of it, and a good consultant will price each system separately
          rather than quoting one blended number.
        </li>
        <li>
          <strong>Retainers.</strong> $2,000 to $10,000 a month depending on
          whether the month buys named deliverables or &ldquo;access.&rdquo;
          Always ask which.
        </li>
        <li>
          <strong>Diagnostics.</strong> $1,000 to $5,000 for a paid assessment,
          often credited toward later work. A consultant willing to be paid to
          tell you what NOT to build is worth more than one who starts building
          on day one.
        </li>
      </ul>

      {/* The draft note's comparison graphic: hourly vs project vs retainer.
          Each cell is condensed from the three-jobs section and the rates list
          above. No column is highlighted: the page's point is that each model
          is honest for one job and wrong for another. */}
      <ComparisonTable
        label="Side by side"
        title="Three pricing models, and the job each one is honest for"
        options={["Hourly", "Fixed-price project", "Monthly retainer"]}
        rows={[
          {
            label: "Typical 2026 price",
            cells: [
              "$100 to $150 junior, $150 to $350 experienced, $300 to $500 and up for named specialists",
              "$5,000 to $25,000 for a small or mid-sized business",
              "$2,000 to $10,000 a month",
            ],
          },
          {
            label: "The job it fits",
            cells: [
              "The advisor: strategy, use-case selection, vendor evaluation",
              "The builder: a named system, priced separately from the next one",
              "The staff augmentation seat: a contractor inside your team",
            ],
          },
          {
            label: "Why it is honest there",
            cells: [
              "Advice is genuinely open-ended",
              "The deliverable can be named before the work starts",
              "Priced like a fractional hire, and comparable against one",
            ],
          },
          {
            label: "Where it goes wrong",
            cells: [
              "Applied to a build, the incentive runs against finishing",
              "One blended number instead of a price per system",
              "A month that buys access rather than named deliverables. Always ask which",
            ],
          },
        ]}
      />

      <h2 className={h2}>What a fair quote includes, and what most skip</h2>
      <p>
        The work that decides whether AI consulting pays for itself is boring,
        and most quotes skip it because it is messy and hard to scope. Your
        CRM&rsquo;s information architecture needs to be sound first. The data
        in the existing fields needs to be clean. Then automation gets built on
        top of that foundation, and it holds. A quote that goes straight to the
        impressive automation without asking about the state of your data is a
        quote for a system that will be quietly abandoned by month four.
      </p>
      <p>Three questions expose most padded proposals before you sign:</p>
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
          A consultant who answers &ldquo;nothing, we handle everything&rdquo;
          has not looked, or is not planning to.
        </li>
        <li>
          <strong>&ldquo;What happens when it breaks in month four?&rdquo;</strong>{" "}
          Listen for a number and a process. Market rate for per-system upkeep
          runs $300 to $800 a month.
        </li>
      </ol>
      <p>
        If you are weighing a consultant against hiring someone or against an
        agency, we have written both comparisons:{" "}
        <Link href="/learn/ai-consultant-vs-in-house" className={link}>
          AI consultant vs. in-house
        </Link>{" "}
        and{" "}
        <Link href="/learn/ai-consultant-vs-ai-agency" className={link}>
          AI consultant vs. AI automation agency
        </Link>
        . For what full agencies charge, see{" "}
        <Link href="/learn/ai-automation-agency-cost" className={link}>
          how much an AI automation agency costs
        </Link>
        .
      </p>

      <h2 className={h2}>Our prices, published</h2>
      <p>
        We sell fixed-scope AI automation for B2B go-to-market teams, at
        published prices, foundation first:
      </p>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>{rung.scan.name}:</strong> free. A self-serve readiness read,
          about five minutes.
        </li>
        <li>
          <strong>
            {rung.audit.name}: {rung.audit.price}.
          </strong>{" "}
          Connects to your actual stack, computes a maturity heat map, and hands
          you a prioritized automation map with fixed prices attached.{" "}
          {AUDIT_TERMS.creditPercent} of the fee credits toward{" "}
          {AUDIT_TERMS.creditTarget} within {AUDIT_TERMS.creditWindow}.
        </li>
        <li>
          <strong>
            Cleanup Services: {CLEANUP_PRICE_FLOOR} to {CLEANUP_PRICE_CEILING}{" "}
            fixed.
          </strong>{" "}
          The foundation work most quotes skip, priced as named items before any
          build goes on top.
        </li>
        <li>
          <strong>
            {rung.builds.name}: {rung.builds.price} per named system.
          </strong>{" "}
          Fixed price, named scope, a runbook, and your team trained to own it.
        </li>
        <li>
          <strong>
            {rung.partner.name}: {rung.partner.price}. Partner Plus:{" "}
            {rung["partner-plus"].price}.
          </strong>
        </li>
        <li>
          <strong>
            {TRAINING.name}: {TRAINING.price}.
          </strong>
        </li>
      </ul>
      <p>
        If you want to know what a consultant should be quoting you for, a
        30-minute call will tell you which rung fits:{" "}
        <Link href="/book" className={link}>
          book a call
        </Link>
        .
      </p>
    </>
  );
}
