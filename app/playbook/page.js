/*
 * CRO notes for this gated lead magnet page:
 *
 * 1. NO NAVIGATION — Funnel page. No header nav to prevent leakage.
 *
 * 2. TWO-COLUMN HERO (desktop) — Copy on the left builds desire; form card on
 *    the right is always visible above the fold on md+ screens. Collapses to
 *    single-column stack on mobile (copy first, then form).
 *
 * 3. CONTENT PREVIEW BEFORE SECOND FORM CTA — The 7-chapter grid and ICP
 *    section give scrollers the information they need to decide; the bottom
 *    CTA captures them on the way down.
 *
 * 4. GATED DOWNLOAD — Form submits to HubSpot Forms API v3. On success the
 *    PDF is revealed as a direct download link. The PDF lives at
 *    /public/downloads/headcount-optimizer-playbook.pdf.
 *
 * 5. UTM NOTE (needs Bradley's confirmation):
 *    The secondary scorecard CTA uses these proposed UTM params:
 *      utm_source=modernbizops_website    — not in approved picklist; nearest
 *                                           registered option is "website_modernbizops"
 *                                           (internal banner exception, section 8).
 *      utm_medium=internal_cta            — not in approved picklist; no existing
 *                                           medium covers same-domain button links.
 *      utm_campaign=lm_headcount_optimizer — VALID per taxonomy section 4.
 *      utm_content=playbook_bottom_cta_scorecard_v1 — follows placement+version
 *                                           convention; confirm slug matches registry.
 *    Please confirm or update all four params before launch.
 */

import Link from "next/link";
import Image from "next/image";
import PlaybookForm from "./PlaybookForm";

export const metadata = {
  title: "Headcount Optimizer Playbook | Modern BizOps",
  description:
    "Free PDF guide: 7 operational changes to grow revenue 20-40% without adding headcount. Built for $1M-$15M founders hitting growth ceilings.",
  alternates: {
    canonical: "https://modernbizops.com/playbook",
  },
};

/* UTM params flagged above — confirm before launch. */
const SCORECARD_URL =
  "/scorecard?utm_source=modernbizops_website&utm_medium=internal_cta&utm_campaign=lm_headcount_optimizer&utm_content=playbook_bottom_cta_scorecard_v1";

const CHAPTERS = [
  {
    num: 1,
    title: "The GTM Flywheel Audit",
    subtitle: "Find the friction before you add more fuel",
    stat: "Pipeline value +22% in 60 days. Zero new hires.",
  },
  {
    num: 2,
    title: "The Sales-Marketing SLA",
    subtitle: "End the blame game with shared accountability",
    stat: "Marketing-sourced pipeline doubled in 90 days. Same ad spend.",
  },
  {
    num: 3,
    title: "The Inspectable Sales Process",
    subtitle: "Replace gut instinct with a system you can see, measure, and improve",
    stat: "Sales cycle from 47 to 26 days. Close rate from 18% to 31%.",
  },
  {
    num: 4,
    title: "Tech Stack and Data Governance",
    subtitle: "Stop paying for tools nobody trusts and data nobody uses",
    stat: "$1,800 saved monthly. Reporting from 12 hours to 45 minutes.",
  },
  {
    num: 5,
    title: "The Client Lifecycle Playbook",
    subtitle: "Turn one-time buyers into long-term revenue engines",
    stat: "Churn from 22% to 11%. Expansion revenue up 35% from existing clients.",
  },
  {
    num: 6,
    title: "Resource Utilization and Capacity",
    subtitle: "Know exactly what your team can handle, and what they cannot",
    stat: "1.5 FTEs of capacity recovered. Two hires avoided. $180K saved annually.",
  },
  {
    num: 7,
    title: "The Capital-Efficient Growth Scorecard",
    subtitle: "Measure what matters, and prove your business is getting more valuable",
    stat: "Margins up 8 points. Nearly $1M added to annual profit. Zero new clients required.",
  },
];

const ICP_SIGNS = [
  "Revenue has grown, but margins have not kept up",
  "Every new client feels like it requires a new hire",
  "The team is busy, but you cannot tell if they are working on the right things",
  "Marketing and sales are not aligned on what a good lead looks like",
  "You know growth is stalling, but cannot pinpoint exactly where",
  "Hiring decisions are based on gut feel rather than utilization data",
];

export default function PlaybookPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Minimal header — logo only, no nav (funnel page) */}
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
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1100px] px-6 md:px-8 pt-10 pb-16 md:pt-14 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">

            {/* Left: Copy */}
            <div>
              <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
                Free PDF Guide
              </p>
              <h1 className="font-display text-[34px] md:text-[50px] leading-tight font-semibold text-navy mb-5">
                Grow Revenue Without Adding Headcount
              </h1>
              <p className="font-body text-lg md:text-xl text-text-mid leading-relaxed mb-7">
                Seven operational changes that allow $1M to $15M companies to grow
                revenue 20-40% without proportionally growing their teams. Free PDF.
                Instant download.
              </p>

              {/* Trust bar */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-y-2 gap-x-6">
                {[
                  "Free, no credit card",
                  "7 chapters, 30 min read",
                  "Real case studies included",
                ].map((item) => (
                  <span
                    key={item}
                    className="font-body text-sm text-text-mid flex items-center gap-1.5"
                  >
                    <span className="text-amber font-bold">&#10003;</span>
                    {item}
                  </span>
                ))}
              </div>

              {/* Social proof */}
              <p className="font-body text-sm text-text-light mt-6">
                Used by 15+ $1M-$15M companies to identify and close revenue leakage.
              </p>
            </div>

            {/* Right: Form */}
            <div className="md:sticky md:top-8">
              <PlaybookForm />
            </div>
          </div>
        </section>

        {/* ── PAIN SECTION ─────────────────────────────────────────────────── */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-14 md:py-20 text-center">
            <h2 className="font-display text-[26px] md:text-[36px] font-semibold text-cream mb-5">
              The problem is not your team. It is your system.
            </h2>
            <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed">
              Most founders between $1M and $15M hit a ceiling where every dollar of
              new revenue seems to require a proportional dollar of new headcount.
              Margins erode. Complexity compounds. The instinct is to hire. But in
              most cases, the real constraint is not capacity. It is friction: invisible
              drag points spread across marketing, sales, and client success that consume
              effort, waste budget, and slow growth. The Headcount Optimizer Playbook
              shows you how to find and eliminate that friction before you add more fuel.
            </p>
          </div>
        </section>

        {/* ── WHAT'S INSIDE ────────────────────────────────────────────────── */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1100px] px-6 md:px-8 py-16 md:py-24">
            <h2 className="font-display text-[26px] md:text-[38px] font-semibold text-navy text-center mb-4">
              7 chapters. One complete revenue system.
            </h2>
            <p className="font-body text-text-mid text-center mb-12 max-w-[540px] mx-auto">
              Each chapter addresses one phase of the revenue engine: what the problem
              looks like, why it matters, how to recognize it in your business, and what
              the solution looks like in practice.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CHAPTERS.map((ch) => (
                <div
                  key={ch.num}
                  className="flex gap-5 p-6 rounded-[14px] border border-border bg-cream"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-navy flex items-center justify-center font-display text-[18px] font-semibold text-cream">
                    {ch.num}
                  </span>
                  <div>
                    <p className="font-body font-semibold text-text-primary mb-0.5">
                      {ch.title}
                    </p>
                    <p className="font-body text-sm text-text-mid mb-2">
                      {ch.subtitle}
                    </p>
                    <p className="font-body text-xs font-semibold text-amber">
                      {ch.stat}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[900px] px-6 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-3">
                Who this is for
              </p>
              <h2 className="font-display text-[26px] md:text-[34px] font-semibold text-navy mb-5">
                Built for founders between $1M and $15M hitting an operational ceiling
              </h2>
              <p className="font-body text-text-mid leading-relaxed">
                If your revenue has grown but your margins have not, or if every new
                client feels like it requires a new hire, this playbook was written
                for your situation. It is not theory. Every chapter is built around
                real operational patterns from companies at your stage.
              </p>
            </div>

            <div>
              <p className="font-body text-sm font-semibold text-text-mid mb-4">
                This playbook is a fit if you recognize any of these:
              </p>
              <ul className="space-y-3">
                {ICP_SIGNS.map((sign) => (
                  <li key={sign} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber/10 border border-amber/30 flex items-center justify-center mt-0.5">
                      <span className="text-amber text-xs font-bold">&#10003;</span>
                    </span>
                    <span className="font-body text-sm text-text-mid leading-relaxed">
                      {sign}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-16 md:py-24 text-center">
            <h2 className="font-display text-[28px] md:text-[40px] font-semibold text-cream mb-5">
              Ready to grow without growing your team?
            </h2>
            <p className="font-body text-cream/80 text-lg mb-8">
              Free PDF. Seven chapters. Real case studies from companies at your stage.
            </p>
            <a
              href="#download-form"
              className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-10 py-4 text-lg"
            >
              Get the Free Playbook
            </a>

            {/* Secondary CTA — scorecard */}
            <div className="mt-10 pt-10 border-t border-cream/20">
              <p className="font-body text-cream/70 text-sm mb-4">
                Not sure where your revenue engine is leaking first?
              </p>
              <Link
                href={SCORECARD_URL}
                className="inline-flex items-center justify-center font-body font-semibold bg-transparent text-cream border border-cream/40 hover:border-cream/80 hover:bg-cream/10 transition-colors duration-200 rounded-full px-8 py-3 text-base"
              >
                Take the Free Revenue Engine Health Score
              </Link>
              <p className="font-body text-xs text-cream/50 mt-3">
                17 questions. Scored across 7 dimensions. Results in your inbox instantly.
              </p>
            </div>
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
