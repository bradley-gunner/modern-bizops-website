"use client";

import CompetencyCard from "./CompetencyCard";
import {
  competenciesForStage,
  isModelSpecific,
} from "@/lib/maturity/competencies";

export default function CompetencyGrid({ stage, openSlug, onToggle }) {
  const all = competenciesForStage(stage);
  const core = all.filter((c) => !isModelSpecific(c));
  const modelSpecific = all.filter(isModelSpecific);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {core.map((c) => (
          <CompetencyCard
            key={c.slug}
            competency={c}
            isOpen={openSlug === c.slug}
            onToggle={onToggle}
          />
        ))}
      </div>
      {modelSpecific.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-navy text-xl mb-1">
            Applies to your business model
          </h3>
          <p className="text-sm text-text-mid mb-4">
            A handful of competencies apply depending on how you make money.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelSpecific.map((c) => (
              <CompetencyCard
                key={c.slug}
                competency={c}
                isOpen={openSlug === c.slug}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
