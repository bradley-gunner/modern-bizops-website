export default function StagePlacementCard({ placement, binding }) {
  return (
    <div className="bg-white rounded-[14px] border border-border p-6 md:p-8 mb-5">
      <h3 className="font-display text-xl md:text-2xl text-navy mb-3">
        Stage {placement.stage}: {placement.name}
      </h3>
      <p className="font-body text-text-mid leading-relaxed mb-4">{placement.descriptor}</p>
      {binding && <p className="font-body text-text-primary leading-relaxed">{binding.translation}</p>}
    </div>
  );
}
