/**
 * Maps a buildResult() payload onto the flat HubSpot contact-property object
 * we persist alongside a scorecard submission. Pure function, no I/O.
 *
 * Units and provenance (all figures come straight from the already-computed
 * result the results component renders on screen; nothing is recomputed here):
 *   - scorecard_readiness_band: enum, the band NAME (Not Ready Yet |
 *     Foundations First | Ready in Parts | Ready to Build). Provisional
 *     bands by design.
 *   - scorecard_composite: the 1-decimal mean of q5-q13 (1..5).
 *   - scorecard_dim_strategy / _dim_people / _dim_governance: the 1-decimal
 *     per-dimension means (1..5).
 *   - scorecard_belief_confidence: the q4 answer (1..5). NOT in the composite.
 *   - scorecard_connect_comfort: the q13 answer (1..5).
 *   - scorecard_burned_attempt: 'true'/'false'. q5 = "We tried a tool or two,
 *     but they did not stick." Marks the priority segment on the contact
 *     record before any call happens.
 *   - scorecard_url_given: 'true'/'false'. Whether the observed pass had a
 *     URL to run against.
 *   - scorecard_dollar_gap_total / _gap_low / _gap_high: whole USD, the
 *     summed opportunity-map dollar lines (median and floor reads).
 *   - scorecard_rpe_gap / _sales_cycle_gap / _retention_gap: whole USD per
 *     line, 0 when that line did not surface.
 *   - scorecard_top_gap: the human label of the largest-dollar line, or
 *     "None" when there is no gap.
 *   - scorecard_business_model: enum, the canonical business-model key.
 *   - scorecard_completed_at: ISO 8601 timestamp (result.generatedAt).
 *   - scorecard_result_json: the complete computed result
 *     (buildScorecardExport) as JSON.
 *
 * scorecard_maturity_stage retired 2026-08-14 with the stage placement.
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

  const lines = Array.isArray(result.opportunity?.roiLines) ? result.opportunity.roiLines : [];
  const lineGap = (key) => {
    const line = lines.find((l) => l.key === key);
    return line ? usd(line.medianDollars) : 0;
  };

  // roiLines are already sorted by medianDollars descending, so the first is
  // the biggest-dollar gap the results component shows.
  const topLine = lines[0] || null;

  const dims = Object.fromEntries((result.dimensions?.items || []).map((d) => [d.key, d.mean]));
  const businessModelKey = getBusinessModelBenchmark(answers?.q2?.value).businessModel;
  const generatedAt = result.generatedAt || new Date().toISOString();
  const gapLow = usd(result.opportunity?.floorDollars);
  const gapHigh = usd(result.opportunity?.medianDollars);

  return {
    scorecard_readiness_band: result.band?.name || '',
    scorecard_composite: result.band?.composite ?? 0,
    scorecard_dim_strategy: dims.strategy ?? 0,
    scorecard_dim_people: dims.people ?? 0,
    scorecard_dim_governance: dims.governance ?? 0,
    scorecard_belief_confidence: answers?.q4?.score ?? 0,
    scorecard_connect_comfort: answers?.q13?.score ?? 0,
    scorecard_burned_attempt: result.burnedAttempt ? 'true' : 'false',
    scorecard_url_given: result.observed ? 'true' : 'false',
    scorecard_dollar_gap_total: gapHigh,
    scorecard_gap_low: gapLow,
    scorecard_gap_high: gapHigh,
    scorecard_rpe_gap: lineGap('revenuePerEmployee'),
    scorecard_sales_cycle_gap: lineGap('salesCycle'),
    scorecard_retention_gap: lineGap('retention'),
    scorecard_top_gap: topLine ? (ROI_LINE_LABELS[topLine.key] || topLine.key) : 'None',
    scorecard_business_model: businessModelKey,
    scorecard_completed_at: generatedAt,
    scorecard_result_json: JSON.stringify(buildScorecardExport(result, answers, meta)),
  };
}
