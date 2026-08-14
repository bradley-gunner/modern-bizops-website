import { describe, it, expect } from 'vitest';
import {
  COMPOSITE_IDS,
  READINESS_BANDS,
  compositeScore,
  readinessBand,
  dimensionScores,
  weakestDimension,
  weakestSignals,
  isBurnedAttempt,
  levelOf,
} from '@/lib/scorecard/scoring';

// Nine dimension scores in question order q5..q13, plus the belief probe.
function answers({ belief = 3, s = [3, 3, 3], p = [3, 3, 3], g = [3, 3, 3] } = {}) {
  const ids = ['q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13'];
  const scores = [...s, ...p, ...g];
  const out = { q4: { value: 'C', score: belief } };
  ids.forEach((id, i) => {
    out[id] = { value: 'ABCDE'[scores[i] - 1], score: scores[i] };
  });
  return out;
}

describe('compositeScore', () => {
  it('is the mean of q5..q13, one decimal', () => {
    expect(compositeScore(answers({ s: [2, 1, 2], p: [2, 2, 3], g: [1, 2, 3] }))).toBe(2.0);
    expect(compositeScore(answers({ s: [5, 5, 5], p: [5, 5, 5], g: [5, 5, 5] }))).toBe(5);
  });

  it('EXCLUDES the belief probe (q4) from the composite', () => {
    const low = compositeScore(answers({ belief: 1 }));
    const high = compositeScore(answers({ belief: 5 }));
    expect(low).toBe(high);
  });

  it('covers exactly the nine dimension questions', () => {
    expect(COMPOSITE_IDS).toEqual(['q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13']);
  });

  it('rounds to one decimal', () => {
    // 16/9 = 1.777... -> 1.8
    expect(compositeScore(answers({ s: [2, 1, 2], p: [2, 2, 2], g: [1, 1, 3] }))).toBe(1.8);
  });
});

describe('readinessBand', () => {
  it('maps the four bands over the decided edges', () => {
    expect(readinessBand(1.0).key).toBe('not_ready_yet');
    expect(readinessBand(1.9).key).toBe('not_ready_yet');
    expect(readinessBand(2.0).key).toBe('foundations_first');
    expect(readinessBand(2.9).key).toBe('foundations_first');
    expect(readinessBand(3.0).key).toBe('ready_in_parts');
    expect(readinessBand(3.9).key).toBe('ready_in_parts');
    expect(readinessBand(4.0).key).toBe('ready_to_build');
    expect(readinessBand(5.0).key).toBe('ready_to_build');
  });

  it('band names are the decided four', () => {
    expect(READINESS_BANDS.map((b) => b.name).sort()).toEqual([
      'Foundations First',
      'Not Ready Yet',
      'Ready in Parts',
      'Ready to Build',
    ]);
  });
});

describe('dimensionScores', () => {
  it('returns the three askable dimensions with their question ids', () => {
    const dims = dimensionScores(answers());
    expect(dims.map((d) => d.key)).toEqual(['strategy', 'people', 'governance']);
    expect(dims[0].ids).toEqual(['q5', 'q6', 'q7']);
    expect(dims[1].ids).toEqual(['q8', 'q9', 'q10']);
    expect(dims[2].ids).toEqual(['q11', 'q12', 'q13']);
  });

  it('computes one-decimal means and a rounded 1..5 level', () => {
    const dims = dimensionScores(answers({ s: [2, 1, 2] }));
    expect(dims[0].mean).toBe(1.7);
    expect(dims[0].level).toBe(2);
  });

  it('levelOf clamps to the 1..5 scale', () => {
    expect(levelOf(0)).toBe(1);
    expect(levelOf(2.4)).toBe(2);
    expect(levelOf(4.6)).toBe(5);
    expect(levelOf(9)).toBe(5);
  });
});

describe('weakestDimension', () => {
  it('returns the lowest-mean dimension', () => {
    const w = weakestDimension(answers({ g: [1, 1, 2] }));
    expect(w.key).toBe('governance');
  });

  it('breaks ties in dimension order (strategy first)', () => {
    const w = weakestDimension(answers({ s: [2, 2, 2], p: [2, 2, 2], g: [2, 2, 2] }));
    expect(w.key).toBe('strategy');
  });
});

describe('weakestSignals', () => {
  it('returns only genuinely weak answers (score <= 2), weakest first', () => {
    const list = weakestSignals(answers({ s: [3, 3, 3], p: [1, 2, 3], g: [3, 3, 3] }));
    expect(list.map((x) => x.id)).toEqual(['q8', 'q9']);
  });

  it('caps at three', () => {
    const list = weakestSignals(answers({ s: [1, 1, 1], p: [1, 1, 1], g: [1, 1, 1] }));
    expect(list).toHaveLength(3);
  });

  it('is empty when nothing scores at or below the threshold', () => {
    expect(weakestSignals(answers())).toEqual([]);
  });

  it('breaks score ties in question order', () => {
    const list = weakestSignals(answers({ s: [2, 3, 3], g: [2, 3, 3] }));
    expect(list.map((x) => x.id)).toEqual(['q5', 'q11']);
  });
});

describe('isBurnedAttempt', () => {
  it('is true only for the q5 tried-and-did-not-stick option', () => {
    expect(isBurnedAttempt({ q5: { value: 'B', score: 2 } })).toBe(true);
    expect(isBurnedAttempt({ q5: { value: 'A', score: 1 } })).toBe(false);
    expect(isBurnedAttempt({ q5: { value: 'C', score: 3 } })).toBe(false);
    expect(isBurnedAttempt({})).toBe(false);
  });

  it('keys off the answer VALUE, not the score, so it travels as a distinct signal', () => {
    // A score-2 answer on any other question must not read as burned.
    expect(isBurnedAttempt({ q5: { value: 'A', score: 2 } })).toBe(false);
  });
});
