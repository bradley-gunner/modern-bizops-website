import VizBlock from "@/components/learn/VizBlock";

// Benchmark stat cards. Every number, description, and source here is a real
// DOM text node, never an image, so the page's cited benchmarks stay crawlable
// and extractable. Text comes from the page's own prose, verbatim.
export default function StatCards({ label, title, stats }) {
  return (
    <VizBlock label={label} title={title}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.big}
            className="rounded-[14px] border border-white/10 bg-white/[0.045] px-6 py-[26px]"
          >
            <p className="mb-3 font-display text-[44px] font-bold leading-none text-amber-light md:text-[52px]">
              {stat.big}
            </p>
            <p className="mb-3.5 text-[15px] leading-[1.5] text-[#DCE3EE]">
              {stat.desc}
            </p>
            <p className="text-[11.5px] uppercase tracking-[0.06em] text-text-light">
              Source &middot; {stat.source}
            </p>
          </div>
        ))}
      </div>
    </VizBlock>
  );
}
