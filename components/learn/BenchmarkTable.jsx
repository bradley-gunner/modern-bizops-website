import VizBlock from "@/components/learn/VizBlock";

// Benchmark table: a labelled two-column block for pages that cite a set of
// figures by category rather than one or two headline numbers. Like the ladder
// and stat cards it is semantic HTML, so every business type, figure, and note
// stays a real DOM text node. Rows are two columns on desktop and stack on
// mobile, so long ranges never clip.
export default function BenchmarkTable({ label, title, rows }) {
  return (
    <VizBlock label={label} title={title}>
      <div className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.type}
            className="flex flex-col gap-1 border-b border-white/10 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <span className="text-[15px] text-[#E7ECF3]">{row.type}</span>
            <div className="sm:text-right">
              <span className="font-display text-[19px] font-semibold text-amber-light md:text-[20px]">
                {row.value}
              </span>
              {row.note && (
                <span className="mt-0.5 block text-[12px] leading-snug text-text-light">
                  {row.note}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </VizBlock>
  );
}
