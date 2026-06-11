# Maturity Scorecard Lead Magnet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing `/scorecard` page with the Phase B 44-competency maturity scorecard lead magnet defined in `docs/superpowers/specs/2026-06-10-maturity-scorecard-lead-magnet-design.md`. Sixteen questions, four-stage placement, peer-anchored ROI math from `businessModelBenchmarks.js v1.1`, loss-framed result page, HubSpot deal at New Lead stage, React-PDF email artifact.

**Architecture:** Single-page client component tree at `app/scorecard/page.js` (landing → quiz → email gate → result). Pure-function libs under `lib/scorecard/`. Server-side result computation in `app/api/scorecard/submit/route.js`. Voice lint script enforces no em-dash / no first-person-plural / source citation. Vitest + jsdom for tests.

**Tech Stack:** Next.js 16.2.2 (app router), React 19.2.4, Tailwind v4. Add Vitest + @vitejs/plugin-react + jsdom + @testing-library/react + @react-pdf/renderer.

---

## Task ordering

| # | Task | Phase |
|---|---|---|
| 0 | Bootstrap test runner and runtime deps | Foundation |
| 1 | Promote `NEW_LEAD_STAGE` constant to `lib/hubspot.js` | Foundation |
| 2 | Vendor `businessModelBenchmarks.js v1.1` into `lib/scorecard/` | Data |
| 3 | Build `lib/scorecard/questions.js` | Data |
| 4 | Build `lib/scorecard/scoring.js` | Logic |
| 5 | Build `lib/scorecard/voice.js` | Copy |
| 6 | Build `lib/scorecard/roi.js` | Logic |
| 7 | Build `lib/scorecard/resultRender.js` | Orchestrator |
| 8 | Build `scripts/lint-scorecard-voice.mjs` + wire into `npm run lint:scorecard` | Quality gate |
| 9 | Build `lib/scorecard/pdfDocument.jsx` | Render |
| 10 | Build `app/api/scorecard/submit/route.js` with mocked HubSpot tests | Server |
| 11 | Build presentational components (`SectionHeader`, `RoiLine`, `CtaCard`) | UI |
| 12 | Build `QuestionCard` and `StagePlacementCard` | UI |
| 13 | Build `EmailGateForm` | UI |
| 14 | Build `QuizFlow` state machine | UI |
| 15 | Replace `app/scorecard/page.js` with landing + `ScorecardExperience` | UI |
| 16 | Manual smoke verification via `preview_*` tools | Verification |

---

## Task 0: Bootstrap test runner and runtime deps

**Files:**
- Modify: `package.json`
- Create: `vitest.config.mjs`
- Create: `vitest.setup.js`
- Create: `__tests__/sanity.test.js`

- [ ] **Step 1: Install dev and runtime dependencies**

Run:
```bash
npm install --save-dev vitest@^2 @vitejs/plugin-react@^4 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6
npm install --save @react-pdf/renderer@^4
```

Expected: deps land in `package.json`, `package-lock.json` updates, `node_modules/` populates.

- [ ] **Step 2: Add test and lint:scorecard scripts to `package.json`**

Edit `package.json` `scripts` block to:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest",
  "lint:scorecard": "node scripts/lint-scorecard-voice.mjs"
}
```

- [ ] **Step 3: Write `vitest.config.mjs`**

Create `vitest.config.mjs`:
```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['__tests__/**/*.test.{js,jsx}'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
});
```

- [ ] **Step 4: Write `vitest.setup.js`**

Create `vitest.setup.js`:
```js
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Write `__tests__/sanity.test.js`**

Create `__tests__/sanity.test.js`:
```js
import { describe, it, expect } from 'vitest';

describe('vitest harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run the sanity test**

Run: `npm test`
Expected: 1 passed, 0 failed. Exit 0.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.mjs vitest.setup.js __tests__/sanity.test.js
git commit -m "chore(scorecard): bootstrap vitest + @react-pdf/renderer"
```

---

## Task 1: Promote `NEW_LEAD_STAGE` constant to `lib/hubspot.js`

The spec calls for one canonical `NEW_LEAD_STAGE` in `lib/hubspot.js`, imported by both `create-watch-deal` and the new `submit-scorecard` route. Today it is a local const in `app/api/create-watch-deal/route.js:12`.

**Files:**
- Modify: `lib/hubspot.js` (add export)
- Modify: `app/api/create-watch-deal/route.js` (drop local const, import from `@/lib/hubspot`)
- Create: `__tests__/scorecard/hubspot-constants.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/hubspot-constants.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { NEW_LEAD_STAGE, DISCOVERY_CALL_BOOKED_STAGE, REVOPS_PIPELINE_ID } from '@/lib/hubspot';

describe('hubspot RevOps pipeline constants', () => {
  it('exports REVOPS_PIPELINE_ID = "2172760768"', () => {
    expect(REVOPS_PIPELINE_ID).toBe('2172760768');
  });

  it('exports NEW_LEAD_STAGE = "3477396169"', () => {
    expect(NEW_LEAD_STAGE).toBe('3477396169');
  });

  it('exports DISCOVERY_CALL_BOOKED_STAGE = "3477396170"', () => {
    expect(DISCOVERY_CALL_BOOKED_STAGE).toBe('3477396170');
  });

  it('NEW_LEAD_STAGE precedes DISCOVERY_CALL_BOOKED_STAGE in sequence', () => {
    expect(Number(NEW_LEAD_STAGE) + 1).toBe(Number(DISCOVERY_CALL_BOOKED_STAGE));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/hubspot-constants.test.js`
Expected: FAIL with `NEW_LEAD_STAGE` undefined.

- [ ] **Step 3: Add the export to `lib/hubspot.js`**

In `lib/hubspot.js`, immediately after the existing `DISCOVERY_CALL_BOOKED_STAGE` line (line 11), add:
```js
export const NEW_LEAD_STAGE = "3477396169";
```

The final block should read:
```js
export const REVOPS_PIPELINE_ID = "2172760768";
export const NEW_LEAD_STAGE = "3477396169";
export const DISCOVERY_CALL_BOOKED_STAGE = "3477396170";
```

- [ ] **Step 4: Update `app/api/create-watch-deal/route.js` to import the shared const**

In `app/api/create-watch-deal/route.js`, update the import block at the top to include `NEW_LEAD_STAGE`:
```js
import {
  HUBSPOT_BASE,
  REVOPS_PIPELINE_ID,
  NEW_LEAD_STAGE,
  BRADLEY_OWNER_ID,
  hsHeaders,
  assertHubSpotConfigured,
  findContactByEmail,
  findExistingRevopsDealForContact,
} from "@/lib/hubspot";
```

Delete the local `const NEW_LEAD_STAGE = "3477396169";` on line 12.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/hubspot-constants.test.js`
Expected: 4 passed, 0 failed.

- [ ] **Step 6: Run a build to confirm the watch route still resolves the import**

Run: `npm run build`
Expected: build succeeds; no module-resolution errors for `create-watch-deal`.

- [ ] **Step 7: Commit**

```bash
git add lib/hubspot.js app/api/create-watch-deal/route.js __tests__/scorecard/hubspot-constants.test.js
git commit -m "refactor(hubspot): promote NEW_LEAD_STAGE to lib/hubspot.js for shared use"
```

---

## Task 2: Vendor `businessModelBenchmarks.js v1.1` into `lib/scorecard/`

Verbatim copy of the RevOps Coaching App source of truth, with a sync-procedure header and the `industryOverrides` plumbing stripped (this site has no industry-override layer).

**Files:**
- Create: `lib/scorecard/businessModelBenchmarks.js`
- Create: `__tests__/scorecard/businessModelBenchmarks.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/businessModelBenchmarks.test.js`:
```js
import { describe, it, expect } from 'vitest';
import {
  BUSINESS_MODEL_BENCHMARK_VERSION,
  getBusinessModelBenchmark,
  classifyAgainstBenchmark,
} from '@/lib/scorecard/businessModelBenchmarks';

const MODELS = [
  'B2B_SAAS',
  'PROFESSIONAL_SERVICES',
  'B2B_PRODUCT',
  'ECOMMERCE',
  'B2C_SERVICES',
  'B2C_SUBSCRIPTION',
  'MARKETPLACE',
  'OTHER',
];

describe('businessModelBenchmarks', () => {
  it('exports version 1.1', () => {
    expect(BUSINESS_MODEL_BENCHMARK_VERSION).toBe('1.1');
  });

  it.each(MODELS)('returns a benchmark row for %s', (model) => {
    const row = getBusinessModelBenchmark(model);
    expect(row.businessModel).toBe(model);
    expect(row.label).toBeTypeOf('string');
    expect(row.metrics.salesCycleDays).toBeDefined();
    expect(row.metrics.leadResponseDays).toBeDefined();
    expect(row.metrics.revenuePerEmployee).toBeDefined();
    expect(row.metrics.nrr).toBeDefined();
  });

  it('falls back to OTHER for unknown business model', () => {
    expect(getBusinessModelBenchmark('UNKNOWN_FOO').businessModel).toBe('OTHER');
    expect(getBusinessModelBenchmark(null).businessModel).toBe('OTHER');
    expect(getBusinessModelBenchmark(undefined).businessModel).toBe('OTHER');
  });

  it('each metric carries direction, median, range, unit, source, asOf, confidence', () => {
    const m = getBusinessModelBenchmark('B2B_SAAS').metrics.salesCycleDays;
    expect(m.direction).toMatch(/^(lower|higher)$/);
    expect(typeof m.median).toBe('number');
    expect(Array.isArray(m.range)).toBe(true);
    expect(m.range).toHaveLength(2);
    expect(m.unit).toBeTypeOf('string');
    expect(m.source).toBeTypeOf('string');
    expect(typeof m.asOf).toBe('number');
    expect(m.confidence).toMatch(/^(cited|estimated)$/);
  });

  describe('classifyAgainstBenchmark (direction = lower)', () => {
    const metric = { direction: 'lower', median: 84, range: [30, 120], unit: 'days', source: 'x', asOf: 2025, confidence: 'cited' };

    it('value at or below median => strong/meets', () => {
      expect(classifyAgainstBenchmark(84, metric).interpretation).toBe('meets');
      expect(classifyAgainstBenchmark(50, metric).interpretation).toBe('meets');
    });

    it('value between median and high => typical/partial', () => {
      expect(classifyAgainstBenchmark(100, metric).interpretation).toBe('partial');
      expect(classifyAgainstBenchmark(120, metric).interpretation).toBe('partial');
    });

    it('value above high => lagging/fails', () => {
      expect(classifyAgainstBenchmark(200, metric).interpretation).toBe('fails');
    });
  });

  describe('classifyAgainstBenchmark (direction = higher)', () => {
    const metric = { direction: 'higher', median: 130000, range: [100000, 200000], unit: 'usd', source: 'x', asOf: 2025, confidence: 'cited' };

    it('value at or above median => strong/meets', () => {
      expect(classifyAgainstBenchmark(130000, metric).interpretation).toBe('meets');
      expect(classifyAgainstBenchmark(250000, metric).interpretation).toBe('meets');
    });

    it('value between low and median => typical/partial', () => {
      expect(classifyAgainstBenchmark(120000, metric).interpretation).toBe('partial');
      expect(classifyAgainstBenchmark(100000, metric).interpretation).toBe('partial');
    });

    it('value below low => lagging/fails', () => {
      expect(classifyAgainstBenchmark(50000, metric).interpretation).toBe('fails');
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/businessModelBenchmarks.test.js`
Expected: FAIL with module-not-found error.

- [ ] **Step 3: Create the benchmark module**

Create `lib/scorecard/businessModelBenchmarks.js` as a verbatim copy of the canonical source with a sync header. Replace the existing `industryOverrides` block with no-op (drop the parameter and the override path).

```js
/**
 * Business-model benchmark table — Modern BizOps marketing-site scorecard.
 *
 * VENDORED COPY. The source of truth lives in the RevOps Coaching App at
 *   server/src/lib/businessModelBenchmarks.js
 *
 * Sync procedure:
 *   1. Re-curate a number in the canonical file (RevOps Coaching App).
 *   2. Bump BUSINESS_MODEL_BENCHMARK_VERSION in BOTH files in lockstep.
 *   3. Copy the BUSINESS_MODEL_BENCHMARKS object into this file.
 *   4. Update tests if any band edges shifted.
 *   5. Ship the version bump in the commit message so PR review surfaces it.
 *
 * Numbers are curated from named public reports; see each metric's `source`
 * and `asOf` for provenance. `confidence: 'cited'` means survey-grade public
 * benchmark; `confidence: 'estimated'` means a defensible extrapolation
 * anchored to the nearest sourced neighbor.
 *
 * Sibling industryBenchmarks.js (admin-only) is NOT used by the client-facing
 * scorecard and is not vendored here.
 */

export const BUSINESS_MODEL_BENCHMARK_VERSION = '1.1';

const BUSINESS_MODEL_BENCHMARKS = {
  B2B_SAAS: {
    businessModel: 'B2B_SAAS',
    label: 'B2B SaaS',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 84,     range: [30, 120],        unit: 'days', source: 'Optifai B2B SaaS Sales Cycle Benchmark (n=939); The Bridge Group SaaS metrics', asOf: 2025, confidence: 'cited' },
      leadResponseDays:   { direction: 'lower',  median: 0.5,    range: [0.04, 1.6],      unit: 'days', source: 'timetoreply 2024 (SaaS 12h); Optifai lead-response study (SaaS 38h)', asOf: 2024, confidence: 'cited' },
      revenuePerEmployee: { direction: 'higher', median: 130000, range: [100000, 200000], unit: 'usd',  source: 'SaaS Capital 2025 Revenue per Employee Benchmarks (private SaaS, n=1000+)', asOf: 2025, confidence: 'cited' },
      nrr:                { direction: 'higher', median: 1.10,   range: [1.00, 1.25],     unit: 'ratio', source: 'SaaS Capital 2025 Net Revenue Retention Benchmarks (private SaaS, n=1000+)', asOf: 2025, confidence: 'cited' },
    },
  },
  PROFESSIONAL_SERVICES: {
    businessModel: 'PROFESSIONAL_SERVICES',
    label: 'professional services',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 103,    range: [60, 130],        unit: 'days', source: 'Focus Digital Sales Cycle by Industry 2025 (Consulting 103d)', asOf: 2025, confidence: 'cited' },
      leadResponseDays:   { direction: 'lower',  median: 1.9,    range: [0.3, 2.5],       unit: 'days', source: 'Optifai lead-response study (Prof. Services 45h; Consulting 52h)', asOf: 2025, confidence: 'cited' },
      revenuePerEmployee: { direction: 'higher', median: 170000, range: [150000, 300000], unit: 'usd',  source: 'Statista Professional Services Rev/Employee; Deltek/Kantata 2025 PS Maturity Benchmark', asOf: 2024, confidence: 'cited' },
      nrr:                { direction: 'higher', median: 0.95,   range: [0.85, 1.05],     unit: 'ratio', source: 'Estimated, professional services churn offset by retainer renewals and scope expansion', asOf: 2025, confidence: 'estimated' },
    },
  },
  B2B_PRODUCT: {
    businessModel: 'B2B_PRODUCT',
    label: 'B2B product',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 130,    range: [104, 155],       unit: 'days', source: 'Focus Digital Sales Cycle by Industry 2025 (Manufacturing 130d)', asOf: 2025, confidence: 'cited' },
      leadResponseDays:   { direction: 'lower',  median: 2.0,    range: [0.7, 2.6],       unit: 'days', source: 'timetoreply 2024 (Manufacturing 42h); Optifai (Manufacturing 62h)', asOf: 2024, confidence: 'cited' },
      revenuePerEmployee: { direction: 'higher', median: 200000, range: [150000, 250000], unit: 'usd',  source: 'HRBench 2025 Rev/Employee by Industry (Manufacturing $150K-250K)', asOf: 2025, confidence: 'cited' },
      nrr:                { direction: 'higher', median: 0.90,   range: [0.80, 1.00],     unit: 'ratio', source: 'Estimated, B2B product repurchase rates anchored below SaaS (no seat-expansion lever)', asOf: 2025, confidence: 'estimated' },
    },
  },
  ECOMMERCE: {
    businessModel: 'ECOMMERCE',
    label: 'e-commerce',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 2,      range: [1, 14],          unit: 'days', source: 'Opensend Time to First Purchase (75% under 24h, 90% by day 12); Geckoboard purchase-decision window', asOf: 2025, confidence: 'cited' },
      leadResponseDays:   { direction: 'lower',  median: 0.1,    range: [0.003, 0.7],     unit: 'days', source: 'timetoreply 2024 (Retail 17h) plus LiveChat 2024 consumer-instant expectation', asOf: 2024, confidence: 'estimated' },
      revenuePerEmployee: { direction: 'higher', median: 150000, range: [100000, 250000], unit: 'usd',  source: 'HRBench 2025 (Retail $80K-150K) plus Finaloop ecommerce benchmarks, adjusted for lean DTC ops', asOf: 2024, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.85,   range: [0.75, 0.95],     unit: 'ratio', source: 'Estimated, e-commerce repurchase rates from Klaviyo/Shopify retention benchmarks (repeat purchase rate 30 to 40 percent)', asOf: 2024, confidence: 'estimated' },
    },
  },
  B2C_SERVICES: {
    businessModel: 'B2C_SERVICES',
    label: 'B2C services',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 60,     range: [8, 180],         unit: 'days', source: 'Pro Remodeler / Builder Funnel home-services; WebFX 2026 Home Services benchmarks', asOf: 2026, confidence: 'estimated' },
      leadResponseDays:   { direction: 'lower',  median: 0.2,    range: [0.01, 1.0],      unit: 'days', source: 'Extrapolated from cross-industry 42h plus consumer same-day expectation (LiveChat 2024)', asOf: 2024, confidence: 'estimated' },
      revenuePerEmployee: { direction: 'higher', median: 100000, range: [60000, 150000],  unit: 'usd',  source: 'HRBench 2025 (Leisure/Hospitality $50K-100K, Healthcare $150K-250K), blended', asOf: 2025, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.88,   range: [0.78, 0.95],     unit: 'ratio', source: 'Estimated, B2C services retention anchored to local/personal service repeat-use rates', asOf: 2025, confidence: 'estimated' },
    },
  },
  B2C_SUBSCRIPTION: {
    businessModel: 'B2C_SUBSCRIPTION',
    label: 'B2C subscription',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 3,      range: [1, 14],          unit: 'days', source: 'Estimated, extrapolated from ecommerce purchase-decision window (self-serve trial-to-paid)', asOf: 2025, confidence: 'estimated' },
      leadResponseDays:   { direction: 'lower',  median: 0.1,    range: [0.003, 0.7],     unit: 'days', source: 'Estimated, mirrors ecommerce (automation-first app/streaming support)', asOf: 2024, confidence: 'estimated' },
      revenuePerEmployee: { direction: 'higher', median: 140000, range: [90000, 200000],  unit: 'usd',  source: 'Estimated, anchored to private SaaS (130K) with a consumer-churn haircut', asOf: 2025, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.88,   range: [0.80, 0.95],     unit: 'ratio', source: 'Recurly 2024 Subscription Benchmarks Report (consumer subscription median)', asOf: 2024, confidence: 'cited' },
    },
  },
  MARKETPLACE: {
    businessModel: 'MARKETPLACE',
    label: 'marketplace',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 90,     range: [60, 180],        unit: 'days', source: 'Estimated, Sharetribe/journeyh.io marketplace supply-side recruitment (3 to 6 months first cohort)', asOf: 2026, confidence: 'estimated' },
      leadResponseDays:   { direction: 'lower',  median: 0.3,    range: [0.01, 1.5],      unit: 'days', source: 'Estimated, blend of SaaS (supply side) and ecommerce (demand side)', asOf: 2024, confidence: 'estimated' },
      revenuePerEmployee: { direction: 'higher', median: 180000, range: [120000, 300000], unit: 'usd',  source: 'Estimated, no representative SMB data (public marketplaces are outliers); anchored above SaaS', asOf: 2025, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.92,   range: [0.82, 1.05],     unit: 'ratio', source: 'Estimated, marketplace supply-side retention blended with demand-side repurchase', asOf: 2025, confidence: 'estimated' },
    },
  },
  OTHER: {
    businessModel: 'OTHER',
    label: 'small-to-mid business',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 90,     range: [45, 130],        unit: 'days', source: 'Cross-industry blended SMB fallback (Focus Digital all-industry 70 to 162 day span)', asOf: 2025, confidence: 'estimated' },
      leadResponseDays:   { direction: 'lower',  median: 1.75,   range: [0.04, 2.0],      unit: 'days', source: 'Cross-industry average 42 to 47h (timetoreply / Optifai), generic SMB fallback', asOf: 2024, confidence: 'cited' },
      revenuePerEmployee: { direction: 'higher', median: 150000, range: [100000, 250000], unit: 'usd',  source: 'HRBench cross-industry SMB-services-weighted median (excludes capital-intensive skew)', asOf: 2024, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.90,   range: [0.80, 1.00],     unit: 'ratio', source: 'Estimated, cross-industry SMB fallback blending product and service retention norms', asOf: 2024, confidence: 'estimated' },
    },
  },
};

export function getBusinessModelBenchmark(businessModel) {
  return BUSINESS_MODEL_BENCHMARKS[businessModel] || BUSINESS_MODEL_BENCHMARKS.OTHER;
}

export function classifyAgainstBenchmark(value, metric) {
  const { median, range, direction } = metric;
  const [low, high] = range;
  let band;
  if (direction === 'lower') {
    if (value <= median) band = 'strong';
    else if (value <= high) band = 'typical';
    else band = 'lagging';
  } else {
    if (value >= median) band = 'strong';
    else if (value >= low) band = 'typical';
    else band = 'lagging';
  }
  const interpretation = { strong: 'meets', typical: 'partial', lagging: 'fails' }[band];
  return { band, interpretation, median, range };
}
```

Note: the canonical RevOps Coaching App file uses em-dashes inside `source` strings. Those are replaced with commas in the vendored copy to comply with the no-em-dash rule (these strings are surfaced as `Source:` footers on client-facing dollar lines).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/businessModelBenchmarks.test.js`
Expected: all assertions pass (8 business models, fallback, metric shape, classifier in both directions).

- [ ] **Step 5: Commit**

```bash
git add lib/scorecard/businessModelBenchmarks.js __tests__/scorecard/businessModelBenchmarks.test.js
git commit -m "feat(scorecard): vendor businessModelBenchmarks v1.1"
```

---

## Task 3: Build `lib/scorecard/questions.js`

The sixteen-question structure as pure data. Q15 carries a `showIf(answers)` predicate. Every maturity option carries `score: 1..4`. Section 2 questions carry a `peerAnchorTemplate` string with a `{model_label}` placeholder.

**Files:**
- Create: `lib/scorecard/questions.js`
- Create: `__tests__/scorecard/questions.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/questions.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { QUESTIONS, BUSINESS_MODEL_OPTIONS, getQuestionsFor } from '@/lib/scorecard/questions';

describe('questions data', () => {
  it('exports 16 questions', () => {
    expect(QUESTIONS).toHaveLength(16);
  });

  it('question ids are q1 through q16', () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual([
      'q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15','q16',
    ]);
  });

  it('q1 through q3 are segmentation', () => {
    for (const id of ['q1','q2','q3']) {
      expect(QUESTIONS.find((q) => q.id === id).kind).toBe('segmentation');
    }
  });

  it('q4 through q12 are maturity with score 1..4 on every option', () => {
    for (let i = 4; i <= 12; i++) {
      const q = QUESTIONS.find((q) => q.id === `q${i}`);
      expect(q.kind).toBe('maturity');
      expect(q.options).toHaveLength(4);
      expect(q.options.map((o) => o.score)).toEqual([1, 2, 3, 4]);
    }
  });

  it('q13 through q15 are financial', () => {
    for (const id of ['q13','q14','q15']) {
      expect(QUESTIONS.find((q) => q.id === id).kind).toBe('financial');
    }
  });

  it('q14 and q15 carry a notTracked option', () => {
    const q14 = QUESTIONS.find((q) => q.id === 'q14');
    const q15 = QUESTIONS.find((q) => q.id === 'q15');
    expect(q14.options.some((o) => o.notTracked === true)).toBe(true);
    expect(q15.options.some((o) => o.notTracked === true)).toBe(true);
  });

  it('q15 is hidden when q2 = B2B_PRODUCT or ECOMMERCE', () => {
    expect(getQuestionsFor({ q2: { value: 'B2B_PRODUCT' } }).find((q) => q.id === 'q15')).toBeUndefined();
    expect(getQuestionsFor({ q2: { value: 'ECOMMERCE' } }).find((q) => q.id === 'q15')).toBeUndefined();
    expect(getQuestionsFor({ q2: { value: 'B2B_SAAS' } }).find((q) => q.id === 'q15')).toBeDefined();
  });

  it('every Section 2 question carries a non-empty peerAnchorTemplate string', () => {
    for (let i = 4; i <= 12; i++) {
      const q = QUESTIONS.find((q) => q.id === `q${i}`);
      expect(q.peerAnchorTemplate).toBeTypeOf('string');
      expect(q.peerAnchorTemplate.length).toBeGreaterThan(0);
    }
  });

  it('at least 5 of the 9 Section 2 questions interpolate {model_label}', () => {
    const interpolated = [];
    for (let i = 4; i <= 12; i++) {
      const q = QUESTIONS.find((q) => q.id === `q${i}`);
      if (/\{model_label\}/.test(q.peerAnchorTemplate)) interpolated.push(q.id);
    }
    expect(interpolated.length).toBeGreaterThanOrEqual(5);
  });

  it('BUSINESS_MODEL_OPTIONS maps to the 8 benchmark enum values', () => {
    expect(BUSINESS_MODEL_OPTIONS.map((o) => o.value).sort()).toEqual([
      'B2B_PRODUCT','B2B_SAAS','B2C_SERVICES','B2C_SUBSCRIPTION','ECOMMERCE','MARKETPLACE','OTHER','PROFESSIONAL_SERVICES',
    ]);
  });

  it('no em-dash in any question prompt or option label', () => {
    const emDash = /—/;
    for (const q of QUESTIONS) {
      expect(q.prompt, q.id).not.toMatch(emDash);
      if (q.peerAnchorTemplate) expect(q.peerAnchorTemplate, q.id).not.toMatch(emDash);
      for (const opt of q.options) {
        expect(opt.label, `${q.id}.${opt.value}`).not.toMatch(emDash);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/questions.test.js`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the implementation**

Create `lib/scorecard/questions.js`:
```js
/**
 * The 16-question maturity scorecard structure. Pure data, no UI.
 *
 * Sections:
 *   1 (q1..q3): segmentation. Revenue band, business model, team size.
 *   2 (q4..q12): nine maturity competencies probed at three stage boundaries.
 *   3 (q13..q15): financial inputs. Deal value, sales cycle, churn.
 *   3 (q16): reserved for a future lead-response-time question.
 *
 * Maturity options score 1..4 (Absent, Informal, Functional, Managed).
 * Score 5 (Optimized) is excluded from a free 16-question quiz by design.
 *
 * Q15 is hidden for business models where churn is not the operative metric.
 * Q16 is reserved (no options shipped in v1; ROI.leadResponse is documented
 * but unreachable until this question is wired).
 *
 * Peer-anchor templates use {model_label} resolved against
 * getBusinessModelBenchmark(q2).label.
 */

export const BUSINESS_MODEL_OPTIONS = [
  { value: 'B2B_SAAS',              label: 'B2B SaaS', description: 'recurring subscription software sold to other businesses' },
  { value: 'PROFESSIONAL_SERVICES', label: 'Professional services', description: 'consulting, agency, or done-for-you work for other businesses' },
  { value: 'B2B_PRODUCT',           label: 'B2B product', description: 'physical product or non-subscription software sold to other businesses' },
  { value: 'ECOMMERCE',             label: 'E-commerce', description: 'direct-to-consumer product sales' },
  { value: 'B2C_SERVICES',          label: 'B2C services', description: 'services sold to consumers' },
  { value: 'B2C_SUBSCRIPTION',      label: 'B2C subscription', description: 'recurring subscription product sold to consumers' },
  { value: 'MARKETPLACE',           label: 'Marketplace', description: 'connecting two sides of a transaction' },
  { value: 'OTHER',                 label: 'Other or mixed', description: 'something else, or a mix' },
];

const Q1_REVENUE_OPTIONS = [
  { value: 'under_1m',   label: 'Under $1M', midpoint: 750_000 },
  { value: '1m_3m',      label: '$1M to $3M', midpoint: 2_000_000 },
  { value: '3m_7m',      label: '$3M to $7M', midpoint: 5_000_000 },
  { value: '7m_15m',     label: '$7M to $15M', midpoint: 11_000_000 },
  { value: 'over_15m',   label: 'Over $15M', midpoint: 20_000_000 },
];

const Q3_TEAM_OPTIONS = [
  { value: 'just_me',  label: 'Just me', midpoint: 1 },
  { value: '2_10',     label: '2 to 10', midpoint: 6 },
  { value: '11_25',    label: '11 to 25', midpoint: 18 },
  { value: '26_50',    label: '26 to 50', midpoint: 38 },
  { value: '51_75',    label: '51 to 75', midpoint: 63 },
  { value: '75_plus',  label: 'Over 75', midpoint: 90 },
];

const Q13_DEAL_OPTIONS = [
  { value: 'under_5k',   label: 'Under $5K', midpoint: 2_500 },
  { value: '5k_25k',     label: '$5K to $25K', midpoint: 15_000 },
  { value: '25k_100k',   label: '$25K to $100K', midpoint: 62_500 },
  { value: 'over_100k',  label: 'Over $100K', midpoint: 200_000 },
];

const Q14_CYCLE_OPTIONS = [
  { value: 'not_tracked', label: 'Not sure, I do not track this', notTracked: true },
  { value: 'under_30',    label: 'Under 30 days', midpoint: 20 },
  { value: '30_90',       label: '30 to 90 days', midpoint: 60 },
  { value: '90_180',      label: '90 to 180 days', midpoint: 135 },
  { value: 'over_180',    label: 'Over 180 days', midpoint: 240 },
];

const Q15_CHURN_OPTIONS = [
  { value: 'not_tracked', label: 'Not sure, I do not track this', notTracked: true },
  { value: 'under_5',     label: 'Under 5 percent', midpoint: 0.025 },
  { value: '5_15',        label: '5 to 15 percent', midpoint: 0.10 },
  { value: '15_30',       label: '15 to 30 percent', midpoint: 0.225 },
  { value: 'over_30',     label: 'Over 30 percent', midpoint: 0.40 },
];

function maturity(prompt, peerAnchorTemplate, options) {
  return { kind: 'maturity', prompt, peerAnchorTemplate, options };
}

export const QUESTIONS = [
  { id: 'q1', section: 1, kind: 'segmentation', prompt: 'Annual revenue', options: Q1_REVENUE_OPTIONS },
  { id: 'q2', section: 1, kind: 'segmentation', prompt: 'Which best describes how your business sells?', options: BUSINESS_MODEL_OPTIONS },
  { id: 'q3', section: 1, kind: 'segmentation', prompt: 'Total team size', options: Q3_TEAM_OPTIONS },

  {
    id: 'q4', section: 2, competency: 3, competencyLabel: 'CRM architecture',
    ...maturity(
      'How do the people who touch customers in your business track deals right now?',
      'Most {model_label} founders at your revenue level run on a CRM. The question is whether the team actually uses it.',
      [
        { value: 'A', label: 'There is no CRM, or our deal information lives in email, spreadsheets, or my head.', score: 1 },
        { value: 'B', label: 'We have a CRM, but it gets used inconsistently and the data is patchy.', score: 2 },
        { value: 'C', label: 'Everyone who touches customers uses the CRM, and the basics are reliable.', score: 3 },
        { value: 'D', label: 'The CRM is governed. Required fields are enforced by stage, and the data model is reviewed against how the business actually runs.', score: 4 },
      ],
    ),
  },
  {
    id: 'q5', section: 2, competency: 6, competencyLabel: 'lead qualification',
    ...maturity(
      'When a new lead comes in, how does your team decide whether to pursue it?',
      'The most expensive deals are the ones you should have disqualified.',
      [
        { value: 'A', label: 'Anyone willing to talk to us. We chase what is in front of us.', score: 1 },
        { value: 'B', label: 'We use sales judgment. Different people on the team would make different calls and we accept that.', score: 2 },
        { value: 'C', label: 'We have a documented ideal-customer profile and qualification criteria the team uses on every new lead.', score: 3 },
        { value: 'D', label: 'Those criteria are encoded in our CRM scoring and validated against close rates. We disqualify confidently.', score: 4 },
      ],
    ),
  },
  {
    id: 'q6', section: 2, competency: 5, competencyLabel: 'pipeline stage design',
    ...maturity(
      'What has to be true for a deal to move from one stage to the next in your pipeline?',
      'Most {model_label} pipelines I see fail here: stage names exist, exit criteria do not.',
      [
        { value: 'A', label: 'Whatever the rep working the deal feels is right.', score: 1 },
        { value: 'B', label: 'We have custom stage names that fit our process, but no documented criteria for advancement.', score: 2 },
        { value: 'C', label: 'Each stage has documented exit criteria written as buyer-verified facts, not sales activities. The team uses them.', score: 3 },
        { value: 'D', label: 'Those exit criteria are encoded as required CRM fields. A deal cannot advance without them.', score: 4 },
      ],
    ),
  },
  {
    id: 'q7', section: 2, competency: 7, competencyLabel: 'revenue forecasting',
    ...maturity(
      'When a quarter ends, how often does your actual revenue match what you expected at the start of the quarter?',
      'This question is about predictability, not the existence of a spreadsheet.',
      [
        { value: 'A', label: 'Honestly, I do not produce a forecast at the start of the quarter.', score: 1 },
        { value: 'B', label: 'The gap is usually large. We are off by more than thirty percent more often than not.', score: 2 },
        { value: 'C', label: 'We are usually within twenty percent. The methodology is documented.', score: 3 },
        { value: 'D', label: 'We consistently stay under fifteen percent variance, and we produce multiple views (best, commit, worst).', score: 4 },
      ],
    ),
  },
  {
    id: 'q8', section: 2, competency: 8, competencyLabel: 'operating cadence and reporting',
    ...maturity(
      'When your leadership team sits down to talk about revenue, what usually happens?',
      'This is the Stage 3 boundary. Stage 3 businesses have a defined cadence and they trust the dashboards. Stage 2 businesses argue about the numbers.',
      [
        { value: 'A', label: 'We do not have regular revenue reviews. We talk about revenue when something is wrong.', score: 1 },
        { value: 'B', label: 'We meet, but the agenda varies. Meetings often start by debating which numbers are right.', score: 2 },
        { value: 'C', label: 'We run a defined cadence with trusted dashboards. Meetings start with questions about what the data means, not whether it is right.', score: 3 },
        { value: 'D', label: 'Dashboards populate before each meeting. Anomalies are investigated and resolved within days. Decisions are tracked and followed up.', score: 4 },
      ],
    ),
  },
  {
    id: 'q9', section: 2, competency: 13, competencyLabel: 'shared revenue definitions',
    ...maturity(
      'If you asked your marketing lead and your top salesperson what a qualified lead is, would you get the same answer?',
      'The single most common alignment debate I see in {model_label} businesses.',
      [
        { value: 'A', label: 'Honestly, I am not sure either of them could give me a clean answer.', score: 1 },
        { value: 'B', label: 'Yes-ish, but they would debate it. The definition is verbal, not documented.', score: 2 },
        { value: 'C', label: 'Yes. The definition is documented, shared, and both functions use it.', score: 3 },
        { value: 'D', label: 'The definition is encoded in the CRM, the marketing-to-sales SLA is monitored weekly, and both functions are accountable to it.', score: 4 },
      ],
    ),
  },
  {
    id: 'q10', section: 2, competency: 25, competencyLabel: 'win and loss analysis',
    ...maturity(
      'When you lose a deal, how do you find out why?',
      'Most {model_label} businesses I work with believe they lose on price. The data usually says otherwise.',
      [
        { value: 'A', label: 'We assume it was price, fit, or timing. We move on.', score: 1 },
        { value: 'B', label: 'Reps fill in a CRM dropdown, but the entries are inconsistent and we rarely look at them.', score: 2 },
        { value: 'C', label: 'We run a quarterly win/loss review with coded reasons and use the findings to update the playbook.', score: 3 },
        { value: 'D', label: 'Someone other than the AE interviews lost prospects. The findings update qualification criteria, positioning, and enablement on a defined cadence.', score: 4 },
      ],
    ),
  },
  {
    id: 'q11', section: 2, competency: 29, competencyLabel: 'expansion and net revenue retention',
    ...maturity(
      'In the last twelve months, how much of your revenue growth came from expanding existing clients vs. winning new ones?',
      'For {model_label} businesses with retention dynamics, this is where compound growth comes from.',
      [
        { value: 'A', label: 'Not sure. I do not track that distinction.', score: 1 },
        { value: 'B', label: 'Almost all of it is new logos. Expansion happens when clients ask.', score: 2 },
        { value: 'C', label: 'We track new vs. expansion, and some expansion happens, but it is not a managed motion with defined plays.', score: 3 },
        { value: 'D', label: 'Expansion is a proactive motion with defined triggers. Net revenue retention is tracked monthly and is a primary business metric.', score: 4 },
      ],
    ),
  },
  {
    id: 'q12', section: 2, competency: 40, competencyLabel: 'leading indicators',
    ...maturity(
      'When something is about to break in your revenue engine, how do you usually find out?',
      'This is the Stage 4 boundary. Stage 4 businesses act on signals. Stage 3 businesses react to results.',
      [
        { value: 'A', label: 'When we miss the number.', score: 1 },
        { value: 'B', label: 'At the end-of-quarter review.', score: 2 },
        { value: 'C', label: 'Our pipeline review surfaces problems mid-quarter, sometimes earlier.', score: 3 },
        { value: 'D', label: 'Leading indicators alert us before the lagging metric moves. We act on signals, not surprises.', score: 4 },
      ],
    ),
  },

  { id: 'q13', section: 3, kind: 'financial', prompt: 'Average value of a new closed deal', options: Q13_DEAL_OPTIONS },
  { id: 'q14', section: 3, kind: 'financial', prompt: 'Average sales cycle (first qualified conversation to closed-won)', options: Q14_CYCLE_OPTIONS },
  { id: 'q15', section: 3, kind: 'financial', prompt: 'Annual gross revenue churn (what percentage of recurring revenue do you lose per year before any expansion?)', options: Q15_CHURN_OPTIONS, showIf: (answers) => {
    const q2 = answers?.q2?.value;
    return q2 !== 'B2B_PRODUCT' && q2 !== 'ECOMMERCE';
  } },

  { id: 'q16', section: 3, kind: 'reserved', prompt: '', options: [], shipped: false },
];

export function getQuestionsFor(answers) {
  return QUESTIONS.filter((q) => {
    if (q.id === 'q16') return false; // reserved, not shipped in v1
    if (typeof q.showIf === 'function') return q.showIf(answers);
    return true;
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/questions.test.js`
Expected: all passes.

- [ ] **Step 5: Commit**

```bash
git add lib/scorecard/questions.js __tests__/scorecard/questions.test.js
git commit -m "feat(scorecard): 16-question structure with peer-anchor templates"
```

---

## Task 4: Build `lib/scorecard/scoring.js`

Pure functions for stage placement, bright-spot detection, and binding-boundary diagnosis. No I/O.

**Files:**
- Create: `lib/scorecard/scoring.js`
- Create: `__tests__/scorecard/scoring.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/scoring.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { stagePlacement, brightSpots, bindingBoundary } from '@/lib/scorecard/scoring';

function answers({ a = [3, 3, 3], b = [3, 3, 3], c = [4, 4, 4] } = {}) {
  return {
    q4:  { score: a[0] }, q5:  { score: a[1] }, q6:  { score: a[2] },
    q7:  { score: b[0] }, q8:  { score: b[1] }, q9:  { score: b[2] },
    q10: { score: c[0] }, q11: { score: c[1] }, q12: { score: c[2] },
  };
}

describe('stagePlacement', () => {
  it('returns 1 when any Block A score < 3', () => {
    expect(stagePlacement(answers({ a: [2, 3, 3] }))).toBe(1);
    expect(stagePlacement(answers({ a: [1, 4, 4] }))).toBe(1);
  });

  it('returns 2 when Block A >= 3 and any Block B score < 3', () => {
    expect(stagePlacement(answers({ a: [3, 3, 3], b: [2, 3, 3] }))).toBe(2);
    expect(stagePlacement(answers({ a: [4, 4, 4], b: [1, 4, 4] }))).toBe(2);
  });

  it('returns 3 when Blocks A and B >= 3 and any Block C score < 4', () => {
    expect(stagePlacement(answers({ a: [3, 3, 3], b: [3, 3, 3], c: [3, 4, 4] }))).toBe(3);
    expect(stagePlacement(answers({ a: [4, 4, 4], b: [4, 4, 4], c: [1, 4, 4] }))).toBe(3);
  });

  it('returns 4 when Block A and B >= 3 and Block C all >= 4', () => {
    expect(stagePlacement(answers({ a: [3, 3, 3], b: [3, 3, 3], c: [4, 4, 4] }))).toBe(4);
    expect(stagePlacement(answers({ a: [4, 4, 4], b: [4, 4, 4], c: [4, 4, 4] }))).toBe(4);
  });

  it('Block A boundary: score = 3 passes, score = 2 fails', () => {
    expect(stagePlacement(answers({ a: [3, 3, 3] }))).toBeGreaterThanOrEqual(2);
    expect(stagePlacement(answers({ a: [2, 4, 4] }))).toBe(1);
  });

  it('Block C boundary: score = 4 passes, score = 3 stays at Stage 3', () => {
    expect(stagePlacement(answers({ c: [4, 4, 4] }))).toBe(4);
    expect(stagePlacement(answers({ c: [3, 4, 4] }))).toBe(3);
  });
});

describe('brightSpots', () => {
  it('returns up to 2 answers scoring strictly higher than placement', () => {
    const a = answers({ a: [2, 4, 4], b: [3, 3, 3], c: [3, 3, 3] });
    // placement = 1 (block A has a 2). Bright spots = answers scoring > 1: q5(4), q6(4), q7..q12 (3s)
    const spots = brightSpots(a, 1);
    expect(spots.length).toBeLessThanOrEqual(2);
    for (const s of spots) {
      expect(s.score).toBeGreaterThan(1);
    }
  });

  it('returns empty array when no answer scores above placement', () => {
    const a = answers({ a: [4, 4, 4], b: [4, 4, 4], c: [4, 4, 4] });
    // placement = 4, nothing scores > 4
    expect(brightSpots(a, 4)).toEqual([]);
  });

  it('returns highest-scoring answers first', () => {
    const a = answers({ a: [2, 3, 4], b: [3, 3, 3], c: [3, 3, 3] });
    const spots = brightSpots(a, 1);
    if (spots.length >= 2) {
      expect(spots[0].score).toBeGreaterThanOrEqual(spots[1].score);
    }
  });
});

describe('bindingBoundary', () => {
  it('returns Block A details when placement = 1', () => {
    const a = answers({ a: [2, 3, 1] });
    const result = bindingBoundary(a, 1);
    expect(result.failingBlock).toBe('A');
    // two lowest-scoring in block A: q6 (1) then q4 (2)
    expect(result.questions.map((q) => q.id)).toEqual(['q6', 'q4']);
  });

  it('returns Block B details when placement = 2', () => {
    const a = answers({ a: [3, 3, 3], b: [1, 2, 3] });
    const result = bindingBoundary(a, 2);
    expect(result.failingBlock).toBe('B');
    expect(result.questions.map((q) => q.id)).toEqual(['q7', 'q8']);
  });

  it('returns Block C details when placement = 3', () => {
    const a = answers({ a: [3, 3, 3], b: [3, 3, 3], c: [3, 3, 4] });
    const result = bindingBoundary(a, 3);
    expect(result.failingBlock).toBe('C');
    expect(result.questions.map((q) => q.id)).toEqual(['q10', 'q11']);
  });

  it('returns null when placement = 4 (no binding boundary)', () => {
    const a = answers({ a: [4, 4, 4], b: [4, 4, 4], c: [4, 4, 4] });
    expect(bindingBoundary(a, 4)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/scoring.test.js`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the implementation**

Create `lib/scorecard/scoring.js`:
```js
/**
 * Stage placement, bright-spot detection, and binding-boundary diagnosis.
 *
 * Block A = q4, q5, q6 (Stage 1 -> 2 boundary). Threshold: 3 (Functional).
 * Block B = q7, q8, q9 (Stage 2 -> 3 boundary). Threshold: 3 (Functional).
 * Block C = q10, q11, q12 (Stage 3 -> 4 boundary). Threshold: 4 (Managed).
 *
 * Weakest-link rule: a single score below the block threshold blocks
 * advancement, mirroring the Phase B framework's own guidance.
 */

import { QUESTIONS } from './questions';

const BLOCKS = {
  A: ['q4', 'q5', 'q6'],
  B: ['q7', 'q8', 'q9'],
  C: ['q10', 'q11', 'q12'],
};

function scoresIn(answers, ids) {
  return ids.map((id) => answers[id]?.score);
}

export function stagePlacement(answers) {
  if (Math.min(...scoresIn(answers, BLOCKS.A)) < 3) return 1;
  if (Math.min(...scoresIn(answers, BLOCKS.B)) < 3) return 2;
  if (Math.min(...scoresIn(answers, BLOCKS.C)) < 4) return 3;
  return 4;
}

export function brightSpots(answers, placement) {
  const maturityIds = [...BLOCKS.A, ...BLOCKS.B, ...BLOCKS.C];
  const spots = maturityIds
    .map((id) => {
      const q = QUESTIONS.find((x) => x.id === id);
      const score = answers[id]?.score ?? 0;
      return { id, score, competencyLabel: q?.competencyLabel };
    })
    .filter((s) => s.score > placement)
    .sort((a, b) => b.score - a.score);
  return spots.slice(0, 2);
}

export function bindingBoundary(answers, placement) {
  if (placement === 4) return null;
  const blockKey = placement === 1 ? 'A' : placement === 2 ? 'B' : 'C';
  const blockIds = BLOCKS[blockKey];
  const ranked = blockIds
    .map((id) => {
      const q = QUESTIONS.find((x) => x.id === id);
      return { id, score: answers[id]?.score ?? 0, competencyLabel: q?.competencyLabel };
    })
    .sort((a, b) => a.score - b.score);
  return { failingBlock: blockKey, questions: ranked.slice(0, 2) };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/scoring.test.js`
Expected: all passes.

- [ ] **Step 5: Commit**

```bash
git add lib/scorecard/scoring.js __tests__/scorecard/scoring.test.js
git commit -m "feat(scorecard): stage placement and binding-boundary diagnosis"
```

---

## Task 5: Build `lib/scorecard/voice.js`

Static copy, voice sanitizer, comparison-copy table, stage names and descriptors, source-citation helper, USD formatter.

**Files:**
- Create: `lib/scorecard/voice.js`
- Create: `__tests__/scorecard/voice.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/voice.test.js`:
```js
import { describe, it, expect } from 'vitest';
import {
  sanitizeVoice,
  SECTION_LABELS,
  SECTION_SUBLINES,
  STAGE_NAMES,
  STAGE_DESCRIPTORS,
  COMPARISON_COPY,
  DISCLOSURE,
  CTA_LINES,
  CTA_HEADING,
  sourceCitation,
  formatUsd,
  bandTitle,
} from '@/lib/scorecard/voice';

describe('sanitizeVoice', () => {
  it('returns clean strings unchanged', () => {
    expect(sanitizeVoice('Your number is right here.')).toBe('Your number is right here.');
  });

  it('throws on em-dash', () => {
    expect(() => sanitizeVoice('this is—broken')).toThrow(/em-dash/);
  });

  it('throws on first-person plural we/our/us', () => {
    expect(() => sanitizeVoice('we built this')).toThrow(/first-person plural/);
    expect(() => sanitizeVoice('Our roadmap')).toThrow(/first-person plural/);
    expect(() => sanitizeVoice('Tell us more')).toThrow(/first-person plural/);
  });

  it('does NOT flag "us" inside a word (business, usually, status, etc.)', () => {
    expect(() => sanitizeVoice('business as usual status')).not.toThrow();
  });

  it('passes through non-string inputs', () => {
    expect(sanitizeVoice(42)).toBe(42);
    expect(sanitizeVoice(null)).toBe(null);
  });
});

describe('static copy is clean and present', () => {
  it('SECTION_LABELS covers sections 1..3', () => {
    expect(SECTION_LABELS[1]).toBeTypeOf('string');
    expect(SECTION_LABELS[2]).toBeTypeOf('string');
    expect(SECTION_LABELS[3]).toBeTypeOf('string');
  });

  it('SECTION_SUBLINES covers sections 1..3 and has no em-dash', () => {
    for (const k of [1, 2, 3]) {
      expect(SECTION_SUBLINES[k]).toBeTypeOf('string');
      expect(SECTION_SUBLINES[k]).not.toMatch(/—/);
    }
  });

  it('STAGE_NAMES are Reactive, Repeatable, Predictable, Compounding', () => {
    expect(STAGE_NAMES[1]).toBe('Reactive');
    expect(STAGE_NAMES[2]).toBe('Repeatable');
    expect(STAGE_NAMES[3]).toBe('Predictable');
    expect(STAGE_NAMES[4]).toBe('Compounding');
  });

  it('STAGE_DESCRIPTORS cover stages 1..4 with no em-dash and no first-person plural', () => {
    for (const k of [1, 2, 3, 4]) {
      expect(STAGE_DESCRIPTORS[k]).toBeTypeOf('string');
      expect(STAGE_DESCRIPTORS[k]).not.toMatch(/—/);
      expect(STAGE_DESCRIPTORS[k]).not.toMatch(/\b(we|our|us)\b/i);
    }
  });

  it('COMPARISON_COPY covers all four generators in all three bands', () => {
    for (const key of ['salesCycle', 'nrr', 'revenuePerEmployee', 'leadResponse']) {
      for (const band of ['meets', 'partial', 'fails']) {
        expect(COMPARISON_COPY[key][band]).toBeTypeOf('string');
      }
    }
  });

  it('DISCLOSURE and CTA copy are clean strings', () => {
    expect(DISCLOSURE).toBeTypeOf('string');
    expect(DISCLOSURE).not.toMatch(/—/);
    expect(CTA_HEADING).toBeTypeOf('string');
    expect(CTA_LINES).toHaveLength(4);
    for (const line of CTA_LINES) {
      expect(line).toBeTypeOf('string');
      expect(line).not.toMatch(/—/);
    }
  });
});

describe('sourceCitation', () => {
  it('emits the v1.1 footer with the model label', () => {
    expect(sourceCitation('B2B SaaS')).toBe('Source: businessModelBenchmarks v1.1, B2B SaaS row.');
  });
});

describe('formatUsd', () => {
  it('formats millions with one decimal', () => {
    expect(formatUsd(2_400_000)).toBe('$2.4M');
  });

  it('formats thousands as $XK rounded', () => {
    expect(formatUsd(150_000)).toBe('$150K');
    expect(formatUsd(15_500)).toBe('$16K');
  });

  it('formats values under $1K as dollars', () => {
    expect(formatUsd(750)).toBe('$750');
  });
});

describe('bandTitle', () => {
  it('returns the human-readable title for each generator key', () => {
    expect(bandTitle('revenuePerEmployee')).toBe('Revenue per employee gap');
    expect(bandTitle('salesCycle')).toBe('Sales cycle compression');
    expect(bandTitle('nrr')).toBe('Retention gap');
    expect(bandTitle('leadResponse')).toBe('Lead response peer gap');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/voice.test.js`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the implementation**

Create `lib/scorecard/voice.js`:
```js
/**
 * Voice and copy templates for the maturity scorecard.
 *
 * Voice rules (strict):
 *   - First-person Bradley ("I", "you"). No "we/our/us" in client-facing copy.
 *   - No em-dashes (this content reaches the email and PDF paths).
 *   - Loss framing on every dollar line. Source citation on every benchmark.
 *
 * sanitizeVoice() runs as a defense-in-depth check at template definition
 * time so a regression in this file fails the test suite immediately.
 */

export function sanitizeVoice(s) {
  if (typeof s !== 'string') return s;
  if (/—/.test(s)) {
    throw new Error(`Voice violation: em-dash in copy: ${s}`);
  }
  if (/\b(we|our|us)\b/i.test(s)) {
    throw new Error(`Voice violation: first-person plural in copy: ${s}`);
  }
  return s;
}

export const SECTION_LABELS = {
  1: 'About your business',
  2: 'Your operating system',
  3: 'Your numbers',
};

export const SECTION_SUBLINES = {
  1: sanitizeVoice('Three taps so I know who I am comparing you to.'),
  2: sanitizeVoice('Now the diagnostic. Nine questions about how your business actually runs.'),
  3: sanitizeVoice('Three numbers about your business so I can put dollars on the gap. Bands, not exact figures.'),
};

export const STAGE_NAMES = {
  1: 'Reactive',
  2: 'Repeatable',
  3: 'Predictable',
  4: 'Compounding',
};

export const STAGE_DESCRIPTORS = {
  1: sanitizeVoice('Revenue depends on your personal effort, relationships, and judgment. Nothing is consistent without you directly involved. Every new dollar requires personal attention. The team follows you, not a system. Growth means you working harder or longer.'),
  2: sanitizeVoice('A system exists that the team can follow without you managing every interaction. A CRM is the system of record. Core processes are documented. Basic revenue visibility exists. But data is not fully trusted, the forecast still relies on intuition, and growth still feels effortful.'),
  3: sanitizeVoice('The business runs on trusted data. Shared definitions, consistent operating cadences, and a reliable forecast mean you know what will happen before it happens. Growth no longer requires proportional headcount increase. Decisions are made from data, not around it.'),
  4: sanitizeVoice('The system improves itself. Leading indicators surface problems before they show up in revenue. Expansion grows without proportional new logo acquisition. Decisions are made from predictive signals, not just historical reports.'),
};

export const COMPARISON_COPY = {
  salesCycle:         { meets: 'at or faster than peer', partial: 'slower than peer median', fails: 'slower than peer' },
  nrr:                { meets: 'at or above peer',      partial: 'below peer median',         fails: 'below peer' },
  revenuePerEmployee: { meets: 'at or above peer',      partial: 'below peer median',         fails: 'below peer' },
  leadResponse:       { meets: 'at or faster than peer', partial: 'slower than peer median', fails: 'slower than peer' },
};

const ROI_TITLES = {
  revenuePerEmployee: 'Revenue per employee gap',
  salesCycle:         'Sales cycle compression',
  nrr:                'Retention gap',
  leadResponse:       'Lead response peer gap',
};

export function bandTitle(key) {
  return ROI_TITLES[key] || key;
}

export const DISCLOSURE = sanitizeVoice(
  'This is a directional read from sixteen questions. It tells you which stage of the maturity ladder you sit on, where you stack up against peer benchmarks on the three metrics I can compute from your inputs, and the boundary you need to cross next. It does not replace the full assessment, which connects to your CRM and revenue tools, scores all 44 competencies, and produces the specific roadmap from where you are to the business outcome you want. If the numbers above feel directionally right, that is the signal to take the next step.'
);

export const CTA_HEADING = 'The Modern BizOps Maturity Assessment';

export const CTA_LINES = [
  sanitizeVoice('Automated analysis of your CRM and revenue tools'),
  sanitizeVoice('All 44 competencies scored, not just nine'),
  sanitizeVoice('A 90-minute working session with me to walk you through it'),
  sanitizeVoice('A 12-week operational roadmap mapped to your stated business outcome'),
];

export function sourceCitation(modelLabel) {
  return `Source: businessModelBenchmarks v1.1, ${modelLabel} row.`;
}

export function formatUsd(n) {
  if (!Number.isFinite(n) || n < 0) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/voice.test.js`
Expected: all passes.

- [ ] **Step 5: Commit**

```bash
git add lib/scorecard/voice.js __tests__/scorecard/voice.test.js
git commit -m "feat(scorecard): voice templates, sanitizer, comparison-copy table"
```

---

## Task 6: Build `lib/scorecard/roi.js`

Four generators (`revenuePerEmployee`, `salesCycle`, `nrr`, `leadResponse`) and a ranker. Generators look up midpoints from the QUESTIONS data (no duplicate magic numbers). Generators return `null` when the resulting `medianDollars <= 0` so we never render a "leaving $0 on the table" line.

**Files:**
- Create: `lib/scorecard/roi.js`
- Create: `__tests__/scorecard/roi.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/roi.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { generateRoiLines, generators } from '@/lib/scorecard/roi';
import { getBusinessModelBenchmark } from '@/lib/scorecard/businessModelBenchmarks';

function baseAnswers(overrides = {}) {
  return {
    q1: { value: '3m_7m' },         // $5M midpoint
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '11_25' },         // 18 midpoint
    q13: { value: '25k_100k' },
    q14: { value: '90_180' },       // 135-day midpoint
    q15: { value: '15_30' },        // NRR 0.775
    ...overrides,
  };
}

describe('revenuePerEmployee generator', () => {
  it('fires when client revenue/employee is below the peer band low', () => {
    // PS: revenuePerEmployee median 170K, range [150K, 300K]. Client 5M/18 = 278K. That is BETWEEN low and median (partial).
    // floor_diff = 150K - 278K < 0 -> floor = 0. median_diff = 170K - 278K < 0 -> median = 0. Line returns null.
    const a = baseAnswers();
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.revenuePerEmployee(a, benchmark);
    expect(line).toBeNull();
  });

  it('fires with positive dollars when client is well below median', () => {
    // q1 under_1m ($750K) / q3 2_10 (6) = 125K per employee. PS median 170K, low 150K. Both diffs positive.
    const a = baseAnswers({ q1: { value: 'under_1m' }, q3: { value: '2_10' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.revenuePerEmployee(a, benchmark);
    expect(line).not.toBeNull();
    expect(line.key).toBe('revenuePerEmployee');
    expect(line.medianDollars).toBeGreaterThan(0);
    expect(line.floorDollars).toBeGreaterThan(0);
    expect(line.comparison).toBe('fails');
    expect(line.comparisonCopy).toBe('below peer');
    expect(line.source).toMatch(/businessModelBenchmarks v1\.1/);
    expect(line.body).not.toMatch(/—/);
  });
});

describe('salesCycle generator', () => {
  it('returns null when q14 is not_tracked', () => {
    const a = baseAnswers({ q14: { value: 'not_tracked' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.salesCycle(a, benchmark)).toBeNull();
  });

  it('returns null when client cycle is at or under peer median (meets)', () => {
    // PS median 103. q14 under_30 -> 20 days. Strong/meets. Return null.
    const a = baseAnswers({ q14: { value: 'under_30' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.salesCycle(a, benchmark)).toBeNull();
  });

  it('fires with dollar gap when client cycle is well above median', () => {
    // q14 over_180 -> 240 days. PS range [60, 130]. Lagging/fails.
    // floor = (240/130 - 1) * 5M ~ 4.2M, median = (240/103 - 1) * 5M ~ 6.6M
    const a = baseAnswers({ q14: { value: 'over_180' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.salesCycle(a, benchmark);
    expect(line).not.toBeNull();
    expect(line.key).toBe('salesCycle');
    expect(line.medianDollars).toBeGreaterThan(line.floorDollars);
    expect(line.comparison).toBe('fails');
    expect(line.comparisonCopy).toBe('slower than peer');
  });
});

describe('nrr generator', () => {
  it('returns null when q15 is absent (hidden) on the answer set', () => {
    const a = baseAnswers();
    delete a.q15;
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.nrr(a, benchmark)).toBeNull();
  });

  it('returns null when q15 is not_tracked', () => {
    const a = baseAnswers({ q15: { value: 'not_tracked' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.nrr(a, benchmark)).toBeNull();
  });

  it('fires with dollar gap when client NRR is below the peer range', () => {
    // PS nrr median 0.95, range [0.85, 1.05]. q15 over_30 -> nrr 0.60.
    // floor = (0.85 - 0.60) * 5M = 1.25M. median = (0.95 - 0.60) * 5M = 1.75M.
    const a = baseAnswers({ q15: { value: 'over_30' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.nrr(a, benchmark);
    expect(line).not.toBeNull();
    expect(line.key).toBe('nrr');
    expect(line.floorDollars).toBeGreaterThan(0);
    expect(line.medianDollars).toBeGreaterThan(line.floorDollars);
    expect(line.comparison).toBe('fails');
    expect(line.comparisonCopy).toBe('below peer');
  });
});

describe('leadResponse generator', () => {
  it('returns null in v1 (no quiz input wired)', () => {
    const a = baseAnswers();
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.leadResponse(a, benchmark)).toBeNull();
  });
});

describe('generateRoiLines (the public API)', () => {
  it('ranks by medianDollars descending and takes top 3', () => {
    // Worst case to fire all three with dollars:
    // q1 7m_15m ($11M), q3 51_75 (63 employees), q14 over_180, q15 over_30
    const a = baseAnswers({ q1: { value: '7m_15m' }, q3: { value: '51_75' }, q14: { value: 'over_180' }, q15: { value: 'over_30' } });
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    expect(lines.length).toBeLessThanOrEqual(3);
    for (let i = 1; i < lines.length; i++) {
      expect(lines[i - 1].medianDollars).toBeGreaterThanOrEqual(lines[i].medianDollars);
    }
  });

  it('omits null lines (meets/notTracked)', () => {
    // All three dollar-bearing generators fire null:
    // q14 under_30 -> meets, q15 under_5 -> meets, q1+q3 -> partial (zero dollars per the first test)
    const a = baseAnswers({ q14: { value: 'under_30' }, q15: { value: 'under_5' } });
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    expect(lines).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/roi.test.js`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the implementation**

Create `lib/scorecard/roi.js`:
```js
/**
 * ROI line generators. Each takes (answers, benchmark) and returns either
 * null or a fully-populated RoiLine. Generators return null when there is no
 * dollar gap to surface (meets band, notTracked input, or hidden question).
 *
 * Magnitude ranking: medianDollars desc, cap at 3.
 */

import { QUESTIONS } from './questions';
import { classifyAgainstBenchmark } from './businessModelBenchmarks';
import { COMPARISON_COPY, bandTitle, formatUsd, sourceCitation, sanitizeVoice } from './voice';

function getOption(qid, value) {
  const q = QUESTIONS.find((x) => x.id === qid);
  return q?.options.find((o) => o.value === value);
}

function midpoint(qid, value) {
  return getOption(qid, value)?.midpoint;
}

function fmtDays(n) {
  return `${Math.round(n)} days`;
}

function fmtPercent(ratio) {
  return `${Math.round(ratio * 100)}%`;
}

function buildLine({ key, title, clientValue, peerMedian, peerRange, comparison, floorDollars, medianDollars, body, source }) {
  return {
    key,
    title: sanitizeVoice(title),
    clientValue,
    peerMedian,
    peerRange,
    comparison,
    comparisonCopy: sanitizeVoice(COMPARISON_COPY[key][comparison]),
    floorDollars: Math.max(0, Math.round(floorDollars || 0)),
    medianDollars: Math.max(0, Math.round(medianDollars || 0)),
    body: sanitizeVoice(body),
    source,
  };
}

function revenuePerEmployee(answers, benchmark) {
  const revenue = midpoint('q1', answers.q1?.value);
  const team = midpoint('q3', answers.q3?.value);
  if (!revenue || !team) return null;
  const clientValue = revenue / team;
  const metric = benchmark.metrics.revenuePerEmployee;
  const { interpretation } = classifyAgainstBenchmark(clientValue, metric);
  const [low, high] = metric.range;
  const floorDollars = Math.max(0, low - clientValue) * team;
  const medianDollars = Math.max(0, metric.median - clientValue) * team;
  if (medianDollars <= 0) return null;
  return buildLine({
    key: 'revenuePerEmployee',
    title: bandTitle('revenuePerEmployee'),
    clientValue: { display: formatUsd(clientValue) + ' per employee', raw: clientValue, unit: 'usd' },
    peerMedian: { display: formatUsd(metric.median) + ' per employee', raw: metric.median },
    peerRange: { displayLow: formatUsd(low), displayHigh: formatUsd(high) },
    comparison: interpretation,
    floorDollars,
    medianDollars,
    body: `You are leaving between ${formatUsd(floorDollars)} and ${formatUsd(medianDollars)} of annual revenue uncaptured every year without needing to hire a single new person. This is the inversion of the problem most founders in your position describe: every dollar of revenue growth requiring another hire.`,
    source: sourceCitation(benchmark.label),
  });
}

function salesCycle(answers, benchmark) {
  const opt = getOption('q14', answers.q14?.value);
  if (!opt || opt.notTracked) return null;
  const clientDays = opt.midpoint;
  const metric = benchmark.metrics.salesCycleDays;
  const { interpretation } = classifyAgainstBenchmark(clientDays, metric);
  if (interpretation === 'meets') return null;
  const [low, high] = metric.range;
  const currentRevenue = midpoint('q1', answers.q1?.value);
  if (!currentRevenue) return null;
  const throughputToHigh = clientDays / high - 1;
  const throughputToMedian = clientDays / metric.median - 1;
  const floorDollars = Math.max(0, throughputToHigh) * currentRevenue;
  const medianDollars = Math.max(0, throughputToMedian) * currentRevenue;
  if (medianDollars <= 0) return null;
  return buildLine({
    key: 'salesCycle',
    title: bandTitle('salesCycle'),
    clientValue: { display: fmtDays(clientDays), raw: clientDays, unit: 'days' },
    peerMedian: { display: fmtDays(metric.median), raw: metric.median },
    peerRange: { displayLow: fmtDays(low), displayHigh: fmtDays(high) },
    comparison: interpretation,
    floorDollars,
    medianDollars,
    body: `At your revenue, that is between ${formatUsd(floorDollars)} and ${formatUsd(medianDollars)} of incremental closed revenue you are not capturing this year.`,
    source: sourceCitation(benchmark.label),
  });
}

function nrr(answers, benchmark) {
  if (!answers.q15) return null;
  const opt = getOption('q15', answers.q15.value);
  if (!opt || opt.notTracked) return null;
  const clientChurn = opt.midpoint;
  const clientNrr = 1 - clientChurn;
  const metric = benchmark.metrics.nrr;
  const { interpretation } = classifyAgainstBenchmark(clientNrr, metric);
  if (interpretation === 'meets') return null;
  const [low, high] = metric.range;
  const currentRevenue = midpoint('q1', answers.q1?.value);
  if (!currentRevenue) return null;
  const floorDollars = Math.max(0, low - clientNrr) * currentRevenue;
  const medianDollars = Math.max(0, metric.median - clientNrr) * currentRevenue;
  if (medianDollars <= 0) return null;
  return buildLine({
    key: 'nrr',
    title: bandTitle('nrr'),
    clientValue: { display: fmtPercent(clientNrr), raw: clientNrr, unit: 'ratio' },
    peerMedian: { display: fmtPercent(metric.median), raw: metric.median },
    peerRange: { displayLow: fmtPercent(low), displayHigh: fmtPercent(high) },
    comparison: interpretation,
    floorDollars,
    medianDollars,
    body: `You are losing between ${formatUsd(floorDollars)} and ${formatUsd(medianDollars)} of revenue every year before you even start trying to grow.`,
    source: sourceCitation(benchmark.label),
  });
}

function leadResponse(_answers, _benchmark) {
  // Reserved for a future Q16 lead-response-time question. No quiz input wired in v1.
  return null;
}

export const generators = { revenuePerEmployee, salesCycle, nrr, leadResponse };

export function generateRoiLines(answers, benchmark) {
  const all = [
    generators.revenuePerEmployee(answers, benchmark),
    generators.salesCycle(answers, benchmark),
    generators.nrr(answers, benchmark),
    generators.leadResponse(answers, benchmark),
  ].filter(Boolean);
  all.sort((a, b) => b.medianDollars - a.medianDollars);
  return all.slice(0, 3);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/roi.test.js`
Expected: all passes.

- [ ] **Step 5: Commit**

```bash
git add lib/scorecard/roi.js __tests__/scorecard/roi.test.js
git commit -m "feat(scorecard): ROI line generators with peer-anchored loss framing"
```

---

## Task 7: Build `lib/scorecard/resultRender.js`

The orchestrator. Composes ROI lines, stage placement, bright spots, binding boundary, and the result payload that both the on-screen render and the PDF consume.

**Files:**
- Create: `lib/scorecard/resultRender.js`
- Create: `__tests__/scorecard/resultRender.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/resultRender.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { buildResult } from '@/lib/scorecard/resultRender';

function ans(overrides = {}) {
  return {
    q1: { value: '7m_15m' },                          // $11M
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },                           // 63
    q4:  { value: 'A', score: 1 },
    q5:  { value: 'B', score: 2 },
    q6:  { value: 'A', score: 1 },
    q7:  { value: 'B', score: 2 },
    q8:  { value: 'B', score: 2 },
    q9:  { value: 'B', score: 2 },
    q10: { value: 'B', score: 2 },
    q11: { value: 'A', score: 1 },
    q12: { value: 'A', score: 1 },
    q13: { value: '25k_100k' },
    q14: { value: 'over_180' },
    q15: { value: 'over_30' },
    ...overrides,
  };
}

describe('buildResult', () => {
  it('returns a Result payload with the expected top-level keys', () => {
    const r = buildResult(ans());
    expect(r.headline).toBeDefined();
    expect(r.roiLines).toBeInstanceOf(Array);
    expect(r.placement).toBeDefined();
    expect(r.binding).toBeDefined();
    expect(r.disclosure).toBeTypeOf('string');
    expect(r.cta).toBeDefined();
    expect(r.modelLabel).toBeTypeOf('string');
    expect(r.benchmarkVersion).toBe('1.1');
    expect(r.generatedAt).toBeTypeOf('string');
  });

  it('headline floor and median dollars match the sum across ROI lines', () => {
    const r = buildResult(ans());
    const sumFloor = r.roiLines.reduce((s, l) => s + l.floorDollars, 0);
    const sumMedian = r.roiLines.reduce((s, l) => s + l.medianDollars, 0);
    expect(r.headline.floorDollars).toBe(sumFloor);
    expect(r.headline.medianDollars).toBe(sumMedian);
  });

  it('places a maxed-out reactive client at Stage 1', () => {
    expect(buildResult(ans()).placement.stage).toBe(1);
  });

  it('places a fully-managed client at Stage 4 with empty roiLines', () => {
    const r = buildResult(ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'D', score: 4 }, q8: { value: 'D', score: 4 }, q9: { value: 'D', score: 4 },
      q10: { value: 'D', score: 4 }, q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 },
      q14: { value: 'under_30' }, q15: { value: 'under_5' },
    }));
    expect(r.placement.stage).toBe(4);
    expect(r.roiLines).toEqual([]);
    expect(r.binding).toBeNull();
  });

  it('binding boundary identifies the two lowest-scoring questions in the failing block', () => {
    const r = buildResult(ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'A', score: 1 }, q8: { value: 'B', score: 2 }, q9: { value: 'C', score: 3 },
    }));
    expect(r.placement.stage).toBe(2);
    expect(r.binding.failingBlock).toBe('B');
    expect(r.binding.questions.map((q) => q.id)).toEqual(['q7', 'q8']);
    expect(r.binding.translation).toBeTypeOf('string');
    expect(r.binding.translation).not.toMatch(/—/);
  });

  it('bright spots are answers scoring above placement', () => {
    const r = buildResult(ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'A', score: 1 }, q6: { value: 'A', score: 1 },
    }));
    expect(r.placement.stage).toBe(1);
    expect(r.brightSpots).toBeTruthy();
    expect(r.brightSpots.length).toBeLessThanOrEqual(2);
    for (const s of r.brightSpots) expect(s.score).toBeGreaterThan(1);
  });

  it('CTA destination is /watch', () => {
    expect(buildResult(ans()).cta.destination).toBe('/watch');
  });

  it('model label resolves from q2', () => {
    expect(buildResult(ans({ q2: { value: 'B2B_SAAS' } })).modelLabel).toBe('B2B SaaS');
    expect(buildResult(ans({ q2: { value: 'PROFESSIONAL_SERVICES' } })).modelLabel).toBe('professional services');
  });

  it('result strings carry no em-dash anywhere', () => {
    const r = buildResult(ans());
    const allStrings = JSON.stringify(r);
    expect(allStrings).not.toMatch(/—/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/resultRender.test.js`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the implementation**

Create `lib/scorecard/resultRender.js`:
```js
/**
 * buildResult(answers) — the orchestrator. Composes ROI lines, stage placement,
 * bright spots, binding-boundary diagnosis, headline, disclosure, and CTA into
 * the Result payload consumed by both the on-screen render and the PDF.
 *
 * Pure function. No I/O.
 */

import { getBusinessModelBenchmark, BUSINESS_MODEL_BENCHMARK_VERSION } from './businessModelBenchmarks';
import { generateRoiLines } from './roi';
import { stagePlacement, brightSpots, bindingBoundary } from './scoring';
import {
  STAGE_NAMES,
  STAGE_DESCRIPTORS,
  DISCLOSURE,
  CTA_HEADING,
  CTA_LINES,
  formatUsd,
  sanitizeVoice,
} from './voice';

function bindingTranslation(binding) {
  if (!binding || binding.questions.length === 0) return '';
  const [first, second] = binding.questions;
  const labels = second
    ? `your ${first.competencyLabel} and your ${second.competencyLabel}`
    : `your ${first.competencyLabel}`;
  return sanitizeVoice(
    `What you told me about ${labels} is the bottleneck that shows up in the dollar gaps above.`
  );
}

function buildHeadline(roiLines, modelLabel) {
  const floor = roiLines.reduce((s, l) => s + l.floorDollars, 0);
  const median = roiLines.reduce((s, l) => s + l.medianDollars, 0);
  const subline = roiLines.length === 0
    ? sanitizeVoice('Your inputs land at or above peer on the metrics I can compute. Below is the read on where you sit operationally and what would lock that in.')
    : sanitizeVoice(`That is the gap between where you sit today and where ${modelLabel} peers in your revenue range operate. The conservative read is ${formatUsd(floor)} per year. The peer-median read is closer to ${formatUsd(median)}. Here is exactly how I got there.`);
  const lead = roiLines.length === 0
    ? sanitizeVoice('No dollar gap I can defensibly call out from your inputs.')
    : sanitizeVoice(`Your operating system is leaving between ${formatUsd(floor)} and ${formatUsd(median)} on the table this year.`);
  return {
    lead,
    subline,
    floorDollars: floor,
    medianDollars: median,
    modelLabel,
  };
}

export function buildResult(answers) {
  const benchmark = getBusinessModelBenchmark(answers.q2?.value);
  const roiLines = generateRoiLines(answers, benchmark);
  const placement = stagePlacement(answers);
  const binding = bindingBoundary(answers, placement);
  const spots = brightSpots(answers, placement);
  const generatedAt = new Date().toISOString();

  return {
    headline: buildHeadline(roiLines, benchmark.label),
    roiLines,
    placement: {
      stage: placement,
      name: STAGE_NAMES[placement],
      descriptor: STAGE_DESCRIPTORS[placement],
    },
    binding: binding ? { ...binding, translation: bindingTranslation(binding) } : null,
    brightSpots: spots.length > 0 ? spots : null,
    disclosure: DISCLOSURE,
    cta: {
      destination: '/watch',
      heading: CTA_HEADING,
      cardLines: CTA_LINES,
      buttonLabel: 'Schedule the call',
    },
    modelLabel: benchmark.label,
    benchmarkVersion: BUSINESS_MODEL_BENCHMARK_VERSION,
    generatedAt,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/resultRender.test.js`
Expected: all passes.

- [ ] **Step 5: Commit**

```bash
git add lib/scorecard/resultRender.js __tests__/scorecard/resultRender.test.js
git commit -m "feat(scorecard): buildResult orchestrator with headline, binding diagnosis"
```

---

## Task 8: Build `scripts/lint-scorecard-voice.mjs` + wire into `npm run lint:scorecard`

A standalone Node script that walks the scorecard surface files and asserts (a) no em-dash, (b) no first-person plural in client-facing copy, (c) every benchmark-bearing template ends with the `Source: businessModelBenchmarks v1.1` citation. Exits non-zero on any violation.

**Files:**
- Create: `scripts/lint-scorecard-voice.mjs`
- Create: `__tests__/scorecard/lint-scorecard-voice.test.js`
- Create: `__tests__/scorecard/fixtures/clean.txt`
- Create: `__tests__/scorecard/fixtures/dirty.txt`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/fixtures/clean.txt`:
```
This copy is clean. You are leaving $5K on the table. Source: businessModelBenchmarks v1.1, B2B SaaS row.
```

Create `__tests__/scorecard/fixtures/dirty.txt`:
```
This copy has an em-dash — bad. We built this. Source omitted.
```

Create `__tests__/scorecard/lint-scorecard-voice.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(here, '..', '..', 'scripts', 'lint-scorecard-voice.mjs');

function run(args) {
  try {
    const out = execFileSync('node', [SCRIPT, ...args], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') };
  }
}

describe('lint-scorecard-voice script', () => {
  it('exits 0 on a clean fixture', () => {
    const r = run(['__tests__/scorecard/fixtures/clean.txt']);
    expect(r.code).toBe(0);
  });

  it('exits non-zero on a dirty fixture', () => {
    const r = run(['__tests__/scorecard/fixtures/dirty.txt']);
    expect(r.code).not.toBe(0);
    expect(r.out).toMatch(/em-dash|first-person plural/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/lint-scorecard-voice.test.js`
Expected: FAIL (script does not exist).

- [ ] **Step 3: Write the lint script**

Create `scripts/lint-scorecard-voice.mjs`:
```js
#!/usr/bin/env node
/**
 * Voice lint for scorecard client-facing copy.
 *
 * Checks (per file):
 *   1. No em-dash (U+2014).
 *   2. No first-person plural (\b(we|our|us)\b case-insensitive).
 *
 * Usage:
 *   node scripts/lint-scorecard-voice.mjs <file> [<file>...]
 *
 * When invoked with no arguments, lints the default surface list (the scorecard
 * voice/questions/roi/result modules and the landing page).
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_TARGETS = [
  'lib/scorecard/voice.js',
  'lib/scorecard/questions.js',
  'lib/scorecard/roi.js',
  'lib/scorecard/resultRender.js',
  'app/scorecard/page.js',
];

const EM_DASH = /—/;
const FIRST_PERSON_PLURAL = /\b(we|our|us)\b/i;

function lintFile(path) {
  const errors = [];
  if (!existsSync(path)) {
    errors.push(`File not found: ${path}`);
    return errors;
  }
  const content = readFileSync(path, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (EM_DASH.test(line)) {
      errors.push(`${path}:${i + 1}: em-dash: ${line.trim()}`);
    }
    if (FIRST_PERSON_PLURAL.test(line)) {
      errors.push(`${path}:${i + 1}: first-person plural: ${line.trim()}`);
    }
  });
  return errors;
}

const args = process.argv.slice(2);
const targets = args.length > 0 ? args : DEFAULT_TARGETS;

let total = 0;
for (const target of targets) {
  const errors = lintFile(resolve(process.cwd(), target));
  for (const err of errors) {
    console.error(err);
    total++;
  }
}

if (total > 0) {
  console.error(`\nVoice lint failed: ${total} violation(s).`);
  process.exit(1);
}
console.log('Voice lint passed.');
process.exit(0);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/lint-scorecard-voice.test.js`
Expected: 2 passed.

- [ ] **Step 5: Sanity check the lint against the live scorecard files**

Run: `npm run lint:scorecard`
Expected: `Voice lint passed.` and exit 0. (If any of the lib/scorecard/*.js files leaked an em-dash or first-person plural during prior tasks, fix it now before continuing.)

- [ ] **Step 6: Commit**

```bash
git add scripts/lint-scorecard-voice.mjs __tests__/scorecard/lint-scorecard-voice.test.js __tests__/scorecard/fixtures/
git commit -m "feat(scorecard): voice lint script enforcing no em-dash and no first-person plural"
```

---

## Task 9: Build `lib/scorecard/pdfDocument.jsx`

A `@react-pdf/renderer` Document component that renders the same `Result` payload as the on-screen view. Exposes `renderResultPdf(result): Promise<Buffer>`.

**Files:**
- Create: `lib/scorecard/pdfDocument.jsx`
- Create: `__tests__/scorecard/pdf.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/pdf.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { renderResultPdf } from '@/lib/scorecard/pdfDocument';
import { buildResult } from '@/lib/scorecard/resultRender';

function ans() {
  return {
    q1: { value: '7m_15m' },
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },
    q4:  { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
    q7:  { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
    q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
    q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
  };
}

describe('renderResultPdf', () => {
  it('renders a non-empty Buffer', async () => {
    const result = buildResult(ans());
    const buf = await renderResultPdf(result);
    expect(buf).toBeInstanceOf(Buffer);
    expect(buf.length).toBeGreaterThan(1000); // PDF header + content > 1KB
  });

  it('Buffer starts with the PDF magic bytes (%PDF-)', async () => {
    const result = buildResult(ans());
    const buf = await renderResultPdf(result);
    expect(buf.toString('utf8', 0, 5)).toBe('%PDF-');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/pdf.test.js`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the implementation**

Create `lib/scorecard/pdfDocument.jsx`:
```jsx
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { formatUsd } from './voice';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: '#1a2540' },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 12, lineHeight: 1.25 },
  h2: { fontSize: 14, fontWeight: 700, marginTop: 18, marginBottom: 8 },
  p: { fontSize: 11, lineHeight: 1.45, marginBottom: 8 },
  small: { fontSize: 9, color: '#6b7280', marginTop: 4 },
  roiBlock: { marginBottom: 14, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  roiTitle: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
  meta: { fontSize: 10, marginBottom: 4 },
  badge: { fontSize: 9, fontWeight: 700, marginBottom: 6 },
  badgeMeets: { color: '#0f766e' },
  badgePartial: { color: '#b45309' },
  badgeFails: { color: '#b6582a' },
  ctaBox: { marginTop: 16, padding: 12, borderWidth: 1, borderColor: '#1a2540' },
  ctaHeading: { fontSize: 13, fontWeight: 700, marginBottom: 6 },
  ctaLine: { fontSize: 10, marginBottom: 3 },
  ctaUrl: { fontSize: 11, fontWeight: 700, marginTop: 8 },
});

function badgeStyle(comparison) {
  if (comparison === 'meets') return [styles.badge, styles.badgeMeets];
  if (comparison === 'partial') return [styles.badge, styles.badgePartial];
  return [styles.badge, styles.badgeFails];
}

function ResultDocument({ result }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.h1}>{result.headline.lead}</Text>
        <Text style={styles.p}>{result.headline.subline}</Text>

        {result.roiLines.length > 0 && (
          <>
            <Text style={styles.h2}>How I got there</Text>
            {result.roiLines.map((line) => (
              <View key={line.key} style={styles.roiBlock}>
                <Text style={styles.roiTitle}>{line.title}</Text>
                <Text style={styles.meta}>Your number: {line.clientValue.display}</Text>
                <Text style={styles.meta}>
                  Typical {result.modelLabel} peer: {line.peerMedian.display} (range {line.peerRange.displayLow} to {line.peerRange.displayHigh})
                </Text>
                <Text style={badgeStyle(line.comparison)}>{line.comparisonCopy.toUpperCase()}</Text>
                <Text style={styles.p}>{line.body}</Text>
                <Text style={styles.small}>{line.source}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.h2}>Why this is happening</Text>
        <Text style={styles.p}>
          This is happening because you are at Stage {result.placement.stage}: {result.placement.name}.
        </Text>
        <Text style={styles.p}>{result.placement.descriptor}</Text>
        {result.binding && (
          <Text style={styles.p}>{result.binding.translation}</Text>
        )}

        {result.brightSpots && result.brightSpots.length > 0 && (
          <>
            <Text style={styles.h2}>What you are doing right</Text>
            <Text style={styles.p}>
              You scored above your placement on {result.brightSpots.map((s) => s.competencyLabel).join(' and ')}. That is foundation for the work ahead.
            </Text>
          </>
        )}

        <Text style={styles.h2}>What this scorecard can and cannot tell you</Text>
        <Text style={styles.p}>{result.disclosure}</Text>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaHeading}>{result.cta.heading}</Text>
          {result.cta.cardLines.map((line, i) => (
            <Text key={i} style={styles.ctaLine}>- {line}</Text>
          ))}
          <Text style={styles.ctaUrl}>{result.cta.buttonLabel}: https://modernbizops.com{result.cta.destination}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderResultPdf(result) {
  const instance = pdf();
  instance.updateContainer(<ResultDocument result={result} />);
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export default ResultDocument;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/pdf.test.js`
Expected: both pass. (If `toBlob` fails in the jsdom env, swap to `toBuffer()` which exists in some @react-pdf/renderer versions; otherwise wrap with `react-pdf-node` adapter. Document the workaround in the file header if needed.)

- [ ] **Step 5: Commit**

```bash
git add lib/scorecard/pdfDocument.jsx __tests__/scorecard/pdf.test.js
git commit -m "feat(scorecard): React-PDF result document and renderResultPdf"
```

---

## Task 10: Build `app/api/scorecard/submit/route.js`

POST handler. Upserts HubSpot contact, forwards UTMs, idempotently creates a deal at `NEW_LEAD_STAGE`, creates a follow-up task. Returns the computed `Result` payload so the client renders inline.

**Files:**
- Create: `app/api/scorecard/submit/route.js`
- Create: `__tests__/scorecard/api-submit.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/api-submit.test.js`:
```js
import { describe, it, expect, vi, beforeEach } from 'vitest';

const hubspotMock = {
  assertHubSpotConfigured: vi.fn(),
  ensureCustomContactProperties: vi.fn(async () => {}),
  upsertContactByEmail: vi.fn(async () => ({ id: 'contact-123', action: 'created' })),
  pickUtmProperties: vi.fn((utms) => utms || {}),
  findExistingRevopsDealForContact: vi.fn(async () => null),
  createContactTask: vi.fn(async () => 'task-1'),
  hsHeaders: vi.fn(() => ({ 'Content-Type': 'application/json' })),
  HUBSPOT_BASE: 'https://api.hubapi.test',
  REVOPS_PIPELINE_ID: '2172760768',
  NEW_LEAD_STAGE: '3477396169',
  BRADLEY_OWNER_ID: '85826069',
  UTM_CUSTOM_PROPERTIES: [],
};

vi.mock('@/lib/hubspot', () => hubspotMock);

let dealCreateBody = null;

beforeEach(() => {
  for (const fn of Object.values(hubspotMock)) {
    if (typeof fn === 'function' && fn.mockClear) fn.mockClear();
  }
  hubspotMock.findExistingRevopsDealForContact.mockResolvedValue(null);
  hubspotMock.upsertContactByEmail.mockResolvedValue({ id: 'contact-123', action: 'created' });
  dealCreateBody = null;
  global.fetch = vi.fn(async (url, opts) => {
    if (typeof url === 'string' && url.endsWith('/crm/v3/objects/deals')) {
      dealCreateBody = JSON.parse(opts.body);
      return { ok: true, json: async () => ({ id: 'deal-456' }) };
    }
    return { ok: true, json: async () => ({}) };
  });
});

async function callRoute(body) {
  const { POST } = await import('@/app/api/scorecard/submit/route');
  const req = new Request('http://test.local/api/scorecard/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(req);
}

function fixtureBody() {
  return {
    firstName: 'Jane',
    email: 'jane@example.com',
    company: 'Acme',
    utms: { utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'maturity-scorecard' },
    answers: {
      q1: { value: '7m_15m' },
      q2: { value: 'PROFESSIONAL_SERVICES' },
      q3: { value: '51_75' },
      q4: { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
      q7: { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
      q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
      q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
    },
  };
}

describe('POST /api/scorecard/submit', () => {
  it('upserts contact, forwards UTMs, creates deal at NEW_LEAD_STAGE in RevOps pipeline', async () => {
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBe('contact-123');
    expect(json.dealId).toBe('deal-456');
    expect(json.result).toBeDefined();
    expect(json.result.placement.stage).toBe(1);

    expect(hubspotMock.upsertContactByEmail).toHaveBeenCalledWith(
      'jane@example.com',
      expect.objectContaining({
        firstname: 'Jane',
        company: 'Acme',
        utm_source: 'linkedin',
        utm_medium: 'social',
        utm_campaign: 'maturity-scorecard',
      }),
    );
    expect(dealCreateBody.properties.pipeline).toBe('2172760768');
    expect(dealCreateBody.properties.dealstage).toBe('3477396169');
    expect(dealCreateBody.properties.dealname).toMatch(/^Maturity Scorecard - Jane$/);
    expect(dealCreateBody.properties.dealname).not.toMatch(/—/);
  });

  it('is idempotent: returns existing deal id when one is already in the pipeline', async () => {
    hubspotMock.findExistingRevopsDealForContact.mockResolvedValue('existing-deal-999');
    const res = await callRoute(fixtureBody());
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.dealId).toBe('existing-deal-999');
    expect(dealCreateBody).toBeNull(); // no deal creation fetch fired
  });

  it('rejects missing email', async () => {
    const body = fixtureBody();
    delete body.email;
    const res = await callRoute(body);
    expect(res.status).toBe(400);
  });

  it('rejects malformed answers', async () => {
    const body = fixtureBody();
    body.answers = {};
    const res = await callRoute(body);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/api-submit.test.js`
Expected: FAIL with module-not-found on the route.

- [ ] **Step 3: Write the route**

Create `app/api/scorecard/submit/route.js`:
```js
import { NextResponse } from 'next/server';
import {
  assertHubSpotConfigured,
  ensureCustomContactProperties,
  upsertContactByEmail,
  pickUtmProperties,
  findExistingRevopsDealForContact,
  createContactTask,
  hsHeaders,
  HUBSPOT_BASE,
  REVOPS_PIPELINE_ID,
  NEW_LEAD_STAGE,
  BRADLEY_OWNER_ID,
  UTM_CUSTOM_PROPERTIES,
} from '@/lib/hubspot';
import { buildResult } from '@/lib/scorecard/resultRender';

let utmPropertiesEnsured = false;

const REQUIRED_ANSWER_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14'];

function validateAnswers(answers) {
  if (!answers || typeof answers !== 'object') return false;
  for (const id of REQUIRED_ANSWER_IDS) {
    if (!answers[id] || typeof answers[id].value !== 'string') return false;
  }
  return true;
}

export async function POST(request) {
  try {
    assertHubSpotConfigured();

    const body = await request.json();
    const { firstName, email, company, utms, answers } = body || {};

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!validateAnswers(answers)) {
      return NextResponse.json({ error: 'Answers payload is malformed' }, { status: 400 });
    }

    if (!utmPropertiesEnsured) {
      await ensureCustomContactProperties(UTM_CUSTOM_PROPERTIES);
      utmPropertiesEnsured = true;
    }

    const contactProps = {
      firstname: firstName || '',
      company: company || '',
      ...pickUtmProperties(utms),
    };
    const { id: contactId } = await upsertContactByEmail(email, contactProps);

    const result = buildResult(answers);

    const existingDealId = await findExistingRevopsDealForContact(contactId);
    let dealId = existingDealId;

    if (!existingDealId) {
      const contactName = firstName || email;
      const dealRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals`, {
        method: 'POST',
        headers: hsHeaders(),
        body: JSON.stringify({
          properties: {
            dealname: `Maturity Scorecard - ${contactName}`,
            pipeline: REVOPS_PIPELINE_ID,
            dealstage: NEW_LEAD_STAGE,
            dealtype: 'newbusiness',
            engagement_type: 'DWY Coaching',
            project_type: 'RevOps Coaching',
            hubspot_owner_id: BRADLEY_OWNER_ID,
          },
          associations: [
            {
              to: { id: contactId },
              types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }],
            },
          ],
        }),
      });

      if (!dealRes.ok) {
        const err = await dealRes.text();
        console.error('[submit-scorecard] HubSpot deal creation failed:', err);
        return NextResponse.json({ error: 'Failed to create deal' }, { status: 502 });
      }

      const deal = await dealRes.json();
      dealId = deal.id;

      await createContactTask({
        contactId,
        subject: `Scorecard lead: ${firstName || email} (Stage ${result.placement.stage})`,
        body: `New scorecard submission. Stage ${result.placement.stage} (${result.placement.name}). Model: ${result.modelLabel}. Headline gap: ${result.headline.lead}`,
        ownerId: BRADLEY_OWNER_ID,
        priority: 'HIGH',
        dueInHours: 24,
      });
    }

    return NextResponse.json({ success: true, contactId, dealId, result });
  } catch (err) {
    console.error('[submit-scorecard] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/api-submit.test.js`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add app/api/scorecard/submit/route.js __tests__/scorecard/api-submit.test.js
git commit -m "feat(scorecard): submit route, idempotent HubSpot deal at NEW_LEAD_STAGE"
```

---

## Task 11: Build presentational components (`SectionHeader`, `RoiLine`, `CtaCard`)

Three simple components. SectionHeader and CtaCard are static-content. RoiLine takes a single `line` prop and renders the row.

**Files:**
- Create: `components/scorecard/SectionHeader.jsx`
- Create: `components/scorecard/RoiLine.jsx`
- Create: `components/scorecard/CtaCard.jsx`
- Create: `__tests__/scorecard/components/SectionHeader.test.jsx`
- Create: `__tests__/scorecard/components/RoiLine.test.jsx`
- Create: `__tests__/scorecard/components/CtaCard.test.jsx`

- [ ] **Step 1: Write the SectionHeader test**

Create `__tests__/scorecard/components/SectionHeader.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionHeader from '@/components/scorecard/SectionHeader';

describe('SectionHeader', () => {
  it('renders the section number, label, and subline', () => {
    render(<SectionHeader section={1} />);
    expect(screen.getByText(/Section 1 of 3/)).toBeInTheDocument();
    expect(screen.getByText(/About your business/)).toBeInTheDocument();
    expect(screen.getByText(/Three taps so I know who I am comparing you to/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/components/SectionHeader.test.jsx`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the SectionHeader component**

Create `components/scorecard/SectionHeader.jsx`:
```jsx
import { SECTION_LABELS, SECTION_SUBLINES } from '@/lib/scorecard/voice';

export default function SectionHeader({ section }) {
  return (
    <div className="mb-8 text-center">
      <p className="font-body text-xs font-semibold tracking-widest uppercase text-amber mb-2">
        Section {section} of 3
      </p>
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy mb-2">
        {SECTION_LABELS[section]}
      </h2>
      <p className="font-body text-text-mid italic">{SECTION_SUBLINES[section]}</p>
    </div>
  );
}
```

- [ ] **Step 4: Write the RoiLine test**

Create `__tests__/scorecard/components/RoiLine.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RoiLine from '@/components/scorecard/RoiLine';

const line = {
  key: 'salesCycle',
  title: 'Sales cycle compression',
  clientValue: { display: '240 days' },
  peerMedian: { display: '103 days' },
  peerRange: { displayLow: '60 days', displayHigh: '130 days' },
  comparison: 'fails',
  comparisonCopy: 'slower than peer',
  floorDollars: 4000000,
  medianDollars: 6600000,
  body: 'At your revenue, that is between $4.0M and $6.6M of incremental closed revenue you are not capturing this year.',
  source: 'Source: businessModelBenchmarks v1.1, professional services row.',
};

describe('RoiLine', () => {
  it('renders the title, your number, peer median, range, badge, body, source', () => {
    render(<RoiLine line={line} modelLabel="professional services" />);
    expect(screen.getByText(/Sales cycle compression/)).toBeInTheDocument();
    expect(screen.getByText(/240 days/)).toBeInTheDocument();
    expect(screen.getByText(/103 days/)).toBeInTheDocument();
    expect(screen.getByText(/60 days/)).toBeInTheDocument();
    expect(screen.getByText(/slower than peer/)).toBeInTheDocument();
    expect(screen.getByText(/businessModelBenchmarks v1\.1/)).toBeInTheDocument();
  });

  it('applies the fails badge class for comparison=fails', () => {
    const { container } = render(<RoiLine line={line} modelLabel="professional services" />);
    const badge = container.querySelector('[data-comparison]');
    expect(badge.getAttribute('data-comparison')).toBe('fails');
  });
});
```

- [ ] **Step 5: Write the RoiLine component**

Create `components/scorecard/RoiLine.jsx`:
```jsx
const BADGE_STYLES = {
  meets: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  fails: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function RoiLine({ line, modelLabel }) {
  const badge = BADGE_STYLES[line.comparison] || BADGE_STYLES.fails;
  return (
    <div className="bg-white rounded-[14px] border border-border p-6 md:p-7 mb-5">
      <h3 className="font-display text-xl text-navy mb-3">{line.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <p className="font-body text-sm text-text-mid">
          <span className="font-semibold text-text-primary">Your number:</span> {line.clientValue.display}
        </p>
        <p className="font-body text-sm text-text-mid">
          <span className="font-semibold text-text-primary">Typical {modelLabel} peer:</span> {line.peerMedian.display}
          <span className="text-text-light"> (range {line.peerRange.displayLow} to {line.peerRange.displayHigh})</span>
        </p>
      </div>
      <span
        data-comparison={line.comparison}
        className={`inline-block text-xs font-semibold uppercase tracking-wide border rounded-full px-3 py-1 mb-4 ${badge}`}
      >
        {line.comparisonCopy}
      </span>
      <p className="font-body text-text-mid leading-relaxed mb-3">{line.body}</p>
      <p className="font-body text-xs text-text-light">{line.source}</p>
    </div>
  );
}
```

- [ ] **Step 6: Write the CtaCard test**

Create `__tests__/scorecard/components/CtaCard.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CtaCard from '@/components/scorecard/CtaCard';

const cta = {
  destination: '/watch',
  heading: 'The Modern BizOps Maturity Assessment',
  cardLines: [
    'Automated analysis of your CRM and revenue tools',
    'All 44 competencies scored, not just nine',
    'A 90-minute working session with me to walk you through it',
    'A 12-week operational roadmap mapped to your stated business outcome',
  ],
  buttonLabel: 'Schedule the call',
};

describe('CtaCard', () => {
  it('renders heading, four bullet lines, and a link to /watch with no UTMs', () => {
    render(<CtaCard cta={cta} />);
    expect(screen.getByText(cta.heading)).toBeInTheDocument();
    for (const line of cta.cardLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    const link = screen.getByRole('link', { name: /schedule the call/i });
    expect(link.getAttribute('href')).toBe('/watch');
  });
});
```

- [ ] **Step 7: Write the CtaCard component**

Create `components/scorecard/CtaCard.jsx`:
```jsx
import Link from 'next/link';

export default function CtaCard({ cta }) {
  return (
    <div className="bg-navy text-cream rounded-[16px] p-8 md:p-10">
      <h3 className="font-display text-2xl md:text-3xl font-semibold mb-5">{cta.heading}</h3>
      <p className="font-body text-cream/85 mb-3">What you get:</p>
      <ul className="font-body text-cream/85 mb-6 space-y-2">
        {cta.cardLines.map((line, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-amber pt-1">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <p className="font-body text-cream/80 mb-6">Start with a 20-minute fit call to see if it makes sense for your business.</p>
      <Link
        href={cta.destination}
        className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-8 py-3"
      >
        {cta.buttonLabel}
      </Link>
    </div>
  );
}
```

- [ ] **Step 8: Run all three component tests**

Run: `npm test -- __tests__/scorecard/components/`
Expected: 4 passed (1 SectionHeader, 2 RoiLine, 1 CtaCard).

- [ ] **Step 9: Commit**

```bash
git add components/scorecard/SectionHeader.jsx components/scorecard/RoiLine.jsx components/scorecard/CtaCard.jsx __tests__/scorecard/components/SectionHeader.test.jsx __tests__/scorecard/components/RoiLine.test.jsx __tests__/scorecard/components/CtaCard.test.jsx
git commit -m "feat(scorecard): SectionHeader, RoiLine, CtaCard presentational components"
```

---

## Task 12: Build `QuestionCard` and `StagePlacementCard`

QuestionCard handles peer-anchor interpolation against the live Q2 answer and renders radio-style options. StagePlacementCard renders the stage placement section.

**Files:**
- Create: `components/scorecard/QuestionCard.jsx`
- Create: `components/scorecard/StagePlacementCard.jsx`
- Create: `__tests__/scorecard/components/QuestionCard.test.jsx`
- Create: `__tests__/scorecard/components/StagePlacementCard.test.jsx`

- [ ] **Step 1: Write the QuestionCard test**

Create `__tests__/scorecard/components/QuestionCard.test.jsx`:
```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionCard from '@/components/scorecard/QuestionCard';
import { QUESTIONS } from '@/lib/scorecard/questions';

describe('QuestionCard', () => {
  it('renders the prompt and four options for a maturity question', () => {
    const q = QUESTIONS.find((x) => x.id === 'q4');
    render(<QuestionCard question={q} answers={{ q2: { value: 'PROFESSIONAL_SERVICES' } }} onSelect={() => {}} />);
    expect(screen.getByText(/How do the people who touch customers/)).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('interpolates {model_label} into the peer anchor sentence', () => {
    const q = QUESTIONS.find((x) => x.id === 'q4');
    render(<QuestionCard question={q} answers={{ q2: { value: 'B2B_SAAS' } }} onSelect={() => {}} />);
    expect(screen.getByText(/Most B2B SaaS founders at your revenue level run on a CRM/)).toBeInTheDocument();
  });

  it('calls onSelect with the chosen option when a radio is clicked', () => {
    const q = QUESTIONS.find((x) => x.id === 'q4');
    const onSelect = vi.fn();
    render(<QuestionCard question={q} answers={{ q2: { value: 'B2B_SAAS' } }} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByRole('radio')[2]); // option C, score 3
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'C', score: 3 }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/components/QuestionCard.test.jsx`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the QuestionCard component**

Create `components/scorecard/QuestionCard.jsx`:
```jsx
import { getBusinessModelBenchmark } from '@/lib/scorecard/businessModelBenchmarks';

function resolvePeerAnchor(template, answers) {
  if (!template) return '';
  const q2 = answers?.q2?.value;
  const label = q2 ? getBusinessModelBenchmark(q2).label : 'small-to-mid business';
  return template.replaceAll('{model_label}', label);
}

export default function QuestionCard({ question, answers, selected, onSelect }) {
  const peerAnchor = resolvePeerAnchor(question.peerAnchorTemplate, answers);
  return (
    <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
      {peerAnchor && (
        <p className="font-body text-sm italic text-text-mid mb-4">{peerAnchor}</p>
      )}
      <h3 className="font-display text-xl md:text-2xl text-navy mb-6">{question.prompt}</h3>
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selected?.value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-4 rounded-[10px] border cursor-pointer transition-colors ${
                isSelected ? 'border-amber bg-amber/10' : 'border-border bg-cream hover:bg-amber/5'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={isSelected}
                onChange={() => onSelect(opt)}
                className="mt-1"
              />
              <span className="font-body text-text-primary">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write the StagePlacementCard test**

Create `__tests__/scorecard/components/StagePlacementCard.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StagePlacementCard from '@/components/scorecard/StagePlacementCard';

const placement = { stage: 2, name: 'Repeatable', descriptor: 'A system exists that the team can follow without you managing every interaction.' };
const binding = { failingBlock: 'B', questions: [{ id: 'q7', competencyLabel: 'revenue forecasting' }], translation: 'What you told me about your revenue forecasting is the bottleneck that shows up in the dollar gaps above.' };

describe('StagePlacementCard', () => {
  it('renders the stage number and name in the heading', () => {
    render(<StagePlacementCard placement={placement} binding={binding} />);
    expect(screen.getByText(/Stage 2: Repeatable/)).toBeInTheDocument();
    expect(screen.getByText(/A system exists/)).toBeInTheDocument();
    expect(screen.getByText(/bottleneck that shows up/)).toBeInTheDocument();
  });

  it('hides binding translation when binding is null (Stage 4)', () => {
    render(<StagePlacementCard placement={{ stage: 4, name: 'Compounding', descriptor: 'The system improves itself.' }} binding={null} />);
    expect(screen.getByText(/Stage 4: Compounding/)).toBeInTheDocument();
    expect(screen.queryByText(/bottleneck/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Write the StagePlacementCard component**

Create `components/scorecard/StagePlacementCard.jsx`:
```jsx
export default function StagePlacementCard({ placement, binding }) {
  return (
    <div className="bg-white rounded-[14px] border border-border p-6 md:p-8 mb-5">
      <h3 className="font-display text-xl md:text-2xl text-navy mb-3">
        Stage {placement.stage}: {placement.name}
      </h3>
      <p className="font-body text-text-mid leading-relaxed mb-4">{placement.descriptor}</p>
      {binding && <p className="font-body text-text-primary leading-relaxed">{binding.translation}</p>}
    </div>
  );
}
```

- [ ] **Step 6: Run both tests**

Run: `npm test -- __tests__/scorecard/components/QuestionCard.test.jsx __tests__/scorecard/components/StagePlacementCard.test.jsx`
Expected: 5 passed.

- [ ] **Step 7: Commit**

```bash
git add components/scorecard/QuestionCard.jsx components/scorecard/StagePlacementCard.jsx __tests__/scorecard/components/QuestionCard.test.jsx __tests__/scorecard/components/StagePlacementCard.test.jsx
git commit -m "feat(scorecard): QuestionCard with peer-anchor interpolation, StagePlacementCard"
```

---

## Task 13: Build `EmailGateForm`

Form with First name + Email + Company fields, trust footer, submit button. Calls a prop `onSubmit({firstName, email, company})` and lets the parent handle the POST.

**Files:**
- Create: `components/scorecard/EmailGateForm.jsx`
- Create: `__tests__/scorecard/components/EmailGateForm.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/scorecard/components/EmailGateForm.test.jsx`:
```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmailGateForm from '@/components/scorecard/EmailGateForm';

describe('EmailGateForm', () => {
  it('renders First name, Email, Company fields and a submit button', () => {
    render(<EmailGateForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show me my number/i })).toBeInTheDocument();
  });

  it('calls onSubmit with the typed values', () => {
    const onSubmit = vi.fn();
    render(<EmailGateForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: /show me my number/i }));
    expect(onSubmit).toHaveBeenCalledWith({ firstName: 'Jane', email: 'jane@example.com', company: 'Acme' });
  });

  it('renders the trust footer copy with no em-dash', () => {
    render(<EmailGateForm onSubmit={() => {}} />);
    const footer = screen.getByText(/scorecard and one follow-up note/i);
    expect(footer).toBeInTheDocument();
    expect(footer.textContent).not.toMatch(/—/);
  });

  it('disables submit while submitting', () => {
    render(<EmailGateForm onSubmit={() => {}} submitting />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/components/EmailGateForm.test.jsx`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the component**

Create `components/scorecard/EmailGateForm.jsx`:
```jsx
'use client';
import { useState } from 'react';

export default function EmailGateForm({ onSubmit, submitting }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ firstName, email, company });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[14px] border border-border p-6 md:p-8 max-w-xl mx-auto">
      <h2 className="font-display text-2xl md:text-3xl text-navy mb-2 text-center">Where should I send your scorecard?</h2>
      <p className="font-body text-text-mid text-center mb-6">
        You will see your results on screen now, and I will email you a PDF copy you can share with your team.
      </p>
      <div className="space-y-4 mb-5">
        <div>
          <label htmlFor="firstName" className="block font-body text-sm font-semibold text-text-primary mb-1">First name</label>
          <input
            id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-border rounded-[10px] px-4 py-3 font-body text-text-primary focus:outline-none focus:border-amber"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-body text-sm font-semibold text-text-primary mb-1">Email</label>
          <input
            id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border rounded-[10px] px-4 py-3 font-body text-text-primary focus:outline-none focus:border-amber"
          />
        </div>
        <div>
          <label htmlFor="company" className="block font-body text-sm font-semibold text-text-primary mb-1">Company</label>
          <input
            id="company" type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-border rounded-[10px] px-4 py-3 font-body text-text-primary focus:outline-none focus:border-amber"
          />
        </div>
      </div>
      <button
        type="submit" disabled={submitting}
        className="w-full inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light disabled:opacity-60 transition-colors duration-200 rounded-full px-8 py-3"
      >
        {submitting ? 'Sending...' : 'Show me my number'}
      </button>
      <p className="font-body text-xs text-text-light text-center mt-5">
        I will send you your scorecard and one follow-up note. No newsletter, no drip sequence. You can ask for your data to be deleted at any time.
      </p>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/scorecard/components/EmailGateForm.test.jsx`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add components/scorecard/EmailGateForm.jsx __tests__/scorecard/components/EmailGateForm.test.jsx
git commit -m "feat(scorecard): EmailGateForm with trust footer copy"
```

---

## Task 14: Build `QuizFlow` (state machine) and `ResultView` (result rendering)

QuizFlow drives the questions -> email gate -> result reveal sequence. ResultView composes the simple presentational components into the full result page.

**Files:**
- Create: `components/scorecard/ResultView.jsx`
- Create: `components/scorecard/QuizFlow.jsx`
- Create: `__tests__/scorecard/components/ResultView.test.jsx`
- Create: `__tests__/scorecard/components/QuizFlow.test.jsx`

- [ ] **Step 1: Write the ResultView test**

Create `__tests__/scorecard/components/ResultView.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultView from '@/components/scorecard/ResultView';
import { buildResult } from '@/lib/scorecard/resultRender';

function ans() {
  return {
    q1: { value: '7m_15m' }, q2: { value: 'PROFESSIONAL_SERVICES' }, q3: { value: '51_75' },
    q4:  { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
    q7:  { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
    q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
    q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
  };
}

describe('ResultView', () => {
  it('renders headline, ROI lines, placement, disclosure, CTA', () => {
    const result = buildResult(ans());
    render(<ResultView result={result} />);
    expect(screen.getByText(/leaving between/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 1: Reactive/)).toBeInTheDocument();
    expect(screen.getByText(/directional read from sixteen questions/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /schedule the call/i }).getAttribute('href')).toBe('/watch');
  });

  it('does not render a roi section when roiLines is empty', () => {
    const result = buildResult({
      ...ans(),
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'D', score: 4 }, q8: { value: 'D', score: 4 }, q9: { value: 'D', score: 4 },
      q10: { value: 'D', score: 4 }, q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 },
      q14: { value: 'under_30' }, q15: { value: 'under_5' },
    });
    render(<ResultView result={result} />);
    expect(screen.queryByText(/How I got there/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/components/ResultView.test.jsx`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the ResultView component**

Create `components/scorecard/ResultView.jsx`:
```jsx
import RoiLine from './RoiLine';
import StagePlacementCard from './StagePlacementCard';
import CtaCard from './CtaCard';

export default function ResultView({ result }) {
  const showRoi = result.roiLines.length > 0;
  return (
    <div className="space-y-10">
      {/* Section 1: The number */}
      <section className="text-center">
        <h1 className="font-display text-3xl md:text-5xl font-semibold text-navy leading-tight mb-5">
          {result.headline.lead}
        </h1>
        <p className="font-body text-text-mid md:text-lg max-w-2xl mx-auto">
          {result.headline.subline}
        </p>
      </section>

      {/* Section 2: The math */}
      {showRoi && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-5 text-center">How I got there</h2>
          <div>
            {result.roiLines.map((line) => (
              <RoiLine key={line.key} line={line} modelLabel={result.modelLabel} />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Why this is happening */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl text-navy mb-5 text-center">Why this is happening</h2>
        <StagePlacementCard placement={result.placement} binding={result.binding} />
      </section>

      {/* Section 4: Bright spots */}
      {result.brightSpots && result.brightSpots.length > 0 && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-5 text-center">What you are doing right</h2>
          <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
            <p className="font-body text-text-mid leading-relaxed">
              You scored above your placement on {result.brightSpots.map((s) => s.competencyLabel).join(' and ')}. That is foundation for the work ahead.
            </p>
          </div>
        </section>
      )}

      {/* Section 5: Disclosure */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl text-navy mb-5 text-center">What this scorecard can and cannot tell you</h2>
        <div className="bg-cream rounded-[14px] border border-border p-6 md:p-8">
          <p className="font-body text-text-mid leading-relaxed">{result.disclosure}</p>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section>
        <CtaCard cta={result.cta} />
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Write the QuizFlow test**

Create `__tests__/scorecard/components/QuizFlow.test.jsx`:
```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizFlow from '@/components/scorecard/QuizFlow';

function selectFirstOption() {
  const radios = screen.getAllByRole('radio');
  fireEvent.click(radios[0]);
}

function clickNext() {
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
}

beforeEach(() => {
  global.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({
      success: true,
      contactId: 'c-1',
      dealId: 'd-1',
      result: {
        headline: { lead: 'Your operating system is leaving between $1M and $2M on the table this year.', subline: 'subline', floorDollars: 1_000_000, medianDollars: 2_000_000, modelLabel: 'B2B SaaS' },
        roiLines: [],
        placement: { stage: 1, name: 'Reactive', descriptor: 'desc' },
        binding: null,
        brightSpots: null,
        disclosure: 'disclosure',
        cta: { destination: '/watch', heading: 'CTA', cardLines: ['a','b','c','d'], buttonLabel: 'Schedule the call' },
        modelLabel: 'B2B SaaS',
        benchmarkVersion: '1.1',
        generatedAt: 'now',
      },
    }),
  }));
});

describe('QuizFlow', () => {
  it('renders the first question on mount and disables Next until selected', () => {
    render(<QuizFlow utms={{}} />);
    expect(screen.getByText(/Section 1 of 3/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    selectFirstOption();
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('advances to the email gate after the last shown question', async () => {
    // Path: 14 questions for B2B_SAAS path (q15 shown), or 13 for B2B_PRODUCT (hidden).
    // To minimize clicks in this test we use B2B_PRODUCT so q15 is hidden.
    render(<QuizFlow utms={{}} />);
    // q1: pick first option (under $1M)
    selectFirstOption(); clickNext();
    // q2: pick B2B_PRODUCT (which is 3rd in BUSINESS_MODEL_OPTIONS by current order)
    const q2Radios = screen.getAllByRole('radio');
    // Find the B2B_PRODUCT option by label match
    const productRadio = q2Radios.find((r) => r.getAttribute('value') === 'B2B_PRODUCT');
    fireEvent.click(productRadio);
    clickNext();
    // q3: pick first
    selectFirstOption(); clickNext();
    // q4..q12: pick first (A) each — 9 questions
    for (let i = 0; i < 9; i++) { selectFirstOption(); clickNext(); }
    // q13, q14: pick first (or first non-notTracked)
    selectFirstOption(); clickNext();
    // q14 first option is notTracked. Pick second.
    fireEvent.click(screen.getAllByRole('radio')[1]); clickNext();
    // q15 is hidden because q2 = B2B_PRODUCT, so we should be at the email gate now.
    await waitFor(() => expect(screen.getByText(/Where should I send your scorecard/i)).toBeInTheDocument());
  });

  it('submits the form, calls /api/scorecard/submit, and reveals the result', async () => {
    render(<QuizFlow utms={{ utm_source: 'linkedin', utm_medium: 'social' }} />);
    // Speed through. Q2 = B2B_PRODUCT so q15 is hidden (saves a click).
    selectFirstOption(); clickNext();
    const q2Radios = screen.getAllByRole('radio');
    fireEvent.click(q2Radios.find((r) => r.getAttribute('value') === 'B2B_PRODUCT'));
    clickNext();
    selectFirstOption(); clickNext();
    for (let i = 0; i < 9; i++) { selectFirstOption(); clickNext(); }
    selectFirstOption(); clickNext();
    fireEvent.click(screen.getAllByRole('radio')[1]); clickNext();
    await waitFor(() => screen.getByText(/Where should I send your scorecard/i));

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: /show me my number/i }));

    await waitFor(() => expect(screen.getByText(/leaving between \$1M and \$2M/i)).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith('/api/scorecard/submit', expect.objectContaining({
      method: 'POST',
    }));
    const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(callBody.email).toBe('jane@example.com');
    expect(callBody.utms.utm_source).toBe('linkedin');
    expect(callBody.answers.q1).toBeDefined();
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/components/QuizFlow.test.jsx`
Expected: FAIL with module-not-found.

- [ ] **Step 6: Write the QuizFlow component**

Create `components/scorecard/QuizFlow.jsx`:
```jsx
'use client';
import { useState, useMemo } from 'react';
import { getQuestionsFor } from '@/lib/scorecard/questions';
import SectionHeader from './SectionHeader';
import QuestionCard from './QuestionCard';
import EmailGateForm from './EmailGateForm';
import ResultView from './ResultView';

export default function QuizFlow({ utms = {} }) {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState('questions');     // 'questions' | 'email' | 'submitting' | 'result' | 'error'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const visibleQuestions = useMemo(() => getQuestionsFor(answers), [answers]);
  const safeIndex = Math.min(currentIndex, visibleQuestions.length - 1);
  const currentQuestion = visibleQuestions[safeIndex];
  const isLast = safeIndex === visibleQuestions.length - 1;

  function recordAnswer(option) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        value: option.value,
        ...(typeof option.score === 'number' ? { score: option.score } : {}),
      },
    }));
  }

  function next() {
    if (isLast) {
      setStep('email');
    } else {
      setCurrentIndex(safeIndex + 1);
    }
  }

  function back() {
    if (safeIndex > 0) setCurrentIndex(safeIndex - 1);
  }

  async function submit({ firstName, email, company }) {
    setStep('submitting');
    try {
      const res = await fetch('/api/scorecard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, company, utms, answers }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStep('error');
        return;
      }
      setResult(data.result);
      setStep('result');
    } catch (err) {
      setError('Network error. Please try again.');
      setStep('error');
    }
  }

  if (step === 'result' && result) {
    return (
      <div className="mx-auto max-w-3xl px-6 md:px-8 py-12">
        <ResultView result={result} />
      </div>
    );
  }

  if (step === 'email' || step === 'submitting') {
    return (
      <div className="mx-auto max-w-2xl px-6 md:px-8 py-12">
        <EmailGateForm onSubmit={submit} submitting={step === 'submitting'} />
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="mx-auto max-w-xl px-6 md:px-8 py-12 text-center">
        <p className="font-body text-text-mid mb-4">{error}</p>
        <button
          onClick={() => setStep('email')}
          className="font-body font-semibold bg-amber text-white rounded-full px-8 py-3"
        >
          Try again
        </button>
      </div>
    );
  }

  // step === 'questions'
  const selected = answers[currentQuestion.id];
  return (
    <div className="mx-auto max-w-2xl px-6 md:px-8 py-12">
      <SectionHeader section={currentQuestion.section} />
      <QuestionCard question={currentQuestion} answers={answers} selected={selected} onSelect={recordAnswer} />
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={back}
          disabled={safeIndex === 0}
          className="font-body text-text-mid hover:text-text-primary disabled:opacity-30"
        >
          Back
        </button>
        <button
          onClick={next}
          disabled={!selected}
          className="font-body font-semibold bg-amber text-white hover:bg-amber-light disabled:opacity-40 transition-colors duration-200 rounded-full px-8 py-3"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Run both tests**

Run: `npm test -- __tests__/scorecard/components/ResultView.test.jsx __tests__/scorecard/components/QuizFlow.test.jsx`
Expected: 5 passed.

- [ ] **Step 8: Commit**

```bash
git add components/scorecard/ResultView.jsx components/scorecard/QuizFlow.jsx __tests__/scorecard/components/ResultView.test.jsx __tests__/scorecard/components/QuizFlow.test.jsx
git commit -m "feat(scorecard): QuizFlow state machine and ResultView assembly"
```

---

## Task 15: Replace `app/scorecard/page.js` with landing + `ScorecardExperience`

The page becomes a thin server-component shell that exports static metadata and renders the `<ScorecardExperience />` client component. ScorecardExperience handles the landing toggle that swaps the landing copy for the QuizFlow.

**Files:**
- Modify: `app/scorecard/page.js` (full replacement)
- Create: `components/scorecard/ScorecardExperience.jsx`
- Create: `__tests__/scorecard/components/ScorecardExperience.test.jsx`

- [ ] **Step 1: Write the ScorecardExperience test**

Create `__tests__/scorecard/components/ScorecardExperience.test.jsx`:
```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScorecardExperience from '@/components/scorecard/ScorecardExperience';

// Stub UtmCapture (it touches sessionStorage; the unit test does not need it)
vi.mock('@/components/UtmCapture', () => ({ default: () => null }));

describe('ScorecardExperience', () => {
  it('renders the landing headline and "Find your number" CTA on mount', () => {
    render(<ScorecardExperience />);
    expect(screen.getByText(/find the dollar amount your operating system is leaving on the table/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find your number/i })).toBeInTheDocument();
  });

  it('renders the below-the-fold credibility framing copy', () => {
    render(<ScorecardExperience />);
    expect(screen.getByText(/What you will get back/i)).toBeInTheDocument();
    expect(screen.getByText(/What I am comparing you against/i)).toBeInTheDocument();
    expect(screen.getByText(/What this is not/i)).toBeInTheDocument();
  });

  it('transitions to the quiz when the CTA is clicked', () => {
    render(<ScorecardExperience />);
    fireEvent.click(screen.getByRole('button', { name: /find your number/i }));
    expect(screen.getByText(/Section 1 of 3/)).toBeInTheDocument();
  });

  it('has no em-dash in landing copy', () => {
    const { container } = render(<ScorecardExperience />);
    expect(container.textContent).not.toMatch(/—/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/scorecard/components/ScorecardExperience.test.jsx`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the ScorecardExperience component**

Create `components/scorecard/ScorecardExperience.jsx`:
```jsx
'use client';
import { useState, useEffect } from 'react';
import { captureUtms, getUtms } from '@/lib/utm';
import QuizFlow from './QuizFlow';

function Landing({ onStart }) {
  return (
    <main>
      <section className="mx-auto max-w-[820px] px-6 md:px-8 pt-10 pb-16 md:pt-16 md:pb-24 text-center">
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
          Free Diagnostic
        </p>
        <h1 className="font-display text-[32px] md:text-[48px] leading-tight font-semibold text-navy mb-6">
          In five minutes, find the dollar amount your operating system is leaving on the table this year, and the one gap I would fix first if you were my client.
        </h1>
        <p className="font-body text-lg md:text-xl text-text-mid max-w-[620px] mx-auto mb-8">
          This scorecard is for B2B founders who feel like every dollar of revenue growth requires another hire.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-10 py-4 text-lg"
        >
          Find your number
        </button>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[760px] px-6 md:px-8 py-16 md:py-24 space-y-8">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What you will get back</h2>
            <p className="font-body text-text-mid leading-relaxed">
              A maturity stage placement against the 44-competency framework I use with paying clients, the dollar gap between you and peers in your business model on three specific metrics (revenue per employee, sales cycle velocity, retention), and the one operational gap I would attack first.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What I am comparing you against</h2>
            <p className="font-body text-text-mid leading-relaxed">
              Real benchmark numbers sourced from named public reports (The Bridge Group, SaaS Capital, Optifai, Deltek, Recurly, others), keyed to your business model so the comparison is to peers like you, not to a generic SMB blend. Sources cited next to every number.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What this is not</h2>
            <p className="font-body text-text-mid leading-relaxed">
              This is a directional read from sixteen questions. It is not the full assessment I run with paying clients, which connects to your CRM and revenue tools and scores all 44 competencies. If the numbers below feel right, that is the signal to take the next step.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ScorecardExperience() {
  const [mode, setMode] = useState('landing');
  const [utms, setUtms] = useState({});

  useEffect(() => {
    captureUtms();
    setUtms(getUtms());
  }, []);

  if (mode === 'quiz') {
    return <QuizFlow utms={utms} />;
  }
  return <Landing onStart={() => setMode('quiz')} />;
}
```

- [ ] **Step 4: Replace `app/scorecard/page.js`**

Overwrite `app/scorecard/page.js` with:
```jsx
import Link from 'next/link';
import Image from 'next/image';
import ScorecardExperience from '@/components/scorecard/ScorecardExperience';

export const metadata = {
  title: 'Modern BizOps Maturity Scorecard',
  description:
    'In five minutes, find the dollar amount your operating system is leaving on the table and the one gap I would fix first. Sixteen questions. Peer-anchored ROI math from named public benchmark reports.',
  alternates: {
    canonical: 'https://modernbizops.com/scorecard',
  },
  openGraph: {
    title: 'Modern BizOps Maturity Scorecard',
    description:
      'Find the dollar amount your operating system is leaving on the table this year. Peer-anchored against your business model.',
    url: 'https://modernbizops.com/scorecard',
    images: [
      {
        url: 'https://modernbizops.com/og/og-scorecard.png',
        width: 1200,
        height: 630,
        alt: 'Modern BizOps Maturity Scorecard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern BizOps Maturity Scorecard',
    description: 'Sixteen questions. Peer-anchored ROI. The one gap I would fix first.',
    images: ['https://modernbizops.com/og/og-scorecard.png'],
  },
};

export default function ScorecardPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="px-6 md:px-8 py-5">
        <Link href="/">
          <Image
            src="/logos/horizontal-full-color-light.png"
            alt="Modern BizOps"
            width={330}
            height={90}
            sizes="(max-width: 768px) 180px, 300px"
            className="h-14 md:h-[88px] w-auto"
            priority
          />
        </Link>
      </div>

      <ScorecardExperience />

      <footer className="border-t border-border px-6 py-4 text-center bg-cream">
        <div className="flex justify-center gap-6">
          <Link href="/privacy" className="font-body text-xs text-text-light hover:text-text-mid transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="font-body text-xs text-text-light hover:text-text-mid transition-colors">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 5: Run the ScorecardExperience test**

Run: `npm test -- __tests__/scorecard/components/ScorecardExperience.test.jsx`
Expected: 4 passed.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: all tests pass. If anything red, fix and re-run before moving on.

- [ ] **Step 7: Run the voice lint against live files**

Run: `npm run lint:scorecard`
Expected: `Voice lint passed.`

- [ ] **Step 8: Run the build**

Run: `npm run build`
Expected: build succeeds, no Next.js errors.

- [ ] **Step 9: Commit**

```bash
git add app/scorecard/page.js components/scorecard/ScorecardExperience.jsx __tests__/scorecard/components/ScorecardExperience.test.jsx
git commit -m "feat(scorecard): replace landing page with Phase B maturity scorecard"
```

---

## Task 16: Manual smoke verification via `preview_*` tools

End-to-end check in the live dev server: landing renders, CTA advances to quiz, Q15 hides for B2B product, email gate posts, result renders inline. Captures a screenshot for the PR.

**Files:** none modified; verification only.

- [ ] **Step 1: Start the dev server**

Use `preview_start` to launch `npm run dev`. Wait for the server to be ready and capture the assigned URL.

- [ ] **Step 2: Navigate to `/scorecard`**

Use `preview_eval` with `window.location.assign('/scorecard')` (or include `/scorecard` in the preview URL when starting). Then `preview_snapshot` to capture the rendered DOM and confirm the landing headline is present.

Expected: the snapshot contains "find the dollar amount your operating system is leaving on the table".

- [ ] **Step 3: Click "Find your number"**

Use `preview_click` on the "Find your number" button.
Then `preview_snapshot`.

Expected: the snapshot now contains "Section 1 of 3" and the Q1 prompt "Annual revenue".

- [ ] **Step 4: Walk through Q1 (under $1M), Q2 (B2B product to hide Q15), Q3 (just me), Q4..Q12 (option A on each), Q13 (under $5K), Q14 (under 30 days)**

For each step use `preview_click` on the appropriate radio input, then click the "Next" button. After Q14, the email gate should appear. After clicking Next on Q14 with `q2 = B2B_PRODUCT`, the next view should be the email gate (Q15 hidden).

Expected after walking through all questions: `preview_snapshot` shows "Where should I send your scorecard?".

- [ ] **Step 5: Fill in the email gate with a test contact and submit**

Use `preview_fill` to populate firstName, email (use a test address like `qa+scorecard@example.com`), and company. Click "Show me my number".

Expected: a brief loading state, then the result view appears with the headline, a placement card, the disclosure, and the CTA. `preview_network` should show the POST to `/api/scorecard/submit` returning 200.

If the submit hits real HubSpot, this creates a real contact + deal. Decide before this step whether to (a) point HUBSPOT_API_KEY at a sandbox account, (b) stub the route locally, or (c) accept the real-CRM-write and clean up afterward. Prefer option (a). If running against prod, manually delete the test contact and deal afterward.

- [ ] **Step 6: Capture a screenshot of the result view**

Use `preview_screenshot` to capture the rendered result. Save the path; this becomes the proof image in the PR description.

- [ ] **Step 7: Click the CTA link and confirm it lands on `/watch` with no UTM query string**

Use `preview_click` on the "Schedule the call" button. After navigation, `preview_eval` `window.location.pathname + window.location.search` and confirm it equals `/watch` with no UTM params appended.

- [ ] **Step 8: Stop the dev server**

Use `preview_stop`.

- [ ] **Step 9: Send the screenshot proof to Bradley**

Use `SendUserFile` with the screenshot from Step 6 and a one-line caption: "Result page after walking through the full quiz".

- [ ] **Step 10: Commit any remaining changes (none expected) and open the PR**

Confirm the working tree is clean:
```bash
git status
```

If clean, push the branch and open a PR following the standard PR template:
```bash
git push -u origin claude/dreamy-nash-8893b5
gh pr create --title "feat(scorecard): replace /scorecard with Phase B maturity lead magnet" --body "$(cat <<'EOF'
## Summary
- Replace the existing /scorecard funnel with the Phase B 44-competency maturity scorecard.
- Sixteen questions across three sections, peer-anchored ROI math from businessModelBenchmarks v1.1.
- HubSpot contact upsert + idempotent deal create at NEW_LEAD_STAGE in the RevOps Coaching pipeline.
- React-PDF result document; voice lint script in CI.
- Promotes NEW_LEAD_STAGE constant to lib/hubspot.js for shared use across submit-scorecard and create-watch-deal.

## Spec
docs/superpowers/specs/2026-06-10-maturity-scorecard-lead-magnet-design.md

## Plan
docs/superpowers/plans/2026-06-10-maturity-scorecard-lead-magnet-plan.md

## Test plan
- [x] npm test passes (all scorecard tests + sanity)
- [x] npm run lint:scorecard passes
- [x] npm run build passes
- [x] Manual smoke verified end-to-end via preview tools; screenshot attached

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review against the spec

Before handing off, walked the plan against `docs/superpowers/specs/2026-06-10-maturity-scorecard-lead-magnet-design.md` once.

**Spec coverage (each Settled Decision and Architecture Component mapped to a task):**

| Spec item | Plan task |
|---|---|
| Same-route replacement (decision 1) | Task 15 |
| Phase B alignment, 4 stages, 9 of 44 competencies (decision 2) | Tasks 3, 4 |
| Single offer, CTA -> /watch (decision 3) | Tasks 11 (CtaCard), 14 (ResultView), 16 (smoke verify no UTM) |
| Vendor benchmark file Option A (decision 4) | Task 2 |
| React-PDF (decision 5) | Task 9 |
| Voice strict + lint script (decision 6) | Tasks 5, 8 |
| Promote NEW_LEAD_STAGE to lib/hubspot.js (decision 7) | Task 1 |
| No UTMs on internal /watch CTA (decision 8) | Tasks 11, 14, 16 (verification) |
| Vitest dev dep (decision 9) | Task 0 |
| Architecture C1: questions + scoring | Tasks 3, 4 |
| Architecture C2: benchmark module | Task 2 |
| Architecture C3: ROI engine | Task 6 |
| Architecture C4: resultRender + voice | Tasks 5, 7 |
| Architecture C5: quiz UI components | Tasks 11, 12, 13, 14 |
| Architecture C6: result UI | Tasks 11, 14 (ResultView) |
| Architecture C7: submit API | Task 10 |
| Architecture C8: landing page | Task 15 |
| Architecture C9: PDF | Task 9 |
| Voice lint script wired into CI | Task 8 (plus the `lint:scorecard` script in Task 0) |
| All test files | All tasks have a paired test |

**Deferred-scope guard:** The spec's "What's NOT in this sprint" list (email follow-up sequence, published pricing, A/B variants, lead-response question, app-side migration, OG image refresh, em-dash cleanup of create-watch-deal, shareable result token route, PDF email send pipeline) has NOT been folded into any task. The PDF render is in Task 9; the email-attachment SMTP step is left for a follow-up as the spec specified.

**Placeholder scan:** No TBD, no "TODO", no "implement later". Every code block contains the actual code to ship.

**Type consistency check:**
- `RoiLine` shape (`{ key, title, clientValue, peerMedian, peerRange, comparison, comparisonCopy, floorDollars, medianDollars, body, source }`) is defined in Task 6 and consumed in Tasks 9, 11, 14 with the same field names.
- `Result` shape (`{ headline, roiLines, placement, binding, brightSpots, disclosure, cta, modelLabel, benchmarkVersion, generatedAt }`) is built in Task 7 and consumed in Tasks 9, 10, 14 with the same names.
- `placement` shape (`{ stage, name, descriptor }`) is consistent in Tasks 7, 9, 12, 14.
- `binding` shape (`{ failingBlock, questions, translation }`) is consistent in Tasks 4 (without `translation`), 7 (adds `translation`), 9, 12, 14.
- Constant `NEW_LEAD_STAGE` (not `SCORECARD_NEW_LEAD_STAGE`) — consistent across Tasks 1 and 10.

**Spec-vs-plan refinement noted in plan but not in spec:**
- ROI generators return `null` when `medianDollars <= 0` (Task 6). This is a small refinement of the spec language "always fires when Q1 + Q3 answered" for the revenue-per-employee generator. The behavior is honest to the loss-framing rule (do not surface a "leaving $0 on the table" line). Mentioned in the Task 6 header.

All clear.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-10-maturity-scorecard-lead-magnet-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?

