import { describe, it, expect } from 'vitest';
import { buildResult } from '@/lib/scorecard/resultRender';
import { mapResultToHubSpotProperties } from '@/lib/scorecard/hubspotResultProperties';

function answers() {
  return {
    q1: { value: '5m_15m' },
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },
    q4: { value: 'D', score: 4 },
    q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 }, q7: { value: 'B', score: 2 },
    q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 }, q10: { value: 'C', score: 3 },
    q11: { value: 'A', score: 1 }, q12: { value: 'B', score: 2 }, q13: { value: 'C', score: 3 },
    q14: { value: '25k_100k' }, q15: { value: 'over_180' }, q16: { value: 'over_30' },
  };
}

const GENERATED_AT = '2026-08-14T12:00:00.000Z';

describe('mapResultToHubSpotProperties', () => {
  const result = buildResult(answers(), { generatedAt: GENERATED_AT });
  const props = mapResultToHubSpotProperties(result, answers(), { firstName: 'Jane' });

  it('writes the readiness read: band, composite, per-dimension means', () => {
    expect(props.scorecard_readiness_band).toBe('Foundations First');
    expect(props.scorecard_composite).toBe(2.0);
    expect(props.scorecard_dim_strategy).toBe(1.7);
    expect(props.scorecard_dim_people).toBe(2.3);
    expect(props.scorecard_dim_governance).toBe(2.0);
  });

  it('writes the segment flags: burned attempt, belief, connect comfort, url given', () => {
    expect(props.scorecard_burned_attempt).toBe('true');
    expect(props.scorecard_belief_confidence).toBe(4);
    expect(props.scorecard_connect_comfort).toBe(3);
    expect(props.scorecard_url_given).toBe('false');
  });

  it('burned flag reads false for a never-tried respondent (negative control)', () => {
    const never = buildResult({ ...answers(), q5: { value: 'A', score: 1 } }, { generatedAt: GENERATED_AT });
    const p = mapResultToHubSpotProperties(never, { ...answers(), q5: { value: 'A', score: 1 } }, {});
    expect(p.scorecard_burned_attempt).toBe('false');
  });

  it('url_given follows the observed payload', () => {
    const withObserved = buildResult(answers(), {
      generatedAt: GENERATED_AT,
      observed: {
        url: 'https://example.com/', host: 'example.com', status: 'unreachable', pageRead: false,
        analytics: { checked: false }, adPixels: { checked: false }, social: { checked: false },
        schema: { checked: false }, emailAuth: { checked: false },
        freshness: { checked: false, lastPublished: null, source: null },
      },
    });
    const p = mapResultToHubSpotProperties(withObserved, answers(), {});
    expect(p.scorecard_url_given).toBe('true');
  });

  it('keeps the dollar-gap properties from the opportunity map', () => {
    expect(props.scorecard_dollar_gap_total).toBeGreaterThan(0);
    expect(props.scorecard_gap_high).toBe(props.scorecard_dollar_gap_total);
    expect(props.scorecard_gap_low).toBeLessThanOrEqual(props.scorecard_gap_high);
    expect(props.scorecard_sales_cycle_gap).toBeGreaterThan(0);
    expect(props.scorecard_retention_gap).toBeGreaterThan(0);
    expect(props.scorecard_rpe_gap).toBeGreaterThan(0);
    expect(props.scorecard_top_gap).toBe('Sales cycle');
  });

  it('no longer writes the retired maturity stage', () => {
    expect(props.scorecard_maturity_stage).toBeUndefined();
  });

  it('stamps model, timestamp, and a parseable result JSON', () => {
    expect(props.scorecard_business_model).toBe('PROFESSIONAL_SERVICES');
    expect(props.scorecard_completed_at).toBe(GENERATED_AT);
    const parsed = JSON.parse(props.scorecard_result_json);
    expect(parsed.readiness.band).toBe('Foundations First');
    expect(parsed.opportunityMap.length).toBe(6);
  });

  it('returns {} for a missing result', () => {
    expect(mapResultToHubSpotProperties(null, answers(), {})).toEqual({});
  });
});
