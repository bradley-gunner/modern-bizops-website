"use client";

import Link from "next/link";
import CompetencyIcon from "./CompetencyIcon";

export default function CompetencyCard({ competency: c, isOpen, onToggle }) {
  return (
    <div
      id={c.slug}
      className={`relative text-left bg-white border rounded-2xl p-5 transition-colors scroll-mt-24 flex flex-col gap-2 h-full ${
        isOpen ? "border-amber ring-1 ring-amber" : "border-border hover:border-amber"
      }`}
    >
      {/* Stretched toggle: clicking anywhere on the card opens the scoring
          detail panel. The learn-page link in the footer sits above it at
          z-10, so the two affordances stay siblings, never nested. */}
      <button
        type="button"
        onClick={() => onToggle(c.slug)}
        aria-expanded={isOpen}
        aria-label={`${c.name}: ${isOpen ? "close" : "see how we score it"}`}
        className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer"
      />
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
        {c.learnMoreUrl ? (
          <Link
            href={c.learnMoreUrl}
            className="relative z-10 text-[13px] text-amber font-semibold hover:underline"
          >
            Read the full breakdown
          </Link>
        ) : (
          <span className="text-[13px] text-amber font-semibold">
            {isOpen ? "Close" : "See how we score it"}
          </span>
        )}
      </span>
    </div>
  );
}
