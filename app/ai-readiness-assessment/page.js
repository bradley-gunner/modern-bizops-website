import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import LearnHero from "@/components/learn/LearnHero";
import ContrastColumns from "@/components/learn/ContrastColumns";
import CtaCallout from "@/components/learn/CtaCallout";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import {
  LADDER,
  AUDIT_TERMS,
  GTM_HIRE_COMPARISON,
  offerPriceFields,
} from "@/lib/offers";
import { OFFER_PAGES } from "@/lib/offerPages";

// The money door. Every other surface on the site walks a buyer here, so this
// page has one job: make a paid diagnosis feel like the cheap, obvious step
// before a much larger decision.
//
// Every number on it interpolates from lib/offers.js. Nothing is typed twice.
const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));
const audit = rung.audit;

// Title, description, canonical, OG and Twitter all come from lib/offerPages.js,
// which is also where the brand-suffix opt-out lives and is explained.
const PAGE = OFFER_PAGES.audit;
const { url: URL, description: DESCRIPTION } = PAGE;

// What operations debt looks like on a screen, rather than as a concept. These
// are deliberately different examples from the homepage failure modes: that
// section names how a pilot dies, this one names what an auditor finds.
const DEBT_SYMPTOMS = [
  "Half the contacts are missing the one field an automation would need to make a decision.",
  "Two pipeline stages mean the same thing, so the forecast is really a guess with a number on it.",
  "The handoff between marketing and sales happens in a direct message that nobody can search.",
];

const STEPS = [
  {
    label: "We connect to the stack you already run",
    body: "You authorize read access to the systems that carry your revenue: the CRM, the marketing platform, the billing system, the support desk. More than twenty tools connect. Nobody on your team has to grade themselves.",
  },
  {
    label: "We compute a heat map and an AI Readiness Profile",
    body: "Sixty competencies scored across the four stages of the maturity framework. Forty-four of them are computed from what your systems record; the other sixteen we score with you on the call, supported by what your public surfaces show. Beside it sits an AI Readiness Profile across six dimensions. That profile is what decides whether automation holds once it ships.",
  },
  {
    label: "You get a ranked automation map, priced",
    body: "A ranked list of what to automate first, what has to be fixed before any of it will hold, and what the top items cost. Those prices come off the published menu with this fee already credited against them.",
  },
];

const TERMS = [
  {
    title: `Fixed price: ${audit.price}`,
    body: "That is the whole fee. It is set before the work starts and it does not move with what we find.",
  },
  {
    title: `Credited forward: ${AUDIT_TERMS.creditPercent}`,
    body: `The full fee comes off ${AUDIT_TERMS.creditTarget}, as long as you start within ${AUDIT_TERMS.creditWindow}.`,
  },
  {
    title: "Findings guarantee",
    body: `${AUDIT_TERMS.guarantee} Building any of it with us is a separate decision, and the maps are yours either way.`,
  },
];

// The four objections a buyer brings to a paid diagnosis, in the order they
// arrive: sunk cost, the pilot that already failed, what it means for the team,
// and what happens after. This array is the single source for both the visible
// accordion and the FAQPage JSON-LD, so the two cannot drift.
const FAQ = [
  {
    q: `Is the ${audit.price} wasted if we do not build anything?`,
    a: `No. It credits ${AUDIT_TERMS.creditPercent} toward ${AUDIT_TERMS.creditTarget} if you start within ${AUDIT_TERMS.creditWindow}, and the heat map and the automation map are yours whether you build with us or not. If we find nothing worth building, you get the fee back. The only way it becomes money lost is if you file it and do nothing.`,
  },
  {
    q: "We already ran an AI pilot and it did not work.",
    a: "Then you are the buyer this was designed for. A pilot usually dies because the foundation could not carry what was built on it, and nobody checked the foundation first. This checks first. If your stack cannot carry the thing you want, you learn that before you pay for the build.",
  },
  {
    q: "Is this about replacing our team with AI?",
    a: "No. The work we automate is retyping, chasing, sorting and remembering. Nobody on your team wanted that work. Every build we scope also names one person on your side who owns it afterwards, and we ask for that name before the work starts.",
  },
  {
    q: "What stops this from turning into a permanent dependency?",
    a: "The audit is a one-time fee, not a subscription, and it ends with a document you own. Nothing in it obliges you to buy the next thing. Take the ranked map to your own team or to another firm and it still works. There is no Modern BizOps product named anywhere in it.",
  },
];

export const metadata = PAGE.metadata;

export default function AiReadinessAssessmentPage() {
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
      { "@type": "ListItem", position: 2, name: audit.name, item: URL },
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

  // The published price is the differentiation, so it belongs in the structured
  // data too, as a real Offer rather than prose a crawler has to infer.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: audit.name,
    serviceType: "AI readiness assessment",
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
    offers: {
      "@type": "Offer",
      url: URL,
      availability: "https://schema.org/InStock",
      // A single one-time fee, so this resolves to a flat `price`. The helper
      // is what keeps the shape right if the fee ever becomes a band.
      ...offerPriceFields(audit.price),
    },
  };

  const schemas = [breadcrumbLd, faqLd, serviceLd];

  return (
    <>
      <Header />
      <main id="main-content">
        <LearnHero
          kicker="AI Readiness Assessment"
          h1={`The ${audit.name}`}
          accentWord="Audit"
          dek="The honest diagnosis before you spend another dollar on AI."
          motif="dataIntegrityGrid"
          theme="navy"
          cta={
            <div className="flex flex-col items-start gap-2.5">
              <Button href="/book" ctaLocation="audit_hero">
                Book a call
              </Button>
              <span className="max-w-[42ch] text-[13px] leading-snug text-text-light">
                {audit.price}, credited in full toward what you build next. The
                call confirms your fit and your scope.
              </span>
            </div>
          }
        />

        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px]">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              Why a diagnosis comes first
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
              The debt was cheap until AI made it expensive.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                For years the messy system of record was an annoyance you could
                route around. A field nobody fills in, a stage that means
                something different to every rep, a process that lives in one
                head and nowhere else. The business grew anyway, so the cleanup
                kept losing to whatever was on fire that week.
              </p>
              <p>
                AI repriced that. Software that acts on your behalf can only act
                on what your systems actually say. Where the record is wrong, it
                is wrong faster and with more confidence than the person it
                replaced. Where the process was never written down, there is
                nothing to automate except a guess about how the work gets done.
              </p>
              <p className="text-navy font-medium">
                We start on your systems. What they can carry today, and what is
                broken enough to stop a build from working. That question gets
                answered before anybody picks a tool.
              </p>
            </div>

            <ul className="mt-9 space-y-3">
              {DEBT_SYMPTOMS.map((symptom) => (
                <li
                  key={symptom}
                  className="flex gap-3 font-body text-[15px] md:text-base text-text-mid leading-relaxed"
                >
                  <span aria-hidden="true" className="mt-[7px] text-amber">
                    &bull;
                  </span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mb-10">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              How it works
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              Three steps. You authorize, we compute, you get the map.
            </h2>
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
              You authorize read access and the numbers come out of your own
              systems. You should be able to disagree with a finding and still
              trust where it came from.
            </p>
          </div>

          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.label}
                className="bg-cream rounded-[14px] p-6 flex flex-col"
              >
                <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-xl font-semibold text-navy mt-2 mb-2">
                  {step.label}
                </p>
                <p className="font-body text-[15px] text-text-mid leading-relaxed">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-9 max-w-[760px] font-body text-text-mid text-base md:text-lg leading-relaxed">
            The prices on the automation map are the same ones anybody can read
            on the{" "}
            <Link
              href="/ai-automation-services"
              className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
            >
              builds menu
            </Link>
            .
          </p>
        </Section>

        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px]">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              What makes it different
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
              We looked for a firm that reads the stack. We did not find one.
            </h2>
            <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                Plenty of firms will sell you an AI strategy engagement. They
                interview your team, run a workshop, and hand back a deck built
                out of what people said in the room.
              </p>
              <p>
                Nobody is lying in that room. People describe the process they
                were trained on, and the process running on a Tuesday afternoon
                in a busy quarter is a different thing. Your systems have a
                record of the second one.
              </p>
            </div>
          </div>

          <div className="max-w-[900px]">
            <ContrastColumns
              label="Same question, two methods"
              title="What the answer is actually built from"
              leftTitle="The strategy workshop"
              leftItems={[
                "Asks your team how the work is supposed to run.",
                "Gets the version people say in front of their boss.",
                "Returns a deck assembled from what people said.",
                "Priced as a report, and it ends when the report lands.",
              ]}
              rightTitle={audit.name}
              rightItems={[
                "Connects to more than twenty of the tools you already run.",
                "Reads field completeness, stage discipline, and where records go quiet.",
                "Scores 60 competencies, 44 straight out of what your systems already record and 16 scored with you on the call.",
                "Returns a ranked, priced map, and the fee credits into building it.",
              ]}
            />
          </div>
        </Section>

        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mb-9">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              What you are really choosing between
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
              Compare it to the hire you were considering.
            </h2>
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
              The seat that does this work has a name now, and a market rate
              that goes with it. The hard part is that you place that bet before
              you know what the work is.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 max-w-[900px]">
            <div className="bg-cream rounded-[14px] p-7">
              <p className="font-display text-xl font-semibold text-navy mb-1">
                A {GTM_HIRE_COMPARISON.role}
              </p>
              <p className="font-body text-sm font-semibold text-text-light mb-3">
                About {GTM_HIRE_COMPARISON.salary}
              </p>
              <p className="font-body text-[15px] text-text-mid leading-relaxed">
                Before tools, recruiting and ramp. You commit to the salary
                first and find out what should have been built second.
              </p>
            </div>
            <div className="bg-navy rounded-[14px] p-7 text-white">
              <p className="font-display text-xl font-semibold mb-1">
                {audit.name}
              </p>
              <p className="font-body text-sm font-semibold text-amber-light mb-3">
                {audit.price}
              </p>
              <p className="font-body text-[15px] text-white/80 leading-relaxed">
                It shows what the first{" "}
                {GTM_HIRE_COMPARISON.firstAutomationBudget} of automation should
                be, computed from your actual stack, and the fee credits in full
                toward building it.
              </p>
            </div>
          </div>

          <p className="mt-9 max-w-[760px] font-body text-text-mid text-base md:text-lg leading-relaxed">
            If the answer turns out to be that you should hire, that is a fine
            outcome and we will say so. The ranked map is what your new hire
            starts from on day one. It saves them a quarter of working out where
            the bodies are buried.
          </p>
        </Section>

        <Section bg="cream" narrow={false}>
          <div className="max-w-[760px] mb-9">
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
              The terms, in full
            </p>
            <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
              Published, so there is nothing to negotiate.
            </h2>
            <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
              The audit has to be able to tell you no. That is what the three
              terms below are for, and they are the same for everybody.
            </p>
          </div>

          <ul className="grid gap-5 md:grid-cols-3">
            {TERMS.map((term) => (
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

          <p className="mt-9 max-w-[760px] font-body text-text-mid text-base md:text-lg leading-relaxed">
            How you start: book a call. We agree the scope on that call and
            invoice from there. Every other number you might want first is
            already published on the{" "}
            <Link
              href="/pricing"
              className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
            >
              pricing page
            </Link>
            .
          </p>
        </Section>

        <Section bg="white" narrow>
          <h2 className="mb-6 text-center font-display text-3xl font-semibold text-navy">
            Questions people ask before they book
          </h2>
          <MaturityFaq items={FAQ} />
        </Section>

        {/* Deliberately not a <Section>. CtaCallout brings its own max-width,
            centering and vertical margin, so a Section would need py-0 to
            cancel its own py-16, and both would sit in one class string where
            Tailwind's stylesheet order, not source order, picks the winner.
            The padding here also stops the callout's own margin collapsing
            out of the band. */}
        <div className="bg-cream px-6 py-6 md:px-8 md:py-10">
          <CtaCallout
            eyebrow="Start here"
            heading="Book the call and we will scope the audit."
            body="The price is published, so there is nothing to negotiate on the call. We work out the scope with you, and if the audit is the wrong next step right now, we will say so."
            buttonLabel="Book a call"
            href="/book"
            ctaLocation="audit_foot"
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
