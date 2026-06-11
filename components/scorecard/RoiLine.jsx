const BADGE_STYLES = {
  meets: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  fails: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function RoiLine({ line, modelLabel }) {
  const badge = BADGE_STYLES[line.comparison] || BADGE_STYLES.fails;
  return (
    <div className="bg-white rounded-[14px] border border-border p-6 md:p-7 mb-5">
      <h3 className="font-display text-xl text-navy mb-3">{line.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <p className="font-body text-sm text-text-mid">
          <span className="font-semibold text-text-primary">Your number:</span> {line.clientValue.display}
        </p>
        <p className="font-body text-sm text-text-mid">
          <span className="font-semibold text-text-primary">Typical {modelLabel} peer:</span> {line.peerMedian.display}
          <span className="text-text-light"> (range {line.peerRange.displayLow} to {line.peerRange.displayHigh})</span>
        </p>
      </div>
      <span
        data-comparison={line.comparison}
        className={`inline-block text-xs font-semibold uppercase tracking-wide border rounded-full px-3 py-1 mb-4 ${badge}`}
      >
        {line.comparisonCopy}
      </span>
      <p className="font-body text-text-mid leading-relaxed mb-3">{line.body}</p>
      {line.fix && (
        <div className="border-t border-border pt-4 mt-3">
          <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy mb-2">How to close this</p>
          <p className="font-body text-text-mid leading-relaxed">{line.fix}</p>
        </div>
      )}
      <p className="font-body text-xs text-text-light mt-4">{line.source}</p>
    </div>
  );
}
