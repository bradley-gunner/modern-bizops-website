import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { OFFER_PAGES } from "@/lib/offerPages";
import { LEARN_INDEX } from "@/lib/learnIndex";
import sitemap from "@/app/sitemap";
import {
  BUILDS,
  HOMEPAGE_BUILDS,
  HOMEPAGE_BUILD_IDS,
  CLEANUP_SERVICES,
  CLEANUP_PRICE_FLOOR,
  CLEANUP_PRICE_CEILING,
  LADDER,
  CARE_PLAN,
  TRAINING,
  VERTICALS,
  FOUNDING_TERMS,
  BUILD_PRICE_FLOOR,
  BUILD_PRICE_CEILING,
  UPLIFT_RULE,
  PARTNER_SYSTEM_LIMIT,
  carePlanMonthly,
  priceValue,
  offerPriceFields,
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
    // Bumped when the page gained its link to the readiness-assessment
    // explainer (/learn/what-is-an-ai-readiness-assessment) on 2026-09-01.
    lastModified: "2026-09-01",
  },
  {
    name: "services",
    file: "app/ai-automation-services/page.js",
    page: OFFER_PAGES.services,
    metadata: OFFER_PAGES.services.metadata,
    priority: 0.8,
    // Bumped when /pricing merged into this page on 2026-09-01.
    lastModified: "2026-09-01",
  },
  {
    name: "founding clients",
    file: "app/founding-clients/page.js",
    page: OFFER_PAGES.founding,
    metadata: OFFER_PAGES.founding.metadata,
    priority: 0.7,
    lastModified: "2026-08-11",
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

  // These five paths were written into lib/offerPages.js and lib/learnIndex.js
  // as a contract for a later task, and that task shipped without them: no card
  // existed in scripts/generate-og.mjs, so nothing would ever have produced the
  // files. Every share of all five pages, including the Pricing page, rendered
  // with no card at all. A URL that matches the right shape is not a file, so
  // this checks the file.
  it.each([
    ...PAGES.map((p) => [p.name, p.metadata.openGraph.images[0].url]),
    ["learn index", LEARN_INDEX.ogImage],
  ])("%s points its og:image at a PNG that exists on disk", (name, url) => {
    const file = join(ROOT, "public", new URL(url).pathname);
    expect(
      existsSync(file),
      `${name} declares ${url}, and ${file} is not there. Add a CARDS entry ` +
        `in scripts/generate-og.mjs, run it, and commit the PNG.`,
    ).toBe(true);
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

  // "/pricing" left this list on 2026-09-01 when the page merged into
  // /ai-automation-services. A Button pointing at a 301 would report a
  // destination the visitor never lands on.
  it.each([
    ["/ai-automation-services", "ai_automation_services"],
    ["/ai-readiness-assessment", "ai_readiness_assessment"],
    ["/founding-clients", "founding_clients"],
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

  // lastModified is per page rather than one shared date. It was hardcoded to
  // "2026-08-11" for all of them, which meant the correct act of bumping one
  // page's date failed the build.
  it.each(PAGES)("$name is listed at priority $priority", ({
    page,
    priority,
    lastModified,
  }) => {
    const entry = entries.find((e) => e.url === page.url);
    expect(entry, `${page.path} is missing from app/sitemap.js`).toBeTruthy();
    expect(entry.priority).toBe(priority);
    expect(entry.changeFrequency).toBe("monthly");
    expect(entry.lastModified.toISOString().slice(0, 10)).toBe(lastModified);
  });
});

describe("the founding clients page", () => {
  const src = readFileSync(join(ROOT, "app/founding-clients/page.js"), "utf8");

  // The single most expensive mistake available on this page. The offer is NOT
  // a discounted audit: the audit stays at its published price with the
  // standard credit, and the incentive lands on the first build. Signed by
  // Bradley 2026-08-11, so a change here is a repricing rather than an edit.
  it("keeps the founding audit price identical to the published audit price", () => {
    expect(FOUNDING_TERMS.auditPrice).toBe(
      LADDER.find((r) => r.id === "audit").price,
    );
  });

  it("puts the incentive on the build rather than on the audit", () => {
    expect(FOUNDING_TERMS.buildDiscount).toMatch(/first build/);
    expect(FOUNDING_TERMS.carePlanIncluded).toMatch(/Care Plan/);
  });

  it("renders the terms and the industries from lib/offers.js", () => {
    expect(src).toContain("FOUNDING_TERMS");
    expect(src).toContain("VERTICALS");
    expect(VERTICALS).toHaveLength(6);
  });

  it("carries one CTA destination, and it is the call", () => {
    expect(src).toContain('href="/book"');
    expect(
      src.includes("/scorecard"),
      "The founding clients page takes one CTA: book the call.",
    ).toBe(false);
  });

  // Modern BizOps has zero clients. This page exists to say so, so a phrase
  // that implies otherwise is a regression rather than a copy tweak.
  it("implies no client, testimonial or track record", () => {
    // Comments are stripped first: the file explains the rule in prose that
    // would otherwise trip it. The negative forms are the whole point of the
    // visible copy ("no testimonials"), so a preceding "no" is what separates
    // the honest line from the claim.
    const copy = src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    const FABRICATION =
      /(?<!\bno\s)(?:trusted by|our clients|client results|testimonial|success stor)/i;
    const hit = copy.match(FABRICATION);
    expect(
      hit?.[0] ?? null,
      `app/founding-clients/page.js implies a client ("${hit?.[0]}"). This ` +
        `company has none, and the page exists to say that out loud.`,
    ).toBeNull();
  });
});

describe("offers module derivations", () => {
  // Doc 10 v5 (2026-08-27) moved CRM Cleanup and Architecture off the builds
  // menu and onto the cleanup menu as C1, taking builds from 12 to 11. The site
  // still said "twelve" in four places until 2026-09-01, so both counts are
  // asserted here and the copy that states them is checked below.
  it("ships the eleven builds and the six cleanup services", () => {
    expect(BUILDS).toHaveLength(11);
    expect(CLEANUP_SERVICES).toHaveLength(6);
    expect(BUILDS.map((b) => b.id)).not.toContain("crm-cleanup");
    expect(CLEANUP_SERVICES.map((c) => c.id)).toContain("crm-cleanup");
  });

  it("resolves every homepage build id and spans the published band", () => {
    expect(HOMEPAGE_BUILDS).toHaveLength(HOMEPAGE_BUILD_IDS.length);
    expect(HOMEPAGE_BUILDS.every(Boolean)).toBe(true);
    const prices = HOMEPAGE_BUILDS.map((b) => priceValue(b.price));
    expect(Math.min(...prices)).toBe(priceValue(BUILD_PRICE_FLOOR));
    expect(Math.max(...prices)).toBe(priceValue(BUILD_PRICE_CEILING));
  });

  it("derives the cleanup band, which sits below the builds band", () => {
    expect(CLEANUP_PRICE_FLOOR).toBe("$1,500");
    expect(CLEANUP_PRICE_CEILING).toBe("$3,000");
    // Doc 26 D2: the foundation being the cheaper half is the point, not an
    // accident of pricing. If this ever inverts, the distribution argument the
    // company is built on stops being true on its own price list.
    expect(priceValue(CLEANUP_PRICE_CEILING)).toBeLessThan(
      priceValue(BUILD_PRICE_CEILING),
    );
  });

  // A count typed as a word cannot be derived from the menu, so it is read back
  // out of the copy instead. This is the check that would have caught "twelve
  // builds", which sat on the homepage and the services page for five days
  // after doc 10 v5 took the menu to eleven.
  it("states no build or cleanup count the menus disagree with", () => {
    const WORDS = {
      six: 6,
      seven: 7,
      ten: 10,
      eleven: 11,
      twelve: 12,
      thirteen: 13,
    };
    const surfaces = [
      "app/ai-automation-services/page.js",
      "components/home/BuildsPreview.jsx",
      "components/home/OperationsDebt.jsx",
    ];
    let checked = 0;
    for (const relative of surfaces) {
      const copy = readFileSync(join(ROOT, relative), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      for (const [word, value] of Object.entries(WORDS)) {
        for (const [pattern, actual] of [
          [new RegExp(`\\b${word}\\s+(?:of the\\s+)?builds?\\b`, "i"), BUILDS.length],
          [
            new RegExp(`\\b${word}\\s+cleanup\\b`, "i"),
            CLEANUP_SERVICES.length,
          ],
        ]) {
          if (!pattern.test(copy)) continue;
          checked += 1;
          expect(
            value,
            `${relative} says "${word}" of something the menu ships ` +
              `${actual} of.`,
          ).toBe(actual);
        }
      }
    }
    // Without this the loop above passes on copy that states no count at all,
    // including copy that lost its counts to a bad edit.
    expect(checked).toBeGreaterThanOrEqual(3);
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

  // The Services page states the Care Plan / retainer choice as a trade:
  // the retainer costs MORE and buys more. That copy is only honest while the
  // arithmetic runs this direction. If a rate ever changes so the retainer
  // becomes the cheaper line, this is what will say so before the page lies.
  it("keeps the Care Plan the cheaper line at every row of the stacking table", () => {
    const retainer = priceValue(
      LADDER.find((r) => r.id === "partner").price,
    );
    for (let systems = 1; systems <= PARTNER_SYSTEM_LIMIT; systems += 1) {
      expect(
        CARE_PLAN.perSystem.high * systems,
        `At ${systems} system(s) the Care Plan is no longer cheaper than the ` +
          `retainer. The Services page copy says the retainer costs more and ` +
          `buys more; rewrite it before changing this test.`,
      ).toBeLessThan(retainer);
    }
  });
});

describe("schema.org price shapes", () => {
  // A bare `price` asserts a single one-time amount. Two of the published
  // prices are bands and three recur, and a crawler will surface whatever is
  // in `price` as the cost. Published prices being right is this business's
  // differentiation, so the shape has to match the string a buyer reads.
  const audit = LADDER.find((r) => r.id === "audit");
  const builds = LADDER.find((r) => r.id === "builds");
  const partner = LADDER.find((r) => r.id === "partner");

  it("keeps a flat price only for a single one-time amount", () => {
    expect(offerPriceFields(audit.price)).toEqual({
      price: 2500,
      priceCurrency: "USD",
    });
    expect(offerPriceFields(TRAINING.price)).toEqual({
      price: 5500,
      priceCurrency: "USD",
    });
    expect(offerPriceFields("Free")).toEqual({
      price: 0,
      priceCurrency: "USD",
    });
  });

  it("describes a band with minPrice and maxPrice, never its floor alone", () => {
    const fields = offerPriceFields(builds.price);
    expect(fields.price).toBeUndefined();
    expect(fields.priceSpecification).toMatchObject({
      "@type": "PriceSpecification",
      priceCurrency: "USD",
      minPrice: 2500,
      maxPrice: 6500,
    });
  });

  it("marks a retainer as monthly rather than as a one-time charge", () => {
    const fields = offerPriceFields(partner.price);
    expect(fields.price).toBeUndefined();
    expect(fields.priceSpecification).toMatchObject({
      "@type": "UnitPriceSpecification",
      price: 2500,
      priceCurrency: "USD",
      unitText: "MONTH",
    });
  });

  it("marks the Care Plan as a monthly band charged per system", () => {
    const fields = offerPriceFields(CARE_PLAN.price);
    expect(fields.price).toBeUndefined();
    expect(fields.priceSpecification).toMatchObject({
      "@type": "UnitPriceSpecification",
      minPrice: 300,
      maxPrice: 500,
      unitText: "MONTH",
      referenceQuantity: { value: 1, unitText: "system" },
    });
  });

  it("emits no price fields at all when there is no amount to read", () => {
    expect(offerPriceFields("on request")).toEqual({});
  });
});

describe("closing CTA band", () => {
  // The closing CtaCallout used to sit in a <Section> with py-0 md:py-0 to
  // cancel Section's own py-16 md:py-20. Two padding utilities for the same
  // property in one class string leave the winner to Tailwind's generated
  // stylesheet order rather than to source order, so the worst case was
  // doubled padding that nobody had looked at. These three pages now use a
  // plain band instead, and so does the founding clients page, which copied
  // the pattern from them before it was fixed.
  const OWNED = [
    "app/ai-readiness-assessment/page.js",
    "app/ai-automation-services/page.js",
    "app/founding-clients/page.js",
    // Not an offer page, but it closes with the same CtaCallout band and was
    // written by copying the shape from these, so it inherits the same trap.
    "app/learn/page.js",
  ];

  it.each(OWNED)("%s cancels no Section padding with py-0", (relative) => {
    const src = readFileSync(join(ROOT, relative), "utf8");
    expect(
      /<Section[^>]*py-0/.test(src),
      `${relative} passes py-0 to <Section>, which collides with Section's ` +
        `own py-16 md:py-20. Use a plain band div around CtaCallout instead.`,
    ).toBe(false);
  });
});
