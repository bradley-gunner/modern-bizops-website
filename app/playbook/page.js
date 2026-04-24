import Link from "next/link";
import Image from "next/image";
import PlaybookForm from "./PlaybookForm";

export const metadata = {
  title: "The Revenue Without Headcount Playbook",
  description:
    "7 operational frameworks to grow revenue without adding headcount. Used by $3M-$15M founders to fix broken go-to-market systems.",
  alternates: {
    canonical: "https://modernbizops.com/playbook",
  },
  openGraph: {
    title: "The Revenue Without Headcount Playbook",
    description:
      "7 operational frameworks to grow revenue without adding headcount. Free download.",
    url: "https://modernbizops.com/playbook",
    images: [
      {
        url: "https://modernbizops.com/og/og-playbook.png",
        width: 1200,
        height: 630,
        alt: "Modern BizOps - The Revenue Without Headcount Playbook, 7 Chapters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Revenue Without Headcount Playbook",
    description:
      "7 chapters of operational frameworks for $3M-$15M companies. Free download.",
    images: ["https://modernbizops.com/og/og-playbook.png"],
  },
};

const WHAT_YOU_GET = [
  {
    title: "The GTM Flywheel Audit",
    body: "Map your entire revenue engine and pinpoint the friction slowing growth before you spend another dollar on headcount.",
  },
  {
    title: "The Sales-Marketing SLA",
    body: "Fix the handoff between sales and marketing. Define shared accountability and stop letting qualified leads fall through the cracks.",
  },
  {
    title: "The Inspectable Sales Process",
    body: "Pipeline stages with clear exit criteria so revenue becomes forecastable. Includes a real example: sales cycle cut from 47 to 26 days.",
  },
  {
    title: "Tech Stack and Data Governance",
    body: "Audit your tools, eliminate overlap, and ensure your data is clean enough to make good decisions.",
  },
  {
    title: "The Client Lifecycle Playbook",
    body: "Structured onboarding, retention, and expansion frameworks. Includes a case study: churn reduced from 22% to 11%.",
  },
  {
    title: "Resource Utilization and Capacity",
    body: "Measure AE productivity and understand exactly when your team is at capacity. Know when to hire based on data, not gut feel.",
  },
  {
    title: "The Capital-Efficient Growth Scorecard",
    body: "A 15-question self-assessment across all 7 dimensions. See where you stand and where to focus. Includes a case study: pipeline value up 22% in 60 days.",
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
            width={560}
            height={152}
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
                The Revenue Without Headcount Playbook
              </h1>

              <p className="font-body text-lg md:text-xl text-text-mid mb-8 leading-relaxed">
                7 operational frameworks to grow revenue without adding
                headcount. Used by $3M-$15M founders to fix broken
                go-to-market systems.
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

              {/* What the PDF delivers */}
              <div className="mt-10 bg-navy/5 border border-navy/10 rounded-[10px] p-6">
                <h3 className="font-display text-navy text-[18px] font-semibold mb-4">
                  Also included in the PDF
                </h3>
                <ul className="space-y-2">
                  {[
                    "A 15-question self-assessment with scoring across all 7 dimensions",
                    "7 detailed case studies with real metrics",
                    "A framework diagram showing how the 7 systems connect",
                    "Diagnostic checklists for each chapter",
                    "A curated resources section",
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
              More revenue does not require more people
            </h2>
            <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed">
              Most $3M-$15M founders are sitting on a broken go-to-market
              system. Leaky pipelines, misaligned teams, tools that do not
              talk to each other. Fixing those systems compounds faster than
              adding headcount. This playbook shows you exactly how.
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
