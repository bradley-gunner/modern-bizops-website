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
//      talking in first person." The 24 /learn article bodies, the registry
//      strings that render under the byline, and the About page.
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
const READER_VOICE_LINE = /^\s*(q:|\{\s*value:)/;

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
  "app/pricing/page.js",
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
      "app/pricing/page.js",
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
    expect(READER_VOICE_LINE.test('  a: "I coach one of your own people.",')).toBe(false);
    expect(READER_VOICE_LINE.test("        My audit engine connects to your CRM.")).toBe(false);
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
    expect(LEARN_BODIES.length).toBe(24);
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
