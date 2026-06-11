import RoiLine from './RoiLine';
import StagePlacementCard from './StagePlacementCard';
import CtaCard from './CtaCard';
import ComparisonTable from './ComparisonTable';
import CompetencyHeatMap from './CompetencyHeatMap';

export default function ResultView({ result }) {
  const showRoi = result.roiLines.length > 0;
  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="font-display text-3xl md:text-5xl font-semibold text-navy leading-tight mb-5">
          {result.headline.lead}
        </h1>
        <p className="font-body text-text-mid md:text-lg max-w-2xl mx-auto">
          {result.headline.subline}
        </p>
      </section>

      {result.comparisons && result.comparisons.length > 0 && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-5 text-center">How you stack up</h2>
          <ComparisonTable rows={result.comparisons} />
        </section>
      )}

      {showRoi && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-5 text-center">How I got there</h2>
          <div>
            {result.roiLines.map((line) => (
              <RoiLine key={line.key} line={line} modelLabel={result.modelLabel} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-2xl md:text-3xl text-navy mb-5 text-center">Why this is happening</h2>
        <StagePlacementCard placement={result.placement} binding={result.binding} nextStage={result.nextStage} />
      </section>

      {result.competencyScores && result.competencyScores.length > 0 && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-5 text-center">Your competency map</h2>
          <CompetencyHeatMap scores={result.competencyScores} />
        </section>
      )}

      {result.brightSpots && result.brightSpots.length > 0 && (
        <section>
          <h3 className="font-display text-xl md:text-2xl text-navy mb-3 text-center">What you are doing right</h3>
          <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
            <p className="font-body text-text-mid leading-relaxed">
              You scored above your placement on {result.brightSpots.map((s) => s.competencyLabel).join(' and ')}. That is foundation for the work ahead.
            </p>
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-2xl md:text-3xl text-navy mb-5 text-center">What this scorecard can and cannot tell you</h2>
        <div className="bg-cream rounded-[14px] border border-border p-6 md:p-8">
          <p className="font-body text-text-mid leading-relaxed">{result.disclosure}</p>
        </div>
      </section>

      <section>
        <CtaCard cta={result.cta} />
      </section>
    </div>
  );
}
