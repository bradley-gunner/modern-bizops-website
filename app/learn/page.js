import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import LearnHero from "@/components/learn/LearnHero";
import CtaCallout from "@/components/learn/CtaCallout";
import { LEARN_PAGES } from "@/lib/learn/registry";
import { LEARN_INDEX, learnIndexMetadata } from "@/lib/learnIndex";

// The /learn index. There was no route here until 2026-08-11: app/learn held
// only [slug], so https://modernbizops.com/learn returned 404 while twenty-four
// pages hung off it and every one of them carried a "Learn" breadcrumb pointing
// at nothing.
//
// EVERYTHING ON THIS PAGE COMES FROM lib/learn/registry.js. There is no second
// list of pages to keep in step, because a hand-maintained index is a list that
// goes stale the first time somebody publishes in a hurry. Publishing a new
// /learn page puts it on this page automatically.

// Title, description, canonical, OG and Twitter all come from
// lib/learnIndex.js, which is also where the brand-suffix reasoning lives and
// is what makes the rendered title length testable.
const { url: URL, title: TITLE, description: DESCRIPTION } = LEARN_INDEX;

export const metadata = learnIndexMetadata;

// GROUPING. Twenty-four links in one column is a list nobody reads, so the
// entries are bucketed by the first segment of their hero kicker, which is the
// cluster the page was written into. Deriving the bucket from a field the
// registry already carries means a new page groups itself.
const GROUP_ORDER = [
  "Revenue Operations",
  "GTM Maturity Framework",
  "AI for Revenue Operations",
];

// One page carries the kicker "Fractional COO · Cost", which is a cluster of
// one. It belongs with the leadership and benchmark material rather than in a
// section by itself.
const GROUP_ALIASES = {
  "Fractional COO": "Revenue Operations",
};

const GROUP_BLURBS = {
  "Revenue Operations":
    "The vocabulary and the benchmarks. Start here if you want the concepts before the framework.",
  "GTM Maturity Framework":
    "The four stages and the competencies each one rests on. The whole framework lives on a single page.",
  "AI for Revenue Operations":
    "Where AI actually earns its keep in a smaller business, and which tools are worth paying for.",
};

// A page with no kicker still has to appear somewhere, so it falls into the
// general bucket rather than disappearing from the index.
const FALLBACK_GROUP = "Revenue Operations";

// Inside a group: the hub page first, then the competencies, then the articles.
// Registry order breaks ties, which is roughly publish order.
const TYPE_ORDER = { hub: 0, competency: 1, article: 2 };

function groupFor(entry) {
  const prefix = (entry.visual?.kicker ?? "").split("·")[0].trim();
  return GROUP_ALIASES[prefix] ?? (prefix || FALLBACK_GROUP);
}

function buildGroups() {
  const entries = Object.values(LEARN_PAGES);
  const byGroup = new Map();

  for (const entry of entries) {
    const name = groupFor(entry);
    if (!byGroup.has(name)) byGroup.set(name, []);
    byGroup.get(name).push(entry);
  }

  // Known groups in their approved order, then anything a future kicker
  // introduces, in the order it first appears. Nothing is dropped.
  const names = [
    ...GROUP_ORDER.filter((name) => byGroup.has(name)),
    ...[...byGroup.keys()].filter((name) => !GROUP_ORDER.includes(name)),
  ];

  return names.map((name) => ({
    name,
    blurb: GROUP_BLURBS[name] ?? null,
    pages: byGroup
      .get(name)
      .map((entry, i) => ({ entry, i }))
      .sort(
        (a, b) =>
          (TYPE_ORDER[a.entry.pageType] ?? 9) -
            (TYPE_ORDER[b.entry.pageType] ?? 9) || a.i - b.i,
      )
      .map(({ entry }) => entry),
  }));
}

export default function LearnIndexPage() {
  const groups = buildGroups();
  const total = Object.keys(LEARN_PAGES).length;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://modernbizops.com",
      },
      { "@type": "ListItem", position: 2, name: "Learn", item: URL },
    ],
  };

  // The library as a machine-readable list, in the order a reader sees it. It
  // asserts nothing beyond what the page shows: a name, a URL, a position.
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    url: URL,
    description: DESCRIPTION,
    isPartOf: {
      "@type": "WebSite",
      name: "Modern BizOps",
      url: "https://modernbizops.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: groups
        .flatMap((group) => group.pages)
        .map((entry, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: entry.h1,
          url: entry.url,
        })),
    },
  };

  const schemas = [breadcrumbLd, collectionLd];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* stageChevrons is the library's neutral fallback motif and reads
            "Four stages. One direction." Every other motif carries a caption
            written for one specific page, which is wrong on an index: fourPaths
            renders "Three paths leave when the money stops", which belongs to
            the fractional COO material and to nothing else. */}
        <LearnHero
          kicker="Learning Library"
          h1="The Modern BizOps Learning Library"
          accentWord="Learning Library"
          dek="Every guide we have published, grouped so you can find the one that matches the problem in front of you."
          motif="stageChevrons"
          theme="navy"
        />

        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px] mb-12">
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
              These pages are the written version of the work. They are free and
              they take no email address. A founder deciding what to fix first
              should be able to read the reasoning before talking to anybody.
            </p>
          </div>

          <div className="space-y-14">
            {groups.map((group) => (
              <section key={group.name} aria-labelledby={`group-${group.name.replace(/\s+/g, "-").toLowerCase()}`}>
                <div className="max-w-[760px] mb-6">
                  <h2
                    id={`group-${group.name.replace(/\s+/g, "-").toLowerCase()}`}
                    className="font-display text-[28px] md:text-[34px] font-semibold text-navy mb-3"
                  >
                    {group.name}
                  </h2>
                  {group.blurb && (
                    <p className="font-body text-text-mid text-base leading-relaxed">
                      {group.blurb}
                      {group.name === "GTM Maturity Framework" && (
                        <>
                          {" "}
                          <Link
                            href="/predictable-revenue-engine"
                            className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
                          >
                            See the framework
                          </Link>
                          .
                        </>
                      )}
                    </p>
                  )}
                </div>

                <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {group.pages.map((entry) => (
                    <li key={entry.slug} className="flex">
                      <Link
                        href={`/learn/${entry.slug}`}
                        className="group flex flex-col bg-white border border-border rounded-[14px] p-6 hover:border-navy-mid transition-colors"
                      >
                        {/* A real h3, not a styled <p>. The visual design is
                            unchanged; the outline is not. This is the one page
                            whose whole job is to be an internal hub, and it ran
                            group h2s straight into paragraph text, so assistive
                            tech and crawlers saw a heading level with nothing
                            under it. */}
                        <h3 className="font-display text-xl font-semibold text-navy mb-2 group-hover:text-amber transition-colors">
                          {entry.h1}
                        </h3>
                        {/* cardBlurb, NOT metaDescription. The meta strings are
                            live SERP snippets for twenty-four ranking pages and
                            nine of them are built on the same negation shape
                            ("X is not A. It is B."), which earns the click in a
                            search result and reads as one template when the grid
                            renders nine of them in a single viewport. cardBlurb
                            is the index-only override; entries without one fall
                            back to the meta description. */}
                        <p className="font-body text-[15px] text-text-mid leading-relaxed">
                          {entry.cardBlurb ?? entry.metaDescription}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Section>

        {/* A plain band rather than a <Section>: CtaCallout carries its own
            max-width, centering and vertical margin, and cancelling Section's
            py-16 with a py-0 in the same class string leaves the winner to
            Tailwind's stylesheet order. Same note as the offer pages. */}
        <div className="bg-white px-6 py-6 md:px-8 md:py-10">
          <CtaCallout
            eyebrow="Before you read all of it"
            heading="Find out which of these actually applies to you."
            body="The free Scan is sixteen questions and about five minutes. It tells you why AI has or has not stuck in your business and where you are ready to start, so you know which of these guides is worth your afternoon."
            buttonLabel="Get the Free Scan"
            href="/scorecard"
            ctaLocation="learn_index_foot"
          />
        </div>
      </main>
      <Footer />
      {schemas.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
    </>
  );
}
