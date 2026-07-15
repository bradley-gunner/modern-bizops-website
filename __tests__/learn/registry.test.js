import { describe, it, expect } from "vitest";
import { LEARN_PAGES } from "@/lib/learn/registry";

const EM_DASH = /—/;
// Batch 1 (PR #33) plus batch 2 (all six Stage 1 competencies live).
const SLUGS = [
  "revenue-operations-maturity-stage-1-reactive",
  "crm-architecture-and-governance",
  "pipeline-stage-design",
  "ideal-customer-profile",
  "revenue-lifecycle-design",
  "data-quality-management",
  "lead-qualification-framework",
];
const BATCH_2_SLUGS = [
  "ideal-customer-profile",
  "revenue-lifecycle-design",
  "data-quality-management",
  "lead-qualification-framework",
];

describe("learn page registry", () => {
  it("has exactly the seven approved slugs as keys", () => {
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
      expect(e.lastUpdated).toBe(
        BATCH_2_SLUGS.includes(slug) ? "2026-07-14" : "2026-07-09"
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

  it("hub page's DefinedTermSet references all six live competency pages", () => {
    const hub = LEARN_PAGES["revenue-operations-maturity-stage-1-reactive"];
    expect(hub.definedTermSet.hasDefinedTerm.sort()).toEqual(
      [
        "https://modernbizops.com/learn/crm-architecture-and-governance",
        "https://modernbizops.com/learn/pipeline-stage-design",
        "https://modernbizops.com/learn/ideal-customer-profile",
        "https://modernbizops.com/learn/revenue-lifecycle-design",
        "https://modernbizops.com/learn/data-quality-management",
        "https://modernbizops.com/learn/lead-qualification-framework",
      ].sort()
    );
  });

  it("competency pages point inDefinedTermSet back at the live hub URL", () => {
    for (const slug of SLUGS.filter(
      (s) => s !== "revenue-operations-maturity-stage-1-reactive"
    )) {
      expect(LEARN_PAGES[slug].definedTerm.inDefinedTermSetUrl).toBe(
        "https://modernbizops.com/learn/revenue-operations-maturity-stage-1-reactive"
      );
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
    for (const slug of SLUGS.filter(
      (s) => s !== "revenue-operations-maturity-stage-1-reactive"
    )) {
      const e = LEARN_PAGES[slug];
      expect(e.h1).toBe(e.definedTerm.name);
      expect(e.breadcrumb.at(-1).name).toBe(e.h1);
    }
  });
});
