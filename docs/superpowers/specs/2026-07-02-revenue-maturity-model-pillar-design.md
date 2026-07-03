# Revenue Operations Maturity Model — Cornerstone Pillar Page

**Date:** 2026-07-02
**Status:** Design approved in brainstorming; pending user review before planning
**Author:** Bradley de Wet (with Claude)
**Repo:** modern-bizops-website (Next.js 15 App Router, JSX, Tailwind v4, Vercel)

---

## 1. Purpose

Turn the internal maturity-model visual (`maturity-model.html`, built for Riverside screenshare) into a public **cornerstone pillar page** on modernbizops.com. The page teaches the Revenue Operations Maturity Model in depth so a founder understands the methodology behind the engagement, and routes them to the scorecard to get their own score.

It does two jobs at once:
1. **Sales credibility** — the founder sees a rigorous, named framework and how each competency is measured.
2. **SEO cornerstone** — a long, structured, internally-linked hub that anchors a future topic cluster.

This session builds the pillar. It does **not** build the blog, spoke pages, or the on-site A/B middleware (see Deferred Scope).

---

## 2. Locked decisions (from brainstorming)

| Decision | Choice | Why |
|---|---|---|
| Container | New page in the Next.js site (not the standalone HTML) | It must be responsive, scrollable, mobile-friendly, SEO-indexable |
| IA | Single cornerstone **pillar** now; cluster grows beneath it; blog deferred | Zero-authority domain must concentrate authority, not spread it thin |
| Pillar vs scorecard | Pillar teaches; **`/scorecard` is the CTA** | Clean teach-vs-measure split; reuses the existing scorecard |
| Front door | **Problem-language** hero; framework named as the mechanism inside | Buyers ($3M–$50M founders) don't search "revenue operations"; they feel the problem |
| Hero build | **Variant-ready** (config-driven, multiple hooks), instrumented | Enables parallel LinkedIn/paid message testing without a rebuild |
| Launch slug | `/predictable-revenue-engine` (301-changeable later) | Neutral problem-outcome; complements homepage; doesn't over-commit a message track |
| Detail interaction | **Inline expand** on the pillar, anchor-linkable | Keeps one SEO-rich page; any competency can graduate to a spoke later |
| Tool naming | **Name real brands, adapted per competency** by data source | Concrete, credible, signals real tool fluency |
| Scope | **All 44** competencies (40 core + 4 model-specific) | Complete framework |
| Theme | Site's **light cream/navy/amber** theme | Matches the live site, not the dark presentation deck |

### SEO rationale (evidence)
- Search Console: modernbizops.com has ~2 impressions in 6 months → new-domain, no authority.
- "revenue operations / revops maturity model" SERP is owned by Gartner, Outreach, Varicent, RevPartners, Revenue Enablement Institute → unwinnable near-term **and** wrong persona (enterprise RevOps practitioners, not founders).
- Founder problem-language ("grow revenue without adding headcount," "make my business run without me," "predictable sales pipeline") is winnable long-tail and the right persona.
- Therefore: "Revenue Operations" stays as the **framework/brand name** (branded search, credibility) but is **not** an acquisition keyword. Acquisition comes from problem-language hooks + future problem-language spokes.

---

## 3. Positioning & voice guardrails (hard constraints)

- **Audience:** founder-led B2B, $3M–$50M, any business model. Never narrow to "services"/"SMB". (`positioning.md`)
- **Message tracks:** rational ("grow revenue without adding headcount") has SEO equity — protect it. Emotional ("runs without you") is in test — do not globally commit it. The launch slug is deliberately neutral to avoid picking a track prematurely.
- **Voice:** first-person Bradley, founder-to-founder, direct. Match `lib/scorecard/voice.js` conventions.
- **No em dashes** anywhere (copy, comments, commits). Hard rule.
- **Vocabulary consistency:** reuse scorecard business-model labels (`BUSINESS_MODEL_OPTIONS` in `lib/scorecard/questions.js`) and product names — "Revenue Operations Maturity Model" (framework), "Revenue Maturity Score" (scorecard output).

---

## 4. Information architecture

- **URL:** `/predictable-revenue-engine` (App Router route). Canonical self-referencing.
- **Cluster shape (future):** competency spokes nest under the pillar, e.g. `/predictable-revenue-engine/pipeline-stage-design`. Not built this session; the content model is authored so they can graduate cleanly.
- **Nav:** add ONE lean entry to `components/Header.jsx` desktop + mobile nav. Working label "The Model" (final label TBD in plan). Primary CTA (Book a Discovery Call) stays dominant.
- **Footer:** add a small "Resources" link to the pillar in `components/Footer.jsx`.
- **Sitemap:** add the pillar to `app/sitemap.js` with a `LAST_MODIFIED` entry, priority ~0.8, monthly.
- **Internal links:** homepage and `/scorecard` gain a contextual link to the pillar; the pillar links to `/scorecard` (primary CTA) and `/book` (final CTA).

---

## 5. Page structure (top to bottom)

1. **Header** (existing component).
2. **Hero** — variant-ready problem-language hook + subhead naming the framework; primary CTA "Get your Revenue Maturity Score" → `/scorecard`; secondary "Explore the model" (scrolls to stages).
3. **What this is** — 2–3 sentences: the model is the methodology behind the engagement; maturity tracks *operational signals*, not company size or revenue band.
4. **The four stages** — overview strip: Reactive (it runs on you) → Repeatable (on a system) → Predictable (on data) → Compounding (it improves itself). Each stage shows name, tag, plain definition, competency count.
5. **Four competency sections** — one per stage. Each is a grid of competency cards. Model-specific competencies appear in a clearly labeled "Applies to your business model" group (see 6.4).
6. **Mid-page scorecard CTA** — "run this exact model against your business."
7. **FAQ** — schema-marked (`FAQPage`), authored in founder problem-language. This is the People-Also-Ask / long-tail SEO surface.
8. **Final CTA** — book a discovery call.
9. **Footer** (existing component).

---

## 6. The competency content model (core deliverable)

### 6.1 Two renderings per competency
- **Grid card:** id, name, one-line plain definition, "Scored 1–5" chip, "See how I score it" affordance.
- **Expanded detail (inline, anchor `#<slug>`):** full definition (lead), a "Scored 1–5" framing line, then two panels:
  - **The data** — named tools + the specific data read inside them.
  - **The questions I ask** — merged questionnaire + discovery-call questions, plus a **"What I listen for"** callout.

### 6.2 What is intentionally NOT shown
- **No 1–5 rubric.** The level-by-level descriptions (Absent → Optimized) from the framework spec are the private scoring key and must not appear. Only the "Scored 1–5" chip conveys that scoring exists.

### 6.3 Data schema (one object per competency)
Authored as a data file, e.g. `lib/maturity/competencies.js`:

```
{
  id: 5,
  slug: 'pipeline-stage-design',
  stage: 1,                       // 1..4
  name: 'Pipeline Stage Design',
  appliesTo: 'ALL',               // 'ALL' | model code(s) for model-specific
  shortDef: '...',                // one line, grid card
  definition: '...',              // full lead, near-verbatim from framework spec
  data: {
    tools: ['HubSpot', 'Salesforce', 'Pipedrive', 'Close'],
    points: ['...', '...']        // what I read, from spec Tier 1 signal
  },
  questions: {
    ask: ['...', '...'],          // merged spec Tier 2 + Tier 3
    listenFor: '...'              // the judgment behind the questions
  }
}
```

### 6.4 Content sourcing rules
- **Source of truth:** `~/Documents/Claude/Projects/Modern BizOps/Coaching Service/App/Modern BizOps Revenue Operations Maturity Framework.md` (44 competencies, definitions, assessment signals). Definitions and questions are near-verbatim (de-em-dashed, voiced). Fidelity rule: do not invent scoring content.
- **`definition`** ← the italic one-liner under each competency name.
- **`data.points`** ← the "Data (Tier 1)" assessment signal, lightly rewritten to first person.
- **`questions.ask`** ← merge "Questionnaire (Tier 2)" + "Discovery call (Tier 3)" signals into one question set.
- **`questions.listenFor`** ← the interpretive note in the Tier 3 signal (what the answer reveals).
- **`data.tools`** ← NOT in the spec; assigned by data source using the tool map below.

### 6.5 Tool map (data source → named brands)
| Data source | Named tools | Example competencies |
|---|---|---|
| CRM | HubSpot, Salesforce, Pipedrive, Close | ICP, pipeline stage design, lead qualification, forecasting, deal/pipeline health, velocity |
| Marketing automation | HubSpot Marketing, Marketo, Mailchimp | lead source, multi-touch attribution, lead scoring & routing, lifecycle marketing automation |
| Accounting | QuickBooks, Xero | unit economics, revenue per employee, channel-level ROI |
| Customer success / support | HubSpot Service, Zendesk, Intercom | customer health, churn/risk, renewal & expansion, NRR, onboarding & activation |
| Product analytics | Amplitude, Mixpanel, PostHog | product usage analytics |
| BI / reporting | dashboards in your CRM or a BI tool (Looker, Power BI) | reporting infrastructure, growth scorecard, scenario modeling |
Tools are shown as the real systems the data lives in for that competency, adapted per data source (not a blanket list). Model-agnostic phrasing where a competency spans sources.

### 6.6 Model-specific competencies (the 4)
`Customer Lifecycle Marketing Automation`, `Subscription & MRR Operations`, `Conversion Rate Optimization`, `Product Usage Analytics`. Same card model, grouped under an "Applies to your business model" heading with a one-line note that these apply depending on business model (reuse scorecard business-model vocabulary).

---

## 7. Hero variant framework + instrumentation

- **Variants:** an array of `{ id, h1, sub }` hooks (the three from brainstorming: neutral/predictable, rational/headcount, emotional/runs-without-you). One is the featured default; others held for testing.
- **Selection (this session):** render the default only; structure allows a bucketing layer later (Deferred Scope, Stage 2).
- **Instrumentation:** reuse existing analytics (`lib/analytics.js`, GA4, Microsoft Clarity, HubSpot via existing components like `TrackConversion`, `UtmCapture`). Tag events with the active `heroVariant` id.
- **Event taxonomy (minimum):**
  - `pillar_hero_view` (variant id)
  - `pillar_competency_expand` (competency slug, stage)
  - `pillar_scorecard_cta_click` (placement: hero | mid | competency)
  - `pillar_book_cta_click`
- **North-star:** hero variant → scorecard start → lead → booked call. Early read via scroll depth + scorecard-CTA clicks (Clarity heatmaps + GA4), since bookings are too sparse for significance initially.

---

## 8. Technical architecture

- **Route:** `app/predictable-revenue-engine/page.js` (server component for SEO metadata) + a client subtree for interactivity (expand/collapse, analytics).
- **Data:** `lib/maturity/competencies.js` (44 objects), `lib/maturity/stages.js` (4 stages). Pure data, no UI — mirrors the `lib/scorecard` pattern.
- **Components (new, under `components/maturity/`):** `MaturityHero.jsx` (variant-aware), `StageOverview.jsx`, `CompetencyGrid.jsx`, `CompetencyCard.jsx`, `CompetencyDetail.jsx`, `MaturityFaq.jsx`, plus reuse of existing `components/ui` (`Section`, `Card`, `Button`, `Accordion`) and existing `ScorecardCTA`/CTA sections where they fit.
- **Styling:** Tailwind v4 with existing brand tokens (navy/amber/cream/green). No new global CSS.
- **Interaction:** click a card to expand its detail inline (anchor-linkable, keyboard-accessible, `aria-expanded`). One open at a time or multi-open (decide in plan; default one-at-a-time). Deep-link support: `#<slug>` opens that competency on load.
- **Responsive:** grids collapse to single column on mobile; detail panels stack; tap targets >= 44px.
- **Accessibility:** semantic headings (single H1), buttons for expand controls, focus management, alt text.

---

## 9. SEO specifics

- **Metadata** (in `page.js`, mirroring `/scorecard`): title blends the problem hook + framework name; meta description in problem-language; canonical `https://modernbizops.com/predictable-revenue-engine`; OpenGraph + Twitter card (new OG image via `scripts/generate-og.mjs`, see `og_image_generation.md`).
- **Structured data:** `FAQPage` for the FAQ; `BreadcrumbList`; consider `Article`/`DefinedTermSet` for the framework. JSON-LD injected server-side.
- **On-page:** single H1 (the hook), H2 per stage, H3 per competency; competency slugs are keyword-clean; internal links to `/scorecard` and `/book`.
- **Content depth:** long-form by design (44 competencies) — favorable for topical authority.

---

## 10. Verification plan

- `npm run build` passes; `npm run lint` clean.
- **No em dashes:** grep the new files for the em-dash character before commit.
- **Voice:** run `npm run lint:scorecard` conventions manually against new copy (the scorecard linter is scoped to scorecard files; apply its rules by hand or extend it — decide in plan).
- **Preview:** run dev server, verify hero renders, stage strip, a competency expands with data + questions and no rubric, scorecard CTA links to `/scorecard`, mobile layout, deep-link `#pipeline-stage-design`.
- **Content spot-check:** 3–4 competencies checked against the framework spec for fidelity; confirm zero rubric leakage.
- Ship via the `ship-to-production` skill; `verify-lead-capture` not required (no new lead form; CTA reuses `/scorecard`).

---

## 11. What is NOT in this session (deferred scope)

- **Blog / `/guides` / broader Resources hub.** Deferred: a thin content section on a zero-authority domain hurts more than helps. Revisit once a publishing cadence exists. The pillar establishes the cluster convention it will slot into.
- **Competency spoke pages** (`/predictable-revenue-engine/<slug>`). Deferred: 44 thin pages is premature. Content model is authored so a high-demand competency can graduate to its own page later, targeting a winnable long-tail.
- **On-site A/B middleware (Stage 2 testing).** Deferred: needs traffic (~hundreds of sessions/week) before a split test can conclude. Build now is variant-ready (config array + variant-tagged events); the Vercel middleware cookie-bucketing layer is added when traffic justifies. Meanwhile the message test runs in channels (LinkedIn organic + optional small paid) using existing distribution.
- **Final slug / message decision.** Launch on `/predictable-revenue-engine`; once the channel message test picks a winning hook, feature it as default and, if a different framing wins, 301 the slug to match.
- **Extending the scorecard to all 44 competencies.** Out of scope; the scorecard stays a 9-competency free quiz.
- **New OG image asset generation** may be split to a follow-up if `generate-og.mjs` needs brand-token updates; the page ships with a reasonable default OG otherwise.

---

## 12. Open items to resolve in planning

- Final nav label ("The Model" vs "Methodology" vs "Framework").
- One-open-at-a-time vs multi-open competency detail.
- Whether to extend the voice linter to cover `components/maturity` + `lib/maturity`, or hand-check.
- Exact FAQ question set (founder problem-language) and OG image copy.
