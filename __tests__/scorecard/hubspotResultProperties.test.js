import { describe, it, expect } from 'vitest';
import { buildResult } from '@/lib/scorecard/resultRender';
import { mapResultToHubSpotProperties } from '@/lib/scorecard/hubspotResultProperties';

// A low-maturity professional-services submission that surfaces dollar gaps.
function answers() {
  return {
    q1: { value: '7m_15m' },
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },
    q4: { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
    q7: { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
    q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
    q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
  };
}

describe('mapResultToHubSpotProperties', () => {
  it('maps the nine computed properties with correct units and values', () => {
    const result = buildResult(answers(), { generatedAt: '2026-07-24T12:00:00.000Z' });
    const props = mapResultToHubSpotProperties(result, answers());

    // All twelve keys present.
    expect(Object.keys(props).sort()).toEqual(
      [
        'scorecard_business_model',
        'scorecard_completed_at',
        'scorecard_dollar_gap_total',
        'scorecard_gap_high',
        'scorecard_gap_low',
        'scorecard_maturity_stage',
        'scorecard_result_json',
        'scorecard_retention_gap',
        'scorecard_rpe_gap',
        'scorecard_sales_cycle_gap',
        'scorecard_top_gap',
      ].sort()
    );

    // Enums map to canonical values.
    expect(props.scorecard_maturity_stage).toBe('Reactive');
    expect(props.scorecard_business_model).toBe('PROFESSIONAL_SERVICES');

    // Timestamp passes through as ISO 8601.
    expect(props.scorecard_completed_at).toBe('2026-07-24T12:00:00.000Z');

    // Dollar-gap range: low = floor, high = peer-median; total mirrors high.
    expect(props.scorecard_gap_low).toBe(Math.round(result.headline.floorDollars));
    expect(props.scorecard_gap_high).toBe(Math.round(result.headline.medianDollars));
    expect(props.scorecard_dollar_gap_total).toBe(props.scorecard_gap_high);
    expect(props.scorecard_gap_high).toBeGreaterThanOrEqual(props.scorecard_gap_low);

    // High equals the sum of the surfaced per-line gaps.
    const lineSum = props.scorecard_rpe_gap + props.scorecard_sales_cycle_gap + props.scorecard_retention_gap;
    expect(lineSum).toBe(props.scorecard_gap_high);

    // Dollar figures are whole, non-negative numbers.
    for (const key of ['scorecard_dollar_gap_total', 'scorecard_gap_low', 'scorecard_gap_high', 'scorecard_rpe_gap', 'scorecard_sales_cycle_gap', 'scorecard_retention_gap']) {
      expect(Number.isInteger(props[key])).toBe(true);
      expect(props[key]).toBeGreaterThanOrEqual(0);
    }

    // Top gap is the label of the largest-dollar ROI line.
    const topKey = result.roiLines[0].key;
    const labels = { revenuePerEmployee: 'Revenue per employee', salesCycle: 'Sales cycle', retention: 'Gross revenue retention' };
    expect(props.scorecard_top_gap).toBe(labels[topKey]);

    // result_json is the rich export: parses and carries the maturity stage.
    const parsed = JSON.parse(props.scorecard_result_json);
    expect(parsed.maturityStage.number).toBe(result.placement.stage);
    expect(parsed.questions.length).toBeGreaterThanOrEqual(14);
  });

  it('falls back to OTHER for an unknown business model', () => {
    const a = { ...answers(), q2: { value: 'NOT_A_MODEL' } };
    const result = buildResult(a);
    const props = mapResultToHubSpotProperties(result, a);
    expect(props.scorecard_business_model).toBe('OTHER');
  });

  it('sets per-line gaps to 0 and top_gap to "None" when no dollar gap surfaces', () => {
    // A top-maturity SaaS shop that meets every benchmark: no ROI lines.
    const a = {
      q1: { value: '7m_15m' },
      q2: { value: 'B2B_SAAS' },
      q3: { value: '1_10' }, // tiny team -> very high revenue/employee, meets benchmark
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'D', score: 4 }, q8: { value: 'D', score: 4 }, q9: { value: 'D', score: 4 },
      q10: { value: 'D', score: 4 }, q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 },
      q13: { value: '25k_100k' }, q14: { value: 'under_30' }, q15: { value: 'under_5' },
    };
    const result = buildResult(a);
    const props = mapResultToHubSpotProperties(result, a);
    expect(result.roiLines.length).toBe(0);
    expect(props.scorecard_dollar_gap_total).toBe(0);
    expect(props.scorecard_rpe_gap).toBe(0);
    expect(props.scorecard_sales_cycle_gap).toBe(0);
    expect(props.scorecard_retention_gap).toBe(0);
    expect(props.scorecard_top_gap).toBe('None');
    expect(props.scorecard_maturity_stage).toBe('Compounding');
  });
});
