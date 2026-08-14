/**
 * AI Readiness scoring: the composite band, the three dimension scores, the
 * burned-attempt flag, and the weakest-signal ranking that feeds the
 * why-it-did-not-stick and first-move blocks.
 *
 * The 2026-08 rebuild retired the stage-placement machinery (Blocks A/B/C,
 * bright spots, binding boundary) with the nine RevOps questions it was
 * computed from. The stage now lives where it is computed: in the audit.
 *
 * Scale is 1..5 (Absent, Informal, Functional, Managed, Optimized), matching
 * the audit's rubric anchors, so a Scan taker's 3 means what an audit
 * client's 3 means.
 *
 * The composite is the mean of q5..q13 ONLY. q4 (the belief probe) is scored
 * but deliberately excluded: it exists to be contrasted with the Data
 * Readiness score the audit computes, not to move the band.
 *
 * Bands are provisional by design and recalibrate against real audit clients;
 * the copy never presents them as calibrated (doc 15, decided 2026-08-14).
 */

import { DIMENSIONS, isBurnedAttempt } from './questions';

export const COMPOSITE_IDS = DIMENSIONS.flatMap((d) => d.ids);

/** Band edges over the 1..5 composite. `min` is inclusive; bands are checked
 *  top down, so a composite below every min lands in the bottom band. */
export const READINESS_BANDS = [
  { key: 'ready_to_build',    name: 'Ready to Build',    min: 4.0 },
  { key: 'ready_in_parts',    name: 'Ready in Parts',    min: 3.0 },
  { key: 'foundations_first', name: 'Foundations First', min: 2.0 },
  { key: 'not_ready_yet',     name: 'Not Ready Yet',     min: 0 },
];

function scoreOf(answers, id) {
  return answers?.[id]?.score ?? 0;
}

function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

/** Mean of the nine dimension questions, rounded to one decimal so the same
 *  figure renders everywhere (screen, PDF, HubSpot) without re-rounding. */
export function compositeScore(answers) {
  return Math.round(mean(COMPOSITE_IDS.map((id) => scoreOf(answers, id))) * 10) / 10;
}

export function readinessBand(composite) {
  return READINESS_BANDS.find((b) => composite >= b.min) || READINESS_BANDS[READINESS_BANDS.length - 1];
}

/** Clamp a mean onto the 1..5 level-word scale. */
export function levelOf(score) {
  return Math.min(5, Math.max(1, Math.round(score)));
}

/**
 * Per-dimension read: key, label, the three question scores, their mean
 * (one decimal), and the rounded 1..5 level for the level word.
 */
export function dimensionScores(answers) {
  return DIMENSIONS.map((d) => {
    const scores = d.ids.map((id) => scoreOf(answers, id));
    const m = Math.round(mean(scores) * 10) / 10;
    return { key: d.key, label: d.label, ids: d.ids, scores, mean: m, level: levelOf(m) };
  });
}

/** Lowest-mean dimension; ties break in DIMENSIONS order (strategy, people,
 *  governance), which keeps the selection deterministic. */
export function weakestDimension(answers) {
  const dims = dimensionScores(answers);
  return dims.reduce((weakest, d) => (d.mean < weakest.mean ? d : weakest), dims[0]);
}

/**
 * The individual dimension questions ranked weakest first, for the
 * why-it-did-not-stick reasons and the first-move template pick. Ties break in
 * question order. `threshold` keeps the list to genuinely weak signals.
 */
export function weakestSignals(answers, { threshold = 2, max = 3 } = {}) {
  return COMPOSITE_IDS
    .map((id) => ({ id, score: scoreOf(answers, id) }))
    .filter((s) => s.score > 0 && s.score <= threshold)
    .sort((a, b) => a.score - b.score)
    .slice(0, max);
}

export { isBurnedAttempt };
