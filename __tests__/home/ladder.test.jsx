import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import TheLadder from "@/components/home/TheLadder";
import { LADDER } from "@/lib/offers";

// The homepage shows four cards for five rungs: AI Revenue Partner and AI
// Revenue Partner Plus are one decision at two sizes, so they share the last
// card. The merge is deliberate. What was not deliberate is what it did to the
// copy.
//
// Until 2026-08-12 that card rendered the Partner NAME and SUMMARY above the
// price string "$2,500 a month or $8,000 a month", while the services page
// sold $8,000
// as a separately named rung with its own summary. One product name, two
// prices, and a buyer who read both pages found a contradiction on the number
// that matters most. The heading made it worse by announcing "Four rungs"
// against the services page's "Five rungs".
//
// Two guards, one for each half of that.

const ROOT = process.cwd();

const NUMBER_WORD = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
};

describe("the homepage ladder", () => {
  it("keeps every price attached to the name that carries it", () => {
    const { container } = render(<TheLadder />);

    for (const item of LADDER) {
      expect(
        container.textContent,
        `${item.name} is missing from the homepage ladder.`,
      ).toContain(item.name);
      expect(container.textContent).toContain(item.price);
    }

    // The merged card is the one that can go wrong. Wherever the Partner Plus
    // price appears, the Partner Plus name has to appear with it.
    const plus = LADDER.find((r) => r.id === "partner-plus");
    const carriers = [...container.querySelectorAll("p")].filter((p) =>
      p.textContent.includes(plus.price),
    );
    expect(carriers.length).toBeGreaterThan(0);
    for (const node of carriers) {
      expect(
        node.textContent,
        `The homepage shows ${plus.price} in copy that does not name ` +
          `${plus.name}. On the services page that price belongs to its own ` +
          `rung, so a ` +
          `buyer reading both pages sees one name with two prices.`,
      ).toContain(plus.name);
    }
  });

  // Counts get typed as words, so lib/offers.js cannot enforce them the way it
  // enforces a price. This reads both surfaces instead: state a rung total on
  // either one and it has to be the real total. Comments are stripped first,
  // because the reason for the four-card layout is explained in one.
  it.each([
    "components/home/TheLadder.jsx",
    "app/ai-automation-services/page.js",
  ])(
    "%s states no rung count that disagrees with lib/offers.js",
    (relative) => {
      const copy = readFileSync(join(ROOT, relative), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      const stated = [
        ...copy.matchAll(/\b(one|two|three|four|five|six|seven) rungs?\b/gi),
      ].map((m) => m[1].toLowerCase());

      for (const count of stated) {
        expect(
          count,
          `${relative} says "${count} rungs" while lib/offers.js ships ` +
            `${LADDER.length}. Either the copy is stale or the ladder changed ` +
            `under it.`,
        ).toBe(NUMBER_WORD[LADDER.length]);
      }
    },
  );
});
