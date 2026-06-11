export default function StagePlacementCard({ placement, binding, nextStage }) {
  return (
    <div className="bg-white rounded-[14px] border border-border p-6 md:p-8 mb-5">
      <h3 className="font-display text-xl md:text-2xl text-navy mb-3">
        Stage {placement.stage}: {placement.name}
      </h3>
      <p className="font-body text-text-mid leading-relaxed mb-4">{placement.descriptor}</p>
      {binding && <p className="font-body text-text-primary leading-relaxed mb-5">{binding.translation}</p>}
      {nextStage && (
        <div className="border-t border-border pt-5 mt-2">
          <h4 className="font-display text-sm font-semibold tracking-wide text-navy uppercase mb-3">
            What crossing into {nextStage.name} looks like
          </h4>
          <ul className="space-y-2">
            {nextStage.criteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2 font-body text-text-mid">
                <span className="text-amber mt-1">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
