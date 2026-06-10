/**
 * ROI line generators. Each takes (answers, benchmark) and returns either
 * null or a fully-populated RoiLine. Generators return null when there is no
 * dollar gap to surface (meets band, notTracked input, or hidden question).
 *
 * Magnitude ranking: medianDollars desc, cap at 3.
 */

import { QUESTIONS } from './questions';
import { classifyAgainstBenchmark } from './businessModelBenchmarks';
import { COMPARISON_COPY, bandTitle, formatUsd, sourceCitation, sanitizeVoice } from './voice';

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
    body: `You are leaving between ${formatUsd(floorDollars)} and ${formatUsd(medianDollars)} of annual revenue uncaptured every year without needing to hire a single new person. This is the inversion of the problem most founders in your position describe: every dollar of revenue growth requiring another hire.`,
    source: sourceCitation(benchmark.label),
  });
}

function salesCycle(answers, benchmark) {
  const opt = getOption('q14', answers.q14?.value);
  if (!opt || opt.notTracked) return null;
  const clientDays = opt.midpoint;
  const metric = benchmark.metrics.salesCycleDays;
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
    body: `At your revenue, that is between ${formatUsd(floorDollars)} and ${formatUsd(medianDollars)} of incremental closed revenue you are not capturing this year.`,
    source: sourceCitation(benchmark.label),
  });
}

function nrr(answers, benchmark) {
  if (!answers.q15) return null;
  const opt = getOption('q15', answers.q15.value);
  if (!opt || opt.notTracked) return null;
  const clientChurn = opt.midpoint;
  const clientNrr = 1 - clientChurn;
  const metric = benchmark.metrics.nrr;
  const { interpretation } = classifyAgainstBenchmark(clientNrr, metric);
  if (interpretation === 'meets') return null;
  const [low, high] = metric.range;
  const currentRevenue = midpoint('q1', answers.q1?.value);
  if (!currentRevenue) return null;
  const floorDollars = Math.max(0, low - clientNrr) * currentRevenue;
  const medianDollars = Math.max(0, metric.median - clientNrr) * currentRevenue;
  if (medianDollars <= 0) return null;
  return buildLine({
    key: 'nrr',
    title: bandTitle('nrr'),
    clientValue: { display: fmtPercent(clientNrr), raw: clientNrr, unit: 'ratio' },
    peerMedian: { display: fmtPercent(metric.median), raw: metric.median },
    peerRange: { displayLow: fmtPercent(low), displayHigh: fmtPercent(high) },
    comparison: interpretation,
    floorDollars,
    medianDollars,
    body: `You are losing between ${formatUsd(floorDollars)} and ${formatUsd(medianDollars)} of revenue every year before you even start trying to grow.`,
    source: sourceCitation(benchmark.label),
  });
}

function leadResponse(_answers, _benchmark) {
  // Reserved for a future Q16 lead-response-time question. No quiz input wired in v1.
  return null;
}

export const generators = { revenuePerEmployee, salesCycle, nrr, leadResponse };

export function generateRoiLines(answers, benchmark) {
  const all = [
    generators.revenuePerEmployee(answers, benchmark),
    generators.salesCycle(answers, benchmark),
    generators.nrr(answers, benchmark),
    generators.leadResponse(answers, benchmark),
  ].filter(Boolean);
  all.sort((a, b) => b.medianDollars - a.medianDollars);
  return all.slice(0, 3);
}
