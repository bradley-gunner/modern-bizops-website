import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { stripComments, sourceFiles } from "../helpers/copy.js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import sitemap from "@/app/sitemap";
import { LEARN_INDEX, learnIndexMetadata } from "@/lib/learnIndex";
import {
  getOrganizationSchema,
  getServiceSchema,
  getPersonSchema,
} from "@/app/schema";

// Guards for the site chrome: the nav, the footer, the /learn index and the
// site-wide JSON-LD. Each one protects a failure this repo has already had.
//
// 1. A nav item pointing at a destination that does not exist. "Results" linked
//    /#results for weeks after the homepage section carrying that anchor was
//    deleted, and "Learn" was approved into the nav while /learn still 404d.
// 2. The desktop and mobile menus disagreeing. They were two hand-maintained
//    copies of the same list, so a change to one was a change to one.
// 3. A title measured in the source instead of in the rendered tag. The /learn
//    index is a CHILD segment, so app/layout.js adds 16 characters to it.
// 4. Structured data outliving the copy it describes. Organization, Service and
//    Person are emitted on every page and described a coaching business months
//    after the site stopped selling one.

const ROOT = process.cwd();

// THE fifteen-year claim, in every written form. "Over a decade" is the only
// approved number; the live LinkedIn headline still says fifteen and nothing
// new ever asserts it.
//
// This is ONE regex used against two surfaces on purpose. It started life
// guarding the JSON-LD only, and on 2026-08-12 that gap cost exactly what you
// would expect: `/revenue-operations-consulting` shipped a paragraph opening
// "Fifteen years of doing the work" while all three JSON-LD blocks correctly
// said "Over a decade". The sweep that was supposed to catch it ran
// `grep -rF 'fifteen years'` with no `-i`, and the offending string is
// sentence-initial, so it reported the site clean. A check that returns zero
// because of its own flags is worse than no check, because it stops the next
// person looking. Hence: case-insensitive, and pointed at the copy as well.
//
// Do NOT add a second copy of this pattern somewhere else. Widen the surfaces
// below instead.
const FIFTEEN_YEARS = /15\+?\s*years|fifteen years/i;

// Comments are not copy. Both `app/schema.js` and `lib/learn/registry.js` carry
// a comment naming the retired claim so the next reader knows why the string
// changed, and those comments must not read as violations.
//
// stripComments used to live here as two regex passes, and it had the same
// disease as the grep in the note above: it reported clean by eating its own
// input. Block comments were stripped first, so a line comment mentioning
// `components/learn/content/*.jsx` opened a block that swallowed the next 1300
// lines, and this guard read 4% of lib/learn/registry.js. It walks the source
// now, and it lives in __tests__/helpers/copy.js because the voice guard in
// __tests__/copy/voice-split.test.js stands on the same step.

// Every internal href the chrome and the /learn index put in front of a
// visitor. External URLs are excluded on purpose: there is no route file to
// check them against.
function internalHrefs(relative) {
  const src = readFileSync(join(ROOT, relative), "utf8");
  return [...src.matchAll(/href[=:]\s*"(\/[^"{}]*)"/g)].map((m) => m[1]);
}

const CHROME_FILES = [
  "components/Header.jsx",
  "components/Footer.jsx",
  "components/MobileCtaBar.jsx",
  "app/learn/page.js",
];

describe("every chrome link resolves to a route that exists", () => {
  const hrefs = [...new Set(CHROME_FILES.flatMap(internalHrefs))].sort();

  it("finds links to check", () => {
    expect(hrefs.length).toBeGreaterThan(10);
  });

  it.each(hrefs)("%s is served by a page in app/", (href) => {
    const relative =
      href === "/" ? "app/page.js" : `app${href}/page.js`;
    expect(
      existsSync(join(ROOT, relative)),
      `${href} is linked from the site chrome but no route serves it. ` +
        `Expected ${relative}.`,
    ).toBe(true);
  });

  it("keeps the dead /#results anchor out of every chrome file", () => {
    for (const relative of CHROME_FILES) {
      const src = readFileSync(join(ROOT, relative), "utf8");
      expect(
        /href[=:]\s*"[^"]*#results"/.test(src),
        `${relative} still links #results, which no section renders.`,
      ).toBe(false);
    }
  });
});

describe("the header", () => {
  // Services and Pricing were two nav items pointing at two near-identical
  // pages until 2026-09-01. They are one page and one item now, labelled
  // "Pricing" because that is the word a buyer scans a nav for, pointing at the
  // slug that can carry the category noun in search.
  const EXPECTED = [
    ["Pricing", "/ai-automation-services"],
    ["The Audit", "/ai-readiness-assessment"],
    ["Learn", "/learn"],
    ["About", "/about"],
    ["Get the Free Scan", "/scorecard"],
  ];

  function linksIn(nav) {
    return [...nav.querySelectorAll("a")].map((a) => [
      a.textContent.trim(),
      a.getAttribute("href"),
    ]);
  }

  it("carries the approved four items plus the Scan CTA on desktop", () => {
    const { container } = render(<Header />);
    const nav = container.querySelector('nav[aria-label="Main navigation"]');
    expect(linksIn(nav)).toEqual(EXPECTED);
  });

  it("carries the identical list in the mobile menu", () => {
    const { container } = render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    const nav = container.querySelector('nav[aria-label="Mobile navigation"]');
    expect(
      linksIn(nav),
      "The mobile menu no longer matches the desktop nav. Both render the " +
        "same NAV_LINKS array, so this failing means one of them stopped.",
    ).toEqual(EXPECTED);
  });
});

describe("the footer", () => {
  it("keeps the pages the nav no longer reaches out of orphan status", () => {
    const { container } = render(<Footer />);
    const hrefs = [...container.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    // Indexed pages with no nav link left. Dropping the last internal link to
    // a ranking page costs it crawl equity for nothing.
    for (const href of [
      "/predictable-revenue-engine",
      "/revenue-operations-consulting",
      "/watch",
      "/learn",
    ]) {
      expect(hrefs, `${href} has no link left anywhere in the chrome`).toContain(
        href,
      );
    }
  });

  it("keeps the client login and the founding clients hand-raise", () => {
    const { container } = render(<Footer />);
    const hrefs = [...container.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toContain("https://app.modernbizops.com");
    expect(hrefs).toContain("/founding-clients");
  });

  it("no longer runs the retired coaching-era tagline", () => {
    const src = readFileSync(join(ROOT, "components/Footer.jsx"), "utf8");
    expect(src).not.toContain("capital-efficient growth");
  });
});

describe("the /learn index metadata", () => {
  // This page does NOT opt out of the brand suffix, so the rendered tag is 16
  // characters longer than the string in the source.
  const SUFFIX = " | Modern BizOps";

  it("renders at or under 60 characters once the suffix lands", () => {
    expect(
      typeof learnIndexMetadata.title,
      "A bare string is deliberate here: it keeps the root title template. " +
        "If this becomes { absolute }, re-measure the rendered length.",
    ).toBe("string");
    expect((learnIndexMetadata.title + SUFFIX).length).toBeLessThanOrEqual(60);
  });

  it("has a meta description of 120 to 158 characters", () => {
    expect(learnIndexMetadata.description.length).toBeGreaterThanOrEqual(120);
    expect(learnIndexMetadata.description.length).toBeLessThanOrEqual(158);
  });

  it("canonicalizes to its own absolute URL", () => {
    expect(LEARN_INDEX.url).toBe(`https://modernbizops.com${LEARN_INDEX.path}`);
    expect(learnIndexMetadata.alternates.canonical).toBe(LEARN_INDEX.url);
    expect(learnIndexMetadata.openGraph.url).toBe(LEARN_INDEX.url);
  });

  it("carries no em dash and no contraction", () => {
    const src = readFileSync(join(ROOT, "lib/learnIndex.js"), "utf8");
    expect(/—/.test(src)).toBe(false);
    expect(/[’']\s?(?:t|re|ve|ll|d|m)\b/i.test(src)).toBe(false);
  });

  it("is in the sitemap, which is hand-maintained and easy to forget", () => {
    const entry = sitemap().find(
      (e) => e.url === "https://modernbizops.com/learn",
    );
    expect(entry, "/learn is missing from app/sitemap.js").toBeTruthy();
    expect(entry.priority).toBe(0.8);
  });
});

describe("the site-wide JSON-LD", () => {
  const blocks = {
    Organization: getOrganizationSchema(),
    Service: getServiceSchema(),
    Person: getPersonSchema(),
  };
  const names = Object.keys(blocks);

  it.each(names)("%s invents no rating, review or client count", (name) => {
    const json = JSON.stringify(blocks[name]);
    expect(json).not.toContain("aggregateRating");
    expect(json).not.toContain('"review"');
    // Modern BizOps has zero clients. A count in structured data is the
    // cheapest fabrication available and the easiest one to get caught at.
    expect(json).not.toMatch(/\d+\+?\s*(clients|companies|customers)/i);
  });

  it.each(names)("%s makes no fifteen-year claim", (name) => {
    const json = JSON.stringify(blocks[name]);
    expect(
      FIFTEEN_YEARS.test(json),
      `${name} asserts fifteen years. The only approved form is "over a decade".`,
    ).toBe(false);
  });

  it("describes an AI automation business rather than the retired coaching one", () => {
    for (const name of names) {
      const json = JSON.stringify(blocks[name]).toLowerCase();
      expect(json, `${name} still says "coaching"`).not.toContain("coaching");
    }
    expect(blocks.Service.serviceType).toBe("AI automation services");
    expect(blocks.Person.description).toContain("Over a decade");
  });
});

// The same guard, pointed at the words a visitor actually reads. The JSON-LD
// blocks above are three objects; this is every page and component that can put
// a sentence on screen, which is where the claim survived last time.
describe("the fifteen-year claim in rendered copy", () => {
  const files = [
    ...sourceFiles(join(ROOT, "app")),
    ...sourceFiles(join(ROOT, "components")),
    // lib/ is not chrome, but it holds copy: the /learn registry byline renders
    // on 24 pages, and lib/offers.js and lib/maturity/ hold visible strings.
    ...sourceFiles(join(ROOT, "lib")),
  ];

  it("finds source files to check", () => {
    // Without this, a broken path would make the assertion below pass over an
    // empty list, which is the same failure mode as the grep that missed it.
    expect(files.length).toBeGreaterThan(100);
  });

  it("appears in no page, component or copy module", () => {
    const violations = [];
    for (const file of files) {
      const src = stripComments(readFileSync(file, "utf8"));
      for (const [i, line] of src.split("\n").entries()) {
        if (FIFTEEN_YEARS.test(line)) {
          violations.push(
            `${file.replace(ROOT + "/", "")}:${i + 1}: ${line.trim()}`,
          );
        }
      }
    }
    expect(
      violations,
      `The approved number is "over a decade" and nothing new asserts ` +
        `fifteen. Rewrite the copy rather than loosening this test. ` +
        `Offenders:\n${violations.join("\n")}`,
    ).toEqual([]);
  });

  it("would catch the sentence-initial form a case-sensitive grep missed", () => {
    // The assertion above is only worth its runtime if it bites on the exact
    // string that got through, so prove it here rather than asking the next
    // reader to trust the regex by eye.
    for (const bad of [
      "Fifteen years of doing the work, in the seat, is what I bring.",
      "I have spent 15 years doing this work from the inside.",
      "15+ years in the executor seat",
      "FIFTEEN YEARS",
    ]) {
      expect(FIFTEEN_YEARS.test(bad), `${bad} should trip the guard`).toBe(true);
    }
    expect(
      FIFTEEN_YEARS.test("Over a decade building revenue engines."),
      "the approved form must not trip the guard",
    ).toBe(false);
  });

  it("reads comments as comments, so the history notes can stay", () => {
    const note = '  // It said "15 years in revenue operations" until 2026-08-11.';
    expect(FIFTEEN_YEARS.test(note)).toBe(true);
    expect(FIFTEEN_YEARS.test(stripComments(note))).toBe(false);
    // And a URL is not a comment.
    expect(stripComments('const u = "https://modernbizops.com/about";')).toBe(
      'const u = "https://modernbizops.com/about";',
    );
  });
});
