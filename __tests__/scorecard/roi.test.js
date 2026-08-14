import { describe, it, expect } from 'vitest';
import {
  generators,
  generateRoiLines,
  generateComparisons,
  verdictFor,
  buildOpportunityMap,
  AREA_BY_METRIC,
  MIN_RESOLVABLE_CYCLE_DAYS,
} from '@/lib/scorecard/roi';
import { getBusinessModelBenchmark } from '@/lib/scorecard/businessModelBenchmarks';

const PS = getBusinessModelBenchmark('PROFESSIONAL_SERVICES');
const ECOM = getBusinessModelBenchmark('ECOMMERCE');

// Professional services, $5M-15M, 63 people, slow cycle, heavy churn: every
// generator surfaces a gap.
function gapAnswers(overrides = {}) {
  return {
    q1: { value: '5m_15m' },
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },
    q4: { value: 'D', score: 4 },
    q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 }, q7: { value: 'B', score: 2 },
    q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 }, q10: { value: 'C', score: 3 },
    q11: { value: 'A', score: 1 }, q12: { value: 'B', score: 2 }, q13: { value: 'C', score: 3 },
    q14: { value: '25k_100k' }, q15: { value: 'over_180' }, q16: { value: 'over_30' },
    ...overrides,
  };
}

describe('generators', () => {
  it('salesCycle surfaces a loss-framed gap for a slower-than-peer cycle', () => {
    const line = generators.salesCycle(gapAnswers(), PS);
    expect(line).not.toBeNull();
    expect(line.key).toBe('salesCycle');
    expect(line.medianDollars).toBeGreaterThan(0);
    expect(line.body).toMatch(/not capturing this year/);
    expect(line.source).toMatch(/^Source:/);
  });

  it('salesCycle returns null at or under the peer median (meets)', () => {
    expect(generators.salesCycle(gapAnswers({ q15: { value: 'under_30' } }), PS)).toBeNull();
  });

  it('salesCycle returns null when the input is not tracked', () => {
    expect(generators.salesCycle(gapAnswers({ q15: { value: 'not_tracked' } }), PS)).toBeNull();
  });

  it('salesCycle returns null for sub-resolvable cycles (e-commerce)', () => {
    expect(ECOM.metrics.salesCycleDays.median).toBeLessThan(MIN_RESOLVABLE_CYCLE_DAYS);
    expect(generators.salesCycle(gapAnswers({ q2: { value: 'ECOMMERCE' } }), ECOM)).toBeNull();
  });

  it('retention surfaces a gap from heavy churn and null when q16 is absent', () => {
    const line = generators.retention(gapAnswers(), PS);
    expect(line).not.toBeNull();
    expect(line.medianDollars).toBeGreaterThan(0);
    const noQ16 = gapAnswers();
    delete noQ16.q16;
    expect(generators.retention(noQ16, PS)).toBeNull();
  });

  it('revenuePerEmployee surfaces a gap below the peer median and null above it', () => {
    expect(generators.revenuePerEmployee(gapAnswers(), PS)).not.toBeNull();
    // 38 people on $10M = $263K per employee, above the $170K median.
    expect(generators.revenuePerEmployee(gapAnswers({ q3: { value: '26_50' } }), PS)).toBeNull();
  });
});

describe('exact figures in the math (Bradley 2026-08-14)', () => {
  it('an exact cycle replaces the band midpoint and changes the dollars', () => {
    const banded = generators.salesCycle(gapAnswers(), PS);
    const exact = generators.salesCycle(gapAnswers({ q15: { value: 'over_180', exact: 200 } }), PS);
    expect(exact.clientValue.raw).toBe(200);
    expect(exact.medianDollars).toBeLessThan(banded.medianDollars);
  });

  it('the shown-arithmetic line names which input the math used', () => {
    const banded = generators.salesCycle(gapAnswers(), PS);
    expect(banded.mathLine).toMatch(/the middle of the band you picked/);
    const exact = generators.salesCycle(gapAnswers({ q15: { value: 'over_180', exact: 200 } }), PS);
    expect(exact.mathLine).toMatch(/your 200 days cycle \(your exact figure\)/);
  });

  it('every computed line carries a math line', () => {
    for (const line of generateRoiLines(gapAnswers(), PS)) {
      expect(line.mathLine, line.key).toMatch(/^The math:/);
    }
  });

  it('an exact revenue flows into every generator that uses revenue', () => {
    const lines = generateRoiLines(gapAnswers({ q1: { value: '5m_15m', exact: 8_000_000 } }), PS);
    const rpe = lines.find((l) => l.key === 'revenuePerEmployee');
    expect(rpe.mathLine).toMatch(/\$8\.0M annual revenue \(your exact figure\)/);
  });
});

describe('caps', () => {
  it('caps any single line at 50% of revenue and the total at 75%', () => {
    const lines = generateRoiLines(gapAnswers(), PS);
    const revenue = 10_000_000;
    for (const line of lines) {
      expect(line.medianDollars).toBeLessThanOrEqual(revenue * 0.5);
    }
    const total = lines.reduce((s, l) => s + l.medianDollars, 0);
    expect(total).toBeLessThanOrEqual(revenue * 0.75 + lines.length); // rounding slack
  });

  it('marks capped lines so the row can disclose the cap', () => {
    const lines = generateRoiLines(gapAnswers(), PS);
    const salesCycle = lines.find((l) => l.key === 'salesCycle');
    // 240 vs 103 days is a >2x throughput claim on $10M; the cap must bite.
    expect(salesCycle.capped).toBe(true);
  });

  it('re-renders body copy from the final capped figures', () => {
    const lines = generateRoiLines(gapAnswers(), PS);
    for (const line of lines) {
      // No body may quote a figure above the per-line cap.
      const millions = [...line.body.matchAll(/\$(\d+(?:\.\d+)?)M/g)].map((m) => Number(m[1]));
      for (const m of millions) {
        expect(m).toBeLessThanOrEqual(5.1);
      }
    }
  });
});

describe('the verdict rule table', () => {
  const noObserved = null;
  const authedObserved = { emailAuth: { checked: true, spf: true, dmarc: true, dkim: null, missing: [] } };
  const unauthedObserved = { emailAuth: { checked: true, spf: true, dmarc: false, dkim: null, missing: ['no DMARC record'] } };
  const uncheckedObserved = { emailAuth: { checked: false } };

  it('rule 1: no named owner (q8 = 1) blocks every area', () => {
    const a = gapAnswers({ q8: { value: 'A', score: 1 } });
    for (const area of ['followupPipeline', 'busywork', 'onboardingCs', 'deadLead', 'speedToLead', 'invoiceCollection']) {
      const v = verdictFor(area, a, noObserved);
      expect(v.state, area).toBe('blocked');
      expect(v.gap, area).toMatch(/nobody owns AI and automation/);
      expect(v.basis, area).toMatch(/self-reported/);
    }
  });

  it('rule 1 negative control: q8 = 2 (the founder owns it) does NOT block', () => {
    const v = verdictFor('busywork', gapAnswers({ q8: { value: 'B', score: 2 } }), noObserved);
    expect(v.state).toBe('audit');
  });

  it('rule 2: an observed unauthenticated domain blocks the email-sequence areas only', () => {
    const a = gapAnswers();
    expect(verdictFor('followupPipeline', a, unauthedObserved).state).toBe('blocked');
    expect(verdictFor('followupPipeline', a, unauthedObserved).gap).toMatch(/no DMARC record/);
    expect(verdictFor('followupPipeline', a, unauthedObserved).basis).toMatch(/observed from your public surfaces/);
    expect(verdictFor('deadLead', a, unauthedObserved).state).toBe('blocked');
    // Busywork automation sends nothing; the rule must not reach it.
    expect(verdictFor('busywork', a, unauthedObserved).state).toBe('audit');
  });

  it('rule 2 negative control: an UNCHECKED domain never blocks (absence of evidence)', () => {
    expect(verdictFor('followupPipeline', gapAnswers(), uncheckedObserved).state).toBe('audit');
    expect(verdictFor('followupPipeline', gapAnswers(), noObserved).state).toBe('audit');
  });

  it('rule 3: governance absent (q11 = 1) blocks customer-facing sends only', () => {
    const a = gapAnswers({ q11: { value: 'A', score: 1 } });
    const v = verdictFor('onboardingCs', a, noObserved);
    expect(v.state).toBe('blocked');
    expect(v.gap).toMatch(/customer data/);
    expect(verdictFor('followupPipeline', a, noObserved).state).toBe('audit');
  });

  it('rule 3 negative control: informal rules (q11 = 3) do not block', () => {
    const v = verdictFor('onboardingCs', gapAnswers({ q11: { value: 'C', score: 3 } }), noObserved);
    expect(v.state).toBe('audit');
  });

  it('the one ready rule: named owner plus observed authenticated domain', () => {
    const a = gapAnswers({ q8: { value: 'D', score: 4 } });
    const v = verdictFor('followupPipeline', a, authedObserved);
    expect(v.state).toBe('ready');
    expect(v.label).toBe('Ready, as far as we can see');
    expect(v.basis).toMatch(/named owner with protected time \(self-reported\)/);
    expect(v.basis).toMatch(/authenticated sending domain \(observed from your public surfaces\)/);
  });

  it('ready negative controls: unreachable without a URL, without a strong owner, or on other areas', () => {
    const strongOwner = gapAnswers({ q8: { value: 'D', score: 4 } });
    expect(verdictFor('followupPipeline', strongOwner, noObserved).state).toBe('audit');
    expect(verdictFor('followupPipeline', gapAnswers({ q8: { value: 'C', score: 3 } }), authedObserved).state).toBe('audit');
    expect(verdictFor('busywork', strongOwner, authedObserved).state).toBe('audit');
  });

  it('every verdict states its basis', () => {
    for (const area of Object.keys(AREA_BY_METRIC).map((k) => AREA_BY_METRIC[k]).concat(['deadLead', 'speedToLead', 'invoiceCollection'])) {
      const v = verdictFor(area, gapAnswers(), noObserved);
      expect(v.basis, area).toBeTruthy();
    }
  });
});

describe('buildOpportunityMap (the menu-shaped map)', () => {
  it('produces six rows for a recurring model: three computed areas plus three evidence rows', () => {
    const map = buildOpportunityMap(gapAnswers(), PS, null);
    expect(map.rows.map((r) => r.area)).toEqual([
      // dollar rows sorted largest first for this fixture
      'followupPipeline', 'onboardingCs', 'busywork',
      // evidence rows in fixed order
      'deadLead', 'speedToLead', 'invoiceCollection',
    ]);
    expect(map.hasDollarGap).toBe(true);
    expect(map.medianDollars).toBeGreaterThan(0);
  });

  it('drops hidden metric rows for e-commerce but keeps the evidence rows (never empty)', () => {
    const a = gapAnswers({ q2: { value: 'ECOMMERCE' } });
    delete a.q16; // churn hidden for this model
    const map = buildOpportunityMap(a, ECOM, null);
    const areas = map.rows.map((r) => r.area);
    expect(areas).not.toContain('onboardingCs');
    expect(areas).not.toContain('followupPipeline'); // sub-resolvable cycle
    expect(areas).toEqual(expect.arrayContaining(['deadLead', 'speedToLead', 'invoiceCollection']));
    expect(map.rows.length).toBeGreaterThanOrEqual(3);
  });

  it('a metric that meets its benchmark still gets a row, a verdict and the holds-up line', () => {
    const map = buildOpportunityMap(gapAnswers({ q15: { value: 'under_30' } }), PS, null);
    const row = map.rows.find((r) => r.area === 'followupPipeline');
    expect(row.line).toBeNull();
    expect(row.status).toBe('holds');
    expect(row.statusLine).toMatch(/holds? up/);
    expect(row.verdict).toBeTruthy();
  });

  it('a not-tracked input gets the honest not-tracked line instead of invented dollars', () => {
    const map = buildOpportunityMap(gapAnswers({ q15: { value: 'not_tracked' } }), PS, null);
    const row = map.rows.find((r) => r.area === 'followupPipeline');
    expect(row.status).toBe('not_tracked');
    expect(row.statusLine).toMatch(/we will not invent one/);
  });

  it('the speed-to-lead row cites market evidence and is audit-computed', () => {
    const map = buildOpportunityMap(gapAnswers(), PS, null);
    const row = map.rows.find((r) => r.area === 'speedToLead');
    expect(row.kind).toBe('evidence');
    expect(row.body).toMatch(/We did not ask your lead response time/);
    expect(row.source).toMatch(/^Source:/);
    expect(row.verdict.state).toBe('audit');
    expect(row.fix).toMatch(/Start by timing it/);
  });

  it('the dead-lead row uses their own deal value, never a benchmark', () => {
    const map = buildOpportunityMap(gapAnswers(), PS, null);
    const row = map.rows.find((r) => r.area === 'deadLead');
    expect(row.body).toMatch(/\$62K|\$63K/);
    expect(row.body).toMatch(/audit counts from your CRM/);
  });

  it('the capped sales-cycle row carries the cap note', () => {
    const map = buildOpportunityMap(gapAnswers(), PS, null);
    const row = map.rows.find((r) => r.area === 'followupPipeline');
    expect(row.capNote).toMatch(/capped/);
  });

  it('a fully strong no-gap respondent still gets a full map with verdicts', () => {
    const a = gapAnswers({
      q3: { value: '26_50' },
      q8: { value: 'D', score: 4 },
      q11: { value: 'D', score: 4 },
      q15: { value: 'under_30' },
      q16: { value: 'under_5' },
    });
    const map = buildOpportunityMap(a, PS, null);
    expect(map.hasDollarGap).toBe(false);
    expect(map.rows.length).toBe(6);
    for (const row of map.rows) {
      expect(row.verdict, row.area).toBeTruthy();
    }
  });

  it('comparisons survive inside the map', () => {
    const map = buildOpportunityMap(gapAnswers(), PS, null);
    expect(map.comparisons.map((c) => c.key)).toEqual(['revenuePerEmployee', 'salesCycle', 'retention']);
  });
});

describe('generateComparisons', () => {
  it('shows the band label for a banded cycle and the exact days when typed', () => {
    const banded = generateComparisons(gapAnswers(), PS).find((c) => c.key === 'salesCycle');
    expect(banded.clientDisplay).toBe('Over 180 days');
    const exact = generateComparisons(gapAnswers({ q15: { value: 'over_180', exact: 200 } }), PS)
      .find((c) => c.key === 'salesCycle');
    expect(exact.clientDisplay).toBe('200 days');
  });

  it('cites a source on every row', () => {
    for (const c of generateComparisons(gapAnswers(), PS)) {
      expect(c.source).toMatch(/^Source:/);
    }
  });
});
