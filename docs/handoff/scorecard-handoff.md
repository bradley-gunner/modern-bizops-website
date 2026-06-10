# Maturity Scorecard Lead Magnet — Handoff to Local Session

**Date:** 2026-06-10
**Branch:** `claude/gallant-clarke-r3lrwr`
**Repo:** `modern-bizops-website`
**Why this doc exists:** This work was designed end-to-end in a remote Claude Code on the web session. That session cannot install your local superpowers plugin (plugins must be declared in the repo's `.claude/settings.json` at session start). Rather than fight the constraint, the full design is preserved here so a local session with superpowers can pick it up cleanly and execute via the standard spec → plan → TDD workflow.

---

## How to use this document

1. Open Claude Code locally in this repo on this branch (`claude/gallant-clarke-r3lrwr`).
2. Paste the handoff prompt below into the first turn.
3. Claude will read this doc, the existing repo, and proceed straight to writing the superpowers design spec.

---

## Handoff prompt (copy-paste this into the local Claude session)

```
I'm resuming work on the new Modern BizOps maturity scorecard lead magnet for
this repo's /scorecard route. The full design, every decision that's been
signed off, and the file touch list are documented in
docs/handoff/scorecard-handoff.md. Read that document end to end first.

After reading, follow the superpowers workflow:

1. Write the design spec at
   docs/superpowers/specs/2026-06-10-maturity-scorecard-lead-magnet-design.md
   using the house template (Summary → Settled decisions → Architecture
   component-by-component → Testing/TDD per task → What's NOT in this sprint
   → File touch list → Decisions locked). Mirror the structure of my prior
   specs in the RevOps Coaching App repo (the benchmark-relative scoring spec
   and the report KPI display spec — both dated 2026-06-08).

2. Stop after the spec is written and present it for sign-off before you
   write the implementation plan.

3. After spec sign-off: implementation plan, then TDD execution per task.

Reference material you can read directly from my local filesystem:
- Phase B framework spec: my Modern BizOps Reference folder, "Modern BizOps
  Revenue Operations Maturity Framework.md"
- Phase A research and Phase B design brief: same folder
- Benchmark file (the source of truth for peer comparisons):
  ~/RevOps Coaching App/.claude/worktrees/wizardly-kirch-2a4eed/server/src/lib/businessModelBenchmarks.js
- Industry benchmarks (admin-only, do NOT use for client-facing copy):
  ~/RevOps Coaching App/.claude/worktrees/wizardly-kirch-2a4eed/server/src/lib/industryBenchmarks.js
- Sprint 30.5 benchmark-relative scoring spec (for workflow + the
  classifyAgainstBenchmark helper to mirror):
  ~/RevOps Coaching App/.claude/worktrees/wizardly-kirch-2a4eed/docs/superpowers/specs/2026-06-08-benchmark-relative-scoring-design.md
- Report KPI display spec (for the result page's "Your number / Peer median /
  comparison badge" shape):
  ~/RevOps Coaching App/.claude/worktrees/wizardly-kirch-2a4eed/docs/superpowers/specs/2026-06-08-report-kpi-benchmark-display-design.md

Voice rules are strict: first-person Bradley ("I", "you"), no em-dashes
anywhere, no "we/our/us" in user-facing copy, loss-framed dollar copy on
peer-comparison ROI lines. The handoff doc spells these out.

Do not write code until the design spec is signed off.
```

---

# Context

## What this is

A new lead magnet replacing the existing `/scorecard` page in this repo. The new scorecard implements the **Phase B 44-competency, 4-stage maturity framework** with peer-anchored ROI calculations sourced from `businessModelBenchmarks.js v1.1`. It is the marketing-site funnel into the paid Modern BizOps Maturity Assessment.

## What it replaces

The existing `/scorecard` page (committed to this repo) promotes the deprecated 17-question, 7-dimension diagnostic that lives on `app.modernbizops.com/scorecard`. Per the Phase B Design Brief: "The codebase migrates to the new architecture; the new architecture does not conform to the existing codebase." Same-route replacement was approved (option a from the design discussion).

## Where it sits in the funnel

- **Inbound:** From outbound LinkedIn posts, ads, email signatures, podcast appearances, partner newsletters. UTMs per the v1.1 taxonomy. Detail in the UTM convention section below.
- **Outbound from scorecard result:** Single CTA into `/watch`, which already has a HubSpot meeting embed for the discovery call. No segmentation. No segment-based offer routing.
- **CRM:** Email-gate at result reveal creates/updates a HubSpot contact and a deal in the **RevOps Coaching** pipeline (`2172760768`) at the **New Lead** stage (`3477396169`). Existing UTM persistence layer (`lib/utm.js`, `components/UtmCapture.jsx`) forwards inbound attribution to the contact properties already defined in `lib/hubspot.js`.

---

# Decisions locked (signed off in the design session)

## Framework alignment
- **Framework:** Modern BizOps Phase B Revenue Operations Maturity Framework v1.0
- **44 competencies across 4 stages:** Reactive (Stage 1), Repeatable (Stage 2), Predictable (Stage 3), Compounding (Stage 4)
- **Free scorecard probes 9 of 44 competencies** sampled at the three stage boundaries

## Quiz structure
- **16 questions total** across 3 sections (15 always-shown + 1 conditional)
- **Section 1 (3 quick segmentation Qs):** revenue band, business model, team size
- **Section 2 (9 maturity Qs):** the diagnostic
- **Section 3 (3 financial Qs):** deal value, sales cycle, churn (churn is conditional on business model)
- **Email gate after Q15:** "Where should I send your scorecard?" — sees result on screen + PDF emailed
- **Section progress indicator** ("Section X of 3 — [name]") above each section, not a question counter

## Scoring
- **Each maturity question option scores 1-4** (Absent, Informal, Functional, Managed)
- **Weakest-link placement rule** matches the framework's own "A client scoring below 3.0 on any Stage 1 competency starts there" guidance
- See [Stage Placement Logic](#stage-placement-logic) section for the exact rule

## ROI calculations
- **Source of truth:** `businessModelBenchmarks.js v1.1` (the file Bradley owns; cited in result page footers)
- **Three peer-comparable dollar ROI lines + one peer-comparable peer-gap line (no dollar)**
- Up to three render per result, ranked by dollar magnitude
- Conservative range (band-low to band-median target), not single point
- Loss-framed copy ("leaving on the table," "losing every year," "not capturing")
- `industryBenchmarks.js` is admin-only per its own header and is **NOT** used here

## Result page order (inverted from the v1 draft)
1. **The number** (loss-framed dollar headline — first thing on screen)
2. **How I got there** (three peer-anchored ROI lines)
3. **Why this is happening** (stage placement + boundary diagnosis)
4. **What you're doing right** (bright spots)
5. **What this scorecard can and can't tell you** (honesty disclosure)
6. **The CTA** (4-line offer card → `/watch`)

## Voice and copy rules
- **First-person Bradley** ("I'd fix this first," "what you told me")
- **No em-dashes anywhere** (text will reach the email/PDF path; matches the lint:voice rule in the RevOps Coaching App)
- **No "we/our/us"** in user-facing copy
- **Loss-framed dollar copy** on every peer-comparison ROI line
- **Sources cited** ("Source: businessModelBenchmarks v1.1, professional services row") under every dollar number

## Routing and CRM
- **Single offer.** Q2 business model does NOT route to different offers or pipelines
- **CTA destination:** `/watch` (existing HubSpot meeting embed already there for the discovery call)
- **HubSpot pipeline:** RevOps Coaching (`2172760768`) — already in `lib/hubspot.js` as `REVOPS_PIPELINE_ID`
- **HubSpot entry stage:** New Lead (`3477396169`) — to be added as a new constant `SCORECARD_NEW_LEAD_STAGE` alongside the existing `DISCOVERY_CALL_BOOKED_STAGE = "3477396170"` (the IDs are sequential, one digit apart; same pipeline, different stages)
- **Route strategy:** Replace existing `/scorecard` with new design (option a). App-side `app.modernbizops.com/scorecard` migration is a separate concern in the RevOps Coaching App repo

## UTM convention (per v1.1 taxonomy already documented in this repo)
- **No UTMs on internal navigation.** The result page CTA to `/watch` is a clean `Link href="/watch"`. Cross-domain tracking carries first-touch attribution per the existing convention documented in `app/scorecard/page.js` lines 32-44.
- **Inbound traffic to `/scorecard`:** uses the standard 5-tag schema with `utm_campaign=maturity-scorecard` as the constant rollup. Detail in the [UTM Convention](#utm-convention) section.

## Deferred (not in this sprint)
- **Post-conversion email follow-up sequence.** Sketched as a 3-email sequence; deferred to its own sprint.
- **Published pricing on the CTA card.** Current CTA is "Schedule the call" into `/watch` (fit-call). Published price is the future-state once Bradley confirms the offer pricing.
- **A/B test variants.** Not in this sprint.
- **PDF templating engineering.** PDF export of the result page IS in this sprint (the email needs an attachment); the design uses a leaner React-PDF render unless the existing `reportPdf.js` infrastructure from the RevOps Coaching App can be ported.

---

# Reference Material the Local Session Should Read

These files live on Bradley's local machine and the local Claude session can read them directly. The remote session that designed this work could not.

| File | Why it matters |
|---|---|
| Phase B Framework spec | The 44 competencies, 4 stages, scoring rubrics, engagement scope guidance. Source of truth for all framework references. |
| Phase A Research | Source for the third-party benchmarks that informed Phase B. **Not** used for client-facing copy (peer benchmarks come from `businessModelBenchmarks.js`). |
| Phase B Design Brief | The ICP (Marcus Chen), the three-tier assessment architecture, the engagement design principles. Source for the Marcus Chen mirror line on the landing page. |
| `businessModelBenchmarks.js` (RevOps Coaching App) | **The source of truth** for every peer-comparison ROI line. 8 business models × 4 metrics. Each metric carries `direction`, `median`, `range`, `unit`, `source`, `asOf`, `confidence`. The local session should import the file and call `getBusinessModelBenchmark()` and `classifyAgainstBenchmark()` if those helpers can be reused, OR mirror the data structure into this repo if cross-repo import is impractical. |
| Sprint 30.5 spec | The workflow template + the `classifyAgainstBenchmark` band logic to mirror. |
| Sprint KPI display spec | The exact "Your number: X / Peer median: Y / [comparison badge]" shape to mirror in the result page, plus direction-aware `comparisonCopy` table. |

---

# The Complete v2 Design

## Landing page

### Above the fold

**Headline:**

> In five minutes, find the dollar amount your operating system is leaving on the table this year, and the one gap I would fix first if you were my client.

**Sub-headline (Marcus Chen mirror — lifted from Phase B Design Brief):**

> This scorecard is for B2B founders who feel like every dollar of revenue growth requires another hire.

**CTA button:** Find your number

### Below the fold

Three short paragraphs. No testimonials, no logos. Credibility framing only:

> **What you'll get back.** A maturity stage placement against the 44-competency framework I use with paying clients, the dollar gap between you and peers in your business model on three specific metrics (revenue per employee, sales cycle velocity, retention), and the one operational gap I'd attack first.
>
> **What I'm comparing you against.** Real benchmark numbers sourced from named public reports (The Bridge Group, SaaS Capital, Optifai, Deltek, Recurly, others), keyed to your business model so the comparison is to peers like you, not to a generic SMB blend. Sources cited next to every number.
>
> **What this isn't.** This is a directional read from sixteen questions. It is not the full assessment I run with paying clients, which connects to your CRM and revenue tools and scores all 44 competencies. If the numbers below feel right, that's the signal to take the next step.

---

## The scorecard

> **Section 1 of 3 — About your business**
> *Three taps so I know who I'm comparing you to.*

### Q1. Annual revenue

`< $1M  /  $1M to $3M  /  $3M to $7M  /  $7M to $15M  /  > $15M`

### Q2. Which best describes how your business sells?

*This keys every peer comparison in your result.*

- **B2B SaaS** — recurring subscription software sold to other businesses
- **Professional services** — consulting, agency, or done-for-you work for other businesses
- **B2B product** — physical product or non-subscription software sold to other businesses
- **E-commerce** — direct-to-consumer product sales
- **B2C services** — services sold to consumers
- **B2C subscription** — recurring subscription product sold to consumers
- **Marketplace** — connecting two sides of a transaction
- **Other / mixed**

Maps directly to the `BusinessModel` enum in `businessModelBenchmarks.js`.

### Q3. Total team size

`Just me  /  2 to 10  /  11 to 25  /  26 to 50  /  51 to 75  /  75+`

---

> **Section 2 of 3 — Your operating system**
> *Now the diagnostic. Nine questions about how your business actually runs.*

**Personalization rule:** every Section 2 question prefaces with a peer-anchoring sentence using `{model_label}` from `getBusinessModelBenchmark(q2_answer).label`.

### Q4. CRM Architecture (Competency #3)

*Most {model_label} founders at your revenue level run on a CRM. The question is whether the team actually uses it.*

**How do the people who touch customers in your business track deals right now?**

- **A.** There is no CRM, or our deal information lives in email, spreadsheets, or my head. *[1]*
- **B.** We have a CRM, but it gets used inconsistently and the data is patchy. *[2]*
- **C.** Everyone who touches customers uses the CRM, and the basics are reliable. *[3]*
- **D.** The CRM is governed. Required fields are enforced by stage, and the data model is reviewed against how the business actually runs. *[4]*

### Q5. ICP and Lead Qualification (Competencies #1 and #6)

*The most expensive deals are the ones you should have disqualified.*

**When a new lead comes in, how does your team decide whether to pursue it?**

- **A.** Anyone willing to talk to us. We chase what's in front of us. *[1]*
- **B.** We use sales judgment. Different people on the team would make different calls and we accept that. *[2]*
- **C.** We have a documented ideal-customer profile and qualification criteria the team uses on every new lead. *[3]*
- **D.** Those criteria are encoded in our CRM scoring and validated against close rates. We disqualify confidently. *[4]*

### Q6. Pipeline Stage Design (Competency #5)

*Most {model_label} pipelines I see fail here: stage names exist, exit criteria do not.*

**What has to be true for a deal to move from one stage to the next in your pipeline?**

- **A.** Whatever the rep working the deal feels is right. *[1]*
- **B.** We have custom stage names that fit our process, but no documented criteria for advancement. *[2]*
- **C.** Each stage has documented exit criteria written as buyer-verified facts, not sales activities. The team uses them. *[3]*
- **D.** Those exit criteria are encoded as required CRM fields. A deal cannot advance without them. *[4]*

### Q7. Revenue Forecasting (Competency #7) — reframed to be observable

*This question is about predictability, not the existence of a spreadsheet.*

**When a quarter ends, how often does your actual revenue match what you expected at the start of the quarter?**

- **A.** Honestly, I do not produce a forecast at the start of the quarter. *[1]*
- **B.** The gap is usually large. We are off by more than thirty percent more often than not. *[2]*
- **C.** We are usually within twenty percent. The methodology is documented. *[3]*
- **D.** We consistently stay under fifteen percent variance, and we produce multiple views (best, commit, worst). *[4]*

### Q8. Operating Cadence and Reporting (Competencies #8 and #20) — consolidated

*This is the Stage 3 boundary. Stage 3 businesses have a defined cadence and they trust the dashboards. Stage 2 businesses argue about the numbers.*

**When your leadership team sits down to talk about revenue, what usually happens?**

- **A.** We do not have regular revenue reviews. We talk about revenue when something is wrong. *[1]*
- **B.** We meet, but the agenda varies. Meetings often start by debating which numbers are right. *[2]*
- **C.** We run a defined cadence with trusted dashboards. Meetings start with questions about what the data means, not whether it is right. *[3]*
- **D.** Dashboards populate before each meeting. Anomalies are investigated and resolved within days. Decisions are tracked and followed up. *[4]*

### Q9. Shared Revenue Definitions (Competency #13)

*The single most common alignment debate I see in {model_label} businesses.*

**If you asked your marketing lead and your top salesperson what "a qualified lead" is, would you get the same answer?**

- **A.** Honestly, I am not sure either of them could give me a clean answer. *[1]*
- **B.** Yes-ish, but they would debate it. The definition is verbal, not documented. *[2]*
- **C.** Yes. The definition is documented, shared, and both functions use it. *[3]*
- **D.** The definition is encoded in the CRM, the marketing-to-sales SLA is monitored weekly, and both functions are accountable to it. *[4]*

### Q10. Win/Loss Analysis (Competency #25)

*Most {model_label} businesses I work with believe they lose on price. The data usually says otherwise.*

**When you lose a deal, how do you find out why?**

- **A.** We assume it was price, fit, or timing. We move on. *[1]*
- **B.** Reps fill in a CRM dropdown, but the entries are inconsistent and we rarely look at them. *[2]*
- **C.** We run a quarterly win/loss review with coded reasons and use the findings to update the playbook. *[3]*
- **D.** Someone other than the AE interviews lost prospects. The findings update qualification criteria, positioning, and enablement on a defined cadence. *[4]*

### Q11. Expansion and NRR (Competencies #29 and #30)

*For {model_label} businesses with retention dynamics, this is where compound growth comes from.*

**In the last twelve months, how much of your revenue growth came from expanding existing clients vs. winning new ones?**

- **A.** Not sure. I don't track that distinction. *[1]*
- **B.** Almost all of it is new logos. Expansion happens when clients ask. *[2]*
- **C.** We track new vs. expansion, and some expansion happens, but it is not a managed motion with defined plays. *[3]*
- **D.** Expansion is a proactive motion with defined triggers. Net revenue retention is tracked monthly and is a primary business metric. *[4]*

### Q12. Leading Indicators (Competency #40)

*This is the Stage 4 boundary. Stage 4 businesses act on signals. Stage 3 businesses react to results.*

**When something is about to break in your revenue engine, how do you usually find out?**

- **A.** When we miss the number. *[1]*
- **B.** At the end-of-quarter review. *[2]*
- **C.** Our pipeline review surfaces problems mid-quarter, sometimes earlier. *[3]*
- **D.** Leading indicators alert us before the lagging metric moves. We act on signals, not surprises. *[4]*

---

> **Section 3 of 3 — Your numbers**
> *Three numbers about your business so I can put dollars on the gap. Bands, not exact figures.*

### Q13. Average value of a new closed deal

`< $5K  /  $5K to $25K  /  $25K to $100K  /  > $100K`

### Q14. Average sales cycle (first qualified conversation to closed-won)

`Not sure / I don't track this  /  < 30 days  /  30 to 90 days  /  90 to 180 days  /  > 180 days`

### Q15. Annual gross revenue churn — CONDITIONAL

Show only if `q2 ∈ {B2B_SAAS, PROFESSIONAL_SERVICES, B2C_SERVICES, B2B_SUBSCRIPTION, B2C_SUBSCRIPTION, MARKETPLACE, OTHER}`. Hide for `{B2B_PRODUCT, ECOMMERCE}` where churn is not the operative metric.

**What percentage of recurring revenue do you lose per year before any expansion?**

`Not sure / I don't track this  /  < 5%  /  5% to 15%  /  15% to 30%  /  > 30%`

---

## Email gate (immediately after Q15)

**Form copy:**

> **Where should I send your scorecard?**
>
> You'll see your results on screen now, and I'll email you a PDF copy you can share with your team.

Fields: First name, Email, Company.

**Trust footer beneath the form:**

> I'll send you your scorecard and one follow-up note. No newsletter, no drip sequence. You can ask for your data to be deleted at any time.

**Submit button:** Show me my number

---

## Stage placement logic

```
stage_signal = score of each selected option for Q4..Q12 (the 9 maturity questions)

if min(Q4..Q6) < 3:
    placement = Stage 1 (Reactive)
elif min(Q7..Q9) < 3:
    placement = Stage 2 (Repeatable)
elif min(Q10..Q12) < 4:
    placement = Stage 3 (Predictable)
else:
    placement = Stage 4 (Compounding)
```

**Rationale:** Matches the framework's own "A client scoring below 3.0 on any Stage 1 competency starts there, regardless of scores elsewhere" rule from Engagement Scope Guidance. Same threshold (3) applies to Block B (Stage 2 competencies are prerequisites for Stage 3). Block C uses a threshold of 4 (Managed) because Stage 4 = "the system improves itself," which is what the Managed rubric level means in those Stage 3 competencies.

**Stage names and descriptors** are pulled verbatim from the Phase B Framework spec. Do not rewrite.

---

## Result page

### Section 1 — The number (first thing on screen)

Template:

> # Your operating system is leaving between {floor_dollars} and {median_dollars} on the table this year.
>
> That's the gap between where you sit today and where {model_label} peers in your revenue range operate. The conservative read is {floor_dollars} per year. The peer-median read is closer to {median_dollars}.
>
> Here is exactly how I got there.

Where:
- `floor_dollars` = sum of the conservative-end (band edge) calculations for each ROI line that fires
- `median_dollars` = sum of the median-target calculations

### Section 2 — The math (up to 3 ROI lines)

Each line uses the exact display shape from the Sprint 30.5/30.6 KPI display spec. Per ROI line:

```
[ROI line title]

Your number: {client_value} {unit}
Typical {model_label} peer: {peer_median} {unit} (typical band {range_low} to {range_high})
{direction_aware_badge_copy}  ← color-keyed: green=meets, amber=partial, copper=fails

{Loss-framed body paragraph with the dollar range and the why}

Source: businessModelBenchmarks v1.1, {model_label} row.
```

**The four ROI line generators (engine selects up to 3 by dollar magnitude per client):**

#### Revenue per employee gap (always fires when Q1 + Q3 answered)

- `client_value` = midpoint of Q1 revenue band / midpoint of Q3 team size band
- Peer benchmark: `benchmark.metrics.revenuePerEmployee`
- `floor_dollar` = max(0, `range_low` - `client_value`) × team_count
- `median_dollar` = max(0, `median` - `client_value`) × team_count
- Loss-framed close: "You are leaving between {floor} and {median} of annual revenue uncaptured every year without needing to hire a single new person. This is the inversion of the problem most founders in your position describe: every dollar of revenue growth requiring another hire."

#### Sales cycle compression (fires when Q14 ≠ "Not sure" AND client value is in `partial` or `fails` band)

- `client_value` = midpoint of Q14 band (e.g., "90 to 180 days" → 135)
- Peer benchmark: `benchmark.metrics.salesCycleDays`
- Throughput ratio for "compress to band high (`range_high`)": `client / range_high - 1`
- Throughput ratio for "compress to median": `client / median - 1`
- `floor_dollar` = throughput_to_range_high × current_revenue
- `median_dollar` = throughput_to_median × current_revenue
- Loss-framed close: "At your revenue, that is between {floor} and {median} of incremental closed revenue you are not capturing this year."

#### NRR / retention gap (fires when Q15 answered and not "Not sure" AND client value is in `partial` or `fails` band)

- `client_value` = 1.0 - (midpoint of Q15 churn band) (e.g., "15% to 30%" → churn 22.5% → NRR ≈ 0.775)
- Peer benchmark: `benchmark.metrics.nrr`
- `floor_dollar` = (range_low - client_value) × current_revenue
- `median_dollar` = (median - client_value) × current_revenue
- Loss-framed close: "You are losing between {floor} and {median} of revenue every year before you even start trying to grow."

#### Lead response peer gap (peer comparison only, no dollar)

Bradley's `businessModelBenchmarks.js` carries `leadResponseDays` but does NOT carry a "% conversion lost per day of delay" coefficient. Computing a dollar number requires third-party research outside Bradley's benchmark provenance. So this line shows the peer gap and frames the lever, without claiming a specific dollar.

This line currently does NOT have a quiz input that triggers it. It is a candidate for future inclusion if a lead-response-time question is added; for v1 it is documented but not implemented.

**Magnitude ranking:** when all three eligible lines fire, the engine sums `median_dollar` per line and ranks descending, then surfaces the top 3 (which is all of them in v1 since there are only three dollar-bearing lines).

### Section 3 — Why this is happening (stage placement + boundary diagnosis)

Template:

> ## This is happening because you are at Stage {N}: {Stage Name}.
>
> {Stage descriptor verbatim from framework spec}
>
> The specific reason I am placing you at Stage {N} instead of Stage {N+1} is what you told me about {two competencies in the failing block, named in plain language}. {One sentence explaining how those weaknesses translate to the dollar gap above.}

### Section 4 — Bright spots

Find any answer scoring strictly higher than the placement stage. Surface up to 2.

Template:

> ## What you're doing right
>
> {Description of the bright-spot answers, framed as a foundation for the work ahead.}

### Section 5 — Honesty disclosure

Static copy:

> ## What this scorecard can and can't tell you
>
> This is a directional read from sixteen questions. It tells you which stage of the maturity ladder you sit on, where you stack up against peer benchmarks on the three metrics I can compute from your inputs, and the boundary you need to cross next. It does not replace the full assessment, which connects to your CRM and revenue tools, scores all 44 competencies, and produces the specific roadmap from where you are to the business outcome you want.
>
> If the numbers above feel directionally right, that is the signal to take the next step.

### Section 6 — CTA (4-line offer card)

Static copy:

> ## The Modern BizOps Maturity Assessment
>
> What you get:
> - Automated analysis of your CRM and revenue tools
> - All 44 competencies scored, not just nine
> - A 90-minute working session with me to walk you through it
> - A 12-week operational roadmap mapped to your stated business outcome
>
> Start with a 20-minute fit call to see if it makes sense for your business.
>
> **[ Schedule the call → ]** linking to `/watch`

Future iteration once Bradley publishes pricing: swap the fit-call CTA for a direct Stripe checkout button.

---

## UTM convention

### Outbound to `/watch` (CTA from result page)

**No UTMs.** Per the v1.1 standard already documented inline in `app/scorecard/page.js` lines 32-44: internal navigation does not get UTM'd. The button is a clean `<Link href="/watch">`. Cross-domain tracking (and same-domain session continuity) preserve attribution.

### Inbound to `/scorecard`

Standard 5-tag schema with **`utm_campaign=maturity-scorecard`** as the constant rollup so all scorecard attribution rolls up cleanly in HubSpot regardless of channel.

```
https://modernbizops.com/scorecard?utm_source={SOURCE}&utm_medium={MEDIUM}&utm_campaign=maturity-scorecard&utm_content={CONTENT}
```

| Channel | `utm_source` | `utm_medium` | `utm_content` (varies) |
|---|---|---|---|
| LinkedIn organic | `linkedin` | `social` | `founder-post-1`, etc. |
| LinkedIn paid | `linkedin` | `paid_social` | `video-ad-a`, etc. |
| Email signature | `email-signature` | `email` | `bradley-sig` |
| Outbound email | `bradley-outbound` | `email` | `cold-1`, `nurture-1` |
| Podcast | `{podcast-slug}` | `podcast` | `show-notes`, etc. |
| Partner newsletter | `{partner-slug}` | `partner-email` | `{issue-date}` |
| Twitter / X | `twitter` | `social` | `thread-1` |
| YouTube | `youtube` | `video` | `{video-slug}` |

**Three rules:**
- `utm_campaign` stays `maturity-scorecard` everywhere
- `utm_source` is the platform, not the publisher
- No UTMs on links from this site to itself

The existing inbound capture in `lib/utm.js` + `components/UtmCapture.jsx` already handles persistence and forwarding to HubSpot contact properties. No changes needed to that layer.

---

# Engineering Touch List

These are the files the implementation plan will need to address. Suggested ordering:

## New files

```
docs/superpowers/specs/2026-06-10-maturity-scorecard-lead-magnet-design.md   # the spec the local session writes first
docs/superpowers/plans/2026-06-10-maturity-scorecard-lead-magnet-plan.md     # the implementation plan
app/scorecard/page.js                                                        # REPLACE existing
app/scorecard/quiz/page.js                                                   # the quiz flow (client component)
app/scorecard/result/page.js                                                 # the result reveal (server component reading scored result)
app/api/scorecard/submit/route.js                                            # final submit: email gate, HubSpot upsert, deal creation
components/scorecard/QuizFlow.jsx                                            # multi-step quiz client component
components/scorecard/QuestionCard.jsx                                        # individual question render
components/scorecard/SectionHeader.jsx                                       # "Section X of 3" progress
components/scorecard/EmailGateForm.jsx                                       # the email capture
components/scorecard/RoiLine.jsx                                             # the "Your number / Peer median / badge" row, mirrors the KPI display spec
components/scorecard/CtaCard.jsx                                             # the 4-line offer card
lib/scorecard/questions.js                                                   # the 16 questions + options + score map
lib/scorecard/scoring.js                                                     # stage placement logic + per-question score extraction
lib/scorecard/businessModelBenchmarks.js                                     # either a copy of Bradley's file or a re-export; see note below
lib/scorecard/roi.js                                                         # the four ROI line generators (revenue-per-employee, cycle, NRR, lead-response peer-gap)
lib/scorecard/resultRender.js                                                # assembles the result page sections from inputs + benchmark lookups
lib/scorecard/voice.js                                                       # the static voice strings (loss-framed templates, comparison badge copy)
public/og/og-scorecard.png                                                   # already exists; reuse or refresh
__tests__/scorecard/scoring.test.js                                          # placement logic per the rule above
__tests__/scorecard/roi.test.js                                              # each ROI generator against fixture inputs
__tests__/scorecard/resultRender.test.js                                     # full result-page assembly snapshot
```

## Modified files

```
lib/hubspot.js                  # add SCORECARD_NEW_LEAD_STAGE = "3477396169"; add createScorecardLead() helper
README.md                       # optional: a short pointer to the scorecard funnel
```

## Files to consider deleting or redirecting

```
app/scorecard/page.js (existing) # REPLACED in place; old content discarded
```

## Cross-repo consideration: the benchmark file

Two options for sourcing `businessModelBenchmarks.js v1.1` in this repo:

**Option A — copy the file.** Vendor `businessModelBenchmarks.js` into `lib/scorecard/businessModelBenchmarks.js` (lightly adapted to remove `industryOverrides` plumbing if not used here). Pros: no cross-repo dependency, deterministic builds, clear provenance per the version stamp. Cons: when Bradley updates the benchmark file in the RevOps Coaching App, this repo's copy goes stale until manually re-synced. Mitigation: version stamp + a comment at the top documenting the sync procedure.

**Option B — npm package.** Publish `@modern-bizops/benchmarks` (private npm package) from the RevOps Coaching App repo, install here. Pros: single source of truth, version-pinned upgrades. Cons: significantly more engineering, requires private npm setup, slows iteration.

**Recommendation: Option A for v1.** The benchmark version is `1.1` and changes infrequently per the v1.1 file's own update path notes ("re-curate a number → bump `BUSINESS_MODEL_BENCHMARK_VERSION`. The change is a one-line diff reviewed with its source/asOf inline"). Manual sync at version bumps is acceptable. Document the sync procedure in `lib/scorecard/businessModelBenchmarks.js` header comment.

## PDF generation

The email gate promises a PDF copy. Three rendering options ranked by effort:

1. **Puppeteer / headless Chrome** rendering the result page route to PDF on the server. Cleanest visual fidelity. Heaviest dependency.
2. **React-PDF (`@react-pdf/renderer`)** with a hand-built PDF document component that mirrors the on-screen result. Moderate effort. Already a common pattern in Next.js.
3. **Skip PDF for v1, deliver via plain-text + linked web result URL.** Saves engineering. Loses the "shareable artifact" benefit Bradley specifically wanted.

**Recommendation:** React-PDF for v1. The result page is already structured in sections that map cleanly to PDF page components. Snapshot test the PDF render against fixtures to catch regressions.

## Tests

Per the TDD discipline of the superpowers workflow, every task in the plan should ship with:

- **Unit tests:** scoring logic, ROI generators, result assembly
- **Snapshot tests:** result page JSX, PDF render
- **Route tests:** `/scorecard` lands, `/api/scorecard/submit` upserts contact + creates deal in the right pipeline/stage with UTM properties carried through

Mirror the test file naming convention used in the RevOps Coaching App (`__tests__/maturityScoring.X.test.js` style) where it makes sense; here, Next.js convention is to colocate tests under `__tests__/` or alongside.

---

# Open Items

## Things still needed from Bradley

1. **Confirm benchmark file sourcing strategy** (copy vs. npm package — recommendation in this doc is copy).
2. **Confirm PDF generator choice** (recommendation is React-PDF).
3. **Confirm the existing `/scorecard` page can be replaced** (already confirmed in the design session — option a).
4. **Optional:** future-state CTA — swap fit-call for published-price Stripe checkout. When?

## Future sprints

- **Post-conversion email sequence** (3-email arc: PDF copy + personal note, day-2 "if this stood out, here's what I'd do first," day-5 "two ways to take this further")
- **A/B test variants** on landing page promise, on CTA copy, on result-page headline framing
- **Lead-response time question + dollar conversion** once Bradley sources a defensible conversion-loss coefficient
- **Migration of the app-side `app.modernbizops.com/scorecard`** to the Phase B framework (separate repo, separate sprint)

---

# Voice Rules (Strict — Enforce in Linting)

These rules apply to all client-facing copy. Mirror the `npm run lint:voice` rule from the RevOps Coaching App if practical.

1. **First-person Bradley.** "I'd fix this first." "Here is what you told me." Never "we" or "our" or "us" in user-facing copy.
2. **No em-dashes.** Use commas, semicolons, periods, or "and" / "but". This includes copy that will reach the email or PDF path (which is all of it).
3. **Loss framing on dollar copy.** "You are leaving $X on the table" beats "Closing the gap adds $X." Use loss verbs: "leaking," "losing," "leaving uncaptured," "not capturing."
4. **Source citation on every benchmark dollar.** `Source: businessModelBenchmarks v1.1, {model_label} row.` Cite the version stamp from the file.
5. **No false precision.** Use bands and ranges ("between $X and $Y"), not single-point numbers. Honest about being directional.
6. **Honesty disclosure is not optional.** The "what this can and can't tell you" section stays in.

---

# Scoring Reference (for spec-writing)

## Stage signals from question answers

Every maturity question (Q4 through Q12) has 4 options labeled A through D. Score mapping:

| Option | Score | Maturity level (framework rubric) |
|---|---|---|
| A | 1 | Absent |
| B | 2 | Informal |
| C | 3 | Functional |
| D | 4 | Managed |

Score 5 (Optimized) is not testable from a free 16-question quiz and is deliberately excluded.

## Stage placement

See [Stage Placement Logic](#stage-placement-logic). Pseudocode reproduced here for completeness:

```
let A = [Q4.score, Q5.score, Q6.score]    // Stage 1 → 2 boundary block
let B = [Q7.score, Q8.score, Q9.score]    // Stage 2 → 3 boundary block
let C = [Q10.score, Q11.score, Q12.score] // Stage 3 → 4 boundary block

if (Math.min(...A) < 3) stage = 1
else if (Math.min(...B) < 3) stage = 2
else if (Math.min(...C) < 4) stage = 3
else stage = 4
```

## Why the asymmetric threshold

Blocks A and B test Stage 1/2 competencies whose Functional level (score 3) IS the boundary cross. Block C tests Stage 3 competencies whose Managed level (score 4) IS the Stage 4 boundary cross. This matches the framework's stage entry criteria verbatim.

## Band midpoints for ROI calculations

| Question | Band | Midpoint used |
|---|---|---|
| Q1 revenue | `<$1M` | $750K |
| Q1 revenue | `$1M to $3M` | $2M |
| Q1 revenue | `$3M to $7M` | $5M |
| Q1 revenue | `$7M to $15M` | $11M |
| Q1 revenue | `>$15M` | $20M (conservative) |
| Q3 team size | `Just me` | 1 |
| Q3 team size | `2 to 10` | 6 |
| Q3 team size | `11 to 25` | 18 |
| Q3 team size | `26 to 50` | 38 |
| Q3 team size | `51 to 75` | 63 |
| Q3 team size | `75+` | 90 (conservative) |
| Q13 deal value | `<$5K` | $2.5K |
| Q13 deal value | `$5K to $25K` | $15K |
| Q13 deal value | `$25K to $100K` | $62.5K |
| Q13 deal value | `>$100K` | $200K (conservative) |
| Q14 cycle | `<30 days` | 20 |
| Q14 cycle | `30 to 90 days` | 60 |
| Q14 cycle | `90 to 180 days` | 135 |
| Q14 cycle | `>180 days` | 240 (conservative) |
| Q15 churn | `<5%` | 2.5% → NRR 0.975 |
| Q15 churn | `5% to 15%` | 10% → NRR 0.90 |
| Q15 churn | `15% to 30%` | 22.5% → NRR 0.775 |
| Q15 churn | `>30%` | 40% → NRR 0.60 (conservative) |

"Conservative" on the open-ended high bands means: use the lower realistic value so the ROI numbers don't get inflated by unbounded assumptions.

---

# Acknowledgments and Provenance

This work was designed in a remote Claude Code on the web session with Bradley de Wet (founder, Modern BizOps) on 2026-06-10. All decisions in this document are direct sign-offs from that session; the local session executing the implementation should treat this as the design contract.

The framework references are from the Modern BizOps Phase B Revenue Operations Maturity Framework v1.0 (June 2026, authored by Bradley). The benchmark file references are from Sprint 30.5 of the RevOps Coaching App (`businessModelBenchmarks.js v1.1`). Voice rules align with the existing `lint:voice` rule in the RevOps Coaching App repo.

---

*End of handoff.*
