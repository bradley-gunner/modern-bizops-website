/**
 * buildResult(answers) is the orchestrator. Composes ROI lines, stage placement,
 * bright spots, binding-boundary diagnosis, headline, disclosure, and CTA into
 * the Result payload consumed by both the on-screen render and the PDF.
 *
 * Pure function. No I/O.
 */

import { getBusinessModelBenchmark, BUSINESS_MODEL_BENCHMARK_VERSION } from './businessModelBenchmarks';
import { generateRoiLines, generateComparisons } from './roi';
import { stagePlacement, brightSpots, bindingBoundary, blockOf, competencyMaturityIds } from './scoring';
import { getQuestionsFor, QUESTIONS } from './questions';
import {
  STAGE_NAMES,
  STAGE_DESCRIPTORS,
  DISCLOSURE,
  CTA_HEADING,
  CTA_LINES,
  NO_GAP_HEADLINE,
  NO_GAP_BINDING,
  NEXT_STAGE_CRITERIA,
  FIX_PARAGRAPHS,
  CTA_FOCUS_TEMPLATE,
  CTA_GENERIC_LINE,
  formatUsd,
  sanitizeVoice,
} from './voice';
import { LADDER } from '../offers';

// The paid next rung. Destination comes from the ladder so the Scan can never
// point somewhere the rest of the site has moved away from. The route is also a
// key in the Button CTA_DESTINATIONS map, so a click here is tracked.
const AUDIT = LADDER.find((rung) => rung.id === 'audit');

function pruneAnswers(answers) {
  const visible = new Set(getQuestionsFor(answers).map((q) => q.id));
  const out = {};
  for (const id of Object.keys(answers)) {
    if (visible.has(id)) out[id] = answers[id];
  }
  return out;
}

function defaultBindingTranslation(binding) {
  if (!binding || binding.questions.length === 0) return '';
  const [first, second] = binding.questions;
  const labels = second
    ? `your ${first.competencyLabel} and your ${second.competencyLabel}`
    : `your ${first.competencyLabel}`;
  return sanitizeVoice(
    `What you told us about ${labels} is the bottleneck that shows up in the dollar gaps above.`
  );
}

function buildHeadline(roiLines, modelLabel) {
  if (roiLines.length === 0) {
    return {
      lead: NO_GAP_HEADLINE.lead.replaceAll('{model_label}', modelLabel),
      subline: NO_GAP_HEADLINE.subline,
      floorDollars: 0,
      medianDollars: 0,
      modelLabel,
    };
  }
  const floor = roiLines.reduce((s, l) => s + l.floorDollars, 0);
  const median = roiLines.reduce((s, l) => s + l.medianDollars, 0);
  return {
    lead: sanitizeVoice(`Your operating system is leaving between ${formatUsd(floor)} and ${formatUsd(median)} on the table this year.`),
    subline: sanitizeVoice(`That is the gap between where you sit today and where ${modelLabel} peers in your revenue range operate. The conservative read is ${formatUsd(floor)} per year. The peer-median read is closer to ${formatUsd(median)}. Here is exactly how we got there.`),
    floorDollars: floor,
    medianDollars: median,
    modelLabel,
  };
}

function buildCompetencyScores(answers) {
  return competencyMaturityIds().map((id) => {
    const q = QUESTIONS.find((x) => x.id === id);
    return {
      id,
      competencyLabel: q?.competencyLabel,
      score: answers[id]?.score ?? 0,
      block: blockOf(id),
    };
  });
}

function buildNextStage(placement) {
  return NEXT_STAGE_CRITERIA[placement] || null;
}

function attachFixes(roiLines) {
  return roiLines.map((line) => ({
    ...line,
    fix: FIX_PARAGRAPHS[line.key] || '',
  }));
}

function buildCta(binding) {
  const focus = binding?.questions?.[0]?.competencyLabel || null;
  const focusLine = focus ? CTA_FOCUS_TEMPLATE(focus) : CTA_GENERIC_LINE;
  return {
    destination: AUDIT.href,
    heading: CTA_HEADING,
    cardLines: CTA_LINES,
    buttonLabel: `See the ${AUDIT.name}`,
    focus,
    focusLine,
  };
}

export function buildResult(rawAnswers, { generatedAt = new Date().toISOString() } = {}) {
  const answers = pruneAnswers(rawAnswers);
  const benchmark = getBusinessModelBenchmark(answers.q2?.value);
  const roiLinesRaw = generateRoiLines(answers, benchmark);
  const roiLines = attachFixes(roiLinesRaw);
  const comparisons = generateComparisons(answers, benchmark);
  const placement = stagePlacement(answers);
  const binding = bindingBoundary(answers, placement);
  const bindingIds = binding?.questions?.map((q) => q.id) ?? [];
  const spots = brightSpots(answers, placement, bindingIds);
  const translation = roiLines.length === 0
    ? NO_GAP_BINDING(binding)
    : defaultBindingTranslation(binding);

  return {
    headline: buildHeadline(roiLines, benchmark.label),
    roiLines,
    comparisons,
    placement: {
      stage: placement,
      name: STAGE_NAMES[placement],
      descriptor: STAGE_DESCRIPTORS[placement],
    },
    nextStage: buildNextStage(placement),
    competencyScores: buildCompetencyScores(answers),
    binding: binding ? { ...binding, translation } : null,
    brightSpots: spots,
    disclosure: DISCLOSURE,
    cta: buildCta(binding),
    modelLabel: benchmark.label,
    benchmarkVersion: BUSINESS_MODEL_BENCHMARK_VERSION,
    generatedAt,
  };
}
