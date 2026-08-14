const BADGE_STYLES = {
  meets: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  fails: 'bg-orange-50 text-orange-700 border-orange-200',
};

const VERDICT_STYLES = {
  ready: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blocked: 'bg-orange-50 text-orange-700 border-orange-200',
  audit: 'bg-cream text-navy border-border',
};

function VerdictBadge({ verdict }) {
  const style = VERDICT_STYLES[verdict.state] || VERDICT_STYLES.audit;
  return (
    <span
      data-verdict={verdict.state}
      className={`inline-block text-xs font-semibold uppercase tracking-wide border rounded-full px-3 py-1 ${style}`}
    >
      {verdict.label}
    </span>
  );
}

/**
 * One row of the opportunity map: a Builds-menu area carrying either a
 * computed dollar line (with its shown-arithmetic line) or market-evidence
 * copy, plus the deterministic verdict with its basis, and the per-area
 * "how to close this" paragraph.
 */
export default function OpportunityRow({ row, modelLabel }) {
  const line = row.line;
  const badge = line ? BADGE_STYLES[line.comparison] || BADGE_STYLES.fails : null;
  return (
    <div data-area={row.area} className="bg-white rounded-[14px] border border-border p-6 md:p-7 mb-5">
      <h3 className="font-display text-xl text-navy mb-1">{row.areaTitle}</h3>
      {row.metricTitle && (
        <p className="font-body text-xs uppercase tracking-wide text-text-light mb-3">{row.metricTitle}</p>
      )}

      {line && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 mt-2">
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
          <p className="font-body text-sm text-text-light leading-relaxed mb-1">{line.mathLine}</p>
          {row.capNote && <p className="font-body text-sm text-text-light leading-relaxed">{row.capNote}</p>}
        </>
      )}

      {!line && row.kind === 'computed' && row.statusLine && (
        <p className="font-body text-text-mid leading-relaxed mt-2 mb-3">{row.statusLine}</p>
      )}

      {row.kind === 'evidence' && (
        <p className="font-body text-text-mid leading-relaxed mt-2 mb-3">{row.body}</p>
      )}

      <div className="border-t border-border pt-4 mt-4">
        <VerdictBadge verdict={row.verdict} />
        {row.verdict.gap && (
          <p className="font-body text-sm text-text-mid mt-2">Blocked by: {row.verdict.gap}.</p>
        )}
        <p className="font-body text-xs text-text-light mt-2">Basis: {row.verdict.basis}.</p>
      </div>

      {row.fix && (
        <div className="border-t border-border pt-4 mt-4">
          <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy mb-2">How to close this</p>
          <p className="font-body text-text-mid leading-relaxed">{row.fix}</p>
        </div>
      )}
      {row.source && <p className="font-body text-xs text-text-light mt-4">{row.source}</p>}
    </div>
  );
}
