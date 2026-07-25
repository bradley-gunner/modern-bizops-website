/**
 * Maps a buildResult() payload onto the flat HubSpot contact-property object
 * we persist alongside a scorecard submission. Pure function, no I/O.
 *
 * Units and provenance (all figures come straight from the already-computed
 * result the results component renders on screen; nothing is recomputed here):
 *   - scorecard_dollar_gap_total: whole USD. The peer-median total, i.e.
 *     headline.medianDollars, which equals the sum of the surfaced ROI lines'
 *     medianDollars. This is the larger of the two figures in the on-screen
 *     headline ("leaving between {floor} and {median} on the table").
 *   - scorecard_rpe_gap / _sales_cycle_gap / _retention_gap: whole USD. Each is
 *     the peer-median dollar gap (medianDollars) of the matching ROI line, or 0
 *     when that line did not surface (competency meets benchmark, input not
 *     tracked, or the question was hidden for the model). The conservative
 *     (floor) figures and every other detail are preserved in _result_json.
 *   - scorecard_maturity_stage: enum, the stage NAME (Reactive | Repeatable |
 *     Predictable | Compounding) for placement.stage 1..4.
 *   - scorecard_top_gap: the human label of the largest-dollar ROI line
 *     (roiLines are sorted medianDollars desc), or "None" when there is no gap.
 *   - scorecard_business_model: enum, the canonical business-model key derived
 *     from q2 (falls back to OTHER for an unknown/missing answer).
 *   - scorecard_gap_low / scorecard_gap_high: whole USD. The dollar-gap RANGE
 *     shown on screen ("leaving between {low} and {high}"). low is the
 *     conservative (floor) read, high is the peer-median read. gap_high equals
 *     the legacy scorecard_dollar_gap_total (kept for back-compat).
 *   - scorecard_completed_at: ISO 8601 timestamp (result.generatedAt).
 *   - scorecard_result_json: the complete computed result (buildScorecardExport)
 *     as JSON: 15 Q&A, profile bands, business model, the three metrics with
 *     dollar impact + how-to-close prose + source, the dollar-gap range, the
 *     maturity stage, the top gap, and the competency map.
 */

import { getBusinessModelBenchmark } from './businessModelBenchmarks';
import { buildScorecardExport } from './scorecardExport';

// Human labels for the ROI-line keys, used for scorecard_top_gap.
const ROI_LINE_LABELS = {
  revenuePerEmployee: 'Revenue per employee',
  salesCycle: 'Sales cycle',
  retention: 'Gross revenue retention',
};

function usd(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

export function mapResultToHubSpotProperties(result, answers, meta = {}) {
  if (!result) return {};

  const lines = Array.isArray(result.roiLines) ? result.roiLines : [];
  const lineGap = (key) => {
    const line = lines.find((l) => l.key === key);
    return line ? usd(line.medianDollars) : 0;
  };

  // roiLines are already sorted by medianDollars descending, so the first is
  // the biggest-dollar gap the results component shows.
  const topLine = lines[0] || null;

  const businessModelKey = getBusinessModelBenchmark(answers?.q2?.value).businessModel;
  const generatedAt = result.generatedAt || new Date().toISOString();
  const gapLow = usd(result.headline?.floorDollars);
  const gapHigh = usd(result.headline?.medianDollars);

  return {
    scorecard_dollar_gap_total: gapHigh,
    scorecard_gap_low: gapLow,
    scorecard_gap_high: gapHigh,
    scorecard_rpe_gap: lineGap('revenuePerEmployee'),
    scorecard_sales_cycle_gap: lineGap('salesCycle'),
    scorecard_retention_gap: lineGap('retention'),
    scorecard_maturity_stage: result.placement?.name || '',
    scorecard_top_gap: topLine ? (ROI_LINE_LABELS[topLine.key] || topLine.key) : 'None',
    scorecard_business_model: businessModelKey,
    scorecard_completed_at: generatedAt,
    scorecard_result_json: JSON.stringify(buildScorecardExport(result, answers, meta)),
  };
}
