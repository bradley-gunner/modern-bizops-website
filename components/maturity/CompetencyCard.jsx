"use client";

import CompetencyIcon from "./CompetencyIcon";

export default function CompetencyCard({ competency: c, isOpen, onToggle }) {
  return (
    <button
      type="button"
      id={c.slug}
      onClick={() => onToggle(c.slug)}
      aria-expanded={isOpen}
      className={`text-left bg-white border rounded-2xl p-5 transition-colors scroll-mt-24 flex flex-col gap-2 h-full ${
        isOpen ? "border-amber ring-1 ring-amber" : "border-border hover:border-amber"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-xl bg-amber-pale text-amber flex items-center justify-center shrink-0">
          <CompetencyIcon competency={c} />
        </span>
        <span className="text-xs text-amber font-semibold tracking-wide">
          {String(c.id).padStart(2, "0")}
        </span>
      </span>
      <span className="font-display font-semibold text-navy text-xl leading-tight">
        {c.name}
      </span>
      <span className="text-sm text-text-mid leading-snug">{c.shortDef}</span>
      <span className="mt-auto pt-1 flex items-center justify-between">
        <span className="text-[11px] text-green bg-green/10 border border-green/20 rounded-full px-2.5 py-0.5 font-semibold">
          Scored 1-5
        </span>
        <span className="text-[13px] text-amber font-semibold">
          {isOpen ? "Close" : "See how I score it"}
        </span>
      </span>
    </button>
  );
}
