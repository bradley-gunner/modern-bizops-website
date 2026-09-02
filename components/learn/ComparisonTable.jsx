import VizBlock from "@/components/learn/VizBlock";

// A data-driven side-by-side comparison for the buying-decision pages. Every
// cell is a real DOM text node so the comparison stays crawlable and
// AI-extractable; desktop renders one semantic <table>, mobile stacks the
// options into cards, both from the same data. Generalized from
// HireComparisonTable.jsx (which hardcodes its rows) so the AEO batch 2 pages
// can each supply their own options and rows. `highlight` is the index of the
// column picked out in amber, or -1 for none: use it only for the option the
// page argues for (our model, or the layer most quotes leave out), never for
// decoration.
export default function ComparisonTable({
  label,
  title,
  options,
  rows,
  highlight = -1,
}) {
  return (
    <VizBlock label={label} title={title}>
      {/* Desktop: one semantic table. */}
      <table className="hidden w-full border-collapse text-left align-top md:table">
        <thead>
          <tr>
            <th className="w-[1%] border-b border-white/15 py-3 pr-4" />
            {options.map((opt, c) => (
              <th
                key={opt}
                scope="col"
                className={`border-b border-white/15 px-4 py-3 font-display text-[17px] font-semibold ${
                  c === highlight
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
          {rows.map((row) => (
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
                    c === highlight
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

      {/* Mobile: the options stacked into cards. */}
      <div className="flex flex-col gap-4 md:hidden">
        {options.map((opt, c) => (
          <div
            key={opt}
            className={`rounded-[14px] border px-5 py-5 ${
              c === highlight
                ? "border-amber/40 bg-amber/[0.08]"
                : "border-white/10 bg-white/[0.045]"
            }`}
          >
            <p
              className={`mb-3 font-display text-[19px] font-semibold ${
                c === highlight ? "text-amber-light" : "text-white"
              }`}
            >
              {opt}
            </p>
            <dl className="flex flex-col gap-3">
              {rows.map((row) => (
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
