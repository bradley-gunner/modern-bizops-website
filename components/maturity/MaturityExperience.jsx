"use client";

import { useEffect, useState } from "react";
import { STAGES } from "@/lib/maturity/stages";
import CompetencyGrid from "./CompetencyGrid";
import { trackEvent } from "@/lib/analytics";
import { competencyBySlug } from "@/lib/maturity/competencies";

export default function MaturityExperience() {
  const [openSlug, setOpenSlug] = useState(null);

  useEffect(() => {
    // One-time sync from the URL hash on mount so a deep link like
    // /predictable-revenue-engine#win-loss-analysis opens that competency.
    // Done in an effect (not a lazy initializer) to avoid an SSR hydration
    // mismatch, since window is not available during prerender.
    const hash = window.location.hash.replace("#", "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hash && competencyBySlug(hash)) setOpenSlug(hash);
  }, []);

  const onToggle = (slug) => {
    setOpenSlug((cur) => {
      const next = cur === slug ? null : slug;
      if (next) {
        const c = competencyBySlug(next);
        trackEvent("pillar_competency_expand", {
          competency: next,
          stage: c?.stage,
        });
        history.replaceState(null, "", `#${next}`);
      }
      return next;
    });
  };

  return (
    <div className="space-y-16">
      {STAGES.map((s) => (
        <section key={s.n} aria-labelledby={`stage-${s.n}`}>
          <div className="mb-6">
            <div className="text-xs tracking-widest uppercase text-amber font-semibold">
              Stage {s.n} · {s.name}
            </div>
            <h2
              id={`stage-${s.n}`}
              className="font-display font-semibold text-navy text-3xl mt-1"
            >
              {s.tag}
            </h2>
            <p className="text-text-mid mt-2 max-w-[64ch]">{s.def}</p>
          </div>
          <CompetencyGrid stage={s.n} openSlug={openSlug} onToggle={onToggle} />
        </section>
      ))}
    </div>
  );
}
