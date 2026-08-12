"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

const RUNGS = [
  { n: "01", label: "Reactive · runs on you" },
  { n: "02", label: "Repeatable · on a system" },
  { n: "03", label: "Predictable · on data" },
  { n: "04", label: "Compounding · improves itself" },
];

export default function MaturityHero({ variant }) {
  useEffect(() => {
    trackEvent("pillar_hero_view", { hero_variant: variant.id });
  }, [variant.id]);

  return (
    <section className="relative overflow-hidden border-t-8 border-amber bg-navy text-cream">
      {/* Subtle brand motif. Low opacity so headline text stays crisp. */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.16]"
        viewBox="0 0 1200 460"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="mb-grid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M46 0H0V46" fill="none" stroke="#8fb0e0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1200" height="460" fill="url(#mb-grid)" />
        <polyline
          points="60,400 300,330 540,340 780,240 1020,150 1180,90"
          fill="none"
          stroke="#E8873A"
          strokeWidth="2.5"
          opacity="0.85"
        />
        {[[300, 330], [540, 340], [780, 240], [1020, 150]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5" fill="#E8873A" />
        ))}
      </svg>

      <div className="relative mx-auto max-w-[1120px] px-6 md:px-8 py-16 md:py-24 grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-center">
        <div>
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-amber-light font-semibold mb-4">
            For founder-led B2B companies · $3M to $50M
          </span>
          <h1 className="font-display font-semibold text-white text-4xl md:text-5xl leading-[1.05] max-w-[15ch]">
            {variant.h1}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#C6D0DF] max-w-[52ch]">
            {variant.sub}
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Button href="/scorecard">Get the Free Scan</Button>
            <a
              href="#locate"
              className="inline-flex items-center justify-center rounded-full font-body font-semibold px-8 py-3.5 text-base text-white border border-white/35 hover:border-white/70 transition-colors"
            >
              Find your stage
            </a>
          </div>
        </div>

        {/* Ascending ladder art (decorative). Hidden on mobile. */}
        <div className="hidden lg:block relative h-[230px]" aria-hidden="true">
          {RUNGS.map((r, i) => {
            const top = RUNGS.length - 1 - i; // stack 04 at top
            const isTop = r.n === "04";
            return (
              <div
                key={r.n}
                className={`absolute w-[220px] flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 border ${
                  isTop
                    ? "border-amber-light/50 bg-amber/[0.14]"
                    : "border-white/12 bg-white/[0.06]"
                }`}
                style={{ right: `${i * 24}px`, bottom: `${top * 58}px` }}
              >
                <span className="font-display font-bold text-amber-light text-lg">{r.n}</span>
                <span className="text-[13px] text-[#dbe3ee]">{r.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
