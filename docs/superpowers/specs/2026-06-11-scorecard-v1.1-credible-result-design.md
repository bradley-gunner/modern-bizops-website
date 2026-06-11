# Scorecard v1.1: Credible Math + Paid-Feeling Result. Design Spec

**Date:** 2026-06-11
**Status:** Draft for sign-off
**Predecessor docs:** `2026-06-10-maturity-scorecard-lead-magnet-design.md` (v1.0 spec), `2026-06-10-scorecard-iteration-audit.md` (the audit this spec implements)
**Decisions source:** Bradley's calls on the audit's five open questions, 2026-06-11: GRR benchmarks (a), caps at 50/75, email send deferred to next sprint but PDF render verified now, gate test parked, heat map Option A.

## Summary

v1.0 shipped with a mathematically broken moat: the retention comparison is a GRR-vs-NRR category error that fails every B2B SaaS respondent, the sales-cycle bands cannot resolve short-cycle business models (producing 9x-revenue loss claims), and nothing caps any claim at plausibility. v1.1 fixes the math, then upgrades the result page from "one number and a stage label" to a paid-feeling deliverable: a 9-competency heat map (the data v1.0 already collects and discards), an always-on peer-comparison table, real source citations, a next-stage preview, per-gap fix paragraphs, and a personalized CTA. The PDF gate promise is softened until the email sprint ships the send.

## Settled decisions

1. **Retention compares GRR to GRR.** A `grr` metric row is added per business model (curated with named sources; research in flight, Bradley verifies before merge). The retention generator reads `benchmark.metrics.grr`. The `nrr` rows stay in the file untouched (vendored parity with the canonical) but are no longer consumed by the scorecard. The `grr` rows are site-local additions; the file header documents that syncs from the canonical must preserve them.
2. **Sales-cycle resolution guard.** The salesCycle generator returns null when the model's `salesCycleDays.median` is below the lowest resolvable band midpoint (20 days). Kills the line for ECOMMERCE (median 2) and B2C_SUBSCRIPTION (median 3). Model-aware bands are a later iteration.
3. **Sanity caps: 50% per line, 75% aggregate.** Each line's `medianDollars` is capped at 50% of the respondent's revenue midpoint; `floorDollars` is capped at the (possibly capped) median. If the sum of medians still exceeds 75% of revenue, all lines scale proportionally so the sum equals 75%. Caps apply before copy generation so the existing `lossRangePhrase` logic needs no change. The headline-equals-sum-of-lines invariant is preserved.
4. **Stale conditional answers are pruned centrally.** `buildResult` filters the answer map through `getQuestionsFor(answers)` before computing anything, so a hidden question's stale answer can never fire a generator. The QuizFlow also prunes on change of q2 so the UI state stays clean.
5. **No-gap path is reframed, not apologized for.** New headline lead when no dollar line fires: "Your numbers hold up against {model_label} peers. The gap I can see is operational, not financial." Binding translation gets a no-gaps variant that does not reference "the dollar gaps above."
6. **PDF promise softened.** The email gate stops promising an emailed PDF until the send pipeline ships (next sprint). The PDF render itself stays, gains the new sections, and gets a render-to-disk spot check so it is verified working for the email sprint to consume.
7. **Heat map is Option A:** one row per competency, 1-4 dot scale, grouped under three client-facing block names. Proposed names (Bradley may rename at sign-off): Block A "Foundations", Block B "Operating discipline", Block C "Compound growth". Scale labels: Absent, Informal, Functional, Managed.
8. **Bright spots mean it.** Only answers scoring 3+ (Functional or Managed) qualify, and any competency already named in the binding boundary is excluded. Section hides when nothing qualifies.
9. **Citations are real sources.** Dollar and comparison lines cite `metric.source` and `asOf` (e.g., "Source: SaaS Capital 2025 Revenue per Employee Benchmarks (private SaaS, n=1000+)"), not the internal filename.
10. **Deferred, unchanged from audit:** email pipeline (next sprint), partial-gate test (parked, liked), score-routed CTAs, Q16 lead-response question, model-aware Q14 bands.

## Architecture

### Component 1: benchmark file gains `grr` rows. `lib/scorecard/businessModelBenchmarks.js`

Each of the 8 model rows gains a `grr` metric (`direction: 'higher'`, `unit: 'ratio'`, median and range all <= 1.00, named `source`, `asOf`, `confidence`). Header comment gains a "site-local rows" section explaining `grr` is not in the canonical file and must survive syncs.

Curated values (research pass, 2026-06-11; Bradley verifies before merge since these appear on client-facing dollar lines):

| businessModel | median | range | confidence | primary sources |
|---|---|---|---|---|
| B2B_SAAS | 0.90 | [0.82, 0.95] | cited | SaaS Capital 2026 (n=1000+, median 91); Benchmarkit 2025 (88); KeyBanc/Sapphire (~90) |
| PROFESSIONAL_SERVICES | 0.82 | [0.75, 0.90] | cited | SPI Research 2025 (84 pct client retention); Focus Digital agency benchmarks (75 to 85 pct), client retention as GRR proxy |
| B2B_PRODUCT | 0.78 | [0.68, 0.86] | estimated | CustomerGauge B2B retention (manufacturing 78 pct), anchored below PS |
| ECOMMERCE | 0.55 | [0.40, 0.70] | estimated | Anchored below B2C subscription; Propel DTC data directionally consistent |
| B2C_SERVICES | 0.72 | [0.62, 0.80] | estimated | HFA 2025 fitness retention (66 pct); IHRSA boutique rates (75 to 80 pct) |
| B2C_SUBSCRIPTION | 0.61 | [0.50, 0.72] | cited | Recurly 2024 (4 pct monthly churn annualized); ProfitWell B2C corroborates |
| MARKETPLACE | 0.75 | [0.62, 0.85] | estimated | Anchored between SaaS and ecommerce; no survey-grade marketplace GRR exists |
| OTHER | 0.78 | [0.65, 0.88] | estimated | Cross-model midpoint |

Pre-merge verification checklist for Bradley (gated sources the research could not fully open):
1. SaaS Capital 2026 research brief PDF: confirm the sub-$10M ARR GRR segmentation behind the 91 figure.
2. SPI 2025 Maturity Benchmark: spot-check the 84 pct retention stat against the actual report.
3. Recurly State of Subscriptions: confirm the 4 pct monthly churn median read.

Known characteristic, accepted: for B2C_SUBSCRIPTION the worst churn band (over 30 pct, proxy 0.60) sits at the peer median (0.61), so the retention dollar line will rarely fire for that model; the always-on comparison row still shows the peer context. This is honest (high churn is normal for consumer subs), not a defect.

Cross-repo finding (out of scope here, flagged separately): the research indicates the canonical file's existing B2C_SUBSCRIPTION NRR of 0.88 is inconsistent with Recurly's annualized data (0.61 GRR + 0.88 NRR implies 27 points of consumer expansion, which does not happen). The canonical RevOps Coaching App benchmark file should re-verify that row; ECOMMERCE and B2C_SERVICES NRR rows show milder versions of the same tension.

### Component 2: ROI engine fixes. `lib/scorecard/roi.js`

- **Retention generator** renames internally from NRR semantics to GRR: client value is `1 - churnMidpoint` (unchanged), compared against `metrics.grr`. Display copy says "gross revenue retention" where it names the metric. Key stays `'nrr'`? No: key renames to `'retention'` across COMPARISON_COPY, ROI_TITLES, and consumers, since the key leaks into comparison copy lookups and tests. Title stays "Retention gap".
- **Cycle guard:** `if (metric.median < MIN_RESOLVABLE_CYCLE_DAYS) return null;` with `MIN_RESOLVABLE_CYCLE_DAYS = 20` exported for tests.
- **Caps:** new `applyCaps(lines, revenue)` step inside `generateRoiLines` after ranking: per-line median capped at `0.5 * revenue`, floor capped at the capped median, then proportional scale-down if `sum(medians) > 0.75 * revenue`. Rounding after scaling. Pure, unit-testable.
- **Comparison rows for the always-on table:** each generator splits into a `compare` step (returns the comparison row whenever inputs are present and resolvable, including meets) and the existing dollar overlay (null unless a positive gap). New export `generateComparisons(answers, benchmark)` returns up to 3 rows of `{ key, label, clientDisplay, peerMedianDisplay, peerRangeDisplay, comparison, comparisonCopy, source }`. The client display for banded inputs uses the band label the user actually chose ("30 to 90 days"), not the midpoint, so the table never claims false precision about their input.

### Component 3: result payload additions. `lib/scorecard/resultRender.js`

`buildResult` gains, in order:
1. **Answer pruning** through `getQuestionsFor` (decision 4).
2. **`competencyScores`:** array of 9 `{ id, competencyLabel, score, block }` for the heat map, block being 'A' | 'B' | 'C'.
3. **`comparisons`:** output of `generateComparisons`.
4. **`nextStage`:** for placements 1-3, `{ name, criteria: string[] }` with 2-3 second-person crossing criteria pulled from the framework's stage-entry language (static in voice.js). Null at Stage 4.
5. **Per-gap fixes:** each surfaced ROI line gains `fix` (2-3 sentences, Bradley voice, static per generator key in voice.js).
6. **CTA personalization:** `cta.focus` = the binding boundary's lowest competency label; CTA copy template: "Book 30 minutes. I will have read your results before the call. We will walk through your {focus} gap and what the first 90 days of fixing it looks like." Falls back to generic line when binding is null.
7. **Headline and binding no-gap variants** (decision 5).

### Component 4: heat map. `components/scorecard/CompetencyHeatMap.jsx` + PDF mirror

Renders `competencyScores`: three block groups with the client-facing block names, each row showing the competency label and a 4-dot scale (filled to score, color stepping from copper at 1 to green at 4) plus the level word. One-line block takeaway under each group is NOT in scope (keep it scannable). The PDF document gains the same data as simple text rows ("CRM architecture: 2 of 4, Informal"). Placement on both surfaces: directly after "Why this is happening", before bright spots.

### Component 5: result page reorder. `components/scorecard/ResultView.jsx`

New section order:
1. The number (headline, including no-gap variant)
2. How you stack up (always-on comparison table, NEW)
3. How I got there (dollar lines, only when any fire; each line now ends with its `fix` paragraph)
4. Why this is happening (placement + binding) with **next-stage preview** appended
5. Your competency map (heat map, NEW)
6. What you are doing right (fixed bright-spot semantics; hides when empty)
7. Disclosure (unchanged)
8. CTA (personalized focus line)

### Component 6: persistence. `components/scorecard/QuizFlow.jsx`

Answers and result snapshot to `sessionStorage` on change; restore on mount; "Start over" link clears. A refresh mid-quiz resumes at the same question; a refresh after submit re-renders the result without resubmitting (no duplicate CRM writes; the route is idempotent anyway).

### Component 7: copy batch

- **Landing:** headline shortened to "Find the dollar amount your operating system is leaving on the table this year." Sub-headline drops the B2B restriction: "Built for founders who feel like every dollar of revenue growth requires another hire." Add the time expectation under the CTA: "Fifteen questions. About five minutes." Landing visual (result-page screenshot) is the final task of the sprint, captured from the shipped heat map.
- **Email gate:** heading "One last step before your results." Body: "Tell me who you are and your full scorecard is on screen the moment you submit." Trust footer: "I will follow up with one personal note. No newsletter, no drip sequence. You can ask for your data to be deleted at any time."
- **Section 1 subline:** "Three questions so I know who I am comparing you to."
- **Prefaces:** Q5 becomes a clarifier: "This one is about whether qualification lives in people or in a system." Q8 drops stage vocabulary: "I am listening for whether your numbers are trusted enough to argue from." Q9 prepends "This is". Q12 drops stage vocabulary: "This is the difference between reacting to results and acting on signals." (All four reviewed at sign-off.)
- **Back link:** `disabled:opacity-30` to `disabled:opacity-60`.
- **Q2 descriptions:** QuestionCard renders `option.description` under the label when present.

## Testing (TDD per task)

- `businessModelBenchmarks.test.js` extends: every model has a `grr` row, all grr medians and range values <= 1.00, shape parity with other metrics.
- `roi.test.js` extends: SaaS best-churn answer now classifies meets against grr (the v1.0 probe case inverted); ECOMMERCE and B2C_SUBSCRIPTION cycle generator returns null; cap cases (single line exceeding 50%, aggregate exceeding 75%, proportional scaling preserves ordering and sum invariant); comparison rows include meets cases and use band labels for client display.
- `resultRender.test.js` extends: stale q15 with B2B_PRODUCT never fires retention; `competencyScores` has 9 entries with correct blocks; `comparisons` present; `nextStage` null at stage 4 and populated otherwise; bright spots exclude binding picks and sub-3 scores; no-gap headline and binding variants; headline sum invariant under caps.
- `CompetencyHeatMap.test.jsx` new: 9 rows, 3 groups, dot fill matches score, level words correct.
- `ResultView.test.jsx` extends: new section order, comparison table renders on no-gap path, fix paragraphs render under dollar lines, CTA focus line.
- `QuizFlow.test.jsx` extends: q2 change prunes q15 answer; sessionStorage restore path.
- `pdf.test.js` extends: buffer still valid; a render-to-disk spot-check script (`scripts/render-sample-pdf.mjs`) added for manual eyeballing, run once during the sprint and its output attached to the PR.
- Copy tests updated for every changed string; `npm run lint:scorecard` stays green; full suite green.

## What is NOT in this sprint

- Email send pipeline (next sprint; the PDF render and a verified sample are this sprint's handoff to it).
- Partial-gate test (parked, liked).
- Score-routed CTAs, Q16 lead-response question, model-aware Q14 bands, shareable result URL, OG image refresh, HubSpot stage-property enrichment (candidate for the email sprint, noted).

## File touch list

```
lib/scorecard/businessModelBenchmarks.js      # add grr rows + header note (values pending research + Bradley verification)
lib/scorecard/roi.js                          # retention->grr, cycle guard, caps, comparisons split
lib/scorecard/resultRender.js                 # pruning, competencyScores, comparisons, nextStage, fixes, cta.focus, no-gap variants
lib/scorecard/voice.js                        # new statics: block names, level words, next-stage criteria, fix paragraphs, no-gap copy, CTA focus template, updated sublines/prefaces consumed from questions.js
lib/scorecard/questions.js                    # preface rewrites, subline text lives in voice.js (unchanged here except prefaces)
lib/scorecard/pdfDocument.jsx                 # heat map rows, comparisons, fixes, citation lines
components/scorecard/CompetencyHeatMap.jsx    # NEW
components/scorecard/ComparisonTable.jsx      # NEW (always-on stack-up table)
components/scorecard/ResultView.jsx           # reorder + new sections
components/scorecard/StagePlacementCard.jsx   # next-stage preview
components/scorecard/RoiLine.jsx              # fix paragraph + real citation
components/scorecard/CtaCard.jsx              # focus line
components/scorecard/QuizFlow.jsx             # pruning + persistence
components/scorecard/EmailGateForm.jsx        # softened copy
components/scorecard/ScorecardExperience.jsx  # landing copy + time expectation (+ screenshot visual, final task)
components/scorecard/QuestionCard.jsx         # render option descriptions
scripts/render-sample-pdf.mjs                 # NEW spot-check
__tests__/scorecard/*                         # extensions throughout per Testing section
```

## Decisions locked

- GRR rows are site-local; canonical sync procedure updated to preserve them; Bradley personally verifies every grr number before merge.
- Caps: 50% per line, 75% aggregate, proportional scale-down, applied before copy generation, headline invariant preserved.
- Retention generator key renames `nrr` to `retention` (internal); client copy says "gross revenue retention".
- Comparison table uses the respondent's chosen band label, never the midpoint, for their own number.
- Bright spots: score >= 3 and not in binding picks.
- Block display names: Foundations / Operating discipline / Compound growth (pending Bradley's veto at sign-off).
- Email-gate copy drops the PDF promise verbatim until the send ships.
