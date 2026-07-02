export default function MaturityFaq({ items }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <details
          key={i}
          className="bg-white border border-border rounded-xl p-5 group"
        >
          <summary className="font-display font-semibold text-navy text-lg cursor-pointer list-none flex justify-between items-center gap-4">
            {it.q}
            <span className="text-amber group-open:rotate-45 transition-transform shrink-0">
              +
            </span>
          </summary>
          <p className="mt-3 text-text-mid leading-relaxed">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
