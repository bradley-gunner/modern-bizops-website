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
const STEPS = [
  {
    label: "It connects to the tools you already run",
    body: "More than twenty of them, starting with whatever you use as a CRM. You authorize read access once and the audit pulls from there.",
  },
  {
    label: "It reads what your records actually contain",
    body: "Field completeness, stage discipline, which records stopped moving, what never gets filled in at all.",
  },
  {
    label: "It scores 44 competencies",
    body: "The same four-stage model behind the free Scan, run across the whole revenue engine. The Scan asks you fifteen questions. This one reads the answers off your systems.",
  },
  {
    label: "It returns a heat map and an automation map",
    body: "One shows where the engine is thin. The other ranks what to automate first, and names the repairs that come before the first build.",
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

      <ol className="grid gap-5 sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <li
            key={step.label}
            className="bg-white border border-border rounded-[14px] p-6"
          >
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-light">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-display text-xl font-semibold text-navy mt-2 mb-2">
              {step.label}
            </p>
            <p className="font-body text-[15px] text-text-mid leading-relaxed">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-10 max-w-[760px]">
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          The audit costs {audit.price}. {AUDIT_TERMS.creditPercent} of that
          credits forward into the first thing you build, and both maps are
          yours whether you build with us or not.
        </p>
      </div>

      <div className="mt-14 max-w-[900px] mx-auto">
        <div className="text-center mb-7">
          <h3 className="font-display text-2xl md:text-[28px] font-semibold text-navy mb-3">
            Prefer to hear it from a person?
          </h3>
          <p className="font-body text-text-mid text-base leading-relaxed max-w-[560px] mx-auto">
            This is me, on camera, on the thinking behind all of it. No form in
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
