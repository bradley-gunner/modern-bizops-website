import Link from "next/link";
import Section from "../ui/Section";
import AmberBand, { bandLinkClass } from "../ui/AmberBand";
import { CLEANUP_PRICE_FLOOR } from "@/lib/offers";

// Section 3: the problem, in the burned-buyer register. The best informed
// buyers in this market have been burned once and can smell vibes-based
// selling, so this names the failure modes before the prospect has to.
//
// This is the operations-debt pillar, which is the message the whole offer
// hangs on: the debt was priced against inconvenience, and AI repriced it
// against capability. The audit is its commercial expression.
//
// 2026-08-12: three body paragraphs then three text cards, all at one size, was
// the second-densest stretch of the page. The closing line now carries the
// section at display scale, because it is the turn the whole section exists to
// make, and each failure mode leads with a small drawing of itself. No wording
// changed.
//
// 2026-09-01: that closing line became a full-bleed amber band and moved to the
// END, after the failure modes rather than before them, because the page was
// answering the problem and then going back to describing it. The band is
// components/ui/AmberBand.jsx and its reasoning lives there.

// Each glyph is decorative and hidden from assistive technology; the card title
// beside it says the same thing in words.
function FailureGlyph({ children }) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="w-10 h-10 mb-4"
    >
      {children}
    </svg>
  );
}

// Wrong data: a grid of records with one cell carrying the wrong value.
function WrongDataGlyph() {
  return (
    <FailureGlyph>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 14}
            y={row * 14}
            width="12"
            height="12"
            rx="3"
            fillOpacity={row === 1 && col === 2 ? 1 : 0.2}
            className={row === 1 && col === 2 ? "fill-red" : "fill-navy"}
          />
        ))
      )}
    </FailureGlyph>
  );
}

// Undocumented process: a page nobody ever wrote, drawn as an outline with
// nothing on it.
function UnwrittenGlyph() {
  return (
    <FailureGlyph>
      <rect
        x="7"
        y="3"
        width="26"
        height="34"
        rx="4"
        fill="none"
        strokeWidth="2"
        strokeDasharray="4 3"
        strokeOpacity="0.55"
        className="stroke-navy"
      />
      {[12, 20, 28].map((y, i) => (
        <rect
          key={y}
          x="13"
          y={y}
          width={i === 2 ? 8 : 14}
          height="3"
          rx="1.5"
          fillOpacity="0.28"
          className="fill-navy"
        />
      ))}
    </FailureGlyph>
  );
}

// Unowned after launch: something that fires on a schedule, then flatlines,
// and no mark anywhere on the line for the moment it quit.
function StoppedGlyph() {
  return (
    <FailureGlyph>
      <path
        d="M2 32 H7 V8 H12 V32 H17 V8 H22 V32"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-amber"
      />
      <path
        d="M22 32 H38"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="stroke-border"
      />
    </FailureGlyph>
  );
}

const FAILURE_MODES = [
  {
    title: "The data was wrong",
    body: "So the automation was wrong too, only faster and with more confidence than the person it replaced.",
    art: WrongDataGlyph,
  },
  {
    title: "The process lived in someone's head",
    body: "There was nothing written down to automate, so the pilot automated a guess about how the work gets done.",
    art: UnwrittenGlyph,
  },
  {
    title: "Nobody owned it after launch",
    body: "It ran for a month, then stopped firing. No one noticed until a number looked wrong.",
    art: StoppedGlyph,
  },
];

export default function OperationsDebt() {
  return (
    <>
      <Section bg="white" narrow={false}>
        <div className="max-w-[760px]">
          <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
            Operations debt, repriced
          </p>
          <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
            You probably tried this once already.
          </h2>
          <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
            <p>
              You bought the tool. You read the case studies. You ran the pilot.
              And it died quietly on a foundation nobody checked.
            </p>
            <p>
              The tool was probably fine. Dirty data, duct-tape process, fields
              nobody fills in. The debt you could tolerate for years was priced
              against inconvenience, and AI repriced it against capability. The
              cleanup you kept meaning to get to is now the thing that decides
              whether any of this works for you at all.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FAILURE_MODES.map((mode) => {
            const Art = mode.art;
            return (
              <div key={mode.title} className="bg-cream rounded-[14px] p-6">
                <Art />
                <p className="font-body font-semibold text-navy text-base mb-2">
                  {mode.title}
                </p>
                <p className="font-body text-text-mid text-[15px] leading-relaxed">
                  {mode.body}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <AmberBand statement="So we fix the foundation first, and build the automation on top of it. One named system at a time, at a published price.">
        The foundation work has its own menu and its own numbers.{" "}
        <Link href="/ai-automation-services" className={bandLinkClass}>
          Six cleanup services, from {CLEANUP_PRICE_FLOOR}
        </Link>
        , bought before anything gets automated on top of them.
      </AmberBand>
    </>
  );
}
