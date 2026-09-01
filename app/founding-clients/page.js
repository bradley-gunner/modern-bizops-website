import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import LearnHero from "@/components/learn/LearnHero";
import CtaCallout from "@/components/learn/CtaCallout";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import {
  LADDER,
  VERTICALS,
  FOUNDING_TERMS,
  AUDIT_TERMS,
  CARE_PLAN,
} from "@/lib/offers";
import { OFFER_PAGES } from "@/lib/offerPages";

// The hand-raise page. Modern BizOps has zero clients, and this page is the
// honest version of that fact rather than a logo wall built out of nothing.
//
// TWO THINGS ON THIS PAGE ARE LOAD-BEARING AND MUST NOT DRIFT:
//
// 1. Nothing here may imply a client, a case study, a testimonial or a track
//    record for this company. The whole premise is that none exists yet. The
//    operator record is Bradley's and it is stated as his.
// 2. The audit is NOT the discount. It stays at its published price with the
//    standard credit, and the founding incentive lands on the first build.
//    Getting that backwards misprices a signed offer (Bradley, 2026-08-11).
//
// Voice: "we" throughout. Bradley is named in the third person where his own
// record is the point (retired the first-person singular, 2026-08-12).
// Every price and every industry renders from lib/offers.js.
//
// THE FOUR SECTIONS ARE DELIBERATELY NOT PARALLEL (2026-08-12). Until this
// date all four ran the identical five beats: kicker, an H2 in the same
// comma-pivot rhythm, one intro paragraph, a card grid, and a standalone
// closing paragraph carrying a balanced aphorism. Three of those four closers
// restated the section they closed. The first two sections now end on the grid
// with no closer at all, the H2s are four different grammatical shapes, and
// section two's intro carries the builds-menu link the deleted closer used to.
// A future pass that "restores consistency" here puts the tell back.
const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));
const audit = rung.audit;

// Title, description, canonical, OG and Twitter all come from lib/offerPages.js,
// which is also where the brand-suffix opt-out lives and is explained.
const PAGE = OFFER_PAGES.founding;
const { url: URL } = PAGE;

// The standing of this company, in two columns, because the second column is
// the reason the offer below exists at all. Both lists are checkable.
const TRUE_TODAY = [
  "Over a decade in the executor seat, four and a half years of it as an agency COO.",
  "Six months building AI-first, under one rule, with no exceptions made.",
  "A published menu of eleven builds and six cleanup services, each with a price and a clock on it.",
  "An audit instrument that connects to more than twenty of the tools you already run.",
];

const NOT_YET = [
  "No Modern BizOps case study.",
  "No client logos and no testimonials.",
  "No reference at this company for you to call.",
  "No vertical pack published, because a pack waits for a real stack to shape it.",
];

// The signed terms, rendered. Every number comes from FOUNDING_TERMS and
// AUDIT_TERMS so a founding offer can never disagree with the published one.
const WHAT_YOU_GET = [
  {
    title: `The audit, still ${FOUNDING_TERMS.auditPrice}`,
    body: `Founding terms do not touch this number. You pay what anyone pays, and it still credits ${AUDIT_TERMS.creditPercent} toward ${AUDIT_TERMS.creditTarget} when you start within ${AUDIT_TERMS.creditWindow}. ${AUDIT_TERMS.guarantee}`,
  },
  {
    title: "The incentive, on the first build",
    body: `Founding terms are ${FOUNDING_TERMS.buildDiscount}, plus ${FOUNDING_TERMS.carePlanIncluded}. The ${CARE_PLAN.name} is the monitoring, the fixes and the monthly optimization pass that keep a shipped system from drifting.`,
  },
  {
    title: "One seat per industry",
    body: `${FOUNDING_TERMS.perVertical} When an industry is taken, these terms come off the table for that industry, and the next company in it pays the published prices.`,
  },
];

// The other half of the trade. A founding client is buying a discount with
// proof, so what we ask for is stated as plainly as what we give.
const WHAT_WE_ASK = [
  {
    title: "A named automation owner",
    body: "One person at your company owns the system after we hand it over. That is a requirement on every build we do. On a founding build it is also what makes the write-up possible, because somebody has to be accountable for the numbers we publish.",
  },
  {
    title: "The outcome written up, with real numbers",
    body: "We measure the before, we measure the after, and we write it up as a case study with the actual figures in it. You read every line and approve it before it goes anywhere.",
  },
  {
    title: "A review on a company surface",
    body: "One review at the end, on a surface where other buyers can find it, and only if the work earned it. We do not ask on day one and we do not write it for you.",
  },
];

// The five objections a first client actually brings. Single source for the
// accordion and the FAQPage JSON-LD, so the two cannot drift.
const FAQ = [
  {
    q: "Are we the guinea pig here?",
    a: `You would be first at being a Modern BizOps client, and that is what the founding terms are paying you for. The audit instrument and the build menu already exist and already run. They are six months of full-time work, built by somebody with over a decade in the executor seat and four and a half years of that as an agency COO.`,
  },
  {
    // The body copy two screens up already argues why a paid diagnosis stays
    // honest. This answer used to repeat that argument almost word for word, so
    // it now answers the question actually asked: why the discount lands where
    // it does. Same signed terms, different information.
    q: "Why is the audit not discounted as well?",
    a: `Because the discount is worth more where the money is. The ${audit.name} stays at ${audit.price} and a first build is several times that, so ${FOUNDING_TERMS.buildDiscount} beats the same percentage off the diagnosis. The audit still credits ${AUDIT_TERMS.creditPercent} toward ${AUDIT_TERMS.creditTarget}, so the fee comes back to you either way.`,
  },
  {
    q: "How public is public?",
    a: "Public enough to be checkable. You are named as a founding client, the write-up carries real numbers you approved, and a review goes on a company surface at the end. If your business cannot be named, tell us on the call. It usually means these are not the right terms for you, and the published prices are still there.",
  },
  {
    q: "What if my industry is not one of the six?",
    a: "Then the menu and the audit still apply and you should book the call anyway. The six are where the first builds go, because we know the systems of record inside them and a vertical pack has to be shaped by a real stack. If you are outside them, we will tell you plainly on the call whether we are the right people for the work.",
  },
  {
    q: "What happens if the build does not deliver?",
    a: "The scope is fixed and written before the work starts, so an overrun costs you nothing and there is no change order. The systems, the data and the runbook are yours, and every retainer carries a quarterly out, so the longest commitment is three months. A founding client is not signing a longer leash than anyone else. If it does not work, the write-up says that too.",
  },
];

export const metadata = PAGE.metadata;

export default function FoundingClientsPage() {
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
      { "@type": "ListItem", position: 2, name: "Founding Clients", item: URL },
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

  const schemas = [breadcrumbLd, faqLd];

  return (
    <>
      <Header />
      <main id="main-content">
        <LearnHero
          kicker="Founding Clients"
          h1="We are looking for our first client in six industries. On purpose, out loud."
          accentWord="first client"
          dek="The operator is not new. This company's client list is."
          motif="icpTarget"
          theme="navy"
          cta={
            <div className="flex flex-col items-start gap-2.5">
              <Button href="/book" ctaLocation="founding_clients_hero">
                Book a call
              </Button>
              <span className="max-w-[42ch] text-[13px] leading-snug text-text-light">
                {FOUNDING_TERMS.perVertical} The call is where we work out
                whether yours is the fit.
              </span>
            </div>
          }
        />

        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px]">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              Where this company actually is
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
              Six months of building. No client stories yet.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                Our founder spent over a decade in the executor seat, four and a
                half years of it as an agency COO. In January he left iExcel and
                gave himself one rule: build everything with AI, or do not build
                it at all.
              </p>
              <p>
                Six months of that produced what you can read on the rest of
                this site: a menu of named builds with published prices on them,
                the six cleanup services that come first, and an audit that
                computes its answer out of your own systems. What it has not
                produced is a single Modern BizOps case study, because the
                company is six months old and we are not going to invent one.
              </p>
              <p className="text-navy font-medium">
                So we are doing the version that survives a diligence-heavy
                buyer. We are looking for one founding client in each of six
                industries. You get the terms below. We get the first case study
                this company can point at. Both halves are written down before
                anybody signs anything.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 max-w-[900px]">
            <div className="bg-white border border-border rounded-[14px] p-6 md:p-7">
              <p className="font-display text-xl font-semibold text-navy mb-4">
                True today
              </p>
              <ul className="space-y-3">
                {TRUE_TODAY.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 font-body text-[15px] text-text-mid leading-relaxed"
                  >
                    <span aria-hidden="true" className="mt-[7px] text-amber">
                      &bull;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-border rounded-[14px] p-6 md:p-7">
              <p className="font-display text-xl font-semibold text-navy mb-4">
                Not true yet
              </p>
              <ul className="space-y-3">
                {NOT_YET.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 font-body text-[15px] text-text-mid leading-relaxed"
                  >
                    <span aria-hidden="true" className="mt-[7px] text-amber">
                      &bull;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              The six
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              Each of these six industries has one build we start with.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                These are the industries where we know the system of record and
                the one pipeline the whole business runs on. Each has an anchor
                build, and the founding client in that industry is the company
                it gets built for first.
              </p>
              <p>
                The anchor build is where a vertical starts. The whole{" "}
                <Link
                  href="/ai-automation-services"
                  className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
                >
                  menu
                </Link>{" "}
                is open to a founding client, cleanup services included, and the
                audit is what decides which one goes first.
              </p>
              <p>{FOUNDING_TERMS.perVertical}</p>
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
        </Section>

        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              What you get
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              The discount lands on the first build.
            </h2>
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
              Everything on the pricing page still applies to a founding client.
              Two things change, and one constraint comes with them.
            </p>
          </div>

          <ul className="grid gap-5 md:grid-cols-3">
            {WHAT_YOU_GET.map((term) => (
              <li
                key={term.title}
                className="bg-white border border-border rounded-[14px] p-6"
              >
                <p className="font-display text-lg font-semibold text-navy mb-2">
                  {term.title}
                </p>
                <p className="font-body text-[15px] text-text-mid leading-relaxed">
                  {term.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-9 max-w-[760px] space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
            <p>
              The audit is deliberately not the discount. A free diagnosis has
              to sell you something to pay for itself, and at that point it is
              not a diagnosis any more. Paying for it is what buys you a finding
              that can tell you no.
            </p>
            <p>
              Every other number is on the{" "}
              <Link
                href="/ai-automation-services"
                className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
              >
                services and pricing page
              </Link>
              , unchanged, so you can check exactly what the founding terms move
              and what they do not.
            </p>
          </div>
        </Section>

        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              What we ask back
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              The other half of the trade.
            </h2>
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
              The discount buys proof, so three things have to be true on your
              side before the work starts.
            </p>
          </div>

          <ul className="grid gap-5 md:grid-cols-3">
            {WHAT_WE_ASK.map((ask) => (
              <li
                key={ask.title}
                className="bg-cream rounded-[14px] p-6 flex flex-col"
              >
                <p className="font-display text-lg font-semibold text-navy mb-2">
                  {ask.title}
                </p>
                <p className="font-body text-[15px] text-text-mid leading-relaxed">
                  {ask.body}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-9 max-w-[760px] font-body text-text-mid text-base md:text-lg leading-relaxed">
            All of it is on this page before the call, because the write-up is
            the part of this trade that is easiest to spring on somebody late.
            If you read it now and it is a problem, say so on the call and we
            will quote you the published prices.
          </p>
        </Section>

        <Section bg="cream" narrow>
          <h2 className="mb-6 text-center font-display text-3xl font-semibold text-navy">
            Questions a first client asks
          </h2>
          <MaturityFaq items={FAQ} />
        </Section>

        {/* A plain band rather than a <Section>: CtaCallout already carries its
            own max-width, centering and vertical margin, and cancelling
            Section's py-16 with a py-0 in the same class string leaves the
            winner to Tailwind's stylesheet order. Same note as the three offer
            pages. */}
        <div className="bg-white px-6 py-6 md:px-8 md:py-10">
          <CtaCallout
            eyebrow="One per industry"
            heading="Book the call and take your industry."
            body="Every price is published, so there is nothing left to quote. The call is where we work out whether your business is the right first one in its industry, and we will say so plainly if it is not."
            buttonLabel="Book a call"
            href="/book"
            ctaLocation="founding_clients_foot"
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
