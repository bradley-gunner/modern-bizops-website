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
  const exact = answers?.[qid]?.exact;
  return {
    value,
    label: opt?.label ?? null,
    ...(typeof exact === 'number' ? { exact } : {}),
  };
}

/**
 * The questions the prospect actually saw, in order, with their chosen answer
 * label, the 1..5 score for diagnostic questions, and the exact figure where
 * one was typed on a banded input. q16 is excluded for models where churn is
 * not the operative metric; handled by getQuestionsFor().
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
      ...(typeof a?.exact === 'number' ? { exact: a.exact } : {}),
      dimension: q.dimension ?? null,
    };
  });
}

// One row per opportunity-map area: the menu-shaped view of the result.
function opportunityDetail(result) {
  return (result?.opportunity?.rows || []).map((row) => ({
    area: row.area,
    areaTitle: row.areaTitle,
    kind: row.kind,
    metric: row.metricKey ? (ROI_LINE_LABELS[row.metricKey] || row.metricKey) : null,
    status: row.status ?? null,
    dollarImpact: row.line
      ? { low: usd(row.line.floorDollars), high: usd(row.line.medianDollars) }
      : null,
    yourNumber: row.line?.clientValue?.display ?? null,
    peerMedian: row.line?.peerMedian?.display ?? null,
    narrative: row.line?.body ?? row.body ?? row.statusLine ?? null,
    mathLine: row.line?.mathLine ?? null,
    verdict: {
      state: row.verdict.state,
      label: row.verdict.label,
      gap: row.verdict.gap ?? null,
      basis: row.verdict.basis,
    },
    howToClose: row.fix || null,
    source: row.source || null,
  }));
}

export function buildScorecardExport(result, answers, meta = {}) {
  const low = usd(result?.opportunity?.floorDollars);
  const high = usd(result?.opportunity?.medianDollars);
  const lines = Array.isArray(result?.opportunity?.roiLines) ? result.opportunity.roiLines : [];
  const topLine = lines[0] || null;

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
      averageDealValue: pickOption(answers, 'q14'),
    },
    questions: answeredQuestions(answers),
    readiness: {
      band: result?.band?.name || null,
      bandKey: result?.band?.key || null,
      composite: result?.band?.composite ?? null,
      dimensions: (result?.dimensions?.items || []).map((d) => ({
        key: d.key,
        label: d.label,
        mean: d.mean,
        level: d.level,
        levelWord: d.levelWord,
      })),
      burnedAttempt: Boolean(result?.burnedAttempt),
      beliefConfidence: answers?.q4?.score ?? null,
      connectComfort: answers?.q13?.score ?? null,
    },
    whyItDidNotStick: result?.whyItDidNotStick?.text || null,
    beliefContrast: result?.belief?.text || null,
    observed: result?.observed
      ? {
          host: result.observed.host,
          status: result.observed.status,
          findings: (result?.observedFindings?.lines || []).map((l) => ({
            key: l.key,
            tone: l.tone,
            text: l.text,
          })),
        }
      : null,
    opportunityMap: opportunityDetail(result),
    dollarGap: {
      low,
      high,
      conservativeRead: formatUsd(low),
      peerMedianRead: formatUsd(high),
    },
    firstMove: result?.firstMove
      ? { dimension: result.firstMove.dimensionLabel, text: result.firstMove.text }
      : null,
    topGap: topLine ? (ROI_LINE_LABELS[topLine.key] || topLine.key) : 'None',
    benchmarkVersion: result?.benchmarkVersion || null,
  };
}
