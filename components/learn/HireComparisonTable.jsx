import VizBlock from "@/components/learn/VizBlock";

// The ai-consultant-vs-in-house page's centerpiece: the three paths compared,
// with the mixed path picked out in amber because it is the fourth-column
// option most comparison pages do not have (and, disclosed on the page, our
// model). Every cell is a real DOM text node so the comparison stays crawlable
// and AI-extractable; desktop renders one semantic <table>, mobile stacks the
// three paths into cards, both from the same data. Pattern copied from
// CooComparisonTable.jsx.
const OPTIONS = ["In-house hire", "Consultant / agency", "The mixed path"];

const ROWS = [
  {
    label: "Cash cost, year one",
    cells: [
      "$120K to $160K loaded",
      "$10K to $40K for 3 to 5 systems",
      "Audit + builds, then your team owns",
    ],
  },
  {
    label: "Speed to first system",
    cells: ["Months (recruit + ramp)", "Weeks", "Weeks"],
  },
  {
    label: "Ownership in month six",
    cells: [
      "Built in",
      "Must be designed in; often is not",
      "Designed in by definition",
    ],
  },
  {
    label: "Breadth of experience",
    cells: ["One person's history", "Patterns from many clients", "Both"],
  },
  {
    label: "Risk",
    cells: [
      "Mis-hire in a thin talent pool",
      "Dependency on the vendor",
      "Smallest of the three, and it is the one most comparisons leave out",
    ],
  },
];

// Index of the highlighted mixed-path column.
const KEPT = 2;

export default function HireComparisonTable() {
  return (
    <VizBlock label="Side by side" title="The honest comparison">
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

      {/* Mobile: the three paths stacked into cards. */}
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
