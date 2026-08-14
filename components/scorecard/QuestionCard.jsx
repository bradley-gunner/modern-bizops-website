'use client';
import { useState } from 'react';

const EXACT_PLACEHOLDER = {
  usd: 'e.g. 1,250,000',
  count: 'e.g. 14',
  days: 'e.g. 45',
  percent: 'e.g. 12',
};

function parseExact(kind, raw) {
  const cleaned = String(raw).replace(/[$,%\s,]/g, '');
  if (cleaned === '') return undefined;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return undefined;
  if (kind === 'percent') return n / 100; // stored as the ratio the math uses
  if (kind === 'count' || kind === 'days') return Math.round(n);
  return n;
}

/** The optional exact-figure field under a banded input (Bradley, 2026-08-14):
 *  a band is enough, but an exact number replaces the band midpoint in the
 *  ROI math, and the result's shown-arithmetic line says which one it used. */
function initialRaw(kind, exact) {
  if (typeof exact !== 'number' || !Number.isFinite(exact)) return '';
  return kind === 'percent' ? String(exact * 100) : String(exact);
}

function ExactEntry({ question, answer, onExact }) {
  const { kind, label } = question.exact;
  // Restore the typed figure when the taker navigates back to this question.
  const [raw, setRaw] = useState(() => initialRaw(kind, answer?.exact));
  return (
    <div className="mt-4 pt-4 border-t border-cream-dark">
      <label htmlFor={`${question.id}-exact`} className="block font-body text-sm text-text-mid mb-1">
        {label} <span className="text-text-light">(optional; we compute from it instead of the band)</span>
      </label>
      <div className="flex items-center gap-2 max-w-[260px]">
        {kind === 'usd' && <span className="font-body text-text-mid">$</span>}
        <input
          id={`${question.id}-exact`}
          type="text"
          inputMode="decimal"
          value={raw}
          placeholder={EXACT_PLACEHOLDER[kind]}
          onChange={(e) => {
            setRaw(e.target.value);
            onExact(parseExact(kind, e.target.value));
          }}
          className="w-full border border-border rounded-[10px] px-3 py-2 font-body text-text-primary focus:outline-none focus:border-amber"
        />
        {kind === 'percent' && <span className="font-body text-text-mid">%</span>}
        {kind === 'days' && <span className="font-body text-text-mid">days</span>}
      </div>
    </div>
  );
}

export default function QuestionCard({ question, selected, onSelect, onExact }) {
  const selectedOption = question.options.find((o) => o.value === selected?.value);
  return (
    <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
      <h3 className="font-display text-xl md:text-2xl text-navy mb-6">{question.prompt}</h3>
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selected?.value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-4 rounded-[10px] border cursor-pointer transition-colors ${
                isSelected ? 'border-amber bg-amber/10' : 'border-border bg-cream hover:bg-amber/5'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={isSelected}
                onChange={() => onSelect(opt)}
                className="mt-1"
              />
              <span className="font-body text-text-primary">
                {opt.label}
                {opt.description && (
                  <span data-description className="block font-body text-sm text-text-mid mt-1">{opt.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {question.exact && selected && !selectedOption?.notTracked && (
        <ExactEntry
          key={question.id}
          question={question}
          answer={{ ...selected, notTracked: selectedOption?.notTracked }}
          onExact={onExact}
        />
      )}
    </div>
  );
}
