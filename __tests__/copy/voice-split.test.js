import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, relative as relativeTo } from "node:path";
import { stripComments, sourceFiles } from "../helpers/copy.js";
import { BYLINE } from "@/lib/learn/registry";

// The pronoun split, held in code so a sweep cannot undo it by accident.
//
// Bradley set the brand voice on 2026-08-12 and narrowed it the same day, and
// the site got it wrong once in each direction before it settled. Three commits
// in one afternoon (73e281e, 4ab046a, d45b1e6) moved pronouns on 26 pages, so
// the next person to run a voice pass over this repo is working from knowledge
// that lives in a commit message and in a skill file outside the repo. This is
// the copy of it that runs.
//
// The rule has two halves:
//
//   1. BRAND SURFACES speak as "we", and name Bradley in the third person
//      ("our founder", "Bradley"). The homepage, the offer pages, the /learn
//      index, the nav, the footer and the Scan.
//   2. AUTHORED CONTENT speaks as "I", because a named human wrote it. His
//      words: "If the page is set to be authored by a specific person such as
//      myself then first person language still makes sense to use in that
//      instance. It would be like a blog post and the author of the blog post
//      talking in first person." The 24 /learn article bodies and the registry
//      strings that render under the byline.
//
//      THE ABOUT PAGE IS DISPUTED AND DELIBERATELY UNGUARDED. This comment
//      listed it under half 2 until 2026-09-01. On 2026-08-26 Bradley ruled the
//      other way ("the About page should be 'our founder has worked with ...'")
//      and the brand-voice skill moved it to half 1 the same day, but the page
//      itself was never converted and still reads in the first person. Neither
//      half guards it right now, on purpose: guarding it under half 1 would
//      fail the build on live copy, and guarding it under half 2 would freeze
//      copy a later ruling retired. Board item web-newness-risk owns the
//      conversion; delete this note when the page lands on one side.
//
// Reader-voice "I" is untouched by both halves. A competency question, a Scan
// answer option and a FAQ question phrased as the visitor speaking are the
// reader talking about their own business, so they stay first person singular
// wherever they appear. Handling that is most of the work below.

const ROOT = process.cwd();

// Two patterns because the casing rules differ, matching
// scripts/lint-scorecard-voice.mjs. "I" is case-sensitive so a loop index does
// not trip it, and "AI" has no word boundary before its I. The possessives are
// case-insensitive because they open sentences, and the trailing (?!-) keeps
// Tailwind margin utilities (my-9, me-4) out of the match.
const FIRST_PERSON_I = /\bI\b/;
const FIRST_PERSON_OTHER = /\b(my|me|mine|myself)\b(?!-)/i;

// Reader voice, recognised by the key it hangs off rather than by its words.
// Both forms are single-line values in this repo:
//
//   q: "How do I avoid getting locked in?"          a FAQ question
//   { value: 'A', label: 'Honestly, I do not ...'   a Scan answer option
//
// Recognising the key rather than the string is what keeps the rest of each
// file covered. scripts/lint-scorecard-voice.mjs skips lib/scorecard/questions.js
// whole for the same reason this exempts two line shapes, and every marketer
// authored prompt in that file is inside the guard here as a result.
// The exemption reads a KEY at the start of the line, never a quoted string,
// so prose in the same file stays covered. `label:` joined `value:` on
// 2026-08-14 when the Scan rebuild moved diagnostic options to
// `{ label: '...' }` lines; both are option keys, and the respondent-voice
// answers ("Me, on top of everything else.") live on them.
const READER_VOICE_LINE = /^\s*(q:|\{\s*(value|label):)/;

function firstPersonViolations(src) {
  const hits = [];
  stripComments(src)
    .split("\n")
    .forEach((line, i) => {
      if (READER_VOICE_LINE.test(line)) return;
      if (FIRST_PERSON_I.test(line) || FIRST_PERSON_OTHER.test(line)) {
        hits.push(`${i + 1}: ${line.trim()}`);
      }
    });
  return hits;
}

function readSource(relative) {
  return readFileSync(join(ROOT, relative), "utf8");
}

function rel(absolute) {
  return relativeTo(ROOT, absolute);
}

// ---------------------------------------------------------------------------
// Half 1: brand surfaces speak as "we"
// ---------------------------------------------------------------------------

// Bradley's own enumeration, plus the copy modules those pages render their
// prose from. lib/offers.js and lib/offerPages.js hold the sentences the three
// offer pages display, so guarding the page files alone would guard the layout
// and miss the words.
const BRAND_SURFACES = [
  ...sourceFiles(join(ROOT, "components/home")).map(rel),
  // app/pricing/page.js left this list on 2026-09-01 when it merged into
  // app/ai-automation-services/page.js, which is still guarded below.
  "app/ai-readiness-assessment/page.js",
  "app/ai-automation-services/page.js",
  "app/founding-clients/page.js",
  "app/learn/page.js",
  "lib/learnIndex.js",
  "lib/offerPages.js",
  "lib/offers.js",
  "components/Header.jsx",
  "components/Footer.jsx",
  ...sourceFiles(join(ROOT, "app/scorecard")).map(rel),
  // lib/scorecard/voice.js is excluded for the same reason the shell lint
  // excludes it: the file IS the sanitizer, so it carries the banned pronouns
  // inside its own regex and its own error strings. A module-load throw from
  // sanitizeVoice is the runtime test for that file.
  ...sourceFiles(join(ROOT, "lib/scorecard"))
    .map(rel)
    .filter((f) => f !== "lib/scorecard/voice.js"),
];

describe("brand surfaces speak as we", () => {
  it("finds the surfaces to check", () => {
    // Without this, a renamed directory would leave the assertions below
    // iterating an empty list and reporting the site clean.
    expect(BRAND_SURFACES.length).toBeGreaterThan(25);
    expect(BRAND_SURFACES).toContain("components/home/Hero.jsx");
    expect(BRAND_SURFACES).toContain("lib/scorecard/questions.js");
  });

  it.each(BRAND_SURFACES)("%s carries no first-person singular", (file) => {
    const hits = firstPersonViolations(readSource(file));
    expect(
      hits,
      `${file} speaks in the first person singular. Brand surfaces say "we" ` +
        `and name Bradley in the third person ("our founder", "Bradley"), a ` +
        `rule Bradley set on 2026-08-12. If the line below is the VISITOR ` +
        `speaking (a FAQ question, a Scan answer option), move it onto a q: ` +
        `or { value: line rather than loosening this test.\n${hits.join("\n")}`,
    ).toEqual([]);
  });

  it("keeps the reader-voice exemption load-bearing and narrow", () => {
    // Load-bearing: brand surfaces really do carry reader-voice first person
    // today, so an exemption that stopped matching would start failing the
    // build on copy that is correct.
    const exempted = [
      // The merged services and pricing page carries the money FAQ, whose
      // questions are the visitor speaking ("How do I avoid getting locked
      // in?"). It replaced app/pricing/page.js here on 2026-09-01 and carries
      // the same reader-voice lines.
      "app/ai-automation-services/page.js",
      "app/founding-clients/page.js",
      "lib/scorecard/questions.js",
    ].flatMap((file) =>
      stripComments(readSource(file))
        .split("\n")
        .filter(
          (line) =>
            READER_VOICE_LINE.test(line) &&
            (FIRST_PERSON_I.test(line) || FIRST_PERSON_OTHER.test(line)),
        ),
    );
    expect(exempted.length).toBeGreaterThanOrEqual(6);

    // Narrow: the exemption reads a key, so prose in the same file stays
    // covered no matter what it says.
    expect(READER_VOICE_LINE.test('  q: "How do I avoid getting locked in?",')).toBe(true);
    expect(READER_VOICE_LINE.test("  { value: 'A', label: 'I do not track this' },")).toBe(true);
    expect(READER_VOICE_LINE.test("  { label: 'Me, on top of everything else.' },")).toBe(true);
    expect(READER_VOICE_LINE.test('  a: "I coach one of your own people.",')).toBe(false);
    expect(READER_VOICE_LINE.test("        My audit engine connects to your CRM.")).toBe(false);
    // A bare quoted string is NOT exempt, so respondent copy has to sit on an
    // option key to earn the exemption.
    expect(READER_VOICE_LINE.test("        'Me, on top of everything else.',")).toBe(false);
  });

  it("bites on the brand-voice regression, in the forms it actually took", () => {
    // Every line here is a real string this repo shipped before 73e281e swept
    // it, or the shape one of them took. If the checker stops reporting these,
    // the guard has gone quiet rather than the site having got cleaner.
    for (const bad of [
      "        I see this constantly. A founder buys an AI tool.",
      "        My audit engine is software I had built.",
      "      <p>Here is the sentence I want you to keep.</p>",
      "        a dependency on me.",
      "        I am not going to pretend that is simple.",
    ]) {
      expect(
        firstPersonViolations(bad),
        `${bad} should trip the brand-voice guard`,
      ).toHaveLength(1);
    }
    // The approved constructions must pass, or the guard would push copy the
    // wrong way.
    for (const good of [
      "        We see this constantly. A founder buys an AI tool.",
      "        Our audit engine is software our founder had built.",
      "        Bradley has held the job twice.",
      '        <p className="my-4 me-2">A margin utility is not a pronoun.</p>',
      "        AI drafts the posts. Our founder approves them.",
    ]) {
      expect(firstPersonViolations(good), `${good} must not trip`).toEqual([]);
    }
  });
});

// ---------------------------------------------------------------------------
// Half 2: authored content speaks as "I"
// ---------------------------------------------------------------------------

// The files a named human speaks in. The sixteen bodies are exactly the ones
// d45b1e6 restored, which is the record of where his own voice lives; the two
// others are his story and the strings that render under his byline.
const AUTHORED_SPEAKS_AS_I = [
  "components/learn/content/AiForSmallBusinessBody.jsx",
  "components/learn/content/AiToolsForSmallBusinessBody.jsx",
  "components/learn/content/ConversionRateOptimizationBody.jsx",
  "components/learn/content/CustomerLifecycleMarketingBody.jsx",
  "components/learn/content/CustomerRetentionStrategyBody.jsx",
  "components/learn/content/FractionalCooBody.jsx",
  "components/learn/content/FractionalCooCostBody.jsx",
  "components/learn/content/InvoluntaryChurnBody.jsx",
  "components/learn/content/MqlToSqlConversionRateBody.jsx",
  "components/learn/content/NetRevenueRetentionBody.jsx",
  "components/learn/content/PaymentRecoveryBody.jsx",
  "components/learn/content/ReduceCustomerChurnBody.jsx",
  "components/learn/content/RevenuePerEmployeeBody.jsx",
  "components/learn/content/Stage1ReactiveHubBody.jsx",
  "components/learn/content/WhatIsRevOpsBody.jsx",
  "components/learn/content/WinLossAnalysisBody.jsx",
  "app/about/page.js",
  "lib/learn/registry.js",
];

// Authored pages carrying none of the author's own first person today,
// recorded so the list above means something. None of these eight appears in
// d45b1e6, so none had a personal aside taken away. Five of them do contain
// "I", and in all five it is a founder being quoted (&ldquo;I can usually tell
// if someone is a fit&rdquo;), which is reader voice wearing quotation marks.
// They are still his articles and may gain an aside at any time.
const AUTHORED_SILENT_SO_FAR = [
  "components/learn/content/CrmArchitectureGovernanceBody.jsx",
  "components/learn/content/DataQualityManagementBody.jsx",
  "components/learn/content/IdealCustomerProfileBody.jsx",
  "components/learn/content/LeadQualificationFrameworkBody.jsx",
  "components/learn/content/MarketingAndSalesAlignmentBody.jsx",
  "components/learn/content/PipelineStageDesignBody.jsx",
  "components/learn/content/RevenueLifecycleDesignBody.jsx",
  "components/learn/content/SmarketingBody.jsx",
  // The step-15 AEO batch (2026-08-26) is deliberately company-voice, not
  // silent-authored: the approved drafts speak as "we" throughout (the
  // listicle ranks Modern BizOps as "us", the cost guide publishes "our"
  // prices), matching the root-level BOFU precedent in AiConsultingBody
  // ("We work differently"). They sit in this list because the accounting
  // above needs every body in exactly one list, and what they must never
  // gain is the author's singular "I", which is what the other list guards.
  "components/learn/content/AiAutomationAgencyCostBody.jsx",
  "components/learn/content/AiConsultantVsInHouseBody.jsx",
  "components/learn/content/BestAiAutomationAgenciesBody.jsx",
  // AEO batch 2 (2026-09-01), the pricing cluster, is company-voice for the
  // same reason: the drafts publish "our" prices and say "we sell it".
  "components/learn/content/WhatIsAnAiReadinessAssessmentBody.jsx",
  "components/learn/content/AiConsultantCostBody.jsx",
  "components/learn/content/AiAutomationServicesPricingBody.jsx",
  "components/learn/content/AiConsultantVsAiAgencyBody.jsx",
];

const LEARN_BODIES = sourceFiles(join(ROOT, "components/learn/content")).map(rel);

// Third-person references to the author, on a page bylined by that author.
// This is the exact shape the 2026-08-12 sweep left behind ("Our founder has
// held the job twice", "When our founder took over customer onboarding",
// "software our founder built"), and it is the one signal that separates a
// brand-voice article from a reader saying "we" about their own company.
const THIRD_PERSON_AUTHOR = /\bour founder\b|\bBradley\b/i;

describe("authored content speaks as I", () => {
  it("accounts for every /learn body exactly once", () => {
    expect(LEARN_BODIES.length).toBe(31);
    const listed = [
      ...AUTHORED_SPEAKS_AS_I.filter((f) => f.startsWith("components/learn/")),
      ...AUTHORED_SILENT_SO_FAR,
    ].sort();
    expect(
      listed,
      "A /learn body is missing from both lists above, which usually means a " +
        "new page shipped. Decide which it is: if it carries a personal aside " +
        "add it to AUTHORED_SPEAKS_AS_I, and if it does not add it to " +
        "AUTHORED_SILENT_SO_FAR. Both are pages Bradley signs.",
    ).toEqual([...LEARN_BODIES].sort());
  });

  it("still runs the byline that makes this half true", () => {
    // Every /learn page renders this line above the article, which is why an
    // article that says "we see this constantly" argues with its own header.
    expect(BYLINE).toMatch(/^By Bradley de Wet, founder of Modern BizOps\./);
  });

  it.each(AUTHORED_SPEAKS_AS_I)("%s still speaks in the first person", (file) => {
    const src = stripComments(readSource(file));
    const hits = src
      .split("\n")
      .filter((line) => FIRST_PERSON_I.test(line) || FIRST_PERSON_OTHER.test(line));
    expect(
      hits.length,
      `${file} lost its first person. This page is authored: it renders under ` +
        `"By Bradley de Wet" and it is a blog post whose author talks in the ` +
        `first person. The "we" voice governs brand surfaces only, so a voice ` +
        `sweep that reaches this file is going the wrong way. Bradley, ` +
        `2026-08-12: "If the page is set to be authored by a specific person ` +
        `such as myself then first person language still makes sense."`,
    ).toBeGreaterThan(0);
  });

  it.each(LEARN_BODIES)("%s names its own author in no third person", (file) => {
    const hits = stripComments(readSource(file))
      .split("\n")
      .map((line, i) => [i + 1, line])
      .filter(([, line]) => THIRD_PERSON_AUTHOR.test(line))
      .map(([n, line]) => `${n}: ${line.trim()}`);
    expect(
      hits,
      `${file} refers to Bradley in the third person while running his byline. ` +
        `That is what a brand-voice sweep leaves behind on an authored page. ` +
        `Write it as "I".\n${hits.join("\n")}`,
    ).toEqual([]);
  });

  it("bites on the brand-voice sweep, in the forms it actually took", () => {
    for (const bad of [
      "        Our founder has held the job twice.",
      "        When our founder took over customer onboarding at a startup,",
      "        My audit engine is software our founder built.",
      "        button. Bradley has done the tactical version too, in his own seat.",
    ]) {
      expect(
        THIRD_PERSON_AUTHOR.test(bad),
        `${bad} should trip the authored-page guard`,
      ).toBe(true);
    }
    for (const good of [
      "        I have held the job twice.",
      "        When I took over customer onboarding at a VC-backed startup,",
      "        Most businesses that say “we sell to anyone who needs what we sell”",
      "        can we grow without hiring, or does every new dollar require another",
    ]) {
      expect(
        THIRD_PERSON_AUTHOR.test(good),
        `${good} must not trip the authored-page guard`,
      ).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// The extraction step both halves stand on
// ---------------------------------------------------------------------------

describe("the comment stripper", () => {
  it("reads comments as comments and strings as strings", () => {
    expect(stripComments("// I built this\nWe built this")).toBe(
      "\nWe built this",
    );
    expect(stripComments("/* my audit engine */ our audit engine")).toBe(
      " our audit engine",
    );
    expect(stripComments('const u = "https://modernbizops.com/about";')).toBe(
      'const u = "https://modernbizops.com/about";',
    );
  });

  it("survives a glob inside a line comment, which ate a whole file once", () => {
    // The two-regex stripper this replaced ran block comments first, so the
    // star-slash below opened a comment that swallowed everything up to the
    // next one. In lib/learn/registry.js that was 90KB of copy, and the
    // fifteen-year guard in __tests__/chrome/site-chrome.test.jsx read the
    // remaining 4% and called the file clean.
    const src = [
      "// Body copy lives in components/learn/content/*.jsx (hand-JSX).",
      'export const COPY = "I coach one of your own employees.";',
      "/* a real block comment */",
      'export const MORE = "My audit engine connects to your CRM.";',
    ].join("\n");
    const out = stripComments(src);
    expect(out).toContain("I coach one of your own employees.");
    expect(out).toContain("My audit engine connects to your CRM.");
    expect(out).not.toContain("a real block comment");
  });

  it("leaves the /learn byline intact, the string that proved the bug", () => {
    const out = stripComments(readSource("lib/learn/registry.js"));
    expect(out).toContain(BYLINE);
    // 93KB of registry survived as 3KB under the old stripper.
    expect(out.length).toBeGreaterThan(80_000);
  });
});

// ---------------------------------------------------------------------------
// The About page: company voice, with every "I" visibly attributed
// ---------------------------------------------------------------------------

// This page is the one surface where the two halves above collide, and it has
// been ruled on three times.
//
//   2026-08-12  A "we" sweep converted the whole page to the third person.
//               Bradley reversed it the same day; the page went back to "I".
//   2026-08-26  He ruled it a brand surface ("the About page should be 'our
//               founder has worked with ...'"). Nobody converted it, and this
//               file kept listing it on the authored side.
//   2026-09-01  Asked to settle it after David Ellis (Tugboat) rated the
//               I-versus-we tension his highest-consequence finding, he chose a
//               third thing: "I want the page to be company voice and for me to
//               be quoted as telling the story or for the section that is using
//               the I voice to be obvious that it's something that is authored
//               by me."
//
// So the page is company voice, and the first person survives inside regions
// fenced by /* authored-by-bradley:start */ and :end, each rendered under an
// <AuthoredNote> byline. That keeps the doc 08 positioning paragraphs verbatim,
// which doc 08 requires, and keeps the three Contactually stories in the voice
// that makes them worth reading, while the sentences where the COMPANY makes a
// promise say "we".
//
// The fence is a comment, so it has to be read off the RAW source before
// stripComments runs.
const AUTHORED_REGION =
  /\/\*\s*authored-by-bradley:start\s*\*\/[\s\S]*?\/\*\s*authored-by-bradley:end\s*\*\//g;

// "Professional Scrum Master I" is a certification level in Roman numerals, not
// a pronoun. Listed as an exact string rather than loosened into a pattern,
// because a pattern for "a capital I at the end of a quoted string" would also
// swallow real copy.
const PROPER_NOUN_I = ['"Professional Scrum Master I"'];

describe("the About page is company voice with attributed first person", () => {
  const ABOUT = "app/about/page.js";
  const raw = readSource(ABOUT);

  it("fences at least three authored regions", () => {
    const regions = raw.match(AUTHORED_REGION) ?? [];
    expect(
      regions.length,
      `${ABOUT} has no authored-by-bradley regions. Either the fences were ` +
        `deleted, or the page was swept to "we" for the second time. The ` +
        `2026-08-12 sweep was reversed the same day.`,
    ).toBeGreaterThanOrEqual(3);
  });

  it("puts a visible byline on the page, not just a comment", () => {
    // A fence is invisible to a reader. The rule Bradley set is that the "I"
    // has to be OBVIOUS, which is a rendered element, so the fences are only
    // honest while this renders.
    expect(raw).toContain("function AuthoredNote(");
    expect(raw).toContain("<AuthoredNote>");
    expect(raw).toMatch(/in his own words/);
    const uses = raw.match(/<AuthoredNote[\s>]/g) ?? [];
    expect(uses.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps real first person inside the fences", () => {
    // Without this the fences could be moved onto copy that no longer contains
    // any "I", and the page would pass while having been swept anyway.
    const regions = raw.match(AUTHORED_REGION) ?? [];
    for (const region of regions) {
      expect(
        FIRST_PERSON_I.test(region) || FIRST_PERSON_OTHER.test(region),
        `An authored-by-bradley region contains no first person. Either move ` +
          `the fence or drop it.`,
      ).toBe(true);
    }
  });

  it("carries no first person outside the fences", () => {
    let outside = raw.replace(AUTHORED_REGION, "");
    for (const literal of PROPER_NOUN_I) outside = outside.split(literal).join("");
    const hits = firstPersonViolations(outside);
    expect(
      hits,
      `${ABOUT} speaks in the first person outside an authored-by-bradley ` +
        `region. On this page the company speaks as "we" and Bradley speaks ` +
        `inside a fenced, bylined region. A guarantee about runbooks or ` +
        `lock-in is the company promising, so it says "we".\n${hits.join("\n")}`,
    ).toEqual([]);
  });

  it("keeps the sentences that moved to we from drifting back", () => {
    // The exact strings that carried an unmarked "I" until 2026-09-01.
    expect(raw).toContain("We are not for everyone. Here is who we are for.");
    expect(raw).not.toContain("I am not for everyone");
    expect(raw).not.toContain("stay dependent on me");
    expect(raw).not.toContain("rule me out");
  });
});
