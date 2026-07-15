import { describe, it, expect } from "vitest";
import { LEARN_PAGES } from "@/lib/learn/registry";

const EM_DASH = /—/;
// Batch 1 (PR #33), batch 2 (all six Stage 1 competencies live), plus the
// Wave 1 pillar-map calibration batch (fractional-coo, net-revenue-retention,
// marketing-and-sales-alignment).
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
];
const BATCH_1_SLUGS = [
  "revenue-operations-maturity-stage-1-reactive",
  "crm-architecture-and-governance",
  "pipeline-stage-design",
];
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
// hierarchy, flatter Home > Learn > <page> breadcrumb.
const PILLAR_ARTICLE_SLUGS = ["fractional-coo", "marketing-and-sales-alignment"];

describe("learn page registry", () => {
  it("has exactly the ten approved slugs as keys", () => {
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
      expect(e.lastUpdated).toBe(
        BATCH_1_SLUGS.includes(slug) ? "2026-07-09" : "2026-07-14"
      );
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

  it("net-revenue-retention is a standalone DefinedTerm with no set reference", () => {
    const e = LEARN_PAGES["net-revenue-retention"];
    expect(e.pageType).toBe("competency");
    expect(e.definedTerm.name).toBe("Net Revenue Retention");
    // No Stage 3 hub exists yet, so there is no DefinedTermSet to join. The
    // reference gets added if/when a Stage 3 hub ships.
    expect(e.definedTerm.inDefinedTermSetUrl).toBeUndefined();
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
    for (const slug of [...PILLAR_ARTICLE_SLUGS, "net-revenue-retention"]) {
      const e = LEARN_PAGES[slug];
      expect(e.breadcrumb.length).toBe(3);
      expect(e.breadcrumb[1].name).toBe("Learn");
      // No /learn index route exists yet, so the crumb renders as plain text.
      expect(e.breadcrumb[1].noLink).toBe(true);
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
