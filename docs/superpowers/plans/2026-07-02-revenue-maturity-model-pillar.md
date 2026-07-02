# Revenue Operations Maturity Model Pillar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public cornerstone pillar page at `/predictable-revenue-engine` that teaches the 44-competency Revenue Operations Maturity Model and routes founders to the scorecard.

**Architecture:** A server component (`app/predictable-revenue-engine/page.js`) owns SEO metadata + JSON-LD and renders a client experience component that holds interaction state (one competency expanded at a time, deep-linkable by `#slug`). Competency content is pure data under `lib/maturity/`, split by stage into separate files so it can be authored in parallel without merge conflicts, then aggregated by an index. Presentation reuses existing brand tokens and `components/ui` primitives.

**Tech Stack:** Next.js 15 App Router (JSX), Tailwind v4, Vitest, GA4 + Microsoft Clarity via `lib/analytics.js`.

**Design source of truth:** `docs/superpowers/specs/2026-07-02-revenue-maturity-model-pillar-design.md`

**Content source of truth (read-only, off-repo):**
- Competency definitions + assessment signals: `~/Documents/Claude/Projects/Modern BizOps/Coaching Service/App/Modern BizOps Revenue Operations Maturity Framework.md`
- Canonical site list, stage grouping, display order, exact names: `~/Documents/Claude/Projects/Modern BizOps/Content Marketing/Cornerstone - Revenue Maturity Model/visuals/maturity-model.html` (the `STAGES` array + footer model-specific list)

**Resolved open items (from spec §12):** nav label = **"The Model"**; competency detail = **one open at a time**; voice = hand-check + an em-dash integrity test (do not extend the scorecard linter).

---

## Hard rules (apply to every task)

- **No em dashes** anywhere (copy, comments, commit messages). Use commas, periods, or "and".
- **First-person Bradley voice**, founder-to-founder. Match `lib/scorecard/voice.js` tone.
- **Never expose the 1-5 rubric.** Competency objects have no `rubric` field. Only a "Scored 1-5" chip conveys scoring exists.
- **Audience:** founder-led B2B, $3M to $50M, any business model. Never say "SMB", "services business", or cap at $15M.
- Run all git commands from the worktree root. Commit after each task.

---

## File structure

**Create:**
- `lib/maturity/stages.js` — the 4 stages (data)
- `lib/maturity/heroVariants.js` — hero hook variants + default index (data)
- `lib/maturity/competencies/stage1.js` — 6 competency objects
- `lib/maturity/competencies/stage2.js` — 17 competency objects
- `lib/maturity/competencies/stage3.js` — 15 competency objects
- `lib/maturity/competencies/stage4.js` — 2 core + 4 model-specific competency objects
- `lib/maturity/competencies/index.js` — aggregates all 44, exports helpers
- `lib/maturity/faq.js` — FAQ items (data)
- `components/maturity/MaturityHero.jsx`
- `components/maturity/StageOverview.jsx`
- `components/maturity/CompetencyGrid.jsx`
- `components/maturity/CompetencyCard.jsx`
- `components/maturity/CompetencyDetail.jsx`
- `components/maturity/MaturityFaq.jsx`
- `components/maturity/MaturityExperience.jsx` — client component holding open-state + deep-link + analytics
- `app/predictable-revenue-engine/page.js` — route, metadata, JSON-LD, composition
- `__tests__/maturity/competencies.test.js` — data-integrity tests
- `__tests__/maturity/CompetencyDetail.test.jsx` — component test (data+questions render, no rubric)

**Modify:**
- `components/Header.jsx` — add "The Model" nav entry (desktop + mobile)
- `components/Footer.jsx` — add Resources link to the pillar
- `app/sitemap.js` — add the pillar URL + `LAST_MODIFIED` entry

---

## Task 1: Stage data + competency schema + integrity test scaffold

**Files:**
- Create: `lib/maturity/stages.js`
- Create: `lib/maturity/competencies/stage1.js`
- Create: `lib/maturity/competencies/index.js`
- Test: `__tests__/maturity/competencies.test.js`

- [ ] **Step 1: Write `lib/maturity/stages.js`**

```js
// The four maturity stages. Definitions are the plain-language versions from
// the maturity-model visual, voiced for a founder. Competency membership is
// derived from each competency's `stage` field, not duplicated here.
export const STAGES = [
  { n: 1, name: "Reactive", tag: "It runs on you",
    def: "Revenue depends on your effort, relationships, and judgment. Nothing is consistent without you in it. The team follows you, not a system." },
  { n: 2, name: "Repeatable", tag: "It runs on a system",
    def: "A system exists that the team can follow without you managing every interaction. The CRM is the record and core processes are written down. But the data is not fully trusted and the forecast is still a gut call." },
  { n: 3, name: "Predictable", tag: "It runs on data",
    def: "The business runs on trusted data. Shared definitions, a real operating cadence, and a reliable forecast mean you know what will happen before it happens. Growth no longer requires proportional headcount." },
  { n: 4, name: "Compounding", tag: "It improves itself",
    def: "The system improves itself. Leading indicators catch problems before they hit revenue. Expansion grows without chasing new logos. The revenue function is a strategic asset, not a fire to fight." },
];
```

- [ ] **Step 2: Write the canonical competency schema as a JSDoc + the first stage-1 object (the authoring template)**

Create `lib/maturity/competencies/stage1.js`. This file's first object is the reference shape every other competency copies. Author the remaining 5 stage-1 objects by the same rules (see Task 2 for the full rule list and sources).

```js
/**
 * @typedef {Object} Competency
 * @property {number} id            Display id (from maturity-model.html STAGES)
 * @property {string} slug          URL-safe, used for anchor deep-links
 * @property {number} stage         1..4
 * @property {string} name          Exact name from the source list
 * @property {string} appliesTo     "ALL" or a short model note for model-specific
 * @property {string} shortDef      One line for the grid card
 * @property {string} definition    Full lead, near-verbatim from the framework spec
 * @property {{tools: string[], points: string[]}} data   Named tools + what I read
 * @property {{ask: string[], listenFor: string}} questions  Merged Tier 2 + Tier 3
 *
 * NOTE: there is deliberately no `rubric` field. The 1-5 scoring key stays private.
 */
export const STAGE_1 = [
  {
    id: 5,
    slug: "pipeline-stage-design",
    stage: 1,
    name: "Pipeline Stage Design",
    appliesTo: "ALL",
    shortDef:
      "Pipeline stages defined as buyer decision milestones, not sales activities, each with a documented exit criterion before a deal advances.",
    definition:
      "The ability to define your pipeline stages as buyer decision milestones, the things the buyer actually did, rather than sales activities, with a documented exit criterion for each stage that must be verified before a deal moves forward.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "Your pipeline stage configuration, and whether the stages are custom to your process or the CRM defaults.",
        "The time-in-stage distribution across open deals. A stage where everything piles up usually means the exit criteria are missing or vague.",
        "Stage-to-stage conversion rates.",
        "Whether exit-criteria fields exist on the deal record, and whether they actually get filled in.",
      ],
    },
    questions: {
      ask: [
        "What has to be true for a deal to move from your second-to-last stage to closed?",
        "What actually makes a deal qualified in your process?",
        "How do you handle a deal where the rep has done everything, but the buyer has not confirmed the next step?",
        "Walk me through the last deal you won, stage by stage.",
      ],
      listenFor:
        "Buyer actions versus sales activities. If every stage is I sent the proposal or I had the meeting, the stages are activity-based and the pipeline cannot forecast.",
    },
  },
  // ...author the other 5 stage-1 competencies here (ids 1,2,3,4,6) per Task 2.
];
```

- [ ] **Step 3: Write `lib/maturity/competencies/index.js`**

```js
import { STAGE_1 } from "./stage1";
import { STAGE_2 } from "./stage2";
import { STAGE_3 } from "./stage3";
import { STAGE_4 } from "./stage4";

export const COMPETENCIES = [...STAGE_1, ...STAGE_2, ...STAGE_3, ...STAGE_4];

export function competenciesForStage(n) {
  return COMPETENCIES.filter((c) => c.stage === n);
}

export function competencyBySlug(slug) {
  return COMPETENCIES.find((c) => c.slug === slug);
}
```

Note: stage2/3/4 files do not exist yet. To keep this task's tests green in isolation, temporarily stub them: create `lib/maturity/competencies/stage2.js`, `stage3.js`, `stage4.js` each exporting `export const STAGE_N = [];`. Tasks 3 to 5 replace the stubs with real content.

- [ ] **Step 4: Write the failing integrity test**

Create `__tests__/maturity/competencies.test.js`:

```js
import { describe, it, expect } from "vitest";
import { COMPETENCIES, competencyBySlug } from "@/lib/maturity/competencies";

const EM_DASH = /—/;

describe("maturity competency data", () => {
  it("every competency has the required shape", () => {
    for (const c of COMPETENCIES) {
      expect(typeof c.id).toBe("number");
      expect(c.slug).toMatch(/^[a-z0-9-]+$/);
      expect([1, 2, 3, 4]).toContain(c.stage);
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.shortDef.length).toBeGreaterThan(0);
      expect(c.definition.length).toBeGreaterThan(0);
      expect(Array.isArray(c.data.tools)).toBe(true);
      expect(c.data.tools.length).toBeGreaterThan(0);
      expect(c.data.points.length).toBeGreaterThan(0);
      expect(c.questions.ask.length).toBeGreaterThan(0);
      expect(c.questions.listenFor.length).toBeGreaterThan(0);
    }
  });

  it("never exposes a scoring rubric", () => {
    for (const c of COMPETENCIES) {
      expect(c).not.toHaveProperty("rubric");
    }
  });

  it("contains no em dashes", () => {
    const blob = JSON.stringify(COMPETENCIES);
    expect(EM_DASH.test(blob)).toBe(false);
  });

  it("has unique slugs and ids", () => {
    const slugs = COMPETENCIES.map((c) => c.slug);
    const ids = COMPETENCIES.map((c) => c.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves a competency by slug", () => {
    expect(competencyBySlug("pipeline-stage-design")?.name).toBe(
      "Pipeline Stage Design"
    );
  });
});
```

- [ ] **Step 5: Run the test, expect it to pass** (stage-1 has >=1 real object, stubs are empty arrays)

Run: `npm test -- __tests__/maturity/competencies.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/maturity __tests__/maturity/competencies.test.js
git commit -m "feat(maturity): stage data, competency schema, integrity tests"
```

---

## Tasks 2 to 5: Author competency content (PARALLELIZABLE)

These four tasks touch disjoint files (`stage1.js`, `stage2.js`, `stage3.js`, `stage4.js`) and can run concurrently. Each produces competency objects matching the Task 1 schema and keeps `npm test -- __tests__/maturity/competencies.test.js` green.

**Authoring rules (identical for every competency):**
1. Find the competency by **name** in the framework spec `.md`. The spec is authoritative for meaning.
2. `definition` = the italic one-line definition under the competency name, de-em-dashed and lightly voiced to first person.
3. `data.points` = the "Data (Tier 1)" assessment-signal bullet, rewritten to first person ("your...", "whether..."), split into 2 to 4 points.
4. `questions.ask` = merge the "Questionnaire (Tier 2)" and "Discovery call (Tier 3)" prompts into one set of 3 to 5 questions.
5. `questions.listenFor` = the interpretive note from the Tier 3 signal (what the answer reveals).
6. `data.tools` = named brands assigned by the competency's data source, using this map:

| Data source | Named tools |
|---|---|
| CRM | HubSpot, Salesforce, Pipedrive, Close |
| Marketing automation | HubSpot Marketing, Marketo, Mailchimp |
| Accounting | QuickBooks, Xero |
| Customer success / support | HubSpot Service, Zendesk, Intercom |
| Product analytics | Amplitude, Mixpanel, PostHog |
| BI / reporting | your CRM dashboards, Looker, Power BI |

Pick the 2 to 4 tools that fit; a competency spanning sources may list tools from more than one row. Use judgment from the spec's Tier 1 wording (it names the data, which implies the system).
7. `shortDef` = a single tighter sentence derived from the definition, for the grid card.
8. `slug` = kebab-case of the name (drop "&", "and"; e.g. "CRM Architecture and Governance" -> "crm-architecture-governance").
9. `id` = the display id from the maturity-model.html `STAGES` array.

**Fidelity:** do not invent scoring content, do not paraphrase away meaning, do not add an em dash.

### Task 2: Stage 1 competencies (6)
**Files:** Modify `lib/maturity/competencies/stage1.js`
Names + ids (from source): 1 Ideal Customer Profile, 2 Revenue Lifecycle Design, 3 CRM Architecture and Governance, 4 Data Quality Management, 5 Pipeline Stage Design (already done as the template), 6 Lead Qualification Framework.
- [ ] Author the 5 remaining objects. Run `npm test -- __tests__/maturity/competencies.test.js` (PASS). Commit: `feat(maturity): stage 1 competency content`.

### Task 3: Stage 2 competencies (17)
**Files:** Replace stub `lib/maturity/competencies/stage2.js` with `export const STAGE_2 = [ ... ]`
Names + ids: 7 Revenue Forecasting, 8 GTM Operating Cadence, 9 Pipeline Hygiene and Governance, 10 Sales-to-Service Handoff, 11 Customer Onboarding and Activation, 12 Lead Source Strategy, 13 Shared Revenue Definitions and SLAs, 14 Lead Handoff Process, 15 Marketing-Sales Feedback Loop, 16 Sales Playbook, 17 Rep Onboarding and Ramp, 18 Tech Stack Rationalization, 19 Revenue Automation and AI Adoption, 20 Revenue Reporting Infrastructure, 21 Unit Economics, 22 Capacity Planning, 23 Change Management and Adoption.
- [ ] Author 17 objects. Run the integrity test (PASS). Commit: `feat(maturity): stage 2 competency content`.

### Task 4: Stage 3 competencies (15)
**Files:** Replace stub `lib/maturity/competencies/stage3.js`
Names + ids: 24 Deal Health Scoring, 25 Win/Loss Analysis, 26 Sales Cycle Velocity Management, 27 Customer Health Scoring, 28 Churn Prediction and Risk Management, 29 Renewal and Expansion Playbook, 30 Net Revenue Retention Management, 31 Multi-Touch Attribution, 32 Competitive Intelligence Operations, 33 Quota and Territory Design, 34 Sales Enablement Program, 35 Coaching Cadence and Performance Management, 36 Channel-Level ROI Analysis, 37 Revenue Per Employee and Efficiency, 38 Lead Scoring and Automated Routing.
- [ ] Author 15 objects. Run the integrity test (PASS). Commit: `feat(maturity): stage 3 competency content`.

### Task 5: Stage 4 + model-specific competencies (2 + 4)
**Files:** Replace stub `lib/maturity/competencies/stage4.js`
Core (stage 4): 39 Scenario Modeling and Sensitivity Analysis, 40 Growth Scorecard.
Model-specific (stage 4, `appliesTo` names the model): 41 Customer Lifecycle Marketing Automation, 42 Subscription and MRR Operations, 43 Conversion Rate Optimization, 44 Product Usage Analytics.
For model-specific objects set `appliesTo` to a short note, e.g. "Subscription and recurring-revenue businesses", using scorecard business-model vocabulary (`BUSINESS_MODEL_OPTIONS` in `lib/scorecard/questions.js`).
- [ ] Author 6 objects. Run the integrity test (PASS). Commit: `feat(maturity): stage 4 and model-specific competency content`.

---

## Task 6: Finalize the index + full-count integrity assertions

**Files:** Modify `__tests__/maturity/competencies.test.js`, `lib/maturity/competencies/index.js`

- [ ] **Step 1: Add count + coverage assertions to the test**

```js
import { STAGES } from "@/lib/maturity/stages";

it("has all 44 competencies", () => {
  expect(COMPETENCIES.length).toBe(44);
});

it("every stage has at least one competency and matches STAGES", () => {
  const stageNums = new Set(COMPETENCIES.map((c) => c.stage));
  for (const s of STAGES) expect(stageNums.has(s.n)).toBe(true);
});
```

- [ ] **Step 2: Add `MODEL_SPECIFIC_SLUGS` helper to index.js** for the "Applies to your business model" grouping.

```js
export const MODEL_SPECIFIC_SLUGS = [
  "customer-lifecycle-marketing-automation",
  "subscription-mrr-operations",
  "conversion-rate-optimization",
  "product-usage-analytics",
];
export function isModelSpecific(c) {
  return MODEL_SPECIFIC_SLUGS.includes(c.slug);
}
```

- [ ] **Step 3: Run the full test, expect PASS.** Run: `npm test -- __tests__/maturity/competencies.test.js`
- [ ] **Step 4: Commit** `test(maturity): assert full 44-competency coverage`

---

## Task 7: Hero variants data + `MaturityHero` component

**Files:** Create `lib/maturity/heroVariants.js`, `components/maturity/MaturityHero.jsx`

- [ ] **Step 1: `lib/maturity/heroVariants.js`**

```js
// Problem-language hero hooks for message testing. Only DEFAULT_VARIANT renders
// today; the array is the fixture a future bucketing layer selects from.
export const HERO_VARIANTS = [
  { id: "predictable", h1: "Right now, your revenue runs on you.",
    sub: "Here is the system that changes that. The Revenue Operations Maturity Model: four stages and 44 competencies that move you from revenue that depends on your effort to revenue you can predict." },
  { id: "headcount", h1: "Grow revenue without adding headcount.",
    sub: "The Revenue Operations Maturity Model shows you which parts of your revenue engine are built, and which parts still run on you." },
  { id: "runs-without-you", h1: "Build a business that runs without you.",
    sub: "The Revenue Operations Maturity Model is the path, from revenue that depends on you to revenue that compounds on its own." },
];
export const DEFAULT_VARIANT_ID = "predictable";
export function getHeroVariant(id = DEFAULT_VARIANT_ID) {
  return HERO_VARIANTS.find((v) => v.id === id) || HERO_VARIANTS[0];
}
```

- [ ] **Step 2: `components/maturity/MaturityHero.jsx`** (client, fires `pillar_hero_view` once on mount)

```jsx
"use client";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

export default function MaturityHero({ variant }) {
  useEffect(() => {
    trackEvent("pillar_hero_view", { hero_variant: variant.id });
  }, [variant.id]);

  return (
    <section className="bg-cream border-b border-border">
      <div className="mx-auto max-w-[880px] px-6 md:px-8 py-16 md:py-24 text-center">
        <h1 className="font-display font-semibold text-navy text-4xl md:text-5xl leading-tight">
          {variant.h1}
        </h1>
        <p className="mt-5 text-lg text-text-mid max-w-[60ch] mx-auto">
          {variant.sub}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/scorecard">Get your Revenue Maturity Score</Button>
          <Button href="#the-four-stages" variant="secondary">Explore the model</Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit** `feat(maturity): hero variants and MaturityHero component`

**Analytics note (spec §7):** scorecard and book CTA clicks are captured by the shared `Button` component, which already fires `trackCTAClick(destination, label)` for `/scorecard` and `/book` (see `components/ui/Button.jsx`). We reuse that rather than adding separate `pillar_scorecard_cta_click`/`pillar_book_cta_click` events. Placement-level granularity (hero vs mid vs competency) is deferred with the A/B layer. The two events unique to this page, `pillar_hero_view` and `pillar_competency_expand`, are added explicitly (Tasks 7 and 11).

---

## Task 8: `CompetencyCard` + `CompetencyDetail` (PARALLELIZABLE with Task 9)

**Files:** Create `components/maturity/CompetencyDetail.jsx`, `components/maturity/CompetencyCard.jsx`, Test `__tests__/maturity/CompetencyDetail.test.jsx`

- [ ] **Step 1: Write the failing component test**

```jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CompetencyDetail from "@/components/maturity/CompetencyDetail";
import { competencyBySlug } from "@/lib/maturity/competencies";

describe("CompetencyDetail", () => {
  const c = competencyBySlug("pipeline-stage-design");
  it("renders the data tools, data points, and questions", () => {
    render(<CompetencyDetail competency={c} />);
    expect(screen.getByText("The data")).toBeInTheDocument();
    expect(screen.getByText("The questions I ask")).toBeInTheDocument();
    expect(screen.getByText(/HubSpot/)).toBeInTheDocument();
    expect(screen.getByText(c.questions.listenFor)).toBeInTheDocument();
  });
  it("shows no rubric or level labels", () => {
    render(<CompetencyDetail competency={c} />);
    expect(screen.queryByText(/rubric/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^\s*(Absent|Informal|Optimized)\s*$/)).not.toBeInTheDocument();
  });
});
```

Run: `npm test -- __tests__/maturity/CompetencyDetail.test.jsx` -> FAIL (component missing). (Note: `@testing-library/react` + jsdom are already used in this repo's tests; if not installed, add per existing test setup in `vitest.setup.js`.)

- [ ] **Step 2: `components/maturity/CompetencyDetail.jsx`** (presentational)

```jsx
export default function CompetencyDetail({ competency: c }) {
  return (
    <div className="mt-4 border-t border-border pt-6">
      <p className="text-navy/90 text-lg leading-relaxed max-w-[70ch]">{c.definition}</p>
      <p className="mt-4 text-sm text-text-mid">
        I score every competency 1 to 5. The scoring detail stays private, but here is exactly what I look at.
      </p>
      <div className="mt-6 grid md:grid-cols-2 gap-5">
        <div className="bg-cream border border-border rounded-2xl p-6">
          <h4 className="font-body font-semibold text-amber text-sm tracking-wide uppercase mb-3">The data</h4>
          <p className="text-sm text-text-mid mb-3">The tools I connect to, and what I read inside them:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {c.data.tools.map((t) => (
              <span key={t} className="text-xs bg-white border border-border rounded-md px-2 py-1 text-navy font-medium">{t}</span>
            ))}
          </div>
          <ul className="space-y-2">
            {c.data.points.map((p, i) => (
              <li key={i} className="text-[15px] text-navy/90 leading-snug pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-blue before:rounded-sm">{p}</li>
            ))}
          </ul>
        </div>
        <div className="bg-cream border border-border rounded-2xl p-6">
          <h4 className="font-body font-semibold text-amber text-sm tracking-wide uppercase mb-3">The questions I ask</h4>
          <ul className="space-y-3">
            {c.questions.ask.map((q, i) => (
              <li key={i} className="text-[15px] italic text-navy/90 leading-snug">{`“${q}”`}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-text-mid bg-white border-l-[3px] border-amber-light rounded-r-lg px-3 py-2">
            <span className="font-semibold text-navy">What I listen for: </span>{c.questions.listenFor}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `components/maturity/CompetencyCard.jsx`** (client button that toggles open state)

```jsx
"use client";
import CompetencyDetail from "./CompetencyDetail";

export default function CompetencyCard({ competency: c, isOpen, onToggle }) {
  return (
    <div id={c.slug} className={`bg-white border rounded-2xl p-5 transition-colors ${isOpen ? "border-amber md:col-span-2 lg:col-span-3" : "border-border hover:border-amber"}`}>
      <button
        type="button"
        onClick={() => onToggle(c.slug)}
        aria-expanded={isOpen}
        className="w-full text-left flex flex-col gap-2"
      >
        <span className="text-xs text-amber font-semibold tracking-wide">{String(c.id).padStart(2, "0")}</span>
        <span className="font-display font-semibold text-navy text-xl leading-tight">{c.name}</span>
        <span className="text-sm text-text-mid leading-snug">{c.shortDef}</span>
        <span className="mt-1 flex items-center justify-between">
          <span className="text-[11px] text-green bg-green/10 border border-green/20 rounded-full px-2.5 py-0.5 font-semibold">Scored 1-5</span>
          <span className="text-[13px] text-amber font-semibold">{isOpen ? "Close" : "See how I score it"}</span>
        </span>
      </button>
      {isOpen && <CompetencyDetail competency={c} />}
    </div>
  );
}
```

- [ ] **Step 4: Run the test, expect PASS.** Run: `npm test -- __tests__/maturity/CompetencyDetail.test.jsx`
- [ ] **Step 5: Commit** `feat(maturity): CompetencyCard and CompetencyDetail`

---

## Task 9: `StageOverview` + `CompetencyGrid` (PARALLELIZABLE with Task 8)

**Files:** Create `components/maturity/StageOverview.jsx`, `components/maturity/CompetencyGrid.jsx`

- [ ] **Step 1: `components/maturity/StageOverview.jsx`** (presentational)

```jsx
import { STAGES } from "@/lib/maturity/stages";
import { competenciesForStage } from "@/lib/maturity/competencies";

export default function StageOverview() {
  return (
    <div id="the-four-stages" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAGES.map((s) => (
        <div key={s.n} className="bg-white border border-border rounded-2xl p-5">
          <div className="font-display font-bold text-amber text-2xl">{String(s.n).padStart(2, "0")}</div>
          <div className="font-display font-semibold text-navy text-2xl">{s.name}</div>
          <div className="text-[11px] tracking-widest uppercase text-text-light mb-2">{s.tag}</div>
          <p className="text-sm text-text-mid leading-snug">{s.def}</p>
          <div className="mt-3 text-xs text-amber font-semibold">
            {competenciesForStage(s.n).length} competencies
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: `components/maturity/CompetencyGrid.jsx`** (client; renders one stage's cards, model-specific split out)

```jsx
"use client";
import CompetencyCard from "./CompetencyCard";
import { competenciesForStage, isModelSpecific } from "@/lib/maturity/competencies";

export default function CompetencyGrid({ stage, openSlug, onToggle }) {
  const all = competenciesForStage(stage);
  const core = all.filter((c) => !isModelSpecific(c));
  const modelSpecific = all.filter(isModelSpecific);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {core.map((c) => (
          <CompetencyCard key={c.slug} competency={c} isOpen={openSlug === c.slug} onToggle={onToggle} />
        ))}
      </div>
      {modelSpecific.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-navy text-xl mb-1">Applies to your business model</h3>
          <p className="text-sm text-text-mid mb-4">A handful of competencies apply depending on how you make money.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelSpecific.map((c) => (
              <CompetencyCard key={c.slug} competency={c} isOpen={openSlug === c.slug} onToggle={onToggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Sanity build check.** Run: `npm run build` (or defer to Task 11). Commit: `feat(maturity): StageOverview and CompetencyGrid`.

---

## Task 10: FAQ data + `MaturityFaq` + FAQPage JSON-LD

**Files:** Create `lib/maturity/faq.js`, `components/maturity/MaturityFaq.jsx`

- [ ] **Step 1: `lib/maturity/faq.js`** (founder problem-language; 5 to 7 items). Draft:

```js
export const MATURITY_FAQ = [
  { q: "What is the Revenue Operations Maturity Model?",
    a: "It is a four-stage map of the 44 capabilities a founder-led business needs to move from revenue that depends on you to revenue that runs on a system and, eventually, improves itself. Each capability is scored 1 to 5." },
  { q: "Is this only for big companies with a RevOps team?",
    a: "No. The model tracks how built-out your revenue operation is, not your company size. A $3M business with a real system is more mature than a $30M business that has never defined a pipeline stage." },
  { q: "How do you actually score my business?",
    a: "Two ways per competency: the data I read from your tools, and the questions I ask you and your team. The scoring key itself stays private, but every competency page shows you exactly what I look at." },
  { q: "How is this different from a generic sales audit?",
    a: "An audit hands you a list of problems. The model gives you a sequence: which capability to build next, in what order, based on where your revenue actually breaks." },
  { q: "What do I do with my score?",
    a: "Start with the scorecard. It runs this model against your business in about five minutes and shows you the one gap I would fix first." },
];
```

- [ ] **Step 2: `components/maturity/MaturityFaq.jsx`** (reuse `components/ui/Accordion` if it fits; otherwise `<details>`)

```jsx
export default function MaturityFaq({ items }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <details key={i} className="bg-white border border-border rounded-xl p-5 group">
          <summary className="font-display font-semibold text-navy text-lg cursor-pointer list-none flex justify-between items-center">
            {it.q}<span className="text-amber group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p className="mt-3 text-text-mid leading-relaxed">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit** `feat(maturity): FAQ content and component`

---

## Task 11: `MaturityExperience` client wrapper + page route + metadata + JSON-LD

**Files:** Create `components/maturity/MaturityExperience.jsx`, `app/predictable-revenue-engine/page.js`

- [ ] **Step 1: `components/maturity/MaturityExperience.jsx`** (owns open-state, deep-link, expand analytics)

```jsx
"use client";
import { useEffect, useState } from "react";
import { STAGES } from "@/lib/maturity/stages";
import CompetencyGrid from "./CompetencyGrid";
import { trackEvent } from "@/lib/analytics";
import { competencyBySlug } from "@/lib/maturity/competencies";

export default function MaturityExperience() {
  const [openSlug, setOpenSlug] = useState(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && competencyBySlug(hash)) setOpenSlug(hash);
  }, []);

  const onToggle = (slug) => {
    setOpenSlug((cur) => {
      const next = cur === slug ? null : slug;
      if (next) {
        const c = competencyBySlug(next);
        trackEvent("pillar_competency_expand", { competency: next, stage: c?.stage });
        history.replaceState(null, "", `#${next}`);
      }
      return next;
    });
  };

  return (
    <div className="space-y-16">
      {STAGES.map((s) => (
        <section key={s.n} aria-labelledby={`stage-${s.n}`}>
          <div className="mb-6">
            <div className="text-xs tracking-widest uppercase text-amber font-semibold">Stage {s.n} · {s.name}</div>
            <h2 id={`stage-${s.n}`} className="font-display font-semibold text-navy text-3xl mt-1">{s.tag}</h2>
            <p className="text-text-mid mt-2 max-w-[64ch]">{s.def}</p>
          </div>
          <CompetencyGrid stage={s.n} openSlug={openSlug} onToggle={onToggle} />
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: `app/predictable-revenue-engine/page.js`** (server component: metadata, JSON-LD, composition). Mirror `/scorecard` metadata shape.

```jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import MaturityHero from "@/components/maturity/MaturityHero";
import StageOverview from "@/components/maturity/StageOverview";
import MaturityExperience from "@/components/maturity/MaturityExperience";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import { getHeroVariant } from "@/lib/maturity/heroVariants";
import { MATURITY_FAQ } from "@/lib/maturity/faq";

const URL = "https://modernbizops.com/predictable-revenue-engine";

export const metadata = {
  title: "The Revenue Operations Maturity Model | Modern BizOps",
  description:
    "The four stages and 44 competencies that move a founder-led business from revenue that depends on you to revenue you can predict. See exactly how each one is measured.",
  alternates: { canonical: URL },
  openGraph: {
    title: "The Revenue Operations Maturity Model",
    description: "From revenue that runs on you to revenue you can predict. Four stages, 44 competencies.",
    url: URL,
    images: [{ url: "https://modernbizops.com/og/og-maturity-model.png", width: 1200, height: 630, alt: "The Revenue Operations Maturity Model" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Revenue Operations Maturity Model",
    description: "Four stages, 44 competencies, from revenue that runs on you to revenue you can predict.",
    images: ["https://modernbizops.com/og/og-maturity-model.png"],
  },
};

export default function MaturityModelPage() {
  const variant = getHeroVariant();
  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: MATURITY_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://modernbizops.com" },
      { "@type": "ListItem", position: 2, name: "The Revenue Operations Maturity Model", item: URL },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <MaturityHero variant={variant} />
        <Section bg="cream" narrow={false}>
          <div className="max-w-[720px] mx-auto text-center">
            <p className="text-lg text-text-mid">
              This is the methodology behind the engagement. Maturity is not about your revenue band. It is about how much of your revenue runs on a system instead of on you.
            </p>
          </div>
          <div className="mt-12"><StageOverview /></div>
        </Section>
        <Section bg="white" narrow={false}>
          <MaturityExperience />
        </Section>
        <Section bg="navy" narrow>
          <div className="text-center">
            <h2 className="font-display font-semibold text-3xl mb-2">Want your own score?</h2>
            <p className="text-white/80 mb-6 max-w-[56ch] mx-auto">The scorecard runs this exact model against your business in about five minutes and shows you the one gap I would fix first.</p>
            <Button href="/scorecard">Get your Revenue Maturity Score</Button>
          </div>
        </Section>
        <Section bg="cream" narrow>
          <h2 className="font-display font-semibold text-navy text-3xl mb-6 text-center">Questions founders ask</h2>
          <MaturityFaq items={MATURITY_FAQ} />
        </Section>
        <Section bg="white" narrow>
          <div className="text-center">
            <h2 className="font-display font-semibold text-navy text-3xl mb-2">See where you stand</h2>
            <p className="text-text-mid mb-6">Book a discovery call and we will walk your revenue operation stage by stage.</p>
            <Button href="/book">Book a Discovery Call</Button>
          </div>
        </Section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </>
  );
}
```

- [ ] **Step 3: Run the build.** Run: `npm run build`. Expected: compiles, `/predictable-revenue-engine` in the route list.
- [ ] **Step 4: Commit** `feat(maturity): pillar page route, metadata, JSON-LD, experience wrapper`

---

## Task 12: Nav, footer, sitemap

**Files:** Modify `components/Header.jsx`, `components/Footer.jsx`, `app/sitemap.js`

- [ ] **Step 1: Header** — add a `The Model` link to both the desktop `<nav>` and the mobile menu, pointing to `/predictable-revenue-engine`, matching the existing link classes. Place it before "About".
- [ ] **Step 2: Footer** — add a link to `/predictable-revenue-engine` labeled "The Revenue Operations Maturity Model" in the appropriate footer column (create a small "Resources" group if none exists).
- [ ] **Step 2b: Contextual internal link (spec §4)** — add one in-content link back to the pillar from the scorecard experience. In `components/scorecard/ResultView.jsx` (or the scorecard intro), add a sentence like "New to the model? Read the full Revenue Operations Maturity Model" linking to `/predictable-revenue-engine`, matching existing link classes. This wires the cluster: pillar links out to `/scorecard`, `/scorecard` links back to the pillar.
- [ ] **Step 3: sitemap** — add to `LAST_MODIFIED`: `maturityModel: "2026-07-02",` and a route entry:

```js
{ url: `${baseUrl}/predictable-revenue-engine`, lastModified: new Date(LAST_MODIFIED.maturityModel), changeFrequency: "monthly", priority: 0.8 },
```

- [ ] **Step 4:** Run `npm run build` (PASS). Commit: `feat(maturity): add pillar to nav, footer, sitemap`.

---

## Task 13: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full test suite.** Run: `npm test`. Expected: all pass (including the two new maturity test files).
- [ ] **Step 2: Lint.** Run: `npm run lint`. Expected: clean.
- [ ] **Step 3: Em-dash sweep.** Run: `grep -rn $'—' app/predictable-revenue-engine lib/maturity components/maturity`. Expected: no output.
- [ ] **Step 4: Rubric-leak sweep.** Confirm no competency object contains a `rubric` key and no level-by-level scoring prose. Run: `grep -rniE '"rubric"|level 1|1 - absent|absent:|informal:|optimized:' lib/maturity`. Expected: no output.
- [ ] **Step 5: Preview verification** (per the preview workflow, not manual hand-off):
  - Start dev server; load `/predictable-revenue-engine`.
  - `preview_snapshot`: hero H1 (default "Right now, your revenue runs on you."), four stage cards, four competency sections.
  - `preview_click` a competency card; `preview_snapshot`: definition + "The data" (tools + points) + "The questions I ask" + "What I listen for" render; no 1-5 rubric.
  - Confirm only one competency is open at a time.
  - `preview_console_logs`: no errors.
  - Load `/predictable-revenue-engine#win-loss-analysis`: that competency is open on load.
  - `preview_resize` mobile: grids stack, tap targets fine.
  - `preview_screenshot` for the record.
- [ ] **Step 6: Content fidelity spot-check.** Pick 3 competencies across different stages; compare `definition` and `questions` against the framework spec `.md` for meaning fidelity and zero rubric leakage.
- [ ] **Step 7: Commit** any fixes. `chore(maturity): final verification fixes` (or skip if none).

---

## Deferred (not in this plan, per spec §11)

Blog / Resources hub, per-competency spoke pages, on-site A/B middleware (Vercel cookie-bucketing), final slug 301, extending the scorecard to 44 competencies, OG image regeneration if `generate-og.mjs` needs brand-token work (page ships referencing `/og/og-maturity-model.png`; generate it as a follow-up if absent).

---

## Post-plan: ship

After Task 13, use the `ship-to-production` skill (branch is already `claude/...`): commit, PR, squash-merge, confirm Vercel production deploy, verify the live page. `verify-lead-capture` is not required (no new lead form; CTAs reuse `/scorecard` and `/book`).
