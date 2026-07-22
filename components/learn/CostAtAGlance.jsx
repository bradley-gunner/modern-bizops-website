import VizBlock from "@/components/learn/VizBlock";

// Block 2: the four cost figures at a glance, each marked for the argument the
// page turns on, whether the spend ever stops. Fractional retainers and a
// full-time salary are ongoing; a project fee and a coaching engagement are
// bounded. Every figure and label is a real DOM text node, never an image.
//
// The three outbound citations sit here, on the figures they support: the
// full-time salary card carries the neutral salary sources, and the fractional
// card carries the 2026 cost guide. No fractional-COO marketplace is linked.
const OUTBOUND = {
  payscale: {
    label: "Payscale COO salary data",
    href: "https://www.payscale.com/research/US/Job=Chief_Operating_Officer_(COO)/Salary",
  },
  builtIn: {
    label: "Built In COO salary data",
    href: "https://builtin.com/salaries/us/coo-chief-operating-officer",
  },
  insidePartners: {
    label: "Inside Partners 2026 fractional executive cost guide",
    href: "https://www.insidepartners.ai/insights/fractional-executive-cost",
  },
};

const CARDS = [
  {
    name: "Fractional COO",
    figure: "$5,000 to $15,000",
    unit: "a month",
    note: "for 10 to 20 hours a week, roughly $60,000 to $180,000 a year, every year you keep the retainer running",
    kind: "ongoing",
    sources: [OUTBOUND.insidePartners],
  },
  {
    name: "Full-time COO",
    figure: "$400,000+",
    unit: "all-in, first year",
    note: "base salary of roughly $150,000 to $255,000, plus recruiting, benefits, and equity",
    kind: "ongoing",
    sources: [OUTBOUND.payscale, OUTBOUND.builtIn],
  },
  {
    name: "Project consultant",
    figure: "$10,000 to $50,000",
    unit: "fixed fee",
    note: "or more, for one bounded project, then done",
    kind: "bounded",
    sources: [],
  },
  {
    name: "Promote and coach",
    figure: "$5,000 to $15,000",
    unit: "a month, for the engagement",
    note: "not a perpetual retainer, plus the salary of an internal person you are often already paying",
    kind: "bounded",
    sources: [],
  },
];

function KindTag({ kind }) {
  const ongoing = kind === "ongoing";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
        ongoing
          ? "bg-[#B83A2B]/15 text-[#E7A08F]"
          : "bg-[#4E9A5A]/15 text-[#8FCF9B]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          ongoing ? "bg-[#D45040]" : "bg-[#5BB56A]"
        }`}
      />
      {ongoing ? "Ongoing spend" : "Bounded spend"}
    </span>
  );
}

export default function CostAtAGlance() {
  return (
    <VizBlock
      label="Cost at a glance"
      title="What each path costs, and whether the spend ever stops"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {CARDS.map((card) => (
          <div
            key={card.name}
            className="flex flex-col rounded-[14px] border border-white/10 bg-white/[0.045] px-6 py-[26px]"
          >
            <div className="mb-3">
              <KindTag kind={card.kind} />
            </div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-text-light">
              {card.name}
            </p>
            <p className="mt-1.5 font-display text-[34px] font-bold leading-none text-amber-light md:text-[38px]">
              {card.figure}
            </p>
            <p className="mt-1 text-[13px] font-medium text-[#DCE3EE]">
              {card.unit}
            </p>
            <p className="mt-3 text-[14px] leading-[1.5] text-[#C6D0DE]">
              {card.note}
            </p>
            {card.sources.length > 0 && (
              <p className="mt-4 text-[11.5px] leading-snug text-text-light">
                {card.sources.length > 1 ? "Sources" : "Source"}
                {" · "}
                {card.sources.map((s, i) => (
                  <span key={s.href}>
                    {i > 0 && ", "}
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9FB4CD] underline underline-offset-2 hover:text-amber-light"
                    >
                      {s.label}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>
    </VizBlock>
  );
}
