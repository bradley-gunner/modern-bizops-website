// Block 1 of the Revenue Operations Consulting page: the coaching-vs-consulting
// contrast, which is the spine of the whole argument. Two columns, three rows.
// Every cell is a real DOM text node pulled near-verbatim from the page's
// "Consulting builds it for you. Coaching builds it into you." section, so the
// distinction stays crawlable and never lives only in an image.
const rows = [
  {
    aspect: "Who does the work",
    traditional:
      "A traditional consultant or agency does the work themselves. They configure your CRM, redesign your process, and present the finished thing.",
    coaching: "Your team does the work. I provide the roadmap and the guidance.",
  },
  {
    aspect: "Who owns the capability afterward",
    traditional:
      "Your team did not build it, so your team does not truly own it.",
    coaching:
      "The capability stays in the building, because the people who run it every day are the ones who built it.",
  },
  {
    aspect: "When the engagement ends",
    traditional:
      "The person who understood why every decision was made is now working with their next client.",
    coaching:
      "You end up with a working system and a team that owns it, not a vendor you have to keep on retainer to keep the lights on.",
  },
];

export default function CoachingContrast() {
  return (
    <div className="my-9 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      {/* Column headers */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b border-border bg-red-pale px-6 py-4 md:border-r">
          <p className="font-display text-lg font-semibold text-red md:text-xl">
            Traditional consulting or agency
          </p>
        </div>
        <div className="border-b border-border bg-amber-pale px-6 py-4">
          <p className="font-display text-lg font-semibold text-amber md:text-xl">
            The coaching model
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
              {row.traditional}
            </div>
            <div className="px-6 py-4 text-base leading-relaxed text-navy">
              {row.coaching}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
