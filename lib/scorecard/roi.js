/**
 * ROI line generators. Each takes (answers, benchmark) and returns either
 * null or a fully-populated RoiLine. Generators return null when there is no
 * dollar gap to surface (meets band, notTracked input, or hidden question).
 *
 * Magnitude ranking: medianDollars desc, cap at 3.
 */

import { QUESTIONS } from './questions';
import { classifyAgainstBenchmark } from './businessModelBenchmarks';
import { COMPARISON_COPY, bandTitle, formatUsd, metricCitation, sanitizeVoice } from './voice';

export const MIN_RESOLVABLE_CYCLE_DAYS = 20;

function getOption(qid, value) {
  const q = QUESTIONS.find((x) => x.id === qid);
  return q?.options.find((o) => o.value === value);
}

function midpoint(qid, value) {
  return getOption(qid, value)?.midpoint;
}

function fmtDays(n) {
  return `${Math.round(n)} days`;
}

function fmtPercent(ratio) {
  return `${Math.round(ratio * 100)}%`;
}

const PER_LINE_CAP = 0.5;
const AGGREGATE_CAP = 0.75;

function applyCaps(lines, revenue) {
  if (!revenue || lines.length === 0) return lines;
  const perLineCap = revenue * PER_LINE_CAP;
  // Step 1: cap each line median at 50% of revenue; floor at capped median.
  let capped = lines.map((line) => {
    const medianDollars = Math.min(line.medianDollars, perLineCap);
    const floorDollars = Math.min(line.floorDollars, medianDollars);
    return { ...line, medianDollars, floorDollars };
  });
  // Step 2: if sum of medians > 75% of revenue, proportional scale-down so sum equals 75%.
  const sumMedians = capped.reduce((s, l) => s + l.medianDollars, 0);
  const aggregateCap = revenue * AGGREGATE_CAP;
  if (sumMedians > aggregateCap && sumMedians > 0) {
    const scale = aggregateCap / sumMedians;
    capped = capped.map((line) => {
      const medianDollars = Math.round(line.medianDollars * scale);
      const floorDollars = Math.min(Math.round(line.floorDollars * scale), medianDollars);
      return { ...line, medianDollars, floorDollars };
    });
  } else {
    capped = capped.map((line) => ({
      ...line,
      medianDollars: Math.round(line.medianDollars),
      floorDollars: Math.round(line.floorDollars),
    }));
  }
  return capped;
}

function lossRangePhrase(floor, median) {
  if (floor > 0) {
    return `between ${formatUsd(floor)} and ${formatUsd(median)}`;
  }
  return `as much as ${formatUsd(median)}`;
}

/**
 * Single source of truth for each line's body template. Bodies are built from
 * these at generation time and rebuilt after applyCaps so the copy always
 * reflects the final (capped) dollar figures.
 */
const BODY_BUILDERS = {
  revenuePerEmployee: (floor, median) =>
    `You are leaving ${lossRangePhrase(floor, median)} of annual revenue uncaptured every year without needing to hire a single new person. This is the inversion of the problem most founders in your position describe: every dollar of revenue growth requiring another hire.`,
  salesCycle: (floor, median) =>
    `At your revenue, that is ${lossRangePhrase(floor, median)} of incremental closed revenue you are not capturing this year.`,
  retention: (floor, median, benchmark) =>
    `Your gross revenue retention sits below where ${benchmark.label} peers operate. You are losing ${lossRangePhrase(floor, median)} of revenue every year before you even start trying to grow.`,
};

function buildLine({ key, title, clientValue, peerMedian, peerRange, comparison, floorDollars, medianDollars, body, source }) {
  return {
    key,
    title: sanitizeVoice(title),
    clientValue,
    peerMedian,
    peerRange,
    comparison,
    comparisonCopy: sanitizeVoice(COMPARISON_COPY[key][comparison]),
    floorDollars: Math.max(0, Math.round(floorDollars || 0)),
    medianDollars: Math.max(0, Math.round(medianDollars || 0)),
    body: sanitizeVoice(body),
    source,
  };
}

function revenuePerEmployee(answers, benchmark) {
  const revenue = midpoint('q1', answers.q1?.value);
  const team = midpoint('q3', answers.q3?.value);
  if (!revenue || !team) return null;
  const clientValue = revenue / team;
  const metric = benchmark.metrics.revenuePerEmployee;
  const { interpretation } = classifyAgainstBenchmark(clientValue, metric);
  const [low, high] = metric.range;
  const floorDollars = Math.max(0, low - clientValue) * team;
  const medianDollars = Math.max(0, metric.median - clientValue) * team;
  if (medianDollars <= 0) return null;
  return buildLine({
    key: 'revenuePerEmployee',
    title: bandTitle('revenuePerEmployee'),
    clientValue: { display: formatUsd(clientValue) + ' per employee', raw: clientValue, unit: 'usd' },
    peerMedian: { display: formatUsd(metric.median) + ' per employee', raw: metric.median },
    peerRange: { displayLow: formatUsd(low), displayHigh: formatUsd(high) },
    comparison: interpretation,
    floorDollars,
    medianDollars,
    body: BODY_BUILDERS.revenuePerEmployee(floorDollars, medianDollars),
    source: metricCitation(metric),
  });
}

function salesCycle(answers, benchmark) {
  const opt = getOption('q14', answers.q14?.value);
  if (!opt || opt.notTracked) return null;
  const clientDays = opt.midpoint;
  const metric = benchmark.metrics.salesCycleDays;
  if (metric.median < MIN_RESOLVABLE_CYCLE_DAYS) return null;
  const { interpretation } = classifyAgainstBenchmark(clientDays, metric);
  if (interpretation === 'meets') return null;
  const [low, high] = metric.range;
  const currentRevenue = midpoint('q1', answers.q1?.value);
  if (!currentRevenue) return null;
  const throughputToHigh = clientDays / high - 1;
  const throughputToMedian = clientDays / metric.median - 1;
  const floorDollars = Math.max(0, throughputToHigh) * currentRevenue;
  const medianDollars = Math.max(0, throughputToMedian) * currentRevenue;
  if (medianDollars <= 0) return null;
  return buildLine({
    key: 'salesCycle',
    title: bandTitle('salesCycle'),
    clientValue: { display: fmtDays(clientDays), raw: clientDays, unit: 'days' },
    peerMedian: { display: fmtDays(metric.median), raw: metric.median },
    peerRange: { displayLow: fmtDays(low), displayHigh: fmtDays(high) },
    comparison: interpretation,
    floorDollars,
    medianDollars,
    body: BODY_BUILDERS.salesCycle(floorDollars, medianDollars),
    source: metricCitation(metric),
  });
}

function retention(answers, benchmark) {
  if (!answers.q15) return null;
  const opt = getOption('q15', answers.q15.value);
  if (!opt || opt.notTracked) return null;
  const clientChurn = opt.midpoint;
  const clientGrr = 1 - clientChurn;
  const metric = benchmark.metrics.grr;
  if (!metric) return null;
  const { interpretation } = classifyAgainstBenchmark(clientGrr, metric);
  if (interpretation === 'meets') return null;
  const [low, high] = metric.range;
  const currentRevenue = midpoint('q1', answers.q1?.value);
  if (!currentRevenue) return null;
  const floorDollars = Math.max(0, low - clientGrr) * currentRevenue;
  const medianDollars = Math.max(0, metric.median - clientGrr) * currentRevenue;
  if (medianDollars <= 0) return null;
  return buildLine({
    key: 'retention',
    title: bandTitle('retention'),
    clientValue: { display: fmtPercent(clientGrr), raw: clientGrr, unit: 'ratio' },
    peerMedian: { display: fmtPercent(metric.median), raw: metric.median },
    peerRange: { displayLow: fmtPercent(low), displayHigh: fmtPercent(high) },
    comparison: interpretation,
    floorDollars,
    medianDollars,
    body: BODY_BUILDERS.retention(floorDollars, medianDollars, benchmark),
    source: metricCitation(metric),
  });
}

function leadResponse(_answers, _benchmark) {
  // Reserved for a future Q16 lead-response-time question. No quiz input wired in v1.
  return null;
}

export const generators = { revenuePerEmployee, salesCycle, retention, leadResponse };

function compareRevenuePerEmployee(answers, benchmark) {
  const revenue = midpoint('q1', answers.q1?.value);
  const team = midpoint('q3', answers.q3?.value);
  if (!revenue || !team) return null;
  const clientValue = revenue / team;
  const metric = benchmark.metrics.revenuePerEmployee;
  const { interpretation } = classifyAgainstBenchmark(clientValue, metric);
  const [low, high] = metric.range;
  return {
    key: 'revenuePerEmployee',
    label: 'Revenue per employee',
    clientDisplay: `${formatUsd(clientValue)} per employee`,
    peerMedianDisplay: `${formatUsd(metric.median)} per employee`,
    peerRangeDisplay: `${formatUsd(low)} to ${formatUsd(high)}`,
    comparison: interpretation,
    comparisonCopy: sanitizeVoice(COMPARISON_COPY.revenuePerEmployee[interpretation]),
    source: metricCitation(metric),
  };
}

function compareSalesCycle(answers, benchmark) {
  const opt = getOption('q14', answers.q14?.value);
  if (!opt || opt.notTracked) return null;
  const metric = benchmark.metrics.salesCycleDays;
  if (metric.median < MIN_RESOLVABLE_CYCLE_DAYS) return null;
  const clientDays = opt.midpoint;
  const { interpretation } = classifyAgainstBenchmark(clientDays, metric);
  const [low, high] = metric.range;
  return {
    key: 'salesCycle',
    label: 'Sales cycle (first qualified conversation to close)',
    clientDisplay: opt.label, // "30 to 90 days", not "60 days"
    peerMedianDisplay: fmtDays(metric.median),
    peerRangeDisplay: `${fmtDays(low)} to ${fmtDays(high)}`,
    comparison: interpretation,
    comparisonCopy: sanitizeVoice(COMPARISON_COPY.salesCycle[interpretation]),
    source: metricCitation(metric),
  };
}

function compareRetention(answers, benchmark) {
  if (!answers.q15) return null;
  const opt = getOption('q15', answers.q15.value);
  if (!opt || opt.notTracked) return null;
  const metric = benchmark.metrics.grr;
  if (!metric) return null;
  const clientGrr = 1 - opt.midpoint;
  const { interpretation } = classifyAgainstBenchmark(clientGrr, metric);
  const [low, high] = metric.range;
  return {
    key: 'retention',
    label: 'Gross revenue retention',
    clientDisplay: fmtPercent(clientGrr),
    peerMedianDisplay: fmtPercent(metric.median),
    peerRangeDisplay: `${fmtPercent(low)} to ${fmtPercent(high)}`,
    comparison: interpretation,
    comparisonCopy: sanitizeVoice(COMPARISON_COPY.retention[interpretation]),
    source: metricCitation(metric),
  };
}

export function generateComparisons(answers, benchmark) {
  return [
    compareRevenuePerEmployee(answers, benchmark),
    compareSalesCycle(answers, benchmark),
    compareRetention(answers, benchmark),
  ].filter(Boolean);
}

export function generateRoiLines(answers, benchmark) {
  const all = [
    generators.revenuePerEmployee(answers, benchmark),
    generators.salesCycle(answers, benchmark),
    generators.retention(answers, benchmark),
    generators.leadResponse(answers, benchmark),
  ].filter(Boolean);
  all.sort((a, b) => b.medianDollars - a.medianDollars);
  const top = all.slice(0, 3);
  const revenue = midpoint('q1', answers.q1?.value);
  const capped = applyCaps(top, revenue);
  // Re-render each body from the FINAL numbers so copy never shows pre-cap dollars.
  return capped.map((line) => {
    const builder = BODY_BUILDERS[line.key];
    if (!builder) return line;
    return { ...line, body: sanitizeVoice(builder(line.floorDollars, line.medianDollars, benchmark)) };
  });
}
