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

  it("a new standalone term (win-loss-analysis) omits inDefinedTermSet", () => {
    const ld = getDefinedTermSchema(winLoss);
    expect(ld["@type"]).toBe("DefinedTerm");
    expect(ld.name).toBe("Win/Loss Analysis");
    expect("inDefinedTermSet" in ld).toBe(false);
  });
});
