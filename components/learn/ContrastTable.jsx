// A generic two-column contrast, left (the market's default) versus right (the
// coaching model), with one labeled aspect per row. Every cell is a real DOM
// text node condensed from the page's own prose, so the distinction stays
// crawlable and never lives only in an image. Light treatment to sit on the
// cream article. Used by the 4.3 page for "most AI consulting" vs "how we work".
export default function ContrastTable({ leftTitle, rightTitle, rows }) {
  return (
    <div className="my-9 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b border-border bg-red-pale px-6 py-4 md:border-r">
          <p className="font-display text-lg font-semibold text-red md:text-xl">
            {leftTitle}
          </p>
        </div>
        <div className="border-b border-border bg-amber-pale px-6 py-4">
          <p className="font-display text-lg font-semibold text-amber md:text-xl">
            {rightTitle}
          </p>
        </div>
      </div>

      {rows.map((row, i) => (
        <div
          key={row.aspect}
          className={i < rows.length - 1 ? "border-b border-border" : ""}
        >
          <p className="bg-cream px-6 pt-4 pb-1 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-light">
            {row.aspect}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="border-b border-border px-6 py-4 text-base leading-relaxed text-text-mid md:border-b-0 md:border-r">
              {row.left}
            </div>
            <div className="px-6 py-4 text-base leading-relaxed text-navy">
              {row.right}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
