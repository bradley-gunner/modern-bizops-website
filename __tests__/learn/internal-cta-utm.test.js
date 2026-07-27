import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { LEARN_PAGES } from "@/lib/learn/registry";

// Regression guard for the internal-CTA UTM bug.
//
// History: the /learn hub launched (PR #33) with mid-page CTAs whose hrefs
// carried utm_source=website_modernbizops&utm_medium=internal&utm_campaign=
// evergreen_pseo. An internal link that carries UTM params starts a BRAND NEW
// GA4 session sourced to "website_modernbizops / internal", overwriting the real
// acquisition channel (google / organic, etc.) at the exact moment a visitor
// converts. That destroys attribution for the pilot. PR #36 stripped the params
// and moved tracking to the `cta_click` GA4 event (fired by <Button> via its
// ctaLocation). This test exists so a future page or shared component can never
// reintroduce the bug silently on the next content ship.
//
// The rule: no link whose destination is on THIS site (root-relative `/...` or
// modernbizops.com / www.modernbizops.com) may carry a utm_* query param.
// Inbound attribution is unaffected:
//   - lib/utm.js still CAPTURES inbound utm_* from the URL (paid/social/email).
//   - next.config.mjs still REDIRECTS /ig -> /?utm_source=instagram... (the
//     Instagram-bio inbound tag). That is external inbound attribution, not an
//     internal CTA, and lives outside app/ + components/ by design.
//   - External destinations (app.modernbizops.com, meetings.hubspot.com,
//     youtube.com, ...) may carry whatever tags their own systems expect.

const UTM_KEY = "utm_(?:source|medium|campaign|content|term)";

// A quoted string literal whose value is an internal destination (root-relative
// or modernbizops.com, but NOT app.modernbizops.com) followed by a utm_* query
// param. Requires a `?` or `&` so we only match real query strings.
const INTERNAL_UTM_HREF = new RegExp(
  "[\"'`]" +
    "(?:" +
    "\\/(?!\\/)[^\"'`\\s]*" + // root-relative: /scorecard, /playbook, /book...
    "|https?:\\/\\/(?:www\\.)?modernbizops\\.com[^\"'`\\s]*" + // the marketing host
    ")" +
    "[?&]" +
    UTM_KEY +
    "=",
);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walk(full));
    } else if (/\.(?:jsx?|tsx?)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe("internal CTA attribution guard", () => {
  it("no CTA in the /learn registry carries a utm_* param", () => {
    const serialized = JSON.stringify(LEARN_PAGES);
    const match = serialized.match(new RegExp(UTM_KEY + "="));
    expect(
      match,
      `The /learn registry contains a utm_* param ("${match?.[0]}"). Internal ` +
        `CTAs must be plain links (/scorecard, /playbook, /book) tracked via ` +
        `the cta_click GA4 event, never utm-tagged hrefs.`,
    ).toBeNull();
  });

  it("no internal href in app/ or components/ carries a utm_* param", () => {
    const root = process.cwd();
    const files = [
      ...walk(join(root, "app")),
      ...walk(join(root, "components")),
    ];
    const violations = [];
    for (const file of files) {
      const src = readFileSync(file, "utf8");
      const m = src.match(INTERNAL_UTM_HREF);
      if (m) violations.push(`${file.replace(root + "/", "")}: ${m[0]}`);
    }
    expect(
      violations,
      `Internal links must not carry utm_* params (they reset the GA4 ` +
        `session and misattribute conversions). Strip the query string and ` +
        `track the click via the cta_click event instead. Offenders:\n` +
        violations.join("\n"),
    ).toEqual([]);
  });
});
