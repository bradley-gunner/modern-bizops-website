import { describe, it, expect } from "vitest";
import { LEARN_PAGES, AUTHOR_CREDENTIAL } from "@/lib/learn/registry";
import { MOTIFS } from "@/components/learn/motifs";

// Publish order. The hero theme alternates strictly down this list, so a new
// page appended here has to continue the rotation rather than restart it.
const PUBLISH_ORDER = [
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
  "customer-retention-strategy",
  "reduce-customer-churn",
  "payment-recovery",
  "customer-lifecycle-marketing",
  "conversion-rate-optimization",
  "ai-automation-agency-cost",
  "ai-consultant-vs-in-house",
  "best-ai-automation-agencies-b2b",
  "what-is-an-ai-readiness-assessment",
  "ai-consultant-cost",
  "ai-automation-services-pricing",
  "ai-consultant-vs-ai-agency",
];

describe("learn visual system", () => {
  it("covers every registered page, with no page left out of the rotation", () => {
    // Copy before sorting: sort() mutates, and the rotation test below depends
    // on PUBLISH_ORDER still being in publish order.
    expect([...PUBLISH_ORDER].sort()).toEqual(Object.keys(LEARN_PAGES).sort());
  });

  it("gives every page a hero: kicker, a known motif, and a theme", () => {
    for (const slug of PUBLISH_ORDER) {
      const v = LEARN_PAGES[slug].visual;
      expect(v, `${slug} has no visual config`).toBeDefined();
      expect(v.kicker?.length, `${slug} kicker`).toBeGreaterThan(0);
      expect(MOTIFS[v.motif], `${slug} motif "${v.motif}" is not registered`).toBeDefined();
    }
  });

  it("alternates the hero theme navy/teal by publish order", () => {
    PUBLISH_ORDER.forEach((slug, i) => {
      const expected = i % 2 === 0 ? "navy" : "teal";
      expect(LEARN_PAGES[slug].visual.theme, `${slug} (position ${i + 1})`).toBe(expected);
    });
  });

  it("only ever accents a word the H1 actually contains", () => {
    // renderH1 falls back to a plain H1 on a miss, so a typo here would fail
    // silently in the browser rather than throwing.
    for (const slug of PUBLISH_ORDER) {
      const { h1, visual } = LEARN_PAGES[slug];
      if (!visual.accentWord) continue;
      expect(h1, `${slug} accentWord "${visual.accentWord}" not in H1 "${h1}"`).toContain(
        visual.accentWord
      );
    }
  });

  it("keeps the author credential inside the claims the approved byline makes", () => {
    // The card must never introduce a credential the byline does not carry.
    const byline = LEARN_PAGES["pipeline-stage-design"].byline;
    for (const clause of AUTHOR_CREDENTIAL.replace(/^Founder of/, "founder of").split(". ")) {
      expect(byline).toContain(clause.replace(/\.$/, ""));
    }
  });
});
