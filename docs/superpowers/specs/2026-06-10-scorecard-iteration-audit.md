# Maturity Scorecard: Strategic Audit and Iteration Plan

**Date:** 2026-06-10 (evening, post-launch live test)
**Status:** Audit complete; awaiting Bradley's calls on the P0 decisions
**Inputs:** Live production walkthrough with Bradley; verified math probes against the shipped ROI engine; two web-research passes (assessment lead-magnet best practices; RevOps ICP value triggers). Research citations inline.

---

## 1. What this asset is actually for

**For Modern BizOps.** The scorecard is not a list-builder. It is a free sample of the paid assessment's methodology: 9 of the 44 competencies, peer-anchored dollar math, and one prioritized fix delivered in Bradley's judgment-heavy voice. The conversion logic is demonstration, not claim: the prospect experiences a miniature version of the paid deliverable, extrapolates to what the full 44-competency version must be worth, and books the call. Secondary jobs: build the benchmark-anchored authority position, capture attribution, seed the CRM.

**For the prospect.** Three distinct values, in descending order of what the research says gets repeated to co-founders:

1. **Comparison:** "Am I normal vs peers like me?" Reliable benchmarks are scarce for private $1-15M companies; no board pack, no analyst coverage. This is why revenue-per-employee and NRR benchmark reports are flagship content for SaaS Capital, High Alpha, Pavilion, and Capnamic.
2. **Prioritization:** "What one thing first?" Single-fix prescription is what reads as senior judgment. Competitors output unranked recommendation lists.
3. **Placement:** "Where am I on the ladder?" The stage label is the frame, not the payload.

**The moat, confirmed by competitive research.** Nearly every competing RevOps assessment (RevPartners, Prometheus, Six and Flow, agency HubSpot graders) outputs a maturity level plus generic recommendations. None outputs dollar gaps keyed to the respondent's business model. The only product found that does leakage-style dollar analysis is Winning by Design's GTM Diagnostic, priced at $65,000-95,000. The dollar math IS the differentiator.

Which is why the next section matters most.

## 2. The hard finding: the moat is mathematically broken

Verified with probes against the shipped engine (numbers from live code, not estimates):

| # | Bug | Severity | Evidence |
|---|---|---|---|
| A | **GRR-vs-NRR category error.** Quiz asks gross churn, computes retention proxy as 1 - churn (max 97.5%), but compares against NRR benchmarks which include expansion. B2B SaaS NRR range floor is 100%, so every SaaS respondent fails regardless of answer. | P0 | $5M SaaS with best-in-class sub-5% churn is told "You are losing between $125K and $625K of revenue every year." A typical healthy SaaS (5-15% churn) is told it loses $1M/yr, 20% of revenue. |
| B | **Q14 bands cannot resolve short-cycle models.** Lowest band "under 30 days" (midpoint 20) exceeds e-commerce peer high (14d, median 2d) and B2C subscription (median 3d). Best possible answer always fails, and the throughput math explodes. | P0 | $5M e-commerce respondent told they are leaving **$45M** (9.0x revenue) on the table. B2C subscription: 5.7x. |
| C | **No sanity cap on loss claims.** Revenue-per-employee gap is computed as (median - client) x headcount with no relation to actual revenue. | P0 | 90-person, $750K-revenue company told it is leaving **$11M** uncaptured (14.6x revenue) "without needing to hire a single new person." |
| D | **Stale conditional answer leaks.** Answer churn (q15), click Back, switch business model to one where churn is hidden; the stale answer stays in state, is submitted, and fires a phantom retention line. | P0 | Verified: B2B_PRODUCT + stale q15 fires a $1.5M claim for a model where churn was deemed not applicable. |
| E | **Bright-spot semantics.** brightSpots picks answers scoring above the placement stage number. At Stage 1, a score-2 (Informal) answer qualifies as "What you are doing right." Calling Informal a strength is wrong; it also collides with the binding-boundary picks (same competency can appear in both sections). | P1 | Observed in Bradley's live test: CRM architecture and lead qualification appeared as BOTH the bottleneck and the bright spots. |
| F | **No-gap coherence break.** When no ROI line fires, the binding translation still reads "the bottleneck that shows up in the dollar gaps above" while the headline says there is no gap. | P1 | Observed live. |
| G | **Source citation is an internal filename.** "Source: businessModelBenchmarks v1.1, B2C services row" means nothing to a prospect. The underlying named sources (SaaS Capital, The Bridge Group, Recurly, Focus Digital) are already in the data file per metric and never surfaced. Cited sources lift conversion ~29% (Brixon Group); Bain/BCG lead with "benchmarked against 1,200+ companies." | P1 | Shipped behavior. |
| H | **Result is lost on refresh.** State is in memory only; a refresh forces re-answering 15 questions. Idempotency protects the CRM but not the user's time. | P1 | By design (no result route), now a felt cost. |
| I | **PDF promised, never sent.** The email gate says "I will email you a PDF copy you can share with your team." The render exists; the send pipeline was deferred. Promise currently broken in production. | P0 (copy) or P1 (build) | Confirmed live by Bradley. |

**The root cause of A-C:** the Q1/Q3/Q13/Q14/Q15 band midpoints were designed for the Marcus Chen ICP (B2B services, long cycles) but the benchmark table covers 8 business models, and nothing checks that the bands can resolve against each model's range. Where they cannot, classification always lands in "fails" with unbounded multiples. The honesty disclosure ("no false precision, conservative ranges") is contradicted by the engine's output for at least 3 of 8 models.

### Copy and UX items from the live walkthrough (previously logged)

10. Landing headline too long.
11. Landing sub-headline restricts ICP to "B2B founders."
12. Landing needs a visual (example report screenshot).
13. "Three taps" should be "Three questions."
14. Back link disabled state too dim.
15. Q2 business-model options have description data that is never rendered.
16. Q5 preface is a floating aphorism; Q8/Q12 prefaces leak stage vocabulary the user has not been taught; Q9 preface is a sentence fragment (prepend "This is").

## 3. Where the result page underdelivers its own framework

The Phase B design brief defines the paid deliverable as a **maturity heat map**. The free scorecard collects 9 competency scores and shows approximately none of them: two competencies appear as the bottleneck, up to two as bright spots, and the other five are discarded. The single highest-leverage iteration is to render what was already collected.

Research consensus on what separates "thin" from "paid-feeling" results (Pointerpro, ScoreApp/Priestley, HubSpot Website Grader teardowns):

- Overall score plus 3-6 category sub-scores, ideally as a radar/spider or bar visual, each paired with a one-line plain-language takeaway.
- A fix under every graded element (the Website Grader pattern), not just under the worst one.
- Named peer set and named sources with sample sizes.
- "Seesaw" sequencing: strongest dimension first, weakest second, CTA tied to the weakest.
- Tier-specific everything: copy, testimonial, CTA (personalized CTAs convert 202% better per HubSpot/Vocell).
- What the next stage up looks like, so a low placement reads as a starting line, not a verdict.

The current page has: one number (often $0 or absurd), one stage label with a fairly confronting descriptor, two-competency diagnosis, disclosure, CTA. No visuals, no sub-scores, no next-stage preview, no per-gap fixes.

**On placement psychology:** the weakest-link rule means most honest $1-3M founders land Stage 1 "Reactive." Priestley's scoring guidance is that the ideal client should land at "strong foundations, with plenty of room to improve"; a bottom-rung result risks "they feel they aren't ready to work with you." Do NOT inflate the scoring (framework integrity is the brand). Instead: (a) show the 9 sub-scores so a Stage 1 with three 3s does not read as uniform failure, (b) write the Stage 1 result copy aspirationally with a concrete next-rung preview, (c) let the bright-spots logic only ever surface genuine strengths (score 3+).

## 4. Iteration plan

### P0: fix credibility before driving any traffic

1. **Retention comparison.** Options, in order of preference: (a) reframe the metric as gross revenue retention and curate GRR benchmark rows per model (SaaS GRR median ~90-95% per SaaS Capital; defensible and answerable from a churn question); (b) suppress the dollar calculation when a model's NRR median exceeds 1.0 and show a peer-gap-only line; (c) add an expansion question to compute true NRR. Recommend (a); needs Bradley's benchmark curation sign-off.
2. **Sales-cycle resolution guard.** Suppress the salesCycle generator when the model's peer median falls below the lowest resolvable band midpoint (median < 20d kills it for ECOMMERCE, B2C_SUBSCRIPTION; review B2C_SERVICES low band). Alternative: model-aware Q14 bands. Recommend suppression for v1.1 (one-line guard), model-aware bands later.
3. **Sanity cap.** Cap each line's medianDollars at a defensible fraction of current revenue (proposal: 50% per line, 75% aggregate) and have the copy switch to "a meaningful share of your revenue" framing when the cap binds. Whole-integer rounding already in place is correct per the false-precision research (integers are more believed than decimals).
4. **Stale-answer purge.** When q2 changes, drop any answers for questions no longer in getQuestionsFor(answers); server-side, ignore q15 when the model hides it.
5. **No-gap coherence.** Binding translation variant that does not reference dollar gaps; reframe the no-gap headline to lead with "within peer band; the gap is operational" plus the stage.
6. **PDF promise.** Either ship the email send or soften the gate copy until it ships. Do not leave the broken promise live.

### P1: make the result feel like a paid deliverable

7. **Render the 9-competency mini heat map.** The data is already collected. Bar or dot-scale per competency, grouped by the three boundary blocks, one-line takeaway each. This is the single biggest "pleasantly surprised" lever and it costs no new questions.
8. **Always show the three peer comparisons,** including when the client meets (green badge). "How you stack up" is the value even when no dollar fires; it also fixes the thin no-gap page.
9. **A fix under every gap.** 2-3 sentences per surfaced line: "how you close this." Static per competency-band; no AI needed.
10. **Real source citations** on every benchmark line (surface metric.source; e.g., "SaaS Capital 2025, private SaaS, n=1,000+"). Name the peer set explicitly ("vs B2B services firms in your revenue range").
11. **Next-stage preview** on the placement card: the 2-3 observable behaviors that mark the crossing into the next stage, pulled from the framework's stage-entry criteria.
12. **Seesaw + personalized CTA:** strongest dimension first, weakest second; CTA copy names the weakest dimension and states the call agenda ("Book 30 minutes; I will have read your results; we cover your biggest gap and the first 90 days"). Stated agendas are the documented show-rate lever.
13. **Valuation hook on the retention line** (once the math is fixed): FE International pegs 10 points of NRR at a 20-30% valuation uplift. That line makes founders sit up.
14. **Result persistence:** sessionStorage at minimum; tokened shareable result URL as the follow-up (it also becomes the PDF link and the re-take-in-90-days mechanism).

### P2: funnel mechanics

15. **Email pipeline** (the deferred sprint, now validated as the weakest link by research): day-0 PDF with the prospect's name on the cover plus a same-hour personal-feeling email quoting their exact stage and weakest score (5-minute response is ~21x conversion vs 30 minutes; average B2B response is 42 hours, which is where assessment funnels die). Then a short nurture keyed to their weakest dimension, every email carrying the booking link.
16. **Landing page:** shorter headline; ICP line that does not say "B2B founders"; report-screenshot visual; expected-time line ("takes about 5 minutes"); methodology credibility strip (named sources, sample sizes).
17. **Consider partial-gate test:** show the stage label ungated, gate the dollar figures and PDF. Interact's partial-results pattern; makes the gate an upgrade rather than a toll.
18. **HubSpot enrichment:** write stage, placement name, and headline gap to contact properties (currently only in the task body) so lists and follow-up can segment by maturity.
19. **Copy fixes batch:** items 10-16 in the bug table above.

### Explicitly NOT recommended

- Inflating scores so takers land mid-ladder. Keep the weakest-link rule; fix the presentation instead.
- Question-count expansion. 15 is right for cold traffic (Priestley: 8-15 for cold; completion data supports one-per-screen with progress).
- Score-routed offers (the spec locked single-CTA; revisit only after the email pipeline exists).
- Practitioner vocabulary anywhere client-facing.

## 5. Open decisions for Bradley

1. Retention fix path: GRR benchmark rows (a), suppress-to-peer-gap (b), or expansion question (c)?
2. Sanity-cap thresholds: 50% per line / 75% aggregate, or different?
3. PDF promise: build the send now, or soften the gate copy until the email sprint?
4. Partial-gate test (stage ungated): in or out for v1.1?
5. Heat-map visual style: bar-scale per competency vs radar across the three blocks?
