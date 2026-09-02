import Link from "next/link";
import StatCards from "@/components/learn/StatCards";
import ComparisonTable from "@/components/learn/ComparisonTable";
import {
  LADDER,
  TRAINING,
  AUDIT_TERMS,
  CARE_PLAN,
  CLEANUP_PRICE_FLOOR,
  CLEANUP_PRICE_CEILING,
} from "@/lib/offers";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";
const link = "text-navy underline";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

// Primary sources the draft cites with [link: ...] markers. Both resolved and
// fetched live on 2026-09-01 at publish time.
const DAN_URL = "https://digitalagencynetwork.com/ai-agency-pricing/";
const FIVERR_URL = "https://www.fiverr.com/resources/guides/costs/ai-automation-experts";

// Verbatim transcription of the approved AEO batch 2 asset 6 source copy
// (Marketing Systems/SEO Pilot/pending-approval/aeo-6-ai-automation-services-
// pricing.md, APPROVED-BY-BRADLEY 2026-09-01, published 2026-09-01). The
// item-level pricing spoke beside the engagement-level agency cost guide
// (ai-automation-agency-cost): that page answers what agencies charge per
// model, this one prices the work per named item, and the two link to each
// other in the first screen so the split is visible. Ladder prices, the
// cleanup band, the Care Plan and the audit terms interpolate from
// lib/offers.js so a number here can never disagree with the pricing page.
export default function AiAutomationServicesPricingBody() {
  return (
    <>
      <p>
        Single-system AI automations, lead routing, follow-up sequences,
        reporting, cost roughly $1,500 to $6,500 each at fair 2026 market
        prices. Foundation work like CRM cleanup runs $1,500 to $3,000 per
        system. Ongoing maintenance runs $300 to $800 a month per system. Most
        pricing guides stop at the engagement level, what an agency or
        consultant charges for a month or a project. This page prices the work
        item by item instead, because that is how you compare quotes.
      </p>
      <p>
        If what you actually want is the engagement-level view, models,
        retainers, hourly, we wrote that guide separately:{" "}
        <Link href="/learn/ai-automation-agency-cost" className={link}>
          how much an AI automation agency costs
        </Link>
        .
      </p>

      <h2 className={h2}>The three layers every quote should separate</h2>
      <p>
        A trustworthy automation quote has three visibly separate layers. When
        a proposal blends them into one number, you cannot tell what you are
        paying for, and that is usually the point.
      </p>
      <p>
        <strong>Layer 1: the foundation.</strong> Cleanup of the data and
        process the automation will stand on. Deduplication, field
        consolidation, stage definitions, a documented process. Market guides
        mostly ignore this layer, which is exactly why so many automations get
        quietly abandoned: they were built on records nobody trusted. Fair
        prices run $1,500 to $3,000 per system as fixed-scope items.
      </p>
      <p>
        <strong>Layer 2: the build.</strong> The named automation itself.
        Simple single-workflow builds are quoted at $1,500 to $4,000 across the
        market, with multi-step and mid-tier integration work above that (
        <a
          href={DAN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          Digital Agency Network, AI agency pricing guide, January 2026
        </a>
        ). The honest structure is one named system, one fixed price, and an
        explicit uplift when the automation must touch a second system of
        record, because cross-system work is real integration effort.
      </p>
      <p>
        <strong>Layer 3: keeping it alive.</strong> Every automation carries a
        running cost after launch, because the tools underneath it change on
        their own schedule and nobody tells you when. Per-system monitoring and
        upkeep runs $300 to $800 a month at market rates. A quote with no
        maintenance line is a quote for a system with a planned lifespan nobody
        mentioned.
      </p>

      {/* The draft note's comparison graphic: the three layers side by side.
          Layer 1 is picked out because it is the layer market guides mostly
          ignore, which is the page's argument. Cells condense the three
          paragraphs above. */}
      <ComparisonTable
        label="Side by side"
        title="The three layers a trustworthy quote keeps separate"
        options={[
          "Layer 1: the foundation",
          "Layer 2: the build",
          "Layer 3: keeping it alive",
        ]}
        highlight={0}
        rows={[
          {
            label: "What it is",
            cells: [
              "Cleanup of the data and process the automation will stand on: deduplication, field consolidation, stage definitions, a documented process",
              "The named automation itself, one system at a time",
              "Monitoring and upkeep after launch, because the tools underneath change on their own schedule",
            ],
          },
          {
            label: "Fair 2026 price",
            cells: [
              "$1,500 to $3,000 per system as fixed-scope items",
              "$1,500 to $4,000 for simple single-workflow builds, with multi-step and integration work above that",
              "$300 to $800 a month per system",
            ],
          },
          {
            label: "When a quote leaves it out",
            cells: [
              "The automation gets built on records nobody trusted, and is quietly abandoned",
              "You cannot tell what you are paying for, and that is usually the point",
              "A planned lifespan nobody mentioned",
            ],
          },
        ]}
      />

      <h2 className={h2}>What the common items cost</h2>
      <p>
        Market bands, at small and mid-sized B2B scope, read off the published
        agency rate cards and marketplace listings in the two guides cited
        below. These are what the market charges, not what we have measured a
        result to be worth. Where a range is wide, the drivers are how many
        systems the automation touches and the state of the data underneath
        it.
      </p>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>Lead capture and routing:</strong> $2,000 to $5,000. Higher
          when routing rules span multiple tools or territories.
        </li>
        <li>
          <strong>Follow-up and nurture sequences:</strong> $2,000 to $5,000
          for a system your team owns, not a template installed into your
          account. Template installs are why $75 to $520 project listings exist
          on marketplaces (
          <a
            href={FIVERR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            Fiverr, AI automation cost guide, August 2026
          </a>
          ); they come with no integration work, no data cleanup, and no
          adoption help.
        </li>
        <li>
          <strong>CRM cleanup and field consolidation:</strong> $1,500 to
          $3,000 as a fixed foundation item. Beware of it hidden inside a build
          quote as unpriced &ldquo;prep.&rdquo;
        </li>
        <li>
          <strong>Reporting and pipeline visibility:</strong> $2,500 to $6,500
          depending on how many sources feed it.
        </li>
        <li>
          <strong>Quote, proposal, and document automation:</strong> $2,500 to
          $6,500.
        </li>
        <li>
          <strong>Custom agent work:</strong> $7,500 to $25,000 and up across
          the market. Most businesses buying at this tier actually needed two
          or three of the items above first. Be suspicious of a custom-AI price
          attached to an assembled-workflow scope.
        </li>
      </ul>

      {/* The draft note's stat pair: the simple-build market band and the
          per-system maintenance band, both from the layers section above. */}
      <StatCards
        label="The benchmarks"
        title="The two numbers every automation quote should carry"
        stats={[
          {
            big: "$1,500 to $4,000",
            desc: "is what simple single-workflow builds are quoted at across the market, with multi-step and mid-tier integration work above that.",
            source: "Digital Agency Network, January 2026",
          },
          {
            big: "$300 to $800",
            desc: "a month per system for monitoring and upkeep at market rates. A quote with no maintenance line is a quote for a system with a planned lifespan nobody mentioned.",
            source: "2026 market rates, this guide",
          },
        ]}
      />

      <h2 className={h2}>Our prices, published</h2>
      <p>
        Everything above is market evidence. Here is what we charge, so you
        have at least one full rate card to compare any quote against:
      </p>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>{rung.scan.name}:</strong> free, self-serve, about five
          minutes.
        </li>
        <li>
          <strong>
            {rung.audit.name}: {rung.audit.price}.
          </strong>{" "}
          Reads your actual systems and returns a prioritized automation map
          with a fixed price on every recommended item.{" "}
          {AUDIT_TERMS.creditPercent} credits toward {AUDIT_TERMS.creditTarget}{" "}
          within {AUDIT_TERMS.creditWindow}.
        </li>
        <li>
          <strong>
            Cleanup Services: {CLEANUP_PRICE_FLOOR} to {CLEANUP_PRICE_CEILING}{" "}
            fixed per named item.
          </strong>{" "}
          The foundation layer, priced in the open instead of hidden in a build
          quote.
        </li>
        <li>
          <strong>
            {rung.builds.name}: {rung.builds.price} per named system
          </strong>
          , with the added-system uplift stated explicitly rather than
          discovered in the invoice.
        </li>
        <li>
          <strong>
            {CARE_PLAN.name}: {CARE_PLAN.price}
          </strong>{" "}
          for monitoring and upkeep.
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
        The reason the audit comes first is the same reason layer 1 exists:
        pricing an automation without reading the data it will stand on is
        guessing, and both directions of the guess cost you. If you want fixed
        prices on your actual systems instead of market bands, that is a
        30-minute conversation:{" "}
        <Link href="/book" className={link}>
          book a call
        </Link>
        .
      </p>
    </>
  );
}
