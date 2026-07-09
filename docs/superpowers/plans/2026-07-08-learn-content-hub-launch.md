# /learn Content Hub Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish three approved long-form SEO pages at `/learn/[slug]` (Stage 1 hub + two competency pages), wire schema/OG/sitemap, and point `/predictable-revenue-engine`'s two now-live competency cards at them.

**Architecture:** One dynamic route `app/learn/[slug]/page.js` driven by a small per-slug metadata registry (`lib/learn/registry.js`) plus three hand-written JSX body components (`components/learn/content/*.jsx`, mirroring the existing convention where `/predictable-revenue-engine`'s prose is hand-JSX and structured/repeated data lives in `lib/`). A shared `components/learn/LearnPageShell.jsx` renders Header/breadcrumb/title/byline/body/FAQ/CTA/Footer so the three pages, and the ~27 future pages in this pilot, share one shell. Schema (DefinedTermSet/DefinedTerm, BreadcrumbList, FAQPage, Person) is built by small pure functions in `lib/learn/schema.js`, following the existing functional pattern in `app/schema.js`, and injected per-page exactly like `app/predictable-revenue-engine/page.js` already does for its FAQ/Breadcrumb JSON-LD.

**Tech Stack:** Next.js App Router (JS, not TS), Tailwind, Vitest for data/schema-shape tests (this repo has no page-render test precedent — component/data tests are the convention, e.g. `__tests__/maturity/competencies.test.js`).

**Content source of truth:** Approved copy lives verbatim in three staged files. Every body paragraph, heading, and FAQ answer below is sourced from these files — implementation must not alter wording, only wrap it in JSX and hyperlink specific already-live URLs:
- `Modern BizOps/Marketing Systems/SEO Pilot/pending-approval/01-stage-1-reactive-hub.md` (content starts after the `---` at line 11, ignore the "DRAFT NOTE" commentary above it)
- `Modern BizOps/Marketing Systems/SEO Pilot/pending-approval/02-crm-architecture-and-governance.md` (content starts after line 11)
- `Modern BizOps/Marketing Systems/SEO Pilot/pending-approval/03-pipeline-stage-design.md` (content starts after line 13)

**Slug mapping gotcha (verified during research, do not conflate):** the competency-data slug for CRM in `lib/maturity/competencies/stage1.js` is `crm-architecture-governance` (no "and"), but the published URL is `/learn/crm-architecture-and-governance` (with "and"). The Pipeline slug matches exactly on both sides: `pipeline-stage-design`.

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/learn/registry.js` | Per-slug metadata: title, meta description, canonical URL, OG image, breadcrumb trail, last-updated date, FAQ array, CTA text/URL/button label, schema inputs (DefinedTermSet/DefinedTerm fields). No prose body. |
| `lib/learn/schema.js` | Pure functions: `getDefinedTermSetSchema(entry)`, `getDefinedTermSchema(entry)`, `getBreadcrumbSchema(entry)`, `getFaqSchema(entry)`, `getLearnPersonSchema()`. Mirrors `app/schema.js`'s functional style. |
| `components/learn/LearnPageShell.jsx` | Shared visual shell: Header, visible breadcrumb nav (real `<Link>`s for all but current page — this is how "up" links to the hub and to `/predictable-revenue-engine` get satisfied), H1, byline, last-updated stamp, `{children}` body slot, FAQ section (reuses `components/maturity/MaturityFaq`), CTA section (reuses `components/ui/Button` + `components/ui/Section`), Footer. |
| `components/learn/content/Stage1ReactiveHubBody.jsx` | Hand-JSX body for the hub page, verbatim from source file 01. |
| `components/learn/content/CrmArchitectureGovernanceBody.jsx` | Hand-JSX body for the CRM page, verbatim from source file 02. |
| `components/learn/content/PipelineStageDesignBody.jsx` | Hand-JSX body for the Pipeline page, verbatim from source file 03. |
| `app/learn/[slug]/page.js` | `generateStaticParams`, `generateMetadata`, default export. Looks up slug in registry, 404s via `notFound()` if absent, renders `LearnPageShell` + the matching body component + JSON-LD scripts. |
| `lib/maturity/competencies/stage1.js` | Modify: add `learnMoreUrl` to the CRM (id 3) and Pipeline (id 5) entries only. |
| `components/maturity/CompetencyCard.jsx` | Modify: if `c.learnMoreUrl` is present, render a `<Link>` to it instead of the toggle `<button>`. All other competencies unchanged. |
| `app/sitemap.js` | Modify: add 3 URL entries + 3 `LAST_MODIFIED` keys. |
| `public/og/og-learn-stage-1-reactive.png`, `og-learn-crm-architecture.png`, `og-learn-pipeline-stage-design.png` | Copied from the staged `og-images/` folder. |
| `__tests__/learn/registry.test.js` | Data-shape tests mirroring `__tests__/maturity/competencies.test.js` (required fields present, no em dashes, slugs match route, FAQ non-empty, `hasDefinedTerm`/`inDefinedTermSetUrl` point only at live URLs). |
| `__tests__/learn/schema.test.js` | Each schema function returns valid `@type`/`@context`, `Person.sameAs` includes the LinkedIn URL, breadcrumb `itemListElement` matches registry breadcrumb length/order. |

---

## Task 1: Registry data

**Files:**
- Create: `lib/learn/registry.js`
- Test: `__tests__/learn/registry.test.js`

- [ ] **Step 1: Write the failing test**

```js
// __tests__/learn/registry.test.js
import { describe, it, expect } from "vitest";
import { LEARN_PAGES } from "@/lib/learn/registry";

const EM_DASH = /—/;
const SLUGS = [
  "revenue-operations-maturity-stage-1-reactive",
  "crm-architecture-and-governance",
  "pipeline-stage-design",
];

describe("learn page registry", () => {
  it("has exactly the three approved slugs as keys", () => {
    expect(Object.keys(LEARN_PAGES).sort()).toEqual([...SLUGS].sort());
  });

  it("every entry has the required shape", () => {
    for (const slug of SLUGS) {
      const e = LEARN_PAGES[slug];
      expect(e.slug).toBe(slug);
      expect(["hub", "competency"]).toContain(e.pageType);
      expect(e.title.length).toBeGreaterThan(0);
      expect(e.metaDescription.length).toBeGreaterThan(0);
      expect(e.url).toBe(`https://modernbizops.com/learn/${slug}`);
      expect(e.ogImage).toMatch(/^https:\/\/modernbizops\.com\/og\/.+\.png$/);
      expect(e.lastUpdated).toBe("2026-07-09");
      expect(e.breadcrumb.length).toBeGreaterThanOrEqual(3);
      expect(e.breadcrumb[0]).toEqual({ name: "Home", url: "https://modernbizops.com" });
      expect(e.breadcrumb.at(-1).url).toBe(e.url);
      expect(e.faq.length).toBeGreaterThan(0);
      for (const f of e.faq) {
        expect(f.q.length).toBeGreaterThan(0);
        expect(f.a.length).toBeGreaterThan(0);
      }
      expect(e.ctaButtonLabel.length).toBeGreaterThan(0);
      expect(e.ctaUrl).toMatch(/^https:\/\/modernbizops\.com\/(scorecard|playbook)\?utm_/);
    }
  });

  it("contains no em dashes anywhere in the registry", () => {
    expect(EM_DASH.test(JSON.stringify(LEARN_PAGES))).toBe(false);
  });

  it("hub page's DefinedTermSet only references the two live competency pages", () => {
    const hub = LEARN_PAGES["revenue-operations-maturity-stage-1-reactive"];
    expect(hub.definedTermSet.hasDefinedTerm.sort()).toEqual(
      [
        "https://modernbizops.com/learn/crm-architecture-and-governance",
        "https://modernbizops.com/learn/pipeline-stage-design",
      ].sort()
    );
  });

  it("competency pages point inDefinedTermSet back at the live hub URL", () => {
    for (const slug of ["crm-architecture-and-governance", "pipeline-stage-design"]) {
      expect(LEARN_PAGES[slug].definedTerm.inDefinedTermSetUrl).toBe(
        "https://modernbizops.com/learn/revenue-operations-maturity-stage-1-reactive"
      );
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/learn/registry.test.js`
Expected: FAIL — `Cannot find module '@/lib/learn/registry'`

- [ ] **Step 3: Write `lib/learn/registry.js`**

Populate `title`, `metaDescription`, `ctaUrl` fields verbatim from each source file's `**Title tag:**`, `**Meta description:**`, and `**CTA URL:**` lines. FAQ `q`/`a` pairs copied verbatim from each file's `## FAQ` section. Breadcrumb names/order exactly as specified in each file's `**Schema recommendation:**` line (`Home > Revenue Maturity Model > Stage 1: Reactive [> competency name]`). `ctaButtonLabel` is new UI chrome (not body copy) — short imperative label matching the site's existing Button convention (e.g. `/predictable-revenue-engine`'s "Get your Revenue Maturity Score"): use `"Take the Revenue Maturity Playbook"` for the hub (CTA → `/playbook`) and `"Get Your Revenue Growth Scorecard"` for both competency pages (CTA → `/scorecard`).

Full object for all three slugs, including `definedTermSet` (hub only, `hasDefinedTerm` limited to the two live URLs per the "do not link forthcoming pages" rule applied to schema too) and `definedTerm` (competency pages only, `name` + `description` from each file's `**Schema recommendation:**` line, `inDefinedTermSetUrl` pointing at the hub).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/learn/registry.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/learn/registry.js __tests__/learn/registry.test.js
git commit -m "feat(learn): add content registry for the three approved /learn pages"
```

---

## Task 2: Schema helpers

**Files:**
- Create: `lib/learn/schema.js`
- Test: `__tests__/learn/schema.test.js`

- [ ] **Step 1: Write the failing test**

```js
// __tests__/learn/schema.test.js
import { describe, it, expect } from "vitest";
import { LEARN_PAGES } from "@/lib/learn/registry";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getLearnPersonSchema,
  getDefinedTermSetSchema,
  getDefinedTermSchema,
} from "@/lib/learn/schema";

const hub = LEARN_PAGES["revenue-operations-maturity-stage-1-reactive"];
const crm = LEARN_PAGES["crm-architecture-and-governance"];

describe("learn schema helpers", () => {
  it("builds a BreadcrumbList matching the registry breadcrumb", () => {
    const ld = getBreadcrumbSchema(hub);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement.length).toBe(hub.breadcrumb.length);
    expect(ld.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://modernbizops.com",
    });
  });

  it("builds an FAQPage schema with one Question per FAQ entry", () => {
    const ld = getFaqSchema(hub);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity.length).toBe(hub.faq.length);
    expect(ld.mainEntity[0]["@type"]).toBe("Question");
  });

  it("Person schema includes the LinkedIn sameAs", () => {
    const ld = getLearnPersonSchema();
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe("Bradley de Wet");
    expect(ld.sameAs).toContain("https://linkedin.com/in/bradleydewet");
  });

  it("DefinedTermSet only lists live hasDefinedTerm URLs", () => {
    const ld = getDefinedTermSetSchema(hub);
    expect(ld["@type"]).toBe("DefinedTermSet");
    expect(ld.hasDefinedTerm.length).toBe(2);
  });

  it("DefinedTerm points inDefinedTermSet at the hub", () => {
    const ld = getDefinedTermSchema(crm);
    expect(ld["@type"]).toBe("DefinedTerm");
    expect(ld.inDefinedTermSet["@id"]).toBe(
      "https://modernbizops.com/learn/revenue-operations-maturity-stage-1-reactive"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/learn/schema.test.js`
Expected: FAIL — module not found

- [ ] **Step 3: Write `lib/learn/schema.js`**

```js
export function getBreadcrumbSchema(entry) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entry.breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };
}

export function getFaqSchema(entry) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function getLearnPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bradley de Wet",
    jobTitle: "Founder, Modern BizOps",
    sameAs: ["https://linkedin.com/in/bradleydewet"],
  };
}

export function getDefinedTermSetSchema(entry) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: entry.definedTermSet.name,
    url: entry.url,
    hasDefinedTerm: entry.definedTermSet.hasDefinedTerm,
  };
}

export function getDefinedTermSchema(entry) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: entry.definedTerm.name,
    description: entry.definedTerm.description,
    inDefinedTermSet: { "@id": entry.definedTerm.inDefinedTermSetUrl },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/learn/schema.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/learn/schema.js __tests__/learn/schema.test.js
git commit -m "feat(learn): add JSON-LD schema builders for /learn pages"
```

---

## Task 3: OG images

**Files:**
- Create: `public/og/og-learn-stage-1-reactive.png`, `public/og/og-learn-crm-architecture.png`, `public/og/og-learn-pipeline-stage-design.png`

- [ ] **Step 1: Copy the three staged PNGs**

```bash
cp "/Users/bradleydewet/Documents/Claude/Projects/Modern BizOps/Marketing Systems/SEO Pilot/pending-approval/og-images/og-learn-stage-1-reactive.png" public/og/
cp "/Users/bradleydewet/Documents/Claude/Projects/Modern BizOps/Marketing Systems/SEO Pilot/pending-approval/og-images/og-learn-crm-architecture.png" public/og/
cp "/Users/bradleydewet/Documents/Claude/Projects/Modern BizOps/Marketing Systems/SEO Pilot/pending-approval/og-images/og-learn-pipeline-stage-design.png" public/og/
```

- [ ] **Step 2: Verify they landed and are non-empty**

Run: `ls -la public/og/og-learn-*.png`
Expected: three files, each >100KB (matches the ~330KB staged size)

- [ ] **Step 3: Commit**

```bash
git add public/og/og-learn-stage-1-reactive.png public/og/og-learn-crm-architecture.png public/og/og-learn-pipeline-stage-design.png
git commit -m "feat(learn): add OG images for the three /learn pages"
```

---

## Task 4: Shared page shell

**Files:**
- Create: `components/learn/LearnPageShell.jsx`

- [ ] **Step 1: Write the component**

```jsx
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import MaturityFaq from "@/components/maturity/MaturityFaq";

function formatLastUpdated(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function LearnPageShell({ entry, children }) {
  return (
    <>
      <Header />
      <main>
        <Section bg="cream" narrow>
          <nav aria-label="Breadcrumb" className="text-sm text-text-light mb-6">
            {entry.breadcrumb.map((b, i) => {
              const isLast = i === entry.breadcrumb.length - 1;
              return (
                <span key={b.url}>
                  {i > 0 && <span className="mx-2">/</span>}
                  {isLast ? (
                    <span className="text-text-mid">{b.name}</span>
                  ) : (
                    <Link href={b.url.replace("https://modernbizops.com", "")} className="hover:text-navy">
                      {b.name}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          <h1 className="font-display font-semibold text-navy text-4xl md:text-5xl leading-tight">
            {entry.h1}
          </h1>
          <p className="text-text-mid italic mt-4">{entry.byline}</p>
          <p className="text-xs text-text-light mt-2">
            Last updated {formatLastUpdated(entry.lastUpdated)}
          </p>

          <article className="mt-10 space-y-6 text-lg text-text-mid leading-relaxed">
            {children}
          </article>
        </Section>

        <Section bg="white" narrow>
          <h2 className="font-display font-semibold text-navy text-3xl mb-6 text-center">
            FAQ
          </h2>
          <MaturityFaq items={entry.faq} />
        </Section>

        <Section bg="navy" narrow>
          <div className="text-center">
            <p className="text-white/80 mb-6 max-w-[58ch] mx-auto">{entry.ctaText}</p>
            <Button href={entry.ctaUrl}>{entry.ctaButtonLabel}</Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
```

Note: `entry.h1` and `entry.byline` need to be added to the registry (Task 1 revisit) — `h1` is the page's `# Heading` (distinct from the SEO `title` tag, which differs slightly on the hub page: title tag is "Stage 1: Reactive Revenue Operations, and How to Get Out of It" but the on-page `# H1` is "Stage 1: Reactive Revenue Operations"). `byline` is the italic author line under the H1, verbatim: `"By Bradley de Wet, founder of Modern BizOps. 15 years in revenue operations, including building revenue systems at Contactually (VC-backed SaaS) before founding Modern BizOps."` (identical across all three pages).

- [ ] **Step 2: Add `h1` and `byline` fields to each registry entry (revisit `lib/learn/registry.js`)**

Add `h1: "Stage 1: Reactive Revenue Operations"` / `"CRM Architecture and Governance"` / `"Pipeline Stage Design"` (exact `# ` heading from each source file) and the shared `byline` string to all three entries.

- [ ] **Step 3: Extend `__tests__/learn/registry.test.js`**

```js
  it("has an h1 and byline distinct from the SEO title", () => {
    for (const slug of SLUGS) {
      const e = LEARN_PAGES[slug];
      expect(e.h1.length).toBeGreaterThan(0);
      expect(e.byline).toContain("Bradley de Wet");
    }
  });
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run __tests__/learn/registry.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/learn/LearnPageShell.jsx lib/learn/registry.js __tests__/learn/registry.test.js
git commit -m "feat(learn): add shared page shell for /learn pages"
```

---

## Task 5: Body content components (verbatim copy)

**Files:**
- Create: `components/learn/content/Stage1ReactiveHubBody.jsx`
- Create: `components/learn/content/CrmArchitectureGovernanceBody.jsx`
- Create: `components/learn/content/PipelineStageDesignBody.jsx`

- [ ] **Step 1: Write `Stage1ReactiveHubBody.jsx`**

Transcribe the body of `01-stage-1-reactive-hub.md` from `## What Reactive actually looks like` (line 37) through `## What crossing into Stage 2 looks like` (line 76) verbatim into JSX (`<h2>`/`<p>`/`<ul><li>` matching the heading structure exactly). Use `className="font-display font-semibold text-navy text-2xl mt-10 mb-3"` for `<h2>` and inherit body copy styling from the parent `<article>` in `LearnPageShell` (no per-paragraph className needed).

Inside `## The six competencies that get you out` (lines 59-70), render the six-item list with:
- CRM Architecture and Governance and Pipeline Stage Design as real `<Link href="/learn/crm-architecture-and-governance">` / `<Link href="/learn/pipeline-stage-design">` (no "(page forthcoming)" annotation, matches source).
- The other four (Ideal Customer Profile, Revenue Lifecycle Design, Data Quality Management, Lead Qualification Framework) as plain `<strong>` text, NOT links, each followed by the italic `(page forthcoming)` annotation exactly as in source — do not create `<Link>` elements for these, their target pages do not exist.
- The closing sentence ("Two of those six already have full breakdowns live: start with...") with the same two live `<Link>`s.

Inside `## Why this matters more now, not less` (lines 53-57), the Deloitte Digital citation becomes:
```jsx
<a href="https://www.deloittedigital.com/us/en/insights/perspective/accelerating-b2b-sales-agentic-ai.html" target="_blank" rel="noopener noreferrer">source</a>
```

- [ ] **Step 2: Write `CrmArchitectureGovernanceBody.jsx`**

Transcribe `02-crm-architecture-and-governance.md` from `## What "not working" actually means` (line 37) through `## The fastest way to tell where you stand` (line 79) verbatim, same heading/paragraph JSX pattern.

Outbound citation links, both `target="_blank" rel="noopener noreferrer"`:
- `https://demandzen.com/mapping-b2b-sales-cycle-stages-crm-forecasting/` (in "Why this happens even in decent-sized companies")
- `https://developers.hubspot.com/mcp` (in "What good looks like, one step at a time", Level 5)

The `## What good looks like, one step at a time` section (lines 55-67) is a labeled Level 1-5 list — render as a `<dl>` or five `<p><strong>Level N{...}:</strong> ...</p>` blocks, matching the source's own paragraph-per-level structure (it is not a markdown bulleted list in the source, keep it as labeled paragraphs).

Do NOT add `<Link>` elements for "Ideal Customer Profile" or "Revenue Lifecycle Design" in the closing paragraph — those stay plain text (forthcoming pages).

- [ ] **Step 3: Write `PipelineStageDesignBody.jsx`**

Transcribe `03-pipeline-stage-design.md` from `## The tell` (line 39) through `## Where to start` (line 73) verbatim, same pattern.

Outbound citation links, all `target="_blank" rel="noopener noreferrer"`:
- `https://www.gartner.com/en/data-analytics/topics/data-quality`
- `https://hbr.org/2022/06/stop-losing-sales-to-customer-indecision`
- `https://www.theskillshift.com/blog/clari-ai-pipeline-health`

`## What good stage design looks like` (lines 55-67) is the Level 1-5 progression, same paragraph-block treatment as the CRM page.

"Revenue Lifecycle Design" in `## Where to start` stays plain text, not a link (forthcoming page).

- [ ] **Step 4: Sanity-check no wording was altered**

Run: `diff <(pbpaste)` is not applicable — instead manually re-read each new component next to its source `.md` file side by side and confirm every sentence matches. Flag (do not silently fix) anything that reads like a typo in the source rather than correcting it.

- [ ] **Step 5: Commit**

```bash
git add components/learn/content/
git commit -m "feat(learn): add verbatim body content for the three /learn pages"
```

---

## Task 6: The `/learn/[slug]` route

**Files:**
- Create: `app/learn/[slug]/page.js`

- [ ] **Step 1: Write the route**

```jsx
import { notFound } from "next/navigation";
import { LEARN_PAGES } from "@/lib/learn/registry";
import LearnPageShell from "@/components/learn/LearnPageShell";
import Stage1ReactiveHubBody from "@/components/learn/content/Stage1ReactiveHubBody";
import CrmArchitectureGovernanceBody from "@/components/learn/content/CrmArchitectureGovernanceBody";
import PipelineStageDesignBody from "@/components/learn/content/PipelineStageDesignBody";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getLearnPersonSchema,
  getDefinedTermSetSchema,
  getDefinedTermSchema,
} from "@/lib/learn/schema";

const BODIES = {
  "revenue-operations-maturity-stage-1-reactive": Stage1ReactiveHubBody,
  "crm-architecture-and-governance": CrmArchitectureGovernanceBody,
  "pipeline-stage-design": PipelineStageDesignBody,
};

export function generateStaticParams() {
  return Object.keys(LEARN_PAGES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const entry = LEARN_PAGES[params.slug];
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.metaDescription,
    alternates: { canonical: entry.url },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: entry.url,
      images: [{ url: entry.ogImage, width: 1200, height: 630, alt: entry.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.metaDescription,
      images: [entry.ogImage],
    },
  };
}

export default function LearnPage({ params }) {
  const entry = LEARN_PAGES[params.slug];
  if (!entry) notFound();

  const Body = BODIES[params.slug];
  const schemas = [
    entry.pageType === "hub" ? getDefinedTermSetSchema(entry) : getDefinedTermSchema(entry),
    getBreadcrumbSchema(entry),
    getFaqSchema(entry),
    getLearnPersonSchema(),
  ];

  return (
    <>
      <LearnPageShell entry={entry}>
        <Body />
      </LearnPageShell>
      {schemas.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
    </>
  );
}
```

- [ ] **Step 2: Start the dev server and manually verify all three routes**

Use the `preview_start` tool (not Bash — this repo's preview tool serves the main worktree by default; run `next dev` on an alternate port per this repo's `Preview in Worktree` gotcha if the preview tool doesn't pick up worktree changes). Visit:
- `/learn/revenue-operations-maturity-stage-1-reactive`
- `/learn/crm-architecture-and-governance`
- `/learn/pipeline-stage-design`

Confirm: H1, byline, last-updated date, full body, FAQ accordion, CTA button all render. Confirm the two live internal links inside the hub's competency list navigate correctly, and the four "forthcoming" competencies render as plain text with no `href`.

- [ ] **Step 3: View source and confirm JSON-LD**

Use `preview_eval` to fetch and parse each page's `<script type="application/ld+json">` tags, confirm `DefinedTermSet`/`DefinedTerm`, `BreadcrumbList`, `FAQPage`, `Person` are all present and `JSON.parse`-able.

- [ ] **Step 4: Commit**

```bash
git add app/learn/
git commit -m "feat(learn): add the /learn/[slug] route"
```

---

## Task 7: Wire `/predictable-revenue-engine`'s "See how I score it" for the two live competencies

**Files:**
- Modify: `lib/maturity/competencies/stage1.js`
- Modify: `components/maturity/CompetencyCard.jsx`
- Modify: `__tests__/maturity/competencies.test.js`

- [ ] **Step 1: Write the failing test**

Add to `__tests__/maturity/competencies.test.js`:

```js
  it("CRM Architecture and Pipeline Stage Design point at their live /learn pages, nothing else does", () => {
    const withLearnMoreUrl = COMPETENCIES.filter((c) => c.learnMoreUrl);
    expect(withLearnMoreUrl.map((c) => c.slug).sort()).toEqual(
      ["crm-architecture-governance", "pipeline-stage-design"].sort()
    );
    expect(competencyBySlug("crm-architecture-governance").learnMoreUrl).toBe(
      "/learn/crm-architecture-and-governance"
    );
    expect(competencyBySlug("pipeline-stage-design").learnMoreUrl).toBe(
      "/learn/pipeline-stage-design"
    );
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/maturity/competencies.test.js`
Expected: FAIL — `learnMoreUrl` is `undefined`

- [ ] **Step 3: Add `learnMoreUrl` to the two entries in `lib/maturity/competencies/stage1.js`**

On the `pipeline-stage-design` object (currently lines 16-45), add a top-level field:
```js
    learnMoreUrl: "/learn/pipeline-stage-design",
```

On the `crm-architecture-governance` object (currently lines 104-132), add:
```js
    learnMoreUrl: "/learn/crm-architecture-and-governance",
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/maturity/competencies.test.js`
Expected: PASS (including the pre-existing "every competency has the required shape" test, which does not assert against extra fields, so it still passes)

- [ ] **Step 5: Update `CompetencyCard.jsx` to link instead of toggle when `learnMoreUrl` is present**

```jsx
"use client";

import Link from "next/link";
import CompetencyIcon from "./CompetencyIcon";

function CardInner({ c, isOpen }) {
  return (
    <>
      <span className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-xl bg-amber-pale text-amber flex items-center justify-center shrink-0">
          <CompetencyIcon competency={c} />
        </span>
        <span className="text-xs text-amber font-semibold tracking-wide">
          {String(c.id).padStart(2, "0")}
        </span>
      </span>
      <span className="font-display font-semibold text-navy text-xl leading-tight">
        {c.name}
      </span>
      <span className="text-sm text-text-mid leading-snug">{c.shortDef}</span>
      <span className="mt-auto pt-1 flex items-center justify-between">
        <span className="text-[11px] text-green bg-green/10 border border-green/20 rounded-full px-2.5 py-0.5 font-semibold">
          Scored 1-5
        </span>
        <span className="text-[13px] text-amber font-semibold">
          {c.learnMoreUrl ? "See how I score it" : isOpen ? "Close" : "See how I score it"}
        </span>
      </span>
    </>
  );
}

export default function CompetencyCard({ competency: c, isOpen, onToggle }) {
  const className = `text-left bg-white border rounded-2xl p-5 transition-colors scroll-mt-24 flex flex-col gap-2 h-full ${
    isOpen ? "border-amber ring-1 ring-amber" : "border-border hover:border-amber"
  }`;

  if (c.learnMoreUrl) {
    return (
      <Link href={c.learnMoreUrl} id={c.slug} className={className}>
        <CardInner c={c} isOpen={isOpen} />
      </Link>
    );
  }

  return (
    <button type="button" id={c.slug} onClick={() => onToggle(c.slug)} aria-expanded={isOpen} className={className}>
      <CardInner c={c} isOpen={isOpen} />
    </button>
  );
}
```

This changes only the two competencies with `learnMoreUrl` set; all other 42 keep the exact prior toggle-button behavior since `c.learnMoreUrl` is `undefined` for them and the function falls through to the original `<button>` branch unchanged.

- [ ] **Step 6: Manually verify in the preview**

Navigate to `/predictable-revenue-engine`, expand "The full map", confirm the CRM Architecture and Governance and Pipeline Stage Design cards now navigate to `/learn/crm-architecture-and-governance` and `/learn/pipeline-stage-design` respectively on click, and confirm three other Stage 1 cards (e.g. Ideal Customer Profile) still expand inline as before.

- [ ] **Step 7: Run the full test suite**

Run: `npx vitest run`
Expected: PASS, no regressions

- [ ] **Step 8: Commit**

```bash
git add lib/maturity/competencies/stage1.js components/maturity/CompetencyCard.jsx __tests__/maturity/competencies.test.js
git commit -m "feat(maturity): link CRM Architecture and Pipeline Stage Design cards to their live /learn pages"
```

---

## Task 8: Sitemap

**Files:**
- Modify: `app/sitemap.js`

- [ ] **Step 1: Add three `LAST_MODIFIED` keys and three URL entries**

```js
const LAST_MODIFIED = {
  home: "2026-04-21",
  watch: "2026-04-24",
  book: "2026-04-24",
  scorecard: "2026-04-24",
  about: "2026-04-24",
  playbook: "2026-06-03",
  maturityModel: "2026-07-02",
  privacy: "2026-04-06",
  terms: "2026-04-06",
  learnStage1Reactive: "2026-07-09",
  learnCrmArchitecture: "2026-07-09",
  learnPipelineStageDesign: "2026-07-09",
};
```

Add after the `predictable-revenue-engine` entry:

```js
    {
      url: `${baseUrl}/learn/revenue-operations-maturity-stage-1-reactive`,
      lastModified: new Date(LAST_MODIFIED.learnStage1Reactive),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/crm-architecture-and-governance`,
      lastModified: new Date(LAST_MODIFIED.learnCrmArchitecture),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/pipeline-stage-design`,
      lastModified: new Date(LAST_MODIFIED.learnPipelineStageDesign),
      changeFrequency: "monthly",
      priority: 0.7,
    },
```

Priority 0.7 (below the 0.8 used for pillar pages like `/predictable-revenue-engine` and `/playbook`) reflects these being spoke/cluster pages under that pillar — flag this judgment call in the PR description.

- [ ] **Step 2: Verify**

Run: `node -e "console.log(require('./app/sitemap.js'))"` will not work directly (ESM) — instead confirm via the running dev server: `preview_network` fetch of `/sitemap.xml` and grep for the three new `<loc>` entries.

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.js
git commit -m "feat(learn): register the three /learn URLs in the sitemap"
```

---

## Task 9: Full verification pass

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: PASS, 0 failures

- [ ] **Step 2: Run lint**

Run: `npx eslint app/learn components/learn lib/learn app/sitemap.js components/maturity/CompetencyCard.jsx lib/maturity/competencies/stage1.js`
Expected: no errors

- [ ] **Step 3: Browser verification via preview tools**

For each of the three `/learn/*` URLs and `/predictable-revenue-engine`:
- `preview_screenshot` — visual check, header/footer/CTA render correctly
- `preview_snapshot` — confirm FAQ accordion items are present and expandable (`preview_click` one, confirm it opens)
- `preview_console_logs` (level: error) — confirm no runtime errors
- `preview_network` — confirm the OG image URLs return 200

- [ ] **Step 4: Confirm outbound links open in a new tab**

`preview_inspect` each outbound `<a>` (Deloitte, demandzen, HubSpot MCP docs, Gartner, HBR, theskillshift) and confirm `target="_blank"` and `rel="noopener noreferrer"` are present.

---

## Deferred to after merge/deploy (cannot be verified pre-deploy)

These acceptance-criteria items require the pages to be live in production and are **not** part of this branch's commits — they follow the `ship-to-production` skill's post-deploy verification step, and should be done once Vercel confirms the production deploy:

1. **OG image social-preview spot-check** — run each live URL through a social preview debugger.
2. **UTM end-to-end confirmation** — click one live tagged CTA and confirm it shows up in GA4 real-time with the correct `utm_content`.
3. **Submit all three URLs to Google Search Console** — `mcp__google-search-console__submit_url` against `sc-domain:modernbizops.com` for all three `/learn/*` URLs, only after they resolve in production.
4. **Notify Cowork** that the pages are live, so the UTM registry rows in `Modern BizOps/UTM/UTM Campaign Registry - Content.csv` flip from `proposed` to `active` for the `evergreen_pseo` campaign, and the design doc's Phase 3 status updates.

---

## Self-Review

**Spec coverage:** Route (Task 6), FAQ visible+schema (Tasks 1,2,4), schema types incl. Person/DefinedTermSet/DefinedTerm/BreadcrumbList (Task 2), OG images (Task 3), internal links incl. forthcoming-page exclusion (Task 5) and the priority "See how I score it" wiring (Task 7), outbound new-tab links (Task 5), CTA URLs used as-is (Task 1/4), sitemap (Task 8), GSC submission + Cowork notification (deferred section, explicitly not skipped). All covered.

**Placeholder scan:** No TBD/TODO left; Task 5's transcription steps reference exact source line ranges rather than re-pasting thousands of words of already-approved prose inline in the plan, which is a deliberate scope adaptation (see plan header) rather than a placeholder — the actual component files written during execution will contain the real text in full.

**Type consistency:** `entry.learnMoreUrl` vs `c.learnMoreUrl` — same field name used consistently in Task 7. Registry field names (`h1`, `byline`, `ctaButtonLabel`, `ctaUrl`, `ctaText`, `faq`, `breadcrumb`, `definedTermSet`, `definedTerm`) used identically across Tasks 1, 2, 4, 6.

**Deferred scope guard:** Four "forthcoming" competency pages (Ideal Customer Profile, Revenue Lifecycle Design, Data Quality Management, Lead Qualification Framework) are explicitly called out as plain text, never `<Link>`, in Task 5. No task creates those routes or links to them.
