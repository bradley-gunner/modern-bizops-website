"use client";

import CompetencyDetail from "./CompetencyDetail";

export default function CompetencyCard({ competency: c, isOpen, onToggle }) {
  return (
    <div
      id={c.slug}
      className={`bg-white border rounded-2xl p-5 transition-colors scroll-mt-24 ${
        isOpen
          ? "border-amber md:col-span-2 lg:col-span-3"
          : "border-border hover:border-amber"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(c.slug)}
        aria-expanded={isOpen}
        className="w-full text-left flex flex-col gap-2"
      >
        <span className="text-xs text-amber font-semibold tracking-wide">
          {String(c.id).padStart(2, "0")}
        </span>
        <span className="font-display font-semibold text-navy text-xl leading-tight">
          {c.name}
        </span>
        <span className="text-sm text-text-mid leading-snug">{c.shortDef}</span>
        <span className="mt-1 flex items-center justify-between">
          <span className="text-[11px] text-green bg-green/10 border border-green/20 rounded-full px-2.5 py-0.5 font-semibold">
            Scored 1-5
          </span>
          <span className="text-[13px] text-amber font-semibold">
            {isOpen ? "Close" : "See how I score it"}
          </span>
        </span>
      </button>
      {isOpen && <CompetencyDetail competency={c} />}
    </div>
  );
}
