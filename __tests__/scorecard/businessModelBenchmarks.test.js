import { describe, it, expect } from 'vitest';
import {
  BUSINESS_MODEL_BENCHMARK_VERSION,
  getBusinessModelBenchmark,
  classifyAgainstBenchmark,
} from '@/lib/scorecard/businessModelBenchmarks';

const MODELS = [
  'B2B_SAAS',
  'PROFESSIONAL_SERVICES',
  'B2B_PRODUCT',
  'ECOMMERCE',
  'B2C_SERVICES',
  'B2C_SUBSCRIPTION',
  'MARKETPLACE',
  'OTHER',
];

describe('businessModelBenchmarks', () => {
  it('exports version 1.2', () => {
    expect(BUSINESS_MODEL_BENCHMARK_VERSION).toBe('1.2');
  });

  it.each(MODELS)('row %s carries a grr metric with median <= 1.00', (model) => {
    const grr = getBusinessModelBenchmark(model).metrics.grr;
    expect(grr).toBeDefined();
    expect(grr.direction).toBe('higher');
    expect(grr.unit).toBe('ratio');
    expect(grr.median).toBeLessThanOrEqual(1.00);
    expect(grr.range[0]).toBeLessThanOrEqual(grr.median);
    expect(grr.range[1]).toBeLessThanOrEqual(1.00);
    expect(grr.source).toBeTypeOf('string');
    expect(typeof grr.asOf).toBe('number');
    expect(grr.confidence).toMatch(/^(cited|estimated)$/);
  });

  it.each(MODELS)('row %s grr median <= nrr median (definitional invariant)', (model) => {
    const m = getBusinessModelBenchmark(model).metrics;
    expect(m.grr.median).toBeLessThanOrEqual(m.nrr.median);
  });

  it.each(MODELS)('row %s grr range[1] >= median', (model) => {
    const grr = getBusinessModelBenchmark(model).metrics.grr;
    expect(grr.range[1]).toBeGreaterThanOrEqual(grr.median);
  });

  it.each([
    ['ECOMMERCE',        0.30],
    ['B2C_SERVICES',     0.70],
    ['B2C_SUBSCRIPTION', 0.60],
  ])('%s grr median pinned at %f (matches v1.2 nrr; no consumer expansion)', (model, expected) => {
    expect(getBusinessModelBenchmark(model).metrics.grr.median).toBe(expected);
  });

  it('v1.2 sync: ECOMMERCE nrr median is 0.30 (annual cohort)', () => {
    expect(getBusinessModelBenchmark('ECOMMERCE').metrics.nrr.median).toBe(0.30);
  });

  it('v1.2 sync: B2C_SERVICES nrr median is 0.70', () => {
    expect(getBusinessModelBenchmark('B2C_SERVICES').metrics.nrr.median).toBe(0.70);
  });

  it('v1.2 sync: B2C_SUBSCRIPTION nrr median is 0.60 (Recurly annualized)', () => {
    expect(getBusinessModelBenchmark('B2C_SUBSCRIPTION').metrics.nrr.median).toBe(0.60);
  });

  it('B2B_SAAS grr is 0.90 [0.82, 0.95]', () => {
    const grr = getBusinessModelBenchmark('B2B_SAAS').metrics.grr;
    expect(grr.median).toBe(0.90);
    expect(grr.range).toEqual([0.82, 0.95]);
  });

  it.each(MODELS)('returns a benchmark row for %s', (model) => {
    const row = getBusinessModelBenchmark(model);
    expect(row.businessModel).toBe(model);
    expect(row.label).toBeTypeOf('string');
    expect(row.metrics.salesCycleDays).toBeDefined();
    expect(row.metrics.leadResponseDays).toBeDefined();
    expect(row.metrics.revenuePerEmployee).toBeDefined();
    expect(row.metrics.nrr).toBeDefined();
  });

  it('falls back to OTHER for unknown business model', () => {
    expect(getBusinessModelBenchmark('UNKNOWN_FOO').businessModel).toBe('OTHER');
    expect(getBusinessModelBenchmark(null).businessModel).toBe('OTHER');
    expect(getBusinessModelBenchmark(undefined).businessModel).toBe('OTHER');
  });

  it('each metric carries direction, median, range, unit, source, asOf, confidence', () => {
    const m = getBusinessModelBenchmark('B2B_SAAS').metrics.salesCycleDays;
    expect(m.direction).toMatch(/^(lower|higher)$/);
    expect(typeof m.median).toBe('number');
    expect(Array.isArray(m.range)).toBe(true);
    expect(m.range).toHaveLength(2);
    expect(m.unit).toBeTypeOf('string');
    expect(m.source).toBeTypeOf('string');
    expect(typeof m.asOf).toBe('number');
    expect(m.confidence).toMatch(/^(cited|estimated)$/);
  });

  describe('classifyAgainstBenchmark (direction = lower)', () => {
    const metric = { direction: 'lower', median: 84, range: [30, 120], unit: 'days', source: 'x', asOf: 2025, confidence: 'cited' };

    it('value at or below median => strong/meets', () => {
      expect(classifyAgainstBenchmark(84, metric).interpretation).toBe('meets');
      expect(classifyAgainstBenchmark(50, metric).interpretation).toBe('meets');
    });

    it('value between median and high => typical/partial', () => {
      expect(classifyAgainstBenchmark(100, metric).interpretation).toBe('partial');
      expect(classifyAgainstBenchmark(120, metric).interpretation).toBe('partial');
    });

    it('value above high => lagging/fails', () => {
      expect(classifyAgainstBenchmark(200, metric).interpretation).toBe('fails');
    });
  });

  describe('classifyAgainstBenchmark (direction = higher)', () => {
    const metric = { direction: 'higher', median: 130000, range: [100000, 200000], unit: 'usd', source: 'x', asOf: 2025, confidence: 'cited' };

    it('value at or above median => strong/meets', () => {
      expect(classifyAgainstBenchmark(130000, metric).interpretation).toBe('meets');
      expect(classifyAgainstBenchmark(250000, metric).interpretation).toBe('meets');
    });

    it('value between low and median => typical/partial', () => {
      expect(classifyAgainstBenchmark(120000, metric).interpretation).toBe('partial');
      expect(classifyAgainstBenchmark(100000, metric).interpretation).toBe('partial');
    });

    it('value below low => lagging/fails', () => {
      expect(classifyAgainstBenchmark(50000, metric).interpretation).toBe('fails');
    });
  });
});
