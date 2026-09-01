import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stripComments } from "../helpers/copy.js";

// THE AMBER THROUGHLINE, held in code because the CONSTRAINT is the design.
//
// Board item web-personality-design, from David Ellis's Tugboat audit (slides
// 11 and 22, his joint highest-rated finding): the site was indistinguishable
// from a template, and his examples of a throughline were Twilio red and Miro
// yellow. The 2026-09-01 decision was AREA, NOT HUE. Amber was already the logo
// colour and already the accent; it had never owned a field.
//
// What makes it a throughline rather than one loud band is the rule that there
// is EXACTLY ONE per primary page, at that page's turn. A band on every second
// section is wallpaper. That rule is invisible in any single diff, which is why
// it is asserted here: the failure mode is a later session adding a second band
// to a page because the first one looked good.
const ROOT = process.cwd();

const PRIMARY_PAGES = [
  ["app/page.js", ["components/home/OperationsDebt.jsx"]],
  ["app/ai-automation-services/page.js", []],
  ["app/ai-readiness-assessment/page.js", []],
];

function bandUses(relative) {
  const src = stripComments(readFileSync(join(ROOT, relative), "utf8"));
  return (src.match(/<AmberBand[\s>]/g) ?? []).length;
}

describe("the amber throughline", () => {
  it.each(PRIMARY_PAGES)(
    "%s renders exactly one band",
    (page, componentFiles) => {
      const total = [page, ...componentFiles].reduce(
        (n, f) => n + bandUses(f),
        0
      );
      expect(
        total,
        `${page} renders ${total} amber bands. The rule is exactly one per ` +
          `primary page, at the page's turn, and it is the only thing keeping ` +
          `the colour a throughline rather than wallpaper. If this page really ` +
          `needs its band moved, move it; do not add a second.`
      ).toBe(1);
    }
  );

  it("keeps the band out of the secondary pages", () => {
    // Not a style preference. /about and /founding-clients are the two pages a
    // reader reaches AFTER the pitch, and a band there would be the fourth and
    // fifth, which is the point at which the treatment stops being a signal.
    for (const page of ["app/about/page.js", "app/founding-clients/page.js"]) {
      expect(bandUses(page), `${page} should carry no amber band`).toBe(0);
    }
  });

  it("sets nothing on the band in navy", () => {
    // Cream on #B5520A is 4.51:1 and clears WCAG AA for body text. Navy on it
    // is 3.28:1 and does not. The component has no navy today; this fails if
    // someone adds one.
    const src = readFileSync(join(ROOT, "components/ui/AmberBand.jsx"), "utf8");
    const markup = stripComments(src);
    expect(markup).not.toMatch(/text-navy/);
    expect(markup).toMatch(/text-cream/);
  });

  it("keeps one video player, and puts it on more than the homepage", () => {
    // The other half of the done_when: video leads the homepage and appears on
    // the primary pages. The homepage used to render this player mid-page; it
    // moved to the hero, so a second use on that page means the old block came
    // back rather than a new surface being added.
    const homepage = bandUsesPlayer("components/home/Hero.jsx");
    const mechanism = bandUsesPlayer("components/home/Mechanism.jsx");
    const audit = bandUsesPlayer("app/ai-readiness-assessment/page.js");
    expect(homepage, "the hero should render the player once").toBe(1);
    expect(mechanism, "the mid-page player moved to the hero").toBe(0);
    expect(audit, "the audit page should render the player once").toBe(1);
  });
});

function bandUsesPlayer(relative) {
  const src = stripComments(readFileSync(join(ROOT, relative), "utf8"));
  return (src.match(/<VSSLPlayer[\s>]/g) ?? []).length;
}
