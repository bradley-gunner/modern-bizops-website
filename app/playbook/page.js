import Link from "next/link";
import Image from "next/image";
import PlaybookForm from "./PlaybookForm";

export const metadata = {
  title: "Headcount Optimizer Playbook",
  description:
    "A practical framework for right-sizing your revenue team. Know who to hire, when to hire them, and how to structure for growth without over-hiring.",
  alternates: {
    canonical: "https://modernbizops.com/playbook",
  },
};

const WHAT_YOU_GET = [
  {
    title: "The right sequence",
    body: "Which roles to hire in what order based on your revenue stage, not headcount intuition.",
  },
  {
    title: "Capacity math",
    body: "How to calculate when a role earns back its cost and how long until it pays off.",
  },
  {
    title: "Org design patterns",
    body: "The three structures that work at $3M, $8M, and $15M and why each breaks at the next threshold.",
  },
  {
    title: "Common hiring mistakes",
    body: "The five over-hiring traps founders fall into and how to avoid them before they stall growth.",
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
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1100px] px-6 md:px-8 pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="grid md:grid-cols-[1fr_400px] gap-12 md:gap-16 items-start">
            {/* Left: copy */}
            <div>
              <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
                Free Playbook
              </p>

              <h1 className="font-display text-[36px] md:text-[52px] leading-tight font-semibold text-navy mb-6">
                The Headcount Optimizer Playbook
              </h1>

              <p className="font-body text-lg md:text-xl text-text-mid mb-8 leading-relaxed">
                A practical framework for right-sizing your revenue team. Know
                who to hire, when, and how to structure for growth without
                over-hiring.
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
            </div>

            {/* Right: form */}
            <div className="md:sticky md:top-8">
              <PlaybookForm />
            </div>
          </div>
        </section>

        {/* ── PAIN SECTION ─────────────────────────────────────────────────── */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-14 md:py-20 text-center">
            <h2 className="font-display text-[26px] md:text-[36px] font-semibold text-cream mb-5">
              Most founders over-hire before they are ready
            </h2>
            <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed">
              A VP of Sales at $4M in revenue. A full marketing team before
              the product is proven. Headcount that costs $600K a year before
              the revenue is there to carry it. This playbook shows you how to
              build a revenue team that earns its keep at every stage.
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
