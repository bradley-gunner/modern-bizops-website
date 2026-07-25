import { describe, it, expect } from 'vitest';
import {
  SCORECARD_PROPERTY_GROUP,
  SCORECARD_RESULT_PROPERTIES,
} from '@/lib/hubspot';
import { BUSINESS_MODEL_OPTIONS } from '@/lib/scorecard/questions';

describe('scorecard result property definitions', () => {
  it('defines exactly the twelve expected properties in the scorecard group', () => {
    expect(SCORECARD_PROPERTY_GROUP.name).toBe('scorecard');
    const names = SCORECARD_RESULT_PROPERTIES.map((p) => p.name);
    expect(names).toEqual([
      'scorecard_dollar_gap_total',
      'scorecard_gap_low',
      'scorecard_gap_high',
      'scorecard_rpe_gap',
      'scorecard_sales_cycle_gap',
      'scorecard_retention_gap',
      'scorecard_maturity_stage',
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

  it('types each property as specified', () => {
    const byName = Object.fromEntries(SCORECARD_RESULT_PROPERTIES.map((p) => [p.name, p]));
    expect(byName.scorecard_dollar_gap_total.type).toBe('number');
    expect(byName.scorecard_gap_low.type).toBe('number');
    expect(byName.scorecard_gap_high.type).toBe('number');
    expect(byName.scorecard_rpe_gap.type).toBe('number');
    expect(byName.scorecard_sales_cycle_gap.type).toBe('number');
    expect(byName.scorecard_retention_gap.type).toBe('number');
    expect(byName.scorecard_maturity_stage.type).toBe('enumeration');
    expect(byName.scorecard_top_gap.type).toBe('string');
    expect(byName.scorecard_business_model.type).toBe('enumeration');
    expect(byName.scorecard_completed_at.type).toBe('datetime');
    expect(byName.scorecard_result_json.type).toBe('string');
    expect(byName.scorecard_result_json.fieldType).toBe('textarea');
    expect(byName.scorecard_pdf_url.type).toBe('string');
    expect(byName.scorecard_pdf_url.fieldType).toBe('text');
  });

  it('maturity_stage options are the four maturity stages', () => {
    const stage = SCORECARD_RESULT_PROPERTIES.find((p) => p.name === 'scorecard_maturity_stage');
    expect(stage.options.map((o) => o.value)).toEqual([
      'Reactive',
      'Repeatable',
      'Predictable',
      'Compounding',
    ]);
  });

  it('business_model option values stay in lockstep with the quiz q2 options', () => {
    const model = SCORECARD_RESULT_PROPERTIES.find((p) => p.name === 'scorecard_business_model');
    const hubspotValues = model.options.map((o) => o.value).sort();
    const quizValues = BUSINESS_MODEL_OPTIONS.map((o) => o.value).sort();
    expect(hubspotValues).toEqual(quizValues);
    expect(hubspotValues.length).toBe(8);
  });
});
