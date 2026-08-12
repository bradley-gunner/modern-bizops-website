import { describe, it, expect } from 'vitest';
import { buildResult } from '@/lib/scorecard/resultRender';

function ans(overrides = {}) {
  return {
    q1: { value: '5m_15m' },                          // $10M midpoint
    q2: { value: 'PROFESSIONAL_SERVICES' },
    // 38. Chosen so revenue per employee ($10M / 38 = $263K) clears the
    // professional-services median of $170K, which keeps the no-gap fixtures
    // below genuinely no-gap after the revenue bands moved to the /book set.
    q3: { value: '26_50' },
    q4:  { value: 'A', score: 1 },
    q5:  { value: 'B', score: 2 },
    q6:  { value: 'A', score: 1 },
    q7:  { value: 'B', score: 2 },
    q8:  { value: 'B', score: 2 },
    q9:  { value: 'B', score: 2 },
    q10: { value: 'B', score: 2 },
    q11: { value: 'A', score: 1 },
    q12: { value: 'A', score: 1 },
    q13: { value: '25k_100k' },
    q14: { value: 'over_180' },
    q15: { value: 'over_30' },
    ...overrides,
  };
}

describe('buildResult', () => {
  it('returns a Result payload with the expected top-level keys', () => {
    const r = buildResult(ans());
    expect(r.headline).toBeDefined();
    expect(r.roiLines).toBeInstanceOf(Array);
    expect(r.placement).toBeDefined();
    expect(r.binding).toBeDefined();
    expect(r.disclosure).toBeTypeOf('string');
    expect(r.cta).toBeDefined();
    expect(r.modelLabel).toBeTypeOf('string');
    expect(r.benchmarkVersion).toBe('1.2');
    expect(r.generatedAt).toBeTypeOf('string');
  });

  it('headline floor and median dollars match the sum across ROI lines', () => {
    const r = buildResult(ans());
    const sumFloor = r.roiLines.reduce((s, l) => s + l.floorDollars, 0);
    const sumMedian = r.roiLines.reduce((s, l) => s + l.medianDollars, 0);
    expect(r.headline.floorDollars).toBe(sumFloor);
    expect(r.headline.medianDollars).toBe(sumMedian);
  });

  it('places a maxed-out reactive client at Stage 1', () => {
    expect(buildResult(ans()).placement.stage).toBe(1);
  });

  it('places a fully-managed client at Stage 4 with empty roiLines', () => {
    const r = buildResult(ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'D', score: 4 }, q8: { value: 'D', score: 4 }, q9: { value: 'D', score: 4 },
      q10: { value: 'D', score: 4 }, q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 },
      q14: { value: 'under_30' }, q15: { value: 'under_5' },
    }));
    expect(r.placement.stage).toBe(4);
    expect(r.roiLines).toEqual([]);
    expect(r.binding).toBeNull();
  });

  it('binding boundary identifies the two lowest-scoring questions in the failing block', () => {
    const r = buildResult(ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'A', score: 1 }, q8: { value: 'B', score: 2 }, q9: { value: 'C', score: 3 },
    }));
    expect(r.placement.stage).toBe(2);
    expect(r.binding.failingBlock).toBe('B');
    expect(r.binding.questions.map((q) => q.id)).toEqual(['q7', 'q8']);
    expect(r.binding.translation).toBeTypeOf('string');
    expect(r.binding.translation).not.toMatch(/—/);
  });

  it('bright spots are answers scoring above placement', () => {
    const r = buildResult(ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'A', score: 1 }, q6: { value: 'A', score: 1 },
    }));
    expect(r.placement.stage).toBe(1);
    expect(r.brightSpots).toBeTruthy();
    expect(r.brightSpots.length).toBeLessThanOrEqual(2);
    for (const s of r.brightSpots) expect(s.score).toBeGreaterThan(1);
  });

  it('CTA bridges to the paid next rung, the AI Revenue Audit', () => {
    const cta = buildResult(ans()).cta;
    expect(cta.destination).toBe('/ai-readiness-assessment');
    expect(cta.heading).toBe('The AI Revenue Audit');
    expect(cta.buttonLabel).toBe('See the AI Revenue Audit');
  });

  it('model label resolves from q2', () => {
    expect(buildResult(ans({ q2: { value: 'B2B_SAAS' } })).modelLabel).toBe('B2B SaaS');
    expect(buildResult(ans({ q2: { value: 'PROFESSIONAL_SERVICES' } })).modelLabel).toBe('professional services');
  });

  it('result strings carry no em-dash anywhere', () => {
    const r = buildResult(ans());
    const allStrings = JSON.stringify(r);
    expect(allStrings).not.toMatch(/—/);
  });

  it('accepts an injectable generatedAt for determinism', () => {
    const r = buildResult(ans(), { generatedAt: '2026-06-10T12:00:00.000Z' });
    expect(r.generatedAt).toBe('2026-06-10T12:00:00.000Z');
  });
});

describe('answer pruning', () => {
  it('stale q15 (over_30 churn) does NOT fire retention when q2=B2B_PRODUCT (hides q15)', () => {
    const a = ans({ q2: { value: 'B2B_PRODUCT' } });
    // q15 from ans() is over_30 (worst churn). B2B_PRODUCT hides q15 -> should be pruned.
    const r = buildResult(a);
    const retention = r.roiLines.find((l) => l.key === 'retention');
    expect(retention).toBeUndefined();
  });
});

describe('no-gap variants', () => {
  function noGapAnswers() {
    return ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'A', score: 1 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
      q14: { value: 'under_30' }, // meets
      q15: { value: 'under_5' },  // meets (grr 0.975)
    });
  }

  it('headline switches to no-gap lead when roiLines is empty', () => {
    const r = buildResult(noGapAnswers());
    expect(r.roiLines).toEqual([]);
    expect(r.headline.lead).toMatch(/hold up against/);
    expect(r.headline.lead).not.toMatch(/leaving between/);
  });

  it('headline no-gap lead interpolates model_label', () => {
    const r = buildResult(noGapAnswers());
    expect(r.headline.lead).toMatch(/professional services/);
  });

  it('binding translation does not reference "dollar gaps above" on the no-gap path', () => {
    const r = buildResult(noGapAnswers());
    expect(r.binding).not.toBeNull();
    expect(r.binding.translation).not.toMatch(/dollar gaps above/);
    expect(r.binding.translation).toMatch(/boundary you need to cross/);
  });
});

describe('competencyScores', () => {
  it('returns 9 entries, one per q4..q12', () => {
    const r = buildResult(ans());
    expect(r.competencyScores).toHaveLength(9);
    expect(r.competencyScores.map((c) => c.id)).toEqual([
      'q4','q5','q6','q7','q8','q9','q10','q11','q12',
    ]);
  });

  it('groups by block A (q4..q6), B (q7..q9), C (q10..q12)', () => {
    const r = buildResult(ans());
    const blocksById = Object.fromEntries(r.competencyScores.map((c) => [c.id, c.block]));
    for (const id of ['q4','q5','q6']) expect(blocksById[id]).toBe('A');
    for (const id of ['q7','q8','q9']) expect(blocksById[id]).toBe('B');
    for (const id of ['q10','q11','q12']) expect(blocksById[id]).toBe('C');
  });

  it('carries the competencyLabel and the score for each row', () => {
    const r = buildResult(ans());
    const q4 = r.competencyScores.find((c) => c.id === 'q4');
    expect(q4.competencyLabel).toBe('CRM architecture');
    expect(q4.score).toBe(1);
  });
});

describe('comparisons', () => {
  it('payload carries comparisons array', () => {
    const r = buildResult(ans());
    expect(Array.isArray(r.comparisons)).toBe(true);
    expect(r.comparisons.length).toBeGreaterThan(0);
  });
});

describe('nextStage preview', () => {
  it('is populated for placements 1..3', () => {
    const r = buildResult(ans()); // placement 1
    expect(r.nextStage.name).toBe('Repeatable');
    expect(r.nextStage.criteria.length).toBeGreaterThanOrEqual(2);
  });

  it('is null at Stage 4', () => {
    const r = buildResult(ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'D', score: 4 }, q8: { value: 'D', score: 4 }, q9: { value: 'D', score: 4 },
      q10: { value: 'D', score: 4 }, q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 },
      q14: { value: 'under_30' }, q15: { value: 'under_5' },
    }));
    expect(r.placement.stage).toBe(4);
    expect(r.nextStage).toBeNull();
  });
});

describe('per-gap fixes', () => {
  it('every roiLine carries a non-empty fix paragraph', () => {
    const r = buildResult(ans());
    expect(r.roiLines.length).toBeGreaterThan(0);
    for (const line of r.roiLines) {
      expect(line.fix).toBeTypeOf('string');
      expect(line.fix.length).toBeGreaterThan(40);
    }
  });
});

describe('cta.focus', () => {
  it('is the binding boundary lowest-scoring competency label', () => {
    const r = buildResult(ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'A', score: 1 }, q6: { value: 'D', score: 4 },
    }));
    // placement remains 1 because q5 score 1 still binds block A; lowest in block A: q5 (lead qualification).
    expect(r.cta.focus).toBe('lead qualification');
    expect(r.cta.focusLine).toMatch(/lead qualification/);
  });

  it('falls back to a generic line when binding is null (Stage 4)', () => {
    const r = buildResult(ans({
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'D', score: 4 }, q8: { value: 'D', score: 4 }, q9: { value: 'D', score: 4 },
      q10: { value: 'D', score: 4 }, q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 },
      q14: { value: 'under_30' }, q15: { value: 'under_5' },
    }));
    expect(r.cta.focus).toBeNull();
    // Still the Audit bridge, just with no competency to name.
    expect(r.cta.focusLine).toMatch(/AI Revenue Audit/);
    expect(r.cta.focusLine).not.toMatch(/undefined/);
  });
});
