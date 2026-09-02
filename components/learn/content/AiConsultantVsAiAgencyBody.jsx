import Link from "next/link";
import { LADDER } from "@/lib/offers";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";
const link = "text-navy underline";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

// Verbatim transcription of the approved AEO batch 2 asset 7 source copy
// (Marketing Systems/SEO Pilot/pending-approval/aeo-7-ai-consultant-vs-ai-
// agency.md, APPROVED-BY-BRADLEY 2026-09-01, published 2026-09-01). The
// comparison-set completion beside ai-consultant-vs-in-house, and the
// internal-link glue between the consultant cluster and the agency cluster.
// It carries ZERO outbound links by decision (Bradley, 2026-09-01, handoff
// open question 3): every number restates the two cost guides it links to in
// the first screen, so a source added for symmetry would be decorative. Do
// not add one. Ladder names and prices interpolate from lib/offers.js.
export default function AiConsultantVsAiAgencyBody() {
  return (
    <>
      <p>
        The short answer: hire an independent AI consultant when you need
        advice, scoping, or one narrow workflow built by a single senior brain.
        Hire an agency when you need several systems built and maintained on a
        cadence. And know that for most B2B companies between $1M and $50M,
        the honest answer is neither of those as usually sold, because both
        default to a model where the expertise stays outside your business.
      </p>
      <p>Here is how to make the call properly.</p>

      <h2 className={h2}>What each one is, and what each costs</h2>
      <p>
        <strong>The independent consultant.</strong> One person, usually
        senior, selling judgment. Typical 2026 rates run $150 to $350 an hour,
        with project work commonly quoted at $5,000 to $25,000. Full numbers
        and how to read a consultant quote:{" "}
        <Link href="/learn/ai-consultant-cost" className={link}>
          how much an AI consultant costs
        </Link>
        .
      </p>
      <p>
        <strong>The AI automation agency.</strong> A team selling delivery
        capacity. Fixed projects roughly $2,000 to $25,000 per system,
        retainers clustering between $2,000 and $8,000 a month. Full numbers
        and the questions that expose a padded proposal:{" "}
        <Link href="/learn/ai-automation-agency-cost" className={link}>
          how much an AI automation agency costs
        </Link>
        .
      </p>
      <p>
        The price bands overlap almost completely, which is the first honest
        finding of this comparison: the choice is not really about price. It
        is about failure modes.
      </p>

      <h2 className={h2}>Where each one fails</h2>
      <p>
        <strong>The consultant&rsquo;s failure mode is capacity.</strong> One
        person scopes carefully and builds well, then becomes the bottleneck:
        one calendar, one set of hands, and when they move on, the knowledge
        moves with them unless documentation was in the scope. Ask a
        consultant what happens to delivery when they get a bigger client.
      </p>
      <p>
        <strong>
          The agency&rsquo;s failure mode is the demo that never becomes a
          system.
        </strong>{" "}
        The pattern, from buyer accounts across this market: an ambitious
        project, an impressive demo, a rollout the team routes around, a quiet
        cancellation some months later. The cause is usually not the build
        quality. It is that nobody on your side owned the thing, and the
        foundation under it, the data and the process, was never made ready.
      </p>
      <p>
        Both failure modes share a root: the working knowledge of your systems
        lives outside your business, and you rent it back monthly.
      </p>

      <h2 className={h2}>The four-question decision test</h2>
      <ol className="list-decimal pl-6 space-y-3">
        <li>
          <strong>Is the work defined yet?</strong> If you cannot name the
          systems you want built, you need diagnosis first, not delivery. That
          is a paid assessment, from anyone, before it is a build contract with
          anyone.
        </li>
        <li>
          <strong>How many systems, how soon?</strong> One narrow workflow
          favors a consultant. Three to five systems on a deadline favor
          delivery capacity.
        </li>
        <li>
          <strong>Who on your team will own what gets built?</strong> If the
          answer is nobody, stop comparing vendors. No internal owner is the
          strongest predictor of abandonment, whoever builds it.
        </li>
        <li>
          <strong>What happens in month four when it breaks?</strong> A
          consultant should name a maintenance arrangement. An agency should
          name a number. Silence from either is the real quote.
        </li>
      </ol>

      <h2 className={h2}>The option most comparisons leave out</h2>
      <p>
        The consultant-vs-agency frame assumes the expertise has to stay
        outside your business. There is a third structure: outside help builds
        the named systems at fixed prices, and the engagement is explicitly
        designed to end, with runbooks, training, and your team owning every
        system when it does.
      </p>
      <p>
        That is how we sell it, and the prices are published: an{" "}
        {rung.audit.name} at {rung.audit.price} that maps the work before
        anyone builds, {rung.builds.name} at {rung.builds.price} per named
        system, and an {rung.partner.name} arrangement at {rung.partner.price}{" "}
        for the businesses that want ongoing capacity with ownership still
        inside. The comparison for the build-vs-hire fork is here:{" "}
        <Link href="/learn/ai-consultant-vs-in-house" className={link}>
          AI consultant vs. going in-house
        </Link>
        .
      </p>
      <p>
        If you are holding quotes from a consultant and an agency and want a
        straight read on which fits, that is a 30-minute call:{" "}
        <Link href="/book" className={link}>
          book a call
        </Link>
        .
      </p>
    </>
  );
}
