import { describe, it, expect } from "vitest";
import { LEARN_PAGES } from "@/lib/learn/registry";

const EM_DASH = /—/;
// Batch 1 (PR #33), batch 2 (all six Stage 1 competencies live), the Wave 1
// pillar-map calibration batch (fractional-coo, net-revenue-retention,
// marketing-and-sales-alignment), the Wave 1 remaining-six batch
// (what-is-revops, revenue-per-employee, smarketing, mql-to-sql-conversion-rate,
// involuntary-churn, win-loss-analysis), Wave 2's fractional-COO cost page
// (fractional-coo-cost), and the Wave 2 AI cluster's two /learn pages
// (ai-for-small-business, ai-tools-for-small-business). The cluster's third page
// (/ai-consulting-for-small-business) is a root-level route, not in this registry.
const SLUGS = [
  "revenue-operations-maturity-stage-1-reactive",
  "crm-architecture-and-governance",
  "pipeline-stage-design",
  "ideal-customer-profile",
  "revenue-lifecycle-design",
  "data-quality-management",
  "lead-qualification-framework",
  "fractional-coo",
  "net-revenue-retention",
  "marketing-and-sales-alignment",
  "what-is-revops",
  "revenue-per-employee",
  "smarketing",
  "mql-to-sql-conversion-rate",
  "involuntary-churn",
  "win-loss-analysis",
  "fractional-coo-cost",
  "ai-for-small-business",
  "ai-tools-for-small-business",
];
const BATCH_1_SLUGS = [
  "revenue-operations-maturity-stage-1-reactive",
  "crm-architecture-and-governance",
  "pipeline-stage-design",
];
// Wave 1 remaining-six batch: last updated 2026-07-15.
const WAVE_1_REMAINING_SLUGS = [
  "what-is-revops",
  "revenue-per-employee",
  "smarketing",
  "mql-to-sql-conversion-rate",
  "involuntary-churn",
  "win-loss-analysis",
];
// Wave 2 batch: last updated 2026-07-22 (fractional-COO cost page and the two
// AI-cluster /learn pages).
const WAVE_2_SLUGS = [
  "fractional-coo-cost",
  "ai-for-small-business",
  "ai-tools-for-small-business",
];
function expectedLastUpdated(slug) {
  if (BATCH_1_SLUGS.includes(slug)) return "2026-07-09";
  if (WAVE_1_REMAINING_SLUGS.includes(slug)) return "2026-07-15";
  if (WAVE_2_SLUGS.includes(slug)) return "2026-07-22";
  return "2026-07-14";
}
// Stage 1 competency pages that carry a DefinedTerm joined to the hub's set.
const STAGE_1_COMPETENCY_SLUGS = [
  "crm-architecture-and-governance",
  "pipeline-stage-design",
  "ideal-customer-profile",
  "revenue-lifecycle-design",
  "data-quality-management",
  "lead-qualification-framework",
];
// Wave 1 pillar-map pages: outside the maturity-stage DefinedTermSet
// hierarchy, flatter Home > Learn > <page> breadcrumb, Article schema.
// revenue-per-employee and win-loss-analysis are AEO/keyword pillar pages, so
// they carry Article schema like the rest of this group, not DefinedTerm.
const PILLAR_ARTICLE_SLUGS = [
  "fractional-coo",
  "marketing-and-sales-alignment",
  "what-is-revops",
  "smarketing",
  "mql-to-sql-conversion-rate",
  "involuntary-churn",
  "revenue-per-employee",
  "win-loss-analysis",
  "fractional-coo-cost",
  "ai-for-small-business",
  "ai-tools-for-small-business",
];
// Standalone DefinedTerm pages: cover a Stage 2/3 competency with no hub yet,
// so no inDefinedTermSet reference. Flatter Home > Learn > <page> breadcrumb.
const STANDALONE_TERM_SLUGS = ["net-revenue-retention"];

describe("learn page registry", () => {
  it("has exactly the nineteen approved slugs as keys", () => {
    expect(Object.keys(LEARN_PAGES).sort()).toEqual([...SLUGS].sort());
  });

  it("every entry has the required shape", () => {
    for (const slug of SLUGS) {
      const e = LEARN_PAGES[slug];
      expect(e.slug).toBe(slug);
      expect(["hub", "competency", "article"]).toContain(e.pageType);
      expect(e.title.length).toBeGreaterThan(0);
      expect(e.metaDescription.length).toBeGreaterThan(0);
      expect(e.url).toBe(`https://modernbizops.com/learn/${slug}`);
      expect(e.ogImage).toMatch(/^https:\/\/modernbizops\.com\/og\/.+\.png$/);
      expect(e.lastUpdated).toBe(expectedLastUpdated(slug));
      expect(e.breadcrumb.length).toBeGreaterThanOrEqual(3);
      expect(e.breadcrumb[0]).toEqual({ name: "Home", url: "https://modernbizops.com" });
      expect(e.breadcrumb.at(-1).url).toBe(e.url);
      expect(e.faq.length).toBeGreaterThan(0);
      for (const f of e.faq) {
        expect(f.q.length).toBeGreaterThan(0);
        expect(f.a.length).toBeGreaterThan(0);
      }
      expect(e.ctaButtonLabel.length).toBeGreaterThan(0);
      // Internal CTAs are plain root-relative links. A UTM on an internal hop
      // resets the GA4 session and misattributes the conversion, so no
      // registry entry may ever carry one.
      expect(e.ctaUrl).toMatch(/^\/(scorecard|playbook)$/);
    }
  });

  it("contains no em dashes anywhere in the registry", () => {
    expect(EM_DASH.test(JSON.stringify(LEARN_PAGES))).toBe(false);
  });

  it("contains no UTM parameters anywhere in the registry", () => {
    expect(JSON.stringify(LEARN_PAGES)).not.toContain("utm_");
  });

  it("hub page's DefinedTermSet references exactly the six live Stage 1 competency pages", () => {
    const hub = LEARN_PAGES["revenue-operations-maturity-stage-1-reactive"];
    expect(hub.definedTermSet.hasDefinedTerm.sort()).toEqual(
      STAGE_1_COMPETENCY_SLUGS.map(
        (s) => `https://modernbizops.com/learn/${s}`
      ).sort()
    );
  });

  it("Stage 1 competency pages point inDefinedTermSet back at the live hub URL", () => {
    for (const slug of STAGE_1_COMPETENCY_SLUGS) {
      expect(LEARN_PAGES[slug].definedTerm.inDefinedTermSetUrl).toBe(
        "https://modernbizops.com/learn/revenue-operations-maturity-stage-1-reactive"
      );
    }
  });

  it("standalone DefinedTerm pages have a named term and no set reference", () => {
    const hub = LEARN_PAGES["revenue-operations-maturity-stage-1-reactive"];
    for (const slug of STANDALONE_TERM_SLUGS) {
      const e = LEARN_PAGES[slug];
      expect(e.pageType).toBe("competency");
      expect(e.definedTerm.name.length).toBeGreaterThan(0);
      expect(e.definedTerm.description.length).toBeGreaterThan(0);
      // No Stage 2/3 hub exists yet, so there is no DefinedTermSet to join. The
      // reference gets added if/when the relevant stage hub ships.
      expect(e.definedTerm.inDefinedTermSetUrl).toBeUndefined();
      expect(hub.definedTermSet.hasDefinedTerm).not.toContain(e.url);
    }
  });

  it("pillar-map article pages carry no DefinedTerm and never join the hub's set", () => {
    const hub = LEARN_PAGES["revenue-operations-maturity-stage-1-reactive"];
    for (const slug of PILLAR_ARTICLE_SLUGS) {
      const e = LEARN_PAGES[slug];
      expect(e.pageType).toBe("article");
      expect(e.definedTerm).toBeUndefined();
      expect(hub.definedTermSet.hasDefinedTerm).not.toContain(e.url);
    }
  });

  it("pillar-map pages use the flatter Home > Learn > page breadcrumb", () => {
    for (const slug of [...PILLAR_ARTICLE_SLUGS, ...STANDALONE_TERM_SLUGS]) {
      const e = LEARN_PAGES[slug];
      expect(e.breadcrumb.length).toBe(3);
      expect(e.breadcrumb[1].name).toBe("Learn");
      // No /learn index route exists yet, so the crumb renders as plain text.
      expect(e.breadcrumb[1].noLink).toBe(true);
    }
  });

  it("fractional-coo-cost owns two inline CTAs; shell skips its default card", () => {
    const e = LEARN_PAGES["fractional-coo-cost"];
    // inlineCtas tells LearnPageShell to skip its single default card so the
    // body can render both CTAs (scorecard mid-page, book at the foot).
    expect(e.inlineCtas).toBe(true);
    // The primary CTA fields still record the scorecard destination, plain and
    // UTM-free like every other entry.
    expect(e.ctaUrl).toBe("/scorecard");
    expect(e.ctaButtonLabel.length).toBeGreaterThan(0);
    // The dek is the title tag's hook, never repeating the H1.
    expect(e.subhead).toBe("What you pay, what you get, and when you do not need one");
    expect(e.subhead).not.toContain(e.h1);
  });

  it("Rider B: NRR and alignment deks carry the hook clause only, titles unchanged", () => {
    const nrr = LEARN_PAGES["net-revenue-retention"];
    expect(nrr.subhead).toBe("The One Number That Shows Whether Growth Is Real");
    expect(nrr.title).toBe(
      "Net Revenue Retention: The One Number That Shows Whether Growth Is Real"
    );
    const alignment = LEARN_PAGES["marketing-and-sales-alignment"];
    expect(alignment.subhead).toBe("One Definition of a Real Opportunity");
    expect(alignment.title).toBe(
      "Marketing and Sales Alignment: One Definition of a Real Opportunity"
    );
  });

  it("Rider A: the alignment measurement FAQ links to the MQL-to-SQL page", () => {
    const alignment = LEARN_PAGES["marketing-and-sales-alignment"];
    const faq = alignment.faq.find((f) =>
      f.q.startsWith("How do you measure marketing and sales alignment")
    );
    expect(faq.aLinks).toEqual([
      {
        text: "MQL-to-SQL conversion rate",
        href: "/learn/mql-to-sql-conversion-rate",
      },
    ]);
    // The plain-string answer (source of truth for the FAQPage JSON-LD) must
    // still contain the exact linked phrase.
    expect(faq.a).toContain("MQL-to-SQL conversion rate");
  });

  it("Wave 1 remaining-six deks carry the hook clause only, never the H1", () => {
    for (const slug of WAVE_1_REMAINING_SLUGS) {
      const e = LEARN_PAGES[slug];
      expect(e.subhead.length).toBeGreaterThan(0);
      expect(e.subhead).not.toBe(e.h1);
      expect(e.subhead).not.toContain(e.h1);
    }
  });

  it("has an h1 and byline distinct from the SEO title", () => {
    for (const slug of SLUGS) {
      const e = LEARN_PAGES[slug];
      expect(e.h1.length).toBeGreaterThan(0);
      expect(e.byline).toContain("Bradley de Wet");
    }
  });

  it("competency H1s are the clean competency names matching DefinedTerm.name", () => {
    for (const slug of SLUGS.filter((s) => LEARN_PAGES[s].definedTerm)) {
      const e = LEARN_PAGES[slug];
      expect(e.h1).toBe(e.definedTerm.name);
      expect(e.breadcrumb.at(-1).name).toBe(e.h1);
    }
  });

  it("article H1s are the clean validated terms matching the last breadcrumb crumb", () => {
    for (const slug of PILLAR_ARTICLE_SLUGS) {
      const e = LEARN_PAGES[slug];
      expect(e.breadcrumb.at(-1).name).toBe(e.h1);
      // Hook language lives in the dek (title tag), not the H1.
      expect(e.title).not.toBe(e.h1);
    }
  });
});
