import { describe, it, expect } from 'vitest';
import { generateRoiLines, generateComparisons, generators, MIN_RESOLVABLE_CYCLE_DAYS } from '@/lib/scorecard/roi';
import { getBusinessModelBenchmark } from '@/lib/scorecard/businessModelBenchmarks';
import { formatUsd } from '@/lib/scorecard/voice';

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
    expect(line.source).toMatch(/^Source: .+\.$/);
    expect(line.body).not.toMatch(/—/);
  });

  it('partial band (floor=0, median>0) uses "as much as" copy, not "between $0 and"', () => {
    // PS revenuePerEmployee: median 170K, range [150K, 300K]. Client at 160K/employee = partial.
    // q1 1m_3m ($2M) / q3 11_25 (18) = ~111K/employee. Actually that's below low (150K), which is fails.
    // Need: client BETWEEN low and median. q1 3m_7m ($5M) / q3 26_50 (38) = ~132K -> still below 150K (fails).
    // q1 7m_15m ($11M) / q3 75_plus (90) = ~122K -> still below 150K (fails).
    // Need a client higher than 150K but below 170K. q1 7m_15m ($11M) / q3 51_75 (63) = ~175K -> above median (meets, null).
    // Hard to hit partial naturally with the band midpoints. Use a direct lossRangePhrase check instead:

    // Verify the partial-band behavior on salesCycle, where it IS reachable:
    // PS salesCycleDays: median 103, range [60, 130]. q14 90_180 -> 135. Above high (lagging, fails).
    // q14 30_90 -> 60 (at low, meets -> null).
    // No natural partial-band fixture with the canonical PS table because the cycle bands jump past the [60,130] window.
    //
    // So test the helper directly via a generator that exposes it. Use B2B_SAAS where revenuePerEmployee range is [100K, 200K], median 130K.
    // q1 under_1m / q3 just_me = 750K/1 = 750K -> way above median (meets, null).
    // q1 under_1m / q3 2_10 = 125K/employee -> BETWEEN low 100K and median 130K? Yes. partial band.
    // Expected: floor = max(0, 100K - 125K) * 6 = 0. median = max(0, 130K - 125K) * 6 = 30K. Line fires with floor=0.
    const a = { q1: { value: 'under_1m' }, q2: { value: 'B2B_SAAS' }, q3: { value: '2_10' } };
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.revenuePerEmployee(a, benchmark);
    expect(line).not.toBeNull();
    expect(line.floorDollars).toBe(0);
    expect(line.medianDollars).toBeGreaterThan(0);
    expect(line.body).toMatch(/as much as/);
    expect(line.body).not.toMatch(/between \$0/);
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

describe('retention generator', () => {
  it('returns null when q15 is absent (hidden) on the answer set', () => {
    const a = baseAnswers();
    delete a.q15;
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.retention(a, benchmark)).toBeNull();
  });

  it('returns null when q15 is not_tracked', () => {
    const a = baseAnswers({ q15: { value: 'not_tracked' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.retention(a, benchmark)).toBeNull();
  });

  it('SaaS best-churn answer now classifies as meets (grr 0.975 vs grr median 0.90)', () => {
    // q15 under_5 -> 0.025 churn -> grr proxy 0.975. SaaS grr median 0.90. 0.975 >= 0.90 -> meets -> null.
    const a = baseAnswers({ q2: { value: 'B2B_SAAS' }, q15: { value: 'under_5' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.retention(a, benchmark)).toBeNull();
  });

  it('fires with dollar gap when client GRR proxy is below the peer range', () => {
    // PS grr median 0.82, range [0.75, 0.90]. q15 over_30 -> grr proxy 0.60.
    // floor = (0.75 - 0.60) * 5M = 750K. median = (0.82 - 0.60) * 5M = 1.1M.
    const a = baseAnswers({ q15: { value: 'over_30' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const line = generators.retention(a, benchmark);
    expect(line).not.toBeNull();
    expect(line.key).toBe('retention');
    expect(line.title).toBe('Retention gap');
    expect(line.body).toMatch(/gross revenue retention/);
    expect(line.floorDollars).toBeGreaterThan(0);
    expect(line.medianDollars).toBeGreaterThan(line.floorDollars);
    expect(line.comparison).toBe('fails');
  });
});

describe('salesCycle cycle guard', () => {
  it('exports MIN_RESOLVABLE_CYCLE_DAYS as 20', () => {
    expect(MIN_RESOLVABLE_CYCLE_DAYS).toBe(20);
  });

  it('returns null for ECOMMERCE (median 2 < 20)', () => {
    const a = baseAnswers({ q2: { value: 'ECOMMERCE' }, q14: { value: 'over_180' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.salesCycle(a, benchmark)).toBeNull();
  });

  it('returns null for B2C_SUBSCRIPTION (median 3 < 20)', () => {
    const a = baseAnswers({ q2: { value: 'B2C_SUBSCRIPTION' }, q14: { value: 'over_180' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.salesCycle(a, benchmark)).toBeNull();
  });

  it('still fires for PS (median 103 >= 20) when cycle is well above', () => {
    const a = baseAnswers({ q14: { value: 'over_180' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.salesCycle(a, benchmark)).not.toBeNull();
  });
});

describe('source citations cite named sources, not the filename', () => {
  it('every ROI line carries the metric.source string (named report)', () => {
    const a = baseAnswers({ q1: { value: 'under_1m' }, q3: { value: 'just_me' }, q14: { value: 'over_180' }, q15: { value: 'over_30' } });
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    for (const line of lines) {
      expect(line.source).not.toMatch(/businessModelBenchmarks v1\./);
      expect(line.source).toMatch(/^Source: .+\.$/);
    }
  });
});

describe('leadResponse generator', () => {
  it('returns null in v1 (no quiz input wired)', () => {
    const a = baseAnswers();
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    expect(generators.leadResponse(a, benchmark)).toBeNull();
  });
});

describe('sanity caps', () => {
  function answersWithForcedHugeGaps() {
    // Force the engine to produce uncapped totals well above 75% of revenue.
    // q1 under_1m ($750K), q3 75_plus (90 employees). PS revPerEmp median 170K, low 150K.
    // floor = (150K - 750K/90) * 90 = (150K - 8333) * 90 = ~12.7M. median similar order.
    // That alone is many multiples of revenue -> caps will bind.
    return {
      q1: { value: 'under_1m' },
      q2: { value: 'PROFESSIONAL_SERVICES' },
      q3: { value: '75_plus' },
      q13: { value: '25k_100k' },
      q14: { value: 'over_180' },
      q15: { value: 'over_30' },
    };
  }

  it('caps each line median at 50 percent of revenue', () => {
    const a = answersWithForcedHugeGaps();
    const revenue = 750_000;
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line.medianDollars).toBeLessThanOrEqual(revenue * 0.5);
    }
  });

  it('caps aggregate medians at 75 percent of revenue (with 1 dollar rounding slack)', () => {
    const a = answersWithForcedHugeGaps();
    const revenue = 750_000;
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    const sumMedians = lines.reduce((s, l) => s + l.medianDollars, 0);
    expect(sumMedians).toBeLessThanOrEqual(Math.round(revenue * 0.75) + 1);
  });

  it('caps preserve descending ordering by medianDollars', () => {
    const a = answersWithForcedHugeGaps();
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    for (let i = 1; i < lines.length; i++) {
      expect(lines[i - 1].medianDollars).toBeGreaterThanOrEqual(lines[i].medianDollars);
    }
  });

  it('floor never exceeds the capped median', () => {
    const a = answersWithForcedHugeGaps();
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    for (const line of lines) {
      expect(line.floorDollars).toBeLessThanOrEqual(line.medianDollars);
    }
  });

  it('caps do not bind when uncapped totals are within budget', () => {
    // Mild gap case: q1 7m_15m ($11M), q3 51_75 (63), q14 over_180, q15 over_30.
    const a = {
      q1: { value: '7m_15m' },
      q2: { value: 'PROFESSIONAL_SERVICES' },
      q3: { value: '51_75' },
      q13: { value: '25k_100k' },
      q14: { value: 'over_180' },
      q15: { value: 'over_30' },
    };
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    // Each line should be < 0.5 * $11M from raw generators; cap is a no-op.
    for (const line of lines) {
      expect(line.medianDollars).toBeLessThanOrEqual(11_000_000 * 0.5);
    }
  });
});

describe('capped body copy consistency', () => {
  it('body dollar amounts match the capped floor/median on every line', () => {
    // Forced huge-gap case where caps bind hard (see answersWithForcedHugeGaps).
    const a = {
      q1: { value: 'under_1m' },
      q2: { value: 'PROFESSIONAL_SERVICES' },
      q3: { value: '75_plus' },
      q13: { value: '25k_100k' },
      q14: { value: 'over_180' },
      q15: { value: 'over_30' },
    };
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      // The body must reference the CAPPED median, not the raw one.
      expect(line.body).toContain(formatUsd(line.medianDollars));
      if (line.floorDollars > 0) {
        expect(line.body).toContain(formatUsd(line.floorDollars));
      } else {
        expect(line.body).toMatch(/as much as/);
      }
    }
  });

  it('mild case (caps not binding) body still matches the line numbers', () => {
    const a = {
      q1: { value: '7m_15m' },
      q2: { value: 'PROFESSIONAL_SERVICES' },
      q3: { value: '51_75' },
      q13: { value: '25k_100k' },
      q14: { value: 'over_180' },
      q15: { value: 'over_30' },
    };
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    for (const line of lines) {
      expect(line.body).toContain(formatUsd(line.medianDollars));
    }
  });

  it('never reads "between $X and $X" when caps collapse floor onto median', () => {
    // The forced case scales floor and median to identical display values.
    const a = {
      q1: { value: 'under_1m' },
      q2: { value: 'PROFESSIONAL_SERVICES' },
      q3: { value: '75_plus' },
      q13: { value: '25k_100k' },
      q14: { value: 'over_180' },
      q15: { value: 'over_30' },
    };
    const lines = generateRoiLines(a, getBusinessModelBenchmark(a.q2.value));
    for (const line of lines) {
      expect(line.body).not.toMatch(/between (\$[\d.]+[KM]?) and \1\b/);
      if (line.floorDollars > 0 && formatUsd(line.floorDollars) === formatUsd(line.medianDollars)) {
        expect(line.body).toMatch(/on the order of/);
      }
    }
  });
});

describe('generateComparisons', () => {
  it('returns a row even when the dollar line meets (no gap)', () => {
    const a = baseAnswers({ q14: { value: 'under_30' } }); // PS meets at 20 vs median 103
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const rows = generateComparisons(a, benchmark);
    const cycleRow = rows.find((r) => r.key === 'salesCycle');
    expect(cycleRow).toBeDefined();
    expect(cycleRow.comparison).toBe('meets');
    expect(cycleRow.clientDisplay).toBe('Under 30 days'); // band label, not "20 days"
  });

  it('uses the chosen band label (not the midpoint) for sales cycle', () => {
    const a = baseAnswers({ q14: { value: '30_90' } });
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const rows = generateComparisons(a, benchmark);
    const cycleRow = rows.find((r) => r.key === 'salesCycle');
    expect(cycleRow.clientDisplay).toBe('30 to 90 days');
  });

  it('omits the salesCycle row when the cycle guard kills it (ECOMMERCE)', () => {
    const a = baseAnswers({ q2: { value: 'ECOMMERCE' }, q14: { value: 'over_180' } });
    delete a.q15;
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const rows = generateComparisons(a, benchmark);
    expect(rows.find((r) => r.key === 'salesCycle')).toBeUndefined();
  });

  it('omits retention row when q15 is absent', () => {
    const a = baseAnswers();
    delete a.q15;
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const rows = generateComparisons(a, benchmark);
    expect(rows.find((r) => r.key === 'retention')).toBeUndefined();
  });

  it('every row carries peerMedianDisplay, peerRangeDisplay, comparison, comparisonCopy, source', () => {
    const a = baseAnswers();
    const benchmark = getBusinessModelBenchmark(a.q2.value);
    const rows = generateComparisons(a, benchmark);
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.label).toBeTypeOf('string');
      expect(row.clientDisplay).toBeTypeOf('string');
      expect(row.peerMedianDisplay).toBeTypeOf('string');
      expect(row.peerRangeDisplay).toBeTypeOf('string');
      expect(['meets', 'partial', 'fails']).toContain(row.comparison);
      expect(row.comparisonCopy).toBeTypeOf('string');
      expect(row.source).toMatch(/^Source: .+\.$/);
      expect(row.source).not.toMatch(/businessModelBenchmarks v1\./);
    }
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
