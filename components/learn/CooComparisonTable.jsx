import VizBlock from "@/components/learn/VizBlock";
import { LADDER, AUDIT_TERMS } from "@/lib/offers";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

// The page's centerpiece: the four ways to fix operations, side by side. Every
// cost, scope, and label is a real DOM text node (never an image), so the
// comparison stays crawlable and AI-extractable. On desktop it renders as one
// semantic <table>; on mobile the four options stack into four cards, both
// built from the same data below so the cell text is identical either way.
//
// The fourth column is picked out in amber: it is Modern BizOps' actual offer
// and the one option the other cost guides leave out.
//
// It was headed "Promote and coach" and priced at "$5,000 to $15,000 a month"
// until 2026-08-12, which was the retired coaching engagement. That number was
// two to six times the real one by then, published on a live page next to a
// pricing page that said otherwise. It now interpolates from lib/offers.js, so
// it cannot drift from the ladder again.
const OPTIONS = [
  "Fractional COO",
  "Full-time COO",
  "Project consultant",
  "Build it and hand it over",
];

const ROWS = [
  {
    label: "Typical cost",
    cells: [
      "$3,000 to $20,000 a month, commonly $5,000 to $15,000 for 10 to 20 hours a week ($60,000 to $180,000 a year)",
      "Base salary of roughly $150,000 to $255,000, total compensation reaching $277,000 to $298,000, and an all-in first-year cost above $400,000 with recruiting, benefits, and equity",
      "$10,000 to $50,000 or more as a fixed fee for one defined project",
      `A ${rung.audit.price} audit, credited ${AUDIT_TERMS.creditPercent} toward the first build, then named systems at ${rung.builds.price} each, or ${rung.partner.price} for the ongoing partnership. Published, bounded, and on top of the salary of an internal person you are often already paying`,
    ],
  },
  {
    label: "Scope",
    cells: [
      "Part-time senior operational leadership, hands-on",
      "Full, permanent ownership of operations",
      "One bounded project, then done",
      "Named systems built into your business, with a runbook and an internal owner coached to run them after we leave",
    ],
  },
  {
    label: "Ramp time",
    cells: [
      "Fast, often contributing in week one",
      "Slow, months to recruit and onboard",
      "Fast, but narrow",
      "Moderate, your person learns the system as it goes in",
    ],
  },
  {
    label: "Commitment",
    cells: [
      "Months to two years is typical",
      "Permanent",
      "Weeks to a few months",
      "The engagement length, then your team is self-sufficient",
    ],
  },
  {
    label: "When it ends",
    cells: [
      "You stop the retainer, and the leadership and the knowledge leave with them",
      "Severance and a leadership gap to backfill",
      "The consultant hands over a deliverable and leaves",
      "Nothing recurring to end; the capability and the person stay",
    ],
  },
  {
    label: "Who owns the work afterward",
    cells: [
      "The fractional COO, who is now with their next client",
      "The COO, until they leave",
      "The consultant",
      "Your team",
    ],
  },
];

// Index of the highlighted Modern BizOps column.
const KEPT = 3;

export default function CooComparisonTable() {
  return (
    <VizBlock
      label="Side by side"
      title="The four ways to fix operations, compared"
    >
      {/* Desktop: one semantic table. */}
      <table className="hidden w-full border-collapse text-left align-top md:table">
        <thead>
          <tr>
            <th className="w-[1%] border-b border-white/15 py-3 pr-4" />
            {OPTIONS.map((opt, c) => (
              <th
                key={opt}
                scope="col"
                className={`border-b border-white/15 px-4 py-3 font-display text-[17px] font-semibold ${
                  c === KEPT
                    ? "rounded-t-lg bg-amber/[0.12] text-amber-light"
                    : "text-white"
                }`}
              >
                {opt}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="border-b border-white/10 py-4 pr-4 align-top text-[11.5px] font-semibold uppercase tracking-[0.08em] text-text-light"
              >
                {row.label}
              </th>
              {row.cells.map((cell, c) => (
                <td
                  key={c}
                  className={`border-b border-white/10 px-4 py-4 align-top text-[14px] leading-[1.45] ${
                    c === KEPT
                      ? "bg-amber/[0.07] text-[#F4E8DA]"
                      : "text-[#DCE3EE]"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: the four options stacked into four cards. */}
      <div className="flex flex-col gap-4 md:hidden">
        {OPTIONS.map((opt, c) => (
          <div
            key={opt}
            className={`rounded-[14px] border px-5 py-5 ${
              c === KEPT
                ? "border-amber/40 bg-amber/[0.08]"
                : "border-white/10 bg-white/[0.045]"
            }`}
          >
            <p
              className={`mb-3 font-display text-[19px] font-semibold ${
                c === KEPT ? "text-amber-light" : "text-white"
              }`}
            >
              {opt}
            </p>
            <dl className="flex flex-col gap-3">
              {ROWS.map((row) => (
                <div key={row.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-light">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 text-[14px] leading-[1.45] text-[#DCE3EE]">
                    {row.cells[c]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </VizBlock>
  );
}
