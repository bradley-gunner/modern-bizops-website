/**
 * Comprehensive, self-describing serialization of a scorecard submission.
 * Pure functions, no I/O. Consumed by:
 *   - scorecard_result_json (the full computed result stored on the contact)
 *   - the branded PDF's "Your answers" section
 *   - the email loop
 *
 * Everything here is derived from the already-computed buildResult() payload
 * plus the raw answers; nothing is recomputed.
 */

import { QUESTIONS, getQuestionsFor } from './questions';
import { getBusinessModelBenchmark } from './businessModelBenchmarks';
import { formatUsd } from './voice';

const ROI_LINE_LABELS = {
  revenuePerEmployee: 'Revenue per employee',
  salesCycle: 'Sales cycle',
  retention: 'Gross revenue retention',
};

function usd(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

function pickOption(answers, qid) {
  const q = QUESTIONS.find((x) => x.id === qid);
  const value = answers?.[qid]?.value ?? null;
  const opt = q?.options.find((o) => o.value === value) || null;
  return { value, label: opt?.label ?? null };
}

/**
 * The questions the prospect actually saw, in order, with their chosen answer
 * label and (for maturity questions) the 1..4 score. q16 is reserved/hidden and
 * q15 is excluded for models where churn is not the operative metric; both are
 * handled by getQuestionsFor().
 */
export function answeredQuestions(answers) {
  return getQuestionsFor(answers || {}).map((q) => {
    const a = answers?.[q.id];
    const opt = q.options.find((o) => o.value === a?.value) || null;
    const score =
      typeof a?.score === 'number'
        ? a.score
        : typeof opt?.score === 'number'
          ? opt.score
          : null;
    return {
      id: q.id,
      section: q.section,
      prompt: q.prompt,
      answer: opt?.label ?? (a?.value ?? null),
      score,
      competencyLabel: q.competencyLabel ?? null,
    };
  });
}

// Merge the comparison rows (your number / peer median / peer range / read /
// source for every applicable metric) with the ROI lines (dollar impact + the
// exact "how to close" prose) by metric key.
function metricsDetail(result) {
  const roiByKey = Object.fromEntries((result.roiLines || []).map((l) => [l.key, l]));
  return (result.comparisons || []).map((c) => {
    const line = roiByKey[c.key];
    return {
      key: c.key,
      label: c.label,
      yourNumber: c.clientDisplay,
      peerMedian: c.peerMedianDisplay,
      peerRange: c.peerRangeDisplay,
      read: c.comparisonCopy,
      standing: c.comparison, // meets | partial | fails
      dollarImpact: line ? { low: usd(line.floorDollars), high: usd(line.medianDollars) } : null,
      howToClose: line?.fix || null,
      narrative: line?.body || null,
      source: c.source,
    };
  });
}

export function buildScorecardExport(result, answers, meta = {}) {
  const lines = Array.isArray(result?.roiLines) ? result.roiLines : [];
  const topLine = lines[0] || null;
  const low = usd(result?.headline?.floorDollars);
  const high = usd(result?.headline?.medianDollars);

  return {
    meta: {
      firstName: meta.firstName || null,
      company: meta.company || null,
      generatedAt: result?.generatedAt || meta.generatedAt || null,
    },
    businessModel: {
      key: getBusinessModelBenchmark(answers?.q2?.value).businessModel,
      label: result?.modelLabel || null,
    },
    profile: {
      revenueBand: pickOption(answers, 'q1'),
      teamSize: pickOption(answers, 'q3'),
      averageDealValue: pickOption(answers, 'q13'),
    },
    questions: answeredQuestions(answers),
    metrics: metricsDetail(result),
    dollarGap: {
      low,
      high,
      conservativeRead: formatUsd(low),
      peerMedianRead: formatUsd(high),
    },
    maturityStage: {
      label: result?.placement?.name || null,
      number: result?.placement?.stage ?? null,
      description: result?.placement?.descriptor || null,
      crossingIntoNext: result?.nextStage
        ? { name: result.nextStage.name, criteria: result.nextStage.criteria }
        : null,
    },
    topGap: topLine ? (ROI_LINE_LABELS[topLine.key] || topLine.key) : 'None',
    competencyMap: (result?.competencyScores || []).map((s) => ({
      id: s.id,
      competencyLabel: s.competencyLabel,
      score: s.score,
      block: s.block,
    })),
    benchmarkVersion: result?.benchmarkVersion || null,
  };
}
