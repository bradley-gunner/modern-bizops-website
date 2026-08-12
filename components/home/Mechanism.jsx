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
// credibility budget on the second one: what the instrument reads, where the
// numbers come from, and what comes back. Show the mechanism, never the magic.
//
// The 72% figure is the reason this section exists, not copy for it. House
// rule: a benchmark is supporting proof, never the hook.
const STEPS = [
  {
    label: "It connects to the tools you already run",
    body: "More than twenty of them: the CRM, the marketing platform, the billing system, the support desk. You authorize the connection and it reads from there.",
  },
  {
    label: "It reads the stack, not a survey",
    body: "Field completeness, stage discipline, where records go quiet, what never gets filled in. Nobody on your team has to grade themselves, which is the step where most assessments stop being true.",
  },
  {
    label: "It scores 44 competencies",
    body: "The same four-stage model behind the free Scan, computed from your data instead of self-reported, across the whole revenue engine rather than one function.",
  },
  {
    label: "It returns a heat map and an automation map",
    body: "One shows where the engine is thin. The other ranks what to automate first and what has to be fixed before any of it will hold.",
  },
];

export default function Mechanism() {
  return (
    <Section bg="cream" narrow={false}>
      <div className="max-w-[760px] mb-10">
        <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
          Mechanism, not magic
        </p>
        <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
          What the audit computes, and where the numbers come from.
        </h2>
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          You should not have to take an AI claim on faith, so here is the
          instrument in full. It is the same thing whether you like the answer
          or not.
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
          Plenty of firms will sell you an AI strategy workshop and hand you a
          slide deck at the end of it. We have not found one, at any price, that
          computes the answer from your connected systems. That is the whole
          reason this instrument exists, and it is why the audit costs{" "}
          {audit.price} and credits {AUDIT_TERMS.creditPercent} forward instead
          of being sold as a report.
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
