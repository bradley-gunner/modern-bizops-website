/**
 * Business-model benchmark table for the Modern BizOps marketing-site scorecard.
 *
 * VENDORED COPY. The source of truth lives in the RevOps Coaching App at
 *   server/src/lib/businessModelBenchmarks.js
 *
 * Sync procedure:
 *   1. Re-curate a number in the canonical file (RevOps Coaching App).
 *   2. Bump BUSINESS_MODEL_BENCHMARK_VERSION in BOTH files in lockstep.
 *   3. Copy the BUSINESS_MODEL_BENCHMARKS object into this file.
 *   4. Update tests if any band edges shifted.
 *   5. Ship the version bump in the commit message so PR review surfaces it.
 *
 * Numbers are curated from named public reports; see each metric's `source`
 * and `asOf` for provenance. `confidence: 'cited'` means survey-grade public
 * benchmark; `confidence: 'estimated'` means a defensible extrapolation
 * anchored to the nearest sourced neighbor.
 *
 * Sibling industryBenchmarks.js (admin-only) is NOT used by the client-facing
 * scorecard and is not vendored here.
 */

export const BUSINESS_MODEL_BENCHMARK_VERSION = '1.2';

const BUSINESS_MODEL_BENCHMARKS = {
  B2B_SAAS: {
    businessModel: 'B2B_SAAS',
    label: 'B2B SaaS',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 84,     range: [30, 120],        unit: 'days', source: 'Optifai B2B SaaS Sales Cycle Benchmark (n=939); The Bridge Group SaaS metrics', asOf: 2025, confidence: 'cited' },
      leadResponseDays:   { direction: 'lower',  median: 0.5,    range: [0.04, 1.6],      unit: 'days', source: 'timetoreply 2024 (SaaS 12h); Optifai lead-response study (SaaS 38h)', asOf: 2024, confidence: 'cited' },
      revenuePerEmployee: { direction: 'higher', median: 130000, range: [100000, 200000], unit: 'usd',  source: 'SaaS Capital 2025 Revenue per Employee Benchmarks (private SaaS, n=1000+)', asOf: 2025, confidence: 'cited' },
      nrr:                { direction: 'higher', median: 1.10,   range: [1.00, 1.25],     unit: 'ratio', source: 'SaaS Capital 2025 Net Revenue Retention Benchmarks (private SaaS, n=1000+)', asOf: 2025, confidence: 'cited' },
    },
  },
  PROFESSIONAL_SERVICES: {
    businessModel: 'PROFESSIONAL_SERVICES',
    label: 'professional services',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 103,    range: [60, 130],        unit: 'days', source: 'Focus Digital Sales Cycle by Industry 2025 (Consulting 103d)', asOf: 2025, confidence: 'cited' },
      leadResponseDays:   { direction: 'lower',  median: 1.9,    range: [0.3, 2.5],       unit: 'days', source: 'Optifai lead-response study (Prof. Services 45h; Consulting 52h)', asOf: 2025, confidence: 'cited' },
      revenuePerEmployee: { direction: 'higher', median: 170000, range: [150000, 300000], unit: 'usd',  source: 'Statista Professional Services Rev/Employee; Deltek/Kantata 2025 PS Maturity Benchmark', asOf: 2024, confidence: 'cited' },
      nrr:                { direction: 'higher', median: 0.95,   range: [0.85, 1.05],     unit: 'ratio', source: 'Estimated, professional services churn offset by retainer renewals and scope expansion', asOf: 2025, confidence: 'estimated' },
    },
  },
  B2B_PRODUCT: {
    businessModel: 'B2B_PRODUCT',
    label: 'B2B product',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 130,    range: [104, 155],       unit: 'days', source: 'Focus Digital Sales Cycle by Industry 2025 (Manufacturing 130d)', asOf: 2025, confidence: 'cited' },
      leadResponseDays:   { direction: 'lower',  median: 2.0,    range: [0.7, 2.6],       unit: 'days', source: 'timetoreply 2024 (Manufacturing 42h); Optifai (Manufacturing 62h)', asOf: 2024, confidence: 'cited' },
      revenuePerEmployee: { direction: 'higher', median: 200000, range: [150000, 250000], unit: 'usd',  source: 'HRBench 2025 Rev/Employee by Industry (Manufacturing $150K-250K)', asOf: 2025, confidence: 'cited' },
      nrr:                { direction: 'higher', median: 0.90,   range: [0.80, 1.00],     unit: 'ratio', source: 'Estimated, B2B product repurchase rates anchored below SaaS (no seat-expansion lever)', asOf: 2025, confidence: 'estimated' },
    },
  },
  ECOMMERCE: {
    businessModel: 'ECOMMERCE',
    label: 'e-commerce',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 2,      range: [1, 14],          unit: 'days', source: 'Opensend Time to First Purchase (75% under 24h, 90% by day 12); Geckoboard purchase-decision window', asOf: 2025, confidence: 'cited' },
      leadResponseDays:   { direction: 'lower',  median: 0.1,    range: [0.003, 0.7],     unit: 'days', source: 'timetoreply 2024 (Retail 17h) plus LiveChat 2024 consumer-instant expectation', asOf: 2024, confidence: 'estimated' },
      revenuePerEmployee: { direction: 'higher', median: 150000, range: [100000, 250000], unit: 'usd',  source: 'HRBench 2025 (Retail $80K-150K) plus Finaloop ecommerce benchmarks, adjusted for lean DTC ops', asOf: 2024, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.30,   range: [0.20, 0.45],     unit: 'ratio', source: 'Estimated - annual cohort revenue retention from Klaviyo repeat-purchase benchmarks (~28% repeat rate) + DTC annual retention averages (~28% overall; consumables 35-45%, fashion 20-30%)', asOf: 2026, confidence: 'estimated' },
    },
  },
  B2C_SERVICES: {
    businessModel: 'B2C_SERVICES',
    label: 'B2C services',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 60,     range: [8, 180],         unit: 'days', source: 'Pro Remodeler / Builder Funnel home-services; WebFX 2026 Home Services benchmarks', asOf: 2026, confidence: 'estimated' },
      leadResponseDays:   { direction: 'lower',  median: 0.2,    range: [0.01, 1.0],      unit: 'days', source: 'Extrapolated from cross-industry 42h plus consumer same-day expectation (LiveChat 2024)', asOf: 2024, confidence: 'estimated' },
      revenuePerEmployee: { direction: 'higher', median: 100000, range: [60000, 150000],  unit: 'usd',  source: 'HRBench 2025 (Leisure/Hospitality $50K-100K, Healthcare $150K-250K), blended', asOf: 2025, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.70,   range: [0.55, 0.80],     unit: 'ratio', source: 'Estimated - annual client retention as revenue-retention proxy: HFA 2025 Fitness Industry Benchmarking (66.4%); IHRSA Profiles of Success (71.4% clubs, 80% PT studios)', asOf: 2026, confidence: 'estimated' },
    },
  },
  B2C_SUBSCRIPTION: {
    businessModel: 'B2C_SUBSCRIPTION',
    label: 'B2C subscription',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 3,      range: [1, 14],          unit: 'days', source: 'Estimated, extrapolated from ecommerce purchase-decision window (self-serve trial-to-paid)', asOf: 2025, confidence: 'estimated' },
      leadResponseDays:   { direction: 'lower',  median: 0.1,    range: [0.003, 0.7],     unit: 'days', source: 'Estimated, mirrors ecommerce (automation-first app/streaming support)', asOf: 2024, confidence: 'estimated' },
      revenuePerEmployee: { direction: 'higher', median: 140000, range: [90000, 200000],  unit: 'usd',  source: 'Estimated, anchored to private SaaS (130K) with a consumer-churn haircut', asOf: 2025, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.60,   range: [0.45, 0.75],     unit: 'ratio', source: 'Recurly State of Subscriptions (median ~4%/mo churn, 2,200+ merchants; annualizes to ~0.61 GRR, negligible consumer expansion); RevenueCat State of Subscription Apps (median 42% of revenue retained at 12 months, top quartile 50%+)', asOf: 2026, confidence: 'cited' },
    },
  },
  MARKETPLACE: {
    businessModel: 'MARKETPLACE',
    label: 'marketplace',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 90,     range: [60, 180],        unit: 'days', source: 'Estimated, Sharetribe/journeyh.io marketplace supply-side recruitment (3 to 6 months first cohort)', asOf: 2026, confidence: 'estimated' },
      leadResponseDays:   { direction: 'lower',  median: 0.3,    range: [0.01, 1.5],      unit: 'days', source: 'Estimated, blend of SaaS (supply side) and ecommerce (demand side)', asOf: 2024, confidence: 'estimated' },
      revenuePerEmployee: { direction: 'higher', median: 180000, range: [120000, 300000], unit: 'usd',  source: 'Estimated, no representative SMB data (public marketplaces are outliers); anchored above SaaS', asOf: 2025, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.92,   range: [0.82, 1.05],     unit: 'ratio', source: 'Estimated, marketplace supply-side retention blended with demand-side repurchase', asOf: 2025, confidence: 'estimated' },
    },
  },
  OTHER: {
    businessModel: 'OTHER',
    label: 'small-to-mid business',
    metrics: {
      salesCycleDays:     { direction: 'lower',  median: 90,     range: [45, 130],        unit: 'days', source: 'Cross-industry blended SMB fallback (Focus Digital all-industry 70 to 162 day span)', asOf: 2025, confidence: 'estimated' },
      leadResponseDays:   { direction: 'lower',  median: 1.75,   range: [0.04, 2.0],      unit: 'days', source: 'Cross-industry average 42 to 47h (timetoreply / Optifai), generic SMB fallback', asOf: 2024, confidence: 'cited' },
      revenuePerEmployee: { direction: 'higher', median: 150000, range: [100000, 250000], unit: 'usd',  source: 'HRBench cross-industry SMB-services-weighted median (excludes capital-intensive skew)', asOf: 2024, confidence: 'estimated' },
      nrr:                { direction: 'higher', median: 0.90,   range: [0.80, 1.00],     unit: 'ratio', source: 'Estimated, cross-industry SMB fallback blending product and service retention norms', asOf: 2024, confidence: 'estimated' },
    },
  },
};

export function getBusinessModelBenchmark(businessModel) {
  return BUSINESS_MODEL_BENCHMARKS[businessModel] || BUSINESS_MODEL_BENCHMARKS.OTHER;
}

export function classifyAgainstBenchmark(value, metric) {
  const { median, range, direction } = metric;
  const [low, high] = range;
  let band;
  if (direction === 'lower') {
    if (value <= median) band = 'strong';
    else if (value <= high) band = 'typical';
    else band = 'lagging';
  } else {
    if (value >= median) band = 'strong';
    else if (value >= low) band = 'typical';
    else band = 'lagging';
  }
  const interpretation = { strong: 'meets', typical: 'partial', lagging: 'fails' }[band];
  return { band, interpretation, median, range };
}
