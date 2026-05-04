/*
 * Best practices applied from CRO research:
 *
 * 1. NO NAVIGATION. Removed header nav to eliminate leakage on a conversion-
 *    focused funnel page (standard quiz-funnel CRO practice). Matches /watch pattern.
 *
 * 2. PAIN-FIRST HERO. Leads with the problem ("you can't fix what you can't see")
 *    before the solution. Outcome-focused headline vs. feature-focused.
 *
 * 3. ABOVE-THE-FOLD CTA. Primary button visible without scrolling on all breakpoints.
 *    Repeated at the bottom of the page to capture scrollers.
 *
 * 4. PERSONALIZED CTA COPY. "Get My Free Score" outperforms generic "Start Assessment"
 *    (personal phrasing lifts click-through in multiple A/B studies).
 *
 * 5. TANGIBLE DELIVERABLES SECTION. Shows the four concrete outputs (score, grade,
 *    friction report, email) rather than describing the process. Visitors need to see
 *    the artifact before they'll invest time.
 *
 * 6. DIMENSION GRID. Listing all 7 dimensions builds credibility and signals depth
 *    without overwhelming. B2B buyers want to know exactly what they're being assessed on.
 *
 * 7. 3-STEP HOW IT WORKS. Reduces commitment anxiety by showing the path is short.
 *    "17 questions" is a concrete number that manages time expectations.
 *
 * 8. TRUST BAR. Free + fast + no sales pitch. Addresses the three most common objections
 *    to filling in a diagnostic form.
 *
 * 9. SOCIAL PROOF. Anchors near the hero CTA so skeptical visitors see evidence before
 *    clicking. "15+ companies" matches the trust signal used across the site.
 *
 * UTM values follow the project's lowercase/underscore taxonomy:
 *   utm_source=website_modernbizops   internal source (this marketing site)
 *   utm_medium=internal_link          cross-property handoff to app subdomain
 *   utm_campaign=lm_scorecard         lead magnet, scorecard
 */

import Link from "next/link";
import Image from "next/image";
import ScorecardStartLink from "@/components/ScorecardStartLink";

export const metadata = {
  title: "Free Revenue Engine Health Score",
  description:
    "Answer 17 questions and get a free score across 7 revenue dimensions: GTM Strategy, Sales Alignment, Sales Process, Tech and Data, Client Lifecycle, Capacity, and Unit Economics.",
  alternates: {
    canonical: "https://modernbizops.com/scorecard",
  },
  openGraph: {
    title: "Get Your Free Revenue Engine Health Score",
    description:
      "Score across 7 revenue dimensions in 5 minutes. Free, no obligation.",
    url: "https://modernbizops.com/scorecard",
    images: [
      {
        url: "https://modernbizops.com/og/og-scorecard.png",
        width: 1200,
        height: 630,
        alt: "Modern BizOps - Free Revenue Engine Health Score across 7 dimensions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Your Free Revenue Engine Health Score",
    description:
      "17 questions. 5 minutes. Score across 7 revenue dimensions.",
    images: ["https://modernbizops.com/og/og-scorecard.png"],
  },
};

/* Cross-domain CTA target. UTM values follow approved taxonomy (see note above). */
const SCORECARD_URL =
  "https://app.modernbizops.com/scorecard?utm_source=website_modernbizops&utm_medium=internal_link&utm_campaign=lm_scorecard";

const DIMENSIONS = [
  { name: "GTM Strategy", description: "Ideal customer, positioning, and market focus" },
  { name: "Sales and Marketing Alignment", description: "Pipeline ownership, handoffs, and shared metrics" },
  { name: "Sales Process", description: "Stage definition, velocity, and conversion consistency" },
  { name: "Tech and Data", description: "CRM hygiene, tooling fit, and reporting accuracy" },
  { name: "Client Lifecycle", description: "Onboarding, retention, and expansion motion" },
  { name: "Capacity", description: "Team leverage, bandwidth ceilings, and delegation health" },
  { name: "Unit Economics", description: "CAC, LTV, payback period, and margin awareness" },
];

const DELIVERABLES = [
  {
    label: "Health Score",
    detail: "A single number from 20 to 100 that reflects your overall revenue engine performance.",
  },
  {
    label: "Letter Grade",
    detail: "An A through F grade for each of the 7 dimensions so you know exactly where you stand.",
  },
  {
    label: "Friction Report",
    detail: "Your top bottlenecks ranked by impact so you know where to focus first.",
  },
  {
    label: "Results by Email",
    detail: "A detailed report delivered to your inbox the moment you submit.",
  },
];

export default function ScorecardPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Minimal header — logo only, no nav (funnel page) */}
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
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[780px] px-6 md:px-8 pt-10 pb-16 md:pt-16 md:pb-24 text-center">
          <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
            Free Diagnostic
          </p>

          <h1 className="font-display text-[36px] md:text-[52px] leading-tight font-semibold text-navy mb-6">
            Get Your Free Revenue Engine Health Score
          </h1>

          <p className="font-body text-lg md:text-xl text-text-mid max-w-[580px] mx-auto mb-8">
            Answer 17 questions. Get a score across 7 revenue dimensions, a letter grade, and a
            friction report showing exactly where your growth is stalling.
          </p>

          <ScorecardStartLink
            href={SCORECARD_URL}
            className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-10 py-4 text-lg"
            label="scorecard_hero_cta"
          >
            Get My Free Score
          </ScorecardStartLink>

          {/* Trust bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {["Free, no credit card", "Takes about 5 minutes", "Results emailed instantly"].map(
              (item) => (
                <span key={item} className="font-body text-sm text-text-mid flex items-center gap-1.5">
                  <span className="text-amber font-bold">&#10003;</span>
                  {item}
                </span>
              )
            )}
          </div>
        </section>

        {/* ── PAIN SECTION ─────────────────────────────────────────────────── */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-14 md:py-20 text-center">
            <h2 className="font-display text-[26px] md:text-[36px] font-semibold text-cream mb-5">
              You cannot fix what you cannot see
            </h2>
            <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed">
              Most founders between $3M and $15M know revenue growth has slowed. They have a sense
              that something is off. But without a structured diagnostic, they spend months patching
              the wrong problem. The Revenue Engine Health Score gives you a clear, scored picture of
              all seven dimensions of your revenue engine in one sitting.
            </p>
          </div>
        </section>

        {/* ── WHAT YOU GET ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[900px] px-6 md:px-8 py-16 md:py-24">
          <h2 className="font-display text-[26px] md:text-[36px] font-semibold text-navy text-center mb-4">
            What you will receive
          </h2>
          <p className="font-body text-text-mid text-center mb-12 max-w-[520px] mx-auto">
            Four concrete deliverables, emailed to you the moment you finish.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {DELIVERABLES.map((d, i) => (
              <div
                key={d.label}
                className="bg-white rounded-[14px] border border-border p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-navy flex items-center justify-center font-body font-semibold text-sm text-cream">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-body font-semibold text-text-primary mb-1">{d.label}</p>
                    <p className="font-body text-sm text-text-mid leading-relaxed">{d.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7 DIMENSIONS ─────────────────────────────────────────────────── */}
        <section className="bg-white">
          <div className="mx-auto max-w-[900px] px-6 md:px-8 py-16 md:py-24">
            <h2 className="font-display text-[26px] md:text-[36px] font-semibold text-navy text-center mb-4">
              7 dimensions. Every lever that drives revenue.
            </h2>
            <p className="font-body text-text-mid text-center mb-12 max-w-[540px] mx-auto">
              The scorecard covers the full revenue engine so no bottleneck hides behind a blind spot.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DIMENSIONS.map((dim, i) => (
                <div
                  key={dim.name}
                  className="flex items-start gap-4 p-5 rounded-[10px] border border-border bg-cream"
                >
                  <span className="flex-shrink-0 font-display text-[22px] font-semibold text-amber leading-none pt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-body font-semibold text-text-primary">{dim.name}</p>
                    <p className="font-body text-sm text-text-mid mt-0.5">{dim.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] px-6 md:px-8 py-16 md:py-24">
          <h2 className="font-display text-[26px] md:text-[36px] font-semibold text-navy text-center mb-12">
            How it works
          </h2>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Answer 17 questions",
                body: "Rate your business across 7 revenue dimensions on a 1 to 5 scale. No jargon, no trick questions. Most people finish in under five minutes.",
              },
              {
                step: "2",
                title: "Get your score",
                body: "See your overall score from 20 to 100, your letter grade, and a breakdown by dimension on screen the moment you submit.",
              },
              {
                step: "3",
                title: "Receive your detailed results by email",
                body: "A branded report lands in your inbox with your full score, a dimension-by-dimension grade table, and your top friction points ranked by impact.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-6 items-start">
                <span className="flex-shrink-0 w-11 h-11 rounded-full bg-navy flex items-center justify-center font-display text-[20px] font-semibold text-cream">
                  {step}
                </span>
                <div className="pt-1.5">
                  <p className="font-body font-semibold text-text-primary mb-1.5">{title}</p>
                  <p className="font-body text-text-mid leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[600px] px-6 md:px-8 py-16 md:py-24 text-center">
            <h2 className="font-display text-[28px] md:text-[40px] font-semibold text-cream mb-5">
              Ready to see your score?
            </h2>
            <p className="font-body text-cream/80 text-lg mb-8">
              17 questions. Free. Results in your inbox immediately.
            </p>
            <ScorecardStartLink
              href={SCORECARD_URL}
              className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-10 py-4 text-lg"
              label="scorecard_bottom_cta"
            >
              Get My Free Score
            </ScorecardStartLink>
            <p className="font-body text-sm text-cream/60 mt-5">
              15+ companies have used this diagnostic. No sales pitch included.
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
