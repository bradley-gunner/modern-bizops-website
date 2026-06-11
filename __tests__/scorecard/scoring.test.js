import { describe, it, expect } from 'vitest';
import { stagePlacement, brightSpots, bindingBoundary } from '@/lib/scorecard/scoring';

function answers({ a = [3, 3, 3], b = [3, 3, 3], c = [4, 4, 4] } = {}) {
  return {
    q4:  { score: a[0] }, q5:  { score: a[1] }, q6:  { score: a[2] },
    q7:  { score: b[0] }, q8:  { score: b[1] }, q9:  { score: b[2] },
    q10: { score: c[0] }, q11: { score: c[1] }, q12: { score: c[2] },
  };
}

describe('stagePlacement', () => {
  it('returns 1 when any Block A score < 3', () => {
    expect(stagePlacement(answers({ a: [2, 3, 3] }))).toBe(1);
    expect(stagePlacement(answers({ a: [1, 4, 4] }))).toBe(1);
  });

  it('returns 2 when Block A >= 3 and any Block B score < 3', () => {
    expect(stagePlacement(answers({ a: [3, 3, 3], b: [2, 3, 3] }))).toBe(2);
    expect(stagePlacement(answers({ a: [4, 4, 4], b: [1, 4, 4] }))).toBe(2);
  });

  it('returns 3 when Blocks A and B >= 3 and any Block C score < 4', () => {
    expect(stagePlacement(answers({ a: [3, 3, 3], b: [3, 3, 3], c: [3, 4, 4] }))).toBe(3);
    expect(stagePlacement(answers({ a: [4, 4, 4], b: [4, 4, 4], c: [1, 4, 4] }))).toBe(3);
  });

  it('returns 4 when Block A and B >= 3 and Block C all >= 4', () => {
    expect(stagePlacement(answers({ a: [3, 3, 3], b: [3, 3, 3], c: [4, 4, 4] }))).toBe(4);
    expect(stagePlacement(answers({ a: [4, 4, 4], b: [4, 4, 4], c: [4, 4, 4] }))).toBe(4);
  });

  it('Block A boundary: score = 3 passes, score = 2 fails', () => {
    expect(stagePlacement(answers({ a: [3, 3, 3] }))).toBeGreaterThanOrEqual(2);
    expect(stagePlacement(answers({ a: [2, 4, 4] }))).toBe(1);
  });

  it('Block C boundary: score = 4 passes, score = 3 stays at Stage 3', () => {
    expect(stagePlacement(answers({ c: [4, 4, 4] }))).toBe(4);
    expect(stagePlacement(answers({ c: [3, 4, 4] }))).toBe(3);
  });

  it('returns 1 when answers are empty or partial (missing scores treated as 0)', () => {
    expect(stagePlacement({})).toBe(1);
    expect(stagePlacement({ q4: { score: 4 }, q5: { score: 4 } })).toBe(1); // q6 missing -> 0 -> stage 1
  });
});

describe('brightSpots', () => {
  it('returns up to 2 answers scoring strictly higher than placement', () => {
    const a = answers({ a: [2, 4, 4], b: [3, 3, 3], c: [3, 3, 3] });
    // placement = 1 (block A has a 2). Bright spots = answers scoring > 1: q5(4), q6(4), q7..q12 (3s)
    const spots = brightSpots(a, 1);
    expect(spots.length).toBeLessThanOrEqual(2);
    for (const s of spots) {
      expect(s.score).toBeGreaterThan(1);
    }
  });

  it('returns empty array when no answer scores above placement', () => {
    const a = answers({ a: [4, 4, 4], b: [4, 4, 4], c: [4, 4, 4] });
    // placement = 4, nothing scores > 4
    expect(brightSpots(a, 4)).toEqual([]);
  });

  it('returns highest-scoring answers first', () => {
    const a = answers({ a: [2, 3, 4], b: [3, 3, 3], c: [3, 3, 3] });
    const spots = brightSpots(a, 1);
    if (spots.length >= 2) {
      expect(spots[0].score).toBeGreaterThanOrEqual(spots[1].score);
    }
  });
});

describe('bindingBoundary', () => {
  it('returns Block A details when placement = 1', () => {
    const a = answers({ a: [2, 3, 1] });
    const result = bindingBoundary(a, 1);
    expect(result.failingBlock).toBe('A');
    // two lowest-scoring in block A: q6 (1) then q4 (2)
    expect(result.questions.map((q) => q.id)).toEqual(['q6', 'q4']);
  });

  it('returns Block B details when placement = 2', () => {
    const a = answers({ a: [3, 3, 3], b: [1, 2, 3] });
    const result = bindingBoundary(a, 2);
    expect(result.failingBlock).toBe('B');
    expect(result.questions.map((q) => q.id)).toEqual(['q7', 'q8']);
  });

  it('returns Block C details when placement = 3', () => {
    const a = answers({ a: [3, 3, 3], b: [3, 3, 3], c: [3, 3, 4] });
    const result = bindingBoundary(a, 3);
    expect(result.failingBlock).toBe('C');
    expect(result.questions.map((q) => q.id)).toEqual(['q10', 'q11']);
  });

  it('returns null when placement = 4 (no binding boundary)', () => {
    const a = answers({ a: [4, 4, 4], b: [4, 4, 4], c: [4, 4, 4] });
    expect(bindingBoundary(a, 4)).toBeNull();
  });
});
