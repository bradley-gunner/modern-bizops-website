"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { STAGES } from "@/lib/maturity/stages";
import { competencyBySlug } from "@/lib/maturity/competencies";
import { trackEvent } from "@/lib/analytics";

// One icon per stage number. Inline SVG, self-contained.
const STAGE_ICON = {
  1: <><path d="M12 3v18M5 8l7-5 7 5" /><circle cx="12" cy="15" r="3" /></>,
  2: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 4v16" /></>,
  3: <><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 4-6" /></>,
  4: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M17 7l2-2M5 19l2-2" /></>,
};

function Icon({ n }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {STAGE_ICON[n]}
    </svg>
  );
}

export default function SelfLocate() {
  const [sel, setSel] = useState(null);

  const pick = (s) => {
    setSel(s);
    trackEvent("pillar_stage_select", { stage: s.n, stage_name: s.name });
    requestAnimationFrame(() => {
      document.getElementById("meet-response")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  return (
    <div id="locate" className="scroll-mt-24">
      <div className="text-center mb-7">
        <div className="text-xs tracking-[0.18em] uppercase text-amber font-semibold">Start here</div>
        <h2 className="font-display font-semibold text-navy text-3xl mt-1">Which one sounds like you today?</h2>
        <p className="text-text-mid mt-2">Pick the stage that feels most true. No wrong answer, and most companies are further back than they think.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((s) => {
          const on = sel?.n === s.n;
          return (
            <button
              key={s.n}
              type="button"
              onClick={() => pick(s)}
              aria-pressed={on}
              className={`text-left bg-white border rounded-2xl p-5 flex flex-col h-full transition-all ${
                on ? "border-amber shadow-[0_12px_34px_rgba(200,93,10,0.14)]" : "border-border hover:border-amber hover:-translate-y-0.5"
              }`}
            >
              <span className="w-11 h-11 rounded-xl bg-amber-pale text-amber flex items-center justify-center mb-3">
                <Icon n={s.n} />
              </span>
              <span className="font-display font-bold text-amber text-lg leading-none">{String(s.n).padStart(2, "0")}</span>
              <span className="font-display font-semibold text-navy text-2xl leading-tight">{s.name}</span>
              <span className="text-[11px] tracking-widest uppercase text-text-light mb-2">{s.tag}</span>
              <span className="text-sm text-text-mid leading-snug flex-1">{s.felt}</span>
              <span className={`mt-4 text-[13px] font-semibold ${on ? "text-green" : "text-amber"}`}>
                {on ? "This is me ✓" : "This is me →"}
              </span>
            </button>
          );
        })}
      </div>

      {sel && (
        <div id="meet-response" className="mt-6 bg-white border border-amber rounded-2xl p-7 md:p-8 shadow-[0_16px_44px_rgba(14,31,56,0.10)] scroll-mt-24">
          <div className="text-xs tracking-[0.16em] uppercase text-amber font-semibold">If this is you</div>
          <h3 className="font-display font-semibold text-navy text-2xl md:text-3xl mt-1 mb-3">Here is where we would meet you.</h3>
          <p className="text-[17px] text-navy/90 leading-relaxed max-w-[66ch]">{sel.meet}</p>

          <div className="mt-6">
            <div className="text-[11px] tracking-wide uppercase text-text-light font-semibold mb-2">
              At this stage we tend to focus on things like
            </div>
            <div className="flex flex-wrap gap-2">
              {sel.peek.map((slug) => {
                const c = competencyBySlug(slug);
                return c ? (
                  <span key={slug} className="text-[12.5px] bg-amber-pale border border-amber/25 text-amber rounded-full px-3 py-1 font-medium">
                    {c.name}
                  </span>
                ) : null;
              })}
              <span className="text-[12.5px] italic text-text-light rounded-full px-2 py-1">and a few more</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="/scorecard">Get your exact score</Button>
            <span className="text-[13px] text-text-light">Five minutes. Fifteen questions.</span>
          </div>
        </div>
      )}
    </div>
  );
}
