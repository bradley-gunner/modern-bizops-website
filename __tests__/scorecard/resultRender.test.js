import { describe, it, expect } from 'vitest';
import { buildResult } from '@/lib/scorecard/resultRender';

function ans(overrides = {}) {
  return {
    q1: { value: '7m_15m' },                          // $11M
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },                           // 63
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
    expect(r.benchmarkVersion).toBe('1.1');
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

  it('CTA destination is /watch', () => {
    expect(buildResult(ans()).cta.destination).toBe('/watch');
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
