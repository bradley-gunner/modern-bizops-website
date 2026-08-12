import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { HOME_FAQ } from "@/lib/homeFaq";
import { getFAQSchema } from "@/app/schema";

// Two guards for the rebuilt homepage.
//
// 1. FAQPage JSON-LD must match the FAQs a visitor can actually see. Google is
//    explicit about it, and this site has already been bitten: getFAQSchema
//    kept emitting the coaching-era Q&As from the root layout onto pages that
//    never rendered them. The fix was one array feeding both surfaces, and this
//    test is what keeps it that way.
//
// 2. The copy law on the homepage surface: no em dashes, no contractions. Both
//    are house rules for anything a visitor reads, and neither is enforced
//    anywhere else outside the scorecard voice lint.

describe("homepage FAQ", () => {
  it("ships the seven objection preempts", () => {
    expect(HOME_FAQ).toHaveLength(7);
    for (const item of HOME_FAQ) {
      expect(item.q.length).toBeGreaterThan(0);
      expect(item.a.length).toBeGreaterThan(0);
    }
  });

  it("interpolates every price from lib/offers.js rather than typing one", () => {
    const priceAnswer = HOME_FAQ[0].a;
    for (const price of ["$2,500", "$6,500", "$8,000"]) {
      expect(priceAnswer).toContain(price);
    }
    const source = readFileSync(
      join(process.cwd(), "lib/homeFaq.js"),
      "utf8",
    );
    expect(
      /\$\d/.test(source),
      "lib/homeFaq.js contains a literal dollar amount. Prices belong in " +
        "lib/offers.js and must interpolate from LADDER.",
    ).toBe(false);
  });

  it("emits FAQPage structured data that matches the visible list", () => {
    const schema = getFAQSchema();
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(HOME_FAQ.length);
    schema.mainEntity.forEach((entity, i) => {
      expect(entity["@type"]).toBe("Question");
      expect(entity.name).toBe(HOME_FAQ[i].q);
      expect(entity.acceptedAnswer["@type"]).toBe("Answer");
      expect(entity.acceptedAnswer.text).toBe(HOME_FAQ[i].a);
    });
  });
});

describe("homepage copy law", () => {
  const root = process.cwd();
  const files = [
    "app/page.js",
    "lib/offers.js",
    "lib/homeFaq.js",
    ...readdirSync(join(root, "components/home")).map((f) =>
      join("components/home", f),
    ),
  ];

  // Apostrophe-s is a possessive ("Owner's Revenue Report"), not a contraction,
  // so it is deliberately absent from this list.
  const CONTRACTION = /[’']\s?(?:t|re|ve|ll|d|m)\b/i;
  const EM_DASH = /—/;

  it.each(files)("%s carries no em dash and no contraction", (relative) => {
    const src = readFileSync(join(root, relative), "utf8");
    expect(EM_DASH.test(src), `${relative} contains an em dash`).toBe(false);
    const contraction = src.match(CONTRACTION);
    expect(
      contraction?.[0] ?? null,
      `${relative} contains a contraction ("${contraction?.[0]}"). House ` +
        `copy spells them out: do not, you are, it is.`,
    ).toBeNull();
  });
});
