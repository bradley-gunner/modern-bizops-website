# Maturity Scorecard Lead Magnet — Design Spec

**Date:** 2026-06-10
**Status:** Draft for sign-off
**Sprint:** Marketing-site lead-magnet replacement (one sprint, no slicing yet)
**Predecessor design conversation:** `docs/handoff/scorecard-handoff.md` (committed 2026-06-10, the design contract from the remote session)
**Mirrors house style of:** `2026-06-08-benchmark-relative-scoring-design.md`, `2026-06-08-report-kpi-benchmark-display-design.md` (both from the RevOps Coaching App repo, Sprint 30.5 / 30.6)

---

## Summary

Replace the existing `/scorecard` page (a 17-question, 7-dimension diagnostic that funnels to `app.modernbizops.com/scorecard`) with a self-contained v2 maturity scorecard built on the Phase B 44-competency framework. Sixteen questions across three sections probe nine maturity competencies and three financial inputs. Scoring places the client into one of four stages (Reactive, Repeatable, Predictable, Compounding) using a weakest-link rule that mirrors the framework's own "below 3.0 on any Stage 1 competency starts there" guidance. The result page leads with a loss-framed dollar headline, shows up to three peer-anchored ROI lines sourced from `businessModelBenchmarks.js v1.1`, diagnoses the stage boundary that is binding, names bright spots, discloses what the directional read cannot tell the client, and converts on a single CTA into `/watch`.

The email gate sits between Q15 and the result reveal. Submitting upserts a HubSpot contact, persists inbound UTMs, and creates a deal in the **RevOps Coaching** pipeline (`2172760768`) at the **New Lead** stage (`3477396169`) idempotently. The on-screen result is mirrored in a React-PDF attachment delivered by email.

All client-facing copy is first-person Bradley, free of em-dashes, free of "we/our/us", and loss-framed on every dollar figure. Every dollar number cites `businessModelBenchmarks v1.1` and the business-model row it came from.

## Settled decisions (carried from the handoff doc and the remote design conversation)

1. **Same-route replacement.** The existing `app/scorecard/page.js` is replaced in place. Option (a) from the design conversation. The app-side `app.modernbizops.com/scorecard` migration is a separate concern in the RevOps Coaching App repo and is out of scope here.
2. **Framework alignment is Phase B v1.0.** Four stages (Reactive, Repeatable, Predictable, Compounding) and 44 competencies. The free scorecard probes nine of the 44, sampled at the three stage boundaries (Block A = comps 3, 5, 6 for the Stage 1 → 2 boundary; Block B = comps 7, 8, 13 for Stage 2 → 3; Block C = comps 25, 29, 40 for Stage 3 → 4). Stage names, descriptors, and rubric language are pulled verbatim from `Modern BizOps Revenue Operations Maturity Framework.md`. No paraphrasing.
3. **Single offer, no routing.** Q2 business model does NOT route to different offers or pipelines. Every result page CTA points to `/watch` for the discovery-call meeting embed.
4. **Benchmark sourcing — Option A (vendor the file).** Copy `businessModelBenchmarks.js v1.1` into this repo at `lib/scorecard/businessModelBenchmarks.js` with a header comment documenting the sync procedure (re-curate a number in the RevOps Coaching App canonical file, bump `BUSINESS_MODEL_BENCHMARK_VERSION`, then copy here). `industryBenchmarks.js` is admin-only and is NOT used on the client-facing scorecard.
5. **PDF — React-PDF.** Use `@react-pdf/renderer` for the email attachment. The result page is already structured in sections that map cleanly to PDF page components. Puppeteer is rejected as too heavy for this single-document workload.
6. **Voice is strict.** First-person Bradley ("I", "you"), no em-dashes anywhere, no "we/our/us" in user-facing copy, loss-framed dollar copy on every peer-comparison ROI line, source citation on every dollar number. A lint check at the spec layer (a Node script that greps client-facing strings for forbidden characters and tokens) is part of the deliverable. Mirrors the `lint:voice` rule in the RevOps Coaching App.
7. **HubSpot stage constant lives in `lib/hubspot.js`.** The handoff said "add `SCORECARD_NEW_LEAD_STAGE` alongside the existing `DISCOVERY_CALL_BOOKED_STAGE`". Refinement after reading the code: the value `"3477396169"` is **already declared** as a local `NEW_LEAD_STAGE` in `app/api/create-watch-deal/route.js:12`. The right move is to PROMOTE that single constant to `lib/hubspot.js` (export `NEW_LEAD_STAGE = "3477396169"`) and have both `create-watch-deal` and the new `submit-scorecard` route import it. No new "SCORECARD_NEW_LEAD_STAGE" symbol; one canonical constant, two consumers.
8. **No UTMs on internal navigation.** The result-page CTA to `/watch` is a clean `<Link href="/watch">`. Inbound `/scorecard` UTMs are captured by the existing `lib/utm.js` + `components/UtmCapture.jsx` and forwarded to HubSpot via `pickUtmProperties` on submit. The constant rollup for inbound `utm_campaign` is `maturity-scorecard`.
9. **Test runner — add Vitest as a dev dependency.** This repo currently has no test infrastructure (no `test` script, no Jest/Vitest in `package.json`). The handoff calls for TDD; the implementation plan must include a one-time "install Vitest + add `npm test` script" task before any scorecard test is written.

## Architecture

### Component 1 — Question and scoring engine: `lib/scorecard/`

**`lib/scorecard/questions.js`** — single source of truth for the 16-question structure. Pure data, no UI. Each question carries `id`, `section`, `kind` (`'segmentation' | 'maturity' | 'financial'`), prompt text, optional `peerAnchorTemplate` (Section 2 only), and an `options` array. Maturity options additionally declare `score: 1 | 2 | 3 | 4` per the Phase B rubric (A → 1 Absent, B → 2 Informal, C → 3 Functional, D → 4 Managed). Score 5 (Optimized) is intentionally excluded from a free 16-question quiz. Q15 (churn) declares a `showIf(answers)` predicate that hides it when Q2 is `B2B_PRODUCT` or `ECOMMERCE`. Q14 and Q15 carry a `"Not sure / I don't track this"` option that sets a `notTracked: true` flag (not a 0 score; the ROI engine treats it as "do not fire this line").

The exact question copy is the handoff doc's Section "The scorecard" verbatim. Peer-anchor templates use `{model_label}` resolved against `getBusinessModelBenchmark(q2).label`.

**`lib/scorecard/scoring.js`** — pure functions, no I/O:

```js
export function stagePlacement(answers) {
  const score = (id) => answers[id].score;
  const A = [score('q4'), score('q5'), score('q6')];   // comps 3, 5, 6 — Stage 1 → 2 boundary
  const B = [score('q7'), score('q8'), score('q9')];   // comps 7, 8, 13 — Stage 2 → 3 boundary
  const C = [score('q10'), score('q11'), score('q12')]; // comps 25, 29, 40 — Stage 3 → 4 boundary
  if (Math.min(...A) < 3) return 1;
  if (Math.min(...B) < 3) return 2;
  if (Math.min(...C) < 4) return 3;
  return 4;
}

export function brightSpots(answers, placementStage) {
  // Return up to 2 maturity answers scoring strictly higher than placementStage.
}

export function bindingBoundary(answers, placementStage) {
  // For the failing block (A | B | C), return the two lowest-scoring questions in the block.
  // Their competency labels feed the "what's binding" diagnosis paragraph.
}
```

**Why this asymmetric threshold.** Blocks A and B test Stage 1 / 2 competencies whose Functional level (score 3) IS the boundary cross. Block C tests Stage 3 competencies whose Managed level (score 4) IS the Stage 4 boundary cross, because Stage 4 is "the system improves itself" — the Managed rubric is the prerequisite. This matches the framework's stage-entry criteria verbatim.

### Component 2 — Benchmark module: `lib/scorecard/businessModelBenchmarks.js`

A verbatim copy of `/Users/bradleydewet/RevOps Coaching App/.claude/worktrees/wizardly-kirch-2a4eed/server/src/lib/businessModelBenchmarks.js` (155 lines), with:

- An added header block documenting the sync procedure: re-curate a number in the RevOps Coaching App canonical, bump `BUSINESS_MODEL_BENCHMARK_VERSION`, copy the file here, ship the version bump in the commit message.
- The `industryOverrides` plumbing stripped (this site does not consume industry-level overrides). The optional `industry` arg to `getBusinessModelBenchmark` is dropped to keep the signature lean.
- The exported surface preserved: `BUSINESS_MODEL_BENCHMARK_VERSION` (`'1.1'`), `getBusinessModelBenchmark(businessModel)`, and `classifyAgainstBenchmark(value, metric)` (the direction-aware band classifier returning `{ band, interpretation, median, range }`).

### Component 3 — ROI engine: `lib/scorecard/roi.js`

Four ROI line generators. Each takes `(answers, benchmark)` and returns either `null` (does not fire) or a structured `RoiLine`:

```js
{
  key: 'revenuePerEmployee' | 'salesCycle' | 'nrr' | 'leadResponse',
  title: string,
  clientValue: { display: string, raw: number, unit: 'usd' | 'days' | 'ratio' },
  peerMedian: { display: string, raw: number },
  peerRange: { displayLow: string, displayHigh: string },
  comparison: 'meets' | 'partial' | 'fails',
  comparisonCopy: string,             // direction-aware, rendered verbatim
  floorDollars: number | null,        // null for peer-gap-only lines
  medianDollars: number | null,
  body: string,                       // loss-framed paragraph in Bradley voice
  source: string,                     // 'businessModelBenchmarks v1.1, {model_label} row.'
}
```

**Band-midpoint table for converting Q1, Q3, Q13, Q14, Q15 to numbers** is implemented as a lookup map keyed by question id and option id, transcribed verbatim from the handoff doc's "Band midpoints for ROI calculations" section. Conservative high-band midpoints (Q1 `>$15M` → $20M; Q3 `75+` → 90; Q13 `>$100K` → $200K; Q14 `>180d` → 240; Q15 `>30%` → 40%) match the handoff.

**Per-line generator semantics** (full math is in the handoff doc, section "The math (up to 3 ROI lines)"):

| Generator | Fires when | `clientValue` | `floorDollars` | `medianDollars` |
|---|---|---|---|---|
| `revenuePerEmployee` | Always (Q1 and Q3 both have answers, which they always do) | Q1 midpoint / Q3 midpoint | `max(0, range_low - client) * team` | `max(0, median - client) * team` |
| `salesCycle` | Q14 ≠ notTracked AND classification is `partial` or `fails` | Q14 midpoint | `(client/range_high - 1) * current_revenue` | `(client/median - 1) * current_revenue` |
| `nrr` | Q15 shown AND ≠ notTracked AND classification is `partial` or `fails` | `1 - midpoint(Q15)` | `(range_low - client) * current_revenue` | `(median - client) * current_revenue` |
| `leadResponse` | Never in v1 (no quiz input) | n/a | `null` | `null` |

The lead-response generator is implemented but unreachable in v1 (no quiz question triggers it). It is left in place so a future quiz iteration can add a Q16 lead-response-time question and a defensible "% conversion lost per day of delay" coefficient and unlock it without re-architecting the engine. Documented but not surfaced.

**Magnitude ranking** is a simple `sortBy(medianDollars, descending).take(3)`. In v1 only three dollar-bearing lines can fire, so the cap is a no-op, but the cap is in the code so future generators do not silently render four lines.

**Direction-aware `comparisonCopy` table** is identical to the Sprint 30.6 KPI display spec's table (the marketing-site scorecard reuses the same copy strings):

| Generator | meets | partial | fails |
|---|---|---|---|
| `salesCycle` (lower better) | `'at or faster than peer'` | `'slower than peer median'` | `'slower than peer'` |
| `nrr` (higher better) | `'at or above peer'` | `'below peer median'` | `'below peer'` |
| `revenuePerEmployee` (higher better) | `'at or above peer'` | `'below peer median'` | `'below peer'` |
| `leadResponse` (lower better) | `'at or faster than peer'` | `'slower than peer median'` | `'slower than peer'` |

### Component 4 — Result assembly: `lib/scorecard/resultRender.js` and `voice.js`

**`resultRender.js`** — single function `buildResult(answers): Result`. Inputs the raw answer map. Outputs the structured payload the result page consumes:

```js
{
  headline: { floorDollars, medianDollars, modelLabel },
  roiLines: RoiLine[],                                          // up to 3
  placement: { stage: 1|2|3|4, name: string, descriptor: string },
  binding: { failingBlock: 'A'|'B'|'C', competencies: string[], translation: string },
  brightSpots: { description: string } | null,                  // null if none scored higher than placement
  disclosure: string,                                            // static
  cta: { destination: '/watch', cardLines: string[] },
  // For PDF and HubSpot persistence:
  modelLabel: string,
  benchmarkVersion: '1.1',
  generatedAt: ISOString,
}
```

`buildResult` orchestrates: business-model lookup, ROI line generation, ranking, stage placement, bright-spot detection, binding-boundary diagnosis, and copy assembly. No I/O. Fully unit-testable against fixtures.

**`voice.js`** — pure string templates and helpers. Loss-framed copy, peer-comparison badge copy, source-citation templates, and the static disclosure / CTA strings. A `sanitizeVoice(s: string)` helper enforces the brand-voice rules at the boundary: assert no em-dashes, assert no first-person plural (`/\b(we|our|us)\b/i`), return the string unchanged or throw in dev. Throwing in dev surfaces a voice violation as a unit-test failure; in prod the helper is a pass-through to avoid runtime crashes from a stray template.

### Component 5 — Quiz UI: `app/scorecard/quiz/page.js` + `components/scorecard/*`

Client component (state machine in React 19, `useState` for current section / question index / answer map; no router push between questions). One screen at a time, "Next" advances, "Back" returns. The "Section X of 3 — [name]" header is rendered above each section, not a question counter.

Component breakdown:

- **`QuizFlow.jsx`** — top-level state machine. Holds `answers`, `currentIndex`, `derivedQuestions` (resolves Q15 conditional). Hands the active question to `QuestionCard`.
- **`SectionHeader.jsx`** — "Section X of 3 — [name]" + the section's italic sub-line from the handoff.
- **`QuestionCard.jsx`** — renders one question. For Section 2 questions, applies `{model_label}` interpolation against the live Q2 answer. Radio-style options, large tap targets, no number-line scoring visible to the client.
- **`EmailGateForm.jsx`** — rendered after Q15. Fields: First name, Email, Company. Submit posts to `/api/scorecard/submit` and on success either navigates to `/scorecard/result?token=...` (signed token holding the answer hash + email) OR holds state and renders the result inline. **Decision: inline render**, no separate result page route. Single-page flow keeps the JS state intact, avoids a token-signing dependency, and is consistent with the handoff's "see your result on screen now" promise. The `/scorecard/result/page.js` file in the touch list is therefore demoted to an optional shareable-link surface and deferred to a follow-up.

The quiz route stays at `/scorecard` for first paint (the landing page) and transitions client-side to the quiz once the user clicks "Find your number". No separate `/scorecard/quiz` URL is necessary. The handoff's touch-list entry for `app/scorecard/quiz/page.js` is therefore folded into a single `app/scorecard/page.js` that conditionally renders the landing CTA → the quiz → the email gate → the result view, all in one client component tree.

### Component 6 — Result rendering: `app/scorecard/page.js` (result view) + `components/scorecard/*`

When the submit succeeds, the same page swaps into the result view, rendered from the `Result` payload returned by `buildResult`. Section order, verbatim from the handoff:

1. **The number** — loss-framed dollar headline. `<h1>` size, top of viewport.
2. **The math** — up to three `<RoiLine />` rows. Each row shows: title, "Your number: X / Typical {label} peer: Y (range Z to W) / {comparison badge}", the loss-framed body paragraph, and the source-citation footer. Badge color: green (meets), amber (partial), copper (fails).
3. **Why this is happening** — stage placement card. Stage name, descriptor (verbatim from framework), and the binding-boundary diagnosis paragraph naming the two failing competencies in plain language.
4. **What you're doing right** — bright-spots card. Hidden if none.
5. **What this scorecard can and can't tell you** — static disclosure.
6. **CTA** — 4-line offer card → `<Link href="/watch">`.

Shared subcomponents:

- **`RoiLine.jsx`** — mirrors the shape from the Sprint 30.6 KPI display spec (`Your number / Peer median / comparison badge`) adapted for marketing-site styling. Single shared component for screen and PDF render paths.
- **`CtaCard.jsx`** — the 4-line offer card. Static copy.
- **`StagePlacementCard.jsx`** — stage name, descriptor, binding-boundary paragraph.

### Component 7 — Submit API: `app/api/scorecard/submit/route.js`

POST handler. Mirrors the pattern in `app/api/create-watch-deal/route.js` and `app/api/submit-form/route.js`. Body:

```js
{ firstName, email, company, answers, utms }
```

Steps, in order, with idempotency:

1. `assertHubSpotConfigured()`.
2. `await ensureCustomContactProperties(UTM_CUSTOM_PROPERTIES)` (one-time guard, module-level flag).
3. `upsertContactByEmail(email, { firstname, company, ...pickUtmProperties(utms) })`. UTM properties only set if non-empty (first-touch never overwritten — `pickUtmProperties` already drops blanks).
4. `findExistingRevopsDealForContact(contactId)` — idempotency guard, mirrors create-watch-deal. If a deal exists in the RevOps pipeline already, return success with the existing deal id and skip create.
5. If no existing deal, create one with:
   - `dealname: \`Maturity Scorecard - ${contactName}\`` (hyphen-space, NOT em-dash; the existing `create-watch-deal` uses `—` which violates the no-em-dash rule and is flagged as a pre-existing issue for a separate cleanup chip).
   - `pipeline: REVOPS_PIPELINE_ID`
   - `dealstage: NEW_LEAD_STAGE` (the constant promoted to `lib/hubspot.js`)
   - `dealtype: 'newbusiness'`
   - `engagement_type: 'DWY Coaching'`
   - `project_type: 'RevOps Coaching'`
   - `hubspot_owner_id: BRADLEY_OWNER_ID`
6. Optional follow-up: `createContactTask({ contactId, subject: 'Scorecard lead - review and follow up', body: <summary of answers + computed stage>, ownerId: BRADLEY_OWNER_ID, priority: 'HIGH', dueInHours: 24 })`. This is the existing task primitive in `lib/hubspot.js`. Defer the email send (Resend or similar) to a follow-up; for v1, the task notification IS the alert.
7. Compute `buildResult(answers)` server-side and return it in the response so the client renders the same shape the PDF will render. (Alternative: client recomputes; rejected because the client-side bundle would then ship the benchmark file and the ROI math, which is fine, but server-side keeps the PDF render and the on-screen render fed by the same authoritative source.)
8. Render the React-PDF document and email it (deferred to follow-up; for v1, return `{ success: true, result }` and surface the result inline. The PDF + email pipeline lands in a separate task within this sprint but is independently shippable.)

**HubSpot-side change to `lib/hubspot.js`:** add `export const NEW_LEAD_STAGE = "3477396169";` alongside the existing `DISCOVERY_CALL_BOOKED_STAGE`. Update `app/api/create-watch-deal/route.js` to import it instead of declaring its own local copy. One canonical constant, two consumers.

### Component 8 — Landing page (replaces existing `app/scorecard/page.js` content above the quiz)

When the user has not yet clicked the CTA, render the landing copy verbatim from the handoff (`Above the fold` + `Below the fold` sections). Headline, sub-headline (Marcus Chen mirror), "Find your number" CTA. Below-the-fold three short paragraphs (`What you'll get back / What I'm comparing you against / What this isn't`). No testimonials, no logos, no dimension grid. The CTA button toggles the page into quiz mode.

OG metadata stays at the existing path `public/og/og-scorecard.png`. Refresh of the OG image is out of scope (it still says "Free Revenue Engine Health Score" which is the old framing; flagged for a separate copy/design task).

### Component 9 — PDF render: `lib/scorecard/pdfDocument.jsx`

A `@react-pdf/renderer` document component that takes the same `Result` payload and renders a 2-3 page PDF mirroring the on-screen sections. Single shared document component, no separate "report" template. Page-level styling is minimal — the goal is a shareable artifact, not a designed report. Stage names, dollar headlines, ROI lines, stage placement, bright spots, disclosure, CTA URL (text-only `https://modernbizops.com/watch`).

A `renderResultPdf(result): Promise<Buffer>` function wraps `pdf(<ResultDocument result={result} />).toBuffer()` for use by the submit route's email-send step.

## Data flow

```
URL (?utm_*)                                           HubSpot
   │                                                       ▲
   ▼                                                       │
UtmCapture (existing) -> sessionStorage                    │
                                                           │
Landing CTA click                                          │
   │                                                       │
   ▼                                                       │
QuizFlow state machine -> answers (16 questions)           │
   │                                                       │
   ▼                                                       │
EmailGateForm submit -> POST /api/scorecard/submit ────────┤ upsertContactByEmail
                                  │                        │ pickUtmProperties
                                  │                        │ ensureCustomContactProperties
                                  │                        │ findExistingRevopsDealForContact
                                  │                        │ create deal at NEW_LEAD_STAGE
                                  │                        │ createContactTask
                                  ▼
                          buildResult(answers)
                                  │
                  ┌───────────────┼───────────────┐
                  ▼               ▼               ▼
        getBusinessModelBenchmark  scoring.stagePlacement
                  │               │               │
                  ▼               ▼               ▼
                 roi.js     binding boundary    bright spots
                  │               │               │
                  └───────────────┼───────────────┘
                                  ▼
                              Result payload
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       Result view (inline)              renderResultPdf (deferred)
```

## Voice and copy enforcement

A Node script `scripts/lint-scorecard-voice.mjs` walks `lib/scorecard/voice.js`, `lib/scorecard/questions.js`, the result template strings, and the static landing copy, and asserts:

- No em-dash character (`/—|—/`) anywhere.
- No first-person plural (`/\b(we|our|us|We|Our|Us)\b/`).
- Every loss-framed body paragraph in `voice.js` contains at least one loss verb from a whitelist (`leaving`, `losing`, `leaking`, `uncaptured`, `not capturing`).
- Every benchmark-bearing template ends with the source-citation pattern (`/Source: businessModelBenchmarks v1\.1/`).

This script is wired into `package.json` as `npm run lint:scorecard` and runs in CI alongside the test suite. Failures block merge. This is the marketing-site analog of the RevOps Coaching App's `lint:voice` rule.

## Testing (TDD per task)

Add Vitest as a dev dependency before the first test. Tests colocate under `__tests__/scorecard/` and run via `npm test`.

| Test file | Asserts |
|---|---|
| `__tests__/scorecard/questions.test.js` | 16 questions present. Q15 hidden when Q2 ∈ {B2B_PRODUCT, ECOMMERCE}. Every maturity option carries score ∈ {1,2,3,4}. Every `peerAnchorTemplate` resolves cleanly for every business model. No em-dash in any question or option string. |
| `__tests__/scorecard/scoring.test.js` | `stagePlacement` returns 1 when min(A) < 3 regardless of B/C scores. Returns 2 when A ≥ 3 and min(B) < 3. Returns 3 when A ≥ 3, B ≥ 3, min(C) < 4. Returns 4 when all ≥ thresholds. Boundary values: A score = 3 advances past Stage 1 (strictly less than). C score = 4 advances to Stage 4. `brightSpots` returns up to 2 items strictly higher than placement. `bindingBoundary` returns the two lowest-scoring questions in the failing block. |
| `__tests__/scorecard/businessModelBenchmarks.test.js` | Every business model in the handoff's Q2 list resolves via `getBusinessModelBenchmark`. `OTHER` fallback for unknown. `classifyAgainstBenchmark` returns correct band/interpretation for boundary values in both directions. `BUSINESS_MODEL_BENCHMARK_VERSION === '1.1'`. |
| `__tests__/scorecard/roi.test.js` | Each generator against fixture inputs. Revenue-per-employee fires for all q1+q3 combos. Sales-cycle fires only when q14 ≠ notTracked AND interpretation ≠ meets. NRR fires only when q15 shown AND ≠ notTracked AND interpretation ≠ meets. Lead-response generator returns null (no quiz input wired). `comparisonCopy` matches the direction-aware table. Ranking returns at most 3. |
| `__tests__/scorecard/resultRender.test.js` | Snapshot test: full `buildResult` against a fixture set covering (a) Stage 1 placement with maxed-out ROI, (b) Stage 3 placement with one ROI line, (c) Stage 4 placement with zero ROI lines firing (all bands at meets), (d) `notTracked` on Q14 and Q15. |
| `__tests__/scorecard/voice.test.js` | `sanitizeVoice` throws on em-dash. Throws on "we"/"our"/"us". Returns string unchanged on clean copy. |
| `__tests__/scorecard/api-submit.test.js` | Mocks HubSpot calls. Asserts upsert, deal-create with `dealstage: NEW_LEAD_STAGE` and `pipeline: REVOPS_PIPELINE_ID`. Asserts UTM forwarding. Asserts idempotency: second submit with same email returns existing deal id. Asserts dealname uses hyphen, not em-dash. |
| `__tests__/scorecard/pdf.test.js` | `renderResultPdf` returns a Buffer. Snapshot the rendered text content (`@react-pdf/renderer`'s `renderToString` for the snapshot). No em-dash in extracted text. |
| `__tests__/scorecard/lint-scorecard-voice.test.js` | Runs the lint script against a fixture file containing an em-dash and asserts non-zero exit. Runs against a clean fixture and asserts zero exit. |

Plus the existing site's manual smoke test: the dev server starts, `/scorecard` renders the new landing, the CTA advances into the quiz, Q15 hides for `B2B_PRODUCT`, the email gate submits, the result renders inline with at least one ROI line, the CTA links to `/watch` with no UTM query string. The verification workflow per `preview_*` tools is used at the implementation-plan level to confirm each phase.

## What's NOT in this sprint

- **Post-conversion email follow-up sequence.** A three-email arc (PDF copy + personal note → day-2 "if this stood out, here's what I'd do first" → day-5 "two ways to take this further") is sketched in the handoff and deferred to its own sprint.
- **Published pricing on the CTA card.** Current CTA is "Schedule the call" into `/watch` (fit call). The future-state direct-Stripe-checkout swap is deferred until Bradley confirms offer pricing.
- **A/B test variants.** Landing-page promise, CTA copy, result-page headline framing — not in this sprint.
- **Lead-response time question + dollar conversion.** The generator exists in `roi.js` but no quiz input triggers it. Adding a Q16 lead-response question requires a defensible "% conversion lost per day of delay" coefficient outside `businessModelBenchmarks.js v1.1`. Deferred.
- **Migration of `app.modernbizops.com/scorecard`** to the Phase B framework. Separate repo, separate sprint.
- **OG image refresh.** The existing `public/og/og-scorecard.png` still references the old framing ("Free Revenue Engine Health Score across 7 dimensions"). Flagged as a follow-up copy/design task.
- **Pre-existing em-dash in `create-watch-deal/route.js:78`.** The `dealname` template uses `—` (Unicode em-dash). Flagged as a separate cleanup chip; this sprint touches `lib/hubspot.js` and that route's import line, but does NOT silently rewrite that string as part of the scorecard work.
- **`/scorecard/result?token=...` shareable result page.** A signed-token route to revisit the result is out of scope. The result renders inline post-submit. A future iteration can add the token route once the email-send pipeline is in.
- **PDF email send.** The PDF render IS in scope; the SMTP / Resend pipeline that attaches and sends it is a follow-up task within this sprint. If schedule constrains, the PDF render lands in code with a unit test, the email send lands in a fast-follow.

## File touch list

```
# New files
docs/superpowers/specs/2026-06-10-maturity-scorecard-lead-magnet-design.md  # this file
docs/superpowers/plans/2026-06-10-maturity-scorecard-lead-magnet-plan.md    # next deliverable, after sign-off
app/api/scorecard/submit/route.js                                            # email gate, HubSpot upsert, deal create, idempotent
components/scorecard/QuizFlow.jsx                                            # state machine
components/scorecard/QuestionCard.jsx                                        # one question + options
components/scorecard/SectionHeader.jsx                                       # "Section X of 3" header
components/scorecard/EmailGateForm.jsx                                       # email capture between Q15 and result
components/scorecard/RoiLine.jsx                                             # mirrors KPI display row shape
components/scorecard/StagePlacementCard.jsx                                  # stage + binding-boundary diagnosis
components/scorecard/CtaCard.jsx                                             # 4-line offer card -> /watch
lib/scorecard/questions.js                                                   # the 16 questions, options, scores
lib/scorecard/scoring.js                                                     # stagePlacement, brightSpots, bindingBoundary
lib/scorecard/businessModelBenchmarks.js                                     # verbatim copy of v1.1 + sync-procedure header
lib/scorecard/roi.js                                                         # four generators + ranker
lib/scorecard/resultRender.js                                                # buildResult orchestrator
lib/scorecard/voice.js                                                       # copy templates + sanitizeVoice
lib/scorecard/pdfDocument.jsx                                                # React-PDF document
scripts/lint-scorecard-voice.mjs                                             # voice/em-dash/source-citation guard
__tests__/scorecard/questions.test.js
__tests__/scorecard/scoring.test.js
__tests__/scorecard/businessModelBenchmarks.test.js
__tests__/scorecard/roi.test.js
__tests__/scorecard/resultRender.test.js
__tests__/scorecard/voice.test.js
__tests__/scorecard/api-submit.test.js
__tests__/scorecard/pdf.test.js
__tests__/scorecard/lint-scorecard-voice.test.js

# Modified files
app/scorecard/page.js                                                        # REPLACE: landing -> quiz -> email gate -> result, one client tree
lib/hubspot.js                                                               # add export const NEW_LEAD_STAGE = "3477396169"
app/api/create-watch-deal/route.js                                           # import NEW_LEAD_STAGE from lib/hubspot.js (drop local copy)
package.json                                                                 # add vitest, @vitejs/plugin-react, @react-pdf/renderer; add test + lint:scorecard scripts

# Reference (read-only, lives outside the repo)
~/Documents/Claude/Projects/Modern BizOps/Coaching Service/App/Modern BizOps Revenue Operations Maturity Framework.md
~/Documents/Claude/Projects/Modern BizOps/Coaching Service/App/Phase B Design Brief.md
~/RevOps Coaching App/.claude/worktrees/wizardly-kirch-2a4eed/server/src/lib/businessModelBenchmarks.js
```

## Decisions locked

- **Single-page client tree.** Landing, quiz, email gate, and result are one React component tree under `app/scorecard/page.js`. No separate `/scorecard/quiz` or `/scorecard/result` route. State stays in memory; no token signing; no router navigation between steps.
- **Submit API computes result server-side.** The `Result` payload returned to the client is the same shape the PDF renders against. Single source of truth.
- **`NEW_LEAD_STAGE` is one canonical constant in `lib/hubspot.js`.** Both `submit-scorecard` and `create-watch-deal` import it. The handoff's "SCORECARD_NEW_LEAD_STAGE" naming is rejected in favor of one shared name.
- **Idempotency mirrors `create-watch-deal`.** Existing-deal lookup on the RevOps pipeline blocks duplicate deal creation on resubmit.
- **No UTMs on the `/watch` CTA.** Internal navigation. Attribution is preserved via first-touch capture on `/scorecard` + HubSpot contact properties.
- **Vitest is the test runner.** Justification: lightest add for a Next.js 16 + React 19 project, ESM-native (matches the rest of this repo), zero config for the scope of these tests.
- **`@react-pdf/renderer` for the PDF.** Justification in the Settled Decisions section.
- **Voice lint script is part of the deliverable, not deferred.** Wired into `npm run lint:scorecard` and run in CI.
- **Pre-existing em-dash in `create-watch-deal/route.js` is NOT silently fixed in this sprint.** Flagged as a separate cleanup chip so the scorecard PR stays scoped.
