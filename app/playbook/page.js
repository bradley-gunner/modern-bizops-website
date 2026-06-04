import Link from "next/link";
import Image from "next/image";
import PlaybookForm from "./PlaybookForm";

export const metadata = {
  title: "The Revenue Maturity Playbook — Free Download",
  description:
    "A stage-by-stage framework to grow revenue without adding headcount. Used by $3M–$15M B2B founders to build predictable, capital-efficient growth systems.",
  alternates: {
    canonical: "https://modernbizops.com/playbook",
  },
  openGraph: {
    title: "The Revenue Maturity Playbook",
    description:
      "A stage-by-stage framework to grow revenue without adding headcount. Free download.",
    url: "https://modernbizops.com/playbook",
    images: [
      {
        url: "https://modernbizops.com/og/og-playbook.png",
        width: 1200,
        height: 630,
        alt: "Modern BizOps — The Revenue Maturity Playbook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Revenue Maturity Playbook",
    description:
      "A stage-by-stage framework for $3M–$15M companies. Free download.",
    images: ["https://modernbizops.com/og/og-playbook.png"],
  },
};

const WHAT_YOU_GET = [
  {
    title: "Define Your Ideal Customer",
    body: "Stop selling to everyone. Encode a precise ICP in your CRM and qualification criteria so every deal you pursue is worth winning.",
  },
  {
    title: "Make Your Pipeline Inspectable",
    body: "Replace gut instinct with buyer-verified stage gates. Includes a real example: sales cycle cut from 58 to 34 days, forecast variance from 30% to 12%.",
  },
  {
    title: "Build the Operating Rhythm",
    body: "End the marketing-vs-sales blame game with shared definitions, SLAs, and a weekly cross-functional cadence that produces decisions.",
  },
  {
    title: "Fix the Post-Sale System",
    body: "Structured handoff, standardized onboarding, and a health scoring model. Includes a case study: annual churn cut from 19% to 9%.",
  },
  {
    title: "Automate Before You Hire",
    body: "Recover capacity through AI and automation before adding headcount. Revenue per employee as the metric that separates compounding from linear growth.",
  },
  {
    title: "Reach Predictable Revenue",
    body: "Unit economics by channel, a unified revenue dashboard, and a growth scorecard. Measure what makes the business more valuable, not just bigger.",
  },
];

export default function PlaybookPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Minimal header */}
      <div className="px-6 md:px-8 py-5">
        <Link href="/">
          <Image
            src="/logos/horizontal-full-color-light.png"
            alt="Modern BizOps"
            width={330}
            height={90}
            sizes="(max-width: 768px) 180px, 300px"
            className="h-14 md:h-[88px] w-auto"
            priority
          />
        </Link>
      </div>

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-[1100px] px-6 md:px-8 pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="grid md:grid-cols-[1fr_400px] gap-12 md:gap-16 items-start">
            {/* Left: copy */}
            <div>
              <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
                Free Playbook
              </p>

              <h1 className="font-display text-[36px] md:text-[52px] leading-tight font-semibold text-navy mb-6">
                The Revenue Maturity Playbook
              </h1>

              <p className="font-body text-lg md:text-xl text-text-mid mb-8 leading-relaxed">
                A stage-by-stage framework to grow revenue without adding
                headcount. Used by $3M–$15M B2B founders to build predictable,
                capital-efficient growth systems.
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
                {["Free PDF", "Instant download", "No fluff"].map((item) => (
                  <span
                    key={item}
                    className="font-body text-sm text-text-mid flex items-center gap-1.5"
                  >
                    <span className="text-amber font-bold">&#10003;</span>
                    {item}
                  </span>
                ))}
              </div>

              {/* What you get */}
              <h2 className="font-display text-navy text-[22px] md:text-[28px] font-semibold mb-6">
                What is inside
              </h2>
              <div className="space-y-5">
                {WHAT_YOU_GET.map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">&#10003;</span>
                    </span>
                    <div>
                      <p className="font-body font-semibold text-text-primary">
                        {item.title}
                      </p>
                      <p className="font-body text-sm text-text-mid mt-0.5 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Also included */}
              <div className="mt-10 bg-navy/5 border border-navy/10 rounded-[10px] p-6">
                <h3 className="font-display text-navy text-[18px] font-semibold mb-4">
                  Also included in the PDF
                </h3>
                <ul className="space-y-2">
                  {[
                    "A 16-question self-assessment that places you in one of the 4 maturity stages",
                    "6 Riverline Group case studies with real before/after metrics",
                    "The Four Maturity Stages diagram with stage-exit boundary criteria",
                    "A one-page maturity cheat sheet showing the work at each stage",
                    "Scorecard and discovery call CTAs linking to modernbizops.com",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <span className="text-amber font-bold mt-0.5">&#10003;</span>
                      <span className="font-body text-sm text-text-mid">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: form */}
            <div className="md:sticky md:top-8">
              <PlaybookForm />
            </div>
          </div>
        </section>

        {/* PAIN SECTION */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-14 md:py-20 text-center">
            <h2 className="font-display text-[26px] md:text-[36px] font-semibold text-cream mb-5">
              Every dollar of growth should not require another hire
            </h2>
            <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed">
              Most $3M–$15M founders are operating at Stage 1 or Stage 2 of the
              revenue maturity model without knowing it. The framework in this
              playbook maps exactly where you are and what to build next to reach
              predictable, capital-efficient growth.
            </p>
          </div>
        </section>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border px-6 py-4 text-center bg-cream">
        <div className="flex justify-center gap-6">
          <Link
            href="/privacy"
            className="font-body text-xs text-text-light hover:text-text-mid transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="font-body text-xs text-text-light hover:text-text-mid transition-colors"
          >
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
