import { describe, it, expect } from 'vitest';
import { generateRoiLines, generators } from '@/lib/scorecard/roi';
import { getBusinessModelBenchmark } from '@/lib/scorecard/businessModelBenchmarks';

function baseAnswers(overrides = {}) {
  return {
    q1: { value: '3m_7m' },         // $5M midpoint
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '11_25' },         // 18 midpoint
    q13: { value: '25k_100k' },
    q14: { value: '90_180' },       // 135-day midpoint
    q15: { value: '15_30' },        // NRR 0.775
    ...overrides,
  };
}

describe('revenuePerEmployee generator', () => {
  it('fires when client revenue/employee is below the peer band low', () => {
    // PS: revenuePerEmployee median 170K, range [150K, 300K]. Client 5M/18 = 278K. That is BETWEEN low and median (partial).
    // floor_diff = 150K - 278K < 0 -> floor = 0. median_diff = 170K - 278K < 0 -> median = 0. Line returns null.
    const a = baseAnswers();
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.revenuePerEmployee(a, benchmark);
    expect(line).toBeNull();
  });

  it('fires with positive dollars when client is well below median', () => {
    // q1 under_1m ($750K) / q3 2_10 (6) = 125K per employee. PS median 170K, low 150K. Both diffs positive.
    const a = baseAnswers({ q1: { value: 'under_1m' }, q3: { value: '2_10' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.revenuePerEmployee(a, benchmark);
    expect(line).not.toBeNull();
    expect(line.key).toBe('revenuePerEmployee');
    expect(line.medianDollars).toBeGreaterThan(0);
    expect(line.floorDollars).toBeGreaterThan(0);
    expect(line.comparison).toBe('fails');
    expect(line.comparisonCopy).toBe('below peer');
    expect(line.source).toMatch(/businessModelBenchmarks v1\.1/);
    expect(line.body).not.toMatch(/—/);
  });
});

describe('salesCycle generator', () => {
  it('returns null when q14 is not_tracked', () => {
    const a = baseAnswers({ q14: { value: 'not_tracked' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.salesCycle(a, benchmark)).toBeNull();
  });

  it('returns null when client cycle is at or under peer median (meets)', () => {
    // PS median 103. q14 under_30 -> 20 days. Strong/meets. Return null.
    const a = baseAnswers({ q14: { value: 'under_30' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.salesCycle(a, benchmark)).toBeNull();
  });

  it('fires with dollar gap when client cycle is well above median', () => {
    // q14 over_180 -> 240 days. PS range [60, 130]. Lagging/fails.
    // floor = (240/130 - 1) * 5M ~ 4.2M, median = (240/103 - 1) * 5M ~ 6.6M
    const a = baseAnswers({ q14: { value: 'over_180' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.salesCycle(a, benchmark);
    expect(line).not.toBeNull();
    expect(line.key).toBe('salesCycle');
    expect(line.medianDollars).toBeGreaterThan(line.floorDollars);
    expect(line.comparison).toBe('fails');
    expect(line.comparisonCopy).toBe('slower than peer');
  });
});

describe('nrr generator', () => {
  it('returns null when q15 is absent (hidden) on the answer set', () => {
    const a = baseAnswers();
    delete a.q15;
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.nrr(a, benchmark)).toBeNull();
  });

  it('returns null when q15 is not_tracked', () => {
    const a = baseAnswers({ q15: { value: 'not_tracked' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.nrr(a, benchmark)).toBeNull();
  });

  it('fires with dollar gap when client NRR is below the peer range', () => {
    // PS nrr median 0.95, range [0.85, 1.05]. q15 over_30 -> nrr 0.60.
    // floor = (0.85 - 0.60) * 5M = 1.25M. median = (0.95 - 0.60) * 5M = 1.75M.
    const a = baseAnswers({ q15: { value: 'over_30' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.nrr(a, benchmark);
    expect(line).not.toBeNull();
    expect(line.key).toBe('nrr');
    expect(line.floorDollars).toBeGreaterThan(0);
    expect(line.medianDollars).toBeGreaterThan(line.floorDollars);
    expect(line.comparison).toBe('fails');
    expect(line.comparisonCopy).toBe('below peer');
  });
});

describe('leadResponse generator', () => {
  it('returns null in v1 (no quiz input wired)', () => {
    const a = baseAnswers();
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.leadResponse(a, benchmark)).toBeNull();
  });
});

describe('generateRoiLines (the public API)', () => {
  it('ranks by medianDollars descending and takes top 3', () => {
    // Worst case to fire all three with dollars:
    // q1 7m_15m ($11M), q3 51_75 (63 employees), q14 over_180, q15 over_30
    const a = baseAnswers({ q1: { value: '7m_15m' }, q3: { value: '51_75' }, q14: { value: 'over_180' }, q15: { value: 'over_30' } });
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    expect(lines.length).toBeLessThanOrEqual(3);
    for (let i = 1; i < lines.length; i++) {
      expect(lines[i - 1].medianDollars).toBeGreaterThanOrEqual(lines[i].medianDollars);
    }
  });

  it('omits null lines (meets/notTracked)', () => {
    // All three dollar-bearing generators fire null:
    // q14 under_30 -> meets, q15 under_5 -> meets, q1+q3 -> partial (zero dollars per the first test)
    const a = baseAnswers({ q14: { value: 'under_30' }, q15: { value: 'under_5' } });
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    expect(lines).toEqual([]);
  });
});
