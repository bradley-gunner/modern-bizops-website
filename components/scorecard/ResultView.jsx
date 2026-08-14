import OpportunityRow from './OpportunityRow';
import CtaCard from './CtaCard';
import ComparisonTable from './ComparisonTable';

/** Doc 15 Part 5's section order, exactly: band headline, why it did not
 *  stick (burned flag only), belief contrast, observed findings (URL only),
 *  dimension bars, opportunity map, first move, greyed computed dimensions
 *  flowing into the CTA card. The PDF mirrors this order. */

const TONE_DOT = {
  good: 'bg-emerald-600',
  gap: 'bg-orange-700',
  info: 'bg-navy/40',
};

function ObservedBlock({ findings }) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl text-navy mb-4 text-center">{findings.heading}</h2>
      <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-wide bg-navy text-cream rounded-full px-3 py-1 mb-4">
          {findings.marker}
        </span>
        {findings.unreachable ? (
          <p className="font-body text-text-mid leading-relaxed">{findings.text}</p>
        ) : (
          <>
            <div>
              {findings.lines.map((line) => (
                <div key={line.key} data-observed={line.key} className="flex items-start gap-3 py-2.5 border-b border-cream last:border-b-0">
                  <span aria-hidden="true" className={`mt-2 h-2.5 w-2.5 flex-none rounded-full ${TONE_DOT[line.tone] || TONE_DOT.info}`} />
                  <p className="font-body text-text-mid leading-relaxed">{line.text}</p>
                </div>
              ))}
            </div>
            <p className="font-body text-sm italic text-text-light mt-4">{findings.boundary}</p>
          </>
        )}
      </div>
    </section>
  );
}

function DimensionBars({ dimensions }) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl text-navy mb-4 text-center">{dimensions.heading}</h2>
      <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-wide bg-cream text-text-mid border border-border rounded-full px-3 py-1 mb-5">
          {dimensions.marker}
        </span>
        {dimensions.items.map((d) => (
          <div key={d.key} data-dimension={d.key} className="mb-6 last:mb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-body font-semibold text-text-primary">{d.label}</h3>
              <span className="font-body text-sm text-text-light">{d.meanDisplay} of 5 &middot; {d.levelWord}</span>
            </div>
            <div className="h-2.5 rounded-full bg-cream-dark my-2 overflow-hidden" role="img" aria-label={`${d.label}: ${d.meanDisplay} of 5, ${d.levelWord}`}>
              <div className="h-full rounded-full bg-amber" style={{ width: `${(d.mean / 5) * 100}%` }} />
            </div>
            <p className="font-body text-sm text-text-mid leading-relaxed">{d.read}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ResultView({ result }) {
  return (
    <div className="space-y-10">
      {/* 1. The readiness band, not a dollar figure */}
      <section className="text-center">
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-3">{result.band.eyebrow}</p>
        <h1 className="font-display text-4xl md:text-6xl font-semibold text-navy leading-tight mb-3">
          {result.band.name}
        </h1>
        <p className="font-body text-sm text-text-light mb-5">{result.band.marker}</p>
        <p className="font-body text-text-mid md:text-lg max-w-2xl mx-auto">{result.band.descriptor}</p>
      </section>

      {/* 2. Why it did not stick (burned-attempt flag only) */}
      {result.whyItDidNotStick && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-4 text-center">{result.whyItDidNotStick.heading}</h2>
          <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
            <p className="font-body text-text-mid leading-relaxed">{result.whyItDidNotStick.text}</p>
          </div>
        </section>
      )}

      {/* 3. The belief contrast */}
      {result.belief && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-4 text-center">{result.belief.heading}</h2>
          <div className="bg-cream rounded-[14px] border border-border p-6 md:p-8">
            <p className="font-body text-text-mid leading-relaxed">{result.belief.text}</p>
          </div>
        </section>
      )}

      {/* 4. Observed from public surfaces (URL given only) */}
      {result.observedFindings && <ObservedBlock findings={result.observedFindings} />}

      {/* 5. The three askable dimensions */}
      <DimensionBars dimensions={result.dimensions} />

      {/* 6. The opportunity map */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl text-navy mb-4 text-center">{result.opportunity.heading}</h2>
        {result.opportunity.noGap ? (
          <div className="text-center mb-6">
            <p className="font-display text-xl md:text-2xl text-navy mb-2">{result.opportunity.noGap.lead}</p>
            <p className="font-body text-text-mid max-w-2xl mx-auto">{result.opportunity.noGap.subline}</p>
          </div>
        ) : (
          <p className="font-body text-text-mid max-w-2xl mx-auto text-center mb-6">{result.opportunity.intro}</p>
        )}
        <div>
          {result.opportunity.rows.map((row) => (
            <OpportunityRow key={row.area} row={row} modelLabel={result.modelLabel} />
          ))}
        </div>
        {result.opportunity.comparisons && result.opportunity.comparisons.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display text-xl md:text-2xl text-navy mb-4 text-center">{result.opportunity.comparisonsHeading}</h3>
            <ComparisonTable rows={result.opportunity.comparisons} />
          </div>
        )}
      </section>

      {/* 7. The first move, given away */}
      {result.firstMove && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-4 text-center">{result.firstMove.heading}</h2>
          <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-navy mb-2">
              From your weakest dimension: {result.firstMove.dimensionLabel}
            </p>
            <p className="font-body text-text-mid leading-relaxed">{result.firstMove.text}</p>
          </div>
        </section>
      )}

      {/* 8. What we could not measure: the CTA block */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl text-navy mb-4 text-center">{result.computedDimensions.heading}</h2>
        <p className="font-body text-text-mid max-w-2xl mx-auto text-center mb-6">{result.computedDimensions.intro}</p>
        <div className="bg-white rounded-[14px] border border-border p-6 md:p-8 mb-6">
          {result.computedDimensions.items.map((item) => (
            <div key={item.key} data-computed-dimension={item.key} className="flex items-start gap-3 py-3 border-b border-cream last:border-b-0 opacity-75">
              <span aria-hidden="true" className="font-body text-text-light mt-0.5">&#128274;</span>
              <div>
                <h3 className="font-body font-semibold text-text-primary mb-0.5">{item.name}</h3>
                <p className="font-body text-sm text-text-mid leading-relaxed">{item.line}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-cream rounded-[14px] border border-border p-6 md:p-8 mb-6">
          <p className="font-body text-text-mid leading-relaxed">{result.disclosure}</p>
        </div>
        <CtaCard cta={result.cta} />
      </section>
    </div>
  );
}
