import Section from "../ui/Section";
import VSSLPlayer from "../VSSLPlayer";
import { LADDER, AUDIT_TERMS } from "@/lib/offers";

const audit = LADDER.find((rung) => rung.id === "audit");

// Section 6: proof, mechanism-first.
//
// Roughly 72% of AI buyers now fact-check the claims a vendor makes, and the
// two things they name most often before they will believe one are a
// measurable outcome and a plain account of what the software actually does.
// There is no client outcome to show yet, so this section spends all of its
// credibility budget on the second one: what the audit reads, where the
// numbers come from, and what comes back.
//
// The 72% figure is the reason this section exists, not copy for it. House
// rule: a benchmark is supporting proof, never the hook.
//
// This section TEASES the mechanism. /ai-readiness-assessment is the only place
// that argues it in full. Until 2026-08-12 the two were near-duplicates: the
// same four-item stack list after the same colon, the same "nobody has to grade
// themselves" line, the same strategy-workshop paragraph. A visitor reading
// both met one page twice. Keep new detail on the audit page, not here.
//
// 2026-08-12, second pass: the four steps used to be four text boxes in a 2x2
// grid, which made the densest section on the page also the flattest. A section
// whose whole job is "show the mechanism, never the magic" should draw the
// mechanism, so each step now leads with a purpose-built glyph and the four sit
// in one left-to-right row at lg. The copy is unchanged, word for word.

// The glyph frame. Every glyph is drawn on the same 240x110 box so the four
// line up across the row, and every one is decorative: the step text beside it
// states each fact in words, so a screen reader loses nothing by skipping them.
// The library in components/learn/motifs is deliberately not reused here. Those
// are drawn for the dark navy /learn hero band and several carry captions
// arguing a different page's point.
function Glyph({ children }) {
  return (
    <svg
      viewBox="0 0 240 110"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="w-full h-auto"
    >
      {children}
    </svg>
  );
}

const TILE_ROWS = [19, 55, 91];

// 01. Your tools feed one place. Six tiles, the CRM named because the step text
// names it, everything collected onto one bus and into a single reader.
function ConnectGlyph() {
  return (
    <Glyph>
      {TILE_ROWS.map((cy, row) => (
        <g key={cy}>
          {[8, 52].map((x, col) =>
            row === 0 && col === 0 ? (
              <g key={x}>
                <rect
                  x={x}
                  y={cy - 11}
                  width="36"
                  height="22"
                  rx="5"
                  className="fill-amber"
                />
                <text
                  x={x + 18}
                  y={cy + 4}
                  textAnchor="middle"
                  fontFamily="Jost, sans-serif"
                  fontSize="10"
                  fontWeight="600"
                  className="fill-cream"
                >
                  CRM
                </text>
              </g>
            ) : (
              <rect
                key={x}
                x={x}
                y={cy - 11}
                width="36"
                height="22"
                rx="5"
                fill="none"
                strokeWidth="1.5"
                strokeOpacity="0.35"
                className="stroke-navy"
              />
            )
          )}
          <path
            d={`M44 ${cy} h8 M88 ${cy} H118`}
            fill="none"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            className="stroke-navy"
          />
        </g>
      ))}
      <path
        d="M118 19 V91 M118 55 H152"
        fill="none"
        strokeWidth="1.5"
        strokeOpacity="0.35"
        className="stroke-navy"
      />
      <path d="M152 50 l10 5 -10 5 z" className="fill-amber" />
      <rect
        x="166"
        y="32"
        width="66"
        height="46"
        rx="10"
        className="fill-navy"
      />
      {[44, 53, 62].map((y, i) => (
        <rect
          key={y}
          x="180"
          y={y}
          width={i === 2 ? 24 : 38}
          height="4"
          rx="2"
          fillOpacity="0.8"
          className="fill-cream"
        />
      ))}
    </Glyph>
  );
}

// 02. Records with holes in them. The filled cells are what your team fills in,
// the outlined ones are what nobody does, and the amber run is a field that is
// never filled at all.
const RECORD_ROWS = [
  [1, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 1, 0],
  [1, 1, 1, 0, 0, 0],
  [1, 0, 1, 1, 0, 1],
];

function RecordsGlyph() {
  return (
    <Glyph>
      {RECORD_ROWS.map((cells, row) =>
        cells.map((filled, col) => {
          const x = 9 + col * 38;
          const y = 11 + row * 24;
          const gap = row === 2 && col >= 3;
          return filled ? (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width="32"
              height="16"
              rx="4"
              fillOpacity="0.22"
              className="fill-navy"
            />
          ) : (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width="32"
              height="16"
              rx="4"
              fill="none"
              strokeWidth="1.5"
              strokeDasharray={gap ? "4 3" : undefined}
              className={gap ? "stroke-amber" : "stroke-border"}
            />
          );
        })
      )}
    </Glyph>
  );
}

// 03. Everything scored, spread across the four stages of the framework. The
// curve is a shape, not a reading: it says scores land on a scale, and it
// deliberately marks no position, because this glyph belongs to no visitor.
const STAGE_BANDS = ["fill-l1", "fill-l3", "fill-l4", "fill-l5"];

function ScoreGlyph() {
  return (
    <Glyph>
      <path
        d="M10 84 C44 84 48 26 92 26 C136 26 150 62 196 74 C214 78 228 82 238 84 Z"
        fillOpacity="0.14"
        className="fill-navy"
      />
      <path
        d="M10 84 C44 84 48 26 92 26 C136 26 150 62 196 74 C214 78 228 82 238 84"
        fill="none"
        strokeWidth="2"
        strokeOpacity="0.55"
        className="stroke-navy"
      />
      <path
        d="M10 84 H238"
        fill="none"
        strokeWidth="1.5"
        className="stroke-border"
      />
      {STAGE_BANDS.map((band, i) => (
        <rect
          key={band}
          x={10 + i * 58}
          y="92"
          width="54"
          height="10"
          rx="3"
          fillOpacity="0.85"
          className={band}
        />
      ))}
    </Glyph>
  );
}

// 04. The two things that come back. A heat map on the left, a ranked build
// order on the right, which is exactly the pair the step text names.
const HEAT_CELLS = [
  ["fill-l1", "fill-l2", "fill-l3", "fill-l4"],
  ["fill-l2", "fill-l3", "fill-l4", "fill-l5"],
  ["fill-l1", "fill-l3", "fill-l3", "fill-l4"],
  ["fill-l3", "fill-l4", "fill-l5", "fill-l5"],
];

const RANK_BARS = [86, 67, 51, 37];

function OutputGlyph() {
  return (
    <Glyph>
      {HEAT_CELLS.map((row, r) =>
        row.map((cell, c) => (
          <rect
            key={`${r}-${c}`}
            x={8 + c * 24}
            y={9 + r * 24}
            width="20"
            height="20"
            rx="4"
            fillOpacity="0.85"
            className={cell}
          />
        ))
      )}
      <path
        d="M108 12 V98"
        fill="none"
        strokeWidth="1.5"
        className="stroke-border"
      />
      {RANK_BARS.map((width, i) => (
        <g key={width}>
          <text
            x="140"
            y={22 + i * 24}
            textAnchor="end"
            fontFamily="Jost, sans-serif"
            fontSize="11"
            fontWeight="600"
            fillOpacity="0.55"
            className="fill-navy"
          >
            {i + 1}
          </text>
          <rect
            x="146"
            y={12 + i * 24}
            width={width}
            height="14"
            rx="4"
            fillOpacity={i === 0 ? 1 : 0.55 - i * 0.12}
            className={i === 0 ? "fill-amber" : "fill-navy"}
          />
        </g>
      ))}
    </Glyph>
  );
}

const STEPS = [
  {
    label: "It connects to the tools you already run",
    body: "More than twenty of them, starting with whatever you use as a CRM. You authorize read access once and the audit pulls from there.",
    art: ConnectGlyph,
  },
  {
    label: "It reads what your records actually contain",
    body: "Field completeness, stage discipline, which records stopped moving, what never gets filled in at all.",
    art: RecordsGlyph,
  },
  {
    label: "It scores 51 competencies",
    body: "The same four-stage model behind the free Scan, run across the whole revenue engine. The Scan asks you fifteen questions. This one reads 44 of the answers off your systems and scores the newest seven with you on the call.",
    art: ScoreGlyph,
  },
  {
    label: "It returns a heat map and an automation map",
    body: "One shows where the engine is thin. The other ranks what to automate first, and names the repairs that come before the first build.",
    art: OutputGlyph,
  },
];

export default function Mechanism() {
  return (
    <Section bg="cream" narrow={false}>
      <div className="max-w-[760px] mb-10">
        <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
          How the audit works
        </p>
        <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
          What the audit computes, and where the numbers come from.
        </h2>
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          You should not have to take an AI claim on faith, so here is the whole
          method. It runs the same way whether you like the answer or not.
        </p>
      </div>

      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => {
          const Art = step.art;
          return (
            <li
              key={step.label}
              className="relative bg-white border border-border rounded-[14px] p-6"
            >
              <div className="mb-5 rounded-[10px] bg-cream/70 px-4 py-4">
                <Art />
              </div>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-light">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-xl font-semibold text-navy mt-2 mb-2">
                {step.label}
              </p>
              <p className="font-body text-[15px] text-text-mid leading-relaxed">
                {step.body}
              </p>
              {i < STEPS.length - 1 && (
                <svg
                  viewBox="0 0 12 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  className="hidden lg:block absolute top-1/2 -right-[16px] w-3 h-5 -translate-y-1/2 text-amber"
                >
                  <path
                    d="M2 2 L10 10 L2 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-10 max-w-[760px] border-l-2 border-amber pl-5 md:pl-6">
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          The audit costs {audit.price}. {AUDIT_TERMS.creditPercent} of that
          credits forward into the first thing you build, and both maps are
          yours whether you build with us or not.
        </p>
      </div>

      <div className="mt-14 pt-14 border-t border-border max-w-[900px] mx-auto">
        <div className="text-center mb-7">
          <h3 className="font-display text-2xl md:text-[28px] font-semibold text-navy mb-3">
            Prefer to hear it from a person?
          </h3>
          <p className="font-body text-text-mid text-base leading-relaxed max-w-[560px] mx-auto">
            This is Bradley, on camera, on the thinking behind all of it. No form in
            front of it.
          </p>
        </div>
        {/* The video is demoted from funnel centerpiece to proof asset here.
            VSSLPlayer and /watch are deliberately untouched: the poster and the
            title still carry the pre-pivot positioning, and regenerating them
            is its own piece of work. */}
        <VSSLPlayer />
      </div>
    </Section>
  );
}
