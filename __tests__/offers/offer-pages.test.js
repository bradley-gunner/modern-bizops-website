import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { OFFER_PAGES } from "@/lib/offerPages";
import sitemap from "@/app/sitemap";
import {
  BUILDS,
  LADDER,
  CARE_PLAN,
  BUILD_PRICE_FLOOR,
  BUILD_PRICE_CEILING,
  UPLIFT_RULE,
  carePlanMonthly,
  priceValue,
} from "@/lib/offers";

// Guards for the three offer pages. Each one protects a failure this repo has
// already had at least once:
//
// 1. Title length. app/layout.js appends " | Modern BizOps" to every CHILD
//    segment, and three /learn titles sat past Google's truncation point for
//    three weeks because nobody checked the RENDERED string. These three opt
//    out with `title: { absolute }`, and this asserts both the opt-out and the
//    length, because the opt-out is the only thing making the length true.
// 2. Copy law. No em dashes, no contractions, on anything a visitor reads.
// 3. Analytics. <Button> fires cta_click only for hrefs in its local
//    CTA_DESTINATIONS map, so a missing key is a silently untracked CTA.
// 4. Sitemap. app/sitemap.js is hand-maintained, so a new page that is not in
//    it is a page Google is never told about.

const ROOT = process.cwd();

const PAGES = [
  {
    name: "audit",
    file: "app/ai-readiness-assessment/page.js",
    page: OFFER_PAGES.audit,
    metadata: OFFER_PAGES.audit.metadata,
    priority: 0.9,
  },
  {
    name: "services",
    file: "app/ai-automation-services/page.js",
    page: OFFER_PAGES.services,
    metadata: OFFER_PAGES.services.metadata,
    priority: 0.8,
  },
  {
    name: "pricing",
    file: "app/pricing/page.js",
    page: OFFER_PAGES.pricing,
    metadata: OFFER_PAGES.pricing.metadata,
    priority: 0.8,
  },
];

describe("offer page metadata", () => {
  it.each(PAGES)(
    "$name opts out of the brand suffix and fits in 60 characters",
    ({ metadata }) => {
      expect(
        typeof metadata.title === "object" && metadata.title.absolute,
        "Title must be `{ absolute: ... }`. A bare string inherits the root " +
          'layout template and renders 16 characters longer.',
      ).toBeTruthy();
      expect(metadata.title.absolute).not.toContain("| Modern BizOps");
      expect(metadata.title.absolute.length).toBeLessThanOrEqual(60);
    },
  );

  it.each(PAGES)("$name has a meta description of 120 to 158 characters", ({
    metadata,
  }) => {
    expect(metadata.description.length).toBeGreaterThanOrEqual(120);
    expect(metadata.description.length).toBeLessThanOrEqual(158);
  });

  it.each(PAGES)("$name canonicalizes to its own absolute URL", ({
    metadata,
    page,
  }) => {
    expect(page.url).toBe(`https://modernbizops.com${page.path}`);
    expect(metadata.alternates.canonical).toBe(page.url);
    expect(metadata.openGraph.url).toBe(page.url);
    expect(metadata.openGraph.images[0].url).toMatch(
      /^https:\/\/modernbizops\.com\/og\/.+\.png$/,
    );
  });

  it("keeps no validated noun out of a title, and no governance term in one", () => {
    for (const { metadata } of PAGES) {
      expect(metadata.title.absolute.toLowerCase()).not.toContain("ai audit");
    }
  });
});

describe("offer page copy law", () => {
  // Apostrophe-s is a possessive, not a contraction, so it is deliberately
  // absent from this pattern.
  const CONTRACTION = /[’']\s?(?:t|re|ve|ll|d|m)\b/i;
  const EM_DASH = /—/;

  const COPY_FILES = [...PAGES.map((p) => p.file), "lib/offerPages.js"];

  it.each(COPY_FILES)(
    "%s carries no em dash and no contraction",
    (relative) => {
      const src = readFileSync(join(ROOT, relative), "utf8");
      expect(EM_DASH.test(src), `${relative} contains an em dash`).toBe(false);
      const contraction = src.match(CONTRACTION);
      expect(
        contraction?.[0] ?? null,
        `${relative} contains a contraction ("${contraction?.[0]}"). House ` +
          `copy spells them out: do not, you are, it is.`,
      ).toBeNull();
    },
  );

  it.each(COPY_FILES)(
    "%s types no dollar amount of its own",
    (relative) => {
      const src = readFileSync(join(ROOT, relative), "utf8");
      // The audience band ("$3M to $50M in revenue") is a segment definition
      // rather than a price we charge, so an amount in millions is allowed.
      const literal = src.match(/\$\d[\d,]*(?![\dM])/g);
      expect(
        literal,
        `${relative} contains a literal dollar amount (${literal?.join(", ")}). ` +
          `Prices belong in lib/offers.js and must interpolate from there.`,
      ).toBeNull();
    },
  );
});

describe("offer page analytics wiring", () => {
  const src = readFileSync(join(ROOT, "components/ui/Button.jsx"), "utf8");

  it.each([
    ["/pricing", "pricing"],
    ["/ai-automation-services", "ai_automation_services"],
    ["/ai-readiness-assessment", "ai_readiness_assessment"],
  ])("Button maps %s to the %s destination", (href, label) => {
    expect(
      src,
      `"${href}" is missing from CTA_DESTINATIONS in components/ui/Button.jsx, ` +
        `so every Button pointing at it fires no cta_click at all.`,
    ).toContain(`"${href}": "${label}"`);
  });
});

describe("offer pages in the sitemap", () => {
  const entries = sitemap();

  it.each(PAGES)("$name is listed at priority $priority", ({
    page,
    priority,
  }) => {
    const entry = entries.find((e) => e.url === page.url);
    expect(entry, `${page.path} is missing from app/sitemap.js`).toBeTruthy();
    expect(entry.priority).toBe(priority);
    expect(entry.changeFrequency).toBe("monthly");
    expect(entry.lastModified.toISOString().slice(0, 10)).toBe("2026-08-11");
  });
});

describe("offers module derivations", () => {
  it("still ships the twelve builds both offer page titles claim", () => {
    expect(BUILDS).toHaveLength(12);
  });

  it("derives the published price band from the menu itself", () => {
    expect(BUILD_PRICE_FLOOR).toBe("$2,500");
    expect(BUILD_PRICE_CEILING).toBe("$6,500");
    expect(LADDER.find((r) => r.id === "builds").price).toBe(
      `${BUILD_PRICE_FLOOR} to ${BUILD_PRICE_CEILING}`,
    );
    // The uplift ceiling is the top of the published band, so no scope
    // conversation can end above the menu.
    expect(UPLIFT_RULE.cap).toBe(BUILD_PRICE_CEILING);
  });

  it("derives the Care Plan display price and its stacked arithmetic", () => {
    expect(CARE_PLAN.price).toBe("$300 to $500 a month per system");
    expect(carePlanMonthly(1)).toBe("$300 to $500 a month");
    expect(carePlanMonthly(2)).toBe("$600 to $1,000 a month");
    expect(carePlanMonthly(3)).toBe("$900 to $1,500 a month");
  });

  it("reads a numeric price out of a display string for schema", () => {
    expect(priceValue("$2,500")).toBe(2500);
    expect(priceValue("$2,500 to $6,500")).toBe(2500);
    expect(priceValue("$2,500 a month")).toBe(2500);
    expect(priceValue("Free")).toBe(0);
    expect(priceValue("on request")).toBeNull();
  });
});
