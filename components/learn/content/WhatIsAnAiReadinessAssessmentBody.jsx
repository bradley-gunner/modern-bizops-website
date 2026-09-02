import Link from "next/link";
import { LADDER, AUDIT_TERMS } from "@/lib/offers";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";
const link = "text-navy underline";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

// Primary sources the draft cites with [link: ...] markers. Both resolved and
// fetched live on 2026-09-01 at publish time.
const CISCO_URL = "https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/archive/2024-m11.html";
const MICROSOFT_URL = "https://learn.microsoft.com/en-us/assessments/94f1c697-9ba7-4d47-ad83-7c6bd94b1505/";

// Verbatim transcription of the approved AEO batch 2 asset 5 source copy
// (Marketing Systems/SEO Pilot/pending-approval/aeo-5-what-is-an-ai-readiness-
// assessment.md, APPROVED-BY-BRADLEY 2026-09-01, published 2026-09-01). The
// informational spoke for the /ai-readiness-assessment money page: it takes
// "what is it, what does it cost" and links down to the money page and the
// free Scan. Audit name, price and terms interpolate from lib/offers.js so a
// number here can never disagree with the pricing page; the guarantee sentence
// is AUDIT_TERMS.guarantee verbatim rather than the draft's paraphrase of the
// same term (aeo-1 precedent, flagged in the deploy receipt). "ai readiness
// audit" is served by body copy only and never by title, slug or H1, per doc
// 08's "ai audit" ban.
export default function WhatIsAnAiReadinessAssessmentBody() {
  return (
    <>
      <p>
        An AI readiness assessment measures whether your business can actually
        get value from AI before you spend money on it. A real one examines your
        data quality, your systems and how they connect, your processes, and
        whether anyone on your team can own what gets built. It ends with a
        scored gap list and a prioritized plan. Market prices run from free
        self-serve questionnaires to $5,000 and beyond for a consultant-led
        engagement.
      </p>
      <p>
        That is the definition. The more useful thing this page can do is tell
        you what separates an assessment worth paying for from a lead-capture
        form wearing a lab coat.
      </p>

      <h2 className={h2}>Why this exists at all</h2>
      <p>
        Most AI implementations do not fail on the AI. They fail on the
        foundation underneath it: duplicate CRM records, four fields describing
        the same thing, stages nobody agreed on, process that lives in one
        person&rsquo;s head. That debt was tolerable for years because it only
        cost inconvenience. AI repriced it. Dirty data and duct-tape process now
        decide whether automation works at all, which is why the assessment
        became a product category in the first place.
      </p>
      <p>
        Cisco&rsquo;s own research puts a number on the gap: in its 2024 AI
        Readiness Index, only 13% of organizations surveyed qualified as fully
        ready to deploy AI (
        <a
          href={CISCO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          Cisco AI Readiness Index
        </a>
        ). The instinct to measure before building is correct. The question is
        what actually gets measured.
      </p>

      <h2 className={h2}>What a real assessment measures</h2>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>Data quality.</strong> Not &ldquo;do you have data&rdquo; but
          whether the fields your automations would depend on are filled in,
          deduplicated, and mean the same thing to everyone.
        </li>
        <li>
          <strong>Systems and connections.</strong> Which tools hold your
          customer, revenue, and operations records, and whether they talk to
          each other or to anything.
        </li>
        <li>
          <strong>Process.</strong> Whether the workflow you want to automate is
          defined well enough to be automated. An undefined process automated is
          chaos at higher speed.
        </li>
        <li>
          <strong>Ownership.</strong> Whether someone on your team can run,
          adjust, and trust what gets built. No owner is the single strongest
          predictor that an automation gets abandoned.
        </li>
        <li>
          <strong>Current AI use.</strong> Whether the AI your team already uses
          daily is built into anything. Daily use with no system behind it is
          not readiness; nothing encodes what was learned, and nothing
          identifies what should be automated next.
        </li>
      </ul>
      <p>
        Enterprise frameworks add pillars for governance, security, and
        infrastructure (
        <a
          href={MICROSOFT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          Microsoft Learn AI Readiness Assessment
        </a>
        ). Those matter at enterprise scale. For a $1M to $50M B2B company, the
        five above decide the outcome.
      </p>

      <h2 className={h2}>The questionnaire problem</h2>
      <p>
        Most assessments on the market are questionnaires. You self-report how
        good your data is, and the score reflects how you feel about your
        operations, not the state of them. Self-reported data quality is exactly
        the thing operations debt hides from. The owner who tolerates the messy
        CRM has usually stopped seeing it.
      </p>
      <p>
        The harder and rarer version connects to your actual systems, reads the
        real records, and computes the answer: how many contacts are missing the
        fields your automations would key on, which stages are actually used,
        where the handoffs silently drop. A computed assessment can disagree
        with you. A questionnaire cannot, and that difference is roughly what
        you are paying for.
      </p>
      <p>
        If you want the five-minute self-serve version first, that is exactly
        what our free scan is for:{" "}
        <Link href="/scorecard" className={link}>
          take the free {rung.scan.name}
        </Link>
        . It will not read your systems, and it says so; it will tell you where
        to look.
      </p>

      <h2 className={h2}>What one costs in 2026</h2>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <strong>Free:</strong> self-serve questionnaires and scans, including
          vendor tools and ours. Useful for orientation, not diagnosis.
        </li>
        <li>
          <strong>$1,000 to $5,000:</strong> the common band for a
          consultant-led assessment or paid diagnostic, often credited toward
          later work. This is the band where you should expect
          connected-systems analysis, not an interview writeup.
        </li>
        <li>
          <strong>$10,000 and up:</strong> enterprise engagements with
          governance, security, and infrastructure scope. Priced for companies
          with those problems.
        </li>
      </ul>
      <p>
        Our version sits in the middle band and is published: the{" "}
        {rung.audit.name} is {rung.audit.price}, connects to your actual stack,
        computes a maturity heat map from the real records, and hands you a
        prioritized automation map with fixed prices attached.{" "}
        {AUDIT_TERMS.creditPercent} of the fee credits toward{" "}
        {AUDIT_TERMS.creditTarget} within {AUDIT_TERMS.creditWindow}.{" "}
        {AUDIT_TERMS.guarantee}
      </p>

      <h2 className={h2}>What a good one hands you at the end</h2>
      <p>
        Whoever you buy from, the deliverable should include a scored gap list
        tied to specific systems and fields, a prioritized order of operations
        with the foundation work first, a price for each recommended fix, and
        an explicit statement of what NOT to build yet. An assessment that
        recommends everything is a sales document. The honest ones tell you
        where the money would be wasted.
      </p>
    </>
  );
}
