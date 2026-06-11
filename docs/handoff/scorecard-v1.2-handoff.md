# Scorecard v1.2 Handoff

**Date:** 2026-06-11
**Author:** Bradley + Claude (post-v1.1 live verification)
**Status:** Open scope. Pick what fits the sprint.

This document is the handoff from the [v1.1 sprint](../superpowers/specs/2026-06-11-scorecard-v1.1-credible-result-design.md) (math credibility + paid-feeling result, shipped 2026-06-11) to whoever picks up v1.2. It collects:

1. Every item that was explicitly deferred from v1.0 and v1.1
2. New scope identified during live testing
3. Notes worth carrying forward (decisions, micro-gaps, follow-up artifacts)

The two anchor documents are the [post-launch strategic audit](../superpowers/specs/2026-06-10-scorecard-iteration-audit.md) and the [v1.1 credible-result spec](../superpowers/specs/2026-06-11-scorecard-v1.1-credible-result-design.md). Read both before starting v1.2.

---

## What is live on `main` as of this handoff

- `/scorecard` is the maturity scorecard lead magnet (replacing the old call booking page). 15 questions, B2B/B2C agnostic. Live verified end-to-end on production 2026-06-11.
- `/scorecard/preview` and `/scorecard/preview?variant=no-gap` render the result page with hard-coded samples (noindex). Useful for QA without writing to HubSpot.
- HubSpot integration: contact upsert + deal create at New Lead stage (idempotent via `findExistingRevopsDealForContact`) + follow-up task creation. Verified live.
- PDF render: `lib/scorecard/pdfDocument.jsx` produces a branded multi-page PDF using vendored Cormorant Garamond + Jost TTFs and the brandmark logo. Renderable via `node_modules/.bin/vite-node --config vitest.config.mjs scripts/render-sample-pdf.mjs` -> `out/sample-scorecard.pdf`.
- Math fixes: GRR-based retention generator, short-cycle guard, 50%/75% sanity caps, central stale-answer pruning, real named-source citations (`metricCitation`).

---

## Sprint mandate (priority order)

### 1. HubSpot enrichment (NEW v1.2 scope)

**Why:** Right now no per-submission data is persisted server-side beyond the high-level task body summary ("Stage 1 (Reactive). Model: B2B SaaS. Headline gap: ..."). The 15 raw answers, the 9 competency scores, dollar gaps, comparison values, and binding boundary all live only in the respondent's sessionStorage. Bradley flagged this 2026-06-11 after the live verification: he wants to be able to look up "what did this prospect actually answer on Q8?" three weeks later.

The audit also flagged this as a P2 item:

> "HubSpot enrichment: write stage, placement name, and headline gap to contact properties (currently only in the task body) so lists and follow-up can segment by maturity."

**Proposed shape, two layers:**

**Layer A — derived fields as HubSpot contact properties.** Queryable, visible in HubSpot UI, usable in lists/workflows. Create these via `ensureCustomContactProperties` (same pattern as the existing UTM properties):

| Property name | Type | Source |
|---|---|---|
| `scorecard_stage` | number (1-4) | `result.placement.stage` |
| `scorecard_stage_name` | string | `result.placement.name` |
| `scorecard_business_model` | enum (8 values) | `answers.q2.value` |
| `scorecard_revenue_band` | string | `answers.q1.value` |
| `scorecard_team_size_band` | string | `answers.q3.value` |
| `scorecard_avg_deal_band` | string | `answers.q13.value` |
| `scorecard_sales_cycle_band` | string | `answers.q14.value` |
| `scorecard_churn_band` | string \| null | `answers.q15?.value` |
| `scorecard_headline_floor_dollars` | number | `result.headline.floorDollars` |
| `scorecard_headline_median_dollars` | number | `result.headline.medianDollars` |
| `scorecard_binding_focus` | string \| null | `result.cta.focus` |
| `scorecard_completed_at` | datetime | submission timestamp |
| `scorecard_benchmark_version` | string | `result.benchmarkVersion` |
| `scorecard_competency_q4` ... `scorecard_competency_q12` | number (1-4) | individual q4-q12 scores (9 properties) |

The competency-per-question properties are what enable a HubSpot view like "show me everyone whose CRM architecture is below Functional" or "everyone whose Block C average is at least 3" without leaving the CRM.

**Layer B — full raw answers + computed result as a JSON-stringified contact engagement note.** Preserves everything for forensic lookup without bloating the property space. Use HubSpot's `/crm/v3/objects/notes` with an association to the contact. Body shape:

```json
{
  "scorecard_version": "1.1",
  "benchmark_version": "1.2",
  "submitted_at": "2026-06-11T18:05:49.583Z",
  "answers": {
    "q1": { "value": "3m_7m" },
    "q2": { "value": "B2B_SAAS" },
    "...": "..."
  },
  "result": {
    "headline": { "...": "..." },
    "roiLines": ["..."],
    "comparisons": ["..."],
    "competencyScores": ["..."],
    "binding": { "...": "..." }
  }
}
```

(JSON inside a `<pre>` tag in the note body is fine for HubSpot's rendering.)

**Where the writes happen:** `app/api/scorecard/submit/route.js`, immediately after the contact upsert + `buildResult` call. Run them in `Promise.allSettled` so an enrichment failure does not break the user's submission. Log enrichment failures with `console.error('[submit-scorecard] enrichment failed:', err)` so they show up in Vercel runtime logs.

**Backfill question:** out of scope for the first pass. Existing v1.0/v1.1 contacts have no scorecard properties. If Bradley wants them populated later, the result is reconstructable from sessionStorage only if the respondent still has the browser session, otherwise gone.

### 2. Email send pipeline

The single biggest gap. v1.1 explicitly softened the email-gate copy ("One last step before your results" / "your full scorecard is on screen the moment you submit") so the page does not promise a PDF that does not arrive. v1.2's job is to ship the send so the promise can be restored.

The audit defined what good looks like:

> "Day-0 PDF with the prospect's name on the cover plus a same-hour personal-feeling email quoting their exact stage and weakest score (5-minute response is ~21x conversion vs 30 minutes; average B2B response is 42 hours, which is where assessment funnels die). Then a short nurture keyed to their weakest dimension, every email carrying the booking link."

Specific subtasks:

- **PDF render in the submit route.** `renderResultPdf(result)` already returns a `Buffer`. Attach it to the outbound email. The renderer uses `@react-pdf/renderer` with `renderToBuffer`, vendored TTFs in `public/fonts/`, and the logo PNG in `public/logos/horizontal-full-color-light.png`. It works under Vercel's Node runtime (verified locally with `next build` + `next start`). One thing to watch: `@react-pdf/renderer` cold-start can be slow on Lambda; consider rendering the PDF in a separate `/api/scorecard/email` route that the client fires-and-forgets after seeing the result, rather than blocking the submit response.
- **Decide on email provider.** Existing HubSpot integration covers contacts/deals/tasks but does NOT include transactional email. Options: HubSpot Marketing Hub transactional email, Resend, Postmark, SendGrid. Recommend Resend for the dev velocity if Bradley does not need HubSpot-side tracking on these.
- **Day-0 email template.** Bradley voice, plain text (or minimal HTML). Quotes the user's exact stage and the single competency the CTA focuses on. Carries the booking link. PDF attached.
- **Day-3 nurture.** Keyed to the binding boundary's lowest competency. Shorter. Booking link.
- **Day-7 wrap.** "Here is what I would do first if you were my client." One paragraph. Booking link.
- **Restore the email-gate copy** once the pipeline is live (`components/scorecard/EmailGateForm.jsx`). Suggested:
  - Heading: "Where should I send your scorecard?"
  - Body: "You will see your results on screen now, and I will email you a PDF copy you can share with your team."

The audit's [P2 section](../superpowers/specs/2026-06-10-scorecard-iteration-audit.md#15-email-pipeline-the-deferred-sprint-now-validated-as-the-weakest-link-by-research) has more detail on the conversion case.

### 3. Open scope from v1.1 spec (deferred, but called out)

Items the [v1.1 spec](../superpowers/specs/2026-06-11-scorecard-v1.1-credible-result-design.md) explicitly listed under "What is NOT in this sprint":

- **Partial-gate test.** Show the stage label ungated, gate the dollar figures + PDF. Bradley liked the idea but parked it; v1.2 is a good moment to run it as an A/B if the email pipeline is live (the gated CTA becomes "see your number" rather than "we promise you a PDF that never comes"). Source: [audit P2 #17](../superpowers/specs/2026-06-10-scorecard-iteration-audit.md#p2-funnel-mechanics).
- **Score-routed CTAs.** Spec locked single-CTA for v1.1. Revisit once the email pipeline exists. Different stage placements probably warrant different next-step asks (Stage 1 = call, Stage 4 = audit engagement).
- **Q16 lead-response question.** `roi.js` already has a `leadResponse` generator that returns null; `questions.js` has a placeholder q16 that is filtered out by `getQuestionsFor`. Wiring it adds a fourth dollar lever. The benchmark file already has `leadResponseDays` for all 8 models with sources.
- **Model-aware Q14 bands.** The cycle guard kills the salesCycle line for ECOMMERCE and B2C_SUBSCRIPTION because the user's band midpoint (20 days minimum) cannot resolve against medians of 2-3 days. Better fix: render different Q14 bands per business model so e-commerce sees "Under 1 day / 1-7 days / 8-30 days / over 30 days." Requires a `Q14_CYCLE_OPTIONS_BY_MODEL` map in questions.js and a small wiring change in QuestionCard.
- **Shareable result URL.** Tokened URL that re-renders the same result without a fresh submit. Becomes the PDF link target AND the "re-take in 90 days" mechanism. Spec called this the follow-up to sessionStorage persistence (which v1.1 shipped).
- **OG image refresh.** The current `app/scorecard/opengraph-image` or page-level og is probably stale relative to the new scorecard. Worth a refresh if Bradley plans to share the scorecard link on social.

### 4. Landing-page report-screenshot

The v1.1 spec said:

> "Landing visual (result-page screenshot) is the final task of the sprint, captured from the shipped heat map."

v1.1 captured the sample PDF and used `/scorecard/preview` to view the result page in production, but **the landing page hero visual was never updated** with a screenshot of the actual result. Currently the landing has no image — just text. Adding one is a meaningful conversion lever:

> "Pointerpro, ScoreApp/Priestley, HubSpot Website Grader teardowns: a screenshot of the result page on the landing page lifts CTA clickthrough significantly."

Suggested: capture `/scorecard/preview` rendered at 1280x720, drop into `public/scorecard-result-preview.png`, render it in `components/scorecard/ScorecardExperience.jsx` between the subhead and the "Find your number" button (or below the button, anchoring the credibility-strip section).

### 5. Copy / UX micro-items that did not make v1.1

- **"Start over" link in QuizFlow.** The v1.1 spec mentioned "'Start over' link clears" sessionStorage. Not implemented — the user can refresh and hit Find your number again, but a visible affordance would be cleaner. Trivial: a small text link below the Back button that clears `sessionStorage['scorecard:state']` and resets state.
- **Refresh-after-submit task body.** Live-verified: a respondent who re-submits with the same email gets the same deal (idempotent) but the follow-up task body is from the FIRST submission only — subsequent submissions don't update it. If a user retakes the scorecard 3 months later with different answers, the task body will still reflect their old result. Decide: should the task be patched/replaced on re-submission, or should each submission create its own engagement note (the JSON-blob from Layer B of HubSpot enrichment) so history is preserved? Probably the latter — append-only is safer.
- **Landing copy A/B candidates** (not from spec, observed during live walk): the "FREE DIAGNOSTIC" eyebrow is currently the strongest signal that this is a free thing. Worth testing whether dropping the eyebrow and tightening the headline conversion further.

### 6. Items NOT recommended for v1.2

For the record so nobody picks them up by accident — these were considered and rejected:

- **Inflating maturity scores** to land most respondents at mid-ladder. Keep the weakest-link rule; the v1.1 heat map already addresses the "all uniform failure" perception that drove the concern.
- **Expanding the question count** beyond 16 (15 + reserved Q16). Cold-traffic completion data supports 8-15.
- **Practitioner-vocabulary anywhere client-facing.** Was a problem with Q8/Q12 in v1.0 (Stage-3/Stage-4 boundary leaks), fixed in v1.1.

---

## Notes worth carrying forward

### Decisions made during v1.1 review

- **GRR <= NRR is a definitional constraint and the test suite enforces it.** When the canonical RevOps Coaching App benchmarks file syncs again, follow the procedure in `lib/scorecard/businessModelBenchmarks.js`'s header docblock — never copy the whole `BUSINESS_MODEL_BENCHMARKS` object verbatim, because it would wipe the site-local `grr` rows. The `it.each(MODELS)` shape test will catch a complete wipe, but a partial-delete sync could still pass tests if it preserves only some rows.
- **`metricCitation` was the right shape over `sourceCitation`.** Use `metricCitation(metric)` for any new dollar line or comparison row — it pulls the real named source from `metric.source` and stamps `metric.asOf`. `sourceCitation(modelLabel)` is retained but is functionally dead in client-facing copy now.
- **CTA voice rule.** First-person singular only. The spec originally had "We will walk through" in `CTA_FOCUS_TEMPLATE`; corrected to "I will walk you through" during implementation because `sanitizeVoice` would throw at module-load time on the plural.

### Micro-gaps left behind in v1.1

- **eslint warning in `components/BookPageClient.jsx`** on the `react-hooks/set-state-in-effect` rule. Same hydration-safe pattern as `QuizFlow` and `ScorecardExperience`, but the suppression comment was never added because BookPageClient was out of scope for v1.1. Either add the disable-comment or refactor. There is a spawned-task chip for this.
- **`out/` is gitignored but the `/out/` path conflicts with Next.js's static export output folder.** If anyone enables `next export` later, `out/sample-scorecard.pdf` will collide. Low priority; just be aware.
- **The PDF stack uses `vite-node` to handle JSX-in-mjs.** The script comment documents this. If `vite-node` ever moves out of `devDependencies`, the script breaks.

### Test artifacts to preserve

- The HubSpot test identity `bradley+scorecard-v11-test@bradleydewet.com` (contact `500445103825`, deal `329464445684`) was used for the v1.1 production verification. Probably worth keeping for v1.2 testing rather than creating a fresh one each sprint. Note: the existing follow-up task on that contact reflects the first submission's answers (B2B SaaS, no-gap) — the second submission (B2B product, stale-q15 test) reused the deal idempotently, which is the documented behavior, so the task body's read of "Stage 1 (Reactive). Model: B2B SaaS." does not match the current scorecard state. This is the "task body never updates on re-submission" gap captured in section 5 above.

---

## Suggested v1.2 sprint shape

If picking up the full mandate, the most cost-effective sprint order:

1. **HubSpot enrichment** (1-2 days, low risk). Unblocks Bradley's reporting and follow-up workflow regardless of what else lands.
2. **Email send pipeline + restore email-gate copy** (3-4 days, medium risk). The conversion case is strong; landing this gets the brand promise honest again.
3. **Partial-gate A/B test** (1 day). Cheap to ship once the email pipeline is in place.
4. **Landing-page result screenshot** (half day). Capture from `/scorecard/preview`.
5. **Model-aware Q14 bands** (1 day). Removes the salesCycle-line-skipped-for-e-commerce honesty gap.
6. **Q16 lead-response wiring** (1 day). Adds a fourth dollar lever.
7. **Shareable result URL + OG image** (1-2 days). Combine since the URL is the natural OG-image entry point.
8. **Start over link + minor copy items** (half day). Cleanup pass.

That is roughly a two-week sprint at one engineer. Smaller scope: items 1 + 2 + 5 alone would be a strong v1.2.
