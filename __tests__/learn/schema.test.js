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
});
