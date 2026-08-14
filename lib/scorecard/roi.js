/**
 * The opportunity map: dollar-line generators, the verdict rule table, and
 * the menu-shaped row builder.
 *
 * The generators and the caps survive from the pre-rebuild instrument; what
 * changed (doc 15 Part 5 section 6, plus Bradley's 2026-08-14 menu-shape
 * decision) is what the dollars attach to. Each computed gap maps to the
 * Builds-menu area that closes it, and three evidence rows (dead-lead
 * reactivation, speed to lead, invoice collection) cover the menu areas the
 * questionnaire cannot compute, quoting no invented dollars.
 *
 * Financial inputs resolve through resolveInput(): an exact figure the taker
 * typed replaces the band midpoint, and every computed row carries a
 * shown-arithmetic line naming which one the math used.
 *
 * THE VERDICT RULE TABLE is deterministic and deliberately small. Three
 * blocking rules fire (no named owner blocks everything; an observed
 * unauthenticated sending domain blocks the email-sequence areas; governance
 * absent blocks customer-facing sends), one ready rule fires (follow-up and
 * pipeline, only when a named owner meets an observed authenticated domain),
 * and everything else is audit-computed, which is the honest majority case
 * and the design working. Every verdict states its basis.
 */

import { QUESTIONS, resolveInput } from './questions';
import { classifyAgainstBenchmark } from './businessModelBenchmarks';
import {
  AREA_TITLES,
  CAP_NOTE,
  COMPARISON_COPY,
  DEAD_LEAD_BODY_GENERIC,
  FIX_PARAGRAPHS,
  INVOICE_COLLECTION_BODY,
  MATH_LINES,
  NO_GAP_ROW_LINE,
  NOT_TRACKED_ROW_LINE,
  VERDICT_LABELS,
  bandTitle,
  deadLeadBody,
  fmtResponseDays,
  formatUsd,
  metricCitation,
  provenancePhrase,
  sanitizeVoice,
  speedToLeadBody,
} from './voice';

export const MIN_RESOLVABLE_CYCLE_DAYS = 20;

function getOption(qid, value) {
  const q = QUESTIONS.find((x) => x.id === qid);
  return q?.options.find((o) => o.value === value);
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
    return { ...line, capped: line.capped || medianDollars < line.medianDollars, medianDollars, floorDollars };
  });
  // Step 2: if sum of medians > 75% of revenue, proportional scale-down so sum equals 75%.
  const sumMedians = capped.reduce((s, l) => s + l.medianDollars, 0);
  const aggregateCap = revenue * AGGREGATE_CAP;
  if (sumMedians > aggregateCap && sumMedians > 0) {
    const scale = aggregateCap / sumMedians;
    capped = capped.map((line) => {
      const medianDollars = Math.round(line.medianDollars * scale);
      const floorDollars = Math.min(Math.round(line.floorDollars * scale), medianDollars);
      return { ...line, capped: true, medianDollars, floorDollars };
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
  if (floor > 0 && formatUsd(floor) === formatUsd(median)) {
    // Caps can collapse floor and median to the same display value;
    // "between $231K and $231K" reads broken, so state the single figure.
    return `on the order of ${formatUsd(median)}`;
  }
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

function buildLine({ key, title, clientValue, peerMedian, peerRange, comparison, floorDollars, medianDollars, body, source, mathLine }) {
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
    mathLine,
    capped: false,
  };
}

function revenuePerEmployee(answers, benchmark) {
  const revenue = resolveInput('q1', answers);
  const team = resolveInput('q3', answers);
  if (!revenue.value || !team.value) return null;
  const clientValue = revenue.value / team.value;
  const metric = benchmark.metrics.revenuePerEmployee;
  const { interpretation } = classifyAgainstBenchmark(clientValue, metric);
  const [low, high] = metric.range;
  const floorDollars = Math.max(0, low - clientValue) * team.value;
  const medianDollars = Math.max(0, metric.median - clientValue) * team.value;
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
    mathLine: MATH_LINES.revenuePerEmployee({
      revenueDisplay: formatUsd(revenue.value),
      revenueProv: provenancePhrase(revenue.exact),
      teamDisplay: String(Math.round(team.value)),
      teamProv: provenancePhrase(team.exact),
      rpeDisplay: formatUsd(clientValue),
      medianDisplay: formatUsd(metric.median),
    }),
  });
}

function salesCycle(answers, benchmark) {
  const cycle = resolveInput('q15', answers);
  if (cycle.notTracked || !cycle.value) return null;
  const clientDays = cycle.value;
  const metric = benchmark.metrics.salesCycleDays;
  if (metric.median < MIN_RESOLVABLE_CYCLE_DAYS) return null;
  const { interpretation } = classifyAgainstBenchmark(clientDays, metric);
  if (interpretation === 'meets') return null;
  const [low, high] = metric.range;
  const revenue = resolveInput('q1', answers);
  if (!revenue.value) return null;
  const throughputToHigh = clientDays / high - 1;
  const throughputToMedian = clientDays / metric.median - 1;
  const floorDollars = Math.max(0, throughputToHigh) * revenue.value;
  const medianDollars = Math.max(0, throughputToMedian) * revenue.value;
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
    mathLine: MATH_LINES.salesCycle({
      cycleDisplay: fmtDays(clientDays),
      cycleProv: provenancePhrase(cycle.exact),
      medianDisplay: fmtDays(metric.median),
      revenueDisplay: formatUsd(revenue.value),
      revenueProv: provenancePhrase(revenue.exact),
    }),
  });
}

function retention(answers, benchmark) {
  if (!answers.q16) return null;
  const churn = resolveInput('q16', answers);
  if (churn.notTracked || typeof churn.value !== 'number') return null;
  const clientGrr = 1 - churn.value;
  const metric = benchmark.metrics.grr;
  if (!metric) return null;
  const { interpretation } = classifyAgainstBenchmark(clientGrr, metric);
  if (interpretation === 'meets') return null;
  const [low, high] = metric.range;
  const revenue = resolveInput('q1', answers);
  if (!revenue.value) return null;
  const floorDollars = Math.max(0, low - clientGrr) * revenue.value;
  const medianDollars = Math.max(0, metric.median - clientGrr) * revenue.value;
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
    mathLine: MATH_LINES.retention({
      grrDisplay: fmtPercent(clientGrr),
      churnProv: provenancePhrase(churn.exact),
      medianDisplay: fmtPercent(metric.median),
      revenueDisplay: formatUsd(revenue.value),
      revenueProv: provenancePhrase(revenue.exact),
    }),
  });
}

export const generators = { revenuePerEmployee, salesCycle, retention };

/* ------------------------------------------------------------------ */
/* Peer comparison table (survives inside the opportunity map)        */
/* ------------------------------------------------------------------ */

function compareRevenuePerEmployee(answers, benchmark) {
  const revenue = resolveInput('q1', answers);
  const team = resolveInput('q3', answers);
  if (!revenue.value || !team.value) return null;
  const clientValue = revenue.value / team.value;
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
  const cycle = resolveInput('q15', answers);
  if (cycle.notTracked || !cycle.value) return null;
  const metric = benchmark.metrics.salesCycleDays;
  if (metric.median < MIN_RESOLVABLE_CYCLE_DAYS) return null;
  const { interpretation } = classifyAgainstBenchmark(cycle.value, metric);
  const [low, high] = metric.range;
  const bandLabel = getOption('q15', answers.q15?.value)?.label;
  return {
    key: 'salesCycle',
    label: 'Sales cycle (first qualified conversation to close)',
    clientDisplay: cycle.exact ? fmtDays(cycle.value) : bandLabel, // band label unless they typed the number
    peerMedianDisplay: fmtDays(metric.median),
    peerRangeDisplay: `${fmtDays(low)} to ${fmtDays(high)}`,
    comparison: interpretation,
    comparisonCopy: sanitizeVoice(COMPARISON_COPY.salesCycle[interpretation]),
    source: metricCitation(metric),
  };
}

function compareRetention(answers, benchmark) {
  if (!answers.q16) return null;
  const churn = resolveInput('q16', answers);
  if (churn.notTracked || typeof churn.value !== 'number') return null;
  const metric = benchmark.metrics.grr;
  if (!metric) return null;
  const clientGrr = 1 - churn.value;
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
  ].filter(Boolean);
  all.sort((a, b) => b.medianDollars - a.medianDollars);
  const revenue = resolveInput('q1', answers);
  const capped = applyCaps(all, revenue.value);
  // Re-render each body from the FINAL numbers so copy never shows pre-cap dollars.
  return capped.map((line) => {
    const builder = BODY_BUILDERS[line.key];
    if (!builder) return line;
    return { ...line, body: sanitizeVoice(builder(line.floorDollars, line.medianDollars, benchmark)) };
  });
}

/* ------------------------------------------------------------------ */
/* The verdict rule table                                             */
/* ------------------------------------------------------------------ */

/** Which computed metric feeds which menu area. */
export const AREA_BY_METRIC = {
  salesCycle: 'followupPipeline',
  revenuePerEmployee: 'busywork',
  retention: 'onboardingCs',
};

/** Areas whose build sends email sequences; the observed email-auth block
 *  applies to exactly these. */
const EMAIL_SEQUENCE_AREAS = new Set(['followupPipeline', 'deadLead']);

const AUDIT_BASIS = {
  followupPipeline: 'the gate here is CRM data quality, which only a connected read can score',
  busywork: 'the gate here is data quality and systems state, which only a connected read can score',
  onboardingCs: 'the gate here is customer-data quality, which only a connected read can score',
  deadLead: 'the dormant-lead pool lives in your CRM, and the audit counts it there',
  speedToLead: 'we do not ask your response time; the audit reads it from your CRM timestamps',
  invoiceCollection: 'your collection gap lives in your invoicing tool, and the audit reads it there',
};

function emailAuthState(observed) {
  const auth = observed?.emailAuth;
  if (!auth?.checked) return { known: false };
  return { known: true, ok: auth.spf && auth.dmarc, missingList: (auth.missing || []).join(', ') };
}

/**
 * The deterministic verdict for one area. Basis is always stated; "ready" is
 * always "as far as we can see" and names the signals it rests on.
 */
export function verdictFor(area, answers, observed) {
  const ownerScore = answers?.q8?.score ?? 0;
  const governanceScore = answers?.q11?.score ?? 0;
  const auth = emailAuthState(observed);

  // Blocking rule 1: no named owner blocks everything.
  if (ownerScore === 1) {
    return {
      state: 'blocked',
      label: VERDICT_LABELS.blocked,
      gap: sanitizeVoice('nobody owns AI and automation in your business'),
      basis: sanitizeVoice('self-reported (who owns AI and automation)'),
    };
  }
  // Blocking rule 2: an observed unauthenticated sending domain blocks the
  // areas that send email sequences.
  if (EMAIL_SEQUENCE_AREAS.has(area) && auth.known && !auth.ok) {
    return {
      state: 'blocked',
      label: VERDICT_LABELS.blocked,
      gap: sanitizeVoice(`your sending domain is not fully authenticated (${auth.missingList})`),
      basis: sanitizeVoice('observed from your public surfaces (DNS)'),
    };
  }
  // Blocking rule 3: governance absent blocks customer-facing sends.
  if (area === 'onboardingCs' && governanceScore === 1) {
    return {
      state: 'blocked',
      label: VERDICT_LABELS.blocked,
      gap: sanitizeVoice('nobody decides what customer data an AI tool may touch'),
      basis: sanitizeVoice('self-reported (data governance)'),
    };
  }
  // The one ready rule: follow-up and pipeline, when a named owner with
  // protected time meets an observed authenticated sending domain.
  if (area === 'followupPipeline' && ownerScore >= 4 && auth.known && auth.ok) {
    return {
      state: 'ready',
      label: VERDICT_LABELS.ready,
      basis: sanitizeVoice('a named owner with protected time (self-reported) and an authenticated sending domain (observed from your public surfaces)'),
    };
  }
  // Everything else: the audit computes this, and that is the design working.
  return {
    state: 'audit',
    label: VERDICT_LABELS.audit,
    basis: sanitizeVoice(AUDIT_BASIS[area]),
  };
}

/* ------------------------------------------------------------------ */
/* The menu-shaped opportunity map                                    */
/* ------------------------------------------------------------------ */

/**
 * Six rows: the three computed metrics mapped onto their menu areas (dollar
 * rows sorted largest first; a metric with no gap still gets its row and its
 * verdict, so the no-gap variant is never empty), then the three evidence
 * rows in fixed order.
 */
export function buildOpportunityMap(answers, benchmark, observed) {
  const lines = generateRoiLines(answers, benchmark);
  const lineByKey = Object.fromEntries(lines.map((l) => [l.key, l]));

  const computedRows = [];
  for (const metricKey of ['salesCycle', 'revenuePerEmployee', 'retention']) {
    const area = AREA_BY_METRIC[metricKey];
    const line = lineByKey[metricKey] || null;

    // Distinguish "holds up" from "not tracked" from "hidden for this model".
    let status = 'gap';
    if (!line) {
      if (metricKey === 'retention' && (!answers.q16 || !benchmark.metrics.grr)) continue; // hidden: no row at all
      const input = metricKey === 'salesCycle' ? resolveInput('q15', answers)
        : metricKey === 'retention' ? resolveInput('q16', answers)
        : resolveInput('q1', answers);
      status = input.notTracked ? 'not_tracked' : 'holds';
      if (metricKey === 'salesCycle' && benchmark.metrics.salesCycleDays.median < MIN_RESOLVABLE_CYCLE_DAYS) {
        continue; // a 2-day e-commerce "cycle" is not a coachable gap; no row
      }
    }

    computedRows.push({
      area,
      areaTitle: AREA_TITLES[area],
      metricKey,
      metricTitle: bandTitle(metricKey),
      kind: 'computed',
      status,
      line,
      statusLine: status === 'holds' ? NO_GAP_ROW_LINE : status === 'not_tracked' ? NOT_TRACKED_ROW_LINE : null,
      capNote: line?.capped ? CAP_NOTE : null,
      verdict: verdictFor(area, answers, observed),
      fix: line ? FIX_PARAGRAPHS[metricKey] : null,
      source: line?.source || null,
    });
  }
  // Dollar rows largest first; rows without a dollar line after them.
  computedRows.sort((a, b) => (b.line?.medianDollars ?? -1) - (a.line?.medianDollars ?? -1));

  const deal = resolveInput('q14', answers);
  const leadMetric = benchmark.metrics.leadResponseDays;
  const evidenceRows = [
    {
      area: 'deadLead',
      areaTitle: AREA_TITLES.deadLead,
      kind: 'evidence',
      body: deal.value
        ? deadLeadBody(formatUsd(deal.value), provenancePhrase(deal.exact))
        : DEAD_LEAD_BODY_GENERIC,
      verdict: verdictFor('deadLead', answers, observed),
      fix: FIX_PARAGRAPHS.deadLead,
      source: null,
    },
    {
      area: 'speedToLead',
      areaTitle: AREA_TITLES.speedToLead,
      kind: 'evidence',
      body: speedToLeadBody(benchmark.label, fmtResponseDays(leadMetric?.median)),
      verdict: verdictFor('speedToLead', answers, observed),
      fix: FIX_PARAGRAPHS.leadResponse,
      source: metricCitation(leadMetric),
    },
    {
      area: 'invoiceCollection',
      areaTitle: AREA_TITLES.invoiceCollection,
      kind: 'evidence',
      body: INVOICE_COLLECTION_BODY,
      verdict: verdictFor('invoiceCollection', answers, observed),
      fix: FIX_PARAGRAPHS.invoiceCollection,
      source: null,
    },
  ];

  return {
    rows: [...computedRows, ...evidenceRows],
    roiLines: lines,
    comparisons: generateComparisons(answers, benchmark),
    hasDollarGap: lines.length > 0,
    floorDollars: lines.reduce((s, l) => s + l.floorDollars, 0),
    medianDollars: lines.reduce((s, l) => s + l.medianDollars, 0),
  };
}
