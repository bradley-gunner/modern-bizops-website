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

function lossRangePhrase(floor, median) {
  if (floor > 0) {
    return `between ${formatUsd(floor)} and ${formatUsd(median)}`;
  }
  return `as much as ${formatUsd(median)}`;
}

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
    body: `You are leaving ${lossRangePhrase(floorDollars, medianDollars)} of annual revenue uncaptured every year without needing to hire a single new person. This is the inversion of the problem most founders in your position describe: every dollar of revenue growth requiring another hire.`,
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
    body: `At your revenue, that is ${lossRangePhrase(floorDollars, medianDollars)} of incremental closed revenue you are not capturing this year.`,
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
    body: `Your gross revenue retention sits below where ${benchmark.label} peers operate. You are losing ${lossRangePhrase(floorDollars, medianDollars)} of revenue every year before you even start trying to grow.`,
    source: metricCitation(metric),
  });
}

function leadResponse(_answers, _benchmark) {
  // Reserved for a future Q16 lead-response-time question. No quiz input wired in v1.
  return null;
}

export const generators = { revenuePerEmployee, salesCycle, retention, leadResponse };

export function generateRoiLines(answers, benchmark) {
  const all = [
    generators.revenuePerEmployee(answers, benchmark),
    generators.salesCycle(answers, benchmark),
    generators.retention(answers, benchmark),
    generators.leadResponse(answers, benchmark),
  ].filter(Boolean);
  all.sort((a, b) => b.medianDollars - a.medianDollars);
  return all.slice(0, 3);
}
