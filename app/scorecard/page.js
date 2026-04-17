import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Revenue Engine Health Score | Free Diagnostic",
  description:
    "Get your free Revenue Engine Health Score. Answer 17 questions and receive a detailed scorecard across 7 RevOps dimensions, plus a friction report identifying your top growth bottlenecks.",
  alternates: {
    canonical: "https://modernbizops.com/scorecard",
  },
};

const dimensions = [
  "GTM Strategy",
  "Sales & Marketing Alignment",
  "Sales Process",
  "Tech & Data",
  "Client Lifecycle",
  "Capacity",
  "Unit Economics",
];

const deliverables = [
  {
    label: "Your score",
    detail:
      "A number from 20 to 100 reflecting the overall health of your revenue engine.",
  },
  {
    label: "Your grade",
    detail:
      "A letter grade from A to F so you know at a glance where you stand.",
  },
  {
    label: "A friction report",
    detail:
      "The specific bottlenecks dragging your score down, ranked by impact.",
  },
  {
    label: "Results by email",
    detail:
      "Your full scorecard, dimension by dimension, sent directly to your inbox.",
  },
];

const steps = [
  {
    step: "01",
    title: "Answer 17 questions",
    body: "Rate your business across 17 statements, one for each area of your revenue engine. Honest answers produce useful results.",
  },
  {
    step: "02",
    title: "Get your score",
    body: "See your overall score from 20 to 100, your letter grade, and a breakdown by dimension so you know exactly where to focus.",
  },
  {
    step: "03",
    title: "Receive your full report by email",
    body: "Your complete scorecard arrives in your inbox: dimension scores, top friction points, and a clear sense of where the leverage is.",
  },
];

// PLACEHOLDER: Bradley to confirm final UTM params before go-live.
// utm_medium=cta is not in the approved UTM taxonomy — confirm the correct
// medium (taxonomy options: social, paid_social, email, cpc, pdf, outreach,
// referral, qr, podcast, video_description). Campaign lm_scorecard is correct
// per taxonomy. Update this constant and the second CTA below at the same time.
const SCORECARD_URL =
  "https://app.modernbizops.com/scorecard?utm_source=website&utm_medium=cta&utm_campaign=lm_scorecard";

const ctaClasses =
  "inline-flex items-center justify-center font-body font-semibold transition-colors duration-200 rounded-full bg-amber text-white hover:bg-amber-light px-10 py-4 text-lg";

export default function ScorecardPage() {
  return (
    <div className="min-h-screen bg-white">
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

      {/* Hero */}
      <section className="bg-navy py-16 md:py-24 px-6 md:px-8">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-body text-amber text-sm font-semibold tracking-widest uppercase mb-4">
            Free Diagnostic
          </p>
          <h1 className="font-display text-[36px] md:text-[54px] font-semibold text-white leading-tight mb-6">
            Get Your Free Revenue Engine Health Score
          </h1>
          <p className="font-body text-cream/80 text-lg md:text-xl mb-10">
            Answer 17 questions. Get a score, a grade, and a friction report
            that identifies exactly what is holding your revenue back. Results
            delivered to your inbox.
          </p>
          <a href={SCORECARD_URL} className={ctaClasses}>
            Take the Free Scorecard
          </a>
          <p className="font-body text-cream/50 text-sm mt-5">
            17 questions. Takes about 5 minutes.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-cream py-16 md:py-20 px-6 md:px-8">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-display text-[28px] md:text-[38px] font-semibold text-navy mb-3">
            What you get
          </h2>
          <p className="font-body text-text-mid text-lg mb-10">
            No sign-up wall. No pitch call required. Just a clear picture of
            where your revenue engine stands.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {deliverables.map(({ label, detail }) => (
              <div
                key={label}
                className="bg-white rounded-[12px] border border-border p-6"
              >
                <p className="font-body font-semibold text-amber mb-2">
                  {label}
                </p>
                <p className="font-body text-text-mid text-sm">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 dimensions */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-8">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-display text-[28px] md:text-[38px] font-semibold text-navy mb-3">
            7 dimensions. One complete picture.
          </h2>
          <p className="font-body text-text-mid text-lg mb-10">
            The scorecard evaluates every area that drives or constrains revenue
            growth in a $3M to $15M services business.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {dimensions.map((dim, i) => (
              <div
                key={dim}
                className="flex items-center gap-4 bg-cream rounded-[10px] px-5 py-4"
              >
                <span className="font-body text-sm font-semibold text-amber min-w-[2rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-body text-navy font-medium">{dim}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy py-16 md:py-20 px-6 md:px-8">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-display text-[28px] md:text-[38px] font-semibold text-white mb-10">
            How it works
          </h2>
          <div className="space-y-10">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="flex gap-6">
                <span className="font-display text-[42px] font-semibold text-amber leading-none mt-0.5 min-w-[3rem]">
                  {step}
                </span>
                <div>
                  <h3 className="font-body font-semibold text-white text-lg mb-1.5">
                    {title}
                  </h3>
                  <p className="font-body text-cream/70 text-base">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-cream py-16 md:py-20 px-6 md:px-8">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-display text-[28px] md:text-[38px] font-semibold text-navy mb-4">
            Ready to see your score?
          </h2>
          <p className="font-body text-text-mid text-lg mb-8">
            Free, takes about five minutes, and your results arrive by email the
            moment you finish.
          </p>
          <a href={SCORECARD_URL} className={ctaClasses}>
            Take the Free Scorecard
          </a>
          <p className="font-body text-text-light text-sm mt-5">
            No account required. No sales pitch. Just your score.
          </p>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-border px-6 py-4 text-center">
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
