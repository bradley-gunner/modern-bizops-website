// Shared shell for the dark data blocks (stat cards, maturity ladder,
// comparison). Always navy regardless of the hero's theme, so the data-visual
// identity stays constant across the library while only the hero rotates.
export default function VizBlock({ label, title, children }) {
  return (
    <div className="my-[34px] overflow-hidden rounded-[18px] border border-[rgba(232,135,58,0.28)] bg-[linear-gradient(180deg,#13284a,#0E1F38)] px-6 py-8 text-cream md:px-[34px]">
      {label && (
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-light">
          {label}
        </p>
      )}
      {title && (
        <h3 className="mb-[22px] font-display text-[26px] font-semibold leading-[1.15] text-white">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
