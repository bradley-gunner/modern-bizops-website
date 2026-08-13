import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import LearnHero from "@/components/learn/LearnHero";
import CtaCallout from "@/components/learn/CtaCallout";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import {
  LADDER,
  TRAINING,
  CARE_PLAN,
  AUDIT_TERMS,
  UPLIFT_RULE,
  offerPriceFields,
} from "@/lib/offers";
import { OFFER_PAGES } from "@/lib/offerPages";

// Every number Modern BizOps charges, on one page. There is no "contact us for
// pricing" rung, and there is no rung whose price only exists on a call.
//
// The whole page renders from lib/offers.js. If a price is wrong here, it is
// wrong in that module, which is the only place to fix it.
const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

// Title, description, canonical, OG and Twitter all come from lib/offerPages.js,
// which is also where the brand-suffix opt-out lives and is explained.
const PAGE = OFFER_PAGES.pricing;
const { url: URL, description: DESCRIPTION } = PAGE;

// The ladder, in order, with the one note per rung that a buyer needs at the
// moment they read the number. `href` and every string besides `note` come
// from lib/offers.js.
const LADDER_NOTES = {
  scan: {
    linkLabel: "Get the Free Scan",
    note: "No call, no card, and no obligation to do anything with the result.",
  },
  audit: {
    linkLabel: "See what the audit computes",
    note: `The credit also applies to your first Partner month, and it holds for ${AUDIT_TERMS.creditWindow}. ${AUDIT_TERMS.guarantee}`,
  },
  builds: {
    linkLabel: "See all twelve builds",
    note: `That price covers one system of record and one funnel. A second of either adds ${UPLIFT_RULE.addition}, and the ceiling is ${UPLIFT_RULE.cap}.`,
  },
  partner: {
    note: `Includes the ${CARE_PLAN.name} work on every system it covers. Quarterly out.`,
  },
  "partner-plus": {
    note: "Same terms as the Partner plan, including the quarterly out.",
  },
};

// Sold beside the ladder rather than on it, because neither is a step toward
// the next thing.
const BESIDE_THE_LADDER = [TRAINING, CARE_PLAN];

// What the price actually buys, and the reason it can be published at all.
// This is the substitute for a case study, and it is deliberately structural:
// there is no client outcome to point at yet, so what gets shown is the thing
// that makes the outcome likely and makes leaving cheap.
const ACCOUNTABILITY = [
  {
    title: "Fixed scope, written first",
    body: "What the build includes, and what it does not, is agreed before the work starts. If it takes us longer than we said, that is our cost. You will not see a change order.",
  },
  {
    title: "A named owner on your side",
    body: "Every build requires one person at your company who owns the system afterwards. We do not start a build without that name. Automation nobody owns drifts, and you keep paying for it while it does.",
  },
  {
    title: "Runbooks handed over",
    body: "How it works, how to change it, and what to do when it breaks, written down and handed to that owner. The runbook ships on the same day the build does.",
  },
  {
    title: "A quarterly out on every retainer",
    body: "No annual lock. The longest thing you are ever committed to is three months, and leaving does not cost you the systems, the data, or the runbooks.",
  },
  {
    title: "A graduation path, designed in",
    body: "The end state is your team running this without us. We write that into the scope document before the work starts.",
  },
];

// Lock-in and the cheaper-alternative objections, which are the two that decide
// a published-price page. Single source for both the accordion and the FAQPage
// JSON-LD, so the two cannot drift.
const FAQ = [
  {
    q: "How do I avoid getting locked in?",
    a: `Fixed scope, your systems, your data, and the runbook handed over when a build ships. Retainers carry a quarterly out. Nothing we build lives on infrastructure you cannot reach without us, and the end of the engagement is written into the scope document on day one. When it is done, you do not need us.`,
  },
  {
    q: "Why not use a freelancer or a cheaper agency?",
    a: "A freelancer will usually be cheaper per hour, and for one clean automation on a system that already works, that can be the right call. What you are paying for here is the diagnosis that says which automation is worth building at all, a fixed price instead of an hourly meter, and a runbook so the build outlives the person who made it. If your foundation is already sound and you know exactly what you want, hire the freelancer. We will tell you that on the call.",
  },
  {
    q: "Is the price really fixed?",
    a: `Yes, with one published exception. The listed price on a build is the base pattern: one system of record and one funnel. A second of either adds ${UPLIFT_RULE.addition}, and the ceiling is ${UPLIFT_RULE.cap}. That rule is on the builds page, in public, where you can read it before you sign anything.`,
  },
  {
    q: "Why publish prices at all?",
    a: "Because a price you have to ask for is a price that changes with who is asking. Publishing them means you can rule us out in two minutes without spending an hour on a call to do it, and it means the call can be about whether this fits your business. You already know what it costs.",
  },
];

export const metadata = PAGE.metadata;

export default function PricingPage() {
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
      { "@type": "ListItem", position: 2, name: "Pricing", item: URL },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // The whole ladder as machine-readable offers. offerPriceFields() decides the
  // shape: a flat `price` only for a single one-time amount, and a
  // priceSpecification with min/max or a monthly unit for everything else, so a
  // crawler cannot read a retainer as a one-time charge, or a band as its
  // floor. The reasoning lives with the helper in lib/offers.js.
  const toOffer = (item) => ({
    "@type": "Offer",
    name: item.name,
    description: `${item.price}. ${item.summary}`,
    url: URL,
    ...offerPriceFields(item.price),
  });

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modern BizOps AI automation partnership",
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
      audienceType: "Founder-led B2B companies",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Published prices",
      itemListElement: [...LADDER, ...BESIDE_THE_LADDER].map(toOffer),
    },
  };

  const schemas = [breadcrumbLd, faqLd, serviceLd];

  return (
    <>
      <Header />
      <main id="main-content">
        <LearnHero
          kicker="Pricing"
          h1="Published prices. Fixed scope. Your team owns it."
          accentWord="Published prices."
          dek="Every number we charge is on this page. The rest is a fit conversation."
          motif="stageChevrons"
          theme="navy"
        />

        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              The full ladder.
            </h2>
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
              Five rungs, and you can stop at any of them. Nothing here requires
              the next thing, and the first one is free and needs no call.
            </p>
          </div>

          <ol className="space-y-4">
            {LADDER.map((item) => {
              const extra = LADDER_NOTES[item.id] ?? {};
              const linkable = item.href && item.href !== "/pricing";
              return (
                <li
                  key={item.id}
                  className="bg-white border border-border rounded-[14px] p-6 md:p-7"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
                    <div className="md:max-w-[62ch]">
                      <p className="font-display text-xl font-semibold text-navy mb-2">
                        {item.name}
                      </p>
                      <p className="font-body text-[15px] text-text-mid leading-relaxed">
                        {item.summary}
                      </p>
                      {extra.note && (
                        <p className="mt-3 font-body text-[14px] text-text-light leading-relaxed">
                          {extra.note}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 md:text-right">
                      <p className="font-display text-2xl font-semibold text-navy">
                        {item.price}
                      </p>
                      {linkable && extra.linkLabel && (
                        <p className="mt-3">
                          <Link
                            href={item.href}
                            className="font-body text-sm font-semibold text-navy underline underline-offset-4 hover:text-amber transition-colors"
                          >
                            {extra.linkLabel}
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12 max-w-[760px] mb-6">
            <h3 className="font-display text-2xl font-semibold text-navy mb-3">
              Beside the ladder
            </h3>
            <p className="font-body text-text-mid text-base leading-relaxed">
              Neither of these is a step toward the next thing. Team training
              stands on its own, and the Care Plan attaches to a build you
              already own.
            </p>
          </div>

          <ul className="grid gap-5 md:grid-cols-2">
            {BESIDE_THE_LADDER.map((item) => (
              <li
                key={item.name}
                className="bg-white border border-border rounded-[14px] p-6"
              >
                <p className="font-display text-xl font-semibold text-navy mb-1">
                  {item.name}
                </p>
                <p className="font-body text-sm font-semibold text-amber mb-3">
                  {item.price}
                </p>
                <p className="font-body text-[15px] text-text-mid leading-relaxed">
                  {item.summary}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              What the price buys
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
              Five things that are true of every build and every retainer.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                Modern BizOps has no client results to show you yet. That is the
                honest position, and dressing it up would be the fastest way to
                lose the kind of buyer this is built for.
              </p>
              <p>
                What we can put in front of you is the structure the work runs
                on. It is what makes walking away cheap, and it is why a price
                can be published at all.
              </p>
            </div>
          </div>

          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ACCOUNTABILITY.map((item) => (
              <li
                key={item.title}
                className="bg-cream rounded-[14px] p-6 flex flex-col"
              >
                <p className="font-display text-xl font-semibold text-navy mb-2">
                  {item.title}
                </p>
                <p className="font-body text-[15px] text-text-mid leading-relaxed">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-9 max-w-[760px] font-body text-text-mid text-base md:text-lg leading-relaxed">
            The one number that is not on this page is what your engine needs
            first. That is what the{" "}
            <Link
              href="/ai-readiness-assessment"
              className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
            >
              {rung.audit.name}
            </Link>{" "}
            computes, straight out of your connected systems.
          </p>
        </Section>

        <Section bg="cream" narrow>
          <h2 className="mb-6 text-center font-display text-3xl font-semibold text-navy">
            Questions about the money
          </h2>
          <MaturityFaq items={FAQ} />
        </Section>

        {/* A plain band rather than a <Section>: CtaCallout already carries its
            own max-width, centering and vertical margin, and cancelling
            Section's py-16 with a py-0 in the same class string leaves the
            winner to Tailwind's stylesheet order. See the same note on the
            audit page. */}
        <div className="bg-white px-6 py-6 md:px-8 md:py-10">
          <CtaCallout
            eyebrow="The last step"
            heading="Book the call. You have already seen the prices."
            body="There is nothing left to quote. The call is where we work out whether this is the right thing for your business right now, and we will say so plainly if it is not."
            buttonLabel="Book a call"
            href="/book"
            ctaLocation="pricing_foot"
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
