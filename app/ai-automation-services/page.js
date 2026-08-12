import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import LearnHero from "@/components/learn/LearnHero";
import CtaCallout from "@/components/learn/CtaCallout";
import {
  BUILDS,
  LADDER,
  CARE_PLAN,
  UPLIFT_RULE,
  VERTICALS,
  PARTNER_SYSTEM_LIMIT,
  carePlanMonthly,
  offerPriceFields,
} from "@/lib/offers";
import { OFFER_PAGES } from "@/lib/offerPages";

// The menu, rendered. Doc 10 v4 is the source and lib/offers.js is the copy of
// it that ships, so this page holds layout and framing only. Every name, price,
// clock and scope line below comes from that module.
//
// Publishing the whole menu is the differentiation: 4 of 12 competitor sites
// torn down for this pivot publish any number at all. So the numbers lead and
// the persuasion sits around them.
const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

// Title, description, canonical, OG and Twitter all come from lib/offerPages.js,
// which is also where the brand-suffix opt-out lives and is explained.
const PAGE = OFFER_PAGES.services;
const { url: URL, description: DESCRIPTION } = PAGE;

// The Care Plan stacks per system. The retainer does not. This is the whole
// arithmetic, published rather than saved for a call, and it runs to whatever
// the retainer covers so the table and the retainer cannot fall out of step.
const SYSTEM_WORDS = ["one", "two", "three", "four", "five"];

// Sentence case, not the `capitalize` utility: that one uppercases every word
// and turned the rows into "One System".
const CARE_PLAN_MATH = Array.from(
  { length: PARTNER_SYSTEM_LIMIT },
  (_, i) => {
    const word = SYSTEM_WORDS[i];
    return {
      systems: i + 1,
      label: `${word[0].toUpperCase()}${word.slice(1)} system${
        i === 0 ? "" : "s"
      }`,
      carePlan: carePlanMonthly(i + 1),
    };
  }
);

const PARTNER_LIMIT_WORD = SYSTEM_WORDS[PARTNER_SYSTEM_LIMIT - 1];

export const metadata = PAGE.metadata;

export default function AiAutomationServicesPage() {
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Revenue Automation Builds",
        item: URL,
      },
    ],
  };

  // The menu as an OfferCatalog, so the published prices are machine-readable
  // rather than only visible. Built from the same array the table renders.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: rung.builds.name,
    serviceType: "AI automation services",
    url: URL,
    description: DESCRIPTION,
    provider: {
      "@type": "Organization",
      name: "Modern BizOps",
      url: "https://modernbizops.com",
      founder: { "@type": "Person", name: "Bradley de Wet" },
    },
    areaServed: { "@type": "Country", name: "United States" },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Founder-led B2B companies from $3M to $50M in revenue",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: rung.builds.name,
      itemListElement: BUILDS.map((build) => ({
        "@type": "Offer",
        name: build.name,
        description: build.scope,
        url: URL,
        // Every build is a single one-time amount today, so this resolves to a
        // flat `price`. Going through the shared helper is what keeps that true
        // if one ever becomes a band.
        ...offerPriceFields(build.price),
      })),
    },
  };

  const schemas = [breadcrumbLd, serviceLd];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Every motif carries a caption baked into the artwork for the page it
            was drawn for, so choosing one is choosing a sentence. This hero ran
            fourPaths, whose caption reads "Three paths leave when the money
            stops. One stays in the building." That argument belongs to the
            fractional COO material and says nothing beside a twelve-item menu.
            lifecycleLoop captions "One map, end to end", which is what this menu
            actually is: the twelve builds run from lead capture through the sale
            to invoicing, onboarding and the owner's report. */}
        <LearnHero
          kicker="AI Automation Services"
          h1="Revenue Automation Builds"
          accentWord="Automation"
          dek="Twelve named systems. Published fixed prices. A clock on every one."
          motif="lifecycleLoop"
          theme="navy"
        />

        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              The whole menu, with the numbers on it.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                Each of these is one named system, built at a fixed price, on a
                clock, with a runbook handed over at the end. Your team owns it
                when we are gone, which is the part most of this market leaves
                out.
              </p>
              <p>
                Every price below is the base pattern. The one rule that moves
                it is published under the table, so nothing here turns into a
                number you only learn on a call.
              </p>
            </div>
          </div>

          <ol className="space-y-4">
            {BUILDS.map((build) => (
              <li
                key={build.id}
                className="bg-white border border-border rounded-[14px] p-6 md:p-7"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
                  <div className="md:max-w-[62ch]">
                    <p className="font-display text-xl font-semibold text-navy mb-2">
                      {build.name}
                    </p>
                    <p className="font-body text-[15px] text-text-mid leading-relaxed">
                      {build.scope}
                    </p>
                    {build.note && (
                      <p className="mt-3 font-body text-[14px] text-text-light leading-relaxed">
                        {build.note}
                      </p>
                    )}
                    {/* The two honest-scope lines are required to reach the
                        buyer, not fine print. They get a picked-out block for
                        exactly that reason. */}
                    {build.honestScope && (
                      <p className="mt-4 rounded-[10px] border border-amber/30 bg-amber-pale px-4 py-3 font-body text-[14px] text-text-primary leading-relaxed">
                        {build.honestScope}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 md:text-right">
                    <p className="font-display text-2xl font-semibold text-navy">
                      {build.price}
                    </p>
                    <p className="font-body text-sm text-text-light mb-3">
                      {build.clock}
                    </p>
                    <Link
                      href="/ai-readiness-assessment"
                      className="font-body text-sm font-semibold text-navy underline underline-offset-4 hover:text-amber transition-colors"
                    >
                      Price this for your stack
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mb-9">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              Keeping it running
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              {CARE_PLAN.name}: {CARE_PLAN.price}
            </h2>
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
              {CARE_PLAN.summary} A build without one still belongs to you and
              still works. The Care Plan is what stops it drifting six months
              later when the system it depends on changes underneath it.
            </p>
          </div>

          <div className="max-w-[760px] overflow-x-auto">
            <table className="w-full border-collapse font-body text-[15px]">
              <caption className="sr-only">
                What Care Plans cost as systems stack, next to the flat{" "}
                {rung.partner.name} retainer
              </caption>
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-navy">
                    What you are running
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-navy">
                    {CARE_PLAN.name}s stack to
                  </th>
                  <th scope="col" className="py-3 font-semibold text-navy">
                    {rung.partner.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CARE_PLAN_MATH.map((row) => (
                  <tr key={row.systems} className="border-b border-border/60">
                    <td className="py-3 pr-4 text-text-mid">{row.label}</td>
                    <td className="py-3 pr-4 text-text-mid">{row.carePlan}</td>
                    <td className="py-3 text-text-mid">{rung.partner.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 max-w-[760px] space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
            <p>
              One build plus a Care Plan is the pay-as-you-go rung, and on price
              alone it is the cheaper line at every row of the table above. Care
              Plans stack per system. The retainer does not.
            </p>
            <p>
              So the trade is worth stating plainly rather than dressing up. The{" "}
              {rung.partner.name} retainer at {rung.partner.price} costs more
              than the Care Plans it replaces, and it buys more: up to{" "}
              {PARTNER_LIMIT_WORD} systems kept running <em>and</em> improving,
              plus a monthly working session with your team. A Care Plan keeps a
              system alive. The retainer keeps it getting better. Choose it when
              you want the systems improving, not when you want the monthly
              number lower.
            </p>
            <p>
              Both numbers, and the two rungs above them, are on the{" "}
              <Link
                href="/pricing"
                className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
              >
                pricing page
              </Link>
              .
            </p>
          </div>
        </Section>

        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px]">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              The one rule that moves a price
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
              Second system of record, second funnel.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                The listed price is the base pattern: one system of record, one
                funnel. That covers most companies at this size, and it is the
                number we hold ourselves to.
              </p>
              <p>
                A second system of record, or a second funnel that has to be
                built and maintained alongside the first, adds{" "}
                {UPLIFT_RULE.addition}. That is the only uplift, and the ceiling
                is {UPLIFT_RULE.cap}, which is the top of the published band. No
                scope conversation ends above the menu.
              </p>
              <p className="text-navy font-medium">
                If the audit finds a second system, you learn that before you
                commit to anything, and you see the adjusted number in writing.
              </p>
            </div>
          </div>
        </Section>

        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              Vertical packs
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              Six industries, and one anchor build each.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                A pack is the same menu pre-shaped for one industry: the system
                of record that industry actually runs, its vocabulary, and the
                one pipeline the whole business hangs on.
              </p>
              <p>
                Packs publish after that vertical&apos;s first audit proves the
                need. That is why this is a pipeline and not a product grid. We
                would rather ship a pack built from one real stack than six
                built from guesses.
              </p>
            </div>
          </div>

          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {VERTICALS.map((vertical) => (
              <li
                key={vertical.id}
                className="bg-cream rounded-[14px] p-6 flex flex-col"
              >
                <p className="font-display text-xl font-semibold text-navy mb-1">
                  {vertical.name}
                </p>
                <p className="font-body text-[14px] text-text-light mb-4">
                  {vertical.detail}
                </p>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-amber mb-1">
                  Anchor build
                </p>
                <p className="font-body text-[15px] font-semibold text-navy mb-1">
                  {vertical.anchor}
                </p>
                <p className="font-body text-[15px] text-text-mid leading-relaxed">
                  {vertical.anchorDetail}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-9 max-w-[760px] font-body text-text-mid text-base md:text-lg leading-relaxed">
            If you want the pack for your industry shaped around your stack
            rather than somebody else&apos;s, that is what the{" "}
            <Link
              href="/founding-clients"
              className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
            >
              founding client program
            </Link>{" "}
            is for.
          </p>
        </Section>

        {/* A plain band rather than a <Section>: CtaCallout already carries its
            own max-width, centering and vertical margin, and cancelling
            Section's py-16 with a py-0 in the same class string leaves the
            winner to Tailwind's stylesheet order. See the same note on the
            audit page. */}
        <div className="bg-cream px-6 py-6 md:px-8 md:py-10">
          <CtaCallout
            eyebrow="Which one first"
            heading="The audit tells you which of these to build."
            body={`Picking off a menu is guessing. The ${rung.audit.name} ranks these against your actual stack, prices the top items from this same list, and credits its fee in full toward the first one you build.`}
            buttonLabel={`Start with the ${rung.audit.name}`}
            href="/ai-readiness-assessment"
            ctaLocation="services_foot"
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
