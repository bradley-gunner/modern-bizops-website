import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import LearnHero from "@/components/learn/LearnHero";
import CtaCallout from "@/components/learn/CtaCallout";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import {
  BUILDS,
  CLEANUP_SERVICES,
  LADDER,
  TRAINING,
  CARE_PLAN,
  AUDIT_TERMS,
  UPLIFT_RULE,
  CLEANUP_PRICE_FLOOR,
  AUDIENCE_BAND,
  PARTNER_SYSTEM_LIMIT,
  carePlanMonthly,
  offerPriceFields,
} from "@/lib/offers";
import { OFFER_PAGES } from "@/lib/offerPages";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

const PAGE = OFFER_PAGES.services;
const { url: URL, description: DESCRIPTION } = PAGE;

// THIS PAGE IS THE MERGE OF /ai-automation-services AND /pricing (2026-09-01).
//
// David Ellis (Tugboat) reviewed the site on 2026-08-24 and found the two pages
// about 90% the same content, which they were: both listed the ladder, both
// explained the uplift rule, both argued the published-price position. Board
// item web-trim-density. Bradley chose the merge over keeping both, and this
// slug survived because it is the one that can eventually carry the category
// noun in search. /pricing 301s here in next.config.mjs, and the nav still says
// "Pricing" because that word is the trust signal, not the URL.
//
// Neither page had equity to protect: Search Console, three months to
// 2026-08-31, recorded one impression at position 62 for this page and no rows
// at all for /pricing.
//
// KEEP THIS PAGE TO ONE JOB: what you can buy, what it costs, and what the
// number includes. Anything arguing WHY the audit works belongs on
// /ai-readiness-assessment. Anything arguing the operations-debt pillar belongs
// on the homepage. Duplicating either back into here is how the two pages
// became one page's worth of content spread over two in the first place.

// The stacking arithmetic, computed rather than typed, so a Care Plan price
// change cannot leave a stale number in the table.
const SYSTEM_WORDS = ["one", "two", "three", "four", "five"];
const CARE_PLAN_MATH = Array.from({ length: PARTNER_SYSTEM_LIMIT }, (_, i) => ({
  systems: i + 1,
  label: `${SYSTEM_WORDS[i][0].toUpperCase()}${SYSTEM_WORDS[i].slice(
    1
  )} system${i === 0 ? "" : "s"}`,
  carePlan: carePlanMonthly(i + 1),
}));
const PARTNER_LIMIT_WORD = SYSTEM_WORDS[PARTNER_SYSTEM_LIMIT - 1];

const LADDER_NOTES = {
  scan: "No call, no card, and no obligation to do anything with the result.",
  audit: `The credit also applies to your first Partner month, and it holds for ${AUDIT_TERMS.creditWindow}. ${AUDIT_TERMS.guarantee}`,
  builds: `That price covers one system of record and one funnel. A second of either adds ${UPLIFT_RULE.addition}, and the ceiling is ${UPLIFT_RULE.cap}.`,
  partner: `Includes the ${CARE_PLAN.name} work on every system it covers. Quarterly out.`,
  "partner-plus": "Same terms as the Partner plan, including the quarterly out.",
};

// The terms, which used to run under the headline "Five things that are true of
// every build and every retainer." Ellis's slide 9 finding was that the site
// stacks numbered constructs until none of them stick, so the count came out of
// the headline. The five items did not change.
const TERMS = [
  {
    title: "Fixed scope, written first",
    body: "What the build includes, and what it does not, is agreed before the work starts. If it takes us longer than we said, that is our cost. You will not see a change order.",
  },
  {
    title: "A named owner on your side",
    body: "Every build requires one person at your company who owns the system afterwards. We do not start without that name. Automation nobody owns drifts, and you keep paying for it while it does.",
  },
  {
    title: "Runbooks handed over",
    body: "How it works, how to change it, and what to do when it breaks, written down and handed to that owner on the day the build ships.",
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

const FAQ = [
  {
    q: "How do I avoid getting locked in?",
    a: "Fixed scope, your systems, your data, and the runbook handed over when a build ships. Retainers carry a quarterly out. Nothing we build lives on infrastructure you cannot reach without us, and the end of the engagement is written into the scope document on day one. When it is done, you do not need us.",
  },
  {
    q: "Do I have to buy the cleanup before the build?",
    a: "Only where the build needs it, and the audit is what tells you which ones do. Plenty of companies arrive with a system of record already good enough to build on. Where that is not true, we will say so, and you can buy the cleanup item on its own and stop there.",
  },
  {
    q: "Why not use a freelancer or a cheaper agency?",
    a: "A freelancer will usually be cheaper per hour, and for one clean automation on a system that already works, that can be the right call. What you are paying for here is the diagnosis that says which automation is worth building at all, a fixed price instead of an hourly meter, and a runbook so the build outlives the person who made it. If your foundation is already sound and you know exactly what you want, hire the freelancer. We will tell you that on the call.",
  },
  {
    q: "Is the price really fixed?",
    a: `Yes, with one published exception. The listed price on a build is the base pattern: one system of record and one funnel. A second of either adds ${UPLIFT_RULE.addition}, and the ceiling is ${UPLIFT_RULE.cap}. That rule is on this page, in public, where you can read it before you sign anything.`,
  },
  {
    q: "Why publish prices at all?",
    a: "Because a price you have to ask for is a price that changes with who is asking. Publishing them means you can rule us out in two minutes without spending an hour on a call to do it, and it means the call can be about whether this fits your business. You already know what it costs.",
  },
];

export const metadata = PAGE.metadata;

// One card shape for both menus, so the foundation half and the automation half
// read as two parts of one price list rather than two competing systems.
function MenuItem({ item }) {
  return (
    <li className="bg-white border border-border rounded-[14px] p-6 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
        <div className="md:max-w-[62ch]">
          <p className="font-display text-xl font-semibold text-navy mb-2">
            {item.name}
          </p>
          <p className="font-body text-[15px] text-text-mid leading-relaxed">
            {item.scope}
          </p>
          {item.note && (
            <p className="mt-3 font-body text-[14px] text-text-light leading-relaxed">
              {item.note}
            </p>
          )}
          {item.honestScope && (
            <p className="mt-4 rounded-[10px] border border-amber/30 bg-amber-pale px-4 py-3 font-body text-[14px] text-text-primary leading-relaxed">
              {item.honestScope}
            </p>
          )}
        </div>
        <div className="shrink-0 md:text-right">
          <p className="font-display text-2xl font-semibold text-navy">
            {item.price}
          </p>
          <p className="font-body text-sm text-text-light">{item.clock}</p>
        </div>
      </div>
    </li>
  );
}

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
        name: "Services and pricing",
        item: URL,
      },
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

  const toOffer = (item) => ({
    "@type": "Offer",
    name: item.name,
    description: item.scope ?? `${item.price}. ${item.summary}`,
    url: URL,
    ...offerPriceFields(item.price),
  });

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modern BizOps AI automation services",
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
      audienceType:
        "B2B companies with a real sales motion, $1M to $50M revenue",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Published prices",
      itemListElement: [
        ...LADDER,
        TRAINING,
        CARE_PLAN,
        ...CLEANUP_SERVICES,
        ...BUILDS,
      ].map(toOffer),
    },
  };

  const schemas = [breadcrumbLd, faqLd, serviceLd];

  return (
    <>
      <Header />
      <main id="main-content">
        <LearnHero
          kicker="AI Automation Services"
          h1="Every price we charge is on this page"
          accentWord="Every price"
          dek="Six services that fix the foundation, eleven that automate on top of it, and no number here that moves because of who is asking."
          // Back to the motif this page already shipped with. Every motif in
          // the library carries a caption baked into the artwork, and none of
          // them argues this page's point: dataIntegrityGrid says "DATA DECAYS
          // WHETHER OR NOT YOU ARE WATCHING", which is the audit page's
          // argument, not the price list's. "ONE MAP, END TO END" is the least
          // wrong of the fourteen. A hero image that actually belongs to this
          // page is part of the design pass (board item web-personality-design),
          // not something to fake by borrowing another page's caption.
          motif="lifecycleLoop"
          theme="navy"
        />

        {/* THE LADDER. One of the two numbered constructs this page is allowed
            (Ellis slide 9, board item web-framework-overload). The other is the
            menu below it. The revenue band in the opening paragraph is board
            item web-audience-legibility: Ellis spent an hour on the site and
            came away believing we serve $10M+ companies, which made Motion A of
            ICP v2 invisible. It is now the second sentence on the page. */}
        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              You can stop at any rung, and the first one costs nothing.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                These prices are built for {AUDIENCE_BAND.sentence}. Nearer
                the bottom of that band, most
                companies run the free Scan, buy the audit, and then buy one
                build. Nearer the top, the usual start is the audit and the team
                training together, with a retainer after that.
              </p>
              <p>Nothing here requires the next thing.</p>
            </div>
          </div>

          <ol className="space-y-4">
            {LADDER.map((item) => {
              const note = LADDER_NOTES[item.id];
              const linkable = item.href && item.href !== PAGE.path;
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
                      {note && (
                        <p className="mt-3 font-body text-[14px] text-text-light leading-relaxed">
                          {note}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 md:text-right">
                      <p className="font-display text-2xl font-semibold text-navy">
                        {item.price}
                      </p>
                      {linkable && (
                        <p className="mt-3">
                          <Link
                            href={item.href}
                            className="font-body text-sm font-semibold text-navy underline underline-offset-4 hover:text-amber transition-colors"
                          >
                            {item.id === "scan"
                              ? "Get the free Scan"
                              : "See what the audit computes"}
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 max-w-[760px] border-l-2 border-amber pl-5 md:pl-6">
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
              {TRAINING.name} is {TRAINING.price} and sits beside the ladder
              rather than on it. {TRAINING.summary}
            </p>
          </div>
        </Section>

        {/* THE MENU. Both halves, one shape. The cleanup half is new on
            2026-09-01: doc 26 signed six foundation services on 2026-08-27 and
            named "a future services page" as the surface that would carry them,
            and until now the site promised foundation work it did not sell. */}
        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
              The foundation first, then the automation on top of it.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                Every item below is one named piece of work at a fixed price, on
                a clock, with a runbook handed to a person on your side at the
                end. Your team owns it and we do not keep a login.
              </p>
              <p>
                The audit is what tells you which of these you need and in what
                order. Buying from the second list while the first list is still
                undone is how a pilot dies on a foundation nobody checked.
              </p>
            </div>
          </div>

          <div className="max-w-[900px]">
            <div className="mb-6">
              <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-3">
                Cleanup services, from {CLEANUP_PRICE_FLOOR}
              </p>
              <h3 className="font-display text-2xl md:text-[28px] font-semibold text-navy mb-3">
                Six ways a system gets ready to be automated.
              </h3>
              <p className="font-body text-text-mid text-base leading-relaxed max-w-[62ch]">
                Most companies need one or two of these, not all six. None of
                them promises a revenue number. What each one promises is that
                the specific thing blocking the automation reads fixed on the
                day it ships.
              </p>
            </div>
            <ol className="space-y-4">
              {CLEANUP_SERVICES.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </ol>

            <div className="mt-14 mb-6">
              <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-3">
                {rung.builds.name}, {rung.builds.price}
              </p>
              <h3 className="font-display text-2xl md:text-[28px] font-semibold text-navy mb-3">
                Eleven systems, each doing one job your team does by hand.
              </h3>
              <p className="font-body text-text-mid text-base leading-relaxed max-w-[62ch]">
                These sit on top of a foundation that already holds. Two of them
                carry a note in amber, because the honest scope is smaller than
                the name suggests and you should hear that before you pay.
              </p>
            </div>
            <ol className="space-y-4">
              {BUILDS.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </ol>
          </div>
        </Section>

        {/* THE FINE PRINT. The uplift rule and the Care Plan used to be two full
            sections on the old services page, each with three paragraphs around
            it. They are the same subject, which is what can change a number
            after you have already read one, so they run together here. */}
        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px] mb-9">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              The fine print, in public
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
              One rule moves a listed price, and you read it here rather than
              hear it on a call.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                Every listed price is the base pattern: one system of record,
                one funnel. That covers most companies at this size. A second
                system of record, or a second funnel that has to be built and
                maintained alongside the first, adds {UPLIFT_RULE.addition}. The
                ceiling is {UPLIFT_RULE.cap}, which is the top of the published
                band, so no scope conversation ends above the menu.
              </p>
              <p className="text-navy font-medium">
                If the audit finds a second system, you learn it before you
                commit to anything, and you see the adjusted number in writing.
              </p>
            </div>
          </div>

          <div className="max-w-[760px]">
            <h3 className="font-display text-2xl font-semibold text-navy mb-3">
              What keeps a build from drifting six months later
            </h3>
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed mb-7">
              The {CARE_PLAN.name} is {CARE_PLAN.price}. {CARE_PLAN.summary} A
              build without one still belongs to you and still works. Care Plans
              stack per system and the retainer does not, so on the monthly
              number alone the Care Plan is the cheaper line at every row below.
              We would rather you knew that.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-body text-[15px]">
                <caption className="sr-only">
                  What Care Plans cost as systems stack, next to the flat{" "}
                  {rung.partner.name} retainer
                </caption>
                <thead>
                  <tr className="border-b border-border text-left">
                    <th
                      scope="col"
                      className="py-3 pr-4 font-semibold text-navy"
                    >
                      What you are running
                    </th>
                    <th
                      scope="col"
                      className="py-3 pr-4 font-semibold text-navy"
                    >
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
                      <td className="py-3 pr-4 text-text-mid">
                        {row.carePlan}
                      </td>
                      <td className="py-3 text-text-mid">
                        {rung.partner.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-7 font-body text-text-mid text-base md:text-lg leading-relaxed">
              What the retainer buys that Care Plans do not is{" "}
              {PARTNER_LIMIT_WORD} systems getting better every month instead of
              staying alive, plus a working session with your team. If the
              monthly number is what matters most right now, take the Care Plan.
              There is no Care Plan on a cleanup service, because a cleanup
              service is not a system to keep running.
            </p>
          </div>
        </Section>

        {/* THE TERMS, and the newness reframe. Board item web-newness-risk.
            Ellis, reading as a buyer, named the thing standing between this
            site and his money as "lacking confidence that you can do what you
            claim", because the site says so about itself, explicitly, more than
            once.
            Every fact below is exactly as true as the sentence it replaced. What
            changed is that being new is now the REASON the terms are good rather
            than a confession placed in front of them. His second suggested
            remedy, describing the experience vaguely so it reads as ours, is
            REJECTED and must not be implemented: that is the iExcel attribution
            rule, and the same fabrication class as the two homepage result cards
            removed on 2026-07-14. */}
        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              What the price buys
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
              There is no case study on this page, so here is the contract
              instead.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                Modern BizOps is new. An established agency can charge you for
                trust it earned somewhere else, on work you will never see the
                inside of. We have to put ours in writing, which is why the
                terms below are the ones a buyer normally has to negotiate for.
              </p>
              <p>
                They are also why a price can be published at all. Fixed scope
                is only possible when the diagnosis comes first.
              </p>
            </div>
          </div>

          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TERMS.map((item) => (
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

          {/* Vertical packs used to be a six-card grid naming an anchor build in
              each. That was a third numbered construct on a page allowed two,
              and it sold something that does not exist yet, so it is now two
              sentences and a link to the page that does own it. */}
          <p className="mt-10 max-w-[760px] font-body text-text-mid text-base md:text-lg leading-relaxed">
            We are shaping this menu into industry packs for commercial field
            services, CPA firms, MSPs, law firms, staffing and insurance, one at
            a time, and each pack publishes only after a real audit in that
            industry proves what belongs in it. If you want yours built around
            your own stack, that is what the{" "}
            <Link
              href="/founding-clients"
              className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
            >
              founding client program
            </Link>{" "}
            is for.
          </p>
        </Section>

        <Section bg="cream" narrow>
          <h2 className="mb-6 text-center font-display text-3xl font-semibold text-navy">
            Questions about the money
          </h2>
          <MaturityFaq items={FAQ} />
        </Section>

        <div className="bg-white px-6 py-6 md:px-8 md:py-10">
          <CtaCallout
            eyebrow="Which one first"
            heading="The audit tells you which of these to buy, and in what order."
            body={`The ${rung.audit.name} ranks every item on this page against your actual stack, names the repairs that come before the first build, and credits its fee in full toward whatever you build first.`}
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
