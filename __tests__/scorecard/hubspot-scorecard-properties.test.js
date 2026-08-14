import { describe, it, expect } from 'vitest';
import {
  SCORECARD_PROPERTY_GROUP,
  SCORECARD_RESULT_PROPERTIES,
} from '@/lib/hubspot';
import { BUSINESS_MODEL_OPTIONS } from '@/lib/scorecard/questions';
import { READINESS_BANDS } from '@/lib/scorecard/scoring';

describe('scorecard result property definitions', () => {
  it('defines the expected properties in the scorecard group', () => {
    expect(SCORECARD_PROPERTY_GROUP.name).toBe('scorecard');
    const names = SCORECARD_RESULT_PROPERTIES.map((p) => p.name);
    expect(names).toEqual([
      'scorecard_dollar_gap_total',
      'scorecard_gap_low',
      'scorecard_gap_high',
      'scorecard_rpe_gap',
      'scorecard_sales_cycle_gap',
      'scorecard_retention_gap',
      'scorecard_readiness_band',
      'scorecard_composite',
      'scorecard_dim_strategy',
      'scorecard_dim_people',
      'scorecard_dim_governance',
      'scorecard_belief_confidence',
      'scorecard_connect_comfort',
      'scorecard_burned_attempt',
      'scorecard_url_given',
      'scorecard_top_gap',
      'scorecard_business_model',
      'scorecard_completed_at',
      'scorecard_result_json',
      'scorecard_pdf_url',
    ]);
    for (const p of SCORECARD_RESULT_PROPERTIES) {
      expect(p.groupName).toBe('scorecard');
    }
  });

  it('retires the maturity stage property with the stage placement', () => {
    const names = SCORECARD_RESULT_PROPERTIES.map((p) => p.name);
    expect(names).not.toContain('scorecard_maturity_stage');
  });

  it('types each property as specified', () => {
    const byName = Object.fromEntries(SCORECARD_RESULT_PROPERTIES.map((p) => [p.name, p]));
    for (const n of [
      'scorecard_dollar_gap_total', 'scorecard_gap_low', 'scorecard_gap_high',
      'scorecard_rpe_gap', 'scorecard_sales_cycle_gap', 'scorecard_retention_gap',
      'scorecard_composite', 'scorecard_dim_strategy', 'scorecard_dim_people',
      'scorecard_dim_governance', 'scorecard_belief_confidence', 'scorecard_connect_comfort',
    ]) {
      expect(byName[n].type, n).toBe('number');
    }
    expect(byName.scorecard_readiness_band.type).toBe('enumeration');
    expect(byName.scorecard_burned_attempt.type).toBe('bool');
    expect(byName.scorecard_burned_attempt.fieldType).toBe('booleancheckbox');
    expect(byName.scorecard_url_given.type).toBe('bool');
    expect(byName.scorecard_top_gap.type).toBe('string');
    expect(byName.scorecard_business_model.type).toBe('enumeration');
    expect(byName.scorecard_completed_at.type).toBe('datetime');
    expect(byName.scorecard_result_json.fieldType).toBe('textarea');
    expect(byName.scorecard_pdf_url.fieldType).toBe('text');
  });

  it('readiness_band options stay in lockstep with the scoring bands', () => {
    const band = SCORECARD_RESULT_PROPERTIES.find((p) => p.name === 'scorecard_readiness_band');
    expect(band.options.map((o) => o.value)).toEqual([
      'Not Ready Yet', 'Foundations First', 'Ready in Parts', 'Ready to Build',
    ]);
    // Same set as the code that computes them, regardless of ordering.
    expect(band.options.map((o) => o.value).sort()).toEqual(
      READINESS_BANDS.map((b) => b.name).sort()
    );
  });

  it('the burned-attempt property describes why it is the priority segment', () => {
    const burned = SCORECARD_RESULT_PROPERTIES.find((p) => p.name === 'scorecard_burned_attempt');
    expect(burned.description).toMatch(/did not stick/);
    expect(burned.description).toMatch(/priority segment/);
  });

  it('business_model option values stay in lockstep with the quiz q2 options', () => {
    const model = SCORECARD_RESULT_PROPERTIES.find((p) => p.name === 'scorecard_business_model');
    const hubspotValues = model.options.map((o) => o.value).sort();
    const quizValues = BUSINESS_MODEL_OPTIONS.map((o) => o.value).sort();
    expect(hubspotValues).toEqual(quizValues);
    expect(hubspotValues.length).toBe(8);
  });
});
