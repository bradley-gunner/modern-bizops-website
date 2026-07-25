import { describe, it, expect } from "vitest";
import { LEARN_PAGES } from "@/lib/learn/registry";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getLearnPersonSchema,
  getDefinedTermSetSchema,
  getDefinedTermSchema,
  getArticleSchema,
} from "@/lib/learn/schema";

const hub = LEARN_PAGES["revenue-operations-maturity-stage-1-reactive"];
const crm = LEARN_PAGES["crm-architecture-and-governance"];
const nrr = LEARN_PAGES["net-revenue-retention"];
const coo = LEARN_PAGES["fractional-coo"];
const whatIsRevops = LEARN_PAGES["what-is-revops"];
const winLoss = LEARN_PAGES["win-loss-analysis"];
const cooCost = LEARN_PAGES["fractional-coo-cost"];
const aiForSmb = LEARN_PAGES["ai-for-small-business"];
const aiTools = LEARN_PAGES["ai-tools-for-small-business"];
const WAVE_4 = [
  "customer-retention-strategy",
  "reduce-customer-churn",
  "payment-recovery",
  "customer-lifecycle-marketing",
  "conversion-rate-optimization",
].map((s) => LEARN_PAGES[s]);

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

  it("DefinedTermSet lists all six live hasDefinedTerm URLs", () => {
    const ld = getDefinedTermSetSchema(hub);
    expect(ld["@type"]).toBe("DefinedTermSet");
    expect(ld.hasDefinedTerm.length).toBe(6);
  });

  it("DefinedTerm points inDefinedTermSet at the hub", () => {
    const ld = getDefinedTermSchema(crm);
    expect(ld["@type"]).toBe("DefinedTerm");
    expect(ld.inDefinedTermSet["@id"]).toBe(
      "https://modernbizops.com/learn/revenue-operations-maturity-stage-1-reactive"
    );
  });

  it("standalone DefinedTerm (no Stage 3 hub yet) omits inDefinedTermSet entirely", () => {
    const ld = getDefinedTermSchema(nrr);
    expect(ld["@type"]).toBe("DefinedTerm");
    expect(ld.name).toBe("Net Revenue Retention");
    expect("inDefinedTermSet" in ld).toBe(false);
  });

  it("Article schema carries headline, author, and the page's own URL", () => {
    const ld = getArticleSchema(coo);
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe(coo.title);
    expect(ld.url).toBe("https://modernbizops.com/learn/fractional-coo");
    expect(ld.dateModified).toBe(coo.lastUpdated);
    expect(ld.author["@type"]).toBe("Person");
    expect(ld.author.sameAs).toContain("https://linkedin.com/in/bradleydewet");
  });

  it("a new pillar-map article (what-is-revops) carries Article schema", () => {
    const ld = getArticleSchema(whatIsRevops);
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe(whatIsRevops.title);
    expect(ld.url).toBe("https://modernbizops.com/learn/what-is-revops");
    expect(ld.dateModified).toBe("2026-07-15");
  });

  it("the fractional-COO cost page carries Article schema and joins no DefinedTermSet", () => {
    // A comparison/pillar-map page, not a maturity competency: Article schema,
    // no DefinedTerm, and it must never appear in the Stage 1 hub's set.
    expect(cooCost.pageType).toBe("article");
    expect(cooCost.definedTerm).toBeUndefined();
    expect(hub.definedTermSet.hasDefinedTerm).not.toContain(cooCost.url);
    const ld = getArticleSchema(cooCost);
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe(cooCost.title);
    expect(ld.url).toBe("https://modernbizops.com/learn/fractional-coo-cost");
    expect(ld.dateModified).toBe("2026-07-22");
    expect(ld.author.sameAs).toContain("https://linkedin.com/in/bradleydewet");
  });

  it("the AI-cluster /learn pages carry Article schema and join no DefinedTermSet", () => {
    // Editorial how-to pages, not maturity competencies: Article schema, no
    // DefinedTerm, never in the Stage 1 hub's set.
    for (const e of [aiForSmb, aiTools]) {
      expect(e.pageType).toBe("article");
      expect(e.definedTerm).toBeUndefined();
      expect(hub.definedTermSet.hasDefinedTerm).not.toContain(e.url);
      const ld = getArticleSchema(e);
      expect(ld["@type"]).toBe("Article");
      expect(ld.headline).toBe(e.title);
      expect(ld.url).toBe(e.url);
      expect(ld.dateModified).toBe("2026-07-22");
      expect(ld.author.sameAs).toContain("https://linkedin.com/in/bradleydewet");
    }
  });

  it("the Wave 4 pages carry Article schema and join no DefinedTermSet", () => {
    // Retention, subscription-recovery, lifecycle, and conversion pages are
    // editorial /learn articles, not maturity competencies. In particular
    // conversion-rate-optimization is Article, never Service, and none appears
    // in the Stage 1 hub's DefinedTermSet.
    for (const e of WAVE_4) {
      expect(e.pageType).toBe("article");
      expect(e.definedTerm).toBeUndefined();
      expect(hub.definedTermSet.hasDefinedTerm).not.toContain(e.url);
      const ld = getArticleSchema(e);
      expect(ld["@type"]).toBe("Article");
      expect(ld.headline).toBe(e.title);
      expect(ld.url).toBe(e.url);
      expect(ld.dateModified).toBe("2026-07-23");
      expect(ld.author.sameAs).toContain("https://linkedin.com/in/bradleydewet");
    }
  });

  it("an AEO pillar page (win-loss-analysis) carries Article schema, not DefinedTerm", () => {
    // Reclassified from competency to article: it is a keyword pillar page, not
    // a glossary term in the maturity model, so it must not declare itself a
    // DefinedTerm to crawlers.
    expect(winLoss.pageType).toBe("article");
    expect(winLoss.definedTerm).toBeUndefined();
    const ld = getArticleSchema(winLoss);
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe(winLoss.title);
    expect(ld.url).toBe("https://modernbizops.com/learn/win-loss-analysis");
  });
});
