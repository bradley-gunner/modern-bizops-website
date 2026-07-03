"use client";

import { Fragment } from "react";
import CompetencyCard from "./CompetencyCard";
import CompetencyDetail from "./CompetencyDetail";
import {
  competenciesForStage,
  isModelSpecific,
} from "@/lib/maturity/competencies";

function DetailPanel({ competency: c, onToggle }) {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-amber rounded-2xl p-6 md:p-8 scroll-mt-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-widest uppercase text-amber font-semibold">
            Stage {c.stage} · Competency {String(c.id).padStart(2, "0")}
          </div>
          <h3 className="font-display font-semibold text-navy text-2xl md:text-3xl mt-0.5">
            {c.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onToggle(c.slug)}
          aria-label="Close"
          className="shrink-0 text-text-light hover:text-navy border border-border hover:border-navy rounded-full w-9 h-9 flex items-center justify-center text-lg"
        >
          ×
        </button>
      </div>
      <CompetencyDetail competency={c} />
    </div>
  );
}

function Cards({ items, openSlug, onToggle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((c) => (
        <Fragment key={c.slug}>
          <CompetencyCard
            competency={c}
            isOpen={openSlug === c.slug}
            onToggle={onToggle}
          />
          {openSlug === c.slug && (
            <DetailPanel competency={c} onToggle={onToggle} />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default function CompetencyGrid({ stage, openSlug, onToggle }) {
  const all = competenciesForStage(stage);
  const core = all.filter((c) => !isModelSpecific(c));
  const modelSpecific = all.filter(isModelSpecific);

  return (
    <div className="space-y-6">
      <Cards items={core} openSlug={openSlug} onToggle={onToggle} />
      {modelSpecific.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-navy text-xl mb-1">
            Applies to your business model
          </h3>
          <p className="text-sm text-text-mid mb-4">
            A handful of competencies apply depending on how you make money.
          </p>
          <Cards items={modelSpecific} openSlug={openSlug} onToggle={onToggle} />
        </div>
      )}
    </div>
  );
}
