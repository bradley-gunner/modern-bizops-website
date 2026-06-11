const BADGE_STYLES = {
  meets: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  fails: 'bg-orange-50 text-orange-700 border-orange-200',
};

function Badge({ comparison, copy }) {
  const style = BADGE_STYLES[comparison] || BADGE_STYLES.fails;
  return (
    <span
      data-comparison={comparison}
      className={`inline-block text-xs font-semibold uppercase tracking-wide border rounded-full px-2.5 py-1 ${style}`}
    >
      {copy}
    </span>
  );
}

export default function ComparisonTable({ rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="bg-white rounded-[14px] border border-border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-cream/60">
          <tr>
            <th className="font-body text-xs uppercase tracking-wide text-text-mid px-4 py-3">Metric</th>
            <th className="font-body text-xs uppercase tracking-wide text-text-mid px-4 py-3">Your number</th>
            <th className="font-body text-xs uppercase tracking-wide text-text-mid px-4 py-3">Peer median</th>
            <th className="font-body text-xs uppercase tracking-wide text-text-mid px-4 py-3">Peer range</th>
            <th className="font-body text-xs uppercase tracking-wide text-text-mid px-4 py-3">Read</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-border align-top">
              <td className="px-4 py-3 font-body text-text-primary">
                <div>{row.label}</div>
                <div className="font-body text-xs text-text-light mt-1">{row.source}</div>
              </td>
              <td className="px-4 py-3 font-body text-text-primary">{row.clientDisplay}</td>
              <td className="px-4 py-3 font-body text-text-primary">{row.peerMedianDisplay}</td>
              <td className="px-4 py-3 font-body text-text-mid">{row.peerRangeDisplay}</td>
              <td className="px-4 py-3"><Badge comparison={row.comparison} copy={row.comparisonCopy} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
